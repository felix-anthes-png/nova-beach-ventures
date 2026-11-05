import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { agendaStopsForGuest, arrivalGateForGuest, campusAgendaPhase, campusSpineWaypoints, isCentralAgendaStop, visibleGuestLimit } from "../dist/campus-circulation.js";

test("campus agenda follows the operating-day phases",()=>{
  assert.equal(campusAgendaPhase(510),"arrival");
  assert.equal(campusAgendaPhase(620),"lecture");
  assert.equal(campusAgendaPhase(750),"lunch");
  assert.equal(campusAgendaPhase(900),"afternoon");
  assert.equal(campusAgendaPhase(1050),"sunset");
  assert.equal(campusAgendaPhase(1140),"evening");
});

test("commuters arrive through unlocked transit but still receive a central agenda",()=>{
  const gate=arrivalGateForGuest({groupId:"commuter",cohortId:2,transitUnlocked:true});
  const agenda=agendaStopsForGuest({groupId:"commuter",clockMinutes:750,seed:2});
  assert.equal(gate.id,"transit");
  assert.ok(agenda.stops.some(isCentralAgendaStop));
  assert.deepEqual(agenda.stops,["courtyard","foodCourt"]);
});

test("specialist beach arrivals are limited deterministic exceptions",()=>{
  assert.equal(arrivalGateForGuest({groupId:"surfer",cohortId:0}).id,"beach");
  assert.equal(arrivalGateForGuest({groupId:"surfer",cohortId:1}).id,"main");
  assert.equal(arrivalGateForGuest({groupId:"tourist",cohortId:4}).id,"beach");
  assert.equal(arrivalGateForGuest({groupId:"tourist",cohortId:5}).id,"main");
  assert.deepEqual(agendaStopsForGuest({groupId:"surfer",clockMinutes:900,seed:0}).stops,["promenade"]);
  assert.ok(agendaStopsForGuest({groupId:"surfer",clockMinutes:900,seed:1}).stops.some(isCentralAgendaStop));
});

test("east and west routes cross the shared pedestrian spine in the correct direction",()=>{
  const westbound=campusSpineWaypoints({x:48,y:11},{x:20.1,y:12.75});
  const eastbound=campusSpineWaypoints({x:7.4,y:15.35},{x:48,y:11});
  assert.equal(westbound[0].x,40.2);
  assert.equal(westbound.at(-1).x,35.5);
  assert.equal(eastbound[0].x,35.5);
  assert.equal(eastbound.at(-1).x,40.2);
  assert.deepEqual(campusSpineWaypoints({x:20,y:12},{x:35,y:20}),[]);
});

test("west, south and southeast districts connect through the central campus",()=>{
  assert.deepEqual(campusSpineWaypoints({x:-13,y:13},{x:20,y:12}).map(point=>point.x),[-1,7.4]);
  assert.deepEqual(campusSpineWaypoints({x:20,y:12},{x:24,y:30}).map(point=>point.y),[21.35,23.7,24.9]);
  assert.deepEqual(campusSpineWaypoints({x:49,y:29},{x:20,y:12}).map(point=>point.x),[40.2,35.5]);
});

test("mature campuses can render a larger but bounded crowd",()=>{
  assert.equal(visibleGuestLimit(1),48);
  assert.equal(visibleGuestLimit(5),60);
  assert.equal(visibleGuestLimit(8),72);
});

test("the live guest system consumes agendas instead of district-local spawn indexes",async()=>{
  const source=await readFile(new URL("../dist/app.js",import.meta.url),"utf8");
  assert.match(source,/agendaStopsForGuest/);
  assert.match(source,/guest\.target\.agendaStop\)guest\.agendaIndex\+=1/);
  assert.match(source,/campusSpineWaypoints\(start,target\)/);
  assert.doesNotMatch(source,/preferredIndex=\{resident:/);
});
