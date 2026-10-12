import { CATALOGUE, STORES, STORE_UNLOCKS, FACILITY_CATALOGUE, STAFF_CATALOGUE, EXPERIENCE_MODULES, DAY_START, DAY_END, STORAGE_KEY, createRun, demandFor, parseEuro, buyStock, setPrice, inventoryValue, overallResult, formatEuro, upgradeVenue, unlockVenue, attractionStats, campusMetrics, crowdPeak, advanceTycoon, placeFacility, hireStaff } from "./core.js";

const $ = selector => document.querySelector(selector);
const canvas = $("#world");
const ctx = canvas.getContext("2d");
const drawer = $("#drawer");
const drawerContent = $("#drawerContent");
const modal = $("#modal");
const modalCard = $("#modalCard");
const keys = new Set();
const ZONES = {
  campus: { id:"campus", name:"Nova Coast Campus", sub:"CARCAVELOS OVERWORLD", width:42, height:30, minX:1, maxX:41, minY:7.5, maxY:25.7, shore:23, outdoor:true, spawn:{x:21,y:18} },
  mercado: { id:"mercado", name:"Mercado Supply Hall", sub:"LOGISTICS INTERIOR", width:15, height:12, minX:1.2, maxX:13.8, minY:1.2, maxY:10.3, outdoor:false, spawn:{x:7.5,y:8.8}, floor:"#d8c79f", accent:"#f5c95e" },
  academy: { id:"academy", name:"Academic Wing", sub:"COURTYARD INTERIOR", width:15, height:12, minX:1.2, maxX:13.8, minY:1.2, maxY:10.3, outdoor:false, spawn:{x:7.5,y:8.8}, floor:"#d7dad3", accent:"#ff7b5b" },
  hub: { id:"hub", name:"Student Hub", sub:"VENTURE INTERIOR", width:15, height:12, minX:1.2, maxX:13.8, minY:1.2, maxY:10.3, outdoor:false, spawn:{x:7.5,y:8.8}, floor:"#cddbd5", accent:"#64cbc8" }
};
let run = loadRun();
let currentZone = run.player.zone || "campus";
let soundOn = true;
let activeLocation = null;
let lastTime = 0;
let walking = false;
let facing = { x: 0, y: 1 };
let targetPoint = null;
let currentSupplierStore = "cafe";
let pendingBuild = null;
let selectedExperienceModules = ["music","shade"];
let simulationElapsed = 0;
let lastPersistAt = 0;
let lastSaleCount = run.totalSales || 0;
let saleFeedTimer = null;
const camera = { x: run.player.x, y: run.player.y, zoom: 1 };
const TILE_W = 76, TILE_H = 38;
const WALK_SPEED = 3.5;

const locations = {
  marketDoor: { zone:"campus", x:7, y:15.2, kind:"door", label:"Enter Mercado Supply Hall", targetZone:"mercado", color:"#f5c95e", title:"MERCADO", sub:"ENTER" },
  academyDoor: { zone:"campus", x:20, y:12.2, kind:"door", label:"Enter the Academic Wing", targetZone:"academy", color:"#ff7b5b", title:"ACADEMIC WING", sub:"ENTER" },
  hubDoor: { zone:"campus", x:34.5, y:14.2, kind:"door", label:"Enter the Student Hub", targetZone:"hub", color:"#64cbc8", title:"STUDENT HUB", sub:"ENTER" },
  snack: { zone:"campus", x:28, y:21.5, label:"Manage Beach Fuel Bar", panel:()=>openStore("snack"), color:"#afd864", title:"BEACH FUEL", sub:"BOARDWALK" },
  supplier: { zone:"mercado", x:7.5, y:4.2, label:"Open wholesale inventory", panel:()=>openSupplier(currentSupplierStore), color:"#f5c95e", title:"SUPPLY DESK", sub:"WHOLESALE" },
  marketExit: { zone:"mercado", x:7.5, y:9.8, kind:"door", label:"Return to the coast campus", targetZone:"campus", spawn:{x:7,y:16.8}, color:"#f5c95e", title:"CAMPUS", sub:"EXIT" },
  cafe: { zone:"academy", x:7.3, y:4.3, label:"Manage Atlantic Café", panel:()=>openStore("cafe"), color:"#ff7b5b", title:"ATLANTIC CAFÉ", sub:"ACADEMIC WING" },
  academyExit: { zone:"academy", x:7.5, y:9.8, kind:"door", label:"Return to the coast campus", targetZone:"campus", spawn:{x:20,y:13.8}, color:"#ff7b5b", title:"CAMPUS", sub:"EXIT" },
  merch: { zone:"hub", x:5.3, y:4.2, label:"Manage Nova Supply Co.", panel:()=>openStore("merch"), color:"#5ac7c4", title:"NOVA SUPPLY", sub:"STUDENT HUB" },
  board: { zone:"hub", x:10.5, y:5.2, label:"Open the venture ledger", panel:openLedger, color:"#67b7d1", title:"VENTURE HQ", sub:"FINANCE" },
  hubExit: { zone:"hub", x:7.5, y:9.8, kind:"door", label:"Return to the coast campus", targetZone:"campus", spawn:{x:34.5,y:15.8}, color:"#64cbc8", title:"CAMPUS", sub:"EXIT" }
};

const zoneLocations = () => Object.entries(locations).filter(([,location]) => location.zone === currentZone);
const activeZone = () => ZONES[currentZone];

function loadRun() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (parsed && [1,2].includes(parsed.version) && Array.isArray(parsed.history)) {
      if (!parsed.player) parsed.player = { x:21, y:18, zone:"campus" };
      if (!parsed.player.zone || !ZONES[parsed.player.zone]) parsed.player = { x:Math.min(41,Math.max(1,parsed.player.x||21)), y:Math.min(25.7,Math.max(7.5,parsed.player.y||18)), zone:"campus" };
      CATALOGUE.forEach(product => {
        if (!Number.isInteger(parsed.stock[product.id])) parsed.stock[product.id] = 0;
        if (!Number.isInteger(parsed.prices[product.id])) parsed.prices[product.id] = product.reference;
      });
      if (!parsed.venues) parsed.venues = { cafe: 1, snack: 1, merch: 1 };
      if (!Number.isInteger(parsed.reputation)) parsed.reputation = 0;
      if (!Array.isArray(parsed.upgrades)) parsed.upgrades = [];
      if (!Array.isArray(parsed.facilities)) parsed.facilities = [];
      if (!parsed.staff) parsed.staff = { caretaker:0, technician:0, host:0 };
      parsed.version=2;parsed.completed=false;
      if(!Number.isFinite(parsed.clockMinutes))parsed.clockMinutes=DAY_START;
      if(!Number.isFinite(parsed.speed))parsed.speed=1;
      if(!parsed.today)parsed.today={revenue:0,cogs:0,unitsSold:0,visitors:0,products:{}};
      if(!parsed.salesProgress)parsed.salesProgress={};
      if(!Number.isInteger(parsed.totalSales))parsed.totalSales=parsed.history.reduce((sum,day)=>sum+(day.totals?.unitsSold||0),0);
      if(!Number.isInteger(parsed.totalVisitors))parsed.totalVisitors=parsed.history.reduce((sum,day)=>sum+(day.campus?.guests||0),0);
      return parsed;
    }
  } catch (_) {}
  const fresh = createRun();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  fresh.player = { x:21, y:18, zone:"campus" };
  return fresh;
}

function save(next) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  run = next;
  updateHUD();
  if (activeLocation) locations[activeLocation].panel();
}

