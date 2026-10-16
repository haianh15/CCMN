export type ScreenId =
  // F.1 Khởi động
  | 'START'
  // F.2 Đăng nhập & bảo mật
  | 'LOGIN'
  | 'FIRSTPASS'
  | 'FORGOT'
  | 'RESET'
  // F.3 Điều hướng gốc & tổng quan
  | 'HOME'
  | 'ROOMS'
  | 'TENANTS'
  | 'PAY'
  | 'MORE'
  // F.4 Quản lý phòng & kế hoạch trả
  | 'ROOM_NEW'
  | 'ROOM_DETAIL'
  | 'ROOM_EDIT'
  | 'ROOM_CHECK'
  | 'ROOM_IN'
  | 'ROOM_MISSING'
  | 'ROOM_FIRSTPAY'
  | 'ROOM_TERM'
  | 'ROOM_PLAN'
  | 'ROOM_PLAN_NEW'
  | 'ROOM_PLAN_EDIT'
  | 'ROOM_PLAN_FEED'
  | 'ROOM_RENEW_CHECK'
  // F.5 Hồ sơ khách thuê & người ở cùng
  | 'TENANT_NEW'
  | 'TENANT_DETAIL'
  | 'TENANT_PEOPLE'
  | 'TENANT_PERSON_EDIT'
  | 'TENANT_CHECK'
  | 'TENANT_EDIT'
  | 'TENANT_HISTORY'
  // F.6 Hợp đồng & gia hạn
  | 'CONTRACTS'
  | 'RENTAL_TERMS'
  | 'CONTRACT_NEW'
  | 'CONTRACT_DETAIL'
  | 'CONTRACT_EDIT'
  | 'CONTRACT_SIGN'
  | 'CONTRACT_RENEW'
  | 'CONTRACT_RENEW_SIGN'
  // F.7 Bàn giao, tài sản & sự cố
  | 'ASSET'
  | 'ASSET_INV'
  | 'ASSET_STATUS'
  | 'ASSET_RECEIVE'
  | 'ASSET_INCIDENTS'
  | 'ASSET_INCIDENT_NEW'
  | 'ASSET_INCIDENT_DETAIL'
  // F.8 Trả phòng & biên bản
  | 'RETURN'
  | 'RETURN_DRAFT'
  | 'RETURN_ACTUAL'
  | 'RETURN_PENDING'
  | 'RETURN_COMPARE'
  | 'RETURN_COMPARE_RESULT'
  | 'RETURN_DEPOSIT'
  | 'RETURN_FINAL'
  | 'RETURN_CHECK'
  // F.9 Tính tiền, thông báo & xác nhận thu
  | 'PAY_PERIOD'
  | 'PAY_METER'
  | 'PAY_METER_EDIT'
  | 'PAY_CALC'
  | 'PAY_RECON'
  | 'PAY_NOTICES'
  | 'PAY_NOTICE_NEW'
  | 'PAY_NOTICE_DETAIL'
  | 'PAY_TRACK'
  | 'PAY_CONFIRM'
  | 'PAY_CORRECT'
  // F.10 Công nợ quá hạn
  | 'DEBT'
  | 'DEBT_DETAIL'
  | 'DEBT_REMIND'
  | 'DEBT_REPLY'
  | 'DEBT_BASIS'
  // F.11 Quyết toán cọc
  | 'DEPOSIT'
  | 'DEPOSIT_NEW'
  | 'DEPOSIT_DETAIL'
  | 'DEPOSIT_FINAL'
  // F.12 Báo cáo & đối soát
  | 'REPORTS'
  | 'REPORT_OCC'
  | 'REPORT_MONEY'
  | 'REPORT_CHECK'
  | 'REPORT_SUM'
  // F.13 Cấu hình & tài khoản
  | 'SETTINGS'
  | 'SET_TARIFF'
  | 'SET_TARIFF_HISTORY'
  | 'SET_BANK'
  | 'SET_BANK_HISTORY'
  | 'ACCOUNT'
  // F.14 Thao tác dùng chung
  | 'LOGOUT';

