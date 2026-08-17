import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function VipUpgradeModal({ isOpen, onClose, onUpgradeSuccess, isVip }) {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onUpgradeSuccess();
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.5 }
      });
      onClose();
    }, 1000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-400/80 rounded-[2.5rem] p-6 md:p-8 shadow-2xl space-y-6 text-white text-center relative overflow-hidden"
        >
          {/* 워터마크 */}
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

          {/* 상단 닫기 */}
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <span className="px-3 py-1 bg-amber-400 text-slate-950 font-black text-[11px] rounded-full uppercase tracking-wider">
              VIP MEMBERSHIP
            </span>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          {/* 메인 헤드라인 */}
          <div className="space-y-2">
            <div className="text-[44px]">👑</div>
            <h3 className="text-[22px] md:text-[26px] font-black text-white leading-tight">
              구루 팩토리 VIP 멤버십
            </h3>
            <p className="text-[14px] text-amber-300 font-bold">
              세계 100대 거장이 실시간 포착한 10루타 선별 종목 전체 잠금 해제
            </p>
          </div>

          {/* VIP 혜택 리스트 */}
          <div className="bg-slate-950/70 p-4 rounded-2xl border border-white/10 text-left space-y-2.5 text-[13px]">
            <div className="flex items-center gap-2 text-white/90 font-bold">
              <span className="text-amber-400">✓</span>
              <span>피터 린치 · 버핏 · 그레이엄 선별 Top 10 전 종목 열람</span>
            </div>
            <div className="flex items-center gap-2 text-white/90 font-bold">
              <span className="text-amber-400">✓</span>
              <span>토스증권 실시간 바겐세일 도달가 알림톡 발송</span>
            </div>
            <div className="flex items-center gap-2 text-white/90 font-bold">
              <span className="text-amber-400">✓</span>
              <span>15페이지 VIP 정밀 진단 선고서 PDF 무제한 다운로드</span>
            </div>
          </div>

          {/* 가격 표시 */}
          <div className="py-2">
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-[14px] text-white/60 line-through">정가 49,000원</span>
              <span className="text-[30px] font-black text-amber-300">월 19,900원</span>
            </div>
            <span className="text-[11px] text-emerald-400 font-bold">
              ⚡ 대표님 런칭 기념 60% 특별 할인 적용 중
            </span>
          </div>

          {/* 결제 버튼 */}
          <button
            onClick={handleSimulatePayment}
            disabled={isProcessing}
            className="w-full py-4 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 hover:opacity-95 text-slate-950 font-black text-[17px] rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[22px]">lock_open</span>
            <span>{isProcessing ? 'VIP 멤버십 활성화 중...' : isVip ? '이미 VIP 회원입니다' : '지금 VIP 즉시 업그레이드'}</span>
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
