
import React, { useMemo, useState } from 'react';
import { ActualData } from '../types';
import { MOCK_ICD_METADATA } from '../mockData';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Search, 
  Check, 
  ChevronDown, 
  Filter, 
  X,
  UserCheck
} from 'lucide-react';

interface AnalysisPageProps {
  data: ActualData[];
}

const AnalysisPage: React.FC<AnalysisPageProps> = ({ data }) => {
  const [selectedICDs, setSelectedICDs] = useState<string[]>([]);
  const [showICDFilter, setShowICDFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const allAvailableICDs = useMemo(() => {
    const codes = Array.from(new Set(data.map(d => d.icd10)));
    return codes.map(code => {
      const meta = MOCK_ICD_METADATA.find(m => m.code === code);
      return { code, name: meta?.name || 'Chẩn đoán khác' };
    }).sort((a, b) => a.code.localeCompare(b.code));
  }, [data]);

  const filteredICDOptions = useMemo(() => {
    if (!searchTerm) return allAvailableICDs;
    const lowerSearch = searchTerm.toLowerCase();
    return allAvailableICDs.filter(item => 
      item.code.toLowerCase().includes(lowerSearch) || 
      item.name.toLowerCase().includes(lowerSearch)
    );
  }, [allAvailableICDs, searchTerm]);

  const topICD = useMemo(() => {
    const counts: Record<string, number> = {};
    const revenues: Record<string, number> = {};
    
    const sourceData = selectedICDs.length > 0 
      ? data.filter(d => selectedICDs.includes(d.icd10))
      : data;

    sourceData.forEach(item => {
      counts[item.icd10] = (counts[item.icd10] || 0) + 1;
      revenues[item.icd10] = (revenues[item.icd10] || 0) + item.revenue;
    });

    const result = Object.entries(counts)
      .map(([code, count]) => {
        const metadata = MOCK_ICD_METADATA.find(m => m.code === code);
        return {
          code,
          name: metadata?.name || code,
          count,
          revenue: revenues[code]
        };
      })
      .sort((a, b) => b.count - a.count);

    return selectedICDs.length > 0 ? result : result.slice(0, 8);
  }, [data, selectedICDs]);

  const topDoctors = useMemo(() => {
    const revenues: Record<string, number> = {};
    const services: Record<string, number> = {};

    data.forEach(item => {
      revenues[item.doctorName] = (revenues[item.doctorName] || 0) + item.revenue;
      services[item.doctorName] = (services[item.doctorName] || 0) + 1;
    });

    return Object.entries(revenues)
      .map(([name, revenue]) => ({
        name,
        revenue,
        count: services[name]
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  }, [data]);

  const dischargeStats = useMemo(() => {
    const stats: Record<string, number> = {
      'KHOI': 0,
      'DO': 0,
      'KHONG_THAY_DOI': 0,
      'NANG': 0,
      'TU_VONG': 0,
      'CHUYEN_VIEN': 0
    };
    
    let totalDischarged = 0;
    data.forEach(item => {
      if (item.isDischarged && item.dischargeStatus) {
        stats[item.dischargeStatus]++;
        totalDischarged++;
      }
    });

    const statusMap = [
      { key: 'KHOI', name: 'Khỏi', color: '#10b981' },
      { key: 'DO', name: 'Đỡ / Giảm', color: '#3b82f6' },
      { key: 'KHONG_THAY_DOI', name: 'Không thay đổi', color: '#94a3b8' },
      { key: 'NANG', name: 'Nặng hơn', color: '#f59e0b' },
      { key: 'CHUYEN_VIEN', name: 'Chuyển viện', color: '#6366f1' },
      { key: 'TU_VONG', name: 'Tử vong', color: '#ef4444' }
    ];

    return {
      chartData: statusMap.map(s => ({ name: s.name, value: stats[s.key], color: s.color })),
      total: totalDischarged,
      tableData: statusMap.map(s => ({
        name: s.name,
        count: stats[s.key],
        percent: totalDischarged > 0 ? (stats[s.key] / totalDischarged * 100).toFixed(1) : '0',
        color: s.color
      }))
    };
  }, [data]);

  const formatCurrency = (val: number) => {
    if (val >= 1000000000) return (val / 1000000000).toFixed(1) + 'B';
    if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M';
    if (val >= 1000) return (val / 1000).toFixed(0) + 'K';
    return val.toString();
  };

  const toggleICD = (code: string) => {
    setSelectedICDs(prev => 
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  return (
    <div className="space-y-8 pb-12">
      {/* ICD Analysis Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Phân tích Mô hình bệnh tật (ICD-10)</h3>
            <p className="text-xs text-slate-500 font-medium">Theo dõi cơ cấu bệnh tật và hiệu quả kinh tế theo chẩn đoán</p>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setShowICDFilter(!showICDFilter)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl border-2 transition-all text-sm font-bold shadow-sm ${
                selectedICDs.length > 0 
                  ? 'bg-blue-50 border-blue-200 text-blue-700' 
                  : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'
              }`}
            >
              <Filter size={16} />
              <span>{selectedICDs.length > 0 ? `Đã chọn ${selectedICDs.length} mã` : 'Lọc mã ICD-10'}</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${showICDFilter ? 'rotate-180' : ''}`} />
            </button>

            {showICDFilter && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowICDFilter(false)}></div>
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
                  <div className="p-4 border-b border-slate-50 bg-slate-50/50">
                    <div className="relative">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text"
                        placeholder="Tìm mã hoặc tên bệnh..."
                        className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-100"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                      />
                    </div>
                  </div>
                  
                  <div className="max-h-64 overflow-y-auto px-2 py-2">
                    {filteredICDOptions.map((item) => (
                      <button 
                        key={item.code}
                        onClick={() => toggleICD(item.code)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors hover:bg-slate-50 ${
                          selectedICDs.includes(item.code) ? 'bg-blue-50/50' : ''
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-slate-700">{item.code}</span>
                          <span className="text-[10px] text-slate-500 truncate w-56">{item.name}</span>
                        </div>
                        {selectedICDs.includes(item.code) && (
                          <div className="bg-blue-600 rounded-full p-0.5">
                            <Check size={10} className="text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                    {filteredICDOptions.length === 0 && (
                      <div className="py-8 text-center text-slate-400 text-xs italic">Không tìm thấy mã phù hợp</div>
                    )}
                  </div>

                  <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <button 
                      onClick={() => setSelectedICDs([])}
                      className="text-[10px] font-black text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors"
                    >
                      Xóa tất cả
                    </button>
                    <button 
                      onClick={() => setShowICDFilter(false)}
                      className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-[11px] font-bold shadow-md hover:bg-blue-700 transition-all"
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Selected Badges */}
        {selectedICDs.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {selectedICDs.map(code => (
              <span key={code} className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-black border border-blue-200">
                <span>{code}</span>
                <button onClick={() => toggleICD(code)} className="hover:text-red-500 transition-colors">
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Count Chart */}
          <div>
            <p className="text-sm font-semibold text-slate-500 mb-4 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Số lượng ca bệnh theo mã ICD
            </p>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={topICD} margin={{ left: 10, right: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                  <XAxis type="number" fontSize={10} axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 600}} />
                  <YAxis dataKey="code" type="category" fontSize={10} axisLine={false} tickLine={false} width={40} tick={{fill: '#475569', fontWeight: 800}} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[0, 6, 6, 0]} barSize={selectedICDs.length > 5 ? 14 : 24} name="Số ca" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Revenue Chart */}
          <div>
            <p className="text-sm font-semibold text-slate-500 mb-4 flex items-center">
              <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
              Doanh thu theo mã ICD (VNĐ)
            </p>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={topICD} margin={{ left: 10, right: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    type="number" 
                    fontSize={10} 
                    axisLine={false} 
                    tickLine={false} 
                    tickFormatter={formatCurrency}
                    tick={{fill: '#94a3b8', fontWeight: 600}}
                  />
                  <YAxis dataKey="code" type="category" fontSize={10} axisLine={false} tickLine={false} width={40} tick={{fill: '#475569', fontWeight: 800}} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    formatter={(value: number) => [new Intl.NumberFormat('vi-VN').format(value) + ' đ', 'Doanh thu']}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                  />
                  <Bar dataKey="revenue" fill="#10b981" radius={[0, 6, 6, 0]} barSize={selectedICDs.length > 5 ? 14 : 24} name="Doanh thu" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-slate-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {topICD.slice(0, 4).map((icd) => (
              <div key={icd.code} className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 hover:bg-white hover:shadow-md transition-all group">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[11px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-widest">{icd.code}</span>
                  <span className="text-xs font-black text-slate-800">{icd.count} lượt</span>
                </div>
                <p className="text-xs font-semibold text-slate-500 truncate mb-3 group-hover:text-blue-600 transition-colors">{icd.name}</p>
                <p className="text-sm font-black text-emerald-600">{new Intl.NumberFormat('vi-VN').format(icd.revenue)} đ</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Doctor Performance Ranking - Enhanced with Bar Chart */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Phân tích Hiệu quả Bác sĩ (Top 10)</h3>
            <p className="text-xs text-slate-500 font-medium">Xếp hạng theo tổng doanh thu mang lại cho Trung tâm</p>
          </div>
          <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
            <UserCheck size={20} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Bar Chart for Doctors */}
          <div className="lg:col-span-7">
            <p className="text-sm font-semibold text-slate-500 mb-6 flex items-center">
              <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
              Biểu đồ Doanh thu Bác sĩ
            </p>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={topDoctors} margin={{ left: 10, right: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    type="number" 
                    fontSize={10} 
                    axisLine={false} 
                    tickLine={false} 
                    tickFormatter={formatCurrency}
                    tick={{fill: '#94a3b8', fontWeight: 600}}
                  />
                  <YAxis dataKey="name" type="category" fontSize={10} axisLine={false} tickLine={false} width={100} tick={{fill: '#475569', fontWeight: 800}} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    formatter={(value: number) => [new Intl.NumberFormat('vi-VN').format(value) + ' đ', 'Doanh thu']}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                  />
                  <Bar dataKey="revenue" fill="#6366f1" radius={[0, 6, 6, 0]} barSize={20} name="Doanh thu" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Ranking Table for Doctors */}
          <div className="lg:col-span-5 border-l border-slate-50 pl-0 lg:pl-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <th className="pb-4">Hạng</th>
                    <th className="pb-4">Bác sĩ</th>
                    <th className="pb-4 text-right">Doanh thu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {topDoctors.map((doc, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="py-3">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black shadow-sm ${
                          idx < 3 ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}>
                          {idx + 1}
                        </div>
                      </td>
                      <td className="py-3">
                        <p className="text-sm font-black text-slate-700 group-hover:text-blue-600 transition-colors">{doc.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{doc.count} lượt chỉ định</p>
                      </td>
                      <td className="py-3 text-sm font-black text-slate-800 text-right">
                        {new Intl.NumberFormat('vi-VN').format(doc.revenue)} đ
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Detailed Treatment Outcome Analysis */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800">Kết quả điều trị</h3>
            <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-2 py-1 rounded border border-emerald-100 uppercase tracking-widest">
              Tổng: {dischargeStats.total} ca
            </span>
          </div>
          
          <div className="flex flex-col md:flex-row items-center mb-6">
            <div className="h-56 w-full md:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dischargeStats.chartData}
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {dischargeStats.chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/2 grid grid-cols-1 gap-2 px-4">
              {dischargeStats.tableData.slice(0, 3).map((item, idx) => (
                <div key={idx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between hover:border-blue-200 transition-colors cursor-default">
                  <div className="flex items-center">
                    <div className="w-2.5 h-2.5 rounded-full mr-2 shadow-sm" style={{ backgroundColor: item.color }}></div>
                    <span className="text-xs font-bold text-slate-600">{item.name}</span>
                  </div>
                  <span className="text-xs font-black text-slate-800">{item.percent}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-100">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider">Kết quả</th>
                  <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider text-right">Số lượt</th>
                  <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider text-right">Tỷ lệ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {dischargeStats.tableData.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-4 py-3 flex items-center text-sm font-semibold text-slate-700">
                      <div className="w-2 h-2 rounded-full mr-2 shadow-sm group-hover:scale-125 transition-transform" style={{ backgroundColor: row.color }}></div>
                      {row.name}
                    </td>
                    <td className="px-4 py-3 text-sm font-bold text-slate-600 text-right">{row.count.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm font-black text-slate-800 text-right">{row.percent}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Services Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
           <div className="flex items-center justify-between mb-8">
             <div>
               <h3 className="text-lg font-bold text-slate-800">Top Dịch vụ kỹ thuật chỉ định cao nhất</h3>
               <p className="text-xs text-slate-400 font-medium">Xếp hạng mức độ phổ biến của các dịch vụ trong kỳ</p>
             </div>
             <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">Cập nhật 5 phút trước</div>
           </div>
           <div className="space-y-6">
             {[
               { name: 'Xét nghiệm máu tổng quát', value: 450, growth: '+12%', color: 'bg-blue-500' },
               { name: 'Siêu âm ổ bụng', value: 380, growth: '+5%', color: 'bg-indigo-500' },
               { name: 'Chụp X-Quang KTS', value: 310, growth: '-2%', color: 'bg-emerald-500' },
               { name: 'Nội soi tiêu hóa', value: 120, growth: '+25%', color: 'bg-amber-500' },
               { name: 'Điện tim thường', value: 290, growth: '+8%', color: 'bg-rose-500' },
               { name: 'Sinh hóa nước tiểu', value: 210, growth: '+4%', color: 'bg-sky-500' }
             ].map((svc, i) => (
               <div key={i} className="flex items-center space-x-5 group">
                 <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center font-black text-xs shadow-sm transition-all duration-300">
                   #{i+1}
                 </div>
                 <div className="flex-1">
                   <div className="flex justify-between items-center mb-2">
                     <span className="text-sm font-black text-slate-700 group-hover:text-slate-900 transition-colors">{svc.name}</span>
                     <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${svc.growth.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                       {svc.growth}
                     </span>
                   </div>
                   <div className="w-full bg-slate-100 rounded-full h-1.5 flex overflow-hidden shadow-inner">
                     <div className={`${svc.color} h-1.5 rounded-full transition-all duration-1000 group-hover:brightness-110`} style={{ width: `${(svc.value/450)*100}%` }}></div>
                   </div>
                 </div>
                 <div className="text-right">
                   <p className="text-sm font-black text-slate-800">{svc.value}</p>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Lượt</p>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;
