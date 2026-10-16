import React, { useState } from 'react';
import {
  Settings,
  DollarSign,
  Building,
  UserCheck,
  ChevronRight,
  ShieldCheck,
  Plus,
  Clock,
  History,
  ArrowRight,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AppHeader } from '../components/common/AppHeader';
import { BottomTabs } from '../components/common/BottomTabs';
import { TariffConfig, BankConfig } from '../types';

export const SettingScreens: React.FC = () => {
  const {
    currentScreenId,
    navigate,
    tariffs,
    bankConfigs,
    saveTariffConfig,
    saveBankConfig
  } = useApp();

  const activeTariff = tariffs.find(t => t.isActive) || tariffs[0];
  const activeBank = bankConfigs.find(b => b.isActive) || bankConfigs[0];

  // SET_TARIFF form
  const [tariffName, setTariffName] = useState('Phiên bản Đơn giá Q4/2026');
  const [effectiveFrom, setEffectiveFrom] = useState('01/11/2026');
  const [electricPrice, setElectricPrice] = useState<number>(activeTariff.electricityPricePerKwh);
  const [waterPrice, setWaterPrice] = useState<number>(activeTariff.waterPricePerM3);
  const [serviceFee, setServiceFee] = useState<number>(activeTariff.fixedServiceFeePerTenancy);
  const [tariffNotes, setTariffNotes] = useState('Điều chỉnh giá theo thông báo mới');

  // SET_BANK form
  const [bankName, setBankName] = useState(activeBank.bankName);
  const [bankCode, setBankCode] = useState(activeBank.bankCode);
  const [accountNumber, setAccountNumber] = useState(activeBank.accountNumber);
  const [accountHolder, setAccountHolder] = useState(activeBank.accountHolder);
  const [bankEffective, setBankEffective] = useState('01/11/2026');

  // 1. SETTINGS Hub Screen (F.13)
  if (currentScreenId === 'SETTINGS') {
    return (
      <div className="flex-1 flex flex-col justify-between bg-slate-50">
        <AppHeader
          title="Cài Đặt Hệ Thống"
          subtitle="Đơn giá, tài khoản ngân hàng & bảo mật"
          onBack={() => navigate('MORE')}
        />

        <div className="flex-1 p-3.5 space-y-3 overflow-y-auto text-xs">
          <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 shadow-xs overflow-hidden">
            {/* Setting 1: SET_TARIFF */}
            <div
              onClick={() => navigate('SET_TARIFF')}
              className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-900 truncate">Đơn giá điện, nước & phí dịch vụ</div>
                  <div className="text-[11px] text-slate-500 truncate mt-0.5">
                    Đang áp dụng: Điện {activeTariff.electricityPricePerKwh.toLocaleString()}đ • Nước {activeTariff.waterPricePerM3.toLocaleString()}đ
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
            </div>

            {/* Setting 2: SET_BANK */}
            <div
              onClick={() => navigate('SET_BANK')}
              className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                  <Building className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-900 truncate">Tài khoản ngân hàng nhận tiền QR</div>
                  <div className="text-[11px] text-slate-500 truncate mt-0.5">
                    {activeBank.bankName} - {activeBank.accountNumber}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
            </div>

            {/* Setting 3: ACCOUNT */}
            <div
              onClick={() => navigate('ACCOUNT')}
              className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-900 truncate">Tài khoản Quản lý & Đổi mật khẩu</div>
                  <div className="text-[11px] text-slate-500 truncate mt-0.5">
                    Quản lý phiên đăng nhập & đổi mật khẩu định kỳ
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
            </div>
          </div>
        </div>

        <BottomTabs />
      </div>
    );
  }

  // 2. SET_TARIFF Screen (F.13 - Cross-link 56)
  if (currentScreenId === 'SET_TARIFF') {
    const handleSaveTariff = (e: React.FormEvent) => {
      e.preventDefault();
      saveTariffConfig({
        versionName: tariffName,
        effectiveFrom,
        electricityPricePerKwh: Number(electricPrice),
        waterPricePerM3: Number(waterPrice),
        fixedServiceFeePerTenancy: Number(serviceFee),
        garbageFeePerRoom: 30000,
        wifiFeePerRoom: 50000,
        updatedBy: 'Nguyễn Văn Minh',
        notes: tariffNotes
      });
      // Cross-link 56 to PAY_CALC
      navigate('PAY_CALC', { periodId: 'KY-2026-10', roomId: 'P101' });
    };

    return (
      <div className="flex-1 flex flex-col p-4 bg-slate-50 space-y-3">
        <AppHeader
          title="Đơn Giá Điện Nước & Dịch Vụ"
          subtitle="Cấu hình theo phiên bản hiệu lực"
          onBack={() => navigate('SETTINGS')}
          rightAction={
            <button
              onClick={() => navigate('SET_TARIFF_HISTORY')}
              className="text-[11px] font-semibold text-blue-600 hover:underline"
            >
              Lịch sử giá
            </button>
          }
        />

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3 text-xs">
          {/* Mandatory Business Rule D8 */}
          <div className="p-3 bg-amber-50 border border-amber-200 text-amber-950 rounded-xl space-y-1">
            <strong className="block font-bold text-amber-900 flex items-center">
              <ShieldCheck className="w-4 h-4 mr-1 text-amber-600" /> Nguyên tắc không hồi tố (Quy tắc D8):
            </strong>
            <p>
              Đơn giá mới chỉ áp dụng cho các kỳ tính tiền phát sinh từ ngày hiệu lực trở đi. <strong>Tuyệt đối không hồi tố</strong> các kỳ tính tiền và thông báo thanh toán đã chốt trước đó.
            </p>
          </div>

          <form onSubmit={handleSaveTariff} className="space-y-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tên phiên bản đơn giá</label>
              <input
                type="text"
                value={tariffName}
                onChange={e => setTariffName(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Ngày bắt đầu có hiệu lực</label>
              <input
                type="text"
                value={effectiveFrom}
                onChange={e => setEffectiveFrom(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Giá điện (đ/kWh)</label>
                <input
                  type="number"
                  value={electricPrice}
                  onChange={e => setElectricPrice(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Giá nước (đ/m³)</label>
                <input
                  type="number"
                  value={waterPrice}
                  onChange={e => setWaterPrice(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Phí dịch vụ cố định (đ/lượt thuê/tháng)</label>
              <input
                type="number"
                value={serviceFee}
                onChange={e => setServiceFee(Number(e.target.value))}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Quy tắc D4: Mỗi lượt thuê riêng trong cùng kỳ đóng đủ phí dịch vụ cố định này theo quy định đã chốt.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md cursor-pointer"
              >
                <span>Ban Hành Phiên Bản Giá & Xem Áp Dụng</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // 3. SET_TARIFF_HISTORY Screen (F.13)
  if (currentScreenId === 'SET_TARIFF_HISTORY') {
    return (
      <div className="flex-1 flex flex-col p-4 bg-slate-50 space-y-3">
        <AppHeader
          title="Lịch Sử Đơn Giá"
          subtitle="Các phiên bản đơn giá qua các thời kỳ"
          onBack={() => navigate('SET_TARIFF')}
        />

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2.5 text-xs">
          {tariffs.map(tf => (
            <div
              key={tf.id}
              className={`p-3 rounded-xl border ${
                tf.isActive ? 'border-emerald-300 bg-emerald-50/40' : 'border-slate-200 bg-slate-50'
              } space-y-1.5`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{tf.versionName}</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  tf.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                }`}>
                  {tf.isActive ? 'Đang áp dụng' : 'Lịch sử cũ'}
                </span>
              </div>
              <div className="text-[11px] text-slate-600">
                Hiệu lực từ: <strong className="font-mono">{tf.effectiveFrom}</strong> • Người cập nhật: {tf.updatedBy}
              </div>
              <div className="grid grid-cols-3 gap-1 pt-1 border-t border-slate-200/80 font-mono text-[11px]">
                <div>Điện: {tf.electricityPricePerKwh.toLocaleString()} đ</div>
                <div>Nước: {tf.waterPricePerM3.toLocaleString()} đ</div>
                <div>DV: {tf.fixedServiceFeePerTenancy.toLocaleString()} đ</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 4. SET_BANK Screen (F.13 - Cross-link 57)
  if (currentScreenId === 'SET_BANK') {
    const handleSaveBank = (e: React.FormEvent) => {
      e.preventDefault();
      saveBankConfig({
        bankName,
        bankCode,
        accountNumber,
        accountHolder: accountHolder.toUpperCase(),
        branch: 'Chi nhánh Hà Nội',
        effectiveFrom: bankEffective,
        updatedBy: 'Nguyễn Văn Minh'
      });
      // Cross-link 57 to PAY_NOTICE_NEW
      navigate('PAY_NOTICE_NEW', { periodId: 'KY-2026-10', roomId: 'P101' });
    };

    return (
      <div className="flex-1 flex flex-col p-4 bg-slate-50 space-y-3">
        <AppHeader
          title="Tài Khoản Nhận Thanh Toán"
          subtitle="Cấu hình tài khoản sinh mã VietQR"
          onBack={() => navigate('SETTINGS')}
          rightAction={
            <button
              onClick={() => navigate('SET_BANK_HISTORY')}
              className="text-[11px] font-semibold text-blue-600 hover:underline"
            >
              Lịch sử TK
            </button>
          }
        />

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3 text-xs">
          <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 rounded-xl space-y-1">
            <strong className="block font-bold">Snapshot tài khoản nhận (Quy tắc D8):</strong>
            <p>
              Tài khoản này dùng để sinh mã VietQR tự động cho các thông báo mới. Những thông báo đã phát hành trong quá khứ vẫn giữ nguyên thông tin tài khoản lúc tạo.
            </p>
          </div>

          <form onSubmit={handleSaveBank} className="space-y-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Ngân hàng thụ hưởng</label>
              <input
                type="text"
                value={bankName}
                onChange={e => setBankName(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Số tài khoản</label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={e => setAccountNumber(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Chủ tài khoản (In hoa)</label>
                <input
                  type="text"
                  value={accountHolder}
                  onChange={e => setAccountHolder(e.target.value.toUpperCase())}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Ngày áp dụng</label>
              <input
                type="text"
                value={bankEffective}
                onChange={e => setBankEffective(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md cursor-pointer"
              >
                <span>Lưu Tài Khoản Nhận & Áp Dụng Cho Thông Báo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // 5. SET_BANK_HISTORY Screen (F.13)
  if (currentScreenId === 'SET_BANK_HISTORY') {
    return (
      <div className="flex-1 flex flex-col p-4 bg-slate-50 space-y-3">
        <AppHeader
          title="Lịch Sử Tài Khoản Nhận"
          subtitle="Danh sách tài khoản ngân hàng qua các kỳ"
          onBack={() => navigate('SET_BANK')}
        />

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2.5 text-xs">
          {bankConfigs.map(b => (
            <div
              key={b.id}
              className={`p-3 rounded-xl border ${
                b.isActive ? 'border-blue-300 bg-blue-50/40' : 'border-slate-200 bg-slate-50'
              } space-y-1`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{b.bankName}</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  b.isActive ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-600'
                }`}>
                  {b.isActive ? 'Đang dùng tạo QR' : 'Đã thay thế'}
                </span>
              </div>
              <div className="text-[11px] font-mono text-slate-800">
                STK: <strong>{b.accountNumber}</strong> • Chủ TK: {b.accountHolder}
              </div>
              <div className="text-[10px] text-slate-500">
                Hiệu lực từ: {b.effectiveFrom}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};
