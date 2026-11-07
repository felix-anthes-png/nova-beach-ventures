import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {INTERIOR_LAYOUTS,pointInsideInteriorFixture} from "../dist/interior-layouts.js";

const appPromise=readFile(new URL("../dist/app.js",import.meta.url),"utf8");

test("each interior keeps distinct operational rooms and authored partitions",()=>{
  assert.deepEqual(INTERIOR_LAYOUTS.academy.zones.map(zone=>zone.id),["service","study","lecture"]);
  assert.deepEqual(INTERIOR_LAYOUTS.mercado.zones.map(zone=>zone.id),["stock","dispatch","cold"]);
  assert.deepEqual(INTERIOR_LAYOUTS.hub.zones.map(zone=>zone.id),["retail","venture","social"]);
  assert.ok(INTERIOR_LAYOUTS.academy.colliders.some(item=>item.id==="academy-commons-divider-west"));
  assert.equal(INTERIOR_LAYOUTS.academy.colliders.filter(item=>item.id.startsWith("auditorium-partition")).length,2);
  assert.equal(INTERIOR_LAYOUTS.hub.colliders.filter(item=>item.id.startsWith("venture-partition")).length,2);
});

test("new retail and collaboration fixtures have solid footprints",()=>{
  const hub=INTERIOR_LAYOUTS.hub;
  for(const id of ["merch-island-west","merch-island-east","venture-collaboration-table","hub-coffee-table"])assert.ok(hub.colliders.some(item=>item.id===id),id);
  const routePoints=hub.route;
  for(const point of routePoints)for(const fixture of hub.colliders)assert.equal(pointInsideInteriorFixture(point,fixture,.2),false,`${fixture.id} blocks the Hub route`);
});

test("the renderer gives every building its own architectural system",async()=>{
  const app=await appPromise;
  for(const renderer of ["drawInteriorLighting","drawAcademicCommonsArchitecture","drawMercadoHallArchitecture","drawHubArchitecture","drawMerchIsland","drawVentureCollaboration"])assert.match(app,new RegExp(`function ${renderer}\\(`));
  assert.match(app,/RECEIVING · BAY 01/);
  assert.match(app,/VENTURE STUDIO/);
  assert.match(app,/STUDENT COMMONS/);
  assert.doesNotMatch(app,/previewZone/);
});
