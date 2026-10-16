import React, { useState } from 'react';
import {
  Wrench,
  Plus,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Camera,
  Image as ImageIcon,
  Clock,
  Layers,
  FileCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AppHeader } from '../components/common/AppHeader';
import { BottomTabs } from '../components/common/BottomTabs';
import { MissingRecord } from '../components/common/MissingRecord';
import { AssetInventoryItem, AssetIncident } from '../types';

export const AssetScreens: React.FC = () => {
  const {
    currentScreenId,
    params,
    navigate,
    rooms,
    assetItems,
    assetReports,
    handoverProtocols,
    incidents,
    saveAssetInventory,
    saveAssetStatusReport,
    signHandoverProtocol,
    createIncident,
    updateIncident
  } = useApp();

  const targetRoomId = params.roomId as string | undefined;
  const currentRoom = (targetRoomId ? rooms.find(r => r.id === targetRoomId) : undefined)!;
  const roomAssets = assetItems.filter(item => item.roomId === currentRoom?.id);
  const roomIncidents = incidents.filter(i => i.roomId === currentRoom?.id);
  const currentReport = assetReports.find(r => r.roomId === currentRoom?.id);
  const currentProtocol = handoverProtocols.find(p => p.roomId === currentRoom?.id);

  // Selected incident
  const targetIncidentId = params.incidentId as string | undefined;
  const currentIncident = (targetIncidentId ? incidents.find(i => i.id === targetIncidentId) : roomIncidents[0])!;

  // ASSET_STATUS form
  const [reportDesc, setReportDesc] = useState(currentReport?.overallDescription || 'Tường sơn mới, sàn gạch sạch sẽ, các thiết bị điện lạnh chạy tốt.');
  const [reportPhotos, setReportPhotos] = useState<string[]>(currentReport?.evidenceImages || [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80'
  ]);

  // ASSET_RECEIVE form
  const [protocolProof, setProtocolProof] = useState(currentProtocol?.paperProofUrl || 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=400&q=80');

  // ASSET_INCIDENT_NEW form
  const [incidentAssetName, setIncidentAssetName] = useState('Bình nóng lạnh');
  const [incidentDesc, setIncidentDesc] = useState('Đèn báo sáng nhưng nước không nóng');
  const [incidentStep, setIncidentStep] = useState('Đã hẹn thợ điện nước kiểm tra chiều nay');
  const [incidentProof, setIncidentProof] = useState('https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80');

  // ASSET_INCIDENT_DETAIL update
  const [updateStep, setUpdateStep] = useState('');
  const [updateStatus, setUpdateStatus] = useState<AssetIncident['status']>('DANG_SUA');

  if (!targetRoomId || !rooms.some(room => room.id === targetRoomId)) {
    return <MissingRecord title="Tài sản phòng" message="Phòng được chọn không còn tồn tại." backTo="ROOMS" />;
  }
  if (currentScreenId === 'ASSET_INCIDENT_DETAIL' && (!targetIncidentId || !incidents.some(incident => incident.id === targetIncidentId))) {
    return <MissingRecord title="Chi tiết sự cố" message="Sự cố được chọn không còn tồn tại." backTo="ASSET_INCIDENTS" />;
  }

  // 1. ASSET Hub Screen (F.7)
  if (currentScreenId === 'ASSET') {
    return (
      <div className="flex-1 flex flex-col justify-between bg-slate-50">
        <AppHeader
          title={`Tài Sản & Bàn Giao P.${currentRoom.roomNumber}`}
          subtitle={`Quản lý trang thiết bị phòng ${currentRoom.roomNumber}`}
          onBack={() => navigate('ROOM_DETAIL', { roomId: currentRoom.id })}
        />

        <div className="flex-1 p-3.5 space-y-3 overflow-y-auto text-xs">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2">
            <h3 className="font-bold text-slate-900 text-xs">Hạng Mục Quản Lý Tài Sản:</h3>

            <div className="space-y-2 pt-1">
              {/* Item 1: ASSET_INV */}
              <div
                onClick={() => navigate('ASSET_INV', { roomId: currentRoom.id })}
                className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 transition-colors cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Kiểm kê tài sản ({roomAssets.length} thiết bị)</div>
                    <div className="text-[11px] text-slate-500">Danh mục nội thất, điện máy và tình trạng</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>

              {/* Item 2: ASSET_STATUS */}
              <div
                onClick={() => navigate('ASSET_STATUS', { roomId: currentRoom.id })}
                className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 transition-colors cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Hiện trạng & Hình ảnh bàn giao</div>
                    <div className="text-[11px] text-slate-500">Ghi nhận minh chứng hiện trường lúc nhận</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>

              {/* Item 3: ASSET_RECEIVE */}
              <div
                onClick={() => navigate('ASSET_RECEIVE', { roomId: currentRoom.id })}
                className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 transition-colors cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Biên bản nhận phòng giấy</div>
                    <div className="text-[11px] text-slate-500">
                      {currentProtocol?.paperHandoverSigned ? '✓ Đã ký biên bản giấy' : 'Chưa ký biên bản giấy'}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>

              {/* Item 4: ASSET_INCIDENTS */}
              <div
                onClick={() => navigate('ASSET_INCIDENTS', { roomId: currentRoom.id })}
                className="p-3 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200/80 transition-colors cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Lịch sử sự cố thiết bị ({roomIncidents.length})</div>
                    <div className="text-[11px] text-slate-500">Theo dõi sửa chữa, chi phí và tiến độ</div>
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

  // 2. ASSET_INV Screen (F.7 - Cross-link 16)
  if (currentScreenId === 'ASSET_INV') {
    return (
      <div className="flex-1 flex flex-col p-4 bg-slate-50 space-y-3">
        <AppHeader
          title={`Kiểm Kê Tài Sản P.${currentRoom.roomNumber}`}
          subtitle="Danh sách thiết bị và hiện trạng"
          onBack={() => navigate('ASSET', { roomId: currentRoom.id })}
        />

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3 text-xs">
          <div className="font-bold text-slate-900 flex items-center justify-between pb-1 border-b border-slate-100">
            <span>Danh mục thiết bị trong phòng ({roomAssets.length})</span>
            <span className="text-[10px] text-slate-400 font-mono">P.{currentRoom.roomNumber}</span>
          </div>

          <div className="space-y-2">
            {roomAssets.map(item => (
              <div key={item.id} className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                <div className="flex items-center justify-between">
                  <strong className="text-slate-900">{item.assetName}</strong>
                  <span className="text-[11px] text-slate-500 font-mono">SL: {item.quantity}</span>
                </div>
                <div className="text-[11px] text-slate-600">
                  Hiện trạng: <span className="font-semibold text-emerald-700">{item.initialCondition}</span>
                </div>
                {item.isDamagedOrMissing && (
                  <div className="text-[11px] text-rose-700 font-semibold pt-1 border-t border-rose-100">
                    ⚠ {item.difference} (Bồi thường: {item.compensationAmount?.toLocaleString()} đ)
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Cross-link 16 to ASSET_STATUS */}
          <div className="pt-2">
            <button
              onClick={() => navigate('ASSET_STATUS', { roomId: currentRoom.id })}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md cursor-pointer"
            >
              <span>Kiểm Kê Xong → Ghi Hiện Trạng Bàn Giao</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. ASSET_STATUS Screen (F.7 - Cross-link 17)
  if (currentScreenId === 'ASSET_STATUS') {
    const handleSaveReport = (e: React.FormEvent) => {
      e.preventDefault();
      saveAssetStatusReport({
        roomId: currentRoom.id,
        rentalId: currentRoom.currentRentalId || `LT-${currentRoom.id}-01`,
        recordedDate: new Date().toLocaleDateString('vi-VN'),
        overallDescription: reportDesc,
        evidenceImages: reportPhotos,
        inspector: 'Nguyễn Văn Minh (Chủ nhà)',
        tenantConfirmed: true
      });
      // Cross-link 17 to ASSET_RECEIVE
      navigate('ASSET_RECEIVE', { roomId: currentRoom.id });
    };

    return (
      <div className="flex-1 flex flex-col p-4 bg-slate-50 space-y-3">
        <AppHeader
          title={`Hiện Trạng Bàn Giao P.${currentRoom.roomNumber}`}
          subtitle="Hình ảnh và mô tả hiện trường"
          onBack={() => navigate('ASSET_INV', { roomId: currentRoom.id })}
        />

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3 text-xs">
          <form onSubmit={handleSaveReport} className="space-y-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Mô tả tổng thể hiện trạng bàn giao</label>
              <textarea
                value={reportDesc}
                onChange={e => setReportDesc(e.target.value)}
                rows={3}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Ảnh chụp hiện trường phòng</label>
              <div className="grid grid-cols-2 gap-2">
                {reportPhotos.map((img, i) => (
                  <div key={i} className="h-24 rounded-xl overflow-hidden border border-slate-200 relative">
                    <img src={img} alt="Hiện trạng" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md cursor-pointer"
              >
                <span>Ghi Hiện Trạng → Lập Biên Bản Nhận Phòng</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // 4. ASSET_RECEIVE Screen (F.7 - Cross-link 18)
  if (currentScreenId === 'ASSET_RECEIVE') {
    const handleSignReceive = () => {
      signHandoverProtocol(currentRoom.id, currentRoom.currentContractId || 'HD-2026-001', protocolProof);
      // Cross-link 18 to ROOM_IN
      navigate('ROOM_IN', { roomId: currentRoom.id });
    };

    return (
      <div className="flex-1 flex flex-col p-4 bg-slate-50 space-y-3">
        <AppHeader
          title={`Biên Bản Nhận Phòng P.${currentRoom.roomNumber}`}
          subtitle="Ghi nhận chữ ký biên bản giấy hai bên"
          onBack={() => navigate('ASSET_STATUS', { roomId: currentRoom.id })}
        />

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="font-bold text-center text-slate-900 border-b border-slate-200 pb-1">
              BIÊN BẢN BÀN GIAO & TIẾP NHẬN PHÒNG
            </div>
            <p className="text-[11px] text-slate-700">
              Hai bên xác nhận đã bàn giao đầy đủ số lượng thiết bị, chìa khóa phòng, thẻ từ và xác nhận hiện trạng phòng <strong>{currentRoom.roomNumber}</strong> hoạt động tốt.
            </p>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Ảnh chứng từ biên bản giấy đã ký</label>
            <div className="h-32 rounded-xl overflow-hidden border border-slate-200 relative mb-1">
              <img src={protocolProof} alt="Biên bản giấy" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleSignReceive}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md cursor-pointer"
            >
              <span>Ký Biên Bản Xong → Kiểm Tra Nhận Phòng</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 5. ASSET_INCIDENTS Screen (F.7)
  if (currentScreenId === 'ASSET_INCIDENTS') {
    return (
      <div className="flex-1 flex flex-col p-4 bg-slate-50 space-y-3">
        <AppHeader
          title="Lịch Sử Sự Cố Tài Sản"
          subtitle="Danh sách hỏng hóc và tiến độ sửa chữa"
          onBack={() => navigate('ASSET', { roomId: currentRoom.id })}
          rightAction={
            <button
              onClick={() => navigate('ASSET_INCIDENT_NEW', { roomId: currentRoom.id })}
              className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Báo sự cố</span>
            </button>
          }
        />

        <div className="responsive-card-grid bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2.5 text-xs">
          {roomIncidents.length > 0 ? (
            roomIncidents.map(inc => (
              <div
                key={inc.id}
                onClick={() => navigate('ASSET_INCIDENT_DETAIL', { incidentId: inc.id, roomId: inc.roomId })}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-amber-50/50 transition-colors cursor-pointer space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{inc.code}: {inc.assetName}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    inc.status === 'HOAN_TAT' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    inc.status === 'DANG_SUA' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                    'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {inc.status === 'HOAN_TAT' ? 'Đã hoàn tất' : inc.status === 'DANG_SUA' ? 'Đang sửa chữa' : 'Chờ xử lý'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-600">{inc.description}</div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-100">
                  <span>Phòng {inc.roomId} • {inc.date}</span>
                  <span className="text-blue-600 font-medium">Chi tiết &gt;</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-slate-400 text-center py-6">Không có sự cố nào ghi nhận.</p>
          )}
        </div>
      </div>
    );
  }

  // 6. ASSET_INCIDENT_NEW Screen (F.7)
  if (currentScreenId === 'ASSET_INCIDENT_NEW') {
    const handleSaveIncident = (e: React.FormEvent) => {
      e.preventDefault();
      const res = createIncident({
        roomId: currentRoom.id,
        rentalId: currentRoom.currentRentalId || `LT-${currentRoom.id}-01`,
        assetName: incidentAssetName,
        date: new Date().toLocaleDateString('vi-VN'),
        description: incidentDesc,
        evidenceImageUrl: incidentProof,
        status: 'CHO_XU_LY',
        actionStep: incidentStep,
        repairCost: 0,
        paidBy: 'CHUA_XAC_DINH',
        historyNotes: [
          {
            date: new Date().toLocaleString('vi-VN'),
            content: `Khởi tạo báo cáo sự cố: ${incidentDesc}`,
            by: 'Chủ nhà'
          }
        ]
      });
      navigate('ASSET_INCIDENT_DETAIL', { incidentId: res.incidentId, roomId: currentRoom.id });
    };

    return (
      <div className="flex-1 flex flex-col p-4 bg-slate-50 space-y-3">
        <AppHeader
          title={`Ghi Nhận Sự Cố Tài Sản P.${currentRoom.roomNumber}`}
          subtitle="Báo cáo thiết bị hư hỏng"
          onBack={() => navigate('ASSET_INCIDENTS', { roomId: currentRoom.id })}
        />

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3 text-xs">
          <form onSubmit={handleSaveIncident} className="space-y-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Thiết bị gặp sự cố</label>
              <input
                type="text"
                value={incidentAssetName}
                onChange={e => setIncidentAssetName(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Mô tả hiện tượng hư hỏng</label>
              <textarea
                value={incidentDesc}
                onChange={e => setIncidentDesc(e.target.value)}
                rows={2}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Phương án xử lý dự kiến</label>
              <input
                type="text"
                value={incidentStep}
                onChange={e => setIncidentStep(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-md cursor-pointer"
              >
                Lưu Báo Cáo Sự Cố Mới
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // 7. ASSET_INCIDENT_DETAIL Screen (F.7)
  if (currentScreenId === 'ASSET_INCIDENT_DETAIL') {
    const handleUpdateIncidentStep = (e: React.FormEvent) => {
      e.preventDefault();
      if (!updateStep.trim()) return;
      updateIncident(currentIncident.id, updateStep, updateStatus, updateStep);
      setUpdateStep('');
    };

    return (
      <div className="flex-1 flex flex-col p-4 bg-slate-50 space-y-3">
        <AppHeader
          title={`Chi Tiết Sự Cố: ${currentIncident.code}`}
          subtitle={`${currentIncident.assetName} • Phòng ${currentIncident.roomId}`}
          onBack={() => navigate('ASSET_INCIDENTS', { roomId: currentIncident.roomId })}
        />

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <div className="flex items-center justify-between">
              <strong className="text-slate-900 font-bold">{currentIncident.assetName}</strong>
              <span className="font-mono text-slate-500 text-[11px]">{currentIncident.date}</span>
            </div>
            <p className="text-slate-700">{currentIncident.description}</p>
            <div className="pt-1 text-[11px] text-blue-700 font-semibold">
              Bước xử lý hiện tại: {currentIncident.actionStep}
            </div>
          </div>

          <form onSubmit={handleUpdateIncidentStep} className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="font-bold text-slate-800">Cập nhật tiến độ xử lý:</div>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={updateStatus}
                onChange={e => setUpdateStatus(e.target.value as any)}
                className="px-2 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
              >
                <option value="CHO_XU_LY">Chờ xử lý</option>
                <option value="DANG_SUA">Đang sửa chữa</option>
                <option value="HOAN_TAT">Hoàn tất</option>
              </select>
              <input
                type="text"
                value={updateStep}
                onChange={e => setUpdateStep(e.target.value)}
                placeholder="Ghi tiến độ mới..."
                required
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
              />
            </div>
            <button
              type="submit"
              className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs"
            >
              Lưu Tiến Độ
            </button>
          </form>

          {/* History */}
          <div className="space-y-1.5 pt-2">
            <span className="font-bold text-slate-700">Nhật ký xử lý:</span>
            {currentIncident.historyNotes.map((h, i) => (
              <div key={i} className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex justify-between text-[11px]">
                <span className="text-slate-800">{h.content}</span>
                <span className="text-slate-400 font-mono shrink-0 ml-2">{h.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
};
