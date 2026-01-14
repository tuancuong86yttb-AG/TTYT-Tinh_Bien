
import React, { useState } from 'react';
import { 
  RefreshCw, 
  Calendar, 
  FileSpreadsheet, 
  CheckCircle2, 
  Clock,
  ChevronDown,
  Users,
  ChevronUp,
  Filter,
  Layers
} from 'lucide-react';
import { GlobalFilters } from '../types';
import { DEPARTMENTS, DOCTORS } from '../constants';

interface HeaderProps {
  filters: GlobalFilters;
  setFilters: (filters: GlobalFilters) => void;
  onSync: () => void;
  isSyncing: boolean;
  sheetId: string;
  setSheetId: (id: string) => void;
  syncStatus: 'idle' | 'fetching' | 'success' | 'error';
  lastSynced: string | null;
}

const Header: React.FC<HeaderProps> = ({ 
  filters, 
  setFilters, 
  onSync, 
  isSyncing,
  sheetId,
  setSheetId,
  syncStatus,
  lastSynced
}) => {
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isCustomDate, setIsCustomDate] = useState(false);

  const formatDateDisplay = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  };

  const setTimeRange = (type: 'fixed' | 'today' | 'yesterday' | 'thisMonth' | 'last7Days') => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    
    let start = todayStr;
    let end = todayStr;

    switch (type) {
      case 'fixed':
        start = '2026-01-01';
        end = '2026-12-31';
        setIsCustomDate(false);
        break;
      case 'today':
        start = todayStr;
        end = todayStr;
        setIsCustomDate(false);
        break;
      case 'yesterday':
        const yesterday = new Date();
        yesterday.setDate(now.getDate() - 1);
        start = yesterday.toISOString().split('T')[0];
        end = start;
        setIsCustomDate(false);
        break;
      case 'last7Days':
        const last7 = new Date();
        last7.setDate(now.getDate() - 7);
        start = last7.toISOString().split('T')[0];
        end = todayStr;
        setIsCustomDate(false);
        break;
      case 'thisMonth':
        start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
        end = todayStr;
        setIsCustomDate(false);
        break;
    }

    setFilters({ ...filters, startDate: start, endDate: end });
    if (type !== 'fixed') setShowTimePicker(false);
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-3 shadow-sm">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-0.5">
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Hệ thống Quản trị Y tế H-Smart</h2>
            {lastSynced && (
              <div className="flex items-center text-[10px] font-black text-slate-500 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">
                <Clock size={12} className="mr-1 text-blue-500" /> Cập nhật: {lastSynced}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <p className="text-[11px] text-slate-400 font-bold tracking-tight">Kết nối: <span className="font-mono text-slate-500 bg-slate-50 px-1 rounded">{sheetId.substring(0, 10)}...</span></p>
            {syncStatus === 'success' && (
              <span className="flex items-center text-[9px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-100">
                <CheckCircle2 size={10} className="mr-1" /> Đồng bộ Real-time
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Sync Section */}
          <div className="flex items-center rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden focus-within:ring-4 focus-within:ring-blue-50 focus-within:border-blue-200 transition-all">
            <div className="px-3 py-2 flex items-center space-x-2 border-r border-slate-100 bg-slate-50/50">
              <FileSpreadsheet size={16} className="text-emerald-600" />
            </div>
            <input 
              type="text" 
              className="bg-transparent px-3 py-2 text-sm outline-none border-none text-slate-700 w-24 font-mono placeholder:text-slate-300 transition-all focus:w-40" 
              placeholder="Sheet ID..."
              value={sheetId}
              onChange={(e) => setSheetId(e.target.value)}
            />
            <button 
              onClick={onSync}
              disabled={isSyncing}
              className={`flex items-center space-x-2 px-4 py-2 font-black text-[13px] transition-all border-l border-slate-100 ${
                isSyncing 
                ? 'bg-slate-50 text-slate-400 cursor-not-allowed' 
                : 'bg-white text-blue-600 hover:bg-blue-50 active:bg-blue-100'
              }`}
            >
              <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
              <span>{isSyncing ? 'Nạp...' : 'Đồng bộ'}</span>
            </button>
          </div>

          <div className="h-6 w-[1px] bg-slate-200 hidden lg:block mx-1"></div>

          {/* Time Range Picker - Refined Style */}
          <div className="relative">
            <button 
              onClick={() => setShowTimePicker(!showTimePicker)}
              className={`flex items-center space-x-3 px-4 py-2 rounded-xl border-2 transition-all group ${
                showTimePicker 
                ? 'bg-blue-50 border-blue-400 shadow-lg shadow-blue-50' 
                : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Calendar size={18} className={`${showTimePicker ? 'text-blue-600' : 'text-slate-400'} group-hover:text-blue-500 transition-colors`} />
              <div className="text-left">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">Thời gian</p>
                <p className={`text-[13px] font-black flex items-center ${showTimePicker ? 'text-blue-700' : 'text-slate-700'}`}>
                  {formatDateDisplay(filters.startDate)} 
                  <span className="mx-1.5 text-slate-300 font-normal">-</span> 
                  {formatDateDisplay(filters.endDate)}
                  {showTimePicker ? (
                    <ChevronUp size={14} className="ml-2 text-blue-400" />
                  ) : (
                    <ChevronDown size={14} className="ml-2 text-slate-400" />
                  )}
                </p>
              </div>
            </button>

            {showTimePicker && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowTimePicker(false)}></div>
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-3xl shadow-2xl border border-slate-100 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-300 overflow-hidden">
                  <div className="px-5 py-2 mb-1 border-b border-slate-50 bg-slate-50/50">
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phạm vi dữ liệu</span>
                  </div>
                  <div className="px-2 pt-1">
                    {[
                      { id: 'fixed', name: 'Toàn kỳ (Năm 2026)', type: 'fixed' },
                      { id: 'today', name: 'Hôm nay', type: 'today' },
                      { id: 'yesterday', name: 'Hôm qua', type: 'yesterday' },
                      { id: 'thisMonth', name: 'Tháng này', type: 'thisMonth' },
                      { id: 'last7Days', name: '7 ngày qua', type: 'last7Days' },
                    ].map((item) => (
                      <button 
                        key={item.id}
                        onClick={() => setTimeRange(item.type as any)}
                        className="w-full flex items-center px-4 py-2.5 text-[13px] font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all text-left"
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                  
                  <div className="mt-3 px-3">
                    <button 
                      onClick={() => { setIsCustomDate(!isCustomDate); }}
                      className={`w-full flex items-center justify-between px-4 py-2 text-[12px] font-black rounded-xl transition-all ${isCustomDate ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                    >
                      <span>Tùy chỉnh ngày cụ thể</span>
                      {isCustomDate ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    
                    {isCustomDate && (
                      <div className="p-4 space-y-3 bg-slate-50/80 rounded-2xl mt-2 border border-slate-100 animate-in slide-in-from-top-1 duration-200">
                        <div className="flex flex-col space-y-3">
                          <div className="flex-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase block mb-1 ml-1">Bắt đầu</label>
                            <input 
                              type="date" 
                              className="w-full bg-white text-[13px] font-black p-2 rounded-lg border border-slate-200 outline-none focus:ring-4 focus:ring-blue-100 transition-all text-slate-700 shadow-sm" 
                              value={filters.startDate}
                              onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                            />
                          </div>
                          <div className="flex-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase block mb-1 ml-1">Kết thúc</label>
                            <input 
                              type="date" 
                              className="w-full bg-white text-[13px] font-black p-2 rounded-lg border border-slate-200 outline-none focus:ring-4 focus:ring-blue-100 transition-all text-slate-700 shadow-sm" 
                              value={filters.endDate}
                              onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                            />
                          </div>
                        </div>
                        <button 
                          onClick={() => setShowTimePicker(false)}
                          className="w-full bg-blue-600 text-white py-2.5 rounded-xl text-[13px] font-black shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all"
                        >
                          Lọc kết quả
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="h-6 w-[1px] bg-slate-200 hidden lg:block mx-1"></div>

          {/* Filters - Improved Group Styling */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-blue-200 transition-all group shadow-sm">
               <Layers size={14} className="text-slate-400 group-hover:text-blue-500" />
               <select 
                className="bg-transparent text-[13px] font-black outline-none text-slate-700 cursor-pointer min-w-[120px]"
                value={filters.patientType}
                onChange={(e) => setFilters({...filters, patientType: e.target.value})}
              >
                <option value="ALL">Tất cả Đối tượng</option>
                <option value="BHYT">BHYT</option>
                <option value="VIEN_PHI">Viện phí</option>
                <option value="DICH_VU">Dịch vụ</option>
              </select>
            </div>

            <div className="flex items-center space-x-1 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-blue-200 transition-all group shadow-sm">
               <Filter size={14} className="text-slate-400 group-hover:text-blue-500" />
               <select 
                className="bg-transparent text-[13px] font-black outline-none text-slate-700 cursor-pointer min-w-[140px]"
                value={filters.deptCode}
                onChange={(e) => setFilters({...filters, deptCode: e.target.value as any})}
              >
                <option value="ALL">Toàn Trung tâm</option>
                {DEPARTMENTS.map(dept => (
                  <option key={dept.code} value={dept.code}>{dept.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-1 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-blue-200 transition-all group shadow-sm">
              <Users size={14} className="text-slate-400 group-hover:text-blue-500" />
              <select 
                className="bg-transparent text-[13px] font-black outline-none text-slate-700 cursor-pointer min-w-[130px]"
                value={filters.doctor}
                onChange={(e) => setFilters({...filters, doctor: e.target.value})}
              >
                <option value="ALL">Tất cả Bác sĩ</option>
                {DOCTORS.map(doc => (
                  <option key={doc} value={doc}>{doc}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
