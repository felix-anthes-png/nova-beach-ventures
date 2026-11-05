import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source=await readFile(new URL("../dist/app.js",import.meta.url),"utf8");
const coreSource=await readFile(new URL("../dist/core.js",import.meta.url),"utf8");
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

test("district parcels and venue rows retain generous circulation gaps",()=>{
  assert.ok(layouts.innovation.x>=40);
  assert.ok(layouts.village.x-(layouts.sports.x+layouts.sports.w)>=.8);
  assert.ok(layouts.east.y-(layouts.village.y+layouts.village.h)>=.8);
  assert.ok(layouts.transit.y-(layouts.sports.y+layouts.sports.h)>=.45);
  for(const id of ["village","east","innovation","sports","transit"]){
    const plots=layouts[id].plots.map(rect);
    for(let i=0;i<plots.length;i++)for(let j=i+1;j<plots.length;j++)assert.equal(overlaps(plots[i],plots[j],.45),false,`${layouts[id].label} plots ${i+1} and ${j+1} need more circulation space`);
  }
});

test("the Academic Core is the geographical centre of the expanded campus",()=>{
  assert.ok(layouts.transit.x+layouts.transit.w<=0,"Transit belongs west of the core");
  assert.ok(layouts.village.x+layouts.village.w<=0,"Student Village belongs northwest of the core");
  assert.ok(layouts.east.y>=24.5&&layouts.east.x>0&&layouts.east.x+layouts.east.w<40,"Beachfront belongs south of the core");
  assert.ok(layouts.innovation.x>=40,"Innovation belongs east of the core");
  assert.ok(layouts.sports.x+layouts.sports.w<layouts.village.x,"Sports Campus belongs inland beside Student Village");
  assert.ok(layouts.sports.y+layouts.sports.h<9,"Sports Campus stays clear of the shoreline");
});

test("the Beachfront owns the southern coast without a competing district parcel",()=>{
  assert.ok(layouts.east.y<25&&layouts.east.y+layouts.east.h>=34.5,"Beachfront connects the promenade to the waterline");
  assert.ok(layouts.sports.y+layouts.sports.h<layouts.east.y,"Sports Campus no longer overlaps the coastal composition");
  assert.match(source,/const boardwalkY=layout\.y\+\.35,boardwalkH=2\.05/);
  assert.match(source,/WEST ATHLETICS LAND/);
  assert.match(coreSource,/sports:\[\{x:-30,y:4\},\{x:-25,y:6\.8\},\{x:-18,y:3\.2\}\]/);
});

test("Beachfront plots clear the legacy bar, surf shop and relocated pavilion",()=>{
  const legacy=[{x:12.62,y:29.62,w:2.36,h:1.56},{x:33.57,y:27.5,w:2.16,h:1.4},{x:32.55,y:30.85,w:3.3,h:1.9}];
  for(const plot of layouts.east.plots.map(rect))for(const venue of legacy)assert.equal(overlaps(plot,venue),false,"Beachfront business overlaps a legacy venue");
  assert.match(source,/pavilion: \{ zone:"campus", x:34\.2, y:31\.8/);
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
