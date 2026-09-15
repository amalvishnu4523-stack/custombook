/* ── number to words (INR) ── */
const ONES = ['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine',
  'Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen']
const TENS = ['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety']

function numToWords(n) {
  if (n === 0)       return 'Zero'
  if (n < 20)        return ONES[n]
  if (n < 100)       return TENS[Math.floor(n/10)] + (n%10 ? ' '+ONES[n%10] : '')
  if (n < 1000)      return ONES[Math.floor(n/100)] + ' Hundred' + (n%100 ? ' '+numToWords(n%100) : '')
  if (n < 100000)    return numToWords(Math.floor(n/1000)) + ' Thousand' + (n%1000 ? ' '+numToWords(n%1000) : '')
  if (n < 10000000)  return numToWords(Math.floor(n/100000)) + ' Lakh' + (n%100000 ? ' '+numToWords(n%100000) : '')
  return numToWords(Math.floor(n/10000000)) + ' Crore' + (n%10000000 ? ' '+numToWords(n%10000000) : '')
}

function toInrWords(amount) {
  const rupees = Math.floor(amount)
  const paise  = Math.round((amount - rupees) * 100)
  let words = 'Indian Rupee ' + numToWords(rupees)
  if (paise > 0) words += ' and ' + numToWords(paise) + ' Paise'
  return words + ' Only'
}

function fmt(val) {
  return Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2 })
}

const DEFAULT_PROFILE = {
  status:        'Active',
  customer:      'abc',
  invoiceDate:   '22/09/2026',
  terms:         'Due on Receipt',
  dueDate:       '22/09/2026',
  customerNotes: 'Thanks for your business.',
  subTotal:      777,
  total:         777,
  balanceDue:    777,
  adjustment:    0,
  items: [
    { id: 1, name: 'bike', description: 'nbb', unit: '', qty: 1, rate: 777, amount: 777 },
  ],
}

const RIBBON_COLOR = {
  Active:   'bg-green-500',
  Inactive: 'bg-gray-400',
  Stopped:  'bg-red-500',
}

