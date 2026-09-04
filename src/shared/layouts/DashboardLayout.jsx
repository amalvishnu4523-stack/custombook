import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/sidebar/Sidebar'
import Header from '../components/header/Header'

function DashboardLayout() {
  return (
   <div className="flex h-screen w-screen flex-col overflow-hidden bg-slate-50">   
      {/* 1. Full-width Topbar */}                                    
        <Header/>  
                 
      {/* 2. Lower Area: Sidebar + Scrollable Content */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar/>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-1">
          {/* Dynamic Route Outlet */}
          <section className="rounded-xl border border-slate-200 bg-white  shadow-sm">
            <Outlet />
          </section>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout