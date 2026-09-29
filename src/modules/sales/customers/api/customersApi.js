import axiosInstance from '../../../../api/axiosInstance'
import customersEndpoints from './customersEndpoints'

/**
 * Create a new customer
 * POST /api/customers/ (proxied to https://custombook.onrender.com/api/customers/)
 * @param {Object} customerData
 */
export const createCustomer = async (customerData) => {
  const response = await axiosInstance.post(customersEndpoints.create, customerData)
  return response.data
}

/**
 * Get all customers
 * GET /api/customers/
 * @param {Object|string} params
 */
export const getCustomers = async (params = {}) => {
  let queryParams = {}
  if (typeof params === 'string') {
    queryParams = { filter: params }
  } else if (params && typeof params === 'object') {
    queryParams = params
  }
  const response = await axiosInstance.get(customersEndpoints.list, { params: queryParams })
  return response.data
}

/**
 * Get single customer by ID
 * Primary endpoint: /api/customers/?customer_id=${id}
 * @param {string|number} id
 */
export const getCustomerById = async (id) => {
  // 1. Primary: /api/customers/?customer_id=${id}
  try {
    const response = await axiosInstance.get(customersEndpoints.detail(id))
    const resData = response.data

    let customer = null
    if (resData?.success && resData?.data) {
      if (Array.isArray(resData.data?.results) && resData.data.results.length > 0) {
        customer = resData.data.results[0]
      } else if (Array.isArray(resData.data) && resData.data.length > 0) {
        customer = resData.data[0]
      } else {
        customer = resData.data
      }
    } else if (Array.isArray(resData?.results) && resData.results.length > 0) {
      customer = resData.results[0]
    } else if (Array.isArray(resData) && resData.length > 0) {
      customer = resData[0]
    } else if (resData?.customer_id || resData?.id) {
      customer = resData
    }

    if (customer) {
      return { success: true, data: customer }
    }
  } catch (err) {
    console.warn(`[getCustomerById] lookup for id=${id} via ?customer_id= failed:`, err)
  }

  // 2. Fallback: REST path /api/customers/${id}/
  try {
    const altRes = await axiosInstance.get(customersEndpoints.detailPath(id))
    const altData = altRes.data
    const customer = altData?.data || altData
    if (customer?.customer_id || customer?.id) {
      return { success: true, data: customer }
    }
  } catch (err) {
    console.warn(`[getCustomerById] lookup for id=${id} via path failed:`, err)
  }

  // 3. Fallback: fetch list and find by customer_id/id
  try {
    const listRes = await axiosInstance.get(customersEndpoints.list)
    const listData = listRes.data
    const results = Array.isArray(listData?.data?.results)
      ? listData.data.results
      : Array.isArray(listData?.data)
      ? listData.data
      : Array.isArray(listData?.results)
      ? listData.results
      : Array.isArray(listData)
      ? listData
      : []

    const found = results.find(c => String(c.customer_id || c.id) === String(id))
    if (found) {
      return { success: true, data: found }
    }
  } catch (err) {
    console.error('[getCustomerById] list fallback failed:', err)
  }

  return { success: false, data: null }
}

/**
 * Update an existing customer
 * @param {string|number} id
 * @param {Object} customerData
 */
export const updateCustomer = async (id, customerData) => {
  try {
    const response = await axiosInstance.patch(customersEndpoints.update(id), customerData)
    return response.data
  } catch (err) {
    const altRes = await axiosInstance.patch(customersEndpoints.updatePath(id), customerData)
    return altRes.data
  }
}

/**
 * Delete a customer
 * @param {string|number} id
 */
export const deleteCustomer = async (id) => {
  try {
    const response = await axiosInstance.delete(customersEndpoints.delete(id))
    return response.data
  } catch (err) {
    const altRes = await axiosInstance.delete(customersEndpoints.deletePath(id))
    return altRes.data
  }
}

/**
 * Update customer portal status
 * PATCH /api/customers/?customer_id=${id}
 * @param {string|number} id
 * @param {boolean} allowPortalAccess
 */
