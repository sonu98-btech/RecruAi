import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  LayoutDashboard,
  Users,
  Building2,
  PhoneCall,
  BrainCircuit,
  CalendarCheck,
  Megaphone,
  BarChart3,
  LogOut,
  Command,
  UserCheck
} from 'lucide-react';

const Sidebar = () => {
  const { logout, currentUser } = useAuth();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, roles: ['SUPER_ADMIN', 'COMPANY_ADMIN', 'RECRUITER', 'AGENT'] },
    { name: 'Candidates', path: '/candidates', icon: Users, roles: ['SUPER_ADMIN', 'COMPANY_ADMIN', 'RECRUITER', 'AGENT'] },
    { name: 'Clients', path: '/clients', icon: Building2, roles: ['SUPER_ADMIN', 'COMPANY_ADMIN', 'RECRUITER'] },
    { name: 'Calls', path: '/calls', icon: PhoneCall, roles: ['SUPER_ADMIN', 'COMPANY_ADMIN', 'RECRUITER', 'AGENT'] },
    { name: 'AI Assistant', path: '/ai-analyzer', icon: BrainCircuit, roles: ['SUPER_ADMIN', 'COMPANY_ADMIN', 'RECRUITER'] },
    { name: 'Follow-ups', path: '/followups', icon: CalendarCheck, roles: ['SUPER_ADMIN', 'COMPANY_ADMIN', 'RECRUITER', 'AGENT'] },
    { name: 'Campaigns', path: '/campaigns', icon: Megaphone, roles: ['SUPER_ADMIN', 'COMPANY_ADMIN', 'RECRUITER'] },
    { name: 'Analytics', path: '/analytics', icon: BarChart3, roles: ['SUPER_ADMIN', 'COMPANY_ADMIN', 'RECRUITER'] },
    { name: 'Team Settings', path: '/team', icon: UserCheck, roles: ['SUPER_ADMIN', 'COMPANY_ADMIN'] },
  ];

  const filteredMenuItems = menuItems.filter(item => item.roles.includes(currentUser?.role));

  return (
    <aside className="w-64 border-r border-zinc-800 bg-[#09090b] flex flex-col h-screen sticky top-0 z-50">
      {/* Brand logo matching minimalist design */}
      <div className="mb-6 px-6 mt-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center border border-zinc-800">
          <Command className="w-4 h-4 text-zinc-100" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-zinc-100 tracking-wider uppercase leading-none">RecruitAI</h1>
          <p className="text-[10px] text-zinc-500 font-semibold mt-1">CRM Console</p>
        </div>
      </div>

      {/* Navigation menu */}
      <nav className="flex-1 px-4 py-4 flex flex-col gap-1.5 overflow-y-auto">
        {filteredMenuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-150 ${
                isActive
                  ? 'bg-zinc-850 text-zinc-100 border border-zinc-800'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 border border-transparent'
              }`
            }
          >
            <item.icon className="w-4 h-4" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div className="p-4 border-t border-zinc-800 flex flex-col gap-3">
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center text-sm font-semibold text-zinc-300">
            {currentUser?.name ? currentUser.name.charAt(0) : 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-zinc-200 truncate">{currentUser?.name}</p>
            <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">{currentUser?.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-150 active:scale-[0.98]"
        >
          <LogOut className="w-3.5 h-3.5" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
