import { CATALOGUE, STORES, STORE_UNLOCKS, STORE_REQUIREMENTS, DISTRICT_CATALOGUE, EVENT_CATALOGUE, DJ_EVENT_SLOTS, DJ_STYLES, DJ_ROSTER, DJ_UPGRADES, CAMPUS_DAY_PHASES, DEFAULT_STORE_HOURS, DELIVERY_WINDOWS, PROGRESSION_LEVELS, FACILITY_CATALOGUE, STAFF_CATALOGUE, STAFF_SHIFTS, OPERATIONS_DISTRICTS, EXPERIENCE_MODULES, SPECIALIZATION_FOCUSES, STORE_SPECIALIZATIONS, FACILITY_SPECIALIZATIONS, DAY_START, DAY_END, STORAGE_KEY, SHOWCASE_BUDGET, createRun, createShowcaseRun, demandFor, parseEuro, buyStock, scheduleDelivery, nextDeliveryWindow, storeIsOpen, setStoreHours, campusPhase, setPrice, inventoryValue, overallResult, formatEuro, upgradeVenue, unlockVenue, unlockDistrict, unlockEventVenue, launchEvent, djEventProjection, configureDjOperations, hireDj, upgradeDjDeck, scheduleDjEvent, progressionState, scenarioGoals, attractionStats, campusMetrics, tycoonPulse, managementOverview, dailyOperatingCosts, storeOperatingCost, venueServiceMultiplier, storeSpecialization, facilitySpecialization, specializationSynergy, specializationSnapshot, setStoreSpecialization, setFacilitySpecialization, settleOperatingCosts, crowdPeak, advanceTycoon, facilityFootprint, placeFacility, moveFacility, demolishFacility, hireStaff, assignStaff, setStaffShift, settlePayroll, activeStaffCount, staffDailyWage, staffIsOnShift, operationsSnapshot, assetIsClosed, migrateStaffOperations, activeVenueProject, venueProjectProgress, districtForStore, districtForPosition, guestDestinationOptions, applyGuestNeedRelief, recordGuestActivity, completeGuestSale } from "./core.js?v=34-showcase-editor";

const $ = selector => document.querySelector(selector);
const canvas = $("#world");
const ctx = canvas.getContext("2d");
const drawer = $("#drawer");
const drawerContent = $("#drawerContent");
const modal = $("#modal");
const modalCard = $("#modalCard");
const keys = new Set();
const ZONES = {
  campus: { id:"campus", name:"Nova Coast Campus", sub:"CARCAVELOS OVERWORLD", width:58, height:30, minX:1, maxX:41, minY:7.5, maxY:25.7, shore:23, outdoor:true, spawn:{x:21,y:18} },
  mercado: { id:"mercado", name:"Mercado Supply Hall", sub:"LOGISTICS INTERIOR", width:15, height:12, minX:1.2, maxX:13.8, minY:1.2, maxY:10.3, outdoor:false, spawn:{x:7.5,y:8.8}, floor:"#d8c79f", accent:"#f5c95e" },
  academy: { id:"academy", name:"Academic Wing", sub:"COURTYARD INTERIOR", width:15, height:12, minX:1.2, maxX:13.8, minY:1.2, maxY:10.3, outdoor:false, spawn:{x:7.5,y:8.8}, floor:"#d7dad3", accent:"#ff7b5b" },
  hub: { id:"hub", name:"Student Hub", sub:"VENTURE INTERIOR", width:15, height:12, minX:1.2, maxX:13.8, minY:1.2, maxY:10.3, outdoor:false, spawn:{x:7.5,y:8.8}, floor:"#cddbd5", accent:"#64cbc8" }
};
const SHOWCASE_STORAGE_KEY="nova-beach-ventures-showcase-v1",MODE_STORAGE_KEY="nova-beach-ventures-mode";
let showcaseMode=localStorage.getItem(MODE_STORAGE_KEY)==="showcase";
const activeStorageKey=()=>showcaseMode?SHOWCASE_STORAGE_KEY:STORAGE_KEY;
let run = loadRun();
syncCampusBounds();
let currentZone = run.player.zone || "campus";
let soundOn = true;
let activeLocation = null;
let lastTime = 0;
let walking = false;
let facing = { x: 0, y: 1 };
let targetPoint = null;
let currentSupplierStore = "cafe";
let pendingBuild = null;
let buildCursor = null;
let buildResumeSpeed = null;
let objectTransform = null;
let selectedExperienceModules = ["music","shade"];
let simulationElapsed = 0;
let lastPersistAt = 0;
let saleFeedTimer = null;
let dayReportTimer = null;
let guestAgents = [];
let guestSequence = 0;
let guestSpawnAccumulator = 0;
let activityPulse = null;
const OVERLAY_STORAGE_KEY="nova-beach-ventures-overlay";
const OVERLAY_MODES=["flow","needs","trade","operations"];
let managementOverlay=OVERLAY_MODES.includes(localStorage.getItem(OVERLAY_STORAGE_KEY))?localStorage.getItem(OVERLAY_STORAGE_KEY):"flow";
const camera = { x: run.player.x, y: run.player.y, zoom: 1 };
let cameraSequence=null;
const TILE_W = 76, TILE_H = 38;
const WALK_SPEED = 3.5;
const GUEST_SPEED = 1.45;
const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
const GUEST_ENTRIES = [{x:2.2,y:14.8},{x:39.5,y:14.8},{x:8,y:21.4},{x:35.8,y:20.3},{x:47.5,y:21.2},{x:55.2,y:16.2}];
const GUEST_NAMES = ["Inês","Tomás","Maya","Luca","Beatriz","Rafael","Sofia","Noah","Leonor","Mateo","Clara","Tiago","Amélia","Hugo","Nina","Martim"];
const GUEST_ICONS = {cafe:"☕",snack:"◉",merch:"◆",beach:"☀",surf:"≈",bench:"▰",water:"◒",restroom:"WC",foodGarden:"✦",experience:"★",scenery:"♧",academy:"A",hub:"H",forum:"☀",pavilion:"♫",exit:"↗"};
const CAMPUS_SPACES = Object.freeze({
  arrival:{id:"arrival",name:"Arrival Plaza",x:7.4,y:15.35},
  courtyard:{id:"courtyard",name:"Academic Courtyard",x:20.1,y:12.75},
  terrace:{id:"terrace",name:"Café Terrace",x:17.55,y:14.25},
  service:{id:"service",name:"Service Lane",x:8.4,y:18.25},
  foodCourt:{id:"foodCourt",name:"Food Court",x:28.2,y:19.55},
  lawn:{id:"lawn",name:"Student Lawn",x:35.5,y:19.9},
  promenade:{id:"promenade",name:"Beach Promenade",x:30.5,y:22.15},
  eventSquare:{id:"eventSquare",name:"Event Square",x:20.5,y:21.35}
});
const RESERVED_BUILD_AREAS = [
  {kind:"rect",x:1.8,y:8,w:9.7,h:6.3,label:"Mercado building"},
  {kind:"rect",x:13.3,y:7.2,w:14.6,h:6.8,label:"Academic complex"},
  {kind:"rect",x:29,y:4.2,w:11.5,h:9.1,label:"Student Hub"},
  {kind:"rect",x:4.2,y:14.1,w:7.2,h:3.05,label:"Arrival Plaza"},
  {kind:"rect",x:13.2,y:9.25,w:14.6,h:5.2,label:"Academic Courtyard"},
  {kind:"rect",x:2.2,y:17.1,w:12.2,h:2.25,label:"Service lane"},
  {kind:"circle",x:20.5,y:22.35,r:3.25,label:"Sunset Forum"},
  {kind:"rect",x:43.3,y:18.7,w:5.8,h:4.2,label:"Beach Bar plot"},
  {kind:"rect",x:50.2,y:13.6,w:5.4,h:4.8,label:"Surf Shack plot"},
  {kind:"circle",x:48,y:11.9,r:3.2,label:"Coastline Pavilion"}
];

const locations = {
  marketDoor: { zone:"campus", x:7, y:15.2, kind:"door", label:"Enter Mercado Supply Hall", targetZone:"mercado", color:"#f5c95e", title:"MERCADO", sub:"ENTER" },
  academyDoor: { zone:"campus", x:20, y:12.2, kind:"door", label:"Enter the Academic Wing", targetZone:"academy", color:"#ff7b5b", title:"ACADEMIC WING", sub:"ENTER" },
  hubDoor: { zone:"campus", x:34.5, y:14.2, kind:"door", label:"Enter the Student Hub", targetZone:"hub", color:"#64cbc8", title:"STUDENT HUB", sub:"ENTER" },
  snack: { zone:"campus", x:28, y:21.5, label:"Manage Beach Fuel Bar", panel:()=>openStore("snack"), color:"#afd864", title:"BEACH FUEL", sub:"BOARDWALK" },
  eastGate: { zone:"campus", x:40.2, y:17.2, label:"Review East Promenade expansion", panel:()=>openDistrictPanel("east"), color:"#f2b94b", title:"EAST PROMENADE", sub:"LAND" },
  beach: { zone:"campus", x:45.9, y:20.6, label:"Manage Maré Beach Bar", panel:()=>openStore("beach"), color:"#f2b94b", title:"MARÉ BEACH BAR", sub:"EAST PROMENADE" },
  pavilion: { zone:"campus", x:47.9, y:11.9, label:"Manage Coastline Pavilion", panel:openEventVenue, color:"#e47768", title:"COASTLINE PAVILION", sub:"EVENT LAWN" },
  pierGate: { zone:"campus", x:49.3, y:17.2, label:"Review Ocean Pier expansion", panel:()=>openDistrictPanel("pier"), color:"#479fb5", title:"OCEAN PIER", sub:"LAND" },
  surf: { zone:"campus", x:53.1, y:16.1, label:"Manage Carcavelos Surf Shack", panel:()=>openStore("surf"), color:"#479fb5", title:"SURF SHACK", sub:"OCEAN PIER" },
  supplier: { zone:"mercado", x:7.5, y:4.2, label:"Open wholesale inventory", panel:()=>openSupplier(currentSupplierStore), color:"#f5c95e", title:"SUPPLY DESK", sub:"WHOLESALE" },
  marketExit: { zone:"mercado", x:7.5, y:9.8, kind:"door", label:"Return to the coast campus", targetZone:"campus", spawn:{x:7,y:16.8}, color:"#f5c95e", title:"CAMPUS", sub:"EXIT" },
  cafe: { zone:"academy", x:7.3, y:4.3, label:"Manage Atlantic Café", panel:()=>openStore("cafe"), color:"#ff7b5b", title:"ATLANTIC CAFÉ", sub:"ACADEMIC WING" },
  academyExit: { zone:"academy", x:7.5, y:9.8, kind:"door", label:"Return to the coast campus", targetZone:"campus", spawn:{x:20,y:13.8}, color:"#ff7b5b", title:"CAMPUS", sub:"EXIT" },
  merch: { zone:"hub", x:5.3, y:4.2, label:"Manage Nova Merch Lab", panel:()=>openStore("merch"), color:"#5ac7c4", title:"MERCH LAB", sub:"STUDENT HUB" },
  board: { zone:"hub", x:10.5, y:5.2, label:"Open the venture ledger", panel:openLedger, color:"#67b7d1", title:"VENTURE HQ", sub:"FINANCE" },
  hubExit: { zone:"hub", x:7.5, y:9.8, kind:"door", label:"Return to the coast campus", targetZone:"campus", spawn:{x:34.5,y:15.8}, color:"#64cbc8", title:"CAMPUS", sub:"EXIT" }
};

const locationAvailable=id=>!(["beach","pavilion","pierGate"].includes(id)&&!run.districts?.east)&&!(id==="surf"&&!run.districts?.pier);
const zoneLocations = () => Object.entries(locations).filter(([id,location]) => location.zone === currentZone&&locationAvailable(id));
const activeZone = () => ZONES[currentZone];
function syncCampusBounds(){ZONES.campus.maxX=run.districts?.pier?56.5:run.districts?.east?49.3:41;}

function loadRun() {
  try {
    const parsed = JSON.parse(localStorage.getItem(activeStorageKey()));
    if (parsed && [1,2,3,4,5,6,7].includes(parsed.version) && Array.isArray(parsed.history)) {
      if (!parsed.player) parsed.player = { x:21, y:18, zone:"campus" };
      if (!parsed.player.zone || !ZONES[parsed.player.zone]) parsed.player = { x:Math.min(41,Math.max(1,parsed.player.x||21)), y:Math.min(25.7,Math.max(7.5,parsed.player.y||18)), zone:"campus" };
      CATALOGUE.forEach(product => {
        if (!Number.isInteger(parsed.stock[product.id])) parsed.stock[product.id] = 0;
        if (!Number.isInteger(parsed.prices[product.id])) parsed.prices[product.id] = product.reference;
      });
      if (!parsed.venues) parsed.venues = { cafe: 1, snack: 0, merch: 0, beach:0, surf:0 };
      STORES.forEach(store=>{if(!Number.isInteger(parsed.venues[store.id]))parsed.venues[store.id]=store.id==="cafe"?1:0;});
      if(!parsed.districts)parsed.districts={coast:1,east:0,pier:0};
      if(!Number.isInteger(parsed.eventVenue))parsed.eventVenue=0;if(!Array.isArray(parsed.eventHistory))parsed.eventHistory=[];
      if(!parsed.djOperations)parsed.djOperations={deckId:null,slotId:"sunset",styleId:"sunset",ticketPrice:600,djId:null,upgrades:{speakers:0,lighting:0,shade:0,capacity:0},lifetimeAttendance:0,lifetimeRevenue:0};
      parsed.djOperations.upgrades={speakers:0,lighting:0,shade:0,capacity:0,...parsed.djOperations.upgrades};if(parsed.scheduledEvent===undefined)parsed.scheduledEvent=null;
      if(!parsed.storeHours)parsed.storeHours=structuredClone(DEFAULT_STORE_HOURS);STORES.forEach(store=>{if(!parsed.storeHours[store.id])parsed.storeHours[store.id]={...DEFAULT_STORE_HOURS[store.id]};});
      if(!Array.isArray(parsed.deliveries))parsed.deliveries=[];
      if (!Number.isInteger(parsed.reputation)) parsed.reputation = 0;
      if (!Array.isArray(parsed.upgrades)) parsed.upgrades = [];
      if (!Array.isArray(parsed.facilities)) parsed.facilities = [];
      parsed.facilities.forEach(facility=>{if(!Number.isInteger(facility.rotation))facility.rotation=0;});
      if (!parsed.staff) parsed.staff = { service:0, caretaker:0, technician:0, host:0, entertainer:0 };
      STAFF_CATALOGUE.forEach(role=>{if(!Number.isInteger(parsed.staff[role.id]))parsed.staff[role.id]=0;});
      parsed.version=7;parsed.completed=false;parsed.salesMode="guests";if(!Array.isArray(parsed.guestSales))parsed.guestSales=[];if(!parsed.storeSpecializations)parsed.storeSpecializations={};if(!Array.isArray(parsed.specializationHistory))parsed.specializationHistory=[];if(!Array.isArray(parsed.venueProjects))parsed.venueProjects=[];
      if(!Number.isFinite(parsed.clockMinutes))parsed.clockMinutes=DAY_START;
      if(!Number.isFinite(parsed.speed))parsed.speed=1;
      if(!parsed.today)parsed.today={revenue:0,cogs:0,unitsSold:0,visitors:0,products:{},activities:{}};
      if(!parsed.today.activities)parsed.today.activities={};
      if(!Array.isArray(parsed.today.deliveries))parsed.today.deliveries=[];
      if(!parsed.salesProgress)parsed.salesProgress={};
      if(!Number.isInteger(parsed.totalSales))parsed.totalSales=parsed.history.reduce((sum,day)=>sum+(day.totals?.unitsSold||0),0);
      if(!Number.isInteger(parsed.totalVisitors))parsed.totalVisitors=parsed.history.reduce((sum,day)=>sum+(day.campus?.guests||0),0);
      if(!Number.isInteger(parsed.totalCampusInteractions))parsed.totalCampusInteractions=0;
      if(!parsed.facilityUsage)parsed.facilityUsage={};
      if(!parsed.venueVisits)parsed.venueVisits={};
      if(!parsed.guestEconomy)parsed.guestEconomy={purchases:0,spend:0,walkaways:0};
      return migrateStaffOperations(parsed);
    }
  } catch (_) {}
  const fresh = showcaseMode?createShowcaseRun():createRun();
  localStorage.setItem(activeStorageKey(), JSON.stringify(fresh));
  fresh.player = { x:21, y:18, zone:"campus" };
  return fresh;
}

function save(next) {
  localStorage.setItem(activeStorageKey(), JSON.stringify(next));
  run = next;
  syncCampusBounds();
  updateHUD();
  if (activeLocation) locations[activeLocation].panel();
}

function updateHUD() {
  const zone=activeZone();
  const campus=campusMetrics(run),progression=progressionState(run),operations=operationsSnapshot(run),pulse=tycoonPulse(run);
  const phase=campusPhase(run.clockMinutes),light=lightingProfile(run.clockMinutes),environment=environmentalProfile();
  $("#game").dataset.light=light.stage;
  $("#zoneName").textContent=zone.name;
  $("#zoneSub").textContent=zone.sub;
  $("#miniMapTitle").textContent=zone.outdoor?"CAMPUS MAP":"ROOM PLAN";
  $("#game").classList.toggle("indoors",!zone.outdoor);
  $("#weatherIcon").textContent=zone.outdoor?(environment.wind>.7?"≋":light.stage==="dusk"?"◒":light.stage==="sunset"?"◐":"☀"):"⌂";
  $("#weatherTemp").textContent=zone.outdoor?`${environment.temperature}°`:"IN";
  const peak=crowdPeak(run.clockMinutes);
  $("#weatherNote").textContent=zone.outdoor?`${environment.label} · ${phase.name.toUpperCase()}`:zone.sub;
  document.querySelectorAll("[data-zone-indicator]").forEach(item=>item.classList.toggle("active",item.dataset.zoneIndicator===zone.id));
  $("#dayStat").textContent = `${run.currentDay}`;
  $("#timeStat").textContent = formatClock(run.clockMinutes);
  $("#phaseStat").textContent=phase.short;
  $("#timeCenter").style.setProperty("--phase-color",phase.color);
  $("#cashStat").textContent = formatEuro(run.cash);
  $("#repStat").textContent = `${run.reputation || 0} ★`;
  $("#levelStat").textContent = `LV ${progression.level}`;
  $("#guestStat").textContent = `${guestAgents.length||campus.guests}`;
  $("#ratingStat").textContent = `${campus.rating}%`;
  const totalStock = Object.values(run.stock).reduce((a, b) => a + b, 0);
  const unlockedProducts = CATALOGUE.filter(product => (run.venues?.[product.storeId] ?? 0) >= (product.tier || 1));
  const demandCapacity = unlockedProducts.reduce((sum, product) => sum + demandFor(run.prices[product.id], product.reference), 0);
  const lockedVenue=STORES.find(store=>(run.venues?.[store.id]??0)===0),openCount=STORES.filter(store=>(run.venues?.[store.id]??0)>0).length;
  $("#pulseDemand").textContent = `${pulse.momentum} momentum · ${pulse.projectedGuests} guests`;
  const activeGuests=guestAgents.length||campus.guests,usingGuests=guestAgents.filter(guest=>guest.state==="using"||guest.state==="queueing").length;
  $("#pulseVenues").textContent = operations.openIssues?`${operations.openIssues} work orders · ${operations.closedAssets} closures`:`${pulse.stockCoverage}% stocked · ${usingGuests}/${activeGuests} engaged`;
  $("#pulseMilestone").textContent = `${pulse.status} · ${pulse.score}/100 management score`;
  $("#worldPulse")?.setAttribute("data-status",pulse.status.toLowerCase().replace(/\s+/g,"-"));
  $("#eventIcon").textContent = peak.id==="lunch"?"☀":peak.id==="arrival"?"↗":peak.id==="break"?"◇":peak.id==="sunset"?"★":"▰";
  $("#eventDistrict").textContent = `LIVE · ${formatClock(run.clockMinutes)}`;
  const liveEvent=EVENT_CATALOGUE.find(event=>event.id===run.activeEvent?.id)||run.activeEvent;$("#eventTitle").textContent = liveEvent?liveEvent.name:run.scheduledEvent?`${run.scheduledEvent.name} scheduled`:peak.label;
  $("#eventObjective").textContent = liveEvent?`${Math.ceil(run.activeEvent.remainingMinutes)} min · ${run.activeEvent.attendance||0}/${run.activeEvent.capacity||liveEvent.guestBonus} attending`:run.scheduledEvent?`Day ${run.scheduledEvent.day} · ${formatClock(run.scheduledEvent.startMinute)}`:peak.multiplier>1?`${peak.multiplier.toFixed(1)}× customer flow`:"Quiet planning window";
  const pending=(run.deliveries||[]).filter(item=>item.status==="scheduled").sort((a,b)=>a.arrivalDay-b.arrivalDay||a.arrivalMinute-b.arrivalMinute)[0],nextWindow=nextDeliveryWindow(run),delivery=pending||{arrivalDay:nextWindow.day,arrivalMinute:nextWindow.minute,label:nextWindow.label};
  $("#deliveryChipText").textContent=`${delivery.arrivalDay===run.currentDay?"TODAY":`DAY ${delivery.arrivalDay}`} · ${formatClock(delivery.arrivalMinute)} · ${delivery.label}`;
  $("#deliveryChip").classList.toggle("incoming",Boolean(pending&&pending.arrivalDay===run.currentDay&&pending.arrivalMinute-run.clockMinutes<=60));
  if($("#dayReportLiveTime"))$("#dayReportLiveTime").textContent=`Day ${run.currentDay} is already running · ${formatClock(run.clockMinutes)}`;
  const focusStoreId=run.venuePurchases?.at(-1)?.storeId||"cafe",focusStore=STORES.find(store=>store.id===focusStoreId),focusStock=CATALOGUE.filter(product=>product.storeId===focusStoreId).reduce((sum,product)=>sum+run.stock[product.id],0);
  let title = `Stock ${focusStore.name}`, text = `${focusStore.short} is open. Buy its first inventory so visible guests can queue and purchase.`, progress = Math.min(100,openCount*22+campus.rating*.34);
  if(totalStock>0){title=peak.id==="lunch"?"Lunch rush is live":peak.id==="arrival"?"Morning crowd incoming":"Grow your campus business";text=`${activeGuests} students are navigating the campus. Watch them queue, use amenities and react to what you build.`;}
  else if(focusStock===0&&focusStoreId!=="cafe"){text=`Your new ${focusStore.short} needs stock before its first queue can form.`;}
  const venueDistrictReady=lockedVenue&&(!["beach","surf"].includes(lockedVenue.id)||(lockedVenue.id==="beach"?run.districts?.east:run.districts?.pier));
  if(lockedVenue&&run.cash>=STORE_UNLOCKS[lockedVenue.id]&&progression.level>=(STORE_REQUIREMENTS[lockedVenue.id]||1)&&venueDistrictReady){title=`You can open ${lockedVenue.name}`;text="Reinvest your profits in the next venue, then stock its first product.";}
  if(progression.next&&progression.progress>=75){title=`Level ${progression.next.level} is close`;text=`Keep serving guests to unlock ${progression.next.unlock}. ${progression.xp}/${progression.next.xp} XP.`;}
  if(operations.litter&&!operations.closedAssets){title="Campus cleanup needed";text=`${operations.litter} litter ${operations.litter===1?"spill is":"spills are"} lowering cleanliness. Assign an on-shift caretaker to the affected district.`;}
  if(operations.closedAssets){title=`${operations.closedAssets} ${operations.closedAssets===1?"asset is":"assets are"} temporarily closed`;text="Assign an on-shift technician to the affected district. Guests will avoid the asset until the repair is complete.";}
  if(operations.payrollDue){title="Operations team is off duty";text=`Settle ${formatEuro(operations.payrollDue)} in overdue wages to resume queue support, cleaning and repairs.`;}
  else if(run.performance?.operatingDue){title="Campus bills need attention";text=`Settle ${formatEuro(run.performance.operatingDue)} in venue and district costs before momentum falls further.`;}
  $("#missionTitle").textContent = title;
  $("#missionText").textContent = text;
  $("#missionProgress").style.width = `${progress}%`;
  document.querySelectorAll("[data-speed]").forEach(button=>button.classList.toggle("active",Number(button.dataset.speed)===run.speed));
  $("#clockIcon").textContent=run.speed===0?"▶":"Ⅱ";$("#clockLabel").textContent=run.speed===0?"Resume":"Pause";
  $("#game").classList.toggle("build-mode",Boolean(pendingBuild));
  $("#game").classList.toggle("showcase-mode",showcaseMode);$("#showcaseButton").textContent=showcaseMode?"Editor active":"Showcase";$("#showcaseButton").setAttribute("aria-pressed",String(showcaseMode));
  if(showcaseMode){$("#missionTitle").textContent="Showcase editor active";$("#missionText").textContent="Every progression gate is open in this separate presentation save.";$("#missionProgress").style.width="100%";}
  refreshBuildNotice();
  refreshTimePanelLive();
  refreshStoreHoursPanelLive();
  refreshOperationsPanelLive();
  renderManagementHUD();
}

const overlayCopy={
  flow:{title:"Guest flow",legend:[["#bce65f","Walking"],["#f5c95e","Queueing"],["#64cbc8","Using"]]},
  needs:{title:"Campus needs",legend:[["#ff8060","Pressure"],["#f5c95e","Average"],["#64cbc8","Covered"]]},
  trade:{title:"Commercial",legend:[["#bce65f","Trading"],["#f5c95e","Low stock"],["#ff8060","Blocked"]]},
  operations:{title:"Operations",legend:[["#64cbc8","Covered"],["#f5c95e","Work order"],["#ff8060","Closed"]]}
};

function setManagementOverlay(mode,announce=true){
  if(!OVERLAY_MODES.includes(mode))return;managementOverlay=mode;localStorage.setItem(OVERLAY_STORAGE_KEY,mode);renderManagementHUD();if(announce)toast(`${overlayCopy[mode].title} overlay active`);
}

function renderManagementHUD(){
  const overview=managementOverview(run),copy=overlayCopy[managementOverlay];
  $("#overlayTitle").textContent=copy.title;
  $("#overlayLegend").innerHTML=copy.legend.map(([color,label])=>`<span><i style="--legend:${color}"></i>${label}</span>`).join("");
  document.querySelectorAll("[data-overlay]").forEach(button=>{const active=button.dataset.overlay===managementOverlay;button.classList.toggle("active",active);button.setAttribute("aria-pressed",String(active));});
  const alerts=overview.alerts.slice(0,3),feed=$("#decisionFeed");
  feed.innerHTML=`<div class="decision-feed-head"><span>LIVE BRIEFING</span><b>${overview.score}</b><small>${overview.status}</small></div>${alerts.map((alert,index)=>`<button data-alert-action="${alert.action}" class="decision-alert ${alert.severity}"><span>${alert.severity==="good"?"✓":index+1}</span><div><strong>${alert.title}</strong><small>${alert.detail}</small></div><em>OPEN</em></button>`).join("")}`;
  feed.querySelectorAll("[data-alert-action]").forEach(button=>button.addEventListener("click",()=>openPulseAction(button.dataset.alertAction)));
}

function formatClock(minutes){const value=Math.floor(minutes||DAY_START),hours=Math.floor(value/60)%24,mins=value%60;return `${String(hours).padStart(2,"0")}:${String(mins).padStart(2,"0")}`;}
function formatDuration(minutes){const value=Math.max(0,Math.round(minutes)),hours=Math.floor(value/60),mins=value%60;return hours?`${hours}h ${mins?`${mins}m`:""}`.trim():`${mins}m`;}
function timeInputToMinutes(value){const match=/^(\d{2}):(\d{2})$/.exec(String(value));if(!match)throw new Error("Choose valid opening and closing times.");return Number(match[1])*60+Number(match[2]);}

function lightingProfile(minutes){
  const stops=[
    {minute:DAY_START,top:"#79aebd",bottom:"#efd39c",overlay:"#f2aa67",alpha:.08,stage:"morning"},
    {minute:660,top:"#8dc8d5",bottom:"#d6e4c0",overlay:"#ffffff",alpha:0,stage:"day"},
    {minute:930,top:"#82bfd1",bottom:"#dce4bc",overlay:"#f5c96c",alpha:.025,stage:"day"},
    {minute:1050,top:"#6d91ae",bottom:"#efb177",overlay:"#ef795f",alpha:.1,stage:"sunset"},
    {minute:DAY_END,top:"#203e58",bottom:"#80606a",overlay:"#173747",alpha:.24,stage:"dusk"}
  ];
  const value=Math.max(DAY_START,Math.min(DAY_END,minutes)),right=stops.find(stop=>stop.minute>=value)||stops.at(-1),left=stops[Math.max(0,stops.indexOf(right)-1)]||right,span=Math.max(1,right.minute-left.minute),mix=Math.max(0,Math.min(1,(value-left.minute)/span));
  return {top:mixColor(left.top,right.top,mix),bottom:mixColor(left.bottom,right.bottom,mix),overlay:mixColor(left.overlay,right.overlay,mix),alpha:left.alpha+(right.alpha-left.alpha)*mix,stage:mix>.55?right.stage:left.stage,progress:(value-DAY_START)/(DAY_END-DAY_START)};
}

function environmentalProfile(minutes=run.clockMinutes,day=run.currentDay,t=lastTime){
  const daySeed=((day*37)%17)/17,afternoon=Math.max(0,Math.sin(((minutes-DAY_START)/(DAY_END-DAY_START))*Math.PI));
  const baseWind=.38+daySeed*.24+afternoon*.22,gust=reducedMotion?0:Math.sin(t*.00073+day*.91)*.1+Math.sin(t*.00191+day)*.045;
  const wind=Math.max(.18,Math.min(.92,baseWind+gust)),sea=.42+wind*.52,cloud=.12+((day*11)%9)/30;
  const temperature=Math.round(20+afternoon*4-daySeed*1.4),label=wind>.72?"COASTAL WIND":wind>.48?"ATLANTIC BREEZE":"CALM SURF";
  return {wind,sea,cloud,temperature,label,direction:1,phase:reducedMotion?0:t*.001};
}

function drawSkyMotion(t,environment,w,h){
  ctx.save();ctx.globalAlpha=.14+environment.cloud*.2;
  for(let i=0;i<4;i++){
    const drift=reducedMotion?i*w/4:(t*.006*(.35+environment.wind)+i*211)%(w+280),x=drift-150,y=55+i*47+(i%2)*18,scale=.7+i*.12;
    ctx.fillStyle=i%2?"#f4eee1":"#edf4ed";ctx.beginPath();ctx.ellipse(x,y,58*scale,12*scale,0,0,Math.PI*2);ctx.ellipse(x+38*scale,y-7*scale,42*scale,15*scale,0,0,Math.PI*2);ctx.ellipse(x-35*scale,y+2*scale,35*scale,10*scale,0,0,Math.PI*2);ctx.fill();
  }
  ctx.globalAlpha=.34;ctx.strokeStyle="#173743";ctx.lineWidth=1.2;
  for(let i=0;i<3;i++){const x=reducedMotion?w*(.3+i*.2):((t*.018*(.55+environment.wind)+i*260)%(w+120))-60,y=86+i*31;ctx.beginPath();ctx.arc(x,y,6,Math.PI*1.08,Math.PI*1.82);ctx.arc(x+12,y,6,Math.PI*1.18,Math.PI*1.92);ctx.stroke();}
  ctx.restore();
}

function drawCoastalMotion(t,environment){
  ctx.save();ctx.lineCap="round";
  for(let band=0;band<5;band++){
    const y=25.55+band*.78,amplitude=2.2+band*.7+environment.sea*2,alpha=.18+band*.07;ctx.strokeStyle=`rgba(229,251,247,${alpha})`;ctx.lineWidth=1.2+band*.3;ctx.beginPath();
    for(let x=-1;x<=58;x+=.35){const phase=x*.55-(reducedMotion?0:t*.0011*(.65+environment.sea))+band*.9,p=isoPoint(x,y+Math.sin(phase)*.075*environment.sea,5+Math.sin(phase)*amplitude);if(x===-1)ctx.moveTo(p.x,p.y);else ctx.lineTo(p.x,p.y);}ctx.stroke();
  }
  for(let ribbon=0;ribbon<3;ribbon++){
    ctx.strokeStyle=`rgba(255,255,245,${.34-ribbon*.07})`;ctx.lineWidth=2.4-ribbon*.35;ctx.beginPath();
    for(let x=0;x<=58;x+=.3){const phase=x*.48-(reducedMotion?0:t*.0015*(.8+environment.sea))+ribbon*1.7,p=isoPoint(x,25.1+ribbon*.16+Math.sin(phase)*.09,7);if(x===0)ctx.moveTo(p.x,p.y);else ctx.lineTo(p.x,p.y);}ctx.stroke();
  }
  for(let i=0;i<11;i++){const progress=reducedMotion?i/11:((t*.000035*(.8+environment.wind)+i/11)%1),p=isoPoint(2+i*5.1,25.25+progress*3.9,8);ctx.fillStyle=`rgba(240,255,250,${.3*(1-progress)})`;ctx.beginPath();ctx.ellipse(p.x,p.y,7+progress*5,1.4,0,0,Math.PI*2);ctx.fill();}
  ctx.restore();
}

function drawWindFlag(x,y,z,color,t,environment,scale=1){
  const pole=isoPoint(x,y,z);ctx.save();ctx.strokeStyle="#173743";ctx.lineWidth=2.5*scale;ctx.beginPath();ctx.moveTo(pole.x,pole.y+23*scale);ctx.lineTo(pole.x,pole.y-25*scale);ctx.stroke();
  const flutter=(reducedMotion?0:Math.sin(t*.008+x*1.7+y))*3.2*environment.wind;ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(pole.x,pole.y-24*scale);ctx.quadraticCurveTo(pole.x+12*scale,pole.y-22*scale+flutter,pole.x+25*scale,pole.y-16*scale);ctx.quadraticCurveTo(pole.x+12*scale,pole.y-10*scale-flutter*.45,pole.x,pole.y-9*scale);ctx.closePath();ctx.fill();ctx.restore();
}

function drawAmbientLighting(light,w,h){
  const sunX=w*(.13+light.progress*.75),sunY=h*(.16+Math.pow(Math.abs(light.progress-.48),1.7)*.35);ctx.save();const glow=ctx.createRadialGradient(sunX,sunY,4,sunX,sunY,Math.max(w,h)*.32);glow.addColorStop(0,light.stage==="sunset"?"rgba(255,196,112,.3)":"rgba(255,245,196,.2)");glow.addColorStop(1,"rgba(255,255,255,0)");ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);if(light.alpha>0){ctx.fillStyle=light.overlay;ctx.globalAlpha=light.alpha;ctx.fillRect(0,0,w,h);}ctx.restore();
}

