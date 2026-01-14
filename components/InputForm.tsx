
import React, { useState } from 'react';
import { Lock, FileCheck, ExternalLink, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { MedicalTarget, DepartmentCode } from '../types';
import { DEPARTMENTS } from '../constants';

interface InputFormProps {
  targets: MedicalTarget[];
  setTargets: (targets: MedicalTarget[]) => void;
  sheetId: string;
}

const InputForm: React.FC<InputFormProps> = ({ targets, sheetId }) => {
  const [editingDept, setEditingDept] = useState<DepartmentCode | 'TONG'>(DepartmentCode.KHAM_BENH);

  const filteredTargets = targets.filter(t => t.deptCode === editingDept);

  const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/edit`;

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-500">
      {/* Banner Trạng thái Khóa */}
      <div className="bg-slate-900 text-white p-4 rounded-xl shadow-lg flex items-center justify-between border border-slate-700">
        <div className="flex items-center space-x-4">
          <div className="bg-amber-500 p-2 rounded-lg animate-pulse">
            <Lock size={20} className="text-slate-900" />
          </div>
          <div>
            <h4 className="font-bold text-sm">TRẠNG THÁI: DỮ LIỆU ĐÃ CHỐT</h4>
            <p className="text-xs text-slate-400">Kế hoạch chỉ tiêu năm 2026 đã được Ban Giám Đốc phê duyệt. Chế độ chỉnh sửa đã bị khóa.</p>
          </div>
        </div>
        <div className="hidden md:flex items-center space-x-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
          <FileCheck size={16} className="text-emerald-400" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Đã Phê Duyệt</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
        {/* Overlay mờ nhẹ để thể hiện trạng thái read-only */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h3 className="text-xl font-bold text-slate-800">Chi tiết Chỉ tiêu Kế hoạch 2026</h3>
            <p className="text-sm text-slate-500">Xem dữ liệu phân bổ chi tiết cho từng đơn vị</p>
          </div>
          <div className="flex space-x-3">
            <a 
              href={sheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors"
            >
              <ExternalLink size={16} />
              <span>Xem File Gốc</span>
            </a>
            <button disabled className="flex items-center space-x-2 px-4 py-2 bg-slate-100 text-slate-400 rounded-lg text-sm font-medium cursor-not-allowed border border-slate-200">
              <Lock size={16} />
              <span>Đã Hoàn Thành</span>
            </button>
          </div>
        </div>

        <div className="mb-6 p-4 bg-blue-50/50 rounded-lg border border-blue-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <FileSpreadsheet size={18} />
            </div>
            <div>
              <p className="text-sm font-bold text-blue-900">ID File Đồng Bộ</p>
              <p className="text-xs text-blue-700 font-mono">{sheetId}</p>
            </div>
          </div>
          <div className="flex items-center text-xs font-bold text-blue-600">
             <AlertCircle size={14} className="mr-1" /> Đồng bộ 1 chiều (Sheet -> Dashboard)
          </div>
        </div>

        <div className="flex border-b border-slate-100 mb-6 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <button 
            onClick={() => setEditingDept('TONG')}
            className={`px-6 py-3 text-sm font-bold transition-colors border-b-2 ${
              editingDept === 'TONG' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Toàn Trung Tâm
          </button>
          {DEPARTMENTS.map(dept => (
            <button 
              key={dept.code}
              onClick={() => setEditingDept(dept.code)}
              className={`px-6 py-3 text-sm font-bold transition-colors border-b-2 ${
                editingDept === dept.code ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {dept.name}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-12 gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-4">
            <div className="col-span-5">Nội dung chỉ tiêu</div>
            <div className="col-span-3 text-right">Kế hoạch phê duyệt</div>
            <div className="col-span-4 text-right">Phân bổ tháng (Ước tính)</div>
          </div>

          {filteredTargets.length > 0 ? (
            filteredTargets.map((target) => (
              <div key={target.id} className="grid grid-cols-12 gap-4 items-center bg-slate-50/50 p-4 rounded-xl border border-slate-100 group hover:bg-white hover:shadow-sm transition-all">
                <div className="col-span-5">
                  <p className="text-sm font-bold text-slate-700 group-hover:text-blue-700 transition-colors">{target.name}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Đơn vị: {target.unit}</p>
                </div>
                <div className="col-span-3 text-right">
                  <div className="inline-block bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm font-black text-slate-800 shadow-inner">
                    {target.yearlyPlan.toLocaleString()}
                  </div>
                </div>
                <div className="col-span-4 text-right flex items-center justify-end space-x-3">
                  <div className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-md">
                    {Math.round(target.yearlyPlan / 12).toLocaleString()} / tháng
                  </div>
                  <Lock size={14} className="text-slate-300" />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
              <p className="text-slate-400 text-sm italic">Không tìm thấy dữ liệu chỉ tiêu cho đơn vị này</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-amber-50 p-5 rounded-xl border border-amber-100 flex items-start space-x-4">
        <div className="bg-amber-500 p-2 rounded-lg text-white shadow-sm">
          <AlertCircle size={20} />
        </div>
        <div>
          <h4 className="font-bold text-amber-900 text-sm">Lưu ý bảo mật số liệu</h4>
          <p className="text-xs text-amber-800 mt-1 leading-relaxed font-medium">
            Số liệu kế hoạch là cơ sở để tính toán hiệu suất (KPI) cho toàn bộ nhân viên y tế trong năm 2026. 
            Mọi yêu cầu điều chỉnh số liệu sau khi đã khóa phải được gửi qua văn bản chính thức cho Ban Giám Đốc phê duyệt lại.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InputForm;
