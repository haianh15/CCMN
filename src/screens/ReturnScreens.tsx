import React, { useState } from 'react';
import {
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Clock,
  Layers,
  FileCheck,
  HelpCircle,
  AlertCircle,
  ExternalLink,
  Lock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AppHeader } from '../components/common/AppHeader';
import { BottomTabs } from '../components/common/BottomTabs';
import { MissingRecord } from '../components/common/MissingRecord';
import { CheckoutProtocol } from '../types';

export const ReturnScreens: React.FC = () => {
  const {
    currentScreenId,
    params,
    navigate,
    rooms,
    tenants,
    assetItems,
    checkoutProtocols,
    depositSettlements,
    createCheckoutDraft,
    confirmActualReturn305,
    markReturnPending,
    saveAssetComparison,
    signCheckoutFinalProtocol,
    verifyReturnAndFreeRoom
  } = useApp();

  const targetRoomId = params.roomId as string | undefined;
  const currentRoom = (targetRoomId ? rooms.find(r => r.id === targetRoomId) : undefined)!;
  const currentTenant = tenants.find(t => t.id === currentRoom?.currentTenantId);
  const currentProtocol = checkoutProtocols.find(p => p.roomId === currentRoom?.id);
  const roomAssets = assetItems.filter(item => item.roomId === currentRoom?.id);
  const currentSettlement = depositSettlements.find(s => s.roomId === currentRoom?.id);

  // RETURN_ACTUAL form
  const [electricFinal, setElectricFinal] = useState<number>(currentProtocol?.finalElectricNumber || 1540);
  const [waterFinal, setWaterFinal] = useState<number>(currentProtocol?.finalWaterNumber || 88);

  // RETURN_PENDING form
  const [pendingReasonText, setPendingReasonText] = useState(currentProtocol?.pendingReason || 'Khách chưa dọn sạch tủ đồ và thiếu 1 chìa khóa phụ + 1 thẻ từ');

  // RETURN_COMPARE differences
  const [damageAmount, setDamageAmount] = useState<number>(400000);
  const [damageNotes, setDamageNotes] = useState('Hỏng tay gạt cửa ban công (250k) + Mất 1 thẻ từ thang máy (150k)');

  // RETURN_FINAL form
  const [finalPaperProof, setFinalPaperProof] = useState(currentProtocol?.paperProofUrl || 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=400&q=80');

  if (!targetRoomId || !rooms.some(room => room.id === targetRoomId)) {
    return <MissingRecord title="Quy trình trả phòng" message="Phòng được chọn không còn tồn tại." backTo="ROOMS" />;
  }

  // 1. RETURN Stepper Screen (F.8)
  if (currentScreenId === 'RETURN') {
    const steps = [
      { id: 1, name: 'Biên bản trả phòng nháp', screenId: 'RETURN_DRAFT' as const, done: !!currentProtocol },
      { id: 2, name: 'Nhận lại thực tế (Mốc 3.05)', screenId: 'RETURN_ACTUAL' as const, done: !!currentProtocol?.actualReturnConfirmed },
      { id: 3, name: 'Đối chiếu tài sản', screenId: 'RETURN_COMPARE' as const, done: !!currentProtocol?.actualReturnConfirmed },
      { id: 4, name: 'Đối soát cọc trong biên bản', screenId: 'RETURN_DEPOSIT' as const, done: currentSettlement?.status === 'DA_CHOT_HOAN_TIEN' },
      { id: 5, name: 'Hoàn thiện biên bản giấy', screenId: 'RETURN_FINAL' as const, done: !!currentProtocol?.paperProtocolSigned },
      { id: 6, name: 'Kiểm tra & Giải phóng phòng', screenId: 'RETURN_CHECK' as const, done: currentRoom.status === 'TRONG' }
    ];

    return (
      <div className="flex-1 flex flex-col justify-between bg-slate-50">
        <AppHeader
          title={`Quy Trình Trả Phòng P.${currentRoom.roomNumber}`}
          subtitle="Quy trình 6 bước bàn giao & thanh lý"
          onBack={() => navigate('ROOM_DETAIL', { roomId: currentRoom.id })}
        />

        <div className="flex-1 p-3.5 space-y-3 overflow-y-auto text-xs">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="font-bold text-slate-900">Các Bước Thực Hiện Trả Phòng:</span>
              <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                Tiến độ: Bước {currentProtocol?.actualReturnConfirmed ? '3/6' : '1/6'}
              </span>
            </div>

            <div className="space-y-2">
              {steps.map(s => (
                <div
                  key={s.id}
                  onClick={() => navigate(s.screenId, { roomId: currentRoom.id })}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50/60 transition-colors cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2.5">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                      s.done ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {s.done ? '✓' : s.id}
                    </div>
                    <span className="font-semibold text-slate-900">{s.name}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate('RETURN_DRAFT', { roomId: currentRoom.id })}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md cursor-pointer"
          >
            <span>Bắt Đầu: Lập Biên Bản Trả Nháp</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <BottomTabs />
      </div>
    );
  }

  // 2. RETURN_DRAFT Screen (F.8 - Cross-link 30)
  if (currentScreenId === 'RETURN_DRAFT') {
    const handleStartDraft = () => {
      createCheckoutDraft(currentRoom.id);
      // Cross-link 30 to RETURN_ACTUAL
      navigate('RETURN_ACTUAL', { roomId: currentRoom.id });
    };

    return (
      <div className="flex-1 flex flex-col p-4 bg-slate-50 space-y-3">
        <AppHeader
          title={`Biên Bản Trả Nháp P.${currentRoom.roomNumber}`}
          subtitle="Khởi tạo biên bản thanh lý hợp đồng"
          onBack={() => navigate('RETURN', { roomId: currentRoom.id })}
        />

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <strong className="block font-bold text-slate-900 border-b border-slate-200 pb-1">
              THÔNG TIN BIÊN BẢN TRẢ PHÒNG (DỰ THẢO):
            </strong>
            <p>• Phòng: <strong>Phòng {currentRoom.roomNumber}</strong> (Tầng {currentRoom.floor})</p>
            <p>• Người thuê: <strong>{currentTenant?.fullName || 'Khách thuê'}</strong> ({currentTenant?.phone})</p>
            <p>• Ngày lập dự thảo: <strong>{new Date().toLocaleDateString('vi-VN')}</strong></p>
          </div>

          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-[11px]">
            Lưu ý: Biên bản mới chỉ ở dạng Nháp. Chưa được đánh dấu đã hoàn tất cho đến khi nhận lại thực tế và quyết toán cọc.
          </div>

          <div className="pt-2">
            <button
              onClick={handleStartDraft}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md cursor-pointer"
            >
              <span>Lưu Nháp → Chuyển Sang Nhận Lại Thực Tế</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. RETURN_ACTUAL Screen (F.8 - Cross-links 31, 37)
  if (currentScreenId === 'RETURN_ACTUAL') {
    const handleConfirmActual = () => {
      confirmActualReturn305(currentRoom.id, Number(electricFinal), Number(waterFinal));
      // Cross-link 31 to RETURN_COMPARE
      navigate('RETURN_COMPARE', { roomId: currentRoom.id });
    };

    return (
      <div className="flex-1 flex flex-col p-4 bg-slate-50 space-y-3">
        <AppHeader
          title={`Nhận Lại Phòng Thực Tế P.${currentRoom.roomNumber}`}
          subtitle="Chốt chỉ số điện nước & xác nhận nhận thực tế"
          onBack={() => navigate('RETURN', { roomId: currentRoom.id })}
        />

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3 text-xs">
          <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 rounded-xl space-y-1">
            <strong className="block font-bold">Quy định xác nhận nhận thực tế:</strong>
            <p>
              Tách rõ việc ghi nhận kiểm tra và xác nhận đã nhận lại thực tế theo hai mốc riêng. Nếu khách chưa dọn hết đồ hoặc thiếu chìa khóa, bắt buộc chuyển sang xử lý "Chưa bàn giao xong".
            </p>
          </div>

          <div className="space-y-2">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Chỉ số điện chốt lúc trả (kWh)</label>
              <input
                type="number"
                value={electricFinal}
                onChange={e => setElectricFinal(Number(e.target.value))}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Chỉ số nước chốt lúc trả (m³)</label>
              <input
                type="number"
                value={waterFinal}
                onChange={e => setWaterFinal(Number(e.target.value))}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
              />
            </div>
          </div>

          <div className="pt-2 space-y-2">
            <button
              onClick={handleConfirmActual}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md cursor-pointer"
            >
              <span>Đã Nhận Thực Tế → Đối Chiếu Tài Sản</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('RETURN_PENDING', { roomId: currentRoom.id })}
              className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold rounded-xl text-xs border border-rose-200 cursor-pointer"
            >
              Chưa Thể Nhận: Báo Chưa Bàn Giao Xong
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. RETURN_PENDING Screen (F.8 - Cross-link 37)
  if (currentScreenId === 'RETURN_PENDING') {
    const handleSavePending = (e: React.FormEvent) => {
      e.preventDefault();
      markReturnPending(currentRoom.id, pendingReasonText);
    };

    return (
      <div className="flex-1 flex flex-col p-4 bg-slate-50 space-y-3">
        <AppHeader
          title={`Chưa Bàn Giao Xong P.${currentRoom.roomNumber}`}
          subtitle="Khắc phục vướng mắc trước khi nhận"
          onBack={() => navigate('RETURN_ACTUAL', { roomId: currentRoom.id })}
        />

        <div className="bg-white rounded-2xl p-4 border border-rose-200 shadow-xs space-y-3 text-xs">
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-900 rounded-xl space-y-1">
            <strong className="block font-bold">Ràng buộc trạng thái phòng:</strong>
            <p>
              Khi chưa bàn giao xong, phòng <strong>KHÔNG được tự động chuyển sang TRỐNG</strong>. Người quản lý phải ghi nhận nguyên nhân còn thiếu và chờ khách khắc phục.
            </p>
          </div>

          <form onSubmit={handleSavePending} className="space-y-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Lý do chưa bàn giao xong</label>
              <textarea
                value={pendingReasonText}
                onChange={e => setPendingReasonText(e.target.value)}
                rows={3}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-xs"
            >
              Lưu Trạng Thái "Chưa Bàn Giao Xong"
            </button>
          </form>

          {/* Cross-link 37 to RETURN_ACTUAL */}
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => navigate('RETURN_ACTUAL', { roomId: currentRoom.id })}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center justify-center space-x-1 cursor-pointer"
            >
              <span>Sau Khi Khách Đã Khắc Phục Xong → Kiểm Tra Lại</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 5. RETURN_COMPARE Screen (F.8 - Cross-links 32, 38)
  if (currentScreenId === 'RETURN_COMPARE') {
    return (
      <div className="flex-1 flex flex-col p-4 bg-slate-50 space-y-3">
        <AppHeader
          title={`Đối Chiếu Tài Sản P.${currentRoom.roomNumber}`}
          subtitle="So sánh hiện trạng lúc nhận và lúc trả"
          onBack={() => navigate('RETURN_ACTUAL', { roomId: currentRoom.id })}
          rightAction={
            <button
              onClick={() => navigate('ASSET_INCIDENTS', { roomId: currentRoom.id })}
              className="text-[11px] font-semibold text-blue-600 hover:underline"
            >
              Tra sự cố
            </button>
          }
        />

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3 text-xs">
          <div className="space-y-2">
            {roomAssets.map(item => (
              <div key={item.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{item.assetName} (SL: {item.quantity})</span>
                  {item.isDamagedOrMissing && (
                    <span className="text-rose-600 text-[10px] bg-rose-50 px-2 py-0.2 rounded-full border border-rose-200">
                      Có chênh lệch
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-600">
                  • Lúc nhận: <span className="font-semibold">{item.initialCondition}</span>
                </div>
                {item.difference && (
                  <div className="text-[11px] text-rose-700 pt-1 border-t border-slate-200">
                    • Phát hiện lúc trả: <strong>{item.difference}</strong>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={() => navigate('RETURN_COMPARE_RESULT', { roomId: currentRoom.id })}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md cursor-pointer"
            >
              <span>Xem Kết Quả Đối Chiếu & Bồi Thường</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 6. RETURN_COMPARE_RESULT Screen (F.8 - Cross-link 32)
  if (currentScreenId === 'RETURN_COMPARE_RESULT') {
    const handleProceedToDeposit = () => {
      // Cross-link 32 to DEPOSIT_NEW
      navigate('DEPOSIT_NEW', { roomId: currentRoom.id, damageAmount, damageNotes });
    };

    return (
      <div className="flex-1 flex flex-col p-4 bg-slate-50 space-y-3">
        <AppHeader
          title={`Kết Quả Đối Chiếu P.${currentRoom.roomNumber}`}
          subtitle="Ghi nhận căn cứ khấu trừ cọc"
          onBack={() => navigate('RETURN_COMPARE', { roomId: currentRoom.id })}
        />

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <strong className="block font-bold text-slate-900">Tổng hợp chênh lệch & hư hỏng:</strong>
            <p className="text-slate-700">{damageNotes}</p>
            <div className="flex justify-between pt-1 border-t border-slate-200 font-bold">
              <span>Mức khấu trừ thỏa thuận:</span>
              <span className="font-mono text-rose-700 text-sm">{damageAmount.toLocaleString()} VNĐ</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-[11px] text-blue-900">
            Quy định: Không tự quy kết lỗi cho khách thuê. Mọi khoản khấu trừ phải có căn cứ từ biên bản đối chiếu tài sản này.
          </div>

          <div className="pt-2">
            <button
              onClick={handleProceedToDeposit}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md cursor-pointer"
            >
              <span>Có Hư Hại → Đưa Vào Quyết Toán Cọc</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 7. RETURN_DEPOSIT Screen (F.8 - Cross-links 34, 39)
  if (currentScreenId === 'RETURN_DEPOSIT') {
    return (
      <div className="flex-1 flex flex-col p-4 bg-slate-50 space-y-3">
        <AppHeader
          title={`Đối Soát Cọc Trong Biên Bản P.${currentRoom.roomNumber}`}
          subtitle="Bản đối soát từ quy trình quyết toán cọc"
          onBack={() => navigate('RETURN', { roomId: currentRoom.id })}
        />

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3 text-xs">
          <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl space-y-1">
            <strong className="block font-bold flex items-center">
              <Lock className="w-4 h-4 mr-1 text-amber-700" /> Ràng buộc chỉ đọc tuyệt đối (Quy tắc D7):
            </strong>
            <p>
              Màn hình này chỉ hiển thị dữ liệu tổng hợp từ quy trình Quyết toán cọc. Tuyệt đối không cho phép chỉnh sửa giá trị tiền cọc tại đây.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 font-mono">
            <div className="flex justify-between">
              <span className="text-slate-600 font-sans">Tiền cọc gốc (1 tháng):</span>
              <strong className="text-slate-900">4.600.000 VNĐ</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 font-sans">Điện nước kỳ cuối:</span>
              <span className="text-slate-900">- 520.000 VNĐ</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 font-sans">Khấu trừ hư hỏng tài sản:</span>
              <span className="text-rose-700">- 400.000 VNĐ</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-200 text-sm font-bold font-sans">
              <span>SỐ TIỀN HOÀN CỌC CHỐT:</span>
              <span className="font-mono text-emerald-700">3.680.000 VNĐ</span>
            </div>
          </div>

          <div className="pt-2 space-y-2">
            {/* Link 34 to RETURN_FINAL */}
            <button
              onClick={() => navigate('RETURN_FINAL', { roomId: currentRoom.id })}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md cursor-pointer"
            >
              <span>Kiểm Tra Cọc Xong → Hoàn Thiện Biên Bản Giấy</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Link 39 to DEPOSIT_DETAIL */}
            <button
              onClick={() => currentSettlement
                ? navigate('DEPOSIT_DETAIL', { settlementId: currentSettlement.id, roomId: currentRoom.id })
                : navigate('DEPOSIT_NEW', { roomId: currentRoom.id })}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center justify-center space-x-1 cursor-pointer"
            >
              <span>{currentSettlement ? 'Xem Chi Tiết Quyết Toán Cọc' : 'Lập Quyết Toán Cọc'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 8. RETURN_FINAL Screen (F.8 - Cross-link 35)
  if (currentScreenId === 'RETURN_FINAL') {
    const handleSignFinal = () => {
      signCheckoutFinalProtocol(currentRoom.id, finalPaperProof);
      // Cross-link 35 to RETURN_CHECK
      navigate('RETURN_CHECK', { roomId: currentRoom.id });
    };

    return (
      <div className="flex-1 flex flex-col p-4 bg-slate-50 space-y-3">
        <AppHeader
          title={`Hoàn Thiện Biên Bản Trả P.${currentRoom.roomNumber}`}
          subtitle="Ký biên bản trả phòng giấy"
          onBack={() => navigate('RETURN', { roomId: currentRoom.id })}
        />

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <strong className="block font-bold text-slate-900">Xác nhận ký biên bản thanh lý giấy:</strong>
            <p className="text-slate-600">
              Chủ nhà và bên thuê cùng ký xác nhận trên biên bản giấy về việc đã nhận lại phòng, các khoản khấu trừ và hoàn trả cọc.
            </p>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Ảnh chụp biên bản trả phòng hoàn chỉnh</label>
            <div className="h-32 rounded-xl overflow-hidden border border-slate-200 relative">
              <img src={finalPaperProof} alt="Biên bản trả" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleSignFinal}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md cursor-pointer"
            >
              <span>Ký Biên Bản Xong → Kiểm Tra Giải Phóng Phòng</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 9. RETURN_CHECK Screen (F.8 - Cross-link 36)
  if (currentScreenId === 'RETURN_CHECK') {
    const [unmetList, setUnmetList] = useState<string[]>([]);

    const handleVerifyAndFree = () => {
      const res = verifyReturnAndFreeRoom(currentRoom.id);
      if (res.success) {
        // Cross-link 36 to ROOM_DETAIL
        navigate('ROOM_DETAIL', { roomId: currentRoom.id });
      } else if (res.unmetReasons) {
        setUnmetList(res.unmetReasons);
      }
    };

    return (
      <div className="flex-1 flex flex-col p-4 bg-slate-50 space-y-3">
        <AppHeader
          title={`Kiểm Tra Kết Quả Trả P.${currentRoom.roomNumber}`}
          subtitle="Xác minh điều kiện giải phóng phòng TRỐNG"
          onBack={() => navigate('RETURN', { roomId: currentRoom.id })}
        />

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3 text-xs">
          <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 rounded-xl space-y-1">
            <strong className="block font-bold">Quy tắc giải phóng phòng (Quy tắc D7):</strong>
            <p>
              Chỉ khi thỏa mãn toàn bộ các điều kiện: Đã nhận lại thực tế (3.05) + Không vướng mắc tồn đọng + Quyết toán cọc đã chốt xong + Đã ký biên bản thanh lý giấy thì phòng mới được giải phóng thành TRỐNG.
            </p>
          </div>

          {unmetList.length > 0 && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-900 rounded-xl space-y-1">
              <strong className="block font-bold">Chưa đủ điều kiện:</strong>
              {unmetList.map((reason, i) => (
                <div key={i} className="text-[11px]">• {reason}</div>
              ))}
            </div>
          )}

          <div className="space-y-2">
            <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <span>1. Xác nhận nhận lại thực tế (3.05):</span>
              <span className="font-bold text-emerald-600">✓ Đạt</span>
            </div>
            <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <span>2. Quyết toán cọc:</span>
              <span className="font-bold text-emerald-600">✓ Đã chốt</span>
            </div>
            <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <span>3. Ký biên bản thanh lý giấy:</span>
              <span className="font-bold text-emerald-600">✓ Đầy đủ</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleVerifyAndFree}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md cursor-pointer"
            >
              <span>Xác Nhận Đủ Điều Kiện → Đổi Thành Phòng TRỐNG</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
