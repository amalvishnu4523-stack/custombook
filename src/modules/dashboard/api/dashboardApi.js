import axiosInstance from '../../../api/axiosInstance'
import dashboardEndpoints from './endpoint'

// GET dashboard overview
export const getDashboardOverview = async (period = 'this_fiscal_year') => {
  const response = await axiosInstance.get(dashboardEndpoints.overview(period))
  return response.data
}

// GET dashboard updates
export const getDashboardUpdates = async (period = 'this_fiscal_year') => {
  const response = await axiosInstance.get(dashboardEndpoints.updates(period))
  return response.data
}

// GET dashboard support
export const getDashboardSupport = async (period = 'this_fiscal_year') => {
  const response = await axiosInstance.get(dashboardEndpoints.support(period))
  return response.data
}
