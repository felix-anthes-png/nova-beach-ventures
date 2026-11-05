import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const app=readFileSync(new URL("../dist/app.js",import.meta.url),"utf8");

function body(name,nextName){
  const start=app.indexOf(`function ${name}(`),end=app.indexOf(`function ${nextName}(`,start);
  assert.ok(start>=0&&end>start,`${name} must be present before ${nextName}`);
  return app.slice(start,end);
}

test("district buildings share the raised district ground datum",()=>{
  const venue=body("drawDistrictVenue","drawDistrictFoundation");
  assert.match(app,/function drawBlockAt\(/);
  assert.match(venue,/drawContactShadow\(/);
  assert.match(venue,/drawBlockAt\([^;]+,7,height/);
  assert.doesNotMatch(venue,/drawSoftShadow\(/);
  assert.match(app,/drawBlockAt\(x-w\/2-\.08,y-h\/2-\.08,w\+\.16,h\+\.16,4,7/);
});

test("district courts, paths and transit surfaces begin on the platform",()=>{
  const details=body("drawDistrictGroundDetails","drawExpansionDistricts");
  const court=body("drawActivityCourt","drawTransitFacility");
  const transit=body("drawTransitFacility","drawDistrictBusiness");
  assert.doesNotMatch(details,/drawGroundSlab\(/);
  assert.match(details,/drawGroundSlabAt\(/);
  assert.match(court,/drawGroundSlabAt\([^;]+,4,top,2/);
  assert.match(transit,/drawGroundSlabAt\(/);
  assert.match(transit,/drawCanopy\([^;]+,20,6\)/);
});

test("temporary district equipment uses the supported frontage height",()=>{
  const operations=body("drawDistrictRestockCrates","drawOpenCounterGlow");
  assert.match(operations,/isoPoint\([^;]+,8\)/);
  assert.match(operations,/drawQueueBarriers\([^;]+,8\)/);
  assert.match(operations,/drawRepairClosure\([^;]+,t,8\)/);
});
