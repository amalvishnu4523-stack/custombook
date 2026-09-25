import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'

import DashboardLayout from '../shared/layouts/DashboardLayout'
import AuthLayout from '../shared/layouts/AuthLayout'
import ProtectedRoute from '../auth/guards/ProtectedRoute'
import PublicOnlyRoute from '../auth/guards/PublicOnlyRoute'

import DashBoard from '../modules/dashboard/pages/DashBoard'
import Accountant from '../modules/accountant/pages/Accountant'
import Banking from '../modules/banking/pages/Banking'
import Documents from '../modules/documents/pages/Documents'
import Items from '../modules/items/pages/Items'
import ItemForm from '../modules/items/pages/ItemForm'
import ItemDetail from '../modules/items/pages/ItemDetail'
import Purchases from '../modules/purchases/pages/Purchases'
import Reports from '../modules/reports/pages/Reports'
import Sales from '../modules/sales/pages/Sales'
import Customers from '../modules/sales/customers/pages/Customers'
import CustomerForm from '../modules/sales/customers/pages/CustomerForm'
import CustomerDetail from '../modules/sales/customers/pages/CustomerDetail'
import Quotes from '../modules/sales/quotes/pages/Quotes'
import QuotesForm from '../modules/sales/quotes/pages/QuotesForm'
import QuotesDetails from '../modules/sales/quotes/pages/QuotesDetails'
import SalesOrders from '../modules/sales/sales-orders/pages/SalesOrders'
import SalesOrderForm from '../modules/sales/sales-orders/pages/SalesOrderForm'
import SalesOrderDetails from '../modules/sales/sales-orders/pages/SalesOrderDetails'
import Invoices from '../modules/sales/invoices/pages/Invoices'
import InvoiceForm from '../modules/sales/invoices/pages/InvoiceForm'
import InvoiceDetails from '../modules/sales/invoices/pages/InvoiceDetails'
import RecurringInvoices from '../modules/sales/recurring-invoices/pages/RecurringInvoices'
import RecurringInvoiceDetails from '../modules/sales/recurring-invoices/pages/RecurringInvoiceDetails'
import RecurringInvoiceForm from '../modules/sales/recurring-invoices/pages/RecurringInvoiceForm'
import DeliveryChallans from '../modules/sales/delivery-challans/pages/DeliveryChallans'
import DeliveryChalanDetails from '../modules/sales/delivery-challans/pages/DeliveryChalanDetails'
import DeliveryChalanForm from '../modules/sales/delivery-challans/pages/DeliveryChalanForm'
import PaymentsReceived from '../modules/sales/payments-received/pages/PaymentsReceived'
import PaymentReceivedDetails from '../modules/sales/payments-received/pages/PaymentReceivedDetails'
import PaymentReceivedForm from '../modules/sales/payments-received/pages/PaymentReceivedForm'
import CreditNotes from '../modules/sales/credit-notes/pages/CreditNotes'
import CreditNoteDetails from '../modules/sales/credit-notes/pages/CreditNoteDetails'
import CreditNoteForm from '../modules/sales/credit-notes/pages/CreditNoteForm'
import TimeTracking from '../modules/time-tracking/pages/TimeTracking'
import Inventory from '../modules/inventory/pages/Inventory'
import InventoryForm from '../modules/inventory/pages/InventoryForm'
import InventoryDetails from '../modules/inventory/pages/InventoryDetails'
import Login from '../auth/pages/Login'
import Signup from '../auth/pages/Signup'

const router = createBrowserRouter([
  // Redirect root
  { index: true, element: <Navigate to="/dashboard" replace /> },

  // Protected routes — require a token in localStorage
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: 'dashboard', element: <DashBoard /> },
          { path: 'accountant', element: <Accountant /> },
          { path: 'banking', element: <Banking /> },
          { path: 'documents', element: <Documents /> },
          { path: 'items',          element: <Items /> },
          { path: 'items/new',      element: <ItemForm /> },
          { path: 'items/:id/edit', element: <ItemForm /> },
          { path: 'items/:id',      element: <ItemDetail /> },
          { path: 'purchases', element: <Purchases /> },
          { path: 'reports', element: <Reports /> },
          { path: 'sales', element: <Sales /> },
          { path: 'sales/customers',              element: <Customers /> },
          { path: 'sales/customers/new',          element: <CustomerForm /> },
          { path: 'sales/customers/:id/edit',     element: <CustomerForm /> },
          { path: 'sales/customers/:id',          element: <CustomerDetail /> },
          { path: 'sales/quotes',             element: <Quotes /> },
          { path: 'sales/quotes/new',         element: <QuotesForm /> },
          { path: 'sales/quotes/:id/edit',    element: <QuotesForm /> },
          { path: 'sales/quotes/:id',         element: <QuotesDetails /> },
          { path: 'sales/orders',             element: <SalesOrders /> },
          { path: 'sales/orders/new',         element: <SalesOrderForm /> },
          { path: 'sales/orders/:id/edit',    element: <SalesOrderForm /> },
          { path: 'sales/orders/:id',         element: <SalesOrderDetails /> },
          { path: 'sales/invoices',           element: <Invoices /> },
          { path: 'sales/invoices/new',       element: <InvoiceForm /> },
          { path: 'sales/invoices/:id/edit',  element: <InvoiceForm /> },
          { path: 'sales/invoices/:id',       element: <InvoiceDetails /> },
          { path: 'sales/recurring-invoices',             element: <RecurringInvoices /> },
          { path: 'sales/recurring-invoices/new',         element: <RecurringInvoiceForm /> },
          { path: 'sales/recurring-invoices/:id/edit',    element: <RecurringInvoiceForm /> },
          { path: 'sales/recurring-invoices/:id',         element: <RecurringInvoiceDetails /> },
          { path: 'sales/delivery-challans',           element: <DeliveryChallans /> },
          { path: 'sales/delivery-challans/new',       element: <DeliveryChalanForm /> },
          { path: 'sales/delivery-challans/:id/edit',  element: <DeliveryChalanForm /> },
          { path: 'sales/delivery-challans/:id',       element: <DeliveryChalanDetails /> },
          { path: 'sales/payments-received',           element: <PaymentsReceived /> },
          { path: 'sales/payments-received/new',       element: <PaymentReceivedForm /> },
          { path: 'sales/payments-received/:id/edit',  element: <PaymentReceivedForm /> },
          { path: 'sales/payments-received/:id',       element: <PaymentReceivedDetails /> },
          { path: 'sales/credit-notes',           element: <CreditNotes /> },
          { path: 'sales/credit-notes/new',       element: <CreditNoteForm /> },
          { path: 'sales/credit-notes/:id/edit',  element: <CreditNoteForm /> },
          { path: 'sales/credit-notes/:id',       element: <CreditNoteDetails /> },
          { path: 'time-tracking', element: <TimeTracking /> },
          { path: 'inventory',           element: <Inventory /> },
          { path: 'inventory/new',       element: <InventoryForm /> },
          { path: 'inventory/:id/edit',  element: <InventoryForm /> },
          { path: 'inventory/:id',       element: <InventoryDetails /> },
        ],
      },
    ],
  },

  // Public-only routes — redirect to /dashboard if already logged in
  {
    element: <PublicOnlyRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: 'login', element: <Login /> },
          { path: 'signup', element: <Signup /> },
        ],
      },
    ],
  },

  // Catch-all
  { path: '*', element: <Navigate to="/dashboard" replace /> },
])

function Router() {
  return <RouterProvider router={router} />
}

export default Router
