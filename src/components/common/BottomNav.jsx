import React from 'react';

export default function BottomNav({ activeTab, onTabChange }) {
  const navItems = [
    { id: 'home', label: '홈', icon: 'home' },
    { id: 'study', label: '명저학습', icon: 'menu_book' },
    { id: 'diagnosis', label: '청문회', icon: 'gavel' },
    { id: 'verdict', label: '판결문', icon: 'workspace_premium' },
    { id: 'chat', label: 'AI상담', icon: 'psychology' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-2xl border-t border-white/10 px-2 py-2 flex justify-around items-center gpu-layer">
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`min-h-[48px] flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
              isActive ? 'text-indigo-400 font-black scale-105' : 'text-white/60 font-medium'
            }`}
          >
            <span className={`material-symbols-outlined text-[22px] ${isActive ? 'active-nav-icon' : ''}`}>
              {item.icon}
            </span>
            <span className="text-[11px] mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
