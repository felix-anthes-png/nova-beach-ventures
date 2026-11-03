import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root=new URL("../",import.meta.url);

test("the outdoor world shares one time-aware Atlantic motion profile",async()=>{
  const app=await readFile(new URL("dist/app.js",root),"utf8");
  assert.match(app,/function environmentalProfile\(/);
  assert.match(app,/run\.clockMinutes,run\.currentDay,t/);
  assert.match(app,/ATLANTIC BREEZE/);
  assert.match(app,/COASTAL WIND/);
});

test("water, sky, vegetation, and flags receive environmental motion",async()=>{
  const app=await readFile(new URL("dist/app.js",root),"utf8");
  assert.match(app,/function drawSkyMotion\(/);
  assert.match(app,/function drawCoastalMotion\(/);
  assert.match(app,/function drawWindFlag\(/);
  assert.match(app,/function drawTree\([\s\S]*environment\.wind/);
  assert.match(app,/quadraticCurveTo\(water\.x-15\+jet\*18/);
});

test("environmental motion respects reduced-motion preferences",async()=>{
  const [app,css,html]=await Promise.all([
    readFile(new URL("dist/app.js",root),"utf8"),
    readFile(new URL("dist/environmental-motion.css",root),"utf8"),
    readFile(new URL("dist/index.html",root),"utf8")
  ]);
  assert.match(app,/prefers-reduced-motion: reduce/);
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
  assert.match(html,/environmental-motion\.css\?v=33-environmental-motion/);
});
