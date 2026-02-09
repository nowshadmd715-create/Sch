
import React, { useState, useRef, useEffect } from 'react';
import { AppNotification, AppSettings } from '../types.ts';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  onViewChange: (view: string) => void;
  notifications: AppNotification[];
  appSettings: AppSettings;
  onMarkRead: () => void;
  onNotificationClick: (notif: AppNotification) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, onViewChange, notifications, appSettings, onMarkRead, onNotificationClick }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  
  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  const handleToggleNotif = () => {
    if (!showNotifications) {
      onMarkRead();
    }
    setShowNotifications(!showNotifications);
  };

  const handleItemClick = (n: AppNotification) => {
    onNotificationClick(n);
    setShowNotifications(false);
  };

  const NavigationLinks = () => (
    <nav className="flex-1 space-y-1.5 px-2">
      <NavBtn 
        active={currentView === 'dashboard'} 
        onClick={() => onViewChange('dashboard')} 
        icon="📊" 
        label="Main Dashboard" 
      />
      <NavBtn 
        active={currentView === 'admin'} 
        onClick={() => onViewChange('admin')} 
        icon="🛠️" 
        label="Administration" 
      />
      <NavBtn 
        active={currentView === 'teachers'} 
        onClick={() => onViewChange('teachers')} 
        icon="👨‍🏫" 
        label="Faculty Portal" 
      />
      <NavBtn 
        active={currentView === 'attendance'} 
        onClick={() => onViewChange('attendance')} 
        icon="📅" 
        label="Attendance Log" 
      />
      
      <div className="pt-8 pb-4">
        <p className="px-4 text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-3 opacity-50">Academic Tools</p>
        <NavBtn icon="📝" label="Exam Results" disabled />
        <NavBtn icon="💰" label="Finance Hub" disabled />
        <NavBtn icon="⚙️" label="App Settings" disabled />
      </div>
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-[#f9fafb]">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 lg:hidden transition-all duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 w-72 bg-[#0f172a] text-white z-50 transform transition-all duration-500 ease-in-out lg:translate-x-0 lg:static lg:h-screen lg:flex lg:flex-col shadow-2xl border-r border-slate-800/50
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-indigo-600 rounded-[1.25rem] flex items-center justify-center font-black text-2xl overflow-hidden shrink-0 shadow-lg shadow-indigo-500/20">
              {appSettings.appLogo ? (
                <img src={appSettings.appLogo} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <span>{appSettings.appName.charAt(0)}</span>
              )}
            </div>
            <div className="min-w-0">
               <h1 className="text-lg font-black tracking-tight truncate leading-tight">{appSettings.appName}</h1>
               <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mt-0.5">Campus OS</p>
            </div>
          </div>
        </div>
        
        <NavigationLinks />

        <div className="p-6 mt-auto">
           <div className="bg-slate-800/40 rounded-2xl p-4 border border-slate-700/50">
              <div className="flex items-center gap-3 mb-1">
                <img src="https://picsum.photos/seed/admin/100" className="w-9 h-9 rounded-xl border-2 border-indigo-500/50" alt="Admin" />
                <div className="min-w-0">
                  <p className="text-xs font-black truncate">Principal Admin</p>
                  <p className="text-[9px] text-indigo-400 font-bold uppercase">System Owner</p>
                </div>
              </div>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 md:px-8 py-5 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-slate-50 rounded-xl transition-colors border border-slate-100"
            >
              <span className="text-xl">☰</span>
            </button>
            <div>
               <h2 className="text-xl font-black text-slate-800 tracking-tight">
                {currentView === 'dashboard' ? 'Overview' : 
                 currentView === 'attendance' ? 'Attendance' : 
                 currentView === 'teachers' ? 'Faculty' : 'Admin'}
              </h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest hidden sm:block">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={handleToggleNotif}
                className={`w-11 h-11 flex items-center justify-center rounded-2xl transition-all relative border ${showNotifications ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'text-slate-500 hover:bg-slate-50 border-slate-100'}`}
              >
                <span className="text-xl">🔔</span>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] bg-red-600 rounded-lg border-2 border-white text-[10px] text-white flex items-center justify-center font-black">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-4 w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 py-4 z-50 overflow-hidden transform origin-top-right animate-in fade-in zoom-in duration-200">
                  <div className="px-6 pb-4 border-b border-slate-50 flex justify-between items-center">
                    <h4 className="font-black text-slate-800 text-sm">Alerts</h4>
                    <button onClick={onMarkRead} className="text-[9px] text-indigo-600 font-black uppercase tracking-widest hover:underline">Clear All</button>
                  </div>
                  <div className="max-h-[350px] overflow-y-auto no-scrollbar">
                    {notifications.length > 0 ? notifications.map(n => (
                      <div 
                        key={n.id} 
                        onClick={() => handleItemClick(n)}
                        className={`px-6 py-4 hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-50 last:border-0 ${!n.isRead ? 'bg-indigo-50/30' : ''}`}
                      >
                        <div className="flex gap-4">
                          <span className="w-10 h-10 shrink-0 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-lg">
                            {n.type === 'success' ? '✅' : n.type === 'warning' ? '⚠️' : 'ℹ️'}
                          </span>
                          <div className="min-w-0">
                            <p className="text-xs text-slate-700 font-bold leading-relaxed">{n.text}</p>
                            <p className="text-[10px] text-slate-400 mt-1 font-black uppercase tracking-tight">{n.time}</p>
                          </div>
                        </div>
                      </div>
                    )) : (
                      <div className="p-12 text-center">
                        <span className="text-3xl block mb-2">🎈</span>
                        <p className="text-xs text-slate-400 font-bold">Inbox zero! No new alerts.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={() => onViewChange('admin')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white h-11 px-6 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-100 active:scale-95 hidden sm:block"
            >
              System Access
            </button>
          </div>
        </header>

        <div className="p-4 md:p-10 flex-1 overflow-y-auto no-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
};

const NavBtn = ({ active, onClick, icon, label, disabled }: { active?: boolean; onClick?: () => void; icon: string; label: string; disabled?: boolean }) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className={`
      w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all relative group
      ${active 
        ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-500/20 translate-x-1' 
        : disabled 
          ? 'opacity-30 cursor-not-allowed text-slate-500' 
          : 'text-slate-400 hover:bg-slate-800/50 hover:text-white hover:translate-x-1'}
    `}
  >
    <span className={`text-xl transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>{icon}</span>
    <span className="font-black text-xs uppercase tracking-widest">{label}</span>
    {active && (
      <div className="absolute left-0 w-1 h-6 bg-white rounded-full -translate-x-4"></div>
    )}
  </button>
);

export default Layout;