export const updatePortalStatus = async (id, allowPortalAccess) => {
  const payload = {
    allow_portal_access: Boolean(allowPortalAccess),
    portal_enabled: Boolean(allowPortalAccess),
    portal_status: allowPortalAccess ? 'enabled' : 'disabled',
  }
  return await updateCustomer(id, payload)
}

/**
 * Refresh customers list
 * {{base_url}}/api/customers/refresh/
 */
export const refreshCustomers = async () => {
  try {
    const response = await axiosInstance.get(customersEndpoints.refresh)
    return response.data
  } catch (err) {
    try {
      const postRes = await axiosInstance.post(customersEndpoints.refresh)
      return postRes.data
    } catch (postErr) {
      console.warn('[refreshCustomers] refresh endpoint failed, falling back to getCustomers:', postErr)
      return await getCustomers()
    }
  }
}

/**
 * Export customers data
 * GET {{base_url}}/api/customers/export/?format=csv
 * GET {{base_url}}/api/customers/export/?format=json
 * @param {'csv'|'json'} format
 */
export const exportCustomers = async (format = 'csv') => {
  const isCsv = format === 'csv'
  const endpoint = isCsv ? customersEndpoints.exportCsv : customersEndpoints.exportJson
  const response = await axiosInstance.get(endpoint, {
    responseType: isCsv ? 'blob' : 'json',
  })
  return response.data
}

/**
 * Export customers as CSV
 * GET {{base_url}}/api/customers/export/?format=csv
 */
export const exportCustomersCsv = async () => exportCustomers('csv')

/**
 * Export customers as JSON
 * GET {{base_url}}/api/customers/export/?format=json
 */
export const exportCustomersJson = async () => exportCustomers('json')

/**
 * Import customers from file or data
 * POST {{base_url}}/api/customers/import/
 * @param {File|FormData|Object|Array} fileOrData
 */
export const importCustomers = async (fileOrData) => {
  let payload = fileOrData
  let config = {}

  if (fileOrData instanceof File) {
    const formData = new FormData()
    formData.append('file', fileOrData)
    payload = formData
    config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  } else if (fileOrData instanceof FormData) {
    payload = fileOrData
    config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  }

  const response = await axiosInstance.post(customersEndpoints.import, payload, config)
  return response.data
}

/**
 * Get contact person by ID
 * GET {{base_url}}/api/customers/contact-persons/?contact_person_id=${contactPersonId}
 * @param {string} contactPersonId
 */
export const getContactPersonById = async (contactPersonId) => {
  try {
    const response = await axiosInstance.get(customersEndpoints.contactPersons.detail(contactPersonId))
    return response.data
  } catch (err) {
    const altRes = await axiosInstance.get(customersEndpoints.contactPersons.detailPath(contactPersonId))
    return altRes.data
  }
}

/**
 * Get contact persons list
 * GET {{base_url}}/api/customers/contact-persons/
 * @param {Object} params
 */
export const getContactPersons = async (params = {}) => {
  const response = await axiosInstance.get(customersEndpoints.contactPersons.list, { params })
  return response.data
}

/**
 * Create contact person
 * POST {{base_url}}/api/customers/contact-persons/
 * @param {Object} contactPersonData
 */
export const createContactPerson = async (contactPersonData) => {
  const response = await axiosInstance.post(customersEndpoints.contactPersons.create, contactPersonData)
  return response.data
}

/**
 * Update contact person
 * PATCH {{base_url}}/api/customers/contact-persons/?contact_person_id=${contactPersonId}
 * @param {string} contactPersonId
 * @param {Object} contactPersonData
 */
export const updateContactPerson = async (contactPersonId, contactPersonData) => {
  try {
    const response = await axiosInstance.patch(customersEndpoints.contactPersons.update(contactPersonId), contactPersonData)
    return response.data
  } catch (err) {
    const altRes = await axiosInstance.patch(customersEndpoints.contactPersons.updatePath(contactPersonId), contactPersonData)
    return altRes.data
  }
}

/**
 * Delete contact person
 * DELETE {{base_url}}/api/customers/contact-persons/?contact_person_id=${contactPersonId}
 * @param {string} contactPersonId
 */
