import React, { useState } from 'react';
import {
  ShieldAlert,
  Clock,
  Phone,
  MessageSquare,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Plus,
  Calendar,
  FileText,
  User,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AppHeader } from '../components/common/AppHeader';
import { BottomTabs } from '../components/common/BottomTabs';
import { OverdueDebt } from '../types';

export const DebtScreens: React.FC = () => {
  const {
    currentScreenId,
    params,
    navigate,
    overdueDebts,
    rooms,
    tenants,
    notices,
    contracts,
    recordDebtReminder,
    recordTenantReply
  } = useApp();

  const targetDebtId = (params.debtId as string) || (overdueDebts[0]?.id || 'DEBT-P301-09');
  const currentDebt = overdueDebts.find(d => d.id === targetDebtId) || overdueDebts[0];
  const debtRoom = rooms.find(r => r.id === currentDebt?.roomId);
  const debtTenant = tenants.find(t => t.id === currentDebt?.tenantId);
  const debtNotice = notices.find(n => n.id === currentDebt?.noticeId);
  const debtContract = contracts.find(c => c.roomId === currentDebt?.roomId && c.status === 'HIEU_LUC');

  // DEBT_REMIND form
  const [remindChannel, setRemindChannel] = useState<'DIEN_THOAI' | 'ZALO' | 'TRUC_TIEP'>('DIEN_THOAI');
  const [remindContent, setRemindContent] = useState('Chủ nhà gọi điện trực tiếp nhắc hạn nộp tiền nhà đã quá hạn 10 ngày');

  // DEBT_REPLY form
  const [replyChannel, setReplyChannel] = useState<'DIEN_THOAI' | 'ZALO' | 'TRUC_TIEP'>('ZALO');
  const [replyContent, setReplyContent] = useState('Khách hẹn chờ lương về sẽ chuyển khoản đủ 100%');
  const [promisedDate, setPromisedDate] = useState('18/10/2026');

  // 1. DEBT Screen (F.10 - Cross-link 48)
  if (currentScreenId === 'DEBT') {
    return (
      <div className="flex-1 flex flex-col justify-between bg-slate-50">
        <AppHeader
          title="Công Nợ Quá Hạn"
          subtitle="Chỉ liệt kê các khoản đã quá hạn chưa thanh toán"
          onBack={() => navigate('PAY')}
        />

        <div className="flex-1 p-3.5 space-y-3 overflow-y-auto text-xs">
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-950 rounded-xl space-y-1">
            <strong className="block font-bold text-rose-900 flex items-center">
              <ShieldAlert className="w-4 h-4 mr-1 text-rose-600" /> Quy định danh sách nợ (Quy tắc D6):
            </strong>
            <p>
              Chỉ khoản quá hạn chưa thanh toán mới được hiển thị ở đây. Hệ thống không trộn các khoản chưa đến hạn thanh toán vào danh mục này.
            </p>
          </div>

          <div className="space-y-2.5">
            {overdueDebts.map(debt => {
              const r = rooms.find(rm => rm.id === debt.roomId);
              const t = tenants.find(tn => tn.id === debt.tenantId);

              return (
                <div
                  key={debt.id}
                  onClick={() => navigate('DEBT_DETAIL', { debtId: debt.id, roomId: debt.roomId, noticeId: debt.noticeId })}
                  className="bg-white p-3.5 rounded-2xl border border-rose-200 shadow-xs hover:border-rose-400 transition-colors cursor-pointer space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <strong className="text-slate-900 font-bold text-sm">Phòng {r?.roomNumber || debt.roomId}</strong>
                      <div className="text-[11px] text-slate-500 font-mono">{t?.fullName} • {t?.phone}</div>
                    </div>
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                      Quá hạn {debt.daysOverdue} ngày
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-600 text-[11px]">Hạn nộp gốc: <strong>{debt.originalDueDate}</strong></span>
                    <span className="font-mono font-extrabold text-rose-900 text-sm">{debt.unpaidAmount.toLocaleString()} đ</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>Đã nhắc: {debt.reminderHistory.length} lần</span>
                    <span className="text-blue-600 font-semibold flex items-center">
                      Xem chi tiết &gt;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <BottomTabs />
      </div>
    );
  }

  // 2. DEBT_DETAIL Screen (F.10 - Cross-link 49)
  if (currentScreenId === 'DEBT_DETAIL') {
    if (!currentDebt) {
      return (
        <div className="flex-1 flex flex-col p-4 bg-slate-50">
          <AppHeader title="Chi Tiết Khoản Nợ" onBack={() => navigate('DEBT')} />
          <p className="p-4 text-xs text-slate-500 text-center">Không có khoản nợ nào được chọn.</p>
        </div>
      );
    }

    return (
      <div className="flex-1 flex flex-col justify-between bg-slate-50">
        <AppHeader
          title={`Công Nợ: Phòng ${debtRoom?.roomNumber || currentDebt.roomId}`}
          subtitle={`Quá hạn ${currentDebt.daysOverdue} ngày kể từ hạn nộp`}
          onBack={() => navigate('DEBT')}
        />

        <div className="flex-1 p-3.5 space-y-3 overflow-y-auto text-xs">
          {/* Card summary */}
          <div className="bg-white rounded-2xl p-4 border border-rose-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-rose-700 font-bold uppercase">Khoản nợ chưa thanh toán</span>
                <div className="text-lg font-extrabold font-mono text-rose-900 mt-0.5">
                  {currentDebt.unpaidAmount.toLocaleString()} VNĐ
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400">Hạn nộp gốc:</span>
                <div className="font-mono font-bold text-slate-900">{currentDebt.originalDueDate}</div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">{debtTenant?.fullName}</div>
                <div className="text-[11px] text-slate-500">SĐT: {debtTenant?.phone}</div>
              </div>
              {/* Cross-link 49 to PAY_NOTICE_DETAIL */}
              <button
                onClick={() => navigate('PAY_NOTICE_DETAIL', { noticeId: currentDebt.noticeId })}
                className="px-2.5 py-1 bg-blue-50 text-blue-700 font-semibold rounded-lg text-xs hover:bg-blue-100 flex items-center space-x-1 cursor-pointer"
              >
                <span>Xem thông báo gốc (#49)</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => navigate('DEBT_REMIND', { debtId: currentDebt.id })}
              className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-blue-400 font-semibold text-slate-800 flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 text-blue-600" />
              <span>Ghi nhận lần nhắc</span>
            </button>
            <button
              onClick={() => navigate('DEBT_REPLY', { debtId: currentDebt.id })}
              className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-amber-400 font-semibold text-slate-800 flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
              <span>Ghi nhận phản hồi</span>
            </button>
          </div>

          {/* History of Reminders & Replies */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
            <h4 className="font-bold text-slate-900 text-xs">Lịch Sử Nhắc Nợ & Phản Hồi Ngoài Ứng Dụng:</h4>

            <div className="space-y-2">
              {currentDebt.reminderHistory.map(rem => (
                <div key={rem.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                  <div className="flex justify-between text-[10px]">
                    <span className="font-bold text-blue-700 flex items-center">
                      <Phone className="w-3 h-3 mr-1" /> Nhắc qua {rem.channel}
                    </span>
                    <span className="text-slate-400 font-mono">{rem.date}</span>
                  </div>
                  <p className="text-slate-800 text-[11px]">{rem.content}</p>
                </div>
              ))}

              {currentDebt.tenantReplies.map(rep => (
                <div key={rep.id} className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200 space-y-0.5">
                  <div className="flex justify-between text-[10px]">
                    <span className="font-bold text-amber-800 flex items-center">
                      <MessageSquare className="w-3 h-3 mr-1" /> Khách phản hồi ({rep.channel})
                    </span>
                    <span className="text-slate-400 font-mono">{rep.date}</span>
                  </div>
                  <p className="text-slate-800 text-[11px]">"{rep.replyContent}"</p>
                  {rep.promisedPaymentDate && (
                    <div className="text-[10px] text-amber-900 font-semibold pt-0.5">
                      Hẹn thanh toán: {rep.promisedPaymentDate} ({rep.notes})
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CTA to DEBT_BASIS */}
          <div className="pt-1">
            <button
              onClick={() => navigate('DEBT_BASIS', { debtId: currentDebt.id, contractId: debtContract?.id || 'HD-2026-007' })}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md cursor-pointer"
            >
              <span>Xem Căn Cứ Nợ Kéo Dài</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <BottomTabs />
      </div>
    );
  }

  // 3. DEBT_REMIND Screen (F.10)
  if (currentScreenId === 'DEBT_REMIND') {
    const handleSaveRemind = (e: React.FormEvent) => {
      e.preventDefault();
      recordDebtReminder(currentDebt.id, remindChannel, remindContent);
      navigate('DEBT_DETAIL', { debtId: currentDebt.id });
    };

    return (
      <div className="flex-1 flex flex-col p-4 bg-slate-50 space-y-3">
        <AppHeader
          title="Ghi Nhận Lịch Sử Nhắc Nợ"
          subtitle="Ghi nhận nhật ký liên hệ với khách thuê"
          onBack={() => navigate('DEBT_DETAIL', { debtId: currentDebt.id })}
        />

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3 text-xs">
          <form onSubmit={handleSaveRemind} className="space-y-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Kênh nhắc nợ</label>
              <select
                value={remindChannel}
                onChange={e => setRemindChannel(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
              >
                <option value="DIEN_THOAI">Gọi điện thoại</option>
                <option value="ZALO">Nhắn tin Zalo</option>
                <option value="TRUC_TIEP">Nhắc trực tiếp tại phòng</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Nội dung trao đổi</label>
              <textarea
                value={remindContent}
                onChange={e => setRemindContent(e.target.value)}
                rows={3}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
              Lưu ý: Hệ thống không tự động gửi tin nhắn SMS hay Zalo. Người dùng tự thực hiện trao đổi ngoài ứng dụng và ghi nhận kết quả tại đây.
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={() => navigate('DEBT_DETAIL', { debtId: currentDebt.id })}
                className="flex-1 py-2.5 border border-slate-300 text-slate-700 font-semibold rounded-xl"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs"
              >
                Lưu Bản Ghi Nhắc Nợ
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // 4. DEBT_REPLY Screen (F.10)
  if (currentScreenId === 'DEBT_REPLY') {
    const handleSaveReply = (e: React.FormEvent) => {
      e.preventDefault();
      recordTenantReply(currentDebt.id, replyChannel, replyContent, promisedDate);
      navigate('DEBT_DETAIL', { debtId: currentDebt.id });
    };

    return (
      <div className="flex-1 flex flex-col p-4 bg-slate-50 space-y-3">
        <AppHeader
          title="Phản Hồi & Hẹn Trả"
          subtitle="Ghi nhận lịch hẹn của khách thuê"
          onBack={() => navigate('DEBT_DETAIL', { debtId: currentDebt.id })}
        />

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3 text-xs">
          {/* Mandatory Business Rule D6 */}
          <div className="p-3 bg-amber-50 border border-amber-200 text-amber-950 rounded-xl space-y-1">
            <strong className="block font-bold text-amber-900 flex items-center">
              <ShieldAlert className="w-4 h-4 mr-1 text-amber-600" /> Ràng buộc hạn nợ gốc (Quy tắc D6):
            </strong>
            <p>
              Ngày khách hẹn thanh toán lại <strong>KHÔNG tự động sửa hạn nộp gốc ({currentDebt.originalDueDate})</strong> của khoản nợ. Số ngày quá hạn vẫn được tính theo hạn gốc ban đầu.
            </p>
          </div>

          <form onSubmit={handleSaveReply} className="space-y-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Kênh khách phản hồi</label>
              <select
                value={replyChannel}
                onChange={e => setReplyChannel(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
              >
                <option value="ZALO">Zalo</option>
                <option value="DIEN_THOAI">Điện thoại</option>
                <option value="TRUC_TIEP">Trực tiếp</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Nội dung phản hồi của người thuê</label>
              <textarea
                value={replyContent}
                onChange={e => setReplyContent(e.target.value)}
                rows={2}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Ngày khách hẹn thanh toán</label>
              <input
                type="text"
                value={promisedDate}
                onChange={e => setPromisedDate(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
              />
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={() => navigate('DEBT_DETAIL', { debtId: currentDebt.id })}
                className="flex-1 py-2.5 border border-slate-300 text-slate-700 font-semibold rounded-xl"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs"
              >
                Lưu Phản Hồi Hẹn Trả
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // 5. DEBT_BASIS Screen (F.10 - Cross-link 50)
  if (currentScreenId === 'DEBT_BASIS') {
    return (
      <div className="flex-1 flex flex-col p-4 bg-slate-50 space-y-3">
        <AppHeader
          title={`Căn Cứ Nợ Kéo Dài P.${debtRoom?.roomNumber || currentDebt.roomId}`}
          subtitle="Hồ sơ pháp lý, điều khoản hợp đồng & nhật ký nhắc nợ"
          onBack={() => navigate('DEBT_DETAIL', { debtId: currentDebt.id })}
        />

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <strong className="block font-bold text-slate-900">Quy tắc xem căn cứ (Quy tắc D6):</strong>
            <p className="text-slate-600">
              Không tự phân loại nợ kéo dài theo số ngày cứng nhắc. Chủ nhà tự lựa chọn khoản nợ quá hạn để đối chiếu toàn bộ căn cứ: điều khoản hợp đồng, thông báo đã gửi, lịch sử thanh toán và nhật ký nhắc nợ.
            </p>
          </div>

          <div className="space-y-2">
            <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50">
              <span className="font-bold text-slate-900">1. Điều khoản hợp đồng:</span>
              <p className="text-slate-600 text-[11px] mt-0.5">
                Quy định nộp tiền thuê nhà và tiền dịch vụ trước ngày 05 hàng tháng. Quá 15 ngày có quyền đơn phương chấm dứt hợp đồng.
              </p>
            </div>

            <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50">
              <span className="font-bold text-slate-900">2. Thông báo thanh toán phát hành:</span>
              <p className="text-slate-600 text-[11px] mt-0.5">
                Mã {currentDebt.noticeId}, tổng tiền {currentDebt.unpaidAmount.toLocaleString()} VNĐ, đã gửi qua Zalo ngày 01/10/2026.
              </p>
            </div>

            <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50">
              <span className="font-bold text-slate-900">3. Nhật ký nhắc nhở:</span>
              <p className="text-slate-600 text-[11px] mt-0.5">
                Đã gọi điện ngày 07/10 và gửi Zalo ngày 11/10. Khách hẹn ngày 18/10.
              </p>
            </div>
          </div>

          {/* Cross-link 50 to CONTRACT_DETAIL */}
          <div className="pt-2">
            <button
              onClick={() => navigate('CONTRACT_DETAIL', { contractId: debtContract?.id || 'HD-2026-007' })}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md cursor-pointer"
            >
              <span>Xem Điều Khoản Hợp Đồng Gốc</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
