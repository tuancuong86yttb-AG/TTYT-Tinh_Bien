
import { DepartmentCode, MedicalTarget, TargetCategory, ActualData } from './types';
import { TARGET_METRICS, DOCTORS } from './constants';

// 1. Chỉ tiêu TOÀN TRUNG TÂM
const TONG_TARGET_VALUES_2026: Record<string, number> = {
  'GIUONG_KH': 160,
  'GIUONG_TK': 175,
  'CS_GIUONG': 95,
  'KHAM_CHUNG': 136961,
  'KHAM_SK': 2657,
  'BN_NGOAI_TRU': 774,
  'BN_NOI_TRU': 13906,
  'TONG_NGAY_DT': 72311,
  'NGAY_DT_TB': 5.2,
  'PHAU_THUAT': 403,
  'THU_THUAT': 40355,
  'SO_CA_SINH': 332,
  'SAN_THUONG': 266,
  'SAN_MO': 66,
  'XET_NGHIEM': 189083, 
  'XN_HUYET_HOC': 55980,
  'XN_HOA_SINH': 123880,
  'XN_MIEN_DICH': 7370,
  'X_QUANG': 45000, 
  'DIEN_TIM': 25000, 
  'SIEU_AM': 30000, 
  'NOI_SOI_TMH': 1834,
  'NOI_SOI_TIEU_HOA': 1200, 
  'DOANH_THU': 54941062444,
  'HAO_PHI_HOA_CHAT': 790861128
};

// 2. Chỉ tiêu KHOA KHÁM BỆNH CHI TIẾT
const KHAM_BENH_TARGET_VALUES_2026: Record<string, number> = {
  'DOANH_THU': 20606498593,
  'KHAM_CHUNG': 99728,
  'KHAM_BHYT': 96678,
  'KHAM_DV': 3049,
  'KHAM_SK': 2657,
  'TAI_KHAM_HEN': 79782,
  'TY_LE_TAI_KHAM': 80,
  'XET_NGHIEM': 85803,
  'X_QUANG': 19890,
  'SIEU_AM': 11059,
  'DIEN_TIM': 8950,
  'NOI_SOI_TIEU_HOA': 416,
  'NOI_SOI_TMH': 1834,
  'THU_THUAT': 4976
};

// 3. Chỉ tiêu KHOA NỘI CHI TIẾT
const NOI_TARGET_VALUES_2026: Record<string, number> = {
  'DOANH_THU': 8480403457,
  'BN_NOI_TRU': 4800,
  'TONG_NGAY_DT': 21900,
  'NGAY_DT_TB': 4.56,
  'GIUONG_KH': 60,
  'CS_GIUONG': 95,
  'KHAM_QUAN_LY': 1772,
  'XET_NGHIEM': 20667,
  'X_QUANG': 3843,
  'SIEU_AM': 3093,
  'DIEN_TIM': 3656,
  'NOI_SOI_TIEU_HOA': 108,
  'THU_THUAT': 5969
};

// 4. Chỉ tiêu KHOA NGOẠI - PT - GMHS CHI TIẾT
const NGOAI_TARGET_VALUES_2026: Record<string, number> = {
  'DOANH_THU': 6236726840,
  'BN_NOI_TRU': 1779,
  'TONG_NGAY_DT': 10152,
  'NGAY_DT_TB': 5.7,
  'GIUONG_KH': 30,
  'CS_GIUONG': 90,
  'KHAM_QUAN_LY': 11210,
  'XET_NGHIEM': 10351,
  'X_QUANG': 4932,
  'SIEU_AM': 2057,
  'DIEN_TIM': 714,
  'THU_THUAT': 1727,
  'PHAU_THUAT': 403
};

// 5. Chỉ tiêu KHOA NHI CHI TIẾT
const NHI_TARGET_VALUES_2026: Record<string, number> = {
  'DOANH_THU': 4367344585,
  'BN_NOI_TRU': 3125,
  'TONG_NGAY_DT': 16500,
  'NGAY_DT_TB': 5.3,
  'GIUONG_KH': 40,
  'CS_GIUONG': 95,
  'KHAM_QUAN_LY': 2000,
  'XET_NGHIEM': 9180,
  'X_QUANG': 1161,
  'SIEU_AM': 747,
  'DIEN_TIM': 13,
  'THU_THUAT': 3592
};

