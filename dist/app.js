import { CATALOGUE, STORES, CAMPUS_DAYS, MAX_DAYS, STORAGE_KEY, createRun, demandFor, parseEuro, buyStock, setPrice, tradeDay, inventoryValue, overallResult, formatEuro, upgradeVenue } from "./core.js";

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
let tradingInProgress = false;
let skipSimulation = false;
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
    if (parsed && parsed.version === 1 && Array.isArray(parsed.history)) {
      if (!parsed.player) parsed.player = { x:21, y:18, zone:"campus" };
      if (!parsed.player.zone || !ZONES[parsed.player.zone]) parsed.player = { x:Math.min(41,Math.max(1,parsed.player.x||21)), y:Math.min(25.7,Math.max(7.5,parsed.player.y||18)), zone:"campus" };
      CATALOGUE.forEach(product => {
        if (!Number.isInteger(parsed.stock[product.id])) parsed.stock[product.id] = 0;
        if (!Number.isInteger(parsed.prices[product.id])) parsed.prices[product.id] = product.reference;
      });
      if (!parsed.venues) parsed.venues = { cafe: 1, snack: 1, merch: 1 };
      if (!Number.isInteger(parsed.reputation)) parsed.reputation = 0;
      if (!Array.isArray(parsed.upgrades)) parsed.upgrades = [];
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
  $("#zoneName").textContent=zone.name;
  $("#zoneSub").textContent=zone.sub;
  $("#miniMapTitle").textContent=zone.outdoor?"CAMPUS MAP":"ROOM PLAN";
  $("#game").classList.toggle("indoors",!zone.outdoor);
  $("#weatherIcon").textContent=zone.outdoor?"☀":"⌂";
  $("#weatherTemp").textContent=zone.outdoor?"24°":"IN";
  $("#weatherNote").textContent=zone.outdoor?"13:40 · ATLANTIC BREEZE":zone.sub;
  document.querySelectorAll("[data-zone-indicator]").forEach(item=>item.classList.toggle("active",item.dataset.zoneIndicator===zone.id));
  $("#dayStat").textContent = run.completed ? "5 / 5" : `${run.currentDay} / 5`;
  $("#cashStat").textContent = formatEuro(run.cash);
  $("#repStat").textContent = `${run.reputation || 0} ★`;
  $("#dayDots").innerHTML = Array.from({ length: MAX_DAYS }, (_, i) => {
    const day = i + 1;
    return `<span class="day-dot ${day <= run.history.length ? "done" : ""} ${!run.completed && day === run.currentDay ? "current" : ""}"></span>`;
  }).join("");
  const totalStock = Object.values(run.stock).reduce((a, b) => a + b, 0);
  const unlockedProducts = CATALOGUE.filter(product => (run.venues?.[product.storeId] || 1) >= (product.tier || 1));
  const demandCapacity = unlockedProducts.reduce((sum, product) => sum + demandFor(run.prices[product.id], product.reference), 0);
  const nextVenue = STORES.find(store => (run.venues?.[store.id] || 1) < 3);
  $("#pulseDemand").textContent = `${demandCapacity} units`;
  $("#pulseVenues").textContent = `3 districts · ${unlockedProducts.length} products`;
  $("#pulseMilestone").textContent = run.completed ? "Season complete" : nextVenue ? `Upgrade ${nextVenue.short}` : "All venues flagship";
  const campusDay = CAMPUS_DAYS[(run.completed ? MAX_DAYS : run.currentDay) - 1];
  $("#eventIcon").textContent = campusDay.icon;
  $("#eventDistrict").textContent = `${run.completed ? "FINAL DAY" : "TODAY"} · ${campusDay.district.toUpperCase()}`;
  $("#eventTitle").textContent = campusDay.title;
  $("#eventObjective").textContent = campusDay.objective.label;
  let title = "Build your first trading plan", text = "Use the Stock tool, then prepare prices across your three venues.", progress = 8;
  if (run.completed) {
    title = overallResult(run) >= 0 ? "Venture complete!" : "A useful first run";
    text = `Your five-day result is ${formatEuro(overallResult(run))}. Open the ledger for the full story.`;
    progress = 100;
  } else if (totalStock > 0) {
    title = `Prepare day ${run.currentDay}`;
    text = "Review each venue, balance stock and margins, then open the campus for trading.";
    progress = 15 + run.history.length * 17;
  } else if (run.history.length > 0) {
    title = `Restock for day ${run.currentDay}`;
    text = "Yesterday's inventory is gone. Reinvest your cash, refine prices and grow the venue network.";
    progress = 15 + run.history.length * 17;
  }
  $("#missionTitle").textContent = title;
  $("#missionText").textContent = text;
  $("#missionProgress").style.width = `${progress}%`;
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

function isoPoint(x,y,z=0){return {x:(x-y)*TILE_W/2,y:(x+y)*TILE_H/2-z};}

function roundedRect(x, y, w, h, r, fill) {
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fillStyle = fill; ctx.fill();
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
    {depth:8,draw:()=>drawLibrary()},
    {depth:15,draw:()=>drawMercadoExterior()},
    {depth:18,draw:()=>drawCampus(t)},
    {depth:28,draw:()=>drawStudentHub()},
    {depth:43,draw:()=>drawBeachStage(t)},
    ...campusTrees.map((tree,i)=>({depth:tree[0]+tree[1],draw:()=>drawTree(tree[0],tree[1],tree[2],t+i*170)})),
    ...students.map((student,i)=>({depth:student[0]+student[1],draw:()=>drawStudent(student,t,i)}))
  ]:drawRoomActors(t);
  const actors=[...worldActors,
    ...zoneLocations().map(([id,location])=>({depth:location.x+location.y,draw:()=>drawLocation(id)})),
    {depth:run.player.x+run.player.y,draw:()=>drawPlayer(t)}
  ].sort((a,b)=>a.depth-b.depth);
  actors.forEach(actor => actor.draw());
  ctx.restore();
}

