import React, { useState } from 'react';
import {
  Banknote,
  QrCode,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Share2,
  Download,
  Search,
  ChevronRight,
  Edit3,
  Camera,
  RotateCcw,
  Clock,
  Sparkles,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AppHeader } from '../components/common/AppHeader';
import { BottomTabs } from '../components/common/BottomTabs';
import { MissingRecord } from '../components/common/MissingRecord';
import { StatusBadge } from '../components/common/StatusBadge';
import { PeriodCalculation, PaymentNotice, PaymentTransaction } from '../types';

export const BillingScreens: React.FC = () => {
  const {
    currentScreenId,
    params,
    navigate,
    periods,
    rooms,
    tenants,
    meterReadings,
    calculations,
    notices,
    transactions,
    tariffs,
    bankConfigs,
    recordMeterReading,
    editMeterReading,
    calculatePeriodForRoom,
    reconcilePeriodCalculation,
    issuePaymentNoticeQR,
    confirmPaymentReceived,
    correctPaymentReceipt,
    showToast
  } = useApp();

  const targetPeriodId = params.periodId as string | undefined;
  const periodRequired = ['PAY_METER', 'PAY_METER_EDIT', 'PAY_CALC', 'PAY_RECON', 'PAY_NOTICE_NEW'].includes(currentScreenId);
  const currentPeriod = (targetPeriodId
    ? periods.find(p => p.id === targetPeriodId)
    : periodRequired ? undefined : periods[periods.length - 1])!;
  const targetRoomId = params.roomId as string | undefined;
  const roomRequired = ['PAY_METER', 'PAY_METER_EDIT', 'PAY_CALC', 'PAY_RECON', 'PAY_NOTICE_NEW'].includes(currentScreenId);
  const currentRoom = (targetRoomId
    ? rooms.find(r => r.id === targetRoomId)
    : roomRequired ? undefined : rooms.find(r => r.status === 'DANG_THUE') || rooms[0])!;
  const currentReading = meterReadings.find(m => m.periodId === currentPeriod?.id && m.roomId === currentRoom?.id);
  const previousReading = meterReadings
    .filter(reading => reading.roomId === currentRoom?.id && reading.periodId !== currentPeriod?.id)
    .at(-1);
  const targetCalcId = params.calcId as string | undefined;
  const currentCalc = (targetCalcId
    ? calculations.find(c => c.id === targetCalcId)
    : calculations.find(c => c.periodId === currentPeriod?.id && c.roomId === currentRoom?.id))!;
  const targetNoticeId = params.noticeId as string | undefined;
  const currentNotice = (targetNoticeId
    ? notices.find(n => n.id === targetNoticeId)
    : notices.find(n => n.periodId === currentPeriod?.id && n.roomId === currentRoom?.id) ||
      (!['PAY_NOTICE_DETAIL', 'PAY_CONFIRM', 'PAY_CORRECT'].includes(currentScreenId) ? notices[notices.length - 1] : undefined))!;
  const currentTx = (currentNotice ? transactions.find(t => t.noticeId === currentNotice.id) : undefined)!;

  // PAY_METER form
  const [meterElNew, setMeterElNew] = useState<number>(currentReading?.electricNew ?? previousReading?.electricNew ?? 1000);
  const [meterWaNew, setMeterWaNew] = useState<number>(currentReading?.waterNew ?? previousReading?.waterNew ?? 30);
  const [meterError, setMeterError] = useState<string | null>(null);

  // PAY_METER_EDIT form
  const [editElNew, setEditElNew] = useState<number>(currentReading?.electricNew ?? previousReading?.electricNew ?? 1000);
  const [editWaNew, setEditWaNew] = useState<number>(currentReading?.waterNew ?? previousReading?.waterNew ?? 30);
  const [editMeterReason, setEditMeterReason] = useState('Khách phản hồi công tơ nhìn nhầm số hàng đơn vị');
  const [editMeterError, setEditMeterError] = useState<string | null>(null);

  // PAY_NOTICE_NEW form
  const [noticeDueDate, setNoticeDueDate] = useState('20/10/2026');

  // PAY_CONFIRM form
  const [confirmAmount, setConfirmAmount] = useState<number>(currentNotice?.totalAmount || 0);
  const [confirmRefCode, setConfirmRefCode] = useState(`MB-FT${Date.now().toString().slice(-6)}`);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  // PAY_CORRECT form
  const [correctAmount, setCorrectAmount] = useState<number>(currentTx?.receivedAmount || 0);
  const [correctReason, setCorrectReason] = useState('Đối chiếu lại sao kê ngân hàng phát hiện nhầm mã phòng');
  const [correctError, setCorrectError] = useState<string | null>(null);

  // Search in PAY_TRACK
  const [trackSearch, setTrackSearch] = useState('');

  if (targetPeriodId && !periods.some(period => period.id === targetPeriodId)) {
    return <MissingRecord title="Kỳ thanh toán" message="Kỳ thanh toán được chọn không còn tồn tại." backTo="PAY" />;
  }
  if (targetRoomId && !rooms.some(room => room.id === targetRoomId)) {
    return <MissingRecord title="Thông tin thanh toán" message="Phòng được chọn không còn tồn tại." backTo="ROOMS" />;
  }
  if (targetCalcId && !calculations.some(calculation => calculation.id === targetCalcId)) {
    return <MissingRecord title="Bảng tính tiền" message="Bảng tính tiền được chọn không còn tồn tại." backTo="PAY" />;
  }
  if (targetNoticeId && !notices.some(notice => notice.id === targetNoticeId)) {
    return <MissingRecord title="Thông báo thanh toán" message="Thông báo thanh toán được chọn không còn tồn tại." backTo="PAY" />;
  }
  if (roomRequired && (!targetPeriodId || !targetRoomId || !currentPeriod || !currentRoom)) {
    return <MissingRecord title="Thông tin thanh toán" message="Hãy chọn một kỳ thanh toán và phòng hợp lệ trước khi tiếp tục." backTo="PAY" />;
  }
  if (currentScreenId === 'PAY_METER_EDIT' && !currentReading) {
    return <MissingRecord title="Sửa chỉ số" message="Phòng và kỳ này chưa có chỉ số để sửa. Hãy ghi chỉ số trước." backTo="PAY_METER" />;
  }
  if (['PAY_CALC', 'PAY_RECON', 'PAY_NOTICE_NEW'].includes(currentScreenId) && !currentCalc) {
    return <MissingRecord title="Bảng tính tiền" message="Chưa có bảng tính cho phòng và kỳ đã chọn. Hãy ghi chỉ số điện nước trước." backTo="PAY_METER" />;
  }
  if (['PAY_NOTICE_DETAIL', 'PAY_CONFIRM', 'PAY_CORRECT'].includes(currentScreenId) && !currentNotice) {
    return <MissingRecord title="Thông báo thanh toán" message="Không có thông báo thanh toán tương ứng với lựa chọn này." backTo="PAY" />;
  }
  if (currentScreenId === 'PAY_CORRECT' && !currentTx) {
    return <MissingRecord title="Giao dịch thanh toán" message="Không tìm thấy giao dịch cần điều chỉnh." backTo="PAY_TRACK" />;
  }

  // 1. PAY Hub Screen (F.3 / F.9)
  if (currentScreenId === 'PAY') {
    return (
      <div className="flex-1 flex flex-col justify-between bg-slate-50">
        <AppHeader
          title="Thu Tiền & Tài Chính"
          subtitle="Kỳ tính tiền tháng 10/2026 (UC08.1)"
          showBack={false}
        />

        <div className="flex-1 p-3.5 space-y-3.5 overflow-y-auto text-xs">
          {/* Period selector */}
          <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-bold">Kỳ tính tiền đang chọn</div>
              <div className="text-sm font-extrabold text-blue-900 mt-0.5">
                Kỳ {currentPeriod?.monthYear} (Thuê trả trước {currentPeriod?.rentForPeriodMonthYear})
              </div>
            </div>
            <button
              onClick={() => navigate('PAY_PERIOD')}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs cursor-pointer"
            >
              Chọn kỳ khác
            </button>
          </div>

          {/* Workflow Tasks */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2">
            <h3 className="font-bold text-slate-900 text-xs">Các Tác Vụ Quy Trình Thu Tiền:</h3>

            <div className="space-y-2 pt-1">
              {/* Task 1: PAY_METER */}
              <div
                onClick={() => navigate('PAY_METER', { periodId: currentPeriod?.id, roomId: currentRoom?.id })}
                className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 transition-colors cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">1. Ghi chỉ số điện nước</div>
                    <div className="text-[11px] text-slate-500">Chụp ảnh công tơ & nhập số đầu/cuối</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>

              {/* Task 2: PAY_CALC */}
              <div
                onClick={() => navigate('PAY_CALC', { periodId: currentPeriod?.id, roomId: currentRoom?.id })}
                className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 transition-colors cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                    <Banknote className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">2. Bảng tính tiền kỳ</div>
                    <div className="text-[11px] text-slate-500">Tách riêng tiền thuê trước & dịch vụ đã dùng</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>

              {/* Task 3: PAY_RECON */}
              <div
                onClick={() => navigate('PAY_RECON', { periodId: currentPeriod?.id, roomId: currentRoom?.id })}
                className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 transition-colors cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">3. Đối chiếu khoản phải thu</div>
                    <div className="text-[11px] text-slate-500">Xác minh biểu giá & không gộp sai nợ cũ</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>

              {/* Task 4: PAY_NOTICES */}
              <div
                onClick={() => navigate('PAY_NOTICES', { periodId: currentPeriod?.id })}
                className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 transition-colors cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">4. Thông báo thanh toán & mã VietQR</div>
                    <div className="text-[11px] text-slate-500">Phát hành phiếu thu tiền kèm QR chuẩn</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>

              {/* Task 5: PAY_TRACK */}
              <div
                onClick={() => navigate('PAY_TRACK', { periodId: currentPeriod?.id })}
                className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 transition-colors cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">5. Theo dõi thu tiền & xác nhận</div>
                    <div className="text-[11px] text-slate-500">Đối chiếu sao kê chuyển khoản đủ 100%</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>
        </div>

        <BottomTabs />
      </div>
    );
  }

  // 2. PAY_PERIOD Screen (F.9)
  if (currentScreenId === 'PAY_PERIOD') {
    return (
      <div className="flex-1 flex flex-col p-4 bg-slate-50 space-y-3">
        <AppHeader
          title="Kỳ Tính Tiền Hàng Tháng"
          subtitle="Quản lý chu kỳ thu tiền tòa nhà"
          onBack={() => navigate('PAY')}
        />

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2.5 text-xs">
          {periods.map(p => {
            const roomForPeriod = rooms.find(room =>
              calculations.some(calculation => calculation.periodId === p.id && calculation.roomId === room.id)
            ) || rooms.find(room =>
              meterReadings.some(reading => reading.periodId === p.id && reading.roomId === room.id)
            ) || rooms[0];

            return <div
              key={p.id}
              onClick={() => navigate('PAY_CALC', { periodId: p.id, roomId: roomForPeriod?.id })}
              className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 transition-colors cursor-pointer space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">Kỳ {p.monthYear}</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  p.status === 'DA_DOI_CHIEU' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                }`}>
                  {p.status === 'DA_DOI_CHIEU' ? 'Đã đối chiếu' : 'Đang thực hiện'}
                </span>
              </div>
              <div className="text-[11px] text-slate-600">
                • Tiền thuê tháng tới (trả trước): <strong>{p.rentForPeriodMonthYear}</strong>
              </div>
              <div className="text-[11px] text-slate-600">
                • Dịch vụ điện nước vừa dùng: <strong>{p.serviceForPeriodMonthYear}</strong>
              </div>
            </div>;
          })}
        </div>
      </div>
    );
  }

  // 3. PAY_METER Screen (F.9 - Cross-link 40)
  if (currentScreenId === 'PAY_METER') {
    const elOld = currentReading?.electricOld ?? previousReading?.electricNew ?? 1000;
    const waOld = currentReading?.waterOld ?? previousReading?.waterNew ?? 30;

    const handleSaveMeter = (e: React.FormEvent) => {
      e.preventDefault();
      setMeterError(null);
      const res = recordMeterReading(currentPeriod.id, currentRoom.id, Number(meterElNew), Number(meterWaNew));
      if (res.success) {
        // Cross-link 40 to PAY_CALC
        calculatePeriodForRoom(currentPeriod.id, currentRoom.id);
        navigate('PAY_CALC', { periodId: currentPeriod.id, roomId: currentRoom.id });
      } else if (res.error) {
        setMeterError(res.error);
      }
    };

    return (
      <div className="flex-1 flex flex-col p-4 bg-slate-50 space-y-3">
        <AppHeader
          title={`Ghi Chỉ Số P.${currentRoom.roomNumber} - Kỳ ${currentPeriod.monthYear}`}
          subtitle="Nhập chỉ số điện nước mới"
          onBack={() => navigate('PAY')}
          rightAction={
            <button
              onClick={() => navigate('PAY_METER_EDIT', { periodId: currentPeriod.id, roomId: currentRoom.id })}
              className="text-[11px] font-semibold text-blue-600 hover:underline"
            >
              Sửa số
            </button>
          }
        />

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3 text-xs">
          {meterError && (
            <div className="p-2.5 rounded-xl bg-red-50 text-red-800 border border-red-200">
              {meterError}
            </div>
          )}

          <form onSubmit={handleSaveMeter} className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 flex justify-between">
                <span>Điện sinh hoạt (Công tơ)</span>
                <span className="text-[11px] text-slate-500 font-mono">Số cũ: {elOld} kWh</span>
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">Chỉ số điện mới (tối thiểu {elOld})</label>
                <input
                  type="number"
                  min={elOld}
                  value={meterElNew}
                  onChange={e => setMeterElNew(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold bg-white"
                />
              </div>
              <div className="text-[11px] text-blue-700 font-semibold">
                Sản lượng tiêu thụ: {Math.max(0, meterElNew - elOld)} kWh
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 flex justify-between">
                <span>Nước sạch (Đồng hồ)</span>
                <span className="text-[11px] text-slate-500 font-mono">Số cũ: {waOld} m³</span>
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">Chỉ số nước mới (tối thiểu {waOld})</label>
                <input
                  type="number"
                  min={waOld}
                  value={meterWaNew}
                  onChange={e => setMeterWaNew(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold bg-white"
                />
              </div>
              <div className="text-[11px] text-blue-700 font-semibold">
                Sản lượng tiêu thụ: {Math.max(0, meterWaNew - waOld)} m³
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md cursor-pointer"
              >
                <span>Chốt Chỉ Số → Tính Bảng Tiền Kỳ</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // 4. PAY_METER_EDIT Screen (F.9 - Cross-link 41)
  if (currentScreenId === 'PAY_METER_EDIT') {
    const handleSaveMeterEdit = (e: React.FormEvent) => {
      e.preventDefault();
      setEditMeterError(null);
      const res = editMeterReading(currentReading!.id, Number(editElNew), Number(editWaNew), editMeterReason);
      if (res.success) {
        // Cross-link 41 to PAY_CALC (recalculate)
        calculatePeriodForRoom(currentPeriod.id, currentRoom.id);
        navigate('PAY_CALC', { periodId: currentPeriod.id, roomId: currentRoom.id });
      } else if (res.error) {
        setEditMeterError(res.error);
      }
    };

    return (
      <div className="flex-1 flex flex-col p-4 bg-slate-50 space-y-3">
        <AppHeader
          title={`Sửa Chỉ Số Điện Nước P.${currentRoom.roomNumber}`}
          subtitle="Cập nhật chỉ số kèm lý do điều chỉnh"
          onBack={() => navigate('PAY_METER', { periodId: currentPeriod.id, roomId: currentRoom.id })}
        />

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3 text-xs">
          {editMeterError && (
            <div className="p-2.5 rounded-xl bg-red-50 text-red-800 border border-red-200">
              {editMeterError}
            </div>
          )}

          <form onSubmit={handleSaveMeterEdit} className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Số điện mới sửa</label>
                <input
                  type="number"
                  value={editElNew}
                  onChange={e => setEditElNew(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Số nước mới sửa</label>
                <input
                  type="number"
                  value={editWaNew}
                  onChange={e => setEditWaNew(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Lý do điều chỉnh (lưu vết kiểm toán)</label>
              <textarea
                value={editMeterReason}
                onChange={e => setEditMeterReason(e.target.value)}
                rows={2}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>

            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-[11px]">
              Cảnh báo: Sửa chỉ số sẽ làm thay đổi số tiền phải thu của kỳ. Hệ thống sẽ tự động cập nhật lại bảng tính tiền.
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md cursor-pointer"
              >
                <span>Lưu & Tính Lại Bảng Tiền Kỳ</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // 5. PAY_CALC Screen (F.9 - Cross-link 42)
  if (currentScreenId === 'PAY_CALC') {
    return (
      <div className="flex-1 flex flex-col p-4 bg-slate-50 space-y-3">
        <AppHeader
          title={`Bảng Tính Tiền P.${currentRoom.roomNumber} - Kỳ ${currentPeriod.monthYear}`}
          subtitle="Tách rõ kỳ thuê trước & kỳ dùng dịch vụ"
          onBack={() => navigate('PAY')}
        />

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3 text-xs">
          {/* Section 1: Pre-paid rent for next month */}
          <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 space-y-1">
            <div className="font-bold text-blue-900 flex justify-between">
              <span>1. Tiền thuê tháng tới (Trả trước):</span>
              <span className="font-mono">{currentCalc.nextMonthRent.toLocaleString()} đ</span>
            </div>
            <div className="text-[11px] text-blue-700">{currentCalc.rentPeriodLabel}</div>
          </div>

          {/* Section 2: Consumed utilities during current month */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900 border-b border-slate-200 pb-1">
              2. Tiền điện, nước & dịch vụ đã dùng tháng này:
            </div>
            <div className="flex justify-between">
              <span>• Tiền điện ({currentCalc.electricUsage} kWh × {currentCalc.electricRate.toLocaleString()}đ):</span>
              <strong className="font-mono">{currentCalc.electricAmount.toLocaleString()} đ</strong>
            </div>
            <div className="flex justify-between">
              <span>• Tiền nước ({currentCalc.waterUsage} m³ × {currentCalc.waterRate.toLocaleString()}đ):</span>
              <strong className="font-mono">{currentCalc.waterAmount.toLocaleString()} đ</strong>
            </div>
            <div className="flex justify-between">
              <span>• Phí dịch vụ cố định (đủ lượt thuê):</span>
              <strong className="font-mono">{currentCalc.fixedServiceAmount.toLocaleString()} đ</strong>
            </div>
            <div className="flex justify-between">
              <span>• Wifi + Rác sinh hoạt:</span>
              <strong className="font-mono">{(currentCalc.wifiAmount + currentCalc.garbageAmount).toLocaleString()} đ</strong>
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-200 text-blue-900 font-semibold">
              <span>Tổng tiền dịch vụ:</span>
              <span className="font-mono">{currentCalc.totalServiceAmount.toLocaleString()} đ</span>
            </div>
          </div>

          {/* Grand total */}
          <div className="p-3.5 rounded-xl bg-slate-900 text-white flex items-center justify-between">
            <div>
              <div className="text-[10px] text-blue-300 uppercase font-semibold">Tổng cộng cần thu kỳ này</div>
              <div className="text-base font-extrabold font-mono text-emerald-400 mt-0.5">
                {currentCalc.totalDueCurrentPeriod.toLocaleString()} VNĐ
              </div>
            </div>
            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded font-mono">
              Biểu giá V2
            </span>
          </div>

          {/* Cross-link 42 to PAY_RECON */}
          <div className="pt-2">
            <button
              onClick={() => navigate('PAY_RECON', { periodId: currentPeriod.id, calcId: currentCalc.id, roomId: currentRoom.id })}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md cursor-pointer"
            >
              <span>Tính Xong → Đối Chiếu Khoản Phải Thu</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 6. PAY_RECON Screen (F.9 - Cross-link 43)
  if (currentScreenId === 'PAY_RECON') {
    const handleReconSubmit = () => {
      reconcilePeriodCalculation(currentCalc.id, 'Đã đối soát khớp chỉ số và đơn giá hiệu lực');
      // Cross-link 43 to PAY_NOTICE_NEW
      navigate('PAY_NOTICE_NEW', { periodId: currentPeriod.id, calcId: currentCalc.id, roomId: currentRoom.id });
    };

    return (
      <div className="flex-1 flex flex-col p-4 bg-slate-50 space-y-3">
        <AppHeader
          title={`Đối Chiếu Khoản Phải Thu P.${currentRoom.roomNumber}`}
          subtitle="Xác minh số liệu trước khi phát hành QR"
          onBack={() => navigate('PAY_CALC', { periodId: currentPeriod.id, roomId: currentRoom.id })}
        />

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3 text-xs">
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-xl space-y-1">
            <strong className="block font-bold flex items-center">
              <ShieldCheck className="w-4 h-4 mr-1 text-emerald-600" /> Nguyên tắc đối chiếu & không gộp nợ cũ (Quy tắc D4/D5):
            </strong>
            <p>
              Đối chiếu số tiền phải thu với hợp đồng và chỉ số. Nợ kỳ trước nếu có được theo dõi riêng ở phân hệ Công nợ, không được gộp sai làm méo mó mã QR của kỳ mới.
            </p>
          </div>

          <div className="space-y-2">
            <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <span>Hợp đồng & giá thuê tháng tới:</span>
              <span className="font-bold text-emerald-600">✓ Khớp {currentCalc.nextMonthRent.toLocaleString()} đ</span>
            </div>
            <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <span>Chỉ số điện ({currentCalc.electricUsage} kWh):</span>
              <span className="font-bold text-emerald-600">✓ Khớp {currentCalc.electricAmount.toLocaleString()} đ</span>
            </div>
            <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <span>Chỉ số nước ({currentCalc.waterUsage} m³):</span>
              <span className="font-bold text-emerald-600">✓ Khớp {currentCalc.waterAmount.toLocaleString()} đ</span>
            </div>
            <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <span>Phí dịch vụ cố định theo lượt thuê:</span>
              <span className="font-bold text-emerald-600">✓ Khớp {currentCalc.fixedServiceAmount.toLocaleString()} đ</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleReconSubmit}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md cursor-pointer"
            >
              <span>Đã Xác Nhận Đối Chiếu → Lập Thông Báo Kèm QR</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 7. PAY_NOTICES Screen (F.9)
  if (currentScreenId === 'PAY_NOTICES') {
    return (
      <div className="flex-1 flex flex-col p-4 bg-slate-50 space-y-3">
        <AppHeader
          title="Danh Sách Thông Báo Thanh Toán"
          subtitle="Thông báo và mã VietQR phát hành"
          onBack={() => navigate('PAY')}
        />

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2.5 text-xs">
          {notices.filter(notice => !targetPeriodId || notice.periodId === targetPeriodId).map(notice => (
            <div
              key={notice.id}
              onClick={() => navigate('PAY_NOTICE_DETAIL', { noticeId: notice.id, periodId: notice.periodId, roomId: notice.roomId })}
              className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 transition-colors cursor-pointer space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{notice.code}</span>
                <span className="font-mono text-xs font-bold text-blue-700">
                  {notice.totalAmount.toLocaleString()} đ
                </span>
              </div>
              <div className="text-[11px] text-slate-600 flex justify-between">
                <span>Phòng {notice.roomId} • Kỳ {notice.periodId}</span>
                <span>Hạn nộp: <strong>{notice.dueDate}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 8. PAY_NOTICE_NEW Screen (F.9 - Cross-link 44)
  if (currentScreenId === 'PAY_NOTICE_NEW') {
    const handleIssueNotice = (e: React.FormEvent) => {
      e.preventDefault();
      const res = issuePaymentNoticeQR(currentCalc.id, noticeDueDate);
      // Cross-link 44 to PAY_NOTICE_DETAIL
      navigate('PAY_NOTICE_DETAIL', { noticeId: res.noticeId, periodId: currentPeriod.id, roomId: currentRoom.id });
    };

    return (
      <div className="flex-1 flex flex-col p-4 bg-slate-50 space-y-3">
        <AppHeader
          title={`Lập Thông Báo & QR P.${currentRoom.roomNumber}`}
          subtitle="Sinh mã VietQR thanh toán tự động"
          onBack={() => navigate('PAY_RECON', { periodId: currentPeriod.id, calcId: currentCalc.id, roomId: currentRoom.id })}
        />

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3 text-xs">
          <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 rounded-xl space-y-1">
            <strong className="block font-bold">Snapshot tài khoản nhận tiền:</strong>
            <p>
              Mã QR và thông tin tài khoản được lưu cứng theo snapshot lúc phát hành. Khi sau này thay đổi số tài khoản ở Cài đặt, thông báo cũ này vẫn giữ nguyên số tài khoản đã cấp.
            </p>
          </div>

          <form onSubmit={handleIssueNotice} className="space-y-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Hạn thanh toán</label>
              <input
                type="text"
                value={noticeDueDate}
                onChange={e => setNoticeDueDate(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
              />
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex justify-between">
                <span>Tổng tiền chuẩn:</span>
                <strong className="font-mono text-blue-900">{currentCalc.totalDueCurrentPeriod.toLocaleString()} VNĐ</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tài khoản nhận:</span>
                <span className="font-semibold text-slate-800">MBBank - 0912345678888 (NGUYEN VAN MINH)</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md cursor-pointer"
              >
                <span>Sinh Mã VietQR → Xem Chi Tiết Thông Báo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // 9. PAY_NOTICE_DETAIL Screen (F.9 - Cross-link 45)
  if (currentScreenId === 'PAY_NOTICE_DETAIL') {
    return (
      <div className="flex-1 flex flex-col justify-between bg-slate-50">
        <AppHeader
          title={`Phiếu Thu Tiền & QR: ${currentNotice.code}`}
          subtitle={`Phòng ${currentNotice.roomId}`}
          onBack={() => navigate('PAY_NOTICES')}
        />

        <div className="flex-1 p-3.5 space-y-3 overflow-y-auto text-xs">
          {/* Bill card */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
            <div className="text-center pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-sm text-slate-900">THÔNG BÁO TIỀN THUÊ & DỊCH VỤ</h3>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">{currentNotice.code} • Hạn nộp: {currentNotice.dueDate}</p>
            </div>

            {/* QR code display */}
            <div className="flex flex-col items-center justify-center py-2 bg-slate-50 rounded-xl border border-slate-100">
              <img
                src={currentNotice.qrImageUrl}
                alt="VietQR"
                className="w-40 h-40 object-contain rounded-lg border border-slate-200 bg-white p-1"
              />
              <div className="text-center mt-2 space-y-0.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Mã VietQR Chuyển Khoản Tự Động</span>
                <div className="font-mono font-extrabold text-sm text-blue-900">{currentNotice.totalAmount.toLocaleString()} VNĐ</div>
                <div className="text-[10px] text-slate-500 font-mono">Nội dung: {currentNotice.bankSnapshot.transferContent}</div>
              </div>
            </div>

            {/* Breakdown */}
            <div className="space-y-1 text-slate-700 text-[11px]">
              <div className="flex justify-between">
                <span>• Tiền thuê tháng tới (trả trước):</span>
                <strong className="font-mono">{currentNotice.rentAmount.toLocaleString()} đ</strong>
              </div>
              <div className="flex justify-between">
                <span>• Tiền điện nước & dịch vụ đã dùng:</span>
                <strong className="font-mono">{currentNotice.serviceAmount.toLocaleString()} đ</strong>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200 font-bold text-slate-900">
                <span>TỔNG CỘNG:</span>
                <span className="font-mono text-blue-700">{currentNotice.totalAmount.toLocaleString()} đ</span>
              </div>
            </div>

            {/* Share / Download simulation */}
            <div className="pt-2 border-t border-slate-100 flex space-x-2">
              <button
                onClick={() => {
                  showToast('Đã mô phỏng mở Share Sheet Zalo/Tin nhắn ra ứng dụng bên ngoài. Hệ thống không tự đánh dấu đã thu tiền.');
                }}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-semibold text-xs flex items-center justify-center space-x-1 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Chia sẻ Zalo (Demo)</span>
              </button>
              <button
                onClick={() => showToast('Đã lưu ảnh phiếu thu kèm QR vào bộ sưu tập máy!')}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-semibold text-xs flex items-center justify-center space-x-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                <span>Tải ảnh phiếu</span>
              </button>
            </div>
          </div>

          {/* Cross-link 45 to PAY_TRACK */}
          <div className="pt-1">
            <button
              onClick={() => navigate('PAY_TRACK', { periodId: currentNotice.periodId, noticeId: currentNotice.id })}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md cursor-pointer"
            >
              <span>Xem Khoản Thu Này Trên Bảng Theo Dõi</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <BottomTabs />
      </div>
    );
  }

  // 10. PAY_TRACK Screen (F.9 - Cross-links 46, 47, 48)
  if (currentScreenId === 'PAY_TRACK') {
    const filteredTxs = transactions.filter(t => {
      if (params.noticeId && t.noticeId !== params.noticeId) return false;
      if (params.periodId && t.periodId !== params.periodId) return false;
      const room = rooms.find(r => r.id === t.roomId);
      const tenant = tenants.find(te => te.id === t.tenantId);
      return t.noticeId.toLowerCase().includes(trackSearch.toLowerCase()) ||
        (room && room.roomNumber.includes(trackSearch)) ||
        (tenant && tenant.fullName.toLowerCase().includes(trackSearch.toLowerCase()));
    });

    return (
      <div className="flex-1 flex flex-col justify-between bg-slate-50">
        <AppHeader
          title="Theo Dõi Thu Tiền"
          subtitle="Kiểm soát thanh toán qua ngân hàng"
          onBack={() => navigate('PAY')}
        />

        <div className="p-3 bg-white border-b border-slate-200 space-y-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo mã thông báo, phòng, tên khách..."
              value={trackSearch}
              onChange={e => setTrackSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50"
            />
          </div>
        </div>

        <div className="responsive-card-grid flex-1 p-3 space-y-2.5 overflow-y-auto text-xs">
          {filteredTxs.map(tx => {
            const room = rooms.find(r => r.id === tx.roomId);
            const tenant = tenants.find(te => te.id === tx.tenantId);

            return (
              <div
                key={tx.id}
                className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <strong className="text-slate-900 font-bold">Phòng {room?.roomNumber || tx.roomId}</strong>
                    <div className="text-[11px] text-slate-500 font-mono">{tx.noticeId} • {tenant?.fullName}</div>
                  </div>
                  <StatusBadge status={tx.status} type="payment" />
                </div>

                <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-600">Số tiền cần thu:</span>
                  <span className="font-mono font-extrabold text-blue-900">{tx.totalDue.toLocaleString()} đ</span>
                </div>

                {tx.status === 'DA_THU' && (
                  <div className="text-[11px] text-emerald-800 bg-emerald-50 p-2 rounded-xl border border-emerald-100 space-y-0.5">
                    <div>Đã thu: <strong>{tx.receivedAmount?.toLocaleString()} đ</strong> vào ngày {tx.receivedDate}</div>
                    <div className="font-mono text-[10px] text-slate-500">Mã GD: {tx.bankTransactionRef}</div>
                  </div>
                )}

                {/* Actions per status */}
                <div className="pt-1 flex space-x-2">
                  {tx.status === 'CHUA_THU' && (
                    <button
                      onClick={() => navigate('PAY_CONFIRM', { noticeId: tx.noticeId, roomId: tx.roomId })}
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <span>Khách đã chuyển: Xác nhận thu</span>
                    </button>
                  )}

                  {tx.status === 'DA_THU' && (
                    <button
                      onClick={() => navigate('PAY_CORRECT', { transactionId: tx.id })}
                      className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Sửa xác nhận nhầm</span>
                    </button>
                  )}

                  {tx.status === 'QUA_HAN' && (
                    <button
                      onClick={() => navigate('DEBT', { roomId: tx.roomId })}
                      className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <span>Khoản nợ quá hạn: Mở Công nợ</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <BottomTabs />
      </div>
    );
  }

  // 11. PAY_CONFIRM Screen (F.9 - Cross-link 46)
  if (currentScreenId === 'PAY_CONFIRM') {
    const handleConfirmSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setConfirmError(null);
      const res = confirmPaymentReceived(currentNotice.id, Number(confirmAmount), confirmRefCode);
      if (res.success) {
        navigate('PAY_TRACK', { periodId: currentNotice.periodId });
      } else if (res.error) {
        setConfirmError(res.error);
      }
    };

    return (
      <div className="flex-1 flex flex-col p-4 bg-slate-50 space-y-3">
        <AppHeader
          title={`Xác Nhận Thu Tiền: ${currentNotice.code}`}
          subtitle="Xác nhận đúng 100% số tiền theo mã QR"
          onBack={() => navigate('PAY_TRACK')}
        />

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3 text-xs">
          {/* Business rule: Exact sum 100%, no partial payment */}
          <div className="p-3 bg-amber-50 border border-amber-200 text-amber-950 rounded-xl space-y-1">
            <strong className="block font-bold text-amber-900 flex items-center">
              <ShieldAlert className="w-4 h-4 mr-1 text-amber-600" /> Quy định nghiệp vụ bắt buộc (Quy tắc D5):
            </strong>
            <p>
              Chỉ khi người thuê chuyển khoản <strong>ĐỦ ĐÚNG 100% tổng tiền trên mã QR ({currentNotice.totalAmount.toLocaleString()} VNĐ)</strong> mới được xác nhận đã thu. <strong>KHÔNG CHO PHÉP thanh toán một phần</strong> trong chức năng xác nhận theo QR.
            </p>
          </div>

          {confirmError && (
            <div className="p-2.5 rounded-xl bg-red-50 text-red-800 border border-red-200">
              {confirmError}
            </div>
          )}

          <form onSubmit={handleConfirmSubmit} className="space-y-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Số tiền thực tế nhận trên sao kê ngân hàng (VNĐ)</label>
              <input
                type="number"
                value={confirmAmount}
                onChange={e => setConfirmAmount(Number(e.target.value))}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold text-slate-900"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Yêu cầu bắt buộc: Khớp đúng {currentNotice.totalAmount.toLocaleString()} VNĐ.
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Mã tham chiếu giao dịch ngân hàng</label>
              <input
                type="text"
                value={confirmRefCode}
                onChange={e => setConfirmRefCode(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-md cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Xác Nhận Đã Thu Đủ 100%</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // 12. PAY_CORRECT Screen (F.9 - Cross-link 47)
  if (currentScreenId === 'PAY_CORRECT') {
    const handleCorrectSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setCorrectError(null);
      const res = correctPaymentReceipt(currentTx.id, Number(correctAmount), correctReason);
      if (res.success) {
        navigate('PAY_TRACK', { periodId: currentTx.periodId });
      } else if (res.error) {
        setCorrectError(res.error);
      }
    };

    return (
      <div className="flex-1 flex flex-col p-4 bg-slate-50 space-y-3">
        <AppHeader
          title="Sửa Xác Nhận Thu Nhầm"
          subtitle="Ghi nhận căn cứ điều chỉnh & cập nhật kiểm toán"
          onBack={() => navigate('PAY_TRACK')}
        />

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3 text-xs">
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-900 rounded-xl space-y-1">
            <strong className="block font-bold">Quy tắc sửa xác nhận thu (Quy tắc D5):</strong>
            <p>
              Sửa xác nhận nhầm phải có lý do và chứng cứ, hệ thống tự động cảnh báo ảnh hưởng tới công nợ và báo cáo, lưu nhật ký kiểm toán và không xóa dấu vết cũ.
            </p>
          </div>

          {correctError && (
            <div className="p-2.5 rounded-xl bg-red-50 text-red-800 border border-red-200">
              {correctError}
            </div>
          )}

          <form onSubmit={handleCorrectSubmit} className="space-y-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Số tiền điều chỉnh lại (VNĐ)</label>
              <input
                type="number"
                value={correctAmount}
                onChange={e => setCorrectAmount(Number(e.target.value))}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Lý do sửa xác nhận (Bắt buộc)</label>
              <textarea
                value={correctReason}
                onChange={e => setCorrectReason(e.target.value)}
                rows={3}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-md cursor-pointer"
              >
                Lưu Thay Đổi & Cập Nhật Lịch Sử
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return null;
};
