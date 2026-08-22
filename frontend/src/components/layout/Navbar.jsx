import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Bell, ShieldAlert, Cpu } from 'lucide-react';
import { dashboardApi } from '../../services/dashboard.api';

const Navbar = () => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [tenantCompanyId, setTenantCompanyId] = useState(localStorage.getItem('selectedCompanyId') || '');

  useEffect(() => {
    if (currentUser) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 45000); // 45s poll
      return () => clearInterval(interval);
    }
  }, [currentUser]);

  const fetchNotifications = async () => {
    try {
      const res = await dashboardApi.getNotifications();
      if (res.success) {
        setNotifications(res.data?.docs || (Array.isArray(res.data) ? res.data : []));
      }
    } catch (e) {}
  };

  const handleCompanyChange = (e) => {
    const val = e.target.value;
    setTenantCompanyId(val);
    if (val) {
      localStorage.setItem('selectedCompanyId', val);
    } else {
      localStorage.removeItem('selectedCompanyId');
    }
    window.location.reload();
  };

  const handleMarkAllRead = async () => {
    try {
      await dashboardApi.readAllNotifications();
      fetchNotifications();
    } catch (e) {}
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="h-16 border-b border-zinc-800 bg-[#09090b]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-zinc-400" />
          <span className="text-zinc-500 text-[10px] font-bold tracking-wider uppercase">Workspace</span>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-200 text-[10px] font-bold uppercase tracking-wider">
            {currentUser?.companyName || 'Tenant Portal'}
          </span>
        </div>

        {currentUser?.role === 'SUPER_ADMIN' && (
          <div className="flex items-center gap-2 ml-4">
            <span className="text-[9px] bg-zinc-800 border border-zinc-700 text-zinc-300 px-1.5 py-0.5 rounded font-mono font-bold flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" /> SUPER ADMIN
            </span>
            <input
              type="text"
              placeholder="Act-on Company ID..."
              value={tenantCompanyId}
              onChange={handleCompanyChange}
              className="bg-[#18181b] border border-zinc-850 focus:border-zinc-700 rounded px-2.5 py-1 text-xs text-zinc-300 outline-none w-48 transition-all"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 flex items-center justify-center text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 rounded-lg transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-zinc-400 rounded-full ring-2 ring-[#09090b]" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 glass-panel border border-zinc-800 rounded-xl shadow-lg overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-200 uppercase tracking-wide">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[10px] text-zinc-400 hover:text-zinc-300 font-semibold"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-60 overflow-y-auto divide-y divide-zinc-800">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-zinc-500">No new alerts</div>
                ) : (
                  notifications.map((item) => (
                    <div key={item._id} className={`p-3 text-xs transition-colors ${item.read ? 'opacity-65' : 'bg-zinc-800/10'}`}>
                      <p className="text-zinc-300 leading-relaxed">{item.message}</p>
                      <span className="text-[9px] text-zinc-500 block mt-1 font-mono">
                        {new Date(item.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 border-l border-zinc-800 pl-4">
          <span className="text-[11px] font-semibold text-zinc-500 font-mono">{currentUser?.email}</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
