/**
 * Lightweight in-memory store for items.
 * Both Items list and ItemForm import from here so they share the same data.
 */

let nextId = 7

let items = [
  { id: 1, name: 'Wireless Mouse',      sku: 'WM-001', type: 'Goods',   unit: 'pcs', salesPrice: 799,  purchasePrice: 500,  stock: 120, salesAccount: 'Sales',            purchaseAccount: 'Cost of Goods Sold', salesDescription: 'Ergonomic wireless mouse with USB receiver.', purchaseDescription: '' },
  { id: 2, name: 'Mechanical Keyboard', sku: 'MK-002', type: 'Goods',   unit: 'pcs', salesPrice: 2499, purchasePrice: 1800, stock: 45,  salesAccount: 'Sales',            purchaseAccount: 'Cost of Goods Sold', salesDescription: 'Mechanical keyboard with Cherry MX switches.', purchaseDescription: '' },
  { id: 3, name: 'Web Development',     sku: 'SV-001', type: 'Service', unit: 'hrs', salesPrice: 1500, purchasePrice: null, stock: null, salesAccount: 'Sales',           purchaseAccount: null,                 salesDescription: 'Custom web development services per hour.', purchaseDescription: '' },
  { id: 4, name: 'USB-C Hub',           sku: 'UH-003', type: 'Goods',   unit: 'pcs', salesPrice: 1299, purchasePrice: 900,  stock: 30,  salesAccount: 'Sales',            purchaseAccount: 'Cost of Goods Sold', salesDescription: '7-in-1 USB-C hub with HDMI and PD charging.', purchaseDescription: '' },
  { id: 5, name: 'SEO Audit',           sku: 'SV-002', type: 'Service', unit: 'hrs', salesPrice: 2000, purchasePrice: null, stock: null, salesAccount: 'Sales',           purchaseAccount: null,                 salesDescription: 'Comprehensive SEO audit and recommendations.', purchaseDescription: '' },
  { id: 6, name: 'Monitor Stand',       sku: 'MS-004', type: 'Goods',   unit: 'pcs', salesPrice: 999,  purchasePrice: 650,  stock: 60,  salesAccount: 'Sales',            purchaseAccount: 'Cost of Goods Sold', salesDescription: 'Adjustable aluminium monitor stand.', purchaseDescription: '' },
]

/** Subscribers that get called when items change */
const listeners = new Set()

function notify() {
  listeners.forEach(fn => fn([...items]))
}

export function subscribe(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function getItems() {
  return [...items]
}

export function getItemById(id) {
  return items.find(i => i.id === Number(id)) ?? null
}

export function addItem(data) {
  const item = { id: nextId++, ...data }
  items = [...items, item]
  notify()
  return item
}

export function updateItem(id, data) {
  items = items.map(i => i.id === Number(id) ? { ...i, ...data } : i)
  notify()
}

export function deleteItem(id) {
  items = items.filter(i => i.id !== Number(id))
  notify()
}
