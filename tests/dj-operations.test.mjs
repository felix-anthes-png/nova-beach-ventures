import test from "node:test";
import assert from "node:assert/strict";
import {
  createRun,
  configureDjOperations,
  hireDj,
  upgradeDjDeck,
  scheduleDjEvent,
  djEventProjection,
  advanceTycoon,
  guestDestinationOptions,
  campusMetrics
} from "../dist/core.js";

function runWithDeck(){
  const run=createRun();
  run.cash=100000;
  run.facilities=[{id:"deck-1",type:"experience",name:"Atlantic DJ Deck",modules:["music","social"],x:22,y:18,cost:2300}];
  return run;
}

test("DJ operations require a built deck and a hired DJ",()=>{
  const empty=createRun();
  assert.throws(()=>configureDjOperations(empty,{deckId:"missing"}),/built DJ deck/);
  const configured=configureDjOperations(runWithDeck(),{deckId:"deck-1",slotId:"sunset",styleId:"house",ticketPrice:900});
  assert.throws(()=>scheduleDjEvent(configured,"deck-1"),/Hire a DJ/);
  const staffed=hireDj(configured,"ines","deck-1");
  assert.equal(staffed.djOperations.djId,"ines");
  assert.equal(staffed.cash,99100);
});

test("ticket price and music style materially change the event forecast",()=>{
  let run=hireDj(configureDjOperations(runWithDeck(),{deckId:"deck-1",styleId:"pop",ticketPrice:600}),"marco","deck-1");
  const accessible=djEventProjection(run);
  run=configureDjOperations(run,{styleId:"house",ticketPrice:1600});
  const premium=djEventProjection(run);
  assert.ok(accessible.expectedAttendance>premium.expectedAttendance);
  assert.ok(premium.noise>accessible.noise);
  assert.notEqual(accessible.expectedProfit,premium.expectedProfit);
});

test("speaker, lighting, shade and capacity upgrades change the physical operating profile",()=>{
  let run=hireDj(configureDjOperations(runWithDeck(),{deckId:"deck-1"}),"ines","deck-1");
  const baseline=djEventProjection(run);
  for(const id of ["speakers","lighting","shade","capacity"])run=upgradeDjDeck(run,id,"deck-1");
  const upgraded=djEventProjection(run);
  assert.ok(upgraded.excitement>baseline.excitement);
  assert.ok(upgraded.noise>baseline.noise);
  assert.ok(upgraded.comfort>baseline.comfort);
  assert.ok(upgraded.capacity>baseline.capacity);
  assert.ok(upgraded.operatingCost>baseline.operatingCost);
});

test("a scheduled event starts at its slot, earns ticket revenue and records one result",()=>{
  let run=hireDj(configureDjOperations(runWithDeck(),{deckId:"deck-1",slotId:"afternoon",styleId:"sunset",ticketPrice:700}),"marco","deck-1");
  const beforeSchedule=run.cash;
  run=scheduleDjEvent(run,"deck-1");
  assert.equal(run.scheduledEvent.day,1);
  assert.ok(run.cash<beforeSchedule);
  const afterOperatingCost=run.cash;
  run=advanceTycoon(run,425);
  assert.equal(run.scheduledEvent,null);
  assert.equal(run.activeEvent?.source,"dj");
  assert.ok(run.activeEvent.attendance>0);
  assert.ok(run.cash>afterOperatingCost);
  const liveMetrics=campusMetrics(run);
  assert.ok(liveMetrics.guests>12);
  run=advanceTycoon(run,121);
  assert.equal(run.activeEvent,null);
  assert.equal(run.eventHistory.filter(item=>item.eventId==="dj-event").length,1);
  assert.ok(run.eventHistory.at(-1).revenue>0);
  assert.ok(run.eventHistory.at(-1).attendance>0);
});

test("guests reject unaffordable event tickets",()=>{
  const run=runWithDeck();
  run.activeEvent={source:"dj",id:"dj-event",deckId:"deck-1",name:"Atlantic House",ticketPrice:1200,excitement:60,noise:55,comfort:70,guestBonus:10,moodBonus:8,remainingMinutes:60};
  const profile={needs:{hunger:20,thirst:20,bladder:20,energy:20,mood:80},budget:1199,queuePatience:70,preferences:{excitement:1,calm:0,social:1}};
  assert.equal(guestDestinationOptions(run,profile,1).some(option=>option.kind==="event"),false);
  profile.budget=1200;
  assert.equal(guestDestinationOptions(run,profile,1).some(option=>option.kind==="event"),true);
});
