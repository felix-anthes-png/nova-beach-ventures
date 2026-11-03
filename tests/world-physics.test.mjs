import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { rectCollider, circleCollider, pointBlocked, resolveMovement, nearestFreePoint } from "../dist/world-physics.js";

const bounds={minX:0,maxX:10,minY:0,maxY:10};

test("rectangular and circular objects have solid footprints",()=>{
  const colliders=[rectCollider("shop",3,3,2,2),circleCollider("tree",7,7,.5)];
  assert.equal(pointBlocked({x:3.1,y:4},colliders,.25)?.id,"shop");
  assert.equal(pointBlocked({x:7.6,y:7},colliders,.25)?.id,"tree");
  assert.equal(pointBlocked({x:1,y:1},colliders,.25),null);
});

test("movement stops at a solid object and reports what blocked it",()=>{
  const wall=rectCollider("counter",2,1,1,2,{label:"Counter"});
  const moved=resolveMovement({x:1.6,y:2},{x:.3,y:0},bounds,[wall],.2);
  assert.deepEqual({x:moved.x,y:moved.y},{x:1.6,y:2});
  assert.equal(moved.blocked,true);
  assert.equal(moved.collider.label,"Counter");
});

test("diagonal movement slides along an obstacle instead of sticking",()=>{
  const wall=rectCollider("counter",2,1,1,2);
  const moved=resolveMovement({x:1.6,y:2},{x:.3,y:.3},bounds,[wall],.2);
  assert.equal(moved.blocked,true);
  assert.equal(moved.x,1.6);
  assert.equal(moved.y,2.3);
});

test("blocked click targets resolve to a nearby walkable point",()=>{
  const shop=rectCollider("shop",4,4,2,2),point=nearestFreePoint({x:5,y:5},bounds,[shop],.2);
  assert.equal(pointBlocked(point,[shop],.2),null);
  assert.ok(Math.hypot(point.x-5,point.y-5)<2.5);
});

test("the world connects physics to player movement and depth ordering",async()=>{
  const app=await readFile(new URL("../dist/app.js",import.meta.url),"utf8");
  assert.match(app,/function campusColliders\(/);
  assert.match(app,/function roomColliders\(/);
  assert.match(app,/resolveMovement\(run\.player/);
  assert.match(app,/depth:50\.45,draw:\(\)=>drawStudentHub/);
  assert.match(app,/movementImpact/);
});