function resize() {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = rect.width * dpr; canvas.height = rect.height * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function worldToScreen(x, y) {
  const p=isoPoint(x,y),c=isoPoint(camera.x,camera.y);
  return {x:(p.x-c.x)*camera.zoom+canvas.clientWidth/2,y:(p.y-c.y)*camera.zoom+canvas.clientHeight/2};
}

function isoPoint(x,y,z=0){
  if(objectTransform){const dx=x-objectTransform.x,dy=y-objectTransform.y,turn=objectTransform.rotation%4;if(turn===1){x=objectTransform.x-dy;y=objectTransform.y+dx;}else if(turn===2){x=objectTransform.x-dx;y=objectTransform.y-dy;}else if(turn===3){x=objectTransform.x+dy;y=objectTransform.y-dx;}}
  return {x:(x-y)*TILE_W/2,y:(x+y)*TILE_H/2-z};
}

function roundedRect(x, y, w, h, r, fill) {
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fillStyle = fill; ctx.fill();
}

function buildCost(build){if(build.mode==="move")return 0;if(build.type==="experience")return 1200+attractionStats(build.modules).cost;return FACILITY_CATALOGUE.find(item=>item.id===build.type)?.cost||0;}
function footprintRect(type,x,y,rotation=0){const size=facilityFootprint(type,rotation);return {x:x-size.width/2,y:y-size.height/2,w:size.width,h:size.height};}
function rectsOverlap(a,b,margin=.08){return a.x<b.x+b.w+margin&&a.x+a.w>b.x-margin&&a.y<b.y+b.h+margin&&a.y+a.h>b.y-margin;}
function rectTouchesCircle(rect,circle,margin=0){const nx=Math.max(rect.x,Math.min(circle.x,rect.x+rect.w)),ny=Math.max(rect.y,Math.min(circle.y,rect.y+rect.h));return Math.hypot(nx-circle.x,ny-circle.y)<circle.r+margin;}
function snappedBuildPoint(x,y){return {x:Math.round(x*2)/2,y:Math.round(y*2)/2};}
function canvasWorldPoint(event){const rect=canvas.getBoundingClientRect(),cp=isoPoint(camera.x,camera.y),ix=(event.clientX-rect.left-canvas.clientWidth/2)/camera.zoom+cp.x,iy=(event.clientY-rect.top-canvas.clientHeight/2)/camera.zoom+cp.y;return {x:iy/TILE_H+ix/TILE_W,y:iy/TILE_H-ix/TILE_W};}

function validateBuildPoint(x,y,build=pendingBuild){
  if(!build||currentZone!=="campus")return {valid:false,reason:"Return to the outdoor campus"};
  const footprint=footprintRect(build.type,x,y,build.rotation||0),zone=ZONES.campus;
  if(footprint.x<zone.minX||footprint.x+footprint.w>zone.maxX||footprint.y<zone.minY||footprint.y+footprint.h>22.5)return {valid:false,reason:"Outside the construction boundary"};
  for(const area of RESERVED_BUILD_AREAS){if(area.kind==="rect"&&rectsOverlap(footprint,area,0))return {valid:false,reason:`Reserved: ${area.label}`};if(area.kind==="circle"&&rectTouchesCircle(footprint,area,.1))return {valid:false,reason:`Reserved: ${area.label}`};}
  for(const facility of run.facilities||[]){if(build.sourceId===facility.id)continue;const occupied=footprintRect(facility.type,facility.x,facility.y,facility.rotation||0);if(rectsOverlap(footprint,occupied,.1))return {valid:false,reason:`Blocked by ${facility.name}`};}
  for(const tree of campusTrees){if(rectTouchesCircle(footprint,{x:tree[0],y:tree[1],r:.55*tree[2]},.05))return {valid:false,reason:"A palm occupies this tile"};}
  if(build.type!=="path")for(const location of Object.values(locations).filter(item=>item.zone==="campus")){if(rectTouchesCircle(footprint,{x:location.x,y:location.y,r:location.kind==="door"?1.15:1.35},.05))return {valid:false,reason:`Keep access clear: ${location.title}`};}
  if(build.mode!=="move"&&run.cash<buildCost(build))return {valid:false,reason:`Need ${formatEuro(buildCost(build))}`};
  return {valid:true,reason:build.mode==="move"?"Move here":"Ready to build"};
}

function updateBuildCursor(x,y){if(!pendingBuild)return;const point=snappedBuildPoint(x,y),status=validateBuildPoint(point.x,point.y);buildCursor={...point,...status};refreshBuildNotice();}
function refreshBuildNotice(){const notice=$("#buildNotice");if(!notice)return;notice.classList.toggle("hidden",!pendingBuild);notice.classList.toggle("invalid",Boolean(pendingBuild&&buildCursor&&!buildCursor.valid));if(!pendingBuild)return;$("#buildNoticeName").textContent=pendingBuild.name;$("#buildNoticeStatus").textContent=buildCursor?.reason||"Move the cursor onto the campus";$("#buildRotation").textContent=`${(pendingBuild.rotation||0)*90}°`;}

function drawBuildGhost(t){
  if(!pendingBuild||!buildCursor||currentZone!=="campus")return;const valid=buildCursor.valid,color=valid?"#bce65f":"#ff7458",size=facilityFootprint(pendingBuild.type,pendingBuild.rotation||0),x=buildCursor.x,y=buildCursor.y,z=8;
  const corners=[isoPoint(x-size.width/2,y-size.height/2,z),isoPoint(x+size.width/2,y-size.height/2,z),isoPoint(x+size.width/2,y+size.height/2,z),isoPoint(x-size.width/2,y+size.height/2,z)];ctx.save();ctx.setLineDash([8,5]);drawPlane(corners,valid?"rgba(188,230,95,.28)":"rgba(255,116,88,.3)",color,2.5);ctx.setLineDash([]);ctx.globalAlpha=.62;drawPlacedFacility({type:pendingBuild.type,x,y,rotation:pendingBuild.rotation||0,modules:pendingBuild.modules||[],name:pendingBuild.name},t,-1);ctx.globalAlpha=1;const tag=isoPoint(x,y,z+74);roundedRect(tag.x-57,tag.y-11,114,22,8,"rgba(7,29,37,.94)");ctx.fillStyle=color;ctx.beginPath();ctx.arc(tag.x-45,tag.y,3.5,0,Math.PI*2);ctx.fill();ctx.fillStyle="#fff";ctx.textAlign="center";ctx.font="700 6px DM Mono";ctx.fillText(valid?"CLICK TO PLACE":"BLOCKED",tag.x+5,tag.y+2);ctx.restore();
}

function drawWorldLabel(x,y,z,title,accent="#bce65f"){
  if(currentZone==="campus"&&Math.hypot(run.player.x-x,run.player.y-y)>5.4&&managementOverlay==="flow")return;
  const p=isoPoint(x,y,z);ctx.save();ctx.shadowColor="rgba(3,22,28,.25)";ctx.shadowBlur=12;
  roundedRect(p.x-45,p.y-9,90,18,9,"rgba(7,29,37,.86)");ctx.shadowBlur=0;
  ctx.fillStyle=accent;ctx.beginPath();ctx.arc(p.x-35,p.y,3,0,Math.PI*2);ctx.fill();ctx.fillStyle="#fff";ctx.textAlign="center";ctx.font="700 6px DM Mono";ctx.fillText(title,p.x+4,p.y+2);ctx.restore();
}

function overlayMarker(x,y,z,title,value,color="#bce65f",danger=false){
  const p=isoPoint(x,y,z);ctx.save();ctx.shadowColor="rgba(3,22,28,.3)";ctx.shadowBlur=11;roundedRect(p.x-47,p.y-13,94,26,8,"rgba(5,27,35,.92)");ctx.shadowBlur=0;ctx.fillStyle=color;ctx.fillRect(p.x-47,p.y-13,4,26);ctx.fillStyle="#819ba0";ctx.textAlign="left";ctx.font="700 5.5px DM Mono";ctx.fillText(title.toUpperCase(),p.x-36,p.y-3);ctx.fillStyle=danger?"#ff9b82":"#fff";ctx.font="800 7px Manrope";ctx.fillText(value,p.x-36,p.y+7);ctx.restore();
}

function overlayDistrict(x,y,w,h,color,alpha=.16){
  const points=[isoPoint(x,y,10),isoPoint(x+w,y,10),isoPoint(x+w,y+h,10),isoPoint(x,y+h,10)];ctx.save();ctx.fillStyle=color;ctx.globalAlpha=alpha;ctx.beginPath();points.forEach((point,index)=>index?ctx.lineTo(point.x,point.y):ctx.moveTo(point.x,point.y));ctx.closePath();ctx.fill();ctx.globalAlpha=.72;ctx.strokeStyle=color;ctx.lineWidth=2;ctx.setLineDash([8,6]);ctx.stroke();ctx.restore();
}

function storeOverlayPoint(storeId){return {cafe:{x:20,y:12.9},snack:{x:28,y:21.4},merch:{x:34.5,y:14.8},beach:{x:45.9,y:20.5},surf:{x:53.1,y:16.1}}[storeId];}

function operationsIssuePoint(issue){
  if(Number.isFinite(issue.x)&&Number.isFinite(issue.y))return issue;
  if(issue.targetKind==="facility"){const facility=(run.facilities||[]).find(item=>item.id===issue.targetId);if(facility)return facility;}
  if(issue.targetKind==="store")return storeOverlayPoint(issue.targetId);
  if(issue.targetId==="pavilion")return locations.pavilion;
  return issue.districtId==="pier"?{x:53,y:17}:issue.districtId==="east"?{x:45,y:17}:{x:24,y:17};
}

function drawManagementOverlay(t){
  if(currentZone!=="campus"||pendingBuild)return;const overview=managementOverview(run);
  if(managementOverlay==="flow"){
    ctx.save();ctx.lineCap="round";for(const guest of guestAgents.filter(item=>item.target&&item.target.kind!=="exit").slice(0,26)){const target=guest.route?.[guest.routeIndex]||guest.target,a=isoPoint(guest.x,guest.y,7),b=isoPoint(target.x,target.y,7),color=guest.state==="queueing"?"#f5c95e":guest.state==="using"?"#64cbc8":"#bce65f";ctx.strokeStyle=color;ctx.globalAlpha=guest.state==="walking"?.18:.42;ctx.lineWidth=guest.state==="walking"?1.3:2.2;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}
    ctx.restore();
  }
  if(managementOverlay==="needs"){
    const amenityColors={water:"#64cbc8",restroom:"#7e9ec5",bench:"#f5c95e",foodGarden:"#ff9b61",bin:"#78c77a"};for(const facility of (run.facilities||[]).filter(item=>amenityColors[item.type])){const p=isoPoint(facility.x,facility.y,8),radius=46+(facility.type==="foodGarden"?22:0);ctx.save();ctx.fillStyle=amenityColors[facility.type];ctx.globalAlpha=.1;ctx.beginPath();ctx.ellipse(p.x,p.y,radius,radius*.42,0,0,Math.PI*2);ctx.fill();ctx.globalAlpha=.65;ctx.strokeStyle=amenityColors[facility.type];ctx.lineWidth=1.5;ctx.setLineDash([6,5]);ctx.stroke();ctx.restore();}
    const weak=overview.weakestNeeds;overlayMarker(20.5,15.5,114,"Weakest need",`${weak[0].label} ${weak[0].value}% · ${weak[1].label} ${weak[1].value}%`,weak[0].value<50?"#ff8060":"#f5c95e",weak[0].value<45);
  }
  if(managementOverlay==="trade"){
    for(const store of overview.stores.filter(item=>item.level)){const point=storeOverlayPoint(store.id),queues=guestAgents.filter(guest=>guest.state==="queueing"&&guest.target?.id===store.id).length,color=store.closed?"#ff8060":store.stockCoverage<50?"#f5c95e":"#bce65f",value=store.closed?"REPAIR REQUIRED":!store.open?"CLOSED BY SCHEDULE":`${store.stockUnits} units · ${queues} in queue`;overlayMarker(point.x,point.y,132,store.short,value,color,store.closed||store.stockCoverage===0);}
  }
  if(managementOverlay==="operations"){
    const geometry={coast:[2,14.1,37,9],east:[40.5,9.7,8.2,12.6],pier:[49.2,13.4,6.4,6.7]};for(const district of overview.districts){const [x,y,w,h]=geometry[district.id],color=district.breakdowns?"#ff8060":district.issues?"#f5c95e":"#64cbc8";overlayDistrict(x,y,w,h,color,district.issues ? .2 : .1);overlayMarker(x+w*.5,y+h*.45,102,district.name,`${district.cleanliness}% clean · ${district.onShift} staff · ${district.issues} jobs`,color,Boolean(district.breakdowns));}
    for(const issue of run.operations?.issues||[]){const point=operationsIssuePoint(issue),pulse=10+Math.sin(t*.006)*2;ctx.save();ctx.fillStyle=issue.type==="breakdown"?"rgba(255,128,96,.23)":"rgba(245,201,94,.22)";ctx.beginPath();ctx.arc(isoPoint(point.x,point.y,15).x,isoPoint(point.x,point.y,15).y,pulse,0,Math.PI*2);ctx.fill();ctx.restore();}
  }
}

function drawWorld(t) {
  const w = canvas.clientWidth, h = canvas.clientHeight;
  ctx.clearRect(0, 0, w, h);
  const zone=activeZone(),light=lightingProfile(run.clockMinutes),environment=environmentalProfile(run.clockMinutes,run.currentDay,t),sky=ctx.createLinearGradient(0,0,0,h);
  if(zone.outdoor){sky.addColorStop(0,light.top);sky.addColorStop(1,light.bottom);}else{sky.addColorStop(0,"#122d36");sky.addColorStop(1,"#34505a");}
  ctx.fillStyle=sky;ctx.fillRect(0,0,w,h);
  if(zone.outdoor)drawSkyMotion(t,environment,w,h);
  const cp=isoPoint(camera.x,camera.y);
  ctx.save();
  ctx.translate(w/2-cp.x*camera.zoom,h/2-cp.y*camera.zoom);
  ctx.scale(camera.zoom, camera.zoom);
  drawTerrain(t);
  if(zone.outdoor)drawCoastalMotion(t,environment);
  if(zone.outdoor)drawCampusGroundPlan(t);
  const worldActors=zone.outdoor?[
    {depth:14.4,draw:()=>drawLibrary()},
    {depth:21.8,draw:()=>drawMercadoExterior()},
    {depth:31.2,draw:()=>drawCampus(t)},
    {depth:46.8,draw:()=>drawStudentHub()},
    {depth:43,draw:()=>drawBeachStage(t)},
    ...(run.facilities||[]).filter(facility=>pendingBuild?.sourceId!==facility.id).map((facility,i)=>({depth:facility.x+facility.y,draw:()=>drawPlacedFacility(facility,t,i)})),
    ...(pendingBuild&&buildCursor?[{depth:buildCursor.x+buildCursor.y+.02,draw:()=>drawBuildGhost(t)}]:[]),
    ...campusTrees.map((tree,i)=>({depth:tree[0]+tree[1],draw:()=>drawTree(tree[0],tree[1],tree[2],t+i*170,environment)})),
    ...deliveryWorldActors(t),
    ...operationsWorldActors(t),
    ...liveCrowd(t)
  ]:drawRoomActors(t);
  const actors=[...worldActors,
    ...zoneLocations().map(([id,location])=>({depth:location.x+location.y,draw:()=>drawLocation(id)})),
    {depth:run.player.x+run.player.y,draw:()=>drawPlayer(t)}
  ].sort((a,b)=>a.depth-b.depth);
  actors.forEach(actor => actor.draw());
  drawManagementOverlay(t);
  ctx.restore();
  if(zone.outdoor)drawAmbientLighting(light,w,h);
}

function drawTerrain(t) {
  const zone=activeZone(),tiles=[],center=isoPoint(camera.x,camera.y),viewX=canvas.clientWidth/(2*camera.zoom)+TILE_W*2,viewY=canvas.clientHeight/(2*camera.zoom)+TILE_H*3;
  for(let y=0;y<zone.height;y++)for(let x=0;x<zone.width;x++){const point=isoPoint(x,y);if(Math.abs(point.x-center.x)<=viewX&&Math.abs(point.y-center.y)<=viewY)tiles.push({x,y,d:x+y});}
  tiles.sort((a,b)=>a.d-b.d);
  tiles.forEach(({x,y})=>{
    let color=zone.floor||"#79aa67",depth=4;
    if(zone.outdoor){
      if(y>=26){color=(x%5===0)?"#448fa0":"#3f899b";depth=0;}
      else if(y>=23)color=(x%4===0)?"#e4c986":"#dec27e";
      else if((y>=8&&y<18&&x>=2&&x<=39)||y>=18)color=((Math.floor(x/3)+Math.floor(y/3))%2)?"#d0d0c7":"#ccccc3";
      else color=((Math.floor(x/4)+Math.floor(y/4))%2)?"#7ca66b":"#78a267";
    } else color=(x+y)%2?zone.floor:mixColor(zone.floor,"#ffffff",.07);
    drawTile(x,y,color,depth);
    if(zone.outdoor&&y===25){const p=isoPoint(x+.5,y+.5,5);ctx.strokeStyle="rgba(255,255,255,.55)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(p.x-24,p.y+Math.sin(t*.002+x)*2);ctx.lineTo(p.x+24,p.y+Math.sin(t*.002+x+1)*2);ctx.stroke();}
  });
}

function mixColor(a,b,amount){const value=color=>color.match(/\w\w/g).map(hex=>parseInt(hex,16)),x=value(a),y=value(b);return `rgb(${x.map((channel,index)=>Math.round(channel+(y[index]-channel)*amount)).join(",")})`;}

function drawTile(x,y,color,depth=0){const a=isoPoint(x,y),b=isoPoint(x+1,y),c=isoPoint(x+1,y+1),d=isoPoint(x,y+1);ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.lineTo(c.x,c.y);ctx.lineTo(d.x,d.y);ctx.closePath();ctx.fill();ctx.strokeStyle="rgba(20,48,45,.035)";ctx.lineWidth=.65;ctx.stroke();if(depth){ctx.fillStyle="rgba(45,67,54,.16)";ctx.beginPath();ctx.moveTo(d.x,d.y);ctx.lineTo(c.x,c.y);ctx.lineTo(c.x,c.y+depth);ctx.lineTo(d.x,d.y+depth);ctx.closePath();ctx.fill();}}

function drawPlane(points,fill,stroke="rgba(8,42,51,.13)",lineWidth=.8){ctx.beginPath();points.forEach((point,index)=>index?ctx.lineTo(point.x,point.y):ctx.moveTo(point.x,point.y));ctx.closePath();ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lineWidth;ctx.stroke();}}

function drawGroundSlab(x,y,w,h,color="#e9e6db",depth=3){drawBlock(x,y,w,h,depth,color,mixColor(color,"#000000",.18),mixColor(color,"#000000",.1));}

function drawRaisedSlab(x,y,w,h,z,thickness=4,top="#f5f3eb",right="#aeb8b4",left="#c7ccc8"){
  const a=isoPoint(x,y,z),b=isoPoint(x+w,y,z),c=isoPoint(x+w,y+h,z),d=isoPoint(x,y+h,z),bb=isoPoint(x+w,y,z-thickness),bc=isoPoint(x+w,y+h,z-thickness),bd=isoPoint(x,y+h,z-thickness);
  drawPlane([d,c,bc,bd],left);drawPlane([b,c,bc,bb],right);drawPlane([a,b,c,d],top);
}

const WORLD_MATERIALS={chalk:"#f4f1e8",chalkShade:"#c8cec9",glass:"#174a58",glassLight:"#2c6972",timber:"#b78352",coral:"#ed7458",lime:"#bce65f",sand:"#dfc58c",ink:"#12343e"};

function drawSoftShadow(x,y,rx=42,ry=15,alpha=.16){
  const p=isoPoint(x,y,1);ctx.save();ctx.fillStyle=`rgba(8,32,37,${alpha})`;ctx.filter="blur(2px)";ctx.beginPath();ctx.ellipse(p.x+4,p.y+5,rx,ry,0,0,Math.PI*2);ctx.fill();ctx.restore();
}

function drawConcreteSeams(x,y,w,h,z=6,step=1.4){
  ctx.save();ctx.strokeStyle="rgba(20,61,66,.1)";ctx.lineWidth=.7;
  for(let px=x+step;px<x+w;px+=step){const a=isoPoint(px,y,z),b=isoPoint(px,y+h,z);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}
  for(let py=y+step;py<y+h;py+=step){const a=isoPoint(x,py,z),b=isoPoint(x+w,py,z);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}
  ctx.restore();
}

function drawColumnLine(x,y,length,count,z=28,axis="x",color="#244b54"){
  ctx.save();ctx.strokeStyle=color;ctx.lineWidth=2.2;
  for(let i=0;i<count;i++){const amount=count===1?.5:i/(count-1),px=x+(axis==="x"?length*amount:0),py=y+(axis==="y"?length*amount:0),a=isoPoint(px,py,3),b=isoPoint(px,py,z);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}
  ctx.restore();
}

function drawLinearPlanter(x,y,w,h,z=13){
  drawBlock(x,y,w,h,z,"#d9d3c6","#8d9792","#adb2ab");
  const count=Math.max(2,Math.round(w*1.5));for(let i=0;i<count;i++){const p=isoPoint(x+.25+(w-.5)*i/(count-1),y+h*.5,z+5+(i%2)*2);ctx.fillStyle=i%2?"#668a67":"#4d765c";ctx.beginPath();ctx.ellipse(p.x,p.y,8,4.5,-.2,0,Math.PI*2);ctx.fill();}
}

function drawBladeSign(x,y,z,label,accent){
  const p=isoPoint(x,y,z);ctx.save();ctx.strokeStyle=WORLD_MATERIALS.ink;ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(p.x,p.y+18);ctx.lineTo(p.x,p.y-11);ctx.stroke();roundedRect(p.x-6,p.y-19,50,17,3,WORLD_MATERIALS.ink);ctx.fillStyle=accent;ctx.textAlign="center";ctx.font="900 5px DM Mono";ctx.fillText(label,p.x+19,p.y-8);ctx.restore();
}

function drawSpaceCaption(x,y,label,accent="#31545b"){
  const p=isoPoint(x,y,7);ctx.save();ctx.translate(p.x,p.y);ctx.rotate(Math.atan2(TILE_H/2,TILE_W/2));ctx.textAlign="left";ctx.font="800 5px DM Mono";ctx.fillStyle=accent;ctx.globalAlpha=.72;ctx.fillText(label.toUpperCase(),0,0);ctx.restore();
}

function drawPavingInlay(x,y,w,h,color="#f1ede3",step=1.25){
  drawGroundSlab(x,y,w,h,color,5);ctx.save();ctx.strokeStyle="rgba(27,65,68,.11)";ctx.lineWidth=.75;
  for(let px=x+step;px<x+w;px+=step){const a=isoPoint(px,y,7),b=isoPoint(px,y+h,7);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}
  ctx.restore();
}

function drawCampusBench(x,y,rotation=0,color="#b98b59"){
  const horizontal=rotation%2===0,w=horizontal?1.4:.42,h=horizontal?.42:1.4;drawRaisedSlab(x,y,w,h,16,5,color,"#76583e","#96704c");
  const a=horizontal?isoPoint(x+.12,y+h*.5,0):isoPoint(x+w*.5,y+.12,0),b=horizontal?isoPoint(x+w-.12,y+h*.5,0):isoPoint(x+w*.5,y+h-.12,0);ctx.strokeStyle="#274a52";ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(a.x,a.y-8);ctx.moveTo(b.x,b.y);ctx.lineTo(b.x,b.y-8);ctx.stroke();
}

function drawTerraceTable(x,y,accent="#ed7458"){
  const p=isoPoint(x,y,17);ctx.fillStyle="#ede8da";ctx.beginPath();ctx.ellipse(p.x,p.y,10,5,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle="#31545b";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(p.x,p.y+2);ctx.lineTo(p.x,p.y+15);ctx.stroke();
  const environment=environmentalProfile(),canopy=isoPoint(x,y,36),sway=reducedMotion?0:Math.sin(lastTime*.0016+x)*environment.wind*2.2;ctx.fillStyle=accent;ctx.beginPath();ctx.moveTo(canopy.x-13+sway,canopy.y);ctx.lineTo(canopy.x+sway*.55,canopy.y-7);ctx.lineTo(canopy.x+13+sway,canopy.y);ctx.closePath();ctx.fill();ctx.strokeStyle="#31545b";ctx.beginPath();ctx.moveTo(canopy.x+sway*.35,canopy.y);ctx.lineTo(p.x,p.y);ctx.stroke();
}

function drawPergola(x,y,w,h,accent="#f5c95e"){
  const posts=[[x,y],[x+w,y],[x,y+h],[x+w,y+h]];ctx.strokeStyle="#31545b";ctx.lineWidth=2.4;posts.forEach(([px,py])=>{const a=isoPoint(px,py,4),b=isoPoint(px,py,38);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();});
  for(let i=0;i<5;i++){const px=x+w*i/4,a=isoPoint(px,y,39),b=isoPoint(px,y+h,39);ctx.strokeStyle=i%2?accent:"#f5f1e6";ctx.lineWidth=3.2;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}
}

function drawArrivalPlaza(){
  drawPavingInlay(4.15,14.1,7.25,3.05,"#e9e4d9",1.05);drawGroundSlab(4.45,14.38,6.65,.28,WORLD_MATERIALS.coral,6);
  const center=isoPoint(7.65,15.65,8);ctx.save();ctx.translate(center.x,center.y);ctx.scale(1,.5);ctx.strokeStyle="#31545b";ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,24,0,Math.PI*2);ctx.stroke();ctx.fillStyle=WORLD_MATERIALS.coral;ctx.beginPath();ctx.arc(0,0,5,0,Math.PI*2);ctx.fill();ctx.restore();
  drawCampusBench(5.05,16.1);drawCampusBench(9.45,14.72);drawLinearPlanter(10.55,15.3,.55,1.2,13);drawSpaceCaption(4.45,16.9,"Arrival Plaza",WORLD_MATERIALS.coral);
}

function drawAcademicCourtyard(t){
  drawPavingInlay(12.65,9.25,15.15,5.15,"#f0ece3",1.35);drawGroundSlab(14.7,10.45,6.8,1.15,"#72bdc4",4);
  const water=isoPoint(18.1,11,6);ctx.save();ctx.globalAlpha=.42;ctx.strokeStyle="#f4ffff";ctx.lineWidth=1.2;for(let i=0;i<4;i++){ctx.beginPath();ctx.ellipse(water.x+i*6-9,water.y+i*3-4,32+Math.sin(t*.002+i)*2,7,0,0,Math.PI*2);ctx.stroke();}ctx.globalAlpha=.68;for(let jet=0;jet<3;jet++){const lift=10+Math.abs(Math.sin(t*.003+jet*1.2))*8;ctx.beginPath();ctx.moveTo(water.x-18+jet*18,water.y);ctx.quadraticCurveTo(water.x-15+jet*18,water.y-lift,water.x-7+jet*18,water.y+1);ctx.stroke();}ctx.restore();
  for(let i=0;i<4;i++)drawLinearPlanter(12.95+i*4.65,12.94,1.45,.68,14);
  drawCampusBench(13.35,11.8);drawCampusBench(24.8,11.75);drawSpaceCaption(13.05,9.75,"Academic Courtyard","#31545b");
  const pulse=2+Math.sin(t*.002)*.7,p=isoPoint(20.1,12.72,9);ctx.fillStyle=`rgba(100,203,200,${.12+pulse*.015})`;ctx.beginPath();ctx.ellipse(p.x,p.y,28,10,0,0,Math.PI*2);ctx.fill();
}

function drawCafeTerrace(){
  drawGroundSlab(13.55,14.05,8.2,2.35,"#d8cfbc",5);drawPergola(14.05,14.35,2.25,1.35,"#f2c85f");
  [[14.7,14.95],[17.1,14.7],[19.15,15.25],[20.65,14.55]].forEach(([x,y],index)=>drawTerraceTable(x,y,index%2?"#f5c95e":"#ed7458"));
  drawLinearPlanter(13.72,15.88,7.75,.42,12);drawSpaceCaption(13.8,16.25,"Shaded Café Terrace","#8b6645");
}

function drawServiceLane(){
  drawGroundSlab(2.15,17.15,12.35,2.15,"#9da39e",4);for(let i=0;i<8;i++){const a=isoPoint(2.55+i*1.45,18.22,6),b=isoPoint(3.18+i*1.45,18.22,6);ctx.strokeStyle="rgba(245,241,230,.62)";ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}
  for(let i=0;i<3;i++){const x=3.05+i*2.15;drawGroundSlab(x,17.38,1.3,.72,"#c5c6be",5);const p=isoPoint(x+.65,17.76,7);ctx.strokeStyle="#e8e5dc";ctx.lineWidth=1;ctx.strokeRect(p.x-15,p.y-6,30,12);}
  drawSpaceCaption(2.55,19.03,"Service & deliveries","#5d6765");
}

function drawFoodCourt(){
  drawPavingInlay(24.05,17.25,8.3,4.45,"#dfd8ca",1.2);drawPergola(24.65,17.75,3.05,1.15,"#f5c95e");drawPergola(28.25,17.75,3.25,1.15,"#64cbc8");
  [[25.35,19.75],[27.2,20.35],[29.25,19.75],[31,20.45]].forEach(([x,y],index)=>drawTerraceTable(x,y,index%2?"#64cbc8":"#f5c95e"));
  drawSpaceCaption(24.4,21.35,"Food Court","#8b6645");
}

function drawStudentLawn(){
  drawGroundSlab(32.35,17.15,6.8,5.1,"#83a774",3);const patches=[[33.2,18.2,"#e5c86f"],[35.2,20.4,"#ed7458"],[37.25,18.75,"#d8e8d0"],[33.8,21.25,"#64cbc8"]];
  patches.forEach(([x,y,color],index)=>{const p=isoPoint(x,y,5);ctx.fillStyle=color;ctx.globalAlpha=.72;ctx.beginPath();ctx.moveTo(p.x-14,p.y);ctx.lineTo(p.x,p.y-6);ctx.lineTo(p.x+14,p.y);ctx.lineTo(p.x,p.y+6);ctx.closePath();ctx.fill();ctx.globalAlpha=1;if(index<2)drawCampusBench(x+.35,y-.2,index);});
  drawLinearPlanter(38.4,17.55,.48,4.15,13);drawSpaceCaption(32.75,22.05,"Student Lawn","#456549");
}

function drawBeachPromenade(t){
  drawGroundSlab(2.1,21.62,37.2,1.38,"#c2b39a",5);for(let x=2.4;x<39;x+=1.1){const a=isoPoint(x,21.72,7),b=isoPoint(x,22.88,7);ctx.strokeStyle="rgba(91,72,53,.18)";ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}
  for(let x=5;x<39;x+=5.4){const base=isoPoint(x,22.15,7),top=isoPoint(x,22.15,35);ctx.strokeStyle="#31545b";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(base.x,base.y);ctx.lineTo(top.x,top.y);ctx.stroke();ctx.fillStyle="#f5c95e";ctx.beginPath();ctx.arc(top.x,top.y,3+Math.sin(t*.002+x)*.3,0,Math.PI*2);ctx.fill();}
  const environment=environmentalProfile(run.clockMinutes,run.currentDay,t);for(let x=7.7,index=0;x<38;x+=7.6,index++)drawWindFlag(x,21.9,48,index%2?"#64cbc8":"#ed7458",t+index*190,environment,.58);
  drawSpaceCaption(31.5,22.8,"Beach Promenade","#6d5944");
}

function drawEventSquare(){
  drawPavingInlay(17.05,19.55,7,4.15,"#d9d2c4",.95);const center=isoPoint(20.55,21.45,7);ctx.save();ctx.translate(center.x,center.y);ctx.scale(1,.5);for(let ring=0;ring<3;ring++){ctx.strokeStyle=ring===1?WORLD_MATERIALS.coral:"rgba(49,84,91,.28)";ctx.lineWidth=ring===1?2:1;ctx.beginPath();ctx.arc(0,0,28+ring*14,0,Math.PI*2);ctx.stroke();}ctx.restore();drawSpaceCaption(17.35,23.3,"Event Square",WORLD_MATERIALS.coral);
}

function drawCampusGroundPlan(t){
  drawGroundSlab(1.8,7.7,37.4,9.5,"#d8d8d1",3);drawConcreteSeams(1.8,7.7,37.4,9.5,5,2.1);
  drawArrivalPlaza();drawAcademicCourtyard(t);drawCafeTerrace();drawServiceLane();drawFoodCourt();drawStudentLawn();drawBeachPromenade(t);drawEventSquare();
  drawColumnLine(11.95,8.75,18.2,12,27,"x","#365861");
  drawBladeSign(8.6,16.15,32,"NOVA",WORLD_MATERIALS.coral);drawBladeSign(33.2,16.15,32,"COAST",WORLD_MATERIALS.lime);
  const routeA=isoPoint(7.2,15.25,8),routeB=isoPoint(34.6,15.25,8);ctx.strokeStyle=WORLD_MATERIALS.coral;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(routeA.x,routeA.y);ctx.lineTo(routeB.x,routeB.y);ctx.stroke();
  drawExpansionDistricts(t);
}

function drawExpansionDistricts(t){
  if(run.districts?.east){drawGroundSlab(40.2,9.1,9.3,13.6,"#d8d3c4",5);drawGroundSlab(41.1,18.2,8.4,4.5,"#dec481",4);for(let i=0;i<6;i++){const p=isoPoint(41.2+i*1.55,17.35,8);ctx.fillStyle=i%2?"#f5c95e":"#64cbc8";ctx.beginPath();ctx.arc(p.x,p.y+Math.sin(t*.003+i),2.5,0,Math.PI*2);ctx.fill();}drawWorldLabel(45.1,9.65,54,"EAST PROMENADE","#f2b94b");}
  else{drawGroundSlab(40.7,10.3,8.2,11.8,"#91a979",2);for(let i=0;i<7;i++){const p=isoPoint(41.4+i*1.05,16.9+(i%2)*.42,5);ctx.fillStyle=i%2?"#889c72":"#9eb184";ctx.beginPath();ctx.ellipse(p.x,p.y,18,7,0,0,Math.PI*2);ctx.fill();}}
  if(run.districts?.pier){drawGroundSlab(49,13.1,7.4,7.5,"#caa36e",7);for(let i=0;i<13;i++){const a=isoPoint(49.2+i*.55,13.35,8),b=isoPoint(49.2+i*.55,20.25,8);ctx.strokeStyle=i%2?"rgba(86,59,38,.28)":"rgba(255,255,255,.18)";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}drawWorldLabel(52.7,13.2,67,"OCEAN PIER","#479fb5");}
  else if(run.districts?.east){drawGroundSlab(49.1,13.5,6.7,6.8,"#7fa06f",2);}
}

function drawFacadeBandY(x,y,w,zBottom,zTop,color="#244e58",mullions=5){
  drawPlane([isoPoint(x,y,zTop),isoPoint(x+w,y,zTop),isoPoint(x+w,y,zBottom),isoPoint(x,y,zBottom)],color,"rgba(255,255,255,.2)");
  ctx.strokeStyle="rgba(222,244,244,.42)";ctx.lineWidth=.8;for(let i=1;i<mullions;i++){const px=x+w*i/mullions,a=isoPoint(px,y,zBottom+2),b=isoPoint(px,y,zTop-2);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}
}

function drawFacadeBandX(x,y,h,zBottom,zTop,color="#1f4652",mullions=4){
  drawPlane([isoPoint(x,y,zTop),isoPoint(x,y+h,zTop),isoPoint(x,y+h,zBottom),isoPoint(x,y,zBottom)],color,"rgba(255,255,255,.16)");
  ctx.strokeStyle="rgba(222,244,244,.35)";ctx.lineWidth=.8;for(let i=1;i<mullions;i++){const py=y+h*i/mullions,a=isoPoint(x,py,zBottom+2),b=isoPoint(x,py,zTop-2);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}
}

function drawTimberScreen(x,y,w,zBottom,zTop,count=8){
  ctx.strokeStyle="#ad8152";ctx.lineWidth=2.2;for(let i=0;i<=count;i++){const px=x+w*i/count,a=isoPoint(px,y,zBottom),b=isoPoint(px,y,zTop);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}
}

function drawRoofGarden(x,y,w,h,z){
  drawRaisedSlab(x,y,w,h,z,4,"#dce4d4","#78877b","#94a296");
  for(let i=0;i<4;i++){const p=isoPoint(x+.7+i*(w-1.4)/3,y+h*.55,z+8);ctx.fillStyle=i%2?"#5d8563":"#77986d";ctx.beginPath();ctx.ellipse(p.x,p.y,10,5,0,0,Math.PI*2);ctx.fill();}
}

function drawRoofLights(x,y,w,h,z){
  const rows=Math.max(1,Math.floor(h/1.6)),cols=Math.max(2,Math.floor(w/2));for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){const px=x+.45+col*(w-.9)/cols,py=y+.38+row*(h-.7)/rows,pw=(w-.9)/cols*.62,ph=(h-.7)/rows*.55;drawPlane([isoPoint(px,py,z),isoPoint(px+pw,py,z),isoPoint(px+pw,py+ph,z),isoPoint(px,py+ph,z)],(row+col)%2?"#416b73":"#315b65","rgba(255,255,255,.22)");}
}