export type RoomStatus = 'TRONG' | 'DANG_THUE' | 'SAP_TRA' | 'CHUA_BAN_GIAO_XONG';

export interface Room {
  id: string; // e.g. "P101"
  roomNumber: string; // "101"
  floor: number;
  area: number; // m2
  basePrice: number; // VNĐ / tháng
  status: RoomStatus;
  currentTenantId?: string;
  currentContractId?: string;
  currentRentalId?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tenant {
  id: string;
  code: string; // "KT001"
  fullName: string;
  phone: string;
  idCardNumber: string; // CCCD masked
  idCardIssuedDate: string;
  idCardIssuedPlace: string;
  permanentAddress: string;
  email: string;
  currentRoomId?: string;
  status: 'DANG_THUE' | 'DA_TRA' | 'TIEM_NANG';
  createdAt: string;
  updatedAt: string;
}

export interface CoResident {
  id: string;
  tenantId: string;
  fullName: string;
  relationship: string;
  phone: string;
  idCardNumber: string;
  arrivalDate: string;
  departureDate?: string;
  residenceStatus: 'DANG_O' | 'DA_CHUYEN_DI';
  proofDocumentNote?: string;
}

export type ContractStatus = 'NHAP' | 'DA_KY' | 'CHO_HIEU_LUC' | 'HIEU_LUC' | 'KET_THUC';

export interface RentalTerms {
  roomId: string;
  tenantId: string;
  durationMonths: number;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  depositAmount: number; // strictly 1 month rent
  firstMonthRent: number; // strictly 1 month rent
  serviceFeePerMonth: number;
  electricityRateType: string;
  waterRateType: string;
  notes?: string;
  agreedAt: string;
}

export interface Contract {
  id: string; // "HD-2026-001"
  code: string;
  roomId: string;
  tenantId: string;
  rentalId: string;
  type: 'LAN_DAU' | 'NOI_TIEP';
  parentContractId?: string;
  depositAmount: number;
  isInheritedDeposit: boolean;
  firstMonthRent: number;
  monthlyRent: number;
  startDate: string;
  endDate: string;
  signedDate?: string;
  paperContractProofUrl?: string;
  status: ContractStatus;
  terms: string;
  createdAt: string;
  updatedAt: string;
}

export interface InitialPayment {
  id: string;
  contractId: string;
  roomId: string;
  tenantId: string;
  amount: number;
  bankTransactionRef: string;
  receivedDate: string;
  confirmedBy: string;
}

export interface AssetInventoryItem {
  id: string;
  roomId: string;
  rentalId: string;
  assetName: string;
  category: 'NOI_THAT' | 'DIEN_MAY' | 'THIET_BI_VE_SINH' | 'KHAC';
  quantity: number;
  initialCondition: string; // Hiện trạng bàn giao lúc nhận
  returnCondition?: string; // Hiện trạng lúc trả
  difference?: string; // Chênh lệch / hỏng hóc nếu có
  isDamagedOrMissing?: boolean;
  compensationAmount?: number;
  note?: string;
}

export interface AssetStatusReport {
  id: string;
  roomId: string;
  rentalId: string;
  recordedDate: string;
  overallDescription: string;
  evidenceImages: string[];
  inspector: string;
  tenantConfirmed: boolean;
}

export interface AssetHandoverProtocol {
  id: string;
  roomId: string;
  rentalId: string;
  contractId: string;
  date: string;
  paperHandoverSigned: boolean;
  keysCardsHandedOver?: boolean;
  paperProofUrl?: string;
  notes?: string;
  status: 'NHAP' | 'DA_KY';
}

export interface AssetIncident {
  id: string;
  code: string; // "SC-2026-001"
  roomId: string;
  rentalId: string;
  assetName: string;
  date: string;
  description: string;
  evidenceImageUrl?: string;
  status: 'CHO_XU_LY' | 'DANG_SUA' | 'HOAN_TAT';
  actionStep: string;
  repairCost?: number;
  paidBy?: 'CHU_NHA' | 'KHACH_THUE' | 'CHUA_XAC_DINH';
  historyNotes: { date: string; content: string; by: string }[];
}

export interface CheckoutPlan {
  id: string;
  roomId: string;
  rentalId: string;
  plannedDate: string;
  confirmedChannel: 'ZALO' | 'DIEN_THOAI' | 'TRUC_TIEP';
  notes?: string;
  status: 'DANG_CHO' | 'DA_HUY_DO_NOI_TIEP' | 'DA_THUC_HIEN';
  history: {
    date: string;
    channel: string;
    content: string;
    recorder: string;
    newExpectedDate?: string;
  }[];
}

export interface CheckoutProtocol {
  id: string;
  roomId: string;
  rentalId: string;
  draftDate: string;
  actualReturnDate?: string;
  actualReturnConfirmed: boolean; // Bước 3.05
  finalElectricNumber?: number;
  finalWaterNumber?: number;
  isPendingResolution: boolean; // Chưa bàn giao xong
  pendingReason?: string;
  paperProtocolSigned: boolean;
  paperProofUrl?: string;
  status: 'NHAP' | 'DANG_KIEM_TRA' | 'CHUA_XONG' | 'CHO_QUYET_TOAN' | 'HOAN_TAT';
  verifiedCheckoutConditions: boolean;
}

export interface TariffConfig {
  id: string;
  versionName: string;
  effectiveFrom: string; // "01/01/2026"
  electricityPricePerKwh: number; // VNĐ
  waterPricePerM3: number; // VNĐ
  fixedServiceFeePerTenancy: number; // VNĐ per distinct tenancy
  garbageFeePerRoom: number;
  wifiFeePerRoom: number;
  isActive: boolean;
  updatedBy: string;
  notes?: string;
}

export interface BankConfig {
  id: string;
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountHolder: string;
  branch: string;
  effectiveFrom: string;
  isActive: boolean;
  updatedBy: string;
}

export interface BillingPeriod {
  id: string; // "KY-2026-10"
  monthYear: string; // "10/2026"
  // Tiền thuê tháng kế tiếp trả trước (11/2026)
  rentForPeriodMonthYear: string; // "11/2026"
  // Tiền dịch vụ tháng vừa dùng (10/2026)
  serviceForPeriodMonthYear: string; // "10/2026"
  status: 'CHUA_CHOT' | 'DA_CHOT_SO' | 'DA_TINH_TIEN' | 'DA_DOI_CHIEU';
}

export interface MeterReading {
  id: string;
  periodId: string;
  roomId: string;
  rentalId: string;
  recordedDate: string;
  electricOld: number;
  electricNew: number;
  waterOld: number;
  waterNew: number;
  electricProofUrl?: string;
  waterProofUrl?: string;
  isFinalPeriodForDeparted?: boolean;
  notes?: string;
  editHistory: {
    timestamp: string;
    oldElectric: number;
    newElectric: number;
    oldWater: number;
    newWater: number;
    reason: string;
  }[];
}

export interface PeriodCalculation {
  id: string;
  periodId: string;
  roomId: string;
  rentalId: string;
  tenantId: string;
  // Tiền thuê tháng kế tiếp (trả trước)
  nextMonthRent: number;
  rentPeriodLabel: string; // "Tiền thuê tháng 11/2026 (trả trước)"
  // Tiền điện tháng vừa dùng
  electricUsage: number;
  electricRate: number;
  electricAmount: number;
  electricPeriodLabel: string; // "Tiền điện dùng tháng 10/2026"
  // Tiền nước tháng vừa dùng
  waterUsage: number;
  waterRate: number;
  waterAmount: number;
  waterPeriodLabel: string; // "Tiền nước dùng tháng 10/2026"
  // Phí dịch vụ cố định
  fixedServiceAmount: number; // Thu đủ cho mỗi lượt thuê
  fixedServiceRate: number;
  wifiAmount: number;
  garbageAmount: number;
  totalServiceAmount: number;
  // Tổng cần thu kỳ này (Không gộp nợ cũ vào QR mới - nợ cũ theo dõi riêng)
  totalDueCurrentPeriod: number;
  // Tham chiếu nợ cũ (chỉ để đối chiếu, không gộp sai vào snapshot QR)
  previousUnpaidBalance: number;
  tariffVersionUsed: string;
  isReconciled: boolean;
  reconciliationNotes?: string;
}

export interface PaymentNotice {
  id: string; // "TB-2026-10-101"
  code: string;
  periodId: string;
  roomId: string;
  tenantId: string;
  calcId: string;
  issuedDate: string;
  dueDate: string; // Hạn nộp
  totalAmount: number; // Tổng chuẩn xác định
  rentAmount: number;
  serviceAmount: number;
  bankSnapshot: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
    transferContent: string;
  };
  qrImageUrl: string;
  status: 'DANG_HIEU_LUC' | 'DA_THAY_THE';
  shareLog: { date: string; channel: string }[];
}

