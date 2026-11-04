import test from "node:test";
import assert from "node:assert/strict";
import {DISTRICT_BUSINESSES,DISTRICT_BUSINESS_OFFERS,createRun,migrateStaffOperations,buyDistrictOfferStock,setDistrictOfferPrice,districtOfferDemand,districtBusinessForecast,completeDistrictOfferSale,guestDestinationOptions} from "../dist/core.js";

function operatingRun(businessId="transit-bakery"){
  const run=createRun();run.cash=100000;run.districtBusinesses[businessId]=1;migrateStaffOperations(run);return run;
}

test("every district business has two configurable offers",()=>{
  for(const business of DISTRICT_BUSINESSES)assert.equal(DISTRICT_BUSINESS_OFFERS.filter(offer=>offer.businessId===business.id).length,2,business.name);
});

test("stock and bookable capacity must be purchased atomically",()=>{
  const run=operatingRun(),offer=DISTRICT_BUSINESS_OFFERS.find(item=>item.id==="transit-bakery-croissant"),beforeStock=run.districtOperations[offer.businessId].stock[offer.id],next=buyDistrictOfferStock(run,offer.id,6);
  assert.equal(next.cash,run.cash-offer.cost*6);assert.equal(next.districtOperations[offer.businessId].stock[offer.id],beforeStock+6);assert.throws(()=>buyDistrictOfferStock(run,offer.id,0));assert.throws(()=>buyDistrictOfferStock({...run,cash:offer.cost-1},offer.id,1));assert.equal(run.cash,100000);
});

test("district offer demand follows price boundaries and need timing",()=>{
  let run=operatingRun();const offer=DISTRICT_BUSINESS_OFFERS.find(item=>item.id==="transit-bakery-croissant");run=setDistrictOfferPrice(run,offer.id,offer.reference);const full=districtOfferDemand(run,offer.id);run=setDistrictOfferPrice(run,offer.id,offer.reference+1);const reduced=districtOfferDemand(run,offer.id);run=setDistrictOfferPrice(run,offer.id,offer.reference*2+1);assert.ok(full>reduced);assert.ok(reduced>0);assert.equal(districtOfferDemand(run,offer.id),0);
});

test("a real guest purchase reconciles cash, capacity, revenue and cogs",()=>{
  let run=operatingRun();const offer=DISTRICT_BUSINESS_OFFERS.find(item=>item.id==="transit-bakery-filled-roll"),beforeStock=run.districtOperations[offer.businessId].stock[offer.id];run=buyDistrictOfferStock(run,offer.id,3);run=setDistrictOfferPrice(run,offer.id,700);const beforeCash=run.cash;run=completeDistrictOfferSale(run,offer.id,1200,"guest-1");assert.equal(run.cash,beforeCash+700);assert.equal(run.districtOperations[offer.businessId].stock[offer.id],beforeStock+2);assert.deepEqual(run.today.districtOffers[offer.id],{units:1,revenue:700,cogs:offer.cost});assert.equal(run.districtOfferSales.length,1);
});

test("guest decisions only expose stocked and affordable district offers",()=>{
  let run=operatingRun("sports-padel"),offer=DISTRICT_BUSINESS_OFFERS.find(item=>item.id==="sports-padel-court-hour");run=buyDistrictOfferStock(run,offer.id,2);run=setDistrictOfferPrice(run,offer.id,900);const options=guestDestinationOptions(run,{groupId:"athlete",budget:1000,queuePatience:70,preferences:{social:.8},needs:{hunger:10,thirst:20,energy:30,mood:80}},2,{campusQuality:80});const option=options.find(item=>item.id==="sports-padel");assert.equal(option.offerId,offer.id);assert.equal(option.price,900);
});

test("business forecasts expose demand, margin and remaining stock",()=>{
  let run=operatingRun("village-gym"),offer=DISTRICT_BUSINESS_OFFERS.find(item=>item.id==="village-gym-day-pass"),beforeStock=run.districtOperations[offer.businessId].stock[offer.id];run=buyDistrictOfferStock(run,offer.id,8);const forecast=districtBusinessForecast(run,"village-gym"),row=forecast.offers.find(item=>item.id===offer.id);assert.equal(row.stock,beforeStock+8);assert.ok(row.demand>0);assert.equal(row.grossProfit,row.units*(row.price-row.cost));
});
