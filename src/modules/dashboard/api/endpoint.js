const dashboardEndpoints = {
  overview: (period = 'this_fiscal_year') =>
    `/api/dashboard/?period=${period}`,
  updates: (period = 'this_fiscal_year') =>
    `/api/dashboard/updates/?period=${period}`,
  support: (period = 'this_fiscal_year') =>
    `/api/dashboard/support/?period=${period}`,
}

export default dashboardEndpoints
