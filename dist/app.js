import { CATALOGUE, MAX_DAYS, STORAGE_KEY, createRun, demandFor, parseEuro, buyStock, setPrice, tradeDay, inventoryValue, overallResult, formatEuro } from "./core.js";

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
let waveTime = 0;

const locations = {
  supplier: { x: 24, y: 46, label: "Enter Mercado Hub", panel: openSupplier },
  stand: { x: 62, y: 57, label: "Manage your stand", panel: openStand },
  board: { x: 82, y: 40, label: "Open the ledger", panel: openLedger }
};

function loadRun() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (parsed && parsed.version === 1 && Array.isArray(parsed.history)) return parsed;
  } catch (_) {}
  const fresh = createRun();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
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
  let title = "Stock your stand", text = "Walk to Mercado Hub and buy your first products.", progress = 8;
  if (run.completed) {
    title = overallResult(run) >= 0 ? "Venture complete!" : "A useful first run";
    text = `Your five-day result is ${formatEuro(overallResult(run))}. Open the ledger for the full story.`;
    progress = 100;
  } else if (totalStock > 0) {
    title = `Prepare day ${run.currentDay}`;
    text = "Check your prices at the stand, then open for the day when you're ready.";
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
  const w = canvas.clientWidth, h = canvas.clientHeight;
  return { x: x / 100 * w, y: y / 100 * h };
}

function roundedRect(x, y, w, h, r, fill) {
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fillStyle = fill; ctx.fill();
}

function drawWorld(t) {
  const w = canvas.clientWidth, h = canvas.clientHeight;
  ctx.clearRect(0, 0, w, h);
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, "#96d9df"); sky.addColorStop(.55, "#d9e9d5"); sky.addColorStop(1, "#e8cf9f");
  ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h);

  // Atlantic water and moving wave lines
  ctx.fillStyle = "#42aabd"; ctx.beginPath(); ctx.moveTo(0, h * .72); ctx.quadraticCurveTo(w * .35, h * .64, w, h * .7); ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.fill();
  for (let i = 0; i < 8; i++) {
    const yy = h * (.72 + i * .035);
    ctx.strokeStyle = `rgba(230,252,244,${.2 + i * .035})`; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = -30; x <= w + 30; x += 30) {
      const y = yy + Math.sin(x * .025 + t * .0018 + i) * 4;
      x === -30 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Sand and campus terrain
  ctx.fillStyle = "#e8cd96"; ctx.beginPath(); ctx.moveTo(0, h * .61); ctx.quadraticCurveTo(w * .4, h * .56, w, h * .63); ctx.lineTo(w, h * .72); ctx.quadraticCurveTo(w * .35, h * .65, 0, h * .73); ctx.fill();
  ctx.fillStyle = "#a9cd86"; ctx.beginPath(); ctx.moveTo(0, h * .18); ctx.lineTo(w, h * .15); ctx.lineTo(w, h * .63); ctx.quadraticCurveTo(w * .35, h * .56, 0, h * .61); ctx.fill();
  ctx.fillStyle = "#dae3d1"; ctx.beginPath(); ctx.moveTo(0, h * .48); ctx.lineTo(w, h * .43); ctx.lineTo(w, h * .54); ctx.lineTo(0, h * .58); ctx.fill();

  drawCampus(w, h);
  drawLocation("supplier", "MERCADO HUB", "SUPPLIES", "#f5c85c");
  drawLocation("stand", "YOUR POP-UP", `DAY ${run.currentDay}`, "#ff8059");
  drawLocation("board", "VENTURE LEDGER", "RESULTS", "#74cabf");
  drawDecor(w, h, t);
  drawPlayer(t);
}

