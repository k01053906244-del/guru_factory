import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GuruScreenerService } from '../../services/guruScreenerService';
import { AuthService } from '../../services/authService';
import VipUpgradeModal from '../common/VipUpgradeModal';
import AuthModal from '../common/AuthModal';
import GuruAudioPlayer from './GuruAudioPlayer';

export default function BookStudyView({ selectedGuru, currentStock, onNavigate }) {
  const [studyMode, setStudyMode] = useState('ppt_slides'); // 'ppt_slides' | 'curated_stocks' | 'ai_coaching' | 'full_text'
  const [slideSubCategory, setSlideSubCategory] = useState('summary'); // 'summary' | 'hearing' | 'samsung_audit'
  const [currentSlideIndex, setCurrentSlideIndex] = useState(1);
  const [curatedStocks, setCuratedStocks] = useState([]);
  const [isVip, setIsVip] = useState(false);
  const [isVipModalOpen, setIsVipModalOpen] = useState(false);

  // 👤 로그인 상태 & 다운로드 게이트 모달
  const [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingDownload, setPendingDownload] = useState(null);

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
    const handleAuthChange = () => {
      setCurrentUser(AuthService.getCurrentUser());
    };
    window.addEventListener('auth_state_changed', handleAuthChange);
    return () => window.removeEventListener('auth_state_changed', handleAuthChange);
  }, []);

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
  const currentSvgPath = `./slides/peter_lynch/${slideSubCategory}/page_0${currentSlideIndex}.svg`;

  // 📥 로그인 인증 기반 PPTX 다운로드 핸들러
  const handleDownloadPptx = (fileUrl, fileName) => {
    if (!AuthService.isLoggedIn()) {
      setPendingDownload({ fileUrl, fileName });
      setIsAuthModalOpen(true);
      return;
    }

    // 로그인된 경우 즉시 다운로드 실행
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    if (pendingDownload) {
      const { fileUrl, fileName } = pendingDownload;
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setPendingDownload(null);
    }
  };

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
      const lower = textToSend.toLowerCase();

      if (lower.includes('유형') || lower.includes('성장') || lower.includes('대형')) {
        reply = `《월가의 영웅》에서 기업은 6가지로 나뉩니다: 1) 저성장주, 2) 대형우량주, 3) 고성장주, 4) 경기순환주, 5) 회생주, 6) 자산주입니다. ${currentStock || '이 종목'}의 성장률과 PER, 배당률을 보면 어디에 속하는지 정확히 진단할 수 있습니다. 10대 청문회를 돌려보셨나요?`;
      } else if (lower.includes('peg') || lower.includes('per') || lower.includes('밸류')) {
        reply = `제가 가장 중요하게 보는 지표는 바로 PEG(PER / 이익성장률)입니다! PEG가 1.0 이하이면 매우 훌륭하고 저평가된 상태입니다. 0.5 이하라면 월가의 황금 보물이지요. 반대로 1.5를 넘어가면 아무리 좋은 회사라도 주가에 거품이 낀 것입니다.`;
      } else if (lower.includes('부채') || lower.includes('안전') || lower.includes('위험')) {
        reply = `위기 때 망하지 않는 회사를 고르는 법은 간단합니다. '부채비율이 50% 이하'이거나 순현금이 시가총액의 상당 부분을 차지하는지 확인하세요. 부채가 없는 회사는 파산할 수 없습니다!`;
      } else {
        reply = `좋은 질문입니다! 《월가의 영웅》의 핵심은 "당신이 이미 알고 있는 일상과 쇼핑몰에서 10루타(1000% 수익) 종목을 찾는 것"입니다. ${currentStock || '이 종목'}의 제품이나 서비스를 소비자들이 열광하며 계속 쓰고 있는지 먼저 확인해 보세요!`;
      }

      setChatMessages([...newMsgs, { sender: 'guru', text: reply }]);
      setIsAiThinking(false);
    }, 900);
  };

  return (
    <div className="space-y-6 pb-16 animate-fadeIn max-w-5xl mx-auto">
      
      {/* 1. 상단 마스터 헤더 & 오디오 서비스 뱃지 */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 rounded-[2.5rem] border border-amber-400/30 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={selectedGuru.avatar}
              alt={selectedGuru.nameKo}
              className="w-16 h-16 rounded-full border-2 border-amber-400 object-cover shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold text-amber-300 uppercase tracking-wider">
                  {selectedGuru.tierBadge}
                </span>
                <span className="text-white/60 text-[12px]">· {selectedGuru.period}</span>
              </div>
              <h2 className="text-[24px] md:text-[30px] font-black text-white leading-tight">
                {selectedGuru.nameKo} 명저 학습실
              </h2>
              <p className="text-body-md text-amber-200/90 font-bold mt-1">
                《{selectedGuru.bookTitle}》
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('diagnosis')}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-[14px] shadow-lg flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">gavel</span>
              <span>10대 청문회 진단하러 가기</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. 🎧 [STEP 04 실현] 피터 린치 실전 명저 오디오 플레이어 (56.3MB) */}
      <GuruAudioPlayer selectedGuru={selectedGuru} />

      {/* 3. 명저 스터디 4대 탭 바 */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setStudyMode('ppt_slides')}
          className={`px-4 py-2.5 rounded-2xl font-black text-[13px] transition-all flex items-center gap-2 cursor-pointer ${
            studyMode === 'ppt_slides'
              ? 'bg-indigo-600 text-white shadow-lg border border-indigo-400/50'
              : 'bg-white/5 hover:bg-white/10 text-white/70'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">slideshow</span>
          <span>📊 PPT 슬라이드 교재 (24장)</span>
        </button>

        <button
          onClick={() => setStudyMode('ai_coaching')}
          className={`px-4 py-2.5 rounded-2xl font-black text-[13px] transition-all flex items-center gap-2 cursor-pointer ${
            studyMode === 'ai_coaching'
              ? 'bg-purple-600 text-white shadow-lg border border-purple-400/50'
              : 'bg-white/5 hover:bg-white/10 text-white/70'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">psychology</span>
          <span>🧠 1:1 대화형 AI 코칭룸</span>
        </button>

        <button
          onClick={() => setStudyMode('curated_stocks')}
          className={`px-4 py-2.5 rounded-2xl font-black text-[13px] transition-all flex items-center gap-2 cursor-pointer ${
            studyMode === 'curated_stocks'
              ? 'bg-amber-500 text-slate-950 shadow-lg border border-amber-300 font-black'
              : 'bg-white/5 hover:bg-white/10 text-white/70'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">stars</span>
          <span>💎 거장 선별 포트폴리오</span>
        </button>

        <button
          onClick={() => setStudyMode('full_text')}
          className={`px-4 py-2.5 rounded-2xl font-black text-[13px] transition-all flex items-center gap-2 cursor-pointer ${
            studyMode === 'full_text'
              ? 'bg-emerald-600 text-white shadow-lg border border-emerald-400/50'
              : 'bg-white/5 hover:bg-white/10 text-white/70'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">rule</span>
          <span>📑 10대 질문 룰셋 총람</span>
        </button>
      </div>

      {/* 📊 3. PPT 슬라이드 모드 (고화질 SVG + PPTX 원본 다운로드 바) */}
      {studyMode === 'ppt_slides' && (
        <div className="space-y-4 animate-fadeIn">
          
          {/* 서브 카테고리 3종 선택 탭 */}
          <div className="flex flex-wrap gap-2 bg-slate-900/80 p-2 rounded-2xl border border-white/10">
            <button
              onClick={() => { setSlideSubCategory('summary'); setCurrentSlideIndex(1); }}
              className={`px-3.5 py-2 rounded-xl text-[12px] font-extrabold transition-all ${
                slideSubCategory === 'summary'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              1. 핵심요약편 (8p)
            </button>
            <button
              onClick={() => { setSlideSubCategory('hearing'); setCurrentSlideIndex(1); }}
              className={`px-3.5 py-2 rounded-xl text-[12px] font-extrabold transition-all ${
                slideSubCategory === 'hearing'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              2. 청문회 워크북 양식 (8p)
            </button>
            <button
              onClick={() => { setSlideSubCategory('samsung_audit'); setCurrentSlideIndex(1); }}
              className={`px-3.5 py-2 rounded-xl text-[12px] font-extrabold transition-all ${
                slideSubCategory === 'samsung_audit'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              3. 삼성전자 실전분석 완료본 (8p)
            </button>
          </div>

          {/* 슬라이드 SVG 뷰어 */}
          <div className="bg-slate-950 rounded-[2rem] border-2 border-indigo-500/40 p-2 md:p-4 shadow-2xl overflow-hidden relative">
            <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-900 flex items-center justify-center border border-white/10">
              <img
                src={currentSvgPath}
                alt={`슬라이드 ${currentSlideIndex}페이지`}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.innerHTML = `
                    <div class="p-8 text-center text-white/70 space-y-2">
                      <span class="material-symbols-outlined text-[48px] text-amber-400">slideshow</span>
                      <p class="font-extrabold text-[16px]">슬라이드 ${currentSlideIndex} / ${totalSlides} 페이지</p>
                      <p class="text-[12px] text-white/40">《${selectedGuru.bookTitle}》 고화질 슬라이드 교재</p>
                    </div>
                  `;
                }}
              />
            </div>
          </div>

          {/* 슬라이드 네비게이션 컨트롤러 */}
          <div className="flex items-center justify-between bg-slate-900/90 p-4 rounded-2xl border border-white/10">
            <button
              onClick={handlePrevSlide}
              disabled={currentSlideIndex <= 1}
              className="px-4 py-1.5 bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white font-extrabold text-[12px] rounded-xl flex items-center gap-1 border border-white/15 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>이전 슬라이드</span>
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalSlides }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => setCurrentSlideIndex(num)}
                  className={`w-7 h-7 rounded-lg text-[12px] font-black transition-all cursor-pointer ${
                    currentSlideIndex === num
                      ? 'bg-amber-400 text-slate-950 font-black scale-110 shadow'
                      : 'bg-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>

            <button
              onClick={handleNextSlide}
              disabled={currentSlideIndex >= totalSlides}
              className="px-4 py-1.5 bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white font-extrabold text-[12px] rounded-xl flex items-center gap-1 border border-white/15 cursor-pointer"
            >
              <span>다음 슬라이드</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

          {/* 📥 실제 PPTX 원본 3종 다운로드 바 (🔒 로그인 게이트 적용) */}
          <div className="bg-gradient-to-r from-indigo-950/90 via-slate-900 to-purple-950/90 p-5 md:p-6 rounded-[2rem] border-2 border-amber-400/50 shadow-2xl space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-amber-300 font-black text-[15px] md:text-[16px]">
                <span className="material-symbols-outlined text-[22px]">download</span>
                <span>대표님 제공 《1) 월가의 영웅》 PPTX 원본 3종 다운로드</span>
              </div>
              
              {/* 로그인 상태 뱃지 */}
              {currentUser ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-[11px] font-black">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{currentUser.name}님 로그인됨 · 다운로드 권한 활성</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/40 rounded-full text-[11px] font-black">
                  <span className="material-symbols-outlined text-[14px]">lock</span>
                  <span>로그인 후 무료 다운로드</span>
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => handleDownloadPptx('./downloads/peter_lynch/1_피터린치_핵심요약편.pptx', '1_피터린치_핵심요약편.pptx')}
                className="py-3 px-3 bg-white/10 hover:bg-white/20 border border-white/15 rounded-2xl font-extrabold text-[12px] text-white flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 text-center cursor-pointer group"
              >
                <span className="material-symbols-outlined text-[18px] text-indigo-400 group-hover:scale-110 transition-transform">
                  {currentUser ? 'description' : 'lock'}
                </span>
                <span>1. 핵심요약편.pptx</span>
                {!currentUser && <span className="text-[10px] text-amber-300 font-bold bg-white/10 px-1.5 py-0.5 rounded">로그인</span>}
              </button>

              <button
                onClick={() => handleDownloadPptx('./downloads/peter_lynch/2_삼성전자_청문회_완료본.pptx', '2_삼성전자_청문회_완료본.pptx')}
                className="py-3 px-3 bg-white/10 hover:bg-white/20 border border-white/15 rounded-2xl font-extrabold text-[12px] text-white flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 text-center cursor-pointer group"
              >
                <span className="material-symbols-outlined text-[18px] text-amber-400 group-hover:scale-110 transition-transform">
                  {currentUser ? 'verified' : 'lock'}
                </span>
                <span>2. 삼성전자_완료본.pptx</span>
                {!currentUser && <span className="text-[10px] text-amber-300 font-bold bg-white/10 px-1.5 py-0.5 rounded">로그인</span>}
              </button>

              <button
                onClick={() => handleDownloadPptx('./downloads/peter_lynch/3_종목청문회_빈양식_워크북.pptx', '3_종목청문회_빈양식_워크북.pptx')}
                className="py-3 px-3 bg-white/10 hover:bg-white/20 border border-white/15 rounded-2xl font-extrabold text-[12px] text-white flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 text-center cursor-pointer group"
              >
                <span className="material-symbols-outlined text-[18px] text-emerald-400 group-hover:scale-110 transition-transform">
                  {currentUser ? 'edit_note' : 'lock'}
                </span>
                <span>3. 빈양식_워크북.pptx</span>
                {!currentUser && <span className="text-[10px] text-amber-300 font-bold bg-white/10 px-1.5 py-0.5 rounded">로그인</span>}
              </button>
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

              <span className="text-[11px] font-extrabold text-emerald-400 bg-emerald-500/20 px-2.5 py-1 rounded-full border border-emerald-500/30">
                실시간 코칭 중
              </span>
            </div>

            {/* 대화 로그 윈도우 */}
            <div className="h-[360px] overflow-y-auto space-y-3 p-4 bg-slate-950/80 rounded-2xl border border-white/10 custom-scrollbar">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-3 ${
                    msg.sender === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-[14px] shadow ${
                    msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-purple-600 text-white'
                  }`}>
                    {msg.sender === 'user' ? '나' : '구루'}
                  </div>

                  <div className={`p-4 rounded-2xl max-w-[80%] text-[13px] leading-relaxed shadow-md ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-slate-900 border border-purple-500/40 text-purple-100 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}

              {isAiThinking && (
                <div className="flex items-center gap-2 text-[12px] text-purple-300 p-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                  <span>피터 린치가 《월가의 영웅》 원전을 참고하여 답변을 정리 중입니다...</span>
                </div>
              )}
            </div>

            {/* 빠른 추천 질문 칩 */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[11px] font-bold text-white/50 self-center mr-1">추천 질문:</span>
              <button
                onClick={() => handleSendMessage(`《${currentStock || '이 종목'}》은 6대 기업 유형 중 어디에 속하나요?`)}
                className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white/80 text-[11px] font-bold rounded-lg border border-white/10"
              >
                🔍 6대 기업 유형 판별법
              </button>
              <button
                onClick={() => handleSendMessage(`피터 린치가 생각하는 이상적인 PEG 비율 기준은 무엇인가요?`)}
                className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white/80 text-[11px] font-bold rounded-lg border border-white/10"
              >
                📊 PEG 비율 기준
              </button>
              <button
                onClick={() => handleSendMessage(`부채비율 50% 기준은 왜 그렇게 엄격하게 보시나요?`)}
                className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white/80 text-[11px] font-bold rounded-lg border border-white/10"
              >
                🛡️ 부채비율 50% 원칙
              </button>
            </div>

            {/* 입력 폼 */}
            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="피터 린치에게 궁금한 투자 기준이나 종목 질문을 입력하세요..."
                className="flex-1 py-3 px-4 bg-slate-950 text-white text-[14px] rounded-xl border border-purple-500/40 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <button
                onClick={() => handleSendMessage()}
                className="px-5 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-[14px] rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-1"
              >
                <span>질문</span>
                <span className="material-symbols-outlined text-[16px]">send</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 💎 5. 거장 선별 포트폴리오 (VIP 스크리너) */}
      {studyMode === 'curated_stocks' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex justify-between items-center bg-slate-900/90 p-4 rounded-2xl border border-white/10">
            <div>
              <h3 className="text-[17px] font-black text-white">
                피터 린치 잣대 80점 이상 충족 종목 리스트
              </h3>
              <p className="text-[12px] text-white/60">
                PEG 1.0 이하, 부채비율 50% 이하 팩트 기준 검증 완료
              </p>
            </div>

            {!isVip && (
              <button
                onClick={() => setIsVipModalOpen(true)}
                className="px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-[12px] rounded-xl shadow transition-all"
              >
                🔒 VIP 전체 50개 종목 열람
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {curatedStocks.map((stock) => (
              <div
                key={stock.name}
                className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2 hover:border-amber-400/50 transition-all"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[11px] font-bold text-amber-300 uppercase">{stock.sector}</span>
                    <h4 className="text-[18px] font-black text-white">{stock.name}</h4>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-400/20 text-amber-300 text-[12px] font-black rounded-lg border border-amber-400/40">
                    {stock.score}점
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-slate-950/60 p-2.5 rounded-xl text-[11px]">
                  <div>
                    <span className="text-white/40 block">PEG</span>
                    <span className="font-extrabold text-white">{stock.peg}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block">부채비율</span>
                    <span className="font-extrabold text-white">{stock.debtRatio}%</span>
                  </div>
                  <div>
                    <span className="text-white/40 block">ROE</span>
                    <span className="font-extrabold text-emerald-400">{stock.roe}%</span>
                  </div>
                </div>

                <p className="text-[12px] text-white/70">{stock.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 📑 6. 10대 질문 룰셋 총람 */}
      {studyMode === 'full_text' && (
        <div className="bg-slate-900/90 p-6 rounded-[2rem] border border-white/10 space-y-4 animate-fadeIn">
          <div className="flex items-center gap-2 text-emerald-400 font-black text-[18px]">
            <span className="material-symbols-outlined text-[24px]">fact_check</span>
            <h3>《{selectedGuru.bookTitle}》 10대 청문회 심문 기준표</h3>
          </div>

          <div className="grid gap-3">
            {questions.map((q, idx) => (
              <div key={q.id} className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-black text-[14px] text-white">
                    {idx + 1}. {q.title}
                  </span>
                  <span className="text-[11px] font-bold text-amber-300 bg-white/10 px-2 py-0.5 rounded">
                    기준: {q.benchmark} (배점: {q.weight}점)
                  </span>
                </div>
                <p className="text-[13px] text-white/80">{q.question}</p>
                <p className="text-[11px] text-amber-300/80 italic">💬 "{q.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIP 모달 */}
      <VipUpgradeModal
        isOpen={isVipModalOpen}
        onClose={() => setIsVipModalOpen(false)}
        onUpgradeSuccess={() => setIsVip(true)}
      />

      {/* 👤 로그인/회원가입 게이트 모달 */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setPendingDownload(null);
        }}
        onLoginSuccess={handleLoginSuccess}
        message="로그인하시면 《월가의 영웅》 PPTX 3종 원본 파일과 워크북을 무료로 즉시 다운로드하실 수 있습니다."
      />
    </div>
  );
}
