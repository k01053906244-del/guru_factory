import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ApiKeyManager } from '../../services/apiKeyManager';

export default function ApiKeyModal({ isOpen, onClose }) {
  const [tossKey, setTossKey] = useState('');
  const [aiKey, setAiKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [usageInfo, setUsageInfo] = useState({ count: 0, maxLimit: 100, remaining: 100 });

  useEffect(() => {
    if (isOpen) {
      setTossKey(ApiKeyManager.getTossApiKey());
      setAiKey(ApiKeyManager.getAiApiKey());
      setUsageInfo(ApiKeyManager.getDailyUsage());
      setIsSaved(false);
    }
  }, [isOpen]);

  const handleSave = async () => {
    await ApiKeyManager.setTossApiKey(tossKey);
    await ApiKeyManager.setAiApiKey(aiKey);
    setIsSaved(true);
    setTimeout(() => {
      onClose();
    }, 800);
  };

  if (!isOpen) return null;

  const usagePercent = Math.min(100, Math.round((usageInfo.count / usageInfo.maxLimit) * 100));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-lg bg-slate-900 border-2 border-indigo-500/50 rounded-[2.5rem] p-6 md:p-8 shadow-2xl space-y-5 text-white relative overflow-hidden"
        >
          {/* 헤더 */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[28px] text-amber-300">enhanced_encryption</span>
              <div>
                <h3 className="text-[20px] font-black leading-tight">
                  파이어베이스 보안 금고 (API Vault)
                </h3>
                <span className="text-[12px] text-amber-300/90 font-bold">
                  🔒 Salt 암호화 & 1일 100회 엄격 한도 제한 적용
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* 📊 1일 100회 호출량 실시간 쿼터 대시보드 */}
          <div className="bg-slate-950/80 border border-amber-400/40 p-4 rounded-2xl space-y-2.5 shadow-inner">
            <div className="flex justify-between items-center text-[12px] font-black">
              <span className="flex items-center gap-1 text-white">
                <span className="material-symbols-outlined text-[16px] text-amber-300">speed</span>
                <span>오늘의 토스증권 API 호출량</span>
              </span>
              <span className="text-amber-300 font-mono">
                {usageInfo.count} / {usageInfo.maxLimit}회 (남은 호출: {usageInfo.remaining}회)
              </span>
            </div>

            {/* 프로그레스 바 */}
            <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-white/10 p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  usagePercent >= 90 ? 'bg-rose-500' : usagePercent >= 70 ? 'bg-amber-400' : 'bg-emerald-400'
                }`}
                style={{ width: `${usagePercent}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-[11px] text-white/60">
              <span>매일 자정(00:00) 100회 자동 초기화</span>
              <span className="text-emerald-400 font-bold">100회 초과 시 과금 원천 차단 🛡️</span>
            </div>
          </div>

          {/* 입력 필드들 */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[13px] font-extrabold text-white flex justify-between">
                <span>토스증권 OpenAPI Key / 토큰</span>
                <span className="text-[11px] text-amber-300 font-bold">
                  {ApiKeyManager.getMaskedKey(tossKey)}
                </span>
              </label>
              <input
                type="password"
                value={tossKey}
                onChange={(e) => setTossKey(e.target.value)}
                placeholder="내 토스증권 API 토큰 입력"
                className="w-full py-3 px-4 bg-slate-950 text-white font-mono text-[14px] rounded-xl border border-white/20 focus:border-amber-400 focus:outline-none placeholder:text-white/30"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-extrabold text-white flex justify-between">
                <span>Google Gemini AI API Key (선택)</span>
                <span className="text-[11px] text-amber-300 font-bold">
                  {ApiKeyManager.getMaskedKey(aiKey)}
                </span>
              </label>
              <input
                type="password"
                value={aiKey}
                onChange={(e) => setAiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full py-3 px-4 bg-slate-950 text-white font-mono text-[14px] rounded-xl border border-white/20 focus:border-amber-400 focus:outline-none placeholder:text-white/30"
              />
            </div>
          </div>

          {/* 저장 버튼 */}
          <div className="pt-1">
            <button
              onClick={handleSave}
              className={`w-full py-4 rounded-2xl font-black text-[16px] flex items-center justify-center gap-2 transition-all shadow-xl ${
                isSaved
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 border border-amber-300 active:scale-95 cursor-pointer'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {isSaved ? 'check_circle' : 'lock'}
              </span>
              <span>{isSaved ? '파이어베이스 금고에 안전하게 저장 완료!' : '파이어베이스 보안 금고에 암호화 저장'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
