export const INITIAL_CASH = 10000;
export const STORAGE_KEY = "nova-beach-ventures-v1";
export const DAY_START = 450;
export const DAY_END = 1170;

export const CAMPUS_DAY_PHASES = Object.freeze([
  {id:"arrival",name:"Morning arrival",short:"ARRIVAL",start:450,end:570,multiplier:2.15,color:"#f6c868",description:"Students stream through the gates before first lectures."},
  {id:"lecture-am",name:"Lecture block",short:"LECTURES",start:570,end:690,multiplier:.48,color:"#7eb7c5",description:"Most students are in class; queues settle and operators restock."},
  {id:"lunch",name:"Lunch rush",short:"LUNCH RUSH",start:690,end:840,multiplier:2.55,color:"#ff8a61",description:"The whole campus spills onto the promenade for food and drinks."},
  {id:"lecture-pm",name:"Afternoon lectures",short:"LECTURES",start:840,end:990,multiplier:.58,color:"#73a9bd",description:"Footfall falls while the second lecture block is running."},
  {id:"break",name:"Afternoon break",short:"BREAK",start:990,end:1050,multiplier:1.75,color:"#b9dc69",description:"A compact rush forms between the last classes of the day."},
  {id:"sunset",name:"Sunset social",short:"SUNSET",start:1050,end:1170,multiplier:1.3,color:"#ec765f",description:"The campus moves toward the beach, bars and live events."}
]);

export const DEFAULT_STORE_HOURS = Object.freeze({
  cafe:{open:450,close:1080}, snack:{open:540,close:1140}, merch:{open:600,close:1050}, beach:{open:660,close:1170}, surf:{open:510,close:1110}
});

export const DELIVERY_WINDOWS = Object.freeze([
  {id:"morning",minute:495,label:"Morning van"},
  {id:"midday",minute:735,label:"Midday cargo bike"},
  {id:"afternoon",minute:975,label:"Afternoon van"}
]);

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
  { id:"service", name:"Queue Lead", icon:"↗", cost:900, level:2, description:"Moves shop queues faster and keeps guests from walking away." },
  { id:"caretaker", name:"Campus Caretaker", icon:"⌁", cost:1000, level:2, description:"Improves cleanliness across every unlocked district." },
  { id:"technician", name:"Experience Technician", icon:"⚙", cost:1200, level:3, description:"Handles repairs and raises attraction comfort." },
  { id:"host", name:"Student Host", icon:"◎", cost:1400, level:4, description:"Guides visitors toward shops and campus amenities." },
  { id:"entertainer", name:"Coast Entertainer", icon:"★", cost:1800, level:6, description:"Raises happiness and makes live events draw a larger crowd." }
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
  { id: "merch", name: "Nova Merch Lab", short: "Merch Lab", icon: "◆", color: "#67c7c4", pitch: "Campus gear with stronger margins." },
  { id: "beach", name: "Maré Beach Bar", short: "Beach Bar", icon: "☀", color: "#f2b94b", pitch: "Cold coastal drinks on the expanded eastern promenade." },
  { id: "surf", name: "Carcavelos Surf Shack", short: "Surf Shack", icon: "≈", color: "#479fb5", pitch: "Beach essentials and surf-day rentals beside the new pier." }
]);

