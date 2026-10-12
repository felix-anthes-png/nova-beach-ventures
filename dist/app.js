import { CATALOGUE, STORES, STORE_UNLOCKS, FACILITY_CATALOGUE, STAFF_CATALOGUE, EXPERIENCE_MODULES, DAY_START, DAY_END, STORAGE_KEY, createRun, demandFor, parseEuro, buyStock, setPrice, inventoryValue, overallResult, formatEuro, upgradeVenue, unlockVenue, attractionStats, campusMetrics, crowdPeak, advanceTycoon, placeFacility, hireStaff } from "./core.js";

const $ = selector => document.querySelector(selector);
const canvas = $("#world");
const ctx = canvas.getContext("2d");
const drawer = $("#drawer");
const drawerContent = $("#drawerContent");
const modal = $("#modal");
const modalCard = $("#modalCard");
const keys = new Set();
const loadArt = source => { const image=new Image(); image.decoding="async"; image.src=source; return image; };
const art = {
  buildings:loadArt("./assets/v3/buildings.webp"),
  characters:loadArt("./assets/v3/characters.webp"),
  features:loadArt("./assets/v3/features.webp")
};
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

function drawSheetSprite(image,col,row,cols,rows,x,y,width,height,anchor=.9,options={}){
  if(!image.complete||!image.naturalWidth)return false;
  const p=isoPoint(x,y,options.z||0),sourceWidth=image.naturalWidth/cols,sourceHeight=image.naturalHeight/rows;
  ctx.save();ctx.globalAlpha=options.alpha??1;ctx.imageSmoothingEnabled=true;
  if(options.grade)ctx.filter="saturate(.86) contrast(.97) brightness(1.02)";
  if(options.mirror){ctx.translate(p.x,p.y);ctx.scale(-1,1);ctx.drawImage(image,col*sourceWidth,row*sourceHeight,sourceWidth,sourceHeight,-width/2,-height*anchor,width,height);}
  else ctx.drawImage(image,col*sourceWidth,row*sourceHeight,sourceWidth,sourceHeight,p.x-width/2,p.y-height*anchor,width,height);
  ctx.restore();return true;
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
      else if(y>=11||(x>=18&&x<=23)||(x>=5&&x<=8&&y>=8)||(x>=33&&x<=36&&y>=8))color=(x+y)%2?"#c9cbbb":"#d2d3c4";
      else if((x+y)%2)color="#75a463";
    } else color=(x+y)%2?zone.floor:mixColor(zone.floor,"#ffffff",.07);
    drawTile(x,y,color,depth);
    if(zone.outdoor&&y===25){const p=isoPoint(x+.5,y+.5,5);ctx.strokeStyle="rgba(255,255,255,.55)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(p.x-24,p.y+Math.sin(t*.002+x)*2);ctx.lineTo(p.x+24,p.y+Math.sin(t*.002+x+1)*2);ctx.stroke();}
  });
}

function mixColor(a,b,amount){const value=color=>color.match(/\w\w/g).map(hex=>parseInt(hex,16)),x=value(a),y=value(b);return `rgb(${x.map((channel,index)=>Math.round(channel+(y[index]-channel)*amount)).join(",")})`;}

function drawTile(x,y,color,depth=0){const a=isoPoint(x,y),b=isoPoint(x+1,y),c=isoPoint(x+1,y+1),d=isoPoint(x,y+1);ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.lineTo(c.x,c.y);ctx.lineTo(d.x,d.y);ctx.closePath();ctx.fill();ctx.strokeStyle="rgba(20,48,45,.035)";ctx.lineWidth=.65;ctx.stroke();if(depth){ctx.fillStyle="rgba(45,67,54,.16)";ctx.beginPath();ctx.moveTo(d.x,d.y);ctx.lineTo(c.x,c.y);ctx.lineTo(c.x,c.y+depth);ctx.lineTo(d.x,d.y+depth);ctx.closePath();ctx.fill();}}

function drawCampus(t) {
  if(!drawSheetSprite(art.buildings,0,0,3,2,21,10.2,520,385,.91,{grade:true}))drawBlock(13,2,16,7,160,"#f1eee2","#bcbcaf","#a8aa9e");
  drawWorldLabel(21,8.8,139,"NOVA COAST CAMPUS","#f5c95e");
}

