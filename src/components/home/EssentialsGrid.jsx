import React from 'react';
import { motion } from 'framer-motion';

export default function EssentialsGrid({ onNavigate }) {
  const handleStepClick = (stepId) => {
    if (stepId === 'input_focus') {
      const inputEl = document.querySelector('input[type="text"]');
      if (inputEl) {
        inputEl.focus();
        inputEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else if (stepId === 'library_scroll') {
      const libEl = document.getElementById('guru-library-section');
      if (libEl) {
        libEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      onNavigate(stepId);
    }
  };

  const steps = [
    {
      step: 'STEP 01',
      id: 'input_focus',
      title: '내 종목 입력',
      sub: 'KRX 공시 & 토스 실시간 팩트체크 지표 연동',
      icon: 'search',
      iconBg: 'bg-indigo-600 text-white',
      badge: '1단계 팩트체크'
    },
    {
      step: 'STEP 02',
      id: 'library_scroll',
      title: '해당 구루 선택',
      sub: '100+ 명저 라이브러리에서 원하는 거장 클릭',
      icon: 'auto_stories',
      iconBg: 'bg-purple-600 text-white',
      badge: '2단계 명저 매칭'
    },
    {
      step: 'STEP 03',
      id: 'diagnosis',
      title: '구루의 실시간 진단',
      sub: '10대 청문회 심문 & 최종 판결 선고문(0~100점)',
      icon: 'gavel',
      iconBg: 'bg-amber-600 text-white',
      badge: '3단계 엄정 선고'
    },
    {
      step: 'STEP 04',
      id: 'study',
      title: '명저 원전 학습',
      sub: 'PPT 슬라이드 덱 요약본 & 1:1 구루 AI 코칭',
      icon: 'psychology',
      iconBg: 'bg-emerald-600 text-white',
      badge: '4단계 바이블 체화'
    },
  ];

  return (
    <section className="space-y-4 my-5">
      <div className="flex justify-between items-baseline px-1">
        <div>
          <span className="text-[11px] font-black text-amber-300 uppercase tracking-wider">
            MASTER JOURNEY WORKFLOW
          </span>
          <h3 className="text-[19px] md:text-[22px] font-black text-white tracking-tight drop-shadow-md">
            🏛️ 4단계 원스톱 진단 & 학습 로드맵
          </h3>
        </div>
        <span className="text-[12px] font-bold text-white/60 hidden sm:inline">
          카드를 클릭하면 해당 단계의 실시간 서비스로 즉시 진입합니다
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 md:gap-4">
        {steps.map((item, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleStepClick(item.id)}
            className="bg-slate-900/90 backdrop-blur-md p-4 md:p-5 rounded-[2rem] flex flex-col justify-between space-y-3.5 border border-white/20 cursor-pointer hover:bg-slate-900 hover:border-amber-400 transition-all shadow-xl group relative overflow-hidden"
          >
            {/* 상단 스텝 라벨 & 뱃지 */}
            <div className="flex justify-between items-center border-b border-white/10 pb-2.5">
              <span className="text-[12px] font-black text-amber-300 tracking-wider">
                {item.step}
              </span>
              <span className="px-2 py-0.5 bg-white/10 text-white/90 text-[10px] font-extrabold rounded-full border border-white/15">
                {item.badge}
              </span>
            </div>

            {/* 아이콘 & 타이틀 */}
            <div className="space-y-2">
              <div className={`w-11 h-11 rounded-2xl ${item.iconBg} shadow-md flex items-center justify-center group-hover:scale-105 transition-transform`}>
                <span className="material-symbols-outlined text-[24px]">
                  {item.icon}
                </span>
              </div>
              <div>
                <h4 className="font-black text-white text-[16px] mb-0.5">
                  {item.title}
                </h4>
                <p className="text-[11px] text-white/70 leading-relaxed font-medium">
                  {item.sub}
                </p>
              </div>
            </div>

            {/* 하단 화살표 */}
            <div className="flex items-center gap-1 text-amber-300 text-[11px] font-extrabold pt-0.5">
              <span>단계 바로가기</span>
              <span className="material-symbols-outlined text-[14px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
