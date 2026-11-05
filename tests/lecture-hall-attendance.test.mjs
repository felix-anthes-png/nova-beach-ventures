import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {agendaStopsForGuest} from "../dist/campus-circulation.js";
import {INTERIOR_LAYOUTS,pointInsideInteriorFixture} from "../dist/interior-layouts.js";
import {interiorRouteForJourney,venueJourneyForTarget} from "../dist/guest-journeys.js";

const appPromise=readFile(new URL("../dist/app.js",import.meta.url),"utf8");

test("lecture timetable agendas send academic guests into the main building",()=>{
  const morning=agendaStopsForGuest({groupId:"student",clockMinutes:540,seed:2});
  const lecture=agendaStopsForGuest({groupId:"professor",clockMinutes:630,seed:3});
  assert.ok(morning.stops.includes("academy"));
  assert.ok(lecture.stops.includes("academy")||lecture.stops.includes("courtyard"));
  const journey=venueJourneyForTarget({kind:"landmark",id:"academy"});
  assert.equal(journey.zone,"academy");
  assert.equal(journey.activity,"Attending a lecture");
  assert.equal(venueJourneyForTarget({kind:"landmark",id:"courtyard"}),null);
});

test("the Academic Wing contains a walkable lecture hall",()=>{
  const layout=INTERIOR_LAYOUTS.academy,journey=venueJourneyForTarget({kind:"landmark",id:"academy"}),route=interiorRouteForJourney(journey,1);
  assert.ok(layout.zones.some(zone=>zone.id==="lecture"));
  assert.equal(layout.colliders.filter(item=>item.id.startsWith("lecture-row")).length,3);
  assert.ok(layout.activities.some(item=>item.role==="lecturer"&&item.pose==="present"));
  assert.ok(layout.activities.filter(item=>item.pose==="study").length>=3);
  for(const point of route)assert.equal(layout.colliders.some(fixture=>pointInsideInteriorFixture(point,fixture,.01)),false);
});

test("live students attend, study, and leave the lecture hall",async()=>{
  const app=await appPromise;
  assert.match(app,/function drawLectureHall\(t\)/);
  assert.match(app,/journey\.id==="academy"\?6\.4/);
  assert.match(app,/groupId==="professor"\?"present"/);
  assert.match(app,/"Leaving the lecture hall"/);
  assert.match(app,/recordOnExit/);
});