export const STORE_UNLOCKS = Object.freeze({ cafe:0, snack:12000, merch:28000, beach:40000, surf:65000 });
export const STORE_REQUIREMENTS = Object.freeze({ cafe:1, snack:2, merch:4, beach:6, surf:8 });
export const DISTRICT_CATALOGUE = Object.freeze([
  {id:"east",name:"East Promenade",level:5,cost:45000,color:"#f2b94b",description:"Acquire the land to the right of campus and unlock the Beach Bar plus event lawn."},
  {id:"pier",name:"Ocean Pier",level:8,cost:85000,color:"#479fb5",description:"Extend beyond the promenade with a surf retail plot and high-capacity event pier."}
]);
export const EVENT_CATALOGUE = Object.freeze([
  {id:"sunset",name:"Sunset Sessions",icon:"♫",level:7,cost:3500,duration:180,guestBonus:16,moodBonus:12,description:"A compact DJ event that creates an evening crowd spike."},
  {id:"market",name:"Founders Market",icon:"◇",level:8,cost:5000,duration:240,guestBonus:22,moodBonus:9,description:"Student brands and food pop-ups pull visitors toward every open store."},
  {id:"surfCup",name:"Nova Surf Cup",icon:"≈",level:9,cost:8500,duration:300,guestBonus:34,moodBonus:16,description:"A flagship beach event with the strongest visitor draw."}
]);
export const DJ_EVENT_SLOTS = Object.freeze([
  {id:"afternoon",name:"Afternoon Session",startMinute:870,duration:120,demand:1,noiseFactor:.9,description:"A lower-risk daytime set between classes."},
  {id:"sunset",name:"Sunset Session",startMinute:1035,duration:120,demand:1.2,noiseFactor:1.08,description:"A premium golden-hour slot with stronger demand."}
]);
export const DJ_STYLES = Object.freeze([
  {id:"house",name:"Atlantic House",color:"#64cbc8",appeal:1.12,excitement:26,noise:68,comfort:-4,description:"High-energy coastal house with a louder footprint."},
  {id:"sunset",name:"Sunset Grooves",color:"#f5c95e",appeal:1.05,excitement:18,noise:48,comfort:10,description:"Warm disco and soul built for long, comfortable stays."},
  {id:"pop",name:"Campus Pop",color:"#ff8060",appeal:1.18,excitement:21,noise:58,comfort:3,description:"Broad appeal and reliable turnout at a balanced intensity."},
  {id:"indie",name:"Indie Waves",color:"#9a7bc1",appeal:.94,excitement:14,noise:42,comfort:14,description:"A calmer niche set that protects comfort and rating."}
]);
export const DJ_ROSTER = Object.freeze([
  {id:"ines",name:"Inês Vale",tag:"Campus resident",hireCost:900,eventFee:180,appeal:.94,excitement:3,description:"Affordable and dependable for a first event programme."},
  {id:"marco",name:"Marco Luz",tag:"Lisbon selector",hireCost:2400,eventFee:420,appeal:1.1,excitement:9,description:"A recognisable local name with a stronger crowd pull."},
  {id:"luma",name:"LUMA",tag:"Coast headliner",hireCost:4800,eventFee:850,appeal:1.3,excitement:16,description:"Expensive, exciting and capable of filling an upgraded deck."}
]);
export const DJ_UPGRADES = Object.freeze([
  {id:"speakers",name:"Sound System",icon:"◖",costs:[1800,3200,5200],excitement:8,noise:7,comfort:0,capacity:0,operating:80,description:"More impact and reach, but more noise to manage."},
  {id:"lighting",name:"Stage Lighting",icon:"✦",costs:[1400,2600,4200],excitement:7,noise:0,comfort:1,capacity:0,operating:60,description:"Raises spectacle without disturbing nearby spaces."},
  {id:"shade",name:"Canvas Shade",icon:"⌂",costs:[1200,2200,3600],excitement:0,noise:0,comfort:11,capacity:0,operating:30,description:"Keeps afternoon crowds comfortable for longer."},
  {id:"capacity",name:"Crowd Deck",icon:"◎",costs:[2000,3600,6000],excitement:2,noise:2,comfort:-1,capacity:15,operating:70,description:"Expands the safe standing area and ticket ceiling."}
]);
export const PROGRESSION_LEVELS = Object.freeze([
  {level:1,xp:0,title:"Café Starter",unlock:"Atlantic Café"},{level:2,xp:50,title:"Campus Operator",unlock:"Fuel Bar + queue staff"},
  {level:3,xp:130,title:"Amenity Builder",unlock:"Food Garden + repair staff"},{level:4,xp:240,title:"Retail Founder",unlock:"Merch Lab + student hosts"},
  {level:5,xp:380,title:"District Developer",unlock:"East Promenade land"},{level:6,xp:560,title:"Beach Entrepreneur",unlock:"Maré Beach Bar + entertainers"},
  {level:7,xp:780,title:"Event Producer",unlock:"Coastline event venue"},{level:8,xp:1050,title:"Coastal Magnate",unlock:"Ocean Pier + Surf Shack"},
  {level:9,xp:1380,title:"Campus Icon",unlock:"Nova Surf Cup"},{level:10,xp:1750,title:"Nova Legend",unlock:"Maximum prestige"}
]);

export const CATALOGUE = Object.freeze([
  { id: "coldBrew", storeId: "cafe", tier: 1, name: "Atlantic Cold Brew", short: "Cold Brew", icon: "☕", cost: 200, reference: 400, color: "#e98a55" },
  { id: "nata", storeId: "cafe", tier: 2, name: "Pastel de Nata", short: "Nata", icon: "✦", cost: 120, reference: 250, color: "#efbd58" },
  { id: "toastie", storeId: "cafe", tier: 3, name: "Campus Toastie", short: "Toastie", icon: "▰", cost: 300, reference: 650, color: "#d77c4c" },
  { id: "acai", storeId: "snack", tier: 1, name: "Surf Açaí Cup", short: "Açaí Cup", icon: "◉", cost: 300, reference: 600, color: "#a979bd" },
  { id: "water", storeId: "snack", tier: 2, name: "Lemon Water", short: "Lemon Water", icon: "◇", cost: 80, reference: 200, color: "#8dcae5" },
  { id: "bites", storeId: "snack", tier: 3, name: "Energy Bites", short: "Energy Bites", icon: "●", cost: 150, reference: 350, color: "#9fbb55" },
  { id: "tote", storeId: "merch", tier: 1, name: "Nova Wave Tote", short: "Wave Tote", icon: "▱", cost: 500, reference: 1000, color: "#58bdb4" },
  { id: "cap", storeId: "merch", tier: 2, name: "Carcavelos Cap", short: "Campus Cap", icon: "⌒", cost: 700, reference: 1500, color: "#5a90ad" },
  { id: "hoodie", storeId: "merch", tier: 3, name: "Nova Coast Hoodie", short: "Hoodie", icon: "⌂", cost: 1400, reference: 3000, color: "#4a687e" },
  { id: "tonic", storeId: "beach", tier: 1, name: "Espresso Tonic", short: "Tonic", icon: "☀", cost: 180, reference: 450, color: "#e4a83f" },
  { id: "lime", storeId: "beach", tier: 2, name: "Atlantic Lime Soda", short: "Lime Soda", icon: "◇", cost: 100, reference: 320, color: "#9dcc63" },
  { id: "sunsetCup", storeId: "beach", tier: 3, name: "Sunset Fruit Cup", short: "Fruit Cup", icon: "●", cost: 220, reference: 550, color: "#ef7c59" },
  { id: "wax", storeId: "surf", tier: 1, name: "Carcavelos Board Wax", short: "Board Wax", icon: "≈", cost: 260, reference: 650, color: "#5eb9c8" },
  { id: "towel", storeId: "surf", tier: 2, name: "Nova Beach Towel", short: "Beach Towel", icon: "▰", cost: 650, reference: 1450, color: "#4b91aa" },
  { id: "boardPass", storeId: "surf", tier: 3, name: "Surf Board Day Pass", short: "Board Pass", icon: "↗", cost: 1200, reference: 2800, color: "#2d7188" }
]);

