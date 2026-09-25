const inventoryEndpoints = {
  adjustments: (filter = 'all', sort_by = 'created_time', sort_order = 'desc') =>
    `/api/inventory/adjustments/?filter=${filter}&sort_by=${sort_by}&sort_order=${sort_order}`,
  adjustmentDetail: (id) => `/api/inventory/adjustments/?adjustment_id=${id}`,
  createAdjustment: '/api/inventory/adjustments/',
  updateAdjustment: (id) => `/api/inventory/adjustments/?adjustment_id=${id}`,
  deleteAdjustment: (id) => `/api/inventory/adjustments/?adjustment_id=${id}`,
}

export default inventoryEndpoints
