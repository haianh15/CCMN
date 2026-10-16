import React, { useState } from 'react';
import { Eye, EyeOff, Lock, User, KeyRound, AlertTriangle, CheckCircle2, ShieldAlert, ArrowRight, ShieldCheck, Mail, LogOut, Clock, Phone } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AppHeader } from '../components/common/AppHeader';

export const AuthScreens: React.FC = () => {
  const {
    currentScreenId,
    login,
    changeFirstPassword,
    forgotPassword,
    resetPassword,
    changePassword,
    logout,
    navigate,
    failedAttempts,
    lockUntil,
    currentUser,
    sessionRemainingMinutes
  } = useApp();

  // LOGIN form state
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('Admin@12345678');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // FIRSTPASS form state
  const [firstPass, setFirstPass] = useState('');
  const [firstPassConfirm, setFirstPassConfirm] = useState('');
  const [firstPassError, setFirstPassError] = useState<string | null>(null);

  // FORGOT form state
  const [forgotEmail, setForgotEmail] = useState('minh.nguyen.landlord@gmail.com');
  const [forgotNotice, setForgotNotice] = useState<string | null>(null);

  // RESET form state
  const [resetPass, setResetPass] = useState('');
  const [resetPassConfirm, setResetPassConfirm] = useState('');
  const [resetError, setResetError] = useState<string | null>(null);

  // ACCOUNT password change state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [accountPassError, setAccountPassError] = useState<string | null>(null);
  const [showAccountPassForm, setShowAccountPassForm] = useState(false);

  // START Screen (F.1)
  if (currentScreenId === 'START') {
    return (
      <div className="flex-1 flex flex-col items-center justify-between p-6 bg-gradient-to-b from-blue-900 via-slate-900 to-slate-950 text-white min-h-[500px]">
        <div className="w-full text-right">
          <span className="text-[10px] font-medium text-blue-200 bg-white/10 px-2 py-0.5 rounded-full">
            GreenHouse Management
          </span>
        </div>

        <div className="flex flex-col items-center text-center my-auto space-y-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-teal-400 p-0.5 shadow-xl flex items-center justify-center">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
              <KeyRound className="w-10 h-10 text-teal-400" />
            </div>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Quản Lý Chung Cư Mini
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-xs">
              Hệ thống quản lý tòa nhà thông minh dành cho Chủ nhà & Quản lý
            </p>
          </div>

          <div className="bg-white/10 rounded-xl p-3 text-left w-full max-w-xs text-xs space-y-1.5 border border-white/10">
            <div className="flex items-center text-emerald-400 font-semibold text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Phiên làm việc: Sẵn sàng
            </div>
            <div className="text-[11px] text-slate-300">
              • Tòa nhà: <strong className="text-white">GreenHouse</strong> (12 căn hộ)
            </div>
            <div className="text-[11px] text-slate-300">
              • Tài khoản: <strong className="text-teal-300">Chủ nhà / Quản lý</strong>
            </div>
          </div>
        </div>

        <div className="w-full space-y-2">
          <button
            onClick={() => navigate('HOME')}
            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.99] font-bold text-sm shadow-lg flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            <span>Vào Bảng Điều Khiển Tổng Quan</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('LOGIN')}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 transition-colors cursor-pointer"
          >
            Đăng Nhập Tài Khoản
          </button>
        </div>
      </div>
    );
  }

  // LOGIN Screen (F.2)
  if (currentScreenId === 'LOGIN') {
    const handleLoginSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setLoginError(null);
      const res = login(username, password);
      if (!res.success && res.error) {
        setLoginError(res.error);
      }
    };

    return (
      <div className="flex-1 flex flex-col justify-between p-5 bg-slate-50 min-h-[500px]">
        <div>
          <div className="text-center pt-4 pb-6">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white mx-auto flex items-center justify-center shadow-md mb-3">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">Đăng Nhập Chủ Nhà</h2>
            <p className="text-xs text-slate-500 mt-1">
              Hệ thống vận hành chung cư mini (Dành riêng vai trò Quản lý)
            </p>
          </div>

          {/* Quick Demo Credentials Pill */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4 text-xs">
            <div className="font-semibold text-blue-900 flex items-center mb-1">
              <ShieldCheck className="w-4 h-4 mr-1 text-blue-600" /> Tài khoản Demo có sẵn:
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700 font-mono mt-1">
              <div
                onClick={() => { setUsername('admin'); setPassword('Admin@12345678'); setLoginError(null); }}
                className="p-1.5 rounded bg-white border border-blue-100 cursor-pointer hover:border-blue-400"
              >
                <strong>admin</strong> (Chủ nhà)
                <div className="text-[10px] text-slate-500">Admin@12345678</div>
              </div>
              <div
                onClick={() => { setUsername('firstuser'); setPassword('123456'); setLoginError(null); }}
                className="p-1.5 rounded bg-white border border-blue-100 cursor-pointer hover:border-blue-400"
              >
                <strong>firstuser</strong> (Lần đầu)
                <div className="text-[10px] text-slate-500">123456 (Đổi MK)</div>
              </div>
            </div>
          </div>

          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>{loginError}</div>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tên đăng nhập</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Nhập tên đăng nhập"
                  required
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">Mật khẩu</label>
                <button
                  type="button"
                  onClick={() => navigate('FORGOT')}
                  className="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                >
                  Quên mật khẩu?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  required
                  className="w-full pl-9 pr-10 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] font-bold text-xs text-white shadow-md transition-all cursor-pointer mt-2"
            >
              Đăng Nhập
            </button>
          </form>

          {failedAttempts > 0 && failedAttempts < 5 && (
            <p className="text-[11px] text-amber-700 text-center mt-3">
              Cảnh báo bảo mật: Đã nhập sai {failedAttempts}/5 lần. Nhập sai 5 lần sẽ tạm khóa 15 phút.
            </p>
          )}
        </div>

        <div className="pt-4 text-center border-t border-slate-200 text-[11px] text-slate-500 space-y-1">
          <div>Ứng dụng không cung cấp đăng ký tài khoản tự do hoặc đăng nhập mạng xã hội.</div>
          <div className="font-semibold text-slate-700">Phiên bản Quản lý v2.4 • Nghiệp vụ SOP TO-BE</div>
        </div>
      </div>
    );
  }

  // FIRSTPASS Screen
  if (currentScreenId === 'FIRSTPASS') {
    const handleFirstPassSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setFirstPassError(null);
      const res = changeFirstPassword(firstPass, firstPassConfirm);
      if (!res.success && res.error) {
        setFirstPassError(res.error);
      }
    };

    return (
      <div className="flex-1 flex flex-col p-5 bg-slate-50">
        <AppHeader title="Đổi Mật Khẩu Lần Đầu" subtitle="Bắt buộc thiết lập mật khẩu an toàn khi đăng nhập lần đầu" showBack={false} />

        <div className="mt-4 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
          <div className="font-bold flex items-center">
            <ShieldAlert className="w-4 h-4 mr-1 text-amber-600" /> Quy định bảo mật:
          </div>
          <p>
            Đây là lần đầu đăng nhập. Bạn cần đổi mật khẩu khởi tạo thành mật khẩu an toàn có ít nhất <strong>12 ký tự</strong> trước khi truy cập dữ liệu quản lý tòa nhà.
          </p>
        </div>

        {firstPassError && (
          <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800">
            {firstPassError}
          </div>
        )}

        <form onSubmit={handleFirstPassSubmit} className="mt-4 space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Mật khẩu mới (tối thiểu 12 ký tự)</label>
            <input
              type="password"
              value={firstPass}
              onChange={e => setFirstPass(e.target.value)}
              placeholder="Nhập ít nhất 12 ký tự..."
              required
              className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
            <div className="text-[11px] text-slate-500 mt-1">Độ dài hiện tại: {firstPass.length} ký tự</div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Xác nhận mật khẩu mới</label>
            <input
              type="password"
              value={firstPassConfirm}
              onChange={e => setFirstPassConfirm(e.target.value)}
              placeholder="Nhập lại mật khẩu mới..."
              required
              className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md mt-2 cursor-pointer"
          >
            Xác Nhận Đổi Mật Khẩu & Bắt Đầu
          </button>
        </form>
      </div>
    );
  }

  // FORGOT Screen
  if (currentScreenId === 'FORGOT') {
    const handleForgotSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const res = forgotPassword(forgotEmail);
      setForgotNotice(res.message);
    };

    return (
      <div className="flex-1 flex flex-col p-5 bg-slate-50">
        <AppHeader title="Quên Mật Khẩu" subtitle="Khôi phục quyền truy cập tài khoản qua email" onBack={() => navigate('LOGIN')} />

        <div className="mt-4 space-y-4">
          <p className="text-xs text-slate-600">
            Nhập email đã đăng ký của Quản lý tòa nhà để nhận liên kết đặt lại mật khẩu an toàn.
          </p>

          {forgotNotice && (
            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-2">
              <div className="font-semibold flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-1 text-blue-600" /> {forgotNotice}
              </div>
              <button
                type="button"
                onClick={() => navigate('RESET')}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs cursor-pointer"
              >
                Đặt Lại Mật Khẩu Ngay
              </button>
            </div>
          )}

          <form onSubmit={handleForgotSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email quản lý</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                  placeholder="nhap.email@domain.com"
                  required
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md cursor-pointer"
            >
              Gửi Liên Kết Khôi Phục
            </button>
          </form>
        </div>
      </div>
    );
  }

  // RESET Screen
  if (currentScreenId === 'RESET') {
    const handleResetSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setResetError(null);
      if (resetPass !== resetPassConfirm) {
        setResetError('Mật khẩu xác nhận không khớp.');
        return;
      }
      const res = resetPassword(resetPass);
      if (!res.success && res.error) {
        setResetError(res.error);
      }
    };

    return (
      <div className="flex-1 flex flex-col p-5 bg-slate-50">
        <AppHeader title="Đặt Lại Mật Khẩu" subtitle="Thiết lập mật khẩu quản trị mới" onBack={() => navigate('LOGIN')} />

        <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 mb-3">
          Liên kết xác minh hợp lệ. Vui lòng thiết lập mật khẩu mới (tối thiểu 12 ký tự). Sau khi cập nhật, mọi phiên đăng nhập cũ sẽ bị thu hồi.
        </div>

        {resetError && (
          <div className="mb-3 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800">
            {resetError}
          </div>
        )}

        <form onSubmit={handleResetSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Mật khẩu mới</label>
            <input
              type="password"
              value={resetPass}
              onChange={e => setResetPass(e.target.value)}
              placeholder="Tối thiểu 12 ký tự..."
              required
              className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Xác nhận mật khẩu mới</label>
            <input
              type="password"
              value={resetPassConfirm}
              onChange={e => setResetPassConfirm(e.target.value)}
              placeholder="Nhập lại mật khẩu..."
              required
              className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md cursor-pointer"
          >
            Lưu Mật Khẩu Mới & Đăng Nhập
          </button>
        </form>
      </div>
    );
  }

  // ACCOUNT Screen (F.13) & LOGOUT (F.14)
  if (currentScreenId === 'ACCOUNT') {
    const handleAccountPassSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setAccountPassError(null);
      if (newPassword !== confirmNewPassword) {
        setAccountPassError('Mật khẩu xác nhận không khớp.');
        return;
      }
      const res = changePassword(oldPassword, newPassword);
      if (!res.success && res.error) {
        setAccountPassError(res.error);
      }
    };

    return (
      <div className="flex-1 flex flex-col p-4 bg-slate-50 space-y-4">
        <AppHeader title="Tài Khoản & Bảo Mật" subtitle="Thông tin Quản lý & Phiên làm việc" onBack={() => navigate('SETTINGS')} />

        {/* Profile Card */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
            <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
              {currentUser?.fullName.charAt(0) || 'C'}
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">{currentUser?.fullName || 'Chủ nhà'}</div>
              <div className="text-xs text-blue-600 font-semibold">Vai trò: Chủ nhà / Quản lý tòa nhà</div>
              <div className="text-[11px] text-slate-500 font-mono">Tên đăng nhập: {currentUser?.username || 'admin'}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="text-slate-500 text-[11px] flex items-center">
                <Phone className="w-3 h-3 mr-1" /> Điện thoại liên hệ
              </div>
              <div className="font-semibold text-slate-800 mt-0.5">{currentUser?.phone}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="text-slate-500 text-[11px] flex items-center">
                <Mail className="w-3 h-3 mr-1" /> Email khôi phục
              </div>
              <div className="font-semibold text-slate-800 mt-0.5 truncate">{currentUser?.email}</div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
            <span className="flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Phiên hết hạn tự động:
            </span>
            <span className="font-bold">Sau {sessionRemainingMinutes} phút không hoạt động</span>
          </div>
        </div>

        {/* Password change section */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900">Đổi Mật Khẩu Định Kỳ</h3>
              <p className="text-[11px] text-slate-500">Mật khẩu mới yêu cầu tối thiểu 12 ký tự</p>
            </div>
            <button
              onClick={() => setShowAccountPassForm(!showAccountPassForm)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              {showAccountPassForm ? 'Ẩn form' : 'Thay đổi'}
            </button>
          </div>

          {showAccountPassForm && (
            <form onSubmit={handleAccountPassSubmit} className="mt-3 pt-3 border-t border-slate-100 space-y-2.5">
              {accountPassError && (
                <div className="p-2.5 rounded-lg bg-red-50 text-red-800 text-xs border border-red-200">
                  {accountPassError}
                </div>
              )}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Mật khẩu hiện tại</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={e => setOldPassword(e.target.value)}
                  placeholder="Admin@12345678"
                  required
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Mật khẩu mới (&gt;= 12 ký tự)</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Nhập ít nhất 12 ký tự..."
                  required
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Xác nhận mật khẩu mới</label>
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={e => setConfirmNewPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới..."
                  required
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs cursor-pointer shadow-xs"
              >
                Xác Nhận & Thu Hồi Phiên Cũ
              </button>
            </form>
          )}
        </div>

        {/* LOGOUT Button (F.14 Action) */}
        <div className="pt-2">
          <button
            onClick={() => {
              if (window.confirm('Bạn có chắc chắn muốn đăng xuất và thu hồi phiên làm việc?')) {
                logout();
              }
            }}
            className="w-full py-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-red-600" />
            <span>Đăng Xuất Khỏi Hệ Thống (LOGOUT)</span>
          </button>
        </div>
      </div>
    );
  }

  return null;
};
