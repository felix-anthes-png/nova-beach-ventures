import { CATALOGUE, STORES, MAX_DAYS, STORAGE_KEY, createRun, demandFor, parseEuro, buyStock, setPrice, tradeDay, inventoryValue, overallResult, formatEuro } from "./core.js";

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
const camera = { x: 800, y: 610, zoom: 1 };
const WORLD = { width: 1600, height: 1080, waterline: 870 };
const WALK_SPEED = 235;

const locations = {
  supplier: { x: 235, y: 625, label: "Enter Mercado Hub", panel: () => openSupplier(currentSupplierStore), color: "#ffd05b", title: "MERCADO HUB", sub: "WHOLESALE SUPPLIES" },
  cafe: { x: 610, y: 690, label: "Manage Atlantic Café", panel: () => openStore("cafe"), color: "#ff815d", title: "ATLANTIC CAFÉ", sub: "COFFEE & BAKES" },
  snack: { x: 890, y: 700, label: "Manage Beach Fuel Bar", panel: () => openStore("snack"), color: "#b3dc65", title: "BEACH FUEL", sub: "FRESH & FAST" },
  merch: { x: 1160, y: 665, label: "Manage Nova Supply Co.", panel: () => openStore("merch"), color: "#67c7c4", title: "NOVA SUPPLY", sub: "CAMPUS GOODS" },
  board: { x: 1390, y: 570, label: "Open the venture ledger", panel: openLedger, color: "#65d2ca", title: "VENTURE HQ", sub: "RESULTS & HISTORY" }
};

function loadRun() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (parsed && parsed.version === 1 && Array.isArray(parsed.history)) {
      if (!parsed.player || parsed.player.x < 200) parsed.player = { x: 760, y: 690 };
      CATALOGUE.forEach(product => {
        if (!Number.isInteger(parsed.stock[product.id])) parsed.stock[product.id] = 0;
        if (!Number.isInteger(parsed.prices[product.id])) parsed.prices[product.id] = product.reference;
      });
      return parsed;
    }
  } catch (_) {}
  const fresh = createRun();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  fresh.player = { x: 760, y: 690 };
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
  $("#dayDots").innerHTML = Array.from({ length: MAX_DAYS }, (_, i) => {
    const day = i + 1;
    return `<span class="day-dot ${day <= run.history.length ? "done" : ""} ${!run.completed && day === run.currentDay ? "current" : ""}"></span>`;
  }).join("");
  const totalStock = Object.values(run.stock).reduce((a, b) => a + b, 0);
  let title = "Build your first trading plan", text = "Use the Stock tool, then prepare prices across your three venues.", progress = 8;
  if (run.completed) {
    title = overallResult(run) >= 0 ? "Venture complete!" : "A useful first run";
    text = `Your five-day result is ${formatEuro(overallResult(run))}. Open the ledger for the full story.`;
    progress = 100;
  } else if (totalStock > 0) {
    title = `Prepare day ${run.currentDay}`;
    text = "Review each venue, balance stock and margins, then open the campus for trading.";
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
  return { x: (x - camera.x) * camera.zoom + canvas.clientWidth / 2, y: (y - camera.y) * camera.zoom + canvas.clientHeight / 2 };
}

function roundedRect(x, y, w, h, r, fill) {
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fillStyle = fill; ctx.fill();
}

function drawWorld(t) {
  const w = canvas.clientWidth, h = canvas.clientHeight;
  ctx.clearRect(0, 0, w, h);
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, "#9ad3d5"); sky.addColorStop(1, "#d9e9d2");
  ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h);

  ctx.save();
  ctx.translate(w / 2 - camera.x * camera.zoom, h / 2 - camera.y * camera.zoom);
  ctx.scale(camera.zoom, camera.zoom);
  drawTerrain(t);
  drawCampus(t);

  const actors = [
    ...campusTrees.map((tree, i) => ({ y: tree[1], draw: () => drawTree(tree[0], tree[1], tree[2], t + i * 190) })),
    ...students.map((student, i) => ({ y: student[1], draw: () => drawStudent(student, t, i) })),
    ...Object.keys(locations).map(id => ({ y: locations[id].y, draw: () => drawLocation(id) })),
    { y: run.player.y, draw: () => drawPlayer(t) }
  ].sort((a, b) => a.y - b.y);
  actors.forEach(actor => actor.draw());
  drawForeground(t);
  ctx.restore();
}

