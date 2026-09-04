import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ChevronRight, Plus } from 'lucide-react';
import { sidebarNavItems } from './sidebarConfig';

export default function Sidebar() {
  const [openMenus, setOpenMenus] = useState({});
  const navigate = useNavigate();

  function toggleMenu(name) {
    setOpenMenus(prev => ({ ...prev, [name]: !prev[name] }));
  }

  return (
    <div className="w-64 min-h-screen bg-[#F8F9FD] border-r border-slate-200 p-4 font-sans select-none">
      <nav className="space-y-1">
        {sidebarNavItems.map((item) => {
          const Icon = item.icon;
          const isOpen = !!openMenus[item.name];

          if (!item.hasSubmenu) {
            // Simple nav link
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="w-4" /> {/* spacer to align with chevron items */}
                    <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span className="text-[15px]">{item.name}</span>
                  </>
                )}
              </NavLink>
            );
          }

          // Item with submenu
          return (
            <div key={item.name}>
              {/* Parent row */}
              <button
                onClick={() => toggleMenu(item.name)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                <ChevronRight
                  className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform duration-200 ${
                    isOpen ? 'rotate-90' : ''
                  }`}
                />
                <Icon className="h-5 w-5 shrink-0 text-slate-500" />
                <span className="text-[15px]">{item.name}</span>
              </button>

              {/* Submenu */}
              {isOpen && (
                <div className="mt-1 space-y-0.5 pl-4">
                  {item.submenu.map((sub) => (
                    <NavLink
                      key={sub.name}
                      to={sub.path}
                      className={({ isActive }) =>
                        `flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <span>{sub.name}</span>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              navigate(sub.path);
                            }}
                            className={`flex h-5 w-5 items-center justify-center rounded transition ${
                              isActive
                                ? 'text-white hover:bg-white/20'
                                : 'text-slate-400 hover:bg-slate-200 hover:text-slate-700'
                            }`}
                            title={`New ${sub.name}`}
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </>
                      )}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