function drawTerrain(t) {
  const zone=activeZone(),tiles=[];for(let y=0;y<zone.height;y++)for(let x=0;x<zone.width;x++)tiles.push({x,y,d:x+y});tiles.sort((a,b)=>a.d-b.d);
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

function drawTile(x,y,color,depth=0){const a=isoPoint(x,y),b=isoPoint(x+1,y),c=isoPoint(x+1,y+1),d=isoPoint(x,y+1);ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.lineTo(c.x,c.y);ctx.lineTo(d.x,d.y);ctx.closePath();ctx.fill();ctx.strokeStyle="rgba(20,48,45,.08)";ctx.stroke();if(depth){ctx.fillStyle="rgba(45,67,54,.2)";ctx.beginPath();ctx.moveTo(d.x,d.y);ctx.lineTo(c.x,c.y);ctx.lineTo(c.x,c.y+depth);ctx.lineTo(d.x,d.y+depth);ctx.closePath();ctx.fill();}}

function drawCampus(t) {
  drawBlock(13,2,16,7,160,"#f1eee2","#bcbcaf","#a8aa9e");
  drawBlock(14,3,14,5.4,126,"#214957","#173743","#102c35");
  for(let i=0;i<11;i++){const p=isoPoint(14.8+i*1.15,8.35,78);ctx.fillStyle=i%2?"#78aab2":"#5e919c";ctx.fillRect(p.x-16,p.y-22,30,18);}
  const sign=isoPoint(21,8.75,116);roundedRect(sign.x-70,sign.y-13,140,24,2,"#f4efe0");ctx.fillStyle="#173743";ctx.textAlign="center";ctx.font="900 15px Manrope";ctx.fillText("NOVA SBE",sign.x,sign.y+4);
}

function drawLibrary(){
  drawBlock(2,2.5,8,5.2,100,"#e7dfc7","#a8a18e","#c2baa5");
  drawBlock(2.8,3.2,6.4,3.7,76,"#2b5a67","#173d49","#204c58");
  const p=isoPoint(6,7.1,61);roundedRect(p.x-52,p.y-9,104,18,2,"#fff5dc");ctx.fillStyle="#173743";ctx.textAlign="center";ctx.font="800 7px DM Mono";ctx.fillText("LEARNING CENTER",p.x,p.y+3);
}

function drawMercadoExterior(){drawBlock(3.2,8,7.5,4.8,82,"#ead9b1","#b89b69","#c6aa78");for(let i=0;i<4;i++){const p=isoPoint(4.1+i*1.7,12.7,55);ctx.fillStyle=i%2?"#f5c95e":"#fff2ce";ctx.fillRect(p.x-20,p.y-10,40,10);}const p=isoPoint(7,12.9,68);roundedRect(p.x-43,p.y-9,86,18,2,"#173743");ctx.fillStyle="#fff";ctx.textAlign="center";ctx.font="800 7px DM Mono";ctx.fillText("MERCADO",p.x,p.y+3);}

function drawStudentHub(){
  drawBlock(31,5,8,6,118,"#efe8d5","#b7ae98","#d0c7b1");
  drawBlock(31.8,5.8,6.4,4.2,82,"#397889","#225a69","#2c6978");
  for(let i=0;i<5;i++){const p=isoPoint(32.6+i*1.15,10.02,60);ctx.fillStyle=i%2?"#ffd068":"#ff8060";ctx.fillRect(p.x-12,p.y-8,24,8);}
  const p=isoPoint(35,10.6,69);ctx.fillStyle="#fff";ctx.textAlign="center";ctx.font="800 8px DM Mono";ctx.fillText("STUDENT HUB",p.x,p.y);
}

function drawBeachStage(t){
  drawBlock(18,22.2,5,2,32,"#324f5a","#1b3945","#274550");
  const p=isoPoint(20.5,23.2,64);ctx.strokeStyle="#173743";ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(p.x-55,p.y+24);ctx.lineTo(p.x-55,p.y-35);ctx.moveTo(p.x+55,p.y+24);ctx.lineTo(p.x+55,p.y-35);ctx.stroke();ctx.fillStyle="#ffcf5e";ctx.beginPath();ctx.moveTo(p.x-58,p.y-35);ctx.lineTo(p.x+58,p.y-35);ctx.lineTo(p.x+44,p.y-18);ctx.lineTo(p.x-44,p.y-18);ctx.closePath();ctx.fill();ctx.fillStyle="#173743";ctx.textAlign="center";ctx.font="800 7px DM Mono";ctx.fillText("VENTURE WEEK STAGE",p.x,p.y-23);
  for(let i=0;i<3;i++){ctx.fillStyle=["#ff7b5b","#6ac8c4","#b4d866"][i];ctx.beginPath();ctx.arc(p.x-20+i*20,p.y-8+Math.sin(t*.003+i)*2,4,0,Math.PI*2);ctx.fill();}
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

function drawTree(x,y,scale,t){const p=isoPoint(x,y,4);ctx.save();ctx.translate(p.x,p.y);ctx.scale(scale,scale);ctx.fillStyle="rgba(10,45,38,.2)";ctx.beginPath();ctx.ellipse(8,4,28,9,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle="#73583d";ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.sin(t*.001)*2,-65);ctx.stroke();ctx.fillStyle="#2f7c52";for(let a=0;a<6;a++){ctx.save();ctx.rotate(a*1.05);ctx.beginPath();ctx.ellipse(17,-66,23,7,0,0,Math.PI*2);ctx.fill();ctx.restore()}ctx.restore();}

function drawStudent(s,t,i){const x=s[0]+Math.sin(t*.0004+s[3])*.25,y=s[1],c=s[2],p=isoPoint(x,y,5);ctx.save();ctx.translate(p.x,p.y);ctx.fillStyle="rgba(7,35,39,.2)";ctx.beginPath();ctx.ellipse(0,3,10,4,0,0,Math.PI*2);ctx.fill();const step=Math.sin(t*.007+i);ctx.strokeStyle="#18323a";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-2,-7);ctx.lineTo(-4+step*2,2);ctx.moveTo(2,-7);ctx.lineTo(4-step*2,2);ctx.stroke();ctx.fillStyle=c;ctx.fillRect(-6,-26,12,19);ctx.fillStyle="#b97858";ctx.beginPath();ctx.arc(0,-32,5,0,Math.PI*2);ctx.fill();ctx.restore();}

function drawLocation(id) {
  const loc=locations[id], near=Math.hypot(run.player.x-loc.x,run.player.y-loc.y)<1.65;
  if(loc.kind==="door"){
    const p=isoPoint(loc.x,loc.y,5),pulse=3+Math.sin(lastTime*.005)*2;
    ctx.fillStyle="rgba(9,42,51,.24)";ctx.beginPath();ctx.ellipse(p.x,p.y,44+pulse,17+pulse/2,0,0,Math.PI*2);ctx.fill();
    drawBlock(loc.x-.58,loc.y-.28,1.16,.56,61,mixColor(loc.color,"#ffffff",.18),"#183d47","#214e58");
    const door=isoPoint(loc.x,loc.y,48);roundedRect(door.x-20,door.y-31,40,46,18,"#173743");roundedRect(door.x-14,door.y-25,28,36,14,loc.color);
    ctx.fillStyle="#173743";ctx.beginPath();ctx.arc(door.x+8,door.y-6,2.5,0,Math.PI*2);ctx.fill();
    if(near){ctx.strokeStyle="#fff1a2";ctx.lineWidth=3;ctx.setLineDash([7,5]);ctx.beginPath();ctx.ellipse(p.x,p.y,58,21,0,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);}
    const tag=isoPoint(loc.x,loc.y,105);roundedRect(tag.x-54,tag.y-11,108,22,5,"rgba(10,37,46,.94)");ctx.fillStyle=loc.color;ctx.fillRect(tag.x-54,tag.y-11,5,22);ctx.fillStyle="#fff";ctx.textAlign="center";ctx.font="700 7px DM Mono";ctx.fillText(`${loc.title} · ${loc.sub}`,tag.x+3,tag.y+3);
    return;
  }
  const level=run.venues?.[id]||1, size=1.45+level*.18;
  drawBlock(loc.x-size/2,loc.y-size*.42,size,size*.84,48+level*8,"#f4ead4","#b7ad99","#cbc2ad");
  drawBlock(loc.x-size*.62,loc.y-size*.5,size*1.24,.32,64+level*9,loc.color,"#a64f43","#bf6152");
  if(level>1){const flag=isoPoint(loc.x+.5,loc.y-.45,86+level*8);ctx.strokeStyle="#173743";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(flag.x,flag.y+24);ctx.lineTo(flag.x,flag.y-24);ctx.stroke();ctx.fillStyle=loc.color;ctx.beginPath();ctx.moveTo(flag.x,flag.y-23);ctx.lineTo(flag.x+22,flag.y-16);ctx.lineTo(flag.x,flag.y-8);ctx.closePath();ctx.fill();}
  const p=isoPoint(loc.x,loc.y,39);ctx.fillStyle="#173743";ctx.fillRect(p.x-29,p.y-18,58,23);ctx.fillStyle="#fff";ctx.textAlign="center";ctx.font="800 7px DM Mono";ctx.fillText(loc.sub,p.x,p.y-5);
  if(near){const q=isoPoint(loc.x,loc.y,3);ctx.strokeStyle="#ffd454";ctx.lineWidth=3;ctx.setLineDash([7,5]);ctx.beginPath();ctx.ellipse(q.x,q.y,55+Math.sin(lastTime*.004)*2,20,0,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);}
  const tag=isoPoint(loc.x,loc.y,96+level*8);roundedRect(tag.x-50,tag.y-11,100,22,5,"rgba(10,37,46,.92)");ctx.fillStyle=loc.color;ctx.fillRect(tag.x-50,tag.y-11,5,22);ctx.fillStyle="#fff";ctx.font="700 7px DM Mono";ctx.fillText(`${loc.title}${STORES.some(s=>s.id===id)?` · LV ${level}`:""}`,tag.x+3,tag.y+3);
}

function drawPlayer(t) {
  const bob=walking?Math.abs(Math.sin(t*.012))*2:Math.sin(t*.003)*.5,step=walking?Math.sin(t*.012):0,p=isoPoint(run.player.x,run.player.y,5);
  ctx.save();ctx.translate(p.x,p.y-bob);
  ctx.fillStyle="rgba(1,22,27,.3)";ctx.beginPath();ctx.ellipse(0,7+bob,22,8,0,0,Math.PI*2);ctx.fill();
  // legs and shoes
  ctx.strokeStyle="#18333a";ctx.lineWidth=7;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(-6,-8);ctx.lineTo(-8+step*5,5);ctx.moveTo(6,-8);ctx.lineTo(8-step*5,5);ctx.stroke();ctx.fillStyle="#f4f0dc";ctx.beginPath();ctx.ellipse(-9+step*5,6,7,3,0,0,Math.PI*2);ctx.ellipse(9-step*5,6,7,3,0,0,Math.PI*2);ctx.fill();
  // torso and backpack
  ctx.fillStyle="#c8ff5a";ctx.beginPath();ctx.roundRect(-14,-50,28,41,9);ctx.fill();ctx.fillStyle="#0d3540";ctx.beginPath();ctx.roundRect(-18,-46,10,30,5);ctx.fill();ctx.fillStyle="rgba(255,255,255,.3)";ctx.fillRect(7,-44,3,24);
  // head and cap
  ctx.fillStyle="#c48562";ctx.beginPath();ctx.arc(0,-61,12,0,Math.PI*2);ctx.fill();ctx.fillStyle="#092d37";ctx.beginPath();ctx.arc(0,-65,12,Math.PI,Math.PI*2);ctx.fill();ctx.fillRect(-11,-66,26,4);
  // direction marker
  ctx.strokeStyle="#fff";ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,-28,27,0,Math.PI*2);ctx.stroke();ctx.restore();
}

