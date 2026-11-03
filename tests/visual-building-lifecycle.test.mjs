import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {
  createRun,
  unlockVenue,
  upgradeVenue,
  advanceTycoon,
  activeVenueProject,
  venueProjectProgress,
  storeIsOpen,
  migrateStaffOperations
} from "../dist/core.js";

test("opening a venue creates a paid construction project and closes service",()=>{
  const run=createRun();run.cash=50000;run.totalSales=4;
  const next=unlockVenue(run,"snack","2026-11-03T10:00:00.000Z"),project=activeVenueProject(next,"snack");
  assert.equal(next.venues.snack,1);
  assert.equal(next.cash,50000-12000);
  assert.equal(project.kind,"open");
  assert.equal(project.remainingMinutes,90);
  assert.equal(storeIsOpen(next,"snack",720),false);
  assert.equal(run.venues.snack,0);
});

test("construction progress completes exactly once as campaign time advances",()=>{
  const run=createRun();run.cash=100000;
  const started=upgradeVenue(run,"cafe","2026-11-03T10:00:00.000Z"),project=activeVenueProject(started,"cafe");
  assert.equal(venueProjectProgress(project),0);
  assert.throws(()=>upgradeVenue(started,"cafe"),/active construction/);
  const partial=advanceTycoon(started,60),partialProject=activeVenueProject(partial,"cafe");
  assert.equal(Math.round(venueProjectProgress(partialProject)*100),50);
  const complete=advanceTycoon(partial,60),record=complete.venueProjects.at(-1),reputation=complete.reputation;
  assert.equal(record.status,"complete");
  assert.equal(activeVenueProject(complete,"cafe"),null);
  assert.equal(storeIsOpen(complete,"cafe",720),true);
  const later=advanceTycoon(complete,30);
  assert.equal(later.reputation,reputation);
  assert.equal(later.venueProjects.filter(item=>item.id===record.id).length,1);
});

test("older saves migrate with an empty construction ledger",()=>{
  const run=createRun();delete run.venueProjects;run.version=6;
  const migrated=migrateStaffOperations(run);
  assert.equal(migrated.version,7);
  assert.deepEqual(migrated.venueProjects,[]);
});

test("the browser build contains construction, shutters, logistics, and project UI",()=>{
  const app=fs.readFileSync(new URL("../dist/app.js",import.meta.url),"utf8"),html=fs.readFileSync(new URL("../dist/index.html",import.meta.url),"utf8");
  assert.match(app,/drawConstructionSite/);
  assert.match(app,/drawStoreFrontageState/);
  assert.match(app,/deliveryWorldActors/);
  assert.match(app,/cameraSequence/);
  assert.match(html,/visual-building-lifecycle\.css/);
});
