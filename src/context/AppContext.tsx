import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ScreenId,
  Room,
  Tenant,
  CoResident,
  Contract,
  RentalTerms,
  AssetInventoryItem,
  AssetStatusReport,
  AssetHandoverProtocol,
  AssetIncident,
  CheckoutPlan,
  CheckoutProtocol,
  TariffConfig,
  BankConfig,
  BillingPeriod,
  MeterReading,
  PeriodCalculation,
  PaymentNotice,
  PaymentTransaction,
  OverdueDebt,
  DepositSettlement
} from '../types';
import {
  INITIAL_ROOMS,
  INITIAL_TENANTS,
  INITIAL_CO_RESIDENTS,
  INITIAL_CONTRACTS,
  INITIAL_RENTAL_TERMS,
  INITIAL_ASSET_ITEMS,
  INITIAL_ASSET_REPORTS,
  INITIAL_HANDOVER_PROTOCOLS,
  INITIAL_INCIDENTS,
  INITIAL_CHECKOUT_PLANS,
  INITIAL_CHECKOUT_PROTOCOLS,
  INITIAL_TARIFFS,
  INITIAL_BANK_CONFIGS,
  INITIAL_PERIODS,
  INITIAL_METER_READINGS,
  INITIAL_CALCULATIONS,
  INITIAL_PAYMENT_NOTICES,
  INITIAL_PAYMENT_TRANSACTIONS,
  INITIAL_OVERDUE_DEBTS,
  INITIAL_DEPOSIT_SETTLEMENTS
} from '../data/seedData';

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  user: string;
}

export interface NavigationEntry {
  screenId: ScreenId;
  params?: Record<string, any>;
}

interface PersistedAppData {
  rooms: Room[];
  tenants: Tenant[];
  coResidents: CoResident[];
  contracts: Contract[];
  rentalTerms: Record<string, RentalTerms>;
  assetItems: AssetInventoryItem[];
  assetReports: AssetStatusReport[];
  handoverProtocols: AssetHandoverProtocol[];
  incidents: AssetIncident[];
  checkoutPlans: CheckoutPlan[];
  checkoutProtocols: CheckoutProtocol[];
  tariffs: TariffConfig[];
  bankConfigs: BankConfig[];
  periods: BillingPeriod[];
  meterReadings: MeterReading[];
  calculations: PeriodCalculation[];
  notices: PaymentNotice[];
  transactions: PaymentTransaction[];
  overdueDebts: OverdueDebt[];
  depositSettlements: DepositSettlement[];
  auditLogs: AuditLog[];
}

interface AppContextType {
  // Auth
  isAuthenticated: boolean;
  currentUser: { username: string; fullName: string; role: 'CHU_NHA'; phone: string; email: string } | null;
  isFirstPasswordChangeRequired: boolean;
  failedAttempts: number;
  lockUntil: number | null;
  sessionRemainingMinutes: number;
  login: (username: string, pass: string) => { success: boolean; error?: string };
  changeFirstPassword: (newPass: string, confirmPass: string) => { success: boolean; error?: string };
  forgotPassword: (email: string) => { success: boolean; message: string };
  resetPassword: (newPass: string) => { success: boolean; error?: string };
  changePassword: (oldPass: string, newPass: string) => { success: boolean; error?: string };
  logout: () => void;

  // Navigation
  currentScreenId: ScreenId;
  params: Record<string, any>;
  historyStack: NavigationEntry[];
  activeBottomTab: 'HOME' | 'ROOMS' | 'TENANTS' | 'PAY' | 'MORE';
  navigate: (screenId: ScreenId, params?: Record<string, any>, replace?: boolean) => void;
  goBack: () => void;
  setActiveBottomTab: (tab: 'HOME' | 'ROOMS' | 'TENANTS' | 'PAY' | 'MORE') => void;

  // Entities & Stores
  rooms: Room[];
  tenants: Tenant[];
  coResidents: CoResident[];
  contracts: Contract[];
  rentalTerms: Record<string, RentalTerms>;
  assetItems: AssetInventoryItem[];
  assetReports: AssetStatusReport[];
  handoverProtocols: AssetHandoverProtocol[];
  incidents: AssetIncident[];
  checkoutPlans: CheckoutPlan[];
  checkoutProtocols: CheckoutProtocol[];
  tariffs: TariffConfig[];
  bankConfigs: BankConfig[];
  periods: BillingPeriod[];
  meterReadings: MeterReading[];
  calculations: PeriodCalculation[];
  notices: PaymentNotice[];
  transactions: PaymentTransaction[];
  overdueDebts: OverdueDebt[];
  depositSettlements: DepositSettlement[];
  auditLogs: AuditLog[];

  // Entity Actions (Business operations)
  createRoom: (room: Omit<Room, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => { success: boolean; error?: string; roomId?: string };
  updateRoom: (roomId: string, data: Partial<Room>) => { success: boolean; error?: string };
  saveRentalTerms: (terms: RentalTerms) => void;
  createDraftContract: (terms: RentalTerms) => { success: boolean; contractId: string };
  editDraftContract: (contractId: string, updates: Partial<Contract>) => { success: boolean; error?: string };
  signContract: (contractId: string, signedDate: string, proofUrl: string) => { success: boolean; error?: string };
  renewContract: (parentContractId: string, durationMonths: number, startDate: string, endDate: string) => { success: boolean; contractId: string };
  signRenewContract: (contractId: string, signedDate: string, proofUrl: string) => { success: boolean; error?: string };
  confirmInitialPayment: (roomId: string, amount: number, refCode: string) => { success: boolean; error?: string };
  checkInRoom: (roomId: string) => { success: boolean; error?: string; missing?: string[] };
  
  // Tenant actions
  createTenant: (tenant: Omit<Tenant, 'id' | 'code' | 'createdAt' | 'updatedAt' | 'status'>) => { success: boolean; tenantId: string; error?: string };
  updateTenant: (tenantId: string, data: Partial<Tenant>, reason: string) => { success: boolean; error?: string };
  addCoResident: (resident: Omit<CoResident, 'id'>) => void;
  updateCoResident: (id: string, data: Partial<CoResident>) => void;

  // Asset actions
  saveAssetInventory: (roomId: string, items: AssetInventoryItem[]) => void;
  saveAssetStatusReport: (report: Omit<AssetStatusReport, 'id'>) => void;
  signHandoverProtocol: (roomId: string, contractId: string, proofUrl: string) => void;
  createIncident: (incident: Omit<AssetIncident, 'id' | 'code'>) => { success: boolean; incidentId: string };
  updateIncident: (incidentId: string, step: string, status: AssetIncident['status'], note: string) => void;

  // Checkout actions
  createCheckoutPlan: (roomId: string, plannedDate: string, channel: 'ZALO' | 'DIEN_THOAI' | 'TRUC_TIEP', notes: string) => void;
  editCheckoutPlan: (roomId: string, newDate: string, channel: string, reason: string) => void;
  addCheckoutPlanFeedback: (roomId: string, channel: string, content: string, newDate?: string) => void;
  createCheckoutDraft: (roomId: string) => { success: boolean; protocolId: string };
  confirmActualReturn305: (roomId: string, finalElectric: number, finalWater: number) => { success: boolean; error?: string };
  markReturnPending: (roomId: string, reason: string) => void;
  saveAssetComparison: (roomId: string, itemsWithDifferences: { id: string; difference: string; compAmount: number; isDamaged: boolean }[]) => void;
  signCheckoutFinalProtocol: (roomId: string, proofUrl: string) => { success: boolean; error?: string };
  verifyReturnAndFreeRoom: (roomId: string) => { success: boolean; error?: string; unmetReasons?: string[] };

  // Billing actions
  recordMeterReading: (periodId: string, roomId: string, elNew: number, waNew: number, elProof?: string, waProof?: string) => { success: boolean; error?: string };
  editMeterReading: (readingId: string, elNew: number, waNew: number, reason: string) => { success: boolean; error?: string };
  calculatePeriodForRoom: (periodId: string, roomId: string) => { success: boolean; calcId?: string };
  reconcilePeriodCalculation: (calcId: string, notes: string) => void;
  issuePaymentNoticeQR: (calcId: string, dueDate: string) => { success: boolean; noticeId: string };
  confirmPaymentReceived: (noticeId: string, amount: number, refCode: string, proofUrl?: string) => { success: boolean; error?: string };
  correctPaymentReceipt: (transactionId: string, newAmount: number, reason: string, proofUrl?: string) => { success: boolean; error?: string };

  // Debt actions
  recordDebtReminder: (debtId: string, channel: 'DIEN_THOAI' | 'ZALO' | 'TRUC_TIEP', content: string) => void;
  recordTenantReply: (debtId: string, channel: 'DIEN_THOAI' | 'ZALO' | 'TRUC_TIEP', reply: string, promisedDate?: string) => void;

  // Deposit actions
  createDepositSettlement: (settlement: Omit<DepositSettlement, 'id'>) => { success: boolean; settlementId: string };
  updateDepositSettlement: (settlementId: string, data: Partial<DepositSettlement>, reason: string) => void;
  finalizeDepositSettlement: (settlementId: string, proofUrl: string, method: DepositSettlement['paymentMethod']) => { success: boolean };

  // Config actions
  saveTariffConfig: (newTariff: Omit<TariffConfig, 'id' | 'isActive'>) => void;
  saveBankConfig: (newBank: Omit<BankConfig, 'id' | 'isActive'>) => void;

  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'MINI_APARTMENT_STORE_V1';
const SIGNED_OUT_SESSION_KEY = 'MINI_APARTMENT_SIGNED_OUT';

const readSignedOutSession = () => {
  try {
    return sessionStorage.getItem(SIGNED_OUT_SESSION_KEY) === 'true';
  } catch (error) {
    console.error('Không thể đọc trạng thái đăng nhập trong phiên trình duyệt.', error);
    return false;
  }
};

const saveSignedOutSession = (signedOut: boolean) => {
  try {
    if (signedOut) {
      sessionStorage.setItem(SIGNED_OUT_SESSION_KEY, 'true');
    } else {
      sessionStorage.removeItem(SIGNED_OUT_SESSION_KEY);
    }
    return true;
  } catch (error) {
    console.error('Không thể lưu trạng thái đăng nhập trong phiên trình duyệt.', error);
    return false;
  }
};

const readPersistedAppData = (): Partial<PersistedAppData> => {
  try {
    const rawData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!rawData) return {};

    const parsed: unknown = JSON.parse(rawData);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      throw new Error('Dữ liệu lưu cục bộ không đúng định dạng.');
    }
    return parsed as Partial<PersistedAppData>;
  } catch (error) {
    console.error('Không thể đọc dữ liệu đã lưu trong trình duyệt.', error);
    return {};
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [persistedData] = useState(readPersistedAppData);
  const [initiallySignedOut] = useState(readSignedOutSession);

  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!initiallySignedOut);
  const [currentUser, setCurrentUser] = useState<{
    username: string;
    fullName: string;
    role: 'CHU_NHA';
    phone: string;
    email: string;
  } | null>(initiallySignedOut ? null : {
    username: 'admin',
    fullName: 'Nguyễn Văn Minh (Chủ nhà)',
    role: 'CHU_NHA',
    phone: '0912 345 678',
    email: 'minh.nguyen.landlord@gmail.com'
  });
  const [isFirstPasswordChangeRequired, setIsFirstPasswordChangeRequired] = useState<boolean>(false);
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [lockUntil, setLockUntil] = useState<number | null>(null);
  const [sessionRemainingMinutes] = useState<number>(30);

