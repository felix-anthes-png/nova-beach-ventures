export const INITIAL_CASH = 10000;
export const STORAGE_KEY = "nova-beach-ventures-v1";
export const DAY_START = 450;
export const DAY_END = 1170;

export const FACILITY_CATALOGUE = Object.freeze([
  { id:"path", name:"Promenade Tile", icon:"▦", cost:100, color:"#c9c9b9", description:"Extend the walkable campus route one tile at a time.", needs:{} },
  { id:"scenery", name:"Palm Planter", icon:"♧", cost:300, color:"#5aa86a", description:"Scenery that makes the campus feel more welcoming.", needs:{ mood:3 } },
  { id:"bench", name:"Atlantic Bench", icon:"▰", cost:500, color:"#d7a968", description:"Rest spot that restores energy and mood.", needs:{ energy:10, mood:7 } },
  { id:"bin", name:"Recycling Point", icon:"♻", cost:400, color:"#70bd77", description:"Keeps paths clean and protects the campus rating.", needs:{ cleanliness:13 } },
  { id:"water", name:"Water Fountain", icon:"◒", cost:900, color:"#68cbd8", description:"A free refill point for thirsty students.", needs:{ thirst:18 } },
  { id:"restroom", name:"Restroom Pod", icon:"WC", cost:1600, color:"#7e9ec5", description:"Essential relief for longer campus visits.", needs:{ bladder:22, cleanliness:4 } },
  { id:"foodGarden", name:"Food Garden", icon:"✦", cost:2200, color:"#f2a65f", description:"A social food court that tackles hunger and mood.", needs:{ hunger:20, mood:8 } }
]);

export const FACILITY_FOOTPRINTS = Object.freeze({
  path:{width:1,height:1}, scenery:{width:1.1,height:1.1}, bench:{width:1.8,height:.8},
  bin:{width:1,height:1}, water:{width:1.2,height:1.2}, restroom:{width:1.7,height:1.45},
  foodGarden:{width:2.7,height:2.1}, experience:{width:3.7,height:2.55}
});

export const STAFF_CATALOGUE = Object.freeze([
  { id:"caretaker", name:"Campus Caretaker", icon:"⌁", cost:1000, description:"Improves cleanliness across every district." },
  { id:"technician", name:"Experience Technician", icon:"⚙", cost:1200, description:"Raises attraction reliability and comfort." },
  { id:"host", name:"Student Host", icon:"★", cost:1400, description:"Improves mood and helps more guests discover venues." }
]);

export const EXPERIENCE_MODULES = Object.freeze([
  { id:"music", name:"Live DJ Deck", icon:"♫", cost:600, excitement:18, intensity:5, comfort:1 },
  { id:"sunset", name:"Sunset Lookout", icon:"☀", cost:900, excitement:27, intensity:13, comfort:4 },
  { id:"shade", name:"Canvas Shade", icon:"⌂", cost:700, excitement:4, intensity:0, comfort:23 },
  { id:"social", name:"Social Seating", icon:"◎", cost:500, excitement:9, intensity:1, comfort:16 },
  { id:"surf", name:"Surf Simulator", icon:"≈", cost:1200, excitement:36, intensity:34, comfort:-9 }
]);

export const STORES = Object.freeze([
  { id: "cafe", name: "Atlantic Café", short: "Café", icon: "☕", color: "#ff815d", pitch: "Coffee and quick campus comfort." },
  { id: "snack", name: "Beach Fuel Bar", short: "Fuel Bar", icon: "◉", color: "#b3dc65", pitch: "Fresh snacks for the promenade crowd." },
  { id: "merch", name: "Nova Supply Co.", short: "Merch", icon: "◆", color: "#67c7c4", pitch: "Campus gear with stronger margins." }
]);

export const STORE_UNLOCKS = Object.freeze({ cafe:0, snack:12000, merch:28000 });