function loop(t) {
  const dt = Math.min((t-lastTime)/1000 || 0, .04); lastTime=t;
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
  const store=STORES.find(item=>item.id===selectedStore), products=CATALOGUE.filter(product=>product.storeId===selectedStore), level=run.venues[selectedStore] || 1;
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
  const locked=(run.venues?.[product.storeId] || 1)<(product.tier || 1);
  return `<article class="product-card ${locked?"locked":""}" style="--product-color:${product.color}">
    <div class="product-head"><div class="product-icon">${product.icon}</div><div><h3>${product.name}</h3><p>${formatEuro(product.cost)} cost · ${formatEuro(product.reference)} reference</p></div><span class="stock-pill">${run.stock[product.id]} in stock</span></div>
    <div class="buy-row"><div class="qty-control"><button class="qty-minus" data-id="${product.id}" aria-label="Decrease quantity" ${locked?"disabled":""}>−</button><input class="qty-input" data-id="${product.id}" id="qty-${product.id}" type="number" min="1" step="1" value="1" aria-label="Quantity" ${locked?"disabled":""}><button class="qty-plus" data-id="${product.id}" aria-label="Increase quantity" ${locked?"disabled":""}>+</button></div><button class="action-button buy-button" data-id="${product.id}" ${run.completed||locked ? "disabled" : ""}>${locked?`Unlock at level ${product.tier}`:`Buy · <span id="total-${product.id}">${formatEuro(product.cost)}</span>`}</button></div>
  </article>`;
}