  // Navigation state
  const [currentScreenId, setCurrentScreenId] = useState<ScreenId>(initiallySignedOut ? 'LOGIN' : 'HOME');
  const [params, setParams] = useState<Record<string, any>>({});
  const [historyStack, setHistoryStack] = useState<NavigationEntry[]>([{ screenId: 'HOME' }]);
  const [activeBottomTab, setActiveBottomTab] = useState<'HOME' | 'ROOMS' | 'TENANTS' | 'PAY' | 'MORE'>('HOME');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Entities state
  const [rooms, setRooms] = useState<Room[]>(persistedData.rooms || INITIAL_ROOMS);
  const [tenants, setTenants] = useState<Tenant[]>(persistedData.tenants || INITIAL_TENANTS);
  const [coResidents, setCoResidents] = useState<CoResident[]>(persistedData.coResidents || INITIAL_CO_RESIDENTS);
  const [contracts, setContracts] = useState<Contract[]>(persistedData.contracts || INITIAL_CONTRACTS);
  const [rentalTerms, setRentalTerms] = useState<Record<string, RentalTerms>>(persistedData.rentalTerms || INITIAL_RENTAL_TERMS);
  const [assetItems, setAssetItems] = useState<AssetInventoryItem[]>(persistedData.assetItems || INITIAL_ASSET_ITEMS);
  const [assetReports, setAssetReports] = useState<AssetStatusReport[]>(persistedData.assetReports || INITIAL_ASSET_REPORTS);
  const [handoverProtocols, setHandoverProtocols] = useState<AssetHandoverProtocol[]>(persistedData.handoverProtocols || INITIAL_HANDOVER_PROTOCOLS);
  const [incidents, setIncidents] = useState<AssetIncident[]>(persistedData.incidents || INITIAL_INCIDENTS);
  const [checkoutPlans, setCheckoutPlans] = useState<CheckoutPlan[]>(persistedData.checkoutPlans || INITIAL_CHECKOUT_PLANS);
  const [checkoutProtocols, setCheckoutProtocols] = useState<CheckoutProtocol[]>(persistedData.checkoutProtocols || INITIAL_CHECKOUT_PROTOCOLS);
  const [tariffs, setTariffs] = useState<TariffConfig[]>(persistedData.tariffs || INITIAL_TARIFFS);
  const [bankConfigs, setBankConfigs] = useState<BankConfig[]>(persistedData.bankConfigs || INITIAL_BANK_CONFIGS);
  const [periods, setPeriods] = useState<BillingPeriod[]>(persistedData.periods || INITIAL_PERIODS);
  const [meterReadings, setMeterReadings] = useState<MeterReading[]>(persistedData.meterReadings || INITIAL_METER_READINGS);
  const [calculations, setCalculations] = useState<PeriodCalculation[]>(persistedData.calculations || INITIAL_CALCULATIONS);
  const [notices, setNotices] = useState<PaymentNotice[]>(persistedData.notices || INITIAL_PAYMENT_NOTICES);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(persistedData.transactions || INITIAL_PAYMENT_TRANSACTIONS);
  const [overdueDebts, setOverdueDebts] = useState<OverdueDebt[]>(persistedData.overdueDebts || INITIAL_OVERDUE_DEBTS);
  const [depositSettlements, setDepositSettlements] = useState<DepositSettlement[]>(persistedData.depositSettlements || INITIAL_DEPOSIT_SETTLEMENTS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(persistedData.auditLogs || [
    {
      id: 'LOG-001',
      timestamp: '15/10/2026 08:30:00',
      action: 'HE_THONG_KHOI_DONG',
      entityType: 'SYSTEM',
      entityId: 'SYS',
      details: 'Khởi động hệ thống quản lý chung cư mini với 12 phòng và 15 hồ sơ khách thuê',
      user: 'Nguyễn Văn Minh'
    }
  ]);

  useEffect(() => {
    const data: PersistedAppData = {
      rooms,
      tenants,
      coResidents,
      contracts,
      rentalTerms,
      assetItems,
      assetReports,
      handoverProtocols,
      incidents,
      checkoutPlans,
      checkoutProtocols,
      tariffs,
      bankConfigs,
      periods,
      meterReadings,
      calculations,
      notices,
      transactions,
      overdueDebts,
      depositSettlements,
      auditLogs
    };

    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Không thể lưu dữ liệu vào trình duyệt.', error);
      showToast('Không thể lưu dữ liệu. Vui lòng kiểm tra dung lượng trình duyệt.');
    }
  }, [
    rooms,
    tenants,
    coResidents,
    contracts,
    rentalTerms,
    assetItems,
    assetReports,
    handoverProtocols,
    incidents,
    checkoutPlans,
    checkoutProtocols,
    tariffs,
    bankConfigs,
    periods,
    meterReadings,
    calculations,
    notices,
    transactions,
    overdueDebts,
    depositSettlements,
    auditLogs
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const addAuditLog = (action: string, entityType: string, entityId: string, details: string) => {
    const newLog: AuditLog = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toLocaleString('vi-VN'),
      action,
      entityType,
      entityId,
      details,
      user: currentUser?.fullName || 'Chủ nhà'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Navigation handlers
  const navigate = (screenId: ScreenId, newParams?: Record<string, any>, replace?: boolean) => {
    if (screenId === 'LOGOUT') {
      logout();
      return;
    }
    // Update bottom tab if main tab
    if (['HOME', 'ROOMS', 'TENANTS', 'PAY', 'MORE'].includes(screenId)) {
      setActiveBottomTab(screenId as any);
    }
    setParams(newParams || {});
    setCurrentScreenId(screenId);

    if (replace) {
      setHistoryStack(prev => [...prev.slice(0, prev.length - 1), { screenId, params: newParams }]);
    } else {
      setHistoryStack(prev => [...prev, { screenId, params: newParams }]);
    }
    document.querySelector('.app-viewport')?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    if (historyStack.length > 1) {
      const nextStack = [...historyStack];
      nextStack.pop(); // remove current
      const prevEntry = nextStack[nextStack.length - 1];
      setHistoryStack(nextStack);
      setCurrentScreenId(prevEntry.screenId);
      setParams(prevEntry.params || {});
      if (['HOME', 'ROOMS', 'TENANTS', 'PAY', 'MORE'].includes(prevEntry.screenId)) {
        setActiveBottomTab(prevEntry.screenId as any);
      }
      document.querySelector('.app-viewport')?.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Default to home
      setCurrentScreenId('HOME');
      setActiveBottomTab('HOME');
    }
  };

  // Auth actions
  const login = (user: string, pass: string) => {
    if (lockUntil && Date.now() < lockUntil) {
      const remainingSecs = Math.ceil((lockUntil - Date.now()) / 1000);
      return { success: false, error: `Tài khoản đang bị tạm khóa do nhập sai 5 lần. Vui lòng thử lại sau ${remainingSecs} giây.` };
    }

    if (user.trim() === 'admin' && pass === 'Admin@12345678') {
      setFailedAttempts(0);
      saveSignedOutSession(false);
      setIsAuthenticated(true);
      setCurrentUser({
        username: 'admin',
        fullName: 'Nguyễn Văn Minh (Chủ nhà)',
        role: 'CHU_NHA',
        phone: '0912 345 678',
        email: 'minh.nguyen.landlord@gmail.com'
      });
      addAuditLog('DANG_NHAP_THANH_CONG', 'AUTH', 'admin', 'Đăng nhập thành công vào hệ thống quản lý');
      navigate('HOME');
      return { success: true };
    } else if (user.trim() === 'firstuser' && pass === '123456') {
      // First-time user test
      setFailedAttempts(0);
      saveSignedOutSession(false);
      setIsAuthenticated(false);
      setIsFirstPasswordChangeRequired(true);
      navigate('FIRSTPASS');
      return { success: true };
    } else {
      const newFails = failedAttempts + 1;
      setFailedAttempts(newFails);
      if (newFails >= 5) {
        const lockDuration = 15 * 60 * 1000; // 15 mins
        setLockUntil(Date.now() + lockDuration);
        return { success: false, error: 'Đã nhập sai quá 5 lần liên tiếp. Tài khoản tạm khóa 15 phút để bảo đảm an toàn.' };
      }
      return { success: false, error: `Sai tên đăng nhập hoặc mật khẩu. Còn ${5 - newFails} lần thử trước khi tạm khóa.` };
    }
  };

  const changeFirstPassword = (newPass: string, confirmPass: string) => {
    if (newPass.length < 12) {
      return { success: false, error: 'Mật khẩu mới phải có tối thiểu 12 ký tự theo quy định bảo mật bắt buộc.' };
    }
    if (newPass !== confirmPass) {
      return { success: false, error: 'Mật khẩu xác nhận không khớp.' };
    }
    setIsFirstPasswordChangeRequired(false);
    saveSignedOutSession(false);
    setIsAuthenticated(true);
    setCurrentUser({
      username: 'firstuser',
      fullName: 'Chủ nhà mới',
      role: 'CHU_NHA',
      phone: '0901 234 567',
      email: 'landlord@example.com'
    });
    addAuditLog('DOI_MAT_KHAU_LAN_DAU', 'AUTH', 'firstuser', 'Đã đổi mật khẩu lần đầu an toàn');
    showToast('Đổi mật khẩu lần đầu thành công! Chào mừng bạn vào giao diện quản trị.');
    navigate('HOME');
    return { success: true };
  };

  const forgotPassword = (email: string) => {
    if (!email || !email.includes('@')) {
      return { success: false, message: 'Vui lòng nhập định dạng email hợp lệ.' };
    }
    addAuditLog('YEU_CAU_QUEN_MAT_KHAU', 'AUTH', email, 'Yêu cầu gửi liên kết đặt lại mật khẩu');
    return {
      success: true,
      message: 'Nếu email tồn tại trong hệ thống Chủ nhà, liên kết đặt lại mật khẩu đã được tạo mô phỏng.'
    };
  };

  const resetPassword = (newPass: string) => {
    if (newPass.length < 12) {
      return { success: false, error: 'Mật khẩu mới phải có ít nhất 12 ký tự.' };
    }
    addAuditLog('DAT_LAI_MAT_KHAU', 'AUTH', 'admin', 'Đặt lại mật khẩu thành công qua liên kết an toàn');
    showToast('Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại.');
    navigate('LOGIN');
    return { success: true };
  };

  const changePassword = (oldPass: string, newPass: string) => {
    if (oldPass !== 'Admin@12345678') {
      return { success: false, error: 'Mật khẩu hiện tại không chính xác.' };
    }
    if (newPass.length < 12) {
      return { success: false, error: 'Mật khẩu mới phải có ít nhất 12 ký tự.' };
    }
    if (newPass === oldPass) {
      return { success: false, error: 'Mật khẩu mới không được trùng với mật khẩu cũ.' };
    }
    addAuditLog('DOI_MAT_KHAU_DINH_KY', 'AUTH', currentUser?.username || 'admin', 'Đã đổi mật khẩu và thu hồi phiên cũ');
    showToast('Đã đổi mật khẩu thành công. Hệ thống đã thu hồi phiên làm việc, vui lòng đăng nhập lại.');
    logout();
    return { success: true };
  };

  const logout = () => {
    const sessionSaved = saveSignedOutSession(true);
    setIsAuthenticated(false);
    setCurrentUser(null);
    addAuditLog('DANG_XUAT', 'AUTH', 'user', 'Đã đăng xuất và xóa phiên');
    navigate('LOGIN', {}, true);
    showToast(sessionSaved
      ? 'Đã đăng xuất thành công.'
      : 'Đã đăng xuất trong trang hiện tại, nhưng trình duyệt không lưu được trạng thái phiên.');
  };

  // Room methods
  const createRoom = (data: Omit<Room, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    const existing = rooms.find(r => r.roomNumber === data.roomNumber);
    if (existing) {
      return { success: false, error: `Mã phòng ${data.roomNumber} đã tồn tại trong tòa nhà.` };
    }
    const newRoomId = `P${data.roomNumber}`;
    const newRoom: Room = {
      ...data,
      id: newRoomId,
      status: 'TRONG', // Trạng thái ban đầu luôn là TRỐNG
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setRooms(prev => [...prev, newRoom]);
    addAuditLog('THEM_PHONG_MOI', 'ROOM', newRoomId, `Tạo mới phòng ${data.roomNumber}, tầng ${data.floor}, giá ${data.basePrice.toLocaleString()} đ`);
    showToast(`Đã thêm mới phòng ${data.roomNumber} thành công!`);
    return { success: true, roomId: newRoomId };
  };

  const updateRoom = (roomId: string, data: Partial<Room>) => {
    // Không cho phép tự sửa trạng thái phòng bằng tay
    const { status, ...allowedUpdates } = data;
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, ...allowedUpdates, updatedAt: new Date().toISOString().split('T')[0] } : r));
    addAuditLog('CAP_NHAT_PHONG', 'ROOM', roomId, 'Cập nhật thông tin phòng');
    showToast('Đã cập nhật thông tin phòng thành công.');
    return { success: true };
  };

  const saveRentalTerms = (terms: RentalTerms) => {
    setRentalTerms(prev => ({ ...prev, [terms.roomId]: terms }));
    addAuditLog('THOA_THUAN_DIEU_KIEN_THUE', 'RENTAL_TERMS', terms.roomId, `Thống nhất điều kiện thuê cho phòng ${terms.roomId}`);
    showToast('Đã lưu thỏa thuận điều kiện thuê.');
  };

  const createDraftContract = (terms: RentalTerms) => {
    const newContractId = `HD-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newContract: Contract = {
      id: newContractId,
      code: newContractId,
      roomId: terms.roomId,
      tenantId: terms.tenantId,
      rentalId: `LT-${terms.roomId}-${Date.now().toString().slice(-4)}`,
      type: 'LAN_DAU',
      depositAmount: terms.depositAmount, // 1 month
      isInheritedDeposit: false,
      firstMonthRent: terms.firstMonthRent,
      monthlyRent: terms.monthlyRent,
      startDate: terms.startDate,
      endDate: terms.endDate,
      status: 'NHAP',
      terms: `Hợp đồng thuê phòng ${terms.roomId} thời hạn ${terms.durationMonths} tháng. Tiền cọc 1 tháng (${terms.depositAmount.toLocaleString()}đ), tiền thuê tháng đầu (${terms.firstMonthRent.toLocaleString()}đ).`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setContracts(prev => [newContract, ...prev]);
    addAuditLog('TAO_HOP_DONG_NHAP', 'CONTRACT', newContractId, `Tạo hợp đồng nháp lần đầu cho phòng ${terms.roomId}`);
    showToast('Đã tạo dự thảo hợp đồng lần đầu thành công!');
    return { success: true, contractId: newContractId };
  };

  const editDraftContract = (contractId: string, updates: Partial<Contract>) => {
    const contract = contracts.find(c => c.id === contractId);
    if (!contract || contract.status !== 'NHAP') {
      return { success: false, error: 'Chỉ hợp đồng ở trạng thái Nháp mới được phép chỉnh sửa điều khoản.' };
    }
    setContracts(prev => prev.map(c => c.id === contractId ? { ...c, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : c));
    addAuditLog('SUA_HOP_DONG_NHAP', 'CONTRACT', contractId, 'Chỉnh sửa nội dung dự thảo hợp đồng');
    showToast('Đã lưu nội dung sửa đổi hợp đồng nháp.');
    return { success: true };
  };

  const signContract = (contractId: string, signedDate: string, proofUrl: string) => {
    setContracts(prev => prev.map(c => c.id === contractId ? {
      ...c,
      status: 'DA_KY',
      signedDate,
      paperContractProofUrl: proofUrl || 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=400&q=80',
      updatedAt: new Date().toISOString().split('T')[0]
    } : c));
    addAuditLog('GHI_NHAN_HOP_DONG_DA_KY', 'CONTRACT', contractId, `Ghi nhận hợp đồng giấy đã ký ngày ${signedDate}`);
    showToast('Đã ghi nhận hợp đồng giấy đã ký thành công!');
    return { success: true };
  };

  const renewContract = (parentContractId: string, durationMonths: number, startDate: string, endDate: string) => {
    const parent = contracts.find(c => c.id === parentContractId);
    if (!parent) return { success: false, contractId: '' };

    const newContractId = `${parent.code}-NT`;
    const newContract: Contract = {
      id: newContractId,
      code: newContractId,
      roomId: parent.roomId,
      tenantId: parent.tenantId,
      rentalId: `LT-${parent.roomId}-NT-${Date.now().toString().slice(-3)}`,
      type: 'NOI_TIEP',
      parentContractId,
      depositAmount: parent.depositAmount, // KẾ THỪA CỌC CŨ
      isInheritedDeposit: true, // Chỉ đọc, không tạo cọc mới
      firstMonthRent: parent.monthlyRent,
      monthlyRent: parent.monthlyRent,
      startDate,
      endDate,
      status: 'NHAP',
      terms: `Hợp đồng thuê nối tiếp thời hạn ${durationMonths} tháng. Kế thừa nguyên vẹn khoản tiền cọc ${parent.depositAmount.toLocaleString()} VNĐ từ hợp đồng trước.`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setContracts(prev => [newContract, ...prev]);
    addAuditLog('LAP_HOP_DONG_NOI_TIEP', 'CONTRACT', newContractId, `Lập hợp đồng nối tiếp kế thừa cọc gốc cho phòng ${parent.roomId}`);
    showToast('Đã lập dự thảo hợp đồng nối tiếp (kế thừa cọc gốc).');
    return { success: true, contractId: newContractId };
  };

  const signRenewContract = (contractId: string, signedDate: string, proofUrl: string) => {
    const contract = contracts.find(c => c.id === contractId);
    if (!contract) return { success: false, error: 'Hợp đồng không tồn tại.' };

    setContracts(prev => prev.map(c => c.id === contractId ? {
      ...c,
      status: 'HIEU_LUC',
      signedDate,
      paperContractProofUrl: proofUrl || 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=400&q=80',
      updatedAt: new Date().toISOString().split('T')[0]
    } : c));

    // Nghiệp vụ: Tự động hủy kế hoạch trả phòng cũ theo sự kiện Hợp đồng nối tiếp có hiệu lực
    setCheckoutPlans(prev => prev.map(p => p.roomId === contract.roomId && p.status === 'DANG_CHO' ? {
      ...p,
      status: 'DA_HUY_DO_NOI_TIEP',
      history: [
        ...p.history,
        {
          date: new Date().toLocaleString('vi-VN'),
          channel: 'Hệ thống',
          content: `Tự động hủy kế hoạch trả cũ do Hợp đồng nối tiếp ${contract.code} đã ký và có hiệu lực`,
          recorder: 'Hệ thống'
        }
      ]
    } : p));

    addAuditLog('KY_HOP_DONG_NOI_TIEP', 'CONTRACT', contractId, `Ký nối tiếp thành công, tự động hủy kế hoạch trả cũ phòng ${contract.roomId}`);
    showToast('Đã ký nối tiếp! Kế hoạch trả cũ đã tự động hủy và phòng tiếp tục Đang thuê.');
    return { success: true };
  };

  const confirmInitialPayment = (roomId: string, amount: number, refCode: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return { success: false, error: 'Phòng không tồn tại.' };

    const expectedTotal = room.basePrice * 2; // 1 month deposit + 1 month first rent
    if (amount !== expectedTotal) {
      return {
        success: false,
        error: `Số tiền thanh toán ban đầu phải ĐỦ ĐÚNG 1 tháng cọc (${room.basePrice.toLocaleString()} đ) + 1 tháng thuê đầu (${room.basePrice.toLocaleString()} đ) = ${expectedTotal.toLocaleString()} đ. Không cho phép thanh toán thiếu.`
      };
    }

    addAuditLog('XAC_NHAN_THANH_TOAN_BAN_DAU', 'PAYMENT', roomId, `Đã đối chiếu chuyển khoản đủ ${amount.toLocaleString()} đ, mã GD ${refCode}`);
    showToast('Đã xác nhận thanh toán ban đầu (1 tháng cọc + 1 tháng thuê đầu) thành công!');
    return { success: true };
  };

  const checkInRoom = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return { success: false, error: 'Phòng không tồn tại.' };

    const contract = contracts.find(c => c.roomId === roomId && (c.status === 'DA_KY' || c.status === 'HIEU_LUC'));
    const handover = handoverProtocols.find(h => h.roomId === roomId && h.paperHandoverSigned);

    const missing: string[] = [];
    if (!contract) missing.push('Chưa có hợp đồng giấy đã ký hai bên');
    if (!handover) missing.push('Chưa ký biên bản bàn giao và kiểm kê tài sản thực tế');

    if (missing.length > 0) {
      return { success: false, missing, error: 'Chưa đủ điều kiện nghiệp vụ để tiếp nhận phòng.' };
    }

    // Đủ điều kiện: Chuyển phòng thành ĐANG THUÊ
    setRooms(prev => prev.map(r => r.id === roomId ? {
      ...r,
      status: 'DANG_THUE',
      currentTenantId: contract?.tenantId,
      currentContractId: contract?.id,
      currentRentalId: contract?.rentalId,
      updatedAt: new Date().toISOString().split('T')[0]
    } : r));

    if (contract) {
      setContracts(prev => prev.map(c => c.id === contract.id ? { ...c, status: 'HIEU_LUC' } : c));
    }

    addAuditLog('TIEP_NHAN_PHONG_THANH_CONG', 'ROOM', roomId, `Hoàn tất tiếp nhận phòng ${room.roomNumber}, trạng thái cập nhật Đang thuê`);
    showToast(`Tiếp nhận phòng ${room.roomNumber} thành công! Phòng đã chuyển sang trạng thái Đang thuê.`);
    return { success: true };
  };

  // Tenant methods
  const createTenant = (data: Omit<Tenant, 'id' | 'code' | 'createdAt' | 'updatedAt' | 'status'>) => {
    const existing = tenants.find(t => t.phone === data.phone);
    if (existing) {
      return { success: false, tenantId: '', error: `Số điện thoại ${data.phone} đã tồn tại trong danh sách hồ sơ (${existing.fullName}).` };
    }
    const count = tenants.length + 1;
    const code = `KT${count.toString().padStart(3, '0')}`;
    const newTenant: Tenant = {
      ...data,
      id: code,
      code,
      status: 'TIEM_NANG',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setTenants(prev => [newTenant, ...prev]);
    addAuditLog('TAO_HO_SO_KHACH_THUE', 'TENANT', code, `Tạo hồ sơ khách thuê ${data.fullName}`);
    showToast(`Đã tạo hồ sơ khách ${data.fullName} thành công!`);
    return { success: true, tenantId: code };
  };

  const updateTenant = (tenantId: string, data: Partial<Tenant>, reason: string) => {
    setTenants(prev => prev.map(t => t.id === tenantId ? { ...t, ...data, updatedAt: new Date().toISOString().split('T')[0] } : t));
    addAuditLog('CAP_NHAT_HO_SO_KHACH', 'TENANT', tenantId, `Cập nhật hồ sơ: ${reason}`);
    showToast('Đã lưu cập nhật hồ sơ khách thuê.');
    return { success: true };
  };

  const addCoResident = (resident: Omit<CoResident, 'id'>) => {
    const newResident: CoResident = {
      ...resident,
      id: `CR-${Date.now().toString().slice(-4)}`
    };
    setCoResidents(prev => [...prev, newResident]);
    addAuditLog('THEM_NGUOI_O_CUNG', 'CO_RESIDENT', newResident.id, `Thêm người ở cùng ${resident.fullName}`);
    showToast(`Đã thêm người ở cùng ${resident.fullName}`);
  };

  const updateCoResident = (id: string, data: Partial<CoResident>) => {
    setCoResidents(prev => prev.map(r => r.id === id ? { ...r, ...data } : r));
    addAuditLog('SUA_NGUOI_O_CUNG', 'CO_RESIDENT', id, 'Cập nhật thông tin người ở cùng');
    showToast('Đã cập nhật thông tin người ở cùng.');
  };

  // Asset methods
  const saveAssetInventory = (roomId: string, items: AssetInventoryItem[]) => {
    setAssetItems(prev => [...prev.filter(item => item.roomId !== roomId), ...items]);
    addAuditLog('LUU_KIEM_KE_TAI_SAN', 'ASSET', roomId, `Lưu danh mục kiểm kê ${items.length} tài sản phòng ${roomId}`);
    showToast('Đã lưu kiểm kê tài sản phòng.');
  };

  const saveAssetStatusReport = (report: Omit<AssetStatusReport, 'id'>) => {
    const newReport: AssetStatusReport = {
      ...report,
      id: `RP-${Date.now().toString().slice(-4)}`
    };
    setAssetReports(prev => [newReport, ...prev]);
    addAuditLog('LUU_HIEN_TRANG_BAN_GIAO', 'ASSET', report.roomId, 'Ghi nhận hiện trạng và hình ảnh bàn giao');
    showToast('Đã lưu hiện trạng bàn giao phòng.');
  };

  const signHandoverProtocol = (roomId: string, contractId: string, proofUrl: string) => {
    const newProtocol: AssetHandoverProtocol = {
      id: `BB-${roomId}`,
      roomId,
      rentalId: `LT-${roomId}-01`,
      contractId,
      date: new Date().toLocaleDateString('vi-VN'),
      paperHandoverSigned: true,
      paperProofUrl: proofUrl || 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=400&q=80',
      notes: 'Hai bên đã ký biên bản bàn giao giấy đầy đủ.',
      status: 'DA_KY'
    };
    setHandoverProtocols(prev => [...prev.filter(p => p.roomId !== roomId), newProtocol]);
    addAuditLog('KY_BIEN_BAN_NHAN_PHONG', 'ASSET', roomId, 'Ghi nhận chữ ký biên bản nhận phòng giấy');
    showToast('Đã ghi nhận ký biên bản nhận phòng giấy.');
  };

  const createIncident = (data: Omit<AssetIncident, 'id' | 'code'>) => {
    const count = incidents.length + 1;
    const code = `SC-2026-${count.toString().padStart(3, '0')}`;
    const newIncident: AssetIncident = {
      ...data,
      id: code,
      code
    };
    setIncidents(prev => [newIncident, ...prev]);
    addAuditLog('GHI_NHAN_SU_CO', 'INCIDENT', code, `Ghi nhận sự cố: ${data.assetName} (${data.description})`);
    showToast(`Đã ghi nhận sự cố ${code} thành công.`);
    return { success: true, incidentId: code };
  };

  const updateIncident = (incidentId: string, step: string, status: AssetIncident['status'], note: string) => {
    setIncidents(prev => prev.map(i => i.id === incidentId ? {
      ...i,
      actionStep: step,
      status,
      historyNotes: [
        ...i.historyNotes,
        {
          date: new Date().toLocaleString('vi-VN'),
          content: note,
          by: currentUser?.fullName || 'Chủ nhà'
        }
      ]
    } : i));
    addAuditLog('CAP_NHAT_SU_CO', 'INCIDENT', incidentId, `Cập nhật tiến độ sự cố: ${step} (${status})`);
    showToast('Đã cập nhật tiến độ xử lý sự cố.');
  };

  // Checkout methods
  const createCheckoutPlan = (roomId: string, plannedDate: string, channel: 'ZALO' | 'DIEN_THOAI' | 'TRUC_TIEP', notes: string) => {
    const newPlan: CheckoutPlan = {
      id: `PL-${roomId}`,
      roomId,
      rentalId: `LT-${roomId}-01`,
      plannedDate,
      confirmedChannel: channel,
      notes,
      status: 'DANG_CHO',
      history: [
        {
          date: new Date().toLocaleString('vi-VN'),
          channel,
          content: notes || 'Khách báo ngày dự kiến trả phòng',
          recorder: currentUser?.fullName || 'Chủ nhà',
          newExpectedDate: plannedDate
        }
      ]
    };
    setCheckoutPlans(prev => [...prev.filter(p => p.roomId !== roomId), newPlan]);
    // Cập nhật trạng thái phòng sang SẮP TRẢ nếu đang thuê
    setRooms(prev => prev.map(r => r.id === roomId && r.status === 'DANG_THUE' ? { ...r, status: 'SAP_TRA' } : r));
    addAuditLog('GHI_KE_HOACH_TRA_PHONG', 'CHECKOUT', roomId, `Ghi ngày dự kiến trả phòng: ${plannedDate} qua ${channel}`);
    showToast(`Đã lưu kế hoạch trả phòng ngày ${plannedDate}. Phòng chuyển sang Sắp trả.`);
  };

  const editCheckoutPlan = (roomId: string, newDate: string, channel: string, reason: string) => {
    setCheckoutPlans(prev => prev.map(p => p.roomId === roomId ? {
      ...p,
      plannedDate: newDate,
      history: [
        ...p.history,
        {
          date: new Date().toLocaleString('vi-VN'),
          channel,
          content: `Đổi ngày trả: ${reason}`,
          recorder: currentUser?.fullName || 'Chủ nhà',
          newExpectedDate: newDate
        }
      ]
    } : p));
    addAuditLog('SUA_KE_HOACH_TRA_PHONG', 'CHECKOUT', roomId, `Sửa ngày dự kiến trả sang ${newDate}: ${reason}`);
    showToast(`Đã sửa ngày dự kiến trả sang ${newDate}.`);
  };

  const addCheckoutPlanFeedback = (roomId: string, channel: string, content: string, newDate?: string) => {
    setCheckoutPlans(prev => prev.map(p => p.roomId === roomId ? {
      ...p,
      plannedDate: newDate || p.plannedDate,
      history: [
        ...p.history,
        {
          date: new Date().toLocaleString('vi-VN'),
          channel,
          content,
          recorder: currentUser?.fullName || 'Chủ nhà',
          newExpectedDate: newDate
        }
      ]
    } : p));
    addAuditLog('GHI_PHAN_HOI_TRA_PHONG', 'CHECKOUT', roomId, `Ghi nhận phản hồi qua ${channel}: ${content}`);
    showToast('Đã lưu phản hồi của khách thuê.');
  };

  const createCheckoutDraft = (roomId: string) => {
    const protocolId = `CK-${roomId}`;
    const newProtocol: CheckoutProtocol = {
      id: protocolId,
      roomId,
      rentalId: `LT-${roomId}-01`,
      draftDate: new Date().toLocaleDateString('vi-VN'),
      actualReturnConfirmed: false,
      isPendingResolution: false,
      paperProtocolSigned: false,
      status: 'NHAP',
      verifiedCheckoutConditions: false
    };
    setCheckoutProtocols(prev => [...prev.filter(p => p.roomId !== roomId), newProtocol]);
    addAuditLog('TAO_BIEN_BAN_TRA_NHAP', 'CHECKOUT', roomId, 'Khởi tạo biên bản trả phòng nháp');
    showToast('Đã lập dự thảo biên bản trả phòng.');
    return { success: true, protocolId };
  };

  const confirmActualReturn305 = (roomId: string, finalElectric: number, finalWater: number) => {
    setCheckoutProtocols(prev => prev.map(p => p.roomId === roomId ? {
      ...p,
      actualReturnDate: new Date().toLocaleDateString('vi-VN'),
      actualReturnConfirmed: true, // Đạt mốc 3.05
      finalElectricNumber: finalElectric,
      finalWaterNumber: finalWater,
      isPendingResolution: false,
      status: 'DANG_KIEM_TRA'
    } : p));
    addAuditLog('XAC_NHAN_NHAN_LAI_THUC_TE_305', 'CHECKOUT', roomId, `Xác nhận nhận lại phòng thực tế (bước 3.05), điện chốt: ${finalElectric}, nước chốt: ${finalWater}`);
    showToast('Đã xác nhận nhận lại phòng thực tế (Mốc 3.05). Sẵn sàng đối chiếu tài sản.');
    return { success: true };
  };

  const markReturnPending = (roomId: string, reason: string) => {
    setCheckoutProtocols(prev => prev.map(p => p.roomId === roomId ? {
      ...p,
      isPendingResolution: true,
      pendingReason: reason,
      status: 'CHUA_XONG'
    } : p));
    // Cập nhật trạng thái phòng thành CHƯA BÀN GIAO XONG (KHÔNG được chuyển Trống)
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, status: 'CHUA_BAN_GIAO_XONG' } : r));
    addAuditLog('CHUA_BAN_GIAO_XONG', 'CHECKOUT', roomId, `Ghi nhận chưa bàn giao xong: ${reason}`);
    showToast('Đã ghi nhận Chưa bàn giao xong. Phòng giữ nguyên trạng thái chưa thể giải phóng.');
  };

  const saveAssetComparison = (roomId: string, itemsDiff: { id: string; difference: string; compAmount: number; isDamaged: boolean }[]) => {
    setAssetItems(prev => prev.map(item => {
      const match = itemsDiff.find(d => d.id === item.id);
      if (match) {
        return {
          ...item,
          difference: match.difference,
          compensationAmount: match.compAmount,
          isDamagedOrMissing: match.isDamaged
        };
      }
      return item;
    }));
    addAuditLog('DOI_CHIEU_TAI_SAN_TRA', 'ASSET', roomId, 'Lưu kết quả đối chiếu tài sản lúc trả');
    showToast('Đã lưu kết quả đối chiếu tài sản và chênh lệch.');
  };

  const signCheckoutFinalProtocol = (roomId: string, proofUrl: string) => {
    setCheckoutProtocols(prev => prev.map(p => p.roomId === roomId ? {
      ...p,
      paperProtocolSigned: true,
      paperProofUrl: proofUrl || 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=400&q=80',
      status: 'CHO_QUYET_TOAN'
    } : p));
    addAuditLog('HOAN_TAT_BIEN_BAN_TRA', 'CHECKOUT', roomId, 'Ghi nhận hai bên đã ký biên bản trả phòng giấy');
    showToast('Đã hoàn thiện biên bản trả phòng giấy.');
    return { success: true };
  };

  const verifyReturnAndFreeRoom = (roomId: string) => {
    const protocol = checkoutProtocols.find(p => p.roomId === roomId);
    const settlement = depositSettlements.find(s => s.roomId === roomId);

    const unmetReasons: string[] = [];
    if (!protocol?.actualReturnConfirmed) unmetReasons.push('Chưa xác nhận nhận lại phòng thực tế (3.05)');
    if (protocol?.isPendingResolution) unmetReasons.push(`Đang vướng mắc chưa bàn giao xong: ${protocol.pendingReason}`);
    if (!protocol?.paperProtocolSigned) unmetReasons.push('Chưa hoàn tất ký biên bản trả phòng giấy');
    if (!settlement || !['DA_CHOT_HOAN_TIEN', 'DA_CHOT_THU_THEM'].includes(settlement.status)) {
      unmetReasons.push('Chưa hoàn tất quyết toán cọc (phải chốt hoàn cọc hoặc thu thêm có chứng từ)');
    }

    if (unmetReasons.length > 0) {
      return { success: false, error: 'Chưa đủ điều kiện nghiệp vụ để giải phóng phòng.', unmetReasons };
    }

    // Đủ mọi điều kiện: Giải phóng phòng thành TRỐNG
    setRooms(prev => prev.map(r => r.id === roomId ? {
      ...r,
      status: 'TRONG',
      currentTenantId: undefined,
      currentContractId: undefined,
      currentRentalId: undefined,
      note: 'Phòng trống đã thanh lý hợp đồng và nghiệm thu đầy đủ',
      updatedAt: new Date().toISOString().split('T')[0]
    } : r));

    setCheckoutProtocols(prev => prev.map(p => p.roomId === roomId ? { ...p, status: 'HOAN_TAT', verifiedCheckoutConditions: true } : p));

    addAuditLog('GIAI_PHONG_PHONG_TRONG', 'ROOM', roomId, 'Kiểm tra đủ mọi điều kiện: giải phóng phòng thành TRỐNG');
    showToast(`Đã giải phóng phòng ${roomId} thành TRỐNG thành công! Sẵn sàng cho lượt thuê mới.`);
    return { success: true };
  };

  // Billing methods
  const recordMeterReading = (periodId: string, roomId: string, elNew: number, waNew: number, elProof?: string, waProof?: string) => {
    const existing = meterReadings.find(m => m.periodId === periodId && m.roomId === roomId);
    const room = rooms.find(r => r.id === roomId);
    if (!room) return { success: false, error: 'Phòng không tồn tại.' };

    const previousReading = meterReadings
      .filter(m => m.roomId === roomId && m.id !== existing?.id)
      .at(-1);
    const elOld = existing?.electricOld ?? previousReading?.electricNew ?? 1000;
    const waOld = existing?.waterOld ?? previousReading?.waterNew ?? 30;

    if (elNew < elOld) {
      return { success: false, error: `Số điện mới (${elNew}) không được nhỏ hơn số cũ (${elOld}). Vui lòng kiểm tra lại công tơ.` };
    }
    if (waNew < waOld) {
      return { success: false, error: `Số nước mới (${waNew}) không được nhỏ hơn số cũ (${waOld}).` };
    }

    const newReading: MeterReading = {
      id: existing ? existing.id : `MR-${periodId}-${roomId}`,
      periodId,
      roomId,
      rentalId: room.currentRentalId || `LT-${roomId}-01`,
      recordedDate: new Date().toLocaleDateString('vi-VN'),
      electricOld: elOld,
      electricNew: elNew,
      waterOld: waOld,
      waterNew: waNew,
      electricProofUrl: elProof || 'https://images.unsplash.com/photo-1558441719-8b489c63f79a?auto=format&fit=crop&w=400&q=80',
      waterProofUrl: waProof || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80',
      editHistory: []
    };

    setMeterReadings(prev => [...prev.filter(m => !(m.periodId === periodId && m.roomId === roomId)), newReading]);
    addAuditLog('GHI_CHI_SO_DIEN_NUOC', 'BILLING', roomId, `Ghi chỉ số kỳ ${periodId}: Điện ${elOld}→${elNew}, Nước ${waOld}→${waNew}`);
    showToast(`Đã ghi chỉ số điện nước phòng ${room.roomNumber} kỳ ${periodId}.`);
    return { success: true };
  };

  const editMeterReading = (readingId: string, elNew: number, waNew: number, reason: string) => {
    const reading = meterReadings.find(m => m.id === readingId);
    if (!reading) return { success: false, error: 'Bản ghi chỉ số không tồn tại.' };
    if (!reason.trim()) return { success: false, error: 'Bắt buộc phải ghi rõ lý do sửa chỉ số để lưu vết kiểm toán.' };

    setMeterReadings(prev => prev.map(m => m.id === readingId ? {
      ...m,
      electricNew: elNew,
      waterNew: waNew,
      editHistory: [
        ...m.editHistory,
        {
          timestamp: new Date().toLocaleString('vi-VN'),
          oldElectric: m.electricNew,
          newElectric: elNew,
          oldWater: m.waterNew,
          newWater: waNew,
          reason
        }
      ]
    } : m));

    // Cần tính lại bảng tiền nếu đã tính
    addAuditLog('SUA_CHI_SO_DIEN_NUOC', 'BILLING', reading.roomId, `Sửa chỉ số: ${reason}. Cần tính lại bảng tiền kỳ.`);
    showToast('Đã sửa chỉ số điện nước. Vui lòng tính lại bảng tiền để cập nhật.');
    return { success: true };
  };

  const calculatePeriodForRoom = (periodId: string, roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    const reading = meterReadings.find(m => m.periodId === periodId && m.roomId === roomId);
    const activeTariff = tariffs.find(t => t.isActive) || tariffs[0];
    const period = periods.find(p => p.id === periodId);

    if (!room || !reading || !period) {
      return { success: false };
    }

    const electricUsage = reading.electricNew - reading.electricOld;
    const waterUsage = reading.waterNew - reading.waterOld;
    const electricAmount = electricUsage * activeTariff.electricityPricePerKwh;
    const waterAmount = waterUsage * activeTariff.waterPricePerM3;
    const fixedServiceAmount = activeTariff.fixedServiceFeePerTenancy; // Thu đủ cho mỗi lượt thuê
    const wifiAmount = activeTariff.wifiFeePerRoom;
    const garbageAmount = activeTariff.garbageFeePerRoom;
    const totalServiceAmount = electricAmount + waterAmount + fixedServiceAmount + wifiAmount + garbageAmount;

    // Tiền thuê tháng tới trả trước
    const nextMonthRent = room.basePrice;
    const totalDue = nextMonthRent + totalServiceAmount;

    const calcId = `CALC-${periodId}-${roomId}`;
    const newCalc: PeriodCalculation = {
      id: calcId,
      periodId,
      roomId,
      rentalId: room.currentRentalId || `LT-${roomId}-01`,
      tenantId: room.currentTenantId || 'KT001',
      nextMonthRent,
      rentPeriodLabel: `Tiền thuê tháng ${period.rentForPeriodMonthYear} (trả trước)`,
      electricUsage,
      electricRate: activeTariff.electricityPricePerKwh,
      electricAmount,
      electricPeriodLabel: `Điện dùng tháng ${period.serviceForPeriodMonthYear} (${electricUsage} kWh)`,
      waterUsage,
      waterRate: activeTariff.waterPricePerM3,
      waterAmount,
      waterPeriodLabel: `Nước dùng tháng ${period.serviceForPeriodMonthYear} (${waterUsage} m³)`,
      fixedServiceAmount,
      fixedServiceRate: activeTariff.fixedServiceFeePerTenancy,
      wifiAmount,
      garbageAmount,
      totalServiceAmount,
      totalDueCurrentPeriod: totalDue,
      previousUnpaidBalance: 0,
      tariffVersionUsed: activeTariff.id,
      isReconciled: true,
      reconciliationNotes: `Áp dụng biểu giá ${activeTariff.versionName}`
    };

    setCalculations(prev => [...prev.filter(c => !(c.periodId === periodId && c.roomId === roomId)), newCalc]);
    addAuditLog('TINH_TIEN_KY', 'BILLING', roomId, `Tính tiền kỳ ${periodId}: Thuê tới ${nextMonthRent.toLocaleString()} đ, Dịch vụ ${totalServiceAmount.toLocaleString()} đ = Tổng ${totalDue.toLocaleString()} đ`);
    showToast(`Đã tính tiền kỳ ${periodId} phòng ${room.roomNumber}: ${totalDue.toLocaleString()} VNĐ`);
    return { success: true, calcId };
  };

  const reconcilePeriodCalculation = (calcId: string, notes: string) => {
    setCalculations(prev => prev.map(c => c.id === calcId ? { ...c, isReconciled: true, reconciliationNotes: notes } : c));
    addAuditLog('DOI_CHIEU_KHOAN_PHAI_THU', 'BILLING', calcId, `Đối chiếu số liệu: ${notes}`);
    showToast('Đã đối chiếu khoản phải thu hợp lệ.');
  };

  const issuePaymentNoticeQR = (calcId: string, dueDate: string) => {
    const calc = calculations.find(c => c.id === calcId);
    const activeBank = bankConfigs.find(b => b.isActive) || bankConfigs[0];
    if (!calc) return { success: false, noticeId: '' };

    const noticeCode = `TB-${calc.periodId}-${calc.roomId}`;
    const transferContent = `${calc.roomId} THANG ${calc.periodId.slice(-2)}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=2|99|${activeBank.accountNumber}|${encodeURIComponent(activeBank.accountHolder)}||0|0|${calc.totalDueCurrentPeriod}|${encodeURIComponent(transferContent)}|transfer_myqr`;

    const newNotice: PaymentNotice = {
      id: noticeCode,
      code: noticeCode,
      periodId: calc.periodId,
      roomId: calc.roomId,
      tenantId: calc.tenantId,
      calcId,
      issuedDate: new Date().toLocaleDateString('vi-VN'),
      dueDate,
      totalAmount: calc.totalDueCurrentPeriod,
      rentAmount: calc.nextMonthRent,
      serviceAmount: calc.totalServiceAmount,
      bankSnapshot: {
        bankName: activeBank.bankName,
        accountNumber: activeBank.accountNumber,
        accountHolder: activeBank.accountHolder,
        transferContent
      },
      qrImageUrl: qrUrl,
      status: 'DANG_HIEU_LUC',
      shareLog: []
    };

    setNotices(prev => [...prev.filter(n => n.id !== noticeCode), newNotice]);

    // Tạo giao dịch theo dõi ở trạng thái CHƯA THU
    const txId = `TX-${calc.periodId}-${calc.roomId}`;
    const newTx: PaymentTransaction = {
      id: txId,
      noticeId: noticeCode,
      periodId: calc.periodId,
      roomId: calc.roomId,
      tenantId: calc.tenantId,
      totalDue: calc.totalDueCurrentPeriod,
      status: 'CHUA_THU',
      correctionHistory: []
    };
    setTransactions(prev => [...prev.filter(t => t.id !== txId), newTx]);

    addAuditLog('LAP_THONG_BAO_QR', 'BILLING', noticeCode, `Phát hành thông báo kèm QR cho phòng ${calc.roomId}, tổng ${calc.totalDueCurrentPeriod.toLocaleString()} đ`);
    showToast(`Đã lập thông báo thanh toán và mã QR cho phòng ${calc.roomId}!`);
    return { success: true, noticeId: noticeCode };
  };

  const confirmPaymentReceived = (noticeId: string, amount: number, refCode: string, proofUrl?: string) => {
    const notice = notices.find(n => n.id === noticeId);
    if (!notice) return { success: false, error: 'Thông báo không tồn tại.' };

    // Quy tắc nghiệp vụ bắt buộc: Đúng 1 giao dịch chuyển khoản ĐỦ 100% tổng tiền QR, KHÔNG CHO TRẢ MỘT PHẦN
    if (amount !== notice.totalAmount) {
      return {
        success: false,
        error: `Số tiền xác nhận (${amount.toLocaleString()} đ) không khớp với tổng tiền trên mã QR (${notice.totalAmount.toLocaleString()} đ). Quy định nghiệp vụ không cho phép thanh toán một phần trong chức năng xác nhận theo QR.`
      };
    }

    setTransactions(prev => prev.map(t => t.noticeId === noticeId ? {
      ...t,
      status: 'DA_THU',
      receivedAmount: amount,
      receivedDate: new Date().toLocaleDateString('vi-VN'),
      bankTransactionRef: refCode || `FT-${Date.now().toString().slice(-6)}`,
      paymentProofUrl: proofUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80',
      confirmedBy: currentUser?.fullName || 'Chủ nhà',
      confirmedAt: new Date().toLocaleString('vi-VN')
    } : t));

    // Xóa khỏi danh sách công nợ quá hạn nếu có
    setOverdueDebts(prev => prev.filter(d => d.noticeId !== noticeId));

    addAuditLog('XAC_NHAN_THU_TIEN', 'PAYMENT', noticeId, `Xác nhận đã thu đủ ${amount.toLocaleString()} đ cho thông báo ${noticeId}, mã GD ${refCode}`);
    showToast(`Đã xác nhận thu thành công ${amount.toLocaleString()} VNĐ cho phòng ${notice.roomId}!`);
    return { success: true };
  };

  const correctPaymentReceipt = (transactionId: string, newAmount: number, reason: string, proofUrl?: string) => {
    if (!reason.trim()) return { success: false, error: 'Bắt buộc phải ghi rõ lý do sửa xác nhận thu để đảm bảo tính minh bạch.' };

    const tx = transactions.find(t => t.id === transactionId);
    if (!tx) return { success: false, error: 'Giao dịch không tồn tại.' };

    setTransactions(prev => prev.map(t => t.id === transactionId ? {
      ...t,
      receivedAmount: newAmount,
      correctionHistory: [
        ...(t.correctionHistory || []),
        {
          date: new Date().toLocaleString('vi-VN'),
          reason,
          proofUrl,
          correctedBy: currentUser?.fullName || 'Chủ nhà',
          previousAmount: t.receivedAmount || 0,
          newAmount
        }
      ]
    } : t));

    addAuditLog('SUA_XAC_NHAN_THU', 'PAYMENT', transactionId, `Sửa xác nhận thu từ ${tx.receivedAmount?.toLocaleString()}đ sang ${newAmount.toLocaleString()}đ: ${reason}`);
    showToast('Đã sửa xác nhận thu tiền và lưu lịch sử kiểm toán.');
    return { success: true };
  };

  // Debt methods
  const recordDebtReminder = (debtId: string, channel: 'DIEN_THOAI' | 'ZALO' | 'TRUC_TIEP', content: string) => {
    setOverdueDebts(prev => prev.map(d => d.id === debtId ? {
      ...d,
      reminderHistory: [
        ...d.reminderHistory,
        {
          id: `REM-${Date.now().toString().slice(-4)}`,
          date: new Date().toLocaleString('vi-VN'),
          channel,
          content,
          conductedBy: currentUser?.fullName || 'Chủ nhà'
        }
      ]
    } : d));
    addAuditLog('GHI_NHAN_NHAC_NO', 'DEBT', debtId, `Nhắc nợ qua ${channel}: ${content}`);
    showToast('Đã ghi nhận lần nhắc nợ thực tế.');
  };

  const recordTenantReply = (debtId: string, channel: 'DIEN_THOAI' | 'ZALO' | 'TRUC_TIEP', reply: string, promisedDate?: string) => {
    setOverdueDebts(prev => prev.map(d => d.id === debtId ? {
      ...d,
      tenantReplies: [
        ...d.tenantReplies,
        {
          id: `REP-${Date.now().toString().slice(-4)}`,
          date: new Date().toLocaleString('vi-VN'),
          channel,
          replyContent: reply,
          promisedPaymentDate: promisedDate,
          notes: 'Ngày hẹn trả của khách KHÔNG tự động thay đổi hạn nộp gốc theo nghiệp vụ.'
        }
      ]
    } : d));
    addAuditLog('GHI_PHAN_HOI_NO', 'DEBT', debtId, `Khách hẹn qua ${channel}: ${reply} (Hẹn ngày: ${promisedDate || 'Không rõ'})`);
    showToast('Đã lưu phản hồi của khách. Hạn nợ gốc được giữ nguyên.');
  };

  // Deposit methods
  const createDepositSettlement = (data: Omit<DepositSettlement, 'id'>) => {
    const id = `QTC-${data.roomId}`;
    const newSettlement: DepositSettlement = {
      ...data,
      id
    };
    setDepositSettlements(prev => [...prev.filter(s => s.roomId !== data.roomId), newSettlement]);
    addAuditLog('LAP_QUYET_TOAN_COC', 'DEPOSIT', id, `Lập quyết toán cọc phòng ${data.roomId}, hoàn trả dự kiến ${data.netRefundAmount.toLocaleString()} đ`);
    showToast(`Đã lập dự thảo quyết toán cọc cho phòng ${data.roomId}.`);
    return { success: true, settlementId: id };
  };

  const updateDepositSettlement = (settlementId: string, data: Partial<DepositSettlement>, reason: string) => {
    setDepositSettlements(prev => prev.map(s => s.id === settlementId ? {
      ...s,
      ...data,
      amendmentHistory: [
        ...s.amendmentHistory,
        {
          date: new Date().toLocaleString('vi-VN'),
          reason,
          adjustedAmount: data.netRefundAmount || s.netRefundAmount,
          by: currentUser?.fullName || 'Chủ nhà'
        }
      ]
    } : s));
    addAuditLog('SUA_QUYET_TOAN_COC', 'DEPOSIT', settlementId, `Chỉnh sửa quyết toán cọc: ${reason}`);
    showToast('Đã cập nhật dự thảo quyết toán cọc.');
  };

  const finalizeDepositSettlement = (settlementId: string, proofUrl: string, method: DepositSettlement['paymentMethod']) => {
    setDepositSettlements(prev => prev.map(s => s.id === settlementId ? {
      ...s,
      status: 'DA_CHOT_HOAN_TIEN',
      actualSettlementProofUrl: proofUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80',
      actualSettledDate: new Date().toLocaleDateString('vi-VN'),
      paymentMethod: method
    } : s));
    addAuditLog('CHOT_QUYET_TOAN_COC', 'DEPOSIT', settlementId, `Ghi nhận kết quả chuyển khoản hoàn cọc thực tế, phương thức ${method}`);
    showToast('Đã chốt kết quả quyết toán cọc thành công!');
    return { success: true };
  };

  // Config methods
  const saveTariffConfig = (newTariff: Omit<TariffConfig, 'id' | 'isActive'>) => {
    // Phiên bản cũ chuyển sang inactive, thêm phiên bản mới
    const newId = `TF-2026-V${tariffs.length + 1}`;
    const createdTariff: TariffConfig = {
      ...newTariff,
      id: newId,
      isActive: true,
      updatedBy: currentUser?.fullName || 'Chủ nhà'
    };
    setTariffs(prev => [...prev.map(t => ({ ...t, isActive: false })), createdTariff]);
    addAuditLog('CAP_NHAT_DON_GIA', 'CONFIG', newId, `Ban hành đơn giá mới ${createdTariff.versionName}, áp dụng từ ${createdTariff.effectiveFrom}`);
    showToast(`Đã lưu phiên bản đơn giá mới (${createdTariff.versionName}). Không hồi tố các kỳ cũ.`);
  };

  const saveBankConfig = (newBank: Omit<BankConfig, 'id' | 'isActive'>) => {
    const newId = `BK-${Date.now().toString().slice(-4)}`;
    const createdBank: BankConfig = {
      ...newBank,
      id: newId,
      isActive: true,
      updatedBy: currentUser?.fullName || 'Chủ nhà'
    };
    setBankConfigs(prev => [...prev.map(b => ({ ...b, isActive: false })), createdBank]);
    addAuditLog('CAP_NHAT_TAI_KHOAN_NGAN_HANG', 'CONFIG', newId, `Thiết lập tài khoản nhận mới ${newBank.bankName} - ${newBank.accountNumber}`);
    showToast('Đã cập nhật tài khoản ngân hàng nhận tiền cho các thông báo mới!');
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        isFirstPasswordChangeRequired,
        failedAttempts,
        lockUntil,
        sessionRemainingMinutes,
        login,
        changeFirstPassword,
        forgotPassword,
        resetPassword,
        changePassword,
        logout,

        currentScreenId,
        params,
        historyStack,
        activeBottomTab,
        navigate,
        goBack,
        setActiveBottomTab,

        rooms,
        tenants,
        coResidents,
        contracts,
        rentalTerms,
        assetItems,
        assetReports,
        handoverProtocols,
        incidents,
        checkoutPlans,
        checkoutProtocols,
        tariffs,
        bankConfigs,
        periods,
        meterReadings,
        calculations,
        notices,
        transactions,
        overdueDebts,
        depositSettlements,
        auditLogs,

        createRoom,
        updateRoom,
        saveRentalTerms,
        createDraftContract,
        editDraftContract,
        signContract,
        renewContract,
        signRenewContract,
        confirmInitialPayment,
        checkInRoom,

        createTenant,
        updateTenant,
        addCoResident,
        updateCoResident,

        saveAssetInventory,
        saveAssetStatusReport,
        signHandoverProtocol,
        createIncident,
        updateIncident,

        createCheckoutPlan,
        editCheckoutPlan,
        addCheckoutPlanFeedback,
        createCheckoutDraft,
        confirmActualReturn305,
        markReturnPending,
        saveAssetComparison,
        signCheckoutFinalProtocol,
        verifyReturnAndFreeRoom,

        recordMeterReading,
        editMeterReading,
        calculatePeriodForRoom,
        reconcilePeriodCalculation,
        issuePaymentNoticeQR,
        confirmPaymentReceived,
        correctPaymentReceipt,

        recordDebtReminder,
        recordTenantReply,

        createDepositSettlement,
        updateDepositSettlement,
        finalizeDepositSettlement,

        saveTariffConfig,
        saveBankConfig,

        toastMessage,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