function drawTerrain(t) {
  ctx.fillStyle = "#86ad78"; ctx.fillRect(0, 0, WORLD.width, 860);
  // subtle mown grass strips
  for (let y = 0; y < 860; y += 62) { ctx.fillStyle = y % 124 === 0 ? "rgba(255,255,255,.025)" : "rgba(11,61,51,.025)"; ctx.fillRect(0, y, WORLD.width, 62); }
  // central limestone plaza and angular paths
  ctx.fillStyle = "#d8ddd1"; ctx.beginPath(); ctx.moveTo(0,500); ctx.lineTo(1600,470); ctx.lineTo(1600,720); ctx.lineTo(0,770); ctx.closePath(); ctx.fill();
  ctx.fillStyle = "#c9d1c5"; ctx.beginPath(); ctx.moveTo(710,400); ctx.lineTo(900,400); ctx.lineTo(1080,860); ctx.lineTo(650,860); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = "rgba(39,66,66,.09)"; ctx.lineWidth = 1;
  for (let x=0;x<WORLD.width;x+=52){ctx.beginPath();ctx.moveTo(x,500);ctx.lineTo(x+20,760);ctx.stroke();}
  // beach
  const sand = ctx.createLinearGradient(0,780,0,960); sand.addColorStop(0,"#e6cf99"); sand.addColorStop(1,"#d9b977"); ctx.fillStyle=sand;
  ctx.beginPath();ctx.moveTo(0,790);ctx.bezierCurveTo(420,760,1060,830,1600,780);ctx.lineTo(1600,950);ctx.lineTo(0,950);ctx.closePath();ctx.fill();
  // water
  const sea=ctx.createLinearGradient(0,900,0,WORLD.height);sea.addColorStop(0,"#4ea7b4");sea.addColorStop(1,"#246f82");ctx.fillStyle=sea;ctx.fillRect(0,920,WORLD.width,220);
  for(let i=0;i<7;i++){ctx.strokeStyle=`rgba(225,249,244,${.16+i*.025})`;ctx.lineWidth=2;ctx.beginPath();for(let x=-40;x<=WORLD.width+40;x+=28){const yy=938+i*24+Math.sin(x*.025+t*.0015+i)*5;x===-40?ctx.moveTo(x,yy):ctx.lineTo(x,yy)}ctx.stroke();}
  // promenade line and lamp pools
  ctx.fillStyle="#f8f4df";ctx.fillRect(0,786,WORLD.width,9);ctx.fillStyle="#ff7457";ctx.fillRect(710,786,190,9);
}

function drawCampus(t) {
  const x=410,y=190,w=770,h=275,depth=74;
  ctx.fillStyle="rgba(4,27,32,.22)";ctx.beginPath();ctx.ellipse(x+w/2+22,y+h+33,w*.58,45,-.02,0,Math.PI*2);ctx.fill();
  // side volume
  ctx.fillStyle="#c8c9bd";ctx.beginPath();ctx.moveTo(x+w,y);ctx.lineTo(x+w+depth,y+42);ctx.lineTo(x+w+depth,y+h+36);ctx.lineTo(x+w,y+h);ctx.closePath();ctx.fill();
  // facade
  ctx.fillStyle="#f2efe4";ctx.fillRect(x,y,w,h);
  const glass=ctx.createLinearGradient(x,y,x,y+h);glass.addColorStop(0,"#274d55");glass.addColorStop(1,"#102f38");ctx.fillStyle=glass;ctx.fillRect(x+32,y+50,w-64,h-78);
  ctx.strokeStyle="rgba(145,213,215,.35)";ctx.lineWidth=2;
  for(let gx=x+55;gx<x+w-30;gx+=58){ctx.beginPath();ctx.moveTo(gx,y+50);ctx.lineTo(gx,y+h-28);ctx.stroke();}
  ctx.strokeStyle="rgba(255,255,255,.18)";for(let gy=y+94;gy<y+h-30;gy+=48){ctx.beginPath();ctx.moveTo(x+32,gy);ctx.lineTo(x+w-32,gy);ctx.stroke();}
  // long white roof
  ctx.fillStyle="#fffdf1";ctx.beginPath();ctx.moveTo(x-28,y+18);ctx.lineTo(x+56,y-33);ctx.lineTo(x+w+42,y-33);ctx.lineTo(x+w,y+18);ctx.closePath();ctx.fill();
  ctx.fillStyle="#d8d7c9";ctx.beginPath();ctx.moveTo(x+w,y+18);ctx.lineTo(x+w+42,y-33);ctx.lineTo(x+w+depth,y+13);ctx.lineTo(x+w+depth,y+48);ctx.closePath();ctx.fill();
  // orange entrance ribbon
  ctx.fillStyle="#ff7357";ctx.fillRect(x+284,y+h-28,210,16);
  ctx.fillStyle="rgba(255,255,255,.9)";ctx.font="800 20px Manrope";ctx.fillText("NOVA",x+62,y+84);ctx.font="500 9px DM Mono";ctx.letterSpacing="2px";ctx.fillText("SCHOOL OF BUSINESS & ECONOMICS",x+126,y+83);
  // roof solar details
  for(let i=0;i<8;i++){ctx.fillStyle=i%2?"#315c63":"#254a52";ctx.fillRect(x+120+i*63,y-23,48,9);}
}

