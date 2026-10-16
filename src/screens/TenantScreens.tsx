import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  ChevronRight,
  ShieldCheck,
  Edit3,
  ArrowRight,
  UserPlus,
  Clock,
  History,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AppHeader } from '../components/common/AppHeader';
import { BottomTabs } from '../components/common/BottomTabs';
import { Tenant, CoResident } from '../types';

export const TenantScreens: React.FC = () => {
  const {
    currentScreenId,
    params,
    navigate,
    tenants,
    coResidents,
    rooms,
    contracts,
    createTenant,
    updateTenant,
    addCoResident,
    updateCoResident
  } = useApp();

  const targetTenantId = (params.tenantId as string) || 'KT001';
  const currentTenant = tenants.find(t => t.id === targetTenantId) || tenants[0];
  const tenantCoResidents = coResidents.filter(c => c.tenantId === currentTenant?.id);
  const tenantContracts = contracts.filter(c => c.tenantId === currentTenant?.id);
  const tenantRoom = rooms.find(r => r.id === currentTenant?.currentRoomId);

  // Search & filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'DANG_THUE' | 'DA_TRA' | 'TIEM_NANG'>('ALL');

  // TENANT_NEW form
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [idCardNumber, setIdCardNumber] = useState('');
  const [idCardIssuedDate, setIdCardIssuedDate] = useState('15/04/2021');
  const [idCardIssuedPlace, setIdCardIssuedPlace] = useState('Cục CSQLHC về TTXH');
  const [permanentAddress, setPermanentAddress] = useState('');
  const [email, setEmail] = useState('');
  const [newTenantError, setNewTenantError] = useState<string | null>(null);

  // TENANT_PERSON_EDIT form
  const [personName, setPersonName] = useState('');
  const [personRelation, setPersonRelation] = useState('Bạn cùng phòng');
  const [personPhone, setPersonPhone] = useState('');
  const [personIdCard, setPersonIdCard] = useState('');
  const [personArrival, setPersonArrival] = useState('15/10/2026');

  // TENANT_EDIT form
  const [editPhone, setEditPhone] = useState(currentTenant?.phone || '');
  const [editEmail, setEditEmail] = useState(currentTenant?.email || '');
  const [editAddress, setEditAddress] = useState(currentTenant?.permanentAddress || '');
  const [editReason, setEditReason] = useState('Khách thuê đổi số điện thoại mới');

  // 1. TENANTS Screen (F.3 / F.5)
  if (currentScreenId === 'TENANTS') {
    const filteredTenants = tenants.filter(t => {
      const matchSearch = t.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.phone.includes(searchTerm) ||
        t.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || t.status === statusFilter;
      return matchSearch && matchStatus;
    });

    return (
      <div className="flex-1 flex flex-col justify-between bg-slate-50">
        <AppHeader
          title="Hồ Sơ Khách Thuê"
          subtitle={`${tenants.length} khách thuê lưu trữ`}
          rightAction={
            <button
              onClick={() => navigate('TENANT_NEW')}
              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm hồ sơ</span>
            </button>
          }
        />

        <div className="p-3 bg-white border-b border-slate-200 space-y-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo tên, số điện thoại, mã hồ sơ..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center space-x-1 text-[11px] overflow-x-auto scrollbar-none pb-0.5">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap cursor-pointer ${statusFilter === 'ALL' ? 'bg-slate-900 text-white font-bold' : 'bg-slate-100 text-slate-600'}`}
            >
              Tất cả ({tenants.length})
            </button>
            <button
              onClick={() => setStatusFilter('DANG_THUE')}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap cursor-pointer ${statusFilter === 'DANG_THUE' ? 'bg-blue-600 text-white font-bold' : 'bg-blue-50 text-blue-800'}`}
            >
              Đang thuê ({tenants.filter(t => t.status === 'DANG_THUE').length})
            </button>
            <button
              onClick={() => setStatusFilter('TIEM_NANG')}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap cursor-pointer ${statusFilter === 'TIEM_NANG' ? 'bg-amber-600 text-white font-bold' : 'bg-amber-50 text-amber-800'}`}
            >
              Tiềm năng ({tenants.filter(t => t.status === 'TIEM_NANG').length})
            </button>
            <button
              onClick={() => setStatusFilter('DA_TRA')}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap cursor-pointer ${statusFilter === 'DA_TRA' ? 'bg-slate-600 text-white font-bold' : 'bg-slate-100 text-slate-600'}`}
            >
              Đã trả ({tenants.filter(t => t.status === 'DA_TRA').length})
            </button>
          </div>
        </div>

        <div className="flex-1 p-3 space-y-2 overflow-y-auto">
          {filteredTenants.map(tenant => {
            const room = rooms.find(r => r.id === tenant.currentRoomId);

            return (
              <div
                key={tenant.id}
                onClick={() => navigate('TENANT_DETAIL', { tenantId: tenant.id })}
                className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 transition-all cursor-pointer space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-sm">
                      {tenant.fullName.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{tenant.fullName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        Mã: {tenant.code} • SĐT: {tenant.phone}
                      </div>
                    </div>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    tenant.status === 'DANG_THUE' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                    tenant.status === 'TIEM_NANG' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {tenant.status === 'DANG_THUE' ? 'Đang thuê' : tenant.status === 'TIEM_NANG' ? 'Tiềm năng' : 'Đã trả'}
                  </span>
                </div>

                {room && (
                  <div className="text-[11px] text-slate-600 flex items-center space-x-1 bg-slate-50 px-2 py-1 rounded-lg">
                    <span>Đang ở tại:</span>
                    <strong className="text-blue-700 font-semibold">Phòng {room.roomNumber} (Tầng {room.floor})</strong>
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

  // 2. TENANT_NEW Screen (F.5)
  if (currentScreenId === 'TENANT_NEW') {
    const handleSaveNewTenant = (e: React.FormEvent) => {
      e.preventDefault();
      setNewTenantError(null);
      const res = createTenant({
        fullName: fullName.trim(),
        phone: phone.trim(),
        idCardNumber: idCardNumber.trim(),
        idCardIssuedDate,
        idCardIssuedPlace,
        permanentAddress: permanentAddress.trim(),
        email: email.trim(),
        currentRoomId: params.roomId as string | undefined
      });
      if (res.success && res.tenantId) {
        navigate('TENANT_DETAIL', { tenantId: res.tenantId });
      } else if (res.error) {
        setNewTenantError(res.error);
      }
    };

    return (
      <div className="flex-1 flex flex-col p-4 bg-slate-50">
        <AppHeader title="Thêm Hồ Sơ Khách Thuê" subtitle="Đăng ký hồ sơ khách thuê mới" onBack={() => navigate('TENANTS')} />

        <div className="mt-3 bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3 text-xs">
          {newTenantError && (
            <div className="p-2.5 rounded-xl bg-red-50 text-red-800 border border-red-200">
              {newTenantError}
            </div>
          )}

          <form onSubmit={handleSaveNewTenant} className="space-y-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Họ và tên khách thuê</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Nguyễn Văn A..."
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Số điện thoại</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="0912..."
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Số CCCD / CMND</label>
                <input
                  type="text"
                  value={idCardNumber}
                  onChange={e => setIdCardNumber(e.target.value)}
                  placeholder="001095..."
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Ngày cấp</label>
                <input
                  type="text"
                  value={idCardIssuedDate}
                  onChange={e => setIdCardIssuedDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nơi cấp</label>
                <input
                  type="text"
                  value={idCardIssuedPlace}
                  onChange={e => setIdCardIssuedPlace(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Địa chỉ thường trú</label>
              <input
                type="text"
                value={permanentAddress}
                onChange={e => setPermanentAddress(e.target.value)}
                placeholder="Xã/Phường, Huyện/Quận, Tỉnh/TP..."
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>

            <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-blue-900">
              Bảo mật thông tin: Dữ liệu căn cước công dân được mã hóa và chỉ phục vụ khai báo tạm trú và hợp đồng.
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={() => navigate('TENANTS')}
                className="flex-1 py-2.5 border border-slate-300 text-slate-700 font-semibold rounded-xl"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs"
              >
                Lưu Hồ Sơ Khách
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // 3. TENANT_DETAIL Screen (F.5 - Cross-links 11, 22, 23)
  if (currentScreenId === 'TENANT_DETAIL') {
    return (
      <div className="flex-1 flex flex-col justify-between bg-slate-50">
        <AppHeader
          title={`Hồ Sơ Khách: ${currentTenant.fullName}`}
          subtitle={`Mã khách: ${currentTenant.code}`}
          onBack={() => navigate('TENANTS')}
          rightAction={
            <button
              onClick={() => navigate('TENANT_CHECK', { tenantId: currentTenant.id })}
              className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
              title="Cập nhật hồ sơ"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          }
        />

        <div className="flex-1 p-3.5 space-y-3 overflow-y-auto text-xs">
          {/* Tenant summary card */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-base">
                {currentTenant.fullName.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-slate-900 text-sm">{currentTenant.fullName}</div>
                <div className="text-[11px] text-slate-500 font-mono">CCCD: {currentTenant.idCardNumber}</div>
                <div className="text-[11px] text-slate-500">Cấp ngày: {currentTenant.idCardIssuedDate} tại {currentTenant.idCardIssuedPlace}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
              <div className="p-2 rounded-xl bg-slate-50">
                <div className="text-[10px] text-slate-500 flex items-center"><Phone className="w-3 h-3 mr-1" /> SĐT</div>
                <div className="font-semibold text-slate-800 font-mono mt-0.5">{currentTenant.phone}</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-50">
                <div className="text-[10px] text-slate-500 flex items-center"><Mail className="w-3 h-3 mr-1" /> Email</div>
                <div className="font-semibold text-slate-800 truncate mt-0.5">{currentTenant.email}</div>
              </div>
            </div>

            <div className="p-2 rounded-xl bg-slate-50 text-[11px] text-slate-700">
              <div className="text-[10px] text-slate-500 flex items-center mb-0.5"><MapPin className="w-3 h-3 mr-1" /> Thường trú</div>
              {currentTenant.permanentAddress}
            </div>
          </div>

          {/* Cross-link 23 to ROOM_DETAIL */}
          {tenantRoom && (
            <div
              onClick={() => navigate('ROOM_DETAIL', { roomId: tenantRoom.id })}
              className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs hover:border-blue-400 transition-colors cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs">
                  {tenantRoom.roomNumber}
                </div>
                <div>
                  <div className="font-bold text-slate-900">Đang thuê: Phòng {tenantRoom.roomNumber} (Tầng {tenantRoom.floor})</div>
                  <div className="text-[11px] text-slate-500">{tenantRoom.area} m² • {tenantRoom.basePrice.toLocaleString()} đ/tháng</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          )}

          {/* Co-Residents section */}
          <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 flex items-center">
                <Users className="w-4 h-4 mr-1 text-teal-600" /> Người Ở Cùng ({tenantCoResidents.length})
              </span>
              <button
                onClick={() => navigate('TENANT_PEOPLE', { tenantId: currentTenant.id })}
                className="text-xs text-blue-600 font-semibold hover:underline cursor-pointer"
              >
                Quản lý
              </button>
            </div>

            {tenantCoResidents.length > 0 ? (
              tenantCoResidents.map(c => (
                <div key={c.id} className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-900">{c.fullName} ({c.relationship})</div>
                    <div className="text-[11px] text-slate-500 font-mono">SĐT: {c.phone} • Vào ở: {c.arrivalDate}</div>
                  </div>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full">
                    Đang ở
                  </span>
                </div>
              ))
            ) : (
              <p className="text-slate-400 italic text-[11px]">Chưa có người ở cùng đăng ký.</p>
            )}
          </div>

          {/* Action cross-links */}
          <div className="space-y-2 pt-1">
            <button
              onClick={() => navigate('RENTAL_TERMS', { tenantId: currentTenant.id, roomId: currentTenant.currentRoomId || 'P103' })}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer"
            >
              <span>Lập Điều Kiện Thuê Cho Khách Này</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('CONTRACTS', { tenantId: currentTenant.id })}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-semibold flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <span>Lịch Sử Hợp Đồng Của Khách</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('TENANT_HISTORY', { tenantId: currentTenant.id })}
              className="w-full py-2 border border-slate-300 text-slate-600 hover:bg-slate-50 rounded-xl font-medium flex items-center justify-center space-x-1 cursor-pointer"
            >
              <History className="w-3.5 h-3.5" />
              <span>Xem Lịch Sử Biến Động Hồ Sơ</span>
            </button>
          </div>
        </div>

        <BottomTabs />
      </div>
    );
  }

  // 4. TENANT_PEOPLE Screen (F.5)
  if (currentScreenId === 'TENANT_PEOPLE') {
    return (
      <div className="flex-1 flex flex-col p-4 bg-slate-50 space-y-3">
        <AppHeader
          title={`Người Ở Cùng: ${currentTenant.fullName}`}
          subtitle="Danh sách người ở cùng lượt thuê"
          onBack={() => navigate('TENANT_DETAIL', { tenantId: currentTenant.id })}
          rightAction={
            <button
              onClick={() => navigate('TENANT_PERSON_EDIT', { tenantId: currentTenant.id })}
              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Thêm người</span>
            </button>
          }
        />

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2 text-xs">
          {tenantCoResidents.length > 0 ? (
            tenantCoResidents.map(c => (
              <div key={c.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                <div className="flex items-center justify-between">
                  <strong className="text-slate-900 font-bold">{c.fullName}</strong>
                  <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                    {c.relationship}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  CCCD: {c.idCardNumber} • SĐT: {c.phone}
                </div>
                <div className="text-[11px] text-slate-600">
                  Thời điểm đến: {c.arrivalDate} {c.departureDate ? `→ Ngày đi: ${c.departureDate}` : ''}
                </div>
                {c.proofDocumentNote && (
                  <div className="text-[10px] text-emerald-700 italic pt-1 border-t border-slate-200">
                    {c.proofDocumentNote}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-slate-400 text-center py-6 italic">Chưa có người ở cùng.</p>
          )}
        </div>
      </div>
    );
  }

  // 5. TENANT_PERSON_EDIT Screen (F.5)
  if (currentScreenId === 'TENANT_PERSON_EDIT') {
    const handleSavePerson = (e: React.FormEvent) => {
      e.preventDefault();
      addCoResident({
        tenantId: currentTenant.id,
        fullName: personName.trim(),
        relationship: personRelation,
        phone: personPhone.trim(),
        idCardNumber: personIdCard.trim(),
        arrivalDate: personArrival,
        residenceStatus: 'DANG_O',
        proofDocumentNote: 'Đã lưu chứng từ tạm trú'
      });
      navigate('TENANT_PEOPLE', { tenantId: currentTenant.id });
    };

    return (
      <div className="flex-1 flex flex-col p-4 bg-slate-50 space-y-3">
        <AppHeader
          title="Thêm Người Ở Cùng"
          subtitle={`Phòng của ${currentTenant.fullName}`}
          onBack={() => navigate('TENANT_PEOPLE', { tenantId: currentTenant.id })}
        />

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3 text-xs">
          <form onSubmit={handleSavePerson} className="space-y-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Họ và tên người ở cùng</label>
              <input
                type="text"
                value={personName}
                onChange={e => setPersonName(e.target.value)}
                placeholder="Nguyễn Văn B..."
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Quan hệ với chủ hợp đồng</label>
              <input
                type="text"
                value={personRelation}
                onChange={e => setPersonRelation(e.target.value)}
                placeholder="Vợ, Chồng, Bạn bè, Em gái..."
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Số điện thoại</label>
                <input
                  type="tel"
                  value={personPhone}
                  onChange={e => setPersonPhone(e.target.value)}
                  placeholder="0988..."
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">CCCD / Định danh</label>
                <input
                  type="text"
                  value={personIdCard}
                  onChange={e => setPersonIdCard(e.target.value)}
                  placeholder="001099..."
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Ngày bắt đầu đến ở</label>
              <input
                type="text"
                value={personArrival}
                onChange={e => setPersonArrival(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
              />
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={() => navigate('TENANT_PEOPLE', { tenantId: currentTenant.id })}
                className="flex-1 py-2.5 border border-slate-300 text-slate-700 font-semibold rounded-xl"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs"
              >
                Lưu Người Ở Cùng
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // 6. TENANT_CHECK Screen (F.5)
  if (currentScreenId === 'TENANT_CHECK') {
    return (
      <div className="flex-1 flex flex-col p-4 bg-slate-50 space-y-3">
        <AppHeader
          title={`Kiểm Tra Thay Đổi Hồ Sơ: ${currentTenant.fullName}`}
          subtitle="Đối chiếu căn cứ trước khi cập nhật"
          onBack={() => navigate('TENANT_DETAIL', { tenantId: currentTenant.id })}
        />

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3 text-xs">
          <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl space-y-1">
            <strong className="block font-bold">Xác minh căn cứ thay đổi:</strong>
            <p>
              Quy tắc nghiệp vụ: Mọi thay đổi về số điện thoại, nơi thường trú hoặc giấy tờ nhân thân của khách thuê phải được đối chiếu trước khi lưu vết.
            </p>
          </div>

          <div className="space-y-2">
            <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50">
              <span className="text-slate-500 text-[10px] uppercase font-bold">Dữ liệu hiện tại:</span>
              <div className="font-semibold text-slate-800 mt-1">SĐT: {currentTenant.phone}</div>
              <div className="text-slate-600">Thường trú: {currentTenant.permanentAddress}</div>
            </div>

            <div className="p-2.5 rounded-xl border border-blue-200 bg-blue-50/50">
              <span className="text-blue-700 text-[10px] uppercase font-bold">Nguồn chứng minh:</span>
              <div className="text-slate-800 mt-1">Khách gửi tin nhắn Zalo kèm ảnh CCCD gắn chip mới</div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => navigate('TENANT_EDIT', { tenantId: currentTenant.id })}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-md cursor-pointer"
            >
              <span>Xác Nhận Hợp Lệ → Tiến Hành Cập Nhật</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 7. TENANT_EDIT Screen (F.5)
  if (currentScreenId === 'TENANT_EDIT') {
    const handleSaveTenantEdit = (e: React.FormEvent) => {
      e.preventDefault();
      updateTenant(currentTenant.id, {
        phone: editPhone,
        email: editEmail,
        permanentAddress: editAddress
      }, editReason);
      navigate('TENANT_DETAIL', { tenantId: currentTenant.id });
    };

    return (
      <div className="flex-1 flex flex-col p-4 bg-slate-50 space-y-3">
        <AppHeader
          title={`Cập Nhật Hồ Sơ: ${currentTenant.fullName}`}
          subtitle="Chỉ lưu dữ liệu đã qua kiểm tra"
          onBack={() => navigate('TENANT_CHECK', { tenantId: currentTenant.id })}
        />

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3 text-xs">
          <form onSubmit={handleSaveTenantEdit} className="space-y-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Số điện thoại mới</label>
              <input
                type="tel"
                value={editPhone}
                onChange={e => setEditPhone(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Email mới</label>
              <input
                type="email"
                value={editEmail}
                onChange={e => setEditEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Địa chỉ thường trú cập nhật</label>
              <input
                type="text"
                value={editAddress}
                onChange={e => setEditAddress(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Lý do thay đổi (bắt buộc)</label>
              <textarea
                value={editReason}
                onChange={e => setEditReason(e.target.value)}
                required
                rows={2}
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={() => navigate('TENANT_DETAIL', { tenantId: currentTenant.id })}
                className="flex-1 py-2.5 border border-slate-300 text-slate-700 font-semibold rounded-xl"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs"
              >
                Lưu Cập Nhật
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // 8. TENANT_HISTORY Screen (F.5)
  if (currentScreenId === 'TENANT_HISTORY') {
    return (
      <div className="flex-1 flex flex-col p-4 bg-slate-50 space-y-3">
        <AppHeader
          title={`Lịch Sử Hồ Sơ: ${currentTenant.fullName}`}
          subtitle="Dòng thời gian biến động thông tin"
          onBack={() => navigate('TENANT_DETAIL', { tenantId: currentTenant.id })}
        />

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2.5 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-700">Khởi tạo hồ sơ ban đầu</span>
              <span className="text-[10px] font-mono text-slate-400">{currentTenant.createdAt}</span>
            </div>
            <p className="text-slate-600 text-[11px]">Đăng ký hồ sơ người thuê chính qua hợp đồng thuê căn hộ GreenHouse.</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">Cập nhật hồ sơ & khai báo tạm trú</span>
              <span className="text-[10px] font-mono text-slate-400">{currentTenant.updatedAt}</span>
            </div>
            <p className="text-slate-600 text-[11px]">Đã xác minh căn cước công dân gắn chip và nộp danh sách cho công an khu vực.</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