function drawCampus(w, h) {
  const x = w * .34, y = h * .20, bw = Math.min(w * .36, 520), bh = h * .23;
  ctx.fillStyle = "rgba(7,43,54,.15)"; ctx.beginPath(); ctx.ellipse(x + bw * .55, y + bh + 18, bw * .62, 20, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#f4f1e6"; ctx.beginPath(); ctx.moveTo(x, y + 26); ctx.lineTo(x + bw * .88, y); ctx.lineTo(x + bw, y + bh * .77); ctx.lineTo(x + bw * .12, y + bh); ctx.closePath(); ctx.fill();
  ctx.fillStyle = "#183f49"; ctx.beginPath(); ctx.moveTo(x + bw * .08, y + 50); ctx.lineTo(x + bw * .82, y + 28); ctx.lineTo(x + bw * .87, y + bh * .68); ctx.lineTo(x + bw * .14, y + bh * .86); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = "rgba(149,220,224,.42)"; ctx.lineWidth = 2;
  for (let i = 1; i < 8; i++) { const xx = x + bw * (.1 + i * .09); ctx.beginPath(); ctx.moveTo(xx, y + 47 - i * 2.4); ctx.lineTo(xx + 14, y + bh * .84 - i * 2); ctx.stroke(); }
  ctx.fillStyle = "#ff7f50"; ctx.fillRect(x + bw * .43, y + bh * .88, bw * .26, 8);
  ctx.fillStyle = "rgba(255,255,255,.75)"; ctx.font = "700 10px Manrope"; ctx.fillText("NOVA SBE · CARCAVELOS", x + bw * .17, y + 42);
}

function drawLocation(id, title, sub, color) {
  const loc = locations[id], p = worldToScreen(loc.x, loc.y);
  const scale = Math.max(.75, Math.min(1, canvas.clientWidth / 1100));
  const ww = 112 * scale, hh = 54 * scale;
  ctx.save(); ctx.translate(p.x, p.y);
  ctx.fillStyle = "rgba(4,34,42,.18)"; ctx.beginPath(); ctx.ellipse(0, 17, ww * .54, 12, 0, 0, Math.PI * 2); ctx.fill();
  roundedRect(-ww/2, -hh/2, ww, hh, 9, "#fffaf0");
  ctx.fillStyle = color; ctx.fillRect(-ww/2, -hh/2, ww, 9);
  ctx.fillStyle = "#0a3039"; ctx.textAlign = "center"; ctx.font = `800 ${10*scale}px Manrope`; ctx.fillText(title, 0, -1);
  ctx.fillStyle = "#688087"; ctx.font = `500 ${7*scale}px DM Mono`; ctx.fillText(sub, 0, 12);
  const distance = Math.hypot(run.player.x - loc.x, run.player.y - loc.y);
  if (distance < 8) { ctx.strokeStyle = color; ctx.lineWidth = 3; ctx.strokeRect(-ww/2 - 4, -hh/2 - 4, ww + 8, hh + 8); }
  ctx.restore();
}

function drawDecor(w, h, t) {
  const palms = [[9,34],[91,26],[72,48],[15,59]];
  palms.forEach(([x,y], i) => { const p=worldToScreen(x,y); ctx.strokeStyle="#775b3d"; ctx.lineWidth=4; ctx.beginPath(); ctx.moveTo(p.x,p.y+18); ctx.quadraticCurveTo(p.x+3,p.y,p.x+Math.sin(t*.001+i)*2,p.y-15); ctx.stroke(); ctx.fillStyle="#2e8664"; for(let a=0;a<5;a++){ctx.beginPath();ctx.ellipse(p.x+Math.cos(a*1.25)*10,p.y-17+Math.sin(a*1.25)*5,10,3,a*1.25,0,Math.PI*2);ctx.fill();} });
  // students
  [[45,51,"#ffc65a"],[54,45,"#ef6d58"],[76,34,"#84c8d1"],[33,57,"#a27bc0"]].forEach(([x,y,c],i)=>{const p=worldToScreen(x+Math.sin(t*.0004+i)*1.2,y);ctx.fillStyle="rgba(7,43,54,.14)";ctx.beginPath();ctx.ellipse(p.x,p.y+9,7,3,0,0,Math.PI*2);ctx.fill();ctx.fillStyle=c;ctx.beginPath();ctx.arc(p.x,p.y,5,0,Math.PI*2);ctx.fill();ctx.strokeStyle="#173c45";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(p.x,p.y+5);ctx.lineTo(p.x-2,p.y+12);ctx.moveTo(p.x,p.y+5);ctx.lineTo(p.x+3,p.y+12);ctx.stroke();});
  // surfboards
  [[12,68,"#ff7f50"],[88,66,"#e9db6b"]].forEach(([x,y,c])=>{const p=worldToScreen(x,y);ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(p.x,p.y,4,17,.5,0,Math.PI*2);ctx.fill();});
}

function drawPlayer(t) {
  const p = worldToScreen(run.player.x, run.player.y);
  ctx.fillStyle = "rgba(4,31,38,.22)"; ctx.beginPath(); ctx.ellipse(p.x, p.y + 10, 12, 5, 0, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = "white"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(p.x, p.y-4, 12 + Math.sin(t*.006), 0, Math.PI*2); ctx.stroke();
  ctx.fillStyle = "#092c35"; ctx.beginPath(); ctx.arc(p.x, p.y-4, 9, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = "#b8ed65"; ctx.beginPath(); ctx.arc(p.x, p.y-7, 4, 0, Math.PI*2); ctx.fill();
  ctx.fillRect(p.x-5,p.y-2,10,9);
}

function loop(t) {
  const dt = Math.min((t-lastTime)/1000 || 0, .04); lastTime=t; waveTime=t;
  let dx=0,dy=0;
  if(keys.has("w")||keys.has("arrowup"))dy--;
  if(keys.has("s")||keys.has("arrowdown"))dy++;
  if(keys.has("a")||keys.has("arrowleft"))dx--;
  if(keys.has("d")||keys.has("arrowright"))dx++;
  if(dx||dy){ const l=Math.hypot(dx,dy); run.player.x=Math.max(3,Math.min(97,run.player.x+dx/l*22*dt)); run.player.y=Math.max(20,Math.min(68,run.player.y+dy/l*22*dt)); }
  updateProximity(); drawWorld(t); requestAnimationFrame(loop);
}

function updateProximity() {
  const near = Object.entries(locations).find(([,loc]) => Math.hypot(run.player.x-loc.x,run.player.y-loc.y)<8);
  $("#interactionHint").classList.toggle("hidden", !near);
  if(near) $("#interactionName").textContent=near[1].label;
}

function nearestLocation() { return Object.entries(locations).find(([,loc]) => Math.hypot(run.player.x-loc.x,run.player.y-loc.y)<8); }
function moveTo(id) { const loc=locations[id]; run.player={x:loc.x,y:loc.y+5}; save(run); openLocation(id); }
function openLocation(id) { activeLocation=id; locations[id].panel(); drawer.classList.add("open"); drawer.setAttribute("aria-hidden","false"); }
function closeDrawer() { activeLocation=null; drawer.classList.remove("open"); drawer.setAttribute("aria-hidden","true"); }

function openSupplier() {
  drawerContent.innerHTML = `
    <p class="eyebrow">Mercado Hub · supplier</p><h2>Stock up for day ${run.currentDay}</h2>
    <p class="drawer-intro">Buy only what you can afford. Unsold goods carry over, so every unit is a bet on the week.</p>
    <div class="balance-banner"><span>AVAILABLE CASH</span><strong>${formatEuro(run.cash)}</strong></div>
    <div class="product-list">${CATALOGUE.map(product => productBuyCard(product)).join("")}</div>`;
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

function openStand() {
  drawerContent.innerHTML = `
    <p class="eyebrow">Atlantic Promenade · your pop-up</p><h2>Price for demand</h2>
    <p class="drawer-intro">Your pricing decides demand. Sales can never exceed the stock you have on hand.</p>
    <div class="rule-box"><strong>Daily demand rule</strong><div class="rule-grid"><div><b>10 units</b><small>At or below reference</small></div><div><b>5 units</b><small>Above, up to 2×</small></div><div><b>0 units</b><small>Above 2× reference</small></div></div></div>
    <div class="product-list">${CATALOGUE.map(product => productPriceCard(product)).join("")}</div>
    <div class="trade-footer"><button class="action-button secondary" id="visitSupplier">Buy more stock</button><button class="action-button orange" id="tradeButton" ${run.completed ? "disabled" : ""}>Open day ${run.currentDay} →</button></div>`;
  drawerContent.querySelectorAll(".price-input").forEach(input => {
    input.addEventListener("input", () => updateDemandPreview(input.dataset.id));
    input.addEventListener("change", () => commitPrice(input.dataset.id));
  });
  drawerContent.querySelectorAll(".set-price").forEach(button => button.addEventListener("click",()=>commitPrice(button.dataset.id)));
  $("#visitSupplier").addEventListener("click",()=>openLocation("supplier"));
  $("#tradeButton").addEventListener("click", confirmTrade);
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
  catch(error){ toast(error.message,true); openStand(); beep(180); }
}

function confirmTrade() {
  const projections=CATALOGUE.map(product=>({product, demand:demandFor(run.prices[product.id],product.reference), sold:Math.min(run.stock[product.id],demandFor(run.prices[product.id],product.reference))}));
  modalCard.innerHTML=`<p class="eyebrow">Ready to trade?</p><h2 id="modalTitle">Open day ${run.currentDay}</h2><p>This action will record the day once and advance your five-day run. Based on current prices and stock, you can sell up to <strong>${projections.reduce((s,p)=>s+p.sold,0)} units</strong>.</p><div class="report-grid">${projections.map(p=>`<div><small>${p.product.short}</small><strong>${p.sold} / ${p.demand}</strong></div>`).join("")}</div><div class="modal-actions"><button class="action-button secondary" data-close>Keep planning</button><button class="action-button orange" id="confirmTrade">Open now</button></div>`;
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
  drawerContent.innerHTML=`<p class="eyebrow">Venture ledger · saved locally</p><h2>Your five-day story</h2><p class="drawer-intro">Every completed day is recorded once. Close the game whenever you like—your balances, prices and history will be here when you return.</p>
    <div class="report-grid"><div><small>CASH</small><strong>${formatEuro(run.cash)}</strong></div><div><small>STOCK VALUE</small><strong>${formatEuro(inv)}</strong></div><div><small>GAIN / LOSS</small><strong class="${gain>=0?"result-positive":"result-negative"}">${formatEuro(gain)}</strong></div></div>
    <div class="history-list">${run.history.length?run.history.map(historyCard).reverse().join(""):`<div class="empty-state"><span>▤</span>No trading days yet.<br>Open your stand to write the first entry.</div>`}</div>`;
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
window.addEventListener("keydown",event=>{if(["w","a","s","d","arrowup","arrowdown","arrowleft","arrowright"].includes(event.key.toLowerCase())){keys.add(event.key.toLowerCase());event.preventDefault();}if(event.key.toLowerCase()==="e"&&modal.classList.contains("hidden")){const near=nearestLocation();if(near)openLocation(near[0]);}if(event.key==="Escape"){hideModal();closeDrawer();}});
window.addEventListener("keyup",event=>keys.delete(event.key.toLowerCase()));
canvas.addEventListener("click",event=>{const rect=canvas.getBoundingClientRect(),x=(event.clientX-rect.left)/rect.width*100,y=(event.clientY-rect.top)/rect.height*100;const hit=Object.entries(locations).find(([,loc])=>Math.hypot(x-loc.x,y-loc.y)<10);if(hit)moveTo(hit[0]);else{run.player.x=Math.max(3,Math.min(97,x));run.player.y=Math.max(20,Math.min(68,y));save(run);}});
$("#closeDrawer").addEventListener("click",closeDrawer);
$("#newRunButton").addEventListener("click",confirmNewRun);
$("#soundButton").addEventListener("click",()=>{soundOn=!soundOn;$("#soundButton").classList.toggle("muted",!soundOn);$("#soundButton").textContent=soundOn?"♪":"×";});
document.querySelectorAll(".quick-nav button").forEach(button=>button.addEventListener("click",()=>moveTo(button.dataset.location)));
modal.addEventListener("click",event=>{if(event.target===modal)hideModal();});

resize(); updateHUD(); requestAnimationFrame(loop);
