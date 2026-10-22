import test from "node:test";
import assert from "node:assert/strict";
import {
  DAY_START,
  addOperationsIssue,
  createRun,
  managementOverview,
  placeFacility
} from "../dist/core.js";

test("management overview starts with an actionable commercial warning",()=>{
  const overview=managementOverview(createRun());
  assert.equal(overview.phase.id,"arrival");
  assert.equal(overview.stores.find(store=>store.id==="cafe").status,"open");
  assert.equal(overview.stores.find(store=>store.id==="cafe").stockCoverage,0);
  assert.ok(overview.alerts.some(alert=>alert.action==="stock"));
});

test("commercial overlay data reconciles stock and today's margin",()=>{
  const run=createRun();run.stock.coldBrew=8;run.today.products.coldBrew={unitsSold:2,revenue:800,cogs:400};
  const cafe=managementOverview(run).stores.find(store=>store.id==="cafe");
  assert.equal(cafe.stockUnits,8);
  assert.equal(cafe.stockCoverage,100);
  assert.equal(cafe.revenue,800);
  assert.equal(cafe.grossProfit,400);
});

test("store operating state follows opening hours",()=>{
  const run=createRun();run.clockMinutes=DAY_START-1;
  assert.equal(managementOverview(run).stores.find(store=>store.id==="cafe").status,"closed");
});

test("needs overlay ranks the weakest campus need first",()=>{
  let run=createRun();const before=managementOverview(run).weakestNeeds;
  run.cash=100000;run=placeFacility(run,"water",12,20);
  const after=managementOverview(run).weakestNeeds;
  assert.equal(before[0].id,"thirst");
  assert.ok(!after.some(need=>need.id==="thirst")||after.find(need=>need.id==="thirst").value>before[0].value);
});

test("operations overlay exposes district work orders and cleanliness",()=>{
  let run=createRun();run=addOperationsIssue(run,"litter","coast");
  const coast=managementOverview(run).districts.find(district=>district.id==="coast");
  assert.equal(coast.issues,1);
  assert.equal(coast.litter,1);
  assert.ok(coast.cleanliness<94);
});

test("locked stores stay visible to management without being treated as open",()=>{
  const overview=managementOverview(createRun()),merch=overview.stores.find(store=>store.id==="merch");
  assert.equal(merch.status,"locked");
  assert.equal(merch.open,false);
  assert.equal(merch.dailyCost,0);
});