export type PaymentTrackingStatus = 'CHUA_THU' | 'DA_THU' | 'QUA_HAN';

export interface PaymentTransaction {
  id: string;
  noticeId: string;
  periodId: string;
  roomId: string;
  tenantId: string;
  totalDue: number;
  status: PaymentTrackingStatus;
  // Khi đã thu
  receivedAmount?: number;
  receivedDate?: string;
  bankTransactionRef?: string;
  paymentProofUrl?: string;
  confirmedBy?: string;
  confirmedAt?: string;
  // Lịch sử sửa xác nhận thu (UC08.2)
  correctionHistory?: {
    date: string;
    reason: string;
    proofUrl?: string;
    correctedBy: string;
    previousAmount: number;
    newAmount: number;
  }[];
}

export interface OverdueDebt {
  id: string;
  noticeId: string;
  roomId: string;
  tenantId: string;
  periodId: string;
  originalDueDate: string;
  unpaidAmount: number;
  daysOverdue: number;
  reminderHistory: {
    id: string;
    date: string;
    channel: 'DIEN_THOAI' | 'ZALO' | 'TRUC_TIEP';
    content: string;
    conductedBy: string;
  }[];
  tenantReplies: {
    id: string;
    date: string;
    channel: 'DIEN_THOAI' | 'ZALO' | 'TRUC_TIEP';
    replyContent: string;
    promisedPaymentDate?: string;
    notes?: string;
  }[];
}

