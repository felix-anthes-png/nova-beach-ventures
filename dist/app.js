import { CATALOGUE, STORES, CAMPUS_DAYS, MAX_DAYS, STORAGE_KEY, createRun, demandFor, parseEuro, buyStock, setPrice, tradeDay, inventoryValue, overallResult, formatEuro, upgradeVenue } from "./core.js";

const $ = selector => document.querySelector(selector);
const canvas = $("#world");
const ctx = canvas.getContext("2d");
const drawer = $("#drawer");
const drawerContent = $("#drawerContent");
const modal = $("#modal");
const modalCard = $("#modalCard");
const keys = new Set();
let run = loadRun();
let soundOn = true;
let activeLocation = null;
let lastTime = 0;
let walking = false;
let facing = { x: 0, y: 1 };
let targetPoint = null;
let currentSupplierStore = "cafe";
let tradingInProgress = false;
let skipSimulation = false;
const camera = { x: 14, y: 14, zoom: 1 };
const WORLD = { width: 28, height: 22, shore: 17 };
const TILE_W = 76, TILE_H = 38;
const WALK_SPEED = 3.5;

const locations = {
  supplier: { x: 3.5, y: 11.5, label: "Enter Mercado Hub", panel: () => openSupplier(currentSupplierStore), color: "#f5c95e", title: "MERCADO", sub: "WHOLESALE" },
  cafe: { x: 9, y: 11.5, label: "Manage Atlantic Café", panel: () => openStore("cafe"), color: "#ff7b5b", title: "ATLANTIC CAFÉ", sub: "COURTYARD" },
  snack: { x: 17.5, y: 16.2, label: "Manage Beach Fuel Bar", panel: () => openStore("snack"), color: "#afd864", title: "BEACH FUEL", sub: "BOARDWALK" },
  merch: { x: 21, y: 10, label: "Manage Nova Supply Co.", panel: () => openStore("merch"), color: "#5ac7c4", title: "NOVA SUPPLY", sub: "STUDENT HUB" },
  board: { x: 24, y: 7.5, label: "Open the venture ledger", panel: openLedger, color: "#67b7d1", title: "VENTURE HQ", sub: "FINANCE" }
};

function loadRun() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (parsed && parsed.version === 1 && Array.isArray(parsed.history)) {
      if (!parsed.player || parsed.player.x > WORLD.width || parsed.player.x < 0) parsed.player = { x: 14, y: 13.3 };
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
  fresh.player = { x: 14, y: 13.3 };
  return fresh;
}

function save(next) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  run = next;
  updateHUD();
  if (activeLocation) locations[activeLocation].panel();
}

function updateHUD() {
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
  const sky=ctx.createLinearGradient(0,0,0,h);sky.addColorStop(0,"#8dc8d5");sky.addColorStop(1,"#d6e4c0");ctx.fillStyle=sky;ctx.fillRect(0,0,w,h);
  const cp=isoPoint(camera.x,camera.y);
  ctx.save();
  ctx.translate(w/2-cp.x*camera.zoom,h/2-cp.y*camera.zoom);
  ctx.scale(camera.zoom, camera.zoom);
  drawTerrain(t);
  const actors=[
    {depth:8,draw:()=>drawLibrary()},
    {depth:14,draw:()=>drawCampus(t)},
    {depth:23,draw:()=>drawStudentHub()},
    {depth:29,draw:()=>drawBeachStage(t)},
    ...campusTrees.map((tree,i)=>({depth:tree[0]+tree[1],draw:()=>drawTree(tree[0],tree[1],tree[2],t+i*170)})),
    ...students.map((student,i)=>({depth:student[0]+student[1],draw:()=>drawStudent(student,t,i)})),
    ...Object.keys(locations).map(id=>({depth:locations[id].x+locations[id].y,draw:()=>drawLocation(id)})),
    {depth:run.player.x+run.player.y,draw:()=>drawPlayer(t)}
  ].sort((a,b)=>a.depth-b.depth);
  actors.forEach(actor => actor.draw());
  ctx.restore();
}

