const inventoryEndpoints = {
  // ── Inventory Adjustments ──
  // GET all adjustments (with filter, sort)
  adjustments: (filter = 'all', sort_by = 'created_time', sort_order = 'desc') =>
    `/api/inventory/adjustments/?filter=${filter}&sort_by=${sort_by}&sort_order=${sort_order}`,

  // GET / PATCH / DELETE single adjustment by adjustment_id query param
  adjustmentDetail: (id) => `/api/inventory/adjustments/?adjustment_id=${id}`,
  updateAdjustment: (id) => `/api/inventory/adjustments/?adjustment_id=${id}`,
  deleteAdjustment: (id) => `/api/inventory/adjustments/?adjustment_id=${id}`,      

  // POST create new adjustment
  createAdjustment: '/api/inventory/adjustments/',

  // GET adjustment form options (reasons, types, accounts, locations etc.)
  adjustmentOptions: '/api/inventory/adjustments/options/',

  // ── Items (used inside inventory forms for item lookup) ──
  allItems: '/api/items/?filter=all_items',
}

export default inventoryEndpoints
