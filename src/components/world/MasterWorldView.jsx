import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function MasterWorldView({ bookData, onNavigate }) {
  const [isWarping, setIsWarping] = useState(false);
  const [inWorld, setInWorld] = useState(false);
  const [dialogueIndex, setDialogueIndex] = useState(0);

  const dialogues = bookData.aiPersona.masterWorldDialogue || [
    {
      speaker: 'Viewbean',
      text: '피터 린치 선생님! 월가의 차원 속으로 들어왔습니다. 13년 동안 연평균 29.2% 수익률의 비결이 정말 일상 관찰에 있나요?'
    },
    {
      speaker: 'PeterLynch',
      text: '어서 오세요, 뷰빈! 당연하죠. 월가의 기관 분석가들이 하버드 공식을 풀 때, 내 아내는 던킨 도너츠 매장 줄을 보고 투자 기회를 잡았습니다!'
    },
    {
      speaker: 'Viewbean',
      text: '우와! 보통 사람들이 주식 시장에서 저지르는 가장 큰 실수는 무엇인가요?'
    },
    {
      speaker: 'PeterLynch',
      text: '주가가 좀 떨어졌다고 무조건 싸다고 사거나, 조금 올랐다고 파는 것입니다. 주가가 아니라 기업의 이익 성장을 보아야 합니다!'
    }
  ];

  const handleStartWarp = () => {
    setIsWarping(true);
    // Fire celebratory portal particles
    confetti({
      particleCount: 80,
      spread: 100,
      origin: { y: 0.6 }
    });

    setTimeout(() => {
      setIsWarping(false);
      setInWorld(true);
    }, 1800);
  };

  const handleNextDialogue = () => {
    if (dialogueIndex < dialogues.length - 1) {
      setDialogueIndex((prev) => prev + 1);
    } else {
      setDialogueIndex(0); // Loop or finish
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col justify-between pb-8">
      {/* Warp Animation Intro Mode */}
      {!inWorld && (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-64 h-80 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-primary-container group"
          >
            <img
              src={bookData.coverImage}
              alt="Book Cover"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent flex flex-col justify-end p-5 text-white">
              <span className="text-[11px] font-bold text-secondary-fixed uppercase tracking-wider">
                DIMENSIONAL PORTAL
              </span>
              <h3 className="text-[22px] font-extrabold leading-tight">
                《{bookData.title}》
              </h3>
            </div>
          </motion.div>

          <div className="space-y-2 max-w-md">
            <h2 className="text-[28px] font-extrabold text-on-background tracking-tight">
              ✨ 뷰빈(Viewbean)의 책 속 세계 여행
            </h2>
            <p className="text-body-md text-on-surface-variant leading-relaxed">
              버튼을 누르면 뷰빈 캐릭터가 시공간 워프를 통해 1980년대 피터 린치의 마젤란 펀드 오피스로 들어가 거장과 인터뷰를 시작합니다!
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartWarp}
            disabled={isWarping}
            className="w-full max-w-xs py-4 px-6 bg-gradient-to-r from-primary to-secondary text-white font-extrabold rounded-2xl flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transition-all"
          >
            <span className="material-symbols-outlined text-[24px]">auto_awesome</span>
            <span>{isWarping ? '시공간 워프 중...' : '책 속으로 들어서기'}</span>
          </motion.button>
        </div>
      )}

      {/* Warping Overlay Screen */}
      <AnimatePresence>
        {isWarping && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-primary/95 backdrop-blur-xl flex flex-col items-center justify-center text-white space-y-6"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="w-24 h-24 rounded-full border-4 border-t-secondary border-r-white border-b-secondary-container border-l-white flex items-center justify-center shadow-2xl"
            >
              <span className="material-symbols-outlined text-[48px] text-secondary-fixed">
                auto_awesome
              </span>
            </motion.div>
            <div className="text-center space-y-2">
              <h3 className="text-[28px] font-extrabold tracking-tight">
                🔮 책 속 세상으로 워프 중...
              </h3>
              <p className="text-label-md text-white/80">
                1980년대 피터 린치의 보스턴 오피스로 뷰빈이 동기화됩니다!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Visual Novel RPG Interview Mode */}
      {inWorld && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 flex flex-col justify-between space-y-4"
        >
          {/* Environment Header */}
          <div className="bg-gradient-to-r from-primary/90 to-tertiary-container/90 text-white p-4 rounded-2xl shadow-md flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary-fixed text-[22px]">map</span>
              <span className="text-label-md font-extrabold">
                📍 1982년 보스턴 피델리티 마젤란 펀드 집무실
              </span>
            </div>
            <button
              onClick={() => setInWorld(false)}
              className="text-label-sm font-bold bg-white/20 px-3 py-1 rounded-full hover:bg-white/30"
            >
              차원 퇴장
            </button>
          </div>

          {/* Stage Visual Scene (Viewbean & Peter Lynch Avatar Stage) */}
          <div className="relative h-64 md:h-72 rounded-[2rem] bg-gradient-to-b from-indigo-950 via-purple-900 to-slate-900 overflow-hidden shadow-2xl border-2 border-primary/30 flex items-end justify-between p-6">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* Viewbean Character Avatar */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="relative z-10 flex flex-col items-center space-y-1"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 p-1 shadow-2xl ring-4 ring-white/30 flex items-center justify-center">
                <span className="text-[36px]">🦊</span>
              </div>
              <span className="px-3 py-1 bg-amber-500 text-slate-950 font-black text-[12px] rounded-full shadow">
                뷰빈 (Viewbean)
              </span>
            </motion.div>

            {/* Middle Versus / Dialogue Indicator */}
            <div className="relative z-10 text-center text-white/80 space-y-1">
              <span className="text-[10px] font-black tracking-widest text-secondary-fixed uppercase">
                INTERVIEW STAGE
              </span>
              <div className="w-12 h-1 bg-secondary-fixed/50 mx-auto rounded-full" />
            </div>

            {/* Peter Lynch Master Avatar */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 3, delay: 1.5 }}
              className="relative z-10 flex flex-col items-center space-y-1"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-container p-1 shadow-2xl ring-4 ring-white/30 overflow-hidden">
                <img
                  src={bookData.avatar}
                  alt={bookData.masterName}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <span className="px-3 py-1 bg-primary text-white font-black text-[12px] rounded-full shadow">
                {bookData.masterName}
              </span>
            </motion.div>
          </div>

          {/* Dialogue Box (RPG Style) */}
          <div className="bg-white p-5 rounded-[2rem] border-2 border-primary/30 shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-label-md font-extrabold text-white ${
                  dialogues[dialogueIndex].speaker === 'Viewbean'
                    ? 'bg-amber-500'
                    : 'bg-primary'
                }`}
              >
                {dialogues[dialogueIndex].speaker === 'Viewbean'
                  ? '🦊 뷰빈 (Viewbean)'
                  : `🏛️ ${bookData.masterName}`}
              </span>
            </div>

            <p className="text-body-lg text-on-background font-bold leading-relaxed min-h-[60px]">
              "{dialogues[dialogueIndex].text}"
            </p>

            <div className="flex justify-between items-center pt-2">
              <span className="text-label-sm text-on-surface-variant">
                대화 단계: {dialogueIndex + 1} / {dialogues.length}
              </span>
              <button
                onClick={handleNextDialogue}
                className="px-6 py-2.5 bg-primary text-white font-extrabold rounded-xl flex items-center gap-2 shadow-md hover:bg-primary-container transition-colors"
              >
                <span>다음 대화</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
