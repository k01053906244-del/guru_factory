import React from 'react';
import { motion } from 'framer-motion';

export default function HeroBanner({
  currentStock,
  onStockChange,
  onQuickStockSelect,
  onNavigate
}) {
  const quickStocks = ['삼성전자', 'SK하이닉스', '현대차', '테슬라', '엔비디아', '애플'];

  return (
    <section className="relative my-2 py-3 md:py-5 space-y-4 text-center">
      
      {/* 🎧 직관적인 오디오 & 팩트체크 상단 안내 뱃지 */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 backdrop-blur-md border border-amber-400/50 text-amber-300 text-[12px] font-black tracking-wide shadow-xl"
      >
        <span className="flex items-center gap-1.5 text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>KRX·토스 실시간 팩트체크</span>
        </span>
        <span className="text-white/30 hidden sm:inline">|</span>
        <span className="flex items-center gap-1.5 text-amber-300">
          <span className="text-[14px]">🎧</span>
          <span>명저 오디오 서비스 구동 중</span>
        </span>
      </motion.div>

      {/* 헤드라인 & 서브타이틀 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1.5 max-w-3xl mx-auto"
      >
        <h2 className="text-white text-[28px] md:text-[42px] font-black leading-tight tracking-tight drop-shadow-2xl">
          <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-amber-200 bg-clip-text text-transparent">거장의 잣대</span>로 종목을 분석합니다.
        </h2>
        <p className="text-white/80 font-medium text-[14px] md:text-[16px] drop-shadow">
          종목을 입력하고 원하는 명저를 누르면 , 해당 명저의 구루 잣대로 종목을 진단하고 분석합니다.
        </p>
      </motion.div>

      {/* 직관적인 원스톱 종목 입력 위젯 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="max-w-xl mx-auto bg-slate-900/90 backdrop-blur-2xl p-4 rounded-[2rem] border border-indigo-500/40 shadow-2xl space-y-2.5"
      >
        <div className="relative">
          <input
            type="text"
            value={currentStock}
            onChange={(e) => onStockChange(e.target.value)}
            placeholder="진단할 종목명 입력 (예: 삼성전자)"
            className="w-full py-3 px-4 bg-slate-950 text-white font-black text-[15px] rounded-xl border border-indigo-400/60 focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder:text-white/40 shadow-inner text-center sm:text-left"
          />
          <span className="hidden sm:inline-block absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-extrabold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
            🟢 팩트체크 연동
          </span>
        </div>

        {/* 퀵 종목 선택 칩 */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-0.5">
          <span className="text-[11px] text-white/50 font-bold mr-1">빠른 선택:</span>
          {quickStocks.map((stock) => (
            <button
              key={stock}
              onClick={() => onQuickStockSelect(stock)}
              className={`px-2.5 py-1 font-extrabold text-[11px] rounded-lg border transition-all active:scale-95 ${
                currentStock === stock
                  ? 'bg-indigo-600 border-amber-400 text-white shadow-sm'
                  : 'bg-white/10 hover:bg-white/20 text-white/80 border-white/10'
              }`}
            >
              {stock}
            </button>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
