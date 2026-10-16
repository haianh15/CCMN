import React, { useState } from 'react';
import {
  KeyRound,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  User,
  ArrowRight,
  Clock,
  Calendar,
  DollarSign,
  ChevronRight,
  ShieldCheck,
  Edit3,
  ExternalLink,
  MessageSquare,
  Building,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AppHeader } from '../components/common/AppHeader';
import { BottomTabs } from '../components/common/BottomTabs';
import { MissingRecord } from '../components/common/MissingRecord';
import { StatusBadge } from '../components/common/StatusBadge';
import { Room, RoomStatus } from '../types';

export const RoomScreens: React.FC = () => {
  const {
    currentScreenId,
    params,
    navigate,
    rooms,
    tenants,
    contracts,
    initialPayments,
    handoverProtocols,
    checkoutPlans,
    assetItems,
    createRoom,
    updateRoom,
    confirmInitialPayment,
    checkInRoom,
    createCheckoutPlan,
    editCheckoutPlan,
    addCheckoutPlanFeedback
  } = useApp();

  // Selected room resolution
  const targetRoomId = params.roomId as string | undefined;
  const roomRequired = !['ROOMS', 'ROOM_NEW', 'ROOM_TERM'].includes(currentScreenId);
  const currentRoom = (targetRoomId
    ? rooms.find(r => r.id === targetRoomId)
    : roomRequired ? undefined : rooms[0])!;
  const currentTenant = tenants.find(t => t.id === currentRoom?.currentTenantId);
  const currentContract = contracts.find(c => c.id === currentRoom?.currentContractId) ||
    contracts.filter(c => c.roomId === currentRoom?.id && ['DA_KY', 'NHAP', 'HIEU_LUC'].includes(c.status))
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];
  const currentInitialPayment = initialPayments.find(payment => payment.contractId === currentContract?.id);
  const currentHandover = handoverProtocols.find(protocol =>
    protocol.contractId === currentContract?.id && protocol.paperHandoverSigned && protocol.keysCardsHandedOver
  );
  const currentPlan = checkoutPlans.find(p => p.roomId === currentRoom?.id && p.status === 'DANG_CHO');

  // Search & filter state for ROOMS list
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | RoomStatus>('ALL');
  const [floorFilter, setFloorFilter] = useState<number | 'ALL'>('ALL');

  // ROOM_NEW form state
  const [newRoomNumber, setNewRoomNumber] = useState('');
  const [newFloor, setNewFloor] = useState<number>(0);
  const [newArea, setNewArea] = useState<number>(0);
  const [newPrice, setNewPrice] = useState<number>(0);
  const [newNote, setNewNote] = useState('');
  const [newRoomError, setNewRoomError] = useState<string | null>(null);

  // ROOM_EDIT form state
  const [editFloor, setEditFloor] = useState<number>(currentRoom?.floor || 1);
  const [editArea, setEditArea] = useState<number>(currentRoom?.area || 28);
  const [editPrice, setEditPrice] = useState<number>(currentRoom?.basePrice || 4500000);
  const [editNote, setEditNote] = useState(currentRoom?.note || '');

  // ROOM_FIRSTPAY form state
  const [payAmount, setPayAmount] = useState<number>((currentContract?.depositAmount || 0) + (currentContract?.firstMonthRent || 0));
  const [bankRefCode, setBankRefCode] = useState('');
  const [firstPayError, setFirstPayError] = useState<string | null>(null);

  // ROOM_PLAN_NEW form state
  const [planDate, setPlanDate] = useState('');
  const [planChannel, setPlanChannel] = useState<'ZALO' | 'DIEN_THOAI' | 'TRUC_TIEP'>('ZALO');
  const [planNotes, setPlanNotes] = useState('');

  // ROOM_PLAN_EDIT form state
  const [planEditDate, setPlanEditDate] = useState(currentPlan?.plannedDate || '');
  const [planEditReason, setPlanEditReason] = useState('');

  // ROOM_PLAN_FEED form state
  const [feedChannel, setFeedChannel] = useState('Zalo');
  const [feedContent, setFeedContent] = useState('');

  if (roomRequired && (!targetRoomId || !rooms.some(room => room.id === targetRoomId))) {
    return <MissingRecord title="Chi tiết phòng" message="Phòng được chọn không còn tồn tại hoặc đã bị xóa." backTo="ROOMS" />;
  }

  // 1. ROOMS Screen (F.3 / F.4)
  if (currentScreenId === 'ROOMS') {
    const filteredRooms = rooms.filter(r => {
      const matchSearch = r.roomNumber.includes(searchTerm) || r.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || r.status === statusFilter;
      const matchFloor = floorFilter === 'ALL' || r.floor === floorFilter;
      return matchSearch && matchStatus && matchFloor;
    });

    return (
      <div className="flex-1 flex flex-col justify-between bg-slate-50">
        <AppHeader
          title="Danh Sách Phòng"
          subtitle={`Toà nhà GreenHouse (${rooms.length} phòng)`}
          rightAction={
            <button
              onClick={() => navigate('ROOM_NEW')}
              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1 shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm phòng</span>
            </button>
          }
        />

        <div className="p-3 bg-white border-b border-slate-200 space-y-2">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo số phòng (101, 201...)"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
            />
          </div>

          {/* Status filter tabs */}
          <div className="flex items-center space-x-1 overflow-x-auto text-[11px] pb-1 scrollbar-none">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap cursor-pointer ${statusFilter === 'ALL' ? 'bg-slate-900 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              Tất cả ({rooms.length})
            </button>
            <button
              onClick={() => setStatusFilter('TRONG')}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap cursor-pointer ${statusFilter === 'TRONG' ? 'bg-emerald-600 text-white font-bold' : 'bg-emerald-50 text-emerald-800'}`}
            >
              Trống ({rooms.filter(r => r.status === 'TRONG').length})
            </button>
            <button
              onClick={() => setStatusFilter('DANG_THUE')}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap cursor-pointer ${statusFilter === 'DANG_THUE' ? 'bg-blue-600 text-white font-bold' : 'bg-blue-50 text-blue-800'}`}
            >
              Đang thuê ({rooms.filter(r => r.status === 'DANG_THUE').length})
            </button>
            <button
              onClick={() => setStatusFilter('SAP_TRA')}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap cursor-pointer ${statusFilter === 'SAP_TRA' ? 'bg-amber-600 text-white font-bold' : 'bg-amber-50 text-amber-800'}`}
            >
              Sắp trả ({rooms.filter(r => r.status === 'SAP_TRA').length})
            </button>
            <button
              onClick={() => setStatusFilter('CHUA_BAN_GIAO_XONG')}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap cursor-pointer ${statusFilter === 'CHUA_BAN_GIAO_XONG' ? 'bg-rose-600 text-white font-bold' : 'bg-rose-50 text-rose-800'}`}
            >
              Chưa xong ({rooms.filter(r => r.status === 'CHUA_BAN_GIAO_XONG').length})
            </button>
          </div>
        </div>

        {/* Room cards grid */}
        <div className="responsive-card-grid flex-1 p-3 space-y-2 overflow-y-auto">
          {filteredRooms.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6">
              <KeyRound className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <div className="text-xs font-bold text-slate-700">Không tìm thấy phòng phù hợp</div>
              <p className="text-[11px] text-slate-500 mt-1">Thử thay đổi bộ lọc hoặc tìm kiếm mã phòng khác.</p>
            </div>
          ) : (
            filteredRooms.map(room => {
              const tenant = tenants.find(t => t.id === room.currentTenantId);

              return (
                <div
                  key={room.id}
                  onClick={() => navigate('ROOM_DETAIL', { roomId: room.id })}
                  className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-blue-400 transition-all cursor-pointer space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                        {room.roomNumber}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          Phòng {room.roomNumber} • Tầng {room.floor}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {room.area} m² • {room.basePrice.toLocaleString()} đ/tháng
                        </div>
                      </div>
                    </div>
                    <StatusBadge status={room.status} type="room" />
                  </div>

                  {tenant ? (
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs flex items-center justify-between">
                      <div className="flex items-center space-x-1.5 truncate">
                        <User className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="font-semibold text-slate-800 truncate">{tenant.fullName}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono shrink-0">{tenant.phone}</span>
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-400 italic px-1">
                      {room.status === 'TRONG' ? 'Phòng trống, sẵn sàng cho khách mới' : room.note || 'Chưa có người thuê'}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        <BottomTabs />
      </div>
    );
  }

  // 2. ROOM_NEW Screen (F.4)
  if (currentScreenId === 'ROOM_NEW') {
    const handleCreateRoom = (e: React.FormEvent) => {
      e.preventDefault();
      setNewRoomError(null);
      const res = createRoom({
        roomNumber: newRoomNumber.trim(),
        floor: Number(newFloor),
        area: Number(newArea),
        basePrice: Number(newPrice),
        note: newNote.trim()
      });
      if (res.success && res.roomId) {
        navigate('ROOM_DETAIL', { roomId: res.roomId });
      } else if (res.error) {
        setNewRoomError(res.error);
      }
    };

    return (
      <div className="flex-1 flex flex-col p-4 bg-slate-50">
        <AppHeader title="Thêm Phòng Mới" subtitle="Quy định: Trạng thái ban đầu của phòng mới luôn là TRỐNG" onBack={() => navigate('ROOMS')} />

        <div className="mt-3 bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
          {newRoomError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs">
              {newRoomError}
            </div>
          )}

          <form onSubmit={handleCreateRoom} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mã / Số phòng (Duy nhất)</label>
              <input
                type="text"
                value={newRoomNumber}
                onChange={e => setNewRoomNumber(e.target.value)}
                placeholder="Ví dụ: 501, 502..."
                required
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tầng</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={newFloor}
                  onChange={e => setNewFloor(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Diện tích (m²)</label>
                <input
                  type="number"
                  min="10"
                  value={newArea}
                  onChange={e => setNewArea(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Giá thuê cơ bản (VNĐ / tháng)</label>
              <input
                type="number"
                step="50000"
                min="1000000"
                value={newPrice}
                onChange={e => setNewPrice(Number(e.target.value))}
                required
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Ghi chú đặc điểm phòng</label>
              <textarea
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                placeholder="Mô tả hướng cửa sổ, trang thiết bị bàn giao sẵn..."
                rows={2}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
              />
            </div>

            <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-[11px] text-blue-900">
              <strong className="block font-bold mb-0.5">Quy tắc nghiệp vụ:</strong>
              Trạng thái phòng xuất phát từ bàn giao/hợp đồng thực tế. Không cho phép người dùng tự chọn trạng thái Đang thuê khi tạo phòng mới.
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={() => navigate('ROOMS')}
                className="flex-1 py-2.5 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                Hủy Bỏ
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
              >
                Lưu Phòng Mới
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // 3. ROOM_DETAIL Screen (F.4)
  if (currentScreenId === 'ROOM_DETAIL') {
    return (
      <div className="flex-1 flex flex-col justify-between bg-slate-50">
        <AppHeader
          title={`Chi Tiết Phòng ${currentRoom.roomNumber}`}
          subtitle={`Tầng ${currentRoom.floor} • Diện tích ${currentRoom.area} m²`}
          onBack={() => navigate('ROOMS')}
          rightAction={
            <button
              onClick={() => navigate('ROOM_EDIT', { roomId: currentRoom.id })}
              className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
              title="Sửa thông tin cơ bản phòng"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          }
        />

        <div className="flex-1 p-3.5 space-y-3 overflow-y-auto">
          {/* Status Header Banner */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Trạng thái suy ra</div>
              <div className="mt-1">
                <StatusBadge status={currentRoom.status} type="room" />
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-slate-500">Giá niêm yết</div>
              <div className="text-base font-extrabold text-blue-900 mt-0.5">
                {currentRoom.basePrice.toLocaleString()} <span className="text-xs font-normal">đ/tháng</span>
              </div>
            </div>
          </div>

          {/* Current Tenant Card (Cross-link 5 to TENANT_DETAIL) */}
          <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 flex items-center">
                <User className="w-4 h-4 mr-1.5 text-blue-600" /> Người Thuê Hiện Tại
              </span>
            </div>

            {currentTenant ? (
              <div
                onClick={() => navigate('TENANT_DETAIL', { tenantId: currentTenant.id, roomId: currentRoom.id })}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200/80 transition-colors cursor-pointer flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900">{currentTenant.fullName}</div>
                  <div className="text-[11px] text-slate-500">Mã: {currentTenant.code} • SĐT: {currentTenant.phone}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            ) : (
              <div className="p-3 text-center bg-slate-50 rounded-xl text-xs text-slate-500">
                Phòng hiện chưa có người ở
              </div>
            )}
          </div>

          {/* Current Contract Card (Cross-link 6 to CONTRACT_DETAIL) */}
          <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 flex items-center">
                <FileText className="w-4 h-4 mr-1.5 text-indigo-600" /> Hợp Đồng Thuê
              </span>
            </div>

            {currentContract ? (
              <div
                onClick={() => navigate('CONTRACT_DETAIL', { contractId: currentContract.id, roomId: currentRoom.id, tenantId: currentContract.tenantId })}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50/60 border border-slate-200/80 transition-colors cursor-pointer flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                    <span>{currentContract.code}</span>
                    <StatusBadge status={currentContract.status} type="contract" size="sm" />
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Thời hạn: {currentContract.startDate} → {currentContract.endDate}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            ) : (
              <div className="p-3 text-center bg-slate-50 rounded-xl text-xs text-slate-500">
                Chưa có hợp đồng nào liên kết
              </div>
            )}
          </div>

          {/* Action Hub based on Room Status (Cross-links 7, 8, 9, 10, 18) */}
          <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs space-y-2">
            <div className="text-xs font-bold text-slate-900 mb-2">Thao Tác Nghiệp Vụ Phòng:</div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {/* Link 7: PAY_TRACK */}
              <button
                onClick={() => navigate('PAY_TRACK', { roomId: currentRoom.id })}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-800 text-left border border-slate-200 font-semibold flex items-center justify-between cursor-pointer"
              >
                <span className="truncate">Khoản phải thu</span>
                <span className="text-[10px] text-slate-400 font-mono">#7</span>
              </button>

              {/* Link 8: ROOM_PLAN */}
              <button
                onClick={() => navigate('ROOM_PLAN', { roomId: currentRoom.id })}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-amber-50 text-slate-800 text-left border border-slate-200 font-semibold flex items-center justify-between cursor-pointer"
              >
                <span className="truncate">Kế hoạch trả</span>
                <span className="text-[10px] text-slate-400 font-mono">#8</span>
              </button>

              {/* Link 9: DEPOSIT */}
              <button
                onClick={() => navigate('DEPOSIT', { roomId: currentRoom.id })}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-800 text-left border border-slate-200 font-semibold flex items-center justify-between cursor-pointer"
              >
                <span className="truncate">Quyết toán cọc</span>
                <span className="text-[10px] text-slate-400 font-mono">#9</span>
              </button>

              {/* ASSET Management */}
              <button
                onClick={() => navigate('ASSET', { roomId: currentRoom.id })}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-purple-50 text-slate-800 text-left border border-slate-200 font-semibold flex items-center justify-between cursor-pointer"
              >
                <span className="truncate">Tài sản & Bàn giao</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>

            {/* Contextual primary buttons */}
            <div className="pt-2 space-y-2">
              {currentRoom.status === 'TRONG' && (
                <button
                  onClick={() => navigate('ROOM_CHECK', { roomId: currentRoom.id })}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Kiểm Tra Khả Năng Cho Thuê</span>
                </button>
              )}

              {currentRoom.status === 'DANG_THUE' && (
                <button
                  onClick={() => navigate('ROOM_RENEW_CHECK', { roomId: currentRoom.id })}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Kiểm Tra Tiếp Tục Thuê</span>
                </button>
              )}

              {(currentRoom.status === 'SAP_TRA' || currentRoom.status === 'CHUA_BAN_GIAO_XONG') && (
                <button
                  onClick={() => navigate('RETURN', { roomId: currentRoom.id })}
                  className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Tiến Hành Quy Trình Trả Phòng</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <BottomTabs />
      </div>
    );
  }

  // 4. ROOM_EDIT Screen (F.4)
  if (currentScreenId === 'ROOM_EDIT') {
    const handleSaveEdit = (e: React.FormEvent) => {
      e.preventDefault();
      updateRoom(currentRoom.id, {
        floor: editFloor,
        area: editArea,
        basePrice: editPrice,
        note: editNote
      });
      navigate('ROOM_DETAIL', { roomId: currentRoom.id });
    };

    return (
      <div className="flex-1 flex flex-col p-4 bg-slate-50">
        <AppHeader title={`Sửa Thông Tin Phòng ${currentRoom.roomNumber}`} subtitle="Cập nhật diện tích, tầng & giá thuê cơ bản" onBack={() => navigate('ROOM_DETAIL', { roomId: currentRoom.id })} />

        <div className="mt-3 bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
          <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Mã phòng (Cố định)</label>
              <input
                type="text"
                value={currentRoom.roomNumber}
                disabled
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tầng</label>
                <input
                  type="number"
                  value={editFloor}
                  onChange={e => setEditFloor(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Diện tích (m²)</label>
                <input
                  type="number"
                  value={editArea}
                  onChange={e => setEditArea(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Giá thuê cơ bản (VNĐ)</label>
              <input
                type="number"
                value={editPrice}
                onChange={e => setEditPrice(Number(e.target.value))}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Ghi chú</label>
              <textarea
                value={editNote}
                onChange={e => setEditNote(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
              />
            </div>

            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900">
              Quy tắc bảo vệ dữ liệu: Lịch sử thuê và trạng thái vận hành của phòng không được sửa thủ công ở đây.
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={() => navigate('ROOM_DETAIL', { roomId: currentRoom.id })}
                className="flex-1 py-2.5 border border-slate-300 text-slate-700 font-semibold rounded-xl"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs"
              >
                Lưu Thay Đổi
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // 5. ROOM_CHECK Screen (F.4 - Cross-link 10)
  if (currentScreenId === 'ROOM_CHECK') {
    const isVacant = currentRoom.status === 'TRONG';
    const roomAssets = assetItems.filter(item => item.roomId === currentRoom.id);
    const isClean = isVacant && !/chưa dọn|chưa vệ sinh|chưa bàn giao/i.test(currentRoom.note || '');
    const isAssetReady = roomAssets.length > 0 && roomAssets.every(item => !item.isDamagedOrMissing);
    const passedChecks = [isVacant, isClean, isAssetReady].filter(Boolean).length;
    const prospectiveTenant = tenants.find(tenant => tenant.status === 'TIEM_NANG');

    return (
      <div className="flex-1 flex flex-col p-4 bg-slate-50 space-y-3">
        <AppHeader
          title={`Kiểm Tra Khả Năng Cho Thuê P.${currentRoom.roomNumber}`}
          subtitle="Checklist điều kiện tiếp nhận khách mới"
          onBack={() => navigate('ROOM_DETAIL', { roomId: currentRoom.id })}
        />

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3 text-xs">
          <div className="font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center justify-between">
            <span>Danh mục điều kiện kiểm tra:</span>
            <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              {passedChecks}/3 Tiêu chí đạt
            </span>
          </div>

          <div className="space-y-2">
            <div className={`p-2.5 rounded-xl border flex items-start space-x-2 ${isVacant ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
              {isVacant ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /> : <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />}
              <div>
                <strong className={isVacant ? 'font-semibold text-emerald-900' : 'font-semibold text-rose-900'}>
                  Trạng thái phòng: {isVacant ? 'TRỐNG' : currentRoom.status.replaceAll('_', ' ')}
                </strong>
                <p className="text-[11px] text-slate-600">{currentRoom.note || 'Chưa có ghi chú cho phòng này.'}</p>
              </div>
            </div>

            <div className={`p-2.5 rounded-xl border flex items-start space-x-2 ${isClean ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
              {isClean ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /> : <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />}
              <div>
                <strong className="font-semibold text-emerald-900">Hiện trạng vệ sinh & công năng</strong>
                <p className="text-[11px] text-slate-600">{isClean ? 'Phòng trống và không ghi nhận vướng mắc vệ sinh.' : 'Cần kiểm tra và ghi nhận hiện trạng phòng trước khi cho thuê.'}</p>
              </div>
            </div>

            <div className={`p-2.5 rounded-xl border flex items-start space-x-2 ${isAssetReady ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
              {isAssetReady ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /> : <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />}
              <div>
                <strong className="font-semibold text-emerald-900">Tài sản bàn giao đầy đủ</strong>
                <p className="text-[11px] text-slate-600">
                  {roomAssets.length ? `${roomAssets.length} hạng mục được ghi nhận; ${isAssetReady ? 'không có tài sản hư hỏng hoặc thiếu.' : 'cần kiểm kê/khắc phục trước khi cho thuê.'}` : 'Chưa có danh mục tài sản kiểm kê cho phòng này.'}
                </p>
              </div>
            </div>
          </div>

          {/* Cross-link 10 to RENTAL_TERMS */}
          <div className="pt-2">
            <button
              onClick={() => navigate('RENTAL_TERMS', { roomId: currentRoom.id, tenantId: prospectiveTenant?.id })}
              disabled={!isVacant || !isClean || !isAssetReady}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md cursor-pointer"
            >
              <span>Đủ Điều Kiện → Thỏa Thuận Điều Kiện Thuê</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 6. ROOM_IN Screen (F.4 - Cross-links 18, 19)
  if (currentScreenId === 'ROOM_IN') {
    const hasSignedContract = currentContract?.status === 'DA_KY' || currentContract?.status === 'HIEU_LUC';
    const hasConfirmedPayment = Boolean(currentInitialPayment);
    const hasSignedHandover = Boolean(currentHandover);
    const handleCheckIn = () => {
      const res = checkInRoom(currentRoom.id);
      if (res.success) {
        navigate('ROOM_DETAIL', { roomId: currentRoom.id }); // Link 19
      } else {
        navigate('ROOM_MISSING', { roomId: currentRoom.id }); // Link to missing
      }
    };

    return (
      <div className="flex-1 flex flex-col p-4 bg-slate-50 space-y-3">
        <AppHeader
          title={`Tiếp Nhận Phòng ${currentRoom.roomNumber}`}
          subtitle="Kiểm tra 4 điều kiện nghiệp vụ bắt buộc"
          onBack={() => navigate('ROOM_DETAIL', { roomId: currentRoom.id })}
        />

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3 text-xs">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-xs">
            <strong>Quy tắc nghiệp vụ nhận phòng:</strong>
            <br />
            Chỉ ghi nhận nhận phòng lần đầu khi hợp đồng được ký, tiền cọc 1 tháng và tiền thuê đầu tiên 1 tháng đã được đối chiếu đủ, cùng biên bản bàn giao giấy hợp lệ.
          </div>

          <div className="space-y-2">
            <div className={`p-2.5 rounded-xl border flex items-center justify-between ${hasSignedContract ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
              <span className="font-semibold text-slate-800">1. Hợp đồng thuê giấy đã ký hai bên:</span>
              <span className={`font-bold ${hasSignedContract ? 'text-emerald-700' : 'text-amber-700'}`}>
                {hasSignedContract ? 'Đã ký' : 'Chưa ký'}
              </span>
            </div>

            <div className={`p-2.5 rounded-xl border flex items-center justify-between ${hasConfirmedPayment ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
              <div>
                <span className="font-semibold text-slate-800">2. Thanh toán ban đầu (1 tháng cọc + 1 tháng thuê đầu):</span>
                <div className="text-[11px] text-slate-500">{hasConfirmedPayment ? `Đã xác nhận: ${currentInitialPayment?.amount.toLocaleString()} đ` : 'Chưa xác nhận'}</div>
              </div>
              <button
                onClick={() => navigate('ROOM_FIRSTPAY', { roomId: currentRoom.id, contractId: currentContract?.id })}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 underline cursor-pointer"
              >
                {hasConfirmedPayment ? 'Xem khoản thu' : 'Kiểm tra tiền'}
              </button>
            </div>

            <div className={`p-2.5 rounded-xl border flex items-center justify-between ${hasSignedHandover ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
              <span className="font-semibold text-slate-800">3. Biên bản bàn giao tài sản giấy:</span>
              <button
                onClick={() => navigate('ASSET_RECEIVE', { roomId: currentRoom.id, contractId: currentContract?.id })}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 underline cursor-pointer"
              >
                {hasSignedHandover ? 'Đã ghi nhận' : 'Biên bản nhận'}
              </button>
            </div>

            <div className={`p-2.5 rounded-xl border flex items-center justify-between ${hasSignedHandover ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
              <span className="font-semibold text-slate-800">4. Bàn giao chìa khóa & thẻ từ thực tế:</span>
              <span className={`font-bold ${hasSignedHandover ? 'text-emerald-700' : 'text-amber-700'}`}>
                {hasSignedHandover ? 'Đã xác nhận' : 'Chưa xác nhận'}
              </span>
            </div>
          </div>

          <div className="pt-2 space-y-2">
            <button
              onClick={handleCheckIn}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-md cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Xác Nhận Đủ Điều Kiện → Tiếp Nhận Phòng</span>
            </button>
            <button
              onClick={() => navigate('ROOM_MISSING', { roomId: currentRoom.id })}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs cursor-pointer"
            >
              Xem Các Điều Kiện Còn Thiếu
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 7. ROOM_MISSING Screen (F.4 - Cross-links 20, 21)
  if (currentScreenId === 'ROOM_MISSING') {
    const missingChecks = [
      { label: 'Hợp đồng chưa được ký', missing: !currentContract || currentContract.status !== 'DA_KY' && currentContract.status !== 'HIEU_LUC' },
      { label: 'Chưa xác nhận đủ tiền cọc và tiền thuê đầu', missing: !currentInitialPayment },
      { label: 'Chưa ký biên bản bàn giao tài sản', missing: !currentHandover }
    ].filter(item => item.missing);
    return (
      <div className="flex-1 flex flex-col p-4 bg-slate-50 space-y-3">
        <AppHeader
          title={`Ghi Nhận Điều Kiện Còn Thiếu P.${currentRoom.roomNumber}`}
          subtitle="Các hạng mục chưa hoàn tất nhận phòng"
          onBack={() => navigate('ROOM_IN', { roomId: currentRoom.id })}
        />

        <div className="bg-white rounded-2xl p-4 border border-rose-200 shadow-xs space-y-3 text-xs">
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-900 rounded-xl">
            <strong className="block font-bold mb-1">Cảnh báo nghiệp vụ:</strong>
            Phòng chưa thể tiếp nhận và chưa được chuyển sang trạng thái "Đang thuê" do còn thiếu các căn cứ tài chính hoặc pháp lý sau:
          </div>

          <div className="space-y-2">
            {missingChecks.length === 0 && (
              <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-emerald-800">
                Các điều kiện đang có đã đầy đủ. Hãy xác nhận lại nhận phòng.
              </p>
            )}
            {missingChecks.some(item => item.label.includes('tiền')) && (
              <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/60 flex items-start justify-between">
                <div>
                  <strong className="font-bold text-amber-900">Thiếu: Thanh toán ban đầu chưa đủ</strong>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    Cần đối chiếu đủ {currentContract?.depositAmount?.toLocaleString() || '—'} đ tiền cọc và {currentContract?.firstMonthRent?.toLocaleString() || '—'} đ tiền thuê đầu.
                  </p>
                </div>
                <button
                  onClick={() => navigate('ROOM_FIRSTPAY', { roomId: currentRoom.id })}
                  className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shrink-0 ml-2 cursor-pointer"
                >
                  Tra soát (#20)
                </button>
              </div>
            )}

            {missingChecks.some(item => item.label.includes('Hợp đồng')) && (
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-start justify-between">
                <div>
                  <strong className="font-bold text-slate-900">Thiếu: Hợp đồng chưa được ký</strong>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Cần hoàn tất thông tin và chữ ký trên hợp đồng trước khi nhận phòng.
                  </p>
                </div>
                <button
                  onClick={() => currentContract
                    ? navigate('CONTRACT_DETAIL', { roomId: currentRoom.id, contractId: currentContract.id })
                    : navigate('CONTRACTS')}
                  className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shrink-0 ml-2 cursor-pointer"
                >
                  Xem HĐ (#21)
                </button>
              </div>
            )}

            {missingChecks.some(item => item.label.includes('biên bản')) && (
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-start justify-between">
                <div>
                  <strong className="font-bold text-slate-900">Thiếu: Biên bản bàn giao tài sản</strong>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Ghi nhận hiện trạng, tài sản, chìa khóa và thẻ từ trước khi nhận phòng.
                  </p>
                </div>
                <button
                  onClick={() => navigate('ASSET_INV', { roomId: currentRoom.id })}
                  className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shrink-0 ml-2 cursor-pointer"
                >
                  Lập biên bản
                </button>
              </div>
            )}
          </div>

          <div className="pt-2">
            <button
              onClick={() => navigate('ROOM_IN', { roomId: currentRoom.id })}
              className="w-full py-2.5 border border-slate-300 text-slate-700 font-semibold rounded-xl text-xs hover:bg-slate-100 cursor-pointer"
            >
              Quay lại kiểm tra tiếp nhận phòng
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 8. ROOM_FIRSTPAY Screen (F.4 - Cross-links 14, 15)
  if (currentScreenId === 'ROOM_FIRSTPAY') {
    if (!currentContract || currentContract.type !== 'LAN_DAU' || currentContract.status !== 'DA_KY') {
      return <MissingRecord title="Thanh toán ban đầu" message="Cần chọn hợp đồng lần đầu đã ký trước khi xác nhận khoản thu." backTo="ROOMS" />;
    }
    const expectedDeposit = currentContract.depositAmount;
    const expectedRent = currentContract.firstMonthRent;
    const expectedTotal = expectedDeposit + expectedRent;

    const handleConfirmFirstPay = (e: React.FormEvent) => {
      e.preventDefault();
      setFirstPayError(null);
      const res = confirmInitialPayment(currentRoom.id, Number(payAmount), bankRefCode);
      if (res.success) {
        navigate('ASSET_INV', { roomId: currentRoom.id }); // Cross-link 15
      } else if (res.error) {
        setFirstPayError(res.error);
      }
    };

    return (
      <div className="flex-1 flex flex-col p-4 bg-slate-50 space-y-3">
        <AppHeader
          title={`Thanh Toán Ban Đầu P.${currentRoom.roomNumber}`}
          subtitle="1 tháng cọc + 1 tháng thuê đầu trả trước"
          onBack={() => navigate('ROOM_IN', { roomId: currentRoom.id })}
        />

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3 text-xs">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 space-y-1">
            <div className="font-bold flex items-center">
              <ShieldCheck className="w-4 h-4 mr-1 text-blue-600" /> Quy định cấu trúc tiền ban đầu:
            </div>
            <div className="flex justify-between text-xs pt-1">
              <span>• Tiền đặt cọc (1 tháng):</span>
              <strong className="font-mono">{expectedDeposit.toLocaleString()} đ</strong>
            </div>
            <div className="flex justify-between text-xs">
              <span>• Tiền thuê tháng đầu (trả trước):</span>
              <strong className="font-mono">{expectedRent.toLocaleString()} đ</strong>
            </div>
            <div className="flex justify-between text-xs pt-1 border-t border-blue-200 font-bold text-blue-950">
              <span>TỔNG CẦN CHUYỂN KHOẢN:</span>
              <span className="font-mono text-sm text-blue-700">{expectedTotal.toLocaleString()} đ</span>
            </div>
          </div>

          {firstPayError && (
            <div className="p-2.5 rounded-xl bg-red-50 text-red-800 border border-red-200">
              {firstPayError}
            </div>
          )}

          <form onSubmit={handleConfirmFirstPay} className="space-y-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Số tiền thực tế nhận qua ngân hàng (VNĐ)</label>
              <input
                type="number"
                value={payAmount}
                onChange={e => setPayAmount(Number(e.target.value))}
                required
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono font-bold text-slate-900 bg-white"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Phải khớp chính xác {expectedTotal.toLocaleString()} đ. Không cho phép nhận thiếu.
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Mã tham chiếu / Số bút toán ngân hàng</label>
              <input
                type="text"
                value={bankRefCode}
                onChange={e => setBankRefCode(e.target.value)}
                placeholder="MB-FT26278891234..."
                required
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono bg-white"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-md cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Xác Nhận Đã Thu Đủ → Kiểm Kê Bàn Giao</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // 9. ROOM_TERM Screen (F.4 - Cross-links 1, 28)
  if (currentScreenId === 'ROOM_TERM') {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const expiringContracts = contracts
      .filter(contract => {
        if (contract.status !== 'HIEU_LUC') return false;
        const [day, month, year] = contract.endDate.split('/').map(Number);
        const endDate = new Date(year, month - 1, day);
        const daysRemaining = Math.ceil((endDate.getTime() - currentDate.getTime()) / 86400000);
        return Number.isFinite(endDate.getTime()) && daysRemaining >= 0 && daysRemaining <= 60;
      })
      .map(contract => ({
        contract,
        room: rooms.find(room => room.id === contract.roomId),
        tenant: tenants.find(tenant => tenant.id === contract.tenantId),
        daysRemaining: Math.ceil(((() => {
          const [day, month, year] = contract.endDate.split('/').map(Number);
          return new Date(year, month - 1, day).getTime();
        })() - currentDate.getTime()) / 86400000)
      }));

    return (
      <div className="flex-1 flex flex-col p-4 bg-slate-50 space-y-3">
        <AppHeader
          title="Theo Dõi Thời Hạn Thuê"
          subtitle="Danh sách phòng theo hạn hợp đồng thuê"
          onBack={() => navigate('ROOMS')}
        />

        <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-xs space-y-2.5">
          <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
            <span>Hợp Đồng Sắp Hết Hạn (&lt; 60 Ngày)</span>
            <span className="text-[10px] bg-amber-50 text-amber-800 font-mono px-2 py-0.5 rounded">
              {expiringContracts.length} hợp đồng
            </span>
          </div>

          {expiringContracts.length ? expiringContracts.map(({ contract, room, tenant, daysRemaining }) => (
            <div key={contract.id} className="p-3 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs">
                  Phòng {room?.roomNumber || contract.roomId} • {tenant?.fullName || 'Chưa gán khách'}
                </span>
                <span className="text-[11px] text-amber-700 font-bold bg-amber-100 px-2 py-0.5 rounded-full">
                  Còn {daysRemaining} ngày
                </span>
              </div>
              <div className="text-[11px] text-slate-600">
                Hợp đồng: {contract.code} • Hạn kết thúc: <strong>{contract.endDate}</strong>
              </div>
              <button
                onClick={() => navigate('ROOM_PLAN', { roomId: contract.roomId })}
                className="w-full py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-1 cursor-pointer"
              >
                <span>Xem kế hoạch phòng {room?.roomNumber || contract.roomId}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )) : (
            <div className="rounded-xl border border-dashed border-slate-300 p-5 text-center text-xs text-slate-500">
              Không có hợp đồng nào hết hạn trong 60 ngày tới.
            </div>
          )}
        </div>
      </div>
    );
  }

  // 10. ROOM_PLAN Screen (F.4 - Cross-links 8, 29)
  if (currentScreenId === 'ROOM_PLAN') {
    return (
      <div className="flex-1 flex flex-col p-4 bg-slate-50 space-y-3">
        <AppHeader
          title={`Kế Hoạch & Phản Hồi Trả P.${currentRoom.roomNumber}`}
          subtitle="Ngày dự kiến trả & lịch sử trao đổi với khách"
          onBack={() => navigate('ROOM_DETAIL', { roomId: currentRoom.id })}
        />

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3 text-xs">
          {currentPlan ? (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Ngày dự kiến trả:</span>
                <span className="font-bold text-amber-700 text-sm font-mono">{currentPlan.plannedDate}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-600">
                <span>Kênh xác nhận:</span>
                <span className="font-semibold text-slate-800">{currentPlan.confirmedChannel}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-600">
                <span>Trạng thái kế hoạch:</span>
                <span className={`font-semibold ${currentPlan.status === 'DA_HUY_DO_NOI_TIEP' ? 'text-slate-500 line-through' : 'text-amber-700'}`}>
                  {currentPlan.status === 'DA_HUY_DO_NOI_TIEP' ? 'Đã hủy tự động do nối tiếp' : 'Đang chờ đến ngày'}
                </span>
              </div>
              {currentPlan.notes && (
                <div className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-200">
                  Ghi chú: {currentPlan.notes}
                </div>
              )}

              <div className="pt-2 flex space-x-2">
                <button
                  onClick={() => navigate('ROOM_PLAN_EDIT', { roomId: currentRoom.id })}
                  className="flex-1 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-semibold text-xs cursor-pointer"
                >
                  Sửa ngày dự kiến
                </button>
                <button
                  onClick={() => navigate('ROOM_PLAN_FEED', { roomId: currentRoom.id })}
                  className="flex-1 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 rounded-lg font-semibold text-xs cursor-pointer"
                >
                  + Thêm phản hồi
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center bg-slate-50 rounded-xl space-y-2">
              <p className="text-slate-500">Chưa ghi nhận kế hoạch trả phòng nào cho phòng này.</p>
              <button
                onClick={() => navigate('ROOM_PLAN_NEW', { roomId: currentRoom.id })}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs cursor-pointer"
              >
                + Ghi Ngày Dự Kiến Trả
              </button>
            </div>
          )}

          {/* Cross-link 29 to RETURN */}
          <div className="pt-2">
            <button
              onClick={() => navigate('RETURN', { roomId: currentRoom.id })}
              className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-md cursor-pointer"
            >
              <span>Đến Ngày Trả → Bắt Đầu Quy Trình Trả Phòng</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 11. ROOM_PLAN_NEW Screen (F.4)
  if (currentScreenId === 'ROOM_PLAN_NEW') {
    const handleSavePlanNew = (e: React.FormEvent) => {
      e.preventDefault();
      createCheckoutPlan(currentRoom.id, planDate, planChannel, planNotes);
      navigate('ROOM_PLAN', { roomId: currentRoom.id });
    };

    return (
      <div className="flex-1 flex flex-col p-4 bg-slate-50 space-y-3">
        <AppHeader
          title={`Ghi Ngày Dự Kiến Trả P.${currentRoom.roomNumber}`}
          subtitle="Ghi nhận thông tin do khách thông báo"
          onBack={() => navigate('ROOM_PLAN', { roomId: currentRoom.id })}
        />

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3 text-xs">
          <form onSubmit={handleSavePlanNew} className="space-y-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Ngày dự kiến trả phòng</label>
              <input
                type="text"
                value={planDate}
                onChange={e => setPlanDate(e.target.value)}
                placeholder="DD/MM/YYYY"
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Kênh khách xác nhận</label>
              <select
                value={planChannel}
                onChange={e => setPlanChannel(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
              >
                <option value="ZALO">Trao đổi qua Zalo</option>
                <option value="DIEN_THOAI">Gọi điện thoại trực tiếp</option>
                <option value="TRUC_TIEP">Gặp trực tiếp tại tòa nhà</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Ghi chú chi tiết trao đổi</label>
              <textarea
                value={planNotes}
                onChange={e => setPlanNotes(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>

            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-[11px]">
              Lưu ý: Đây chỉ là ngày dự kiến do người thuê thông báo. Trạng thái phòng chuyển sang "Sắp trả", chưa phải bàn giao thực tế.
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={() => navigate('ROOM_PLAN', { roomId: currentRoom.id })}
                className="flex-1 py-2.5 border border-slate-300 text-slate-700 font-semibold rounded-xl"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs"
              >
                Lưu Kế Hoạch
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // 12. ROOM_PLAN_EDIT Screen (F.4)
  if (currentScreenId === 'ROOM_PLAN_EDIT') {
    const handleSavePlanEdit = (e: React.FormEvent) => {
      e.preventDefault();
      editCheckoutPlan(currentRoom.id, planEditDate, 'Zalo', planEditReason);
      navigate('ROOM_PLAN', { roomId: currentRoom.id });
    };

    return (
      <div className="flex-1 flex flex-col p-4 bg-slate-50 space-y-3">
        <AppHeader
          title={`Sửa Ngày Dự Kiến Trả P.${currentRoom.roomNumber}`}
          subtitle="Cập nhật ngày dự kiến kèm căn cứ mới"
          onBack={() => navigate('ROOM_PLAN', { roomId: currentRoom.id })}
        />

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3 text-xs">
          <form onSubmit={handleSavePlanEdit} className="space-y-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Ngày dự kiến mới</label>
              <input
                type="text"
                value={planEditDate}
                onChange={e => setPlanEditDate(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Căn cứ / Lý do thay đổi</label>
              <textarea
                value={planEditReason}
                onChange={e => setPlanEditReason(e.target.value)}
                required
                rows={2}
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={() => navigate('ROOM_PLAN', { roomId: currentRoom.id })}
                className="flex-1 py-2.5 border border-slate-300 text-slate-700 font-semibold rounded-xl"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs"
              >
                Cập Nhật Ngày Mới
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // 13. ROOM_PLAN_FEED Screen (F.4)
  if (currentScreenId === 'ROOM_PLAN_FEED') {
    const handleAddFeed = (e: React.FormEvent) => {
      e.preventDefault();
      if (!feedContent.trim()) return;
      addCheckoutPlanFeedback(currentRoom.id, feedChannel, feedContent);
      setFeedContent('');
    };

    return (
      <div className="flex-1 flex flex-col p-4 bg-slate-50 space-y-3">
        <AppHeader
          title={`Lịch Sử Phản Hồi Trả P.${currentRoom.roomNumber}`}
          subtitle="Dòng thời gian trao đổi với khách"
          onBack={() => navigate('ROOM_PLAN', { roomId: currentRoom.id })}
        />

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3 text-xs">
          <form onSubmit={handleAddFeed} className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="font-bold text-slate-800">Thêm ghi nhận trao đổi mới:</div>
            <div className="flex space-x-2">
              <select
                value={feedChannel}
                onChange={e => setFeedChannel(e.target.value)}
                className="px-2 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
              >
                <option value="Zalo">Zalo</option>
                <option value="Điện thoại">Điện thoại</option>
                <option value="Trực tiếp">Trực tiếp</option>
              </select>
              <input
                type="text"
                value={feedContent}
                onChange={e => setFeedContent(e.target.value)}
                placeholder="Nội dung khách nhắn/nói..."
                required
                className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
              />
            </div>
            <button
              type="submit"
              className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs cursor-pointer"
            >
              Lưu Phản Hồi
            </button>
          </form>

          {/* Timeline */}
          <div className="space-y-2 pt-2">
            <div className="font-bold text-slate-700">Dòng sự kiện phản hồi:</div>
            {currentPlan?.history && currentPlan.history.length > 0 ? (
              currentPlan.history.map((h, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-blue-700">Kênh: {h.channel}</span>
                    <span className="text-slate-400 font-mono">{h.date}</span>
                  </div>
                  <p className="text-slate-800 text-xs">{h.content}</p>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-xs italic">Chưa có lịch sử phản hồi.</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 14. ROOM_RENEW_CHECK Screen (F.4 - Cross-links 26, 27)
  if (currentScreenId === 'ROOM_RENEW_CHECK') {
    return (
      <div className="flex-1 flex flex-col p-4 bg-slate-50 space-y-3">
        <AppHeader
          title={`Kiểm Tra Tiếp Tục Thuê P.${currentRoom.roomNumber}`}
          subtitle="Hợp đồng nối tiếp & Kế thừa tiền cọc"
          onBack={() => navigate('ROOM_DETAIL', { roomId: currentRoom.id })}
        />

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3 text-xs">
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl space-y-1">
            <strong className="block font-bold">Xác nhận nghiệp vụ tiếp tục thuê:</strong>
            <p>
              Hợp đồng nối tiếp đã được ký kết và có hiệu lực. Hệ thống kế thừa khoản cọc gốc hiện có (không sinh cọc mới), phòng duy trì trạng thái <strong>ĐANG THUÊ</strong> và kế hoạch trả cũ tự động bị hủy theo sự kiện.
            </p>
          </div>

          <div className="space-y-2">
            <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="font-semibold text-slate-800">Hợp đồng nối tiếp:</span>
              <span className="font-mono font-bold text-blue-700">HD-2026-008-NT</span>
            </div>
            <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="font-semibold text-slate-800">Tiền cọc:</span>
              <span className="font-mono text-emerald-700 font-bold">Kế thừa 4.800.000 đ (Chỉ đọc)</span>
            </div>
            <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="font-semibold text-slate-800">Kế hoạch trả phòng cũ:</span>
              <span className="text-slate-500 line-through font-medium">Đã tự động hủy</span>
            </div>
          </div>

          {/* Cross-link 27 to ROOM_PLAN */}
          <div className="pt-2">
            <button
              onClick={() => navigate('ROOM_PLAN', { roomId: currentRoom.id })}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-md cursor-pointer"
            >
              <span>Xem Kế Hoạch Trả Đã Tự Động Hủy</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