export const CATALOGUE = Object.freeze([
  { id: "coldBrew", storeId: "cafe", tier: 1, name: "Atlantic Cold Brew", short: "Cold Brew", icon: "☕", cost: 200, reference: 400, color: "#e98a55" },
  { id: "nata", storeId: "cafe", tier: 2, name: "Pastel de Nata", short: "Nata", icon: "✦", cost: 120, reference: 250, color: "#efbd58" },
  { id: "toastie", storeId: "cafe", tier: 3, name: "Campus Toastie", short: "Toastie", icon: "▰", cost: 300, reference: 650, color: "#d77c4c" },
  { id: "acai", storeId: "snack", tier: 1, name: "Surf Açaí Cup", short: "Açaí Cup", icon: "◉", cost: 300, reference: 600, color: "#a979bd" },
  { id: "water", storeId: "snack", tier: 2, name: "Lemon Water", short: "Lemon Water", icon: "◇", cost: 80, reference: 200, color: "#8dcae5" },
  { id: "bites", storeId: "snack", tier: 3, name: "Energy Bites", short: "Energy Bites", icon: "●", cost: 150, reference: 350, color: "#9fbb55" },
  { id: "tote", storeId: "merch", tier: 1, name: "Nova Wave Tote", short: "Wave Tote", icon: "▱", cost: 500, reference: 1000, color: "#58bdb4" },
  { id: "cap", storeId: "merch", tier: 2, name: "Carcavelos Cap", short: "Campus Cap", icon: "⌒", cost: 700, reference: 1500, color: "#5a90ad" },
  { id: "hoodie", storeId: "merch", tier: 3, name: "Nova Coast Hoodie", short: "Hoodie", icon: "⌂", cost: 1400, reference: 3000, color: "#4a687e" }
]);

export function createRun() {
  const stock = {}, prices = {};
  CATALOGUE.forEach(product => { stock[product.id] = 0; prices[product.id] = product.reference; });
  return { version: 2, cash: INITIAL_CASH, stock, prices, currentDay: 1, completed: false, history: [], purchases: [], venues: { cafe: 1, snack: 0, merch: 0 }, reputation: 0, upgrades: [], facilities: [], staff: { caretaker:0, technician:0, host:0 }, clockMinutes:DAY_START, speed:1, today:createToday(), salesProgress:{}, visitorProgress:0, totalSales:0, totalVisitors:0, totalCampusInteractions:0, facilityUsage:{}, venueVisits:{}, player: { x: 21, y: 18, zone: "campus" } };
}

function createToday(){return {revenue:0,cogs:0,unitsSold:0,visitors:0,products:{},activities:{}};}

const GUEST_RELIEF = Object.freeze({
  bench:{energy:42,mood:10}, water:{thirst:70}, restroom:{bladder:78}, foodGarden:{hunger:62,mood:16},
  scenery:{mood:18}, experience:{mood:62,energy:-8}, cafe:{hunger:35,energy:46,thirst:12},
  snack:{hunger:48,thirst:36}, merch:{mood:28}, academy:{mood:8}, hub:{mood:22}, forum:{mood:26}
});

function guestNeed(needs,key,fallback=35){const value=Number(needs?.[key]);return Number.isFinite(value)?Math.max(0,Math.min(100,value)):fallback;}

export function guestDestinationOptions(run,needs={},seed=0){
  const hunger=guestNeed(needs,"hunger"),thirst=guestNeed(needs,"thirst"),bladder=guestNeed(needs,"bladder"),energy=guestNeed(needs,"energy"),mood=guestNeed(needs,"mood");
  const options=[
    {kind:"landmark",id:"academy",label:"Academic Wing",score:18+((seed+1)%7)},
    {kind:"landmark",id:"hub",label:"Student Hub",score:13+mood*.34+((seed+3)%6)},
    {kind:"landmark",id:"forum",label:"Sunset Forum",score:12+mood*.4+((seed+5)%8)}
  ];
  for(const facility of run.facilities||[]){
    let score=8;
    if(facility.type==="bench")score+=energy*1.08+mood*.18;
    else if(facility.type==="water")score+=thirst*1.35;
    else if(facility.type==="restroom")score+=bladder*1.5;
    else if(facility.type==="foodGarden")score+=hunger*1.28+mood*.22;
    else if(facility.type==="experience")score+=mood*1.08+attractionStats(facility.modules).excitement*.42;
    else if(facility.type==="scenery")score+=mood*.48;
    else if(facility.type==="path")continue;
    else score+=12;
    options.push({kind:"facility",id:facility.id,type:facility.type,label:facility.name,score});
  }
  for(const store of STORES){
    if((run.venues?.[store.id]??0)<1)continue;
    const products=CATALOGUE.filter(product=>product.storeId===store.id&&run.stock?.[product.id]>0);
    if(!products.length)continue;
    let score=10;
    if(store.id==="cafe")score+=hunger*.68+energy*.82+thirst*.18;
    else if(store.id==="snack")score+=hunger*.92+thirst*.6;
    else score+=mood*.52+12;
    options.push({kind:"store",id:store.id,label:store.name,score,productIds:products.map(product=>product.id)});
  }
  return options.sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id));
}