function updateHUD() {
  const zone=activeZone();
  const campus=campusMetrics(run);
  $("#zoneName").textContent=zone.name;
  $("#zoneSub").textContent=zone.sub;
  $("#miniMapTitle").textContent=zone.outdoor?"CAMPUS MAP":"ROOM PLAN";
  $("#game").classList.toggle("indoors",!zone.outdoor);
  $("#weatherIcon").textContent=zone.outdoor?"☀":"⌂";
  $("#weatherTemp").textContent=zone.outdoor?"24°":"IN";
  const peak=crowdPeak(run.clockMinutes);
  $("#weatherNote").textContent=zone.outdoor?`${formatClock(run.clockMinutes)} · ATLANTIC BREEZE`:zone.sub;
  document.querySelectorAll("[data-zone-indicator]").forEach(item=>item.classList.toggle("active",item.dataset.zoneIndicator===zone.id));
  $("#dayStat").textContent = `${run.currentDay}`;
  $("#timeStat").textContent = formatClock(run.clockMinutes);
  $("#cashStat").textContent = formatEuro(run.cash);
  $("#repStat").textContent = `${run.reputation || 0} ★`;
  $("#guestStat").textContent = `${campus.guests}`;
  $("#ratingStat").textContent = `${campus.rating}%`;
  const totalStock = Object.values(run.stock).reduce((a, b) => a + b, 0);
  const unlockedProducts = CATALOGUE.filter(product => (run.venues?.[product.storeId] ?? 0) >= (product.tier || 1));
  const demandCapacity = unlockedProducts.reduce((sum, product) => sum + demandFor(run.prices[product.id], product.reference), 0);
  const lockedVenue=STORES.find(store=>(run.venues?.[store.id]??0)===0),openCount=STORES.filter(store=>(run.venues?.[store.id]??0)>0).length;
  $("#pulseDemand").textContent = `${Math.round(demandCapacity*Math.max(.45,campus.guests/24))} potential sales`;
  $("#pulseVenues").textContent = `${campus.guests} on campus · ${openCount}/3 shops`;
  $("#pulseMilestone").textContent = lockedVenue?`Open ${lockedVenue.short} · ${formatEuro(STORE_UNLOCKS[lockedVenue.id])}`:"Grow every shop to level 3";
  $("#eventIcon").textContent = peak.id==="lunch"?"☀":peak.id==="arrival"?"↗":peak.id==="evening"?"★":"·";
  $("#eventDistrict").textContent = `LIVE · ${formatClock(run.clockMinutes)}`;
  $("#eventTitle").textContent = peak.label;
  $("#eventObjective").textContent = peak.multiplier>1?`${peak.multiplier.toFixed(1)}× customer flow`:"Quiet planning window";
  const focusStoreId=run.venuePurchases?.at(-1)?.storeId||"cafe",focusStore=STORES.find(store=>store.id===focusStoreId),focusStock=CATALOGUE.filter(product=>product.storeId===focusStoreId).reduce((sum,product)=>sum+run.stock[product.id],0);
  let title = `Stock ${focusStore.name}`, text = `${focusStore.short} is open. Buy its first inventory and students will purchase automatically.`, progress = Math.min(100,openCount*22+campus.rating*.34);
  if(totalStock>0){title=peak.id==="lunch"?"Lunch rush is live":peak.id==="arrival"?"Morning crowd incoming":"Grow your campus business";text=`${campus.guests} students are on campus. Better amenities raise footfall and increase sales.`;}
  else if(focusStock===0&&focusStoreId!=="cafe"){text=`Your new ${focusStore.short} needs stock before its first queue can form.`;}
  if(lockedVenue&&run.cash>=STORE_UNLOCKS[lockedVenue.id]){title=`You can open ${lockedVenue.name}`;text="Reinvest your profits in the next district, then stock its first product.";}
  $("#missionTitle").textContent = title;
  $("#missionText").textContent = text;
  $("#missionProgress").style.width = `${progress}%`;
  document.querySelectorAll("[data-speed]").forEach(button=>button.classList.toggle("active",Number(button.dataset.speed)===run.speed));
  $("#clockIcon").textContent=run.speed===0?"▶":"Ⅱ";$("#clockLabel").textContent=run.speed===0?"Resume":"Pause";
  $("#game").classList.toggle("build-mode",Boolean(pendingBuild));
  const buildNotice=$("#buildNotice");if(buildNotice){buildNotice.classList.toggle("hidden",!pendingBuild);if(pendingBuild)$("#buildNoticeName").textContent=pendingBuild.name;}
}

function formatClock(minutes){const value=Math.floor(minutes||DAY_START),hours=Math.floor(value/60)%24,mins=value%60;return `${String(hours).padStart(2,"0")}:${String(mins).padStart(2,"0")}`;}

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

function isoPoint(x,y,z=0){return {x:(x-y)*TILE_W/2,y:(x+y)*TILE_H/2-z};}

function roundedRect(x, y, w, h, r, fill) {
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fillStyle = fill; ctx.fill();
}

function drawWorldLabel(x,y,z,title,accent="#bce65f"){
  const p=isoPoint(x,y,z);ctx.save();ctx.shadowColor="rgba(3,22,28,.25)";ctx.shadowBlur=12;
  roundedRect(p.x-45,p.y-9,90,18,9,"rgba(7,29,37,.86)");ctx.shadowBlur=0;
  ctx.fillStyle=accent;ctx.beginPath();ctx.arc(p.x-35,p.y,3,0,Math.PI*2);ctx.fill();ctx.fillStyle="#fff";ctx.textAlign="center";ctx.font="700 6px DM Mono";ctx.fillText(title,p.x+4,p.y+2);ctx.restore();
}

function drawWorld(t) {
  const w = canvas.clientWidth, h = canvas.clientHeight;
  ctx.clearRect(0, 0, w, h);
  const zone=activeZone(),sky=ctx.createLinearGradient(0,0,0,h);
  if(zone.outdoor){sky.addColorStop(0,"#8dc8d5");sky.addColorStop(1,"#d6e4c0");}else{sky.addColorStop(0,"#122d36");sky.addColorStop(1,"#34505a");}
  ctx.fillStyle=sky;ctx.fillRect(0,0,w,h);
  const cp=isoPoint(camera.x,camera.y);
  ctx.save();
  ctx.translate(w/2-cp.x*camera.zoom,h/2-cp.y*camera.zoom);
  ctx.scale(camera.zoom, camera.zoom);
  drawTerrain(t);
  if(zone.outdoor)drawCampusGroundPlan(t);
  const worldActors=zone.outdoor?[
    {depth:14.4,draw:()=>drawLibrary()},
    {depth:21.8,draw:()=>drawMercadoExterior()},
    {depth:31.2,draw:()=>drawCampus(t)},
    {depth:46.8,draw:()=>drawStudentHub()},
    {depth:43,draw:()=>drawBeachStage(t)},
    ...(run.facilities||[]).map((facility,i)=>({depth:facility.x+facility.y,draw:()=>drawPlacedFacility(facility,t,i)})),
    ...campusTrees.map((tree,i)=>({depth:tree[0]+tree[1],draw:()=>drawTree(tree[0],tree[1],tree[2],t+i*170)})),
    ...students.map((student,i)=>({depth:student[0]+student[1],draw:()=>drawStudent(student,t,i)})),
    ...liveCrowd(t)
  ]:drawRoomActors(t);
  const actors=[...worldActors,
    ...zoneLocations().map(([id,location])=>({depth:location.x+location.y,draw:()=>drawLocation(id)})),
    {depth:run.player.x+run.player.y,draw:()=>drawPlayer(t)}
  ].sort((a,b)=>a.depth-b.depth);
  actors.forEach(actor => actor.draw());
  ctx.restore();
}

