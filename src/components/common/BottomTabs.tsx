import React from 'react';
import { Home, KeyRound, Users, Banknote, Menu } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BottomTabs: React.FC = () => {
  const { activeBottomTab, navigate, overdueDebts, rooms } = useApp();

  const overdueCount = overdueDebts.length;
  const vacantRoomsCount = rooms.filter(r => r.status === 'TRONG').length;

  const tabs = [
    {
      id: 'HOME' as const,
      label: 'Tổng quan',
      icon: Home,
      badge: null
    },
    {
      id: 'ROOMS' as const,
      label: 'Phòng',
      icon: KeyRound,
      badge: vacantRoomsCount > 0 ? `${vacantRoomsCount} trống` : null,
      badgeColor: 'bg-emerald-600'
    },
    {
      id: 'TENANTS' as const,
      label: 'Khách thuê',
      icon: Users,
      badge: null
    },
    {
      id: 'PAY' as const,
      label: 'Thu tiền',
      icon: Banknote,
      badge: overdueCount > 0 ? `${overdueCount} nợ` : null,
      badgeColor: 'bg-rose-600'
    },
    {
      id: 'MORE' as const,
      label: 'Thêm',
      icon: Menu,
      badge: null
    }
  ];

  return (
    <nav className="sticky bottom-0 z-30 bg-white/98 backdrop-blur border-t border-slate-200 px-1 py-1 shadow-lg pb-safe">
      <div className="grid grid-cols-5 gap-1">
        {tabs.map(tab => {
          const isActive = activeBottomTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl transition-all relative cursor-pointer ${
                isActive
                  ? 'text-blue-600 font-bold bg-blue-50/70'
                  : 'text-slate-500 hover:text-slate-900 font-medium hover:bg-slate-50'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.5]' : 'stroke-2'}`} />
                {tab.badge && (
                  <span className={`absolute -top-1 -right-4 px-1 py-0.2 text-[9px] font-bold text-white rounded-full ${tab.badgeColor || 'bg-blue-600'} shadow-xs`}>
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1 tracking-tight truncate max-w-full">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
