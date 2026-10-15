import React from 'react';
import {
  Calendar,
  History,
  LayoutDashboard,
  ListVideo,
  Settings,
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';

export type TabType = 'dashboard' | 'playlist' | 'schedule' | 'history' | 'settings';

interface BottomNavProps {
  lang: Language;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  lang,
  activeTab,
  onTabChange,
}) => {
  const t = translations[lang];

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    {
      id: 'dashboard',
      label: lang === 'en' ? 'Live' : 'लाइव',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: 'playlist',
      label: lang === 'en' ? 'Loop' : 'लूप',
      icon: <ListVideo className="w-5 h-5" />,
    },
    {
      id: 'schedule',
      label: t.schedule,
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      id: 'history',
      label: t.history,
      icon: <History className="w-5 h-5" />,
    },
    {
      id: 'settings',
      label: t.settings,
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800/90 sm:hidden">
      <div className="grid grid-cols-5 items-center h-16 max-w-lg mx-auto px-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`min-h-[48px] flex flex-col items-center justify-center transition-colors ${
                isActive
                  ? 'text-red-500 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <div className="relative">
                {tab.icon}
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-red-500" />
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-1 truncate max-w-[56px]">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