const campusTrees=[[120,430,1.15],[210,700,.9],[1320,390,1.05],[1450,690,1.1],[520,700,.82],[1080,720,.88],[1260,760,.74],[80,760,.8]];
const students=[[530,570,"#f4b858",.2],[650,650,"#dc6958",1.1],[1040,560,"#75c0c8",2],[1160,700,"#8b74bd",2.8],[760,530,"#e5e4d8",3.6]];

function drawTree(x,y,scale,t){ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);ctx.fillStyle="rgba(10,45,38,.18)";ctx.beginPath();ctx.ellipse(8,7,35,10,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle="#795b3f";ctx.lineWidth=9;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(5,-48,Math.sin(t*.001)*3,-86);ctx.stroke();ctx.fillStyle="#276f50";for(let a=0;a<7;a++){ctx.save();ctx.rotate(a*.88+Math.sin(t*.0005)*.02);ctx.beginPath();ctx.ellipse(20,-86,28,8,-.1,0,Math.PI*2);ctx.fill();ctx.restore()}ctx.fillStyle="#3d9166";ctx.beginPath();ctx.arc(0,-86,13,0,Math.PI*2);ctx.fill();ctx.restore();}

function drawStudent(s,t,i){const x=s[0]+Math.sin(t*.00035+s[3])*18,y=s[1]+Math.cos(t*.00025+s[3])*8,c=s[2];ctx.save();ctx.translate(x,y);ctx.fillStyle="rgba(7,35,39,.18)";ctx.beginPath();ctx.ellipse(0,4,13,5,0,0,Math.PI*2);ctx.fill();const step=Math.sin(t*.007+i);ctx.strokeStyle="#18323a";ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(-2,-10);ctx.lineTo(-4+step*3,2);ctx.moveTo(2,-10);ctx.lineTo(4-step*3,2);ctx.stroke();ctx.fillStyle=c;ctx.beginPath();ctx.roundRect(-8,-34,16,25,6);ctx.fill();ctx.fillStyle="#b97858";ctx.beginPath();ctx.arc(0,-41,7,0,Math.PI*2);ctx.fill();ctx.fillStyle="#19353d";ctx.beginPath();ctx.arc(0,-44,7,Math.PI,Math.PI*2);ctx.fill();ctx.restore();}

function drawLocation(id) {
  const loc=locations[id], near=Math.hypot(run.player.x-loc.x,run.player.y-loc.y)<86;
  ctx.save();ctx.translate(loc.x,loc.y);
  ctx.fillStyle="rgba(4,30,34,.22)";ctx.beginPath();ctx.ellipse(8,10,82,22,0,0,Math.PI*2);ctx.fill();
  // kiosk body, roof and side plane
  ctx.fillStyle="#f5f0df";ctx.fillRect(-62,-86,124,86);ctx.fillStyle="#c9c8bb";ctx.beginPath();ctx.moveTo(62,-86);ctx.lineTo(80,-72);ctx.lineTo(80,5);ctx.lineTo(62,0);ctx.closePath();ctx.fill();
  ctx.fillStyle="#153c44";ctx.fillRect(-47,-60,94,50);ctx.fillStyle=loc.color;ctx.fillRect(-70,-95,140,16);
  for(let i=0;i<7;i++){ctx.fillStyle=i%2?"#fff8e8":loc.color;ctx.beginPath();ctx.moveTo(-70+i*20,-79);ctx.lineTo(-50+i*20,-79);ctx.lineTo(-55+i*20,-67);ctx.lineTo(-66+i*20,-67);ctx.closePath();ctx.fill();}
  ctx.fillStyle="#fff";ctx.textAlign="center";ctx.font="800 10px Manrope";ctx.fillText(loc.title,0,-38);ctx.fillStyle="rgba(255,255,255,.6)";ctx.font="500 6px DM Mono";ctx.fillText(STORES.some(store=>store.id===id)?`DAY ${run.currentDay} · OPEN FOR BUSINESS`:loc.sub,0,-24);
  // interaction halo
  if(near){ctx.strokeStyle=loc.color;ctx.lineWidth=3;ctx.setLineDash([8,7]);ctx.beginPath();ctx.ellipse(0,5,92+Math.sin(lastTime*.004)*3,31,0,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);}
  // floating location plaque
  roundedRect(-72,-138,144,30,8,"rgba(4,25,31,.88)");ctx.fillStyle=loc.color;ctx.beginPath();ctx.arc(-56,-123,4,0,Math.PI*2);ctx.fill();ctx.fillStyle="#fff";ctx.textAlign="left";ctx.font="700 8px DM Mono";ctx.fillText(loc.title,-45,-120);ctx.restore();
}

