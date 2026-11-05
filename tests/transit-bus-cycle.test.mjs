import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { transitBusCycle, transitBusPosition } from "../dist/transit-bus-cycle.js";

test("the campus bus follows arrival, dwell, departure and away phases",()=>{
  assert.equal(transitBusCycle(485).phase,"arriving");
  assert.equal(transitBusCycle(500).phase,"boarding");
  assert.equal(transitBusCycle(518).phase,"departing");
  assert.equal(transitBusCycle(550).phase,"away");
});

test("the bus opens its doors and releases a substantial passenger group",()=>{
  const early=transitBusCycle(494),late=transitBusCycle(512);
  assert.equal(early.doorsOpen,true);assert.equal(late.doorsOpen,true);assert.ok(late.passengers>=8);assert.ok(late.passengers>early.passengers);
});

test("vehicle position reaches the real stop before departing",()=>{
  const arriving=transitBusPosition(transitBusCycle(486)),stopped=transitBusPosition(transitBusCycle(498)),departing=transitBusPosition(transitBusCycle(520));
  assert.ok(arriving.x>stopped.x);assert.equal(stopped.x,83.1);assert.ok(departing.x>stopped.x);assert.equal(stopped.y,8.55);
});

test("the world renders a full-size solid bus and grounded district foundations",async()=>{
  const app=await readFile(new URL("../dist/app.js",import.meta.url),"utf8");
  assert.match(app,/function drawCampusBus\(/);assert.match(app,/function drawBusPassengers\(/);assert.match(app,/4\.7,1\.22/);assert.match(app,/rectCollider\("campus-bus"/);assert.match(app,/function drawDistrictFoundation\(/);
});
