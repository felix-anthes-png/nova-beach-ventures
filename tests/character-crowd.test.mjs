import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const appPromise=readFile(new URL("../dist/app.js",import.meta.url),"utf8");

test("characters use directional six-frame movement",async()=>{
  const app=await appPromise;
  assert.match(app,/function characterView\(facing=/);
  assert.match(app,/Math\.floor\(\(t\+phase\*120\)\/130\)%6/);
  assert.match(app,/walkSteps=\[-3,-1,2,3,1,-2\]/);
  assert.match(app,/guest\.facing=\{x:dx\/distance,y:dy\/distance\}/);
});

test("guests visibly act on their current activity",async()=>{
  const app=await appPromise;
  for(const pose of ["phone","chat","eat","sit","dance","drink","browse"]){assert.match(app,new RegExp(`"${pose}"`));}
  assert.match(app,/hairStyle:"curls"/);
  assert.match(app,/hairStyle:"bun"/);
  assert.match(app,/hairStyle:"long"/);
});

test("crowds arrive in cohorts and queue without stacking",async()=>{
  const app=await appPromise;
  assert.match(app,/cohortId=Math\.floor\(\(id-1\)\/3\)/);
  assert.match(app,/const QUEUE_VECTORS=/);
  assert.match(app,/function queuePosition\(guest,index\)/);
  assert.match(app,/Math\.min\(48,Math\.max\(8/);
});

test("staff and event crowds have role-specific animation",async()=>{
  const app=await appPromise;
  for(const role of ["caretaker","technician","service","host"]){assert.match(app,new RegExp(`role===?"${role}"|worker\\.roleId===?"${role}"`));}
  assert.match(app,/pose:index%4===0\?"chat":"dance"/);
});
