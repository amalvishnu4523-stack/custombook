import axiosInstance from '../../../api/axiosInstance'
import itemsEndpoints from './endpoints'

// GET all items (accepts string filter or { filter, sort_by, sort_order } query params)
export const getItems = async (params = {}) => {
  let queryParams = {}
  if (typeof params === 'string') {
    queryParams = { filter: params }
  } else if (params && typeof params === 'object') {
    queryParams = params
  }

  const response = await axiosInstance.get(itemsEndpoints.list, {
    params: queryParams,
  })
  return response.data
}

// GET item types / options
export const getItemTypes = async () => {
  const response = await axiosInstance.get(itemsEndpoints.itemTypes)
  return response.data
}
export const getItemOptions = getItemTypes

// GET single item
export const getItemById = async (id) => {
  const response = await axiosInstance.get(itemsEndpoints.detail(id))
  return response.data
}

// CREATE item
export const createItem = async (data) => {
  const response = await axiosInstance.post(itemsEndpoints.create, data)
  return response.data
}

// UPDATE item (PUT)
export const updateItem = async (id, data) => {
  const response = await axiosInstance.put(itemsEndpoints.update(id), data)
  return response.data
}

// FULL REPLACE item (PUT)
export const fullReplaceItem = updateItem

// PATCH item (partial update)
export const patchItem = async (id, data) => {
  const response = await axiosInstance.patch(itemsEndpoints.patch(id), data)
  return response.data
}

// DELETE item
export const deleteItem = async (id) => {
  const response = await axiosInstance.delete(itemsEndpoints.delete(id))
  return response.data
}

// Direct Filter Helpers
export const getAllItems = () => getItems('all_items')
export const getActiveItems = () => getItems('active_items')
export const getInactiveItems = () => getItems('inactive_items')
export const getSalesItems = () => getItems('sales')
export const getPurchaseItems = () => getItems('purchases')
export const getServiceItems = () => getItems('services')
export const getZohoCrmItems = () => getItems('zoho_crm')
export const getInventoryItems = () => getItems('inventory_items')
export const getNonInventoryItems = () => getItems('non_inventory_items')

// Direct Sort Helpers
export const getItemsSortedByName = (order = 'asc') =>
  getItems({ sort_by: 'name', sort_order: order })
export const getItemsSortedBySalesPrice = (order = 'asc') =>
  getItems({ sort_by: 'sales_price', sort_order: order })
export const getItemsSortedByPurchasePrice = (order = 'asc') =>
  getItems({ sort_by: 'purchase_price', sort_order: order })