function drawCampusWing(x,y,w,h,z,options={}){
  const white=options.white||WORLD_MATERIALS.chalk,side=options.side||"#aebbb6",shadow=options.shadow||WORLD_MATERIALS.chalkShade;
  drawSoftShadow(x+w*.55,y+h*.62,Math.max(36,w*12),Math.max(13,h*5),.2);
  drawBlock(x-.16,y-.12,w+.32,h+.24,8,"#d6d5ce","#8d9b97","#abb3ae");
  drawBlock(x,y,w,h,z,white,side,shadow);
  const levels=Math.max(1,Math.floor((z-18)/27));
  for(let level=0;level<levels;level++){
    const low=14+level*27,high=Math.min(z-9,low+15);if(high>low){drawFacadeBandY(x+.28,y+h+.015,w-.56,low,high,options.glass||"#285761",Math.max(3,Math.round(w)));drawFacadeBandX(x+w+.015,y+.25,h-.5,low,high,options.glassDark||"#204650",Math.max(2,Math.round(h)));}
  }
  drawRaisedSlab(x-.18,y-.18,w+.36,h+.36,z+4,5,"#fbf8ef","#9eaaa6","#bdc4bf");
  const capA=isoPoint(x-.18,y+h+.18,z+5),capB=isoPoint(x+w+.18,y+h+.18,z+5);ctx.strokeStyle="rgba(255,255,255,.72)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(capA.x,capA.y);ctx.lineTo(capB.x,capB.y);ctx.stroke();
  drawRoofLights(x+.45,y+.4,w-.9,h-.8,z+4);
  if(options.slats)drawTimberScreen(x+.35,y+h+.04,w-.7,13,Math.min(z-8,72),Math.max(5,Math.round(w*1.4)));
  if(options.roofGarden)drawRoofGarden(x+.55,y+.45,Math.max(1,w-1.1),Math.max(.7,h-1),z+4);
  if(options.accent){const a=isoPoint(x+w*.12,y+h+.05,Math.min(z-7,46)),b=isoPoint(x+w*.42,y+h+.05,Math.min(z-7,46));ctx.strokeStyle=options.accent;ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}
}

function drawCanopy(x,y,w,h,z=31){
  drawRaisedSlab(x,y,w,h,z+4,5,"#f5f3ea","#aeb9b5","#c5cac5");
  const posts=[[x+.2,y+.2],[x+w-.2,y+.2],[x+.2,y+h-.2],[x+w-.2,y+h-.2]];ctx.strokeStyle="#31545b";ctx.lineWidth=2;posts.forEach(([px,py])=>{const a=isoPoint(px,py,0),b=isoPoint(px,py,z);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();});
}

function drawCampus(t) {
  drawCampusWing(12.2,3.1,6.2,5.7,90,{glass:"#245761",roofGarden:true,slats:true});
  drawCampusWing(18.2,3.55,5.8,5.15,70,{glass:"#2b6670",accent:"#f2c85f"});
  drawCampusWing(23.8,3.05,6.3,5.75,111,{glass:"#214e5b",slats:true,roofGarden:true,accent:"#ed7458"});
  drawCanopy(12,8.25,18.3,1.15,31);drawColumnLine(12.3,9.36,17.7,11,30,"x");
  drawLinearPlanter(13.1,8.95,4.2,.62,13);drawLinearPlanter(24.6,8.95,4.35,.62,13);
  const bridgeA=isoPoint(17.8,5.6,60),bridgeB=isoPoint(24.25,5.6,60);ctx.strokeStyle="#e8e8e2";ctx.lineWidth=14;ctx.beginPath();ctx.moveTo(bridgeA.x,bridgeA.y);ctx.lineTo(bridgeB.x,bridgeB.y);ctx.stroke();ctx.strokeStyle="#315c65";ctx.lineWidth=8;ctx.stroke();
  const environment=environmentalProfile(run.clockMinutes,run.currentDay,t);drawWindFlag(13.25,3.6,112,"#ed7458",t,environment,.86);drawWindFlag(24.8,3.5,133,"#f5c95e",t+180,environment,.86);drawWindFlag(29.1,4.15,119,"#64cbc8",t+340,environment,.86);
  drawWorldLabel(21.2,8.55,127,"NOVA COAST CAMPUS","#f5c95e");
}

function drawLibrary(){
  drawCampusWing(2.2,3.25,8.4,5.15,73,{glass:"#285d67",slats:true,roofGarden:true,accent:"#64cbc8"});
  drawCanopy(9.8,6.75,3.1,1.2,28);drawColumnLine(2.55,8.42,7.7,7,27,"x");
  drawLinearPlanter(3.05,8.58,2.55,.55,12);
  drawWorldLabel(6.4,8.05,88,"LEARNING CENTER","#64cbc8");
}

function drawMercadoExterior(){
  drawCampusWing(3.15,8.85,8.25,4.45,58,{glass:"#2b555b",slats:true,accent:"#f5c95e"});
  drawCanopy(10.75,10.4,2.1,1.4,26);drawColumnLine(3.45,13.27,7.55,6,25,"x");
  drawLinearPlanter(4.05,13.36,2.35,.52,11);
  drawWorldLabel(7.3,13.15,74,"MERCADO SUPPLY","#f5c95e");
}

function drawStudentHub(){
  drawCampusWing(30.05,5.05,9.2,6.15,84,{glass:"#225762",roofGarden:true,accent:"#ff7458",slats:true});
  drawCanopy(29.25,8.15,2.2,1.25,29);drawColumnLine(30.35,11.17,8.45,8,28,"x");
  drawLinearPlanter(31.05,11.35,3.15,.58,12);drawLinearPlanter(36.15,11.35,2.15,.58,12);
  drawWorldLabel(34.65,10.95,100,"STUDENT HUB","#ff7458");
}

