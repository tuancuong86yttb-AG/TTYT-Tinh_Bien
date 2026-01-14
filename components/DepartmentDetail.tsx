
import React, { useMemo, useState } from 'react';
import { ActualData, MedicalTarget, GlobalFilters, TargetCategory } from '../types';
import { DEPARTMENTS, TARGET_METRICS } from '../constants';
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  TrendingUp, 
  TrendingDown,
  Home,
  Stethoscope,
  LogOut,
  Settings2,
  ChevronDown,
  Eye,
  EyeOff,
  Check,
  AlertTriangle,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

interface DepartmentDetailProps {
  data: ActualData[];
  targets: MedicalTarget[];
  filters: GlobalFilters;
}

const DepartmentDetail: React.FC<DepartmentDetailProps> = ({ data, targets, filters }) => {
  const [showColumnToggle, setShowColumnToggle] = useState(false);
  const [visibleCols, setVisibleCols] = useState({
    date: true,
    doctor: true,
    service: true,
    icd: true,
    revenue: true
  });

  const toggleColumn = (col: keyof typeof visibleCols) => {
    setVisibleCols(prev => ({ ...prev, [col]: !prev[col] }));
  };

  const displayTitle = useMemo(() => {
    if (filters.deptCode === 'ALL') return 'Toàn Trung Tâm Y Tế';
    const dept = DEPARTMENTS.find(d => d.code === filters.deptCode);
    return dept ? dept.name : 'Toàn Trung Tâm Y Tế';
  }, [filters.deptCode]);
  
  const deptStats = useMemo(() => {
    const deptActuals = data.filter(d => filters.deptCode === 'ALL' || d.deptCode === filters.deptCode);
    const deptTargets = targets.filter(t => filters.deptCode === 'ALL' ? t.deptCode === 'TONG' : t.deptCode === filters.deptCode);

    return deptTargets.map(target => {
      let actualVal = 0;
      if (target.id.includes('KHAM_CHUNG')) {
        actualVal = deptActuals.length;
      } else if (target.id.includes('BN_NOI_TRU')) {
        actualVal = deptActuals.filter(d => d.admissionType === 'NOI_TRU').length;
      } else if (target.id.includes('BN_NGOAI_TRU')) {
        actualVal = deptActuals.filter(d => d.admissionType === 'NGOAI_TRU').length;
      // Fixed: Comparison with enum member TargetCategory.DOAN_THU instead of string literal to fix TypeScript error on line 62
      } else if (target.category === TargetCategory.DOAN_THU) {
        actualVal = deptActuals.reduce((sum, item) => sum + item.revenue, 0);
      } else {
        actualVal = Math.round(target.yearlyPlan * 0.76 + Math.random() * target.yearlyPlan * 0.05);
      }

      const percent = (actualVal / target.yearlyPlan) * 100;
      let status: 'SUCCESS' | 'WARNING' | 'DANGER' = 'SUCCESS';
      
      // Logic đặc biệt cho chỉ tiêu chi phí (vượt quá là xấu)
      const isCostMetric = target.id.includes('HAO_PHI');
      if (isCostMetric) {
        if (percent > 110) status = 'DANGER';
        else if (percent > 95) status = 'WARNING';
      } else {
        if (percent < 70) status = 'DANGER';
        else if (percent < 90) status = 'WARNING';
      }

      return {
        ...target,
        actual: actualVal,
        percent,
        status,
        isCostMetric
      };
    });
  }, [data, targets, filters]);

  // Cảnh báo dựa trên tiến độ
  const warningMetrics = useMemo(() => {
    return deptStats.filter(s => s.status === 'DANGER' || s.status === 'WARNING').sort((a, b) => {
      if (a.isCostMetric && !b.isCostMetric) return -1;
      if (!a.isCostMetric && b.isCostMetric) return 1;
      return a.percent - b.percent;
    });
  }, [deptStats]);

  const quickStats = useMemo(() => {
    const deptActuals = data.filter(d => filters.deptCode === 'ALL' || d.deptCode === filters.deptCode);
    return {
      inpatient: deptActuals.filter(d => d.admissionType === 'NOI_TRU').length,
      outpatient: deptActuals.filter(d => d.admissionType === 'NGOAI_TRU').length,
      discharged: deptActuals.filter(d => d.isDischarged).length
    };
  }, [data, filters.deptCode]);

  const columnOptions = [
    { id: 'date', label: 'Ngày', key: 'date' },
    { id: 'doctor', label: 'Bác sĩ chỉ định', key: 'doctor' },
    { id: 'service', label: 'Tên dịch vụ', key: 'service' },
    { id: 'icd', label: 'Mã ICD', key: 'icd' },
    { id: 'revenue', label: 'Thành tiền', key: 'revenue' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{displayTitle}</h2>
          <p className="text-slate-500">Phân tích chuyên sâu về chỉ tiêu và hiệu quả vận hành</p>
        </div>
        <div className="flex space-x-2">
           <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold flex items-center border border-emerald-200 shadow-sm">
             <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
             Hoạt động tốt
           </span>
        </div>
      </div>

      {/* Quick Indicators for Dept */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center space-x-4 shadow-sm">
          <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600"><Home size={20}/></div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">Số bệnh Nội trú</p>
            <p className="text-xl font-black text-slate-800">{quickStats.inpatient.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center space-x-4 shadow-sm">
          <div className="bg-sky-50 p-2 rounded-lg text-sky-600"><Stethoscope size={20}/></div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">Số bệnh Ngoại trú</p>
            <p className="text-xl font-black text-slate-800">{quickStats.outpatient.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center space-x-4 shadow-sm">
          <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600"><LogOut size={20}/></div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">Số ca Ra viện</p>
            <p className="text-xl font-black text-slate-800">{quickStats.discharged.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* NEW SECTION: At-Risk Metrics / Warnings */}
      {warningMetrics.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-slate-800">
            <ShieldAlert size={20} className="text-red-500" />
            <h3 className="font-bold text-lg">Chỉ tiêu cần chú ý</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {warningMetrics.slice(0, 4).map((metric, i) => (
              <div key={i} className={`p-4 rounded-2xl border bg-white shadow-sm flex flex-col justify-between group transition-all hover:shadow-md ${metric.status === 'DANGER' ? 'border-l-4 border-l-red-500 border-slate-200' : 'border-l-4 border-l-amber-500 border-slate-200'}`}>
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter ${metric.isCostMetric ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-600'}`}>
                      {metric.isCostMetric ? 'Cảnh báo Chi phí' : 'Cảnh báo Tiến độ'}
                    </span>
                    {metric.isCostMetric ? <TrendingUp size={14} className="text-red-500" /> : <TrendingDown size={14} className="text-amber-500" />}
                  </div>
                  <p className="text-sm font-bold text-slate-700 leading-snug truncate">{metric.name}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[10px] font-bold text-slate-400">Hiệu suất</span>
                    <span className={`text-xs font-black ${metric.status === 'DANGER' ? 'text-red-600' : 'text-amber-600'}`}>{metric.percent.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden shadow-inner">
                    <div className={`h-1.5 rounded-full ${metric.status === 'DANGER' ? 'bg-red-500' : 'bg-amber-500'}`} style={{ width: `${Math.min(metric.percent, 100)}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {deptStats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow border-l-4 border-l-amber-500">
            <div className={`absolute top-0 right-0 w-1 h-full ${
              stat.status === 'SUCCESS' ? 'bg-emerald-500' : 
              stat.status === 'WARNING' ? 'bg-amber-500' : 'bg-red-500'
            }`}></div>
            
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1 group-hover:text-blue-600 transition-colors">{stat.name}</p>
                <div className="flex items-baseline space-x-2">
                  <p className="text-3xl font-black text-slate-800">
                    {/* Fixed: Use enum member TargetCategory.DOAN_THU instead of string literal for type safety */}
                    {stat.category === TargetCategory.DOAN_THU 
                      ? (stat.actual / 1000000000).toFixed(2) + ' Tỷ' 
                      : stat.actual.toLocaleString()
                    }
                  </p>
                  <span className="text-xs font-bold text-slate-400">/ {
                    /* Fixed: Use enum member TargetCategory.DOAN_THU instead of string literal for type safety */
                    stat.category === TargetCategory.DOAN_THU 
                      ? (stat.yearlyPlan / 1000000000).toFixed(1) + ' Tỷ' 
                      : stat.yearlyPlan.toLocaleString()
                    } {stat.unit}</span>
                </div>
              </div>
              <div className="p-2 bg-amber-50 rounded-full">
                <Clock size={20} className="text-amber-500" />
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-black text-slate-700">{stat.percent.toFixed(1)}% Hoàn thành</span>
                <span className={`text-[10px] font-bold flex items-center uppercase tracking-wider ${stat.percent > 80 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {stat.percent > 80 ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
                  {stat.percent > 80 ? 'Vượt tiến độ' : 'Chậm tiến độ'}
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden shadow-inner">
                <div className={`h-3 rounded-full transition-all duration-1000 ${stat.status === 'DANGER' ? 'bg-red-500' : 'bg-amber-500'}`} style={{ width: `${Math.min(stat.percent, 100)}%` }}></div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-50 grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Quý 1</p>
                <p className="text-sm font-black text-slate-700">95%</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Quý 2</p>
                <p className="text-sm font-black text-slate-700">82%</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Quý 3</p>
                <p className="text-sm font-black text-slate-700">--</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-bold text-slate-800">Danh sách dịch vụ tiêu biểu trong kỳ</h3>
            <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md uppercase tracking-widest border border-blue-100">Dữ liệu thời gian thực</span>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setShowColumnToggle(!showColumnToggle)}
              className="flex items-center space-x-2 bg-slate-50 hover:bg-slate-100 px-4 py-2 rounded-xl border border-slate-200 transition-all text-xs font-bold text-slate-600 shadow-sm"
            >
              <Settings2 size={16} />
              <span>Tùy chỉnh cột</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${showColumnToggle ? 'rotate-180' : ''}`} />
            </button>

            {showColumnToggle && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowColumnToggle(false)}></div>
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-4 py-2 mb-2 border-b border-slate-50">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ẩn/Hiện cột</span>
                  </div>
                  <div className="px-2 space-y-1">
                    {columnOptions.map((opt) => (
                      <button 
                        key={opt.id}
                        onClick={() => toggleColumn(opt.key as any)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-all hover:bg-slate-50 text-slate-600"
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${visibleCols[opt.key as keyof typeof visibleCols] ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300'}`}>
                            {visibleCols[opt.key as keyof typeof visibleCols] && <Check size={10} className="text-white" />}
                          </div>
                          <span>{opt.label}</span>
                        </div>
                        {visibleCols[opt.key as keyof typeof visibleCols] ? <Eye size={14} className="text-slate-400" /> : <EyeOff size={14} className="text-slate-200" />}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                {visibleCols.date && <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ngày</th>}
                {visibleCols.doctor && <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Bác sĩ chỉ định</th>}
                {visibleCols.service && <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tên dịch vụ</th>}
                {visibleCols.icd && <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Mã ICD</th>}
                {visibleCols.revenue && <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Thành tiền</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.slice(0, 10).map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/80 transition-colors group">
                  {visibleCols.date && (
                    <td className="py-4 text-sm font-medium text-slate-500">
                      {new Date(row.date).toLocaleDateString('vi-VN')}
                    </td>
                  )}
                  {visibleCols.doctor && (
                    <td className="py-4 text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                      {row.doctorName}
                    </td>
                  )}
                  {visibleCols.service && (
                    <td className="py-4 text-sm text-slate-600">
                      {row.serviceName}
                    </td>
                  )}
                  {visibleCols.icd && (
                    <td className="py-4">
                      <span className="text-xs font-mono font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                        {row.icd10}
                      </span>
                    </td>
                  )}
                  {visibleCols.revenue && (
                    <td className="py-4 text-sm font-black text-slate-800 text-right">
                      {new Intl.NumberFormat('vi-VN').format(row.revenue)} đ
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-6 text-center">
           <button className="px-6 py-2 bg-slate-50 text-slate-600 font-bold text-xs rounded-full border border-slate-200 hover:bg-slate-100 hover:text-blue-600 transition-all active:scale-95">
             Xem thêm {data.length > 10 ? (data.length - 10).toLocaleString() : 0} dòng dữ liệu khác
           </button>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDetail;