function updateBuyTotal(id) {
  const product = CATALOGUE.find(p=>p.id===id), quantity = Number($(`#qty-${id}`).value);
  $(`#total-${id}`).textContent = Number.isInteger(quantity) && quantity > 0 ? formatEuro(product.cost*quantity) : "—";
}

function openStore(storeId="cafe") {
  const store=STORES.find(item=>item.id===storeId), products=CATALOGUE.filter(product=>product.storeId===storeId);
  const level=run.venues?.[storeId] || 1, upgradeCost=level===1?1500:2500;
  const units=products.reduce((sum,p)=>sum+run.stock[p.id],0);
  const potential=products.reduce((sum,p)=>sum+Math.min(run.stock[p.id],demandFor(run.prices[p.id],p.reference))*run.prices[p.id],0);
  drawerContent.innerHTML = `
    <p class="eyebrow">Venue management · ${store.short}</p><div class="venue-title"><div><h2>${store.name}</h2><p>${store.pitch}</p></div><div class="level-badge"><small>VENUE LEVEL</small><strong>${level} / 3</strong></div></div>
    <div class="upgrade-track"><span style="width:${level/3*100}%"></span></div>
    ${level<3?`<button class="upgrade-button" id="upgradeVenue">Upgrade to level ${level+1}<small>Unlock ${products.find(p=>p.tier===level+1)?.name} · ${formatEuro(upgradeCost)}</small></button>`:`<div class="max-level">★ Flagship venue · all products unlocked</div>`}
    ${storeTabs(storeId,"store")}
    <div class="venue-kpis"><div><small>ON HAND</small><strong>${units}</strong><span>units</span></div><div><small>DAY POTENTIAL</small><strong>${formatEuro(potential)}</strong><span>revenue</span></div><div><small>PRODUCTS</small><strong>${products.filter(product=>product.tier<=level).length} / 3</strong><span>unlocked</span></div></div>
    <div class="rule-box"><strong>Daily demand rule</strong><div class="rule-grid"><div><b>10 units</b><small>At or below reference</small></div><div><b>5 units</b><small>Above, up to 2×</small></div><div><b>0 units</b><small>Above 2× reference</small></div></div></div>
    <div class="product-list">${products.map(product => productPriceCard(product)).join("")}</div>
    <div class="trade-footer"><button class="action-button secondary" id="visitSupplier">Buy more stock</button><button class="action-button orange" id="tradeButton" ${run.completed ? "disabled" : ""}>Open day ${run.currentDay} →</button></div>`;
  drawerContent.querySelectorAll(".store-tab").forEach(button=>button.addEventListener("click",()=>openLocation(button.dataset.store)));
  drawerContent.querySelectorAll(".price-input").forEach(input => {
    input.addEventListener("input", () => updateDemandPreview(input.dataset.id));
    input.addEventListener("change", () => commitPrice(input.dataset.id));
  });
  drawerContent.querySelectorAll(".set-price").forEach(button => button.addEventListener("click",()=>commitPrice(button.dataset.id)));
  if($("#upgradeVenue")) $("#upgradeVenue").addEventListener("click",()=>{try{save(upgradeVenue(run,storeId));toast(`${store.name} upgraded to level ${level+1}`);beep(720);}catch(error){toast(error.message,true);beep(180);}});
  $("#visitSupplier").addEventListener("click",()=>{currentSupplierStore=storeId;openLocation("supplier");});
  $("#tradeButton").addEventListener("click", confirmTrade);
}

