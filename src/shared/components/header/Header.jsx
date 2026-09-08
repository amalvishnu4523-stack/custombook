import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  History, 
  Plus, 
  Users, 
  Bell, 
  Settings, 
  Grid, 
  ChevronDown,
  LogOut
} from 'lucide-react';

export default function Header() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    navigate('/login');
  }

  return (
    <header className="flex h-14 w-full items-center justify-between border-b  bg-primary text-slate-200">
      
      {/* Left Section: Logo — same width as sidebar (w-64), white bg */}
      {/* <div className="flex h-full w-64 shrink-0 items-center justify-center  bg-[#f3f6fd]">
        <img src="/techgeum_logo2.png" alt="Techgeum" className="h-full w-45 object-cover" />
      </div> */}

      {/* Middle Section: Recent History & Search Bar */}
      <div className="flex flex-1 items-center space-x-3 px-6">
        <button className="rounded p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition">
          <History className="h-5 w-5" />
        </button>

        <div className="relative flex w-full max-w-md items-center">
          <div className="absolute left-3 flex items-center space-x-1 text-slate-400">
            <Search className="h-4 w-4" />
            <ChevronDown className="h-3 w-3" />
          </div>
          <input
            type="text"
            placeholder="Search in Customers ( / )"
            className="w-full rounded-md border border-slate-700 bg-white py-1.5 pl-12 pr-4 text-sm text-slate-200 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Right Section: Subscription, Profile & Actions */}
      <div className="flex items-center space-x-4">
        {/* Trial banner text */}
        <div className="hidden items-center space-x-2 text-xs md:flex">
          <span className="text-slate-300">Your premium trial plan...</span>
          <a href="#" className="font-semibold text-blue-400 hover:underline">
            Subscribe
          </a>
        </div>

        <div className="h-4 w-[1px] bg-slate-700 hidden md:block"></div>

        {/* User Account Dropdown */}
        <button className="flex items-center space-x-1 text-sm font-medium hover:text-white">
          <span>amaltest</span>
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </button>

        <div className="h-4 w-[1px] bg-slate-700"></div>

        {/* Action Buttons */}
        <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition">
          <Plus className="h-5 w-5" />
        </button>

        <div className="flex items-center space-x-2 text-slate-300">
          <button className="rounded p-1.5 hover:bg-slate-800 hover:text-white transition">
            <Users className="h-4 w-4" />
          </button>
          <button className="rounded p-1.5 hover:bg-slate-800 hover:text-white transition">
            <Bell className="h-4 w-4" />
          </button>
          <button className="rounded p-1.5 hover:bg-slate-800 hover:text-white transition">
            <Settings className="h-4 w-4" />
          </button>
        </div>

        {/* Avatar */}
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-sm font-bold text-white">
          A
        </div>

        {/* App Switcher Grid Icon */}
        <button className="rounded p-1.5 text-slate-300 hover:bg-slate-800 hover:text-white transition">
          <Grid className="h-5 w-5" />
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-300 hover:bg-red-500/15 hover:text-red-400 transition"
          title="Logout"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}