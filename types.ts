
export enum DepartmentCode {
  KHAM_BENH = 'KHAM_BENH',
  NOI = 'NOI',
  NGOAI = 'NGOAI',
  NHI = 'NHI',
  SAN = 'SAN',
  TRUYEN_NHIEM = 'TRUYEN_NHIEM',
  CAP_CUU = 'CAP_CUU',
  YHCT_PHCN = 'YHCT_PHCN',
  XET_NGHIEM = 'XET_NGHIEM',
  CDHA = 'CDHA'
}

export interface Department {
  code: DepartmentCode;
  name: string;
}

export enum TargetCategory {
  CHUYEN_MON = 'CHUYEN_MON',
  DOANH_THU = 'DOANH_THU',
  CHAT_LUONG = 'CHAT_LUONG'
}

export interface MedicalTarget {
  id: string;
  deptCode: DepartmentCode | 'TONG';
  category: TargetCategory;
  name: string;
  unit: string;
  yearlyPlan: number;
  monthlyPlan: number[]; // 12 elements
}

export interface ActualData {
  id: string;
  date: string;
  deptCode: DepartmentCode;
  serviceId: string;
  serviceName: string;
  doctorId: string;
  doctorName: string;
  icd10: string;
  revenue: number;
  patientType: 'BHYT' | 'VIEN_PHI' | 'DICH_VU';
  // Bổ sung trường chuyên môn
  admissionType: 'NOI_TRU' | 'NGOAI_TRU';
  isDischarged: boolean;
  dischargeStatus?: 'KHOI' | 'DO' | 'KHONG_THAY_DOI' | 'NANG' | 'TU_VONG' | 'CHUYEN_VIEN';
}

export interface GlobalFilters {
  startDate: string;
  endDate: string;
  deptCode: DepartmentCode | 'ALL';
  doctor: string;
  patientType: string;
}
