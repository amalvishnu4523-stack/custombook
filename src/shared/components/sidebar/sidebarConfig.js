import {
  Home,
  Package,
  Boxes,
  ShoppingCart,
  ShoppingBag,
  Clock,
  Landmark,
  UserCheck,
  BarChart3,
  Folder,
} from 'lucide-react';

export const sidebarNavItems = [
  { name: 'Home',          icon: Home,         path: '/dashboard',     hasSubmenu: false },
  {
    name: 'Items', icon: Package, path: '/items', hasSubmenu: true,
    submenu: [
      { name: 'Items', path: '/items' },
    ],
  },
  { name: 'Inventory', icon: Boxes, path: '/inventory', hasSubmenu: true,
    submenu: [
      { name: 'Inventory adjustment', path: '/inventory' },
    ],
  },
  {
    name: 'Sales', icon: ShoppingCart, path: '/sales', hasSubmenu: true,
    submenu: [
      { name: 'Customers',           path: '/sales/customers' },
      { name: 'Quotes',              path: '/sales/quotes' },
      { name: 'Sales Orders',        path: '/sales/orders' },
      { name: 'Invoices',            path: '/sales/invoices' },
      { name: 'Recurring Invoices',  path: '/sales/recurring-invoices' },
      { name: 'Delivery Challans',   path: '/sales/delivery-challans' },
      { name: 'Payments Received',   path: '/sales/payments-received' },
      { name: 'Credit Notes',        path: '/sales/credit-notes' },
    ],
  },
  {
    name: 'Purchases', icon: ShoppingBag, path: '/purchases', hasSubmenu: true,
    submenu: [
      { name: 'Vendors',        path: '/purchases/vendors' },
      { name: 'Bills',          path: '/purchases/bills' },
      { name: 'Purchase Orders',path: '/purchases/orders' },
    ],
  },
  {
    name: 'Time Tracking', icon: Clock, path: '/time-tracking', hasSubmenu: true,
    submenu: [
      { name: 'Projects',       path: '/time-tracking/projects' },
      { name: 'Timesheets',     path: '/time-tracking/timesheets' },
    ],
  },
  { name: 'Banking',    icon: Landmark,  path: '/banking',    hasSubmenu: false },
  {
    name: 'Accountant', icon: UserCheck, path: '/accountant', hasSubmenu: true,
    submenu: [
      { name: 'Chart of Accounts', path: '/accountant/chart' },
      { name: 'Journal',           path: '/accountant/journal' },
    ],
  },
  { name: 'Reports',   icon: BarChart3, path: '/reports',   hasSubmenu: false },
  { name: 'Documents', icon: Folder,    path: '/documents', hasSubmenu: false },
];