// 6. Chỉ tiêu KHOA CSSKSS VÀ PHỤ SẢN CHI TIẾT
const SAN_TARGET_VALUES_2026: Record<string, number> = {
  'DOANH_THU': 2884987882,
  'BN_NOI_TRU': 799,
  'TONG_NGAY_DT': 5009,
  'NGAY_DT_TB': 6.0,
  'GIUONG_KH': 15,
  'CS_GIUONG': 91,
  'KHAM_QUAN_LY': 5076,
  'XET_NGHIEM': 8359,
  'X_QUANG': 106,
  'SIEU_AM': 2904,
  'DIEN_TIM': 476,
  'THU_THUAT': 379,
  'PHAU_THUAT': 79,
  'SAN_THUONG': 266,
  'SAN_MO': 66,
  'SO_CA_SINH': 332
};

// 7. Chỉ tiêu KHOA TRUYỀN NHIỄM CHI TIẾT
const TRUYEN_NHIEM_TARGET_VALUES_2026: Record<string, number> = {
  'DOANH_THU': 4316995785,
  'BN_NOI_TRU': 1896,
  'TONG_NGAY_DT': 11974,
  'NGAY_DT_TB': 6.31,
  'GIUONG_KH': 25,
  'CS_GIUONG': 95,
  'KHAM_QUAN_LY': 1005,
  'XET_NGHIEM': 11621,
  'X_QUANG': 1735,
  'SIEU_AM': 1760,
  'DIEN_TIM': 1415,
  'THU_THUAT': 1641
};

// 8. Chỉ tiêu KHOA HỒI SỨC CẤP CỨU - HSTC - CĐ CHI TIẾT
const CAP_CUU_TARGET_VALUES_2026: Record<string, number> = {
  'DOANH_THU': 4213870764,
  'BN_NOI_TRU': 3507,
  'TONG_NGAY_DT': 4581,
  'NGAY_DT_TB': 2.0,
  'GIUONG_KH': 15,
  'CS_GIUONG': 85,
  'XET_NGHIEM': 17670,
  'X_QUANG': 3129,
  'SIEU_AM': 423,
  'DIEN_TIM': 3385,
  'THU_THUAT': 5735
};

// 9. Chỉ tiêu KHOA Y HỌC CỔ TRUYỀN VÀ PHỤC HỒI CHỨC NĂNG
const YHCT_TARGET_VALUES_2026: Record<string, number> = {
  'DOANH_THU': 3834234538,
  'KHAM_QUAN_LY': 14170,
  'BN_NGOAI_TRU': 774,
  'XET_NGHIEM': 1024,
  'THU_THUAT': 19426,
  'X_QUANG': 1809,
  'SIEU_AM': 944
};

// 10. Chỉ tiêu KHOA XÉT NGHIỆM - KSNK CHI TIẾT (Đã cập nhật theo hình ảnh mới nhất)
const XET_NGHIEM_DEPT_TARGET_VALUES_2026: Record<string, number> = {
  'DOANH_THU': 6640026000,
  'XET_NGHIEM': 189083,
  'XN_HUYET_HOC': 55980,
  'XN_HOA_SINH': 123880,
  'XN_MIEN_DICH': 7370,
  'HAO_PHI_HOA_CHAT': 790861128
};

// 11. Chỉ tiêu KHOA CHẨN ĐOÁN HÌNH ẢNH CHI TIẾT
const CDHA_DEPT_TARGET_VALUES_2026: Record<string, number> = {
  'DOANH_THU': 5163455040,
  'X_QUANG': 38950,
  'SIEU_AM': 24688,
  'DIEN_TIM': 19559,
  'NOI_SOI_TIEU_HOA': 734
};

const generateMockTargets = (): MedicalTarget[] => {
  const targets: MedicalTarget[] = [];
  
  // Nạp Toàn Trung Tâm
  TARGET_METRICS.forEach(metric => {
    const yearly = TONG_TARGET_VALUES_2026[metric.id] || 0;
    if (yearly > 0) {
      targets.push({
        id: `T-${metric.id}`,
        deptCode: 'TONG',
        category: metric.category,
        name: metric.name,
        unit: metric.unit,
        yearlyPlan: yearly,
        monthlyPlan: Array(12).fill(0).map(() => Math.round(yearly / 12 * (0.95 + Math.random() * 0.1)))
      });
    }
  });

  const departmentConfigs = [
    { code: DepartmentCode.KHAM_BENH, values: KHAM_BENH_TARGET_VALUES_2026, prefix: 'D-KB' },
    { code: DepartmentCode.NOI, values: NOI_TARGET_VALUES_2026, prefix: 'D-NOI' },
    { code: DepartmentCode.NGOAI, values: NGOAI_TARGET_VALUES_2026, prefix: 'D-NGOAI' },
    { code: DepartmentCode.NHI, values: NHI_TARGET_VALUES_2026, prefix: 'D-NHI' },
    { code: DepartmentCode.SAN, values: SAN_TARGET_VALUES_2026, prefix: 'D-SAN' },
    { code: DepartmentCode.TRUYEN_NHIEM, values: TRUYEN_NHIEM_TARGET_VALUES_2026, prefix: 'D-TN' },
    { code: DepartmentCode.CAP_CUU, values: CAP_CUU_TARGET_VALUES_2026, prefix: 'D-CC' },
    { code: DepartmentCode.YHCT_PHCN, values: YHCT_TARGET_VALUES_2026, prefix: 'D-YHCT' },
    { code: DepartmentCode.XET_NGHIEM, values: XET_NGHIEM_DEPT_TARGET_VALUES_2026, prefix: 'D-XN' },
    { code: DepartmentCode.CDHA, values: CDHA_DEPT_TARGET_VALUES_2026, prefix: 'D-CDHA' }
  ];

  departmentConfigs.forEach(config => {
    TARGET_METRICS.forEach(metric => {
      const yearly = config.values[metric.id] || 0;
      if (yearly > 0) {
        targets.push({
          id: `${config.prefix}-${metric.id}`,
          deptCode: config.code,
          category: metric.category,
          name: metric.name,
          unit: metric.unit,
          yearlyPlan: yearly,
          monthlyPlan: Array(12).fill(0).map(() => Math.round(yearly / 12 * (0.8 + Math.random() * 0.4)))
        });
      }
    });
  });

  return targets;
};

