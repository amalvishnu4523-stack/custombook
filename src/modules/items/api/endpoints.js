const itemsEndpoints = {
  // Options / Item types
  options: '/api/items/options/',
  itemTypes: '/api/items/options/',

  // Base & CRUD
  list: '/api/items/',
  create: '/api/items/',
  detail: (id) => `/api/items/?item_id=${id}`,
  update: (id) => `/api/items/?item_id=${id}`,
  patch: (id) => `/api/items/?item_id=${id}`,
  delete: (id) => `/api/items/?item_id=${id}`,
  fullReplace: (id) => `/api/items/?item_id=${id}`,

  // Filter endpoints
  filters: {
    all_items: '/api/items/?filter=all_items',
    active_items: '/api/items/?filter=active_items',
    inactive_items: '/api/items/?filter=inactive_items',
    sales: '/api/items/?filter=sales',
    purchases: '/api/items/?filter=purchases',
    services: '/api/items/?filter=services',
    zoho_crm: '/api/items/?filter=zoho_crm',
    inventory_items: '/api/items/?filter=inventory_items',
    non_inventory_items: '/api/items/?filter=non_inventory_items',
  },

  // Sort endpoints
  sort: {
    byName: (order = 'asc') => `/api/items/?sort_by=name&sort_order=${order}`,
    bySalesPrice: (order = 'asc') => `/api/items/?sort_by=sales_price&sort_order=${order}`,
    byPurchasePrice: (order = 'asc') => `/api/items/?sort_by=purchase_price&sort_order=${order}`,
  },

  // Helper query URL builder
  query: ({ filter, sort_by, sort_order = 'asc' } = {}) => {
    const params = new URLSearchParams()
    if (filter) params.append('filter', filter)
    if (sort_by) params.append('sort_by', sort_by)
    if (sort_order) params.append('sort_order', sort_order)
    const queryString = params.toString()
    return queryString ? `/api/items/?${queryString}` : '/api/items/'
  },
}

export default itemsEndpoints
