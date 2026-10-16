import React, { useState } from 'react';
import { Wifi, BatteryMedium, Signal, Smartphone, Monitor, ShieldCheck, RefreshCw, Laptop } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { QAMatrixModal } from './QAMatrixModal';

interface MobileShellProps {
  children: React.ReactNode;
}

export const MobileShell: React.FC<MobileShellProps> = ({ children }) => {
  const { toastMessage, resetAllData } = useApp();
  const [deviceWidth, setDeviceWidth] = useState<'375' | '390' | '414' | 'FULL' | 'DESKTOP'>(() =>
    window.innerWidth >= 1024 ? 'DESKTOP' : 'FULL'
  );
  const [isQAMatrixOpen, setIsQAMatrixOpen] = useState(false);

  const isDesktop = deviceWidth === 'DESKTOP';
  const isDevicePreview = ['375', '390', '414'].includes(deviceWidth);
  const widthClasses = {
    '375': 'w-[min(375px,100vw)]',
    '390': 'w-[min(390px,100vw)]',
    '414': 'w-[min(414px,100vw)]',
    'FULL': 'w-full max-w-[414px]',
    'DESKTOP': 'w-full'
  }[deviceWidth];

  return (
    <div className={`${isDesktop ? '' : 'mobile-app'} min-h-dvh text-slate-900 flex flex-col items-center justify-start ${isDesktop ? 'bg-slate-50' : 'bg-slate-900'} ${isDevicePreview ? 'p-0 sm:py-6 sm:px-4' : ''}`}>
      {/* Top QA & Device Switcher Toolbar */}
      <div className={`w-full h-10 mb-3 hidden sm:flex items-center justify-between text-xs px-4 ${isDesktop ? 'text-slate-600' : 'max-w-4xl text-slate-300'}`}>
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className={`font-semibold ${isDesktop ? 'text-slate-900' : 'text-white'}`}>Chung cư Mini GreenHouse</span>
          <span className="text-slate-500">|</span>
          <span className={isDesktop ? 'text-slate-500' : 'text-slate-400'}>Hệ Thống Quản Lý Dành Cho Chủ Nhà</span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Viewport selector */}
          <div className={`flex items-center space-x-1 p-1 rounded-lg border ${isDesktop ? 'bg-white border-slate-200' : 'bg-slate-800 border-slate-700'}`}>
            <Smartphone className={`w-3.5 h-3.5 ml-1 ${isDesktop ? 'text-slate-400' : 'text-slate-400'}`} />
            <button
              onClick={() => setDeviceWidth('375')}
              className={`px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer ${deviceWidth === '375' ? 'bg-blue-600 text-white font-bold' : isDesktop ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-white'}`}
              title="iPhone SE (375px)"
            >
              375px
            </button>
            <button
              onClick={() => setDeviceWidth('390')}
              className={`px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer ${deviceWidth === '390' ? 'bg-blue-600 text-white font-bold' : isDesktop ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-white'}`}
              title="iPhone 14/15 (390px)"
            >
              390px
            </button>
            <button
              onClick={() => setDeviceWidth('414')}
              className={`px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer ${deviceWidth === '414' ? 'bg-blue-600 text-white font-bold' : isDesktop ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-white'}`}
              title="iPhone Plus / Android (414px)"
            >
              414px
            </button>
            <button
              onClick={() => setDeviceWidth('FULL')}
              className={`px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer ${deviceWidth === 'FULL' ? 'bg-blue-600 text-white font-bold' : isDesktop ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-white'}`}
              title="Mobile responsive"
            >
              <Monitor className="w-3 h-3" />
            </button>
            <button
              onClick={() => setDeviceWidth('DESKTOP')}
              className={`px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer ${deviceWidth === 'DESKTOP' ? 'bg-blue-600 text-white font-bold' : isDesktop ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-white'}`}
              title="Màn hình máy tính"
              aria-label="Màn hình máy tính"
            >
              <Laptop className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Feature Map / Quick Nav Button */}
          <button
            onClick={() => setIsQAMatrixOpen(true)}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-xs flex items-center space-x-1 shadow-sm transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Sơ đồ nghiệp vụ</span>
          </button>

          {/* Reset Demo */}
          <button
            onClick={resetAllData}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs flex items-center space-x-1 border border-slate-700 transition-colors cursor-pointer"
            title="Đặt lại dữ liệu mẫu"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Main Mobile Device Container */}
      <div
        className={`${widthClasses} bg-white flex flex-col relative transition-all duration-300 overflow-hidden border border-slate-200/40 ${
          isDesktop
            ? 'h-[calc(100dvh-52px)] min-h-0 rounded-none shadow-none'
            : isDevicePreview
              ? 'h-[min(844px,calc(100dvh-100px))] min-h-0 sm:rounded-[36px] sm:shadow-2xl sm:ring-8 sm:ring-slate-800/80'
              : 'h-dvh min-h-0 rounded-none shadow-none'
        }`}
      >
        {/* Simulated iOS/Android Status Bar */}
        {isDevicePreview && (
        <div className="bg-white/95 backdrop-blur px-6 pt-3 pb-2 flex items-center justify-between text-xs font-semibold text-slate-800 select-none shrink-0 z-40 border-b border-slate-100">
          <div className="font-mono text-xs tracking-tight">09:41</div>
          <div className="w-20 h-4 bg-slate-900 rounded-full mx-auto hidden sm:block opacity-10" />
          <div className="flex items-center space-x-1.5 text-slate-700">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <BatteryMedium className="w-4 h-4" />
          </div>
        </div>
        )}

        {/* Screen Content Viewport */}
        <main className={`flex-1 min-h-0 overflow-y-auto flex flex-col bg-slate-50/70 relative ${isDevicePreview ? 'device-preview' : ''}`}>
          {children}
        </main>

        {/* Global Toast Notification */}
        {toastMessage && (
          <div className="absolute top-16 inset-x-3 z-50 animate-in slide-in-from-top-3 fade-in duration-200">
            <div className="bg-slate-900/95 text-white text-xs px-3.5 py-2.5 rounded-xl shadow-xl border border-slate-700/80 flex items-center space-x-2 backdrop-blur">
              <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
              <p className="flex-1 font-medium leading-snug">{toastMessage}</p>
            </div>
          </div>
        )}
      </div>

      {/* QA Matrix Modal */}
      <QAMatrixModal isOpen={isQAMatrixOpen} onClose={() => setIsQAMatrixOpen(false)} />
    </div>
  );
};
