import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source=await readFile(new URL("../dist/app.js",import.meta.url),"utf8");
const layoutMatch=source.match(/const DISTRICT_WORLD_LAYOUTS=Object\.freeze\((\{[\s\S]*?\})\);\n\nconst districtPalette/);
assert.ok(layoutMatch,"district layout data remains readable for spatial checks");
const layouts=Function(`"use strict";return (${layoutMatch[1]});`)();
const rect=plot=>({x:plot[0]-plot[2]/2,y:plot[1]-plot[3]/2,w:plot[2],h:plot[3]});
const overlaps=(a,b,gap=.08)=>a.x+a.w+gap>b.x&&b.x+b.w+gap>a.x&&a.y+a.h+gap>b.y&&b.y+b.h+gap>a.y;

test("each expansion has an authored ground and building language",()=>{
  for(const id of ["village","east","innovation","sports","transit"])assert.match(source,new RegExp(`district\\.id===\\"${id}\\"`));
  for(const renderer of ["drawDistrictVenue","drawActivityCourt","drawTransitFacility","districtBusinessWorldActors"])assert.match(source,new RegExp(`function ${renderer}`));
  assert.match(source,/managementOverlay!=="trade"&&managementOverlay!=="operations"/);
});

test("district plots stay inside their land and do not overlap",()=>{
  for(const layout of Object.values(layouts)){
    const plots=layout.plots.map(rect);
    for(const plot of plots){assert.ok(plot.x>=layout.x&&plot.y>=layout.y);assert.ok(plot.x+plot.w<=layout.x+layout.w&&plot.y+plot.h<=layout.y+layout.h);}
    for(let i=0;i<plots.length;i++)for(let j=i+1;j<plots.length;j++)assert.equal(overlaps(plots[i],plots[j]),false,`${layout.label} plots ${i+1} and ${j+1} overlap`);
  }
});

test("Beachfront plots clear the legacy bar, surf shop and relocated pavilion",()=>{
  const legacy=[{x:44.72,y:19.82,w:2.36,h:1.56},{x:52.02,y:15.4,w:2.16,h:1.4},{x:40.85,y:20.65,w:3.3,h:1.9}];
  for(const plot of layouts.east.plots.map(rect))for(const venue of legacy)assert.equal(overlaps(plot,venue),false,"Beachfront business overlaps a legacy venue");
  assert.match(source,/pavilion: \{ zone:"campus", x:42\.5, y:21\.6/);
});

test("commercial venues expose recognisable purpose-built details",()=>{
  for(const id of ["village-market","village-laundry","village-gym","beach-surf","beach-seafood","innovation-incubator","innovation-conference","sports-fitness","sports-recovery","transit-bakery","transit-info"])assert.match(source,new RegExp(`business\\.id===\\"${id}\\"`));
  for(const renderer of ["drawDistrictRoofMark","drawDistrictVenueDetails"])assert.match(source,new RegExp(`function ${renderer}`));
});

test("signature venues use distinct architectural masses",()=>{
  assert.match(source,/business\.id==="beach-bar"[\s\S]*?drawCanopy/);
  assert.match(source,/business\.id==="innovation-incubator"[\s\S]*?drawBlock/);
  assert.match(source,/business\.id==="innovation-conference"[\s\S]*?drawBlock/);
  assert.match(source,/business\.id==="transit-bike"[\s\S]*?drawCanopy/);
});