export function applyGuestNeedRelief(needs={},destinationType){
  const next={hunger:guestNeed(needs,"hunger",0),thirst:guestNeed(needs,"thirst",0),bladder:guestNeed(needs,"bladder",0),energy:guestNeed(needs,"energy",0),mood:guestNeed(needs,"mood",0)};
  for(const [key,value] of Object.entries(GUEST_RELIEF[destinationType]||{}))next[key]=Math.max(0,Math.min(100,next[key]-value));
  return next;
}

export function recordGuestActivity(run,destination){
  if(!destination?.id||!destination.kind)throw new Error("Choose a valid guest destination.");
  const next=structuredClone(run);if(!next.today)next.today=createToday();if(!next.today.activities)next.today.activities={};
  const key=`${destination.kind}:${destination.id}`;next.today.activities[key]=(next.today.activities[key]||0)+1;
  next.totalCampusInteractions=(next.totalCampusInteractions||0)+1;
  if(destination.kind==="facility"){if(!next.facilityUsage)next.facilityUsage={};next.facilityUsage[destination.id]=(next.facilityUsage[destination.id]||0)+1;}
  if(destination.kind==="store"){if(!next.venueVisits)next.venueVisits={};next.venueVisits[destination.id]=(next.venueVisits[destination.id]||0)+1;}
  return next;
}

export function attractionStats(moduleIds=[]) {
  const modules=moduleIds.map(id=>EXPERIENCE_MODULES.find(item=>item.id===id)).filter(Boolean);
  return {
    excitement:Math.min(100,modules.reduce((sum,item)=>sum+item.excitement,0)),
    intensity:Math.min(100,modules.reduce((sum,item)=>sum+item.intensity,0)),
    comfort:Math.max(0,Math.min(100,42+modules.reduce((sum,item)=>sum+item.comfort,0))),
    cost:modules.reduce((sum,item)=>sum+item.cost,0)
  };
}

export function campusMetrics(run) {
  const needs={ hunger:42, thirst:39, bladder:44, energy:46, mood:47, cleanliness:52 };
  for(const facility of run.facilities||[]){
    const blueprint=FACILITY_CATALOGUE.find(item=>item.id===facility.type);
    if(blueprint) Object.entries(blueprint.needs||{}).forEach(([key,value])=>needs[key]+=value);
  }
  const staff=run.staff||{};
  needs.cleanliness+=(staff.caretaker||0)*15;
  needs.mood+=(staff.host||0)*12;
  needs.energy+=(staff.host||0)*4;
  Object.keys(needs).forEach(key=>needs[key]=Math.max(0,Math.min(100,needs[key])));
  const experiences=(run.facilities||[]).filter(item=>item.type==="experience");
  const attraction=experiences.reduce((best,item)=>{const stats=attractionStats(item.modules);return stats.excitement>best.excitement?stats:best;},{excitement:0,intensity:0,comfort:42,cost:0});
  attraction.comfort=Math.min(100,attraction.comfort+(staff.technician||0)*9);
  const satisfaction=Math.round(Object.values(needs).reduce((sum,value)=>sum+value,0)/Object.keys(needs).length);
  const intensityFit=attraction.intensity<=70?10:Math.max(-18,10-(attraction.intensity-70));
  const rating=Math.max(0,Math.min(100,Math.round(satisfaction*.72+Math.min(100,attraction.excitement+20)*.18+intensityFit)));
  const guests=Math.max(12,Math.round(12+rating*.28+(run.facilities||[]).length*1.5+(staff.host||0)*3+attraction.excitement*.12));
  return { needs, satisfaction, rating, guests, attraction };
}