export interface DepositSettlement {
  id: string; // "QTC-2026-001"
  roomId: string;
  rentalId: string;
  tenantId: string;
  contractId: string;
  originalDeposit: number; // Cọc ban đầu (1 tháng)
  remainingRentalObligation: number; // Tiền nhà còn thiếu nếu có
  finalServiceObligation: number; // Điện nước kỳ cuối
  assetDamageDeduction: number; // Khấu trừ tài sản hỏng có căn cứ
  assetDamageNotes: string;
  otherDeductions: number;
  otherDeductionNotes: string;
  netRefundAmount: number; // Số tiền hoàn trả (originalDeposit - deductions)
  settlementDate: string;
  status: 'NHAP' | 'CHUA_THONG_NHAT' | 'TRANH_CHAP' | 'DA_CHOT_HOAN_TIEN' | 'DA_CHOT_THU_THEM';
  actualSettlementProofUrl?: string;
  actualSettledDate?: string;
  paymentMethod?: 'CHUYEN_KHOAN_HOAN_COC' | 'DOI_TRU' | 'THU_THEM_TIEN';
  amendmentHistory: {
    date: string;
    reason: string;
    adjustedAmount: number;
    by: string;
  }[];
}

export interface SitemapScreenMeta {
  id: ScreenId;
  name: string;
  parent: string;
  uc: string;
  fr: string;
  category: string;
  description: string;
}

export interface CrossLinkMeta {
  id: number;
  from: ScreenId;
  to: ScreenId;
  label: string;
  paramKey?: string;
}
