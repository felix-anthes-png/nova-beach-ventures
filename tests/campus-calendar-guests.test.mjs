import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { CAMPUS_CALENDAR, GUEST_GROUPS, DAY_END, DAY_START, createRun, calendarDay, calendarForecast, guestGroupMix, selectGuestGroup, guestDestinationOptions, advanceTycoon, migrateStaffOperations } from "../dist/core.js";

const root=new URL("../",import.meta.url);

test("the campus calendar repeats a persistent seven-day programme",()=>{
  const run=createRun();
  assert.equal(calendarDay(run).id,"lecture");
  assert.equal(calendarDay(run,6).id,"weekend");
  assert.equal(calendarDay(run,7).id,"lecture");
  assert.equal(calendarDay(run,7).week,2);
  assert.equal(CAMPUS_CALENDAR.length,7);
});

test("calendar days produce materially different attendance forecasts",()=>{
  const run=createRun(),lecture=calendarForecast(run,0),festival=calendarForecast(run,5);
  assert.equal(lecture.day.id,"lecture");
  assert.equal(festival.day.id,"festival");
  assert.ok(festival.expectedGuests>lecture.expectedGuests);
});

test("guest composition changes with both the calendar and time of day",()=>{
  const run=createRun(),lectureArrival=guestGroupMix(run,480),lectureSunset=guestGroupMix(run,1100);
  assert.equal(lectureArrival[0].groupId,"student");
  assert.ok(lectureArrival.find(row=>row.groupId==="student").share>lectureSunset.find(row=>row.groupId==="student").share);
  run.currentDay=5;
  const surf=guestGroupMix(run,1020);
  assert.equal(surf[0].groupId,"surfer");
});

test("guest group selection is deterministic and uses known cohorts",()=>{
  const run=createRun(),first=selectGuestGroup(run,42,720),again=selectGuestGroup(run,42,720);
  assert.equal(first.id,again.id);
  assert.ok(GUEST_GROUPS.some(group=>group.id===first.id));
  assert.equal(GUEST_GROUPS.length,12);
});

test("group price tolerance changes the appeal of an identical offer",()=>{
  const run=createRun();run.stock.coldBrew=10;run.prices.coldBrew=600;
  const profile={needs:{hunger:55,thirst:50,bladder:20,energy:65,mood:45},budget:5000,queuePatience:70,preferences:{food:.5,drinks:.7,shopping:.2,social:.4,excitement:.3,calm:.5}};
  const student=guestDestinationOptions(run,{...profile,priceTolerance:.9,groupName:"Student"},3).find(option=>option.id==="cafe"),corporate=guestDestinationOptions(run,{...profile,priceTolerance:1.55,groupName:"Corporate"},3).find(option=>option.id==="cafe");
  assert.ok(corporate.score>student.score);
  assert.match(corporate.reason,/Corporate/);
});

test("closing a day records its calendar and guest-group result once",()=>{
  const run=createRun();run.today.guestGroups.student={arrivals:12,visits:8,purchases:3,spend:1200,walkaways:1};
  const closed=advanceTycoon(run,DAY_END-DAY_START);
  assert.equal(closed.history.length,1);
  assert.equal(closed.history[0].calendar.id,"lecture");
  assert.equal(closed.history[0].guestGroups.student.spend,1200);
  assert.equal(closed.currentDay,2);
});

test("older campaigns migrate without losing progress",()=>{
  const legacy=createRun();legacy.version=7;delete legacy.calendar;delete legacy.today.guestGroups;legacy.cash=54321;
  const migrated=migrateStaffOperations(legacy);
  assert.equal(migrated.version,9);
  assert.equal(migrated.cash,54321);
  assert.equal(migrated.calendar.cycle,"nova-week-v1");
  assert.deepEqual(migrated.today.guestGroups,{});
});

test("the browser exposes forecasts, crowd identities and group reporting",async()=>{
  const [app,html,css]=await Promise.all([readFile(new URL("dist/app.js",root),"utf8"),readFile(new URL("dist/index.html",root),"utf8"),readFile(new URL("dist/campus-calendar.css",root),"utf8")]);
  assert.match(app,/function createGuestAgent\([\s\S]*selectGuestGroup/);
  assert.match(app,/class="calendar-hero"/);
  assert.match(app,/guest-group-grid/);
  assert.match(app,/report-groups/);
  assert.match(app,/drawGuestGroupAccessory/);
  assert.match(html,/campus-calendar\.css\?v=36-campus-calendar/);
  assert.match(css,/\.week-calendar/);
});