function openPortfolio() {
  drawerContent.innerHTML=`<p class="eyebrow">Portfolio · three campus venues</p><h2>Your business network</h2><p class="drawer-intro">Each venue has its own product mix, stock position, pricing and earning potential.</p><div class="venue-grid">${STORES.map(store=>{
    const products=CATALOGUE.filter(p=>p.storeId===store.id),units=products.reduce((sum,p)=>sum+run.stock[p.id],0),potential=products.reduce((sum,p)=>sum+Math.min(run.stock[p.id],demandFor(run.prices[p.id],p.reference))*run.prices[p.id],0);
    return `<button class="venue-card" data-store="${store.id}" style="--venue:${store.color}"><span class="venue-icon">${store.icon}</span><div><small>${store.short.toUpperCase()} · LEVEL ${run.venues?.[store.id]||1}</small><strong>${store.name}</strong><p>${store.pitch}</p></div><div class="venue-metrics"><span><b>${units}</b> stock</span><span><b>${formatEuro(potential)}</b> potential</span><span><b>${3-CATALOGUE.filter(p=>p.storeId===store.id&&p.tier>(run.venues?.[store.id]||1)).length}/3</b> products</span></div><em>Open venue →</em></button>`}).join("")}</div>`;
  drawerContent.querySelectorAll(".venue-card").forEach(button=>button.addEventListener("click",()=>openLocation(button.dataset.store)));
}

function productPriceCard(product) {
  const price=run.prices[product.id], demand=demandFor(price,product.reference), locked=(run.venues?.[product.storeId]||1)<(product.tier||1);
  return `<article class="product-card ${locked?"locked":""}" style="--product-color:${product.color}">
    <div class="product-head"><div class="product-icon">${product.icon}</div><div><h3>${product.name}</h3><p>${run.stock[product.id]} in stock · ref. ${formatEuro(product.reference)}</p></div><span class="stock-pill">Cost ${formatEuro(product.cost)}</span></div>
    <div class="price-row"><div class="price-wrap"><span>€</span><input class="price-input" data-id="${product.id}" id="price-${product.id}" inputmode="decimal" value="${(price/100).toFixed(2)}" aria-label="Selling price for ${product.name}" ${locked?"disabled":""}></div><button class="action-button set-price" data-id="${product.id}" ${run.completed||locked ? "disabled" : ""}>${locked?`Level ${product.tier}`:"Set price"}</button></div>
    <div class="price-note"><span>Potential margin ${formatEuro(price-product.cost)} / unit</span><span class="demand-badge" id="demand-${product.id}">${locked?"Locked":`${demand} demand today`}</span></div>
  </article>`;
}