const ICD10_CODES = [
  { code: 'M54', name: 'Đau lưng' },
  { code: 'I10', name: 'Tăng huyết áp vô căn' },
  { code: 'A09', name: 'Tiêu chảy và viêm dạ dày ruột' },
  { code: 'Z00', name: 'Khám sức khỏe tổng quát' },
  { code: 'K29', name: 'Viêm dạ dày và tá tràng' }
];

const SERVICES = [
  { id: 'S1', name: 'Khám bệnh', price: 38700 },
  { id: 'X1', name: 'Chụp X-quang số hóa 1 vị trí', price: 65000 },
  { id: 'U1', name: 'Siêu âm ổ bụng tổng quát', price: 49000 },
  { id: 'E1', name: 'Đo điện tim (ECG)', price: 35000 },
  { id: 'N1', name: 'Nội soi dạ dày không đau', price: 650000 }
];

const generateMockActualData = (): ActualData[] => {
  const data: ActualData[] = [];
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  
  for (let i = 0; i < 5000; i++) {
    const randomDate = new Date(startOfYear.getTime() + Math.random() * (now.getTime() - startOfYear.getTime()));
    const deptCodes = Object.values(DepartmentCode);
    const dept = deptCodes[Math.floor(Math.random() * deptCodes.length)];
    const doctorIdx = Math.floor(Math.random() * DOCTORS.length);
    const serviceIdx = Math.floor(Math.random() * SERVICES.length);
    const icdIdx = Math.floor(Math.random() * ICD10_CODES.length);
    
    const pTypes = ['BHYT', 'BHYT', 'BHYT', 'BHYT', 'VIEN_PHI', 'DICH_VU'];
    const pType = pTypes[Math.floor(Math.random() * pTypes.length)] as any;

    const admissionType = Math.random() > 0.3 ? 'NGOAI_TRU' : 'NOI_TRU';
    const isDischarged = Math.random() > 0.2; // 80% đã ra viện
    let dischargeStatus;
    if (isDischarged) {
        // Tỷ lệ: Khỏi 50%, Đỡ 30%, Không thay đổi 5%, Nặng 5%, Chuyển 9%, Tử vong 1%
        const rand = Math.random();
        if (rand < 0.5) dischargeStatus = 'KHOI';
        else if (rand < 0.8) dischargeStatus = 'DO';
        else if (rand < 0.85) dischargeStatus = 'KHONG_THAY_DOI';
        else if (rand < 0.9) dischargeStatus = 'NANG';
        else if (rand < 0.99) dischargeStatus = 'CHUYEN_VIEN';
        else dischargeStatus = 'TU_VONG';
    }

    data.push({
      id: `REC-${i}`,
      date: randomDate.toISOString().split('T')[0],
      deptCode: dept,
      serviceId: SERVICES[serviceIdx].id,
      serviceName: SERVICES[serviceIdx].name,
      doctorId: `DOC-${doctorIdx}`,
      doctorName: DOCTORS[doctorIdx],
      icd10: ICD10_CODES[icdIdx].code,
      revenue: SERVICES[serviceIdx].price,
      patientType: pType,
      admissionType,
      isDischarged,
      dischargeStatus: dischargeStatus as any
    });
  }
  return data;
};

export const MOCK_TARGETS = generateMockTargets();
export const MOCK_ACTUAL = generateMockActualData();
export const MOCK_ICD_METADATA = ICD10_CODES;
