import React, { useState } from 'react';
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

const ErrorMessage: React.FC<{ children: string }> = ({ children }) => (
  <div role="alert" className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
    <span>{children}</span>
  </div>
);

export const AuthScreens: React.FC = () => {
  const {
    currentScreenId,
    login,
    forgotPassword,
    resetPassword,
    changePassword,
    currentUser,
    navigate,
    logout
  } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submitLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const result = await login(email, password);
    setBusy(false);
    if (!result.success) setError(result.error || 'Không đăng nhập được. Vui lòng thử lại.');
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

  if (currentScreenId === 'ACCOUNT') {
    return (
      <div className="flex min-h-full w-full items-start justify-center p-4 sm:items-center">
        <AuthCard>
          <button
            type="button"
            onClick={() => navigate('SETTINGS')}
            className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" /> Quay lại
          </button>
          <h2 className="text-lg font-semibold text-slate-900">Tài khoản</h2>
          <p className="mt-1 break-all text-sm text-slate-600">{currentUser?.email}</p>
          <form onSubmit={event => submitPassword(event, changePassword)} className="mt-5 space-y-4">
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <Field
              label="Mật khẩu mới"
              type="password"
              autoComplete="new-password"
              minLength={10}
              required
              value={newPassword}
              onChange={event => setNewPassword(event.target.value)}
              placeholder="Ít nhất 10 ký tự"
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
              {busy ? 'Đang cập nhật...' : 'Đổi mật khẩu'}
            </button>
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
          <p className="mt-1 text-sm leading-6 text-slate-600">Chọn mật khẩu mới có ít nhất 10 ký tự.</p>
          <form onSubmit={event => submitPassword(event, resetPassword)} className="mt-5 space-y-4">
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <Field
              label="Mật khẩu mới"
              type="password"
              autoComplete="new-password"
              minLength={10}
              required
              value={newPassword}
              onChange={event => setNewPassword(event.target.value)}
              placeholder="Ít nhất 10 ký tự"
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
            disabled={busy}
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