function drawBeachStage(t){
  drawRaisedSlab(18.35,22.08,4.3,2.25,10,5,"#ddd0b3","#776a59","#a3937a");
  for(let i=0;i<3;i++)drawRaisedSlab(18.58+i*.24,22.18+i*.23,3.82-i*.48,.42,16+i*7,6,"#d2aa71","#735b42","#95724e");
  drawRaisedSlab(19.28,21.9,2.46,.72,18,6,"#ece8dc","#9aa5a0","#bcc3be");
  const stage=isoPoint(20.5,22.28,25);ctx.save();ctx.translate(stage.x,stage.y);ctx.scale(1,.45);ctx.fillStyle="#64cbc8";ctx.beginPath();ctx.ellipse(0,0,31,17,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle="#eaf7f4";ctx.lineWidth=4;ctx.stroke();ctx.restore();
  [-1.72,1.72].forEach((offset,index)=>{drawBlock(20.5+offset-.25,22.78-.25,.5,.5,24,"#e6e1d5","#8e9690","#aeb3ad");const plant=isoPoint(20.5+offset,22.78,28);ctx.fillStyle=index?"#4b9363":"#5ca06d";for(let i=0;i<6;i++){ctx.save();ctx.translate(plant.x,plant.y);ctx.rotate(i*Math.PI/3);ctx.beginPath();ctx.ellipse(0,-9,3,10,0,0,Math.PI*2);ctx.fill();ctx.restore();}});
  const railA=isoPoint(18.55,22.13,50),railB=isoPoint(22.45,22.13,50);ctx.strokeStyle="#264d56";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(railA.x,railA.y);ctx.lineTo(railB.x,railB.y);ctx.stroke();for(let i=0;i<7;i++){const lamp=isoPoint(18.7+i*.6,22.13,49);ctx.fillStyle=i%2?"#ff8b66":"#f5c95e";ctx.beginPath();ctx.arc(lamp.x,lamp.y+4+Math.sin(t*.002+i),2.7,0,Math.PI*2);ctx.fill();}
  drawWorldLabel(20.5,23.05,72,"SUNSET FORUM","#64cbc8");
}

function drawInteriorFloor(zone){
  const base=zone.id==="academy"?"#e9e5da":zone.id==="mercado"?"#e2ddd0":"#dfe7e2";drawGroundSlab(1.1,1.1,12.8,9.15,base,4);drawConcreteSeams(1.1,1.1,12.8,9.15,5,1.25);
  const accent=zone.id==="academy"?"#d7e7dd":zone.id==="mercado"?"#ead9b8":"#cae0dc";drawGroundSlab(2.1,2.05,10.8,1.15,accent,5);
  for(let i=0;i<6;i++){const p=isoPoint(2.6+i*1.75,2.6,6);ctx.strokeStyle=i%2?"rgba(255,255,255,.62)":"rgba(25,72,75,.12)";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(p.x-22,p.y-10);ctx.lineTo(p.x+22,p.y+10);ctx.stroke();}
  if(zone.id==="academy"){drawGroundSlab(1.7,6.5,11.6,1.35,"#d6c19a",5);}else if(zone.id==="mercado"){drawGroundSlab(1.65,5.6,11.7,.65,"#c9d4cd",5);}else{drawGroundSlab(6.55,3.7,1.3,5.7,"#b8d6d3",5);}
}

function drawIndoorPlant(x,y,scale=1){
  drawBlock(x-.32,y-.32,.64,.64,18,"#d7cfc1","#8e8f87","#aaa99f");const p=isoPoint(x,y,20);ctx.save();ctx.translate(p.x,p.y);ctx.scale(scale,scale);ctx.strokeStyle="#4c7654";ctx.lineWidth=2;for(let i=0;i<6;i++){ctx.save();ctx.rotate(i*Math.PI/3);ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(8,-9,4,-19);ctx.stroke();ctx.restore();}ctx.restore();
}

function drawCommunalTable(x,y,w=3.2,color="#cfa670"){
  drawRaisedSlab(x,y,w,.75,29,6,color,mixColor(color,"#000000",.32),mixColor(color,"#000000",.19));
  ctx.strokeStyle="#274a52";ctx.lineWidth=3;[x+.3,x+w-.3].forEach(px=>{const a=isoPoint(px,y+.36,0),b=isoPoint(px,y+.36,23);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();});
  for(let i=0;i<3;i++){const px=x+.55+i*(w-1.1)/2;drawBlock(px-.22,y-.55,.44,.42,13,"#31545b","#223e45","#29484f");drawBlock(px-.22,y+.88,.44,.42,13,"#31545b","#223e45","#29484f");}
}

function drawCafeWorkshop(){
  drawRaisedSlab(5.65,2.15,4.3,.85,38,8,"#d5b37b","#82694b","#9f8159");
  drawFacadeBandY(5.8,3.01,4,10,31,"#244e58",5);
  const machine=isoPoint(8.7,2.7,49);ctx.fillStyle="#ecede7";roundedRect(machine.x-17,machine.y-16,34,19,4,"#ecede7");ctx.fillStyle="#173743";ctx.fillRect(machine.x-10,machine.y-11,20,5);ctx.fillStyle="#ff7458";ctx.beginPath();ctx.arc(machine.x+11,machine.y-8,2,0,Math.PI*2);ctx.fill();
  const shelf=isoPoint(8,1.6,47);ctx.strokeStyle="#b48a56";ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(shelf.x-64,shelf.y);ctx.lineTo(shelf.x+64,shelf.y+32);ctx.stroke();for(let i=0;i<6;i++){ctx.fillStyle=i%2?"#f5c95e":"#64cbc8";ctx.beginPath();ctx.arc(shelf.x-47+i*18,shelf.y+7+i*4,4,0,Math.PI*2);ctx.fill();}
}

function drawMercadoShelf(x,y,w=3.1){
  drawBlock(x,y,w,.62,58,"#f1efe7","#8e9996","#b8bfba");
  for(let z=15;z<55;z+=17){drawFacadeBandY(x+.15,y+.63,w-.3,z,z+6,"#31545b",Math.max(3,Math.round(w)));}
  const colors=["#f5c95e","#ff7458","#64cbc8","#bce65f"];for(let i=0;i<4;i++){const p=isoPoint(x+.5+i*(w-1)/3,y+.68,31);ctx.fillStyle=colors[i];ctx.fillRect(p.x-4,p.y-5,8,9);}
}

function drawColdRoom(){
  drawCampusWing(9.7,2.05,3.15,2.25,65,{glass:"#326a74",accent:"#64cbc8"});const p=isoPoint(11.3,4.32,37);roundedRect(p.x-26,p.y-8,52,16,3,"#173743");ctx.fillStyle="#d8fbff";ctx.textAlign="center";ctx.font="800 6px DM Mono";ctx.fillText("COLD STORE",p.x,p.y+2);
}

function drawLounge(x,y,color="#6f9294"){
  drawBlock(x,y,2.5,.8,19,mixColor(color,"#ffffff",.2),mixColor(color,"#000000",.35),mixColor(color,"#000000",.2));
  drawRaisedSlab(x-.1,y-.04,2.7,.28,37,8,mixColor(color,"#ffffff",.1),mixColor(color,"#000000",.38),mixColor(color,"#000000",.22));
  drawBlock(x+.85,y+1.05,.75,.75,14,"#d5b170","#846944","#9d7c50");
}

function drawMerchDisplay(){
  drawRaisedSlab(2.05,2.15,3.5,.65,34,6,"#e9e8e1","#8f9a97","#b9bfbb");
  const colors=["#64cbc8","#f5c95e","#ff7458"];for(let i=0;i<3;i++){const p=isoPoint(2.7+i,2.55,47);ctx.fillStyle=colors[i];ctx.beginPath();ctx.moveTo(p.x-8,p.y-4);ctx.lineTo(p.x,p.y-12);ctx.lineTo(p.x+8,p.y-4);ctx.lineTo(p.x+5,p.y+9);ctx.lineTo(p.x-5,p.y+9);ctx.closePath();ctx.fill();}
}

function drawVentureWall(){
  const p=isoPoint(10.8,1.08,63);ctx.save();ctx.translate(p.x,p.y);ctx.rotate(Math.atan2(TILE_H/2,TILE_W/2));roundedRect(-64,-27,128,54,4,"#173743");ctx.fillStyle="#bce65f";ctx.font="800 7px DM Mono";ctx.fillText("VENTURE BOARD",-52,-11);ctx.fillStyle="#d9e5e1";for(let i=0;i<4;i++){ctx.fillRect(-50,-1+i*8,32+i*8,3);}ctx.restore();
}

function drawRoomActors(t){
  const zone=activeZone(),actors=[{depth:.1,draw:()=>drawInteriorFloor(zone)},{depth:1,draw:()=>drawRoomShell(zone)}];
  if(zone.id==="academy"){
    actors.push({depth:4.7,draw:drawCafeWorkshop},{depth:8.1,draw:()=>drawCommunalTable(2.1,5.65,3.5,"#d2a66c")},{depth:14.1,draw:()=>drawCommunalTable(9.9,4.2,3,"#d2a66c")},{depth:10.5,draw:()=>drawLounge(2.2,7.25,"#608a8b")},{depth:12.9,draw:()=>drawIndoorPlant(11.8,7.2,1.2)});
  }else if(zone.id==="mercado"){
    actors.push({depth:5.1,draw:()=>drawMercadoShelf(2.05,2.45,4)},{depth:9.3,draw:()=>drawMercadoShelf(2.1,6.55,3.6)},{depth:12,draw:drawColdRoom},{depth:16.2,draw:()=>drawMercadoShelf(10.1,6.1,2.8)},{depth:10,draw:()=>drawIndoorPlant(7.6,7.7,.9)});
  }else{
    actors.push({depth:4.5,draw:drawMerchDisplay},{depth:11.8,draw:()=>drawLounge(2.15,7,"#7c70a2")},{depth:15.2,draw:()=>drawLounge(9.8,6.1,"#568c8c")},{depth:12,draw:drawVentureWall},{depth:10.7,draw:()=>drawIndoorPlant(7.8,6.9,1.1)});
  }
  const roomPeople=zone.id==="mercado"?[[4.8,5.4,"#f5c95e",.5],[10,5.5,"#ff8060",1.4]]:zone.id==="academy"?[[4.7,4.8,"#75c0c8",.3],[10.5,6.2,"#e6b45f",1.7],[5.3,7.4,"#ad75a6",2.5]]:[[4.7,6.2,"#ff8060",.8],[9.2,4.7,"#75c0c8",1.9],[11.8,7.2,"#bce65f",2.7]];
  roomPeople.forEach((person,index)=>actors.push({depth:person[0]+person[1],draw:()=>drawStudent(person,t,index)}));
  return actors;
}

function drawRoomShell(zone){
  drawSoftShadow(zone.width*.55,1.4,150,20,.2);drawBlock(0,0,zone.width,1,105,WORLD_MATERIALS.chalk,"#a7b5b0","#c7cdc8");
  drawBlock(0,0,1,zone.height,88,"#f7f3e9","#95a6a2","#bec7c2");
  drawFacadeBandY(1.1,1.02,zone.width-1.3,18,72,"#2c5c65",9);
  drawFacadeBandX(1.02,1.1,zone.height-1.3,17,65,"#244e58",7);
  drawTimberScreen(1.35,1.04,zone.width-1.8,76,101,14);
  for(let i=0;i<5;i++){const a=isoPoint(2+i*2.6,1.18,82),b=isoPoint(2.9+i*2.6,1.18,82);ctx.strokeStyle=i%2?"#f5c95e":"#d9f4ee";ctx.lineWidth=3.5;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}
  drawLinearPlanter(1.35,1.45,2.55,.5,12);drawLinearPlanter(11.15,1.45,2.1,.5,12);
  const p=isoPoint(zone.width/2,.75,91);roundedRect(p.x-72,p.y-10,144,20,4,"#173743");ctx.fillStyle=zone.accent;ctx.fillRect(p.x-64,p.y-10,5,20);ctx.fillStyle="#fff";ctx.textAlign="center";ctx.font="800 8px DM Mono";ctx.fillText(zone.name.toUpperCase(),p.x+4,p.y+3);
}
function drawFurniture(x,y,w,h,z,color,index){
  const top=index%2?"#d5b27a":"#b8c9c4";drawBlock(x,y,w,h,z,top,mixColor(top,"#000000",.3),mixColor(top,"#000000",.18));
  const p=isoPoint(x+w/2,y+h/2,z+4);ctx.fillStyle=index%2?"#f4e7c8":"#d9f0e3";ctx.beginPath();ctx.arc(p.x,p.y,5,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle="#24474f";ctx.lineWidth=2;[x+.2,x+w-.2].forEach(px=>{const a=isoPoint(px,y+h*.5,0),b=isoPoint(px,y+h*.5,z);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();});
}

function drawBlock(x,y,w,h,z,top,right,left){const a=isoPoint(x,y,z),b=isoPoint(x+w,y,z),c=isoPoint(x+w,y+h,z),d=isoPoint(x,y+h,z),ba=isoPoint(x,y),bb=isoPoint(x+w,y),bc=isoPoint(x+w,y+h),bd=isoPoint(x,y+h);ctx.fillStyle=left;ctx.beginPath();ctx.moveTo(d.x,d.y);ctx.lineTo(c.x,c.y);ctx.lineTo(bc.x,bc.y);ctx.lineTo(bd.x,bd.y);ctx.closePath();ctx.fill();ctx.fillStyle=right;ctx.beginPath();ctx.moveTo(b.x,b.y);ctx.lineTo(c.x,c.y);ctx.lineTo(bc.x,bc.y);ctx.lineTo(bb.x,bb.y);ctx.closePath();ctx.fill();ctx.fillStyle=top;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.lineTo(c.x,c.y);ctx.lineTo(d.x,d.y);ctx.closePath();ctx.fill();ctx.strokeStyle="rgba(15,35,40,.22)";ctx.stroke();}

const campusTrees=[[2,8,.9],[5,14,.8],[11,19,.82],[14,22,.9],[18,10,.72],[25,12,.76],[29,19,.88],[32,9,.83],[39,12,.92],[37,19,.8],[6,21,.75],[24,22,.72],[40,21,.86]];
const crowdColors=["#f5c95e","#ff8060","#64cbc8","#9a7bc1","#bce65f","#f0e9dc","#e6a769"];
const GUEST_PREFERENCE_LABELS={food:"Foodie",drinks:"Drinks",shopping:"Shopping",social:"Social",excitement:"Thrill seeker",calm:"Quiet spaces"};
const guestTargetPoints={cafe:{x:17.55,y:14.45},snack:{x:28.15,y:20.55},merch:{x:34.15,y:15.25},beach:{x:45.55,y:20.2},surf:{x:52.7,y:16.5},academy:{x:20.1,y:12.75},hub:{x:35.3,y:18.65},forum:{x:20.5,y:21.35},pavilion:{x:47.8,y:12.8}};

function guestRandom(seed,offset=0){const value=Math.sin((seed+1)*91.733+offset*37.119)*43758.5453;return value-Math.floor(value);}
function createGuestAgent(){
  const id=++guestSequence,entries=GUEST_ENTRIES.filter(point=>point.x<=ZONES.campus.maxX),cohortId=Math.floor((id-1)/3),groupSlot=(id-1)%3,entry=entries[cohortId%entries.length],preferences={food:.18+guestRandom(id,7)*.82,drinks:.18+guestRandom(id,8)*.82,shopping:.12+guestRandom(id,9)*.88,social:.15+guestRandom(id,10)*.85,excitement:.12+guestRandom(id,11)*.88,calm:.12+guestRandom(id,12)*.88,intensity:18+Math.round(guestRandom(id,13)*70)},guest={id,name:GUEST_NAMES[id%GUEST_NAMES.length],x:entry.x+(groupSlot-1)*.22,y:entry.y+groupSlot*.16,color:crowdColors[id%crowdColors.length],phase:guestRandom(id,1)*6,direction:1,facing:{x:0,y:1},cohortId,groupSlot,state:"arriving",activity:"Arriving on campus",thought:"Let’s see what fits my plans and budget.",age:0,visits:0,route:[],routeIndex:0,target:null,remove:false,budget:800+Math.round(guestRandom(id,14)*2600),spent:0,queuePatience:25+Math.round(guestRandom(id,15)*70),preferences,needs:{hunger:28+Math.round(guestRandom(id,2)*68),thirst:24+Math.round(guestRandom(id,3)*72),bladder:12+Math.round(guestRandom(id,4)*72),energy:20+Math.round(guestRandom(id,5)*68),mood:18+Math.round(guestRandom(id,6)*65)}};
  sendGuestToNextActivity(guest);return guest;
}

function guestPrimaryPreferences(guest){return Object.entries(guest.preferences||{}).filter(([key])=>key!=="intensity").sort((a,b)=>b[1]-a[1]).slice(0,2).map(([key])=>GUEST_PREFERENCE_LABELS[key]);}
function liveQueueCounts(){const queues={};for(const guest of guestAgents.filter(item=>item.state==="queueing")){const key=`store:${guest.target.id}`;queues[key]=(queues[key]||0)+1;}return queues;}

function targetPointFor(option){if(option.kind==="facility"){const facility=(run.facilities||[]).find(item=>item.id===option.id);if(!facility)return null;return {x:facility.x+.38,y:facility.y+.42};}if(option.kind==="event"){if(option.deckId==="pavilion")return guestTargetPoints.pavilion;const facility=(run.facilities||[]).find(item=>item.id===option.deckId);return facility?{x:facility.x+.35,y:facility.y+.75}:null;}return guestTargetPoints[option.id]||null;}
function guestRoute(start,target){
  const points=[];if(start.x<12)points.push(CAMPUS_SPACES.arrival);else if(start.x>39)points.push(CAMPUS_SPACES.lawn);
  if(target.y>=20.8)points.push(CAMPUS_SPACES.promenade);
  else if(target.y>=17&&target.x<15)points.push(CAMPUS_SPACES.service);
  else if(target.y>=17&&target.x<32.5)points.push(CAMPUS_SPACES.foodCourt);
  else if(target.y>=17)points.push(CAMPUS_SPACES.lawn);
  else if(target.y<14.4&&target.x>11&&target.x<29)points.push(CAMPUS_SPACES.courtyard);
  else points.push({x:target.x,y:14.75});
  points.push(target);return points.map(point=>({x:point.x,y:point.y})).filter((point,index)=>index===0||Math.hypot(point.x-points[index-1].x,point.y-points[index-1].y)>.12);
}
function sendGuestToNextActivity(guest){
  const context={queues:liveQueueCounts(),campusQuality:campusMetrics(run).rating},options=guestDestinationOptions(run,guest,guest.id+guest.visits*7,context).filter(option=>!guest.lastTarget||option.id!==guest.lastTarget||option.kind!==guest.lastKind),pick=options[0]||{kind:"landmark",id:"forum",label:"Sunset Forum",score:0,reason:"free public space"},point=targetPointFor(pick);
  if(!point){sendGuestHome(guest);return;}
  guest.target={...pick,x:point.x,y:point.y};guest.lastDecision={label:pick.label,score:Math.round(pick.score||0),reason:pick.reason||"best available option"};guest.route=guestRoute(guest,point);guest.routeIndex=0;guest.state="walking";guest.activity=`Walking to ${pick.label}`;guest.thought=guestThoughtForTarget(pick,guest.needs);
}
function sendGuestHome(guest){const exit=GUEST_ENTRIES.filter(point=>point.x<=ZONES.campus.maxX).sort((a,b)=>Math.hypot(guest.x-a.x,guest.y-a.y)-Math.hypot(guest.x-b.x,guest.y-b.y))[0];guest.target={kind:"exit",id:"exit",label:"Campus exit",x:exit.x,y:exit.y};guest.route=guestRoute(guest,exit);guest.routeIndex=0;guest.state="leaving";guest.activity="Heading home";guest.thought="Time to head out.";}
function guestThoughtForTarget(target,needs){if(target.id==="water")return `I really need a drink — and this one is free.`;if(target.id==="restroom")return `This is more urgent than anything else.`;if(target.id==="bench")return `A short break is worth the walk.`;if(target.id==="foodGarden")return `Food and a social space fit what I need.`;if(target.kind==="store")return `${target.productName} for ${formatEuro(target.price)} feels like my best option.`;if(target.kind==="event")return `${target.label} feels worth the ${formatEuro(target.price)} ticket.`;if(target.id==="experience")return `That attraction matches the intensity I enjoy.`;return `${target.label} wins: ${target.reason||"it fits my plans"}.`;}

function beginGuestActivity(guest){
  if(guest.target.kind==="exit"){guest.remove=true;return;}
  if(guest.target.kind==="store"){
    const line=guestAgents.filter(item=>item!==guest&&item.state==="queueing"&&item.target?.id===guest.target.id).length,limit=1+Math.floor(guest.queuePatience/22);
    if(line>=limit){guest.lastTarget=guest.target.id;guest.lastKind=guest.target.kind;guest.needs.mood=Math.min(100,guest.needs.mood+12);run.guestEconomy.walkaways+=1;run.today.walkaways=(run.today.walkaways||0)+1;guest.thought=`That line is too long for me — I’ll choose somewhere else.`;sendGuestToNextActivity(guest);return;}
    guest.state="queueing";guest.timer=1.35+guestRandom(guest.id,guest.visits+9)*1.2;guest.waited=0;guest.maxWait=1.3+guest.queuePatience*.055;guest.activity=`In line at ${guest.target.label}`;guest.thought=`I’ll wait, but only for about ${Math.round(guest.maxWait)} minutes.`;return;
  }
  guest.state="using";guest.timer=2.4+guestRandom(guest.id,guest.visits+11)*2.8;guest.activity=`Using ${guest.target.label}`;guest.thought=guest.target.kind==="facility"?`This is exactly what the campus needed.`:`Taking a little time at ${guest.target.label}.`;
}

function completeGuestActivity(guest){
  const type=guest.target.type||guest.target.id;let isPurchase=false;
  if(guest.target.kind==="store"){
    try{const price=run.prices[guest.target.productId];run=completeGuestSale(run,guest.target.productId,guest.budget,guest.id);guest.budget-=price;guest.spent+=price;isPurchase=true;guest.thought=`I bought ${guest.target.productName} for ${formatEuro(price)}.`;showSaleFeed(CATALOGUE.find(item=>item.id===guest.target.productId),1);localStorage.setItem(activeStorageKey(),JSON.stringify(run));lastPersistAt=performance.now();}
    catch(error){run.guestEconomy.walkaways+=1;run.today.walkaways=(run.today.walkaways||0)+1;guest.lastTarget=guest.target.id;guest.lastKind=guest.target.kind;guest.needs.mood=Math.min(100,guest.needs.mood+14);guest.thought=error.message.includes("stock")?"It sold out while I was waiting — I’ll try somewhere else.":"I changed my mind at the counter.";localStorage.setItem(activeStorageKey(),JSON.stringify(run));sendGuestToNextActivity(guest);return;}
  }else{
    run=recordGuestActivity(run,guest.target);
    if(guest.target.kind==="event"&&Number.isFinite(guest.target.price)&&guest.target.price<=guest.budget){guest.budget-=guest.target.price;guest.spent+=guest.target.price;isPurchase=true;guest.thought=`That ${formatEuro(guest.target.price)} ticket was worth it.`;}
  }
  guest.needs=applyGuestNeedRelief(guest.needs,type);guest.lastTarget=guest.target.id;guest.lastKind=guest.target.kind;guest.visits+=1;activityPulse={x:guest.x,y:guest.y,text:isPurchase?(guest.target.kind==="event"?`${guest.name} joined the set`:`${guest.name} bought ${guest.target.productName}`):`${guest.name} used ${guest.target.label}`,until:performance.now()+1700};
  Object.keys(guest.needs).forEach(key=>guest.needs[key]=Math.min(100,guest.needs[key]+7+Math.round(guestRandom(guest.id,guest.visits*3)*8)));
  if(guest.visits>=3||guest.age>62||guestRandom(guest.id,guest.visits+20)>.82)sendGuestHome(guest);else sendGuestToNextActivity(guest);
}

function moveGuestToward(guest,point,step){const dx=point.x-guest.x,dy=point.y-guest.y,distance=Math.hypot(dx,dy);if(distance>.025){guest.facing={x:dx/distance,y:dy/distance};guest.direction=dx-dy>=0?1:-1;}if(distance<=step){guest.x=point.x;guest.y=point.y;return true;}guest.x+=dx/distance*step;guest.y+=dy/distance*step;return false;}

const QUEUE_VECTORS={cafe:{x:-.43,y:.43},snack:{x:-.52,y:.12},merch:{x:-.35,y:.42},beach:{x:-.48,y:.18},surf:{x:-.36,y:.4}};
function queuePosition(guest,index){const vector=QUEUE_VECTORS[guest.target.id]||{x:-.42,y:.34},stagger=index%2?.035:-.035;return {x:guest.target.x+vector.x*index+vector.y*stagger,y:guest.target.y+vector.y*index-vector.x*stagger};}

function updateCampusGuests(dt){
  const speed=Math.max(0,run.speed||0);if(!speed)return;const peak=crowdPeak(run.clockMinutes),metrics=campusMetrics(run),desired=Math.min(48,Math.max(8,Math.round(metrics.guests*(.3+peak.multiplier*.24))));guestSpawnAccumulator+=dt*speed;
  while(guestAgents.length<desired&&guestSpawnAccumulator>.34){guestAgents.push(createGuestAgent());guestSpawnAccumulator-=.34;}
  if(guestAgents.length>desired){guestAgents.filter(guest=>guest.state!=="leaving").sort((a,b)=>b.age-a.age).slice(0,guestAgents.length-desired).forEach(sendGuestHome);}
  for(const guest of guestAgents){
    if(guest.target?.kind==="facility"){const point=targetPointFor(guest.target);if(!point||assetIsClosed(run,"facility",guest.target.id)){guest.lastTarget=guest.target.id;guest.lastKind=guest.target.kind;sendGuestToNextActivity(guest);}else if(guest.state==="walking"){guest.target.x=point.x;guest.target.y=point.y;}}
    guest.age+=dt*speed;Object.keys(guest.needs).forEach(key=>guest.needs[key]=Math.min(100,guest.needs[key]+dt*speed*(key==="mood"?.18:.3)));
    if(guest.state==="walking"||guest.state==="leaving"){const point=guest.route[guest.routeIndex];if(!point){beginGuestActivity(guest);continue;}if(moveGuestToward(guest,point,GUEST_SPEED*dt*Math.min(2.2,Math.sqrt(speed)))){guest.routeIndex+=1;if(guest.routeIndex>=guest.route.length)beginGuestActivity(guest);}}
    else if(guest.state==="using"){guest.timer-=dt*speed;if(guest.timer<=0)completeGuestActivity(guest);}
  }
  const queues=new Map();for(const guest of guestAgents.filter(item=>item.state==="queueing")){const key=guest.target.id;if(!queues.has(key))queues.set(key,[]);queues.get(key).push(guest);}
  for(const queue of queues.values()){queue.sort((a,b)=>a.id-b.id);queue.forEach((guest,index)=>{const point=queuePosition(guest,index);moveGuestToward(guest,point,GUEST_SPEED*dt*1.4);if(Math.hypot(guest.x-point.x,guest.y-point.y)<.08){const dx=guest.target.x-guest.x,dy=guest.target.y-guest.y,length=Math.hypot(dx,dy)||1;guest.facing={x:dx/length,y:dy/length};}guest.activity=index?`Waiting · ${index+1} in line`:`Being served at ${guest.target.label}`;if(index>0){guest.waited=(guest.waited||0)+dt*speed;if(guest.waited>guest.maxWait){guest.lastTarget=guest.target.id;guest.lastKind=guest.target.kind;guest.needs.mood=Math.min(100,guest.needs.mood+14);run.guestEconomy.walkaways+=1;run.today.walkaways=(run.today.walkaways||0)+1;guest.thought="I waited long enough — another place is a better use of my time.";sendGuestToNextActivity(guest);return;}}if(index===0){const queueLeads=activeStaffCount(run,"service",districtForStore(guest.target.id)),venueSpeed=venueServiceMultiplier(run,guest.target.id);guest.timer-=dt*speed*venueSpeed*(1+queueLeads*.35);if(guest.timer<=0)completeGuestActivity(guest);}});}
  guestAgents=guestAgents.filter(guest=>!guest.remove);
}

function liveCrowd(t){
  const actors=[...guestAgents.map((guest,index)=>({depth:guest.x+guest.y,draw:()=>drawGuestAgent(guest,t,index)})),...djEventCrowd(t)],groups=new Map();
  for(const guest of guestAgents.filter(item=>item.state==="queueing"||item.state==="using")){const key=`${guest.target.kind}:${guest.target.id}`;if(!groups.has(key))groups.set(key,{target:guest.target,count:0});groups.get(key).count+=1;}
  for(const {target,count} of groups.values()){if(count<1)continue;const point=targetPointFor(target)||target;actors.push({depth:point.x+point.y-.1,draw:()=>drawQueueLabel(point.x,point.y,target.kind==="store"?target.label:`${count} USING`,count,target.kind!=="store")});}
  if(activityPulse&&activityPulse.until>t)actors.push({depth:activityPulse.x+activityPulse.y+.2,draw:()=>drawActivityPulse(activityPulse,t)});
  return actors;
}

const STAFF_PATROLS={coast:[{x:10.5,y:18.4},{x:25.2,y:19.4},{x:35.5,y:17.2}],east:[{x:42.7,y:18.6},{x:46.4,y:16.8},{x:47.2,y:21.1}],pier:[{x:50.4,y:18.2},{x:53.4,y:19.2},{x:54.6,y:15.2}]};
function issueWorldPoint(issue){if(Number.isFinite(issue.x)&&Number.isFinite(issue.y))return {x:issue.x,y:issue.y};if(issue.targetKind==="store")return guestTargetPoints[issue.targetId]||null;if(issue.targetKind==="venue"&&issue.targetId==="pavilion")return guestTargetPoints.pavilion;const facility=(run.facilities||[]).find(item=>item.id===issue.targetId);return facility?{x:facility.x,y:facility.y}:null;}
function assignedIssue(worker){const type=worker.roleId==="caretaker"?"litter":worker.roleId==="technician"?"breakdown":null;if(!type)return null;return (run.operations?.issues||[]).find(issue=>issue.type===type&&issue.districtId===worker.districtId)||null;}
function staffWorldPoint(worker,index,t){const issue=assignedIssue(worker),target=issueWorldPoint(issue);if(target)return {x:target.x+.48+(index%2)*.18,y:target.y+.38+(index%3)*.12,working:true,issue};const route=STAFF_PATROLS[worker.districtId]||STAFF_PATROLS.coast,a=route[index%route.length],b=route[(index+1)%route.length],wave=(Math.sin(t*.00035+index*1.7)+1)/2;return {x:a.x+(b.x-a.x)*wave,y:a.y+(b.y-a.y)*wave,working:false,issue:null};}
function drawStaffWorker(worker,index,t){const role=STAFF_CATALOGUE.find(item=>item.id===worker.roleId),point=staffWorldPoint(worker,index,t),patrol=STAFF_PATROLS[worker.districtId]||STAFF_PATROLS.coast,a=patrol[index%patrol.length],b=patrol[(index+1)%patrol.length],forward=Math.cos(t*.00035+index*1.7)>=0,issuePoint=point.issue?issueWorldPoint(point.issue):null,facing=point.working&&issuePoint?{x:issuePoint.x-point.x,y:issuePoint.y-point.y}:forward?{x:b.x-a.x,y:b.y-a.y}:{x:a.x-b.x,y:a.y-b.y},pose=point.working?(worker.roleId==="caretaker"?"clean":worker.roleId==="technician"?"repair":"idle"):worker.roleId==="entertainer"?"dance":"walk";drawPersonFigure(point.x,point.y,t,index+90,{color:role?.color||"#bce65f",phase:index*.57,moving:!point.working,facing,pose,role:worker.roleId});const badge=isoPoint(point.x,point.y,64);ctx.save();ctx.fillStyle="#173743";ctx.beginPath();ctx.arc(badge.x,badge.y,9,0,Math.PI*2);ctx.fill();ctx.strokeStyle=role?.color||"#bce65f";ctx.lineWidth=2;ctx.stroke();ctx.fillStyle="#fff";ctx.textAlign="center";ctx.font="800 7px DM Mono";ctx.fillText(role?.icon||"·",badge.x,badge.y+2.5);ctx.restore();}
function drawOperationsIssue(issue,t){const point=issueWorldPoint(issue);if(!point)return;const p=isoPoint(point.x,point.y,8);if(issue.type==="litter"){ctx.save();ctx.translate(p.x,p.y);ctx.rotate(-.24);[[-12,0,"#f5c95e"],[-2,5,"#ff8060"],[9,-2,"#e7eee4"]].forEach(([x,y,color],index)=>{ctx.fillStyle=color;ctx.fillRect(x,y,8+index*2,4);ctx.strokeStyle="#31535a";ctx.lineWidth=.8;ctx.strokeRect(x,y,8+index*2,4);});ctx.restore();}else{const pulse=1+Math.sin(t*.008)*.08;ctx.save();ctx.translate(p.x,p.y-28);ctx.scale(pulse,pulse);ctx.fillStyle="rgba(23,55,67,.95)";ctx.beginPath();ctx.arc(0,0,14,0,Math.PI*2);ctx.fill();ctx.strokeStyle="#ff8060";ctx.lineWidth=3;ctx.stroke();ctx.fillStyle="#fff";ctx.textAlign="center";ctx.font="900 11px DM Mono";ctx.fillText("⚙",0,4);ctx.restore();}const tag=isoPoint(point.x,point.y,52);roundedRect(tag.x-34,tag.y-6,68,12,5,"rgba(12,39,47,.9)");ctx.fillStyle=issue.type==="litter"?"#64cbc8":"#ff8060";ctx.fillRect(tag.x-31,tag.y+2,Math.max(2,62*(issue.progress||0)/(issue.required||1)),2);ctx.fillStyle="#fff";ctx.textAlign="center";ctx.font="800 4.7px DM Mono";ctx.fillText(issue.type==="litter"?"CLEANUP NEEDED":"TEMPORARILY CLOSED",tag.x,tag.y-1);}
function operationsWorldActors(t){const actors=(run.operations?.issues||[]).map(issue=>{const point=issueWorldPoint(issue)||{x:0,y:0};return {depth:point.x+point.y+.05,draw:()=>drawOperationsIssue(issue,t)}});if(run.operations?.payrollDue)return actors;for(const [index,worker] of (run.staffRoster||[]).entries()){if(!staffIsOnShift(worker,run.clockMinutes))continue;const point=staffWorldPoint(worker,index,t);actors.push({depth:point.x+point.y+.1,draw:()=>drawStaffWorker(worker,index,t)});}return actors;}

function djEventCrowd(t){
  const event=run.activeEvent;if(event?.source!=="dj")return [];let center;if(event.deckId==="pavilion")center=guestTargetPoints.pavilion;else{const facility=(run.facilities||[]).find(item=>item.id===event.deckId);if(facility)center={x:facility.x,y:facility.y+.85};}if(!center)return [];
  const visible=Math.min(22,Math.max(3,Math.round((event.attendance||event.expectedAttendance*.18||3)*.62))),actors=[];
  for(let index=0;index<visible;index++){const row=Math.floor(index/5),column=index%5,x=center.x+(column-2)*.38+(row%2 ? .18 : 0),y=center.y+.55+row*.4,phase=index*.61;actors.push({depth:x+y+.04,draw:()=>drawPersonFigure(x,y,t,index+40,{color:crowdColors[(index+2)%crowdColors.length],phase,moving:false,facing:{x:center.x-x,y:center.y-y},pose:index%4===0?"chat":"dance"})});}
  actors.push({depth:center.x+center.y+2.8,draw:()=>{const p=isoPoint(center.x,center.y+2.25,78);roundedRect(p.x-56,p.y-11,112,22,10,"rgba(7,29,37,.94)");ctx.fillStyle="#bce65f";ctx.textAlign="center";ctx.font="800 6px DM Mono";ctx.fillText(`LIVE · ${event.attendance||0}/${event.capacity} GUESTS`,p.x,p.y+2);}});return actors;
}

function drawQueueLabel(x,y,label,count,using=false){const p=isoPoint(x,y,62);roundedRect(p.x-49,p.y-10,98,20,4,"rgba(10,37,46,.92)");ctx.fillStyle=using?"#64cbc8":"#bce65f";ctx.textAlign="center";ctx.font="700 6.5px DM Mono";ctx.fillText(using?`${label}`:`${label.toUpperCase()} · ${count} IN LINE`,p.x,p.y+3);}
function drawActivityPulse(pulse,t){const p=isoPoint(pulse.x,pulse.y,86),alpha=Math.max(0,Math.min(1,(pulse.until-t)/600));ctx.save();ctx.globalAlpha=alpha;roundedRect(p.x-62,p.y-10,124,20,10,"rgba(7,29,37,.92)");ctx.fillStyle="#bce65f";ctx.textAlign="center";ctx.font="700 6px DM Mono";ctx.fillText(pulse.text.toUpperCase(),p.x,p.y+2);ctx.restore();}

function drawTree(x,y,scale,t,environment=environmentalProfile()){const gust=reducedMotion?0:(Math.sin(t*.0012+x*.37)+Math.sin(t*.0031+y)*.35),sway=gust*(1.4+environment.wind*3.4),p=isoPoint(x,y,4);ctx.save();ctx.translate(p.x,p.y);ctx.scale(scale,scale);ctx.fillStyle="rgba(10,45,38,.16)";ctx.beginPath();ctx.ellipse(7,4,27,8,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle="#76563b";ctx.lineWidth=7;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(-2,-30,sway,-64);ctx.stroke();ctx.strokeStyle="rgba(255,210,145,.34)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-2,-3);ctx.quadraticCurveTo(-4,-31,sway-2,-61);ctx.stroke();ctx.translate(sway,-65);for(let a=0;a<7;a++){ctx.save();ctx.rotate(a*Math.PI*2/7+gust*.025+Math.sin(t*.0017+a)*.035*environment.wind);ctx.scale(1+environment.wind*.06,1);ctx.fillStyle=a%2?"#2f8358":"#3d9668";ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(18,-7,37,0);ctx.quadraticCurveTo(19,8,0,3);ctx.closePath();ctx.fill();ctx.restore();}ctx.fillStyle="#87633f";ctx.beginPath();ctx.arc(0,0,5,0,Math.PI*2);ctx.fill();ctx.restore();}

function drawAtlanticBench(x,y){
  drawRaisedSlab(x-.82,y-.28,1.64,.56,19,7,"#c99e64","#755b3e","#92704a");
  const p=isoPoint(x,y-.21,36);ctx.strokeStyle="#284b53";ctx.lineWidth=3;for(let i=-2;i<=2;i++){ctx.beginPath();ctx.moveTo(p.x-35+i*2,p.y-8+i);ctx.lineTo(p.x+35+i*2,p.y+26+i);ctx.stroke();}ctx.strokeStyle="#203f46";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(p.x-35,p.y+28);ctx.lineTo(p.x-27,p.y-4);ctx.moveTo(p.x+34,p.y+28);ctx.lineTo(p.x+26,p.y+20);ctx.stroke();
}

function drawRecyclingPoint(x,y){
  [[-.34,"#57a568","P"],[.34,"#5aa7bd","C"]].forEach(([offset,color,label])=>{drawBlock(x+offset-.27,y-.28,.54,.56,35,color,mixColor(color,"#000000",.32),mixColor(color,"#000000",.18));drawRaisedSlab(x+offset-.3,y-.31,.6,.62,39,5,"#173743","#0d2d35","#123943");const p=isoPoint(x+offset,y+.3,26);ctx.fillStyle="#fff";ctx.textAlign="center";ctx.font="800 6px DM Mono";ctx.fillText(label,p.x,p.y);});
}

function drawWaterStation(x,y,t){
  drawBlock(x-.42,y-.36,.84,.72,20,"#ecece5","#9faeaa","#bec7c2");const p=isoPoint(x,y,22);ctx.strokeStyle="#3d7e8a";ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(p.x-8,p.y);ctx.quadraticCurveTo(p.x-8,p.y-33,p.x+9,p.y-33);ctx.lineTo(p.x+9,p.y-20);ctx.stroke();ctx.fillStyle="#72d2db";ctx.beginPath();ctx.arc(p.x+9,p.y-16+Math.sin(t*.006),3,0,Math.PI*2);ctx.fill();
}

function drawRestroomPod(x,y){
  drawCampusWing(x-.72,y-.58,1.44,1.16,55,{glass:"#315965",accent:"#7e9ec5"});
  const p=isoPoint(x,y+.59,34);roundedRect(p.x-25,p.y-11,50,22,3,"#173743");ctx.fillStyle="#fff";ctx.textAlign="center";ctx.font="900 8px DM Mono";ctx.fillText("WC  ·  WC",p.x,p.y+3);
}

function drawFoodGarden(x,y){
  drawGroundSlab(x-1.15,y-.85,2.3,1.7,"#dfd5bd",5);drawCanopy(x-.95,y-.72,1.9,1.42,49);
  drawRaisedSlab(x-.68,y-.12,1.36,.46,29,6,"#d29a5d","#865e3f","#a6754b");
  [[-.72,.58,"#ff7458"],[0,.72,"#f5c95e"],[.72,.58,"#64cbc8"]].forEach(([ox,oy,color])=>{const p=isoPoint(x+ox,y+oy,15);ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(p.x,p.y,8,4,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle="#284b53";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x,p.y+12);ctx.stroke();});
}

function drawExperienceDeck(x,y,w=3.4,h=2.25){
  drawBlock(x-w/2,y-h/2,w,h,9,"#d7c59f","#76644e","#9c8768");
  drawRaisedSlab(x-w/2+.08,y-h/2+.08,w-.16,h-.16,12,4,"#dcb77b","#806344","#a27d53");
  ctx.strokeStyle="rgba(91,66,42,.45)";ctx.lineWidth=.9;for(let i=1;i<11;i++){const px=x-w/2+w*i/11,a=isoPoint(px,y-h/2+.09,12.5),b=isoPoint(px,y+h/2-.09,12.5);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}
  [[-1.45,-.92],[1.45,-.92],[-1.45,.92],[1.45,.92]].forEach(([ox,oy])=>{const p=isoPoint(x+ox,y+oy,15);ctx.fillStyle="#f4d36c";ctx.beginPath();ctx.arc(p.x,p.y,2.5,0,Math.PI*2);ctx.fill();});
}

function drawMusicModule(x,y,t,facilityId){
  const cx=x,cy=y+.16;
  drawRaisedSlab(cx-1.03,cy-.43,2.06,.86,30,9,"#f2f0e8","#8f9d99","#b7c0bc");
  drawFacadeBandY(cx-.94,cy+.44,1.88,13,26,"#183f49",8);
  for(let i=0;i<9;i++){const a=isoPoint(cx-.8+i*.2,cy+.445,13),b=isoPoint(cx-.8+i*.2,cy+.445,25);ctx.strokeStyle=i%2?"#bd8d59":"#e0b776";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}
  [-.43,.43].forEach(offset=>{const deck=isoPoint(cx+offset,cy+.02,33);ctx.save();ctx.translate(deck.x,deck.y);ctx.scale(1,.46);ctx.fillStyle="#102e37";ctx.beginPath();ctx.arc(0,0,13,0,Math.PI*2);ctx.fill();ctx.strokeStyle="#64cbc8";ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(0,0,8,0,Math.PI*2);ctx.stroke();ctx.fillStyle="#f5c95e";ctx.beginPath();ctx.arc(0,0,2.4,0,Math.PI*2);ctx.fill();ctx.restore();});
  const mixer=isoPoint(cx,cy+.02,34);roundedRect(mixer.x-13,mixer.y-5,26,10,2,"#254a53");for(let i=0;i<4;i++){ctx.fillStyle=i%2?"#ff7458":"#bce65f";ctx.fillRect(mixer.x-8+i*5,mixer.y-2,2,3);}
  const laptop=isoPoint(cx,cy-.3,54);ctx.save();ctx.translate(laptop.x,laptop.y);roundedRect(-15,-13,30,20,2,"#edf0e9");ctx.fillStyle="#173743";ctx.beginPath();ctx.arc(0,-3,3.2,0,Math.PI*2);ctx.fill();ctx.strokeStyle="#aeb8b3";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-18,8);ctx.lineTo(18,8);ctx.stroke();ctx.restore();
  [-1,1].forEach(side=>{const sx=cx+side*1.18,base=isoPoint(sx,cy-.08,12),speaker=isoPoint(sx,cy-.08,60);ctx.strokeStyle="#34545b";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(base.x,base.y);ctx.lineTo(speaker.x,speaker.y+12);ctx.stroke();roundedRect(speaker.x-11,speaker.y-18,22,31,3,"#102d36");ctx.fillStyle="#64cbc8";ctx.beginPath();ctx.arc(speaker.x,speaker.y-8,4.4,0,Math.PI*2);ctx.fill();ctx.fillStyle="#f5c95e";ctx.beginPath();ctx.arc(speaker.x,speaker.y+4,5.2+Math.sin(t*.009+side)*.45,0,Math.PI*2);ctx.fill();});
  const railA=isoPoint(cx-1.18,cy-.48,48),railB=isoPoint(cx+1.18,cy-.48,48);ctx.strokeStyle="#294f57";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(railA.x,railA.y);ctx.lineTo(railB.x,railB.y);ctx.stroke();[-.82,-.4,0,.4,.82].forEach((offset,index)=>{const lamp=isoPoint(cx+offset,cy-.48,47);ctx.fillStyle=index%2?"#ff7458":"#f5c95e";ctx.beginPath();ctx.arc(lamp.x,lamp.y+4,3,0,Math.PI*2);ctx.fill();});
  const managed=run.djOperations?.deckId===facilityId,upgrades=managed?run.djOperations.upgrades||{}:{},active=run.activeEvent?.source==="dj"&&run.activeEvent.deckId===facilityId;
  if((upgrades.lighting||0)>0||active){ctx.save();ctx.globalAlpha=active ? .34 : .16;for(let i=-1;i<=1;i++){const lamp=isoPoint(cx+i*.78,cy-.46,48);ctx.fillStyle=i?"#ff8060":"#64cbc8";ctx.beginPath();ctx.moveTo(lamp.x,lamp.y);ctx.lineTo(lamp.x-28+i*8,lamp.y+72);ctx.lineTo(lamp.x+28+i*8,lamp.y+72);ctx.closePath();ctx.fill();}ctx.restore();}
  if((upgrades.speakers||0)>1){[-1,1].forEach(side=>{for(let level=1;level<(upgrades.speakers||0);level++){const p=isoPoint(cx+side*(1.18+.18*level),cy-.08,45+level*13);roundedRect(p.x-8,p.y-12,16,23,2,"#102d36");ctx.fillStyle=level%2?"#64cbc8":"#f5c95e";ctx.beginPath();ctx.arc(p.x,p.y+3,4,0,Math.PI*2);ctx.fill();}});}
  if(managed){const badge=isoPoint(cx,cy+.55,68);roundedRect(badge.x-28,badge.y-7,56,14,7,active?"#bce65f":"#173743");ctx.fillStyle=active?"#173743":"#fff";ctx.textAlign="center";ctx.font="800 5px DM Mono";ctx.fillText(active?"LIVE SET":"DJ OPS",badge.x,badge.y+2);}
}

function drawSunsetModule(x,y){
  const cx=x+.78,cy=y-.36;
  drawRaisedSlab(cx-.58,cy-.47,1.16,.94,35,9,"#d7b174","#775f45","#96734e");
  for(let i=0;i<3;i++)drawRaisedSlab(cx-.75-i*.14,cy+.48+i*.1,1.5+i*.28,.24,14+i*6,4,"#d6b076","#765d43","#92704d");
  const backLeft=isoPoint(cx-.55,cy-.43,51),backRight=isoPoint(cx+.55,cy-.43,51),frontRight=isoPoint(cx+.55,cy+.43,51);ctx.strokeStyle="#eff7f4";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(backLeft.x,backLeft.y);ctx.lineTo(backRight.x,backRight.y);ctx.lineTo(frontRight.x,frontRight.y);ctx.stroke();for(const point of [[cx-.55,cy-.43],[cx+.55,cy-.43],[cx+.55,cy+.43]]){const a=isoPoint(point[0],point[1],35),b=isoPoint(point[0],point[1],51);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}
  const scope=isoPoint(cx+.12,cy-.05,57);ctx.strokeStyle="#173743";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(scope.x-2,scope.y+23);ctx.lineTo(scope.x+4,scope.y+3);ctx.stroke();ctx.save();ctx.translate(scope.x+6,scope.y);ctx.rotate(-.25);roundedRect(-3,-5,22,9,4,"#315d66");ctx.fillStyle="#f5c95e";ctx.beginPath();ctx.arc(18,-.5,4,0,Math.PI*2);ctx.fill();ctx.restore();
}

function drawShadeModule(x,y){
  const posts=[[x-1.43,y-.88,82],[x+1.38,y-.86,66],[x-1.32,y+.87,64],[x+1.42,y+.83,76]];
  ctx.strokeStyle="#f4f3ed";ctx.lineWidth=4;ctx.shadowColor="rgba(11,38,44,.16)";ctx.shadowBlur=4;posts.forEach(([px,py,z])=>{const a=isoPoint(px,py,12),b=isoPoint(px,py,z);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();});ctx.shadowBlur=0;
  const [a,b,c,d]=posts.map(([px,py,z])=>isoPoint(px,py,z));const canvasGradient=ctx.createLinearGradient(a.x,a.y,d.x,d.y);canvasGradient.addColorStop(0,"#fff8e5");canvasGradient.addColorStop(.55,"#f1ddb1");canvasGradient.addColorStop(1,"#e7c889");drawPlane([a,b,d],canvasGradient,"rgba(138,99,54,.28)",1.2);drawPlane([a,d,c],"rgba(246,229,190,.96)","rgba(138,99,54,.24)",1.2);
  ctx.strokeStyle="#ff7458";ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.lineTo(d.x,d.y);ctx.stroke();
}

function drawSocialModule(x,y){
  const cx=x-.54,cy=y+.48;
  [[-.48,-.05,.9],[.48,.05,.9],[0,.44,.72]].forEach(([ox,oy,w],index)=>{drawRaisedSlab(cx+ox-w/2,cy+oy-.17,w,.34,22,7,index===2?"#b9c8c2":"#d2a86d",index===2?"#60746f":"#765c40",index===2?"#8b9b95":"#98734c");});
  const table=isoPoint(cx,cy,28);ctx.fillStyle="#f2eee2";ctx.beginPath();ctx.ellipse(table.x,table.y,13,6,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle="#31545b";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(table.x,table.y+4);ctx.lineTo(table.x,table.y+18);ctx.stroke();
  drawBlock(cx-.83,cy+.36,.36,.36,18,"#e4dfd3","#8d958f","#aab0aa");const plant=isoPoint(cx-.65,cy+.54,20);ctx.fillStyle="#5e8f68";for(let i=0;i<5;i++){ctx.save();ctx.translate(plant.x,plant.y);ctx.rotate(i*Math.PI*2/5);ctx.beginPath();ctx.ellipse(0,-8,3,10,0,0,Math.PI*2);ctx.fill();ctx.restore();}
}

function drawSurfModule(x,y,t){
  const cx=x+.52,cy=y+.45,water=isoPoint(cx,cy,18);ctx.save();ctx.translate(water.x,water.y);ctx.scale(1,.46);const waterGradient=ctx.createRadialGradient(-8,-3,3,0,0,37);waterGradient.addColorStop(0,"#9ee2df");waterGradient.addColorStop(1,"#2b96a8");ctx.fillStyle=waterGradient;ctx.beginPath();ctx.ellipse(0,0,39,24,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle="#efffff";ctx.lineWidth=4;ctx.beginPath();ctx.arc(-3,2,24,Math.PI*1.02,Math.PI*1.86);ctx.stroke();ctx.restore();
  const wave=isoPoint(cx+.05,cy-.05,28),swell=Math.sin(t*.004)*1.5;ctx.strokeStyle="#dff9f7";ctx.lineCap="round";ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(wave.x-24,wave.y+10);ctx.bezierCurveTo(wave.x-14,wave.y-12-swell,wave.x+10,wave.y-18+swell,wave.x+27,wave.y+1);ctx.stroke();ctx.strokeStyle="#64cbc8";ctx.lineWidth=3;ctx.stroke();ctx.lineCap="butt";
  ctx.save();ctx.translate(wave.x+2,wave.y-1);ctx.rotate(-.48);roundedRect(-2,-14,5,31,3,"#f5c95e");ctx.restore();const control=isoPoint(cx+.72,cy-.5,31);roundedRect(control.x-8,control.y-16,16,20,3,"#173743");ctx.fillStyle="#bce65f";ctx.beginPath();ctx.arc(control.x,control.y-8,3,0,Math.PI*2);ctx.fill();
}

function drawExperiencePlaque(x,y,modules,stats){
  const p=isoPoint(x,y+1.18,20);ctx.save();ctx.translate(p.x,p.y);ctx.rotate(Math.atan2(TILE_H/2,TILE_W/2));roundedRect(-34,-7,68,14,3,"#173743");ctx.fillStyle="#bce65f";ctx.textAlign="center";ctx.font="700 5.5px DM Mono";ctx.fillText(`${modules.length} MODULES  ·  EXC ${stats.excitement}`,-1,2);ctx.restore();
}

function drawExperience(facility,t){
  const modules=facility.modules||[],has=id=>modules.includes(id),stats=attractionStats(modules),x=facility.x,y=facility.y,managed=run.djOperations?.deckId===facility.id,upgrades=managed?run.djOperations.upgrades||{}:{};
  drawExperienceDeck(x,y,3.4+(upgrades.capacity||0)*.22,2.25+(upgrades.capacity||0)*.12);
  if(has("shade")||(upgrades.shade||0)>0)drawShadeModule(x,y);
  if(has("social"))drawSocialModule(x,y);
  if(has("surf"))drawSurfModule(x,y,t);
  if(has("music"))drawMusicModule(x,y,t,facility.id);
  if(has("sunset"))drawSunsetModule(x,y);
  drawExperiencePlaque(x,y,modules,stats);
}

function drawPlacedFacility(facility,t,index){
  const previous=objectTransform;objectTransform={x:facility.x,y:facility.y,rotation:facility.rotation||0};
  try{
    if(facility.type==="path")drawTile(facility.x-.5,facility.y-.5,"#d7d3c2",2);
    else if(facility.type==="scenery"){drawBlock(facility.x-.55,facility.y-.55,1.1,1.1,16,"#d9d4c8","#999990","#b1afa5");drawTree(facility.x,facility.y,.6,t+index*90);}
    else if(facility.type==="bench")drawAtlanticBench(facility.x,facility.y);
    else if(facility.type==="bin")drawRecyclingPoint(facility.x,facility.y);
    else if(facility.type==="water")drawWaterStation(facility.x,facility.y,t);
    else if(facility.type==="restroom")drawRestroomPod(facility.x,facility.y);
    else if(facility.type==="foodGarden")drawFoodGarden(facility.x,facility.y);
    else if(facility.type==="experience")drawExperience(facility,t);
    drawFacilitySpecialization(facility,t);
  }finally{objectTransform=previous;}
}

function drawFacilitySpecialization(facility,t){
  const specialization=facilitySpecialization(facility);if(!specialization)return;const focus=SPECIALIZATION_FOCUSES.find(item=>item.id===specialization.focus),p=isoPoint(facility.x,facility.y,facility.type==="restroom"?76:facility.type==="foodGarden"?69:48);
  ctx.save();ctx.fillStyle=focus.color;ctx.strokeStyle="#173743";ctx.lineWidth=2;
  if(specialization.focus==="flow"){
    const base=isoPoint(facility.x+.48,facility.y+.32,9);for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(base.x+i*8-12,base.y+i*4);ctx.lineTo(base.x+i*8-5,base.y+i*4+3);ctx.lineTo(base.x+i*8-9,base.y+i*4+7);ctx.stroke();}
  }else if(specialization.focus==="wellbeing"){
    for(const side of [-1,1]){const plant=isoPoint(facility.x+side*.48,facility.y+.18,18);ctx.beginPath();ctx.arc(plant.x,plant.y,5,0,Math.PI*2);ctx.fill();ctx.strokeStyle="#315d66";ctx.beginPath();ctx.moveTo(plant.x,plant.y+11);ctx.lineTo(plant.x,plant.y+3);ctx.stroke();}
  }else{
    const glow=.72+Math.sin(t*.004)*.18;ctx.globalAlpha=glow;for(let i=-2;i<=2;i++){ctx.beginPath();ctx.arc(p.x+i*8,p.y+Math.abs(i)*3,2.6,0,Math.PI*2);ctx.fill();}
  }
  ctx.globalAlpha=1;roundedRect(p.x-11,p.y-11,22,16,5,"#173743");ctx.fillStyle=focus.color;ctx.textAlign="center";ctx.font="900 7px DM Mono";ctx.fillText(focus.icon,p.x,p.y);ctx.restore();
}

const personStyles=[
  {skin:"#8d5943",hair:"#211d1c",pants:"#243f4d",bag:"#e4b654",shoes:"#eee9dd",hairStyle:"crop",build:.96},
  {skin:"#d69b73",hair:"#54362a",pants:"#385f68",bag:"#c7614e",shoes:"#183740",hairStyle:"wave",build:1.04},
  {skin:"#704532",hair:"#171b20",pants:"#383b55",bag:"#5c9b9d",shoes:"#f3eee5",hairStyle:"curls",build:1.08},
  {skin:"#efbd96",hair:"#ad6840",pants:"#315056",bag:"#8466a3",shoes:"#e8dfcf",hairStyle:"bun",build:.9},
  {skin:"#b57655",hair:"#2c231f",pants:"#304652",bag:"#7e9e55",shoes:"#173743",hairStyle:"long",build:1},
  {skin:"#e1a77e",hair:"#483028",pants:"#4a485d",bag:"#d37b4d",shoes:"#f0ece3",hairStyle:"crop",build:1.12},
  {skin:"#5d382d",hair:"#101619",pants:"#274958",bag:"#d7a948",shoes:"#e8e4dc",hairStyle:"curls",build:.94},
  {skin:"#c98966",hair:"#72513d",pants:"#40505d",bag:"#4f9094",shoes:"#182f38",hairStyle:"wave",build:1.03}
];

function characterView(facing={x:0,y:1}){const sx=(facing.x||0)-(facing.y||0),sy=((facing.x||0)+(facing.y||0))*.55,side=Math.abs(sx)>.48;return {side,back:!side&&sy<-.08,flip:sx<0?-1:1};}
function guestCharacterPose(guest,index){
  if(guest.state==="walking"||guest.state==="leaving")return "walk";
  if(guest.state==="queueing")return index%3===0?"phone":index%3===1?"chat":"idle";
  const type=guest.target?.type||guest.target?.id;if(["cafe","snack","beach","foodGarden"].includes(type))return "eat";if(["bench","academy","hub"].includes(type))return "sit";if(["experience","pavilion","dj-event","forum"].includes(type))return "dance";if(type==="water")return "drink";if(type==="merch")return "browse";return "idle";
}

function drawCharacterHair(style,index,view){
  ctx.fillStyle=style.hair;if(style.hairStyle==="curls"){for(let i=0;i<6;i++){ctx.beginPath();ctx.arc(-5+i*2,-48+(i%2)*1.2,2.7,0,Math.PI*2);ctx.fill();}}
  else if(style.hairStyle==="bun"){ctx.beginPath();ctx.arc(view.back?3:-3,-52,3.5,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(0,-48,6,Math.PI,Math.PI*2);ctx.lineTo(5,-44);ctx.lineTo(-5,-44);ctx.closePath();ctx.fill();}
  else if(style.hairStyle==="long"){ctx.beginPath();ctx.ellipse(-1,-46,6.4,9.5,-.08,Math.PI*.88,Math.PI*2.08);ctx.lineTo(5,-40);ctx.lineTo(-6,-40);ctx.closePath();ctx.fill();}
  else if(style.hairStyle==="wave"){ctx.beginPath();ctx.arc(-.5,-48,6.3,Math.PI,Math.PI*2);ctx.quadraticCurveTo(3,-54,6,-47);ctx.lineTo(5,-44);ctx.lineTo(-5,-44);ctx.closePath();ctx.fill();}
  else{ctx.beginPath();ctx.ellipse(-.8,-48,6.2,4.6,-.15,Math.PI,Math.PI*2);ctx.lineTo(5,-44);ctx.quadraticCurveTo(0,-51,-5,-49);ctx.closePath();ctx.fill();}
}

function drawCharacterProp(pose,style,frame,role){
  if(pose==="phone"){roundedRect(5,-29,4,7,1,"#173743");ctx.fillStyle="#bce65f";ctx.fillRect(6,-28,2,3);}
  if(pose==="eat"||pose==="drink"){ctx.fillStyle=pose==="drink"?"#64cbc8":"#f5c95e";ctx.beginPath();ctx.arc(7,-29,3.3,0,Math.PI*2);ctx.fill();ctx.strokeStyle="#173743";ctx.lineWidth=1;ctx.stroke();}
  if(pose==="browse"){roundedRect(4,-31,7,10,1,style.bag);ctx.strokeStyle="#173743";ctx.lineWidth=1;ctx.strokeRect(5,-30,5,7);}
  if(role==="caretaker"){ctx.strokeStyle="#8c6845";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(8,-34);ctx.lineTo(-3,2);ctx.stroke();ctx.fillStyle="#64cbc8";ctx.beginPath();ctx.moveTo(-9,1);ctx.lineTo(2,-2);ctx.lineTo(5,3);ctx.closePath();ctx.fill();}
  if(role==="technician"){roundedRect(5,-22,10,7,2,"#f5c95e");ctx.strokeStyle="#173743";ctx.lineWidth=1;ctx.strokeRect(7,-24,6,3);}
  if(role==="service"){ctx.fillStyle="#e8e3d8";ctx.beginPath();ctx.ellipse(9,-25,8,3,0,0,Math.PI*2);ctx.fill();ctx.fillStyle="#ff8060";ctx.beginPath();ctx.arc(9,-29,2.5,0,Math.PI*2);ctx.fill();}
  if(role==="host"){roundedRect(5,-30,7,10,1,"#e8e3d8");ctx.fillStyle="#31545b";ctx.fillRect(7,-28,3,1);ctx.fillRect(7,-25,3,1);}
}

function drawPersonFigure(x,y,t,index,options={}){
  const style=personStyles[Math.abs(index)%personStyles.length],moving=Boolean(options.moving),pose=options.pose|| (moving?"walk":"idle"),phase=(options.phase||0)+index*.73,frame=moving?Math.floor((t+phase*120)/130)%6:Math.floor((t+phase*90)/420)%4,walkSteps=[-3,-1,2,3,1,-2],step=moving?walkSteps[frame]:0,dance=pose==="dance"?Math.sin(t*.009+phase)*3:0,bob=moving?(frame%3===1?1.4:0):pose==="dance"?Math.abs(Math.sin(t*.009+phase))*2:Math.sin(t*.002+phase)*.35,view=characterView(options.facing||{x:options.direction||1,y:0}),p=isoPoint(x,y,4+bob),scale=(options.player?1.2:1.02)*(style.build||1),shirt=options.player?WORLD_MATERIALS.lime:options.color||"#64cbc8",sit=pose==="sit",flip=view.side?view.flip:1;
  ctx.save();ctx.translate(p.x,p.y);ctx.scale(flip*scale,scale);ctx.lineJoin="round";ctx.lineCap="round";
  ctx.fillStyle="rgba(6,31,36,.2)";ctx.beginPath();ctx.ellipse(2*flip,4,sit?15:13.5,sit?5.5:4.7,0,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle="#183740";ctx.lineWidth=1.15;ctx.fillStyle=style.pants;
  if(sit){for(const side of [-1,1]){ctx.beginPath();ctx.moveTo(side*1,-19);ctx.lineTo(side*7,-15);ctx.lineTo(side*8,-3);ctx.lineTo(side*3,-2);ctx.lineTo(side*1,-14);ctx.closePath();ctx.fill();ctx.stroke();}}
  else{ctx.beginPath();ctx.moveTo(-5,-18);ctx.lineTo(-1,-20);ctx.lineTo(-1+step+dance,-2);ctx.lineTo(-6+step+dance,-1);ctx.closePath();ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(1,-20);ctx.lineTo(5,-18);ctx.lineTo(5-step-dance,-1);ctx.lineTo(-step-dance,-2);ctx.closePath();ctx.fill();ctx.stroke();}
  ctx.fillStyle=style.shoes;for(const side of [-1,1]){const shoe=sit?side*7:side<0?-5+step+dance:5-step-dance;ctx.beginPath();ctx.ellipse(shoe,-.2,4.5,2.1,-.08,0,Math.PI*2);ctx.fill();ctx.stroke();}
  ctx.fillStyle=shirt;ctx.beginPath();ctx.moveTo(-7,-36);ctx.quadraticCurveTo(0,-40,7,-35);ctx.lineTo(5,-18);ctx.quadraticCurveTo(0,-15,-5,-18);ctx.closePath();ctx.fill();ctx.stroke();
  const armSwing=moving?step*.72:0;ctx.strokeStyle=style.skin;ctx.lineWidth=4;ctx.beginPath();
  if(pose==="phone"||pose==="eat"||pose==="drink"||pose==="browse"){ctx.moveTo(-6,-32);ctx.lineTo(-2,-25);ctx.lineTo(5,-28);ctx.moveTo(6,-32);ctx.lineTo(8,-27);}
  else if(pose==="clean"||pose==="repair"){ctx.moveTo(-6,-32);ctx.lineTo(-2,-23);ctx.lineTo(6,-20);ctx.moveTo(6,-32);ctx.lineTo(9,-23);}
  else if(pose==="dance"){ctx.moveTo(-6,-32);ctx.lineTo(-11,-40-dance);ctx.moveTo(6,-32);ctx.lineTo(12,-35+dance);}
  else if(pose==="chat"){ctx.moveTo(-6,-32);ctx.lineTo(-10,-24);ctx.moveTo(6,-32);ctx.lineTo(11,-36);}
  else{ctx.moveTo(-6,-32);ctx.lineTo(-9-armSwing,-20);ctx.moveTo(6,-32);ctx.lineTo(9+armSwing,-21);}ctx.stroke();
  if((moving||pose==="phone")&&!options.role&&!view.back){ctx.fillStyle=style.bag;ctx.beginPath();ctx.roundRect(-10,-34,5.5,15,2);ctx.fill();ctx.strokeStyle="#173743";ctx.lineWidth=1;ctx.stroke();}
  ctx.fillStyle=style.skin;ctx.beginPath();ctx.ellipse(0,-44,6.2,7,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle="#183740";ctx.lineWidth=1.1;ctx.stroke();drawCharacterHair(style,index,view);
  if(!view.back){ctx.fillStyle="#173743";if(view.side){ctx.beginPath();ctx.arc(3.2,-44,1.05,0,Math.PI*2);ctx.fill();}else{for(const eye of [-2.1,2.1]){ctx.beginPath();ctx.arc(eye,-44.5,.8,0,Math.PI*2);ctx.fill();}if(pose==="chat"||pose==="dance"){ctx.strokeStyle="#8c4f43";ctx.lineWidth=.8;ctx.beginPath();ctx.arc(0,-42,2,0,Math.PI);ctx.stroke();}}}
  drawCharacterProp(pose,style,frame,options.role);
  if(options.player){ctx.strokeStyle="#173743";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-5,-35);ctx.lineTo(5,-32);ctx.stroke();roundedRect(-5.4,-34.5,10.8,3,1,"#173743");ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(view.side?3:2.2,-44,1.1,0,Math.PI*2);ctx.fill();}
  ctx.restore();
}

function drawStudent(s,t,i){drawPersonFigure(s[0],s[1],t,i,{color:s[2],phase:s[3],moving:s[4],facing:{x:s[5]||((i%5)===0?-1:1),y:0},pose:i%4===0?"chat":"idle"});}
function drawGuestAgent(guest,t,index){
  const moving=guest.state==="walking"||guest.state==="leaving",pose=guestCharacterPose(guest,index);drawPersonFigure(guest.x,guest.y,t,index+20,{color:guest.color,phase:guest.phase,moving,facing:guest.facing||{x:guest.direction,y:0},pose});
  if((guest.state==="queueing"||guest.state==="using")&&Math.hypot(run.player.x-guest.x,run.player.y-guest.y)<5.5){const p=isoPoint(guest.x,guest.y,58),icon=GUEST_ICONS[guest.target.type||guest.target.id]||"·";ctx.save();ctx.fillStyle="rgba(255,255,255,.96)";ctx.beginPath();ctx.arc(p.x,p.y,7.5,0,Math.PI*2);ctx.fill();ctx.strokeStyle=guest.state==="queueing"?"#bce65f":"#64cbc8";ctx.lineWidth=1.5;ctx.stroke();ctx.fillStyle="#173743";ctx.textAlign="center";ctx.font=icon==="WC"?"800 4px DM Mono":"800 6.5px Manrope";ctx.fillText(icon,p.x,p.y+2.2);ctx.restore();}
}

function drawConstructionSite(id,loc,project,t){
  const progress=venueProjectProgress(project),store=STORES.find(item=>item.id===id),targetHeight=project.toLevel===3?72:project.toLevel===2?58:46,wallHeight=Math.max(8,targetHeight*Math.max(0,(progress-.18)/.72));
  drawSoftShadow(loc.x,loc.y,48,15,.2);drawGroundSlab(loc.x-1.35,loc.y-.86,2.7,1.72,"#c8c2b4",5);
  if(progress>.18)drawBlock(loc.x-.9,loc.y-.54,1.8,1.08,wallHeight,"#e8e4da","#9ba5a1","#bec4bf");
  const fenceColor="#e8e3d7",postColor="#31545b";ctx.save();ctx.strokeStyle=fenceColor;ctx.lineWidth=3;ctx.setLineDash([7,4]);
  for(const [ax,ay,bx,by] of [[-1.42,-.9,1.42,-.9],[-1.42,.9,1.42,.9],[-1.42,-.9,-1.42,.9],[1.42,-.9,1.42,.9]]){const a=isoPoint(loc.x+ax,loc.y+ay,17),b=isoPoint(loc.x+bx,loc.y+by,17);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}
  ctx.setLineDash([]);ctx.strokeStyle=postColor;ctx.lineWidth=2;for(const [dx,dy] of [[-1.42,-.9],[1.42,-.9],[-1.42,.9],[1.42,.9]]){const a=isoPoint(loc.x+dx,loc.y+dy,3),b=isoPoint(loc.x+dx,loc.y+dy,28);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}ctx.restore();
  const scaffoldHeight=Math.max(30,wallHeight+12);for(const side of [-1,1]){const x=loc.x+side*1.02;ctx.strokeStyle="#d89a3d";ctx.lineWidth=2;for(const dy of [-.5,.2]){const a=isoPoint(x,loc.y+dy,3),b=isoPoint(x,loc.y+dy,scaffoldHeight);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}for(let z=17;z<scaffoldHeight;z+=16){const a=isoPoint(x,loc.y-.52,z),b=isoPoint(x,loc.y+.24,z);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}}
  drawPersonFigure(loc.x-.82,loc.y+.72,t,91,{color:"#f5c95e",phase:.3,moving:false,facing:{x:1,y:-1},pose:"repair",role:"technician"});drawPersonFigure(loc.x+.62,loc.y+.62,t,96,{color:"#ff8060",phase:1.4,moving:false,facing:{x:-1,y:-1},pose:"repair",role:"technician"});
  const sign=isoPoint(loc.x,loc.y+1.2,38);roundedRect(sign.x-43,sign.y-17,86,31,4,"#173743");ctx.fillStyle=store?.color||"#bce65f";ctx.fillRect(sign.x-43,sign.y-17,5,31);ctx.fillStyle="#fff";ctx.textAlign="left";ctx.font="800 6px DM Mono";ctx.fillText(project.kind==="open"?"NEW VENUE":"VENUE UPGRADE",sign.x-31,sign.y-5);ctx.fillStyle="#b9c9c7";ctx.font="700 5px DM Mono";ctx.fillText(`${Math.round(progress*100)}% · ${Math.ceil(project.remainingMinutes)} MIN`,sign.x-31,sign.y+6);ctx.fillStyle="#bce65f";ctx.fillRect(sign.x-31,sign.y+10,58*progress,3);ctx.strokeStyle="#547078";ctx.strokeRect(sign.x-31,sign.y+10,58,3);
}

function drawStoreFrontageState(id,loc,level,open,broken){
  if(open&&!broken)return;const z=22+level*4,p=isoPoint(loc.x,loc.y+.66,z);ctx.save();ctx.translate(p.x,p.y);ctx.rotate(Math.atan2(TILE_H/2,TILE_W/2));roundedRect(-31,-16,62,27,2,broken?"#5f514c":"#667674");ctx.strokeStyle=broken?"#ff8060":"#aeb8b4";ctx.lineWidth=1.5;for(let y=-12;y<9;y+=5){ctx.beginPath();ctx.moveTo(-28,y);ctx.lineTo(28,y);ctx.stroke();}ctx.fillStyle=broken?"#ff8060":"#e8e3d7";ctx.font="900 5px DM Mono";ctx.textAlign="center";ctx.fillText(broken?"TEMPORARILY CLOSED":"CLOSED",0,20);ctx.restore();
}

function drawCafeVenue(loc,level,accent){
  const x=loc.x-1.05,y=loc.y-.67,w=2.1,h=1.34,z=42+level*8;drawSoftShadow(loc.x,loc.y,39,12,.22);
  drawBlock(x,y,w,h,z,WORLD_MATERIALS.chalk,"#98aaa6","#c3cac5");drawFacadeBandY(x+.08,y+h+.01,w-.16,7,z-7,WORLD_MATERIALS.glass,5);
  drawRaisedSlab(x-.25,y-.22,w+.9,.44,z+5,5,"#faf6e9","#9da8a4","#c5cbc5");drawColumnLine(x-.12,y+h+.48,w+.48,4,z*.72,"x");
  if(level>1){drawLinearPlanter(x-.52,y+h+.39,.72,.48,10);drawLinearPlanter(x+w+.22,y+h+.39,.72,.48,10);}if(level===3)drawRoofGarden(x+.25,y+.15,w-.5,.64,z+5);
  drawBladeSign(x+w+.42,y+h+.22,z*.72,"ATLANTIC",accent);
}

function drawFuelVenue(loc,level,accent){
  const x=loc.x-1.15,y=loc.y-.55,w=2.3,h=1.1,z=34+level*8;drawSoftShadow(loc.x,loc.y,42,13,.2);
  drawBlock(x,y,w,h,z,"#e9eee5","#6c8d81","#a8bbb1");drawFacadeBandY(x+.08,y+h+.01,w-.16,7,z-6,"#245b5f",6);
  const canopy=[isoPoint(x-.35,y-.2,z+8),isoPoint(x+w+.5,y-.2,z+8),isoPoint(x+w+.25,y+h+.45,z+8),isoPoint(x-.08,y+h+.45,z+8)];drawPlane(canopy,accent,"#385d59",1.4);drawColumnLine(x-.15,y+h+.34,w+.5,3,z+5,"x","#315d58");
  if(level>1){for(let i=0;i<3;i++){const p=isoPoint(x+.48+i*.7,y+h+.48,18);ctx.fillStyle=i===1?"#f5c95e":"#dcebd3";ctx.beginPath();ctx.arc(p.x,p.y,6,0,Math.PI*2);ctx.fill();}}if(level===3)drawLinearPlanter(x-.1,y-.45,w+.2,.42,10);
  drawBladeSign(x+w+.3,y+h+.2,z*.72,"FUEL BAR",accent);
}

function drawMerchVenue(loc,level,accent){
  const x=loc.x-1.08,y=loc.y-.7,w=2.16,h=1.4,z=45+level*10;drawSoftShadow(loc.x,loc.y,38,13,.21);
  drawBlock(x,y,w,h,z,"#f1ede7","#9faaa7","#c6cbc7");drawFacadeBandY(x+.06,y+h+.01,w-.12,8,z-7,"#1f4d59",4);drawFacadeBandX(x+w+.01,y+.08,h-.16,8,z-7,"#285e66",3);
  drawRaisedSlab(x-.12,y-.12,w+.24,h+.24,z+5,5,"#fbf7ee","#939f9b","#bbc2bd");ctx.strokeStyle=accent;ctx.lineWidth=4;const a=isoPoint(x+.15,y+h+.03,z-9),b=isoPoint(x+w-.15,y+h+.03,z-9);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
  for(let i=0;i<Math.min(3,level+1);i++){const p=isoPoint(x+.43+i*.64,y+h+.04,22);ctx.fillStyle=["#ff8060","#f5c95e","#64cbc8"][i];ctx.beginPath();ctx.moveTo(p.x-6,p.y-2);ctx.lineTo(p.x,p.y-8);ctx.lineTo(p.x+6,p.y-2);ctx.lineTo(p.x+4,p.y+7);ctx.lineTo(p.x-4,p.y+7);ctx.closePath();ctx.fill();}
  if(level===3)drawRoofGarden(x+.25,y+.22,w-.5,h-.55,z+5);drawBladeSign(x+w+.28,y+h+.15,z*.72,"MERCH LAB",accent);
}

function drawBeachVenue(loc,level,accent){
  const x=loc.x-1.35,y=loc.y-.58,w=2.7,h=1.16,z=30+level*7;drawSoftShadow(loc.x,loc.y,48,14,.18);
  drawRaisedSlab(x,y,w,h,10,5,"#c99761","#765c43","#98734f");drawBlock(x+.35,y+.16,w-.7,h-.32,z,"#f0e5cf","#9e8b72","#c4b49b");drawFacadeBandY(x+.43,y+h-.15,w-.86,8,z-5,"#1d5260",5);
  const roof=[isoPoint(x-.12,y-.22,z+10),isoPoint(x+w+.12,y-.22,z+10),isoPoint(x+w-.12,y+h+.28,z+10),isoPoint(x+.12,y+h+.28,z+10)];drawPlane(roof,"#d8b06d","#785d40",1.5);drawTimberScreen(x+.1,y+h+.3,w-.2,8,z+8,8);
  for(let i=0;i<2+level;i++){const p=isoPoint(x+.3+i*(w-.6)/(1+level),y+h+.47,15);ctx.fillStyle=i%2?"#f5c95e":"#ff8060";ctx.beginPath();ctx.arc(p.x,p.y,5,0,Math.PI*2);ctx.fill();}drawBladeSign(x+w+.18,y+h+.25,z*.75,"MARÉ",accent);
}

function drawSurfVenue(loc,level,accent){
  const x=loc.x-1.05,y=loc.y-.62,w=2.1,h=1.24,z=35+level*7;drawSoftShadow(loc.x,loc.y,40,13,.2);
  drawBlock(x,y,w,h,z,"#d9dfd8","#80928e","#a9b5af");drawFacadeBandY(x+.1,y+h+.01,w-.2,8,z-7,"#204e59",4);
  const ridge=isoPoint(loc.x,y+.02,z+19),l=isoPoint(x-.16,y-.14,z+4),r=isoPoint(x+w+.16,y-.14,z+4),lf=isoPoint(x-.16,y+h+.18,z+4),rf=isoPoint(x+w+.16,y+h+.18,z+4);drawPlane([l,r,ridge],"#f5f1e6","#6e8581",1.4);drawPlane([lf,rf,ridge],"#c7d6d1","#6e8581",1.4);
  for(let i=0;i<2+level;i++){const p=isoPoint(x-.24,y+.15+i*.27,18+i*2);ctx.strokeStyle=i%2?"#f5c95e":"#64cbc8";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(p.x-12,p.y+6);ctx.quadraticCurveTo(p.x,p.y-6,p.x+12,p.y-6);ctx.stroke();}drawBladeSign(x+w+.22,y+h+.13,z*.78,"SURF",accent);
}

function drawStorePod(id,loc,level,locked){
  if(locked){drawVenuePlot(id,loc);return;}
  const project=activeVenueProject(run,id);if(project){drawConstructionSite(id,loc,project,lastTime);return;}
  const broken=assetIsClosed(run,"store",id),open=storeIsOpen(run,id),accent=open?loc.color:broken?"#ff8060":"#7f908e",size=1.72+level*.18,z=40+level*9;
  ({cafe:drawCafeVenue,snack:drawFuelVenue,merch:drawMerchVenue,beach:drawBeachVenue,surf:drawSurfVenue}[id]||drawCafeVenue)(loc,level,accent);
  const sign=isoPoint(loc.x,loc.y+1.02,22);roundedRect(sign.x-24,sign.y-6,48,12,3,"#12343e");ctx.fillStyle=accent;ctx.textAlign="center";ctx.font="900 5px DM Mono";ctx.fillText(id==="cafe"?"CAFÉ":id==="snack"?"FUEL":id==="merch"?"MERCH":id==="beach"?"MARÉ":"SURF",sign.x,sign.y+2);
  if(broken||!open||Math.hypot(run.player.x-loc.x,run.player.y-loc.y)<3){const status=isoPoint(loc.x,loc.y+size*.46,15);roundedRect(status.x-20,status.y-5,40,10,3,open?"#bce65f":broken?"#ff8060":"#80908d");ctx.fillStyle="#173743";ctx.font="900 4.5px DM Mono";ctx.fillText(open?"OPEN":broken?"REPAIR":"CLOSED",status.x,status.y+1.5);}
  if(level>=2){const badge=isoPoint(loc.x-.72,loc.y-.48,z+26);ctx.fillStyle=accent;ctx.beginPath();ctx.arc(badge.x,badge.y,8,0,Math.PI*2);ctx.fill();ctx.fillStyle="#173743";ctx.textAlign="center";ctx.font="900 6px DM Mono";ctx.fillText(`L${level}`,badge.x,badge.y+2);}
  drawStoreFrontageState(id,loc,level,open,broken);
  drawStoreSpecializationFeature(id,loc,z,size);
}

function drawDeliveryCart(x,y,t,label){
  drawSoftShadow(x,y,30,9,.15);drawBlock(x-.7,y-.38,1.4,.76,22,"#d7c097","#806f57","#a28d70");const canopy=[isoPoint(x-.82,y-.48,35),isoPoint(x+.82,y-.48,35),isoPoint(x+.66,y+.46,35),isoPoint(x-.66,y+.46,35)];drawPlane(canopy,"#f5c95e","#31545b",1.2);
  for(const side of [-1,1]){const wheel=isoPoint(x+side*.62,y+.42,8);ctx.fillStyle="#173743";ctx.beginPath();ctx.arc(wheel.x,wheel.y,6,0,Math.PI*2);ctx.fill();ctx.fillStyle="#cfd8d4";ctx.beginPath();ctx.arc(wheel.x,wheel.y,2.4,0,Math.PI*2);ctx.fill();}
  const p=isoPoint(x,y+.5,30);roundedRect(p.x-23,p.y-7,46,12,3,"#173743");ctx.fillStyle="#bce65f";ctx.textAlign="center";ctx.font="800 4.5px DM Mono";ctx.fillText(label.toUpperCase().slice(0,14),p.x,p.y+1);drawPersonFigure(x-.9,y+.25,t,123,{color:"#f5c95e",phase:.8,moving:true,facing:{x:1,y:0},pose:"walk",role:"service"});
}

function deliveryWorldActors(t){
  const actors=[],pending=(run.deliveries||[]).filter(item=>item.status==="scheduled"&&item.arrivalDay===run.currentDay&&item.arrivalMinute-run.clockMinutes<=35&&item.arrivalMinute>=run.clockMinutes-2).sort((a,b)=>a.arrivalMinute-b.arrivalMinute)[0];
  if(pending){const progress=Math.max(0,Math.min(1,1-(pending.arrivalMinute-run.clockMinutes)/35)),x=3+progress*12,y=17.25+Math.sin(progress*Math.PI)*.15,product=CATALOGUE.find(item=>item.id===pending.productId);actors.push({depth:x+y+.08,draw:()=>drawDeliveryCart(x,y,t,product?.short||"Delivery")});}
  for(const [index,item] of (run.today?.deliveries||[]).entries()){
    const age=run.clockMinutes-item.minute;if(age<0||age>32)continue;const product=CATALOGUE.find(entry=>entry.id===item.productId),destination=storeOverlayPoint(product?.storeId||"cafe"),progress=Math.min(1,age/24),start={x:16.5,y:17.25},x=start.x+(destination.x-start.x)*progress,y=start.y+(destination.y-start.y)*progress;actors.push({depth:x+y+.1+index*.001,draw:()=>drawDeliveryCart(x,y,t,product?.short||"Stock")});
  }
  return actors;
}

function drawStoreSpecializationFeature(id,loc,z,size){
  const specialization=storeSpecialization(run,id);if(!specialization)return;const focus=SPECIALIZATION_FOCUSES.find(item=>item.id===specialization.focus),front=isoPoint(loc.x,loc.y+size*.52,23),roof=isoPoint(loc.x,loc.y-.22,z+24);
  ctx.save();ctx.fillStyle=focus.color;ctx.strokeStyle="#173743";ctx.lineWidth=2;
  if(specialization.focus==="flow"){
    for(const side of [-1,1]){const a=isoPoint(loc.x+side*.72,loc.y+.62,4),b=isoPoint(loc.x+side*.72,loc.y+1.16,4);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.beginPath();ctx.arc(b.x,b.y,3.5,0,Math.PI*2);ctx.fill();}
  }else if(specialization.focus==="wellbeing"){
    for(const side of [-1,1]){const p=isoPoint(loc.x+side*.7,loc.y+.46,16);ctx.fillStyle="#315d66";ctx.fillRect(p.x-5,p.y,10,7);ctx.fillStyle=focus.color;ctx.beginPath();ctx.arc(p.x,p.y-3,7,0,Math.PI*2);ctx.fill();}
  }else{
    ctx.beginPath();ctx.moveTo(roof.x,roof.y-20);ctx.lineTo(roof.x,roof.y+5);ctx.stroke();ctx.beginPath();ctx.moveTo(roof.x,roof.y-20);ctx.lineTo(roof.x+18,roof.y-13);ctx.lineTo(roof.x,roof.y-7);ctx.closePath();ctx.fill();for(let i=-2;i<=2;i++){ctx.beginPath();ctx.arc(front.x+i*9,front.y+Math.abs(i)*4-14,2.5,0,Math.PI*2);ctx.fill();}
  }
  roundedRect(front.x-29,front.y+7,58,11,3,"#173743");ctx.fillStyle=focus.color;ctx.textAlign="center";ctx.font="800 4.5px DM Mono";ctx.fillText(specialization.name.toUpperCase().slice(0,18),front.x,front.y+14);ctx.restore();
}

function drawVenuePlot(id,loc){const store=STORES.find(item=>item.id===id),p=isoPoint(loc.x,loc.y,8);drawGroundSlab(loc.x-1.05,loc.y-.72,2.1,1.44,"#d8d4c8",4);ctx.strokeStyle="#7d8b8c";ctx.lineWidth=3;ctx.setLineDash([7,5]);ctx.beginPath();ctx.moveTo(p.x-55,p.y-18);ctx.lineTo(p.x,p.y-43);ctx.lineTo(p.x+55,p.y-17);ctx.lineTo(p.x,p.y+8);ctx.closePath();ctx.stroke();ctx.setLineDash([]);roundedRect(p.x-36,p.y-29,72,18,4,"#173743");ctx.fillStyle=store?.color||"#bce65f";ctx.textAlign="center";ctx.font="800 6px DM Mono";ctx.fillText("AVAILABLE PLOT",p.x,p.y-18);}

function drawExpansionGate(loc,unlocked){const p=isoPoint(loc.x,loc.y,4);ctx.strokeStyle=unlocked?loc.color:"#173743";ctx.lineWidth=5;for(const dx of [-.75,.75]){const a=isoPoint(loc.x+dx,loc.y,4),b=isoPoint(loc.x+dx,loc.y,55);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}const top=isoPoint(loc.x,loc.y,57);roundedRect(top.x-48,top.y-9,96,18,4,unlocked?loc.color:"#173743");ctx.fillStyle=unlocked?"#173743":"#f5c95e";ctx.textAlign="center";ctx.font="800 6px DM Mono";ctx.fillText(unlocked?"DISTRICT OPEN":"LAND FOR SALE",top.x,top.y+2);if(!unlocked){ctx.strokeStyle="#e9dfc8";ctx.lineWidth=2;for(let i=-2;i<=2;i++){const a=isoPoint(loc.x-1.1,loc.y+i*.18,16),b=isoPoint(loc.x+1.1,loc.y+i*.18,16);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}}}

function drawEventPavilion(loc){if(!run.eventVenue){drawGroundSlab(loc.x-1.45,loc.y-1.05,2.9,2.1,"#d9d5c9",4);const p=isoPoint(loc.x,loc.y,12);roundedRect(p.x-45,p.y-12,90,24,4,"#173743");ctx.fillStyle="#e47768";ctx.textAlign="center";ctx.font="800 6px DM Mono";ctx.fillText("EVENT VENUE PLOT",p.x,p.y+2);return;}const managed=run.djOperations?.deckId==="pavilion",upgrades=managed?run.djOperations.upgrades||{}:{},width=3.1+(upgrades.capacity||0)*.28,active=run.activeEvent?.source==="dj"&&run.activeEvent.deckId==="pavilion";drawRaisedSlab(loc.x-width/2,loc.y-.95,width,1.9,15,7,"#e2c08b","#765c43","#a17c56");drawCanopy(loc.x-1.32-(upgrades.shade||0)*.08,loc.y-.76,2.64+(upgrades.shade||0)*.16,1.28,62);const stage=isoPoint(loc.x,loc.y,23);roundedRect(stage.x-42,stage.y-19,84,29,4,"#173743");ctx.fillStyle=active?"#bce65f":"#e47768";for(let i=0;i<7;i++)ctx.fillRect(stage.x-29+i*9,stage.y-9-Math.sin(lastTime*.008+i)*4,4,9+Math.sin(lastTime*.008+i)*4);if((upgrades.speakers||0)>0)[-1,1].forEach(side=>{for(let level=0;level<(upgrades.speakers||0);level++){const p=isoPoint(loc.x+side*(1.25+level*.16),loc.y-.25,42+level*15);roundedRect(p.x-8,p.y-12,16,24,2,"#102d36");ctx.fillStyle="#64cbc8";ctx.beginPath();ctx.arc(p.x,p.y+4,4,0,Math.PI*2);ctx.fill();}});if((upgrades.lighting||0)>0||active){const rail=isoPoint(loc.x,loc.y-.78,69);for(let i=-2;i<=2;i++){ctx.fillStyle=i%2?"#ff8060":"#f5c95e";ctx.beginPath();ctx.arc(rail.x+i*13,rail.y+i*6,3.2,0,Math.PI*2);ctx.fill();}}}

function drawServicePoint(id,loc){
  if(id==="supplier"){
    drawRaisedSlab(loc.x-1.1,loc.y-.4,2.2,.8,31,8,"#d5ae72","#795f43","#967550");drawFacadeBandY(loc.x-1,loc.y+.41,2,9,24,"#315862",4);
    const p=isoPoint(loc.x,loc.y+.42,39);ctx.fillStyle="#f5c95e";for(let i=0;i<4;i++)ctx.fillRect(p.x-25+i*16,p.y-8+i*4,9,6);
  }else{
    drawRaisedSlab(loc.x-.95,loc.y-.38,1.9,.76,29,7,"#d9ddd6","#83918e","#aab3af");const p=isoPoint(loc.x,loc.y+.4,45);roundedRect(p.x-34,p.y-22,68,31,4,"#173743");ctx.fillStyle="#bce65f";ctx.fillRect(p.x-25,p.y-13,24,4);ctx.fillStyle="#64cbc8";ctx.fillRect(p.x-25,p.y-5,42,4);ctx.fillStyle="#f5c95e";ctx.fillRect(p.x-25,p.y+3,32,4);
  }
}

function drawLocation(id) {
  const loc=locations[id], near=Math.hypot(run.player.x-loc.x,run.player.y-loc.y)<1.65;
  if(loc.kind==="door"){
    const p=isoPoint(loc.x,loc.y,5),pulse=3+Math.sin(lastTime*.005)*2;
    ctx.fillStyle=near?"rgba(245,201,94,.25)":"rgba(9,42,51,.13)";ctx.beginPath();ctx.ellipse(p.x,p.y,38+pulse,14+pulse/2,0,0,Math.PI*2);ctx.fill();
    const door=isoPoint(loc.x,loc.y,40);ctx.save();ctx.shadowColor="rgba(3,22,28,.23)";ctx.shadowBlur=10;roundedRect(door.x-15,door.y-35,30,52,15,"rgba(244,240,224,.94)");ctx.shadowBlur=0;roundedRect(door.x-10,door.y-30,20,39,10,"#173743");ctx.fillStyle=loc.color;ctx.beginPath();ctx.arc(door.x,door.y-10,5,0,Math.PI*2);ctx.fill();ctx.restore();
    if(near){ctx.strokeStyle="#fff1a2";ctx.lineWidth=2;ctx.setLineDash([6,5]);ctx.beginPath();ctx.ellipse(p.x,p.y,48,18,0,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);}
    if(near){const tag=isoPoint(loc.x,loc.y,92);roundedRect(tag.x-50,tag.y-10,100,20,4,"rgba(10,37,46,.92)");ctx.fillStyle=loc.color;ctx.beginPath();ctx.arc(tag.x-40,tag.y,3,0,Math.PI*2);ctx.fill();ctx.fillStyle="#fff";ctx.textAlign="center";ctx.font="700 6px DM Mono";ctx.fillText(`${loc.title} · ${loc.sub}`,tag.x+4,tag.y+2);}
    return;
  }
  const isStore=STORES.some(store=>store.id===id),level=isStore?(run.venues?.[id]??0):1,locked=isStore&&level===0,size=1.45+Math.max(1,level)*.18,venueColor=locked?"#7d8b8c":loc.color;
  if(id==="eastGate"||id==="pierGate"){
    drawExpansionGate(loc,Boolean(run.districts?.[id==="eastGate"?"east":"pier"]));
  }else if(id==="pavilion"){
    drawEventPavilion(loc);
  }else if(isStore){
    ctx.save();if(locked)ctx.globalAlpha=.48;drawStorePod(id,loc,level,locked);ctx.restore();
  }else if(id==="supplier"||id==="board"){
    drawServicePoint(id,loc);
  }else{
    drawBlock(loc.x-size/2,loc.y-size*.42,size,size*.84,48+Math.max(1,level)*8,"#f4ead4","#b7ad99","#cbc2ad");
    drawBlock(loc.x-size*.62,loc.y-size*.5,size*1.24,.32,64+Math.max(1,level)*9,venueColor,"#a64f43","#bf6152");
  }
  if(level>1)drawWindFlag(loc.x+.5,loc.y-.45,86+level*8,loc.color,lastTime,environmentalProfile());
  if(near){const q=isoPoint(loc.x,loc.y,3);ctx.strokeStyle="#ffd454";ctx.lineWidth=3;ctx.setLineDash([7,5]);ctx.beginPath();ctx.ellipse(q.x,q.y,55+Math.sin(lastTime*.004)*2,20,0,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);}
  if(near){const tag=isoPoint(loc.x,loc.y,isStore?108+Math.max(1,level)*7:id==="pavilion"?112:96),project=isStore?activeVenueProject(run,id):null,storeState=project?" · BUILDING":isStore&&!locked&&!storeIsOpen(run,id)?" · CLOSED":"";roundedRect(tag.x-50,tag.y-11,100,22,4,"rgba(10,37,46,.92)");ctx.fillStyle=venueColor;ctx.beginPath();ctx.arc(tag.x-39,tag.y,3,0,Math.PI*2);ctx.fill();ctx.fillStyle="#fff";ctx.textAlign="center";ctx.font="700 7px DM Mono";ctx.fillText(`${loc.title}${isStore?locked?" · PLOT":" · LV "+level+storeState:id==="pavilion"&&!run.eventVenue?" · BUILD":""}`,tag.x+5,tag.y+3);}
}

function drawPlayer(t) {
  const bob=walking?Math.abs(Math.sin(t*.01))*1.5:Math.sin(t*.003)*.4,p=isoPoint(run.player.x,run.player.y,4);
  ctx.save();ctx.translate(p.x,p.y);ctx.fillStyle="rgba(7,29,37,.22)";ctx.beginPath();ctx.ellipse(0,3,18,7,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle="rgba(255,255,255,.9)";ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,2,23,9,0,0,Math.PI*2);ctx.stroke();ctx.restore();
  drawPersonFigure(run.player.x,run.player.y,t,0,{color:"#bce65f",phase:0,moving:walking,facing,pose:walking?"walk":"idle",player:true,bob});
}

function loop(t) {
  const dt = Math.min((t-lastTime)/1000 || 0, .04); lastTime=t;
  simulationElapsed+=dt;
  if(simulationElapsed>=.5){const elapsed=simulationElapsed;simulationElapsed=0;tickTycoon(elapsed);}
  updateCampusGuests(dt);
  let dx=0,dy=0;
  if(keys.has("w")||keys.has("arrowup")){dx--;dy--;}
  if(keys.has("s")||keys.has("arrowdown")){dx++;dy++;}
  if(keys.has("a")||keys.has("arrowleft")){dx--;dy++;}
  if(keys.has("d")||keys.has("arrowright")){dx++;dy--;}
  if((dx||dy)&&targetPoint)targetPoint=null;
  if(!dx&&!dy&&targetPoint){const tx=targetPoint.x-run.player.x,ty=targetPoint.y-run.player.y,dist=Math.hypot(tx,ty);if(dist<.15)targetPoint=null;else{dx=tx/dist;dy=ty/dist;}}
  walking=Boolean(dx||dy);
  const zone=activeZone();
  if(walking){const l=Math.hypot(dx,dy);dx/=l;dy/=l;facing={x:dx,y:dy};let nx=Math.max(zone.minX,Math.min(zone.maxX,run.player.x+dx*WALK_SPEED*dt));let ny=Math.max(zone.minY,Math.min(zone.maxY,run.player.y+dy*WALK_SPEED*dt));run.player.x=nx;run.player.y=ny;}
  if(cameraSequence&&performance.now()>cameraSequence.until)cameraSequence=null;const cameraTarget=cameraSequence&&zone.outdoor?cameraSequence:run.player;
  camera.x+=(cameraTarget.x-camera.x)*Math.min(1,dt*(cameraSequence?2.2:4.8));camera.y+=(cameraTarget.y-camera.y)*Math.min(1,dt*(cameraSequence?2.2:4.8));
  const desiredZoom=cameraSequence&&zone.outdoor?1.13:zone.outdoor?Math.max(.72,Math.min(1.08,canvas.clientWidth/1080)):Math.max(.94,Math.min(1.24,canvas.clientWidth/850));camera.zoom+=(desiredZoom-camera.zoom)*Math.min(1,dt*3.5);
  const mini=$(".mini-player");if(mini){mini.style.left=`${run.player.x/zone.width*100}%`;mini.style.top=`${run.player.y/zone.height*100}%`;}
  updateProximity(); drawWorld(t); requestAnimationFrame(loop);
}

function tickTycoon(realSeconds){
  if(!run.speed)return;
  const beforeDay=run.currentDay,beforeDelivered=(run.deliveries||[]).filter(item=>item.status==="delivered").length,beforeIssues=run.operations?.issues?.length||0,beforeResolved=run.operations?.totalIssuesResolved||0,beforeProjects=new Set((run.venueProjects||[]).filter(item=>item.status==="complete").map(item=>item.id));
  run=advanceTycoon(run,realSeconds*8*run.speed);
  const completedProject=(run.venueProjects||[]).find(item=>item.status==="complete"&&!beforeProjects.has(item.id));if(completedProject){const loc=locations[completedProject.storeId],store=STORES.find(item=>item.id===completedProject.storeId),focus=loc?.zone==="campus"?loc:storeOverlayPoint(completedProject.storeId);if(focus&&currentZone==="campus")cameraSequence={x:focus.x,y:focus.y,until:performance.now()+4300};toast(`${store?.name||"Venue"} ${completedProject.kind==="open"?"is ready to open":"upgrade complete"}`);beep(810);if(activeLocation===completedProject.storeId)openStore(completedProject.storeId);}
  const delivered=(run.deliveries||[]).filter(item=>item.status==="delivered");if(delivered.length>beforeDelivered){const latest=delivered.at(-1),product=CATALOGUE.find(item=>item.id===latest.productId);toast(`Delivery arrived · ${latest.quantity}× ${product?.short||"stock"}`);beep(740);}
  if((run.operations?.issues?.length||0)>beforeIssues){const latest=run.operations.issues.at(-1);toast(latest.type==="breakdown"?`${latest.label} closed · technician needed`:`Litter reported in ${OPERATIONS_DISTRICTS.find(item=>item.id===latest.districtId)?.name}` ,latest.type==="breakdown");beep(latest.type==="breakdown"?170:390);}
  if((run.operations?.totalIssuesResolved||0)>beforeResolved){toast("Work order completed · campus service restored");beep(680);}
  if(run.currentDay!==beforeDay){const closed=run.history.at(-1);showDayReport(closed);beep(640);}
  const now=performance.now();if(now-lastPersistAt>1800||run.currentDay!==beforeDay){localStorage.setItem(activeStorageKey(),JSON.stringify(run));lastPersistAt=now;}
  updateHUD();
}

function showSaleFeed(product,units){if(!product)return;const feed=$("#saleFeed");$("#saleFeedText").textContent=`${units}× ${product.short} · +${formatEuro(units*run.prices[product.id])}`;feed.classList.remove("hidden");clearTimeout(saleFeedTimer);saleFeedTimer=setTimeout(()=>feed.classList.add("hidden"),1500);if((run.totalSales||0)%3===0)beep(470);}

function updateProximity() {
  const near = zoneLocations().find(([,loc]) => Math.hypot(run.player.x-loc.x,run.player.y-loc.y)<1.65);
  $("#interactionHint").classList.toggle("hidden", !near);
  if(near) $("#interactionName").textContent=near[1].label;
}

function nearestLocation() { return zoneLocations().find(([,loc]) => Math.hypot(run.player.x-loc.x,run.player.y-loc.y)<1.65); }
function interactWith(id){const loc=locations[id];if(loc.kind==="door")changeZone(loc.targetZone,loc.spawn);else openLocation(id);}
function moveTo(id) { const loc=locations[id];if(loc.zone!==currentZone)return;const zone=activeZone();run.player={x:Math.max(zone.minX,Math.min(zone.maxX,loc.x)),y:Math.max(zone.minY,Math.min(zone.maxY,loc.y+1.3)),zone:currentZone};camera.x=run.player.x;camera.y=run.player.y;save(run);interactWith(id); }
function changeZone(zoneId,spawn){const zone=ZONES[zoneId];if(!zone)return;closeDrawer();currentZone=zoneId;const point=spawn||zone.spawn;run.player={x:point.x,y:point.y,zone:zoneId};camera.x=point.x;camera.y=point.y;targetPoint=null;localStorage.setItem(activeStorageKey(),JSON.stringify(run));updateHUD();const game=$("#game");game.classList.add("zone-transition");setTimeout(()=>game.classList.remove("zone-transition"),420);toast(zone.outdoor?"Back on the Nova coast":"Entered "+zone.name);beep(zone.outdoor?520:620);}
function openLocation(id) { activeLocation=id; locations[id].panel(); drawer.classList.add("open"); drawer.setAttribute("aria-hidden","false"); }
function markManagementPanel(action){document.querySelectorAll(".quick-nav button").forEach(button=>button.classList.toggle("active-panel",button.dataset.action===action));}
function closeDrawer() { activeLocation=null; drawer.classList.remove("open"); drawer.setAttribute("aria-hidden","true"); markManagementPanel(null); }

function storeTabs(selected, action="supplier") {
  return `<div class="store-tabs">${STORES.map(store=>`<button class="store-tab ${selected===store.id?"active":""}" data-store="${store.id}" data-mode="${action}"><span>${store.icon}</span>${store.short}</button>`).join("")}</div>`;
}

function openSupplier(selectedStore="cafe") {
  currentSupplierStore=selectedStore;
  const store=STORES.find(item=>item.id===selectedStore), products=CATALOGUE.filter(product=>product.storeId===selectedStore), level=run.venues[selectedStore] ?? 0,window=nextDeliveryWindow(run),pending=(run.deliveries||[]).filter(item=>item.status==="scheduled");
  drawerContent.innerHTML = `
    <p class="eyebrow">Mercado Hub · scheduled logistics</p><h2>Order inventory</h2>
    <p class="drawer-intro">Orders are paid immediately and reach campus on the next delivery run. Plan around opening hours and rush periods.</p>
    <div class="balance-banner"><span>AVAILABLE CASH</span><strong>${formatEuro(run.cash)}</strong></div>
    <div class="delivery-window"><span>▣</span><div><small>NEXT ORDER WINDOW</small><strong>${window.day===run.currentDay?"Today":`Day ${window.day}`} · ${formatClock(window.minute)}</strong><em>${window.label}</em></div><b>${pending.length} pending</b></div>
    ${storeTabs(selectedStore)}
    <div class="section-heading"><div><small>STOCKING · LEVEL ${level}</small><strong>${store.name}</strong></div><span>${products.reduce((sum,p)=>sum+run.stock[p.id],0)} units owned</span></div>
    <div class="product-list">${products.map(product => productBuyCard(product)).join("")}</div>`;
  drawerContent.querySelectorAll(".store-tab").forEach(button=>button.addEventListener("click",()=>openSupplier(button.dataset.store)));
  drawerContent.querySelectorAll(".qty-minus,.qty-plus").forEach(button => button.addEventListener("click", () => {
    const input = drawerContent.querySelector(`#qty-${button.dataset.id}`);
    input.value = Math.max(1, Number(input.value || 1) + (button.classList.contains("qty-plus") ? 1 : -1));
    updateBuyTotal(button.dataset.id);
  }));
  drawerContent.querySelectorAll(".qty-input").forEach(input => input.addEventListener("input", () => updateBuyTotal(input.dataset.id)));
  drawerContent.querySelectorAll(".buy-button").forEach(button => button.addEventListener("click", () => {
    const quantity = Number(drawerContent.querySelector(`#qty-${button.dataset.id}`).value);
    try { const next=scheduleDelivery(run,button.dataset.id,quantity),delivery=next.deliveries.at(-1);save(next);toast(`${quantity} units ordered · arrives day ${delivery.arrivalDay} at ${formatClock(delivery.arrivalMinute)}`);beep(520);openSupplier(selectedStore); }
    catch (error) { toast(error.message, true); beep(180); }
  }));
}

function productBuyCard(product) {
  const level=run.venues?.[product.storeId]??0,locked=level<(product.tier || 1),incoming=(run.deliveries||[]).filter(item=>item.status==="scheduled"&&item.productId===product.id).reduce((sum,item)=>sum+item.quantity,0);
  return `<article class="product-card ${locked?"locked":""}" style="--product-color:${product.color}">
    <div class="product-head"><div class="product-icon">${product.icon}</div><div><h3>${product.name}</h3><p>${formatEuro(product.cost)} cost · ${formatEuro(product.reference)} reference</p></div><span class="stock-pill">${run.stock[product.id]} stock${incoming?` · ${incoming} inbound`:""}</span></div>
    <div class="buy-row"><div class="qty-control"><button class="qty-minus" data-id="${product.id}" aria-label="Decrease quantity" ${locked?"disabled":""}>−</button><input class="qty-input" data-id="${product.id}" id="qty-${product.id}" type="number" min="1" step="1" value="1" aria-label="Quantity" ${locked?"disabled":""}><button class="qty-plus" data-id="${product.id}" aria-label="Increase quantity" ${locked?"disabled":""}>+</button></div><button class="action-button buy-button" data-id="${product.id}" ${locked ? "disabled" : ""}>${locked?(level===0?"Venue closed":`Unlock at level ${product.tier}`):`Order · <span id="total-${product.id}">${formatEuro(product.cost)}</span>`}</button></div>
  </article>`;
}

function updateBuyTotal(id) {
  const product = CATALOGUE.find(p=>p.id===id), quantity = Number($(`#qty-${id}`).value);
  $(`#total-${id}`).textContent = Number.isInteger(quantity) && quantity > 0 ? formatEuro(product.cost*quantity) : "—";
}

function focusDefinition(id){return SPECIALIZATION_FOCUSES.find(item=>item.id===id)||SPECIALIZATION_FOCUSES[0];}
function storeSpecializationMarkup(storeId,level){
  const active=storeSpecialization(run,storeId),synergy=specializationSynergy(run,storeId),choices=STORE_SPECIALIZATIONS.filter(item=>item.storeId===storeId);
  if(level<2)return `<section class="specialization-locked"><span>◇</span><div><small>STORE CONCEPTS</small><strong>Upgrade to level 2</strong><p>Choose a permanent operating direction once this venue has room for a full fit-out.</p></div></section>`;
  return `<section class="specialization-section"><div class="specialization-heading"><div><small>STORE SPECIALIZATION</small><strong>${active?active.name:"Choose an operating concept"}</strong></div>${active?`<span style="--focus:${focusDefinition(active.focus).color}">${focusDefinition(active.focus).icon} ${focusDefinition(active.focus).name} · ${synergy.matches}/3 synergy</span>`:`<span>ONE ACTIVE CONCEPT</span>`}</div><div class="specialization-options">${choices.map(choice=>{const focus=focusDefinition(choice.focus),selected=active?.id===choice.id,serviceChange=Math.round((choice.service-1)*100);return `<article class="specialization-option ${selected?"selected":""}" style="--focus:${focus.color}"><div class="specialization-icon">${focus.icon}</div><div><small>${focus.name.toUpperCase()} CONCEPT</small><strong>${choice.name}</strong><p>${choice.description}</p><ul><li>${serviceChange>=0?"+":""}${serviceChange}% service speed</li><li>+${choice.appeal} destination appeal</li><li>+${formatEuro(choice.operating)} daily overhead</li></ul></div><button data-store-specialization="${choice.id}" ${selected||run.cash<choice.cost?"disabled":""}>${selected?"ACTIVE":`${active?"Refit":"Fit out"} · ${formatEuro(choice.cost)}`}</button></article>`}).join("")}</div><p class="specialization-synergy-note"><b>District synergy:</b> every specialized facility with the same focus in this store’s district adds 4% service speed and 4 appeal, up to three matches.</p></section>`;
}

function openStore(storeId="cafe") {
  const store=STORES.find(item=>item.id===storeId), products=CATALOGUE.filter(product=>product.storeId===storeId);
  const level=run.venues?.[storeId] ?? 0, project=activeVenueProject(run,storeId), upgradeCost=level===1?1500:2500,progress=progressionState(run),requiredLevel=STORE_REQUIREMENTS[storeId]||1,districtMissing=storeId==="beach"&&!run.districts?.east?"East Promenade":storeId==="surf"&&!run.districts?.pier?"Ocean Pier":null,hours=run.storeHours?.[storeId]||DEFAULT_STORE_HOURS[storeId],isOpen=storeIsOpen(run,storeId),overhead=storeOperatingCost(run,storeId),serviceMultiplier=venueServiceMultiplier(run,storeId);
  if(level===0){
    const cost=STORE_UNLOCKS[storeId],ready=progress.level>=requiredLevel&&!districtMissing;drawerContent.innerHTML=`<p class="eyebrow">Expansion opportunity · ${store.short}</p><div class="locked-venue-hero" style="--venue:${store.color}"><span>${store.icon}</span><small>LEVEL ${requiredLevel} VENUE</small><h2>${store.name}</h2><p>${store.pitch} The building appears only after you earn the level, secure its district and purchase the operating license.</p><div class="unlock-requirements"><em class="${progress.level>=requiredLevel?"done":""}">COMPANY LEVEL ${requiredLevel}</em><em class="${!districtMissing?"done":""}">${districtMissing?`ACQUIRE ${districtMissing.toUpperCase()}`:"DISTRICT READY"}</em></div><div><em>OPENING COST</em><strong>${formatEuro(cost)}</strong></div><button class="action-button orange" id="unlockVenue" ${run.cash<cost||!ready?"disabled":""}>${!ready?`Requires level ${requiredLevel}${districtMissing?" + land":""}`:`Open ${store.short}`}</button></div>${storeTabs(storeId,"store")}`;
    drawerContent.querySelectorAll(".store-tab").forEach(button=>button.addEventListener("click",()=>openLocation(button.dataset.store)));
    $("#unlockVenue").addEventListener("click",()=>{try{save(unlockVenue(run,storeId));toast(`${store.name} construction started`);beep(760);openStore(storeId);}catch(error){toast(error.message,true);}});return;
  }
  const units=products.reduce((sum,p)=>sum+run.stock[p.id],0);
  const campus=campusMetrics(run),potential=products.reduce((sum,p)=>sum+Math.min(run.stock[p.id],Math.round(demandFor(run.prices[p.id],p.reference)*Math.max(.45,campus.guests/24)))*run.prices[p.id],0);
  drawerContent.innerHTML = `
    <p class="eyebrow">Venue management · ${store.short}</p><div class="venue-title"><div><h2>${store.name}</h2><p>${store.pitch}</p></div><div class="level-badge"><small>VENUE LEVEL</small><strong>${level} / 3</strong></div></div>
    <div class="venue-evolution level-${level}" style="--venue:${store.color}"><span class="evo-building"><i></i><b>${store.icon}</b></span><div><small>VISUAL STAGE ${level}</small><strong>${level===1?"Compact campus kiosk":level===2?"Expanded service terrace":"Two-storey flagship"}</strong><p>${level===1?"One counter and a small awning.":level===2?"Faster frontage, terrace seating and stronger identity.":"Premium façade, rooftop fit-out and maximum product range."}</p></div></div>
    ${project?`<div class="venue-project-card" style="--venue:${store.color}"><div class="project-hardhat">⌂</div><div><small>${project.kind==="open"?"NEW VENUE CONSTRUCTION":`UPGRADE TO LEVEL ${project.toLevel}`}</small><strong>${Math.round(venueProjectProgress(project)*100)}% complete</strong><p>The venue is fenced off and cannot serve guests for another ${Math.ceil(project.remainingMinutes)} game minutes.</p><i><em style="width:${venueProjectProgress(project)*100}%"></em></i></div></div>`:""}
    ${storeSpecializationMarkup(storeId,level)}
    <div class="store-hours-card ${isOpen?"open":"closed"}" id="currentStoreHours" data-store-id="${storeId}"><div><span id="currentStoreState">${isOpen?"OPEN NOW":"CLOSED"}</span><small>${formatClock(hours.open)} — ${formatClock(hours.close)}</small><strong id="currentStoreCountdown">${isOpen?`${formatDuration(hours.close-run.clockMinutes)} remaining`:run.clockMinutes<hours.open?`Opens in ${formatDuration(hours.open-run.clockMinutes)}`:"Closed for today"}</strong></div><label>OPEN<input id="storeOpenTime" type="time" min="07:30" max="17:30" value="${formatClock(hours.open)}"></label><label>CLOSE<input id="storeCloseTime" type="time" min="09:30" max="19:30" value="${formatClock(hours.close)}"></label><button id="saveStoreHours">Apply hours</button></div>
    <div class="upgrade-track"><span style="width:${level/3*100}%"></span></div>
    ${level<3?`<button class="upgrade-button" id="upgradeVenue" ${project?"disabled":""}>${project?"Construction in progress":`Upgrade to level ${level+1}`}<small>${project?`${Math.ceil(project.remainingMinutes)} game minutes remaining`:`Unlock ${products.find(p=>p.tier===level+1)?.name} · faster service · higher upkeep · ${formatEuro(upgradeCost)}`}</small></button>`:`<div class="max-level">★ Flagship venue · all products unlocked · maximum service speed</div>`}
    ${storeTabs(storeId,"store")}
    <div class="venue-kpis"><div><small>ON HAND</small><strong>${units}</strong><span>units</span></div><div><small>DAILY OVERHEAD</small><strong>${formatEuro(overhead)}</strong><span>based on level + hours</span></div><div><small>SERVICE SPEED</small><strong>${serviceMultiplier.toFixed(2)}×</strong><span>${run.staff?.service||0} queue leads available</span></div></div>
    <div class="rule-box"><strong>Live demand</strong><div class="rule-grid"><div><b>${campus.guests} guests</b><small>campus footfall</small></div><div><b>${campus.rating}% rating</b><small>raises conversion</small></div><div><b>${crowdPeak(run.clockMinutes).multiplier.toFixed(1)}× flow</b><small>${crowdPeak(run.clockMinutes).label}</small></div></div></div>
    <div class="product-list">${products.map(product => productPriceCard(product)).join("")}</div>
    <div class="trade-footer"><button class="action-button secondary" id="visitSupplier">Buy more stock</button><button class="action-button orange" id="venueClock">${run.speed===0?"Resume":"Pause"} live trading</button></div>`;
  drawerContent.querySelectorAll(".store-tab").forEach(button=>button.addEventListener("click",()=>openLocation(button.dataset.store)));
  drawerContent.querySelectorAll(".price-input").forEach(input => {
    input.addEventListener("input", () => updateDemandPreview(input.dataset.id));
    input.addEventListener("change", () => commitPrice(input.dataset.id));
  });
  drawerContent.querySelectorAll(".set-price").forEach(button => button.addEventListener("click",()=>commitPrice(button.dataset.id)));
  if($("#upgradeVenue")&&!project) $("#upgradeVenue").addEventListener("click",()=>{try{save(upgradeVenue(run,storeId));toast(`${store.name} level ${level+1} construction started`);beep(720);openStore(storeId);}catch(error){toast(error.message,true);beep(180);}});
  drawerContent.querySelectorAll("[data-store-specialization]").forEach(button=>button.addEventListener("click",()=>{try{const specialization=STORE_SPECIALIZATIONS.find(item=>item.id===button.dataset.storeSpecialization);save(setStoreSpecialization(run,storeId,specialization.id));toast(`${specialization.name} is now the active concept`);beep(760);openStore(storeId);}catch(error){toast(error.message,true);beep(180);}}));
  $("#visitSupplier").addEventListener("click",()=>{currentSupplierStore=storeId;openLocation("supplier");});
  $("#saveStoreHours").addEventListener("click",()=>{try{save(setStoreHours(run,storeId,timeInputToMinutes($("#storeOpenTime").value),timeInputToMinutes($("#storeCloseTime").value)));toast(`${store.short} hours updated`);beep(560);openStore(storeId);}catch(error){toast(error.message,true);beep(180);}});
  $("#venueClock").addEventListener("click",()=>{setGameSpeed(run.speed===0?1:0);openStore(storeId);});
}

function openPortfolio() {
  const progress=progressionState(run);drawerContent.innerHTML=`<p class="eyebrow">Company level ${progress.level} · ${progress.title}</p><h2>Your business network</h2><p class="drawer-intro">Start with Atlantic Café, reinvest its live profits, acquire land and turn construction plots into a five-store coastal portfolio.</p><div class="progress-ribbon"><span style="width:${progress.progress}%"></span><strong>${progress.next?`${progress.xp} / ${progress.next.xp} XP · NEXT: ${progress.next.unlock}`:"MAXIMUM LEVEL REACHED"}</strong></div><div class="venue-grid">${STORES.map(store=>{
    const products=CATALOGUE.filter(p=>p.storeId===store.id),units=products.reduce((sum,p)=>sum+run.stock[p.id],0),potential=products.reduce((sum,p)=>sum+Math.min(run.stock[p.id],demandFor(run.prices[p.id],p.reference))*run.prices[p.id],0);
    const level=run.venues?.[store.id]??0,required=STORE_REQUIREMENTS[store.id]||1,project=activeVenueProject(run,store.id);return `<button class="venue-card ${level===0?"locked-venue":""} ${project?"is-building":""}" data-store="${store.id}" style="--venue:${store.color}"><span class="venue-icon">${level===0?"⌁":project?"⌂":store.icon}</span><div><small>${store.short.toUpperCase()} · ${project?`${Math.round(venueProjectProgress(project)*100)}% BUILDING`:level===0?`LEVEL ${required}`:`LEVEL ${level}`}</small><strong>${store.name}</strong><p>${project?`${Math.ceil(project.remainingMinutes)} game minutes until the site reopens.`:store.pitch}</p></div><div class="venue-metrics"><span><b>${units}</b> stock</span><span><b>${level===0?formatEuro(STORE_UNLOCKS[store.id]):formatEuro(potential)}</b> ${level===0?"to open":"potential"}</span><span><b>${level}/3</b> stage</span></div><em>${level===0?"Inspect construction plot →":project?"Inspect construction →":"Manage venue →"}</em></button>`}).join("")}</div>`;
  drawerContent.querySelectorAll(".venue-card").forEach(button=>button.addEventListener("click",()=>openLocation(button.dataset.store)));
}

function openDistrictPanel(districtId){
  const district=DISTRICT_CATALOGUE.find(item=>item.id===districtId),progress=progressionState(run),owned=Boolean(run.districts?.[districtId]),previousReady=districtId!=="pier"||run.districts?.east,ready=progress.level>=district.level&&previousReady;
  const features=districtId==="east"?["9 new buildable tiles","Maré Beach Bar plot","Coastline Pavilion","New guest entrance"]:["7-tile ocean boardwalk","Surf Shack plot","Nova Surf Cup","Premium guest entrance"];
  drawerContent.innerHTML=`<p class="eyebrow">Land expansion · company level ${progress.level}</p><div class="district-hero" style="--district:${district.color}"><span>${districtId==="east"?"☀":"≈"}</span><div><small>${owned?"DISTRICT ACQUIRED":`UNLOCKS AT LEVEL ${district.level}`}</small><h2>${district.name}</h2><p>${district.description}</p></div></div><div class="district-map-preview ${owned?"owned":""}"><i></i><b></b><span>CORE CAMPUS</span><strong>${district.name.toUpperCase()}</strong></div><div class="section-heading"><div><small>EXPANSION CONTENT</small><strong>What this land adds</strong></div></div><div class="district-feature-grid">${features.map(feature=>`<div><span>✓</span>${feature}</div>`).join("")}</div>${owned?`<div class="max-level">★ Land owned · walk through the district gate now</div>`:`<div class="unlock-requirements"><em class="${progress.level>=district.level?"done":""}">COMPANY LEVEL ${district.level}</em><em class="${previousReady?"done":""}">${districtId==="pier"?"EAST PROMENADE OWNED":"CORE CAMPUS OWNED"}</em></div><div class="district-price"><small>LAND ACQUISITION</small><strong>${formatEuro(district.cost)}</strong><span>Permanent expansion</span></div><button class="action-button orange" id="buyDistrict" ${!ready||run.cash<district.cost?"disabled":""}>${!ready?`Reach level ${district.level}${previousReady?"":" + acquire East"}`:`Acquire ${district.name}`}</button>`}`;
  drawer.classList.add("open");drawer.setAttribute("aria-hidden","false");if($("#buyDistrict"))$("#buyDistrict").addEventListener("click",()=>{try{save(unlockDistrict(run,districtId));toast(`${district.name} acquired · the map has expanded`);beep(820);openDistrictPanel(districtId);}catch(error){toast(error.message,true);beep(180);}});
}

function openDjOperations(deckId,preserveScroll=false){
  const previousScroll=drawer.scrollTop;
  if(run.djOperations?.deckId!==deckId){run=configureDjOperations(run,{deckId});localStorage.setItem(activeStorageKey(),JSON.stringify(run));}
  const ops=run.djOperations,projection=djEventProjection(run),dj=DJ_ROSTER.find(item=>item.id===ops.djId),active=run.activeEvent?.source==="dj"&&run.activeEvent.deckId===deckId,scheduled=run.scheduledEvent?.source==="dj"&&run.scheduledEvent.deckId===deckId,busy=Boolean(active||scheduled),history=(run.eventHistory||[]).filter(item=>item.eventId==="dj-event").slice(-3).reverse();
  const status=active?`<div class="dj-live-banner"><span>LIVE</span><div><small>${run.activeEvent.djName} · ${DJ_STYLES.find(item=>item.id===run.activeEvent.styleId)?.name}</small><strong>${run.activeEvent.attendance||0} / ${run.activeEvent.capacity} guests</strong><em>${Math.ceil(run.activeEvent.remainingMinutes)} min left · ${formatEuro(run.activeEvent.revenue||0)} ticket revenue</em></div><i style="--progress:${Math.round((run.activeEvent.attendance||0)/run.activeEvent.capacity*100)}%"></i></div>`:scheduled?`<div class="dj-scheduled-banner"><span>◷</span><div><small>NEXT EVENT</small><strong>${run.scheduledEvent.name}</strong><em>Day ${run.scheduledEvent.day} · ${formatClock(run.scheduledEvent.startMinute)} · ${run.scheduledEvent.djName}</em></div></div>`:`<div class="dj-ready-banner"><span>♫</span><div><small>DECK AVAILABLE</small><strong>Build the next campus moment</strong><em>Configure the set, review the forecast, then put it on the calendar.</em></div></div>`;
  drawerContent.innerHTML=`<p class="eyebrow">Attraction operations · managed DJ deck</p><div class="dj-ops-title"><div><small>${deckId==="pavilion"?"COASTLINE PAVILION":"CUSTOM BEACH EXPERIENCE"}</small><h2>Atlantic Sessions</h2><p>Program events as a real business: price tickets, control the sound, protect comfort and grow capacity.</p></div><span>${ops.lifetimeAttendance||0}<small>LIFETIME GUESTS</small></span></div>${status}
    <div class="dj-control-grid"><section><div class="section-heading compact"><div><small>01 · TIME</small><strong>Choose a session</strong></div></div><div class="dj-slot-grid">${DJ_EVENT_SLOTS.map(slot=>`<button data-dj-slot="${slot.id}" class="${ops.slotId===slot.id?"selected":""}" ${busy?"disabled":""}><span>${formatClock(slot.startMinute)}</span><strong>${slot.name}</strong><small>${slot.description}</small></button>`).join("")}</div></section><section><div class="section-heading compact"><div><small>02 · TICKETS</small><strong>Set the entry price</strong></div></div><div class="dj-ticket-control"><label><span>€</span><input id="djTicketPrice" inputmode="decimal" value="${(ops.ticketPrice/100).toFixed(2)}" ${busy?"disabled":""}></label><div><strong>${projection.expectedAttendance}/${projection.capacity}</strong><small>forecast attendance</small></div></div><p class="dj-hint">Higher prices improve yield but reduce the number of guests who can afford the set.</p></section></div>
    <div class="section-heading"><div><small>03 · MUSIC DIRECTION</small><strong>Choose the crowd you want</strong></div><span>Style changes appeal, noise and comfort</span></div><div class="dj-style-grid">${DJ_STYLES.map(style=>`<button data-dj-style="${style.id}" class="${ops.styleId===style.id?"selected":""}" style="--style:${style.color}" ${busy?"disabled":""}><i></i><small>${style.name}</small><strong>EXC ${style.excitement} · NOISE ${style.noise}</strong><p>${style.description}</p></button>`).join("")}</div>
    <div class="section-heading"><div><small>04 · EVENT FORECAST</small><strong>Operational balance</strong></div><span>Updates with every decision</span></div><div class="dj-forecast"><div class="dj-radar"><div><span>EXCITEMENT <b>${projection.excitement}</b></span><i><em style="width:${projection.excitement}%"></em></i></div><div class="noise"><span>NOISE <b>${projection.noise}</b></span><i><em style="width:${projection.noise}%"></em></i></div><div class="comfort"><span>COMFORT <b>${projection.comfort}</b></span><i><em style="width:${projection.comfort}%"></em></i></div><div><span>CAPACITY <b>${projection.capacity}</b></span><i><em style="width:${Math.min(100,projection.capacity/69*100)}%"></em></i></div></div><div class="dj-economics"><div><small>OPERATING COST</small><strong>−${formatEuro(projection.operatingCost)}</strong></div><div><small>EXPECTED TICKETS</small><strong>${formatEuro(projection.expectedRevenue)}</strong></div><div class="${projection.expectedProfit>=0?"positive":"negative"}"><small>FORECAST PROFIT</small><strong>${projection.expectedProfit>=0?"+":"−"}${formatEuro(Math.abs(projection.expectedProfit))}</strong></div><p>${projection.noise>72?"Noise is high enough to hurt the campus rating during the event.":projection.comfort<45?"Low comfort will shorten visits and weaken the crowd.":"The current setup is balanced enough to support a healthy event."}</p></div></div>
    <div class="section-heading"><div><small>05 · RESIDENT DJ</small><strong>${dj?`${dj.name} is under contract`:"Hire the talent"}</strong></div><span>${dj?`${formatEuro(dj.eventFee)} per event`:"Required before scheduling"}</span></div><div class="dj-roster">${DJ_ROSTER.map(person=>`<article class="${ops.djId===person.id?"hired":""}"><span>${person.name.split(" ").map(part=>part[0]).join("")}</span><div><small>${person.tag}</small><strong>${person.name}</strong><p>${person.description}</p><em>${formatEuro(person.eventFee)} event fee · ${Math.round(person.appeal*100)} draw</em></div><button data-hire-dj="${person.id}" ${busy||ops.djId===person.id||run.cash<person.hireCost?"disabled":""}>${ops.djId===person.id?"HIRED":`Hire · ${formatEuro(person.hireCost)}`}</button></article>`).join("")}</div>
    <div class="section-heading"><div><small>06 · PRODUCTION UPGRADES</small><strong>Build a stronger venue</strong></div><span>Three levels each</span></div><div class="dj-upgrade-grid">${DJ_UPGRADES.map(item=>{const level=ops.upgrades[item.id]||0,cost=item.costs[level];return `<article><span>${item.icon}</span><div><small>LEVEL ${level} / 3</small><strong>${item.name}</strong><p>${item.description}</p><i>${[1,2,3].map(step=>`<b class="${step<=level?"active":""}"></b>`).join("")}</i></div><button data-dj-upgrade="${item.id}" ${busy||level>=3||run.cash<cost?"disabled":""}>${level>=3?"MAX":`Upgrade · ${formatEuro(cost)}`}</button></article>`}).join("")}</div>
    <div class="dj-launch"><div><small>READY TO PROGRAM</small><strong>${projection.style.name} · ${projection.slot.name}</strong><p>${dj?`${dj.name} · ${formatEuro(projection.ticketPrice)} ticket · ${projection.expectedAttendance} expected guests`:"Hire a resident DJ to unlock scheduling."}</p></div><button id="scheduleDjEvent" ${busy||!dj||run.cash<projection.operatingCost?"disabled":""}>${active?"EVENT LIVE":scheduled?"EVENT SCHEDULED":`Schedule · ${formatEuro(projection.operatingCost)}`}</button></div>
    ${history.length?`<div class="section-heading"><div><small>RECENT SETS</small><strong>Event performance</strong></div></div><div class="dj-history">${history.map(item=>`<div><span>${item.attendance} guests</span><strong>${DJ_STYLES.find(style=>style.id===item.styleId)?.name||item.name}</strong><em>${item.grossProfit>=0?"+":"−"}${formatEuro(Math.abs(item.grossProfit))}</em></div>`).join("")}</div>`:""}`;
  drawer.classList.add("open");drawer.setAttribute("aria-hidden","false");drawer.scrollTop=preserveScroll?previousScroll:0;
  drawerContent.querySelectorAll("[data-dj-slot]").forEach(button=>button.addEventListener("click",()=>{save(configureDjOperations(run,{deckId,slotId:button.dataset.djSlot}));openDjOperations(deckId,true);}));
  drawerContent.querySelectorAll("[data-dj-style]").forEach(button=>button.addEventListener("click",()=>{save(configureDjOperations(run,{deckId,styleId:button.dataset.djStyle}));openDjOperations(deckId,true);}));
  $("#djTicketPrice")?.addEventListener("change",event=>{try{save(configureDjOperations(run,{deckId,ticketPrice:parseEuro(event.target.value)}));openDjOperations(deckId,true);}catch(error){toast(error.message,true);openDjOperations(deckId,true);}});
  drawerContent.querySelectorAll("[data-hire-dj]").forEach(button=>button.addEventListener("click",()=>{try{const person=DJ_ROSTER.find(item=>item.id===button.dataset.hireDj);save(hireDj(run,button.dataset.hireDj,deckId));toast(`${person.name} hired as resident DJ`);beep(720);openDjOperations(deckId,true);}catch(error){toast(error.message,true);}}));
  drawerContent.querySelectorAll("[data-dj-upgrade]").forEach(button=>button.addEventListener("click",()=>{try{const item=DJ_UPGRADES.find(entry=>entry.id===button.dataset.djUpgrade);save(upgradeDjDeck(run,button.dataset.djUpgrade,deckId));toast(`${item.name} upgraded`);beep(680);openDjOperations(deckId,true);}catch(error){toast(error.message,true);}}));
  $("#scheduleDjEvent")?.addEventListener("click",()=>{try{const next=scheduleDjEvent(run,deckId);save(next);toast(`${next.scheduledEvent.name} scheduled for day ${next.scheduledEvent.day}`);beep(900);openDjOperations(deckId,true);}catch(error){toast(error.message,true);beep(180);}});
}

function openEventVenue(){
  const progress=progressionState(run),active=EVENT_CATALOGUE.find(event=>event.id===run.activeEvent?.id);
  if(!run.eventVenue){const ready=progress.level>=7&&run.districts?.east;drawerContent.innerHTML=`<p class="eyebrow">Event expansion · East Promenade</p><div class="event-venue-hero"><span>♫</span><small>LEVEL 7 LANDMARK</small><h2>Coastline Pavilion</h2><p>Build a permanent event venue that creates timed crowd waves and gives guests a new destination.</p><div><em>BUILD COST</em><strong>${formatEuro(50000)}</strong></div><button class="action-button orange" id="buildEventVenue" ${!ready||run.cash<50000?"disabled":""}>${!run.districts?.east?"Acquire East Promenade first":progress.level<7?"Reach company level 7":"Build Coastline Pavilion"}</button></div>`;drawer.classList.add("open");drawer.setAttribute("aria-hidden","false");$("#buildEventVenue").addEventListener("click",()=>{try{save(unlockEventVenue(run));toast("Coastline Pavilion opened");beep(850);openEventVenue();}catch(error){toast(error.message,true);beep(180);}});return;}
  openDjOperations("pavilion");
}

function openProgressPanel(){
  activeLocation=null;const progress=progressionState(run),goals=scenarioGoals(run);drawerContent.innerHTML=`<p class="eyebrow">Company progression · season one</p><div class="progress-hero"><div><small>COMPANY LEVEL</small><strong>${progress.level}</strong><em>${progress.title}</em></div><div><small>EXPERIENCE</small><strong>${progress.xp} XP</strong><em>${progress.next?`${progress.next.xp-progress.xp} to next level`:"Maximum level"}</em></div><div><small>EMPIRE VALUE</small><strong>${formatEuro(run.cash+inventoryValue(run))}</strong><em>${Object.values(run.venues).filter(level=>level>0).length} stores · ${Object.values(run.districts).filter(Boolean).length} districts</em></div></div><div class="progress-ribbon large"><span style="width:${progress.progress}%"></span><strong>${progress.next?`NEXT UNLOCK · ${progress.next.unlock}`:"NOVA LEGEND · ALL LEVELS COMPLETE"}</strong></div><div class="section-heading"><div><small>LONG-TERM GOALS</small><strong>Build a campus institution</strong></div><span>${goals.filter(goal=>goal.complete).length}/${goals.length} complete</span></div><div class="goal-grid">${goals.map(goal=>`<article class="${goal.complete?"complete":""}"><span>${goal.complete?"✓":"○"}</span><div><strong>${goal.name}</strong><p>${goal.description}</p><i><em style="width:${Math.min(100,goal.value/goal.target*100)}%"></em></i><small>${goal.value} / ${goal.target}</small></div></article>`).join("")}</div><div class="section-heading"><div><small>LEVEL ROADMAP</small><strong>Every level changes what you can build</strong></div></div><div class="level-roadmap">${PROGRESSION_LEVELS.map(tier=>`<div class="${tier.level<progress.level?"done":tier.level===progress.level?"current":""}"><span>${tier.level}</span><div><strong>${tier.title}</strong><small>${tier.unlock}</small></div><em>${tier.xp} XP</em></div>`).join("")}</div><div class="section-heading"><div><small>LAND PORTFOLIO</small><strong>Expandable campus districts</strong></div></div><div class="district-buttons">${DISTRICT_CATALOGUE.map(district=>`<button data-district="${district.id}" style="--district:${district.color}"><span>${run.districts?.[district.id]?"✓":"⌁"}</span><div><strong>${district.name}</strong><small>${run.districts?.[district.id]?"Owned":`Level ${district.level} · ${formatEuro(district.cost)}`}</small></div></button>`).join("")}</div>`;drawer.classList.add("open");drawer.setAttribute("aria-hidden","false");drawerContent.querySelectorAll("[data-district]").forEach(button=>button.addEventListener("click",()=>openDistrictPanel(button.dataset.district)));
}

function beginBuildMode(build){
  if(buildResumeSpeed===null)buildResumeSpeed=run.speed;run.speed=0;pendingBuild={mode:"place",rotation:0,...build};closeDrawer();
  if(currentZone!=="campus")changeZone("campus",{x:21,y:18});
  const start=snappedBuildPoint(run.player.x,Math.min(21.5,run.player.y+2));updateBuildCursor(start.x,start.y);localStorage.setItem(activeStorageKey(),JSON.stringify(run));updateHUD();toast(`${pendingBuild.mode==="move"?"Move":"Build"} mode · position ${pendingBuild.name}`);beep(560);
}
function startBuild(type,name,modules=[]){beginBuildMode({type,name,modules,mode:"place",rotation:0});}
function startMoveFacility(facility){beginBuildMode({type:facility.type,name:`Move ${facility.name}`,modules:facility.modules||[],mode:"move",sourceId:facility.id,rotation:facility.rotation||0});}
function rotatePendingBuild(){if(!pendingBuild)return;pendingBuild.rotation=((pendingBuild.rotation||0)+1)%4;if(buildCursor)updateBuildCursor(buildCursor.x,buildCursor.y);refreshBuildNotice();toast(`Rotated to ${pendingBuild.rotation*90}°`);beep(480);}
function cancelBuildMode(){if(!pendingBuild)return;pendingBuild=null;buildCursor=null;if(buildResumeSpeed!==null)run.speed=buildResumeSpeed;buildResumeSpeed=null;localStorage.setItem(activeStorageKey(),JSON.stringify(run));updateHUD();toast("Build mode cancelled");}
function finishBuildMode(next){if(buildResumeSpeed!==null)next.speed=buildResumeSpeed;pendingBuild=null;buildCursor=null;buildResumeSpeed=null;save(next);}
function confirmDemolish(facility){
  const refund=Math.floor((facility.cost||0)*.4);modalCard.className="modal-card";modalCard.innerHTML=`<p class="eyebrow">Campus works · demolition</p><h2 id="modalTitle">Remove ${facility.name}?</h2><p>This permanently removes the facility and returns <strong>${formatEuro(refund)}</strong> in salvage value. Campus needs and rating update immediately.</p><div class="modal-actions"><button class="action-button secondary" data-close>Keep facility</button><button class="action-button orange" id="confirmDemolish">Remove &amp; refund</button></div>`;showModal();modalCard.querySelector("[data-close]").addEventListener("click",hideModal);$("#confirmDemolish").addEventListener("click",()=>{const next=demolishFacility(run,facility.id);save(next);hideModal();openBuildPanel();toast(`${facility.name} removed · ${formatEuro(refund)} returned`);beep(260);});
}

function experiencePreview(moduleIds){
  const has=id=>moduleIds.includes(id);
  return `<div class="experience-preview"><div class="preview-top"><span>LIVE WORLD PREVIEW</span><b>${moduleIds.length} modules</b></div><div class="preview-scene">
    <i class="preview-base"></i>${has("surf")?'<i class="preview-surf"><b></b></i>':""}${has("music")?'<i class="preview-music"><b></b><b></b><b></b></i>':""}${has("sunset")?'<i class="preview-lookout"><b></b></i>':""}${has("social")?'<i class="preview-social"></i>':""}${has("shade")?'<i class="preview-shade"><b></b></i>':""}
  </div><p>${moduleIds.map(id=>EXPERIENCE_MODULES.find(item=>item.id===id)?.name).filter(Boolean).join(" + ")}</p></div>`;
}

const FACILITY_PRESENTATION={
  path:{code:"RT-01",category:"ROUTES",caption:"Limestone + brass wayfinding",material:"PALE STONE"},
  scenery:{code:"LS-02",category:"LANDSCAPE",caption:"Carcavelos coastal planting",material:"WHITE CONCRETE"},
  bench:{code:"CM-03",category:"COMFORT",caption:"Atlantic timber seating",material:"IROKO + STEEL"},
  bin:{code:"SV-04",category:"SERVICES",caption:"Separated campus waste",material:"POWDER COAT"},
  water:{code:"SV-05",category:"SERVICES",caption:"Filtered public hydration",material:"TERRAZZO + STEEL"},
  restroom:{code:"AM-06",category:"AMENITY",caption:"Accessible service pavilion",material:"GLASS + TILE"},
  foodGarden:{code:"DS-07",category:"DESTINATION",caption:"Shaded social food court",material:"CANVAS + TIMBER"}
};
const NEED_LABELS={mood:"MOOD",energy:"ENERGY",cleanliness:"CLEAN",thirst:"THIRST",bladder:"RELIEF",hunger:"HUNGER"};
const FACILITY_ART={
  path:`<svg viewBox="0 0 240 144"><ellipse class="art-shadow" cx="126" cy="119" rx="87" ry="13"/><g class="stone"><path d="M24 74 99 49l55 22-76 28Z"/><path d="m78 99 76-28v14l-76 29Z"/><path d="m154 71 55 22v14l-55-22Z"/><path d="m78 99 76-28 55 22-76 29Z"/></g><g class="stone stone-back"><path d="m61 53 73-25 47 18-72 27Z"/><path d="m109 73 72-27v13l-72 28Z"/><path d="m181 46 32 13v13l-32-13Z"/><path d="m109 73 72-27 32 13-72 28Z"/></g><path class="brass-line" d="m75 72 37 14 78-29"/><path class="joint" d="m111 74 43 17M133 35l48 18M61 67l47 18"/></svg>`,
  scenery:`<svg viewBox="0 0 240 144"><ellipse class="art-shadow" cx="124" cy="119" rx="71" ry="13"/><path class="plinth-top" d="m49 83 81-25 63 23-82 27Z"/><path class="plinth-front" d="m111 108 82-27v21l-82 29Z"/><path class="plinth-side" d="m49 83 62 25v23l-62-26Z"/><path class="soil" d="m74 82 57-18 38 15-57 19Z"/><path class="trunk" d="M119 82c0-19 5-35 8-53"/><g class="fronds"><path d="M127 34Q94 22 72 33M127 34q29-19 57-14M127 34Q99 37 79 58M127 34q34 4 52 27M127 34q-3 20-18 36M127 34q15 19 20 39"/></g><circle class="palm-heart" cx="127" cy="34" r="5"/></svg>`,
  bench:`<svg viewBox="0 0 240 144"><ellipse class="art-shadow" cx="121" cy="119" rx="83" ry="13"/><path class="pad" d="m34 99 92-28 78 26-92 31Z"/><g class="bench-legs"><path d="M73 80v31M164 68v31M94 89v29M185 77v28"/></g><path class="timber-side" d="m55 74 122-30v14L55 89Z"/><path class="timber-top" d="m55 68 122-29 19 8L74 78Z"/><path class="timber-side seat" d="m65 88 120-29v13L65 102Z"/><path class="timber-top seat" d="m65 83 120-29 18 8L83 92Z"/><g class="slats"><path d="m79 64 19 8M104 58l19 8M130 52l19 8M155 46l19 8M90 79l18 8M116 73l18 8M142 67l18 8M168 61l18 8"/></g></svg>`,
  bin:`<svg viewBox="0 0 240 144"><ellipse class="art-shadow" cx="123" cy="121" rx="71" ry="12"/><path class="service-pad" d="m47 99 82-25 64 23-82 28Z"/><g class="bin-green"><path d="m67 56 45 12v48L67 103Z"/><path d="m112 68 20-8v48l-20 8Z"/><path d="m67 56 20-8 45 12-20 8Z"/><circle cx="92" cy="75" r="7"/></g><g class="bin-blue"><path d="m125 49 43 12v47l-43-12Z"/><path d="m168 61 20-8v47l-20 8Z"/><path d="m125 49 20-8 43 12-20 8Z"/><circle cx="148" cy="68" r="7"/></g><path class="service-rail" d="m61 54 50 14 20-8 43 12 19-8"/></svg>`,
  water:`<svg viewBox="0 0 240 144"><ellipse class="art-shadow" cx="122" cy="121" rx="72" ry="12"/><path class="service-pad" d="m45 101 83-26 67 23-84 29Z"/><path class="fountain-front" d="m74 78 82 22v22l-82-23Z"/><path class="fountain-side" d="m156 100 24-9v22l-24 9Z"/><path class="fountain-top" d="m74 78 24-8 82 21-24 9Z"/><path class="pipe" d="M117 79V52c0-18 15-30 33-25 16 4 25 17 25 34v22"/><path class="tap" d="M166 79h18"/><path class="water-drop" d="M183 87c7 8 6 14 0 16-7-2-8-8 0-16Z"/><ellipse class="basin" cx="121" cy="91" rx="24" ry="7"/></svg>`,
  restroom:`<svg viewBox="0 0 240 144"><ellipse class="art-shadow" cx="123" cy="121" rx="83" ry="13"/><path class="building-pad" d="m35 105 92-30 79 26-94 32Z"/><path class="pod-front" d="m67 48 91 22v50l-91-23Z"/><path class="pod-side" d="m158 70 36-14v50l-36 14Z"/><path class="pod-roof" d="m59 45 98-28 46 17-99 31Z"/><path class="pod-roof-edge" d="m59 45 45 20 99-31v12l-99 32-45-20Z"/><path class="pod-door" d="m116 73 31 8v32l-31-8Z"/><circle class="pod-sign" cx="90" cy="72" r="11"/><path class="pod-person" d="M90 67v12m-6-7h12m-9 7-4 7m11-7 4 7"/></svg>`,
  foodGarden:`<svg viewBox="0 0 240 144"><ellipse class="art-shadow" cx="122" cy="123" rx="99" ry="14"/><path class="garden-pad" d="m20 102 105-35 95 31-107 38Z"/><g class="pergola-posts"><path d="M48 53v61M184 48v62M81 75v50M215 70v42"/></g><path class="canopy" d="M38 50 147 17l75 25-109 36Z"/><path class="canopy-stripe" d="m69 41 76-23 18 6-77 25Zm51 18 77-24 18 6-78 25Z"/><path class="garden-counter-front" d="m73 80 95 25v20l-95-26Z"/><path class="garden-counter-side" d="m168 105 25-9v20l-25 9Z"/><path class="garden-counter-top" d="m73 80 25-8 95 24-25 9Z"/><g class="stools"><ellipse cx="62" cy="110" rx="12" ry="5"/><ellipse cx="92" cy="121" rx="12" ry="5"/><ellipse cx="190" cy="126" rx="12" ry="5"/></g><g class="garden-plants"><path d="M40 100v-18m0 5-10-9m10 7 11-12M211 102V84m0 5-11-9m11 6 10-13"/></g></svg>`
};
function facilityPreviewMarkup(type){return `<span class="facility-art facility-art-${type}" aria-hidden="true">${FACILITY_ART[type]}</span>`;}
function facilityEffectMarkup(item){const effects=Object.entries(item.needs||{}).map(([key,value])=>`<span>+${value} ${NEED_LABELS[key]||key.toUpperCase()}</span>`);return effects.length?effects.join(""):`<span>WALKABLE ROUTE</span>`;}
function facilityCard(item,progress){
  const meta=FACILITY_PRESENTATION[item.id],size=facilityFootprint(item.id,0),levelRequired=item.id==="foodGarden"?3:1,locked=progress.level<levelRequired;
  return `<article class="facility-card facility-${item.id}-card ${locked?"progress-locked":""}" style="--build:${item.color}">
    <div class="facility-card-head"><span>${meta.code}</span><strong>${meta.category}</strong><em>${size.width.toFixed(1)} × ${size.height.toFixed(1)}</em></div>
    ${facilityPreviewMarkup(item.id)}
    <div class="facility-card-copy"><small>${meta.caption}</small><strong>${item.name}</strong><p>${item.description}</p></div>
    <div class="facility-card-spec"><span>${meta.material}</span><div class="facility-effects">${facilityEffectMarkup(item)}</div></div>
    <button data-build="${item.id}" ${run.cash<item.cost||locked?"disabled":""}><span>${locked?`UNLOCK AT LEVEL ${levelRequired}`:"ADD TO CURSOR"}</span><strong>${locked?"LOCKED":formatEuro(item.cost)}</strong><em>＋</em></button>
  </article>`;
}

function openBuildPanel() {
  activeLocation=null;
  const metrics=campusMetrics(run),stats=attractionStats(selectedExperienceModules),experienceCost=1200+stats.cost,progress=progressionState(run);
  drawerContent.innerHTML=`<p class="eyebrow">Campus construction · ${run.facilities.length} placed</p><h2>Build the campus</h2><p class="drawer-intro">Place paths, scenery and guest facilities directly in the world. Every build changes student needs and your campus rating.</p>
    <div class="management-strip"><div><small>CAMPUS RATING</small><strong>${metrics.rating}%</strong></div><div><small>EXPECTED GUESTS</small><strong>${metrics.guests}</strong></div><div><small>BUILD BUDGET</small><strong>${formatEuro(run.cash)}</strong></div></div>
    <div class="section-heading facility-library-heading"><div><small>CAMPUS ASSET LIBRARY</small><strong>Designed for Nova Coast</strong></div><span>SELECT · ROTATE · PLACE</span></div>
    <div class="facility-library-note"><span>07</span><p><strong>Purpose-built campus pieces</strong>Every object has a different footprint, material language and effect on your guests.</p></div>
    <div class="build-grid facility-catalogue">${FACILITY_CATALOGUE.map(item=>facilityCard(item,progress)).join("")}</div>
    <div class="section-heading"><div><small>PLACED ASSETS</small><strong>Move, rotate or remove</strong></div><span>${run.facilities.length} on campus</span></div>
    <div class="placed-facility-list">${run.facilities.length?run.facilities.map(facility=>{const size=facilityFootprint(facility.type,facility.rotation||0),isDjDeck=facility.type==="experience"&&(facility.modules||[]).includes("music"),specialization=facilitySpecialization(facility),canSpecialize=FACILITY_SPECIALIZATIONS.some(item=>item.type===facility.type);return `<article>${facilityPreviewMarkup(facility.type)}<div><strong>${specialization?.name||facility.name}</strong><small>${specialization?`${focusDefinition(specialization.focus).name} blueprint · `:""}${size.width.toFixed(1)} × ${size.height.toFixed(1)} tiles · ${(facility.rotation||0)*90}°</small></div>${canSpecialize?`<button class="specialize" data-specialize-facility="${facility.id}">${specialization?"Refit":"Specialize"}</button>`:""}${isDjDeck?`<button class="operate" data-operate-dj="${facility.id}">Operate DJ deck</button>`:""}<button data-move-facility="${facility.id}">Move</button><button class="danger" data-demolish-facility="${facility.id}">Remove</button></article>`}).join(""):`<div class="build-empty">Place your first facility to unlock move and demolition tools.</div>`}</div>
    <div class="section-heading"><div><small>SIGNATURE ATTRACTION</small><strong>Design a beach experience</strong></div><span>Choose modules piece by piece</span></div>
    <div class="experience-builder"><div class="experience-design">${experiencePreview(selectedExperienceModules)}<div class="module-grid">${EXPERIENCE_MODULES.map(item=>`<button class="module-button ${selectedExperienceModules.includes(item.id)?"selected":""}" data-module="${item.id}"><span class="module-glyph module-${item.id}"><i></i></span><strong>${item.name}</strong><small>${formatEuro(item.cost)} · +${item.excitement} excitement</small></button>`).join("")}</div></div><div class="rating-console"><small>LIVE DESIGN RATINGS</small><div><span>Excitement <b id="designExcitement">${stats.excitement}</b></span><i><em id="designExcitementBar" style="width:${stats.excitement}%"></em></i></div><div><span>Intensity <b id="designIntensity">${stats.intensity}</b></span><i><em id="designIntensityBar" style="width:${stats.intensity}%"></em></i></div><div><span>Comfort <b id="designComfort">${stats.comfort}</b></span><i><em id="designComfortBar" style="width:${stats.comfort}%"></em></i></div><p id="designVerdict">${experienceVerdict(stats)}</p><button class="action-button orange" id="buildExperience" ${run.cash<experienceCost?"disabled":""}>Place experience · <span id="experienceCost">${formatEuro(experienceCost)}</span></button></div></div>`;
  drawer.classList.add("open");drawer.setAttribute("aria-hidden","false");
  drawerContent.querySelectorAll("[data-build]").forEach(button=>button.addEventListener("click",()=>{const item=FACILITY_CATALOGUE.find(entry=>entry.id===button.dataset.build);startBuild(item.id,item.name);}));
  drawerContent.querySelectorAll("[data-operate-dj]").forEach(button=>button.addEventListener("click",()=>openDjOperations(button.dataset.operateDj)));
  drawerContent.querySelectorAll("[data-specialize-facility]").forEach(button=>button.addEventListener("click",()=>openFacilitySpecialization(button.dataset.specializeFacility)));
  drawerContent.querySelectorAll("[data-move-facility]").forEach(button=>button.addEventListener("click",()=>{const facility=run.facilities.find(item=>item.id===button.dataset.moveFacility);if(facility)startMoveFacility(facility);}));
  drawerContent.querySelectorAll("[data-demolish-facility]").forEach(button=>button.addEventListener("click",()=>{const facility=run.facilities.find(item=>item.id===button.dataset.demolishFacility);if(facility)confirmDemolish(facility);}));
  drawerContent.querySelectorAll("[data-module]").forEach(button=>button.addEventListener("click",()=>{const id=button.dataset.module;if(selectedExperienceModules.includes(id)&&selectedExperienceModules.length>1)selectedExperienceModules=selectedExperienceModules.filter(item=>item!==id);else if(!selectedExperienceModules.includes(id))selectedExperienceModules.push(id);openBuildPanel();}));
  $("#buildExperience").addEventListener("click",()=>startBuild("experience","Custom Beach Experience",selectedExperienceModules));
}

function openFacilitySpecialization(facilityId){
  const facility=run.facilities.find(item=>item.id===facilityId);if(!facility)return openBuildPanel();const choices=FACILITY_SPECIALIZATIONS.filter(item=>item.type===facility.type),active=facilitySpecialization(facility),districtId=districtForPosition(facility.x),district=OPERATIONS_DISTRICTS.find(item=>item.id===districtId),matchingStores=STORES.filter(store=>(run.venues?.[store.id]||0)>0&&districtForStore(store.id)===districtId&&storeSpecialization(run,store.id));
  drawerContent.innerHTML=`<button class="specialization-back" id="backToBuild">← Campus assets</button><p class="eyebrow">Facility blueprint · ${district?.name||"Campus"}</p><div class="facility-specialization-hero" style="--facility:${FACILITY_CATALOGUE.find(item=>item.id===facility.type)?.color||"#64cbc8"}">${facilityPreviewMarkup(facility.type)}<div><small>${active?"ACTIVE BLUEPRINT":"STANDARD FACILITY"}</small><h2>${active?.name||facility.name}</h2><p>${active?.description||"Choose a blueprint to give this facility a distinct role and connect it to a nearby store concept."}</p></div></div>
    <div class="section-heading"><div><small>DESIGN DIRECTION</small><strong>Specialize this ${facility.name}</strong></div><span>Changes save immediately</span></div><div class="facility-specialization-grid">${choices.map(choice=>{const focus=focusDefinition(choice.focus),selected=active?.id===choice.id;return `<article class="${selected?"selected":""}" style="--focus:${focus.color}"><div class="blueprint-sketch"><i></i><b>${focus.icon}</b><span>${choice.name}</span></div><div><small>${focus.name.toUpperCase()} BLUEPRINT</small><strong>${choice.name}</strong><p>${choice.description}</p><div class="blueprint-effects">${Object.entries(choice.needs||{}).map(([key,value])=>`<span>+${value} ${NEED_LABELS[key]||key}</span>`).join("")}<span>+${choice.appeal} appeal</span></div></div><button data-facility-specialization="${choice.id}" ${selected||run.cash<choice.cost?"disabled":""}>${selected?"ACTIVE":`${active?"Refit":"Build"} · ${formatEuro(choice.cost)}`}</button></article>`}).join("")}</div>
    <div class="specialization-district-link"><span>${district?.name||"Campus"}</span><div><strong>Local concept network</strong><p>${matchingStores.length?matchingStores.map(store=>`${store.short}: ${storeSpecialization(run,store.id).name}`).join(" · "):"No specialized store operates in this district yet. Match a focus later to activate local synergy."}</p></div></div>`;
  drawer.classList.add("open");drawer.setAttribute("aria-hidden","false");drawer.scrollTop=0;$("#backToBuild").addEventListener("click",openBuildPanel);drawerContent.querySelectorAll("[data-facility-specialization]").forEach(button=>button.addEventListener("click",()=>{try{const choice=FACILITY_SPECIALIZATIONS.find(item=>item.id===button.dataset.facilitySpecialization);save(setFacilitySpecialization(run,facilityId,choice.id));toast(`${choice.name} blueprint applied`);beep(720);openFacilitySpecialization(facilityId);}catch(error){toast(error.message,true);beep(180);}}));
}

function experienceVerdict(stats){if(stats.intensity>78)return "Too intense — most students will avoid it.";if(stats.excitement<24)return "Too gentle — add a stronger headline module.";if(stats.comfort<35)return "Exciting, but comfort is hurting its appeal.";if(stats.excitement>65&&stats.intensity<70)return "Flagship potential — exciting without becoming punishing.";return "Balanced campus attraction with broad appeal.";}

function openGuestPanel() {
  activeLocation=null;const metrics=campusMetrics(run),progress=progressionState(run),needLabels={hunger:"Hunger",thirst:"Thirst",bladder:"Bladder",energy:"Energy",mood:"Happiness",cleanliness:"Cleanliness"},live=guestAgents.length,walking=guestAgents.filter(guest=>guest.state==="walking"||guest.state==="leaving").length,queueing=guestAgents.filter(guest=>guest.state==="queueing").length,using=guestAgents.filter(guest=>guest.state==="using").length,hotspots=guestHotspots(),averageBudget=live?guestAgents.reduce((sum,guest)=>sum+guest.budget,0)/live:0,averagePatience=live?guestAgents.reduce((sum,guest)=>sum+guest.queuePatience,0)/live:0;
  const weakest=Object.entries(metrics.needs).sort((a,b)=>a[1]-b[1])[0];
  drawerContent.innerHTML=`<p class="eyebrow">Guest intelligence · decision simulation</p><h2>Students with real priorities</h2><p class="drawer-intro">Every guest weighs urgent needs, remaining cash, prices, queue time, campus quality and personal preferences before choosing a destination.</p>
    <div class="guest-hero decision-hero"><div><small>LIVE GUESTS</small><strong>${live}</strong><em>${walking} currently deciding</em></div><div><small>AVERAGE BUDGET</small><strong>${formatEuro(averageBudget)}</strong><em>cash left per guest</em></div><div><small>QUEUE PATIENCE</small><strong>${Math.round(averagePatience)}%</strong><em>${queueing} waiting right now</em></div><div><small>WALKAWAYS</small><strong>${run.guestEconomy?.walkaways||0}</strong><em>${run.guestEconomy?.purchases||0} completed shop purchases</em></div></div>
    <div class="section-heading"><div><small>LIVE ACTIVITY</small><strong>Where guests are right now</strong></div><span>Updates as they move</span></div>
    <div class="guest-hotspots">${hotspots.length?hotspots.map(item=>`<div><span>${GUEST_ICONS[item.type||item.id]||"·"}</span><strong>${item.label}</strong><small>${item.live} live · ${item.visits} visits</small></div>`).join(""):`<div class="build-empty">Students are arriving and choosing their first destinations.</div>`}</div>
    <div class="section-heading"><div><small>INDIVIDUAL GUESTS</small><strong>Follow a student journey</strong></div><span>Click a guest in the world</span></div>
    <div class="guest-roster">${guestAgents.slice(0,8).map(guest=>`<button data-guest-id="${guest.id}"><i style="--guest:${guest.color}"></i><span><strong>${guest.name}</strong><small>${guest.activity}</small></span><em>${formatEuro(guest.budget)} · ${Math.round(100-guest.needs.mood)}% happy</em></button>`).join("")||`<div class="build-empty">The next wave is entering campus.</div>`}</div>
    <div class="section-heading"><div><small>GUEST NEEDS</small><strong>What students are feeling</strong></div><span>Updated instantly</span></div>
    <div class="needs-grid">${Object.entries(metrics.needs).map(([key,value])=>`<div><span>${needLabels[key]} <b>${value}%</b></span><i><em style="width:${value}%"></em></i></div>`).join("")}</div>
    <div class="guest-thought"><span>☺</span><div><small>LATEST GUEST THOUGHT</small><strong>“${guestThought(metrics,needLabels)}”</strong></div></div>
    <div class="section-heading"><div><small>OPERATIONS TEAM</small><strong>Staff now work real shifts</strong></div><span>${operationsSnapshot(run).onShift} on duty</span></div>
    <button class="operations-link" id="openOperations"><span>⚙</span><div><strong>Open staff &amp; maintenance operations</strong><small>Assign districts, schedule shifts, monitor litter, repairs and payroll.</small></div><em>${operationsSnapshot(run).openIssues} open issues</em></button>
    <div class="section-heading"><div><small>BEST ATTRACTION</small><strong>Excitement ${metrics.attraction.excitement} · Intensity ${metrics.attraction.intensity} · Comfort ${metrics.attraction.comfort}</strong></div></div>`;
  drawer.classList.add("open");drawer.setAttribute("aria-hidden","false");
  drawerContent.querySelectorAll("[data-guest-id]").forEach(button=>button.addEventListener("click",()=>{const guest=guestAgents.find(item=>item.id===Number(button.dataset.guestId));if(guest)openGuestProfile(guest);}));
  $("#openOperations").addEventListener("click",openOperationsPanel);
}

const STAFF_NAMES=["Marta","Diogo","Rita","João","Sara","Nuno","Lia","Miguel","Catarina","André","Eva","Tomé"];
function workerDisplayName(worker,index){return `${STAFF_NAMES[index%STAFF_NAMES.length]} ${String(index+1).padStart(2,"0")}`;}
function operationsTargetLabel(issue){if(!issue)return "District patrol";return issue.type==="litter"?"Cleaning litter":`Repairing ${issue.label}`;}
function openOperationsPanel(){
  activeLocation=null;migrateStaffOperations(run);const summary=operationsSnapshot(run),progress=progressionState(run),unlockedDistricts=OPERATIONS_DISTRICTS.filter(district=>run.districts?.[district.id]);
  const issueRows=(run.operations?.issues||[]).map(issue=>{const district=OPERATIONS_DISTRICTS.find(item=>item.id===issue.districtId),responder=issue.type==="litter"?"caretaker":"technician",assigned=activeStaffCount(run,responder,issue.districtId),percent=Math.round((issue.progress||0)/(issue.required||1)*100);return `<article class="ops-issue ${issue.type}" data-ops-issue="${issue.id}"><span>${issue.type==="litter"?"⌁":"⚙"}</span><div><small>${district?.name||issue.districtId} · ${assigned?`${assigned} responding`:"unassigned"}</small><strong>${issue.type==="litter"?"Litter spill":`${issue.label} closed`}</strong><i><em style="width:${percent}%"></em></i></div><b>${percent}%</b></article>`;}).join("");
  const roster=(run.staffRoster||[]).map((worker,index)=>{const role=STAFF_CATALOGUE.find(item=>item.id===worker.roleId),shift=STAFF_SHIFTS.find(item=>item.id===worker.shiftId),issue=assignedIssue(worker),onShift=staffIsOnShift(worker,run.clockMinutes)&&!run.operations.payrollDue,status=run.operations.payrollDue?"PAYROLL HOLD":onShift?(issue?"RESPONDING":"ON PATROL"):"OFF SHIFT";return `<article class="worker-card" style="--staff:${role?.color||"#bce65f"}"><div class="worker-avatar"><span>${role?.icon||"·"}</span><i></i></div><div class="worker-identity"><small>${role?.name||worker.roleId}</small><strong>${workerDisplayName(worker,index)}</strong><em class="${onShift?"active":""}">${status} · ${operationsTargetLabel(issue)}</em></div><div class="worker-controls"><label>District<select data-worker-district="${worker.id}">${unlockedDistricts.map(district=>`<option value="${district.id}" ${district.id===worker.districtId?"selected":""}>${district.name}</option>`).join("")}</select></label><label>Shift<select data-worker-shift="${worker.id}">${STAFF_SHIFTS.map(item=>`<option value="${item.id}" ${item.id===worker.shiftId?"selected":""}>${item.name} · ${item.label}</option>`).join("")}</select></label></div><div class="worker-wage"><small>DAILY WAGE</small><strong>${formatEuro(staffDailyWage(worker))}</strong></div></article>`;}).join("");
  drawerContent.innerHTML=`<p class="eyebrow">Campus operations · day ${run.currentDay}</p><div class="ops-title"><div><h2>Staff, care &amp; maintenance</h2><p>Workers only affect the district and hours you assign. Litter lowers cleanliness; failures close stores and amenities until a technician completes the repair.</p></div><span id="operationsClock">${formatClock(run.clockMinutes)}<small>LIVE SHIFT CLOCK</small></span></div>
    ${summary.payrollDue?`<div class="payroll-alert"><span>!</span><div><strong>Payroll is overdue</strong><small>All staff are off duty until ${formatEuro(summary.payrollDue)} is paid.</small></div><button id="settlePayroll" ${run.cash<=0?"disabled":""}>Pay now</button></div>`:""}
    <div class="ops-kpis"><div><small>ON DUTY</small><strong>${summary.onShift}</strong><em>${run.staffRoster.length} employed</em></div><div><small>OPEN ISSUES</small><strong>${summary.openIssues}</strong><em>${summary.closedAssets} closures</em></div><div><small>DAILY PAYROLL</small><strong>${formatEuro(summary.payroll)}</strong><em>charged at 19:30</em></div><div><small>JOBS COMPLETED</small><strong>${run.operations?.totalIssuesResolved||0}</strong><em>${run.today?.issuesResolved||0} today</em></div></div>
    <div class="section-heading"><div><small>DISTRICT COVERAGE</small><strong>Where the team is working</strong></div><span>Live cleanliness and incidents</span></div><div class="district-ops-grid">${summary.districts.map(district=>`<article style="--district:${district.color}"><span>${district.cleanliness}%</span><div><strong>${district.name}</strong><small>${district.onShift} on duty · ${district.issues} issues</small><i><em style="width:${district.cleanliness}%"></em></i></div></article>`).join("")}</div>
    <div class="section-heading"><div><small>LIVE WORK ORDERS</small><strong>Campus response queue</strong></div><span>${summary.openIssues?"Resolved automatically by assigned staff":"Campus clear"}</span></div><div class="ops-issue-list">${issueRows||`<div class="ops-empty"><span>✓</span><div><strong>No open work orders</strong><small>The campus is clean and every asset is operational.</small></div></div>`}</div>
    <div class="section-heading"><div><small>TEAM ROSTER</small><strong>Assign every employee</strong></div><span>Changes save immediately</span></div><div class="worker-roster">${roster||`<div class="ops-empty"><span>＋</span><div><strong>No employees yet</strong><small>Hire a specialist below when the role unlocks.</small></div></div>`}</div>
    <div class="section-heading"><div><small>RECRUITMENT</small><strong>Expand the operations team</strong></div><span>Fee now · wage each day</span></div><div class="staff-hire-grid">${STAFF_CATALOGUE.map(role=>{const locked=progress.level<(role.level||1);return `<article style="--staff:${role.color}" class="${locked?"locked":""}"><span>${locked?"⌁":role.icon}</span><div><small>${locked?`LEVEL ${role.level} REQUIRED`:`${formatEuro(role.wage)} full-day wage`}</small><strong>${role.name}</strong><p>${role.description}</p></div><button data-hire="${role.id}" ${locked||run.cash<role.cost?"disabled":""}>${locked?"Locked":`Recruit · ${formatEuro(role.cost)}`}</button></article>`}).join("")}</div>`;
  drawer.classList.add("open");drawer.setAttribute("aria-hidden","false");
  drawerContent.querySelectorAll("[data-worker-district]").forEach(select=>select.addEventListener("change",()=>{try{save(assignStaff(run,select.dataset.workerDistrict,select.value));toast("District assignment saved");openOperationsPanel();}catch(error){toast(error.message,true);}}));
  drawerContent.querySelectorAll("[data-worker-shift]").forEach(select=>select.addEventListener("change",()=>{try{save(setStaffShift(run,select.dataset.workerShift,select.value));toast("Shift saved immediately");openOperationsPanel();}catch(error){toast(error.message,true);}}));
  drawerContent.querySelectorAll("[data-hire]").forEach(button=>button.addEventListener("click",()=>{try{save(hireStaff(run,button.dataset.hire));toast("Employee recruited · assign their district and shift");beep(630);openOperationsPanel();}catch(error){toast(error.message,true);}}));
  if($("#settlePayroll"))$("#settlePayroll").addEventListener("click",()=>{const before=run.operations.payrollDue;save(settlePayroll(run));const paid=before-run.operations.payrollDue;toast(`${formatEuro(paid)} paid${run.operations.payrollDue?" · balance remains":" · team back on duty"}`);openOperationsPanel();});
}

function refreshOperationsPanelLive(){const clock=$("#operationsClock");if(!clock)return;clock.childNodes[0].nodeValue=formatClock(run.clockMinutes);const cards=[...drawerContent.querySelectorAll("[data-ops-issue]")],issues=run.operations?.issues||[];if(cards.length!==issues.length||cards.some(card=>!issues.some(issue=>issue.id===card.dataset.opsIssue))){const scroll=drawer.scrollTop;openOperationsPanel();drawer.scrollTop=scroll;return;}for(const card of cards){const issue=issues.find(item=>item.id===card.dataset.opsIssue),percent=Math.round((issue.progress||0)/(issue.required||1)*100);card.querySelector("i em").style.width=`${percent}%`;card.querySelector("b").textContent=`${percent}%`;}}

function activityName(kind,id){if(kind==="store")return STORES.find(item=>item.id===id)?.name||id;const facility=(run.facilities||[]).find(item=>item.id===id);if(facility)return facility.name;return id==="academy"?"Academic Wing":id==="hub"?"Student Hub":id==="forum"?"Sunset Forum":id==="pavilion"?"Coastline Pavilion":id;}
function guestHotspots(){const rows=new Map();for(const guest of guestAgents.filter(item=>item.target&&item.target.kind!=="exit")){const key=`${guest.target.kind}:${guest.target.id}`,row=rows.get(key)||{...guest.target,live:0,visits:run.today?.activities?.[key]||0};row.live+=1;rows.set(key,row);}for(const [key,visits] of Object.entries(run.today?.activities||{})){if(rows.has(key))continue;const split=key.indexOf(":"),kind=key.slice(0,split),id=key.slice(split+1),facility=(run.facilities||[]).find(item=>item.id===id);rows.set(key,{kind,id,type:facility?.type,label:activityName(kind,id),live:0,visits});}return [...rows.values()].sort((a,b)=>b.live-a.live||b.visits-a.visits).slice(0,6);}
function openGuestProfile(guest){
  const labels={hunger:"Hunger",thirst:"Thirst",bladder:"Bladder",energy:"Energy",mood:"Happiness"},preferenceChips=guestPrimaryPreferences(guest).map(label=>`<span>${label}</span>`).join(""),needRows=Object.entries(guest.needs).map(([key,raw])=>{const value=key==="mood"?100-raw:raw;return `<div><span>${labels[key]} <b>${Math.round(value)}%</b></span><i><em style="width:${value}%"></em></i></div>`}).join(""),decision=guest.lastDecision||{label:"Exploring campus",score:0,reason:"still evaluating the available options"};
  drawerContent.innerHTML=`<p class="eyebrow">Live guest · #${String(guest.id).padStart(3,"0")}</p><div class="guest-profile-head"><i style="--guest:${guest.color}"></i><div><h2>${guest.name}</h2><p>${guest.activity}</p></div><span>${guest.visits} visits</span></div><div class="guest-quote">“${guest.thought}”</div>
    <div class="guest-traits"><div><small>BUDGET LEFT</small><strong>${formatEuro(guest.budget)}</strong><em>${formatEuro(guest.spent)} spent</em></div><div><small>QUEUE PATIENCE</small><strong>${guest.queuePatience}%</strong><em>walks away after ${Math.round(guest.maxWait||1.3+guest.queuePatience*.055)} min</em></div><div><small>PREFERENCES</small><strong>${preferenceChips}</strong><em>ideal intensity ${Math.round(guest.preferences.intensity)}</em></div></div>
    <div class="section-heading"><div><small>PERSONAL NEEDS</small><strong>What creates urgency</strong></div></div><div class="needs-grid">${needRows}</div>
    <div class="decision-card"><small>LATEST DECISION</small><div><strong>${decision.label}</strong><span>${decision.score} fit</span></div><p>${decision.reason}</p></div>
    <div class="guest-journey"><small>CURRENT JOURNEY</small><strong>${guest.target?.label||"Exploring campus"}</strong><p>${guest.state==="queueing"?`Waiting ${Math.round(guest.waited||0)} min; patience limit ${Math.round(guest.maxWait||0)} min.`:guest.state==="using"?"The destination delivered enough value to earn this visit.":guest.state==="leaving"?"Leaving after needs, budget and patience were re-evaluated.":"This scored highest after price, queue, quality, urgency and preference checks."}</p></div><button class="action-button secondary" id="backToGuests">Back to all guests</button>`;drawer.classList.add("open");drawer.setAttribute("aria-hidden","false");$("#backToGuests").addEventListener("click",openGuestPanel);
}

function guestThought(metrics,labels){const weakest=Object.entries(metrics.needs).sort((a,b)=>a[1]-b[1])[0];if(metrics.attraction.intensity>78)return "That attraction looks much too intense for me.";if(weakest[1]<50)return `I wish there were better ${labels[weakest[0]].toLowerCase()} facilities.`;if(metrics.attraction.excitement<20)return "The campus is pleasant, but it needs a headline experience.";return "There is plenty to do here and the campus feels cared for.";}

function productPriceCard(product) {
  const price=run.prices[product.id], demand=demandFor(price,product.reference), level=run.venues?.[product.storeId]??0,locked=level<(product.tier||1);
  return `<article class="product-card ${locked?"locked":""}" style="--product-color:${product.color}">
    <div class="product-head"><div class="product-icon">${product.icon}</div><div><h3>${product.name}</h3><p>${run.stock[product.id]} in stock · ref. ${formatEuro(product.reference)}</p></div><span class="stock-pill">Cost ${formatEuro(product.cost)}</span></div>
    <div class="price-row"><div class="price-wrap"><span>€</span><input class="price-input" data-id="${product.id}" id="price-${product.id}" inputmode="decimal" value="${(price/100).toFixed(2)}" aria-label="Selling price for ${product.name}" ${locked?"disabled":""}></div><button class="action-button set-price" data-id="${product.id}" ${locked ? "disabled" : ""}>${locked?(level===0?"Venue closed":`Level ${product.tier}`):"Set price"}</button></div>
    <div class="price-note"><span>Potential margin ${formatEuro(price-product.cost)} / unit</span><span class="demand-badge" id="demand-${product.id}">${locked?"Locked":`${demand} base interest`}</span></div>
  </article>`;
}

function updateDemandPreview(id) {
  const product=CATALOGUE.find(p=>p.id===id), badge=$(`#demand-${id}`);
  try { badge.textContent=`${demandFor(parseEuro($(`#price-${id}`).value),product.reference)} base interest`; }
  catch (_) { badge.textContent="Enter a valid price"; }
}

function commitPrice(id) {
  try { const cents=parseEuro($(`#price-${id}`).value); save(setPrice(run,id,cents)); toast("Price saved immediately"); beep(440); }
  catch(error){ toast(error.message,true); openStore(CATALOGUE.find(product=>product.id===id)?.storeId || "cafe"); beep(180); }
}

function openTimePanel(){
  activeLocation=null;const phase=campusPhase(run.clockMinutes),dayProgress=Math.max(0,Math.min(100,(run.clockMinutes-DAY_START)/(DAY_END-DAY_START)*100)),pending=(run.deliveries||[]).filter(item=>item.status==="scheduled").sort((a,b)=>a.arrivalDay-b.arrivalDay||a.arrivalMinute-b.arrivalMinute),deliveredToday=run.today?.deliveries||[];
  drawerContent.innerHTML=`<p class="eyebrow">Living campus · day ${run.currentDay}</p><div class="time-panel-title"><div><small>CURRENT CAMPUS RHYTHM</small><h2 id="livePhaseTitle">${formatClock(run.clockMinutes)} · ${phase.name}</h2><p id="livePhaseDescription">${phase.description}</p></div><span id="liveFootfall" style="--phase:${phase.color}">${phase.multiplier.toFixed(2)}×<small>FOOTFALL</small></span></div>
    <div class="day-track"><i id="liveDayFill" style="width:${dayProgress}%"></i><b id="liveDayMarker" style="left:${dayProgress}%"></b>${CAMPUS_DAY_PHASES.map(item=>`<span style="width:${(item.end-item.start)/(DAY_END-DAY_START)*100}%;--phase:${item.color}"></span>`).join("")}</div>
    <div class="section-heading"><div><small>CAMPUS TIMETABLE</small><strong>A day with distinct trading windows</strong></div><span>07:30 — 19:30</span></div>
    <div class="campus-phase-grid">${CAMPUS_DAY_PHASES.map(item=>`<article data-campus-phase="${item.id}" class="${item.id===phase.id?"active":""}" style="--phase:${item.color}"><span>${formatClock(item.start)}</span><div><strong>${item.name}</strong><p>${item.description}</p></div><em>${item.multiplier.toFixed(2)}×</em></article>`).join("")}</div>
    <div class="section-heading"><div><small>STORE OPERATIONS</small><strong>Opening hours control live sales</strong></div><span>Closed shops disappear from guest choices</span></div>
    <div class="hours-overview">${STORES.map(store=>{const hours=run.storeHours?.[store.id]||DEFAULT_STORE_HOURS[store.id],opened=storeIsOpen(run,store.id),unlocked=(run.venues?.[store.id]||0)>0;return `<button data-time-store="${store.id}" class="${opened?"open":"closed"} ${!unlocked?"locked":""}" style="--store:${store.color}"><span>${store.icon}</span><div><strong>${store.short}</strong><small>${unlocked?`${formatClock(hours.open)} — ${formatClock(hours.close)}`:"NOT BUILT"}</small></div><em>${!unlocked?"LOCKED":opened?"OPEN":"CLOSED"}</em></button>`}).join("")}</div>
    <div class="section-heading"><div><small>LOGISTICS BOARD</small><strong>Scheduled campus deliveries</strong></div><span>${deliveredToday.length} arrived today</span></div>
    <div class="delivery-slots">${DELIVERY_WINDOWS.map(slot=>`<div data-delivery-minute="${slot.minute}" class="${run.clockMinutes+5>=slot.minute?"passed":""}"><span>${formatClock(slot.minute)}</span><strong>${slot.label}</strong><small>${run.clockMinutes>=slot.minute?"departed":run.clockMinutes+5>=slot.minute?"cutoff passed":"accepting orders"}</small></div>`).join("")}</div>
    <div class="delivery-manifest">${pending.length?pending.slice(0,8).map(item=>{const product=CATALOGUE.find(entry=>entry.id===item.productId);return `<div><span>▣</span><div><strong>${item.quantity}× ${product?.short||item.productId}</strong><small>${item.arrivalDay===run.currentDay?"Today":`Day ${item.arrivalDay}`} · ${formatClock(item.arrivalMinute)} · ${item.label}</small></div><em>${formatEuro(item.total)}</em></div>`}).join(""):`<div class="empty-state compact"><span>✓</span>No stock is waiting in the logistics queue.</div>`}</div>
    <button class="action-button secondary" id="openSupplierFromTime">Order inventory for the next delivery</button>`;
  drawer.classList.add("open");drawer.setAttribute("aria-hidden","false");drawer.scrollTop=0;
  drawerContent.querySelectorAll("[data-time-store]").forEach(button=>button.addEventListener("click",()=>openStore(button.dataset.timeStore)));
  $("#openSupplierFromTime").addEventListener("click",()=>openSupplier(currentSupplierStore||"cafe"));
}

function refreshTimePanelLive(){
  if(!$("#livePhaseTitle"))return;const phase=campusPhase(run.clockMinutes),progress=Math.max(0,Math.min(100,(run.clockMinutes-DAY_START)/(DAY_END-DAY_START)*100));
  $("#livePhaseTitle").textContent=`${formatClock(run.clockMinutes)} · ${phase.name}`;$("#livePhaseDescription").textContent=phase.description;$("#liveFootfall").childNodes[0].nodeValue=`${phase.multiplier.toFixed(2)}×`;$("#liveFootfall").style.setProperty("--phase",phase.color);$("#liveDayFill").style.width=`${progress}%`;$("#liveDayMarker").style.left=`${progress}%`;
  drawerContent.querySelectorAll("[data-campus-phase]").forEach(card=>card.classList.toggle("active",card.dataset.campusPhase===phase.id));
  drawerContent.querySelectorAll("[data-time-store]").forEach(button=>{if(button.classList.contains("locked"))return;const opened=storeIsOpen(run,button.dataset.timeStore);button.classList.toggle("open",opened);button.classList.toggle("closed",!opened);button.querySelector("em").textContent=opened?"OPEN":"CLOSED";});
  drawerContent.querySelectorAll("[data-delivery-minute]").forEach(card=>{const minute=Number(card.dataset.deliveryMinute),passed=run.clockMinutes+5>=minute;card.classList.toggle("passed",passed);card.querySelector("small").textContent=run.clockMinutes>=minute?"departed":passed?"cutoff passed":"accepting orders";});
}

function refreshStoreHoursPanelLive(){
  const card=$("#currentStoreHours");if(!card)return;const storeId=card.dataset.storeId,hours=run.storeHours?.[storeId]||DEFAULT_STORE_HOURS[storeId],opened=storeIsOpen(run,storeId);card.classList.toggle("open",opened);card.classList.toggle("closed",!opened);$("#currentStoreState").textContent=opened?"OPEN NOW":"CLOSED";$("#currentStoreCountdown").textContent=opened?`${formatDuration(hours.close-run.clockMinutes)} remaining`:run.clockMinutes<hours.open?`Opens in ${formatDuration(hours.open-run.clockMinutes)}`:"Closed for today";
}

function openPulsePanel(){
  activeLocation=null;const pulse=tycoonPulse(run),performance=run.performance||{},last=performance.lastDay,trends=(run.history||[]).slice(-7),maxVisitors=Math.max(1,...trends.map(day=>day.campus?.guests||0));
  const scoreRow=(label,value,color)=>`<div class="pulse-score-row"><span>${label}<b>${value}</b></span><i><em style="width:${value}%;--score-color:${color}"></em></i></div>`;
  const trend=trends.length?`<div class="pulse-trend">${trends.map(day=>{const profit=day.totals?.operatingProfit||0,height=Math.max(12,Math.round((day.campus?.guests||0)/maxVisitors*100));return `<div title="Day ${day.day}: ${day.campus?.guests||0} visitors · ${formatEuro(profit)}"><i style="height:${height}%" class="${profit<0?"loss":""}"></i><span>D${day.day}</span></div>`;}).join("")}</div>`:`<div class="pulse-empty">Complete the first campus day to begin the seven-day trend.</div>`;
  const drivers=last?.drivers?.map(driver=>`<div class="momentum-driver ${driver.impact<0?"negative":"positive"}"><span>${driver.impact>0?"+":""}${driver.impact}</span><strong>${driver.label}</strong></div>`).join("")||`<div class="pulse-empty">Your first closing report will explain what moves attendance momentum.</div>`;
  const costRows=[...pulse.costs.stores.map(item=>({label:`${item.label} · level ${item.level}`,cost:item.cost})),...pulse.costs.districts.map(item=>({label:`${item.label} upkeep`,cost:item.cost}))];
  drawerContent.innerHTML=`<p class="eyebrow">Tycoon control room · connected systems</p><div class="pulse-command-hero" data-state="${pulse.status.toLowerCase().replace(/\s+/g,"-")}"><div class="pulse-dial" style="--pulse-score:${pulse.score*3.6}deg"><span>${pulse.score}</span><small>/100</small></div><div><small>CAMPUS OUTLOOK</small><h2>${pulse.status}</h2><p>${pulse.momentum} momentum is driving ${(pulse.momentumFactor*100).toFixed(0)}% of baseline attendance. Every operational choice now feeds tomorrow’s crowd.</p></div></div>
    <div class="pulse-score-grid">${scoreRow("Guest experience",pulse.guestScore,"#64cbc8")}${scoreRow("Operations",pulse.operationsScore,"#f5c95e")}${scoreRow("Commercial health",pulse.commercialScore,"#bce65f")}</div>
    <div class="pulse-loop"><div><span>01</span><strong>Campus quality</strong><small>rating · facilities · events</small></div><b>→</b><div><span>02</span><strong>${pulse.projectedGuests} expected guests</strong><small>${pulse.momentum} momentum</small></div><b>→</b><div><span>03</span><strong>Sales &amp; pressure</strong><small>queues · litter · wear</small></div><b>→</b><div><span>04</span><strong>Reinvest</strong><small>staff · stock · upgrades</small></div></div>
    <div class="section-heading"><div><small>MANAGEMENT PRIORITIES</small><strong>What is shaping the business now</strong></div><span>${pulse.alerts.length} live signals</span></div><div class="pulse-alerts">${pulse.alerts.map(alert=>`<button class="pulse-alert ${alert.severity}" data-pulse-action="${alert.action}"><span>${alert.severity==="good"?"✓":alert.severity==="critical"?"!":"→"}</span><div><strong>${alert.title}</strong><small>${alert.detail}</small></div><em>OPEN</em></button>`).join("")}</div>
    <div class="pulse-columns"><section><div class="section-heading compact"><div><small>DAILY COST BASE</small><strong>${formatEuro(pulse.costs.total)} due at 19:30</strong></div></div><div class="pulse-cost-list">${costRows.map(item=>`<div><span>${item.label}</span><strong>${formatEuro(item.cost)}</strong></div>`).join("")}</div>${performance.operatingDue?`<div class="pulse-debt"><span>OVERDUE</span><strong>${formatEuro(performance.operatingDue)}</strong><button id="settleOperatingCosts" ${run.cash<=0?"disabled":""}>Pay campus bills</button></div>`:""}</section><section><div class="section-heading compact"><div><small>SEVEN-DAY TRAFFIC</small><strong>Visitors and profit</strong></div></div>${trend}</section></div>
    <div class="section-heading"><div><small>LAST CLOSING SIGNALS</small><strong>${last?`Momentum ${last.before} → ${last.after}`:"Momentum starts at 50"}</strong></div><span>${last?`${last.change>=0?"+":""}${last.change} last day`:"First day in progress"}</span></div><div class="momentum-drivers">${drivers}</div>`;
  drawer.classList.add("open");drawer.setAttribute("aria-hidden","false");
  drawerContent.querySelectorAll("[data-pulse-action]").forEach(button=>button.addEventListener("click",()=>openPulseAction(button.dataset.pulseAction)));
  if($("#settleOperatingCosts"))$("#settleOperatingCosts").addEventListener("click",()=>{const before=run.performance.operatingDue;save(settleOperatingCosts(run));toast(`${formatEuro(before-run.performance.operatingDue)} in campus bills paid`);openPulsePanel();});
}

function openPulseAction(action){const panelAction=action==="finance"?"ledger":action==="stock"?"buy":action==="progress"?"progress":action;markManagementPanel(panelAction);if(action==="operations")openOperationsPanel();else if(action==="finance")openLedger();else if(action==="stock")openLocation("supplier");else if(action==="stores")openPortfolio();else if(action==="build")openBuildPanel();else openProgressPanel();drawer.classList.add("open");drawer.setAttribute("aria-hidden","false");}

function openLedger() {
  const gain=overallResult(run), inv=inventoryValue(run),operations=operationsSnapshot(run),pulse=tycoonPulse(run);
  const venueResults=STORES.map(store=>{const ids=new Set(CATALOGUE.filter(p=>p.storeId===store.id).map(p=>p.id));const items=run.history.flatMap(day=>day.items).filter(item=>ids.has(item.productId));return {store,units:items.reduce((s,i)=>s+i.unitsSold,0),revenue:items.reduce((s,i)=>s+i.revenue,0),profit:items.reduce((s,i)=>s+i.grossProfit,0)}});
  const djEvents=(run.eventHistory||[]).filter(item=>item.eventId==="dj-event"),djRevenue=djEvents.reduce((sum,item)=>sum+(item.revenue||0),0),djProfit=djEvents.reduce((sum,item)=>sum+(item.grossProfit||0),0),pendingDeliveries=(run.deliveries||[]).filter(item=>item.status==="scheduled"),deliveredCount=(run.deliveries||[]).filter(item=>item.status==="delivered").length;
  drawerContent.innerHTML=`<p class="eyebrow">Live company finance · autosaved</p><h2>Portfolio performance</h2><p class="drawer-intro">The business runs continuously. Compare shops, inspect closed days, and decide where to reinvest.</p>
    <div class="report-grid"><div><small>CASH</small><strong>${formatEuro(run.cash)}</strong></div><div><small>STOCK VALUE</small><strong>${formatEuro(inv)}</strong></div><div><small>NET WORTH CHANGE</small><strong class="${gain>=0?"result-positive":"result-negative"}">${formatEuro(gain)}</strong></div><div><small>TOTAL VISITORS</small><strong>${run.totalVisitors||0}</strong></div></div>
    <div class="ledger-rhythm integration-ledger"><div><small>TYCOON MOMENTUM</small><strong>${pulse.momentum} · ${pulse.status}</strong><span>${pulse.projectedGuests} expected guests · ${pulse.stockCoverage}% stocked</span></div><div><small>FIXED OPERATIONS</small><strong>${formatEuro(pulse.costs.total)} / day</strong><span>${run.performance?.operatingDue?`${formatEuro(run.performance.operatingDue)} overdue`:"venue and district costs current"}</span></div><button id="ledgerPulse">Open control room</button></div>
    <div class="ledger-rhythm operations-ledger"><div><small>OPERATIONS PAYROLL</small><strong>${formatEuro(run.operations?.totalWagesPaid||0)} paid</strong><span>${operations.payrollDue?`${formatEuro(operations.payrollDue)} overdue`:`${formatEuro(operations.payroll)} next close`}</span></div><div><small>MAINTENANCE</small><strong>${run.operations?.totalIssuesResolved||0} jobs complete</strong><span>${operations.openIssues} open · ${operations.closedAssets} closed assets</span></div><button id="ledgerOperations">Open operations</button></div>
    <div class="ledger-rhythm"><div><small>CURRENT WINDOW</small><strong>${campusPhase(run.clockMinutes).name}</strong><span>${campusPhase(run.clockMinutes).multiplier.toFixed(2)}× footfall</span></div><div><small>LOGISTICS</small><strong>${pendingDeliveries.length} pending</strong><span>${deliveredCount} deliveries completed</span></div><button id="ledgerSchedule">View campus schedule</button></div>
    <div class="section-heading"><div><small>VENUE COMPARISON</small><strong>All-time trading performance</strong></div><span>Day ${run.currentDay} · ${formatClock(run.clockMinutes)}</span></div>
    <div class="venue-kpis">${venueResults.map(v=>`<div style="border-top:3px solid ${v.store.color}"><small>${v.store.short.toUpperCase()}</small><strong>${formatEuro(v.profit)}</strong><span>${v.units} sold · ${formatEuro(v.revenue)} revenue</span></div>`).join("")}</div>
    ${djEvents.length?`<div class="section-heading"><div><small>ATTRACTION OPERATIONS</small><strong>Atlantic Sessions</strong></div><span>${djEvents.length} completed events</span></div><div class="venue-kpis"><div style="border-top:3px solid #64cbc8"><small>TICKET REVENUE</small><strong>${formatEuro(djRevenue)}</strong><span>${run.djOperations?.lifetimeAttendance||0} lifetime attendees</span></div><div style="border-top:3px solid #bce65f"><small>EVENT PROFIT</small><strong>${formatEuro(djProfit)}</strong><span>after operating costs</span></div><div style="border-top:3px solid #f5c95e"><small>AVERAGE CROWD</small><strong>${Math.round(djEvents.reduce((sum,item)=>sum+(item.attendance||0),0)/djEvents.length)}</strong><span>guests per set</span></div></div>`:""}
    <div class="section-heading"><div><small>DAILY LEDGER</small><strong>Closed trading days</strong></div><span>Latest 60 saved</span></div>
    <div class="history-list">${run.history.length?run.history.map(historyCard).reverse().join(""):`<div class="empty-state"><span>▤</span>The first day is still running.<br>Sales appear here automatically at 19:30.</div>`}</div>`;
  $("#ledgerSchedule").addEventListener("click",openTimePanel);$("#ledgerOperations").addEventListener("click",openOperationsPanel);$("#ledgerPulse").addEventListener("click",openPulsePanel);
}

function historyCard(day) {
  const interactions=Object.values(day.campus?.activities||{}).reduce((sum,value)=>sum+value,0),eventRevenue=day.totals.eventRevenue||0,eventCosts=day.totals.eventCosts||0,profit=day.totals.operatingProfit??day.totals.grossProfit??0,wages=day.totals.staffWages||0,overhead=day.totals.operatingCosts||0;
  const rows=day.items.filter(item=>item.unitsSold>0).map(item=>{const p=CATALOGUE.find(x=>x.id===item.productId);return `<tr><td>${p.short}</td><td>${item.unitsSold}</td><td>${formatEuro(item.revenue)}</td><td>${formatEuro(item.cogs)}</td><td>${formatEuro(item.grossProfit)}</td></tr>`}).join("")+`${eventRevenue||eventCosts?`<tr><td>DJ event</td><td>${day.totals.eventAttendance||0}</td><td>${formatEuro(eventRevenue)}</td><td>${formatEuro(eventCosts)}</td><td>${formatEuro(eventRevenue-eventCosts)}</td></tr>`:""}${wages?`<tr><td>Staff payroll</td><td>—</td><td>—</td><td>${formatEuro(wages)}</td><td>−${formatEuro(wages)}</td></tr>`:""}${overhead?`<tr><td>Venue & district operations</td><td>—</td><td>—</td><td>${formatEuro(overhead)}</td><td>−${formatEuro(overhead)}</td></tr>`:""}`;
  return `<details class="history-day"><summary><strong>Day ${day.day}</strong><span class="${profit<0?"negative":""}">${profit>=0?"+":"−"}${formatEuro(Math.abs(profit))}</span></summary><div class="history-detail">${day.campus?`<div class="history-campus">${day.campus.guests} visitors · ${day.campus.rating}% rating · ${day.campus.satisfaction}% satisfied · ${day.campus.stockCoverage??"—"}% stocked${day.performance?` · momentum ${day.performance.before}→${day.performance.after}`:""}${interactions?` · ${interactions} campus uses`:""}${day.totals.deliveredUnits?` · ${day.totals.deliveredUnits} units delivered`:""}${day.totals.issuesResolved?` · ${day.totals.issuesResolved} work orders closed`:""}</div>`:""}<table class="mini-table"><thead><tr><th>Product / event</th><th>Units / guests</th><th>Revenue</th><th>Costs</th><th>Profit</th></tr></thead><tbody>${rows||`<tr><td colspan="5">No sales recorded</td></tr>`}</tbody></table></div></details>`;
}

function showDayReport(day){
  if(!day)return;const report=$("#dayReport"),eventRevenue=day.totals.eventRevenue||0,totalRevenue=day.totals.revenue+eventRevenue,profit=day.totals.operatingProfit??day.totals.grossProfit??0,best=day.items.filter(item=>item.unitsSold>0).sort((a,b)=>b.grossProfit-a.grossProfit)[0],product=CATALOGUE.find(item=>item.id===best?.productId);
  report.innerHTML=`<button class="day-report-close" aria-label="Dismiss day report">×</button><div class="day-report-head"><span>DAY ${day.day}</span><div><small>TRADING CLOSED · CAMPAIGN CONTINUES</small><strong>${profit>=0?"Profitable day":"Investment day"}</strong></div><em>${profit>=0?"+":"−"}${formatEuro(Math.abs(profit))}</em></div><div class="day-report-grid"><div><small>TOTAL REVENUE</small><strong>${formatEuro(totalRevenue)}</strong></div><div><small>STAFF + OVERHEAD</small><strong>${formatEuro((day.totals.staffWages||0)+(day.totals.operatingCosts||0))}</strong></div><div><small>VISITORS</small><strong>${day.campus?.guests||0}</strong></div><div><small>MOMENTUM</small><strong>${day.performance?`${day.performance.after} (${day.performance.change>=0?"+":""}${day.performance.change})`:"—"}</strong></div></div><p>${day.totals.payrollShortfall?`${formatEuro(day.totals.payrollShortfall)} of payroll remains unpaid, so staff are off duty.`:day.totals.operatingShortfall?`${formatEuro(day.totals.operatingShortfall)} in campus bills remains unpaid and will weaken tomorrow’s outlook.`:product?`${product.short} led sales; campus rating, availability and operating profit moved momentum ${day.performance?.change>=0?"up":"down"}.`:"No products sold today. Fixed operations continued and momentum adjusted accordingly."}</p><div class="day-report-actions"><span id="dayReportLiveTime">Day ${run.currentDay} is already running · ${formatClock(run.clockMinutes)}</span><button id="dayReportFinance">Open full ledger</button></div>`;
  report.classList.add("show");report.setAttribute("aria-hidden","false");clearTimeout(dayReportTimer);dayReportTimer=setTimeout(()=>hideDayReport(),12000);report.querySelector(".day-report-close").addEventListener("click",hideDayReport);$("#dayReportFinance").addEventListener("click",()=>{hideDayReport();openLedger();drawer.classList.add("open");drawer.setAttribute("aria-hidden","false");});
}

function hideDayReport(){const report=$("#dayReport");report.classList.remove("show");report.setAttribute("aria-hidden","true");clearTimeout(dayReportTimer);}

function confirmNewRun() {
  modalCard.className="modal-card";
  modalCard.innerHTML=`<p class="eyebrow">Replace your tycoon?</p><h2 id="modalTitle">Start a new campus company</h2><p>This replaces your saved business with <strong>€100.00 cash</strong>, Atlantic Café at level one, zero stock, no construction and an empty ledger. Cancelling keeps everything exactly as it is.</p><div class="modal-actions"><button class="action-button secondary" data-close>Cancel</button><button class="action-button orange" id="replaceRun">Replace company</button></div>`;
  showModal(); modalCard.querySelector("[data-close]").addEventListener("click",hideModal); $("#replaceRun").addEventListener("click",()=>{const fresh=createRun();currentZone="campus";camera.x=fresh.player.x;camera.y=fresh.player.y;targetPoint=null;pendingBuild=null;buildCursor=null;buildResumeSpeed=null;guestAgents=[];guestSpawnAccumulator=0;closeDrawer();hideDayReport();save(fresh);hideModal();toast("Fresh venture started on the Nova coast");beep(610);});
}

function switchCampaignMode(nextMode,reset=false){
  showcaseMode=nextMode==="showcase";localStorage.setItem(MODE_STORAGE_KEY,showcaseMode?"showcase":"campaign");if(reset&&showcaseMode)localStorage.removeItem(SHOWCASE_STORAGE_KEY);
  run=loadRun();syncCampusBounds();currentZone=run.player.zone||"campus";camera.x=run.player.x;camera.y=run.player.y;targetPoint=null;pendingBuild=null;buildCursor=null;buildResumeSpeed=null;guestAgents=[];guestSpawnAccumulator=0;activeLocation=null;closeDrawer();hideDayReport();hideModal();updateHUD();toast(showcaseMode?"Showcase editor ready · campaign save protected":"Returned to your campaign");beep(showcaseMode?760:520);
}

function openShowcaseIntro(){
  modalCard.className="modal-card";modalCard.innerHTML=`<p class="eyebrow">Presentation tools · separate save</p><h2 id="modalTitle">Open the Showcase Editor</h2><p>Explore the complete game without changing your campaign. The editor starts at <strong>company level 10</strong> with <strong>${formatEuro(SHOWCASE_BUDGET)}</strong>, while stores, land, upgrades and facilities still use their real purchase flows.</p><div class="showcase-intro"><div><span>⌂</span><strong>Every venue</strong><small>Buy and upgrade all five store concepts.</small></div><div><span>▦</span><strong>Every asset</strong><small>Place the complete construction catalogue.</small></div><div><span>★</span><strong>Every district</strong><small>Acquire land, events and specialist operations.</small></div></div><div class="modal-actions"><button class="action-button secondary" data-close>Keep playing</button><button class="action-button orange" id="enterShowcase">Open editor</button></div>`;showModal();modalCard.querySelector("[data-close]").addEventListener("click",hideModal);$("#enterShowcase").addEventListener("click",()=>switchCampaignMode("showcase"));
}

function confirmShowcaseReset(){
  modalCard.className="modal-card";modalCard.innerHTML=`<p class="eyebrow">Showcase editor · reset</p><h2 id="modalTitle">Clear this presentation?</h2><p>This resets only the separate showcase save to its original level-ten budget. Your campaign remains untouched.</p><div class="modal-actions"><button class="action-button secondary" data-close>Keep presentation</button><button class="action-button orange" id="confirmShowcaseReset">Reset showcase</button></div>`;showModal();modalCard.querySelector("[data-close]").addEventListener("click",hideModal);$("#confirmShowcaseReset").addEventListener("click",()=>switchCampaignMode("showcase",true));
}

function showModal(){modal.classList.remove("hidden");}
function hideModal(){modal.classList.add("hidden");}
function toast(message,error=false){const el=document.createElement("div");el.className=`toast ${error?"error":""}`;el.textContent=message;$("#toastRegion").append(el);setTimeout(()=>el.remove(),2800);}
function beep(frequency){if(!soundOn)return;try{const audio=new AudioContext();const osc=audio.createOscillator(),gain=audio.createGain();osc.frequency.value=frequency;gain.gain.setValueAtTime(.05,audio.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.12);osc.connect(gain).connect(audio.destination);osc.start();osc.stop(audio.currentTime+.12);}catch(_){} }
function setGameSpeed(speed){const requested=Number(speed);if(pendingBuild&&requested>0){toast("Finish or cancel construction before resuming the clock",true);return;}run.speed=requested;localStorage.setItem(activeStorageKey(),JSON.stringify(run));updateHUD();toast(run.speed===0?"Simulation paused":`Simulation running at ${run.speed}×`);}

window.addEventListener("resize",resize);
window.addEventListener("keydown",event=>{const key=event.key.toLowerCase(),typing=["INPUT","SELECT","TEXTAREA"].includes(event.target?.tagName);if(!typing&&!event.metaKey&&!event.ctrlKey&&!event.altKey&&OVERLAY_MODES.includes(({"1":"flow","2":"needs","3":"trade","4":"operations"})[key])){setManagementOverlay(({"1":"flow","2":"needs","3":"trade","4":"operations"})[key]);event.preventDefault();return;}if(!typing&&key==="m"&&!pendingBuild){setManagementOverlay(OVERLAY_MODES[(OVERLAY_MODES.indexOf(managementOverlay)+1)%OVERLAY_MODES.length]);event.preventDefault();return;}if(key==="r"&&pendingBuild){rotatePendingBuild();event.preventDefault();return;}if(!typing&&["w","a","s","d","arrowup","arrowdown","arrowleft","arrowright"].includes(key)){keys.add(key);targetPoint=null;event.preventDefault();}if(!typing&&key==="e"&&modal.classList.contains("hidden")&&!pendingBuild){const near=nearestLocation();if(near)interactWith(near[0]);}if(event.key==="Escape"){if(pendingBuild)cancelBuildMode();hideModal();closeDrawer();}});
window.addEventListener("keyup",event=>{keys.delete(event.key.toLowerCase());localStorage.setItem(activeStorageKey(),JSON.stringify(run));});
canvas.addEventListener("mousemove",event=>{if(pendingBuild){const point=canvasWorldPoint(event);updateBuildCursor(point.x,point.y);}});
canvas.addEventListener("mouseleave",()=>{if(pendingBuild){buildCursor=null;refreshBuildNotice();}});
canvas.addEventListener("click",event=>{const point=canvasWorldPoint(event),x=point.x,y=point.y;if(pendingBuild){updateBuildCursor(x,y);if(!buildCursor.valid){toast(buildCursor.reason,true);beep(180);return;}try{const build=pendingBuild,placedX=buildCursor.x,placedY=buildCursor.y,next=build.mode==="move"?moveFacility(run,build.sourceId,placedX,placedY,build.rotation||0):placeFacility(run,build.type,placedX,placedY,build.modules,build.rotation||0),message=build.mode==="move"?`${build.name.replace(/^Move /,"")} repositioned`:`${build.name} opened · campus rating ${campusMetrics(next).rating}%`;finishBuildMode(next);toast(message);beep(700);}catch(error){toast(error.message,true);beep(180);}return;}if(currentZone==="campus"){const guest=[...guestAgents].sort((a,b)=>Math.hypot(a.x-x,a.y-y)-Math.hypot(b.x-x,b.y-y))[0];if(guest&&Math.hypot(guest.x-x,guest.y-y)<.62){openGuestProfile(guest);return;}const djDeck=(run.facilities||[]).find(item=>item.type==="experience"&&(item.modules||[]).includes("music")&&Math.hypot(item.x-x,item.y-y)<1.8);if(djDeck){openDjOperations(djDeck.id);return;}const facility=(run.facilities||[]).filter(item=>FACILITY_SPECIALIZATIONS.some(choice=>choice.type===item.type)).sort((a,b)=>Math.hypot(a.x-x,a.y-y)-Math.hypot(b.x-x,b.y-y))[0];if(facility&&Math.hypot(facility.x-x,facility.y-y)<1.25){openFacilitySpecialization(facility.id);return;}}const hit=zoneLocations().find(([,loc])=>Math.hypot(x-loc.x,y-loc.y)<1.35);if(hit)moveTo(hit[0]);else{const zone=activeZone();targetPoint={x:Math.max(zone.minX,Math.min(zone.maxX,x)),y:Math.max(zone.minY,Math.min(zone.maxY,y))};}});
$("#closeDrawer").addEventListener("click",closeDrawer);
$("#rotateBuild").addEventListener("click",rotatePendingBuild);
$("#cancelBuild").addEventListener("click",cancelBuildMode);
$("#newRunButton").addEventListener("click",confirmNewRun);
$("#showcaseButton").addEventListener("click",()=>showcaseMode?switchCampaignMode("campaign"):openShowcaseIntro());
$("#exitShowcase").addEventListener("click",()=>switchCampaignMode("campaign"));
$("#resetShowcase").addEventListener("click",confirmShowcaseReset);
$("#soundButton").addEventListener("click",()=>{soundOn=!soundOn;$("#soundButton").classList.toggle("muted",!soundOn);$("#soundButton").textContent=soundOn?"♪":"×";});
$("#timeCenter").addEventListener("click",openTimePanel);
$("#deliveryChip").addEventListener("click",openTimePanel);
$("#worldPulse").addEventListener("click",openPulsePanel);
$("#worldPulse").addEventListener("keydown",event=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();openPulsePanel();}});
document.querySelectorAll(".quick-nav button").forEach(button=>button.addEventListener("click",()=>{
  const action=button.dataset.action;
  markManagementPanel(action==="clock"?null:action);
  if(action==="buy")openLocation("supplier");
  if(action==="build"){if(pendingBuild)cancelBuildMode();openBuildPanel();}
  if(action==="stores"){activeLocation=null;openPortfolio();drawer.classList.add("open");drawer.setAttribute("aria-hidden","false");}
  if(action==="clock")setGameSpeed(run.speed===0?1:0);
  if(action==="guests")openGuestPanel();
  if(action==="operations")openOperationsPanel();
  if(action==="progress")openProgressPanel();
  if(action==="ledger")openLocation("board");
}));
document.querySelectorAll("[data-overlay]").forEach(button=>button.addEventListener("click",()=>setManagementOverlay(button.dataset.overlay,false)));
document.querySelectorAll("[data-speed]").forEach(button=>button.addEventListener("click",()=>setGameSpeed(button.dataset.speed)));
modal.addEventListener("click",event=>{if(event.target===modal)hideModal();});

resize(); updateHUD(); requestAnimationFrame(loop);