function drawTerrain(t) {
  const tiles=[];for(let y=0;y<WORLD.height;y++)for(let x=0;x<WORLD.width;x++)tiles.push({x,y,d:x+y});tiles.sort((a,b)=>a.d-b.d);
  tiles.forEach(({x,y})=>{
    let color="#79aa67";
    if(y>=19)color=(x+y)%2?"#3d8ca0":"#438fa3";
    else if(y>=16)color=(x+y)%2?"#dfc27d":"#e7cd8b";
    else if(y>=10||((x>=12&&x<=15)&&y>=6))color=(x+y)%2?"#c9cbbb":"#d2d3c4";
    else if((x+y)%2)color="#75a463";
    drawTile(x,y,color,y>=19?0:4);
    if(y===18){const p=isoPoint(x+.5,y+.5,5);ctx.strokeStyle="rgba(255,255,255,.5)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(p.x-24,p.y+Math.sin(t*.002+x)*2);ctx.lineTo(p.x+24,p.y+Math.sin(t*.002+x+1)*2);ctx.stroke();}
  });
}

function drawTile(x,y,color,depth=0){const a=isoPoint(x,y),b=isoPoint(x+1,y),c=isoPoint(x+1,y+1),d=isoPoint(x,y+1);ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.lineTo(c.x,c.y);ctx.lineTo(d.x,d.y);ctx.closePath();ctx.fill();ctx.strokeStyle="rgba(20,48,45,.08)";ctx.stroke();if(depth){ctx.fillStyle="rgba(45,67,54,.2)";ctx.beginPath();ctx.moveTo(d.x,d.y);ctx.lineTo(c.x,c.y);ctx.lineTo(c.x,c.y+depth);ctx.lineTo(d.x,d.y+depth);ctx.closePath();ctx.fill();}}

function drawCampus(t) {
  drawBlock(7,2,13,5,150,"#f1eee2","#bcbcaf","#a8aa9e");
  drawBlock(8,3,11,3.8,118,"#214957","#173743","#102c35");
  for(let i=0;i<9;i++){const p=isoPoint(8.8+i*1.1,6.72,75);ctx.fillStyle=i%2?"#78aab2":"#5e919c";ctx.fillRect(p.x-16,p.y-22,30,18);}
  const sign=isoPoint(13.5,6.8,108);roundedRect(sign.x-68,sign.y-13,136,24,2,"#f4efe0");ctx.fillStyle="#173743";ctx.textAlign="center";ctx.font="900 15px Manrope";ctx.fillText("NOVA SBE",sign.x,sign.y+4);
}

function drawLibrary(){
  drawBlock(.7,3.2,5.1,4.2,96,"#e7dfc7","#a8a18e","#c2baa5");
  drawBlock(1.25,3.75,4,2.8,72,"#2b5a67","#173d49","#204c58");
  const p=isoPoint(3.2,6.6,58);roundedRect(p.x-45,p.y-9,90,18,2,"#fff5dc");ctx.fillStyle="#173743";ctx.textAlign="center";ctx.font="800 7px DM Mono";ctx.fillText("LEARNING CENTER",p.x,p.y+3);
}

function drawStudentHub(){
  drawBlock(19.2,3.4,6.5,4.5,112,"#efe8d5","#b7ae98","#d0c7b1");
  drawBlock(19.8,4.1,5.3,2.9,79,"#397889","#225a69","#2c6978");
  for(let i=0;i<4;i++){const p=isoPoint(20.6+i*1.1,7.02,58);ctx.fillStyle=i%2?"#ffd068":"#ff8060";ctx.fillRect(p.x-12,p.y-8,24,8);}
  const p=isoPoint(22.4,7.4,66);ctx.fillStyle="#fff";ctx.textAlign="center";ctx.font="800 8px DM Mono";ctx.fillText("STUDENT HUB",p.x,p.y);
}

function drawBeachStage(t){
  drawBlock(11.8,16.5,4,1.7,32,"#324f5a","#1b3945","#274550");
  const p=isoPoint(13.8,17.3,64);ctx.strokeStyle="#173743";ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(p.x-45,p.y+24);ctx.lineTo(p.x-45,p.y-35);ctx.moveTo(p.x+45,p.y+24);ctx.lineTo(p.x+45,p.y-35);ctx.stroke();ctx.fillStyle="#ffcf5e";ctx.beginPath();ctx.moveTo(p.x-48,p.y-35);ctx.lineTo(p.x+48,p.y-35);ctx.lineTo(p.x+36,p.y-18);ctx.lineTo(p.x-36,p.y-18);ctx.closePath();ctx.fill();ctx.fillStyle="#173743";ctx.textAlign="center";ctx.font="800 7px DM Mono";ctx.fillText("VENTURE WEEK STAGE",p.x,p.y-23);
  for(let i=0;i<3;i++){ctx.fillStyle=["#ff7b5b","#6ac8c4","#b4d866"][i];ctx.beginPath();ctx.arc(p.x-20+i*20,p.y-8+Math.sin(t*.003+i)*2,4,0,Math.PI*2);ctx.fill();}
}

function drawBlock(x,y,w,h,z,top,right,left){const a=isoPoint(x,y,z),b=isoPoint(x+w,y,z),c=isoPoint(x+w,y+h,z),d=isoPoint(x,y+h,z),ba=isoPoint(x,y),bb=isoPoint(x+w,y),bc=isoPoint(x+w,y+h),bd=isoPoint(x,y+h);ctx.fillStyle=left;ctx.beginPath();ctx.moveTo(d.x,d.y);ctx.lineTo(c.x,c.y);ctx.lineTo(bc.x,bc.y);ctx.lineTo(bd.x,bd.y);ctx.closePath();ctx.fill();ctx.fillStyle=right;ctx.beginPath();ctx.moveTo(b.x,b.y);ctx.lineTo(c.x,c.y);ctx.lineTo(bc.x,bc.y);ctx.lineTo(bb.x,bb.y);ctx.closePath();ctx.fill();ctx.fillStyle=top;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.lineTo(c.x,c.y);ctx.lineTo(d.x,d.y);ctx.closePath();ctx.fill();ctx.strokeStyle="rgba(15,35,40,.22)";ctx.stroke();}

const campusTrees=[[3,8,.9],[6,14,.8],[21,7,.9],[24,14,.95],[8,11,.72],[17,10,.75],[20,15,.72],[2,15,.8]];
const students=[[9,11,"#f4b858",.2],[12,12,"#dc6958",1.1],[17,11,"#75c0c8",2],[20,14,"#8b74bd",2.8],[14,9,"#e5e4d8",3.6]];

function drawTree(x,y,scale,t){const p=isoPoint(x,y,4);ctx.save();ctx.translate(p.x,p.y);ctx.scale(scale,scale);ctx.fillStyle="rgba(10,45,38,.2)";ctx.beginPath();ctx.ellipse(8,4,28,9,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle="#73583d";ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.sin(t*.001)*2,-65);ctx.stroke();ctx.fillStyle="#2f7c52";for(let a=0;a<6;a++){ctx.save();ctx.rotate(a*1.05);ctx.beginPath();ctx.ellipse(17,-66,23,7,0,0,Math.PI*2);ctx.fill();ctx.restore()}ctx.restore();}

function drawStudent(s,t,i){const x=s[0]+Math.sin(t*.0004+s[3])*.25,y=s[1],c=s[2],p=isoPoint(x,y,5);ctx.save();ctx.translate(p.x,p.y);ctx.fillStyle="rgba(7,35,39,.2)";ctx.beginPath();ctx.ellipse(0,3,10,4,0,0,Math.PI*2);ctx.fill();const step=Math.sin(t*.007+i);ctx.strokeStyle="#18323a";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-2,-7);ctx.lineTo(-4+step*2,2);ctx.moveTo(2,-7);ctx.lineTo(4-step*2,2);ctx.stroke();ctx.fillStyle=c;ctx.fillRect(-6,-26,12,19);ctx.fillStyle="#b97858";ctx.beginPath();ctx.arc(0,-32,5,0,Math.PI*2);ctx.fill();ctx.restore();}