export function facilityFootprint(type,rotation=0) {
  const base=FACILITY_FOOTPRINTS[type]||{width:1,height:1},turn=((Number(rotation)||0)%4+4)%4;
  return turn%2?{width:base.height,height:base.width}:{...base};
}

function facilityOverlap(a,b) {
  const af=facilityFootprint(a.type,a.rotation),bf=facilityFootprint(b.type,b.rotation);
  return Math.abs(a.x-b.x)<(af.width+bf.width)/2+.08&&Math.abs(a.y-b.y)<(af.height+bf.height)/2+.08;
}

export function placeFacility(run,type,x,y,moduleIds=[],rotation=0) {
  if(!Number.isFinite(x)||!Number.isFinite(y)) throw new Error("Choose a valid campus tile.");
  const turn=((Number(rotation)||0)%4+4)%4;
  const candidate={type,x,y,rotation:turn};
  if((run.facilities||[]).some(item=>facilityOverlap(item,candidate))) throw new Error("That footprint overlaps another facility.");
  let cost,name,modules=[];
  if(type==="experience"){
    modules=[...new Set(moduleIds)].filter(id=>EXPERIENCE_MODULES.some(item=>item.id===id));
    if(!modules.length) throw new Error("Choose at least one attraction module.");
    cost=1200+attractionStats(modules).cost;name="Custom Beach Experience";
  }else{
    const blueprint=FACILITY_CATALOGUE.find(item=>item.id===type);if(!blueprint)throw new Error("Unknown facility.");
    cost=blueprint.cost;name=blueprint.name;
  }
  if(run.cash<cost) throw new Error(`You need ${formatEuro(cost)} but only have ${formatEuro(run.cash)}.`);
  const next=structuredClone(run);if(!Array.isArray(next.facilities))next.facilities=[];
  next.cash-=cost;next.facilities.push({id:`facility-${Date.now()}-${next.facilities.length}`,type,name,x,y,rotation:turn,modules,builtDay:run.currentDay,cost});
  return next;
}

export function moveFacility(run,facilityId,x,y,rotation=0) {
  if(!Number.isFinite(x)||!Number.isFinite(y))throw new Error("Choose a valid campus tile.");
  const source=(run.facilities||[]).find(item=>item.id===facilityId);if(!source)throw new Error("That facility no longer exists.");
  const turn=((Number(rotation)||0)%4+4)%4,candidate={...source,x,y,rotation:turn};
  if((run.facilities||[]).some(item=>item.id!==facilityId&&facilityOverlap(item,candidate)))throw new Error("That footprint overlaps another facility.");
  const next=structuredClone(run),target=next.facilities.find(item=>item.id===facilityId);target.x=x;target.y=y;target.rotation=turn;return next;
}

export function demolishFacility(run,facilityId) {
  const source=(run.facilities||[]).find(item=>item.id===facilityId);if(!source)throw new Error("That facility no longer exists.");
  const next=structuredClone(run),refund=Math.floor((source.cost||0)*.4);next.facilities=next.facilities.filter(item=>item.id!==facilityId);next.cash+=refund;
  if(!Array.isArray(next.demolitions))next.demolitions=[];next.demolitions.push({facilityId,name:source.name,day:run.currentDay,refund});return next;
}

export function hireStaff(run,staffId,now=new Date().toISOString()) {
  const role=STAFF_CATALOGUE.find(item=>item.id===staffId);if(!role)throw new Error("Unknown staff role.");
  if(run.cash<role.cost) throw new Error(`You need ${formatEuro(role.cost)} but only have ${formatEuro(run.cash)}.`);
  const next=structuredClone(run);if(!next.staff)next.staff={caretaker:0,technician:0,host:0};
  next.cash-=role.cost;next.staff[staffId]=(next.staff[staffId]||0)+1;
  if(!Array.isArray(next.staffHires))next.staffHires=[];next.staffHires.push({at:now,day:run.currentDay,staffId,cost:role.cost});
  return next;
}