function drawTerrain(t) {
  const zone=activeZone(),tiles=[],center=isoPoint(camera.x,camera.y),viewX=canvas.clientWidth/(2*camera.zoom)+TILE_W*2,viewY=canvas.clientHeight/(2*camera.zoom)+TILE_H*3;
  for(let y=0;y<zone.height;y++)for(let x=0;x<zone.width;x++){const point=isoPoint(x,y);if(Math.abs(point.x-center.x)<=viewX&&Math.abs(point.y-center.y)<=viewY)tiles.push({x,y,d:x+y});}
  tiles.sort((a,b)=>a.d-b.d);
  tiles.forEach(({x,y})=>{
    let color=zone.floor||"#79aa67",depth=4;
    if(zone.outdoor){
      if(y>=26){color=(x+y)%2?"#3d8ca0":"#438fa3";depth=0;}
      else if(y>=23)color=(x+y)%2?"#dfc27d":"#e7cd8b";
      else if((y>=8&&y<18&&x>=2&&x<=39)||y>=18)color=(x+y)%2?"#c9c9bf":"#d4d2c7";
      else if((x+y)%2)color="#75a463";
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

function drawCampusGroundPlan(t){
  drawGroundSlab(1.8,7.7,37.4,9.5,"#deddd4",3);
  drawGroundSlab(9.8,9.1,21.8,5.9,"#ebe9df",5);
  drawGroundSlab(3.1,14.2,35.6,2.1,"#d2d1c8",4);
  for(let i=0;i<8;i++){const p=isoPoint(4.2+i*4.4,15.2,5);ctx.strokeStyle=i%2?"rgba(255,255,255,.28)":"rgba(28,70,73,.08)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(p.x-23,p.y-11);ctx.lineTo(p.x+23,p.y+11);ctx.stroke();}
  drawGroundSlab(14.7,10.5,6.8,1.15,"#80c8ce",4);
  const water=isoPoint(18.1,11.05,6);ctx.save();ctx.globalAlpha=.36;ctx.strokeStyle="#f4ffff";ctx.lineWidth=1.2;for(let i=0;i<4;i++){ctx.beginPath();ctx.ellipse(water.x+i*6-9,water.y+i*3-4,32,7,0,0,Math.PI*2);ctx.stroke();}ctx.restore();
  for(let i=0;i<5;i++){const x=12+i*4.5;drawBlock(x,13.2,.9,.9,17,"#e7e2d4","#9c9c92","#b5b4aa");const p=isoPoint(x+.45,13.65,19);ctx.fillStyle=i%2?"#6f9273":"#7c9d79";ctx.beginPath();ctx.ellipse(p.x,p.y-8,15,9,0,0,Math.PI*2);ctx.fill();}
  const sun=isoPoint(27.7,11.6,8);ctx.fillStyle="rgba(255,255,255,.2)";ctx.beginPath();ctx.ellipse(sun.x,sun.y,52+Math.sin(t*.0005)*2,13,0,0,Math.PI*2);ctx.fill();
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
  const white=options.white||"#f1f0e9",side=options.side||"#b9c2bd",shadow=options.shadow||"#cbd0ca";
  drawBlock(x-.16,y-.12,w+.32,h+.24,8,"#d9d8d0","#9ca6a2","#b3bab5");
  drawBlock(x,y,w,h,z,white,side,shadow);
  const levels=Math.max(1,Math.floor((z-18)/27));
  for(let level=0;level<levels;level++){
    const low=14+level*27,high=Math.min(z-9,low+15);if(high>low){drawFacadeBandY(x+.28,y+h+.015,w-.56,low,high,options.glass||"#285761",Math.max(3,Math.round(w)));drawFacadeBandX(x+w+.015,y+.25,h-.5,low,high,options.glassDark||"#204650",Math.max(2,Math.round(h)));}
  }
  drawRaisedSlab(x-.12,y-.12,w+.24,h+.24,z+4,4,"#f8f6ee","#aeb7b2","#c8ccc7");
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
  drawCampusWing(12.2,3.1,6.2,5.7,90,{glass:"#315f67",roofGarden:true});
  drawCampusWing(18.2,3.55,5.8,5.15,70,{glass:"#2c6570",accent:"#f2c85f"});
  drawCampusWing(23.8,3.05,6.3,5.75,111,{glass:"#285762",slats:true,roofGarden:true});
  drawCanopy(12,8.25,18.3,1.15,31);
  const bridgeA=isoPoint(17.8,5.6,60),bridgeB=isoPoint(24.25,5.6,60);ctx.strokeStyle="#e8e8e2";ctx.lineWidth=14;ctx.beginPath();ctx.moveTo(bridgeA.x,bridgeA.y);ctx.lineTo(bridgeB.x,bridgeB.y);ctx.stroke();ctx.strokeStyle="#315c65";ctx.lineWidth=8;ctx.stroke();
  drawWorldLabel(21.2,8.55,127,"NOVA COAST CAMPUS","#f5c95e");
}

function drawLibrary(){
  drawCampusWing(2.2,3.25,8.4,5.15,73,{glass:"#32646d",slats:true,roofGarden:true});
  drawCanopy(9.8,6.75,3.1,1.2,28);
  drawWorldLabel(6.4,8.05,88,"LEARNING CENTER","#64cbc8");
}

function drawMercadoExterior(){
  drawCampusWing(3.15,8.85,8.25,4.45,58,{glass:"#315a60",slats:true,accent:"#f5c95e"});
  drawCanopy(10.75,10.4,2.1,1.4,26);
  drawWorldLabel(7.3,13.15,74,"MERCADO SUPPLY","#f5c95e");
}

function drawStudentHub(){
  drawCampusWing(30.05,5.05,9.2,6.15,84,{glass:"#2c616b",roofGarden:true,accent:"#ff7458"});
  drawCanopy(29.25,8.15,2.2,1.25,29);
  drawWorldLabel(34.65,10.95,100,"STUDENT HUB","#ff7458");
}

function drawBeachStage(t){
  drawBlock(18.2,22.35,4.6,1.7,17,"#d49b5d","#71513e","#90684b");
  const p=isoPoint(20.5,23.2,54);ctx.save();ctx.shadowColor="rgba(3,22,28,.25)";ctx.shadowBlur=12;
  ctx.strokeStyle="#193a43";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(p.x-58,p.y+22);ctx.lineTo(p.x-55,p.y-45);ctx.moveTo(p.x+58,p.y+22);ctx.lineTo(p.x+55,p.y-45);ctx.stroke();
  ctx.shadowBlur=0;ctx.fillStyle="#ff8b66";ctx.beginPath();ctx.moveTo(p.x-62,p.y-45);ctx.quadraticCurveTo(p.x,p.y-61,p.x+62,p.y-45);ctx.lineTo(p.x+42,p.y-19);ctx.quadraticCurveTo(p.x,p.y-31,p.x-42,p.y-19);ctx.closePath();ctx.fill();
  ctx.strokeStyle="rgba(255,255,255,.65)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(p.x-54,p.y-43);ctx.quadraticCurveTo(p.x,p.y-55,p.x+54,p.y-43);ctx.stroke();
  for(let i=0;i<5;i++){const lx=p.x-42+i*21;ctx.fillStyle=["#f5c95e","#64cbc8","#f4f0df"][i%3];ctx.beginPath();ctx.arc(lx,p.y-31+Math.sin(t*.002+i)*1.5,3,0,Math.PI*2);ctx.fill();}
  ctx.fillStyle="#173743";ctx.fillRect(p.x-48,p.y-9,17,27);ctx.fillRect(p.x+31,p.y-9,17,27);ctx.restore();drawWorldLabel(20.5,23,86,"BEACH STAGE","#ff8b66");
}

function drawInteriorFloor(zone){
  drawGroundSlab(1.1,1.1,12.8,9.15,"#e8e7e0",4);
  const accent=zone.id==="academy"?"#dce9df":zone.id==="mercado"?"#ece1c9":"#dbe8e6";
  drawGroundSlab(2.1,2.05,10.8,1.15,accent,5);
  for(let i=0;i<6;i++){const p=isoPoint(2.6+i*1.75,2.6,6);ctx.strokeStyle="rgba(255,255,255,.5)";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(p.x-22,p.y-10);ctx.lineTo(p.x+22,p.y+10);ctx.stroke();}
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
  drawBlock(0,0,zone.width,1,105,"#f2f1eb","#aeb9b5","#c9ceca");
  drawBlock(0,0,1,zone.height,88,"#f5f3ec","#9fadaa","#c5ccc8");
  drawFacadeBandY(1.1,1.02,zone.width-1.3,18,72,"#2c5c65",9);
  drawFacadeBandX(1.02,1.1,zone.height-1.3,17,65,"#244e58",7);
  drawTimberScreen(1.35,1.04,zone.width-1.8,76,101,14);
  const p=isoPoint(zone.width/2,.75,91);roundedRect(p.x-72,p.y-10,144,20,4,"#173743");ctx.fillStyle=zone.accent;ctx.fillRect(p.x-64,p.y-10,5,20);ctx.fillStyle="#fff";ctx.textAlign="center";ctx.font="800 8px DM Mono";ctx.fillText(zone.name.toUpperCase(),p.x+4,p.y+3);
}
function drawFurniture(x,y,w,h,z,color,index){
  const top=index%2?"#d5b27a":"#b8c9c4";drawBlock(x,y,w,h,z,top,mixColor(top,"#000000",.3),mixColor(top,"#000000",.18));
  const p=isoPoint(x+w/2,y+h/2,z+4);ctx.fillStyle=index%2?"#f4e7c8":"#d9f0e3";ctx.beginPath();ctx.arc(p.x,p.y,5,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle="#24474f";ctx.lineWidth=2;[x+.2,x+w-.2].forEach(px=>{const a=isoPoint(px,y+h*.5,0),b=isoPoint(px,y+h*.5,z);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();});
}

function drawBlock(x,y,w,h,z,top,right,left){const a=isoPoint(x,y,z),b=isoPoint(x+w,y,z),c=isoPoint(x+w,y+h,z),d=isoPoint(x,y+h,z),ba=isoPoint(x,y),bb=isoPoint(x+w,y),bc=isoPoint(x+w,y+h),bd=isoPoint(x,y+h);ctx.fillStyle=left;ctx.beginPath();ctx.moveTo(d.x,d.y);ctx.lineTo(c.x,c.y);ctx.lineTo(bc.x,bc.y);ctx.lineTo(bd.x,bd.y);ctx.closePath();ctx.fill();ctx.fillStyle=right;ctx.beginPath();ctx.moveTo(b.x,b.y);ctx.lineTo(c.x,c.y);ctx.lineTo(bc.x,bc.y);ctx.lineTo(bb.x,bb.y);ctx.closePath();ctx.fill();ctx.fillStyle=top;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.lineTo(c.x,c.y);ctx.lineTo(d.x,d.y);ctx.closePath();ctx.fill();ctx.strokeStyle="rgba(15,35,40,.22)";ctx.stroke();}

const campusTrees=[[2,8,.9],[5,14,.8],[11,19,.82],[14,22,.9],[18,10,.72],[25,12,.76],[29,19,.88],[32,9,.83],[39,12,.92],[37,19,.8],[6,21,.75],[24,22,.72],[40,21,.86]];
const students=[[6.8,11.9,"#f4b858",.2],[10.5,18.6,"#dc6958",1.1],[16.2,16.3,"#75c0c8",2],[24.8,12.1,"#8b74bd",2.8],[33.3,18.7,"#ff8060",4.2],[37.4,12.2,"#bce65f",5.8]];
const crowdColors=["#f5c95e","#ff8060","#64cbc8","#9a7bc1","#bce65f","#f0e9dc","#e6a769"];

function liveCrowd(t){
  const peak=crowdPeak(run.clockMinutes),metrics=campusMetrics(run),actors=[],queueAnchors={cafe:[20.5,13.8],snack:[27.7,21.1],merch:[34.2,15.3]};
  const roaming=Math.min(30,Math.max(5,Math.round(metrics.guests*peak.multiplier*.34)));
  const routes=[[[3.4,14.8],[38.2,14.8]],[[7.2,17.2],[35.5,17.2]],[[12.2,10.2],[31.2,13.4]],[[6.2,20.4],[31.5,20.4]],[[15.2,12.7],[36.8,10.9]]];
  for(let i=0;i<roaming;i++){
    const route=routes[i%routes.length],reverse=i%4===1,phase=(i*.173)%1,speed=.000018+(i%5)*.0000018,u=(phase+t*speed)%1,eased=u<.5?2*u*u:1-Math.pow(-2*u+2,2)/2,start=reverse?route[1]:route[0],end=reverse?route[0]:route[1];
    const x=start[0]+(end[0]-start[0])*eased,y=start[1]+(end[1]-start[1])*eased,person=[x,y,crowdColors[i%crowdColors.length],i*.67,true,end[0]>=start[0]?1:-1];actors.push({depth:x+y,draw:()=>drawStudent(person,t,i+30)});
  }
  STORES.filter(store=>(run.venues?.[store.id]??0)>0).forEach((store,storeIndex)=>{const anchor=queueAnchors[store.id],stock=CATALOGUE.filter(product=>product.storeId===store.id).reduce((sum,product)=>sum+run.stock[product.id],0),count=stock?Math.min(8,Math.max(1,Math.round(peak.multiplier*2.4))):0;for(let i=0;i<count;i++){const diagonal=store.id!=="snack",x=anchor[0]-i*(diagonal ? .48 : .52),y=anchor[1]+i*(diagonal ? .48 : .2),person=[x,y,crowdColors[(i+storeIndex*2)%crowdColors.length],2+i*.21,false,1];actors.push({depth:x+y+i*.01,draw:()=>drawStudent(person,t,i+70+storeIndex*10)});}if(count)actors.push({depth:anchor[0]+anchor[1]-.1,draw:()=>drawQueueLabel(anchor[0],anchor[1],store.short,count)});});
  return actors;
}

function drawQueueLabel(x,y,label,count){const p=isoPoint(x,y,62);roundedRect(p.x-44,p.y-10,88,20,4,"rgba(10,37,46,.92)");ctx.fillStyle="#bce65f";ctx.textAlign="center";ctx.font="700 7px DM Mono";ctx.fillText(`${label.toUpperCase()} · ${count} IN LINE`,p.x,p.y+3);}

function drawTree(x,y,scale,t){const p=isoPoint(x,y,4),sway=Math.sin(t*.001)*2;ctx.save();ctx.translate(p.x,p.y);ctx.scale(scale,scale);ctx.fillStyle="rgba(10,45,38,.16)";ctx.beginPath();ctx.ellipse(7,4,27,8,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle="#76563b";ctx.lineWidth=7;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(-2,-30,sway,-64);ctx.stroke();ctx.strokeStyle="rgba(255,210,145,.34)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-2,-3);ctx.quadraticCurveTo(-4,-31,sway-2,-61);ctx.stroke();ctx.translate(sway,-65);for(let a=0;a<7;a++){ctx.save();ctx.rotate(a*Math.PI*2/7+Math.sin(t*.0007+a)*.035);ctx.fillStyle=a%2?"#2f8358":"#3d9668";ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(18,-7,37,0);ctx.quadraticCurveTo(19,8,0,3);ctx.closePath();ctx.fill();ctx.restore();}ctx.fillStyle="#87633f";ctx.beginPath();ctx.arc(0,0,5,0,Math.PI*2);ctx.fill();ctx.restore();}

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

function drawMusicModule(x,y,t){
  drawRaisedSlab(x-.95,y-.52,1.4,.7,32,10,"#213f49","#112f38","#193943");const p=isoPoint(x-.25,y-.16,51);ctx.fillStyle="#f5c95e";for(let i=0;i<5;i++)ctx.fillRect(p.x-18+i*8,p.y-4-Math.abs(Math.sin(t*.008+i))*12,5,6+Math.abs(Math.sin(t*.008+i))*12);[-1,1].forEach(side=>{const s=isoPoint(x+side*.83,y-.05,41);roundedRect(s.x-8,s.y-17,16,24,3,"#173743");ctx.fillStyle="#64cbc8";ctx.beginPath();ctx.arc(s.x,s.y-4,4,0,Math.PI*2);ctx.fill();});
}

function drawSunsetModule(x,y){
  drawRaisedSlab(x+.15,y-.72,1.25,1.05,43,10,"#d1ad72","#715941","#92704d");const rail=isoPoint(x+.78,y-.18,58);ctx.strokeStyle="#eef5f2";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(rail.x-27,rail.y+15);ctx.lineTo(rail.x-27,rail.y-10);ctx.lineTo(rail.x+27,rail.y+16);ctx.lineTo(rail.x+27,rail.y+39);ctx.stroke();ctx.strokeStyle="#173743";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(rail.x,rail.y+8);ctx.lineTo(rail.x+7,rail.y-14);ctx.stroke();ctx.fillStyle="#f5c95e";ctx.beginPath();ctx.arc(rail.x+10,rail.y-18,7,0,Math.PI*2);ctx.fill();
}

function drawShadeModule(x,y){
  const a=isoPoint(x-1.15,y-.65,20),b=isoPoint(x+1.1,y-.65,20),c=isoPoint(x+.4,y+.75,20),ta=isoPoint(x-1.15,y-.65,76),tb=isoPoint(x+1.1,y-.65,62),tc=isoPoint(x+.4,y+.75,69);ctx.strokeStyle="#294d55";ctx.lineWidth=3;[[a,ta],[b,tb],[c,tc]].forEach(([from,to])=>{ctx.beginPath();ctx.moveTo(from.x,from.y);ctx.lineTo(to.x,to.y);ctx.stroke();});drawPlane([ta,tb,tc],"rgba(255,238,194,.94)","rgba(117,87,54,.25)");
}

function drawSocialModule(x,y){
  const p=isoPoint(x-.45,y+.53,22);ctx.save();ctx.translate(p.x,p.y);ctx.scale(1,.42);ctx.strokeStyle="#d09a5e";ctx.lineWidth=10;ctx.beginPath();ctx.arc(0,0,30,0,Math.PI*2);ctx.stroke();ctx.strokeStyle="#173743";ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,16,0,Math.PI*2);ctx.stroke();ctx.restore();const top=isoPoint(x-.45,y+.53,31);ctx.fillStyle="#f5c95e";ctx.beginPath();ctx.arc(top.x,top.y,5,0,Math.PI*2);ctx.fill();
}

function drawSurfModule(x,y,t){
  drawGroundSlab(x-1.22,y-.7,2.44,1.4,"#5fbac6",9);const p=isoPoint(x,y,28),wave=Math.sin(t*.004)*3;ctx.strokeStyle="#e8ffff";ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(p.x-42,p.y+13);ctx.bezierCurveTo(p.x-18,p.y-18-wave,p.x+7,p.y-23+wave,p.x+39,p.y+5);ctx.stroke();ctx.strokeStyle="#f5c95e";ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(p.x-5,p.y+7);ctx.lineTo(p.x+19,p.y-8);ctx.stroke();
}

function drawExperience(facility,t){
  const modules=facility.modules||[],has=id=>modules.includes(id),stats=attractionStats(modules),x=facility.x,y=facility.y;
  drawGroundSlab(x-1.35,y-.9,2.7,1.8,"#dad7cb",6);
  if(has("surf"))drawSurfModule(x,y,t);else{drawGroundSlab(x-1.08,y-.66,2.16,1.32,"#dce8e3",7);}
  if(has("social"))drawSocialModule(x,y);
  if(has("music"))drawMusicModule(x,y,t);
  if(has("sunset"))drawSunsetModule(x,y);
  if(has("shade"))drawShadeModule(x,y);
  const height=has("shade")?100:has("sunset")?82:70,tag=isoPoint(x,y,height);roundedRect(tag.x-48,tag.y-9,96,18,9,"rgba(10,37,46,.9)");ctx.fillStyle="#bce65f";ctx.textAlign="center";ctx.font="700 6px DM Mono";ctx.fillText(`${modules.length} MODULES · EXC ${stats.excitement}`,tag.x,tag.y+2);
}

function drawPlacedFacility(facility,t,index){
  if(facility.type==="path"){drawTile(facility.x-.5,facility.y-.5,"#d7d3c2",2);return;}
  if(facility.type==="scenery"){drawBlock(facility.x-.55,facility.y-.55,1.1,1.1,16,"#d9d4c8","#999990","#b1afa5");drawTree(facility.x,facility.y,.6,t+index*90);return;}
  if(facility.type==="bench"){drawAtlanticBench(facility.x,facility.y);return;}
  if(facility.type==="bin")drawRecyclingPoint(facility.x,facility.y);
  else if(facility.type==="water")drawWaterStation(facility.x,facility.y,t);
  else if(facility.type==="restroom")drawRestroomPod(facility.x,facility.y);
  else if(facility.type==="foodGarden")drawFoodGarden(facility.x,facility.y);
  else if(facility.type==="experience")drawExperience(facility,t);
}

const personStyles=[
  {skin:"#9a6549",hair:"#2d2523",pants:"#243f4d",bag:"#e4b654"},
  {skin:"#d29a72",hair:"#593b2c",pants:"#385f68",bag:"#c7614e"},
  {skin:"#7b4d38",hair:"#181e22",pants:"#383b55",bag:"#5c9b9d"},
  {skin:"#edbd94",hair:"#b46e42",pants:"#315056",bag:"#8466a3"},
  {skin:"#b77956",hair:"#30251f",pants:"#304652",bag:"#7e9e55"},
  {skin:"#e2aa82",hair:"#4b332a",pants:"#4a485d",bag:"#d37b4d"}
];

function drawPersonFigure(x,y,t,index,options={}){
  const style=personStyles[Math.abs(index)%personStyles.length],moving=Boolean(options.moving),phase=(options.phase||0)+index*.73,step=moving?Math.sin(t*.011+phase):Math.sin(t*.0025+phase)*.12,bob=moving?Math.abs(step)*1.4:Math.sin(t*.002+phase)*.35,p=isoPoint(x,y,4+bob),direction=options.direction||1,scale=options.player?1.18:.92;
  ctx.save();ctx.translate(p.x,p.y);ctx.scale(direction*scale,scale);
  ctx.fillStyle="rgba(8,37,42,.18)";ctx.beginPath();ctx.ellipse(0,4,14,5,0,0,Math.PI*2);ctx.fill();
  ctx.lineCap="round";ctx.strokeStyle=style.pants;ctx.lineWidth=4.4;ctx.beginPath();ctx.moveTo(-3,-17);ctx.lineTo(-5+step*4,0);ctx.moveTo(3,-17);ctx.lineTo(5-step*4,0);ctx.stroke();
  ctx.strokeStyle="#eef0e9";ctx.lineWidth=3.4;ctx.beginPath();ctx.moveTo(-7+step*4,0);ctx.lineTo(-3+step*4,0);ctx.moveTo(3-step*4,0);ctx.lineTo(7-step*4,0);ctx.stroke();
  ctx.strokeStyle=style.skin;ctx.lineWidth=3.7;ctx.beginPath();ctx.moveTo(-6,-31);ctx.lineTo(-10-step*3,-17);ctx.moveTo(6,-31);ctx.lineTo(10+step*3,-18);ctx.stroke();
  roundedRect(-7,-37,14,21,4,options.player?"#bce65f":options.color||"#64cbc8");
  roundedRect(-10,-34,5,15,2,style.bag);
  ctx.fillStyle=style.skin;ctx.beginPath();ctx.arc(0,-43,6.2,0,Math.PI*2);ctx.fill();
  ctx.fillStyle=style.hair;ctx.beginPath();ctx.arc(-.6,-44.8,6,Math.PI,Math.PI*2);ctx.lineTo(5,-43);ctx.quadraticCurveTo(4,-50,-1,-50);ctx.closePath();ctx.fill();
  if(options.player){ctx.fillStyle="#173743";roundedRect(-5.2,-34,10.4,3,1,"#173743");ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(2,-43,1.1,0,Math.PI*2);ctx.fill();}
  ctx.restore();
}

function drawStudent(s,t,i){drawPersonFigure(s[0],s[1],t,i,{color:s[2],phase:s[3],moving:s[4],direction:s[5]||((i%5)===0?-1:1)});}

function drawStorePod(id,loc,level,locked){
  const size=1.7+Math.max(1,level)*.17,accent=locked?"#7d8b8c":loc.color,x=loc.x-size/2,y=loc.y-size*.38,z=42+Math.max(1,level)*5;
  drawBlock(x,y,size,size*.76,z,"#f1f0e9","#aeb9b5","#c7ccc7");
  drawFacadeBandY(x+.15,y+size*.76+.01,size-.3,10,z-7,"#28535c",3);
  drawRaisedSlab(x-.12,y-.12,size+.24,size*.25,z+3,4,"#f8f6ee","#9ba7a4","#bcc3bf");
  const awning=isoPoint(loc.x,loc.y+size*.43,z-2);ctx.strokeStyle=accent;ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(awning.x-24,awning.y-12);ctx.lineTo(awning.x+24,awning.y+12);ctx.stroke();
  const sign=isoPoint(loc.x,loc.y+size*.4,29);roundedRect(sign.x-24,sign.y-7,48,14,3,"#173743");ctx.fillStyle=accent;ctx.textAlign="center";ctx.font="800 6px DM Mono";ctx.fillText(id==="cafe"?"CAFÉ":id==="snack"?"FUEL":"NOVA",sign.x,sign.y+2);
}

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
    const tag=isoPoint(loc.x,loc.y,92);roundedRect(tag.x-50,tag.y-10,100,20,10,"rgba(10,37,46,.88)");ctx.fillStyle=loc.color;ctx.beginPath();ctx.arc(tag.x-40,tag.y,3,0,Math.PI*2);ctx.fill();ctx.fillStyle="#fff";ctx.textAlign="center";ctx.font="700 6px DM Mono";ctx.fillText(`${loc.title} · ${loc.sub}`,tag.x+4,tag.y+2);
    return;
  }
  const isStore=STORES.some(store=>store.id===id),level=isStore?(run.venues?.[id]??0):1,locked=isStore&&level===0,size=1.45+Math.max(1,level)*.18,venueColor=locked?"#7d8b8c":loc.color;
  if(isStore){
    ctx.save();if(locked)ctx.globalAlpha=.48;drawStorePod(id,loc,level,locked);ctx.restore();
  }else if(id==="supplier"||id==="board"){
    drawServicePoint(id,loc);
  }else{
    drawBlock(loc.x-size/2,loc.y-size*.42,size,size*.84,48+Math.max(1,level)*8,"#f4ead4","#b7ad99","#cbc2ad");
    drawBlock(loc.x-size*.62,loc.y-size*.5,size*1.24,.32,64+Math.max(1,level)*9,venueColor,"#a64f43","#bf6152");
  }
  if(level>1){const flag=isoPoint(loc.x+.5,loc.y-.45,86+level*8);ctx.strokeStyle="#173743";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(flag.x,flag.y+24);ctx.lineTo(flag.x,flag.y-24);ctx.stroke();ctx.fillStyle=loc.color;ctx.beginPath();ctx.moveTo(flag.x,flag.y-23);ctx.lineTo(flag.x+22,flag.y-16);ctx.lineTo(flag.x,flag.y-8);ctx.closePath();ctx.fill();}
  if(near){const q=isoPoint(loc.x,loc.y,3);ctx.strokeStyle="#ffd454";ctx.lineWidth=3;ctx.setLineDash([7,5]);ctx.beginPath();ctx.ellipse(q.x,q.y,55+Math.sin(lastTime*.004)*2,20,0,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);}
  const tag=isoPoint(loc.x,loc.y,isStore?108+Math.max(1,level)*7:96);roundedRect(tag.x-50,tag.y-11,100,22,11,"rgba(10,37,46,.9)");ctx.fillStyle=venueColor;ctx.beginPath();ctx.arc(tag.x-39,tag.y,3,0,Math.PI*2);ctx.fill();ctx.fillStyle="#fff";ctx.textAlign="center";ctx.font="700 7px DM Mono";ctx.fillText(`${loc.title}${isStore?locked?" · BUY":" · LV "+level:""}`,tag.x+5,tag.y+3);
}

function drawPlayer(t) {
  const bob=walking?Math.abs(Math.sin(t*.01))*1.5:Math.sin(t*.003)*.4,p=isoPoint(run.player.x,run.player.y,4);
  ctx.save();ctx.translate(p.x,p.y);ctx.fillStyle="rgba(7,29,37,.22)";ctx.beginPath();ctx.ellipse(0,3,18,7,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle="rgba(255,255,255,.9)";ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,2,23,9,0,0,Math.PI*2);ctx.stroke();ctx.restore();
  drawPersonFigure(run.player.x,run.player.y,t,0,{color:"#bce65f",phase:0,moving:walking,direction:facing.x+facing.y<0?-1:1,player:true,bob});
}

function loop(t) {
  const dt = Math.min((t-lastTime)/1000 || 0, .04); lastTime=t;
  simulationElapsed+=dt;
  if(simulationElapsed>=.5){const elapsed=simulationElapsed;simulationElapsed=0;tickTycoon(elapsed);}
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
  camera.x+=(run.player.x-camera.x)*Math.min(1,dt*4.8);camera.y+=(run.player.y-camera.y)*Math.min(1,dt*4.8);
  const desiredZoom=zone.outdoor?Math.max(.72,Math.min(1.08,canvas.clientWidth/1080)):Math.max(.94,Math.min(1.24,canvas.clientWidth/850));camera.zoom+=(desiredZoom-camera.zoom)*Math.min(1,dt*3.5);
  const mini=$(".mini-player");if(mini){mini.style.left=`${run.player.x/zone.width*100}%`;mini.style.top=`${run.player.y/zone.height*100}%`;}
  updateProximity(); drawWorld(t); requestAnimationFrame(loop);
}

function tickTycoon(realSeconds){
  if(!run.speed)return;
  const beforeDay=run.currentDay,beforeSales=run.totalSales||0,beforeProducts=structuredClone(run.today?.products||{});
  run=advanceTycoon(run,realSeconds*8*run.speed);
  if((run.totalSales||0)>beforeSales){
    const soldId=Object.keys(run.today?.products||{}).find(id=>(run.today.products[id]?.unitsSold||0)>(beforeProducts[id]?.unitsSold||0));
    const product=CATALOGUE.find(item=>item.id===soldId);showSaleFeed(product,(run.totalSales||0)-beforeSales);
  }
  if(run.currentDay!==beforeDay){const closed=run.history.at(-1);toast(`Day ${beforeDay} closed · ${formatEuro(closed?.totals?.revenue||0)} revenue`);beep(640);}
  const now=performance.now();if(now-lastPersistAt>1800||run.currentDay!==beforeDay){localStorage.setItem(STORAGE_KEY,JSON.stringify(run));lastPersistAt=now;}
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
function changeZone(zoneId,spawn){const zone=ZONES[zoneId];if(!zone)return;closeDrawer();currentZone=zoneId;const point=spawn||zone.spawn;run.player={x:point.x,y:point.y,zone:zoneId};camera.x=point.x;camera.y=point.y;targetPoint=null;localStorage.setItem(STORAGE_KEY,JSON.stringify(run));updateHUD();const game=$("#game");game.classList.add("zone-transition");setTimeout(()=>game.classList.remove("zone-transition"),420);toast(zone.outdoor?"Back on the Nova coast":"Entered "+zone.name);beep(zone.outdoor?520:620);}
function openLocation(id) { activeLocation=id; locations[id].panel(); drawer.classList.add("open"); drawer.setAttribute("aria-hidden","false"); }
function closeDrawer() { activeLocation=null; drawer.classList.remove("open"); drawer.setAttribute("aria-hidden","true"); }

function storeTabs(selected, action="supplier") {
  return `<div class="store-tabs">${STORES.map(store=>`<button class="store-tab ${selected===store.id?"active":""}" data-store="${store.id}" data-mode="${action}"><span>${store.icon}</span>${store.short}</button>`).join("")}</div>`;
}

function openSupplier(selectedStore="cafe") {
  currentSupplierStore=selectedStore;
  const store=STORES.find(item=>item.id===selectedStore), products=CATALOGUE.filter(product=>product.storeId===selectedStore), level=run.venues[selectedStore] ?? 0;
  drawerContent.innerHTML = `
    <p class="eyebrow">Mercado Hub · wholesale market</p><h2>Buy inventory</h2>
    <p class="drawer-intro">Choose a venue, compare unit economics, and build a portfolio you can actually afford.</p>
    <div class="balance-banner"><span>AVAILABLE CASH</span><strong>${formatEuro(run.cash)}</strong></div>
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
    try { save(buyStock(run, button.dataset.id, quantity)); toast(`Stock purchased · ${quantity} units`); beep(520); }
    catch (error) { toast(error.message, true); beep(180); }
  }));
}

function productBuyCard(product) {
  const level=run.venues?.[product.storeId]??0,locked=level<(product.tier || 1);
  return `<article class="product-card ${locked?"locked":""}" style="--product-color:${product.color}">
    <div class="product-head"><div class="product-icon">${product.icon}</div><div><h3>${product.name}</h3><p>${formatEuro(product.cost)} cost · ${formatEuro(product.reference)} reference</p></div><span class="stock-pill">${run.stock[product.id]} in stock</span></div>
    <div class="buy-row"><div class="qty-control"><button class="qty-minus" data-id="${product.id}" aria-label="Decrease quantity" ${locked?"disabled":""}>−</button><input class="qty-input" data-id="${product.id}" id="qty-${product.id}" type="number" min="1" step="1" value="1" aria-label="Quantity" ${locked?"disabled":""}><button class="qty-plus" data-id="${product.id}" aria-label="Increase quantity" ${locked?"disabled":""}>+</button></div><button class="action-button buy-button" data-id="${product.id}" ${locked ? "disabled" : ""}>${locked?(level===0?"Venue closed":`Unlock at level ${product.tier}`):`Buy · <span id="total-${product.id}">${formatEuro(product.cost)}</span>`}</button></div>
  </article>`;
}

function updateBuyTotal(id) {
  const product = CATALOGUE.find(p=>p.id===id), quantity = Number($(`#qty-${id}`).value);
  $(`#total-${id}`).textContent = Number.isInteger(quantity) && quantity > 0 ? formatEuro(product.cost*quantity) : "—";
}

function openStore(storeId="cafe") {
  const store=STORES.find(item=>item.id===storeId), products=CATALOGUE.filter(product=>product.storeId===storeId);
  const level=run.venues?.[storeId] ?? 0, upgradeCost=level===1?1500:2500;
  if(level===0){
    const cost=STORE_UNLOCKS[storeId];drawerContent.innerHTML=`<p class="eyebrow">Expansion opportunity · ${store.short}</p><div class="locked-venue-hero" style="--venue:${store.color}"><span>${store.icon}</span><small>NEW CAMPUS DISTRICT</small><h2>${store.name}</h2><p>${store.pitch} Purchase the operating license, then stock its first product and watch a new queue form.</p><div><em>OPENING COST</em><strong>${formatEuro(cost)}</strong></div><button class="action-button orange" id="unlockVenue" ${run.cash<cost?"disabled":""}>Open ${store.short}</button></div>${storeTabs(storeId,"store")}`;
    drawerContent.querySelectorAll(".store-tab").forEach(button=>button.addEventListener("click",()=>openLocation(button.dataset.store)));
    $("#unlockVenue").addEventListener("click",()=>{try{save(unlockVenue(run,storeId));toast(`${store.name} is now open`);beep(760);openStore(storeId);}catch(error){toast(error.message,true);}});return;
  }
  const units=products.reduce((sum,p)=>sum+run.stock[p.id],0);
  const campus=campusMetrics(run),potential=products.reduce((sum,p)=>sum+Math.min(run.stock[p.id],Math.round(demandFor(run.prices[p.id],p.reference)*Math.max(.45,campus.guests/24)))*run.prices[p.id],0);
  drawerContent.innerHTML = `
    <p class="eyebrow">Venue management · ${store.short}</p><div class="venue-title"><div><h2>${store.name}</h2><p>${store.pitch}</p></div><div class="level-badge"><small>VENUE LEVEL</small><strong>${level} / 3</strong></div></div>
    <div class="upgrade-track"><span style="width:${level/3*100}%"></span></div>
    ${level<3?`<button class="upgrade-button" id="upgradeVenue">Upgrade to level ${level+1}<small>Unlock ${products.find(p=>p.tier===level+1)?.name} · ${formatEuro(upgradeCost)}</small></button>`:`<div class="max-level">★ Flagship venue · all products unlocked</div>`}
    ${storeTabs(storeId,"store")}
    <div class="venue-kpis"><div><small>ON HAND</small><strong>${units}</strong><span>units</span></div><div><small>EST. DAY REVENUE</small><strong>${formatEuro(potential)}</strong><span>rating adjusted</span></div><div><small>PRODUCTS</small><strong>${products.filter(product=>product.tier<=level).length} / 3</strong><span>unlocked</span></div></div>
    <div class="rule-box"><strong>Live demand</strong><div class="rule-grid"><div><b>${campus.guests} guests</b><small>campus footfall</small></div><div><b>${campus.rating}% rating</b><small>raises conversion</small></div><div><b>${crowdPeak(run.clockMinutes).multiplier.toFixed(1)}× flow</b><small>${crowdPeak(run.clockMinutes).label}</small></div></div></div>
    <div class="product-list">${products.map(product => productPriceCard(product)).join("")}</div>
    <div class="trade-footer"><button class="action-button secondary" id="visitSupplier">Buy more stock</button><button class="action-button orange" id="venueClock">${run.speed===0?"Resume":"Pause"} live trading</button></div>`;
  drawerContent.querySelectorAll(".store-tab").forEach(button=>button.addEventListener("click",()=>openLocation(button.dataset.store)));
  drawerContent.querySelectorAll(".price-input").forEach(input => {
    input.addEventListener("input", () => updateDemandPreview(input.dataset.id));
    input.addEventListener("change", () => commitPrice(input.dataset.id));
  });
  drawerContent.querySelectorAll(".set-price").forEach(button => button.addEventListener("click",()=>commitPrice(button.dataset.id)));
  if($("#upgradeVenue")) $("#upgradeVenue").addEventListener("click",()=>{try{save(upgradeVenue(run,storeId));toast(`${store.name} upgraded to level ${level+1}`);beep(720);}catch(error){toast(error.message,true);beep(180);}});
  $("#visitSupplier").addEventListener("click",()=>{currentSupplierStore=storeId;openLocation("supplier");});
  $("#venueClock").addEventListener("click",()=>{setGameSpeed(run.speed===0?1:0);openStore(storeId);});
}

function openPortfolio() {
  drawerContent.innerHTML=`<p class="eyebrow">Open-ended company growth</p><h2>Your business network</h2><p class="drawer-intro">Start with Atlantic Café, reinvest its live profits, then open new districts and grow each shop into a flagship.</p><div class="venue-grid">${STORES.map(store=>{
    const products=CATALOGUE.filter(p=>p.storeId===store.id),units=products.reduce((sum,p)=>sum+run.stock[p.id],0),potential=products.reduce((sum,p)=>sum+Math.min(run.stock[p.id],demandFor(run.prices[p.id],p.reference))*run.prices[p.id],0);
    const level=run.venues?.[store.id]??0;return `<button class="venue-card ${level===0?"locked-venue":""}" data-store="${store.id}" style="--venue:${store.color}"><span class="venue-icon">${level===0?"🔒":store.icon}</span><div><small>${store.short.toUpperCase()} · ${level===0?"LOCKED":`LEVEL ${level}`}</small><strong>${store.name}</strong><p>${store.pitch}</p></div><div class="venue-metrics"><span><b>${units}</b> stock</span><span><b>${level===0?formatEuro(STORE_UNLOCKS[store.id]):formatEuro(potential)}</b> ${level===0?"to open":"potential"}</span><span><b>${level}/3</b> level</span></div><em>${level===0?"View expansion →":"Manage venue →"}</em></button>`}).join("")}</div>`;
  drawerContent.querySelectorAll(".venue-card").forEach(button=>button.addEventListener("click",()=>openLocation(button.dataset.store)));
}

function startBuild(type,name,modules=[]) {
  pendingBuild={type,name,modules};closeDrawer();
  if(currentZone!=="campus")changeZone("campus",{x:21,y:18});else updateHUD();
  toast(`Build mode · place ${name} on a free tile`);beep(560);
}

function experiencePreview(moduleIds){
  const has=id=>moduleIds.includes(id);
  return `<div class="experience-preview"><div class="preview-top"><span>LIVE WORLD PREVIEW</span><b>${moduleIds.length} modules</b></div><div class="preview-scene">
    <i class="preview-base"></i>${has("surf")?'<i class="preview-surf"><b></b></i>':""}${has("music")?'<i class="preview-music"><b></b><b></b><b></b></i>':""}${has("sunset")?'<i class="preview-lookout"><b></b></i>':""}${has("social")?'<i class="preview-social"></i>':""}${has("shade")?'<i class="preview-shade"><b></b></i>':""}
  </div><p>${moduleIds.map(id=>EXPERIENCE_MODULES.find(item=>item.id===id)?.name).filter(Boolean).join(" + ")}</p></div>`;
}

function openBuildPanel() {
  activeLocation=null;
  const metrics=campusMetrics(run),stats=attractionStats(selectedExperienceModules),experienceCost=1200+stats.cost;
  drawerContent.innerHTML=`<p class="eyebrow">Campus construction · ${run.facilities.length} placed</p><h2>Build the campus</h2><p class="drawer-intro">Place paths, scenery and guest facilities directly in the world. Every build changes student needs and your campus rating.</p>
    <div class="management-strip"><div><small>CAMPUS RATING</small><strong>${metrics.rating}%</strong></div><div><small>EXPECTED GUESTS</small><strong>${metrics.guests}</strong></div><div><small>BUILD BUDGET</small><strong>${formatEuro(run.cash)}</strong></div></div>
    <div class="section-heading"><div><small>CONSTRUCTION CATALOGUE</small><strong>Paths, scenery &amp; amenities</strong></div><span>Click then place on map</span></div>
    <div class="build-grid">${FACILITY_CATALOGUE.map(item=>`<article class="build-card" style="--build:${item.color}"><span class="facility-preview facility-${item.id}"><i></i></span><div><strong>${item.name}</strong><p>${item.description}</p></div><button data-build="${item.id}" ${run.cash<item.cost?"disabled":""}>Build · ${formatEuro(item.cost)}</button></article>`).join("")}</div>
    <div class="section-heading"><div><small>SIGNATURE ATTRACTION</small><strong>Design a beach experience</strong></div><span>Choose modules piece by piece</span></div>
    <div class="experience-builder"><div class="experience-design">${experiencePreview(selectedExperienceModules)}<div class="module-grid">${EXPERIENCE_MODULES.map(item=>`<button class="module-button ${selectedExperienceModules.includes(item.id)?"selected":""}" data-module="${item.id}"><span>${item.icon}</span><strong>${item.name}</strong><small>${formatEuro(item.cost)} · +${item.excitement} excitement</small></button>`).join("")}</div></div><div class="rating-console"><small>LIVE DESIGN RATINGS</small><div><span>Excitement <b id="designExcitement">${stats.excitement}</b></span><i><em id="designExcitementBar" style="width:${stats.excitement}%"></em></i></div><div><span>Intensity <b id="designIntensity">${stats.intensity}</b></span><i><em id="designIntensityBar" style="width:${stats.intensity}%"></em></i></div><div><span>Comfort <b id="designComfort">${stats.comfort}</b></span><i><em id="designComfortBar" style="width:${stats.comfort}%"></em></i></div><p id="designVerdict">${experienceVerdict(stats)}</p><button class="action-button orange" id="buildExperience" ${run.cash<experienceCost?"disabled":""}>Place experience · <span id="experienceCost">${formatEuro(experienceCost)}</span></button></div></div>`;
  drawer.classList.add("open");drawer.setAttribute("aria-hidden","false");
  drawerContent.querySelectorAll("[data-build]").forEach(button=>button.addEventListener("click",()=>{const item=FACILITY_CATALOGUE.find(entry=>entry.id===button.dataset.build);startBuild(item.id,item.name);}));
  drawerContent.querySelectorAll("[data-module]").forEach(button=>button.addEventListener("click",()=>{const id=button.dataset.module;if(selectedExperienceModules.includes(id)&&selectedExperienceModules.length>1)selectedExperienceModules=selectedExperienceModules.filter(item=>item!==id);else if(!selectedExperienceModules.includes(id))selectedExperienceModules.push(id);openBuildPanel();}));
  $("#buildExperience").addEventListener("click",()=>startBuild("experience","Custom Beach Experience",selectedExperienceModules));
}

function experienceVerdict(stats){if(stats.intensity>78)return "Too intense — most students will avoid it.";if(stats.excitement<24)return "Too gentle — add a stronger headline module.";if(stats.comfort<35)return "Exciting, but comfort is hurting its appeal.";if(stats.excitement>65&&stats.intensity<70)return "Flagship potential — exciting without becoming punishing.";return "Balanced campus attraction with broad appeal.";}

function openGuestPanel() {
  activeLocation=null;const metrics=campusMetrics(run),needLabels={hunger:"Hunger",thirst:"Thirst",bladder:"Bladder",energy:"Energy",mood:"Happiness",cleanliness:"Cleanliness"};
  const weakest=Object.entries(metrics.needs).sort((a,b)=>a[1]-b[1])[0];
  drawerContent.innerHTML=`<p class="eyebrow">Guest intelligence · live campus sample</p><h2>Students & staff</h2><p class="drawer-intro">Guests stay longer when their needs are met. Build the right amenities and hire a compact operations crew.</p>
    <div class="guest-hero"><div><small>LIVE CAMPUS GUESTS</small><strong>${metrics.guests}</strong><em>More guests = more buyers</em></div><div><small>CAMPUS RATING</small><strong>${metrics.rating}%</strong><em>Directly boosts demand</em></div><div><small>SATISFACTION</small><strong>${metrics.satisfaction}%</strong><em>Weakest: ${needLabels[weakest[0]]}</em></div></div>
    <div class="section-heading"><div><small>GUEST NEEDS</small><strong>What students are feeling</strong></div><span>Updated instantly</span></div>
    <div class="needs-grid">${Object.entries(metrics.needs).map(([key,value])=>`<div><span>${needLabels[key]} <b>${value}%</b></span><i><em style="width:${value}%"></em></i></div>`).join("")}</div>
    <div class="guest-thought"><span>☺</span><div><small>LATEST GUEST THOUGHT</small><strong>“${guestThought(metrics,needLabels)}”</strong></div></div>
    <div class="section-heading"><div><small>OPERATIONS TEAM</small><strong>Hire permanent campus staff</strong></div><span>${Object.values(run.staff).reduce((a,b)=>a+b,0)} employed</span></div>
    <div class="staff-grid">${STAFF_CATALOGUE.map(role=>`<article><span>${role.icon}</span><div><strong>${role.name}</strong><p>${role.description}</p><small>${run.staff[role.id]||0} hired</small></div><button data-hire="${role.id}" ${run.cash<role.cost?"disabled":""}>Hire · ${formatEuro(role.cost)}</button></article>`).join("")}</div>
    <div class="section-heading"><div><small>BEST ATTRACTION</small><strong>Excitement ${metrics.attraction.excitement} · Intensity ${metrics.attraction.intensity} · Comfort ${metrics.attraction.comfort}</strong></div></div>`;
  drawer.classList.add("open");drawer.setAttribute("aria-hidden","false");
  drawerContent.querySelectorAll("[data-hire]").forEach(button=>button.addEventListener("click",()=>{try{save(hireStaff(run,button.dataset.hire));toast("Staff member hired for the run");beep(630);openGuestPanel();}catch(error){toast(error.message,true);}}));
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

function openLedger() {
  const gain=overallResult(run), inv=inventoryValue(run);
  const venueResults=STORES.map(store=>{const ids=new Set(CATALOGUE.filter(p=>p.storeId===store.id).map(p=>p.id));const items=run.history.flatMap(day=>day.items).filter(item=>ids.has(item.productId));return {store,units:items.reduce((s,i)=>s+i.unitsSold,0),revenue:items.reduce((s,i)=>s+i.revenue,0),profit:items.reduce((s,i)=>s+i.grossProfit,0)}});
  drawerContent.innerHTML=`<p class="eyebrow">Live company finance · autosaved</p><h2>Portfolio performance</h2><p class="drawer-intro">The business runs continuously. Compare shops, inspect closed days, and decide where to reinvest.</p>
    <div class="report-grid"><div><small>CASH</small><strong>${formatEuro(run.cash)}</strong></div><div><small>STOCK VALUE</small><strong>${formatEuro(inv)}</strong></div><div><small>NET WORTH CHANGE</small><strong class="${gain>=0?"result-positive":"result-negative"}">${formatEuro(gain)}</strong></div><div><small>TOTAL VISITORS</small><strong>${run.totalVisitors||0}</strong></div></div>
    <div class="section-heading"><div><small>VENUE COMPARISON</small><strong>All-time trading performance</strong></div><span>Day ${run.currentDay} · ${formatClock(run.clockMinutes)}</span></div>
    <div class="venue-kpis">${venueResults.map(v=>`<div style="border-top:3px solid ${v.store.color}"><small>${v.store.short.toUpperCase()}</small><strong>${formatEuro(v.profit)}</strong><span>${v.units} sold · ${formatEuro(v.revenue)} revenue</span></div>`).join("")}</div>
    <div class="section-heading"><div><small>DAILY LEDGER</small><strong>Closed trading days</strong></div><span>Latest 60 saved</span></div>
    <div class="history-list">${run.history.length?run.history.map(historyCard).reverse().join(""):`<div class="empty-state"><span>▤</span>The first day is still running.<br>Sales appear here automatically at 19:30.</div>`}</div>`;
}

function historyCard(day) {
  return `<details class="history-day"><summary><strong>Day ${day.day}</strong><span>+${formatEuro(day.totals.revenue)}</span></summary><div class="history-detail">${day.campus?`<div class="history-campus">${day.campus.guests} visitors · ${day.campus.rating}% rating · ${day.campus.satisfaction}% satisfied</div>`:""}<table class="mini-table"><thead><tr><th>Product</th><th>Sold</th><th>Revenue</th><th>COGS</th><th>Profit</th></tr></thead><tbody>${day.items.filter(item=>item.unitsSold>0).map(item=>{const p=CATALOGUE.find(x=>x.id===item.productId);return `<tr><td>${p.short}</td><td>${item.unitsSold}</td><td>${formatEuro(item.revenue)}</td><td>${formatEuro(item.cogs)}</td><td>${formatEuro(item.grossProfit)}</td></tr>`}).join("")||`<tr><td colspan="5">No sales recorded</td></tr>`}</tbody></table></div></details>`;
}

function confirmNewRun() {
  modalCard.className="modal-card";
  modalCard.innerHTML=`<p class="eyebrow">Replace your tycoon?</p><h2 id="modalTitle">Start a new campus company</h2><p>This replaces your saved business with <strong>€100.00 cash</strong>, Atlantic Café at level one, zero stock, no construction and an empty ledger. Cancelling keeps everything exactly as it is.</p><div class="modal-actions"><button class="action-button secondary" data-close>Cancel</button><button class="action-button orange" id="replaceRun">Replace company</button></div>`;
  showModal(); modalCard.querySelector("[data-close]").addEventListener("click",hideModal); $("#replaceRun").addEventListener("click",()=>{const fresh=createRun();currentZone="campus";camera.x=fresh.player.x;camera.y=fresh.player.y;targetPoint=null;pendingBuild=null;closeDrawer();save(fresh);hideModal();toast("Fresh venture started on the Nova coast");beep(610);});
}

function showModal(){modal.classList.remove("hidden");}
function hideModal(){modal.classList.add("hidden");}
function toast(message,error=false){const el=document.createElement("div");el.className=`toast ${error?"error":""}`;el.textContent=message;$("#toastRegion").append(el);setTimeout(()=>el.remove(),2800);}
function beep(frequency){if(!soundOn)return;try{const audio=new AudioContext();const osc=audio.createOscillator(),gain=audio.createGain();osc.frequency.value=frequency;gain.gain.setValueAtTime(.05,audio.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.12);osc.connect(gain).connect(audio.destination);osc.start();osc.stop(audio.currentTime+.12);}catch(_){} }
function setGameSpeed(speed){run.speed=Number(speed);localStorage.setItem(STORAGE_KEY,JSON.stringify(run));updateHUD();toast(run.speed===0?"Simulation paused":`Simulation running at ${run.speed}×`);}

window.addEventListener("resize",resize);
window.addEventListener("keydown",event=>{if(["w","a","s","d","arrowup","arrowdown","arrowleft","arrowright"].includes(event.key.toLowerCase())){keys.add(event.key.toLowerCase());targetPoint=null;event.preventDefault();}if(event.key.toLowerCase()==="e"&&modal.classList.contains("hidden")){const near=nearestLocation();if(near)interactWith(near[0]);}if(event.key==="Escape"){if(pendingBuild){pendingBuild=null;updateHUD();toast("Build cancelled");}hideModal();closeDrawer();}});
window.addEventListener("keyup",event=>{keys.delete(event.key.toLowerCase());localStorage.setItem(STORAGE_KEY,JSON.stringify(run));});
canvas.addEventListener("click",event=>{const rect=canvas.getBoundingClientRect(),cp=isoPoint(camera.x,camera.y);const ix=(event.clientX-rect.left-canvas.clientWidth/2)/camera.zoom+cp.x,iy=(event.clientY-rect.top-canvas.clientHeight/2)/camera.zoom+cp.y;const x=iy/TILE_H+ix/TILE_W,y=iy/TILE_H-ix/TILE_W;if(pendingBuild){try{if(currentZone!=="campus"||y>22.5)throw new Error("Build on a free campus tile above the beach line.");const next=placeFacility(run,pendingBuild.type,Math.round(x*2)/2,Math.round(y*2)/2,pendingBuild.modules);const built=pendingBuild.name;pendingBuild=null;save(next);toast(`${built} opened · campus rating ${campusMetrics(next).rating}%`);beep(700);}catch(error){toast(error.message,true);beep(180);}return;}const hit=zoneLocations().find(([,loc])=>Math.hypot(x-loc.x,y-loc.y)<1.35);if(hit)moveTo(hit[0]);else{const zone=activeZone();targetPoint={x:Math.max(zone.minX,Math.min(zone.maxX,x)),y:Math.max(zone.minY,Math.min(zone.maxY,y))};}});
$("#closeDrawer").addEventListener("click",closeDrawer);
$("#newRunButton").addEventListener("click",confirmNewRun);
$("#soundButton").addEventListener("click",()=>{soundOn=!soundOn;$("#soundButton").classList.toggle("muted",!soundOn);$("#soundButton").textContent=soundOn?"♪":"×";});
document.querySelectorAll(".quick-nav button").forEach(button=>button.addEventListener("click",()=>{
  const action=button.dataset.action;
  if(action==="buy")openLocation("supplier");
  if(action==="build")openBuildPanel();
  if(action==="stores"){activeLocation=null;openPortfolio();drawer.classList.add("open");drawer.setAttribute("aria-hidden","false");}
  if(action==="clock")setGameSpeed(run.speed===0?1:0);
  if(action==="guests")openGuestPanel();
  if(action==="ledger")openLocation("board");
}));
document.querySelectorAll("[data-speed]").forEach(button=>button.addEventListener("click",()=>setGameSpeed(button.dataset.speed)));
modal.addEventListener("click",event=>{if(event.target===modal)hideModal();});

resize(); updateHUD(); requestAnimationFrame(loop);
