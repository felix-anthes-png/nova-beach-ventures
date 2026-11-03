import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { INITIAL_CASH, SHOWCASE_BUDGET, createRun, createShowcaseRun, progressionState } from "../dist/core.js";

const root=new URL("../",import.meta.url);

test("showcase editor starts fully unlocked with a presentation budget",()=>{
  const run=createShowcaseRun();
  assert.equal(run.campaignType,"showcase");
  assert.equal(run.cash,SHOWCASE_BUDGET);
  assert.equal(progressionState(run).level,10);
  assert.equal(run.speed,4);
  assert.equal(run.venues.cafe,1);
  assert.equal(run.venues.snack,0);
  assert.equal(run.districts.east,0);
});

test("creating a showcase does not modify a normal campaign",()=>{
  const campaign=createRun(),showcase=createShowcaseRun();
  showcase.cash-=1000;showcase.venues.snack=1;
  assert.equal(campaign.cash,INITIAL_CASH);
  assert.equal(campaign.venues.snack,0);
  assert.notEqual(campaign.campaignType,"showcase");
});

test("the browser keeps showcase and campaign saves separate",async()=>{
  const [app,html,css]=await Promise.all([
    readFile(new URL("dist/app.js",root),"utf8"),
    readFile(new URL("dist/index.html",root),"utf8"),
    readFile(new URL("dist/showcase-editor.css",root),"utf8")
  ]);
  assert.match(app,/nova-beach-ventures-showcase-v1/);
  assert.match(app,/activeStorageKey/);
  assert.match(app,/function switchCampaignMode/);
  assert.match(app,/function confirmShowcaseReset/);
  assert.match(html,/id="showcaseButton"/);
  assert.match(html,/id="exitShowcase"/);
  assert.match(css,/\.showcase-mode \.showcase-bar/);
});
