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

test("building walls and collision share one grounded footprint",()=>{
  assert.match(source,/const CAMPUS_BUILDINGS=Object\.freeze/);
  assert.match(source,/Object\.values\(CAMPUS_BUILDINGS\)\.map\(building=>rectCollider/);
  for(const building of ["library","mercado","academicWest","academicCentre","academicEast","studentHub"]){
    assert.match(source,new RegExp(`buildingDepth\\(CAMPUS_BUILDINGS\\.${building}\\)`));
  }
  assert.match(source,/CAMPUS_BUILDINGS\.studentHub;drawCampusWing\(x,y,w,h,84/);
  assert.match(source,/Math\.max\(building\.x,Math\.min\(building\.x\+building\.w,run\.player\.x\)\)\+building\.y\+building\.h/);
});

test("façade planters are solid world objects",()=>{
  assert.match(source,/const ARCHITECTURAL_PLANTERS=Object\.freeze/);
  assert.match(source,/ARCHITECTURAL_PLANTERS\.map\(planter=>rectCollider/);
  assert.match(source,/ARCHITECTURAL_PLANTERS\.forEach\(planter=>addPlanter/);
});

test("foreground furniture is no longer painted inside whole-building actors",()=>{
  for(const name of ["drawLibrary","drawMercadoExterior","drawStudentHub"]){const exterior=body(name);assert.doesNotMatch(exterior,/drawCanopy|drawColumnLine|drawLinearPlanter/);}
  assert.match(body("architecturalForegroundActors"),/addCanopy/);
  assert.match(body("architecturalForegroundActors"),/addColumns/);
  assert.match(body("architecturalForegroundActors"),/addPlanter/);
});
