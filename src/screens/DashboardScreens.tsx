import React from 'react';
import {
  Building2,
  KeyRound,
  FileText,
  AlertCircle,
  Banknote,
  BarChart3,
  ChevronRight,
  TrendingUp,
  Clock,
  Sparkles,
  ShieldAlert,
  Sliders,
  DollarSign,
  UserCheck,
  CheckCircle2,
  Users,
  Settings
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AppHeader } from '../components/common/AppHeader';
import { BottomTabs } from '../components/common/BottomTabs';

export const DashboardScreens: React.FC = () => {
  const {
    currentScreenId,
    navigate,
    rooms,
    contracts,
    transactions,
    overdueDebts,
    periods,
    meterReadings,
    tenants
  } = useApp();

  const vacantRooms = rooms.filter(r => r.status === 'TRONG');
  const occupiedRooms = rooms.filter(r => r.status === 'DANG_THUE');
  const pendingCheckoutRooms = rooms.filter(r => r.status === 'SAP_TRA');
  const unresolvedRooms = rooms.filter(r => r.status === 'CHUA_BAN_GIAO_XONG');

  const totalRooms = rooms.length;
  const occupancyRate = totalRooms ? Math.round((occupiedRooms.length / totalRooms) * 100) : 0;

  // Contracts expiring in next 60 days
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiringContracts = contracts.filter(contract => {
    if (contract.status !== 'HIEU_LUC') return false;
    const [day, month, year] = contract.endDate.split('/').map(Number);
    const endDate = new Date(year, month - 1, day);
    const daysUntilEnd = Math.ceil((endDate.getTime() - today.getTime()) / 86400000);
    return Number.isFinite(endDate.getTime()) && daysUntilEnd >= 0 && daysUntilEnd <= 60;
  });
  const nearestExpiringContract = expiringContracts
    .map(contract => ({
      contract,
      room: rooms.find(room => room.id === contract.roomId),
      tenant: tenants.find(tenant => tenant.id === contract.tenantId)
    }))
    .sort((a, b) => {
      const parse = (date: string) => {
        const [day, month, year] = date.split('/').map(Number);
        return new Date(year, month - 1, day).getTime();
      };
      return parse(a.contract.endDate) - parse(b.contract.endDate);
    })[0];

  // Unpaid current month
  const unpaidTransactions = transactions.filter(t => t.status === 'CHUA_THU');
  const totalUnpaidAmount = unpaidTransactions.reduce((acc, t) => acc + t.totalDue, 0);

  // Overdue debts
  const totalOverdueAmount = overdueDebts.reduce((acc, d) => acc + d.unpaidAmount, 0);
  const latestPeriod = periods[periods.length - 1];
  const roomForMeterReading = rooms.find(room =>
    room.status === 'DANG_THUE' &&
    !meterReadings.some(reading => reading.roomId === room.id && reading.periodId === latestPeriod?.id)
  ) || occupiedRooms[0];
  const roomForNewLease = vacantRooms[0];

  // HOME Screen (F.3)
  if (currentScreenId === 'HOME') {
    return (
      <div className="dashboard-home flex-1 flex flex-col justify-between bg-slate-50">
        <AppHeader
          title="Tổng Quan Quản Lý"
          subtitle="Chung cư Mini GreenHouse (18 Hoàng Quốc Việt)"
          showBack={false}
        />

        <div className="dashboard-home__content flex-1 p-3.5 space-y-3.5 overflow-y-auto xl:grid xl:grid-cols-2 xl:content-start xl:items-start xl:gap-5 xl:space-y-0 xl:p-6">
          {/* Building Hero Card */}
          <div className="rounded-2xl bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white p-4 shadow-md relative overflow-hidden">
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-blue-200 bg-white/10 px-2 py-0.5 rounded-full">
                  Chủ nhà: Nguyễn Văn Minh
                </span>
                <h2 className="text-lg font-extrabold mt-1">Toà Nhà {totalRooms} Căn Hộ</h2>
                <p className="text-xs text-blue-100">
                  Tỷ lệ lấp đầy: <strong className="text-white text-sm">{occupancyRate}%</strong> ({occupiedRooms.length}/{totalRooms} phòng đang thuê)
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center border border-white/20">
                <Building2 className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* Quick status bar */}
            <div className="grid grid-cols-4 gap-1.5 mt-3 pt-3 border-t border-white/15 text-center text-xs">
              <div className="bg-white/10 rounded-lg py-1.5 px-1 cursor-pointer hover:bg-white/20" onClick={() => navigate('ROOMS')}>
                <div className="text-[10px] text-blue-200">Đang thuê</div>
                <div className="font-extrabold text-sm text-white">{occupiedRooms.length}</div>
              </div>
              <div className="bg-white/10 rounded-lg py-1.5 px-1 cursor-pointer hover:bg-white/20" onClick={() => navigate('ROOMS')}>
                <div className="text-[10px] text-emerald-200">Phòng trống</div>
                <div className="font-extrabold text-sm text-emerald-300">{vacantRooms.length}</div>
              </div>
              <div className="bg-white/10 rounded-lg py-1.5 px-1 cursor-pointer hover:bg-white/20" onClick={() => navigate('ROOMS')}>
                <div className="text-[10px] text-amber-200">Sắp trả</div>
                <div className="font-extrabold text-sm text-amber-300">{pendingCheckoutRooms.length}</div>
              </div>
              <div className="bg-white/10 rounded-lg py-1.5 px-1 cursor-pointer hover:bg-white/20" onClick={() => navigate('ROOMS')}>
                <div className="text-[10px] text-rose-200">Chưa xong</div>
                <div className="font-extrabold text-sm text-rose-300">{unresolvedRooms.length}</div>
              </div>
            </div>
          </div>

          {/* 4 Primary Navigation Cards (Section G Links 1-4) */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Card 1: Expiring Leases -> ROOM_TERM */}
            <div
              onClick={() => navigate('ROOM_TERM')}
              className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
              <div className="mt-2">
                <div className="text-[11px] font-semibold text-slate-500">Hợp đồng hết hạn</div>
                <div className="text-base font-extrabold text-amber-900 mt-0.5">
                  {expiringContracts.length} phòng
                </div>
                <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                  {nearestExpiringContract
                    ? `P.${nearestExpiringContract.room?.roomNumber || nearestExpiringContract.contract.roomId} - ${nearestExpiringContract.tenant?.fullName || 'Chưa gán khách'}`
                    : 'Không có hợp đồng sắp hết hạn'}
                </p>
              </div>
            </div>

            {/* Card 2: Overdue Debt -> DEBT */}
            <div
              onClick={() => navigate('DEBT')}
              className="bg-white p-3 rounded-2xl border border-rose-200 bg-rose-50/30 shadow-xs hover:border-rose-400 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                </div>
                <span className="text-[10px] font-semibold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                  Cần xử lý
                </span>
              </div>
              <div className="mt-2">
                <div className="text-[11px] font-semibold text-rose-700">Công nợ quá hạn</div>
                <div className="text-base font-extrabold text-rose-900 mt-0.5">
                  {totalOverdueAmount.toLocaleString()} <span className="text-xs font-normal">đ</span>
                </div>
                <p className="text-[10px] text-rose-600 font-medium line-clamp-1 mt-0.5">
                  {overdueDebts.length
                    ? `${overdueDebts.length} khoản nợ • Phòng ${rooms.find(room => room.id === overdueDebts[0].roomId)?.roomNumber || overdueDebts[0].roomId}`
                    : 'Không có khoản nợ quá hạn'}
                </p>
              </div>
            </div>

            {/* Card 3: Collection Tracking -> PAY_TRACK */}
            <div
              onClick={() => navigate('PAY_TRACK')}
              className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Banknote className="w-4 h-4" />
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
              <div className="mt-2">
                <div className="text-[11px] font-semibold text-slate-500">Phải thu kỳ này</div>
                <div className="text-base font-extrabold text-blue-900 mt-0.5">
                  {totalUnpaidAmount.toLocaleString()} <span className="text-xs font-normal">đ</span>
                </div>
                <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">Theo dõi sao kê VietQR</p>
              </div>
            </div>

            {/* Card 4: Reports -> REPORTS */}
            <div
              onClick={() => navigate('REPORTS')}
              className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
              <div className="mt-2">
                <div className="text-[11px] font-semibold text-slate-500">Báo cáo & Đối soát</div>
                <div className="text-base font-extrabold text-indigo-900 mt-0.5">
                  4 Phân hệ
                </div>
                <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">Lấp đầy • Dòng tiền • Sửa lệch</p>
              </div>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="dashboard-home__shortcuts bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs space-y-2.5">
            <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
              <span>Lối Tắt Thao Tác Nhanh</span>
              <span className="text-[11px] text-slate-400 font-normal">Quy trình thường dùng</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => navigate('TENANT_NEW')}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200/80 text-left font-semibold transition-all flex items-center space-x-2 cursor-pointer"
              >
                <Users className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="truncate">Thêm hồ sơ khách</span>
              </button>
              <button
                onClick={() => latestPeriod && roomForMeterReading
                  ? navigate('PAY_METER', { periodId: latestPeriod.id, roomId: roomForMeterReading.id })
                  : navigate('PAY_PERIOD')}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200/80 text-left font-semibold transition-all flex items-center space-x-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="truncate">{roomForMeterReading ? `Ghi chỉ số P.${roomForMeterReading.roomNumber}` : 'Chọn kỳ ghi chỉ số'}</span>
              </button>
              <button
                onClick={() => roomForNewLease
                  ? navigate('ROOM_CHECK', { roomId: roomForNewLease.id })
                  : navigate('ROOMS')}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200/80 text-left font-semibold transition-all flex items-center space-x-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="truncate">{roomForNewLease ? `Checklist P.${roomForNewLease.roomNumber}` : 'Xem danh sách phòng'}</span>
              </button>
              <button
                onClick={() => navigate('SET_TARIFF')}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200/80 text-left font-semibold transition-all flex items-center space-x-2 cursor-pointer"
              >
                <Sliders className="w-4 h-4 text-slate-600 shrink-0" />
                <span className="truncate">Cài đặt đơn giá & phí</span>
              </button>
            </div>
          </div>

          {/* Action Reminder Banner */}
          <div className="dashboard-home__notice bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900">
              <strong className="block font-bold">Lưu ý nghiệp vụ tháng 10/2026:</strong>
              Phòng 402 đã ký hợp đồng nhưng chưa đủ 1 tháng cọc + 1 tháng thuê đầu nên chưa thể giao phòng. Cần vào tiếp nhận phòng sau khi đối chiếu sao kê.
            </div>
          </div>
        </div>

        <BottomTabs />
      </div>
    );
  }

  // MORE Screen (F.3)
  if (currentScreenId === 'MORE') {
    const menuSections = [
      {
        title: 'Hợp Đồng & Khách Thuê',
        items: [
          {
            screenId: 'CONTRACTS' as const,
            title: 'Danh sách Hợp đồng thuê',
            desc: 'Dự thảo, đã ký giấy, chờ hiệu lực, hợp đồng nối tiếp',
            icon: FileText,
            color: 'text-indigo-600 bg-indigo-50'
          },
          {
            screenId: 'RENTAL_TERMS' as const,
            title: 'Thỏa thuận Điều kiện thuê',
            desc: 'Thống nhất giá, 1 tháng cọc, trả trước tháng đầu',
            icon: Sliders,
            color: 'text-blue-600 bg-blue-50',
            params: { roomId: 'P103' }
          }
        ]
      },
      {
        title: 'Thanh Lý & Tài Chính',
        items: [
          {
            screenId: 'DEPOSIT' as const,
            title: 'Quyết toán tiền cọc (Deposit)',
            desc: 'Khấu trừ tiền nhà, điện nước, bồi thường hư hại & hoàn cọc',
            icon: DollarSign,
            color: 'text-emerald-600 bg-emerald-50'
          },
          {
            screenId: 'DEBT' as const,
            title: 'Công nợ quá hạn',
            desc: 'Danh sách nợ quá hạn, ghi nhận nhắc nợ và phản hồi',
            icon: ShieldAlert,
            color: 'text-rose-600 bg-rose-50'
          }
        ]
      },
      {
        title: 'Báo Cáo Thống Kê',
        items: [
          {
            screenId: 'REPORTS' as const,
            title: 'Trung tâm Báo cáo Quản trị',
            desc: 'Lấp đầy phòng, doanh thu phải thu / thực thu, đối soát lệch',
            icon: BarChart3,
            color: 'text-violet-600 bg-violet-50'
          }
        ]
      },
      {
        title: 'Hệ Thống & Tài Khoản',
        items: [
          {
            screenId: 'SETTINGS' as const,
            title: 'Cài đặt Đơn giá & Ngân hàng',
            desc: 'Biểu phí điện nước theo phiên bản hiệu lực, tài khoản QR',
            icon: Settings,
            color: 'text-slate-700 bg-slate-100'
          },
          {
            screenId: 'ACCOUNT' as const,
            title: 'Tài khoản Quản lý & Đăng xuất',
            desc: 'Thông tin cá nhân, đổi mật khẩu định kỳ, thu hồi phiên',
            icon: UserCheck,
            color: 'text-teal-700 bg-teal-50'
          }
        ]
      }
    ];

    return (
      <div className="flex-1 flex flex-col justify-between bg-slate-50">
        <AppHeader title="Chức Năng Mở Rộng" subtitle="Hợp đồng, Cọc, Báo cáo & Cài đặt" showBack={false} />

        <div className="responsive-section-grid flex-1 p-3.5 space-y-4 overflow-y-auto">
          {menuSections.map((sec, idx) => (
            <div key={idx} className="space-y-1.5">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
                {sec.title}
              </h3>
              <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 shadow-xs overflow-hidden">
                {sec.items.map((item, itemIdx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={itemIdx}
                      onClick={() => navigate(item.screenId, (item as any).params)}
                      className="p-3 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-slate-900 truncate">{item.title}</div>
                          <div className="text-[11px] text-slate-500 truncate mt-0.5">{item.desc}</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <BottomTabs />
      </div>
    );
  }

  return null;
};