function updateDemandPreview(id) {
  const product=CATALOGUE.find(p=>p.id===id), badge=$(`#demand-${id}`);
  try { badge.textContent=`${demandFor(parseEuro($(`#price-${id}`).value),product.reference)} demand today`; }
  catch (_) { badge.textContent="Enter a valid price"; }
}

function commitPrice(id) {
  try { const cents=parseEuro($(`#price-${id}`).value); save(setPrice(run,id,cents)); toast("Price saved immediately"); beep(440); }
  catch(error){ toast(error.message,true); openStore(CATALOGUE.find(product=>product.id===id)?.storeId || "cafe"); beep(180); }
}

function confirmTrade() {
  if(run.completed || tradingInProgress) return;
  const projections=CATALOGUE.map(product=>({product, demand:demandFor(run.prices[product.id],product.reference), sold:Math.min(run.stock[product.id],demandFor(run.prices[product.id],product.reference))}));
  const venueForecasts=STORES.map(store=>{const items=projections.filter(item=>item.product.storeId===store.id);return {store,units:items.reduce((s,p)=>s+p.sold,0),revenue:items.reduce((s,p)=>s+p.sold*run.prices[p.product.id],0)}});
  const campusDay=CAMPUS_DAYS[run.currentDay-1];
  modalCard.className="modal-card";
  modalCard.innerHTML=`<p class="eyebrow">Campus opening checklist · day ${run.currentDay}</p><h2 id="modalTitle">${campusDay.icon} ${campusDay.title}</h2><p>${campusDay.brief} All three venues trade together and the day is recorded exactly once.</p><div class="event-objective"><span>DAY OBJECTIVE</span><strong>${campusDay.objective.label}</strong><em>+4 reputation</em></div><div class="forecast-grid">${venueForecasts.map(v=>`<div style="--venue:${v.store.color}"><span>${v.store.icon}</span><small>${v.store.short}</small><strong>${v.units} units</strong><em>${formatEuro(v.revenue)} forecast revenue</em></div>`).join("")}</div><div class="forecast-total"><span>PLAN FORECAST</span><strong>${projections.reduce((s,p)=>s+p.sold,0)} units · ${formatEuro(venueForecasts.reduce((sum,venue)=>sum+venue.revenue,0))}</strong></div><div class="modal-actions"><button class="action-button secondary" data-close>Keep planning</button><button class="action-button orange" id="confirmTrade">Open campus →</button></div>`;
  showModal(); modalCard.querySelector("[data-close]").addEventListener("click",hideModal); $("#confirmTrade").addEventListener("click",executeTrade,{once:true});
}

const wait = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

async function executeTrade() {
  if(tradingInProgress) return;
  let next, day;
  try {
    tradingInProgress=true; skipSimulation=false;
    next=tradeDay(run); day=next.history.at(-1); const campusDay=CAMPUS_DAYS[day.day-1];
    const saleQueue=day.items.flatMap(item=>Array.from({length:item.unitsSold},()=>item));
    const venueTotals=Object.fromEntries(STORES.map(store=>[store.id,{units:0,revenue:0}]));
    closeDrawer();
    modalCard.className="modal-card trading-card";
    modalCard.innerHTML=`<div class="sim-top"><div><p class="eyebrow">LIVE · DAY ${day.day}</p><h2 id="modalTitle">${campusDay.title}</h2><span id="simPhase">Campus gates opening…</span></div><div class="sim-total"><small>LIVE REVENUE</small><strong id="simRevenue">€0.00</strong><em id="simSold">0 sold</em></div></div><div class="sim-progress"><span id="simProgress"></span></div><div class="sim-scene"><div class="sim-campus"><span>NOVA SBE</span><small id="simClock">08:30</small></div><div class="sim-crowd" id="simCrowd"></div><div class="sim-lanes">${STORES.map(store=>`<article class="sim-venue" data-store="${store.id}" style="--venue:${store.color}"><div class="sim-awning"></div><span>${store.icon}</span><small>${store.short}</small><strong id="simUnits-${store.id}">0 sold</strong><em id="simMoney-${store.id}">€0.00</em><div class="sim-meter"><i id="simFill-${store.id}"></i></div></article>`).join("")}</div></div><div class="sim-footer"><div><span class="live-dot"></span><strong id="simMessage">Students are arriving across campus</strong></div><button class="sim-skip" id="simSkip">Skip to results</button></div>`;
    showModal();
    $("#simSkip").addEventListener("click",()=>{skipSimulation=true;});
    await wait(450);
    if(saleQueue.length===0){
      $("#simPhase").textContent="Campus trading · no purchases yet";
      $("#simMessage").textContent="Students browsed, but no stocked offer converted";
      for(let i=0;i<5&&!skipSimulation;i++){spawnCustomer(null,i,false);await wait(180);}
      await wait(skipSimulation?50:700);
    } else {
      for(let index=0;index<saleQueue.length;index++){
        if(skipSimulation) break;
        const item=saleQueue[index], product=CATALOGUE.find(entry=>entry.id===item.productId), store=STORES.find(entry=>entry.id===product.storeId);
        const progress=(index+1)/saleQueue.length;
        venueTotals[store.id].units+=1; venueTotals[store.id].revenue+=item.price;
        $("#simPhase").textContent=progress<.34?"Morning rush":progress<.72?"Midday trading":"Final campus rush";
        $("#simClock").textContent=progress<.34?"10:15":progress<.72?"13:40":"17:20";
        $("#simProgress").style.width=`${Math.max(6,progress*100)}%`;
        $("#simRevenue").textContent=formatEuro(Object.values(venueTotals).reduce((sum,value)=>sum+value.revenue,0));
        $("#simSold").textContent=`${index+1} sold`;
        $(`#simUnits-${store.id}`).textContent=`${venueTotals[store.id].units} sold`;
        $(`#simMoney-${store.id}`).textContent=formatEuro(venueTotals[store.id].revenue);
        $(`#simFill-${store.id}`).style.width=`${Math.min(100,venueTotals[store.id].units/Math.max(1,day.items.filter(entry=>CATALOGUE.find(product=>product.id===entry.productId)?.storeId===store.id).reduce((sum,entry)=>sum+entry.unitsSold,0))*100)}%`;
        $("#simMessage").textContent=`${product.short} sold at ${store.short} · +${formatEuro(item.price)}`;
        spawnCustomer(store,index,true,product.icon);
        if(index%3===0) beep(420+index%5*35);
        await wait(Math.max(55,Math.min(135,1900/saleQueue.length)));
      }
      Object.entries(venueTotals).forEach(([storeId,value])=>{const storeItems=day.items.filter(entry=>CATALOGUE.find(product=>product.id===entry.productId)?.storeId===storeId);value.units=storeItems.reduce((sum,item)=>sum+item.unitsSold,0);value.revenue=storeItems.reduce((sum,item)=>sum+item.revenue,0);$("#simUnits-"+storeId).textContent=`${value.units} sold`;$("#simMoney-"+storeId).textContent=formatEuro(value.revenue);$("#simFill-"+storeId).style.width=value.units?"100%":"0%";});
      $("#simProgress").style.width="100%"; $("#simRevenue").textContent=formatEuro(day.totals.revenue); $("#simSold").textContent=`${day.totals.unitsSold} sold`; $("#simPhase").textContent="Campus closed · reconciling results";
      await wait(skipSimulation?100:500);
    }
    save(next); tradingInProgress=false; beep(690); showReport(day,next.completed);
  } catch(error){
    console.error("Trading simulation failed",error);
    tradingInProgress=false;
    if(next&&day){save(next);showReport(day,next.completed);toast("Trading completed; the live view was skipped.",true);}
    else{hideModal();toast(error.message,true);}
  }
}

function spawnCustomer(store,index,purchased=true,productIcon="") {
  const crowd=$("#simCrowd"); if(!crowd) return;
  const customer=document.createElement("div");
  customer.className=`sim-customer ${store?.id||"wander"} ${purchased?"purchased":"browsing"}`;
  customer.style.setProperty("--customer",["#f5c95e","#ff8060","#64cbc8","#9a7bc1","#bce65f"][index%5]);
  customer.style.setProperty("--lane",store?STORES.findIndex(item=>item.id===store.id):index%3);
  customer.innerHTML=`<i></i><b>${purchased?`+ ${productIcon}`:"?"}</b>`;
  crowd.append(customer); requestAnimationFrame(()=>customer.classList.add("go")); setTimeout(()=>customer.remove(),1050);
}

function showReport(day, final=false) {
  const value=overallResult(run), inv=inventoryValue(run);
  const campusDay=CAMPUS_DAYS[day.day-1], objective=day.objective;
  const resultTitle=final ? "Your final score" : day.totals.grossProfit>0 ? "A profitable trading day" : day.totals.revenue>0 ? "Campus doors closed" : "A quiet day";
  modalCard.className="modal-card";
  modalCard.innerHTML=`<p class="eyebrow">${final ? "Five-day run complete" : `Day ${day.day} closed`}</p><h2 id="modalTitle">${resultTitle}</h2>
    <div class="objective-result ${objective?.completed?"completed":"missed"}"><span>${objective?.completed?"✓":"○"}</span><div><small>${campusDay.title.toUpperCase()} · DAY OBJECTIVE</small><strong>${objective?.label||campusDay.objective.label}</strong></div><em>${objective?.completed?"+4 reputation":"Try again next run"}</em></div>
    <div class="report-hero"><small>${final ? "OVERALL GAIN / LOSS" : "TODAY'S GROSS PROFIT"}</small><strong class="${(final?value:day.totals.grossProfit)>=0?"":"result-negative"}">${formatEuro(final?value:day.totals.grossProfit)}</strong></div>
    <table class="mini-table"><thead><tr><th>Product</th><th>Sold</th><th>Revenue</th><th>COGS</th><th>Profit</th></tr></thead><tbody>${day.items.map(item=>{const p=CATALOGUE.find(x=>x.id===item.productId);return `<tr><td>${p.short}</td><td>${item.unitsSold}</td><td>${formatEuro(item.revenue)}</td><td>${formatEuro(item.cogs)}</td><td>${formatEuro(item.grossProfit)}</td></tr>`}).join("")}</tbody><tfoot><tr><td><strong>Total</strong></td><td><strong>${day.totals.unitsSold}</strong></td><td><strong>${formatEuro(day.totals.revenue)}</strong></td><td><strong>${formatEuro(day.totals.cogs)}</strong></td><td><strong>${formatEuro(day.totals.grossProfit)}</strong></td></tr></tfoot></table>
    ${final?`<div class="report-grid"><div><small>FINAL CASH</small><strong>${formatEuro(run.cash)}</strong></div><div><small>STOCK AT COST</small><strong>${formatEuro(inv)}</strong></div><div><small>STARTED WITH</small><strong>€100.00</strong></div></div>`:""}
    <div class="modal-actions">${final?`<button class="action-button secondary" id="reportLedger">View ledger</button><button class="action-button" id="reportRestart">Play again</button>`:`<button class="action-button" data-close>Continue to day ${run.currentDay}</button>`}</div>`;
  showModal();
  if(final){$("#reportLedger").addEventListener("click",()=>{hideModal();openLocation("board")});$("#reportRestart").addEventListener("click",confirmNewRun);}else modalCard.querySelector("[data-close]").addEventListener("click",hideModal);
}

function openLedger() {
  const gain=overallResult(run), inv=inventoryValue(run);
  const objectives=run.history.filter(day=>day.objective?.completed).length;
  const venueResults=STORES.map(store=>{const ids=new Set(CATALOGUE.filter(p=>p.storeId===store.id).map(p=>p.id));const items=run.history.flatMap(day=>day.items).filter(item=>ids.has(item.productId));return {store,units:items.reduce((s,i)=>s+i.unitsSold,0),revenue:items.reduce((s,i)=>s+i.revenue,0),profit:items.reduce((s,i)=>s+i.grossProfit,0)}});
  drawerContent.innerHTML=`<p class="eyebrow">Company finance · saved locally</p><h2>Portfolio performance</h2><p class="drawer-intro">Compare venues, inspect daily results, and decide where tomorrow's cash should go.</p>
    <div class="report-grid"><div><small>CASH</small><strong>${formatEuro(run.cash)}</strong></div><div><small>STOCK VALUE</small><strong>${formatEuro(inv)}</strong></div><div><small>GAIN / LOSS</small><strong class="${gain>=0?"result-positive":"result-negative"}">${formatEuro(gain)}</strong></div><div><small>OBJECTIVES</small><strong>${objectives} / ${run.history.length||5}</strong></div></div>
    <div class="section-heading"><div><small>VENUE COMPARISON</small><strong>Trading performance</strong></div><span>${run.history.length} / 5 days</span></div>
    <div class="venue-kpis">${venueResults.map(v=>`<div style="border-top:3px solid ${v.store.color}"><small>${v.store.short.toUpperCase()}</small><strong>${formatEuro(v.profit)}</strong><span>${v.units} sold · ${formatEuro(v.revenue)} revenue</span></div>`).join("")}</div>
    <div class="section-heading"><div><small>DAILY LEDGER</small><strong>Completed days</strong></div></div>
    <div class="history-list">${run.history.length?run.history.map(historyCard).reverse().join(""):`<div class="empty-state"><span>▤</span>No trading days yet.<br>Prepare your venues and open the campus.</div>`}</div>`;
}

function historyCard(day) {
  const campusDay=CAMPUS_DAYS[day.day-1];
  return `<details class="history-day"><summary><strong>Day ${day.day} · ${campusDay.title}</strong><span>+${formatEuro(day.totals.revenue)}</span></summary><div class="history-detail"><div class="history-objective ${day.objective?.completed?"done":""}">${day.objective?.completed?"✓":"○"} ${day.objective?.label||campusDay.objective.label}</div><table class="mini-table"><thead><tr><th>Product</th><th>Sold</th><th>Revenue</th><th>COGS</th><th>Profit</th></tr></thead><tbody>${day.items.map(item=>{const p=CATALOGUE.find(x=>x.id===item.productId);return `<tr><td>${p.short}</td><td>${item.unitsSold}</td><td>${formatEuro(item.revenue)}</td><td>${formatEuro(item.cogs)}</td><td>${formatEuro(item.grossProfit)}</td></tr>`}).join("")}</tbody></table></div></details>`;
}

function confirmNewRun() {
  modalCard.className="modal-card";
  modalCard.innerHTML=`<p class="eyebrow">Replace current run?</p><h2 id="modalTitle">Start from day one</h2><p>This replaces your saved run with <strong>€100.00 cash</strong>, zero stock, reference prices and an empty history. Cancelling keeps everything exactly as it is.</p><div class="modal-actions"><button class="action-button secondary" data-close>Cancel</button><button class="action-button orange" id="replaceRun">Replace run</button></div>`;
  showModal(); modalCard.querySelector("[data-close]").addEventListener("click",hideModal); $("#replaceRun").addEventListener("click",()=>{const fresh=createRun();currentZone="campus";camera.x=fresh.player.x;camera.y=fresh.player.y;targetPoint=null;closeDrawer();save(fresh);hideModal();toast("Fresh venture started on the Nova coast");beep(610);});
}

function showModal(){modal.classList.remove("hidden");}
function hideModal(){modal.classList.add("hidden");}
function toast(message,error=false){const el=document.createElement("div");el.className=`toast ${error?"error":""}`;el.textContent=message;$("#toastRegion").append(el);setTimeout(()=>el.remove(),2800);}
function beep(frequency){if(!soundOn)return;try{const audio=new AudioContext();const osc=audio.createOscillator(),gain=audio.createGain();osc.frequency.value=frequency;gain.gain.setValueAtTime(.05,audio.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.12);osc.connect(gain).connect(audio.destination);osc.start();osc.stop(audio.currentTime+.12);}catch(_){} }

window.addEventListener("resize",resize);
window.addEventListener("keydown",event=>{if(["w","a","s","d","arrowup","arrowdown","arrowleft","arrowright"].includes(event.key.toLowerCase())){keys.add(event.key.toLowerCase());targetPoint=null;event.preventDefault();}if(event.key.toLowerCase()==="e"&&modal.classList.contains("hidden")){const near=nearestLocation();if(near)interactWith(near[0]);}if(event.key==="Escape"&&!tradingInProgress){hideModal();closeDrawer();}});
window.addEventListener("keyup",event=>{keys.delete(event.key.toLowerCase());localStorage.setItem(STORAGE_KEY,JSON.stringify(run));});
canvas.addEventListener("click",event=>{const rect=canvas.getBoundingClientRect(),cp=isoPoint(camera.x,camera.y);const ix=(event.clientX-rect.left-canvas.clientWidth/2)/camera.zoom+cp.x,iy=(event.clientY-rect.top-canvas.clientHeight/2)/camera.zoom+cp.y;const x=iy/TILE_H+ix/TILE_W,y=iy/TILE_H-ix/TILE_W;const hit=zoneLocations().find(([,loc])=>Math.hypot(x-loc.x,y-loc.y)<1.35);if(hit)moveTo(hit[0]);else{const zone=activeZone();targetPoint={x:Math.max(zone.minX,Math.min(zone.maxX,x)),y:Math.max(zone.minY,Math.min(zone.maxY,y))};}});
$("#closeDrawer").addEventListener("click",closeDrawer);
$("#newRunButton").addEventListener("click",confirmNewRun);
$("#soundButton").addEventListener("click",()=>{soundOn=!soundOn;$("#soundButton").classList.toggle("muted",!soundOn);$("#soundButton").textContent=soundOn?"♪":"×";});
document.querySelectorAll(".quick-nav button").forEach(button=>button.addEventListener("click",()=>{
  const action=button.dataset.action;
  if(action==="buy")openLocation("supplier");
  if(action==="stores"){activeLocation=null;openPortfolio();drawer.classList.add("open");drawer.setAttribute("aria-hidden","false");}
  if(action==="trade")confirmTrade();
  if(action==="ledger")openLocation("board");
}));
modal.addEventListener("click",event=>{if(event.target===modal&&!tradingInProgress)hideModal();});

resize(); updateHUD(); requestAnimationFrame(loop);
