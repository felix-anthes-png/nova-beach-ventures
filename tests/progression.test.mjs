import test from "node:test";
import assert from "node:assert/strict";
import {
  createRun,
  progressionState,
  scenarioGoals,
  unlockVenue,
  unlockDistrict,
  unlockEventVenue,
  launchEvent,
  hireStaff,
  advanceTycoon,
  campusMetrics
} from "../dist/core.js";

function establishedRun(levelSales = 70) {
  const run = createRun();
  run.cash = 500000;
  run.totalSales = levelSales;
  return run;
}

test("a new company begins at level one with only Atlantic Café", () => {
  const run = createRun();
  assert.equal(progressionState(run).level, 1);
  assert.deepEqual(run.venues, { cafe: 1, snack: 0, merch: 0, beach: 0, surf: 0 });
  assert.deepEqual(run.districts, { coast: 1, east: 0, pier: 0 });
});

test("venue and staff unlocks enforce the company roadmap", () => {
  const starter = createRun();
  starter.cash = 500000;
  assert.throws(() => unlockVenue(starter, "snack"), /level 2/);
  assert.throws(() => hireStaff(starter, "service"), /level 2/);

  starter.totalSales = 4;
  assert.equal(progressionState(starter).level, 2);
  const withFuelBar = unlockVenue(starter, "snack");
  assert.equal(withFuelBar.venues.snack, 1);
  assert.equal(hireStaff(starter, "service").staff.service, 1);
});

test("land acquisition gates the Beach Bar and expands in sequence", () => {
  let run = establishedRun(48);
  assert.equal(progressionState(run).level, 6);
  assert.throws(() => unlockVenue(run, "beach"), /East Promenade/);

  run = unlockDistrict(run, "east");
  assert.equal(run.districts.east, 1);
  assert.equal(run.cash, 455000);
  run = unlockVenue(run, "beach");
  assert.equal(run.venues.beach, 1);
  assert.equal(run.cash, 415000);
  assert.throws(() => unlockDistrict(run, "pier"), /level 8/);
});

test("the event venue launches a timed crowd event that ends once", () => {
  let run = establishedRun(70);
  run = unlockDistrict(run, "east");
  run = unlockEventVenue(run);
  const baseline = campusMetrics(run);
  const launched = launchEvent(run, "sunset");
  assert.equal(launched.activeEvent.id, "sunset");
  assert.equal(launched.eventHistory.length, 1);
  assert.ok(campusMetrics(launched).guests > baseline.guests);
  assert.ok(campusMetrics(launched).needs.mood > baseline.needs.mood);
  assert.throws(() => launchEvent(launched, "sunset"), /already running/);

  const finished = advanceTycoon(launched, 181);
  assert.equal(finished.activeEvent, null);
  assert.equal(finished.eventHistory.length, 1);
});

test("long-term visitor and rating goals can be completed", () => {
  const run = createRun();
  run.totalVisitors = 250;
  run.staff = { service: 1, caretaker: 4, technician: 2, host: 3, entertainer: 2 };
  run.facilities = [
    ...Array.from({ length: 3 }, (_, index) => ({ id: `food-${index}`, type: "foodGarden", modules: [] })),
    ...Array.from({ length: 4 }, (_, index) => ({ id: `water-${index}`, type: "water", modules: [] })),
    ...Array.from({ length: 3 }, (_, index) => ({ id: `wc-${index}`, type: "restroom", modules: [] })),
    ...Array.from({ length: 6 }, (_, index) => ({ id: `bench-${index}`, type: "bench", modules: [] })),
    ...Array.from({ length: 4 }, (_, index) => ({ id: `bin-${index}`, type: "bin", modules: [] })),
    { id: "experience", type: "experience", modules: ["music", "sunset", "social"] }
  ];
  const goals = scenarioGoals(run);
  assert.equal(goals.find(goal => goal.id === "visitors").complete, true);
  assert.equal(goals.find(goal => goal.id === "rating").complete, true);
});
