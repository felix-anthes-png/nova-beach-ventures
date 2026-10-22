import test from "node:test";
import assert from "node:assert/strict";
import {
  DAY_END,
  DAY_START,
  createRun,
  advanceTycoon,
  dailyOperatingCosts,
  demandFor,
  setStoreHours,
  settleOperatingCosts,
  storeOperatingCost,
  tycoonPulse,
  upgradeVenue,
  venueServiceMultiplier
} from "../dist/core.js";

test("a new company starts with neutral momentum and visible operating costs",()=>{
  const run=createRun(),pulse=tycoonPulse(run),costs=dailyOperatingCosts(run);
  assert.equal(pulse.momentum,50);
  assert.equal(pulse.momentumFactor,1);
  assert.equal(costs.stores.length,1);
  assert.ok(costs.total>0);
  assert.equal(pulse.costs.total,costs.total);
});

test("venue upgrades trade higher throughput for higher daily overhead",()=>{
  let run=createRun();run.cash=100000;
  const baseCost=storeOperatingCost(run,"cafe"),baseSpeed=venueServiceMultiplier(run,"cafe");
  run=upgradeVenue(run,"cafe");
  assert.ok(storeOperatingCost(run,"cafe")>baseCost);
  assert.ok(venueServiceMultiplier(run,"cafe")>baseSpeed);
  const longDay=storeOperatingCost(run,"cafe");
  run=setStoreHours(run,"cafe",600,720);
  assert.ok(storeOperatingCost(run,"cafe")<longDay);
});

test("the original price demand boundaries remain unchanged",()=>{
  assert.deepEqual([400,401,800,801].map(price=>demandFor(price,400)),[10,5,5,0]);
});

test("day close records overhead and explains a momentum loss",()=>{
  let run=createRun(),cost=dailyOperatingCosts(run).total;
  run=advanceTycoon(run,DAY_END-DAY_START);
  const day=run.history[0];
  assert.equal(day.totals.operatingCosts,cost);
  assert.equal(day.totals.operatingProfit,day.totals.grossProfit-cost);
  assert.ok(day.performance.change<0);
  assert.equal(run.performance.momentum,day.performance.after);
  assert.ok(day.performance.drivers.some(driver=>driver.label.includes("Operating loss")));
});

test("a well-stocked profitable day creates positive attendance momentum",()=>{
  let run=createRun();run.cash=100000;run.stock.coldBrew=10;run.today.revenue=5000;run.today.cogs=800;run.today.unitsSold=8;run.today.products.coldBrew={unitsSold:8,revenue:5000,cogs:800};
  run=advanceTycoon(run,DAY_END-DAY_START);
  assert.ok(run.history[0].totals.operatingProfit>0);
  assert.ok(run.history[0].performance.change>0);
  assert.ok(run.performance.momentum>50);
  assert.ok(tycoonPulse(run).momentumFactor>1);
});

test("control-room alerts identify stock and price pressure",()=>{
  const run=createRun();run.prices.coldBrew=801;
  const pulse=tycoonPulse(run);
  assert.ok(pulse.alerts.some(alert=>alert.action==="stock"));
  assert.ok(pulse.alerts.some(alert=>alert.action==="stores"));
});

test("unpaid campus bills never make cash negative and can be settled",()=>{
  let run=createRun();run.cash=0;
  run=advanceTycoon(run,DAY_END-DAY_START);
  assert.equal(run.cash,0);
  assert.ok(run.performance.operatingDue>0);
  const due=run.performance.operatingDue;run.cash=50;run=settleOperatingCosts(run);
  assert.equal(run.cash,0);
  assert.equal(run.performance.operatingDue,due-50);
});
