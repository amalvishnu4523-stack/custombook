import axiosInstance from '../../../api/axiosInstance'
import itemsEndpoints from './endpoints'

// GET all items
export const getItems = async (params = {}) => {
  let queryParams = {}
  if (typeof params === 'string') {
    queryParams = { filter: params }
  } else if (params && typeof params === 'object') {
    queryParams = params
  }
  const response = await axiosInstance.get(itemsEndpoints.list, { params: queryParams })
  return response.data
}

// GET single item by item_id — unwraps results[0]
// Falls back to filtering the full list if direct lookup returns empty
export const getItemById = async (id) => {
  try {
    const response = await axiosInstance.get(itemsEndpoints.detail(id))
    const data = response.data
    console.log('getItemById response:', data)

    if (data.success && data.data?.results?.length > 0) {
      return { success: true, data: data.data.results[0] }
    }

    // Fallback: fetch all items and find by item_id client-side
    const allRes = await axiosInstance.get(itemsEndpoints.list)
    const allData = allRes.data
    if (allData.success && Array.isArray(allData.data?.results)) {
      const found = allData.data.results.find(i => i.item_id === id)
      if (found) return { success: true, data: found }
    }

    return { success: false, data: null }
  } catch (err) {
    throw err
  }
}

// CREATE item
export const createItem = async (data) => {
  const response = await axiosInstance.post(itemsEndpoints.create, data)
  return response.data
}

// UPDATE item — PATCH with ?item_id= query param
export const updateItem = async (id, data) => {
  const response = await axiosInstance.patch(itemsEndpoints.update(id), data)
  return response.data
}

// PATCH item (alias)
export const patchItem = updateItem

// DELETE item
export const deleteItem = async (id) => {
  const response = await axiosInstance.delete(itemsEndpoints.delete(id))
  return response.data
}

// Filter helpers
export const getAllItems         = () => getItems('all_items')
export const getActiveItems      = () => getItems('active_items')
export const getInactiveItems    = () => getItems('inactive_items')
export const getSalesItems       = () => getItems('sales')
export const getPurchaseItems    = () => getItems('purchases')
export const getServiceItems     = () => getItems('services')
export const getInventoryItems   = () => getItems('inventory_items')
