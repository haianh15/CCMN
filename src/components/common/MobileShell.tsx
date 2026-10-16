import React from 'react';
import { LogOut } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface MobileShellProps {
  children: React.ReactNode;
}

export const MobileShell: React.FC<MobileShellProps> = ({ children }) => {
  const { currentScreenId, currentUser, isAuthenticated, logout, toastMessage } = useApp();
  const canLogout = isAuthenticated && !['LOGIN', 'START', 'FIRSTPASS', 'FORGOT', 'RESET'].includes(currentScreenId);

  return (
    <div className="app-shell relative flex h-dvh min-h-dvh w-full flex-col overflow-hidden bg-slate-50 text-slate-900">
      <header className="app-topbar z-40 shrink-0 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-14 w-full max-w-[1600px] items-center justify-between gap-3 px-3 sm:px-5 lg:px-8">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-emerald-500" />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-900">Chung cư Mini GreenHouse</p>
              <p className="hidden truncate text-[11px] text-slate-500 sm:block">Hệ thống quản lý dành cho chủ nhà</p>
            </div>
          </div>

          {canLogout && (
            <div className="flex shrink-0 items-center gap-2">
              <span className="hidden max-w-56 truncate text-xs font-medium text-slate-600 md:block">
                {currentUser?.fullName}
              </span>
              <button
                onClick={logout}
                className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                title="Đăng xuất"
                aria-label="Đăng xuất"
              >
                <LogOut className="h-4 w-4" />
                <span>Đăng xuất</span>
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="app-viewport flex min-h-0 w-full flex-1 flex-col overflow-y-auto overflow-x-hidden bg-slate-50/70">
        {children}
      </main>

      {toastMessage && (
        <div className="pointer-events-none absolute inset-x-3 top-16 z-50 sm:inset-x-auto sm:right-5 sm:w-96">
          <div className="rounded-xl border border-slate-700/80 bg-slate-900/95 px-3.5 py-2.5 text-xs text-white shadow-xl backdrop-blur">
            <p className="font-medium leading-snug">{toastMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};
