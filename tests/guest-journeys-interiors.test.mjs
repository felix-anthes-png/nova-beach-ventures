import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {arrivalModeForGuest,interiorRouteForJourney,venueJourneyForTarget,VENUE_JOURNEYS} from "../dist/guest-journeys.js";

const appPromise=readFile(new URL("../dist/app.js",import.meta.url),"utf8");

test("guests arrive by bus, bicycle, or on foot from credible gates",()=>{
  assert.equal(arrivalModeForGuest({groupId:"commuter",gateId:"transit",transitOpen:true}).id,"bus");
  assert.equal(arrivalModeForGuest({groupId:"student",gateId:"main",cohortId:1}).id,"bicycle");
  assert.equal(arrivalModeForGuest({groupId:"tourist",gateId:"main",cohortId:2}).id,"foot");
});

test("cafe and merch purchases have reversible indoor routes",()=>{
  for(const id of ["cafe","merch"]){
    const journey=venueJourneyForTarget({kind:"store",id});
    assert.equal(journey,VENUE_JOURNEYS[id]);
    const inward=interiorRouteForJourney(journey,1),outward=interiorRouteForJourney(journey,1,true);
    assert.deepEqual(outward,[...inward].reverse());
    assert.ok(journey.followUp.label);
    assert.ok(journey.carry);
  }
  assert.equal(venueJourneyForTarget({kind:"facility",id:"water"}),null);
});

test("the live simulation crosses doors and renders the same guests indoors",async()=>{
  const app=await appPromise;
  assert.match(app,/"waiting-bus"/);
  assert.match(app,/state="inside-walking"/);
  assert.match(app,/state="inside-using"/);
  assert.match(app,/state="inside-exiting"/);
  assert.match(app,/guest\.worldZone===zone\.id/);
  assert.match(app,/journeyCarryForTarget/);
  assert.match(app,/Walking to \$\{followUp\.label\}/);
});
