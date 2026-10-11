export const INITIAL_CASH = 10000;
export const MAX_DAYS = 5;
export const STORAGE_KEY = "nova-beach-ventures-v1";

export const STORES = Object.freeze([
  { id: "cafe", name: "Atlantic Café", short: "Café", icon: "☕", color: "#ff815d", pitch: "Coffee and quick campus comfort." },
  { id: "snack", name: "Beach Fuel Bar", short: "Fuel Bar", icon: "◉", color: "#b3dc65", pitch: "Fresh snacks for the promenade crowd." },
  { id: "merch", name: "Nova Supply Co.", short: "Merch", icon: "◆", color: "#67c7c4", pitch: "Campus gear with stronger margins." }
]);

export const CATALOGUE = Object.freeze([
  { id: "coldBrew", storeId: "cafe", name: "Atlantic Cold Brew", short: "Cold Brew", icon: "☕", cost: 200, reference: 400, color: "#e98a55" },
  { id: "nata", storeId: "cafe", name: "Pastel de Nata", short: "Nata", icon: "✦", cost: 120, reference: 250, color: "#efbd58" },
  { id: "toastie", storeId: "cafe", name: "Campus Toastie", short: "Toastie", icon: "▰", cost: 300, reference: 650, color: "#d77c4c" },
  { id: "acai", storeId: "snack", name: "Surf Açaí Cup", short: "Açaí Cup", icon: "◉", cost: 300, reference: 600, color: "#a979bd" },
  { id: "water", storeId: "snack", name: "Lemon Water", short: "Lemon Water", icon: "◇", cost: 80, reference: 200, color: "#8dcae5" },
  { id: "bites", storeId: "snack", name: "Energy Bites", short: "Energy Bites", icon: "●", cost: 150, reference: 350, color: "#9fbb55" },
  { id: "tote", storeId: "merch", name: "Nova Wave Tote", short: "Wave Tote", icon: "▱", cost: 500, reference: 1000, color: "#58bdb4" },
  { id: "cap", storeId: "merch", name: "Carcavelos Cap", short: "Campus Cap", icon: "⌒", cost: 700, reference: 1500, color: "#5a90ad" },
  { id: "hoodie", storeId: "merch", name: "Nova Coast Hoodie", short: "Hoodie", icon: "⌂", cost: 1400, reference: 3000, color: "#4a687e" }
]);

export function createRun() {
  const stock = {}, prices = {};
  CATALOGUE.forEach(product => { stock[product.id] = 0; prices[product.id] = product.reference; });
  return { version: 1, cash: INITIAL_CASH, stock, prices, currentDay: 1, completed: false, history: [], purchases: [], player: { x: 760, y: 690 } };
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
  next.history.push({ day: run.currentDay, completedAt: now, items, totals, closingCash: next.cash });
  if (run.currentDay >= MAX_DAYS) next.completed = true;
  else next.currentDay += 1;
  return next;
}

export function inventoryValue(run) {
  return CATALOGUE.reduce((sum, product) => sum + run.stock[product.id] * product.cost, 0);
}

export function overallResult(run) { return run.cash + inventoryValue(run) - INITIAL_CASH; }
export function formatEuro(cents) { return new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" }).format(cents / 100); }
