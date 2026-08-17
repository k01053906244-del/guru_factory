import React, { useState } from 'react';
import ApiKeyModal from './ApiKeyModal';

export default function TopAppBar({ activeTab, onTabChange, selectedStock }) {
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);

  const navItems = [
    { id: 'home', label: '홈 (명저 선택)', icon: 'home' },
    { id: 'study', label: '명저 학습실', icon: 'menu_book' },
    { id: 'diagnosis', label: '10대 청문회 진단', icon: 'gavel' },
    { id: 'verdict', label: '최종 판결문', icon: 'workspace_premium' },
    { id: 'chat', label: '구루 AI 상담', icon: 'psychology' },
    { id: 'actionplan', label: '실전 액션플랜', icon: 'checklist' },
  ];

  return (
    <>
      <header className="bg-slate-950/70 backdrop-blur-xl sticky top-0 z-50 w-full border-b border-white/10 transition-all gpu-layer">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex justify-between items-center">
          
          {/* 로고 & 타이틀 (구루! 이종목 진단해줘) */}
          <div 
            className="flex items-center gap-3 cursor-pointer select-none group bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 shadow-lg hover:bg-white/20 transition-all active:scale-98"
            onClick={() => onTabChange('home')}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 via-purple-600 to-amber-400 p-0.5 shadow-md group-hover:scale-105 transition-transform flex-shrink-0 flex items-center justify-center">
              <span className="text-[22px]">🏛️</span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black bg-gradient-to-r from-amber-300 via-orange-400 to-amber-200 bg-clip-text text-transparent uppercase tracking-[0.15em] leading-none">
                  GURU FACTORY
                </span>
                <span className="inline-block px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-extrabold rounded-full">
                  KRX·TOSS LIVE
                </span>
              </div>
              <h1 className="text-[17px] md:text-[21px] font-black bg-gradient-to-r from-white via-purple-100 to-amber-200 bg-clip-text text-transparent tracking-tight leading-snug">
                구루! 이종목 진단해줘
              </h1>
            </div>
          </div>

          {/* 데스크톱 탭 네비게이션 */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/10 backdrop-blur-md p-1.5 rounded-full border border-white/20 shadow-md">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`min-h-[42px] px-3.5 rounded-full text-[13px] font-extrabold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105 border border-white/30'
                      : 'text-white/80 hover:text-white hover:bg-white/15'
                  }`}
                >
                  <span className="material-symbols-outlined text-[17px]">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* 우측 BYOK 키 설정 & KRX 팩트체크 상태 뱃지 */}
          <div className="flex items-center gap-2">
            {selectedStock && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-indigo-950/80 border border-indigo-500/40 rounded-xl text-[12px] font-bold text-indigo-200">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>종목: <strong className="text-amber-300">{selectedStock}</strong></span>
              </div>
            )}

            {/* BYOK 키 설정 버튼 */}
            <button
              onClick={() => setIsKeyModalOpen(true)}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-amber-300 transition-all active:scale-95 shadow"
              title="내 API 키 관리 (BYOK 보안)"
            >
              <span className="material-symbols-outlined text-[20px] block">vpn_key</span>
            </button>
          </div>
        </div>
      </header>

      {/* BYOK 설정 모달 */}
      <ApiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
      />
    </>
  );
}
