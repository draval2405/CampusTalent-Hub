
import React from 'react';

export type ViewType = 'discover' | 'profile' | 'connections' | 'projects' | 'hackathons' | 'messages';

interface SidebarProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  const menuItems = [
    { id: 'discover', name: 'Discover', icon: 'fa-compass' },
    { id: 'profile', name: 'My Profile', icon: 'fa-user' },
    { id: 'connections', name: 'Connections', icon: 'fa-users' },
    { id: 'projects', name: 'Projects', icon: 'fa-briefcase' },
    { id: 'hackathons', name: 'Hackathons', icon: 'fa-trophy' },
    { id: 'messages', name: 'Messages', icon: 'fa-paper-plane' },
  ] as const;

  return (
    <aside className="w-64 fixed left-0 top-0 h-screen border-r border-slate-800/50 bg-slate-950/80 backdrop-blur-2xl p-6 hidden lg:flex flex-col z-30">
      <div className="mb-10 flex items-center gap-3 cursor-pointer group" onClick={() => onViewChange('discover')}>
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-[0_0_20px_rgba(59,130,246,0.3)] group-hover:scale-110 transition-transform">
          C
        </div>
        <span className="font-bold text-xl tracking-tight text-slate-100">Campus<span className="text-blue-500">Hub</span></span>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              activeView === item.id 
                ? 'bg-blue-500/10 text-blue-400 font-bold shadow-[inset_0_0_10px_rgba(59,130,246,0.05)] border border-blue-500/20' 
                : 'text-slate-500 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <i className={`fas ${item.icon} w-5 ${activeView === item.id ? 'text-blue-400' : ''}`}></i>
            {item.name}
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-800/50">
        <div 
          onClick={() => onViewChange('profile')}
          className="flex items-center gap-3 mb-6 p-2 rounded-xl hover:bg-slate-800/50 cursor-pointer transition-all border border-transparent hover:border-slate-700/50"
        >
          <div className="w-10 h-10 rounded-full bg-slate-800 overflow-hidden ring-2 ring-blue-500/20">
            <img src="https://picsum.photos/seed/currentuser/100" alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-100 truncate">Aryan Verma</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-tighter">IIT Delhi • Admin</p>
          </div>
          <i className="fas fa-cog text-slate-600 text-xs"></i>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