export const deleteContactPerson = async (contactPersonId) => {
  try {
    const response = await axiosInstance.delete(customersEndpoints.contactPersons.delete(contactPersonId))
    return response.data
  } catch (err) {
    const altRes = await axiosInstance.delete(customersEndpoints.contactPersons.deletePath(contactPersonId))
    return altRes.data
  }
}

/**
 * Query customers with filter, search, sort, and pagination
 * GET {{base_url}}/api/customers/?filter=all_customers&search=acme&sort_by=name&sort_order=asc&page=1&page_size=20
 * @param {Object} [params]
 * @param {string} [params.filter='all_customers']
 * @param {string} [params.search]
 * @param {string} [params.sort_by='name']
 * @param {'asc'|'desc'} [params.sort_order='asc']
 * @param {number} [params.page=1]
 * @param {number} [params.page_size=20]
 */
export const queryCustomers = async (params = {}) => {
  const queryParams = {
    filter: params.filter || 'all_customers',
    sort_by: params.sort_by || 'name',
    sort_order: params.sort_order || 'asc',
    page: params.page ?? 1,
    page_size: params.page_size ?? 20,
    ...params,
  }
  Object.keys(queryParams).forEach(key => {
    if (queryParams[key] === undefined || queryParams[key] === null || queryParams[key] === '') {
      delete queryParams[key]
    }
  })
  const response = await axiosInstance.get(customersEndpoints.list, { params: queryParams })
  return response.data
}

/**
 * Get customer payment by ID
 * GET {{base_url}}/api/customers/payments/?customer_payment_id=${customerPaymentId}
 * @param {string} customerPaymentId
 */
export const getCustomerPaymentById = async (customerPaymentId) => {
  try {
    const response = await axiosInstance.get(customersEndpoints.payments.detail(customerPaymentId))
    return response.data
  } catch (err) {
    const altRes = await axiosInstance.get(customersEndpoints.payments.detailPath(customerPaymentId))
    return altRes.data
  }
}

/**
 * Get customer payments list
 * GET {{base_url}}/api/customers/payments/
 * @param {Object} [params]
 */
export const getCustomerPayments = async (params = {}) => {
  const response = await axiosInstance.get(customersEndpoints.payments.list, { params })
  return response.data
}

/**
 * Create customer payment
 * POST {{base_url}}/api/customers/payments/
 * @param {Object} paymentData
 */
export const createCustomerPayment = async (paymentData) => {
  const response = await axiosInstance.post(customersEndpoints.payments.create, paymentData)
  return response.data
}

/**
 * Update customer payment
 * PATCH {{base_url}}/api/customers/payments/?customer_payment_id=${customerPaymentId}
 * @param {string} customerPaymentId
 * @param {Object} paymentData
 */
export const updateCustomerPayment = async (customerPaymentId, paymentData) => {
  try {
    const response = await axiosInstance.patch(customersEndpoints.payments.update(customerPaymentId), paymentData)
    return response.data
  } catch (err) {
    const altRes = await axiosInstance.patch(customersEndpoints.payments.updatePath(customerPaymentId), paymentData)
    return altRes.data
  }
}

/**
 * Delete customer payment
 * DELETE {{base_url}}/api/customers/payments/?customer_payment_id=${customerPaymentId}
 * @param {string} customerPaymentId
 */
export const deleteCustomerPayment = async (customerPaymentId) => {
  try {
    const response = await axiosInstance.delete(customersEndpoints.payments.delete(customerPaymentId))
    return response.data
  } catch (err) {
    const altRes = await axiosInstance.delete(customersEndpoints.payments.deletePath(customerPaymentId))
    return altRes.data
  }
}

export default {
  createCustomer,
  getCustomers,
  queryCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  updatePortalStatus,
  refreshCustomers,
  exportCustomers,
  exportCustomersCsv,
  exportCustomersJson,
  importCustomers,
  getContactPersonById,
  getContactPersons,
  createContactPerson,
  updateContactPerson,
  deleteContactPerson,
  getCustomerPaymentById,
  getCustomerPayments,
  createCustomerPayment,
  updateCustomerPayment,
  deleteCustomerPayment,
}


