import test from "node:test";
import assert from "node:assert/strict";
import {
  DAY_END,
  DAY_START,
  createRun,
  hireStaff,
  assignStaff,
  setStaffShift,
  staffDailyWage,
  activeStaffCount,
  addOperationsIssue,
  assetIsClosed,
  advanceTycoon,
  dailyOperatingCosts,
  migrateStaffOperations
} from "../dist/core.js";

function fundedRun(sales=20){const run=createRun();run.cash=500000;run.totalSales=sales;return run;}

test("hiring creates an individual employee with a daily wage",()=>{
  const run=hireStaff(fundedRun(),"caretaker","2026-10-21T09:00:00.000Z"),worker=run.staffRoster[0];
  assert.equal(run.staff.caretaker,1);
  assert.equal(worker.roleId,"caretaker");
  assert.equal(worker.districtId,"coast");
  assert.equal(worker.shiftId,"full");
  assert.equal(staffDailyWage(worker),320);
  assert.equal(run.cash,499000);
});

test("district and shift assignments control when a worker is active",()=>{
  let run=fundedRun();run.districts.east=1;
  run=hireStaff(run,"service");const worker=run.staffRoster[0];
  run=assignStaff(run,worker.id,"east");run=setStaffShift(run,worker.id,"late");
  assert.equal(activeStaffCount(run,"service","east",809),0);
  assert.equal(activeStaffCount(run,"service","east",810),1);
  assert.equal(activeStaffCount(run,"service","coast",810),0);
});

test("an assigned caretaker clears litter through simulated work time",()=>{
  let run=hireStaff(fundedRun(),"caretaker");run=addOperationsIssue(run,"litter","coast");
  const issueId=run.operations.issues[0].id;
  run=advanceTycoon(run,45);
  assert.equal(run.operations.issues.some(issue=>issue.id===issueId),false);
  assert.equal(run.operations.history.some(issue=>issue.id===issueId),true);
  assert.equal(run.operations.totalIssuesResolved,1);
  assert.equal(run.today.issuesResolved,1);
});

test("a breakdown closes a store until a district technician repairs it",()=>{
  let run=hireStaff(fundedRun(),"technician");run=addOperationsIssue(run,"breakdown","coast","store","cafe");
  assert.equal(assetIsClosed(run,"store","cafe"),true);
  run=advanceTycoon(run,89);
  assert.equal(assetIsClosed(run,"store","cafe"),true);
  run=advanceTycoon(run,1);
  assert.equal(assetIsClosed(run,"store","cafe"),false);
});

test("day close charges wages once and records operating profit",()=>{
  let run=hireStaff(fundedRun(),"service"),afterRecruitment=run.cash;
  const overhead=dailyOperatingCosts(run).total;
  run=advanceTycoon(run,DAY_END-DAY_START);
  assert.equal(run.cash,afterRecruitment-360-overhead);
  assert.equal(run.history[0].totals.staffWages,360);
  assert.equal(run.history[0].totals.staffWagesPaid,360);
  assert.equal(run.history[0].totals.operatingCosts,overhead);
  assert.equal(run.history[0].totals.operatingProfit,run.history[0].totals.grossProfit-360-overhead);
});

test("unaffordable payroll never makes cash negative and pauses the team",()=>{
  let run=hireStaff(fundedRun(),"service");run.cash=100;
  run=advanceTycoon(run,DAY_END-DAY_START);
  assert.equal(run.cash,0);
  assert.equal(run.operations.payrollDue,260);
  assert.equal(activeStaffCount(run,"service","coast",DAY_START),0);
  run=advanceTycoon(run,DAY_END-DAY_START);
  assert.equal(run.operations.payrollDue,260);
});

test("legacy staff counts migrate exactly once into the roster",()=>{
  const run=createRun();run.version=3;run.staff={service:0,caretaker:2,technician:1,host:0,entertainer:0};delete run.staffRoster;delete run.operations;
  migrateStaffOperations(run);const ids=run.staffRoster.map(worker=>worker.id);
  migrateStaffOperations(run);
  assert.equal(run.version,7);
  assert.equal(run.staffRoster.length,3);
  assert.equal(new Set(ids).size,3);
  assert.deepEqual(run.staff,{service:0,caretaker:2,technician:1,host:0,entertainer:0});
});
