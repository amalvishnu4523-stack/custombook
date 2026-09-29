import axiosInstance from '../../../api/axiosInstance'
import inventoryEndpoints from './endpoints'

// ── GET all inventory adjustments ──
// filter: 'all' | 'adjusted' | 'draft'
// sort_by: 'created_time' | 'date' | 'reason'
// sort_order: 'asc' | 'desc'
export const getAdjustments = async (
  filter = 'all',
  sort_by = 'created_time',
  sort_order = 'desc'
) => {
  const response = await axiosInstance.get(
    inventoryEndpoints.adjustments(filter, sort_by, sort_order)
  )
  return response.data
}

// ── GET single adjustment by adjustment_id — unwraps results[0] ──
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

// ── GET adjustment form options (reasons, types, accounts, locations) ──
export const getAdjustmentOptions = async () => {
  const response = await axiosInstance.get(inventoryEndpoints.adjustmentOptions)
  return response.data
}

// ── GET all items (for item lookup inside inventory forms) ──
export const getItemsForInventory = async () => {
  const response = await axiosInstance.get(inventoryEndpoints.allItems)
  return response.data
}

// ── CREATE adjustment ──
export const createAdjustment = async (data) => {
  const response = await axiosInstance.post(inventoryEndpoints.createAdjustment, data)
  return response.data
}

// ── UPDATE adjustment (PATCH with ?adjustment_id=) ──
export const updateAdjustment = async (id, data) => {
  const response = await axiosInstance.patch(inventoryEndpoints.updateAdjustment(id), data)
  return response.data
}

// ── DELETE adjustment ──
export const deleteAdjustment = async (id) => {
  const response = await axiosInstance.delete(inventoryEndpoints.deleteAdjustment(id))
  return response.data
}
