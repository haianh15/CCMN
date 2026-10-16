import React from 'react';
import { SearchX } from 'lucide-react';
import { ScreenId } from '../../types';
import { AppHeader } from './AppHeader';
import { useApp } from '../../context/AppContext';

interface MissingRecordProps {
  title: string;
  message: string;
  backTo: ScreenId;
}

export const MissingRecord: React.FC<MissingRecordProps> = ({ title, message, backTo }) => {
  const { navigate } = useApp();

  return (
    <div className="flex min-h-full flex-1 flex-col bg-slate-50">
      <AppHeader title={title} showBack={false} />
      <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
          <SearchX className="h-6 w-6" />
        </div>
        <h2 className="text-sm font-bold text-slate-900">Không tìm thấy dữ liệu</h2>
        <p className="mt-1 max-w-md text-xs leading-relaxed text-slate-500">{message}</p>
        <button
          onClick={() => navigate(backTo)}
          className="mt-4 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          Quay lại danh sách
        </button>
      </div>
    </div>
  );
};
