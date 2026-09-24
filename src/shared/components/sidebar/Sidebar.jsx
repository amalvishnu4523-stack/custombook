import { useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { ChevronDown, Plus } from 'lucide-react'
import { sidebarNavItems } from './sidebarConfig'

export default function Sidebar() {
  const location  = useLocation()
  const navigate  = useNavigate()

  const [openMenus, setOpenMenus] = useState(() => {
    const initial = {}
    sidebarNavItems.forEach(item => {
      if (item.submenu?.some(s => location.pathname.startsWith(s.path))) {
        initial[item.name] = true
      }
    })
    return initial
  })

  function toggle(name) {
    setOpenMenus(prev => ({ ...prev, [name]: !prev[name] }))
  }

  return (
    <aside className="flex w-56 shrink-0 flex-col overflow-y-auto border-r border-gray-200 bg-white">

      {/* ── Nav ── */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {sidebarNavItems.map(item => {
          const Icon     = item.icon
          const isOpen   = !!openMenus[item.name]
          const hasActive = item.submenu?.some(s => location.pathname.startsWith(s.path))

          /* ── Simple link (no submenu) ── */
          if (!item.hasSubmenu) {
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-blue-500' : 'text-gray-400'}`} />
                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            )
          }

          /* ── Group with submenu ── */
          return (
            <div key={item.name}>
              <button
                onClick={() => toggle(item.name)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 ${
                  hasActive && !isOpen
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${hasActive ? 'text-blue-500' : 'text-gray-400'}`} />
                <span className="flex-1 text-left">{item.name}</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 shrink-0 text-gray-400 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Submenu */}
              {isOpen && (
                <div className="mt-0.5 mb-1 ml-4 border-l-2 border-gray-100 pl-3 space-y-0.5">
                  {item.submenu.map(sub => (
                    <NavLink
                      key={sub.name}
                      to={sub.path}
                      className={({ isActive }) =>
                        `group flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-xs font-medium transition-all duration-150 ${
                          isActive
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <span>{sub.name}</span>
                          <button
                            onClick={e => {
                              e.preventDefault()
                              e.stopPropagation()
                              navigate(sub.path + '/new')
                            }}
                            className={`invisible flex h-5 w-5 items-center justify-center rounded transition group-hover:visible ${
                              isActive
                                ? 'text-white/80 hover:bg-white/20'
                                : 'text-gray-400 hover:bg-gray-200 hover:text-gray-700'
                            }`}
                            title={`New ${sub.name}`}
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </>
                      )}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* ── Footer ── */}
      <div className="border-t border-gray-100 px-4 py-3">
        <p className="text-[10px] font-medium uppercase tracking-widest text-gray-300">v1.0.0</p>
      </div>
    </aside>
  )
}