export function createRun() {
  const stock = {}, prices = {};
  CATALOGUE.forEach(product => { stock[product.id] = 0; prices[product.id] = product.reference; });
  return { version: 2, cash: INITIAL_CASH, stock, prices, currentDay: 1, completed: false, history: [], purchases: [], deliveries:[], storeHours:structuredClone(DEFAULT_STORE_HOURS), venues: { cafe: 1, snack: 0, merch: 0, beach:0, surf:0 }, districts:{coast:1,east:0,pier:0}, eventVenue:0, activeEvent:null, scheduledEvent:null, djOperations:{deckId:null,slotId:"sunset",styleId:"sunset",ticketPrice:600,djId:null,upgrades:{speakers:0,lighting:0,shade:0,capacity:0},lifetimeAttendance:0,lifetimeRevenue:0}, reputation: 0, upgrades: [], facilities: [], staff: { service:0, caretaker:0, technician:0, host:0, entertainer:0 }, clockMinutes:DAY_START, speed:1, today:createToday(), salesProgress:{}, visitorProgress:0, totalSales:0, totalVisitors:0, totalCampusInteractions:0, facilityUsage:{}, venueVisits:{}, guestEconomy:{purchases:0,spend:0,walkaways:0}, player: { x: 21, y: 18, zone: "campus" } };
}

function createToday(){return {revenue:0,cogs:0,unitsSold:0,visitors:0,eventRevenue:0,eventCosts:0,eventAttendance:0,products:{},activities:{},deliveries:[]};}

function ensureDjOperations(run){if(!run.djOperations)run.djOperations={deckId:null,slotId:"sunset",styleId:"sunset",ticketPrice:600,djId:null,upgrades:{},lifetimeAttendance:0,lifetimeRevenue:0};if(!run.djOperations.upgrades)run.djOperations.upgrades={};for(const item of DJ_UPGRADES)if(!Number.isInteger(run.djOperations.upgrades[item.id]))run.djOperations.upgrades[item.id]=0;if(!Number.isInteger(run.djOperations.ticketPrice)||run.djOperations.ticketPrice<=0)run.djOperations.ticketPrice=600;if(!DJ_EVENT_SLOTS.some(item=>item.id===run.djOperations.slotId))run.djOperations.slotId="sunset";if(!DJ_STYLES.some(item=>item.id===run.djOperations.styleId))run.djOperations.styleId="sunset";}
function djDeckExists(run,deckId){return deckId==="pavilion"?Boolean(run.eventVenue):(run.facilities||[]).some(item=>item.id===deckId&&item.type==="experience"&&(item.modules||[]).includes("music"));}
function priceDemandFactor(price){const ratio=price/800;if(ratio<=.75)return 1.18;if(ratio<=1)return 1.08;if(ratio<=1.5)return 1.08-(ratio-1)*.72;if(ratio<=2)return .72-(ratio-1.5)*.64;return .18;}

export function djEventProjection(run,overrides={}){
  const ops=structuredClone(run.djOperations||{}),mergedUpgrades={speakers:0,lighting:0,shade:0,capacity:0,...ops.upgrades,...overrides.upgrades};Object.assign(ops,overrides);ops.upgrades=mergedUpgrades;
  const slot=DJ_EVENT_SLOTS.find(item=>item.id===ops.slotId)||DJ_EVENT_SLOTS[1],style=DJ_STYLES.find(item=>item.id===ops.styleId)||DJ_STYLES[1],dj=DJ_ROSTER.find(item=>item.id===ops.djId)||null;
  const upgrade=id=>Math.max(0,Math.min(3,ops.upgrades?.[id]||0)),capacity=24+upgrade("capacity")*15;
  const excitement=Math.min(100,style.excitement+(dj?.excitement||0)+upgrade("speakers")*8+upgrade("lighting")*7+upgrade("capacity")*2);
  const noise=Math.min(100,Math.round((style.noise+upgrade("speakers")*7+upgrade("capacity")*2)*slot.noiseFactor));
  const comfort=Math.max(0,Math.min(100,58+style.comfort+upgrade("shade")*11+upgrade("lighting")-upgrade("capacity")-Math.max(0,noise-72)*.45));
  const operatingCost=300+(dj?.eventFee||0)+DJ_UPGRADES.reduce((sum,item)=>sum+upgrade(item.id)*item.operating,0),ticketPrice=Math.max(1,Number(ops.ticketPrice)||600);
  const baseGuests=campusMetrics(run).guests,expectedAttendance=Math.max(4,Math.min(capacity,Math.round((baseGuests*.72+excitement*.25+comfort*.08)*(dj?.appeal||.72)*style.appeal*slot.demand*priceDemandFactor(ticketPrice))));
  const expectedRevenue=expectedAttendance*ticketPrice,expectedProfit=expectedRevenue-operatingCost;
  return {slot,style,dj,ticketPrice,capacity,excitement,noise,comfort,operatingCost,expectedAttendance,expectedRevenue,expectedProfit,guestBonus:Math.max(4,Math.round(expectedAttendance/3)),moodBonus:Math.max(2,Math.round((excitement+comfort-noise*.35)/12))};
}

