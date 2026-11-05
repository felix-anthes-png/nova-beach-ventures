import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {INTERIOR_LAYOUTS,pointInsideInteriorFixture} from "../dist/interior-layouts.js";

test("each interior has authored operational zones, circulation and activities",()=>{
  assert.deepEqual(Object.keys(INTERIOR_LAYOUTS).sort(),["academy","hub","mercado"]);
  for(const layout of Object.values(INTERIOR_LAYOUTS)){
    assert.ok(layout.zones.length>=3,layout.name);
    assert.ok(layout.route.length>=4,layout.name);
    assert.ok(layout.activities.length>=6,layout.name);
    assert.ok(layout.colliders.some(item=>item.kind==="counter"),layout.name);
  }
});

test("entrance routes and guest activity points remain outside solid fixtures",()=>{
  for(const layout of Object.values(INTERIOR_LAYOUTS)){
    for(let index=1;index<layout.route.length;index++){const start=layout.route[index-1],end=layout.route[index];for(let step=0;step<=20;step++){const point={x:start.x+(end.x-start.x)*step/20,y:start.y+(end.y-start.y)*step/20};for(const fixture of layout.colliders)assert.equal(pointInsideInteriorFixture(point,fixture,.28),false,`${layout.name}: entrance route intersects ${fixture.label}`);}}
    for(const point of layout.activities)for(const fixture of layout.colliders)assert.equal(pointInsideInteriorFixture(point,fixture),false,`${layout.name}: ${point.label} intersects ${fixture.label}`);
  }
});

test("interior service workers and customers use purposeful poses",()=>{
  for(const layout of Object.values(INTERIOR_LAYOUTS)){
    assert.ok(layout.activities.some(item=>item.role==="service"),layout.name);
    assert.ok(layout.activities.some(item=>["sit","browse","phone","chat"].includes(item.pose)),layout.name);
  }
});

test("the browser uses layout collision, indoor service markers and contextual interaction text",async()=>{
  const app=await readFile(new URL("../dist/app.js",import.meta.url),"utf8");
  assert.match(app,/interior-layouts\.js\?v=56-auditorium/);
  assert.match(app,/layout\.colliders\.map/);
  assert.match(app,/drawIndoorServiceStatus/);
  assert.match(app,/interactionDescription/);
  assert.doesNotMatch(app,/roof transparency|front-wall transparency/i);
});