function drawPlayer(t) {
  const bob=walking?Math.abs(Math.sin(t*.012))*3:Math.sin(t*.003)*.7,step=walking?Math.sin(t*.012):0;
  ctx.save();ctx.translate(run.player.x,run.player.y-bob);
  ctx.fillStyle="rgba(1,22,27,.3)";ctx.beginPath();ctx.ellipse(0,7+bob,22,8,0,0,Math.PI*2);ctx.fill();
  // legs and shoes
  ctx.strokeStyle="#18333a";ctx.lineWidth=7;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(-6,-8);ctx.lineTo(-8+step*5,5);ctx.moveTo(6,-8);ctx.lineTo(8-step*5,5);ctx.stroke();ctx.fillStyle="#f4f0dc";ctx.beginPath();ctx.ellipse(-9+step*5,6,7,3,0,0,Math.PI*2);ctx.ellipse(9-step*5,6,7,3,0,0,Math.PI*2);ctx.fill();
  // torso and backpack
  ctx.fillStyle="#c8ff5a";ctx.beginPath();ctx.roundRect(-14,-50,28,41,9);ctx.fill();ctx.fillStyle="#0d3540";ctx.beginPath();ctx.roundRect(-18,-46,10,30,5);ctx.fill();ctx.fillStyle="rgba(255,255,255,.3)";ctx.fillRect(7,-44,3,24);
  // head and cap
  ctx.fillStyle="#c48562";ctx.beginPath();ctx.arc(0,-61,12,0,Math.PI*2);ctx.fill();ctx.fillStyle="#092d37";ctx.beginPath();ctx.arc(0,-65,12,Math.PI,Math.PI*2);ctx.fill();ctx.fillRect(-11,-66,26,4);
  // direction marker
  ctx.strokeStyle="rgba(255,255,255,.92)";ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,-31,30,0,Math.PI*2);ctx.stroke();ctx.fillStyle="#fff";ctx.beginPath();ctx.moveTo(facing.x*31,facing.y*31-31);ctx.lineTo(facing.x*25-4,facing.y*25-27);ctx.lineTo(facing.x*25+4,facing.y*25-27);ctx.fill();ctx.restore();
}

function drawForeground(t){
  // surfboards and beach umbrellas create a stronger sense of depth
  [[190,850,"#ff6f52"],[1390,840,"#f0d45c"],[520,875,"#73d2c9"]].forEach(([x,y,c],i)=>{ctx.save();ctx.translate(x,y);ctx.rotate(-.35+i*.26);ctx.fillStyle="rgba(4,29,35,.18)";ctx.beginPath();ctx.ellipse(8,8,12,36,.4,0,Math.PI*2);ctx.fill();ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(0,0,9,42,0,0,Math.PI*2);ctx.fill();ctx.fillStyle="rgba(255,255,255,.7)";ctx.fillRect(-1,-36,2,72);ctx.restore();});
}

