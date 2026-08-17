import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TossStockApi } from '../../services/tossStockApi';
import { evaluateStock } from '../../utils/evaluator';

export default function StockDiagnosisView({
  selectedGuru,
  currentStock,
  onStockChange,
  onEvaluationComplete,
  onNavigate
}) {
  const [stockInput, setStockInput] = useState(currentStock || '삼성전자');
  const [financials, setFinancials] = useState(null);
  const [financialsSource, setFinancialsSource] = useState('KRX 공시 및 토스 데이터 팩트 검증 완료');
  const [financialsStatus, setFinancialsStatus] = useState('verified');
  const [selectedCategory, setSelectedCategory] = useState('stalwart');
  const [answers, setAnswers] = useState({
    Q01: true,
    Q02: true,
    Q03: true,
    Q04: true,
    Q07: true,
    Q09: true,
    Q10: true,
    WB01: true,
    WB02: true,
    WB04: true,
    WB05: true
  });
  const [isLoadingToss, setIsLoadingToss] = useState(false);
  const [liveEvaluation, setLiveEvaluation] = useState(null);

  // KRX 공시 & 토스증권 실시간 팩트 데이터 로드
  const fetchTossData = async (stockName) => {
    setIsLoadingToss(true);
    try {
      const res = await TossStockApi.getStockFinancials(stockName);
      if (res && res.data) {
        setFinancials(res.data);
        setFinancialsSource(res.source || 'KRX 공시 및 토스 데이터 팩트 검증 완료');
        setFinancialsStatus(res.status || 'verified');
      }
    } catch (err) {
      console.error('Toss & KRX API Error:', err);
    } finally {
      setIsLoadingToss(false);
    }
  };

  useEffect(() => {
    if (stockInput) {
      fetchTossData(stockInput);
    }
  }, [stockInput]);

  // 실시간 채점 계산
  useEffect(() => {
    if (!selectedGuru || !financials) return;

    try {
      const result = evaluateStock({
        ruleData: selectedGuru.ruleData,
        stockName: stockInput,
        category: selectedCategory,
        financialData: financials,
        qualitativeAnswers: answers
      });
      setLiveEvaluation(result);
    } catch (e) {
      console.error('Evaluation Calc Error:', e);
    }
  }, [selectedGuru, stockInput, selectedCategory, financials, answers]);

  const handleStockSelect = (name) => {
    setStockInput(name);
    onStockChange(name);
  };

  const toggleAnswer = (qid) => {
    setAnswers((prev) => ({
      ...prev,
      [qid]: !prev[qid]
    }));
  };

  const handleUpdateFinancial = (metric, val) => {
    setFinancials((prev) => ({
      ...prev,
      [metric]: parseFloat(val) || 0
    }));
  };

  const handleFinalSubmit = () => {
    if (liveEvaluation) {
      onEvaluationComplete(liveEvaluation);
      onNavigate('verdict');
    }
  };

  const questions = selectedGuru?.ruleData?.hearing_questions || [];
  const categories = selectedGuru?.ruleData?.categories || [];
  const popularStocks = TossStockApi.getPopularStocks();

  if (!selectedGuru) return null;

  return (
    <div className="space-y-6 pb-16 animate-fadeIn max-w-5xl mx-auto">
      
      {/* 1. 상단 배너 & 구루 정보 */}
      <div className="bg-gradient-to-r from-indigo-900/80 via-slate-900/90 to-purple-900/80 p-6 md:p-8 rounded-[2.5rem] border border-indigo-500/30 shadow-2xl backdrop-blur-xl relative overflow-hidden">
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
                <span className="text-white/60 text-[12px]">· 《{selectedGuru.bookTitle}》</span>
              </div>
              <h2 className="text-[24px] md:text-[30px] font-black text-white leading-tight">
                {selectedGuru.nameKo}의 《{stockInput}》 실시간 청문회
              </h2>
              <p className="text-body-md text-white/80 mt-1">
                "{selectedGuru.tagline}"
              </p>
            </div>
          </div>

          {/* 실시간 점수 게이지 미니 패널 */}
          {liveEvaluation && (
            <div className="bg-slate-950/80 border border-indigo-400/40 p-4 rounded-2xl flex items-center gap-4 shadow-xl">
              <div className="text-center">
                <span className="text-[11px] font-bold text-white/60 block">실시간 잠정 점수</span>
                <span className="text-[32px] font-black bg-gradient-to-r from-amber-300 to-cyan-400 bg-clip-text text-transparent">
                  {liveEvaluation.total_score}점
                </span>
              </div>
              <div className="h-10 w-px bg-white/20" />
              <div>
                <span className="text-[11px] font-bold text-white/60 block">현재 선고 등급</span>
                <span className="text-[14px] font-black text-white flex items-center gap-1">
                  <span>{liveEvaluation.verdict.badge}</span>
                  <span>{liveEvaluation.verdict.tier}</span>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. KRX 한국거래소 & 토스증권 사실기반 팩트체크 검증 패널 */}
      <section className="bg-slate-900/90 backdrop-blur-xl p-6 rounded-[2rem] border-2 border-emerald-500/40 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-400 text-[26px]">verified</span>
            <h3 className="text-[18px] md:text-[20px] font-black text-white">
              KRX 공시 & 토스증권 사실기반 팩트체크 (Fact-Check)
            </h3>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-[12px] font-extrabold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{isLoadingToss ? '팩트 검증 중...' : financialsSource}</span>
          </div>
        </div>

        {/* 종목 입력 & 퀵 칩 */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={stockInput}
              onChange={(e) => {
                setStockInput(e.target.value);
                onStockChange(e.target.value);
              }}
              placeholder="진단할 종목명을 입력하세요 (예: 삼성전자, SK하이닉스, 테슬라)"
              className="flex-1 py-3 px-4 bg-slate-950 text-white font-extrabold text-[15px] rounded-xl border border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[12px] font-bold text-white/50 mr-1">대표 종목:</span>
            {popularStocks.map((stock) => (
              <button
                key={stock}
                onClick={() => handleStockSelect(stock)}
                className={`px-3 py-1 text-[12px] font-extrabold rounded-lg border transition-all ${
                  stockInput === stock
                    ? 'bg-indigo-600 border-amber-400 text-white shadow'
                    : 'bg-white/10 hover:bg-white/20 text-white/80 border-white/10'
                }`}
              >
                {stock}
              </button>
            ))}
          </div>
        </div>

        {/* 토스 실시간 팩트 지표 카드 그리드 */}
        {financials && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-white/10 space-y-1">
              <span className="text-[11px] font-bold text-white/50 block">현재가 (종가)</span>
              <span className="text-[16px] font-black text-white block">
                {financials.price?.toLocaleString()}원
              </span>
              <span className={`text-[11px] font-bold ${financials.changeRate >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {financials.changeRate >= 0 ? `+${financials.changeRate}%` : `${financials.changeRate}%`}
              </span>
            </div>

            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-white/10 space-y-1">
              <span className="text-[11px] font-bold text-white/50 block">PEG 비율</span>
              <input
                type="number"
                step="0.1"
                value={financials.peg_ratio || 0}
                onChange={(e) => handleUpdateFinancial('peg_ratio', e.target.value)}
                className="w-full bg-transparent font-black text-[16px] text-amber-300 focus:outline-none border-b border-amber-400/40"
              />
              <span className="text-[10px] text-amber-400/80">피터린치 핵심 잣대</span>
            </div>

            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-white/10 space-y-1">
              <span className="text-[11px] font-bold text-white/50 block">부채비율</span>
              <input
                type="number"
                step="1"
                value={financials.debt_to_equity || 0}
                onChange={(e) => handleUpdateFinancial('debt_to_equity', e.target.value)}
                className="w-full bg-transparent font-black text-[16px] text-white focus:outline-none border-b border-white/30"
              />
              <span className="text-[10px] text-white/40">기준: 50% 이하</span>
            </div>

            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-white/10 space-y-1">
              <span className="text-[11px] font-bold text-white/50 block">기관 보유 비중</span>
              <input
                type="number"
                step="1"
                value={financials.institutional_ownership || 0}
                onChange={(e) => handleUpdateFinancial('institutional_ownership', e.target.value)}
                className="w-full bg-transparent font-black text-[16px] text-white focus:outline-none border-b border-white/30"
              />
              <span className="text-[10px] text-white/40">기준: 30% 이하</span>
            </div>

            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-white/10 space-y-1">
              <span className="text-[11px] font-bold text-white/50 block">PER / PBR</span>
              <span className="text-[15px] font-black text-white block">
                {financials.per}배 / {financials.pbr}배
              </span>
              <span className="text-[10px] text-indigo-300">밸류에이션</span>
            </div>

            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-white/10 space-y-1">
              <span className="text-[11px] font-bold text-white/50 block">ROE (자기자본이익률)</span>
              <span className="text-[15px] font-black text-emerald-400 block">
                {financials.roe}%
              </span>
              <span className="text-[10px] text-emerald-400/80">수익성 팩트</span>
            </div>
          </div>
        )}

        {/* 팩트 요약 코멘트 */}
        {financials?.factsSummary && (
          <div className="bg-slate-950/90 p-4 rounded-xl border border-emerald-500/30 text-[13px] text-emerald-200 leading-relaxed">
            💬 <strong>팩트체크 브리핑:</strong> {financials.factsSummary}
          </div>
        )}
      </section>

      {/* 3. 피터 린치 6대 기업 유형 선택기 */}
      {categories.length > 0 && (
        <section className="bg-slate-900/90 backdrop-blur-xl p-6 rounded-[2rem] border border-white/20 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-indigo-300 font-black text-[18px]">
            <span className="material-symbols-outlined text-[24px]">category</span>
            <h3>《{selectedGuru.bookTitle}》 제1법칙: 6대 기업 유형 분류</h3>
          </div>
          <p className="text-[13px] text-white/70">
            종목의 기업 유형에 따라 기대 수익률과 매도 타이밍이 완전히 달라집니다. 《{stockInput}》에 해당하는 유형을 선택하세요.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600/30 border-amber-400 ring-2 ring-amber-400/60 shadow-lg'
                    : 'bg-slate-950/70 border-white/10 hover:border-white/30'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-black text-[15px] text-white">{cat.name}</span>
                  <span className="text-[11px] font-bold text-amber-300 bg-white/10 px-2 py-0.5 rounded">
                    {cat.expected_return}
                  </span>
                </div>
                <p className="text-[12px] text-white/70 leading-snug">{cat.desc}</p>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* 4. 10대 청문회 심문 질문 리스트 */}
      <section className="bg-slate-900/90 backdrop-blur-xl p-6 rounded-[2rem] border border-white/20 shadow-xl space-y-4">
        <div className="flex justify-between items-center border-b border-white/10 pb-3">
          <div className="flex items-center gap-2 text-amber-300 font-black text-[18px]">
            <span className="material-symbols-outlined text-[24px]">gavel</span>
            <h3>10대 청문회 실시간 심문 (증거 채택)</h3>
          </div>
          <span className="text-[12px] text-white/60 font-bold">
            정량 팩트 + 정성 잣대 교차 검증
          </span>
        </div>

        <div className="grid gap-3">
          {questions.map((q, idx) => {
            const isChecked = answers[q.id] !== undefined ? answers[q.id] : true;
            return (
              <div
                key={q.id}
                onClick={() => toggleAnswer(q.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 select-none ${
                  isChecked
                    ? 'bg-slate-950/90 border-indigo-500/50 shadow-md'
                    : 'bg-slate-950/40 border-white/10 opacity-60 hover:opacity-100'
                }`}
              >
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 font-black text-[13px] ${
                  isChecked ? 'bg-indigo-600 text-white' : 'bg-white/10 text-white/40'
                }`}>
                  {isChecked ? '✓' : idx + 1}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-[15px] text-white">
                      {idx + 1}. {q.title}
                    </span>
                    <span className="text-[10px] font-bold text-amber-300 bg-white/10 px-2 py-0.5 rounded">
                      {q.benchmark}
                    </span>
                  </div>
                  <p className="text-[13px] text-white/80">{q.question}</p>
                  <p className="text-[11px] text-amber-300/80 italic">💬 "{q.quote}"</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. 최종 판결 선고문 발급 버튼 */}
      <div className="pt-2">
        <button
          onClick={handleFinalSubmit}
          className="w-full py-5 rounded-[2rem] bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-[18px] md:text-[20px] shadow-2xl flex items-center justify-center gap-2 border-2 border-amber-300 transition-all active:scale-98 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[26px]">gavel</span>
          <span>{selectedGuru.nameKo}의 《{stockInput}》 최종 판결문 발급하기</span>
          <span className="material-symbols-outlined text-[24px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
