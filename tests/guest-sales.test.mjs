import test from "node:test";
import assert from "node:assert/strict";
import { DAY_END, createRun, completeGuestSale, guestDestinationOptions, advanceTycoon } from "../dist/core.js";

function stockedRun(quantity=2){const run=createRun();run.stock.coldBrew=quantity;return run;}

test("a served guest creates one complete and reconcilable shop transaction",()=>{
  const run=stockedRun(),next=completeGuestSale(run,"coldBrew",900,17,"2026-10-21T10:00:00.000Z");
  assert.equal(next.stock.coldBrew,1);
  assert.equal(next.cash,10400);
  assert.deepEqual(next.today.products.coldBrew,{unitsSold:1,revenue:400,cogs:200});
  assert.equal(next.today.revenue,400);
  assert.equal(next.today.cogs,200);
  assert.equal(next.today.unitsSold,1);
  assert.equal(next.totalSales,1);
  assert.deepEqual(next.guestEconomy,{purchases:1,spend:400,walkaways:0});
  assert.equal(next.venueVisits.cafe,1);
  assert.equal(next.today.activities["store:cafe"],1);
  assert.deepEqual(next.guestSales[0],{id:"sale-1-1",at:"2026-10-21T10:00:00.000Z",day:1,minute:450,guestId:17,storeId:"cafe",productId:"coldBrew",price:400,revenue:400,cogs:200,grossProfit:200});
  assert.equal(run.stock.coldBrew,2);
});

test("stock limits visible purchases and a rejected second sale changes nothing",()=>{
  const sold=completeGuestSale(stockedRun(1),"coldBrew",400,1),snapshot=structuredClone(sold);
  assert.equal(sold.stock.coldBrew,0);
  assert.throws(()=>completeGuestSale(sold,"coldBrew",400,2),/out of stock/);
  assert.deepEqual(sold,snapshot);
});

test("unaffordable, closed, and zero-demand purchases are atomic",()=>{
  const run=stockedRun(),snapshot=structuredClone(run);
  assert.throws(()=>completeGuestSale(run,"coldBrew",399),/cannot afford/);
  run.clockMinutes=1100;
  assert.throws(()=>completeGuestSale(run,"coldBrew",1000),/closed/);
  run.clockMinutes=450;run.prices.coldBrew=801;
  assert.throws(()=>completeGuestSale(run,"coldBrew",1000),/demand range/);
  run.clockMinutes=snapshot.clockMinutes;run.prices.coldBrew=snapshot.prices.coldBrew;
  assert.deepEqual(run,snapshot);
});

test("visible guest choices preserve the 10, 5, and 0 demand boundaries",()=>{
  const run=stockedRun(20),profile={needs:{hunger:90,thirst:70,energy:90,mood:20},budget:2000};
  const offersAt=price=>{run.prices.coldBrew=price;return Array.from({length:10},(_,seed)=>guestDestinationOptions(run,profile,seed).some(option=>option.productId==="coldBrew")).filter(Boolean).length;};
  assert.equal(offersAt(400),10);
  assert.equal(offersAt(401),5);
  assert.equal(offersAt(800),5);
  assert.equal(offersAt(801),0);
});

test("visible service cannot exceed the product's daily demand",()=>{
  let run=stockedRun(20);
  for(let guest=0;guest<10;guest++)run=completeGuestSale(run,"coldBrew",400,guest);
  const snapshot=structuredClone(run);
  assert.equal(run.today.unitsSold,10);
  assert.throws(()=>completeGuestSale(run,"coldBrew",400,11),/demand.*served/);
  assert.deepEqual(run,snapshot);
  assert.equal(guestDestinationOptions(run,{needs:{hunger:100,energy:100},budget:400},0).some(option=>option.id==="cafe"),false);
});

test("time progression never creates invisible shop sales",()=>{
  const run=stockedRun(20),next=advanceTycoon(run,360);
  assert.equal(next.stock.coldBrew,20);
  assert.equal(next.cash,run.cash);
  assert.equal(next.totalSales,0);
  assert.equal(next.today.unitsSold,0);
  assert.ok(next.today.visitors>0);
});

test("a saved sale closes into one daily report and is not replayed",()=>{
  let run=completeGuestSale(stockedRun(1),"coldBrew",400,7);
  run=JSON.parse(JSON.stringify(run));
  run=advanceTycoon(run,DAY_END-run.clockMinutes);
  assert.equal(run.history.length,1);
  assert.equal(run.history[0].totals.unitsSold,1);
  assert.equal(run.history[0].totals.revenue,400);
  assert.equal(run.history[0].totals.cogs,200);
  assert.equal(run.history[0].totals.grossProfit,200);
  const afterClose=structuredClone(run);
  run=advanceTycoon(run,30);
  assert.equal(run.totalSales,afterClose.totalSales);
  assert.equal(run.cash,afterClose.cash);
  assert.equal(run.history.length,1);
});