export function configureDjOperations(run,changes={}){const next=structuredClone(run);ensureDjOperations(next);if(changes.deckId!==undefined){if(!djDeckExists(next,changes.deckId))throw new Error("Choose a built DJ deck.");next.djOperations.deckId=changes.deckId;}if(changes.slotId!==undefined){if(!DJ_EVENT_SLOTS.some(item=>item.id===changes.slotId))throw new Error("Choose a valid event time.");next.djOperations.slotId=changes.slotId;}if(changes.styleId!==undefined){if(!DJ_STYLES.some(item=>item.id===changes.styleId))throw new Error("Choose a valid music style.");next.djOperations.styleId=changes.styleId;}if(changes.ticketPrice!==undefined){if(!Number.isInteger(changes.ticketPrice)||changes.ticketPrice<=0)throw new Error("Ticket price must be a positive euro amount with at most two decimals.");next.djOperations.ticketPrice=changes.ticketPrice;}return next;}
export function hireDj(run,djId,deckId,now=new Date().toISOString()){const dj=DJ_ROSTER.find(item=>item.id===djId);if(!dj)throw new Error("Choose a valid DJ.");const next=configureDjOperations(run,{deckId});if(next.cash<dj.hireCost)throw new Error(`You need ${formatEuro(dj.hireCost)} to hire ${dj.name}.`);next.cash-=dj.hireCost;next.djOperations.djId=dj.id;if(!Array.isArray(next.djHires))next.djHires=[];next.djHires.push({at:now,day:run.currentDay,djId,deckId,cost:dj.hireCost});return next;}
export function upgradeDjDeck(run,upgradeId,deckId,now=new Date().toISOString()){const item=DJ_UPGRADES.find(entry=>entry.id===upgradeId);if(!item)throw new Error("Unknown deck upgrade.");const next=configureDjOperations(run,{deckId}),level=next.djOperations.upgrades[upgradeId]||0;if(level>=3)throw new Error("This deck upgrade is already at maximum level.");const cost=item.costs[level];if(next.cash<cost)throw new Error(`You need ${formatEuro(cost)} for this upgrade.`);next.cash-=cost;next.djOperations.upgrades[upgradeId]=level+1;if(!Array.isArray(next.djUpgrades))next.djUpgrades=[];next.djUpgrades.push({at:now,day:run.currentDay,deckId,upgradeId,fromLevel:level,toLevel:level+1,cost});return next;}
export function scheduleDjEvent(run,deckId,now=new Date().toISOString()){const next=configureDjOperations(run,{deckId});if(next.activeEvent)throw new Error("Another event is already live.");if(next.scheduledEvent)throw new Error("An event is already scheduled.");if(!next.djOperations.djId)throw new Error("Hire a DJ before scheduling an event.");const projection=djEventProjection(next);if(next.cash<projection.operatingCost)throw new Error(`You need ${formatEuro(projection.operatingCost)} to operate this event.`);const eventDay=next.clockMinutes<projection.slot.startMinute-10?next.currentDay:next.currentDay+1;next.cash-=projection.operatingCost;next.scheduledEvent={id:"dj-event",name:`${projection.style.name} · ${projection.slot.name}`,source:"dj",deckId,day:eventDay,startMinute:projection.slot.startMinute,duration:projection.slot.duration,styleId:projection.style.id,slotId:projection.slot.id,djId:projection.dj.id,djName:projection.dj.name,ticketPrice:projection.ticketPrice,capacity:projection.capacity,excitement:projection.excitement,noise:projection.noise,comfort:projection.comfort,operatingCost:projection.operatingCost,expectedAttendance:projection.expectedAttendance,expectedRevenue:projection.expectedRevenue,expectedProfit:projection.expectedProfit,guestBonus:projection.guestBonus,moodBonus:projection.moodBonus,scheduledAt:now};return next;}

const GUEST_RELIEF = Object.freeze({
  bench:{energy:42,mood:10}, water:{thirst:70}, restroom:{bladder:78}, foodGarden:{hunger:62,mood:16},
  scenery:{mood:18}, experience:{mood:62,energy:-8}, cafe:{hunger:35,energy:46,thirst:12},
  snack:{hunger:48,thirst:36}, beach:{thirst:48,hunger:18,mood:16}, surf:{mood:34}, merch:{mood:28}, academy:{mood:8}, hub:{mood:22}, forum:{mood:26}, pavilion:{mood:54}
});

function guestNeed(needs,key,fallback=35){const value=Number(needs?.[key]);return Number.isFinite(value)?Math.max(0,Math.min(100,value)):fallback;}

function guestTrait(profile,key,fallback){const value=Number(profile?.[key]);return Number.isFinite(value)?value:fallback;}
function preference(profile,key,fallback=.5){return Math.max(0,Math.min(1,guestTrait(profile?.preferences,key,fallback)));}
function queueSize(context,kind,id){return Math.max(0,Math.round(Number(context?.queues?.[`${kind}:${id}`]??context?.queues?.[id]??0)||0));}
function queuePenalty(length,patience){return length*(8+(100-patience)*.22);}
function optionReason(parts){return parts.filter(Boolean).slice(0,3).join(" · ");}

