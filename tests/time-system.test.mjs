import test from "node:test";
import assert from "node:assert/strict";
import {
  DAY_START,
  DAY_END,
  createRun,
  campusPhase,
  storeIsOpen,
  setStoreHours,
  scheduleDelivery,
  advanceTycoon,
  guestDestinationOptions,
  completeGuestSale
} from "../dist/core.js";

test("the campus timetable changes cleanly at every boundary",()=>{
  assert.equal(campusPhase(450).id,"arrival");
  assert.equal(campusPhase(569).id,"arrival");
  assert.equal(campusPhase(570).id,"lecture-am");
  assert.equal(campusPhase(690).id,"lunch");
  assert.equal(campusPhase(840).id,"lecture-pm");
  assert.equal(campusPhase(990).id,"break");
  assert.equal(campusPhase(1050).id,"sunset");
});

test("store opening hours gate guest decisions and completed sales",()=>{
  let run=createRun();
  run.stock.coldBrew=50;
  run=setStoreHours(run,"cafe",600,900);
  assert.equal(storeIsOpen(run,"cafe",599),false);
  assert.equal(storeIsOpen(run,"cafe",600),true);
  assert.equal(guestDestinationOptions(run,{needs:{hunger:90,energy:90},budget:1000},1).some(option=>option.id==="cafe"),false);
  const before=run.stock.coldBrew;
  run=advanceTycoon(run,100);
  assert.equal(run.stock.coldBrew,before);
  assert.throws(()=>completeGuestSale(run,"coldBrew",1000),/closed/);
  run=advanceTycoon(run,300);
  run=completeGuestSale(run,"coldBrew",1000);
  assert.equal(run.stock.coldBrew,before-1);
  assert.throws(()=>setStoreHours(run,"cafe",700,760),/at least two hours/);
});

test("paid stock orders arrive only at their scheduled delivery window",()=>{
  let run=createRun();
  run=scheduleDelivery(run,"coldBrew",10);
  assert.equal(run.cash,8000);
  assert.equal(run.stock.coldBrew,0);
  assert.equal(run.deliveries[0].arrivalMinute,495);
  run=advanceTycoon(run,44);
  assert.equal(run.stock.coldBrew,0);
  run=advanceTycoon(run,2);
  assert.ok(run.stock.coldBrew>0&&run.stock.coldBrew<=10);
  assert.equal(run.deliveries[0].status,"delivered");
  assert.equal(run.today.deliveries.length,1);
});

test("late orders roll into the next morning delivery",()=>{
  let run=createRun();
  run.clockMinutes=972;
  run=scheduleDelivery(run,"coldBrew",1);
  assert.equal(run.deliveries[0].arrivalDay,2);
  assert.equal(run.deliveries[0].arrivalMinute,495);
});

test("day close records a report and immediately continues the campaign",()=>{
  let run=createRun();
  run.stock.coldBrew=20;
  run=advanceTycoon(run,DAY_END-DAY_START);
  assert.equal(run.currentDay,2);
  assert.equal(run.clockMinutes,DAY_START);
  assert.equal(run.completed,false);
  assert.equal(run.history.length,1);
  assert.equal(run.history[0].day,1);
  assert.ok(Number.isFinite(run.history[0].totals.grossProfit));
});
