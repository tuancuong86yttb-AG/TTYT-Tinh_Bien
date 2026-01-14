
import React from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  BarChart3, 
  ClipboardCheck, 
  Settings2,
  Stethoscope
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'summary', name: 'Dashboard Tổng Quan', icon: LayoutDashboard },
    { id: 'department', name: 'Chi Tiết Khoa/Phòng', icon: Building2 },
    { id: 'analysis', name: 'Phân Tích Chuyên Sâu', icon: BarChart3 },
    { id: 'settings', name: 'Thiết Lập Chỉ Tiêu', icon: Settings2 },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-full border-r border-slate-800">
      <div className="p-6 flex items-center space-x-3">
        <div className="bg-blue-600 p-2 rounded-lg">
          <Stethoscope size={24} className="text-white" />
        </div>
        <h1 className="text-xl font-bold tracking-tight">H-Smart</h1>
      </div>
      
      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.name}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center space-x-3 px-4 py-2 bg-slate-800/50 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold">BG</div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate">Ban Giám Đốc</p>
            <p className="text-xs text-slate-500 truncate">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
