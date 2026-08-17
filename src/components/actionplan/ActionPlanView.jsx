import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function ActionPlanView({ selectedGuru, currentStock, evaluationResult }) {
  const stockName = currentStock || evaluationResult?.stock_name || '삼성전자';
  const guruName = selectedGuru?.nameKo || '피터 린치';

  const defaultChecklist = [
    { id: 'chk1', task: `《${stockName}》의 사업 모델을 초등학생에게 2분 안에 그림으로 설명할 수 있는가?`, category: '사업 단순성' },
    { id: 'chk2', task: `동네 상권, 가족, 직장 동료들이 이 기업의 제품/서비스에 열광하고 있는가?`, category: '현장 관찰' },
    { id: 'chk3', task: `PER을 연간 이익성장률로 나눈 PEG 비율이 1.0 이하인가? (현재 토스 연동 검증)`, category: '가치 평가' },
    { id: 'chk4', task: `부채비율이 50% 이하이며 위기 시 버틸 순현금(Cash)이 풍부한가?`, category: '재무 건전성' },
    { id: 'chk5', task: `본업과 무관한 엉뚱한 기업 인수(사업다악화)로 돈을 낭비하지 않는가?`, category: '경영 리스크' },
    { id: 'chk6', task: `내일 당장 주가가 -30% 폭락해도 공포 없이 웃으며 추가 매수할 수 있는가?`, category: '심리/여유자금' },
    { id: 'chk7', task: `향후 3년 이상 절대 인출할 일 없는 순수한 여유 자금으로 매수했는가?`, category: '시간의 힘' },
  ];

  const [checkedItems, setCheckedItems] = useState({});

  const toggleCheck = (id) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const total = defaultChecklist.length;
  const completed = Object.values(checkedItems).filter(Boolean).length;
  const progressPercent = Math.round((completed / total) * 100);

  const buyRules = [
    '회사의 사업 모델이 지루하거나 촌스러워 월가 전문가들이 외면할 때',
    '기관 투자자의 보유 비중이 낮고 애널리스트 리포트가 드물 때',
    '내부자(대표이사/임원)들이 자기 돈으로 자사주를 꾸준히 장내 매수할 때',
    'PEG 지표가 1.0 미만이며 부채가 거의 없는 순현금 부자 기업일 때'
  ];

  const sellRules = [
    '고성장 기업의 매출 성장률이 급격히 꺾이고 재고 자산이 급증할 때',
    '본업에 집중하지 않고 엉뚱한 비관련 사업을 비싸게 인수합병(M&A)할 때',
    '주가가 단지 많이 올랐다는 이유가 아니라, 처음 샀던 투자 아이디어가 훼손되었을 때'
  ];

  return (
    <div className="space-y-8 pb-16 animate-fadeIn max-w-4xl mx-auto">
      {/* 헤더 배너 */}
      <div className="bg-gradient-to-r from-indigo-900/90 via-purple-900/80 to-slate-900/90 p-6 md:p-8 rounded-[2.5rem] border border-indigo-500/30 text-white shadow-2xl space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg">
            <span className="material-symbols-outlined text-[32px] text-amber-300">checklist</span>
          </div>
          <div>
            <span className="text-[11px] font-extrabold text-amber-300 uppercase tracking-wider">
              ACTION PLAN & RULES
            </span>
            <h2 className="text-[24px] md:text-[28px] font-black tracking-tight">
              {guruName}의 10루타 실전 매매 수칙
            </h2>
            <p className="text-white/80 text-[14px]">
              진단 종목: <strong>{stockName}</strong> · 감정에 휘둘리지 않는 7대 체크리스트
            </p>
          </div>
        </div>

        {/* 진행률 게이지 */}
        <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/10 space-y-2">
          <div className="flex justify-between text-[13px] font-extrabold">
            <span>체크리스트 완수율: {completed} / {total} 완료</span>
            <span className="text-amber-300 font-black">{progressPercent}%</span>
          </div>
          <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400 h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* 체크리스트 섹션 */}
      <section className="space-y-3">
        <h3 className="text-[20px] font-extrabold text-white px-1 flex items-center gap-2">
          <span className="material-symbols-outlined text-indigo-400 text-[24px]">task_alt</span>
          <span>{stockName} 실전 매수 전 필수 체크리스트</span>
        </h3>

        <div className="grid gap-3">
          {defaultChecklist.map((item) => {
            const isDone = !!checkedItems[item.id];
            return (
              <motion.div
                key={item.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleCheck(item.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between shadow-md ${
                  isDone
                    ? 'bg-indigo-950/80 border-indigo-500/60 text-white'
                    : 'bg-slate-900/80 border-white/15 hover:border-indigo-400/40 text-white/90'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`material-symbols-outlined text-[24px] mt-0.5 ${
                      isDone ? 'text-amber-400' : 'text-white/40'
                    }`}
                  >
                    {isDone ? 'check_box' : 'check_box_outline_blank'}
                  </span>
                  <div>
                    <span className="inline-block px-2 py-0.5 bg-white/10 rounded text-[10px] font-extrabold text-amber-300 mb-1 border border-white/10">
                      {item.category}
                    </span>
                    <p className={`text-[15px] font-extrabold ${isDone ? 'line-through text-white/60' : 'text-white'}`}>
                      {item.task}
                    </p>
                  </div>
                </div>

                {isDone && (
                  <span className="material-symbols-outlined text-emerald-400 text-[22px] flex-shrink-0">
                    verified
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 매수 / 매도 신호 가이드 */}
      <section className="grid md:grid-cols-2 gap-4">
        {/* 매수 신호 */}
        <div className="bg-slate-900/85 backdrop-blur-xl p-6 rounded-[2rem] border border-emerald-500/30 space-y-3 shadow-xl">
          <div className="flex items-center gap-2 text-emerald-400 font-black text-[17px]">
            <span className="material-symbols-outlined text-[24px]">add_circle</span>
            <h4>피터 린치의 매수 신호 (Buy Signals)</h4>
          </div>
          <ul className="space-y-2 text-[14px] text-white/80">
            {buyRules.map((rule, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 매도 신호 */}
        <div className="bg-slate-900/85 backdrop-blur-xl p-6 rounded-[2rem] border border-rose-500/30 space-y-3 shadow-xl">
          <div className="flex items-center gap-2 text-rose-400 font-black text-[17px]">
            <span className="material-symbols-outlined text-[24px]">remove_circle</span>
            <h4>피터 린치의 매도 신호 (Sell Signals)</h4>
          </div>
          <ul className="space-y-2 text-[14px] text-white/80">
            {sellRules.map((rule, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 피터 린치 실전 권고 카드 */}
      <div className="bg-slate-950/80 p-5 rounded-2xl border border-white/15 text-white/90 space-y-2">
        <h4 className="font-extrabold text-amber-300 flex items-center gap-2 text-[15px]">
          <span className="material-symbols-outlined text-[20px]">lightbulb</span>
          <span>{guruName}의 최종 매매 훈수</span>
        </h4>
        <p className="text-[14px] text-white/80 leading-relaxed">
          "체크리스트를 70% 이상 통과하지 못한 종목은 당신의 피 같은 돈을 넣을 자격이 없습니다. 단 한 주의 주식을 사더라도 그 회사의 사업을 100% 이해했을 때만 매수 버튼을 누르십시오."
        </p>
      </div>
    </div>
  );
}