function drawLocation(id) {
  const loc=locations[id], near=Math.hypot(run.player.x-loc.x,run.player.y-loc.y)<1.65, level=run.venues?.[id]||1, size=1.45+level*.18;
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
  if(walking){const l=Math.hypot(dx,dy);dx/=l;dy/=l;facing={x:dx,y:dy};let nx=Math.max(1,Math.min(WORLD.width-1,run.player.x+dx*WALK_SPEED*dt));let ny=Math.max(8.2,Math.min(18.3,run.player.y+dy*WALK_SPEED*dt));run.player.x=nx;run.player.y=ny;}
  camera.x+=(run.player.x-camera.x)*Math.min(1,dt*4.8);camera.y+=(run.player.y-camera.y)*Math.min(1,dt*4.8);
  camera.zoom=Math.max(.82,Math.min(1.16,canvas.clientWidth/980));
  const mini=$(".mini-player");if(mini){mini.style.left=`${run.player.x/WORLD.width*100}%`;mini.style.top=`${run.player.y/WORLD.height*100}%`;}
  updateProximity(); drawWorld(t); requestAnimationFrame(loop);
}

function updateProximity() {
  const near = Object.entries(locations).find(([,loc]) => Math.hypot(run.player.x-loc.x,run.player.y-loc.y)<1.65);
  $("#interactionHint").classList.toggle("hidden", !near);
  if(near) $("#interactionName").textContent=near[1].label;
}

