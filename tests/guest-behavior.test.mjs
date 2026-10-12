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
