import React, { useEffect, useState } from 'react';
import { AlertCircle, ArrowLeft, Eye, EyeOff, KeyRound, Lock, Mail } from 'lucide-react';
import { useApp } from '../context/AppContext';

const AuthCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <section className="mx-auto my-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
    <div className="mb-6 text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
        <KeyRound className="h-6 w-6" />
      </div>
      <h1 className="text-xl font-bold text-slate-900">GreenHouse</h1>
      <p className="mt-1 text-sm text-slate-600">Quản lý nhà cho thuê</p>
    </div>
    {children}
  </section>
);

const Field: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({
  label,
  className = '',
  ...props
}) => (
  <label className="block space-y-1.5">
    <span className="text-sm font-medium text-slate-700">{label}</span>
    <input
      {...props}
      className={`min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${className}`}
    />
  </label>
);

const ErrorMessage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div role="alert" className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
    <span>{children}</span>
  </div>
);

export const AuthScreens: React.FC = () => {
  const {
    currentScreenId,
    login,
    changeFirstPassword,
    isFirstPasswordChangeRequired,
    isAuthenticated,
    authLoading,
    lockUntil,
    passwordChangeLockUntil,
    forgotPassword,
    resetPassword,
    changePassword,
    currentUser,
    navigate,
    goBack,
    logout,
    showToast
  } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [firstPasswordError, setFirstPasswordError] = useState<string | null>(null);
  const [lockSeconds, setLockSeconds] = useState(0);
  const [passwordChangeLockSeconds, setPasswordChangeLockSeconds] = useState(0);
  const [accountPasswordSuccess, setAccountPasswordSuccess] = useState<string | null>(null);
  const accountRequestId = React.useRef<string | null>(null);

  useEffect(() => {
    if (!lockUntil || lockUntil <= Date.now()) {
      setLockSeconds(0);
      return;
    }
    const updateLock = () => setLockSeconds(Math.max(0, Math.ceil((lockUntil - Date.now()) / 1000)));
    updateLock();
    const timer = window.setInterval(updateLock, 1000);
    return () => window.clearInterval(timer);
  }, [lockUntil]);

  useEffect(() => {
    if (!passwordChangeLockUntil || passwordChangeLockUntil <= Date.now()) {
      setPasswordChangeLockSeconds(0);
      return;
    }
    const updateLock = () => setPasswordChangeLockSeconds(Math.max(0, Math.ceil((passwordChangeLockUntil - Date.now()) / 1000)));
    updateLock();
    const timer = window.setInterval(updateLock, 1000);
    return () => window.clearInterval(timer);
  }, [passwordChangeLockUntil]);

  useEffect(() => {
    if (currentScreenId === 'ACCOUNT' && !authLoading && !isAuthenticated) {
      navigate('LOGIN', {}, true);
      showToast('Phiên làm việc đã kết thúc. Vui lòng đăng nhập lại.');
    }
  }, [currentScreenId, authLoading, isAuthenticated]);

  const submitLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const result = await login(email, password);
    setBusy(false);
    if (!result.success) setError(result.error || 'Không đăng nhập được. Vui lòng thử lại.');
  };

  const submitAccountPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setAccountPasswordSuccess(null);
    if (!currentPassword) {
      setError('Mật khẩu hiện tại là trường bắt buộc.');
      return;
    }
    if (!newPassword) {
      setError('Mật khẩu mới là trường bắt buộc.');
      return;
    }
    if (!confirmPassword) {
      setError('Xác nhận mật khẩu mới là trường bắt buộc.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Xác nhận mật khẩu không khớp.');
      return;
    }
    if (newPassword.length < 12) {
      setError('Mật khẩu mới cần có ít nhất 12 ký tự.');
      return;
    }
    if (!accountRequestId.current) accountRequestId.current = crypto.randomUUID();
    setBusy(true);
    const result = await changePassword(currentPassword, newPassword, confirmPassword, accountRequestId.current);
    setBusy(false);
    if (!result.success) {
      setError(result.error || 'Không thể đổi mật khẩu lúc này. Vui lòng thử lại sau.');
      if (result.errorCode === 'UNKNOWN_RESULT') {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        await logout();
        navigate('LOGIN', {}, true);
        showToast('Chưa xác định được kết quả đổi mật khẩu. Vui lòng đăng nhập lại hoặc khôi phục tài khoản.');
      } else {
        accountRequestId.current = null;
      }
      return;
    }
    accountRequestId.current = null;
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setAccountPasswordSuccess('Đổi mật khẩu thành công!');
  };

  const submitForgotPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    const result = await forgotPassword(email);
    setBusy(false);
    if (result.success) setNotice(result.message);
    else setError(result.message);
  };

  const submitPassword = async (event: React.FormEvent, update: (value: string) => Promise<{ success: boolean; error?: string }>) => {
    event.preventDefault();
    setError(null);
    if (newPassword !== confirmPassword) {
      setError('Hai mật khẩu chưa khớp.');
      return;
    }
    setBusy(true);
    const result = await update(newPassword);
    setBusy(false);
    if (!result.success) setError(result.error || 'Không đổi được mật khẩu. Vui lòng thử lại.');
  };

  const submitFirstPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setFirstPasswordError(null);
    setBusy(true);
    const result = await changeFirstPassword(newPassword, confirmPassword);
    setBusy(false);
    if (!result.success) setFirstPasswordError(result.error || 'Không đổi được mật khẩu. Vui lòng thử lại.');
  };

  if (isFirstPasswordChangeRequired || currentScreenId === 'FIRSTPASS') {
    return (
      <div className="flex min-h-full w-full items-start justify-center p-4 sm:items-center">
        <AuthCard>
          <h2 className="text-lg font-semibold text-slate-900">Đổi mật khẩu lần đầu</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">Để bảo vệ tài khoản, hãy đặt mật khẩu mới có ít nhất 12 ký tự.</p>
          <form onSubmit={submitFirstPassword} className="mt-5 space-y-4">
            {firstPasswordError && <ErrorMessage>{firstPasswordError}</ErrorMessage>}
            <Field
              label="Mật khẩu mới"
              type="password"
              autoComplete="new-password"
              required
              value={newPassword}
              onChange={event => setNewPassword(event.target.value)}
              placeholder="Ít nhất 12 ký tự"
            />
            <Field
              label="Nhập lại mật khẩu"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={event => setConfirmPassword(event.target.value)}
              placeholder="Nhập lại mật khẩu mới"
            />
            <button
              type="submit"
              disabled={busy}
              className="min-h-11 w-full rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60"
            >
              {busy ? 'Đang cập nhật...' : 'Lưu mật khẩu mới'}
            </button>
          </form>
        </AuthCard>
      </div>
    );
  }

  if (currentScreenId === 'ACCOUNT') {
    if (authLoading || !isAuthenticated || isFirstPasswordChangeRequired || !currentUser) return null;
    const accountLocked = passwordChangeLockSeconds > 0;
    return (
      <div className="flex min-h-full w-full items-start justify-center p-4 sm:items-center">
        <AuthCard>
          <button
            type="button"
            onClick={() => {
              setCurrentPassword('');
              setNewPassword('');
              setConfirmPassword('');
              goBack();
            }}
            className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" /> Quay lại
          </button>
          <h2 className="text-lg font-semibold text-slate-900">Xem tài khoản và đổi mật khẩu</h2>
          <p className="mt-3 text-sm font-medium text-slate-700">Tên đăng nhập</p>
          <p className="mt-1 break-all rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700">{currentUser.username}</p>
          <form onSubmit={submitAccountPassword} className="mt-5 space-y-4">
            {error && <ErrorMessage>{error}</ErrorMessage>}
            {accountPasswordSuccess && <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{accountPasswordSuccess}</p>}
            {accountLocked && <ErrorMessage>Tạm thời chưa thể đổi mật khẩu. Vui lòng thử lại sau {Math.ceil(passwordChangeLockSeconds / 60)} phút.</ErrorMessage>}
            <Field
              label="Mật khẩu hiện tại"
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={event => setCurrentPassword(event.target.value)}
              placeholder="Nhập mật khẩu hiện tại"
            />
            <Field
              label="Mật khẩu mới"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={event => setNewPassword(event.target.value)}
              placeholder="Ít nhất 12 ký tự"
            />
            <Field
              label="Nhập lại mật khẩu"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={event => setConfirmPassword(event.target.value)}
              placeholder="Nhập lại mật khẩu mới"
            />
            <button
              type="submit"
              disabled={busy || accountLocked}
              className="min-h-11 w-full rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60"
            >
              {busy ? 'Đang cập nhật...' : 'Đổi mật khẩu'}
            </button>
            <p className="text-xs leading-5 text-slate-500">Mật khẩu mới phải có ít nhất 12 ký tự, khác mật khẩu hiện tại; xác nhận phải khớp.</p>
          </form>
          <button
            type="button"
            onClick={() => void logout()}
            className="mt-4 min-h-11 w-full rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Đăng xuất
          </button>
        </AuthCard>
      </div>
    );
  }

  if (currentScreenId === 'FORGOT') {
    return (
      <div className="flex min-h-full w-full items-start justify-center p-4 sm:items-center">
        <AuthCard>
          <button
            type="button"
            onClick={() => navigate('LOGIN')}
            className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" /> Quay lại đăng nhập
          </button>
          <h2 className="text-lg font-semibold text-slate-900">Quên mật khẩu?</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">Nhập email tài khoản. Chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu.</p>
          <form onSubmit={submitForgotPassword} className="mt-5 space-y-4">
            {error && <ErrorMessage>{error}</ErrorMessage>}
            {notice && <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{notice}</p>}
            <Field
              label="Email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={event => setEmail(event.target.value)}
              placeholder="ten@email.com"
            />
            <button
              type="submit"
              disabled={busy}
              className="min-h-11 w-full rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60"
            >
              {busy ? 'Đang gửi...' : 'Gửi hướng dẫn'}
            </button>
          </form>
        </AuthCard>
      </div>
    );
  }

  if (currentScreenId === 'RESET') {
    return (
      <div className="flex min-h-full w-full items-start justify-center p-4 sm:items-center">
        <AuthCard>
          <h2 className="text-lg font-semibold text-slate-900">Đặt mật khẩu mới</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">Chọn mật khẩu mới có ít nhất 12 ký tự.</p>
          <form onSubmit={event => submitPassword(event, resetPassword)} className="mt-5 space-y-4">
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <Field
              label="Mật khẩu mới"
              type="password"
              autoComplete="new-password"
              minLength={12}
              required
              value={newPassword}
              onChange={event => setNewPassword(event.target.value)}
              placeholder="Ít nhất 12 ký tự"
            />
            <Field
              label="Nhập lại mật khẩu"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={event => setConfirmPassword(event.target.value)}
              placeholder="Nhập lại mật khẩu mới"
            />
            <button
              type="submit"
              disabled={busy}
              className="min-h-11 w-full rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60"
            >
              {busy ? 'Đang cập nhật...' : 'Lưu mật khẩu mới'}
            </button>
          </form>
        </AuthCard>
      </div>
    );
  }

  return (
    <div className="flex min-h-full w-full items-start justify-center p-4 sm:items-center">
      <AuthCard>
        <h2 className="text-lg font-semibold text-slate-900">Đăng nhập</h2>
        <p className="mt-1 text-sm text-slate-600">Dùng email và mật khẩu tài khoản quản lý.</p>
        <form onSubmit={submitLogin} className="mt-5 space-y-4">
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {lockSeconds > 0 && (
            <ErrorMessage>Đăng nhập tạm khóa. Hãy thử lại sau {Math.ceil(lockSeconds / 60)} phút.</ErrorMessage>
          )}
          <Field
            label="Email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={event => setEmail(event.target.value)}
            placeholder="ten@email.com"
          />
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-slate-700">Mật khẩu</span>
            <span className="relative block">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={event => setPassword(event.target.value)}
                placeholder="Nhập mật khẩu"
                className="min-h-11 w-full rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
              <button
                type="button"
                onClick={() => setShowPassword(value => !value)}
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </span>
          </label>
          <button
            type="submit"
            disabled={busy || lockSeconds > 0}
            className="min-h-11 w-full rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60"
          >
            {busy ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
        <button
          type="button"
          onClick={() => { setError(null); setNotice(null); navigate('FORGOT'); }}
          className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-900"
        >
          <Mail className="h-4 w-4" /> Quên mật khẩu?
        </button>
      </AuthCard>
    </div>
  );
};