export function demandFor(price, reference) {
  if (!Number.isInteger(price) || price <= 0) throw new Error("Price must be positive and use at most two decimal places.");
  if (price <= reference) return 10;
  if (price <= reference * 2) return 5;
  return 0;
}

export function parseEuro(value) {
  const clean = String(value).trim().replace(",", ".");
  if (!/^\d+(?:\.\d{1,2})?$/.test(clean)) throw new Error("Enter a positive euro amount with up to two decimals.");
  const cents = Math.round(Number(clean) * 100);
  if (cents <= 0) throw new Error("Price must be greater than €0.00.");
  return cents;
}

export function buyStock(run, productId, quantity, now = new Date().toISOString()) {
  if (!Number.isInteger(quantity) || quantity <= 0) throw new Error("Quantity must be a positive whole number.");
  const product = CATALOGUE.find(item => item.id === productId);
  if (!product) throw new Error("Unknown product.");
  if ((run.venues?.[product.storeId] ?? 0) < (product.tier || 1)) throw new Error(`Open or upgrade this venue to level ${product.tier} to unlock ${product.name}.`);
  const total = product.cost * quantity;
  if (total > run.cash) throw new Error(`You need ${formatEuro(total)} but only have ${formatEuro(run.cash)}.`);
  const next = structuredClone(run);
  next.cash -= total;
  next.stock[productId] += quantity;
  next.purchases.push({ at: now, day: run.currentDay, productId, quantity, total });
  return next;
}

export function setPrice(run, productId, cents) {
  if (!Number.isInteger(cents) || cents <= 0) throw new Error("Price must be positive and use at most two decimals.");
  if (!CATALOGUE.some(item => item.id === productId)) throw new Error("Unknown product.");
  const next = structuredClone(run);
  next.prices[productId] = cents;
  return next;
}

export function unlockVenue(run,storeId,now=new Date().toISOString()){
  if(!STORES.some(store=>store.id===storeId))throw new Error("Unknown venue.");
  if((run.venues?.[storeId]??0)>0)throw new Error("This venue is already open.");
  const cost=STORE_UNLOCKS[storeId];if(run.cash<cost)throw new Error(`You need ${formatEuro(cost)} to open this venue.`);
  const next=structuredClone(run);next.cash-=cost;next.venues[storeId]=1;
  if(!Array.isArray(next.venuePurchases))next.venuePurchases=[];next.venuePurchases.push({at:now,day:run.currentDay,storeId,cost});
  return next;
}

export function crowdPeak(minutes){
  if(minutes>=450&&minutes<570)return {id:"arrival",label:"Morning arrival",multiplier:2.15};
  if(minutes>=690&&minutes<840)return {id:"lunch",label:"Lunch rush",multiplier:2.55};
  if(minutes>=990&&minutes<1110)return {id:"evening",label:"After-class wave",multiplier:1.75};
  return {id:"steady",label:"Steady campus flow",multiplier:.62};
}

export function advanceTycoon(run,minutes){
  const next=structuredClone(run);ensureTycoonState(next);let remaining=Math.max(0,minutes);
  while(remaining>.001){
    const untilClose=DAY_END-next.clockMinutes,step=Math.min(5,remaining,untilClose);
    if(step<=0){closeTycoonDay(next);continue;}
    processSlice(next,step);next.clockMinutes+=step;remaining-=step;
    if(next.clockMinutes>=DAY_END-.001)closeTycoonDay(next);
  }
  return next;
}

function ensureTycoonState(run){
  if(!Number.isFinite(run.clockMinutes))run.clockMinutes=DAY_START;
  if(!run.today)run.today=createToday();if(!run.today.products)run.today.products={};if(!run.today.activities)run.today.activities={};
  if(!run.salesProgress)run.salesProgress={};if(!Number.isFinite(run.visitorProgress))run.visitorProgress=0;
  if(!Number.isInteger(run.totalSales))run.totalSales=run.history?.reduce((sum,day)=>sum+(day.totals?.unitsSold||0),0)||0;
  if(!Number.isInteger(run.totalVisitors))run.totalVisitors=run.history?.reduce((sum,day)=>sum+(day.campus?.guests||0),0)||0;
}

