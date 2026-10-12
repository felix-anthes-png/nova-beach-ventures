import test from "node:test";
import assert from "node:assert/strict";
import { createRun, facilityFootprint, placeFacility, moveFacility, demolishFacility } from "../dist/core.js";

function fundedRun(){const run=createRun();run.cash=100000;return run;}

test("facility footprints rotate by quarter turns",()=>{
  assert.deepEqual(facilityFootprint("bench",0),{width:1.8,height:.8});
  assert.deepEqual(facilityFootprint("bench",1),{width:.8,height:1.8});
  assert.deepEqual(facilityFootprint("bench",5),{width:.8,height:1.8});
});

test("placement stores rotation and rejects overlapping footprints",()=>{
  const placed=placeFacility(fundedRun(),"restroom",10,18,[],1);
  assert.equal(placed.facilities[0].rotation,1);
  assert.throws(()=>placeFacility(placed,"bench",10.5,18,[],0),/overlaps another facility/);
});

test("moving a facility keeps cash unchanged and respects collisions",()=>{
  let run=placeFacility(fundedRun(),"bench",8,19,[],0);
  run=placeFacility(run,"water",12,19,[],0);
  const cash=run.cash,bench=run.facilities.find(item=>item.type==="bench");
  const moved=moveFacility(run,bench.id,9,20,1);
  assert.equal(moved.cash,cash);
  assert.equal(moved.facilities.find(item=>item.id===bench.id).rotation,1);
  assert.throws(()=>moveFacility(moved,bench.id,12,19,0),/overlaps another facility/);
});

test("demolition removes one facility and returns forty percent salvage",()=>{
  const placed=placeFacility(fundedRun(),"restroom",10,18);
  const facility=placed.facilities[0],cash=placed.cash;
  const demolished=demolishFacility(placed,facility.id);
  assert.equal(demolished.facilities.length,0);
  assert.equal(demolished.cash,cash+640);
  assert.equal(demolished.demolitions[0].refund,640);
});
