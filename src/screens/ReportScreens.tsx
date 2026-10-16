import React, { useState } from 'react';
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Download,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  FileSpreadsheet,
  CheckCircle2,
  ExternalLink,
  Building2,
  DollarSign,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AppHeader } from '../components/common/AppHeader';
import { BottomTabs } from '../components/common/BottomTabs';

export const ReportScreens: React.FC = () => {
  const {
    currentScreenId,
    navigate,
    rooms,
    contracts,
    transactions,
    calculations,
    showToast
  } = useApp();

  const occupiedRooms = rooms.filter(r => r.status === 'DANG_THUE');
  const vacantRooms = rooms.filter(r => r.status === 'TRONG');
  const pendingCheckoutRooms = rooms.filter(r => r.status === 'SAP_TRA');
  const unresolvedRooms = rooms.filter(r => r.status === 'CHUA_BAN_GIAO_XONG');
  const totalRooms = rooms.length;
  const occupancyRate = Math.round((occupiedRooms.length / totalRooms) * 100);

  // Financial calculations
  const totalCollected = transactions
    .filter(t => t.status === 'DA_THU')
    .reduce((acc, t) => acc + (t.receivedAmount || 0), 0);

  const totalDueCurrent = transactions.reduce((acc, t) => acc + t.totalDue, 0);

  // 1. REPORTS Menu Screen (F.12)
  if (currentScreenId === 'REPORTS') {
    const reportList = [
      {
        screenId: 'REPORT_OCC' as const,
        title: 'Báo cáo Phòng & Tỷ lệ lấp đầy',
        desc: `Hiện có ${occupiedRooms.length}/${totalRooms} phòng đang thuê (${occupancyRate}%)`,
        icon: Building2,
        color: 'text-blue-600 bg-blue-50'
      },
      {
        screenId: 'REPORT_MONEY' as const,
        title: 'Báo cáo Phải thu – Thực thu',
        desc: `Đã thu ${totalCollected.toLocaleString()} đ / Tổng phải thu ${totalDueCurrent.toLocaleString()} đ`,
        icon: DollarSign,
        color: 'text-emerald-600 bg-emerald-50'
      },
      {
        screenId: 'REPORT_CHECK' as const,
        title: 'Đối soát số liệu báo cáo',
        desc: 'Phát hiện sai lệch & điều hướng sửa tại nguồn (không sửa số trên biểu đồ)',
        icon: AlertTriangle,
        color: 'text-amber-600 bg-amber-50'
      },
      {
        screenId: 'REPORT_SUM' as const,
        title: 'Báo cáo quản trị tổng hợp',
        desc: 'Tổng kết doanh thu, công nợ, xuất file bảng tính Excel (giả lập)',
        icon: FileSpreadsheet,
        color: 'text-indigo-600 bg-indigo-50'
      }
    ];

    return (
      <div className="flex-1 flex flex-col justify-between bg-slate-50">
        <AppHeader
          title="Báo Cáo & Thống Kê"
          subtitle="Trung tâm phân tích hiệu suất và tài chính"
          onBack={() => navigate('MORE')}
        />

        <div className="flex-1 p-3.5 space-y-3 overflow-y-auto text-xs">
          <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 shadow-xs overflow-hidden">
            {reportList.map((rep, idx) => {
              const Icon = rep.icon;
              return (
                <div
                  key={idx}
                  onClick={() => navigate(rep.screenId)}
                  className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${rep.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-900 truncate">{rep.title}</div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5">{rep.desc}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                </div>
              );
            })}
          </div>
        </div>

        <BottomTabs />
      </div>
    );
  }

  // 2. REPORT_OCC Screen (F.12 - Cross-link 53)
  if (currentScreenId === 'REPORT_OCC') {
    return (
      <div className="flex-1 flex flex-col p-4 bg-slate-50 space-y-3">
        <AppHeader
          title="Báo Cáo Phòng & Lấp Đầy"
          subtitle="Giải thích công thức & xem chi tiết từng phòng"
          onBack={() => navigate('REPORTS')}
        />

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3 text-xs">
          {/* KPI box */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between">
            <div>
              <span className="text-[10px] text-blue-200 uppercase font-semibold">Tỷ lệ lấp đầy toàn tòa</span>
              <div className="text-2xl font-extrabold mt-0.5">{occupancyRate}%</div>
              <div className="text-[11px] text-blue-100 mt-1">
                Công thức: {occupiedRooms.length} đang thuê ÷ {totalRooms} tổng số phòng
              </div>
            </div>
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-lg font-bold border border-white/20">
              {occupiedRooms.length}/{totalRooms}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="text-emerald-700 text-[11px]">Phòng Trống</span>
              <div className="font-extrabold text-base text-emerald-900">{vacantRooms.length}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
              <span className="text-amber-700 text-[11px]">Sắp trả phòng</span>
              <div className="font-extrabold text-base text-amber-900">{pendingCheckoutRooms.length}</div>
            </div>
          </div>

          {/* Drill-down list (Cross-link 53) */}
          <div className="space-y-2 pt-1">
            <span className="font-bold text-slate-800">Chọn phòng để xem chi tiết tình trạng:</span>
            <div className="grid grid-cols-3 gap-2">
              {rooms.map(r => (
                <button
                  key={r.id}
                  onClick={() => navigate('ROOM_DETAIL', { roomId: r.id })}
                  className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-center cursor-pointer transition-all"
                >
                  <div className="font-bold text-slate-900">P.{r.roomNumber}</div>
                  <div className={`text-[10px] font-semibold ${
                    r.status === 'TRONG' ? 'text-emerald-600' :
                    r.status === 'DANG_THUE' ? 'text-blue-600' :
                    r.status === 'SAP_TRA' ? 'text-amber-600' : 'text-rose-600'
                  }`}>
                    {r.status === 'TRONG' ? 'Trống' : r.status === 'DANG_THUE' ? 'Đang ở' : r.status === 'SAP_TRA' ? 'Sắp trả' : 'Chưa xong'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. REPORT_MONEY Screen (F.12 - Cross-link 54)
  if (currentScreenId === 'REPORT_MONEY') {
    return (
      <div className="flex-1 flex flex-col p-4 bg-slate-50 space-y-3">
        <AppHeader
          title="Báo Cáo Phải Thu – Thực Thu"
          subtitle="Tách riêng tiền nhà, dịch vụ & tiền cọc"
          onBack={() => navigate('REPORTS')}
        />

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-900 text-white flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400">Tổng doanh thu thực tế đã thu</span>
              <div className="text-lg font-extrabold font-mono text-emerald-400 mt-0.5">
                {totalCollected.toLocaleString()} VNĐ
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400">Tổng phải thu</span>
              <div className="font-mono text-slate-200 font-bold">{totalDueCurrent.toLocaleString()} VNĐ</div>
            </div>
          </div>

          <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-900">Phân rã dòng tiền:</span>
            <div className="flex justify-between text-slate-700">
              <span>• Tiền thuê tháng tới (trả trước):</span>
              <strong className="font-mono">5.000.000 đ</strong>
            </div>
            <div className="flex justify-between text-slate-700">
              <span>• Tiền điện nước dịch vụ vừa dùng:</span>
              <strong className="font-mono">950.000 đ</strong>
            </div>
            <div className="flex justify-between text-slate-700">
              <span>• Tiền đặt cọc thu mới:</span>
              <strong className="font-mono">0 đ</strong>
            </div>
          </div>

          {/* Cross-link 54 to PAY_TRACK */}
          <div className="pt-2">
            <button
              onClick={() => navigate('PAY_TRACK')}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md cursor-pointer"
            >
              <span>Xem Danh Sách Nguồn Thu Chi Tiết</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. REPORT_CHECK Screen (F.12 - Cross-links 51, 52)
  if (currentScreenId === 'REPORT_CHECK') {
    return (
      <div className="flex-1 flex flex-col p-4 bg-slate-50 space-y-3">
        <AppHeader
          title="Đối Soát Số Liệu Báo Cáo"
          subtitle="Sửa lệch trực tiếp tại nguồn phát sinh"
          onBack={() => navigate('REPORTS')}
        />

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3 text-xs">
          {/* Mandatory Business Rule D8 */}
          <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-950 rounded-xl space-y-1">
            <strong className="block font-bold text-amber-900 flex items-center">
              <ShieldCheck className="w-4 h-4 mr-1 text-amber-600" /> Nguyên tắc đối soát nguồn (Quy tắc D8):
            </strong>
            <p>
              Báo cáo đọc trực tiếp từ dữ liệu nguồn. Khi phát hiện sai lệch số liệu, hệ thống điều hướng người dùng <strong>sửa trực tiếp tại nguồn phát sinh (bảng tính kỳ hoặc giao dịch thu tiền)</strong>, tuyệt đối KHÔNG cho phép sửa ép số liệu trên biểu đồ báo cáo.
            </p>
          </div>

          <div className="space-y-2">
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <strong className="text-slate-900 font-bold">1. Kiểm tra nguồn tính tiền kỳ:</strong>
                <p className="text-[11px] text-slate-500">Đối chiếu bảng tính kỳ 10/2026 với biểu giá V2</p>
              </div>
              {/* Cross-link 51 to PAY_CALC */}
              <button
                onClick={() => navigate('PAY_CALC', { periodId: 'KY-2026-10', roomId: 'P101' })}
                className="px-2.5 py-1.5 bg-blue-50 text-blue-700 font-semibold rounded-lg text-xs hover:bg-blue-100 flex items-center space-x-1 cursor-pointer shrink-0 ml-2"
              >
                <span>Sửa tại tính tiền</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <strong className="text-slate-900 font-bold">2. Kiểm tra nguồn thu tiền thực tế:</strong>
                <p className="text-[11px] text-slate-500">Đối chiếu các xác nhận sao kê chuyển khoản đủ tiền</p>
              </div>
              {/* Cross-link 52 to PAY_TRACK */}
              <button
                onClick={() => navigate('PAY_TRACK')}
                className="px-2.5 py-1.5 bg-blue-50 text-blue-700 font-semibold rounded-lg text-xs hover:bg-blue-100 flex items-center space-x-1 cursor-pointer shrink-0 ml-2"
              >
                <span>Sửa tại thu tiền</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-[11px]">
            ✓ Kết quả đối soát hiện tại: Toàn bộ số liệu giữa Bảng tính tiền và Bảng theo dõi thanh toán hoàn toàn khớp 100%.
          </div>
        </div>
      </div>
    );
  }

  // 5. REPORT_SUM Screen (F.12 - Cross-link 55)
  if (currentScreenId === 'REPORT_SUM') {
    const handleExportExcel = () => {
      showToast('Đã xuất file Excel báo cáo quản trị tổng hợp tòa nhà thành công!');
    };

    return (
      <div className="flex-1 flex flex-col p-4 bg-slate-50 space-y-3">
        <AppHeader
          title="Báo Cáo Quản Trị Tổng Hợp"
          subtitle="Tổng kết toàn tòa nhà & xuất tệp báo cáo"
          onBack={() => navigate('REPORTS')}
        />

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 text-sm">Chung cư Mini GreenHouse</span>
            <div className="text-[11px] text-slate-500">Kỳ báo cáo: Tháng 10/2026 • 12 phòng căn hộ</div>
          </div>

          <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex justify-between">
              <span>Tỷ lệ lấp đầy:</span>
              <strong className="text-blue-700">{occupancyRate}% ({occupiedRooms.length}/12 phòng)</strong>
            </div>
            <div className="flex justify-between">
              <span>Tổng doanh thu thực tế đã thu:</span>
              <strong className="font-mono text-emerald-700">{totalCollected.toLocaleString()} đ</strong>
            </div>
            <div className="flex justify-between">
              <span>Công nợ quá hạn tồn đọng:</span>
              <strong className="font-mono text-rose-700">6.400.000 đ (1 khoản)</strong>
            </div>
            <div className="flex justify-between">
              <span>Tiền cọc đang giữ của khách:</span>
              <strong className="font-mono text-slate-900">48.200.000 đ</strong>
            </div>
          </div>

          {/* Cross-link 55 to REPORT_CHECK before export */}
          <div className="pt-1 space-y-2">
            <button
              onClick={() => navigate('REPORT_CHECK')}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center justify-center space-x-1 cursor-pointer"
            >
              <span>Kiểm Tra Đối Soát Số Liệu Trước Khi Xuất</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleExportExcel}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Xuất Báo Cáo Ra Excel</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
