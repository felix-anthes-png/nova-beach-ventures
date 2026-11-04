import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { venueVisualState, eventPreparationState } from "../dist/venue-visual-states.js";

test("an operating stocked venue illuminates without shutters",()=>{
  const state=venueVisualState({open:true,stock:12,capacity:20});
  assert.equal(state.status,"open");assert.equal(state.lightsOn,true);assert.equal(state.shutters,false);assert.equal(state.stockLevel,"ready");
});

test("closed venues switch off and lower their shutters",()=>{
  const state=venueVisualState({open:false,stock:12,capacity:20});
  assert.equal(state.status,"closed");assert.equal(state.lightsOn,false);assert.equal(state.shutters,true);
});

test("empty and low inventory produce different frontage displays",()=>{
  assert.equal(venueVisualState({stock:0,capacity:20}).emptyShelves,true);
  assert.equal(venueVisualState({stock:2,capacity:20}).lowStock,true);
});

test("recent deliveries create a restocking scene",()=>{
  assert.equal(venueVisualState({stock:8,recentDelivery:true}).restocking,true);
  assert.equal(venueVisualState({stock:8,recentDelivery:false}).restocking,false);
});

test("queues and rush periods deploy barriers only at operating stocked venues",()=>{
  assert.equal(venueVisualState({stock:8,queueCount:2}).queueBarriers,true);
  assert.equal(venueVisualState({stock:8,rushMultiplier:1.6}).queueBarriers,true);
  assert.equal(venueVisualState({stock:0,queueCount:4}).queueBarriers,false);
});

test("breakdowns override open state and expose repair treatment",()=>{
  const state=venueVisualState({open:true,broken:true,stock:8});
  assert.equal(state.status,"repair");assert.equal(state.repair,true);assert.equal(state.open,false);assert.equal(state.shutters,true);
});

test("scheduled deck events enter preparation during the prior campaign day",()=>{
  const scheduledEvent={source:"dj",deckId:"pavilion",day:4,startMinute:1080};
  assert.equal(eventPreparationState({scheduledEvent,currentDay:3,currentMinute:1200,deckId:"pavilion"}).preparing,true);
  assert.equal(eventPreparationState({scheduledEvent,currentDay:3,currentMinute:1200,deckId:"other"}).preparing,false);
});

test("the world renderer contains every physical operating-state treatment",async()=>{
  const app=await readFile(new URL("../dist/app.js",import.meta.url),"utf8");
  for(const renderer of ["drawOpenCounterGlow","drawStockShelf","drawRestockBoxes","drawQueueBarriers","drawRepairClosure","drawCleaningSignal","drawEventPreparationDecor"])assert.match(app,new RegExp(`function ${renderer}\\(`));
  for(const renderer of ["drawDistrictStatusLamp","drawDistrictRestockCrates","drawDistrictOperationalDetails"])assert.match(app,new RegExp(`function ${renderer}\\(`));
  assert.doesNotMatch(app,/drawVenueOperationalState\(x,y,w,districtOperationalVisualState/);
  assert.match(app,/CLEANING IN PROGRESS/);
});
