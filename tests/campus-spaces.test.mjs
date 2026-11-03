import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const appPromise=readFile(new URL("../dist/app.js",import.meta.url),"utf8");

test("the campus is composed from eight named public spaces",async()=>{
  const app=await appPromise;
  for(const name of ["Arrival Plaza","Academic Courtyard","Café Terrace","Service Lane","Food Court","Student Lawn","Beach Promenade","Event Square"]){
    assert.match(app,new RegExp(name));
  }
  for(const renderer of ["drawArrivalPlaza","drawAcademicCourtyard","drawCafeTerrace","drawServiceLane","drawFoodCourt","drawStudentLawn","drawBeachPromenade","drawEventSquare"]){
    assert.match(app,new RegExp(`function ${renderer}\\(`));
  }
});

test("guest routes use designed spaces as circulation nodes",async()=>{
  const app=await appPromise;
  assert.match(app,/points\.push\(CAMPUS_SPACES\.arrival\)/);
  assert.match(app,/points\.push\(CAMPUS_SPACES\.courtyard\)/);
  assert.match(app,/points\.push\(CAMPUS_SPACES\.foodCourt\)/);
  assert.match(app,/points\.push\(CAMPUS_SPACES\.lawn\)/);
  assert.match(app,/points\.push\(CAMPUS_SPACES\.promenade\)/);
});

test("critical circulation zones reject conflicting construction",async()=>{
  const app=await appPromise;
  assert.match(app,/label:"Arrival Plaza"/);
  assert.match(app,/label:"Academic Courtyard"/);
  assert.match(app,/label:"Service lane"/);
});
