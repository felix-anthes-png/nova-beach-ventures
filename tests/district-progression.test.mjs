import test from "node:test";
import assert from "node:assert/strict";
import {
  DISTRICT_CATALOGUE,
  DISTRICT_BUSINESSES,
  createRun,
  unlockDistrict,
  unlockDistrictBusiness,
  districtPortfolio,
  districtWeather,
  guestGroupMix,
  guestDestinationOptions,
  advanceTycoon,
  migrateStaffOperations
} from "../dist/core.js";
import { readFile } from "node:fs/promises";

function fundedRun(sales=150){const run=createRun();run.cash=1000000;run.totalSales=sales;return run;}

test("the Academic Core starts alone and five expansion districts remain visible",()=>{
  const run=createRun();
  assert.equal(run.districts.coast,1);
  assert.equal(DISTRICT_CATALOGUE.length,5);
  assert.equal(DISTRICT_CATALOGUE.every(district=>run.districts[district.id]===0),true);
  assert.equal(DISTRICT_BUSINESSES.length,25);
});

test("district acquisition enforces level and portfolio prerequisites",()=>{
  const starter=fundedRun(0);
  assert.throws(()=>unlockDistrict(starter,"village"),/level 3/i);
  let run=fundedRun();
  assert.throws(()=>unlockDistrict(run,"innovation"),/Student Village/i);
  run=unlockDistrict(run,"village");
  run=unlockDistrict(run,"innovation");
  assert.equal(run.districts.innovation,1);
  assert.equal(run.cash,902000);
});

test("business purchases are atomic and contribute income and upkeep",()=>{
  let run=fundedRun();run=unlockDistrict(run,"village");
  const before=run.cash;run=unlockDistrictBusiness(run,"village-market");
  assert.equal(run.cash,before-12000);
  assert.equal(run.districtBusinesses["village-market"],1);
  const profile=districtPortfolio(run).districts.find(district=>district.id==="village");
  assert.equal(profile.built,1);assert.ok(profile.projectedIncome>0);assert.equal(profile.upkeep,90);
  const snapshot=structuredClone(run);assert.throws(()=>unlockDistrictBusiness(run,"village-market"),/already operating/i);assert.deepEqual(run,snapshot);
});

test("new districts introduce their own guest cohorts",()=>{
  const run=createRun(),before=guestGroupMix(run,1080).find(group=>group.groupId==="resident");
  assert.equal(before.share,0);
  run.districts.village=1;run.districts.innovation=1;run.districts.sports=1;run.districts.transit=1;
  const mix=guestGroupMix(run,1080);
  assert.ok(mix.find(group=>group.groupId==="resident").share>0);
  assert.ok(mix.find(group=>group.groupId==="founder").share>0);
  assert.ok(mix.find(group=>group.groupId==="athlete").share>0);
  assert.ok(mix.find(group=>group.groupId==="commuter").share>0);
});

test("guests can physically choose an operating district business",()=>{
  const run=createRun();run.districts.village=1;run.districtBusinesses["village-market"]=1;
  const options=guestDestinationOptions(run,{groupId:"resident",needs:{hunger:50,thirst:40,bladder:20,energy:30,mood:45},budget:4000,queuePatience:70,preferences:{social:.7,calm:.5,excitement:.3,food:.6,drinks:.5,shopping:.8}},3);
  const market=options.find(option=>option.id==="village-market");assert.equal(market.kind,"district-business");assert.match(market.reason,/visitor group/);
});

test("Beachfront performance responds to deterministic coastal weather",()=>{
  const run=fundedRun();run.districts.east=1;run.districtBusinesses["beach-icecream"]=1;
  const values=[];for(let day=1;day<=8;day++){run.currentDay=day;values.push({weather:districtWeather(run).id,income:districtPortfolio(run).districts.find(district=>district.id==="east").projectedIncome});}
  const clear=values.find(row=>row.weather==="clear"),rain=values.find(row=>row.weather==="rain");
  assert.ok(clear.income>rain.income);
});

test("district income is recorded once when a day closes",()=>{
  const run=fundedRun();run.districts.village=1;run.districtBusinesses["village-market"]=1;run.clockMinutes=1169;
  const closed=advanceTycoon(run,2),day=closed.history.at(-1);
  assert.equal(closed.currentDay,2);assert.ok(day.totals.districtRevenue>0);assert.equal(day.districts.find(district=>district.id==="village").built,1);
});

test("version eight campaigns migrate without losing their original land",()=>{
  const run=createRun();run.version=8;run.districts={coast:1,east:1,pier:1};delete run.districtBusinesses;delete run.districtBusinessHistory;
  const migrated=migrateStaffOperations(run);
  assert.equal(migrated.version,9);assert.equal(migrated.districts.east,1);assert.equal(migrated.districts.village,0);assert.deepEqual(migrated.districtBusinesses,{});
});

test("the browser exposes the district portfolio and business construction flow",async()=>{
  const [app,html,css]=await Promise.all([readFile(new URL("../dist/app.js",import.meta.url),"utf8"),readFile(new URL("../dist/index.html",import.meta.url),"utf8"),readFile(new URL("../dist/district-progression.css",import.meta.url),"utf8")]);
  assert.match(app,/Six economies, six operating problems/);assert.match(app,/data-buy-business/);assert.match(app,/DISTRICT_WORLD_LAYOUTS/);assert.match(html,/district-progression\.css\?v=37-district-progression/);assert.match(css,/district-business-grid/);
});