function loop(t) {
  const dt = Math.min((t-lastTime)/1000 || 0, .04); lastTime=t;
  let dx=0,dy=0;
  if(keys.has("w")||keys.has("arrowup"))dy--;
  if(keys.has("s")||keys.has("arrowdown"))dy++;
  if(keys.has("a")||keys.has("arrowleft"))dx--;
  if(keys.has("d")||keys.has("arrowright"))dx++;
  if((dx||dy)&&targetPoint)targetPoint=null;
  if(!dx&&!dy&&targetPoint){const tx=targetPoint.x-run.player.x,ty=targetPoint.y-run.player.y,dist=Math.hypot(tx,ty);if(dist<8)targetPoint=null;else{dx=tx/dist;dy=ty/dist;}}
  walking=Boolean(dx||dy);
  if(walking){const l=Math.hypot(dx,dy);dx/=l;dy/=l;facing={x:dx,y:dy};let nx=Math.max(55,Math.min(WORLD.width-55,run.player.x+dx*WALK_SPEED*dt));let ny=Math.max(475,Math.min(WORLD.waterline-30,run.player.y+dy*WALK_SPEED*dt));if(nx>360&&nx<1255&&ny<490)ny=490;run.player.x=nx;run.player.y=ny;}
  camera.x+=(run.player.x-camera.x)*Math.min(1,dt*4.8);camera.y+=(run.player.y-camera.y)*Math.min(1,dt*4.8);
  camera.zoom=Math.max(.78,Math.min(1.04,canvas.clientWidth/1150));
  const mini=$(".mini-player");if(mini){mini.style.left=`${run.player.x/WORLD.width*100}%`;mini.style.top=`${run.player.y/WORLD.height*100}%`;}
  updateProximity(); drawWorld(t); requestAnimationFrame(loop);
}

function updateProximity() {
  const near = Object.entries(locations).find(([,loc]) => Math.hypot(run.player.x-loc.x,run.player.y-loc.y)<86);
  $("#interactionHint").classList.toggle("hidden", !near);
  if(near) $("#interactionName").textContent=near[1].label;
}

function nearestLocation() { return Object.entries(locations).find(([,loc]) => Math.hypot(run.player.x-loc.x,run.player.y-loc.y)<86); }
function moveTo(id) { const loc=locations[id]; run.player={x:loc.x,y:loc.y+72};camera.x=run.player.x;camera.y=run.player.y;save(run);openLocation(id); }
function openLocation(id) { activeLocation=id; locations[id].panel(); drawer.classList.add("open"); drawer.setAttribute("aria-hidden","false"); }
function closeDrawer() { activeLocation=null; drawer.classList.remove("open"); drawer.setAttribute("aria-hidden","true"); }

function storeTabs(selected, action="supplier") {
  return `<div class="store-tabs">${STORES.map(store=>`<button class="store-tab ${selected===store.id?"active":""}" data-store="${store.id}" data-mode="${action}"><span>${store.icon}</span>${store.short}</button>`).join("")}</div>`;
}

function openSupplier(selectedStore="cafe") {
  currentSupplierStore=selectedStore;
  const store=STORES.find(item=>item.id===selectedStore), products=CATALOGUE.filter(product=>product.storeId===selectedStore);
  drawerContent.innerHTML = `
    <p class="eyebrow">Mercado Hub · wholesale market</p><h2>Buy inventory</h2>
    <p class="drawer-intro">Choose a venue, compare unit economics, and build a portfolio you can actually afford.</p>
    <div class="balance-banner"><span>AVAILABLE CASH</span><strong>${formatEuro(run.cash)}</strong></div>
    ${storeTabs(selectedStore)}
    <div class="section-heading"><div><small>STOCKING</small><strong>${store.name}</strong></div><span>${products.reduce((sum,p)=>sum+run.stock[p.id],0)} units owned</span></div>
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
  return `<article class="product-card" style="--product-color:${product.color}">
    <div class="product-head"><div class="product-icon">${product.icon}</div><div><h3>${product.name}</h3><p>${formatEuro(product.cost)} cost · ${formatEuro(product.reference)} reference</p></div><span class="stock-pill">${run.stock[product.id]} in stock</span></div>
    <div class="buy-row"><div class="qty-control"><button class="qty-minus" data-id="${product.id}" aria-label="Decrease quantity">−</button><input class="qty-input" data-id="${product.id}" id="qty-${product.id}" type="number" min="1" step="1" value="1" aria-label="Quantity"><button class="qty-plus" data-id="${product.id}" aria-label="Increase quantity">+</button></div><button class="action-button buy-button" data-id="${product.id}" ${run.completed ? "disabled" : ""}>Buy · <span id="total-${product.id}">${formatEuro(product.cost)}</span></button></div>
  </article>`;
}

function updateBuyTotal(id) {
  const product = CATALOGUE.find(p=>p.id===id), quantity = Number($(`#qty-${id}`).value);
  $(`#total-${id}`).textContent = Number.isInteger(quantity) && quantity > 0 ? formatEuro(product.cost*quantity) : "—";
}

