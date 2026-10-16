import React, { useState } from 'react';
import {
  DollarSign,
  Plus,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Edit3,
  ExternalLink,
  RotateCcw,
  Clock,
  FileCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AppHeader } from '../components/common/AppHeader';
import { BottomTabs } from '../components/common/BottomTabs';
import { MissingRecord } from '../components/common/MissingRecord';
import { DepositSettlement } from '../types';

export const DepositScreens: React.FC = () => {
  const {
    currentScreenId,
    params,
    navigate,
    depositSettlements,
    rooms,
    tenants,
    contracts,
    checkoutProtocols,
    showToast,
    createDepositSettlement,
    updateDepositSettlement,
    finalizeDepositSettlement
  } = useApp();

  const targetSettlementId = params.settlementId as string | undefined;
  const settlementRequired = !['DEPOSIT', 'DEPOSIT_NEW'].includes(currentScreenId);
  const currentSettlement = (targetSettlementId
    ? depositSettlements.find(s => s.id === targetSettlementId)
    : settlementRequired ? undefined : depositSettlements[0])!;
  const settlementRoom = rooms.find(r => r.id === currentSettlement?.roomId);
  const settlementTenant = tenants.find(t => t.id === currentSettlement?.tenantId);
  const defaultSettlementRoom = rooms.find(room =>
    checkoutProtocols.some(protocol => protocol.roomId === room.id && protocol.actualReturnConfirmed) &&
    !depositSettlements.some(settlement => settlement.roomId === room.id)
  ) || rooms.find(room => room.status === 'CHUA_BAN_GIAO_XONG') || rooms.find(room => room.status === 'SAP_TRA');
  const initialDepositRoom = rooms.find(room => room.id === params.roomId) || defaultSettlementRoom || rooms[0];
  const initialDepositContract = contracts.find(contract => contract.roomId === initialDepositRoom?.id);

  // DEPOSIT_NEW form
  const [depRoomId, setDepRoomId] = useState((params.roomId as string | undefined) || initialDepositRoom?.id || '');
  const [depOriginal, setDepOriginal] = useState<number>(initialDepositContract?.depositAmount || initialDepositRoom?.basePrice || 0);
  const [depRentDue, setDepRentDue] = useState<number>(0);
  const [depServiceDue, setDepServiceDue] = useState<number>(Number(params.serviceAmount) || 0);
  const [depDamage, setDepDamage] = useState<number>(Number(params.damageAmount) || 0);
  const [depDamageNotes, setDepDamageNotes] = useState((params.damageNotes as string) || '');
  const selectedDepositRoom = rooms.find(room => room.id === depRoomId);
  const selectedDepositContract = contracts.find(contract => contract.roomId === depRoomId);
  const selectedDepositTenant = tenants.find(tenant =>
    tenant.id === selectedDepositRoom?.currentTenantId || tenant.id === selectedDepositContract?.tenantId
  );

  // DEPOSIT_FINAL form
  const [finalProof, setFinalProof] = useState('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80');
  const [finalMethod, setFinalMethod] = useState<DepositSettlement['paymentMethod']>('CHUYEN_KHOAN_HOAN_COC');

  if (targetSettlementId && !depositSettlements.some(settlement => settlement.id === targetSettlementId)) {
    return <MissingRecord title="Chi tiết quyết toán cọc" message="Quyết toán được chọn không còn tồn tại." backTo="DEPOSIT" />;
  }
  if (settlementRequired && !currentSettlement) {
    return <MissingRecord title="Chi tiết quyết toán cọc" message="Chưa có dữ liệu quyết toán cọc cho luồng này." backTo="DEPOSIT" />;
  }

  // 1. DEPOSIT List Screen (F.11)
  if (currentScreenId === 'DEPOSIT') {
    return (
      <div className="flex-1 flex flex-col justify-between bg-slate-50">
        <AppHeader
          title="Quyết Toán Tiền Cọc"
          subtitle="Danh sách quyết toán tiền cọc theo lượt thuê"
          onBack={() => navigate('MORE')}
          rightAction={
            <button
              onClick={() => navigate('DEPOSIT_NEW', { roomId: defaultSettlementRoom?.id })}
              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Lập quyết toán</span>
            </button>
          }
        />

        <div className="responsive-card-grid flex-1 p-3.5 space-y-2.5 overflow-y-auto text-xs">
          {depositSettlements.map(st => {
            const r = rooms.find(rm => rm.id === st.roomId);
            const t = tenants.find(tn => tn.id === st.tenantId);

            return (
              <div
                key={st.id}
                onClick={() => navigate('DEPOSIT_DETAIL', { settlementId: st.id, roomId: st.roomId })}
                className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 transition-colors cursor-pointer space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <strong className="text-slate-900 font-bold text-sm">Phòng {r?.roomNumber || st.roomId}</strong>
                    <div className="text-[11px] text-slate-500 font-mono">{st.id} • {t?.fullName}</div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    st.status === 'DA_CHOT_HOAN_TIEN' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    st.status === 'TRANH_CHAP' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                    'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {st.status === 'DA_CHOT_HOAN_TIEN' ? 'Đã chốt hoàn tiền' : st.status === 'TRANH_CHAP' ? 'Đang tranh chấp' : 'Bản nháp'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-slate-500">Cọc gốc:</span> <strong className="font-mono">{st.originalDeposit.toLocaleString()} đ</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500">Thực hoàn:</span> <strong className="font-mono text-emerald-700 text-xs">{st.netRefundAmount.toLocaleString()} đ</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <BottomTabs />
      </div>
    );
  }

  // 2. DEPOSIT_NEW Screen (F.11)
  if (currentScreenId === 'DEPOSIT_NEW') {
    const netRefund = Math.max(0, depOriginal - depRentDue - depServiceDue - depDamage);

    const handleSaveNewSettlement = (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedDepositRoom || !selectedDepositTenant || !selectedDepositContract) {
        showToast('Vui lòng chọn phòng có khách thuê và hợp đồng hợp lệ trước khi lập quyết toán.');
        return;
      }
      const res = createDepositSettlement({
        roomId: depRoomId,
        rentalId: selectedDepositContract.rentalId,
        tenantId: selectedDepositTenant.id,
        contractId: selectedDepositContract.id,
        originalDeposit: Number(depOriginal),
        remainingRentalObligation: Number(depRentDue),
        finalServiceObligation: Number(depServiceDue),
        assetDamageDeduction: Number(depDamage),
        assetDamageNotes: depDamageNotes,
        otherDeductions: 0,
        otherDeductionNotes: '',
        netRefundAmount: netRefund,
        settlementDate: new Date().toLocaleDateString('vi-VN'),
        status: 'NHAP',
        amendmentHistory: []
      });
      navigate('DEPOSIT_DETAIL', { settlementId: res.settlementId, roomId: depRoomId });
    };

    return (
      <div className="flex-1 flex flex-col p-4 bg-slate-50 space-y-3">
        <AppHeader
          title={`Lập Quyết Toán Cọc P.${depRoomId}`}
          subtitle="Tính toán số tiền hoàn trả hoặc thu thêm"
          onBack={() => navigate('DEPOSIT')}
        />

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3 text-xs">
          <form onSubmit={handleSaveNewSettlement} className="space-y-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Phòng cần quyết toán</label>
              <select
                value={depRoomId}
                onChange={e => {
                  const room = rooms.find(item => item.id === e.target.value);
                  const contract = contracts.find(item => item.roomId === e.target.value);
                  setDepRoomId(e.target.value);
                  setDepOriginal(contract?.depositAmount || room?.basePrice || 0);
                  setDepRentDue(0);
                  setDepServiceDue(0);
                  setDepDamage(0);
                  setDepDamageNotes('');
                }}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
              >
                <option value="" disabled>Chọn phòng</option>
                {rooms.map(room => <option key={room.id} value={room.id}>Phòng {room.roomNumber}</option>)}
              </select>
              {!selectedDepositTenant || !selectedDepositContract ? (
                <p className="mt-1 text-[11px] text-amber-700">Phòng này chưa có khách thuê hoặc hợp đồng để đối soát.</p>
              ) : (
                <p className="mt-1 text-[11px] text-slate-500">{selectedDepositTenant.fullName} • {selectedDepositContract.code}</p>
              )}
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tiền đặt cọc ban đầu (1 tháng)</label>
              <input
                type="number"
                value={depOriginal}
                onChange={e => setDepOriginal(Number(e.target.value))}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tiền nhà còn thiếu</label>
                <input
                  type="number"
                  value={depRentDue}
                  onChange={e => setDepRentDue(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Điện nước kỳ cuối</label>
                <input
                  type="number"
                  value={depServiceDue}
                  onChange={e => setDepServiceDue(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Khấu trừ hư hại tài sản (Căn cứ biên bản)</label>
              <input
                type="number"
                value={depDamage}
                onChange={e => setDepDamage(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold text-rose-700"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Diễn giải căn cứ khấu trừ</label>
              <textarea
                value={depDamageNotes}
                onChange={e => setDepDamageNotes(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>

            {/* Calculated Net Refund */}
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex justify-between items-center">
              <div>
                <div className="text-[10px] text-emerald-700 uppercase font-bold">Số tiền hoàn lại cho khách</div>
                <div className="text-base font-extrabold font-mono text-emerald-800 mt-0.5">
                  {netRefund.toLocaleString()} VNĐ
                </div>
              </div>
              <span className="text-[10px] bg-emerald-200 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                Dự thảo
              </span>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md cursor-pointer"
              >
                Lưu Dự Thảo Quyết Toán Cọc
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // 3. DEPOSIT_DETAIL Screen (F.11)
  if (currentScreenId === 'DEPOSIT_DETAIL') {
    return (
      <div className="flex-1 flex flex-col justify-between bg-slate-50">
        <AppHeader
          title={`Chi Tiết Quyết Toán: ${currentSettlement.id}`}
          subtitle={`Phòng ${settlementRoom?.roomNumber || currentSettlement.roomId} • Chi tiết hoàn trả`}
          onBack={() => navigate('DEPOSIT')}
        />

        <div className="flex-1 p-3.5 space-y-3 overflow-y-auto text-xs">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div>
                <span className="text-[10px] text-slate-400 font-mono">Bên thuê</span>
                <div className="font-bold text-slate-900 text-sm">{settlementTenant?.fullName}</div>
              </div>
              <span className="font-mono font-bold text-emerald-700 text-sm">
                Hoàn trả: {currentSettlement.netRefundAmount.toLocaleString()} đ
              </span>
            </div>

            <div className="space-y-1.5 font-mono text-slate-700">
              <div className="flex justify-between">
                <span className="font-sans text-slate-500">Tiền cọc gốc:</span>
                <strong>{currentSettlement.originalDeposit.toLocaleString()} đ</strong>
              </div>
              <div className="flex justify-between">
                <span className="font-sans text-slate-500">Tiền nhà còn thiếu:</span>
                <span>- {currentSettlement.remainingRentalObligation.toLocaleString()} đ</span>
              </div>
              <div className="flex justify-between">
                <span className="font-sans text-slate-500">Điện nước cuối:</span>
                <span>- {currentSettlement.finalServiceObligation.toLocaleString()} đ</span>
              </div>
              <div className="flex justify-between text-rose-700 font-bold">
                <span className="font-sans text-slate-500">Khấu trừ hư hỏng:</span>
                <span>- {currentSettlement.assetDamageDeduction.toLocaleString()} đ</span>
              </div>
            </div>

            {currentSettlement.assetDamageNotes && (
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600">
                Căn cứ hư hỏng: {currentSettlement.assetDamageNotes}
              </div>
            )}
          </div>

          {/* Action button */}
          <div className="pt-1">
            <button
              onClick={() => navigate('DEPOSIT_FINAL', { settlementId: currentSettlement.id, roomId: currentSettlement.roomId })}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md cursor-pointer"
            >
              <span>Ghi Nhận Kết Quả Quyết Toán Thực Tế</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <BottomTabs />
      </div>
    );
  }

  // 4. DEPOSIT_FINAL Screen (F.11 - Cross-link 33)
  if (currentScreenId === 'DEPOSIT_FINAL') {
    const handleFinalize = (e: React.FormEvent) => {
      e.preventDefault();
      finalizeDepositSettlement(currentSettlement.id, finalProof, finalMethod);
      // Cross-link 33 to RETURN_DEPOSIT
      navigate('RETURN_DEPOSIT', { roomId: currentSettlement.roomId });
    };

    return (
      <div className="flex-1 flex flex-col p-4 bg-slate-50 space-y-3">
        <AppHeader
          title="Ghi Nhận Kết Quả Quyết Toán"
          subtitle="Chứng từ chuyển khoản hoàn cọc thực tế"
          onBack={() => navigate('DEPOSIT_DETAIL', { settlementId: currentSettlement.id })}
        />

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3 text-xs">
          <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 rounded-xl space-y-1">
            <strong className="block font-bold">Quy tắc ghi nhận hoàn cọc:</strong>
            <p>
              Chỉ chốt khi đã thực hiện chuyển khoản hoàn tiền hoặc thu thêm có chứng từ sao kê ngoài đời thực. Hệ thống không tự động chuyển khoản tiền ngân hàng.
            </p>
          </div>

          <form onSubmit={handleFinalize} className="space-y-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Phương thức thực hiện</label>
              <select
                value={finalMethod}
                onChange={e => setFinalMethod(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
              >
                <option value="CHUYEN_KHOAN_HOAN_COC">Chuyển khoản hoàn cọc lại cho khách</option>
                <option value="DOI_TRU">Đối trừ hết vào tiền nhà/dịch vụ</option>
                <option value="THU_THEM_TIEN">Thu thêm tiền do hư hại vượt tiền cọc</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Ảnh sao kê / Chứng từ chuyển tiền hoàn cọc</label>
              <input
                type="text"
                value={finalProof}
                onChange={e => setFinalProof(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-[11px]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md cursor-pointer"
              >
                <span>Chốt Quyết Toán & Cập Nhật Biên Bản Trả Phòng</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return null;
};
