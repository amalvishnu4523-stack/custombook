                                                                                                          import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../../../../shared/components/table/DataTable'

const SAMPLE = [
  { id: 1, number: 'PR-001', customer: 'Priya Nair',   date: '2026-08-04', invoice: 'INV-002', mode: 'Bank Transfer', amount: 9500  },
  { id: 2, number: 'PR-002', customer: 'Kiran Kumar',  date: '2026-08-12', invoice: 'INV-003', mode: 'UPI',           amount: 15000 },
  { id: 3, number: 'PR-003', customer: 'Amal Vishnu',  date: '2026-08-20', invoice: 'INV-001', mode: 'Cheque',        amount: 5000  },
]

const COLUMNS = [
  { key: 'number',   header: 'Payment #',   minWidth: 130 },
  { key: 'customer', header: 'Customer',    minWidth: 180 },
  { key: 'date',     header: 'Date',        minWidth: 120 },
  { key: 'invoice',  header: 'Invoice',     minWidth: 130 },
  { key: 'mode',     header: 'Mode',        minWidth: 150 },
  { key: 'amount',   header: 'Amount (₹)',  minWidth: 140, align: 'right', render: (val) => `₹${val.toLocaleString('en-IN')}` },
]

function PaymentsReceived() {
  const [selected, setSelected] = useState([])
  const navigate = useNavigate()

  return (
    <DataTable
      title="Payments Received"
      columns={COLUMNS}
      data={SAMPLE}
      rowKey="id"
      newButtonText="New Payment"
      onNew={() => navigate('/sales/payments-received/new')}
      showSearch={false}
      showFilter={false}
      selectable
      selectedRows={selected}
      onSelectAll={() => setSelected(selected.length === SAMPLE.length ? [] : SAMPLE.map(r => r.id))}
      onSelectRow={(key) => setSelected(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])}
      onRowClick={(row) => navigate(`/sales/payments-received/${row.id}`)}
    />
  )
}

export default PaymentsReceived