function openStore(storeId="cafe") {
  const store=STORES.find(item=>item.id===storeId), products=CATALOGUE.filter(product=>product.storeId===storeId);
  const units=products.reduce((sum,p)=>sum+run.stock[p.id],0);
  const potential=products.reduce((sum,p)=>sum+Math.min(run.stock[p.id],demandFor(run.prices[p.id],p.reference))*run.prices[p.id],0);
  drawerContent.innerHTML = `
    <p class="eyebrow">Venue management · ${store.short}</p><h2>${store.name}</h2>
    <p class="drawer-intro">${store.pitch} Set prices, watch demand, and prepare this venue for day ${run.currentDay}.</p>
    ${storeTabs(storeId,"store")}
    <div class="venue-kpis"><div><small>ON HAND</small><strong>${units}</strong><span>units</span></div><div><small>DAY POTENTIAL</small><strong>${formatEuro(potential)}</strong><span>revenue</span></div><div><small>PRODUCTS</small><strong>3</strong><span>active</span></div></div>
    <div class="rule-box"><strong>Daily demand rule</strong><div class="rule-grid"><div><b>10 units</b><small>At or below reference</small></div><div><b>5 units</b><small>Above, up to 2×</small></div><div><b>0 units</b><small>Above 2× reference</small></div></div></div>
    <div class="product-list">${products.map(product => productPriceCard(product)).join("")}</div>
    <div class="trade-footer"><button class="action-button secondary" id="visitSupplier">Buy more stock</button><button class="action-button orange" id="tradeButton" ${run.completed ? "disabled" : ""}>Open day ${run.currentDay} →</button></div>`;
  drawerContent.querySelectorAll(".store-tab").forEach(button=>button.addEventListener("click",()=>openLocation(button.dataset.store)));
  drawerContent.querySelectorAll(".price-input").forEach(input => {
    input.addEventListener("input", () => updateDemandPreview(input.dataset.id));
    input.addEventListener("change", () => commitPrice(input.dataset.id));
  });
  drawerContent.querySelectorAll(".set-price").forEach(button => button.addEventListener("click",()=>commitPrice(button.dataset.id)));
  $("#visitSupplier").addEventListener("click",()=>{currentSupplierStore=storeId;openLocation("supplier");});
  $("#tradeButton").addEventListener("click", confirmTrade);
}

function openPortfolio() {
  drawerContent.innerHTML=`<p class="eyebrow">Portfolio · three campus venues</p><h2>Your business network</h2><p class="drawer-intro">Each venue has its own product mix, stock position, pricing and earning potential.</p><div class="venue-grid">${STORES.map(store=>{
    const products=CATALOGUE.filter(p=>p.storeId===store.id),units=products.reduce((sum,p)=>sum+run.stock[p.id],0),potential=products.reduce((sum,p)=>sum+Math.min(run.stock[p.id],demandFor(run.prices[p.id],p.reference))*run.prices[p.id],0);
    return `<button class="venue-card" data-store="${store.id}" style="--venue:${store.color}"><span class="venue-icon">${store.icon}</span><div><small>${store.short.toUpperCase()}</small><strong>${store.name}</strong><p>${store.pitch}</p></div><div class="venue-metrics"><span><b>${units}</b> stock</span><span><b>${formatEuro(potential)}</b> potential</span></div><em>Manage →</em></button>`}).join("")}</div>`;
  drawerContent.querySelectorAll(".venue-card").forEach(button=>button.addEventListener("click",()=>openLocation(button.dataset.store)));
}

