export const INITIAL_CASH = 10000;
export const MAX_DAYS = 5;
export const STORAGE_KEY = "nova-beach-ventures-v1";

export const STORES = Object.freeze([
  { id: "cafe", name: "Atlantic Café", short: "Café", icon: "☕", color: "#ff815d", pitch: "Coffee and quick campus comfort." },
  { id: "snack", name: "Beach Fuel Bar", short: "Fuel Bar", icon: "◉", color: "#b3dc65", pitch: "Fresh snacks for the promenade crowd." },
  { id: "merch", name: "Nova Supply Co.", short: "Merch", icon: "◆", color: "#67c7c4", pitch: "Campus gear with stronger margins." }
]);

export const CAMPUS_DAYS = Object.freeze([
  { day: 1, id: "lecture-rush", icon: "◷", title: "Lecture Rush", district: "Courtyard", brief: "Students cross the courtyard between morning classes.", objective: { type: "units", target: 5, label: "Sell at least 5 units" } },
  { day: 2, id: "surf-club", icon: "≈", title: "Surf Club Sign-up", district: "Boardwalk", brief: "The promenade fills up after the club introduction.", objective: { type: "profit", target: 1500, label: "Earn €15.00 gross profit" } },
  { day: 3, id: "career-fair", icon: "◇", title: "Career Fair", district: "Student Hub", brief: "Visitors circulate between the Hub and main building.", objective: { type: "venues", target: 2, label: "Make sales at 2 venues" } },
  { day: 4, id: "study-night", icon: "✦", title: "Study Marathon", district: "Learning Center", brief: "A long study session keeps the campus active all day.", objective: { type: "revenue", target: 6000, label: "Reach €60.00 revenue" } },
  { day: 5, id: "sunset-social", icon: "☀", title: "Sunset Social", district: "Beach Stage", brief: "The season closes with the campus gathered by the ocean.", objective: { type: "cash", target: 10000, label: "Finish with at least €100 cash" } }
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
  { id: "hoodie", storeId: "merch", tier: 3, name: "Nova Coast Hoodie", short: "Hoodie", icon: "⌂", cost: 1400, reference: 3000, color: "#4a687e" }
]);

export function createRun() {
  const stock = {}, prices = {};
  CATALOGUE.forEach(product => { stock[product.id] = 0; prices[product.id] = product.reference; });
  return { version: 1, cash: INITIAL_CASH, stock, prices, currentDay: 1, completed: false, history: [], purchases: [], venues: { cafe: 1, snack: 1, merch: 1 }, reputation: 0, upgrades: [], player: { x: 21, y: 18, zone: "campus" } };
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
  if (run.completed) throw new Error("This run is complete. Start a new run to buy again.");
  if (!Number.isInteger(quantity) || quantity <= 0) throw new Error("Quantity must be a positive whole number.");
  const product = CATALOGUE.find(item => item.id === productId);
  if (!product) throw new Error("Unknown product.");
  if ((run.venues?.[product.storeId] || 1) < (product.tier || 1)) throw new Error(`Upgrade this venue to level ${product.tier} to unlock ${product.name}.`);
  const total = product.cost * quantity;
  if (total > run.cash) throw new Error(`You need ${formatEuro(total)} but only have ${formatEuro(run.cash)}.`);
  const next = structuredClone(run);
  next.cash -= total;
  next.stock[productId] += quantity;
  next.purchases.push({ at: now, day: run.currentDay, productId, quantity, total });
  return next;
}

export function setPrice(run, productId, cents) {
  if (run.completed) throw new Error("This run is complete. Prices are locked.");
  if (!Number.isInteger(cents) || cents <= 0) throw new Error("Price must be positive and use at most two decimals.");
  if (!CATALOGUE.some(item => item.id === productId)) throw new Error("Unknown product.");
  const next = structuredClone(run);
  next.prices[productId] = cents;
  return next;
}

export function tradeDay(run, now = new Date().toISOString()) {
  if (run.completed || run.history.length >= MAX_DAYS) throw new Error("All five trading days are complete.");
  const next = structuredClone(run);
  const items = CATALOGUE.map(product => {
    const price = next.prices[product.id];
    const demand = demandFor(price, product.reference);
    const unitsSold = Math.min(demand, next.stock[product.id]);
    const revenue = unitsSold * price;
    const cogs = unitsSold * product.cost;
    next.stock[product.id] -= unitsSold;
    next.cash += revenue;
    return { productId: product.id, unitsSold, demand, price, revenue, cogs, grossProfit: revenue - cogs };
  });
  const totals = items.reduce((sum, item) => ({
    unitsSold: sum.unitsSold + item.unitsSold,
    revenue: sum.revenue + item.revenue,
    cogs: sum.cogs + item.cogs,
    grossProfit: sum.grossProfit + item.grossProfit
  }), { unitsSold: 0, revenue: 0, cogs: 0, grossProfit: 0 });
  const campusDay = CAMPUS_DAYS[run.currentDay - 1];
  const activeVenues = new Set(items.filter(item => item.unitsSold > 0).map(item => CATALOGUE.find(product => product.id === item.productId)?.storeId)).size;
  const objectiveValue = campusDay.objective.type === "units" ? totals.unitsSold
    : campusDay.objective.type === "profit" ? totals.grossProfit
    : campusDay.objective.type === "venues" ? activeVenues
    : campusDay.objective.type === "revenue" ? totals.revenue
    : next.cash;
  const objective = { ...campusDay.objective, value: objectiveValue, completed: objectiveValue >= campusDay.objective.target, reputation: objectiveValue >= campusDay.objective.target ? 4 : 0 };
  next.history.push({ day: run.currentDay, eventId: campusDay.id, completedAt: now, items, totals, closingCash: next.cash, objective });
  next.reputation = (next.reputation || 0) + Math.max(1, Math.floor(Math.max(0, totals.grossProfit) / 200)) + objective.reputation;
  if (run.currentDay >= MAX_DAYS) next.completed = true;
  else next.currentDay += 1;
  return next;
}

export function inventoryValue(run) {
  return CATALOGUE.reduce((sum, product) => sum + run.stock[product.id] * product.cost, 0);
}

export function overallResult(run) { return run.cash + inventoryValue(run) - INITIAL_CASH; }
export function formatEuro(cents) { return new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" }).format(cents / 100); }

export function upgradeVenue(run, storeId, now = new Date().toISOString()) {
  if (run.completed) throw new Error("This run is complete. Start a new run to upgrade again.");
  if (!STORES.some(store => store.id === storeId)) throw new Error("Unknown venue.");
  const level = run.venues?.[storeId] || 1;
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