function processSlice(run,minutes){
  const metrics=campusMetrics(run),peak=crowdPeak(run.clockMinutes),campusFactor=Math.max(.45,metrics.guests/24);
  run.visitorProgress+=metrics.guests*peak.multiplier*minutes/115;
  const arrived=Math.floor(run.visitorProgress);run.visitorProgress-=arrived;run.today.visitors+=arrived;run.totalVisitors+=arrived;
  for(const product of CATALOGUE){
    const level=run.venues?.[product.storeId]??0;if(level<(product.tier||1))continue;
    const base=demandFor(run.prices[product.id],product.reference),venueFactor=1+(level-1)*.34;
    run.salesProgress[product.id]=(run.salesProgress[product.id]||0)+base*campusFactor*venueFactor*peak.multiplier*minutes/720;
    let units=Math.min(run.stock[product.id],Math.floor(run.salesProgress[product.id]));
    if(units<=0){if(run.stock[product.id]<=0)run.salesProgress[product.id]=Math.min(.95,run.salesProgress[product.id]);continue;}
    run.salesProgress[product.id]-=units;const revenue=units*run.prices[product.id],cogs=units*product.cost;
    run.stock[product.id]-=units;run.cash+=revenue;run.today.revenue+=revenue;run.today.cogs+=cogs;run.today.unitsSold+=units;run.totalSales+=units;
    const row=run.today.products[product.id]||{unitsSold:0,revenue:0,cogs:0};row.unitsSold+=units;row.revenue+=revenue;row.cogs+=cogs;run.today.products[product.id]=row;
  }
}

function closeTycoonDay(run){
  const metrics=campusMetrics(run),items=CATALOGUE.map(product=>{const row=run.today.products[product.id]||{unitsSold:0,revenue:0,cogs:0};return {productId:product.id,unitsSold:row.unitsSold,demand:null,price:run.prices[product.id],revenue:row.revenue,cogs:row.cogs,grossProfit:row.revenue-row.cogs};});
  const totals={unitsSold:run.today.unitsSold,revenue:run.today.revenue,cogs:run.today.cogs,grossProfit:run.today.revenue-run.today.cogs};
  run.history.push({day:run.currentDay,eventId:crowdPeak(720).id,completedAt:new Date().toISOString(),items,totals,closingCash:run.cash,campus:{...metrics,guests:run.today.visitors,activities:{...(run.today.activities||{})}}});
  run.reputation=(run.reputation||0)+Math.max(0,Math.floor(totals.grossProfit/300))+Math.floor(metrics.rating/25);run.currentDay+=1;run.clockMinutes=DAY_START;run.today=createToday();
  if(run.history.length>60)run.history=run.history.slice(-60);
}

export function inventoryValue(run) {
  return CATALOGUE.reduce((sum, product) => sum + run.stock[product.id] * product.cost, 0);
}

export function overallResult(run) { return run.cash + inventoryValue(run) - INITIAL_CASH; }
export function formatEuro(cents) { return new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" }).format(cents / 100); }

export function upgradeVenue(run, storeId, now = new Date().toISOString()) {
  if (!STORES.some(store => store.id === storeId)) throw new Error("Unknown venue.");
  const level = run.venues?.[storeId] ?? 0;
  if(level===0)throw new Error("Open this venue before upgrading it.");
  if (level >= 3) throw new Error("This venue is already at the maximum level.");
  const cost = level === 1 ? 1500 : 2500;
  if (run.cash < cost) throw new Error(`You need ${formatEuro(cost)} to upgrade this venue.`);
  const next = structuredClone(run);
  if (!next.venues) next.venues = { cafe: 1, snack: 1, merch: 1 };
  next.cash -= cost;
  next.venues[storeId] = level + 1;
  if (!Array.isArray(next.upgrades)) next.upgrades = [];
  next.upgrades.push({ at: now, day: run.currentDay, storeId, fromLevel: level, toLevel: level + 1, cost });
  next.reputation = (next.reputation || 0) + 5;
  return next;
}
