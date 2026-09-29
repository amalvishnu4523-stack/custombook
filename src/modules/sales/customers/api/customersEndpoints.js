import endpoints from '../../../../api/endpoints'

const CUSTOMERS_BASE = endpoints?.customers || '/api/customers/'

const customersEndpoints = {
  // Base & CRUD
  list: CUSTOMERS_BASE,
  create: CUSTOMERS_BASE,
  detail: (id) => `${CUSTOMERS_BASE}${id ? `?customer_id=${id}` : ''}`,
  update: (id) => `${CUSTOMERS_BASE}${id ? `?customer_id=${id}` : ''}`,
  patch: (id) => `${CUSTOMERS_BASE}${id ? `?customer_id=${id}` : ''}`,
  delete: (id) => `${CUSTOMERS_BASE}${id ? `?customer_id=${id}` : ''}`,

  // RESTful path variants (e.g., /api/customers/:id/)
  detailPath: (id) => `${CUSTOMERS_BASE}${id}/`,
  updatePath: (id) => `${CUSTOMERS_BASE}${id}/`,
  deletePath: (id) => `${CUSTOMERS_BASE}${id}/`,

  // Refresh
  refresh: `${CUSTOMERS_BASE}refresh/`,

  // Export
  export: (format = 'json') => `${CUSTOMERS_BASE}export/?format=${format}`,
  exportCsv: `${CUSTOMERS_BASE}export/?format=csv`,
  exportJson: `${CUSTOMERS_BASE}export/?format=json`,

  // Import
  import: `${CUSTOMERS_BASE}import/`,

  // Contact Persons ({{base_url}}/api/customers/contact-persons/?contact_person_id=${id})
  contactPersons: {
    list: `${CUSTOMERS_BASE}contact-persons/`,
    create: `${CUSTOMERS_BASE}contact-persons/`,
    detail: (contactPersonId) => `${CUSTOMERS_BASE}contact-persons/${contactPersonId ? `?contact_person_id=${contactPersonId}` : ''}`,
    update: (contactPersonId) => `${CUSTOMERS_BASE}contact-persons/${contactPersonId ? `?contact_person_id=${contactPersonId}` : ''}`,
    patch: (contactPersonId) => `${CUSTOMERS_BASE}contact-persons/${contactPersonId ? `?contact_person_id=${contactPersonId}` : ''}`,
    delete: (contactPersonId) => `${CUSTOMERS_BASE}contact-persons/${contactPersonId ? `?contact_person_id=${contactPersonId}` : ''}`,
    detailPath: (contactPersonId) => `${CUSTOMERS_BASE}contact-persons/${contactPersonId}/`,
    updatePath: (contactPersonId) => `${CUSTOMERS_BASE}contact-persons/${contactPersonId}/`,
    deletePath: (contactPersonId) => `${CUSTOMERS_BASE}contact-persons/${contactPersonId}/`,
  },
  contactPersonDetail: (contactPersonId) => `${CUSTOMERS_BASE}contact-persons/${contactPersonId ? `?contact_person_id=${contactPersonId}` : ''}`,

  // Customer Payments ({{base_url}}/api/customers/payments/?customer_payment_id=${id})
  payments: {
    list: `${CUSTOMERS_BASE}payments/`,
    create: `${CUSTOMERS_BASE}payments/`,
    detail: (customerPaymentId) => `${CUSTOMERS_BASE}payments/${customerPaymentId ? `?customer_payment_id=${customerPaymentId}` : ''}`,
    update: (customerPaymentId) => `${CUSTOMERS_BASE}payments/${customerPaymentId ? `?customer_payment_id=${customerPaymentId}` : ''}`,
    patch: (customerPaymentId) => `${CUSTOMERS_BASE}payments/${customerPaymentId ? `?customer_payment_id=${customerPaymentId}` : ''}`,
    delete: (customerPaymentId) => `${CUSTOMERS_BASE}payments/${customerPaymentId ? `?customer_payment_id=${customerPaymentId}` : ''}`,
    detailPath: (customerPaymentId) => `${CUSTOMERS_BASE}payments/${customerPaymentId}/`,
    updatePath: (customerPaymentId) => `${CUSTOMERS_BASE}payments/${customerPaymentId}/`,
    deletePath: (customerPaymentId) => `${CUSTOMERS_BASE}payments/${customerPaymentId}/`,
  },
  customerPaymentDetail: (customerPaymentId) => `${CUSTOMERS_BASE}payments/${customerPaymentId ? `?customer_payment_id=${customerPaymentId}` : ''}`,

  // Options / Metadata
  options: `${CUSTOMERS_BASE}options/`,

  // Filters
  filters: {
    all: `${CUSTOMERS_BASE}?filter=all_customers`,
    all_customers: `${CUSTOMERS_BASE}?filter=all_customers`,
    active: `${CUSTOMERS_BASE}?filter=active`,
    inactive: `${CUSTOMERS_BASE}?filter=inactive`,
    crm: `${CUSTOMERS_BASE}?filter=crm`,
  },

  // Sort
  sort: {
    byName: (order = 'asc') => `${CUSTOMERS_BASE}?sort_by=name&sort_order=${order}`,
    byReceivables: (order = 'asc') => `${CUSTOMERS_BASE}?sort_by=receivables&sort_order=${order}`,
  },

  // Query URL builder ({{base_url}}/api/customers/?filter=all_customers&search=acme&sort_by=name&sort_order=asc&page=1&page_size=20)
  query: ({ filter = 'all_customers', search, sort_by = 'name', sort_order = 'asc', page = 1, page_size = 20 } = {}) => {
    const params = new URLSearchParams()
    if (filter) params.append('filter', filter)
    if (search) params.append('search', search)
    if (sort_by) params.append('sort_by', sort_by)
    if (sort_order) params.append('sort_order', sort_order)
    if (page !== undefined && page !== null) params.append('page', page)
    if (page_size !== undefined && page_size !== null) params.append('page_size', page_size)
    const queryString = params.toString()
    return queryString ? `${CUSTOMERS_BASE}?${queryString}` : CUSTOMERS_BASE
  },
}

export { customersEndpoints }
export default customersEndpoints
