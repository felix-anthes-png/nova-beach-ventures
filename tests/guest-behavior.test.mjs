import test from "node:test";
import assert from "node:assert/strict";
import { createRun, placeFacility, guestDestinationOptions, applyGuestNeedRelief, recordGuestActivity } from "../dist/core.js";

function fundedRun(){const run=createRun();run.cash=100000;return run;}

test("a thirsty guest prioritizes a placed water fountain",()=>{
  const run=placeFacility(fundedRun(),"water",12,19);
  const options=guestDestinationOptions(run,{hunger:5,thirst:95,bladder:5,energy:8,mood:10},1);
  assert.equal(options[0].kind,"facility");
  assert.equal(options[0].type,"water");
});

test("closed or empty stores are not offered as guest destinations",()=>{
  const run=createRun();
  assert.equal(guestDestinationOptions(run,{hunger:100,thirst:100,energy:100,mood:10},2).some(option=>option.kind==="store"),false);
  run.stock.coldBrew=2;
  assert.equal(guestDestinationOptions(run,{hunger:100,thirst:100,energy:100,mood:10},2).some(option=>option.id==="cafe"),true);
});

test("guests only consider products they can afford",()=>{
  const run=createRun();
  run.stock.coldBrew=3;
  run.prices.coldBrew=400;
  const profile={needs:{hunger:90,thirst:70,energy:80,mood:20},budget:399,queuePatience:60,preferences:{food:.8,drinks:.8}};
  assert.equal(guestDestinationOptions(run,profile,2).some(option=>option.id==="cafe"),false);
  profile.budget=400;
  assert.equal(guestDestinationOptions(run,profile,2).some(option=>option.id==="cafe"),true);
});

test("higher prices reduce a store's appeal",()=>{
  const run=createRun();
  run.stock.coldBrew=3;
  const profile={needs:{hunger:70,thirst:70,energy:65,mood:20},budget:1000,queuePatience:60,preferences:{food:.7,drinks:.8}};
  run.prices.coldBrew=400;
  const fairScore=guestDestinationOptions(run,profile,3).find(option=>option.id==="cafe").score;
  run.prices.coldBrew=800;
  const expensiveScore=guestDestinationOptions(run,profile,3).find(option=>option.id==="cafe").score;
  assert.ok(fairScore>expensiveScore);
});

test("queues deter impatient guests more strongly",()=>{
  const run=createRun();
  run.stock.coldBrew=3;
  const base={needs:{hunger:75,thirst:70,energy:70,mood:25},budget:1000,preferences:{food:.7,drinks:.8}};
  const context={campusQuality:60,queues:{"store:cafe":4}};
  const impatient=guestDestinationOptions(run,{...base,queuePatience:20},4,context).find(option=>option.id==="cafe").score;
  const patient=guestDestinationOptions(run,{...base,queuePatience:95},4,context).find(option=>option.id==="cafe").score;
  assert.ok(patient>impatient);
});

test("personal preferences change which store is most attractive",()=>{
  const run=createRun();
  run.venues.merch=1;
  run.stock.coldBrew=3;
  run.stock.tote=3;
  const needs={hunger:35,thirst:35,energy:30,mood:55};
  const foodie=guestDestinationOptions(run,{needs,budget:2000,queuePatience:70,preferences:{food:1,drinks:1,shopping:0}},5);
  const shopper=guestDestinationOptions(run,{needs,budget:2000,queuePatience:70,preferences:{food:0,drinks:0,shopping:1}},5);
  assert.ok(foodie.find(option=>option.id==="cafe").score>foodie.find(option=>option.id==="merch").score);
  assert.ok(shopper.find(option=>option.id==="merch").score>shopper.find(option=>option.id==="cafe").score);
});

test("campus quality makes destinations more attractive",()=>{
  const run=createRun();
  run.stock.coldBrew=3;
  const profile={needs:{hunger:60,thirst:60,energy:60,mood:30},budget:1000,queuePatience:60,preferences:{food:.5,drinks:.5}};
  const weak=guestDestinationOptions(run,profile,6,{campusQuality:20}).find(option=>option.id==="cafe").score;
  const excellent=guestDestinationOptions(run,profile,6,{campusQuality:90}).find(option=>option.id==="cafe").score;
  assert.ok(excellent>weak);
});

test("using an amenity relieves the matching personal need",()=>{
  const needs=applyGuestNeedRelief({hunger:40,thirst:92,bladder:10,energy:30,mood:30},"water");
  assert.equal(needs.thirst,22);
  assert.equal(needs.hunger,40);
});

test("guest interactions are recorded by day and facility",()=>{
  const run=placeFacility(fundedRun(),"bench",9,19),facility=run.facilities[0];
  const next=recordGuestActivity(run,{kind:"facility",id:facility.id,type:"bench",label:facility.name});
  assert.equal(next.today.activities[`facility:${facility.id}`],1);
  assert.equal(next.facilityUsage[facility.id],1);
  assert.equal(next.totalCampusInteractions,1);
});
