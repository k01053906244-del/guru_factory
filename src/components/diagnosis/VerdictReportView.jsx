import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function VerdictReportView({
  evaluationResult,
  selectedGuru,
  onNavigate
}) {
  useEffect(() => {
    if (evaluationResult) {
      // 폭죽 파티클 발사
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.5 }
      });
    }
  }, [evaluationResult]);

  if (!evaluationResult) {
    return (
      <div className="text-center py-20 space-y-4">
        <span className="material-symbols-outlined text-[64px] text-white/40">gavel</span>
        <h3 className="text-[22px] font-extrabold text-white">진단된 종목 판결문이 없습니다.</h3>
        <p className="text-white/60">먼저 10대 청문회 진단을 진행해 주세요.</p>
        <button
          onClick={() => onNavigate('diagnosis')}
          className="px-6 py-3 bg-indigo-600 text-white font-extrabold rounded-2xl shadow-lg hover:bg-indigo-500 transition-all"
        >
          청문회 진단하러 가기
        </button>
      </div>
    );
  }

  const {
    stock_name,
    category,
    guru_name,
    total_score,
    verdict,
    details = [],
    financial_data = {}
  } = evaluationResult;

  const handlePrint = () => {
    window.print();
  };

  const getTierColor = (tierName) => {
    if (tierName.includes('10루타') || tierName.includes('버크셔') || tierName.includes('담배꽁초')) {
      return 'from-cyan-500 via-blue-500 to-indigo-600 text-cyan-300 border-cyan-400';
    }
    if (tierName.includes('방어주') || tierName.includes('가치주')) {
      return 'from-emerald-600 via-teal-600 to-indigo-700 text-emerald-300 border-emerald-400';
    }
    if (tierName.includes('위험') || tierName.includes('관찰')) {
      return 'from-amber-600 via-orange-600 to-red-600 text-amber-300 border-amber-400';
    }
    return 'from-rose-600 via-red-600 to-slate-900 text-rose-300 border-rose-500';
  };

  return (
    <div className="space-y-8 pb-16 animate-fadeIn max-w-4xl mx-auto">
      
      {/* 1. 상단 인증서 스타일 선고 헤더 */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-b from-slate-900/95 to-slate-950/95 p-8 md:p-10 rounded-[3rem] border-2 border-amber-400/60 shadow-2xl backdrop-blur-2xl relative overflow-hidden text-center space-y-6"
      >
        {/* 워터마크 배경 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none select-none text-[220px] font-black text-amber-300">
          ⚖️
        </div>

        {/* 선고문 상단 뱃지 */}
        <div className="flex flex-wrap justify-between items-center gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-[24px]">🏛️</span>
            <span className="text-[13px] font-black tracking-[0.2em] text-amber-300 uppercase">
              GURU FACTORY OFFICIAL VERDICT
            </span>
          </div>
          <span className="text-[12px] font-bold text-white/50">
            선고 일시: {new Date().toLocaleDateString('ko-KR')}
          </span>
        </div>

        {/* 종목명 & 구루 명의 선고 */}
        <div className="space-y-2">
          <span className="inline-block px-3 py-1 bg-white/10 text-indigo-300 font-extrabold text-[12px] rounded-full border border-white/15">
            1심 분류: {category}
          </span>
          <h2 className="text-[36px] md:text-[46px] font-black text-white tracking-tight">
            《{stock_name}》 최종 판결 선고문
          </h2>
          <p className="text-white/70 text-[15px] font-medium">
            주심 재판관: <strong className="text-amber-300">{guru_name}</strong>
          </p>
        </div>

        {/* 총점 및 티어 뱃지 대형 카드 */}
        <div className={`p-6 rounded-[2.5rem] bg-gradient-to-r ${getTierColor(verdict.tier)} border shadow-2xl text-white space-y-3`}>
          <div className="flex flex-col sm:flex-row items-center justify-around gap-4">
            <div className="text-center">
              <span className="text-[13px] font-extrabold text-white/80 uppercase block">
                청문회 종합 점수
              </span>
              <span className="text-[54px] md:text-[64px] font-black leading-none drop-shadow-lg">
                {total_score}<span className="text-[28px] font-bold text-white/70"> / 100</span>
              </span>
            </div>

            <div className="h-16 w-px bg-white/20 hidden sm:block" />

            <div className="text-center sm:text-left space-y-1">
              <span className="text-[13px] font-extrabold text-white/80 uppercase block">
                최종 판결 등급
              </span>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-[36px]">{verdict.badge}</span>
                <span className="text-[24px] md:text-[28px] font-black tracking-tight drop-shadow">
                  {verdict.tier}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/20 text-center">
            <span className="text-[13px] font-extrabold text-white/90">
              🎯 즉각 행동 지침: <strong className="text-amber-200 underline underline-offset-4">{verdict.action}</strong>
            </span>
          </div>
        </div>

        {/* 구루의 직설적 육성 판결 코멘트 */}
        <div className="bg-slate-950/80 p-6 rounded-2xl border border-white/15 text-left space-y-2">
          <div className="flex items-center gap-2 text-amber-300 font-black text-[15px]">
            <span className="material-symbols-outlined text-[22px]">record_voice_over</span>
            <span>{guru_name}의 판결 선고 요지</span>
          </div>
          <p className="text-[16px] text-white/90 font-bold leading-relaxed italic pl-7 border-l-2 border-amber-400">
            "{verdict.verdict_text}"
          </p>
        </div>

        {/* 2대 바로가기 버튼 */}
        <div className="flex flex-wrap justify-center items-center gap-4 pt-2">
          <button
            onClick={() => onNavigate('chat')}
            className="px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-extrabold rounded-2xl shadow-xl hover:shadow-indigo-500/30 flex items-center gap-2 text-[15px] border border-white/20 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">psychology</span>
            <span>{guru_name}와 1:1 심층 상담</span>
          </button>

          <button
            onClick={() => onNavigate('actionplan')}
            className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-extrabold rounded-2xl shadow-lg flex items-center gap-2 text-[15px] border border-white/20 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">checklist</span>
            <span>실전 매매 액션플랜 확인</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-5 py-3.5 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 font-extrabold rounded-2xl flex items-center gap-2 text-[14px] border border-amber-500/40 transition-all"
            title="판결 선고문 인쇄/PDF 저장"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            <span>선고서 인쇄/저장</span>
          </button>
        </div>
      </motion.div>

      {/* 2. 10대 청문회 항목별 상세 득점표 */}
      <section className="bg-slate-900/85 backdrop-blur-xl p-6 md:p-8 rounded-[2.5rem] border border-white/20 shadow-xl space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-[20px] font-extrabold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-indigo-400 text-[24px]">fact_check</span>
            <span>10대 심문 항목별 상세 채점 결과</span>
          </h3>
          <span className="text-[12px] font-bold text-emerald-400">
            총 {details.filter((d) => d.isPass).length} / {details.length}개 항목 통과
          </span>
        </div>

        <div className="grid gap-3">
          {details.map((d, idx) => (
            <div
              key={d.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                d.isPass
                  ? 'bg-slate-950/70 border-indigo-500/30'
                  : 'bg-slate-950/40 border-white/10 opacity-75'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className={`w-7 h-7 rounded-xl font-black text-[12px] flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  d.isPass ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-white'
                }`}>
                  {idx + 1}
                </span>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-white text-[15px]">
                      {d.title}
                    </span>
                    <span className="text-[11px] font-bold text-white/50">
                      ({d.type === 'quantitative' ? '정량' : '정성'})
                    </span>
                  </div>
                  <p className="text-[13px] text-white/70">
                    {d.question}
                  </p>
                  <p className="text-[11px] text-amber-300/80 italic">
                    "{d.quote}"
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <span className={`px-3 py-1.5 rounded-xl font-black text-[13px] ${
                  d.isPass
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}>
                  {d.score} / {d.maxScore}점 {d.isPass ? 'PASS' : 'FAIL'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. 유료 VIP 심층 리포트 안내 배너 */}
      <section className="bg-gradient-to-r from-amber-500/20 via-purple-900/40 to-indigo-900/30 p-6 rounded-[2rem] border border-amber-400/40 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center md:text-left">
          <span className="px-2.5 py-0.5 bg-amber-400 text-slate-950 text-[11px] font-black rounded-md uppercase">
            VIP REPORT
          </span>
          <h4 className="text-[18px] font-extrabold text-white">
            워런 버핏 & 벤저민 그레이엄 듀얼 심층 청문회 리포트
          </h4>
          <p className="text-[13px] text-white/70">
            토스증권 10년 재무제표와 경제적 해자, NCAV 청산가치가 포함된 15페이지 VIP 정밀 리포트를 확인하세요.
          </p>
        </div>

        <button
          onClick={() => onNavigate('home')}
          className="px-6 py-3 bg-amber-400 text-slate-950 font-black rounded-xl hover:bg-amber-300 transition-all shadow-lg text-[14px] whitespace-nowrap"
        >
          VIP 거장 둘러보기
        </button>
      </section>
    </div>
  );
}
