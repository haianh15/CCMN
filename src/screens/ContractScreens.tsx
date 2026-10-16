import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  CheckCircle2,
  Calendar,
  DollarSign,
  User,
  KeyRound,
  ArrowRight,
  ShieldCheck,
  Edit3,
  ExternalLink,
  ChevronRight,
  Clock,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AppHeader } from '../components/common/AppHeader';
import { BottomTabs } from '../components/common/BottomTabs';
import { MissingRecord } from '../components/common/MissingRecord';
import { StatusBadge } from '../components/common/StatusBadge';
import { Contract, ContractStatus } from '../types';

export const ContractScreens: React.FC = () => {
  const {
    currentScreenId,
    params,
    navigate,
    contracts,
    rooms,
    tenants,
    rentalTerms,
    saveRentalTerms,
    createDraftContract,
    editDraftContract,
    signContract,
    renewContract,
    signRenewContract
  } = useApp();

  const targetContractId = params.contractId as string | undefined;
  const contractRequired = !['CONTRACTS', 'RENTAL_TERMS', 'CONTRACT_NEW'].includes(currentScreenId);
  const currentContract = (targetContractId
    ? contracts.find(c => c.id === targetContractId)
    : params.roomId
      ? contracts.find(c => c.roomId === params.roomId)
      : contractRequired ? undefined : contracts[0])!;
  const contractRoom = rooms.find(r => r.id === currentContract?.roomId);
  const contractTenant = tenants.find(t => t.id === currentContract?.tenantId);
  const firstVacantRoom = rooms.find(room => room.status === 'TRONG');
  const firstProspectiveTenant = tenants.find(tenant => tenant.status === 'TIEM_NANG');

  // Search & filter for CONTRACTS list
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | ContractStatus>('ALL');

  // RENTAL_TERMS form
  const [termRoomId, setTermRoomId] = useState((params.roomId as string | undefined) || firstVacantRoom?.id || '');
  const [termTenantId, setTermTenantId] = useState((params.tenantId as string | undefined) || firstProspectiveTenant?.id || '');
  const [termDuration, setTermDuration] = useState<number>(12);
  const [termStart, setTermStart] = useState('20/10/2026');
  const [termEnd, setTermEnd] = useState('20/10/2027');
  const [termRent, setTermRent] = useState<number>(() =>
    rentalTerms[termRoomId]?.monthlyRent ?? rooms.find(room => room.id === termRoomId)?.basePrice ?? 0
  );
  const [termServiceFee, setTermServiceFee] = useState<number>(150000);
  const [termNotes, setTermNotes] = useState('Khách thanh toán tiền mặt/chuyển khoản đầu tháng');

  // CONTRACT_SIGN form
  const [signDate, setSignDate] = useState(new Date().toLocaleDateString('vi-VN'));
  const [paperProofUrl, setPaperProofUrl] = useState('https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=400&q=80');

  // CONTRACT_RENEW form
  const [renewMonths, setRenewMonths] = useState<number>(12);
  const [renewStartDate, setRenewStartDate] = useState('01/11/2026');
  const [renewEndDate, setRenewEndDate] = useState('01/11/2027');

  // CONTRACT_EDIT form
  const [editTermsText, setEditTermsText] = useState(currentContract?.terms || '');

  const contractDetailScreens = ['CONTRACT_DETAIL', 'CONTRACT_EDIT', 'CONTRACT_SIGN', 'CONTRACT_RENEW', 'CONTRACT_RENEW_SIGN'];
  if (contractDetailScreens.includes(currentScreenId) && !currentContract) {
    return <MissingRecord title="Chi tiết hợp đồng" message="Không tìm thấy hợp đồng tương ứng với dữ liệu đã chọn." backTo="CONTRACTS" />;
  }

  // 1. CONTRACTS Screen (F.6)
  if (currentScreenId === 'CONTRACTS') {
    const filteredContracts = contracts.filter(c => {
      const room = rooms.find(r => r.id === c.roomId);
      const tenant = tenants.find(t => t.id === c.tenantId);
      const matchSearch = c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (room && room.roomNumber.includes(searchTerm)) ||
        (tenant && tenant.fullName.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchStatus = statusFilter === 'ALL' || c.status === statusFilter;
      return matchSearch && matchStatus;
    });

    return (
      <div className="flex-1 flex flex-col justify-between bg-slate-50">
        <AppHeader
          title="Danh Sách Hợp Đồng"
          subtitle={`${contracts.length} hợp đồng quản lý`}
          rightAction={
            <button
              onClick={() => navigate('RENTAL_TERMS', { roomId: firstVacantRoom?.id, tenantId: firstProspectiveTenant?.id })}
              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Lập HĐ mới</span>
            </button>
          }
        />

        <div className="p-3 bg-white border-b border-slate-200 space-y-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo số HĐ, số phòng, tên khách..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50"
            />
          </div>

          <div className="flex items-center space-x-1 text-[11px] overflow-x-auto scrollbar-none pb-0.5">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap cursor-pointer ${statusFilter === 'ALL' ? 'bg-slate-900 text-white font-bold' : 'bg-slate-100 text-slate-600'}`}
            >
              Tất cả ({contracts.length})
            </button>
            <button
              onClick={() => setStatusFilter('HIEU_LUC')}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap cursor-pointer ${statusFilter === 'HIEU_LUC' ? 'bg-emerald-600 text-white font-bold' : 'bg-emerald-50 text-emerald-800'}`}
            >
              Hiệu lực ({contracts.filter(c => c.status === 'HIEU_LUC').length})
            </button>
            <button
              onClick={() => setStatusFilter('DA_KY')}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap cursor-pointer ${statusFilter === 'DA_KY' ? 'bg-indigo-600 text-white font-bold' : 'bg-indigo-50 text-indigo-800'}`}
            >
              Đã ký ({contracts.filter(c => c.status === 'DA_KY').length})
            </button>
            <button
              onClick={() => setStatusFilter('NHAP')}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap cursor-pointer ${statusFilter === 'NHAP' ? 'bg-amber-600 text-white font-bold' : 'bg-amber-50 text-amber-800'}`}
            >
              Nháp ({contracts.filter(c => c.status === 'NHAP').length})
            </button>
            <button
              onClick={() => setStatusFilter('KET_THUC')}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap cursor-pointer ${statusFilter === 'KET_THUC' ? 'bg-slate-600 text-white font-bold' : 'bg-slate-100 text-slate-600'}`}
            >
              Đã kết thúc ({contracts.filter(c => c.status === 'KET_THUC').length})
            </button>
          </div>
        </div>

        <div className="responsive-card-grid flex-1 p-3 space-y-2 overflow-y-auto">
          {filteredContracts.map(c => {
            const room = rooms.find(r => r.id === c.roomId);
            const tenant = tenants.find(t => t.id === c.tenantId);

            return (
              <div
                key={c.id}
                onClick={() => navigate('CONTRACT_DETAIL', { contractId: c.id, roomId: c.roomId, tenantId: c.tenantId })}
                className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 transition-all cursor-pointer space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-mono font-bold text-xs">
                      {c.type === 'NOI_TIEP' ? 'NT' : 'HĐ'}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{c.code}</div>
                      <div className="text-[11px] text-slate-500">
                        {room ? `Phòng ${room.roomNumber}` : c.roomId} • {tenant?.fullName || c.tenantId}
                      </div>
                    </div>
                  </div>
                  <StatusBadge status={c.status} type="contract" />
                </div>

                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs flex items-center justify-between text-slate-700">
                  <div>
                    <span className="text-[11px] text-slate-500">Thời hạn:</span> {c.startDate} → {c.endDate}
                  </div>
                  <div className="font-mono font-bold text-blue-900">
                    {c.monthlyRent.toLocaleString()} đ/tháng
                  </div>
                </div>

                {c.isInheritedDeposit && (
                  <div className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                    ✓ Kế thừa cọc gốc {c.depositAmount.toLocaleString()} đ
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <BottomTabs />
      </div>
    );
  }

  // 2. RENTAL_TERMS Screen (F.6 - Cross-link 12)
  if (currentScreenId === 'RENTAL_TERMS') {
    const handleSaveTerms = (e: React.FormEvent) => {
      e.preventDefault();
      saveRentalTerms({
        roomId: termRoomId,
        tenantId: termTenantId,
        durationMonths: termDuration,
        startDate: termStart,
        endDate: termEnd,
        monthlyRent: termRent,
        depositAmount: termRent, // strictly 1 month
        firstMonthRent: termRent, // strictly 1 month pre-paid
        serviceFeePerMonth: termServiceFee,
        electricityRateType: 'Theo công tơ (3.800 đ/kWh)',
        waterRateType: 'Theo đồng hồ (28.000 đ/m3)',
        notes: termNotes,
        agreedAt: new Date().toLocaleDateString('vi-VN')
      });
      // Cross-link 12 to CONTRACT_NEW
      navigate('CONTRACT_NEW', { roomId: termRoomId, tenantId: termTenantId });
    };

    return (
      <div className="flex-1 flex flex-col p-4 bg-slate-50 space-y-3">
        <AppHeader
          title="Thỏa Thuận Điều Kiện Thuê"
          subtitle="Thống nhất giá, cọc 1 tháng & trả trước"
          onBack={() => navigate('CONTRACTS')}
        />

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3 text-xs">
          <form onSubmit={handleSaveTerms} className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Phòng thuê</label>
                <select
                  value={termRoomId}
                  onChange={e => setTermRoomId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                >
                  {rooms.map(r => (
                    <option key={r.id} value={r.id}>
                      Phòng {r.roomNumber} ({r.status})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Bên thuê</label>
                <select
                  value={termTenantId}
                  onChange={e => setTermTenantId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                >
                  {tenants.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.fullName} ({t.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Thời hạn</label>
                <input
                  type="number"
                  value={termDuration}
                  onChange={e => setTermDuration(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Ngày bắt đầu</label>
                <input
                  type="text"
                  value={termStart}
                  onChange={e => setTermStart(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Ngày kết thúc</label>
                <input
                  type="text"
                  value={termEnd}
                  onChange={e => setTermEnd(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Giá thuê hàng tháng (VNĐ)</label>
              <input
                type="number"
                value={termRent}
                onChange={e => setTermRent(Number(e.target.value))}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold"
              />
            </div>

            {/* Mandatory Deposit and Pre-paid Rent breakdown */}
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 space-y-1">
              <strong className="block font-bold">Ràng buộc nghiệp vụ bắt buộc:</strong>
              <div className="flex justify-between">
                <span>• Tiền đặt cọc (chính xác 1 tháng):</span>
                <span className="font-mono font-bold">{termRent.toLocaleString()} đ</span>
              </div>
              <div className="flex justify-between">
                <span>• Tiền thuê tháng đầu (trả trước):</span>
                <span className="font-mono font-bold">{termRent.toLocaleString()} đ</span>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Ghi chú điều khoản bổ sung</label>
              <textarea
                value={termNotes}
                onChange={e => setTermNotes(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md cursor-pointer"
              >
                <span>Thống Nhất Điều Kiện → Lập Dự Thảo Hợp Đồng</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // 3. CONTRACT_NEW Screen (F.6 - Cross-link 13)
  if (currentScreenId === 'CONTRACT_NEW') {
    const handleCreateContract = () => {
      const agreed = rentalTerms[termRoomId] || {
        roomId: termRoomId,
        tenantId: termTenantId,
        durationMonths: termDuration,
        startDate: termStart,
        endDate: termEnd,
        monthlyRent: termRent,
        depositAmount: termRent,
        firstMonthRent: termRent,
        serviceFeePerMonth: termServiceFee,
        electricityRateType: 'Theo công tơ',
        waterRateType: 'Theo đồng hồ',
        agreedAt: new Date().toLocaleDateString('vi-VN')
      };
      const res = createDraftContract(agreed);
      // Cross-link 13 to CONTRACT_DETAIL
      navigate('CONTRACT_DETAIL', { contractId: res.contractId, roomId: termRoomId, tenantId: termTenantId });
    };

    return (
      <div className="flex-1 flex flex-col p-4 bg-slate-50 space-y-3">
        <AppHeader
          title="Dự Thảo Hợp Đồng Lần Đầu"
          subtitle="Sinh từ điều kiện thuê đã thống nhất"
          onBack={() => navigate('RENTAL_TERMS')}
        />

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="text-center font-bold text-slate-900 pb-2 border-b border-slate-200 text-sm">
              CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM<br />
              <span className="text-xs font-normal">Độc lập - Tự do - Hạnh phúc</span>
            </div>
            <div className="font-bold text-center text-xs text-blue-900 pt-1">
              HỢP ĐỒNG THUÊ PHÒNG TRỌ (DỰ THẢO)
            </div>

            <div className="space-y-1 text-slate-700 text-[11px] pt-2">
              <p>• <strong>Bên cho thuê (Bên A):</strong> Nguyễn Văn Minh (Chủ nhà)</p>
              <p>• <strong>Bên thuê (Bên B):</strong> {contractTenant?.fullName || 'Khách thuê'} (CCCD: {contractTenant?.idCardNumber || '001095...'})</p>
              <p>• <strong>Phòng thuê:</strong> Căn {contractRoom?.roomNumber || termRoomId}, Tòa nhà GreenHouse</p>
              <p>• <strong>Thời hạn hợp đồng:</strong> {termDuration} tháng ({termStart} → {termEnd})</p>
              <p>• <strong>Giá thuê:</strong> {termRent.toLocaleString()} VNĐ/tháng (Thanh toán trả trước)</p>
              <p>• <strong>Tiền đặt cọc:</strong> {termRent.toLocaleString()} VNĐ (1 tháng tiền nhà)</p>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900">
            Hợp đồng ở trạng thái Nháp (NHAP). Phòng chưa tự động chuyển trạng thái cho đến khi ký giấy và thu đủ tiền ban đầu.
          </div>

          <div className="pt-2">
            <button
              onClick={handleCreateContract}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md cursor-pointer"
            >
              <span>Lưu Dự Thảo Hợp Đồng → Mở Chi Tiết</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. CONTRACT_DETAIL Screen (F.6 - Cross-links 14, 24, 25)
  if (currentScreenId === 'CONTRACT_DETAIL') {
    return (
      <div className="flex-1 flex flex-col justify-between bg-slate-50">
        <AppHeader
          title={`Hợp Đồng: ${currentContract.code}`}
          subtitle={`Phòng ${contractRoom?.roomNumber || currentContract.roomId}`}
          onBack={() => navigate('CONTRACTS')}
        />

        <div className="flex-1 p-3.5 space-y-3 overflow-y-auto text-xs">
          {/* Status banner */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-[11px] text-slate-500 uppercase font-semibold">Trạng thái hợp đồng</div>
              <div className="mt-1">
                <StatusBadge status={currentContract.status} type="contract" />
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-mono">Loại: {currentContract.type === 'NOI_TIEP' ? 'HĐ NỐI TIẾP' : 'HĐ LẦN ĐẦU'}</span>
              <div className="text-base font-extrabold text-blue-900 mt-0.5">
                {currentContract.monthlyRent.toLocaleString()} <span className="text-xs font-normal">đ/tháng</span>
              </div>
            </div>
          </div>

          {/* Cross-link 24 to TENANT_DETAIL & Cross-link 25 to ROOM_DETAIL */}
          <div className="grid grid-cols-2 gap-2">
            <div
              onClick={() => navigate('TENANT_DETAIL', { tenantId: currentContract.tenantId })}
              className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-blue-400 transition-colors cursor-pointer"
            >
              <div className="text-[10px] text-slate-400 font-mono mb-1">
                Bên thuê
              </div>
              <div className="font-bold text-slate-900 truncate">{contractTenant?.fullName}</div>
              <div className="text-[11px] text-slate-500 truncate">{contractTenant?.phone}</div>
            </div>

            <div
              onClick={() => navigate('ROOM_DETAIL', { roomId: currentContract.roomId })}
              className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-blue-400 transition-colors cursor-pointer"
            >
              <div className="text-[10px] text-slate-400 font-mono mb-1">
                Phòng thuê
              </div>
              <div className="font-bold text-slate-900 truncate">Phòng {contractRoom?.roomNumber}</div>
              <div className="text-[11px] text-slate-500 truncate">Tầng {contractRoom?.floor} • {contractRoom?.area} m²</div>
            </div>
          </div>

          {/* Financial terms */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2">
            <div className="font-bold text-slate-900 pb-1 border-b border-slate-100 flex items-center justify-between">
              <span>Điều khoản tài chính:</span>
              {currentContract.isInheritedDeposit && (
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono">
                  Kế thừa cọc cũ
                </span>
              )}
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Tiền đặt cọc:</span>
              <strong className="font-mono text-slate-900">{currentContract.depositAmount.toLocaleString()} VNĐ</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Tiền thuê tháng đầu:</span>
              <strong className="font-mono text-slate-900">{currentContract.firstMonthRent.toLocaleString()} VNĐ</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Thời hạn hợp đồng:</span>
              <span className="font-mono text-slate-900 font-semibold">{currentContract.startDate} → {currentContract.endDate}</span>
            </div>
            {currentContract.signedDate && (
              <div className="flex justify-between pt-1 border-t border-slate-100 text-[11px]">
                <span className="text-slate-500">Ngày ký giấy:</span>
                <span className="font-mono text-indigo-700 font-semibold">{currentContract.signedDate}</span>
              </div>
            )}
          </div>

          {/* Paper proof image if signed */}
          {currentContract.paperContractProofUrl && (
            <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-xs space-y-1">
              <span className="font-bold text-slate-900 text-xs">Chứng từ hợp đồng giấy đã ký:</span>
              <div className="rounded-xl overflow-hidden border border-slate-200 h-28 relative">
                <img
                  src={currentContract.paperContractProofUrl}
                  alt="Hợp đồng giấy"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] px-2 py-0.5 rounded font-mono">
                  Bản quét có chữ ký 2 bên
                </span>
              </div>
            </div>
          )}

          {/* Contextual Action CTA Buttons */}
          <div className="space-y-2 pt-1">
            {currentContract.status === 'NHAP' && (
              <>
                <button
                  onClick={() => navigate('CONTRACT_EDIT', { contractId: currentContract.id })}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-semibold flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Sửa Dự Thảo Hợp Đồng</span>
                </button>
                <button
                  onClick={() => navigate('CONTRACT_SIGN', { contractId: currentContract.id, roomId: currentContract.roomId })}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center space-x-1.5 shadow-md cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Ghi Nhận Hợp Đồng Giấy Đã Ký</span>
                </button>
              </>
            )}

            {currentContract.status === 'HIEU_LUC' && (
              <button
                onClick={() => navigate('CONTRACT_RENEW', { contractId: currentContract.id, roomId: currentContract.roomId })}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center space-x-1.5 shadow-md cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Lập Hợp Đồng Nối Tiếp (Kế Thừa Cọc)</span>
              </button>
            )}
          </div>
        </div>

        <BottomTabs />
      </div>
    );
  }

  // 5. CONTRACT_EDIT Screen (F.6)
  if (currentScreenId === 'CONTRACT_EDIT') {
    const handleSaveContractEdit = (e: React.FormEvent) => {
      e.preventDefault();
      editDraftContract(currentContract.id, { terms: editTermsText });
      navigate('CONTRACT_DETAIL', { contractId: currentContract.id });
    };

    return (
      <div className="flex-1 flex flex-col p-4 bg-slate-50 space-y-3">
        <AppHeader
          title={`Sửa Dự Thảo: ${currentContract.code}`}
          subtitle="Chỉ áp dụng khi hợp đồng ở trạng thái Nháp"
          onBack={() => navigate('CONTRACT_DETAIL', { contractId: currentContract.id })}
        />

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3 text-xs">
          <form onSubmit={handleSaveContractEdit} className="space-y-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nội dung điều khoản thỏa thuận</label>
              <textarea
                value={editTermsText}
                onChange={e => setEditTermsText(e.target.value)}
                rows={6}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs"
              />
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={() => navigate('CONTRACT_DETAIL', { contractId: currentContract.id })}
                className="flex-1 py-2.5 border border-slate-300 text-slate-700 font-semibold rounded-xl"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs"
              >
                Lưu Thay Đổi Dự Thảo
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // 6. CONTRACT_SIGN Screen (F.6 - Cross-link 14)
  if (currentScreenId === 'CONTRACT_SIGN') {
    const handleSignSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      signContract(currentContract.id, signDate, paperProofUrl);
      // Cross-link 14 to ROOM_FIRSTPAY
      navigate('ROOM_FIRSTPAY', { roomId: currentContract.roomId, contractId: currentContract.id });
    };

    return (
      <div className="flex-1 flex flex-col p-4 bg-slate-50 space-y-3">
        <AppHeader
          title={`Ghi Nhận Hợp Đồng Đã Ký: ${currentContract.code}`}
          subtitle="Đính kèm minh chứng hợp đồng giấy"
          onBack={() => navigate('CONTRACT_DETAIL', { contractId: currentContract.id })}
        />

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3 text-xs">
          <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 rounded-xl">
            <strong>Nguyên tắc ghi nhận ký hợp đồng:</strong>
            <p className="mt-0.5">
              Hệ thống ghi nhận việc ký giấy diễn ra ngoài đời thực, không tự giả lập chữ ký điện tử. Sau khi ký, cần tiến hành tra soát thanh toán đủ 1 tháng cọc + 1 tháng thuê đầu.
            </p>
          </div>

          <form onSubmit={handleSignSubmit} className="space-y-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Ngày hai bên ký giấy</label>
              <input
                type="text"
                value={signDate}
                onChange={e => setSignDate(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Hình ảnh / Tài liệu bản hợp đồng đã ký</label>
              <input
                type="text"
                value={paperProofUrl}
                onChange={e => setPaperProofUrl(e.target.value)}
                placeholder="https://..."
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-[11px]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md cursor-pointer"
              >
                <span>Ký Giấy Xong → Thu Đủ Tiền Ban Đầu</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // 7. CONTRACT_RENEW Screen (F.6)
  if (currentScreenId === 'CONTRACT_RENEW') {
    const handleCreateRenew = (e: React.FormEvent) => {
      e.preventDefault();
      const res = renewContract(currentContract.id, renewMonths, renewStartDate, renewEndDate);
      navigate('CONTRACT_RENEW_SIGN', { contractId: res.contractId, roomId: currentContract.roomId });
    };

    return (
      <div className="flex-1 flex flex-col p-4 bg-slate-50 space-y-3">
        <AppHeader
          title="Lập Hợp Đồng Nối Tiếp"
          subtitle="Gia hạn hợp đồng thuê phòng"
          onBack={() => navigate('CONTRACT_DETAIL', { contractId: currentContract.id })}
        />

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3 text-xs">
          {/* Mandatory deposit inheritance banner */}
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-xl space-y-1">
            <strong className="block font-bold text-emerald-900 flex items-center">
              <ShieldCheck className="w-4 h-4 mr-1 text-emerald-600" /> Kế Thừa Cọc Gốc Bắt Buộc (Quy tắc D3):
            </strong>
            <p>
              Khi tiếp tục thuê, hợp đồng nối tiếp <strong>kế thừa nguyên vẹn khoản tiền cọc {currentContract.depositAmount.toLocaleString()} VNĐ</strong> từ hợp đồng hiện tại và <strong>KHÔNG tạo khoản cọc mới</strong>.
            </p>
          </div>

          <form onSubmit={handleCreateRenew} className="space-y-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Thời hạn gia hạn (Tháng)</label>
              <input
                type="number"
                value={renewMonths}
                onChange={e => setRenewMonths(Number(e.target.value))}
                min="1"
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Ngày bắt đầu kỳ mới</label>
                <input
                  type="text"
                  value={renewStartDate}
                  onChange={e => setRenewStartDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Ngày kết thúc kỳ mới</label>
                <input
                  type="text"
                  value={renewEndDate}
                  onChange={e => setRenewEndDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                />
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex justify-between text-slate-600">
                <span>Tiền cọc kế thừa:</span>
                <strong className="font-mono text-emerald-700">{currentContract.depositAmount.toLocaleString()} VNĐ (Chỉ đọc)</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tiền thuê áp dụng:</span>
                <strong className="font-mono text-blue-900">{currentContract.monthlyRent.toLocaleString()} VNĐ/tháng</strong>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md cursor-pointer"
              >
                <span>Lập HĐ Nối Tiếp → Ghi Nhận Ký</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // 8. CONTRACT_RENEW_SIGN Screen (F.6 - Cross-link 26)
  if (currentScreenId === 'CONTRACT_RENEW_SIGN') {
    const handleRenewSignSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      signRenewContract(currentContract.id, signDate, paperProofUrl);
      // Cross-link 26 to ROOM_RENEW_CHECK
      navigate('ROOM_RENEW_CHECK', { roomId: currentContract.roomId, contractId: currentContract.id });
    };

    return (
      <div className="flex-1 flex flex-col p-4 bg-slate-50 space-y-3">
        <AppHeader
          title={`Ghi Nhận Ký Nối Tiếp: ${currentContract.code}`}
          subtitle="Bản hợp đồng nối tiếp giấy đã ký"
          onBack={() => navigate('CONTRACT_RENEW', { contractId: currentContract.id })}
        />

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3 text-xs">
          <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 rounded-xl">
            Ghi nhận chữ ký hai bên cho hợp đồng nối tiếp. Khi hợp đồng có hiệu lực, kế hoạch trả phòng cũ sẽ tự động được hủy bỏ.
          </div>

          <form onSubmit={handleRenewSignSubmit} className="space-y-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Ngày ký hợp đồng nối tiếp</label>
              <input
                type="text"
                value={signDate}
                onChange={e => setSignDate(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Hình ảnh hợp đồng nối tiếp có chữ ký</label>
              <input
                type="text"
                value={paperProofUrl}
                onChange={e => setPaperProofUrl(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-[11px]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md cursor-pointer"
              >
                <span>Ký Xong → Kiểm Tra Tiếp Tục Thuê</span>
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
