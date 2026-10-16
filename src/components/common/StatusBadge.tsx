import React from 'react';
import { RoomStatus, ContractStatus, PaymentTrackingStatus } from '../../types';

interface StatusBadgeProps {
  status: RoomStatus | ContractStatus | PaymentTrackingStatus | string;
  type?: 'room' | 'contract' | 'payment' | 'general';
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'general', size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-semibold';

  // Room status
  if (status === 'TRONG') {
    return (
      <span className={`inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20 dark:bg-emerald-950/40 dark:text-emerald-400 ${sizeClasses}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
        Trống
      </span>
    );
  }
  if (status === 'DANG_THUE') {
    return (
      <span className={`inline-flex items-center rounded-full bg-blue-50 text-blue-700 ring-1 ring-blue-700/20 dark:bg-blue-950/40 dark:text-blue-400 ${sizeClasses}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5" />
        Đang thuê
      </span>
    );
  }
  if (status === 'SAP_TRA') {
    return (
      <span className={`inline-flex items-center rounded-full bg-amber-50 text-amber-800 ring-1 ring-amber-600/20 dark:bg-amber-950/40 dark:text-amber-400 ${sizeClasses}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5" />
        Sắp trả phòng
      </span>
    );
  }
  if (status === 'CHUA_BAN_GIAO_XONG') {
    return (
      <span className={`inline-flex items-center rounded-full bg-rose-50 text-rose-700 ring-1 ring-rose-600/20 dark:bg-rose-950/40 dark:text-rose-400 ${sizeClasses}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5" />
        Chưa bàn giao xong
      </span>
    );
  }

  // Contract status
  if (status === 'NHAP') {
    return (
      <span className={`inline-flex items-center rounded-full bg-slate-100 text-slate-700 ring-1 ring-slate-600/20 ${sizeClasses}`}>
        Bản nháp
      </span>
    );
  }
  if (status === 'DA_KY') {
    return (
      <span className={`inline-flex items-center rounded-full bg-indigo-50 text-indigo-700 ring-1 ring-indigo-700/20 ${sizeClasses}`}>
        Đã ký giấy
      </span>
    );
  }
  if (status === 'CHO_HIEU_LUC') {
    return (
      <span className={`inline-flex items-center rounded-full bg-amber-50 text-amber-700 ring-1 ring-amber-700/20 ${sizeClasses}`}>
        Chờ hiệu lực
      </span>
    );
  }
  if (status === 'HIEU_LUC') {
    return (
      <span className={`inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20 ${sizeClasses}`}>
        Đang hiệu lực
      </span>
    );
  }
  if (status === 'KET_THUC') {
    return (
      <span className={`inline-flex items-center rounded-full bg-slate-100 text-slate-500 ring-1 ring-slate-400/20 ${sizeClasses}`}>
        Đã kết thúc
      </span>
    );
  }

  // Payment status
  if (status === 'CHUA_THU') {
    return (
      <span className={`inline-flex items-center rounded-full bg-amber-50 text-amber-800 ring-1 ring-amber-600/20 ${sizeClasses}`}>
        Chưa thu tiền
      </span>
    );
  }
  if (status === 'DA_THU') {
    return (
      <span className={`inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20 ${sizeClasses}`}>
        Đã thu đủ 100%
      </span>
    );
  }
  if (status === 'QUA_HAN') {
    return (
      <span className={`inline-flex items-center rounded-full bg-red-50 text-red-700 ring-1 ring-red-600/20 ${sizeClasses}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-red-600 mr-1.5 animate-ping" />
        Quá hạn
      </span>
    );
  }

  // Fallback
  return (
    <span className={`inline-flex items-center rounded-full bg-slate-100 text-slate-700 ${sizeClasses}`}>
      {status}
    </span>
  );
};
