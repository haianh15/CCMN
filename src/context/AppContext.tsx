import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import * as QRCode from 'qrcode';
import type { Session, User } from '@supabase/supabase-js';
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
  DepositSettlement,
  InitialPayment
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
import { isSupabaseConfigured, supabase, verifyPassword } from '../lib/supabase';

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
  initialPayments: InitialPayment[];
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
  currentUser: { id: string; username: string; fullName: string; role: 'CHU_NHA'; phone: string; email: string } | null;
  isFirstPasswordChangeRequired: boolean;
  failedAttempts: number;
  lockUntil: number | null;
  sessionRemainingMinutes: number;
  passwordChangeLockUntil: number | null;
  authLoading: boolean;
  dataLoading: boolean;
  isConfigured: boolean;
  databaseError: string | null;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error' | 'conflict';
  saveError: string | null;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  changeFirstPassword: (newPass: string, confirmPass: string) => Promise<{ success: boolean; error?: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  resetPassword: (newPass: string) => Promise<{ success: boolean; error?: string }>;
  changePassword: (currentPass: string, newPass: string, confirmPass: string, requestId: string) => Promise<{ success: boolean; error?: string; errorCode?: string }>;
  logout: () => Promise<void>;
  retryLoadData: () => void;
  retrySave: () => void;

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
  initialPayments: InitialPayment[];
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
  saveRentalTerms: (terms: RentalTerms) => { success: boolean; error?: string };
  createDraftContract: (terms: RentalTerms) => { success: boolean; contractId: string; error?: string };
  editDraftContract: (contractId: string, updates: Partial<Contract>) => { success: boolean; error?: string };
  signContract: (contractId: string, signedDate: string, proofUrl: string) => { success: boolean; error?: string };
  renewContract: (parentContractId: string, durationMonths: number, startDate: string, endDate: string) => { success: boolean; contractId: string; error?: string };
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
  saveAssetStatusReport: (report: Omit<AssetStatusReport, 'id'>) => { success: boolean };
  signHandoverProtocol: (roomId: string, contractId: string, proofUrl: string, keysCardsHandedOver: boolean) => { success: boolean; error?: string };
  createIncident: (incident: Omit<AssetIncident, 'id' | 'code'>) => { success: boolean; incidentId: string };
  updateIncident: (incidentId: string, step: string, status: AssetIncident['status'], note: string) => void;

  // Checkout actions
  createCheckoutPlan: (roomId: string, plannedDate: string, channel: 'ZALO' | 'DIEN_THOAI' | 'TRUC_TIEP', notes: string) => void;
  editCheckoutPlan: (roomId: string, newDate: string, channel: string, reason: string) => void;
  addCheckoutPlanFeedback: (roomId: string, channel: string, content: string, newDate?: string) => void;
  createCheckoutDraft: (roomId: string) => { success: boolean; protocolId: string };
  confirmActualReturn305: (roomId: string, finalElectric: number, finalWater: number) => { success: boolean; error?: string };
  markReturnPending: (roomId: string, reason: string) => { success: boolean; error?: string };
  saveAssetComparison: (roomId: string, itemsWithDifferences: { id: string; difference: string; compAmount: number; isDamaged: boolean }[]) => void;
  signCheckoutFinalProtocol: (roomId: string, proofUrl: string) => { success: boolean; error?: string };
  verifyReturnAndFreeRoom: (roomId: string) => { success: boolean; error?: string; unmetReasons?: string[] };

  // Billing actions
  recordMeterReading: (periodId: string, roomId: string, elNew: number, waNew: number, elProof?: string, waProof?: string, elOldInput?: number, waOldInput?: number) => { success: boolean; error?: string };
  editMeterReading: (readingId: string, elNew: number, waNew: number, reason: string) => { success: boolean; error?: string };
  calculatePeriodForRoom: (periodId: string, roomId: string) => { success: boolean; calcId?: string };
  reconcilePeriodCalculation: (calcId: string, notes: string) => void;
  issuePaymentNoticeQR: (calcId: string, dueDate: string) => Promise<{ success: boolean; noticeId: string }>;
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
  saveTariffConfig: (newTariff: Omit<TariffConfig, 'id' | 'isActive'>) => { success: boolean };
  saveBankConfig: (newBank: Omit<BankConfig, 'id' | 'isActive'>) => { success: boolean };

  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const createAppData = (): PersistedAppData => ({
  rooms: INITIAL_ROOMS,
  tenants: INITIAL_TENANTS,
  coResidents: INITIAL_CO_RESIDENTS,
  contracts: INITIAL_CONTRACTS,
  initialPayments: [],
  rentalTerms: INITIAL_RENTAL_TERMS,
  assetItems: INITIAL_ASSET_ITEMS,
  assetReports: INITIAL_ASSET_REPORTS,
  handoverProtocols: INITIAL_HANDOVER_PROTOCOLS,
  incidents: INITIAL_INCIDENTS,
  checkoutPlans: INITIAL_CHECKOUT_PLANS,
  checkoutProtocols: INITIAL_CHECKOUT_PROTOCOLS,
  tariffs: INITIAL_TARIFFS,
  bankConfigs: INITIAL_BANK_CONFIGS,
  periods: INITIAL_PERIODS,
  meterReadings: INITIAL_METER_READINGS,
  calculations: INITIAL_CALCULATIONS,
  notices: INITIAL_PAYMENT_NOTICES,
  transactions: INITIAL_PAYMENT_TRANSACTIONS,
  overdueDebts: INITIAL_OVERDUE_DEBTS,
  depositSettlements: INITIAL_DEPOSIT_SETTLEMENTS,
  auditLogs: [{
    id: 'LOG-001',
    timestamp: new Date().toLocaleString('vi-VN'),
    action: 'HE_THONG_KHOI_DONG',
    entityType: 'SYSTEM',
    entityId: 'SYS',
    details: 'Khởi tạo dữ liệu quản lý tòa nhà',
    user: 'Chủ nhà'
  }]
});

const mapAuthUser = (user: User) => ({
  id: user.id,
  username: user.email || '',
  fullName: user.user_metadata.full_name || user.email || 'Chủ nhà',
  role: 'CHU_NHA' as const,
  phone: user.user_metadata.phone || '',
  email: user.email || ''
});

const LOGIN_GUARD_KEY = 'greenhouse.login-guard.v1';
const SESSION_IDLE_LIMIT_MS = 30 * 60 * 1000;
const LOGIN_LOCK_MS = 15 * 60 * 1000;
const PASSWORD_CHANGE_ATTEMPT_LIMIT = 5;
const PASSWORD_CHANGE_LOCK_MS = 15 * 60 * 1000;
const APP_STATE_LOAD_TIMEOUT_MS = 15_000;

const parseLocalDate = (value: string): Date | null => {
  const vietnameseDate = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (vietnameseDate) {
    const [, day, month, year] = vietnameseDate;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }
  const isoDate = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoDate) {
    const [, year, month, day] = isoDate;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }
  return null;
};

const createVietQrPayload = (bankCode: string, accountNumber: string, amount: number, transferContent: string) => {
  const field = (id: string, value: string) => `${id}${value.length.toString().padStart(2, '0')}${value}`;
  const merchantAccount = field('00', 'A000000727') +
    field('01', bankCode) +
    field('02', accountNumber) +
    field('03', 'QRIBFTTA');
  const additionalData = field('08', transferContent.slice(0, 25));
  const payload = `000201010212${field('38', merchantAccount)}5303704${field('54', String(amount))}5802VN${field('62', additionalData)}6304`;
  let crc = 0xffff;
  for (const character of payload) {
    crc ^= character.charCodeAt(0) << 8;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
  }
  return `${payload}${crc.toString(16).toUpperCase().padStart(4, '0')}`;
};

