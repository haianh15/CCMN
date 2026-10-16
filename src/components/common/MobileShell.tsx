import React from 'react';
import { AlertCircle, CheckCircle2, Cloud, LoaderCircle, LogOut, RefreshCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface MobileShellProps {
  children: React.ReactNode;
}

export const MobileShell: React.FC<MobileShellProps> = ({ children }) => {
  const {
    currentScreenId,
    currentUser,
    isAuthenticated,
    isConfigured,
    authLoading,
    dataLoading,
    databaseError,
    saveStatus,
    saveError,
    logout,
    retryLoadData,
    retrySave,
    toastMessage
  } = useApp();
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

      {isAuthenticated && isConfigured && (
        <div className={`flex min-h-8 shrink-0 items-center justify-between gap-2 border-b px-3 py-1 text-xs sm:px-5 lg:px-8 ${
          saveStatus === 'error' || saveStatus === 'conflict'
            ? 'border-rose-200 bg-rose-50 text-rose-800'
            : 'border-slate-200 bg-white text-slate-600'
        }`}>
          <span className="flex min-w-0 items-center gap-1.5">
            {saveStatus === 'saving' || dataLoading
              ? <LoaderCircle className="h-3.5 w-3.5 shrink-0 animate-spin" />
              : saveStatus === 'error' || saveStatus === 'conflict'
                ? <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                : saveStatus === 'saved'
                  ? <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                  : <Cloud className="h-3.5 w-3.5 shrink-0" />}
            <span className="truncate">
              {dataLoading || saveStatus === 'saving'
                ? 'Đang lưu dữ liệu...'
                : saveStatus === 'error' || saveStatus === 'conflict'
                  ? saveError
                  : saveStatus === 'saved'
                    ? 'Dữ liệu đã được lưu'
                    : 'Đang kết nối dữ liệu'}
            </span>
          </span>
          {saveStatus === 'error' && (
            <button type="button" onClick={retrySave} className="shrink-0 font-semibold underline underline-offset-2">
              Thử lại
            </button>
          )}
          {saveStatus === 'conflict' && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Tải dữ liệu mới nhất từ máy chủ? Thay đổi chưa lưu trên thiết bị này sẽ bị bỏ.')) {
                  retryLoadData();
                }
              }}
              className="shrink-0 font-semibold underline underline-offset-2"
            >
              Tải bản mới
            </button>
          )}
        </div>
      )}

      <main className="app-viewport flex min-h-0 w-full flex-1 flex-col overflow-y-auto overflow-x-hidden bg-slate-50/70">
        {!isConfigured ? (
          <section className="mx-auto my-auto w-full max-w-xl p-5">
            <div className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                <div>
                  <h1 className="text-lg font-semibold text-slate-900">Chưa kết nối cơ sở dữ liệu</h1>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Thêm URL dự án và khóa public của Supabase vào biến môi trường để bật đăng nhập và lưu dữ liệu.
                  </p>
                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    Tên biến: VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY. Không dùng khóa service_role ở trình duyệt.
                  </p>
                </div>
              </div>
            </div>
          </section>
        ) : authLoading || dataLoading ? (
          <div role="status" className="flex flex-1 items-center justify-center gap-2 p-6 text-sm text-slate-600">
            <LoaderCircle className="h-4 w-4 animate-spin" />
            {authLoading ? 'Đang kiểm tra đăng nhập...' : 'Đang tải dữ liệu...'}
          </div>
        ) : databaseError && isAuthenticated ? (
          <section className="mx-auto my-auto w-full max-w-xl p-5">
            <div role="alert" className="rounded-2xl border border-rose-200 bg-white p-5 shadow-sm sm:p-7">
              <h1 className="text-lg font-semibold text-slate-900">Không tải được dữ liệu</h1>
              <p className="mt-2 text-sm leading-6 text-slate-600">{databaseError}</p>
              <button
                type="button"
                onClick={retryLoadData}
                className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <RefreshCw className="h-4 w-4" /> Thử tải lại
              </button>
            </div>
          </section>
        ) : (
          <>
            {databaseError && !isAuthenticated && (
              <div role="alert" className="mx-auto mt-3 w-full max-w-xl px-4 text-sm text-rose-700">
                {databaseError}
              </div>
            )}
            {children}
          </>
        )}
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