export function guestDestinationOptions(run,guestOrNeeds={},seed=0,context={}){
  const profile=guestOrNeeds?.needs?guestOrNeeds:{needs:guestOrNeeds},needs=profile.needs||{};
  const hunger=guestNeed(needs,"hunger"),thirst=guestNeed(needs,"thirst"),bladder=guestNeed(needs,"bladder"),energy=guestNeed(needs,"energy"),mood=guestNeed(needs,"mood");
  const budget=Math.max(0,guestTrait(profile,"budget",Number.POSITIVE_INFINITY)),patience=Math.max(0,Math.min(100,guestTrait(profile,"queuePatience",65))),quality=Math.max(0,Math.min(100,guestTrait(context,"campusQuality",campusMetrics(run).rating)));
  const social=preference(profile,"social"),calm=preference(profile,"calm"),excitement=preference(profile,"excitement"),food=preference(profile,"food"),drinks=preference(profile,"drinks"),shopping=preference(profile,"shopping");
  const options=[
    {kind:"landmark",id:"academy",label:"Academic Wing",score:18+calm*18+quality*.08+((seed+1)%7),reason:optionReason(["quiet destination",`${quality}% campus quality`])},
    {kind:"landmark",id:"hub",label:"Student Hub",score:13+mood*.34+social*28+quality*.1+((seed+3)%6),reason:optionReason(["social preference",`${quality}% campus quality`])},
    {kind:"landmark",id:"forum",label:"Sunset Forum",score:12+mood*.4+social*20+calm*12+quality*.1+((seed+5)%8),reason:optionReason(["open-air destination",`${quality}% campus quality`])}
  ];
  if(run.activeEvent&&(run.eventVenue||run.activeEvent.deckId)){
    const event=run.activeEvent,isDj=event.source==="dj",ticketPrice=isDj?(event.ticketPrice||0):0,q=queueSize(context,isDj?"event":"landmark",isDj?"dj-event":"pavilion");
    if(!ticketPrice||ticketPrice<=budget){const priceRatio=ticketPrice/800,score=82+mood*.32+excitement*(isDj?42:35)+(event.excitement||0)*.28+(event.comfort||50)*.12-calm*(event.noise||0)*.22-Math.max(0,priceRatio-1)*18-queuePenalty(q,patience);options.push({kind:isDj?"event":"landmark",id:isDj?"dj-event":"pavilion",type:"pavilion",deckId:event.deckId||"pavilion",label:event.name||"Coastline Pavilion",score,price:ticketPrice,queueLength:q,reason:optionReason([isDj?`${event.styleName||"live music"} event`:"live event",ticketPrice?`${formatEuro(ticketPrice)} ticket`:"free entry",`${event.comfort||50}% comfort`])});}
  }
  for(const facility of run.facilities||[]){
    const q=queueSize(context,"facility",facility.id);let score=8+quality*.08;
    if(facility.type==="bench")score+=energy*1.08+mood*.18;
    else if(facility.type==="water")score+=thirst*1.35;
    else if(facility.type==="restroom")score+=bladder*1.5;
    else if(facility.type==="foodGarden")score+=hunger*1.28+mood*.22+food*30+social*14;
    else if(facility.type==="experience"){const stats=attractionStats(facility.modules),intensityTarget=guestTrait(profile?.preferences,"intensity",50);score+=mood*1.08+stats.excitement*.3+excitement*38-Math.abs(stats.intensity-intensityTarget)*.3;}
    else if(facility.type==="scenery")score+=mood*.48+calm*18;
    else if(facility.type==="path")continue;
    else score+=12;
    score-=queuePenalty(q,patience);options.push({kind:"facility",id:facility.id,type:facility.type,label:facility.name,score,queueLength:q,reason:optionReason([q?`${q} already there`:"available now",facility.type==="experience"?"attraction fit":`${quality}% campus quality`])});
  }
  for(const store of STORES){
    if((run.venues?.[store.id]??0)<1)continue;
    if(!storeIsOpen(run,store.id,run.clockMinutes))continue;
    const products=CATALOGUE.filter(product=>product.storeId===store.id&&run.stock?.[product.id]>0);
    if(!products.length)continue;
    const affordable=products.map(product=>({...product,price:run.prices?.[product.id]??product.reference})).filter(product=>product.price<=budget);
    if(!affordable.length)continue;
    const choice=affordable.sort((a,b)=>(a.price/a.reference)-(b.price/b.reference)||a.price-b.price)[0],priceRatio=choice.price/choice.reference,q=queueSize(context,"store",store.id);
    let score=10+quality*.14+Math.max(-42,30-priceRatio*20)-queuePenalty(q,patience);
    if(store.id==="cafe")score+=hunger*.68+energy*.82+thirst*.18;
    else if(store.id==="snack")score+=hunger*.92+thirst*.6;
    else score+=mood*.52+12;
    if(store.id==="cafe")score+=food*22+drinks*18;else if(store.id==="snack"||store.id==="beach")score+=food*16+drinks*26;else if(store.id==="merch")score+=shopping*35;else if(store.id==="surf")score+=shopping*18+excitement*28;
    options.push({kind:"store",id:store.id,label:store.name,score,productIds:affordable.map(product=>product.id),productId:choice.id,productName:choice.name,price:choice.price,queueLength:q,reason:optionReason([priceRatio<=1?"good value":priceRatio>1.5?"high price":"acceptable price",q?`${q} in queue`:"no queue",`${quality}% campus quality`])});
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
  const activeEvent=EVENT_CATALOGUE.find(item=>item.id===run.activeEvent?.id)||run.activeEvent;
  for(const facility of run.facilities||[]){
    const blueprint=FACILITY_CATALOGUE.find(item=>item.id===facility.type);
    if(blueprint) Object.entries(blueprint.needs||{}).forEach(([key,value])=>needs[key]+=value);
  }
  const staff=run.staff||{};
  needs.cleanliness+=(staff.caretaker||0)*15;
  needs.mood+=(staff.host||0)*12;
  needs.energy+=(staff.host||0)*4;
  needs.mood+=(staff.entertainer||0)*11;
  needs.mood+=activeEvent?.moodBonus||0;
  Object.keys(needs).forEach(key=>needs[key]=Math.max(0,Math.min(100,needs[key])));
  const experiences=(run.facilities||[]).filter(item=>item.type==="experience");
  const attraction=experiences.reduce((best,item)=>{const stats=attractionStats(item.modules);return stats.excitement>best.excitement?stats:best;},{excitement:0,intensity:0,comfort:42,cost:0});
  attraction.comfort=Math.min(100,attraction.comfort+(staff.technician||0)*9);
  const satisfaction=Math.round(Object.values(needs).reduce((sum,value)=>sum+value,0)/Object.keys(needs).length);
  const intensityFit=attraction.intensity<=70?10:Math.max(-18,10-(attraction.intensity-70));
  const eventNoisePenalty=activeEvent?Math.max(0,(activeEvent.noise||0)-55)*.2:0,eventComfortBonus=activeEvent?((activeEvent.comfort||50)-50)*.08:0;
  const rating=Math.max(0,Math.min(100,Math.round(satisfaction*.72+Math.min(100,attraction.excitement+20)*.18+intensityFit-eventNoisePenalty+eventComfortBonus)));
  const openVenues=Object.values(run.venues||{}).filter(level=>level>0).length,districts=Object.values(run.districts||{}).filter(Boolean).length,eventBonus=activeEvent?(activeEvent.guestBonus+(staff.entertainer||0)*3):0;
  const guests=Math.max(12,Math.round(10+rating*.27+(run.facilities||[]).length*1.5+(staff.host||0)*3+attraction.excitement*.12+openVenues*2.3+Math.max(0,districts-1)*5+eventBonus));
  return { needs, satisfaction, rating, guests, attraction };
}

export function progressionState(run){
  const venueLevels=Object.values(run.venues||{}).reduce((sum,level)=>sum+(level||0),0),districtCount=Object.values(run.districts||{}).filter(Boolean).length;
  const xp=Math.floor((run.totalSales||0)*12+(run.totalCampusInteractions||0)*1.5+(run.reputation||0)*8+(run.facilities||[]).length*18+(run.upgrades||[]).length*30+venueLevels*12+Math.max(0,districtCount-1)*70+(run.eventHistory||[]).length*45);
  let current=PROGRESSION_LEVELS[0];for(const tier of PROGRESSION_LEVELS)if(xp>=tier.xp)current=tier;
  const next=PROGRESSION_LEVELS.find(tier=>tier.level===current.level+1)||null,span=next?next.xp-current.xp:1,progress=next?Math.max(0,Math.min(100,Math.round((xp-current.xp)/span*100))):100;
  return {xp,level:current.level,title:current.title,unlock:current.unlock,next,progress};
}

export function scenarioGoals(run){const metrics=campusMetrics(run),progress=progressionState(run);return [
  {id:"visitors",name:"Campus destination",description:"Welcome 250 lifetime guests",value:Math.min(250,run.totalVisitors||0),target:250,complete:(run.totalVisitors||0)>=250},
  {id:"rating",name:"World-class campus",description:"Reach a 90% campus rating",value:metrics.rating,target:90,complete:metrics.rating>=90},
  {id:"portfolio",name:"Coastal portfolio",description:"Open all five stores",value:Object.values(run.venues||{}).filter(level=>level>0).length,target:STORES.length,complete:Object.values(run.venues||{}).filter(level=>level>0).length>=STORES.length},
  {id:"legend",name:"Nova legend",description:"Reach company level 10",value:progress.level,target:10,complete:progress.level>=10}
];}

export function unlockDistrict(run,districtId,now=new Date().toISOString()){
  const district=DISTRICT_CATALOGUE.find(item=>item.id===districtId);if(!district)throw new Error("Unknown campus district.");
  if(run.districts?.[districtId])throw new Error("This district is already unlocked.");
  if(progressionState(run).level<district.level)throw new Error(`Reach company level ${district.level} to acquire ${district.name}.`);
  if(districtId==="pier"&&!run.districts?.east)throw new Error("Acquire the East Promenade first.");
  if(run.cash<district.cost)throw new Error(`You need ${formatEuro(district.cost)} to acquire ${district.name}.`);
  const next=structuredClone(run);if(!next.districts)next.districts={coast:1,east:0,pier:0};next.cash-=district.cost;next.districts[districtId]=1;
  if(!Array.isArray(next.districtPurchases))next.districtPurchases=[];next.districtPurchases.push({at:now,day:run.currentDay,districtId,cost:district.cost});next.reputation=(next.reputation||0)+12;return next;
}

export function unlockEventVenue(run,now=new Date().toISOString()){
  if(run.eventVenue)throw new Error("The Coastline Pavilion is already open.");if(!run.districts?.east)throw new Error("Acquire the East Promenade first.");
  if(progressionState(run).level<7)throw new Error("Reach company level 7 to build the Coastline Pavilion.");const cost=50000;if(run.cash<cost)throw new Error(`You need ${formatEuro(cost)} to build the pavilion.`);
  const next=structuredClone(run);next.cash-=cost;next.eventVenue=1;next.reputation=(next.reputation||0)+18;next.eventVenueOpenedAt={at:now,day:run.currentDay,cost};return next;
}

export function launchEvent(run,eventId,now=new Date().toISOString()){
  const event=EVENT_CATALOGUE.find(item=>item.id===eventId);if(!event)throw new Error("Unknown event.");if(!run.eventVenue)throw new Error("Build the Coastline Pavilion first.");
  if(run.activeEvent)throw new Error("Another event is already running.");if(progressionState(run).level<event.level)throw new Error(`Reach company level ${event.level} to host ${event.name}.`);if(run.cash<event.cost)throw new Error(`You need ${formatEuro(event.cost)} to host this event.`);
  const next=structuredClone(run);next.cash-=event.cost;next.activeEvent={id:event.id,name:event.name,remainingMinutes:event.duration,startedAt:now,day:run.currentDay};if(!Array.isArray(next.eventHistory))next.eventHistory=[];next.eventHistory.push({at:now,day:run.currentDay,eventId:event.id,cost:event.cost});return next;
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
    if(type==="foodGarden"&&progressionState(run).level<3)throw new Error("Reach company level 3 to build the Food Garden.");
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
  if(progressionState(run).level<(role.level||1))throw new Error(`Reach company level ${role.level} to hire ${role.name}.`);
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

export function campusPhase(minutes){
  const value=Math.max(DAY_START,Math.min(DAY_END-.001,Number(minutes)||DAY_START));
  return CAMPUS_DAY_PHASES.find(phase=>value>=phase.start&&value<phase.end)||CAMPUS_DAY_PHASES.at(-1);
}

export function storeIsOpen(run,storeId,minutes=run.clockMinutes){
  const hours=run.storeHours?.[storeId]||DEFAULT_STORE_HOURS[storeId];
  return Boolean(hours&&minutes>=hours.open&&minutes<hours.close);
}

export function setStoreHours(run,storeId,open,close){
  if(!STORES.some(store=>store.id===storeId))throw new Error("Unknown venue.");
  if(!Number.isInteger(open)||!Number.isInteger(close)||open<DAY_START||close>DAY_END||close-open<120)throw new Error("Opening hours must fit the campus day and span at least two hours.");
  const next=structuredClone(run);if(!next.storeHours)next.storeHours=structuredClone(DEFAULT_STORE_HOURS);next.storeHours[storeId]={open,close};return next;
}

export function nextDeliveryWindow(run){
  const slot=DELIVERY_WINDOWS.find(window=>window.minute>run.clockMinutes+5);
  return slot?{day:run.currentDay,...slot}:{day:run.currentDay+1,...DELIVERY_WINDOWS[0]};
}

export function scheduleDelivery(run,productId,quantity,now=new Date().toISOString()){
  if(!Number.isInteger(quantity)||quantity<=0)throw new Error("Quantity must be a positive whole number.");
  const product=CATALOGUE.find(item=>item.id===productId);if(!product)throw new Error("Unknown product.");
  if((run.venues?.[product.storeId]??0)<(product.tier||1))throw new Error(`Open or upgrade this venue to level ${product.tier} to unlock ${product.name}.`);
  const total=product.cost*quantity;if(total>run.cash)throw new Error(`You need ${formatEuro(total)} but only have ${formatEuro(run.cash)}.`);
  const next=structuredClone(run),window=nextDeliveryWindow(next);if(!Array.isArray(next.deliveries))next.deliveries=[];
  next.cash-=total;const delivery={id:`delivery-${next.currentDay}-${next.deliveries.length+1}-${productId}`,orderedAt:now,orderedDay:next.currentDay,productId,quantity,total,arrivalDay:window.day,arrivalMinute:window.minute,windowId:window.id,label:window.label,status:"scheduled"};
  next.deliveries.push(delivery);next.purchases.push({at:now,day:run.currentDay,productId,quantity,total,deliveryId:delivery.id,arrivalDay:window.day,arrivalMinute:window.minute});return next;
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
  const required=STORE_REQUIREMENTS[storeId]||1;if(progressionState(run).level<required)throw new Error(`Reach company level ${required} to open this venue.`);
  if(storeId==="beach"&&!run.districts?.east)throw new Error("Acquire the East Promenade before opening the Beach Bar.");
  if(storeId==="surf"&&!run.districts?.pier)throw new Error("Acquire the Ocean Pier before opening the Surf Shack.");
  const cost=STORE_UNLOCKS[storeId];if(run.cash<cost)throw new Error(`You need ${formatEuro(cost)} to open this venue.`);
  const next=structuredClone(run);next.cash-=cost;next.venues[storeId]=1;
  if(!Array.isArray(next.venuePurchases))next.venuePurchases=[];next.venuePurchases.push({at:now,day:run.currentDay,storeId,cost});
  return next;
}

export function crowdPeak(minutes){
  const phase=campusPhase(minutes);return {id:phase.id,label:phase.name,multiplier:phase.multiplier,start:phase.start,end:phase.end,color:phase.color,description:phase.description};
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
  if(!Number.isFinite(run.today.eventRevenue))run.today.eventRevenue=0;if(!Number.isFinite(run.today.eventCosts))run.today.eventCosts=0;if(!Number.isInteger(run.today.eventAttendance))run.today.eventAttendance=0;
  if(!run.salesProgress)run.salesProgress={};if(!Number.isFinite(run.visitorProgress))run.visitorProgress=0;
  if(!Number.isInteger(run.totalSales))run.totalSales=run.history?.reduce((sum,day)=>sum+(day.totals?.unitsSold||0),0)||0;
  if(!Number.isInteger(run.totalVisitors))run.totalVisitors=run.history?.reduce((sum,day)=>sum+(day.campus?.guests||0),0)||0;
  if(!run.districts)run.districts={coast:1,east:0,pier:0};if(!Number.isInteger(run.eventVenue))run.eventVenue=0;
  if(!run.storeHours)run.storeHours=structuredClone(DEFAULT_STORE_HOURS);for(const store of STORES)if(!run.storeHours[store.id])run.storeHours[store.id]={...DEFAULT_STORE_HOURS[store.id]};
  if(!Array.isArray(run.deliveries))run.deliveries=[];if(!Array.isArray(run.today.deliveries))run.today.deliveries=[];ensureDjOperations(run);
}

function processDeliveries(run,minutes){
  const sliceEnd=run.clockMinutes+minutes;
  for(const delivery of run.deliveries||[]){
    if(delivery.status!=="scheduled")continue;
    const due=delivery.arrivalDay<run.currentDay||(delivery.arrivalDay===run.currentDay&&delivery.arrivalMinute<sliceEnd);
    if(!due)continue;
    run.stock[delivery.productId]=(run.stock[delivery.productId]||0)+delivery.quantity;delivery.status="delivered";delivery.deliveredDay=run.currentDay;delivery.deliveredMinute=Math.max(run.clockMinutes,delivery.arrivalMinute);run.today.deliveries.push({id:delivery.id,productId:delivery.productId,quantity:delivery.quantity,total:delivery.total,minute:delivery.deliveredMinute});
  }
}

function processDjEvent(run,minutes){
  const scheduled=run.scheduledEvent;if(scheduled&&scheduled.day===run.currentDay&&scheduled.startMinute>=run.clockMinutes&&scheduled.startMinute<run.clockMinutes+minutes){run.activeEvent={...scheduled,styleName:DJ_STYLES.find(item=>item.id===scheduled.styleId)?.name||"Live set",remainingMinutes:scheduled.duration,attendance:0,revenue:0,attendanceProgress:0,startedAt:new Date().toISOString()};run.today.eventCosts+=scheduled.operatingCost||0;run.scheduledEvent=null;}
  if(!run.activeEvent)return;
  if(run.activeEvent.source!=="dj"){run.activeEvent.remainingMinutes-=minutes;if(run.activeEvent.remainingMinutes<=0)run.activeEvent=null;return;}
  const event=run.activeEvent,activeMinutes=Math.min(minutes,event.remainingMinutes),target=Math.max(0,event.expectedAttendance||0);event.attendanceProgress=(event.attendanceProgress||0)+target*activeMinutes/Math.max(1,event.duration);const available=Math.max(0,(event.capacity||target)-(event.attendance||0)),arrivals=Math.min(available,Math.floor(event.attendanceProgress));if(arrivals>0){event.attendanceProgress-=arrivals;event.attendance=(event.attendance||0)+arrivals;const revenue=arrivals*(event.ticketPrice||0);event.revenue=(event.revenue||0)+revenue;run.cash+=revenue;run.today.eventRevenue+=revenue;run.today.eventAttendance+=arrivals;run.djOperations.lifetimeAttendance=(run.djOperations.lifetimeAttendance||0)+arrivals;run.djOperations.lifetimeRevenue=(run.djOperations.lifetimeRevenue||0)+revenue;}
  event.remainingMinutes-=minutes;if(event.remainingMinutes<=0){if(!Array.isArray(run.eventHistory))run.eventHistory=[];run.eventHistory.push({at:event.startedAt,day:run.currentDay,eventId:"dj-event",name:event.name,deckId:event.deckId,styleId:event.styleId,slotId:event.slotId,djId:event.djId,ticketPrice:event.ticketPrice,attendance:event.attendance||0,revenue:event.revenue||0,cost:event.operatingCost||0,grossProfit:(event.revenue||0)-(event.operatingCost||0),excitement:event.excitement,noise:event.noise,comfort:event.comfort});run.reputation=(run.reputation||0)+Math.max(1,Math.round((event.attendance||0)/10));run.activeEvent=null;}
}

function processSlice(run,minutes){
  processDeliveries(run,minutes);
  processDjEvent(run,minutes);
  const metrics=campusMetrics(run),peak=crowdPeak(run.clockMinutes),campusFactor=Math.max(.45,metrics.guests/24);
  run.visitorProgress+=metrics.guests*peak.multiplier*minutes/115;
  const arrived=Math.floor(run.visitorProgress);run.visitorProgress-=arrived;run.today.visitors+=arrived;run.totalVisitors+=arrived;
  for(const product of CATALOGUE){
    const level=run.venues?.[product.storeId]??0;if(level<(product.tier||1))continue;
    if(!storeIsOpen(run,product.storeId,run.clockMinutes))continue;
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
  const deliveredUnits=(run.today.deliveries||[]).reduce((sum,item)=>sum+item.quantity,0),totals={unitsSold:run.today.unitsSold,revenue:run.today.revenue,cogs:run.today.cogs,eventRevenue:run.today.eventRevenue||0,eventCosts:run.today.eventCosts||0,eventAttendance:run.today.eventAttendance||0,deliveries:(run.today.deliveries||[]).length,deliveredUnits,grossProfit:run.today.revenue-run.today.cogs+(run.today.eventRevenue||0)-(run.today.eventCosts||0)};
  run.history.push({day:run.currentDay,eventId:crowdPeak(720).id,completedAt:new Date().toISOString(),items,totals,closingCash:run.cash,deliveries:structuredClone(run.today.deliveries||[]),storeHours:structuredClone(run.storeHours||{}),campus:{...metrics,guests:run.today.visitors,activities:{...(run.today.activities||{})}}});
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
