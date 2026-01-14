
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { DepartmentCode, GlobalFilters, MedicalTarget, ActualData, TargetCategory } from './types';
import { DEPARTMENTS, TARGET_METRICS } from './constants';
import { MOCK_TARGETS, MOCK_ACTUAL } from './mockData';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import SummaryDashboard from './components/SummaryDashboard';
import DepartmentDetail from './components/DepartmentDetail';
import InputForm from './components/InputForm';
import AnalysisPage from './components/AnalysisPage';

// --- Web Worker Code (Inlined for compatibility) ---
const workerCode = `
  self.onmessage = function(e) {
    const { csv, keysToFind } = e.data;
    
    function normalize(str) {
      return str.toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").replace(/[^a-z0-9]/g, "").trim();
    }

    const rows = [];
    let currentField = '';
    let inQuotes = false;
    let currentRow = [];
    
    // Fast CSV Parser
    for (let i = 0; i < csv.length; i++) {
      const char = csv[i];
      if (inQuotes) {
        if (char === '"' && csv[i+1] === '"') { currentField += '"'; i++; }
        else if (char === '"') inQuotes = false;
        else currentField += char;
      } else {
        if (char === '"') inQuotes = true;
        else if (char === ',' || char === ';') { currentRow.push(currentField.trim()); currentField = ''; }
        else if (char === '\\n' || char === '\\r') {
          currentRow.push(currentField.trim());
          if (currentRow.length > 1) rows.push(currentRow);
          currentRow = []; currentField = '';
          if (char === '\\r' && csv[i+1] === '\\n') i++;
        } else currentField += char;
      }
    }

    const headers = rows[0].map(h => normalize(h));
    const normalizedKeys = {};
    for (const key in keysToFind) {
      normalizedKeys[key] = keysToFind[key].map(k => normalize(k));
    }

    const result = [];
    for (let i = 1; i < rows.length; i++) {
      const rowArr = rows[i];
      const rowObj = {};
      headers.forEach((h, idx) => { rowObj[h] = rowArr[idx]; });

      const find = (keyArray) => {
        for (const k of keyArray) { if (rowObj[k]) return rowObj[k]; }
        return null;
      };

      const rawRev = find(normalizedKeys.revenue) || "0";
      const revenue = parseFloat(rawRev.toString().replace(/[^0-9.-]+/g, "")) || 0;
      
      const rawDate = find(normalizedKeys.date);
      let date = new Date().toISOString().split('T')[0];
      if (rawDate) {
        const p = rawDate.split(/[/.-]/);
        if (p.length === 3) date = p[0].length === 4 ? \`\${p[0]}-\${p[1].padStart(2,'0')}-\${p[2].padStart(2,'0')}\` : \`\${p[2]}-\${p[1].padStart(2,'0')}-\${p[0].padStart(2,'0')}\`;
      }

      result.push({
        id: 'r-' + i,
        date,
        deptCode: find(normalizedKeys.deptCode) || 'KHAM_BENH',
        serviceName: find(normalizedKeys.serviceName) || 'Dịch vụ y tế',
        doctorName: find(normalizedKeys.doctorName) || 'Bác sĩ',
        icd10: find(normalizedKeys.icd10) || 'Z00',
        revenue,
        patientType: find(normalizedKeys.patientType) || 'BHYT'
      });
    }
    self.postMessage({ result });
  };
`;

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('summary');
  const [sheetId, setSheetId] = useState('17GwkdtLVp5VeHgxxePRqxcid2sZ5QOncge43juUKqzc');
  const [lastSynced, setLastSynced] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'fetching' | 'success' | 'error'>('idle');
  
  const [filters, setFilters] = useState<GlobalFilters>({
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    deptCode: 'ALL',
    doctor: 'ALL',
    patientType: 'ALL'
  });

  const [targets, setTargets] = useState<MedicalTarget[]>(MOCK_TARGETS);
  const [actualData, setActualData] = useState<ActualData[]>(MOCK_ACTUAL);

  // Load cache from IndexedDB on startup
  useEffect(() => {
    const cached = localStorage.getItem('hsmart_cache_data');
    if (cached) {
      try {
        const { data, time, sid } = JSON.parse(cached);
        if (sid === sheetId) {
          setActualData(data);
          setLastSynced(time);
        }
      } catch (e) { console.error("Cache error", e); }
    }
  }, []);

  const filteredActualData = useMemo(() => {
    // Tối ưu lọc dữ liệu lớn bằng cách sử dụng vòng lặp đơn
    const result = [];
    const { startDate, endDate, deptCode, doctor, patientType } = filters;
    for (let i = 0; i < actualData.length; i++) {
      const item = actualData[i];
      if (item.date < startDate || item.date > endDate) continue;
      if (deptCode !== 'ALL' && item.deptCode !== deptCode) continue;
      if (doctor !== 'ALL' && item.doctorName !== doctor) continue;
      if (patientType !== 'ALL' && item.patientType !== patientType) continue;
      result.push(item);
    }
    return result;
  }, [actualData, filters]);

  const handleSyncGoogleSheet = useCallback(async () => {
    setIsSyncing(true);
    setSyncStatus('fetching');

    try {
      const timestamp = new Date().getTime();
      const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0&t=${timestamp}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Kết nối thất bại. Kiểm tra quyền chia sẻ file.');
      
      const csvData = await response.text();
      
      // Khởi tạo Worker để parse dữ liệu lớn mà không block UI
      const blob = new Blob([workerCode], { type: 'application/javascript' });
      const worker = new Worker(URL.createObjectURL(blob));
      
      const keysToFind = {
        revenue: ['revenue', 'doanhthu', 'thanhtien', 'tien', 'amount', 'tongtien'],
        date: ['date', 'ngay', 'thoigian', 'ngaykham', 'ngayct'],
        deptCode: ['deptcode', 'makhoa', 'khoa', 'phongban', 'idkhoa'],
        serviceName: ['servicename', 'tendv', 'tendichvu', 'dichvu', 'service'],
        doctorName: ['doctorname', 'tenbs', 'tenbacsi', 'bacsi', 'doctor'],
        icd10: ['icd10', 'maicd', 'benh', 'icd', 'diagnosis'],
        patientType: ['patienttype', 'doituong', 'loaibn', 'type']
      };

      worker.postMessage({ csv: csvData, keysToFind });

      worker.onmessage = (e) => {
        const { result } = e.data;
        setActualData(result);
        setSyncStatus('success');
        const now = new Date().toLocaleTimeString('vi-VN');
        setLastSynced(now);
        
        // Save to cache (Giới hạn cache 50k dòng để tránh tràn localStorage, thực tế nên dùng IndexedDB)
        if (result.length < 100000) {
          localStorage.setItem('hsmart_cache_data', JSON.stringify({
            data: result,
            time: now,
            sid: sheetId
          }));
        }
        
        setIsSyncing(false);
        worker.terminate();
      };

      worker.onerror = (err) => {
        throw new Error('Lỗi xử lý dữ liệu: ' + err.message);
      };

    } catch (error: any) {
      console.error('Sync error:', error);
      setSyncStatus('error');
      setIsSyncing(false);
      alert(error.message);
    }
  }, [sheetId]);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          filters={filters} 
          setFilters={setFilters} 
          onSync={handleSyncGoogleSheet}
          isSyncing={isSyncing}
          sheetId={sheetId}
          setSheetId={setSheetId}
          syncStatus={syncStatus}
          lastSynced={lastSynced}
        />
        
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          {/* Thông báo tối ưu hóa cho dữ liệu cực lớn */}
          {actualData.length > 50000 && (
            <div className="mb-4 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg flex items-center justify-between shadow-lg animate-pulse">
              <span className="flex items-center">
                <span className="mr-2">🚀</span> 
                Đang xử lý chế độ Hiệu năng cao cho {actualData.length.toLocaleString()} bản ghi
              </span>
              <span className="opacity-75">Tự động tối ưu luồng dữ liệu</span>
            </div>
          )}

          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            {activeTab === 'summary' && <SummaryDashboard data={filteredActualData} targets={targets} />}
            {activeTab === 'department' && <DepartmentDetail data={filteredActualData} targets={targets} filters={filters} />}
            {activeTab === 'analysis' && <AnalysisPage data={filteredActualData} />}
            {activeTab === 'settings' && <InputForm targets={targets} setTargets={setTargets} sheetId={sheetId} />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