function productPriceCard(product) {
  const price=run.prices[product.id], demand=demandFor(price,product.reference);
  return `<article class="product-card" style="--product-color:${product.color}">
    <div class="product-head"><div class="product-icon">${product.icon}</div><div><h3>${product.name}</h3><p>${run.stock[product.id]} in stock · ref. ${formatEuro(product.reference)}</p></div><span class="stock-pill">Cost ${formatEuro(product.cost)}</span></div>
    <div class="price-row"><div class="price-wrap"><span>€</span><input class="price-input" data-id="${product.id}" id="price-${product.id}" inputmode="decimal" value="${(price/100).toFixed(2)}" aria-label="Selling price for ${product.name}"></div><button class="action-button set-price" data-id="${product.id}" ${run.completed ? "disabled" : ""}>Set price</button></div>
    <div class="price-note"><span>Potential margin ${formatEuro(price-product.cost)} / unit</span><span class="demand-badge" id="demand-${product.id}">${demand} demand today</span></div>
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
  const projections=CATALOGUE.map(product=>({product, demand:demandFor(run.prices[product.id],product.reference), sold:Math.min(run.stock[product.id],demandFor(run.prices[product.id],product.reference))}));
  const venueForecasts=STORES.map(store=>{const items=projections.filter(item=>item.product.storeId===store.id);return {store,units:items.reduce((s,p)=>s+p.sold,0),revenue:items.reduce((s,p)=>s+p.sold*run.prices[p.product.id],0)}});
  modalCard.innerHTML=`<p class="eyebrow">Campus opening checklist</p><h2 id="modalTitle">Open day ${run.currentDay}</h2><p>All three venues trade together. This action records the day once and advances the run. Current plans can sell up to <strong>${projections.reduce((s,p)=>s+p.sold,0)} units</strong>.</p><div class="forecast-grid">${venueForecasts.map(v=>`<div style="--venue:${v.store.color}"><span>${v.store.icon}</span><small>${v.store.short}</small><strong>${v.units} units</strong><em>${formatEuro(v.revenue)} forecast revenue</em></div>`).join("")}</div><div class="modal-actions"><button class="action-button secondary" data-close>Keep planning</button><button class="action-button orange" id="confirmTrade">Open all venues</button></div>`;
  showModal(); modalCard.querySelector("[data-close]").addEventListener("click",hideModal); $("#confirmTrade").addEventListener("click",executeTrade,{once:true});
}

function executeTrade() {
  try { const next=tradeDay(run); save(next); closeDrawer(); showReport(next.history.at(-1),next.completed); beep(690); }
  catch(error){ hideModal(); toast(error.message,true); }
}

function showReport(day, final=false) {
  const value=overallResult(run), inv=inventoryValue(run);
  modalCard.innerHTML=`<p class="eyebrow">${final ? "Five-day run complete" : `Day ${day.day} closed`}</p><h2 id="modalTitle">${final ? "Your final score" : "The boardwalk is quiet"}</h2>
    <div class="report-hero"><small>${final ? "OVERALL GAIN / LOSS" : "TODAY'S GROSS PROFIT"}</small><strong class="${(final?value:day.totals.grossProfit)>=0?"":"result-negative"}">${formatEuro(final?value:day.totals.grossProfit)}</strong></div>
    <table class="mini-table"><thead><tr><th>Product</th><th>Sold</th><th>Revenue</th><th>COGS</th><th>Profit</th></tr></thead><tbody>${day.items.map(item=>{const p=CATALOGUE.find(x=>x.id===item.productId);return `<tr><td>${p.short}</td><td>${item.unitsSold}</td><td>${formatEuro(item.revenue)}</td><td>${formatEuro(item.cogs)}</td><td>${formatEuro(item.grossProfit)}</td></tr>`}).join("")}</tbody><tfoot><tr><td><strong>Total</strong></td><td><strong>${day.totals.unitsSold}</strong></td><td><strong>${formatEuro(day.totals.revenue)}</strong></td><td><strong>${formatEuro(day.totals.cogs)}</strong></td><td><strong>${formatEuro(day.totals.grossProfit)}</strong></td></tr></tfoot></table>
    ${final?`<div class="report-grid"><div><small>FINAL CASH</small><strong>${formatEuro(run.cash)}</strong></div><div><small>STOCK AT COST</small><strong>${formatEuro(inv)}</strong></div><div><small>STARTED WITH</small><strong>€100.00</strong></div></div>`:""}
    <div class="modal-actions">${final?`<button class="action-button secondary" id="reportLedger">View ledger</button><button class="action-button" id="reportRestart">Play again</button>`:`<button class="action-button" data-close>Continue to day ${run.currentDay}</button>`}</div>`;
  showModal();
  if(final){$("#reportLedger").addEventListener("click",()=>{hideModal();openLocation("board")});$("#reportRestart").addEventListener("click",confirmNewRun);}else modalCard.querySelector("[data-close]").addEventListener("click",hideModal);
}

function openLedger() {
  const gain=overallResult(run), inv=inventoryValue(run);
  const venueResults=STORES.map(store=>{const ids=new Set(CATALOGUE.filter(p=>p.storeId===store.id).map(p=>p.id));const items=run.history.flatMap(day=>day.items).filter(item=>ids.has(item.productId));return {store,units:items.reduce((s,i)=>s+i.unitsSold,0),revenue:items.reduce((s,i)=>s+i.revenue,0),profit:items.reduce((s,i)=>s+i.grossProfit,0)}});
  drawerContent.innerHTML=`<p class="eyebrow">Company finance · saved locally</p><h2>Portfolio performance</h2><p class="drawer-intro">Compare venues, inspect daily results, and decide where tomorrow's cash should go.</p>
    <div class="report-grid"><div><small>CASH</small><strong>${formatEuro(run.cash)}</strong></div><div><small>STOCK VALUE</small><strong>${formatEuro(inv)}</strong></div><div><small>GAIN / LOSS</small><strong class="${gain>=0?"result-positive":"result-negative"}">${formatEuro(gain)}</strong></div></div>
    <div class="section-heading"><div><small>VENUE COMPARISON</small><strong>Trading performance</strong></div><span>${run.history.length} / 5 days</span></div>
    <div class="venue-kpis">${venueResults.map(v=>`<div style="border-top:3px solid ${v.store.color}"><small>${v.store.short.toUpperCase()}</small><strong>${formatEuro(v.profit)}</strong><span>${v.units} sold · ${formatEuro(v.revenue)} revenue</span></div>`).join("")}</div>
    <div class="section-heading"><div><small>DAILY LEDGER</small><strong>Completed days</strong></div></div>
    <div class="history-list">${run.history.length?run.history.map(historyCard).reverse().join(""):`<div class="empty-state"><span>▤</span>No trading days yet.<br>Prepare your venues and open the campus.</div>`}</div>`;
}

function historyCard(day) {
  return `<details class="history-day"><summary><strong>Day ${day.day} · ${day.totals.unitsSold} units sold</strong><span>+${formatEuro(day.totals.revenue)}</span></summary><div class="history-detail"><table class="mini-table"><thead><tr><th>Product</th><th>Sold</th><th>Revenue</th><th>COGS</th><th>Profit</th></tr></thead><tbody>${day.items.map(item=>{const p=CATALOGUE.find(x=>x.id===item.productId);return `<tr><td>${p.short}</td><td>${item.unitsSold}</td><td>${formatEuro(item.revenue)}</td><td>${formatEuro(item.cogs)}</td><td>${formatEuro(item.grossProfit)}</td></tr>`}).join("")}</tbody></table></div></details>`;
}

function confirmNewRun() {
  modalCard.innerHTML=`<p class="eyebrow">Replace current run?</p><h2 id="modalTitle">Start from day one</h2><p>This replaces your saved run with <strong>€100.00 cash</strong>, zero stock, reference prices and an empty history. Cancelling keeps everything exactly as it is.</p><div class="modal-actions"><button class="action-button secondary" data-close>Cancel</button><button class="action-button orange" id="replaceRun">Replace run</button></div>`;
  showModal(); modalCard.querySelector("[data-close]").addEventListener("click",hideModal); $("#replaceRun").addEventListener("click",()=>{save(createRun());hideModal();closeDrawer();toast("Fresh venture started");beep(610);});
}

function showModal(){modal.classList.remove("hidden");}
function hideModal(){modal.classList.add("hidden");}
function toast(message,error=false){const el=document.createElement("div");el.className=`toast ${error?"error":""}`;el.textContent=message;$("#toastRegion").append(el);setTimeout(()=>el.remove(),2800);}
function beep(frequency){if(!soundOn)return;try{const audio=new AudioContext();const osc=audio.createOscillator(),gain=audio.createGain();osc.frequency.value=frequency;gain.gain.setValueAtTime(.05,audio.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.12);osc.connect(gain).connect(audio.destination);osc.start();osc.stop(audio.currentTime+.12);}catch(_){} }

window.addEventListener("resize",resize);
window.addEventListener("keydown",event=>{if(["w","a","s","d","arrowup","arrowdown","arrowleft","arrowright"].includes(event.key.toLowerCase())){keys.add(event.key.toLowerCase());targetPoint=null;event.preventDefault();}if(event.key.toLowerCase()==="e"&&modal.classList.contains("hidden")){const near=nearestLocation();if(near)openLocation(near[0]);}if(event.key==="Escape"){hideModal();closeDrawer();}});
window.addEventListener("keyup",event=>{keys.delete(event.key.toLowerCase());localStorage.setItem(STORAGE_KEY,JSON.stringify(run));});
canvas.addEventListener("click",event=>{const rect=canvas.getBoundingClientRect();const x=(event.clientX-rect.left-canvas.clientWidth/2)/camera.zoom+camera.x;const y=(event.clientY-rect.top-canvas.clientHeight/2)/camera.zoom+camera.y;const hit=Object.entries(locations).find(([,loc])=>Math.hypot(x-loc.x,y-loc.y)<95);if(hit)moveTo(hit[0]);else targetPoint={x:Math.max(55,Math.min(WORLD.width-55,x)),y:Math.max(475,Math.min(WORLD.waterline-30,y))};});
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
modal.addEventListener("click",event=>{if(event.target===modal)hideModal();});

resize(); updateHUD(); requestAnimationFrame(loop);
