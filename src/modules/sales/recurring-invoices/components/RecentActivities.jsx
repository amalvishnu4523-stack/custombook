const DEFAULT_ACTIVITIES = [
  {
    id: 1,
    date: '15/09/2026',
    time: '11:35 AM',
    title: 'Invoice created - INV-000003. Saved as draft',
    by: 'Amal Vishnu2',
    link: { label: 'View the invoice', href: '/sales/invoices/3' },
  },
  {
    id: 2,
    date: '15/09/2026',
    time: '11:35 AM',
    title: 'Recurring Invoice created for ₹777.00',
    by: 'Amal Vishnu2',
    link: null,
  },
]

function RecentActivities({ activities }) {
  const list = activities ?? DEFAULT_ACTIVITIES

  if (list.length === 0) {
    return (
      <div className="p-8 text-center text-sm text-gray-400">
        No recent activities.
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="relative pl-36">

        {/* Vertical line */}
        <div className="absolute left-32 top-2 h-full w-0.5 bg-blue-300" />

        <div className="space-y-4">
          {list.map((activity) => (
            <div key={activity.id} className="relative flex items-start gap-4">

              {/* Timestamp — left of the line */}
              <div className="absolute right-full mr-4 w-28 shrink-0 text-right text-xs text-gray-400 leading-snug pt-3">
                <p>{activity.date}</p>
                <p>{activity.time}</p>
              </div>

              {/* Dot */}
              <div className="absolute -left-4 top-4 h-3 w-3 shrink-0 rounded-full bg-blue-500 ring-2 ring-white" />

              {/* Card */}
              <div className="flex-1 rounded-lg border border-gray-200 bg-white px-5 py-3 shadow-sm">
                <p className="text-sm font-semibold text-gray-900">{activity.title}</p>
                <p className="mt-1 text-xs text-gray-400">
                  by {activity.by}
                  {activity.link && (
                    <>
                      {' '}
                      <a
                        href={activity.link.href}
                        className="text-blue-600 hover:underline"
                        onClick={e => e.preventDefault()}
                      >
                        {activity.link.label}
                      </a>
                    </>
                  )}
                </p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default RecentActivities