function nearestLocation() { return Object.entries(locations).find(([,loc]) => Math.hypot(run.player.x-loc.x,run.player.y-loc.y)<1.65); }
function moveTo(id) { const loc=locations[id]; run.player={x:loc.x,y:loc.y+1.45};camera.x=run.player.x;camera.y=run.player.y;save(run);openLocation(id); }
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
  showModal(); modalCard.querySelector("[data-close]").addEventListener("click",hideModal); $("#replaceRun").addEventListener("click",()=>{save(createRun());hideModal();closeDrawer();toast("Fresh venture started");beep(610);});
}

function showModal(){modal.classList.remove("hidden");}
function hideModal(){modal.classList.add("hidden");}
function toast(message,error=false){const el=document.createElement("div");el.className=`toast ${error?"error":""}`;el.textContent=message;$("#toastRegion").append(el);setTimeout(()=>el.remove(),2800);}
function beep(frequency){if(!soundOn)return;try{const audio=new AudioContext();const osc=audio.createOscillator(),gain=audio.createGain();osc.frequency.value=frequency;gain.gain.setValueAtTime(.05,audio.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.12);osc.connect(gain).connect(audio.destination);osc.start();osc.stop(audio.currentTime+.12);}catch(_){} }

window.addEventListener("resize",resize);
window.addEventListener("keydown",event=>{if(["w","a","s","d","arrowup","arrowdown","arrowleft","arrowright"].includes(event.key.toLowerCase())){keys.add(event.key.toLowerCase());targetPoint=null;event.preventDefault();}if(event.key.toLowerCase()==="e"&&modal.classList.contains("hidden")){const near=nearestLocation();if(near)openLocation(near[0]);}if(event.key==="Escape"&&!tradingInProgress){hideModal();closeDrawer();}});
window.addEventListener("keyup",event=>{keys.delete(event.key.toLowerCase());localStorage.setItem(STORAGE_KEY,JSON.stringify(run));});
canvas.addEventListener("click",event=>{const rect=canvas.getBoundingClientRect(),cp=isoPoint(camera.x,camera.y);const ix=(event.clientX-rect.left-canvas.clientWidth/2)/camera.zoom+cp.x,iy=(event.clientY-rect.top-canvas.clientHeight/2)/camera.zoom+cp.y;const x=iy/TILE_H+ix/TILE_W,y=iy/TILE_H-ix/TILE_W;const hit=Object.entries(locations).find(([,loc])=>Math.hypot(x-loc.x,y-loc.y)<1.35);if(hit)moveTo(hit[0]);else targetPoint={x:Math.max(1,Math.min(WORLD.width-1,x)),y:Math.max(8.2,Math.min(18.3,y))};});
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
