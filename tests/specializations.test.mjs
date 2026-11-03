import test from "node:test";
import assert from "node:assert/strict";
import {
  createRun, placeFacility, setStoreSpecialization, setFacilitySpecialization,
  storeSpecialization, facilitySpecialization, specializationSynergy,
  specializationSnapshot, venueServiceMultiplier, storeOperatingCost,
  campusMetrics, migrateStaffOperations
} from "../dist/core.js";

test("store concepts require a level-two venue and reject without mutation",()=>{
  const run=createRun(),cash=run.cash;
  assert.throws(()=>setStoreSpecialization(run,"cafe","cafe-express"),/level 2/i);
  assert.equal(run.cash,cash);
  assert.deepEqual(run.storeSpecializations,{});
});

test("choosing a store concept is atomic and immediately changes operations",()=>{
  const run=createRun();run.venues.cafe=2;const baseService=venueServiceMultiplier(run,"cafe"),baseCost=storeOperatingCost(run,"cafe"),next=setStoreSpecialization(run,"cafe","cafe-express","2026-10-22T10:00:00.000Z");
  assert.equal(next.cash,run.cash-1200);
  assert.equal(storeSpecialization(next,"cafe").name,"Lecture Express");
  assert.ok(venueServiceMultiplier(next,"cafe")>baseService);
  assert.ok(storeOperatingCost(next,"cafe")>baseCost);
  assert.equal(run.storeSpecializations.cafe,undefined);
});

test("unaffordable store concepts leave the existing concept untouched",()=>{
  const run=createRun();run.venues.cafe=2;run.storeSpecializations.cafe="cafe-study";run.cash=10;
  assert.throws(()=>setStoreSpecialization(run,"cafe","cafe-roastery"),/need/i);
  assert.equal(run.storeSpecializations.cafe,"cafe-study");
  assert.equal(run.cash,10);
});

test("facility blueprints must match the physical facility type",()=>{
  let run=createRun();run.cash=50000;run=placeFacility(run,"bench",12,18);const facility=run.facilities[0],cash=run.cash;
  assert.throws(()=>setFacilitySpecialization(run,facility.id,"water-fast"),/designed for this facility/i);
  assert.equal(run.cash,cash);
  assert.equal(facility.specializationId,undefined);
});

test("facility specialization adds needs and persists on the placed asset",()=>{
  let run=createRun();run.cash=50000;run=placeFacility(run,"bench",12,18);const before=campusMetrics(run),facilityId=run.facilities[0].id;run=setFacilitySpecialization(run,facilityId,"bench-study");const after=campusMetrics(run),facility=run.facilities[0];
  assert.equal(facilitySpecialization(facility).name,"Study Nook");
  assert.equal(after.needs.energy,before.needs.energy+7);
  assert.equal(after.needs.mood,before.needs.mood+2);
});

test("matching store and facility focus creates district synergy",()=>{
  let run=createRun();run.cash=50000;run.venues.cafe=2;run=setStoreSpecialization(run,"cafe","cafe-study");run=placeFacility(run,"bench",12,18);run=setFacilitySpecialization(run,run.facilities[0].id,"bench-study");
  const synergy=specializationSynergy(run,"cafe"),snapshot=specializationSnapshot(run);
  assert.equal(synergy.focus,"wellbeing");
  assert.equal(synergy.matches,1);
  assert.equal(synergy.service,1.04);
  assert.equal(snapshot.totalSynergies,1);
});

test("facilities in another district do not strengthen a store concept",()=>{
  let run=createRun();run.cash=50000;run.venues.cafe=2;run.districts.east=1;run=setStoreSpecialization(run,"cafe","cafe-study");run=placeFacility(run,"bench",44,18);run=setFacilitySpecialization(run,run.facilities[0].id,"bench-study");
  assert.equal(specializationSynergy(run,"cafe").matches,0);
});

test("older saves migrate without inventing specializations",()=>{
  const run=createRun();delete run.storeSpecializations;delete run.specializationHistory;run.version=5;const migrated=migrateStaffOperations(run);
  assert.equal(migrated.version,9);
  assert.deepEqual(migrated.storeSpecializations,{});
  assert.deepEqual(migrated.specializationHistory,[]);
});
