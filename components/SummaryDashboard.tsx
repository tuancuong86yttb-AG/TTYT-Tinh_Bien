
import React, { useMemo, useState } from 'react';
import { 
  Users, 
  Bed, 
  DollarSign, 
  AlertTriangle,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  CheckCircle2,
  LogOut,
  TrendingUp,
  Activity,
  ShieldCheck,
  UserCheck,
  Medal,
  X,
  Stethoscope,
  Calendar,
  BriefcaseMedical
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { ActualData, MedicalTarget, DepartmentCode, TargetCategory } from '../types';
import { DEPARTMENTS } from '../constants';

interface SummaryDashboardProps {
  data: ActualData[];
  targets: MedicalTarget[];
}

const SummaryDashboard: React.FC<SummaryDashboardProps> = ({ data, targets }) => {
  const [selectedDoctorName, setSelectedDoctorName] = useState<string | null>(null);

  const totalRevenue = useMemo(() => data.reduce((sum, item) => sum + item.revenue, 0), [data]);
  const totalPatients = useMemo(() => new Set(data.map(d => d.id)).size, [data]);
  
  const treatmentStats = useMemo(() => {
    const stats = {
      totalDischarged: data.filter(d => d.isDischarged).length,
      khoi: data.filter(d => d.dischargeStatus === 'KHOI').length,
      do: data.filter(d => d.dischargeStatus === 'DO').length,
      chuyenVien: data.filter(d => d.dischargeStatus === 'CHUYEN_VIEN').length,
      tuVong: data.filter(d => d.dischargeStatus === 'TU_VONG').length,
      nang: data.filter(d => d.dischargeStatus === 'NANG').length,
    };
    return stats;
  }, [data]);

  const revenueTarget = useMemo(() => {
    return targets.find(t => t.deptCode === 'TONG' && t.category === TargetCategory.DOANH_THU)?.yearlyPlan || 1;
  }, [targets]);

  const revenuePercent = (totalRevenue / revenueTarget) * 100;

  const revenueByDept = useMemo(() => {
    const map: Record<string, number> = {};
    data.forEach(item => {
      map[item.deptCode] = (map[item.deptCode] || 0) + item.revenue;
    });
    return DEPARTMENTS.map(dept => ({
      name: dept.name,
      code: dept.code,
      revenue: map[dept.code] || 0
    })).sort((a, b) => b.revenue - a.revenue);
  }, [data]);

  const topDoctors = useMemo(() => {
    const map: Record<string, { revenue: number, count: number }> = {};
    data.forEach(item => {
      if (!map[item.doctorName]) map[item.doctorName] = { revenue: 0, count: 0 };
      map[item.doctorName].revenue += item.revenue;
      map[item.doctorName].count += 1;
    });
    return Object.entries(map)
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  }, [data]);

  const departmentWarnings = useMemo(() => {
    return DEPARTMENTS.map(dept => {
      const actual = data.filter(d => d.deptCode === dept.code).reduce((sum, i) => sum + i.revenue, 0);
      const target = targets.find(t => t.deptCode === dept.code && t.category === TargetCategory.DOANH_THU)?.yearlyPlan || 1000000;
      const percent = (actual / target) * 100;
      return { name: dept.name, percent, code: dept.code };
    }).filter(d => d.percent < 75).sort((a, b) => a.percent - b.percent);
  }, [data, targets]);

  const patientTypeDistribution = useMemo(() => {
    const types = { BHYT: 0, VIEN_PHI: 0, DICH_VU: 0 };
    data.forEach(item => {
      if (item.patientType in types) types[item.patientType]++;
    });
    return [
      { name: 'BHYT', value: types.BHYT, color: '#3b82f6' },
      { name: 'Viện phí', value: types.VIEN_PHI, color: '#10b981' },
      { name: 'Dịch vụ', value: types.DICH_VU, color: '#f59e0b' }
    ];
  }, [data]);

  // Dữ liệu chi tiết cho bác sĩ được chọn
  const doctorDetails = useMemo(() => {
    if (!selectedDoctorName) return null;
    const docData = data.filter(d => d.doctorName === selectedDoctorName);
    const serviceMap: Record<string, { name: string, count: number, revenue: number }> = {};
    
    docData.forEach(item => {
      if (!serviceMap[item.serviceName]) serviceMap[item.serviceName] = { name: item.serviceName, count: 0, revenue: 0 };
      serviceMap[item.serviceName].count++;
      serviceMap[item.serviceName].revenue += item.revenue;
    });

    const services = Object.values(serviceMap).sort((a, b) => b.count - a.count);
    const totalRev = docData.reduce((sum, i) => sum + i.revenue, 0);
    const totalSvc = docData.length;

    return {
      name: selectedDoctorName,
      totalRevenue: totalRev,
      totalServices: totalSvc,
      services: services.slice(0, 5),
      recentPrescriptions: docData.slice(0, 8),
      chartData: services.slice(0, 5).map(s => ({ name: s.name, value: s.count }))
    };
  }, [selectedDoctorName, data]);

  const kpis = [
    { label: 'DOANH THU THỰC TẾ', value: `${(totalRevenue / 1000000000).toFixed(2)} Tỷ`, icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50', trend: `${revenuePercent.toFixed(1)}% KH`, isPositive: revenuePercent > 70 },
    { label: 'TỔNG LƯỢT KHÁM', value: totalPatients.toLocaleString(), icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+5.2%', isPositive: true },
    { label: 'CS GIƯỜNG BỆNH', value: '88.5%', icon: Bed, color: 'text-orange-600', bg: 'bg-orange-50', trend: '-2.1%', isPositive: false },
    { label: 'KHOA CẢNH BÁO', value: `${departmentWarnings.length} Khoa`, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50', trend: 'CẦN CHÚ Ý', isPositive: false },
  ];

  const treatmentCards = [
    { label: 'Tổng số ra viện', value: treatmentStats.totalDischarged, icon: LogOut, color: 'text-slate-600', bg: 'bg-slate-50' },
    { label: 'Kết quả: Khỏi', value: treatmentStats.khoi, icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Kết quả: Đỡ / Giảm', value: treatmentStats.do, icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Chuyển tuyến', value: treatmentStats.chuyenVien, icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Tử vong / Nặng', value: treatmentStats.tuVong + treatmentStats.nang, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  const formatCurrency = (val: number) => (val / 1000000).toFixed(0) + 'M';

  const getStatusColor = (percent: number) => {
    if (percent >= 90) return 'text-emerald-600 bg-emerald-100';
    if (percent >= 70) return 'text-amber-600 bg-amber-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Toàn Trung Tâm Y Tế</h2>
          <p className="text-slate-500 text-sm font-medium">Phân tích chuyên sâu về chỉ tiêu và hiệu quả vận hành toàn trung tâm</p>
        </div>
        <div className="flex space-x-2">
           <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold flex items-center border border-emerald-200">
             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
             Hoạt động tốt
           </span>
        </div>
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative group hover:shadow-md transition-shadow">
            <div className="absolute top-4 right-4">
              <span className={`text-[10px] font-black px-2 py-1 rounded-full flex items-center tracking-wider ${
                kpi.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
              }`}>
                {kpi.isPositive ? <ArrowUpRight size={10} className="mr-1" /> : <ArrowDownRight size={10} className="mr-1" />}
                {kpi.trend}
              </span>
            </div>
            <div className="flex items-start space-x-4">
              <div className={`${kpi.bg} p-3 rounded-xl shrink-0`}>
                <kpi.icon className={kpi.color} size={24} />
              </div>
              <div className="pt-1">
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">{kpi.label}</p>
                <p className="text-2xl font-black text-slate-800 tracking-tight">{kpi.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Treatment Results Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {treatmentCards.map((res, idx) => (
          <div key={idx} className="bg-white px-5 py-4 rounded-xl border border-slate-100 shadow-sm flex items-center space-x-4 hover:border-blue-200 transition-all cursor-default">
            <div className={`${res.bg} p-2.5 rounded-lg`}>
              <res.icon className={res.color} size={18} />
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{res.label}</p>
              <p className="text-lg font-black text-slate-800">{res.value.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Hiệu quả Doanh thu theo Khoa</h3>
              <p className="text-xs text-slate-400 font-medium italic">* So sánh tương quan thực tế giữa các đơn vị</p>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByDept} margin={{ top: 5, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  interval={0}
                  tick={{ fill: '#94a3b8', fontWeight: 600 }}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={formatCurrency}
                  tick={{ fill: '#94a3b8', fontWeight: 600 }}
                />
                <Tooltip 
                  formatter={(value: number) => [new Intl.NumberFormat('vi-VN').format(value) + ' VNĐ', 'Doanh thu']}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="revenue" radius={[6, 6, 0, 0]} barSize={32}>
                  {revenueByDept.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index < 3 ? '#2563eb' : '#cbd5e1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Slow Progress Warnings */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-2">Khoa cần chú ý</h3>
          <p className="text-xs text-slate-400 mb-6 font-medium">Danh sách các khoa đạt dưới 75% chỉ tiêu doanh thu</p>
          
          <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
            {departmentWarnings.length > 0 ? (
              departmentWarnings.map((dept, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-red-200 transition-colors">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-slate-700">{dept.name}</span>
                    <span className="text-[10px] font-black text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-100 italic">
                      Chậm { (75 - dept.percent).toFixed(1) }%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-red-500 h-1.5 rounded-full" style={{ width: `${dept.percent}%` }}></div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Tiến độ hiện tại</span>
                    <span className="text-[10px] font-black text-slate-600">{dept.percent.toFixed(1)}%</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-2 opacity-60">
                <CheckCircle2 size={40} className="text-emerald-500" />
                <p className="text-sm font-bold text-slate-500">Tất cả các khoa đang đạt tiến độ tốt</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top 10 Doctors Ranking Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 p-2 rounded-xl text-white">
              <UserCheck size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Xếp hạng Hiệu quả Bác sĩ (Top 10)</h3>
              <p className="text-xs text-slate-500 font-medium">Báo cáo doanh thu thực tế và khối lượng dịch vụ theo từng cá nhân</p>
            </div>
          </div>
          <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-widest border border-indigo-100">
            DỮ LIỆU TỔNG HỢP
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-4">
                <th className="pb-4 pl-4">Hạng</th>
                <th className="pb-4">Họ và tên Bác sĩ</th>
                <th className="pb-4 text-center">Số lượt chỉ định</th>
                <th className="pb-4 text-right pr-4">Tổng doanh thu mang lại</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {topDoctors.map((doc, idx) => (
                <tr 
                  key={idx} 
                  onClick={() => setSelectedDoctorName(doc.name)}
                  className="hover:bg-slate-50/80 transition-all group cursor-pointer"
                >
                  <td className="py-4 pl-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shadow-sm ${
                      idx === 0 ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                      idx === 1 ? 'bg-slate-200 text-slate-700 border border-slate-300' :
                      idx === 2 ? 'bg-orange-100 text-orange-700 border border-orange-200' :
                      'bg-slate-50 text-slate-500 border border-slate-100'
                    }`}>
                      {idx === 0 ? <Medal size={14} /> : idx + 1}
                    </div>
                  </td>
                  <td className="py-4">
                    <p className="text-sm font-black text-slate-700 group-hover:text-indigo-600 transition-colors">{doc.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Bác sĩ chuyên khoa</p>
                  </td>
                  <td className="py-4 text-center">
                    <span className="text-sm font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                      {doc.count.toLocaleString()} lượt
                    </span>
                  </td>
                  <td className="py-4 text-right pr-4">
                    <p className="text-sm font-black text-slate-800">
                      {new Intl.NumberFormat('vi-VN').format(doc.revenue)} đ
                    </p>
                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Đã thu đủ</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Doctor Detail Modal */}
      {selectedDoctorName && doctorDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setSelectedDoctorName(null)}></div>
          
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 z-10">
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center space-x-5">
                <div className="bg-indigo-600 text-white p-3 rounded-2xl shadow-lg shadow-indigo-100">
                  <UserCheck size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-800">{doctorDetails.name}</h3>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center">
                      <Stethoscope size={14} className="mr-1.5" /> Bác sĩ chuyên khoa
                    </span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase">Hạng {topDoctors.findIndex(d => d.name === selectedDoctorName) + 1} Toàn viện</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedDoctorName(null)}
                className="p-2 hover:bg-white hover:shadow-md rounded-full text-slate-400 hover:text-slate-600 transition-all border border-transparent hover:border-slate-100"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              {/* Doctor Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 group">
                  <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">Tổng doanh thu kỳ này</p>
                  <p className="text-3xl font-black text-blue-900">{new Intl.NumberFormat('vi-VN').format(doctorDetails.totalRevenue)} đ</p>
                  <div className="flex items-center text-[10px] font-bold text-blue-600 mt-3 uppercase">
                    <TrendingUp size={14} className="mr-1" /> Tăng 12% so với kỳ trước
                  </div>
                </div>
                <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100">
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Số lượt chỉ định dịch vụ</p>
                  <p className="text-3xl font-black text-emerald-900">{doctorDetails.totalServices.toLocaleString()}</p>
                  <div className="flex items-center text-[10px] font-bold text-emerald-600 mt-3 uppercase">
                    <BriefcaseMedical size={14} className="mr-1" /> Hoàn thành 100%
                  </div>
                </div>
                <div className="bg-amber-50/50 p-6 rounded-3xl border border-amber-100">
                  <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2">Dịch vụ thế mạnh nhất</p>
                  <p className="text-xl font-black text-amber-900 truncate">{doctorDetails.services[0]?.name || 'Đang cập nhật'}</p>
                  <div className="flex items-center text-[10px] font-bold text-amber-600 mt-3 uppercase">
                    <CheckCircle2 size={14} className="mr-1" /> Chiếm {((doctorDetails.services[0]?.count || 0) / doctorDetails.totalServices * 100).toFixed(0)}% tỷ trọng
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Chart Section */}
                <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col">
                  <div className="flex items-center justify-between mb-8">
                    <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Cơ cấu chỉ định dịch vụ</h4>
                    <span className="text-[10px] font-bold text-slate-400 italic">5 nhóm dịch vụ cao nhất</span>
                  </div>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={doctorDetails.chartData}
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={8}
                          dataKey="value"
                        >
                          {doctorDetails.chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'][index % 5]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-6 space-y-3">
                    {doctorDetails.services.map((svc, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'][i % 5] }} />
                          <span className="text-xs font-bold text-slate-600">{svc.name}</span>
                        </div>
                        <span className="text-xs font-black text-slate-800">{svc.count} lượt</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* List of Recent Activities */}
                <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col">
                  <div className="flex items-center justify-between mb-8">
                    <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Danh sách chỉ định mới nhất</h4>
                    <button className="text-indigo-600 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 px-3 py-1.5 rounded-xl transition-all">Toàn bộ hồ sơ</button>
                  </div>
                  <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    {doctorDetails.recentPrescriptions.map((rec, i) => (
                      <div key={i} className="p-4 bg-slate-50/50 rounded-2xl border border-slate-50 hover:bg-white hover:shadow-md hover:border-indigo-100 transition-all group flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="bg-white p-2 rounded-xl shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            <Calendar size={16} />
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-800">{rec.serviceName}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-100">{rec.icd10}</span>
                              <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-tighter">{new Date(rec.date).toLocaleDateString('vi-VN')}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-black text-slate-900">{new Intl.NumberFormat('vi-VN').format(rec.revenue)} đ</p>
                          <span className={`text-[9px] font-black uppercase tracking-widest ${rec.patientType === 'BHYT' ? 'text-blue-500' : 'text-amber-500'}`}>{rec.patientType}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
              <p className="text-[10px] font-bold text-slate-400 italic">Dữ liệu được trích xuất từ phần mềm HIS - Cập nhật tự động 5 phút/lần</p>
              <div className="flex space-x-3">
                <button className="px-6 py-2.5 bg-white text-slate-700 font-bold text-xs rounded-xl border border-slate-200 hover:bg-slate-50 transition-all">Trích xuất Excel</button>
                <button 
                  onClick={() => setSelectedDoctorName(null)}
                  className="px-8 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all"
                >
                  Đóng chi tiết
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SummaryDashboard;