const readLoginGuard = () => {
  try {
    const stored = localStorage.getItem(LOGIN_GUARD_KEY);
    if (!stored) return { failedAttempts: 0, lockUntil: null as number | null };
    const parsed: unknown = JSON.parse(stored);
    if (typeof parsed !== 'object' || parsed === null) {
      throw new Error('Dữ liệu giới hạn đăng nhập không đúng định dạng.');
    }
    const guard = parsed as { failedAttempts?: number; lockUntil?: number | null };
    return {
      failedAttempts: Number.isInteger(guard.failedAttempts) ? Math.max(0, guard.failedAttempts || 0) : 0,
      lockUntil: Number.isFinite(guard.lockUntil) ? guard.lockUntil || null : null
    };
  } catch (error) {
    console.error('Không thể đọc số lần đăng nhập sai.', error);
    return { failedAttempts: 0, lockUntil: null as number | null };
  }
};

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Đã xảy ra lỗi kết nối. Vui lòng thử lại.';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<AppContextType['currentUser']>(null);
  const [isFirstPasswordChangeRequired, setIsFirstPasswordChangeRequired] = useState(false);
  const [loginGuard, setLoginGuard] = useState(readLoginGuard);
  const [sessionRemainingMinutes, setSessionRemainingMinutes] = useState(30);
  const [passwordChangeLockUntil, setPasswordChangeLockUntil] = useState<number | null>(null);
  const passwordChangeFailedAttemptsRef = useRef(0);
  const passwordChangeLockUntilRef = useRef<number | null>(null);
  const passwordChangeRequestsRef = useRef(new Map<string, Promise<{ success: boolean; error?: string; errorCode?: string }>>());
  const [authLoading, setAuthLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [databaseError, setDatabaseError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<AppContextType['saveStatus']>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [saveAttempt, setSaveAttempt] = useState(0);
  const [dataReadyForUserId, setDataReadyForUserId] = useState<string | null>(null);
  const revisionRef = useRef(1);
  const lastSavedPayload = useRef<string | null>(null);

  // Navigation state
  const [currentScreenId, setCurrentScreenId] = useState<ScreenId>('LOGIN');
  const [params, setParams] = useState<Record<string, any>>({});
  const [historyStack, setHistoryStack] = useState<NavigationEntry[]>([{ screenId: 'HOME' }]);
  const [activeBottomTab, setActiveBottomTab] = useState<'HOME' | 'ROOMS' | 'TENANTS' | 'PAY' | 'MORE'>('HOME');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Entities state
  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [tenants, setTenants] = useState<Tenant[]>(INITIAL_TENANTS);
  const [coResidents, setCoResidents] = useState<CoResident[]>(INITIAL_CO_RESIDENTS);
  const [contracts, setContracts] = useState<Contract[]>(INITIAL_CONTRACTS);
  const [initialPayments, setInitialPayments] = useState<InitialPayment[]>([]);
  const [rentalTerms, setRentalTerms] = useState<Record<string, RentalTerms>>(INITIAL_RENTAL_TERMS);
  const [assetItems, setAssetItems] = useState<AssetInventoryItem[]>(INITIAL_ASSET_ITEMS);
  const [assetReports, setAssetReports] = useState<AssetStatusReport[]>(INITIAL_ASSET_REPORTS);
  const [handoverProtocols, setHandoverProtocols] = useState<AssetHandoverProtocol[]>(INITIAL_HANDOVER_PROTOCOLS);
  const [incidents, setIncidents] = useState<AssetIncident[]>(INITIAL_INCIDENTS);
  const [checkoutPlans, setCheckoutPlans] = useState<CheckoutPlan[]>(INITIAL_CHECKOUT_PLANS);
  const [checkoutProtocols, setCheckoutProtocols] = useState<CheckoutProtocol[]>(INITIAL_CHECKOUT_PROTOCOLS);
  const [tariffs, setTariffs] = useState<TariffConfig[]>(INITIAL_TARIFFS);
  const [bankConfigs, setBankConfigs] = useState<BankConfig[]>(INITIAL_BANK_CONFIGS);
  const [periods, setPeriods] = useState<BillingPeriod[]>(INITIAL_PERIODS);
  const [meterReadings, setMeterReadings] = useState<MeterReading[]>(INITIAL_METER_READINGS);
  const [calculations, setCalculations] = useState<PeriodCalculation[]>(INITIAL_CALCULATIONS);
  const [notices, setNotices] = useState<PaymentNotice[]>(INITIAL_PAYMENT_NOTICES);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(INITIAL_PAYMENT_TRANSACTIONS);
  const [overdueDebts, setOverdueDebts] = useState<OverdueDebt[]>(INITIAL_OVERDUE_DEBTS);
  const [depositSettlements, setDepositSettlements] = useState<DepositSettlement[]>(INITIAL_DEPOSIT_SETTLEMENTS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(createAppData().auditLogs);

  const applyAppData = (source: unknown) => {
    const incoming = typeof source === 'object' && source !== null && !Array.isArray(source)
      ? source as Partial<PersistedAppData>
      : {};
    const defaults = createAppData();
    const normalized: PersistedAppData = {
      rooms: incoming.rooms || defaults.rooms,
      tenants: incoming.tenants || defaults.tenants,
      coResidents: incoming.coResidents || defaults.coResidents,
      contracts: incoming.contracts || defaults.contracts,
      initialPayments: incoming.initialPayments || defaults.initialPayments,
      rentalTerms: incoming.rentalTerms || defaults.rentalTerms,
      assetItems: incoming.assetItems || defaults.assetItems,
      assetReports: incoming.assetReports || defaults.assetReports,
      handoverProtocols: incoming.handoverProtocols || defaults.handoverProtocols,
      incidents: incoming.incidents || defaults.incidents,
      checkoutPlans: incoming.checkoutPlans || defaults.checkoutPlans,
      checkoutProtocols: incoming.checkoutProtocols || defaults.checkoutProtocols,
      tariffs: incoming.tariffs || defaults.tariffs,
      bankConfigs: incoming.bankConfigs || defaults.bankConfigs,
      periods: incoming.periods || defaults.periods,
      meterReadings: incoming.meterReadings || defaults.meterReadings,
      calculations: incoming.calculations || defaults.calculations,
      notices: incoming.notices || defaults.notices,
      transactions: incoming.transactions || defaults.transactions,
      overdueDebts: incoming.overdueDebts || defaults.overdueDebts,
      depositSettlements: incoming.depositSettlements || defaults.depositSettlements,
      auditLogs: incoming.auditLogs || defaults.auditLogs
    };
    setRooms(normalized.rooms);
    setTenants(normalized.tenants);
    setCoResidents(normalized.coResidents);
    setContracts(normalized.contracts);
    setInitialPayments(normalized.initialPayments);
    setRentalTerms(normalized.rentalTerms);
    setAssetItems(normalized.assetItems);
    setAssetReports(normalized.assetReports);
    setHandoverProtocols(normalized.handoverProtocols);
    setIncidents(normalized.incidents);
    setCheckoutPlans(normalized.checkoutPlans);
    setCheckoutProtocols(normalized.checkoutProtocols);
    setTariffs(normalized.tariffs);
    setBankConfigs(normalized.bankConfigs);
    setPeriods(normalized.periods);
    setMeterReadings(normalized.meterReadings);
    setCalculations(normalized.calculations);
    setNotices(normalized.notices);
    setTransactions(normalized.transactions);
    setOverdueDebts(normalized.overdueDebts);
    setDepositSettlements(normalized.depositSettlements);
    setAuditLogs(normalized.auditLogs);
    return normalized;
  };

  useEffect(() => {
    if (!supabase || !isSupabaseConfigured) {
      setDatabaseError('Chưa cấu hình kết nối Supabase. Hãy thêm URL và khóa public vào biến môi trường.');
      setAuthLoading(false);
      return;
    }

    let active = true;
    const applySession = (session: Session | null) => {
      const user = session?.user ?? null;
      setCurrentUser(user ? mapAuthUser(user) : null);
      setIsAuthenticated(Boolean(user));
      setIsFirstPasswordChangeRequired(user?.user_metadata.must_change_password === true);
      setDataLoading(Boolean(user));
      if (!user) setDataReadyForUserId(null);
    };

    supabase.auth.getSession()
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          console.error('Không thể kiểm tra phiên đăng nhập Supabase.', error);
          setDatabaseError('Không thể kiểm tra phiên đăng nhập. Vui lòng tải lại trang.');
        } else {
          applySession(data.session);
        }
        setAuthLoading(false);
      })
      .catch(error => {
        if (!active) return;
        console.error('Không thể kết nối Supabase Auth.', error);
        setDatabaseError(getErrorMessage(error));
        setAuthLoading(false);
      });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      applySession(session);
      if (event === 'PASSWORD_RECOVERY') {
        setCurrentScreenId('RESET');
        setHistoryStack([{ screenId: 'RESET' }]);
      } else if (event === 'SIGNED_IN') {
        const screenId = session?.user.user_metadata.must_change_password === true ? 'FIRSTPASS' : 'HOME';
        setCurrentScreenId(screenId);
        setHistoryStack([{ screenId }]);
      } else if (event === 'SIGNED_OUT') {
        setCurrentScreenId('LOGIN');
        setHistoryStack([{ screenId: 'LOGIN' }]);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const client = supabase;
    if (!authLoading && !currentUser) {
      setDataLoading(false);
      setDataReadyForUserId(null);
      return;
    }
    if (!authLoading && currentUser && client) {
      const userId = currentUser.id;
      let active = true;
      setDataLoading(true);
      setDatabaseError(null);
      setSaveError(null);
      setSaveStatus('idle');
      setDataReadyForUserId(null);

      const loadData = async () => {
        const { data: row, error } = await client
          .from('app_state')
          .select('data, revision')
          .eq('user_id', userId)
          .maybeSingle();
        if (error) throw error;
        if (!active) return;

        if (row) {
          const normalized = applyAppData(row.data);
          revisionRef.current = row.revision;
          lastSavedPayload.current = JSON.stringify(normalized);
        } else {
          const initialData = createAppData();
          const { data: inserted, error: insertError } = await client
            .from('app_state')
            .insert({ user_id: userId, data: initialData, revision: 1 })
            .select('revision')
            .single();

          if (!active) return;
          if (insertError?.code === '23505') {
            const { data: concurrentRow, error: retryError } = await client
              .from('app_state')
              .select('data, revision')
              .eq('user_id', userId)
              .single();
            if (retryError) throw retryError;
            if (!active) return;
            const normalized = applyAppData(concurrentRow.data);
            revisionRef.current = concurrentRow.revision;
            lastSavedPayload.current = JSON.stringify(normalized);
          } else if (insertError) {
            throw insertError;
          } else {
            applyAppData(initialData);
            revisionRef.current = inserted.revision;
            lastSavedPayload.current = JSON.stringify(initialData);
          }
        }

        if (active) {
          setDataReadyForUserId(userId);
          setDataLoading(false);
          setDatabaseError(null);
          setSaveStatus('saved');
        }
      };

      let timeoutId: number | undefined;
      const timeout = new Promise<never>((_, reject) => {
        timeoutId = window.setTimeout(
          () => reject(new Error('APP_STATE_LOAD_TIMEOUT')),
          APP_STATE_LOAD_TIMEOUT_MS
        );
      });

      Promise.race([loadData(), timeout])
        .catch(error => {
          if (!active) return;
          active = false;
          console.error('Không thể tải dữ liệu từ Supabase.', error);
          setDatabaseError(error instanceof Error && error.message === 'APP_STATE_LOAD_TIMEOUT'
            ? 'Máy chủ dữ liệu không phản hồi sau 15 giây. Kiểm tra kết nối mạng, bảng app_state và chính sách RLS trong Supabase.'
            : 'Không tải được dữ liệu. Kiểm tra bảng app_state và chính sách RLS trong Supabase.');
          setDataLoading(false);
        })
        .finally(() => {
          if (timeoutId !== undefined) window.clearTimeout(timeoutId);
        });

      return () => {
        active = false;
      };
    }
  }, [authLoading, currentUser?.id, loadAttempt]);

  useEffect(() => {
    const client = supabase;
    if (!currentUser || dataReadyForUserId !== currentUser.id || !client) return;
    const data: PersistedAppData = {
      rooms,
      tenants,
      coResidents,
      contracts,
      initialPayments,
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
    const serialized = JSON.stringify(data);
    if (serialized === lastSavedPayload.current) return;

    const userId = currentUser.id;
    const expectedRevision = revisionRef.current;
    const timer = window.setTimeout(async () => {
      setSaveStatus('saving');
      setSaveError(null);
      try {
        const { data: updated, error } = await client
          .from('app_state')
          .update({
            data,
            revision: expectedRevision + 1,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)
          .eq('revision', expectedRevision)
          .select('revision')
          .maybeSingle();

        if (error) throw error;
        if (!updated) {
          setSaveStatus('conflict');
          setSaveError('Dữ liệu đã được đổi ở thiết bị khác. Tải bản mới nhất để tránh ghi đè.');
          return;
        }

        revisionRef.current = updated.revision;
        lastSavedPayload.current = serialized;
        setSaveStatus('saved');
      } catch (error) {
        console.error('Không thể lưu dữ liệu lên Supabase.', error);
        setSaveStatus('error');
        setSaveError('Không lưu được thay đổi. Kiểm tra kết nối rồi thử lưu lại.');
      }
    }, 600);

    return () => window.clearTimeout(timer);
  }, [
    currentUser?.id,
    dataReadyForUserId,
    saveAttempt,
    rooms,
    tenants,
    coResidents,
    contracts,
    initialPayments,
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

  const retryLoadData = () => setLoadAttempt(attempt => attempt + 1);
  const retrySave = () => setSaveAttempt(attempt => attempt + 1);

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
    if (screenId === 'ACCOUNT' && (!isAuthenticated || !currentUser || isFirstPasswordChangeRequired)) {
      const authScreen: ScreenId = isFirstPasswordChangeRequired ? 'FIRSTPASS' : 'LOGIN';
      setParams({});
      setCurrentScreenId(authScreen);
      setHistoryStack([{ screenId: authScreen }]);
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
  const saveLoginGuard = (failedAttempts: number, lockUntil: number | null) => {
    const nextGuard = { failedAttempts, lockUntil };
    setLoginGuard(nextGuard);
    try {
      if (failedAttempts === 0 && !lockUntil) localStorage.removeItem(LOGIN_GUARD_KEY);
      else localStorage.setItem(LOGIN_GUARD_KEY, JSON.stringify(nextGuard));
    } catch (error) {
      console.error('Không thể lưu giới hạn đăng nhập.', error);
      showToast('Không lưu được trạng thái bảo vệ đăng nhập trên thiết bị này.');
    }
  };

  const login = async (email: string, pass: string) => {
    if (!supabase) return { success: false, error: 'Chưa cấu hình kết nối dữ liệu.' };
    if (loginGuard.lockUntil && Date.now() < loginGuard.lockUntil) {
      const remainingMinutes = Math.ceil((loginGuard.lockUntil - Date.now()) / 60000);
      return { success: false, error: `Đã nhập sai 5 lần. Hãy thử lại sau ${remainingMinutes} phút.` };
    }
    const previousAttempts = loginGuard.lockUntil ? 0 : loginGuard.failedAttempts;
    if (loginGuard.lockUntil) saveLoginGuard(0, null);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: pass });
      if (error) {
        const invalidCredentials = error.message.toLowerCase().includes('invalid login credentials');
        if (!invalidCredentials) return { success: false, error: error.message };
        const failedAttempts = previousAttempts + 1;
        const lockUntil = failedAttempts >= 5 ? Date.now() + LOGIN_LOCK_MS : null;
        saveLoginGuard(lockUntil ? 5 : failedAttempts, lockUntil);
        return {
          success: false,
          error: lockUntil
            ? 'Đã nhập sai 5 lần. Tài khoản tạm khóa 15 phút.'
            : `Email hoặc mật khẩu chưa đúng. Còn ${5 - failedAttempts} lần thử.`
        };
      }
      saveLoginGuard(0, null);
      return { success: true };
    } catch (error) {
      console.error('Không thể đăng nhập Supabase.', error);
      return { success: false, error: 'Không kết nối được máy chủ. Kiểm tra mạng rồi thử lại.' };
    }
  };

  const changeFirstPassword = async (newPass: string, confirmPass: string) => {
    if (!supabase) return { success: false, error: 'Chưa cấu hình kết nối dữ liệu.' };
    if (newPass.length < 12) return { success: false, error: 'Mật khẩu cần có ít nhất 12 ký tự.' };
    if (newPass !== confirmPass) return { success: false, error: 'Hai mật khẩu chưa khớp.' };
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPass,
        data: { must_change_password: false }
      });
      if (error) return { success: false, error: error.message };
      setIsFirstPasswordChangeRequired(false);
      navigate('HOME', {}, true);
      showToast('Đã đổi mật khẩu. Bạn có thể bắt đầu sử dụng hệ thống.');
      return { success: true };
    } catch (error) {
      console.error('Không thể đổi mật khẩu lần đầu.', error);
      return { success: false, error: 'Không đổi được mật khẩu. Vui lòng thử lại.' };
    }
  };

  const forgotPassword = async (email: string) => {
    if (!supabase) return { success: false, message: 'Chưa cấu hình kết nối dữ liệu.' };
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: window.location.origin
      });
      if (error) return { success: false, message: error.message };
      return { success: true, message: 'Nếu email đã đăng ký, hướng dẫn đặt lại mật khẩu sẽ được gửi qua email.' };
    } catch (error) {
      console.error('Không thể gửi email đặt lại mật khẩu.', error);
      return { success: false, message: 'Không gửi được email. Kiểm tra mạng rồi thử lại.' };
    }
  };

  const resetPassword = async (newPass: string) => {
    if (!supabase) return { success: false, error: 'Chưa cấu hình kết nối dữ liệu.' };
    if (newPass.length < 12) return { success: false, error: 'Mật khẩu cần có ít nhất 12 ký tự.' };
    try {
      const { error } = await supabase.auth.updateUser({ password: newPass });
      if (error) return { success: false, error: error.message };
      try {
        const { error: signOutError } = await supabase.auth.signOut({ scope: 'global' });
        if (signOutError) {
          console.error('Đã cập nhật mật khẩu nhưng không thu hồi được toàn bộ phiên.', signOutError);
          await supabase.auth.signOut({ scope: 'local' });
        }
      } catch (signOutError) {
        console.error('Đã cập nhật mật khẩu nhưng không thu hồi được toàn bộ phiên.', signOutError);
        try {
          await supabase.auth.signOut({ scope: 'local' });
        } catch (localSignOutError) {
          console.error('Không thể kết thúc phiên khôi phục mật khẩu hiện tại.', localSignOutError);
        }
      }
      showToast('Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại.');
      navigate('LOGIN', {}, true);
      return { success: true };
    } catch (error) {
      console.error('Không thể cập nhật mật khẩu Supabase.', error);
      return { success: false, error: 'Không cập nhật được mật khẩu. Vui lòng thử lại.' };
    }
  };

  const changePassword = async (
    currentPass: string,
    newPass: string,
    confirmPass: string,
    requestId: string
  ) => {
    const existingRequest = passwordChangeRequestsRef.current.get(requestId);
    if (existingRequest) return existingRequest;
    if (!/^[0-9a-f-]{36}$/i.test(requestId)) {
      return { success: false, error: 'Yêu cầu không hợp lệ. Vui lòng thử lại.', errorCode: 'INVALID_REQUEST' };
    }
    if (passwordChangeLockUntilRef.current && passwordChangeLockUntilRef.current <= Date.now()) {
      passwordChangeFailedAttemptsRef.current = 0;
      passwordChangeLockUntilRef.current = null;
      setPasswordChangeLockUntil(null);
    }
    if (!supabase || !currentUser) {
      return { success: false, error: 'Phiên làm việc đã kết thúc. Vui lòng đăng nhập lại.', errorCode: 'SESSION_INVALID' };
    }
    if (passwordChangeLockUntilRef.current && passwordChangeLockUntilRef.current > Date.now()) {
      return { success: false, error: 'Tạm thời chưa thể đổi mật khẩu. Vui lòng thử lại sau.', errorCode: 'LOCKED' };
    }
    if (!currentPass || !newPass || !confirmPass) {
      return { success: false, error: 'Vui lòng nhập đầy đủ các trường mật khẩu.', errorCode: 'REQUIRED' };
    }
    if (newPass !== confirmPass) {
      return { success: false, error: 'Xác nhận mật khẩu không khớp.', errorCode: 'CONFIRMATION_MISMATCH' };
    }
    if (newPass.length < 12) {
      return { success: false, error: 'Mật khẩu mới cần có ít nhất 12 ký tự.', errorCode: 'PASSWORD_POLICY' };
    }

    const operation = (async () => {
      let updateStarted = false;
      try {
        const { data: before } = await supabase.auth.getSession();
        if (!before.session || before.session.user.id !== currentUser.id) {
          return { success: false, error: 'Phiên làm việc đã kết thúc. Vui lòng đăng nhập lại.', errorCode: 'SESSION_INVALID' };
        }

        const currentPasswordMatches = await verifyPassword(currentUser.email, currentPass);
        const { data: afterVerification } = await supabase.auth.getSession();
        if (!afterVerification.session || afterVerification.session.user.id !== currentUser.id) {
          return { success: false, error: 'Phiên làm việc đã kết thúc. Vui lòng đăng nhập lại.', errorCode: 'SESSION_INVALID' };
        }
        if (!currentPasswordMatches) {
          passwordChangeFailedAttemptsRef.current += 1;
          if (passwordChangeFailedAttemptsRef.current >= PASSWORD_CHANGE_ATTEMPT_LIMIT) {
            const until = Date.now() + PASSWORD_CHANGE_LOCK_MS;
            passwordChangeLockUntilRef.current = until;
            setPasswordChangeLockUntil(until);
            await logout();
            showToast('Tạm thời chưa thể đổi mật khẩu. Vui lòng thử lại sau 15 phút.');
            return { success: false, error: 'Đã nhập sai mật khẩu hiện tại 5 lần. Vui lòng thử lại sau 15 phút.', errorCode: 'LOCKED_OUT' };
          }
          return { success: false, error: 'Mật khẩu hiện tại không chính xác.', errorCode: 'CURRENT_PASSWORD_INCORRECT' };
        }
        if (newPass === currentPass) {
          return { success: false, error: 'Mật khẩu mới phải khác mật khẩu hiện tại.', errorCode: 'PASSWORD_UNCHANGED' };
        }

        updateStarted = true;
        const { error: updateError } = await supabase.auth.updateUser({ password: newPass });
        if (updateError) {
          return { success: false, error: updateError.message, errorCode: 'UPDATE_FAILED' };
        }

        passwordChangeFailedAttemptsRef.current = 0;
        passwordChangeLockUntilRef.current = null;
        setPasswordChangeLockUntil(null);
        try {
          const { error: revokeError } = await supabase.auth.signOut({ scope: 'others' });
          if (revokeError) {
            console.error('Đổi mật khẩu thành công nhưng không thu hồi được các phiên khác.', revokeError);
            addAuditLog('CANH_BAO_THU_HOI_PHIEN', 'AUTH', currentUser.id, 'Đổi mật khẩu thành công nhưng thu hồi phiên khác không hoàn tất');
          }
        } catch (revokeError) {
          console.error('Đổi mật khẩu thành công nhưng lỗi khi thu hồi các phiên khác.', revokeError);
          addAuditLog('CANH_BAO_THU_HOI_PHIEN', 'AUTH', currentUser.id, 'Đổi mật khẩu thành công nhưng thu hồi phiên khác không hoàn tất');
        }
        addAuditLog('DOI_MAT_KHAU', 'AUTH', currentUser.id, 'Đổi mật khẩu thành công và yêu cầu thu hồi các phiên cũ');
        showToast('Đổi mật khẩu thành công!');
        return { success: true };
      } catch (error) {
        console.error('Không thể đổi mật khẩu Supabase.', error);
        return updateStarted
          ? { success: false, error: 'Chưa xác định được kết quả đổi mật khẩu. Vui lòng đăng nhập lại hoặc thực hiện quy trình khôi phục tài khoản.', errorCode: 'UNKNOWN_RESULT' }
          : { success: false, error: 'Không thể xác minh yêu cầu lúc này. Vui lòng thử lại sau.', errorCode: 'UPDATE_FAILED' };
      }
    })();
    passwordChangeRequestsRef.current.set(requestId, operation);
    return operation;
  };

  const logout = async () => {
    if (!supabase) return;
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Không thể đăng xuất Supabase.', error);
        showToast('Không đăng xuất được. Vui lòng thử lại.');
        return;
      }
      showToast('Đã đăng xuất.');
    } catch (error) {
      console.error('Không thể đăng xuất Supabase.', error);
      showToast('Không đăng xuất được. Vui lòng thử lại.');
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setSessionRemainingMinutes(30);
      return;
    }

    let lastActivity = Date.now();
    let expirationStarted = false;
    const updateActivity = () => {
      lastActivity = Date.now();
    };
    const activityEvents: (keyof WindowEventMap)[] = ['pointerdown', 'keydown', 'touchstart', 'scroll'];
    activityEvents.forEach(event => window.addEventListener(event, updateActivity, { passive: true }));

    const timer = window.setInterval(() => {
      const remaining = Math.max(0, SESSION_IDLE_LIMIT_MS - (Date.now() - lastActivity));
      setSessionRemainingMinutes(Math.ceil(remaining / 60000));
      if (remaining === 0 && !expirationStarted && supabase) {
        expirationStarted = true;
        supabase.auth.signOut().then(({ error }) => {
          if (error) {
            console.error('Không thể kết thúc phiên đã hết hạn.', error);
            showToast('Phiên đã hết hạn nhưng chưa đăng xuất được. Hãy thử đăng xuất lại.');
          } else {
            showToast('Phiên đã hết hạn. Vui lòng đăng nhập lại.');
          }
        }).catch(error => {
          console.error('Không thể kết thúc phiên đã hết hạn.', error);
          showToast('Phiên đã hết hạn nhưng chưa đăng xuất được. Hãy thử đăng xuất lại.');
        });
      }
    }, 1000);

    return () => {
      window.clearInterval(timer);
      activityEvents.forEach(event => window.removeEventListener(event, updateActivity));
    };
  }, [isAuthenticated]);

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
    const room = rooms.find(item => item.id === terms.roomId);
    const tenant = tenants.find(item => item.id === terms.tenantId);
    const startDate = parseLocalDate(terms.startDate);
    const endDate = parseLocalDate(terms.endDate);
    if (!room || room.status !== 'TRONG') return { success: false, error: 'Chỉ chọn được phòng đang trống.' };
    if (!tenant || tenant.status !== 'TIEM_NANG') return { success: false, error: 'Chỉ chọn được hồ sơ khách tiềm năng.' };
    if (!Number.isInteger(terms.durationMonths) || terms.durationMonths < 1 ||
      !Number.isFinite(terms.monthlyRent) || terms.monthlyRent <= 0 ||
      !Number.isFinite(terms.serviceFeePerMonth) || terms.serviceFeePerMonth < 0) {
      return { success: false, error: 'Thời hạn, tiền thuê hoặc phí dịch vụ chưa hợp lệ.' };
    }
    if (terms.depositAmount !== terms.monthlyRent || terms.firstMonthRent !== terms.monthlyRent) {
      return { success: false, error: 'Tiền cọc và tháng thuê đầu phải bằng đúng một tháng tiền thuê.' };
    }
    if (!startDate || !endDate || endDate <= startDate) {
      return { success: false, error: 'Ngày bắt đầu và ngày kết thúc chưa hợp lệ.' };
    }
    setRentalTerms(prev => ({ ...prev, [terms.roomId]: terms }));
    addAuditLog('THOA_THUAN_DIEU_KIEN_THUE', 'RENTAL_TERMS', terms.roomId, `Thống nhất điều kiện thuê cho phòng ${terms.roomId}`);
    showToast('Đã lưu thỏa thuận điều kiện thuê.');
    return { success: true };
  };

  const createDraftContract = (terms: RentalTerms) => {
    const room = rooms.find(item => item.id === terms.roomId);
    const tenant = tenants.find(item => item.id === terms.tenantId);
    const savedTerms = rentalTerms[terms.roomId];
    if (!room || room.status !== 'TRONG' || !tenant || tenant.status !== 'TIEM_NANG' ||
      !savedTerms || savedTerms.tenantId !== tenant.id) {
      return { success: false, contractId: '', error: 'Phòng, khách hoặc thỏa thuận thuê không còn hợp lệ.' };
    }
    const newContractId = `HD-${new Date().getFullYear()}-${Date.now()}`;
    const newContract: Contract = {
      id: newContractId,
      code: newContractId,
      roomId: savedTerms.roomId,
      tenantId: savedTerms.tenantId,
      rentalId: `LT-${terms.roomId}-${Date.now().toString().slice(-4)}`,
      type: 'LAN_DAU',
      depositAmount: savedTerms.depositAmount, // 1 month
      isInheritedDeposit: false,
      firstMonthRent: savedTerms.firstMonthRent,
      monthlyRent: savedTerms.monthlyRent,
      startDate: savedTerms.startDate,
      endDate: savedTerms.endDate,
      status: 'NHAP',
      terms: `Hợp đồng thuê phòng ${savedTerms.roomId} thời hạn ${savedTerms.durationMonths} tháng. Tiền cọc 1 tháng (${savedTerms.depositAmount.toLocaleString()}đ), tiền thuê tháng đầu (${savedTerms.firstMonthRent.toLocaleString()}đ).`,
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
    const contract = contracts.find(c => c.id === contractId);
    if (!contract || contract.status !== 'NHAP') return { success: false, error: 'Chỉ ghi nhận hợp đồng đang ở trạng thái Nháp.' };
    if (!parseLocalDate(signedDate) || !proofUrl.trim()) {
      return { success: false, error: 'Cần nhập ngày ký hợp lệ và chứng từ hợp đồng đã ký.' };
    }
    setContracts(prev => prev.map(c => c.id === contractId ? {
      ...c,
      status: 'DA_KY',
      signedDate,
      paperContractProofUrl: proofUrl.trim(),
      updatedAt: new Date().toISOString().split('T')[0]
    } : c));
    addAuditLog('GHI_NHAN_HOP_DONG_DA_KY', 'CONTRACT', contractId, `Ghi nhận hợp đồng giấy đã ký ngày ${signedDate}`);
    showToast('Đã ghi nhận hợp đồng giấy đã ký thành công!');
    return { success: true };
  };

  const renewContract = (parentContractId: string, durationMonths: number, startDate: string, endDate: string) => {
    const parent = contracts.find(c => c.id === parentContractId);
    if (!parent || parent.status !== 'HIEU_LUC') return { success: false, contractId: '', error: 'Chỉ gia hạn được hợp đồng đang có hiệu lực.' };
    if (!Number.isInteger(durationMonths) || durationMonths < 1 ||
      !parseLocalDate(startDate) || !parseLocalDate(endDate) ||
      parseLocalDate(endDate)! <= parseLocalDate(startDate)!) {
      return { success: false, contractId: '', error: 'Thời hạn hoặc ngày gia hạn chưa hợp lệ.' };
    }

    const newContractId = `${parent.code}-NT-${Date.now()}`;
    const newContract: Contract = {
      id: newContractId,
      code: newContractId,
      roomId: parent.roomId,
      tenantId: parent.tenantId,
      rentalId: `LT-${parent.roomId}-NT-${Date.now()}`,
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
    const parent = contract.parentContractId && contracts.find(c => c.id === contract.parentContractId);
    if (contract.type !== 'NOI_TIEP' || contract.status !== 'NHAP' || !parent || parent.status !== 'HIEU_LUC') {
      return { success: false, error: 'Hợp đồng nối tiếp hoặc hợp đồng hiện tại không còn hợp lệ.' };
    }
    if (!parseLocalDate(signedDate) || !proofUrl.trim()) {
      return { success: false, error: 'Cần nhập ngày ký hợp lệ và chứng từ hợp đồng đã ký.' };
    }

    setContracts(prev => prev.map(c => c.id === contractId ? {
      ...c,
      status: 'HIEU_LUC',
      signedDate,
      paperContractProofUrl: proofUrl.trim(),
      updatedAt: new Date().toISOString().split('T')[0]
    } : c.id === parent.id ? { ...c, status: 'KET_THUC' } : c));
    setRooms(prev => prev.map(room => room.id === contract.roomId ? {
      ...room,
      status: 'DANG_THUE',
      currentContractId: contract.id,
      currentTenantId: contract.tenantId,
      currentRentalId: contract.rentalId,
      updatedAt: new Date().toISOString().split('T')[0]
    } : room));

    // Nghiệp vụ: Tự động hủy kế hoạch trả phòng cũ theo sự kiện Hợp đồng nối tiếp có hiệu lực
    setCheckoutPlans(prev => prev.map(p => p.rentalId === parent.rentalId && p.status === 'DANG_CHO' ? {
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
    if (room.status !== 'TRONG') return { success: false, error: 'Chỉ xác nhận tiền nhận phòng cho phòng đang trống.' };
    const contract = contracts.find(c => c.roomId === roomId && c.type === 'LAN_DAU' && c.status === 'DA_KY');
    if (!contract) return { success: false, error: 'Cần có hợp đồng lần đầu đã ký trước khi xác nhận tiền.' };
    if (initialPayments.some(payment => payment.contractId === contract.id)) {
      return { success: false, error: 'Khoản thanh toán ban đầu của hợp đồng này đã được xác nhận.' };
    }
    if (!refCode.trim()) return { success: false, error: 'Cần nhập mã giao dịch ngân hàng đã đối chiếu.' };
    if (initialPayments.some(payment => payment.bankTransactionRef === refCode.trim())) {
      return { success: false, error: 'Mã giao dịch này đã được dùng cho một khoản thanh toán khác.' };
    }
    const expectedTotal = contract.depositAmount + contract.firstMonthRent;
    if (amount !== expectedTotal) {
      return {
        success: false,
        error: `Số tiền cần khớp đúng tiền cọc (${contract.depositAmount.toLocaleString()} đ) và tiền thuê đầu (${contract.firstMonthRent.toLocaleString()} đ), tổng ${expectedTotal.toLocaleString()} đ.`
      };
    }

    const payment: InitialPayment = {
      id: `IP-${contract.id}`,
      contractId: contract.id,
      roomId,
      tenantId: contract.tenantId,
      amount,
      bankTransactionRef: refCode.trim(),
      receivedDate: new Date().toLocaleDateString('vi-VN'),
      confirmedBy: currentUser?.fullName || 'Chủ nhà'
    };
    setInitialPayments(prev => [...prev, payment]);
    addAuditLog('XAC_NHAN_THANH_TOAN_BAN_DAU', 'PAYMENT', payment.id, `Đã đối chiếu đủ ${amount.toLocaleString()} đ cho hợp đồng ${contract.code}, mã GD ${refCode.trim()}`);
    showToast('Đã xác nhận thanh toán ban đầu (1 tháng cọc + 1 tháng thuê đầu) thành công!');
    return { success: true };
  };

  const checkInRoom = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return { success: false, error: 'Phòng không tồn tại.' };
    if (room.status !== 'TRONG') return { success: false, error: 'Phòng phải ở trạng thái Trống mới được nhận phòng.' };

    const contract = contracts.find(c => c.roomId === roomId && c.status === 'DA_KY');
    const handover = contract && handoverProtocols.find(h =>
      h.roomId === roomId && h.contractId === contract.id && h.rentalId === contract.rentalId &&
      h.paperHandoverSigned && h.keysCardsHandedOver
    );

    const missing: string[] = [];
    if (!contract) missing.push('Chưa có hợp đồng giấy đã ký hai bên');
    if (contract?.type === 'LAN_DAU' && !initialPayments.some(payment => payment.contractId === contract.id)) {
      missing.push('Chưa xác nhận đủ tiền cọc và tiền thuê tháng đầu');
    }
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
      setTenants(prev => prev.map(tenant => tenant.id === contract.tenantId ? {
        ...tenant,
        status: 'DANG_THUE',
        currentRoomId: roomId,
        updatedAt: new Date().toISOString().split('T')[0]
      } : tenant));
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
    const room = rooms.find(item => item.id === roomId);
    const activeRentalId = room?.currentRentalId || contracts.find(contract =>
      contract.roomId === roomId && contract.status === 'DA_KY'
    )?.rentalId;
    if (!activeRentalId || items.some(item => item.roomId !== roomId || item.rentalId !== activeRentalId)) {
      showToast('Danh mục tài sản chưa gắn đúng lượt thuê của phòng.');
      return;
    }
    setAssetItems(prev => [...prev.filter(item => item.rentalId !== activeRentalId), ...items]);
    addAuditLog('LUU_KIEM_KE_TAI_SAN', 'ASSET', roomId, `Lưu danh mục kiểm kê ${items.length} tài sản phòng ${roomId}`);
    showToast('Đã lưu kiểm kê tài sản phòng.');
  };

  const saveAssetStatusReport = (report: Omit<AssetStatusReport, 'id'>) => {
    const room = rooms.find(item => item.id === report.roomId);
    const activeRentalId = room?.currentRentalId || contracts.find(contract =>
      contract.roomId === report.roomId && contract.status === 'DA_KY'
    )?.rentalId;
    if (!activeRentalId || report.rentalId !== activeRentalId || !report.overallDescription.trim() || report.evidenceImages.length === 0) {
      showToast('Cần lượt thuê, mô tả hiện trạng và ít nhất một chứng cứ thực tế.');
      return { success: false };
    }
    const newReport: AssetStatusReport = {
      ...report,
      id: `RP-${Date.now().toString().slice(-4)}`
    };
    setAssetReports(prev => [newReport, ...prev]);
    addAuditLog('LUU_HIEN_TRANG_BAN_GIAO', 'ASSET', report.roomId, 'Ghi nhận hiện trạng và hình ảnh bàn giao');
    showToast('Đã lưu hiện trạng bàn giao phòng.');
    return { success: true };
  };

  const signHandoverProtocol = (roomId: string, contractId: string, proofUrl: string, keysCardsHandedOver: boolean) => {
    const room = rooms.find(item => item.id === roomId);
    const contract = contracts.find(item => item.id === contractId && item.roomId === roomId);
    if (!room || !contract) return { success: false, error: 'Không tìm thấy phòng hoặc hợp đồng tương ứng.' };
    if (contract.status !== 'DA_KY') return { success: false, error: 'Chỉ lập biên bản bàn giao cho hợp đồng đã ký.' };
    if (!proofUrl.trim()) return { success: false, error: 'Cần nhập đường dẫn hoặc thông tin chứng từ biên bản đã ký.' };
    if (!keysCardsHandedOver) return { success: false, error: 'Cần xác nhận đã bàn giao chìa khóa và thẻ từ.' };
    const newProtocol: AssetHandoverProtocol = {
      id: `BB-${contract.id}`,
      roomId,
      rentalId: contract.rentalId,
      contractId,
      date: new Date().toLocaleDateString('vi-VN'),
      paperHandoverSigned: true,
      keysCardsHandedOver,
      paperProofUrl: proofUrl.trim(),
      notes: 'Hai bên đã ký biên bản bàn giao giấy đầy đủ.',
      status: 'DA_KY'
    };
    setHandoverProtocols(prev => [...prev.filter(p => p.contractId !== contractId), newProtocol]);
    addAuditLog('KY_BIEN_BAN_NHAN_PHONG', 'ASSET', roomId, 'Ghi nhận chữ ký biên bản nhận phòng giấy');
    showToast('Đã ghi nhận ký biên bản nhận phòng giấy.');
    return { success: true };
  };

  const createIncident = (data: Omit<AssetIncident, 'id' | 'code'>) => {
    const room = rooms.find(item => item.id === data.roomId);
    const rentalExists = room?.currentRentalId === data.rentalId || contracts.some(contract =>
      contract.roomId === data.roomId && contract.rentalId === data.rentalId && contract.status === 'DA_KY'
    );
    if (!rentalExists || !data.assetName.trim() || !data.description.trim() || !data.actionStep.trim()) {
      showToast('Cần phòng, lượt thuê và thông tin sự cố hợp lệ.');
      return { success: false, incidentId: '' };
    }
    const count = incidents.length + 1;
    const code = `SC-${new Date().getFullYear()}-${count.toString().padStart(3, '0')}`;
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
    const room = rooms.find(item => item.id === roomId);
    if (!room?.currentRentalId) {
      showToast('Chỉ tạo kế hoạch trả cho phòng đang có lượt thuê.');
      return;
    }
    if (!parseLocalDate(plannedDate)) {
      showToast('Ngày trả phòng dự kiến không hợp lệ.');
      return;
    }
    if (checkoutPlans.some(plan => plan.rentalId === room.currentRentalId && plan.status === 'DANG_CHO')) {
      showToast('Lượt thuê này đã có kế hoạch trả đang chờ.');
      return;
    }
    const newPlan: CheckoutPlan = {
      id: `PL-${room.currentRentalId}`,
      roomId,
      rentalId: room.currentRentalId,
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
    setCheckoutPlans(prev => [...prev.filter(p => p.rentalId !== newPlan.rentalId), newPlan]);
    // Cập nhật trạng thái phòng sang SẮP TRẢ nếu đang thuê
    setRooms(prev => prev.map(r => r.id === roomId && r.status === 'DANG_THUE' ? { ...r, status: 'SAP_TRA' } : r));
    addAuditLog('GHI_KE_HOACH_TRA_PHONG', 'CHECKOUT', roomId, `Ghi ngày dự kiến trả phòng: ${plannedDate} qua ${channel}`);
    showToast(`Đã lưu kế hoạch trả phòng ngày ${plannedDate}. Phòng chuyển sang Sắp trả.`);
  };

  const editCheckoutPlan = (roomId: string, newDate: string, channel: string, reason: string) => {
    const room = rooms.find(item => item.id === roomId);
    if (!room?.currentRentalId || !parseLocalDate(newDate) || !reason.trim()) {
      showToast('Cần lượt thuê đang hoạt động, ngày hợp lệ và lý do đổi lịch.');
      return;
    }
    const planExists = checkoutPlans.some(p => p.roomId === roomId && p.rentalId === room.currentRentalId && p.status === 'DANG_CHO');
    if (!planExists) {
      showToast('Không tìm thấy kế hoạch trả đang chờ cho lượt thuê này.');
      return;
    }
    setCheckoutPlans(prev => prev.map(p => p.roomId === roomId && p.rentalId === room.currentRentalId && p.status === 'DANG_CHO' ? {
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
    const room = rooms.find(item => item.id === roomId);
    if (!room?.currentRentalId || !content.trim() || (newDate && !parseLocalDate(newDate))) {
      showToast('Cần lượt thuê đang hoạt động và nội dung phản hồi hợp lệ.');
      return;
    }
    setCheckoutPlans(prev => prev.map(p => p.roomId === roomId && p.rentalId === room.currentRentalId && p.status === 'DANG_CHO' ? {
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
    const room = rooms.find(item => item.id === roomId);
    if (!room?.currentRentalId) {
      showToast('Không có lượt thuê đang hoạt động để lập biên bản trả phòng.');
      return { success: false, protocolId: '' };
    }
    const existingProtocol = checkoutProtocols.find(protocol => protocol.rentalId === room.currentRentalId);
    if (existingProtocol && existingProtocol.status !== 'HOAN_TAT') {
      return { success: true, protocolId: existingProtocol.id };
    }
    const protocolId = `CK-${room.currentRentalId}`;
    const newProtocol: CheckoutProtocol = {
      id: protocolId,
      roomId,
      rentalId: room.currentRentalId,
      draftDate: new Date().toLocaleDateString('vi-VN'),
      actualReturnConfirmed: false,
      isPendingResolution: false,
      paperProtocolSigned: false,
      status: 'NHAP',
      verifiedCheckoutConditions: false
    };
    setCheckoutProtocols(prev => [...prev.filter(p => p.rentalId !== newProtocol.rentalId), newProtocol]);
    addAuditLog('TAO_BIEN_BAN_TRA_NHAP', 'CHECKOUT', roomId, 'Khởi tạo biên bản trả phòng nháp');
    showToast('Đã lập dự thảo biên bản trả phòng.');
    return { success: true, protocolId };
  };

  const confirmActualReturn305 = (roomId: string, finalElectric: number, finalWater: number) => {
    const room = rooms.find(item => item.id === roomId);
    const protocol = checkoutProtocols.find(p => p.roomId === roomId && p.rentalId === room?.currentRentalId);
    if (!room?.currentRentalId || !protocol) return { success: false, error: 'Chưa lập biên bản trả cho lượt thuê hiện tại.' };
    if (!Number.isFinite(finalElectric) || !Number.isFinite(finalWater) || finalElectric < 0 || finalWater < 0) {
      return { success: false, error: 'Chỉ số điện nước phải là số không âm.' };
    }
    const lastMeterReading = meterReadings
      .filter(reading => reading.roomId === roomId && reading.rentalId === room.currentRentalId)
      .sort((a, b) => a.periodId.localeCompare(b.periodId))
      .at(-1);
    if (lastMeterReading && (finalElectric < lastMeterReading.electricNew || finalWater < lastMeterReading.waterNew)) {
      return { success: false, error: 'Chỉ số chốt lúc trả không được nhỏ hơn chỉ số kỳ gần nhất.' };
    }
    setCheckoutProtocols(prev => prev.map(p => p.id === protocol.id ? {
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
    const room = rooms.find(item => item.id === roomId);
    const protocol = checkoutProtocols.find(p => p.roomId === roomId && p.rentalId === room?.currentRentalId);
    if (!room?.currentRentalId || !protocol) return { success: false, error: 'Chưa lập biên bản trả cho lượt thuê hiện tại.' };
    if (!reason.trim()) return { success: false, error: 'Cần ghi rõ phần bàn giao còn vướng.' };
    setCheckoutProtocols(prev => prev.map(p => p.id === protocol.id ? {
      ...p,
      isPendingResolution: true,
      pendingReason: reason,
      status: 'CHUA_XONG'
    } : p));
    // Cập nhật trạng thái phòng thành CHƯA BÀN GIAO XONG (KHÔNG được chuyển Trống)
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, status: 'CHUA_BAN_GIAO_XONG' } : r));
    addAuditLog('CHUA_BAN_GIAO_XONG', 'CHECKOUT', roomId, `Ghi nhận chưa bàn giao xong: ${reason}`);
    showToast('Đã ghi nhận Chưa bàn giao xong. Phòng giữ nguyên trạng thái chưa thể giải phóng.');
    return { success: true };
  };

  const saveAssetComparison = (roomId: string, itemsDiff: { id: string; difference: string; compAmount: number; isDamaged: boolean }[]) => {
    const room = rooms.find(item => item.id === roomId);
    const protocol = checkoutProtocols.find(item => item.roomId === roomId && item.rentalId === room?.currentRentalId);
    if (!protocol?.actualReturnConfirmed || protocol.isPendingResolution) {
      showToast('Chỉ đối chiếu tài sản sau khi đã nhận lại phòng thực tế và không còn vướng mắc.');
      return;
    }
    if (itemsDiff.some(item => !Number.isFinite(item.compAmount) || item.compAmount < 0 ||
      (item.isDamaged && !item.difference.trim()))) {
      showToast('Mỗi khoản hư hại cần có mô tả và mức khấu trừ hợp lệ.');
      return;
    }
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
    const room = rooms.find(item => item.id === roomId);
    const protocol = checkoutProtocols.find(p => p.roomId === roomId && p.rentalId === room?.currentRentalId);
    const settlement = depositSettlements.find(item => item.rentalId === room?.currentRentalId);
    if (!protocol?.actualReturnConfirmed || protocol.isPendingResolution) {
      return { success: false, error: 'Cần xác nhận đã nhận lại phòng và xử lý xong vướng mắc trước.' };
    }
    if (!settlement || !['DA_CHOT_HOAN_TIEN', 'DA_CHOT_THU_THEM'].includes(settlement.status)) {
      return { success: false, error: 'Cần chốt quyết toán cọc trước khi ký biên bản cuối.' };
    }
    if (!proofUrl.trim()) return { success: false, error: 'Cần nhập mã chứng từ hoặc căn cứ biên bản đã ký.' };
    setCheckoutProtocols(prev => prev.map(p => p.id === protocol.id ? {
      ...p,
      paperProtocolSigned: true,
      paperProofUrl: proofUrl.trim(),
      status: 'CHO_QUYET_TOAN'
    } : p));
    addAuditLog('HOAN_TAT_BIEN_BAN_TRA', 'CHECKOUT', roomId, 'Ghi nhận hai bên đã ký biên bản trả phòng giấy');
    showToast('Đã hoàn thiện biên bản trả phòng giấy.');
    return { success: true };
  };

  const verifyReturnAndFreeRoom = (roomId: string) => {
    const room = rooms.find(item => item.id === roomId);
    const protocol = checkoutProtocols.find(p => p.roomId === roomId && p.rentalId === room?.currentRentalId);
    const settlement = depositSettlements.find(s => s.roomId === roomId && s.rentalId === room?.currentRentalId);

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

    setCheckoutProtocols(prev => prev.map(p => p.rentalId === room?.currentRentalId
      ? { ...p, status: 'HOAN_TAT', verifiedCheckoutConditions: true }
      : p
    ));
    const currentContract = contracts.find(contract =>
      contract.id === room?.currentContractId && contract.rentalId === room?.currentRentalId
    );
    if (currentContract) {
      setContracts(prev => prev.map(contract => contract.id === currentContract.id ? { ...contract, status: 'KET_THUC' } : contract));
    }
    setCheckoutPlans(prev => prev.map(plan =>
      plan.rentalId === room?.currentRentalId && plan.status === 'DANG_CHO'
        ? { ...plan, status: 'DA_THUC_HIEN' }
        : plan
    ));

    addAuditLog('GIAI_PHONG_PHONG_TRONG', 'ROOM', roomId, 'Kiểm tra đủ mọi điều kiện: giải phóng phòng thành TRỐNG');
    showToast(`Đã giải phóng phòng ${roomId} thành TRỐNG thành công! Sẵn sàng cho lượt thuê mới.`);
    return { success: true };
  };

  // Billing methods
  const recordMeterReading = (
    periodId: string,
    roomId: string,
    elNew: number,
    waNew: number,
    elProof?: string,
    waProof?: string,
    elOldInput?: number,
    waOldInput?: number
  ) => {
    const existing = meterReadings.find(m => m.periodId === periodId && m.roomId === roomId);
    const room = rooms.find(r => r.id === roomId);
    if (!room) return { success: false, error: 'Phòng không tồn tại.' };
    if (!room.currentRentalId || !room.currentTenantId) {
      return { success: false, error: 'Phòng chưa có lượt thuê đang hoạt động nên không thể ghi chỉ số.' };
    }

    const previousReading = meterReadings
      .filter(m => m.roomId === roomId && m.id !== existing?.id)
      .sort((a, b) => a.periodId.localeCompare(b.periodId))
      .at(-1);
    const elOld = existing?.electricOld ?? previousReading?.electricNew ?? elOldInput;
    const waOld = existing?.waterOld ?? previousReading?.waterNew ?? waOldInput;
    if (elOld === undefined || waOld === undefined || !Number.isFinite(elOld) || !Number.isFinite(waOld) || elOld < 0 || waOld < 0) {
      return { success: false, error: 'Chưa có chỉ số kỳ trước. Hãy nhập chỉ số đầu kỳ thực tế trước khi lưu.' };
    }

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
      rentalId: room.currentRentalId,
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
    const period = periods.find(p => p.id === periodId);
    const contract = contracts.find(c =>
      c.id === room?.currentContractId && c.rentalId === room.currentRentalId && c.tenantId === room.currentTenantId
    );

    if (!room || !reading || !period || !contract) {
      showToast('Thiếu phòng, hợp đồng hoặc chỉ số hợp lệ nên chưa thể tính tiền.');
      return { success: false };
    }
    if (reading.rentalId !== contract.rentalId) {
      showToast('Chỉ số điện nước không thuộc lượt thuê hiện tại của phòng.');
      return { success: false };
    }

    const serviceMonthMatch = period.serviceForPeriodMonthYear.match(/^(\d{1,2})\/(\d{4})$/);
    if (!serviceMonthMatch) {
      showToast('Kỳ tính tiền có tháng dịch vụ không hợp lệ.');
      return { success: false };
    }
    const serviceMonthDate = new Date(Number(serviceMonthMatch[2]), Number(serviceMonthMatch[1]) - 1, 1);
    const activeTariff = tariffs
      .map(tariff => ({ tariff, effectiveDate: parseLocalDate(tariff.effectiveFrom) }))
      .filter(entry => entry.effectiveDate && entry.effectiveDate <= serviceMonthDate)
      .sort((a, b) => b.effectiveDate!.getTime() - a.effectiveDate!.getTime())[0]?.tariff;
    if (!activeTariff) {
      showToast(`Chưa có đơn giá áp dụng cho kỳ ${period.serviceForPeriodMonthYear}.`);
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
    const rentMonthMatch = period.rentForPeriodMonthYear.match(/^(\d{1,2})\/(\d{4})$/);
    if (!rentMonthMatch) {
      showToast('Kỳ tính tiền có tháng thuê không hợp lệ.');
      return { success: false };
    }
    const contractStartDate = parseLocalDate(contract.startDate);
    const isFirstRentAlreadyPaid = contract.type === 'LAN_DAU' &&
      initialPayments.some(payment => payment.contractId === contract.id) &&
      contractStartDate?.getFullYear() === Number(rentMonthMatch[2]) &&
      contractStartDate.getMonth() + 1 === Number(rentMonthMatch[1]);
    const nextMonthRent = isFirstRentAlreadyPaid ? 0 : contract.monthlyRent;
    const totalDue = nextMonthRent + totalServiceAmount;

    const calcId = `CALC-${periodId}-${roomId}`;
    const newCalc: PeriodCalculation = {
      id: calcId,
      periodId,
      roomId,
      rentalId: contract.rentalId,
      tenantId: contract.tenantId,
      nextMonthRent,
      rentPeriodLabel: isFirstRentAlreadyPaid
        ? `Tiền thuê tháng ${period.rentForPeriodMonthYear} đã thu lúc nhận phòng`
        : `Tiền thuê tháng ${period.rentForPeriodMonthYear} (trả trước)`,
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
      isReconciled: false
    };

    setCalculations(prev => [...prev.filter(c => !(c.periodId === periodId && c.roomId === roomId)), newCalc]);
    setNotices(prev => prev.map(notice =>
      notice.calcId === calcId && notice.status === 'DANG_HIEU_LUC'
        ? { ...notice, status: 'DA_THAY_THE' }
        : notice
    ));
    const periodRooms = rooms.filter(item =>
      ['DANG_THUE', 'SAP_TRA', 'CHUA_BAN_GIAO_XONG'].includes(item.status) && Boolean(item.currentRentalId)
    );
    const otherRoomCalculations = calculations.filter(calc => calc.periodId === periodId && calc.roomId !== roomId);
    const hasAllCalculations = periodRooms.every(item =>
      item.id === roomId || otherRoomCalculations.some(calc => calc.roomId === item.id)
    );
    setPeriods(prev => prev.map(item => item.id === periodId
      ? { ...item, status: hasAllCalculations ? 'DA_TINH_TIEN' : 'CHUA_CHOT' }
      : item
    ));
    addAuditLog('TINH_TIEN_KY', 'BILLING', roomId, `Tính tiền kỳ ${periodId}: Thuê tới ${nextMonthRent.toLocaleString()} đ, Dịch vụ ${totalServiceAmount.toLocaleString()} đ = Tổng ${totalDue.toLocaleString()} đ`);
    showToast(`Đã tính tiền kỳ ${periodId} phòng ${room.roomNumber}: ${totalDue.toLocaleString()} VNĐ`);
    return { success: true, calcId };
  };

  const reconcilePeriodCalculation = (calcId: string, notes: string) => {
    if (!notes.trim()) {
      showToast('Hãy ghi nội dung đối chiếu trước khi xác nhận.');
      return;
    }
    const updatedCalculations = calculations.map(c => c.id === calcId
      ? { ...c, isReconciled: true, reconciliationNotes: notes.trim() }
      : c
    );
    if (!calculations.some(c => c.id === calcId)) {
      showToast('Không tìm thấy bảng tính tiền cần đối chiếu.');
      return;
    }
    const calculation = calculations.find(c => c.id === calcId)!;
    setCalculations(updatedCalculations);
    const periodRooms = rooms.filter(item =>
      ['DANG_THUE', 'SAP_TRA', 'CHUA_BAN_GIAO_XONG'].includes(item.status) && Boolean(item.currentRentalId)
    );
    const periodIsFullyReconciled = periodRooms.length > 0 && periodRooms.every(room => {
      const roomCalculation = updatedCalculations.find(item => item.periodId === calculation.periodId && item.roomId === room.id);
      return roomCalculation?.isReconciled;
    });
    setPeriods(prev => prev.map(period => period.id === calculation.periodId
      ? { ...period, status: periodIsFullyReconciled ? 'DA_DOI_CHIEU' : 'DA_TINH_TIEN' }
      : period
    ));
    addAuditLog('DOI_CHIEU_KHOAN_PHAI_THU', 'BILLING', calcId, `Đối chiếu số liệu: ${notes}`);
    showToast('Đã đối chiếu khoản phải thu hợp lệ.');
  };

  const issuePaymentNoticeQR = async (calcId: string, dueDate: string) => {
    const calc = calculations.find(c => c.id === calcId);
    const activeBank = bankConfigs.find(b => b.isActive);
    if (!calc || !calc.isReconciled) {
      showToast('Cần đối chiếu xong bảng tính tiền trước khi phát hành thông báo.');
      return { success: false, noticeId: '' };
    }
    if (!activeBank) {
      showToast('Chưa thiết lập tài khoản ngân hàng nhận tiền.');
      return { success: false, noticeId: '' };
    }
    if (!/^\d{6}$/.test(activeBank.bankCode) || !/^\d+$/.test(activeBank.accountNumber)) {
      showToast('Mã ngân hàng VietQR cần đúng 6 chữ số và số tài khoản chỉ gồm chữ số.');
      return { success: false, noticeId: '' };
    }
    const dueDateValue = parseLocalDate(dueDate);
    if (!dueDateValue || dueDateValue < new Date(new Date().setHours(0, 0, 0, 0))) {
      showToast('Ngày đến hạn không hợp lệ.');
      return { success: false, noticeId: '' };
    }
    if (!Number.isFinite(calc.totalDueCurrentPeriod) || calc.totalDueCurrentPeriod <= 0) {
      showToast('Tổng tiền thông báo phải lớn hơn 0.');
      return { success: false, noticeId: '' };
    }
    const currentNotice = notices.find(notice =>
      notice.periodId === calc.periodId && notice.roomId === calc.roomId && notice.status === 'DANG_HIEU_LUC'
    );
    const currentTransaction = currentNotice && transactions.find(tx => tx.noticeId === currentNotice.id);
    if (currentTransaction?.status === 'DA_THU') {
      showToast('Khoản này đã thu đủ, không thể phát hành lại thông báo.');
      return { success: false, noticeId: '' };
    }
    if (currentNotice && overdueDebts.some(debt => debt.noticeId === currentNotice.id)) {
      showToast('Thông báo cũ đã chuyển thành công nợ. Hãy xử lý khoản nợ trước khi phát hành QR mới.');
      return { success: false, noticeId: '' };
    }

    const noticeCode = `TB-${calc.periodId}-${calc.roomId}-${Date.now()}`;
    const transferContent = `${calc.roomId} THANG ${calc.periodId.slice(-2)}`;
    let qrImageUrl: string;
    try {
      const payload = createVietQrPayload(activeBank.bankCode, activeBank.accountNumber, calc.totalDueCurrentPeriod, transferContent);
      qrImageUrl = await QRCode.toDataURL(payload, { width: 320, margin: 2, errorCorrectionLevel: 'M' });
    } catch (error) {
      console.error('Không thể tạo mã QR thanh toán trên thiết bị.', error);
      showToast('Không tạo được mã QR. Kiểm tra thông tin tài khoản rồi thử lại.');
      return { success: false, noticeId: '' };
    }

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
      qrImageUrl,
      status: 'DANG_HIEU_LUC',
      shareLog: []
    };

    setNotices(prev => [...prev.map(notice =>
      notice.periodId === calc.periodId && notice.roomId === calc.roomId && notice.status === 'DANG_HIEU_LUC'
        ? { ...notice, status: 'DA_THAY_THE' as const }
        : notice
    ), newNotice]);

    // Tạo giao dịch theo dõi ở trạng thái CHƯA THU
    const txId = `TX-${noticeCode}`;
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
    if (notice.status !== 'DANG_HIEU_LUC') return { success: false, error: 'Mã QR này đã bị thay thế và không còn hiệu lực.' };
    const transaction = transactions.find(tx => tx.noticeId === noticeId);
    if (!transaction) return { success: false, error: 'Không tìm thấy giao dịch theo dõi của thông báo.' };
    if (transaction.status === 'DA_THU') return { success: false, error: 'Thông báo này đã được xác nhận thu.' };
    if (!Number.isFinite(amount) || !refCode.trim() || !proofUrl?.trim()) {
      return { success: false, error: 'Cần nhập số tiền, mã giao dịch và chứng từ ngân hàng.' };
    }
    if (transactions.some(tx => tx.noticeId !== noticeId && tx.bankTransactionRef === refCode.trim())) {
      return { success: false, error: 'Mã giao dịch ngân hàng này đã được ghi nhận.' };
    }

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
      bankTransactionRef: refCode.trim(),
      paymentProofUrl: proofUrl.trim(),
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
    if (tx.status !== 'DA_THU') return { success: false, error: 'Chỉ sửa được giao dịch đã xác nhận thu.' };
    if (!Number.isFinite(newAmount) || newAmount < 0 || newAmount > tx.totalDue) {
      return { success: false, error: 'Số tiền điều chỉnh phải từ 0 đến tổng tiền của giao dịch.' };
    }
    const notice = notices.find(item => item.id === tx.noticeId);
    const dueDate = notice ? parseLocalDate(notice.dueDate) : null;
    const isOverdue = Boolean(dueDate && dueDate < new Date(new Date().setHours(0, 0, 0, 0)) && newAmount < tx.totalDue);
    const nextStatus: PaymentTransaction['status'] = newAmount === tx.totalDue
      ? 'DA_THU'
      : isOverdue ? 'QUA_HAN' : 'CHUA_THU';

    setTransactions(prev => prev.map(t => t.id === transactionId ? {
      ...t,
      status: nextStatus,
      receivedAmount: newAmount,
      receivedDate: newAmount === tx.totalDue ? t.receivedDate : undefined,
      bankTransactionRef: newAmount === tx.totalDue ? t.bankTransactionRef : undefined,
      paymentProofUrl: newAmount === tx.totalDue ? (proofUrl?.trim() || t.paymentProofUrl) : undefined,
      confirmedBy: newAmount === tx.totalDue ? t.confirmedBy : undefined,
      confirmedAt: newAmount === tx.totalDue ? t.confirmedAt : undefined,
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
    if (tx.status === 'DA_THU' && nextStatus !== 'DA_THU' && notice) {
      setOverdueDebts(prev => {
        const outstanding = Math.max(0, tx.totalDue - newAmount);
        if (!isOverdue) return prev.filter(debt => debt.noticeId !== notice.id);
        const existingDebt = prev.find(debt => debt.noticeId === notice.id);
        if (existingDebt) return prev.map(debt => debt.noticeId === notice.id ? { ...debt, unpaidAmount: outstanding } : debt);
        const daysOverdue = dueDate
          ? Math.floor((Date.now() - dueDate.getTime()) / 86400000)
          : 0;
        return [...prev, {
          id: `DEBT-${notice.id}`,
          noticeId: notice.id,
          roomId: tx.roomId,
          tenantId: tx.tenantId,
          periodId: tx.periodId,
          originalDueDate: notice.dueDate,
          unpaidAmount: outstanding,
          daysOverdue,
          reminderHistory: [],
          tenantReplies: []
        }];
      });
    } else if (nextStatus === 'DA_THU') {
      setOverdueDebts(prev => prev.filter(debt => debt.noticeId !== tx.noticeId));
    }

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
    const room = rooms.find(item => item.id === data.roomId);
    const contract = contracts.find(item => item.id === data.contractId && item.rentalId === data.rentalId);
    if (!room || !contract || room.currentRentalId !== data.rentalId) {
      showToast('Phòng và hợp đồng không khớp với lượt thuê đang quyết toán.');
      return { success: false, settlementId: '' };
    }
    if (depositSettlements.some(item => item.rentalId === data.rentalId)) {
      showToast('Lượt thuê này đã có quyết toán tiền cọc.');
      return { success: false, settlementId: '' };
    }
    const deductions = data.remainingRentalObligation + data.finalServiceObligation +
      data.assetDamageDeduction + data.otherDeductions;
    if ([data.originalDeposit, data.remainingRentalObligation, data.finalServiceObligation, data.assetDamageDeduction, data.otherDeductions]
      .some(value => !Number.isFinite(value) || value < 0)) {
      showToast('Các khoản quyết toán phải là số không âm.');
      return { success: false, settlementId: '' };
    }
    if (data.assetDamageDeduction > 0 && !data.assetDamageNotes.trim()) {
      showToast('Cần ghi căn cứ khấu trừ khi có hư hại tài sản.');
      return { success: false, settlementId: '' };
    }
    const id = `QTC-${data.rentalId}`;
    const newSettlement: DepositSettlement = {
      ...data,
      id,
      netRefundAmount: data.originalDeposit - deductions
    };
    setDepositSettlements(prev => [...prev.filter(s => s.rentalId !== data.rentalId), newSettlement]);
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
          adjustedAmount: data.netRefundAmount ?? s.netRefundAmount,
          by: currentUser?.fullName || 'Chủ nhà'
        }
      ]
    } : s));
    addAuditLog('SUA_QUYET_TOAN_COC', 'DEPOSIT', settlementId, `Chỉnh sửa quyết toán cọc: ${reason}`);
    showToast('Đã cập nhật dự thảo quyết toán cọc.');
  };

  const finalizeDepositSettlement = (settlementId: string, proofUrl: string, method: DepositSettlement['paymentMethod']) => {
    const settlement = depositSettlements.find(item => item.id === settlementId);
    if (!settlement) return { success: false };
    if (settlement.status !== 'NHAP' && settlement.status !== 'CHUA_THONG_NHAT') return { success: false };
    if (!proofUrl.trim()) {
      showToast('Cần nhập mã chứng từ hoặc căn cứ xác nhận đã thực hiện.');
      return { success: false };
    }
    const expectedMethod = settlement.netRefundAmount > 0
      ? 'CHUYEN_KHOAN_HOAN_COC'
      : settlement.netRefundAmount < 0 ? 'THU_THEM_TIEN' : 'DOI_TRU';
    if (method !== expectedMethod) {
      showToast(settlement.netRefundAmount > 0
        ? 'Số dư cọc cần hoàn lại cho khách.'
        : settlement.netRefundAmount < 0
          ? 'Các khoản khấu trừ vượt tiền cọc; cần ghi nhận thu thêm.'
          : 'Tiền cọc và các khoản phải trả đã cân bằng; chọn đối trừ.');
      return { success: false };
    }
    setDepositSettlements(prev => prev.map(s => s.id === settlementId ? {
      ...s,
      status: settlement.netRefundAmount < 0 ? 'DA_CHOT_THU_THEM' : 'DA_CHOT_HOAN_TIEN',
      actualSettlementProofUrl: proofUrl.trim(),
      actualSettledDate: new Date().toLocaleDateString('vi-VN'),
      paymentMethod: method
    } : s));
    addAuditLog('CHOT_QUYET_TOAN_COC', 'DEPOSIT', settlementId, `Ghi nhận quyết toán thực tế, số dư ${settlement.netRefundAmount.toLocaleString()} đ, phương thức ${method}, chứng từ ${proofUrl.trim()}`);
    showToast('Đã chốt kết quả quyết toán cọc thành công!');
    return { success: true };
  };

  // Config methods
  const saveTariffConfig = (newTariff: Omit<TariffConfig, 'id' | 'isActive'>) => {
    const effectiveDate = parseLocalDate(newTariff.effectiveFrom);
    if (!newTariff.versionName.trim() || !effectiveDate ||
      [newTariff.electricityPricePerKwh, newTariff.waterPricePerM3, newTariff.fixedServiceFeePerTenancy, newTariff.garbageFeePerRoom, newTariff.wifiFeePerRoom]
        .some(value => !Number.isFinite(value) || value < 0)) {
      showToast('Cần nhập tên, ngày hiệu lực và các mức giá hợp lệ.');
      return { success: false };
    }
    if (effectiveDate < new Date(new Date().setHours(0, 0, 0, 0))) {
      showToast('Không thể ban hành đơn giá mới có hiệu lực trong quá khứ.');
      return { success: false };
    }
    // Phiên bản cũ chuyển sang inactive, thêm phiên bản mới
    const isEffective = effectiveDate <= new Date(new Date().setHours(0, 0, 0, 0));
    const newId = `TF-${new Date().getFullYear()}-${Date.now()}`;
    const createdTariff: TariffConfig = {
      ...newTariff,
      id: newId,
      isActive: isEffective,
      updatedBy: currentUser?.fullName || 'Chủ nhà'
    };
    setTariffs(prev => [...prev.map(t => ({ ...t, isActive: isEffective ? false : t.isActive })), createdTariff]);
    addAuditLog('CAP_NHAT_DON_GIA', 'CONFIG', newId, `Ban hành đơn giá mới ${createdTariff.versionName}, áp dụng từ ${createdTariff.effectiveFrom}`);
    showToast(isEffective
      ? `Đã lưu phiên bản đơn giá mới (${createdTariff.versionName}).`
      : `Đã lưu đơn giá sẽ áp dụng từ ${createdTariff.effectiveFrom}.`);
    return { success: true };
  };

  const saveBankConfig = (newBank: Omit<BankConfig, 'id' | 'isActive'>) => {
    const effectiveDate = parseLocalDate(newBank.effectiveFrom);
    if (!newBank.bankName.trim() || !/^\d{6}$/.test(newBank.bankCode) ||
      !/^\d+$/.test(newBank.accountNumber) || !newBank.accountHolder.trim() ||
      !newBank.branch.trim() || !effectiveDate) {
      showToast('Cần nhập ngân hàng, mã VietQR 6 số, số tài khoản, chủ tài khoản, chi nhánh và ngày hiệu lực hợp lệ.');
      return { success: false };
    }
    if (effectiveDate < new Date(new Date().setHours(0, 0, 0, 0))) {
      showToast('Không thể áp dụng tài khoản ngân hàng có ngày hiệu lực trong quá khứ.');
      return { success: false };
    }
    const isEffective = effectiveDate <= new Date(new Date().setHours(0, 0, 0, 0));
    const newId = `BK-${Date.now()}`;
    const createdBank: BankConfig = {
      ...newBank,
      id: newId,
      isActive: isEffective,
      updatedBy: currentUser?.fullName || 'Chủ nhà'
    };
    setBankConfigs(prev => [...prev.map(b => ({ ...b, isActive: isEffective ? false : b.isActive })), createdBank]);
    addAuditLog('CAP_NHAT_TAI_KHOAN_NGAN_HANG', 'CONFIG', newId, `Thiết lập tài khoản nhận mới ${newBank.bankName} - ${newBank.accountNumber}`);
    showToast(isEffective ? 'Đã cập nhật tài khoản ngân hàng nhận tiền.' : `Đã lưu tài khoản sẽ áp dụng từ ${createdBank.effectiveFrom}.`);
    return { success: true };
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        isFirstPasswordChangeRequired,
        failedAttempts: loginGuard.failedAttempts,
        lockUntil: loginGuard.lockUntil,
        sessionRemainingMinutes,
        passwordChangeLockUntil,
        authLoading,
        dataLoading,
        isConfigured: isSupabaseConfigured,
        databaseError,
        saveStatus,
        saveError,
        login,
        changeFirstPassword,
        forgotPassword,
        resetPassword,
        changePassword,
        logout,
        retryLoadData,
        retrySave,

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
        initialPayments,
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
