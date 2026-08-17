import React, { useState } from 'react';
import { motion } from 'framer-motion';
import TopAppBar from './components/common/TopAppBar';
import BottomNav from './components/common/BottomNav';
import HeroBanner from './components/home/HeroBanner';
import EssentialsGrid from './components/home/EssentialsGrid';
import InteractiveVideoBg from './components/home/InteractiveVideoBg';
import BookStudyView from './components/study/BookStudyView';
import StockDiagnosisView from './components/diagnosis/StockDiagnosisView';
import VerdictReportView from './components/diagnosis/VerdictReportView';
import MasterChatView from './components/chat/MasterChatView';
import ActionPlanView from './components/actionplan/ActionPlanView';

import { GURUS_REGISTRY } from './data/gurus';
import { evaluateStock } from './utils/evaluator';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedGuru, setSelectedGuru] = useState(GURUS_REGISTRY[0]); // 피터 린치 (1호 명저)
  const [currentStock, setCurrentStock] = useState('삼성전자');
  const [guruSearchQuery, setGuruSearchQuery] = useState('');
  const [guruCategoryFilter, setGuruCategoryFilter] = useState('ALL');
  
  // 기본 초기 진단 결과 (삼성전자 85점 우량 방어주)
  const [evaluationResult, setEvaluationResult] = useState(() => {
    try {
      return evaluateStock({
        ruleData: GURUS_REGISTRY[0].ruleData,
        stockName: '삼성전자',
        category: '대형우량주',
        financialData: {
          peg_ratio: 0.9,
          institutional_ownership: 54.2,
          debt_to_equity: 24.5,
          per: 13.8,
          pbr: 1.25,
          roe: 12.4
        },
        qualitativeAnswers: {
          Q01: true,
          Q02: true,
          Q03: false,
          Q04: true,
          Q07: true,
          Q09: true,
          Q10: true
        }
      });
    } catch (e) {
      return null;
    }
  });

  const handleQuickStockSelect = (stockName) => {
    setCurrentStock(stockName);
  };

  const handleDiagnoseWithGuru = (guru) => {
    if (!guru.isLoaded) return;
    setSelectedGuru(guru);
    setActiveTab('diagnosis');
  };

  const handleStudyGuru = (guru) => {
    if (!guru.isLoaded) return;
    setSelectedGuru(guru);
    setActiveTab('study');
  };

  // 명저 검색 및 필터링
  const filteredGurus = GURUS_REGISTRY.filter((guru) => {
    const matchesSearch =
      guru.nameKo.includes(guruSearchQuery) ||
      guru.bookTitle.includes(guruSearchQuery) ||
      guru.nameEn.toLowerCase().includes(guruSearchQuery.toLowerCase());

    if (guruCategoryFilter === 'FREE') return matchesSearch && guru.tier === 'FREE';
    if (guruCategoryFilter === 'VIP') return matchesSearch && guru.tier === 'PAID_VIP';
    return matchesSearch;
  });

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-5 animate-fadeIn">
            {/* 1. 니치한 Hero Section (종목 입력 & 빠른 선택) */}
            <HeroBanner
              currentStock={currentStock}
              onStockChange={setCurrentStock}
              onQuickStockSelect={handleQuickStockSelect}
              onNavigate={setActiveTab}
            />
            
            {/* 2. 4단계 로드맵 가이드 (원클릭 실제 서비스 진입) */}
            <EssentialsGrid onNavigate={setActiveTab} />

            {/* 3. 명저 라이브러리 (id="guru-library-section" 연동) */}
            <section id="guru-library-section" className="space-y-3 pt-1 scroll-mt-20">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 px-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black text-amber-300 uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded">
                    LIBRARY (1호 탑재 완료 / 2~4호 공란 대기)
                  </span>
                  <h3 className="text-[18px] md:text-[20px] font-black text-white tracking-tight flex items-center gap-2">
                    <span>명저 선택</span>
                    <span className="text-[11px] font-bold text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                      🎧 명저 오디오 서비스 구동 중
                    </span>
                  </h3>
                </div>

                {/* 검색 및 필터 툴바 */}
                <div className="flex items-center gap-1.5">
                  <div className="relative">
                    <input
                      type="text"
                      value={guruSearchQuery}
                      onChange={(e) => setGuruSearchQuery(e.target.value)}
                      placeholder="명저 검색..."
                      className="py-1 px-2.5 pl-7 bg-slate-950/80 text-white font-bold text-[11px] rounded-lg border border-white/20 focus:outline-none focus:border-amber-400 placeholder:text-white/40 w-28 sm:w-36"
                    />
                    <span className="material-symbols-outlined absolute left-1.5 top-1/2 -translate-y-1/2 text-[14px] text-white/50">
                      search
                    </span>
                  </div>

                  <div className="flex bg-slate-950/80 p-0.5 rounded-lg border border-white/15">
                    {['ALL', 'FREE', 'VIP'].map((f) => (
                      <button
                        key={f}
                        onClick={() => setGuruCategoryFilter(f)}
                        className={`px-2 py-0.5 text-[10px] font-black rounded transition-all ${
                          guruCategoryFilter === f
                            ? 'bg-indigo-600 text-white'
                            : 'text-white/60 hover:text-white'
                        }`}
                      >
                        {f === 'ALL' ? '전체' : f === 'FREE' ? '무료' : 'VIP'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 명저 템플릿 그리드 (탑재 카드 + 공란 슬롯) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                {filteredGurus.map((guru) => {
                  const isFree = guru.tier === 'FREE';
                  const isSelected = selectedGuru?.id === guru.id;

                  // 1) 공식 탑재 완료된 명저 (피터 린치 - 표준 3종 버튼 완비)
                  if (guru.isLoaded) {
                    return (
                      <motion.div
                        key={guru.id}
                        whileHover={{ y: -2 }}
                        className="p-4 md:p-5 rounded-[2rem] border-2 border-indigo-500/60 bg-slate-900/95 transition-all flex flex-col justify-between gap-3.5 shadow-2xl relative overflow-hidden"
                      >
                        {/* 상단 프로필 & 정보 */}
                        <div className="flex items-start gap-3.5 min-w-0">
                          <img
                            src={guru.avatar}
                            alt={guru.nameKo}
                            className="w-14 h-14 rounded-2xl border-2 border-amber-400 object-cover shadow-lg flex-shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="text-[15px] font-black text-white">
                                {guru.nameKo}
                              </span>
                              <span className="px-2 py-0.2 text-[10px] font-black rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                🟢 1호 공식 탑재
                              </span>
                              <span className="px-1.5 py-0.2 text-[10px] font-black rounded border bg-indigo-600/30 text-indigo-300 border-indigo-500/40">
                                무료
                              </span>
                            </div>
                            <h4 className="text-[14px] font-extrabold text-amber-300 truncate">
                              《{guru.bookTitle}》
                            </h4>
                            <p className="text-[12px] text-white/70 truncate mt-0.5">
                              {guru.tagline}
                            </p>
                          </div>
                        </div>

                        {/* 표준 3종 액션 버튼 템플릿 ([진단], [명저 학습], [명저 오디오로 만나기]) */}
                        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10">
                          {/* 버튼 1. 진단 */}
                          <button
                            onClick={() => handleDiagnoseWithGuru(guru)}
                            className="py-2 px-2 rounded-xl font-black text-[12px] flex items-center justify-center gap-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow transition-all active:scale-95 border border-white/20"
                            title={`《${currentStock}》 청문회 진단`}
                          >
                            <span className="material-symbols-outlined text-[15px]">gavel</span>
                            <span>진단</span>
                          </button>

                          {/* 버튼 2. 명저 학습 */}
                          <button
                            onClick={() => handleStudyGuru(guru)}
                            className="py-2 px-2 rounded-xl font-extrabold text-[12px] flex items-center justify-center gap-1 bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all active:scale-95"
                            title="고화질 PPT 슬라이드 학습"
                          >
                            <span className="material-symbols-outlined text-[15px]">menu_book</span>
                            <span>명저 학습</span>
                          </button>

                          {/* 버튼 3. 명저 오디오로 만나기 */}
                          <button
                            onClick={() => handleStudyGuru(guru)}
                            className="py-2 px-2 rounded-xl font-black text-[11px] flex items-center justify-center gap-1 bg-amber-500/25 hover:bg-amber-500/40 text-amber-300 border border-amber-400/60 shadow transition-all active:scale-95 animate-pulse"
                            title="피터 린치 명저 오디오 바이블 듣기"
                          >
                            <span>🎧</span>
                            <span className="truncate">오디오로 만나기</span>
                          </button>
                        </div>
                      </motion.div>
                    );
                  }

                  // 2) 아직 미탑재된 공란 슬롯 (2호~4호 공란 템플릿)
                  return (
                    <div
                      key={guru.id}
                      className="p-4 md:p-5 rounded-[2rem] border-2 border-dashed border-white/20 bg-slate-950/40 transition-all flex flex-col justify-between gap-3.5 shadow-md relative group opacity-70 hover:opacity-100"
                    >
                      <div className="flex items-start gap-3.5 min-w-0">
                        <div className="w-14 h-14 rounded-2xl border-2 border-dashed border-white/20 bg-white/5 flex items-center justify-center text-white/40 flex-shrink-0">
                          <span className="material-symbols-outlined text-[24px]">add</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-[14px] font-bold text-white/60">
                              {guru.slotNumber}호 명저 공란
                            </span>
                            <span className="px-2 py-0.2 text-[10px] font-bold rounded-full bg-white/10 text-white/50 border border-white/10">
                              🔒 자료 탑재 대기 중
                            </span>
                          </div>
                          <h4 className="text-[13px] font-bold text-white/40">
                            [새 명저 슬롯 대기]
                          </h4>
                          <p className="text-[11px] text-white/40 truncate mt-0.5">
                            {guru.tagline}
                          </p>
                        </div>
                      </div>

                      {/* 공란 3종 버튼 템플릿 플레이스홀더 */}
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5">
                        <div className="py-2 px-2 rounded-xl font-bold text-[11px] flex items-center justify-center gap-1 bg-white/5 text-white/30 border border-white/5 cursor-not-allowed">
                          <span className="material-symbols-outlined text-[14px]">gavel</span>
                          <span>진단</span>
                        </div>

                        <div className="py-2 px-2 rounded-xl font-bold text-[11px] flex items-center justify-center gap-1 bg-white/5 text-white/30 border border-white/5 cursor-not-allowed">
                          <span className="material-symbols-outlined text-[14px]">menu_book</span>
                          <span>명저 학습</span>
                        </div>

                        <div className="py-2 px-2 rounded-xl font-bold text-[11px] flex items-center justify-center gap-1 bg-white/5 text-white/30 border border-white/5 cursor-not-allowed">
                          <span>🎧</span>
                          <span>오디오 대기</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        );

      case 'study':
        return (
          <BookStudyView
            selectedGuru={selectedGuru}
            currentStock={currentStock}
            onNavigate={setActiveTab}
          />
        );

      case 'diagnosis':
        return (
          <StockDiagnosisView
            selectedGuru={selectedGuru}
            currentStock={currentStock}
            onStockChange={setCurrentStock}
            onEvaluationComplete={setEvaluationResult}
            onNavigate={setActiveTab}
          />
        );

      case 'verdict':
        return (
          <VerdictReportView
            evaluationResult={evaluationResult}
            selectedGuru={selectedGuru}
            onNavigate={setActiveTab}
          />
        );

      case 'chat':
        return (
          <MasterChatView
            selectedGuru={selectedGuru}
            evaluationResult={evaluationResult}
            currentStock={currentStock}
          />
        );

      case 'actionplan':
        return (
          <ActionPlanView
            selectedGuru={selectedGuru}
            currentStock={currentStock}
            evaluationResult={evaluationResult}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen relative text-white flex flex-col font-body antialiased selection:bg-indigo-600 selection:text-white">
      {/* 60fps GPU 가속 인터랙티브 비디오 배경 */}
      <InteractiveVideoBg isPlaying={activeTab === 'home'} />

      {/* 딥 다크 글래스모피즘 오버레이 */}
      <div className="fixed inset-0 bg-slate-950/75 pointer-events-none -z-20 gpu-layer" />

      {/* 상단 통합 헤더 */}
      <TopAppBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        selectedStock={currentStock}
      />

      {/* 메인 뷰 컨텐츠 영역 */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 pt-2 pb-24 md:pb-12 relative z-10">
        {renderContent()}
      </main>

      {/* 모바일 하단 내비게이션 바 */}
      <div className="md:hidden">
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
}
