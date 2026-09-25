import axiosInstance from '../../../api/axiosInstance'
import inventoryEndpoints from './endpoints'

// GET all inventory adjustments
export const getAdjustments = async (filter = 'all', sort_by = 'created_time', sort_order = 'desc') => {
  const response = await axiosInstance.get(
    inventoryEndpoints.adjustments(filter, sort_by, sort_order)
  )
  return response.data
}

// GET single adjustment by adjustment_id query param — unwraps results[0]
export const getAdjustmentById = async (id) => {
  const response = await axiosInstance.get(inventoryEndpoints.adjustmentDetail(id))
  const data = response.data
  if (data.success && Array.isArray(data.data?.results) && data.data.results.length > 0) {
    return { success: true, data: data.data.results[0] }
  }
  if (data.success && data.data && !Array.isArray(data.data)) {
    return { success: true, data: data.data }
  }
  return { success: false, data: null }
}

// CREATE adjustment
export const createAdjustment = async (data) => {
  const response = await axiosInstance.post(inventoryEndpoints.createAdjustment, data)
  return response.data
}

// UPDATE adjustment
export const updateAdjustment = async (id, data) => {
  const response = await axiosInstance.patch(inventoryEndpoints.updateAdjustment(id), data)
  return response.data
}

// DELETE adjustment
export const deleteAdjustment = async (id) => {
  const response = await axiosInstance.delete(inventoryEndpoints.deleteAdjustment(id))
  return response.data
}
