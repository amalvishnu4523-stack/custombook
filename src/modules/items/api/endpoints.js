const itemsEndpoints = {
  list:   '/api/items/',
  create: '/api/items/',
  detail: (id) => `/api/items/?item_id=${id}`,
  update: (id) => `/api/items/${id}/`,
  delete: (id) => `/api/items/${id}/`,
}

export default itemsEndpoints