function drawLibrary(){
  if(!drawSheetSprite(art.buildings,1,0,3,2,6.1,8.3,275,238,.91,{grade:true}))drawBlock(2,2.5,8,5.2,100,"#e7dfc7","#a8a18e","#c2baa5");
  drawWorldLabel(6,7.7,92,"LEARNING CENTER","#64cbc8");
}

function drawMercadoExterior(){if(!drawSheetSprite(art.buildings,2,0,3,2,7,14.8,300,230,.91,{grade:true}))drawBlock(3.2,8,7.5,4.8,82,"#ead9b1","#b89b69","#c6aa78");drawWorldLabel(7,13.4,85,"MERCADO SUPPLY","#f5c95e");}

function drawStudentHub(){
  if(!drawSheetSprite(art.buildings,0,1,3,2,35,11.8,330,220,.91,{grade:true}))drawBlock(31,5,8,6,118,"#efe8d5","#b7ae98","#d0c7b1");
  drawWorldLabel(35,10.6,91,"STUDENT HUB","#ff7458");
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

function drawRoomActors(t){
  const zone=activeZone(),actors=[{depth:1,draw:()=>drawRoomShell(zone)}];
  const furniture=zone.id==="mercado"?[[2.2,3,3,.8,34,"#b58b55"],[9.7,3,3,.8,34,"#b58b55"],[2,6.5,2.4,.8,28,"#7d6749"],[10.5,6.5,2.4,.8,28,"#7d6749"]]:zone.id==="academy"?[[2.2,3.1,2.4,1,28,"#d7a26f"],[10.4,3.1,2.4,1,28,"#d7a26f"],[2.4,6.4,2.2,1.1,24,"#6fa3a2"],[10.4,6.4,2.2,1.1,24,"#6fa3a2"]]:[[2,2.8,2.3,1,31,"#67c7c4"],[10.7,2.8,2.3,1,31,"#67c7c4"],[2.3,6.5,2.6,1.2,24,"#8e7bbb"],[9.9,7,2.8,1,30,"#4d7180"]];
  furniture.forEach((item,index)=>actors.push({depth:item[0]+item[1],draw:()=>drawFurniture(...item,index)}));
  const roomPeople=zone.id==="mercado"?[[4.8,5.4,"#f5c95e",.5],[10,5.5,"#ff8060",1.4]]:zone.id==="academy"?[[4.5,6,"#75c0c8",.3],[10.2,5.7,"#e6b45f",1.7],[6.2,3,"#ad75a6",2.5]]:[[4.3,6.3,"#ff8060",.8],[9.2,4.2,"#75c0c8",1.9],[11.8,6.2,"#bce65f",2.7]];
  roomPeople.forEach((person,index)=>actors.push({depth:person[0]+person[1],draw:()=>drawStudent(person,t,index)}));
  return actors;
}

function drawRoomShell(zone){drawBlock(0,0,zone.width,1,105,mixColor(zone.accent,"#ffffff",.72),mixColor(zone.accent,"#000000",.35),mixColor(zone.accent,"#ffffff",.52));drawBlock(0,0,1,zone.height,88,mixColor(zone.accent,"#ffffff",.75),mixColor(zone.accent,"#000000",.42),mixColor(zone.accent,"#ffffff",.57));const p=isoPoint(zone.width/2,.75,84);roundedRect(p.x-68,p.y-10,136,20,3,"#173743");ctx.fillStyle="#fff";ctx.textAlign="center";ctx.font="800 8px DM Mono";ctx.fillText(zone.name.toUpperCase(),p.x,p.y+3);}
function drawFurniture(x,y,w,h,z,color,index){drawBlock(x,y,w,h,z,mixColor(color,"#ffffff",.18),mixColor(color,"#000000",.28),mixColor(color,"#000000",.12));const p=isoPoint(x+w/2,y+h/2,z+4);ctx.fillStyle=index%2?"#f4e7c8":"#d9f0e3";ctx.beginPath();ctx.arc(p.x,p.y,5,0,Math.PI*2);ctx.fill();}

function drawBlock(x,y,w,h,z,top,right,left){const a=isoPoint(x,y,z),b=isoPoint(x+w,y,z),c=isoPoint(x+w,y+h,z),d=isoPoint(x,y+h,z),ba=isoPoint(x,y),bb=isoPoint(x+w,y),bc=isoPoint(x+w,y+h),bd=isoPoint(x,y+h);ctx.fillStyle=left;ctx.beginPath();ctx.moveTo(d.x,d.y);ctx.lineTo(c.x,c.y);ctx.lineTo(bc.x,bc.y);ctx.lineTo(bd.x,bd.y);ctx.closePath();ctx.fill();ctx.fillStyle=right;ctx.beginPath();ctx.moveTo(b.x,b.y);ctx.lineTo(c.x,c.y);ctx.lineTo(bc.x,bc.y);ctx.lineTo(bb.x,bb.y);ctx.closePath();ctx.fill();ctx.fillStyle=top;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.lineTo(c.x,c.y);ctx.lineTo(d.x,d.y);ctx.closePath();ctx.fill();ctx.strokeStyle="rgba(15,35,40,.22)";ctx.stroke();}

const campusTrees=[[2,8,.9],[5,14,.8],[11,19,.82],[14,22,.9],[18,10,.72],[25,12,.76],[29,19,.88],[32,9,.83],[39,12,.92],[37,19,.8],[6,21,.75],[24,22,.72],[40,21,.86]];
const students=[[8,17,"#f4b858",.2],[11,13,"#dc6958",1.1],[15,18,"#75c0c8",2],[20,15,"#8b74bd",2.8],[24,12,"#e5e4d8",3.6],[29,17,"#ff8060",4.2],[33,19,"#75c0c8",5],[36,12,"#bce65f",5.8],[18,21,"#f5c95e",6.4],[25,20,"#ad75a6",7.1],[12,21,"#dce5db",7.8],[31,10,"#ff9472",8.5]];
const crowdColors=["#f5c95e","#ff8060","#64cbc8","#9a7bc1","#bce65f","#f0e9dc","#e6a769"];

function liveCrowd(t){
  const peak=crowdPeak(run.clockMinutes),metrics=campusMetrics(run),actors=[],queueAnchors={cafe:[20.5,13.8],snack:[27.7,21.1],merch:[34.2,15.3]};
  const roaming=Math.min(30,Math.max(5,Math.round(metrics.guests*peak.multiplier*.34)));
  for(let i=0;i<roaming;i++){const x=3+((i*7.7+t*.00032)%36),y=10+((i*4.9+Math.sin(t*.00018+i)*1.3)%11),person=[x,y,crowdColors[i%crowdColors.length],i*.67];actors.push({depth:x+y,draw:()=>drawStudent(person,t,i+30)});}
  STORES.filter(store=>(run.venues?.[store.id]??0)>0).forEach((store,storeIndex)=>{const anchor=queueAnchors[store.id],stock=CATALOGUE.filter(product=>product.storeId===store.id).reduce((sum,product)=>sum+run.stock[product.id],0),count=stock?Math.min(8,Math.max(1,Math.round(peak.multiplier*2.4))):0;for(let i=0;i<count;i++){const x=anchor[0]-(store.id==="snack"?i*.32:0),y=anchor[1]+(store.id==="snack"?i*.12:i*.38),person=[x,y,crowdColors[(i+storeIndex*2)%crowdColors.length],2+i*.21];actors.push({depth:x+y,draw:()=>drawStudent(person,t,i+70+storeIndex*10)});}if(count)actors.push({depth:anchor[0]+anchor[1]-.1,draw:()=>drawQueueLabel(anchor[0],anchor[1],store.short,count)});});
  return actors;
}

function drawQueueLabel(x,y,label,count){const p=isoPoint(x,y,62);roundedRect(p.x-44,p.y-10,88,20,4,"rgba(10,37,46,.92)");ctx.fillStyle="#bce65f";ctx.textAlign="center";ctx.font="700 7px DM Mono";ctx.fillText(`${label.toUpperCase()} · ${count} IN LINE`,p.x,p.y+3);}

function drawTree(x,y,scale,t){const p=isoPoint(x,y,4),sway=Math.sin(t*.001)*2;ctx.save();ctx.translate(p.x,p.y);ctx.scale(scale,scale);ctx.fillStyle="rgba(10,45,38,.16)";ctx.beginPath();ctx.ellipse(7,4,27,8,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle="#76563b";ctx.lineWidth=7;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(-2,-30,sway,-64);ctx.stroke();ctx.strokeStyle="rgba(255,210,145,.34)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-2,-3);ctx.quadraticCurveTo(-4,-31,sway-2,-61);ctx.stroke();ctx.translate(sway,-65);for(let a=0;a<7;a++){ctx.save();ctx.rotate(a*Math.PI*2/7+Math.sin(t*.0007+a)*.035);ctx.fillStyle=a%2?"#2f8358":"#3d9668";ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(18,-7,37,0);ctx.quadraticCurveTo(19,8,0,3);ctx.closePath();ctx.fill();ctx.restore();}ctx.fillStyle="#87633f";ctx.beginPath();ctx.arc(0,0,5,0,Math.PI*2);ctx.fill();ctx.restore();}

function drawPlacedFacility(facility,t,index){
  const blueprint=FACILITY_CATALOGUE.find(item=>item.id===facility.type),color=blueprint?.color||"#f5c95e",p=isoPoint(facility.x,facility.y,4);
  if(facility.type==="path"){drawTile(facility.x-.5,facility.y-.5,"#d7d3c2",2);return;}
  if(facility.type==="scenery"){drawTree(facility.x,facility.y,.55,t+index*90);return;}
  if(facility.type==="bench"){drawBlock(facility.x-.7,facility.y-.25,1.4,.5,18,"#d7a968","#71583d","#8c6b47");return;}
  if(facility.type==="bin"){drawBlock(facility.x-.28,facility.y-.28,.56,.56,34,color,"#39734a","#4f8d5b");}
  else if(facility.type==="water"){drawBlock(facility.x-.35,facility.y-.35,.7,.7,36,color,"#378c9b","#4fa7b4");const drop=isoPoint(facility.x,facility.y,48);ctx.fillStyle="#d6fbff";ctx.beginPath();ctx.arc(drop.x,drop.y,5,0,Math.PI*2);ctx.fill();}
  else if(facility.type==="restroom"){drawBlock(facility.x-.62,facility.y-.5,1.24,1,58,"#e9e9df","#567590","#6c8aa3");const sign=isoPoint(facility.x,facility.y,43);ctx.fillStyle="#173743";ctx.textAlign="center";ctx.font="900 8px DM Mono";ctx.fillText("WC",sign.x,sign.y);}
  else if(facility.type==="foodGarden"){drawBlock(facility.x-.8,facility.y-.55,1.6,1.1,38,"#f4ead4","#b7ad99","#cbc2ad");drawBlock(facility.x-.9,facility.y-.65,1.8,.3,51,color,"#a8633c","#bd754a");}
  else if(facility.type==="experience"){
    const stats=attractionStats(facility.modules),height=45+stats.intensity*.42;
    drawBlock(facility.x-1,facility.y-.7,2,1.4,23,"#314e59","#1c3540","#28434e");
    const tower=isoPoint(facility.x,facility.y,height);ctx.strokeStyle="#f5c95e";ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(tower.x-34,tower.y+height);ctx.lineTo(tower.x-18,tower.y);ctx.lineTo(tower.x+18,tower.y);ctx.lineTo(tower.x+34,tower.y+height);ctx.stroke();ctx.fillStyle="#ff7458";ctx.beginPath();ctx.arc(tower.x,tower.y+Math.sin(t*.004)*3,12,0,Math.PI*2);ctx.fill();
    const tag=isoPoint(facility.x,facility.y,height+38);roundedRect(tag.x-54,tag.y-10,108,20,4,"rgba(10,37,46,.93)");ctx.fillStyle="#fff";ctx.textAlign="center";ctx.font="700 7px DM Mono";ctx.fillText(`EXC ${stats.excitement} · INT ${stats.intensity}`,tag.x,tag.y+3);
  }
  if(blueprint){const icon=isoPoint(facility.x,facility.y,72);roundedRect(icon.x-13,icon.y-13,26,26,6,"rgba(10,37,46,.9)");ctx.fillStyle="#fff";ctx.textAlign="center";ctx.font="800 8px DM Mono";ctx.fillText(blueprint.icon,icon.x,icon.y+3);}
}

function drawStudent(s,t,i){
  const motion=Math.sin(t*.0024+s[3]),x=s[0]+motion*.12,y=s[1],variant=Math.abs(i)%8;
  if(drawSheetSprite(art.characters,variant%4,Math.floor(variant/4),4,2,x,y,43,63,.985,{mirror:(i%5)===0,alpha:.97,z:4-Math.abs(Math.sin(t*.0045+i))*.65}))return;
  const p=isoPoint(x,y,4);
  ctx.save();ctx.translate(p.x,p.y);ctx.fillStyle=s[2];ctx.fillRect(-5,-24,10,18);ctx.fillStyle="#b97858";ctx.beginPath();ctx.arc(0,-29,5,0,Math.PI*2);ctx.fill();ctx.restore();
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
    ctx.save();if(locked){ctx.globalAlpha=.46;ctx.filter="grayscale(1)";}const scale=1+(Math.max(1,level)-1)*.09;
    if(id==="cafe")drawSheetSprite(art.buildings,1,1,3,2,loc.x,loc.y+.9,180*scale,164*scale,.92,{grade:true});
    if(id==="snack")drawSheetSprite(art.buildings,2,1,3,2,loc.x,loc.y+.45,170*scale,152*scale,.92,{grade:true});
    if(id==="merch")drawSheetSprite(art.features,0,0,2,1,loc.x,loc.y+.7,210*scale,151*scale,.92,{grade:true});
    ctx.restore();
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
  if(drawSheetSprite(art.features,1,0,2,1,run.player.x,run.player.y,96,80,.99,{mirror:facing.x+facing.y<0,z:4+bob}))return;
  drawStudent([run.player.x,run.player.y,"#bce65f",0],t,0);
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

function openBuildPanel() {
  activeLocation=null;
  const metrics=campusMetrics(run),stats=attractionStats(selectedExperienceModules),experienceCost=1200+stats.cost;
  drawerContent.innerHTML=`<p class="eyebrow">Campus construction · ${run.facilities.length} placed</p><h2>Build the campus</h2><p class="drawer-intro">Place paths, scenery and guest facilities directly in the world. Every build changes student needs and your campus rating.</p>
    <div class="management-strip"><div><small>CAMPUS RATING</small><strong>${metrics.rating}%</strong></div><div><small>EXPECTED GUESTS</small><strong>${metrics.guests}</strong></div><div><small>BUILD BUDGET</small><strong>${formatEuro(run.cash)}</strong></div></div>
    <div class="section-heading"><div><small>CONSTRUCTION CATALOGUE</small><strong>Paths, scenery &amp; amenities</strong></div><span>Click then place on map</span></div>
    <div class="build-grid">${FACILITY_CATALOGUE.map(item=>`<article class="build-card" style="--build:${item.color}"><span>${item.icon}</span><div><strong>${item.name}</strong><p>${item.description}</p></div><button data-build="${item.id}" ${run.cash<item.cost?"disabled":""}>Build · ${formatEuro(item.cost)}</button></article>`).join("")}</div>
    <div class="section-heading"><div><small>SIGNATURE ATTRACTION</small><strong>Design a beach experience</strong></div><span>Choose modules piece by piece</span></div>
    <div class="experience-builder"><div class="module-grid">${EXPERIENCE_MODULES.map(item=>`<button class="module-button ${selectedExperienceModules.includes(item.id)?"selected":""}" data-module="${item.id}"><span>${item.icon}</span><strong>${item.name}</strong><small>${formatEuro(item.cost)} · +${item.excitement} excitement</small></button>`).join("")}</div><div class="rating-console"><small>LIVE DESIGN RATINGS</small><div><span>Excitement <b id="designExcitement">${stats.excitement}</b></span><i><em id="designExcitementBar" style="width:${stats.excitement}%"></em></i></div><div><span>Intensity <b id="designIntensity">${stats.intensity}</b></span><i><em id="designIntensityBar" style="width:${stats.intensity}%"></em></i></div><div><span>Comfort <b id="designComfort">${stats.comfort}</b></span><i><em id="designComfortBar" style="width:${stats.comfort}%"></em></i></div><p id="designVerdict">${experienceVerdict(stats)}</p><button class="action-button orange" id="buildExperience" ${run.cash<experienceCost?"disabled":""}>Place experience · <span id="experienceCost">${formatEuro(experienceCost)}</span></button></div></div>`;
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
