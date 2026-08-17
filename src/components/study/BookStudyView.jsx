import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GuruScreenerService } from '../../services/guruScreenerService';
import VipUpgradeModal from '../common/VipUpgradeModal';
import GuruAudioPlayer from './GuruAudioPlayer';

export default function BookStudyView({ selectedGuru, currentStock, onNavigate }) {
  const [studyMode, setStudyMode] = useState('ppt_slides'); // 'ppt_slides' | 'curated_stocks' | 'ai_coaching' | 'full_text'
  const [slideSubCategory, setSlideSubCategory] = useState('summary'); // 'summary' | 'hearing' | 'samsung_audit'
  const [currentSlideIndex, setCurrentSlideIndex] = useState(1);
  const [curatedStocks, setCuratedStocks] = useState([]);
  const [isVip, setIsVip] = useState(false);
  const [isVipModalOpen, setIsVipModalOpen] = useState(false);

  // 🧠 1:1 대화형 AI 코칭 상태
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'guru',
      text: `반갑습니다! 피터 린치입니다. 《${selectedGuru?.bookTitle || '월가의 영웅'}》의 핵심 철학이나 현재 검토 중이신 《${currentStock || '내 종목'}》에 대해 무엇이든 편하게 물어보세요.`
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);

  const totalSlides = 8;

  useEffect(() => {
    if (selectedGuru) {
      GuruScreenerService.getCuratedStocksByGuru(selectedGuru, isVip).then((res) => {
        setCuratedStocks(res);
      });
    }
  }, [selectedGuru, isVip]);

  if (!selectedGuru) return null;

  const rule = selectedGuru.ruleData;
  const questions = rule?.hearing_questions || [];

  const handleNextSlide = () => {
    if (currentSlideIndex < totalSlides) {
      setCurrentSlideIndex((prev) => prev + 1);
    }
  };

  const handlePrevSlide = () => {
    if (currentSlideIndex > 1) {
      setCurrentSlideIndex((prev) => prev - 1);
    }
  };

  // 슬라이드 SVG 파일 경로
  const currentSvgPath = `/slides/peter_lynch/${slideSubCategory}/page_0${currentSlideIndex}.svg`;

  // AI 코칭 질문 전송 핸들러
  const handleSendMessage = (customText) => {
    const textToSend = customText || userInput;
    if (!textToSend.trim() || isAiThinking) return;

    const newMsgs = [...chatMessages, { sender: 'user', text: textToSend }];
    setChatMessages(newMsgs);
    setUserInput('');
    setIsAiThinking(true);

    setTimeout(() => {
      let reply = '';
      const q = textToSend.toLowerCase();

      if (q.includes('기업 유형') || q.includes('유형')) {
        reply = `《${currentStock}》은(는) 안정적인 시장 점유율과 현금 흐름을 가진 [대형우량주(Stalwart)] 범주에 가깝습니다. 대형우량주는 연 10~12%의 꾸준한 복리 수익과 하락장 방어가 목적이지, 단기간 10배 폭등을 기대하면 안 됩니다.`;
      } else if (q.includes('peg') || q.includes('저평가')) {
        reply = `PEG(주가이익증가비율)는 'PER ÷ 이익성장률'입니다. PEG가 1.0 미만이면 기업의 성장 속도에 비해 주가가 바겐세일 상태라는 확실한 증거이며, 0.5 미만이면 제가 마젤란 펀드에서 무조건 쓸어 담던 10루타 후보입니다.`;
      } else if (q.includes('부채') || q.includes('위험')) {
        reply = `부채비율이 50%를 넘어가고 단기 차입금이 많은 기업은 불황이 오면 파산 위험 1순위입니다. 반대로 부채가 적고 순현금이 시총의 상당 부분을 차지하는 기업은 절대 망하지 않습니다.`;
      } else if (q.includes('매수') || q.includes('언제')) {
        reply = `주가가 떨어졌다고 무조건 사지 마세요. 초등학생에게 2분 안에 '이 회사가 돈을 어떻게 버는지' 설명할 수 있고, 재고가 줄어들며 이익이 늘어나는 팩트가 KRX 공시로 확인될 때 매수해야 합니다.`;
      } else {
        reply = `좋은 질문입니다! 《${selectedGuru.bookTitle}》의 제1원칙은 "내가 잘 아는 곳에서 시작하라"입니다. 《${currentStock}》의 일상 속 경쟁력과 토스 실시간 재무(PEG, 부채비율)를 교차 검증하시면 실패하지 않는 투자를 하실 수 있습니다.`;
      }

      setChatMessages([...newMsgs, { sender: 'guru', text: reply }]);
      setIsAiThinking(false);
    }, 700);
  };

  const quickQuestions = [
    `《${currentStock}》은 6대 기업 유형 중 어디에 속하나요?`,
    "PEG 1.0 이하가 왜 10루타의 필수 조건인가요?",
    "부채비율 50%를 넘으면 왜 위험한가요?",
    "피터 린치 거장님, 언제 매수해야 하나요?"
  ];

  return (
    <div className="space-y-6 pb-16 animate-fadeIn max-w-4xl mx-auto">
      
      {/* 🎧 1. 최상단: AI 오디오 브리핑 플레이어 (노트북LM 음성 직강 연동) */}
      <GuruAudioPlayer
        title="쇼핑카트에서 발견한 2,700% 수익의 비결"
        author={selectedGuru.nameKo}
        audioSrc="/audio/peter_lynch/shopping_cart_2700_secret.m4a"
      />

      {/* 2. 상단 4대 실시간 서비스 모드 전환 탭 */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3 bg-slate-900/90 backdrop-blur-xl p-4 rounded-2xl border border-white/20 shadow-xl">
        <div className="flex items-center gap-3">
          <img
            src={selectedGuru.avatar}
            alt={selectedGuru.nameKo}
            className="w-11 h-11 rounded-full border border-amber-400 object-cover shadow"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[17px] font-black text-white leading-snug">
                《{selectedGuru.bookTitle}》 실시간 명저 학습실
              </h2>
              {isVip && (
                <span className="px-2 py-0.2 bg-amber-400 text-slate-950 text-[10px] font-black rounded-full">
                  👑 VIP ACTIVE
                </span>
              )}
            </div>
            <span className="text-[12px] text-amber-300 font-bold">
              {selectedGuru.nameKo}의 고화질 슬라이드 · 1:1 AI 코칭 · 선별 종목
            </span>
          </div>
        </div>

        {/* 4대 서비스 뷰 모드 스위치 */}
        <div className="flex flex-wrap items-center bg-slate-950 p-1 rounded-xl border border-white/10 gap-1">
          <button
            onClick={() => setStudyMode('ppt_slides')}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-black transition-all flex items-center gap-1 ${
              studyMode === 'ppt_slides'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <span>📊 PPT 슬라이드</span>
          </button>

          <button
            onClick={() => setStudyMode('ai_coaching')}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-black transition-all flex items-center gap-1 ${
              studyMode === 'ai_coaching'
                ? 'bg-purple-600 text-white shadow'
                : 'text-purple-300 hover:text-white'
            }`}
          >
            <span>🧠 1:1 AI 코칭</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>

          <button
            onClick={() => setStudyMode('curated_stocks')}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-black transition-all flex items-center gap-1 ${
              studyMode === 'curated_stocks'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-amber-300 hover:text-white'
            }`}
          >
            <span>💎 거장 선별 종목</span>
            <span className="px-1.5 py-0.2 bg-slate-900 text-amber-300 text-[9px] font-black rounded-full">
              VIP
            </span>
          </button>

          <button
            onClick={() => setStudyMode('full_text')}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-black transition-all ${
              studyMode === 'full_text'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <span>📑 10대 룰셋</span>
          </button>
        </div>
      </div>

      {/* 3. PPT 슬라이드 덱 뷰어 (고화질 SVG 24장) */}
      {studyMode === 'ppt_slides' && (
        <div className="space-y-4">
          {/* 슬라이드 3대 서브 카테고리 */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-950/80 p-2 rounded-2xl border border-white/10">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => { setSlideSubCategory('summary'); setCurrentSlideIndex(1); }}
                className={`px-3 py-1 rounded-xl text-[12px] font-extrabold transition-all ${
                  slideSubCategory === 'summary'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                📘 1. 피터린치 핵심 요약편 (8p)
              </button>
              <button
                onClick={() => { setSlideSubCategory('hearing'); setCurrentSlideIndex(1); }}
                className={`px-3 py-1 rounded-xl text-[12px] font-extrabold transition-all ${
                  slideSubCategory === 'hearing'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                📝 2. 10대 청문회 워크북 (8p)
              </button>
              <button
                onClick={() => { setSlideSubCategory('samsung_audit'); setCurrentSlideIndex(1); }}
                className={`px-3 py-1 rounded-xl text-[12px] font-extrabold transition-all ${
                  slideSubCategory === 'samsung_audit'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                📊 3. 삼성전자 실전 완료본 (8p)
              </button>
            </div>

            <span className="text-[11px] font-black text-amber-300 px-2 py-0.5 bg-white/10 rounded">
              SLIDE {currentSlideIndex} / {totalSlides}
            </span>
          </div>

          {/* 고화질 SVG 슬라이드 뷰어 캔버스 */}
          <div className="aspect-[16/9] w-full bg-slate-950 rounded-[2rem] border-2 border-indigo-500/40 shadow-2xl overflow-hidden relative flex items-center justify-center group">
            <img
              key={currentSvgPath}
              src={currentSvgPath}
              alt={`Slide ${currentSlideIndex}`}
              className="w-full h-full object-contain select-none"
            />

            <button
              onClick={handlePrevSlide}
              disabled={currentSlideIndex === 1}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-slate-950/70 hover:bg-slate-900 border border-white/20 disabled:opacity-20 text-white flex items-center justify-center shadow-lg transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[24px]">chevron_left</span>
            </button>

            <button
              onClick={handleNextSlide}
              disabled={currentSlideIndex === totalSlides}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-slate-950/70 hover:bg-slate-900 border border-white/20 disabled:opacity-20 text-white flex items-center justify-center shadow-lg transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[24px]">chevron_right</span>
            </button>
          </div>

          {/* 슬라이드 넘김 컨트롤러 */}
          <div className="flex justify-between items-center bg-slate-900/80 p-3 rounded-2xl border border-white/10">
            <button
              onClick={handlePrevSlide}
              disabled={currentSlideIndex === 1}
              className="px-4 py-1.5 bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white font-extrabold text-[12px] rounded-xl flex items-center gap-1 border border-white/15"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>이전 슬라이드</span>
            </button>

            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalSlides }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlideIndex(idx + 1)}
                  className={`h-2 rounded-full transition-all ${
                    currentSlideIndex === idx + 1 ? 'w-6 bg-amber-400' : 'w-2 bg-white/30'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNextSlide}
              disabled={currentSlideIndex === totalSlides}
              className="px-4 py-1.5 bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white font-extrabold text-[12px] rounded-xl flex items-center gap-1 border border-white/15"
            >
              <span>다음 슬라이드</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

          {/* 📥 실제 PPTX 원본 3종 다운로드 바 */}
          <div className="bg-gradient-to-r from-indigo-950/90 via-slate-900 to-purple-950/90 p-5 rounded-[2rem] border border-amber-400/40 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-amber-300 font-black text-[15px]">
              <span className="material-symbols-outlined text-[20px]">download</span>
              <span>대표님 제공 《1) 월가의 영웅》 PPTX 원본 3종 다운로드</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <a
                href="/downloads/peter_lynch/1_피터린치_핵심요약편.pptx"
                download="1_피터린치_핵심요약편.pptx"
                className="py-2.5 px-3 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl font-extrabold text-[12px] text-white flex items-center justify-center gap-1.5 shadow transition-all active:scale-95 text-center"
              >
                <span className="material-symbols-outlined text-[16px] text-indigo-400">description</span>
                <span>1. 핵심요약편.pptx</span>
              </a>

              <a
                href="/downloads/peter_lynch/2_삼성전자_청문회_완료본.pptx"
                download="2_삼성전자_청문회_완료본.pptx"
                className="py-2.5 px-3 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl font-extrabold text-[12px] text-white flex items-center justify-center gap-1.5 shadow transition-all active:scale-95 text-center"
              >
                <span className="material-symbols-outlined text-[16px] text-amber-400">verified</span>
                <span>2. 삼성전자_완료본.pptx</span>
              </a>

              <a
                href="/downloads/peter_lynch/3_종목청문회_빈양식_워크북.pptx"
                download="3_종목청문회_빈양식_워크북.pptx"
                className="py-2.5 px-3 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl font-extrabold text-[12px] text-white flex items-center justify-center gap-1.5 shadow transition-all active:scale-95 text-center"
              >
                <span className="material-symbols-outlined text-[16px] text-emerald-400">edit_note</span>
                <span>3. 빈양식_워크북.pptx</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 🧠 4. [STEP 04 실현] 피터 린치 1:1 대화형 AI 명저 코칭 센터 */}
      {studyMode === 'ai_coaching' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-slate-900/90 backdrop-blur-2xl p-6 rounded-[2rem] border-2 border-purple-500/40 shadow-2xl space-y-4">
            
            {/* 상단 소개 바 */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-[20px] shadow">
                  🧠
                </div>
                <div>
                  <h3 className="text-[17px] font-black text-white">
                    피터 린치 거장 1:1 AI 명저 코칭룸
                  </h3>
                  <span className="text-[12px] text-purple-300 font-bold">
                    현재 분석 대상: 《{currentStock}》 · 《{selectedGuru.bookTitle}》 원전 기반 답변
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-[11px] font-extrabold">
                🟢 AI 코치 실시간 연결됨
              </span>
            </div>

            {/* 빠른 추천 질문 칩 */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-white/50">⚡ 클릭해서 바로 질문하기:</span>
              <div className="flex flex-wrap gap-1.5">
                {quickQuestions.map((qText, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(qText)}
                    className="px-3 py-1 bg-white/10 hover:bg-purple-600/40 border border-white/15 text-white/90 hover:text-white rounded-xl text-[12px] font-bold transition-all text-left"
                  >
                    💬 {qText}
                  </button>
                ))}
              </div>
            </div>

            {/* 대화 메시지 영역 */}
            <div className="bg-slate-950/80 rounded-2xl p-4 border border-white/10 space-y-3 min-h-[220px] max-h-[360px] overflow-y-auto">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-2.5 ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.sender === 'guru' && (
                    <img
                      src={selectedGuru.avatar}
                      alt="Guru"
                      className="w-8 h-8 rounded-full border border-amber-400 object-cover flex-shrink-0 mt-0.5"
                    />
                  )}
                  <div
                    className={`p-3.5 rounded-2xl max-w-[82%] text-[13px] leading-relaxed shadow ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-tr-none'
                        : 'bg-slate-900 border border-white/15 text-white/90 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isAiThinking && (
                <div className="flex items-center gap-2 text-purple-300 text-[12px] font-bold p-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                  <span>피터 린치 거장이 원전을 바탕으로 답변을 작성 중입니다...</span>
                </div>
              )}
            </div>

            {/* 질문 입력 인풋 바 */}
            <div className="flex gap-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="피터 린치 거장에게 내 종목이나 투자 철학에 대해 질문하세요..."
                className="flex-1 py-3 px-4 bg-slate-950 text-white font-bold text-[14px] rounded-xl border border-white/20 focus:border-purple-400 focus:outline-none placeholder:text-white/40"
              />
              <button
                onClick={() => handleSendMessage()}
                className="px-5 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-[13px] rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-1"
              >
                <span>전송</span>
                <span className="material-symbols-outlined text-[16px]">send</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 💎 5. 거장 선별 추천 종목 뷰 */}
      {studyMode === 'curated_stocks' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-amber-500/20 via-purple-900/40 to-slate-900 p-6 rounded-[2rem] border border-amber-400/50 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[20px]">👑</span>
                <h3 className="text-[19px] font-black text-white">
                  {selectedGuru.nameKo} 알고리즘 100% 충족 선별 종목군
                </h3>
              </div>
              <p className="text-[13px] text-white/80 mt-1">
                토스증권 실시간 재무 데이터 기준 {selectedGuru.nameKo}의 10대 심문을 통과한 실시간 상위 종목 리스트입니다.
              </p>
            </div>

            {!isVip && (
              <button
                onClick={() => setIsVipModalOpen(true)}
                className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[13px] rounded-xl shadow-lg whitespace-nowrap transition-all active:scale-95"
              >
                전체 잠금 해제 (VIP)
              </button>
            )}
          </div>

          <div className="grid gap-3">
            {curatedStocks.map((item) => (
              <div
                key={item.rank}
                className={`p-5 rounded-2xl border transition-all relative overflow-hidden ${
                  item.isUnlocked
                    ? 'bg-slate-900/90 border-indigo-500/40 shadow-xl'
                    : 'bg-slate-950/60 border-white/10 backdrop-blur-sm'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className={`w-8 h-8 rounded-xl font-black text-[14px] flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      item.rank === 1 ? 'bg-amber-400 text-slate-950' : 'bg-white/10 text-white/60'
                    }`}>
                      {item.rank}
                    </span>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-[17px] font-black text-white">
                          {item.stockName}
                        </h4>
                        {item.isTopOne && (
                          <span className="px-2 py-0.2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black rounded-full">
                            ✨ 1위 무료 공개
                          </span>
                        )}
                        {!item.isUnlocked && (
                          <span className="px-2 py-0.2 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black rounded-full">
                            🔒 VIP 전용 잠금
                          </span>
                        )}
                      </div>

                      <p className={`text-[13px] ${item.isUnlocked ? 'text-white/80' : 'text-white/40 blur-xs select-none'}`}>
                        {item.reason}
                      </p>

                      {item.isUnlocked && (
                        <div className="flex flex-wrap items-center gap-3 pt-1 text-[12px] font-bold text-indigo-300">
                          <span>현재가: {item.price?.toLocaleString()}원</span>
                          <span>PEG: {item.peg_ratio}</span>
                          <span>부채비율: {item.debt_to_equity}%</span>
                          <span>점수: {item.score}점 ({item.badge} {item.tier})</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="self-end sm:self-center">
                    {item.isUnlocked ? (
                      <button
                        onClick={() => {
                          onNavigate('diagnosis');
                        }}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-[12px] rounded-xl shadow transition-all active:scale-95"
                      >
                        상세 청문회 보기
                      </button>
                    ) : (
                      <button
                        onClick={() => setIsVipModalOpen(true)}
                        className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 font-extrabold text-[12px] rounded-xl transition-all active:scale-95 flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[15px]">lock</span>
                        <span>VIP 열람하기</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. 전체 요약본 모드 */}
      {studyMode === 'full_text' && (
        <div className="space-y-4">
          <section className="bg-slate-900/85 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] border border-white/20 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-amber-300 font-black text-[18px]">
              <span className="material-symbols-outlined text-[24px]">psychology</span>
              <h3>거장의 핵심 철학 (Core Philosophy)</h3>
            </div>
            <p className="text-[16px] text-white/90 font-bold leading-relaxed bg-slate-950/70 p-5 rounded-2xl border border-white/10 italic">
              "{rule?.core_philosophy}"
            </p>
          </section>

          <section className="bg-slate-900/85 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] border border-white/20 shadow-xl space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-indigo-300 font-black text-[18px]">
                <span className="material-symbols-outlined text-[24px]">menu_book</span>
                <h3>명저 10대 심문 공식 전체 일람</h3>
              </div>
            </div>

            <div className="grid gap-3">
              {questions.map((q, idx) => (
                <div
                  key={q.id}
                  className="bg-slate-950/70 p-4 rounded-2xl border border-white/10 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-white text-[15px]">
                      {idx + 1}. {q.title}
                    </span>
                    <span className="text-[10px] font-bold text-amber-300 bg-white/10 px-2 py-0.5 rounded">
                      {q.type === 'quantitative' ? '정량 공식' : '정성 잣대'}
                    </span>
                  </div>
                  <p className="text-[13px] text-white/80">{q.question}</p>
                  <p className="text-[11px] text-amber-300/80 italic">💬 "{q.quote}"</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* VIP 업그레이드 모달 */}
      <VipUpgradeModal
        isOpen={isVipModalOpen}
        onClose={() => setIsVipModalOpen(false)}
        onUpgradeSuccess={() => setIsVip(true)}
        isVip={isVip}
      />
    </div>
  );
}
