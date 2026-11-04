import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { BUSINESS_ACTIVITY_TYPES, businessActivityState } from "../dist/business-activity.js";

test("the requested business types have distinct activity identities",()=>{
  assert.deepEqual(new Set(Object.values(BUSINESS_ACTIVITY_TYPES)),new Set(["bakery","gym","padel","laundry","restaurant","surf-rental","parking","conference"]));
});

test("a business only operates with capacity and without a breakdown",()=>{
  assert.equal(businessActivityState({businessId:"transit-bakery",stock:4}).open,true);
  assert.equal(businessActivityState({businessId:"transit-bakery",stock:0}).open,false);
  assert.equal(businessActivityState({businessId:"transit-bakery",stock:4,broken:true}).open,false);
});

test("real guests and queues control visible activity intensity",()=>{
  const idle=businessActivityState({businessId:"sports-padel",stock:5});
  const busy=businessActivityState({businessId:"sports-padel",stock:5,activeGuests:2,queuedGuests:2});
  assert.equal(idle.running,false);assert.equal(busy.running,true);assert.equal(busy.intensity,3);assert.equal(busy.occupied,2);
});

test("business animation state exposes a stable campaign-time phase",()=>{
  assert.equal(businessActivityState({businessId:"village-laundry",stock:3,clockMinutes:615}).phase,.25);
});

test("the world renderer contains all eight authored activity scenes",async()=>{
  const app=await readFile(new URL("../dist/app.js",import.meta.url),"utf8");
  for(const renderer of ["drawBakeryActivity","drawGymActivity","drawPadelActivity","drawLaundryActivity","drawRestaurantActivity","drawSurfRentalActivity","drawParkingActivity","drawConferenceActivity"])assert.match(app,new RegExp(`function ${renderer}\\(`));
  assert.match(app,/drawBusinessActivity\(business,x,y,w,h,lastTime\)/);
});
