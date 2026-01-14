
import { DepartmentCode, Department, TargetCategory } from './types';

export const DEPARTMENTS: Department[] = [
  { code: DepartmentCode.KHAM_BENH, name: 'Khoa Khám bệnh' },
  { code: DepartmentCode.NOI, name: 'Khoa Nội' },
  { code: DepartmentCode.NGOAI, name: 'Khoa Ngoại - PT - GMHS' },
  { code: DepartmentCode.NHI, name: 'Khoa Nhi' },
  { code: DepartmentCode.SAN, name: 'Khoa CSSKSS và Phụ sản' },
  { code: DepartmentCode.TRUYEN_NHIEM, name: 'Khoa Truyền nhiễm' },
  { code: DepartmentCode.CAP_CUU, name: 'Khoa Hồi sức cấp cứu - HSTC - CĐ' },
  { code: DepartmentCode.YHCT_PHCN, name: 'Khoa YHCT-PHCN' },
  { code: DepartmentCode.XET_NGHIEM, name: 'Khoa Xét nghiệm - KSNK' },
  { code: DepartmentCode.CDHA, name: 'Khoa Chẩn đoán hình ảnh' },
];

export const DOCTORS = [
  'BS. Nguyễn Văn An', 
  'BS. Lê Thị Bình', 
  'BS. Trần Hữu Cường', 
  'BS. Phạm Thị Dung',
  'BS. Đỗ Minh Đức', 
  'BS. Hoàng Gia Kiên', 
  'BS. Võ Thị Lan', 
  'BS. Ngô Thế Mạnh'
];

export const TARGET_METRICS = [
  // 1-3. Chỉ tiêu Giường bệnh
  { id: 'GIUONG_KH', name: 'Giường kế hoạch', unit: 'Giường', category: TargetCategory.CHUYEN_MON },
  { id: 'GIUONG_TK', name: 'Giường thực kê', unit: 'Giường', category: TargetCategory.CHUYEN_MON },
  { id: 'CS_GIUONG', name: 'Công suất sử dụng giường bệnh', unit: '%', category: TargetCategory.CHUYEN_MON },

  // 4-6. Chỉ tiêu Khám bệnh & Ngoại trú
  { id: 'KHAM_CHUNG', name: 'Tổng số lượt khám bệnh ngoại trú', unit: 'Lượt', category: TargetCategory.CHUYEN_MON },
  { id: 'KHAM_QUAN_LY', name: 'Số lượt khám do khoa quản lý', unit: 'Lượt', category: TargetCategory.CHUYEN_MON },
  { id: 'KHAM_BHYT', name: 'Số lượt khám BHYT', unit: 'Lượt', category: TargetCategory.CHUYEN_MON },
  { id: 'KHAM_DV', name: 'Số lượt khám dịch vụ', unit: 'Lượt', category: TargetCategory.CHUYEN_MON },
  { id: 'KHAM_SK', name: 'Số lượt khám sức khỏe', unit: 'Lượt', category: TargetCategory.CHUYEN_MON },
  { id: 'TAI_KHAM_HEN', name: 'Số lượt tái khám theo hẹn', unit: 'Lượt', category: TargetCategory.CHUYEN_MON },
  { id: 'TY_LE_TAI_KHAM', name: 'Tỷ lệ bệnh nhân quay lại tái khám', unit: '%', category: TargetCategory.CHUYEN_MON },
  { id: 'BN_NGOAI_TRU', name: 'Điều trị ngoại trú', unit: 'Lượt', category: TargetCategory.CHUYEN_MON },

  // 7-9. Chỉ tiêu Nội trú
  { id: 'BN_NOI_TRU', name: 'Điều trị nội trú', unit: 'BN', category: TargetCategory.CHUYEN_MON },
  { id: 'TONG_NGAY_DT', name: 'Tổng số ngày điều trị nội trú', unit: 'Ngày', category: TargetCategory.CHUYEN_MON },
  { id: 'NGAY_DT_TB', name: 'Ngày điều trị trung bình', unit: 'Ngày', category: TargetCategory.CHUYEN_MON },

  // 10-11. Phẫu thuật & Thủ thuật
  { id: 'PHAU_THUAT', name: 'Phẫu thuật từ loại 3 trở lên', unit: 'Ca', category: TargetCategory.CHUYEN_MON },
  { id: 'THU_THUAT', name: 'Số ca thủ thuật', unit: 'Lượt', category: TargetCategory.CHUYEN_MON },

  // 12. Sản khoa
  { id: 'SO_CA_SINH', name: 'Số ca sinh', unit: 'Ca', category: TargetCategory.CHUYEN_MON },
  { id: 'SAN_THUONG', name: 'Sanh thường', unit: 'Ca', category: TargetCategory.CHUYEN_MON },
  { id: 'SAN_MO', name: 'Sanh mổ', unit: 'Ca', category: TargetCategory.CHUYEN_MON },

  // 13-18. Cận lâm sàng & Xét nghiệm chi tiết
  { id: 'XET_NGHIEM', name: 'Xét nghiệm (Tổng cộng)', unit: 'Lượt', category: TargetCategory.CHUYEN_MON },
  { id: 'XN_HUYET_HOC', name: 'Xét nghiệm Huyết học', unit: 'Lượt', category: TargetCategory.CHUYEN_MON },
  { id: 'XN_HOA_SINH', name: 'Xét nghiệm Hóa sinh', unit: 'Lượt', category: TargetCategory.CHUYEN_MON },
  { id: 'XN_MIEN_DICH', name: 'Xét nghiệm Miễn dịch', unit: 'Lượt', category: TargetCategory.CHUYEN_MON },
  { id: 'X_QUANG', name: 'X-quang', unit: 'Lượt', category: TargetCategory.CHUYEN_MON },
  { id: 'SIEU_AM', name: 'Siêu âm', unit: 'Lượt', category: TargetCategory.CHUYEN_MON },
  { id: 'DIEN_TIM', name: 'Điện tim (ECG)', unit: 'Lượt', category: TargetCategory.CHUYEN_MON },
  { id: 'NOI_SOI_TIEU_HOA', name: 'Nội soi tiêu hóa', unit: 'Lượt', category: TargetCategory.CHUYEN_MON },
  { id: 'NOI_SOI_TMH', name: 'Nội soi tai mũi họng', unit: 'Lượt', category: TargetCategory.CHUYEN_MON },

  // 19-20. Doanh thu & Chi phí
  { id: 'DOANH_THU', name: 'Kế hoạch doanh thu', unit: 'đồng', category: TargetCategory.DOANH_THU },
  { id: 'HAO_PHI_HOA_CHAT', name: 'Ước hao phí hóa chất sử dụng', unit: 'đồng', category: TargetCategory.CHAT_LUONG },
];