function NextInvoice({ profile }) {
  const p            = profile ?? DEFAULT_PROFILE
  const orgUser      = JSON.parse(localStorage.getItem('currentUser') || '{}')
  const orgName      = orgUser.name || orgUser.username || 'amaltest'
  const orgEmail     = orgUser.username ? `${orgUser.username}@gmail.com` : 'info@example.com'
  const ribbonColor  = RIBBON_COLOR[p.status] ?? 'bg-green-500'

  return (
    <div className="min-h-full bg-gray-100 p-6">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-xl bg-white shadow-md">
        <div className="relative px-8 pb-10 pt-6">

          {/* ── Corner ribbon ── */}
          <div className="absolute left-0 top-0 h-24 w-24 overflow-hidden">
            <div className={`${ribbonColor} absolute -left-6 top-6 w-28 -rotate-45 py-1 text-center text-xs font-bold text-white shadow`}>
              {p.status}
            </div>
          </div>

          {/* ── Org info + TAX INVOICE ── */}
          <div className="mb-4 flex items-start justify-between">
            <div className="mt-4 text-sm leading-relaxed text-gray-600">
              <p className="font-semibold text-gray-800">{orgName}</p>
              <p>Kerala</p>
              <p>India</p>
              <p>{orgEmail}</p>
            </div>
            <h2 className="mt-4 text-4xl font-black tracking-wide text-gray-800">TAX INVOICE</h2>
          </div>

          {/* ── Invoice meta grid ── */}
          <div className="grid grid-cols-2 border border-gray-200">
            <div className="border-r border-gray-200 p-4 text-sm space-y-1.5">
              {[
                { label: '#',            value: 'Will be generated automatically', bold: true },
                { label: 'Invoice Date', value: p.invoiceDate },
                { label: 'Terms',        value: p.terms },
                { label: 'Due Date',     value: p.dueDate },
              ].map(({ label, value, bold }) => (
                <div key={label} className="flex">
                  <span className="w-28 shrink-0 text-gray-400">{label}</span>
                  <span className={`${bold ? 'font-semibold' : 'font-medium'} text-gray-800`}>: {value}</span>
                </div>
              ))}
            </div>
            <div className="p-4" />
          </div>

          {/* ── Bill To ── */}
          <div className="border border-t-0 border-gray-200">
            <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-700">
              Bill To
            </div>
            <div className="px-4 py-3">
              <p className="text-sm font-semibold text-blue-600">{p.customer}</p>
            </div>
          </div>

          {/* ── Items table ── */}
          <table className="w-full border-collapse border border-t-0 border-gray-200 text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="w-10 border-r border-gray-200 px-4 py-3 text-left font-semibold text-gray-600">#</th>
                <th className="border-r border-gray-200 px-4 py-3 text-left font-semibold text-gray-600">Item &amp; Description</th>
                <th className="w-20 border-r border-gray-200 px-4 py-3 text-right font-semibold text-gray-600">Qty</th>
                <th className="w-24 border-r border-gray-200 px-4 py-3 text-right font-semibold text-gray-600">Rate</th>
                <th className="w-24 px-4 py-3 text-right font-semibold text-gray-600">Amount</th>
              </tr>
            </thead>
            <tbody>
              {p.items.map((item, i) => (
                <tr key={item.id} className="border-b border-gray-100">
                  <td className="border-r border-gray-200 px-4 py-3 text-gray-500">{i + 1}</td>
                  <td className="border-r border-gray-200 px-4 py-3">
                    <p className="text-gray-800">{item.name}</p>
                    {item.description && <p className="text-xs text-gray-400">{item.description}</p>}
                    {item.unit        && <p className="text-xs text-gray-400">{item.unit}</p>}
                  </td>
                  <td className="border-r border-gray-200 px-4 py-3 text-right text-gray-700">{Number(item.qty).toFixed(2)}</td>
                  <td className="border-r border-gray-200 px-4 py-3 text-right text-gray-700">{fmt(item.rate)}</td>
                  <td className="px-4 py-3 text-right text-gray-800">{fmt(item.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ── Total in words + Totals + Signature ── */}
          <div className="grid grid-cols-2 border border-t-0 border-gray-200">

            {/* Left */}
            <div className="border-r border-gray-200 p-4 text-sm">
              <p className="text-blue-500 font-medium">Total In Words</p>
              <p className="mt-1 font-semibold italic text-gray-800">{toInrWords(p.total)}</p>
              {p.customerNotes && (
                <div className="mt-4">
                  <p className="text-gray-400">Notes</p>
                  <p className="mt-1 text-gray-700">{p.customerNotes}</p>
                </div>
              )}
            </div>

            {/* Right */}
            <div className="flex flex-col">
              <div className="p-4 text-sm space-y-2">
                <div className="flex justify-between text-gray-500">
                  <span>Sub Total</span>
                  <span>{fmt(p.subTotal)}</span>
                </div>
                {p.adjustment !== 0 && (
                  <div className="flex justify-between text-gray-500">
                    <span>Adjustment</span>
                    <span>{fmt(p.adjustment)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-gray-200 pt-2 font-bold text-gray-900">
                  <span>Total</span>
                  <span>₹{fmt(p.total)}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900">
                  <span>Balance Due</span>
                  <span>₹{fmt(p.balanceDue)}</span>
                </div>
              </div>

              {/* Authorized Signature */}
              <div className="flex flex-1 items-end justify-end p-4">
                <p className="text-xs text-gray-400">Authorized Signature</p>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* ── PDF Template footer ── */}
      <div className="mt-4 text-center text-sm text-gray-500">
        PDF Template : 'Spreadsheet Template'{' '}
        <button className="text-blue-600 hover:underline">Change</button>
        {' '}({' '}
        <button className="text-blue-600 hover:underline">View sample PDF</button>
        {' '})
      </div>
    </div>
  )
}

export default NextInvoice
