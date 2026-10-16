import React from 'react';
import { ArrowLeft, CheckCircle2, RotateCcw, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ALL_86_SCREENS } from '../../data/sitemapRegistry';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  onOpenQAMatrix?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  showBack = true,
  onBack,
  rightAction,
  onOpenQAMatrix
}) => {
  const { currentScreenId, goBack, historyStack } = useApp();
  const isTopTab = ['HOME', 'ROOMS', 'TENANTS', 'PAY', 'MORE', 'START', 'LOGIN'].includes(currentScreenId);
  const canGoBack = showBack && !isTopTab && historyStack.length > 1;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 px-3.5 py-3 flex items-center justify-between shadow-xs">
      <div className="flex items-center space-x-2.5 min-w-0 flex-1">
        {canGoBack && (
          <button
            onClick={onBack || goBack}
            className="p-1.5 -ml-1 text-slate-700 hover:text-slate-900 active:scale-95 rounded-lg hover:bg-slate-100 transition-all cursor-pointer"
            title="Quay lại"
            aria-label="Quay lại"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <div className="min-w-0 flex-1">
          <h1 className="text-base font-bold text-slate-900 truncate leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-slate-500 truncate mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-1.5 ml-2 shrink-0">
        {rightAction}
      </div>
    </header>
  );
};
