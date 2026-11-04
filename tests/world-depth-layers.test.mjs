import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source=await readFile(new URL("../dist/app.js",import.meta.url),"utf8");

function body(name){const start=source.indexOf(`function ${name}`),next=source.indexOf("\nfunction ",start+10);return source.slice(start,next<0?source.length:next);}

test("large campus architecture is split into local depth actors",()=>{
  assert.match(source,/drawCampusWestWing/);
  assert.match(source,/drawCampusCentreWing/);
  assert.match(source,/drawCampusEastWing/);
  assert.match(source,/\.\.\.architecturalForegroundActors\(\)/);
});

test("foreground furniture is no longer painted inside whole-building actors",()=>{
  for(const name of ["drawLibrary","drawMercadoExterior","drawStudentHub"]){const exterior=body(name);assert.doesNotMatch(exterior,/drawCanopy|drawColumnLine|drawLinearPlanter/);}
  assert.match(body("architecturalForegroundActors"),/addCanopy/);
  assert.match(body("architecturalForegroundActors"),/addColumns/);
  assert.match(body("architecturalForegroundActors"),/addPlanter/);
});
