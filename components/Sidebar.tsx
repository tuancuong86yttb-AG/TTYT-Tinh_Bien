
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  BarChart3, 
  Settings2,
  Stethoscope,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, theme, setTheme }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'summary', name: 'Tổng Quan', icon: LayoutDashboard },
    { id: 'department', name: 'Khoa/Phòng', icon: Building2 },
    { id: 'analysis', name: 'Phân Tích', icon: BarChart3 },
    { id: 'settings', name: 'Cấu Hình', icon: Settings2 },
  ];

  const sidebarContent = (
    <>
      <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
        <div className="bg-primary-600 p-2 rounded-xl shadow-lg shadow-primary-500/20">
          <Stethoscope size={isCollapsed ? 20 : 24} className="text-white" />
        </div>
        {!isCollapsed && <h1 className="text-xl font-black tracking-tight text-white">H-Smart</h1>}
      </div>
      
      <nav className="flex-1 px-3 py-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3 px-4'} py-3.5 rounded-2xl transition-all duration-300 group ${
                isActive 
                  ? 'bg-primary-600 text-white shadow-xl shadow-primary-600/20' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
              }`}
              title={isCollapsed ? item.name : ''}
            >
              <Icon size={20} className={`${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform`} />
              {!isCollapsed && <span className="font-semibold">{item.name}</span>}
            </button>
          );
        })}
      </nav>

      <div className="p-3 space-y-2 border-t border-slate-800/50">
        <button 
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between px-4'} py-3 bg-slate-800/30 hover:bg-slate-800/60 rounded-2xl transition-all border border-slate-700/30`}
        >
          <div className="flex items-center space-x-3">
            {theme === 'light' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-primary-400" />}
            {!isCollapsed && <span className="text-sm font-bold text-slate-300">Chế độ {theme === 'light' ? 'Tối' : 'Sáng'}</span>}
          </div>
          {!isCollapsed && (
            <div className={`w-8 h-4 rounded-full p-0.5 transition-colors duration-500 ${theme === 'dark' ? 'bg-primary-600' : 'bg-slate-600'}`}>
              <div className={`w-3 h-3 bg-white rounded-full transition-transform duration-500 ${theme === 'dark' ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
          )}
        </button>

        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3 px-4'} py-3 bg-primary-600/5 rounded-2xl border border-primary-500/10`}>
          <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center font-bold text-xs text-white shadow-inner">BG</div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <p className="text-xs font-black truncate uppercase text-slate-200">Ban Giám Đốc</p>
              <p className="text-[10px] text-slate-500 truncate font-bold">Quản trị viên</p>
            </div>
          )}
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-3 bg-slate-900 text-white rounded-2xl shadow-xl border border-slate-800"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed lg:relative z-50 h-full bg-slate-950 text-white flex flex-col transition-all duration-500 ease-in-out border-r border-slate-900
        ${mobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
      `}>
        {/* Collapse Toggle Button (Desktop) */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute -right-3 top-20 bg-primary-600 text-white rounded-full p-1 shadow-lg border border-primary-500 z-50 hover:scale-110 transition-transform"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {sidebarContent}
      </div>
    </>
  );
};

export default Sidebar;
