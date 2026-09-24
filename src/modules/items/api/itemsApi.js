import axiosInstance from '../../../api/axiosInstance'
import itemsEndpoints from './endpoints'

// GET all items
export const getItems = async () => {
  const response = await axiosInstance.get(itemsEndpoints.list)
  return response.data
}

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

// UPDATE item
export const updateItem = async (id, data) => {
  const response = await axiosInstance.put(itemsEndpoints.update(id), data)
  return response.data
}

// PATCH item (partial update)
export const patchItem = async (id, data) => {
  const response = await axiosInstance.patch(itemsEndpoints.update(id), data)
  return response.data
}

// DELETE item
export const deleteItem = async (id) => {
  const response = await axiosInstance.delete(itemsEndpoints.delete(id))
  return response.data
}
