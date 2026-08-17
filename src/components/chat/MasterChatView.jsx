import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function MasterChatView({ selectedGuru, evaluationResult, currentStock }) {
  const stockName = currentStock || evaluationResult?.stock_name || '삼성전자';
  const score = evaluationResult?.total_score || 85;
  const tier = evaluationResult?.verdict?.tier || '든든한 우량 방어주';

  const defaultGreeting = `반갑습니다! ${selectedGuru?.nameKo || '피터 린치'}입니다. 지금 진단하신 《${stockName}》(청문회 점수: ${score}점, [${tier}])에 대해 어떤 점이 가장 고민되십니까? 시장의 소음 대신 기업의 진짜 실적과 숫자로 답해드리겠습니다.`;

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'master',
      text: defaultGreeting,
      time: '방금 전',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // 종목 변경 시 인사말 갱신
  useEffect(() => {
    setMessages([
      {
        id: Date.now(),
        sender: 'master',
        text: `《${stockName}》 종목을 보고 계시는군요! 청문회 종합 점수는 ${score}점(${tier})입니다. 이 기업의 PEG 지표나 사업다악화 여부, 혹은 하락장에서의 대응 전략 중 무엇을 상담해드릴까요?`,
        time: '방금 전'
      }
    ]);
  }, [stockName, score, tier]);

  const suggestedQuestions = [
    `"${stockName}" 지금 가격에서 추가 매수해도 될까요?`,
    `"${stockName}"의 PEG 비율과 성장률을 어떻게 보시나요?`,
    `내일 당장 -30% 폭락하면 어떻게 대응해야 하나요?`,
    `피터 린치님이라면 언제 이 종목을 전량 매도하시겠습니까?`
  ];

  const handleSend = (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      let masterReply = `《${stockName}》에 대한 날카로운 질문입니다! 제가 마젤란 펀드를 운용할 때도 늘 강조했듯, 주가가 아니라 '기업의 실적 체력'을 보십시오. 현재 ${stockName}의 청문회 점수는 ${score}점으로 ${tier} 수준입니다.`;

      if (text.includes('매수') || text.includes('사도')) {
        masterReply = `《${stockName}》의 PEG 비율이 1.0 이하이고 부채비율이 안정적이라면 분할 매수는 훌륭한 전략입니다. 다만, "단지 주가가 많이 떨어졌다는 이유" 하나만으로 매수하는 것은 절대 금물입니다!`;
      } else if (text.includes('매도') || text.includes('팔')) {
        masterReply = `기업이 본업과 무관한 엉뚱한 기업을 인수(사업다악화)하거나, 분기 실적에서 재고가 비정상적으로 급증할 때가 바로 매도 신호입니다. 주가가 올랐다고 덜컥 팔지 말고 스토리가 끝났을 때 파십시오.`;
      } else if (text.includes('폭락') || text.includes('하락')) {
        masterReply = `폭락장은 훌륭한 기업의 주식을 바겐세일로 살 수 있는 절호의 선물입니다. 당신이 3년 이상 쓰지 않을 순수한 여유 자금으로 투자했다면, 공포에 질려 파는 사람들의 물량을 담담히 받아내십시오.`;
      }

      const masterMsg = {
        id: Date.now() + 1,
        sender: 'master',
        text: masterReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, masterMsg]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] max-w-4xl mx-auto pb-4 animate-fadeIn">
      {/* 헤더 */}
      <div className="bg-slate-900/85 backdrop-blur-xl p-4 rounded-2xl border border-white/20 shadow-lg flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={selectedGuru.avatar}
              alt={selectedGuru.nameKo}
              className="w-12 h-12 rounded-full border-2 border-amber-400 object-cover shadow-md"
            />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full ring-2 ring-white animate-pulse" />
          </div>
          <div>
            <h3 className="font-black text-white text-body-lg flex items-center gap-2">
              <span>{selectedGuru.nameKo} AI 상담관</span>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold rounded-full border border-emerald-500/30">
                실시간 연결
              </span>
            </h3>
            <p className="text-[12px] text-amber-300 font-bold">
              진단 종목: {stockName} ({score}점 · {tier})
            </p>
          </div>
        </div>

        <span className="px-3 py-1 bg-white/10 text-white/90 rounded-xl text-[12px] font-extrabold border border-white/15 hidden sm:inline-block">
          {selectedGuru.bookTitle}
        </span>
      </div>

      {/* 추천 질문 칩 */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none mb-2">
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="flex-shrink-0 px-3.5 py-2 bg-white/10 hover:bg-indigo-600/80 text-white font-extrabold text-[12px] rounded-xl transition-all border border-white/15 shadow-sm active:scale-95"
          >
            💬 {q}
          </button>
        ))}
      </div>

      {/* 대화 피드 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/80 rounded-2xl border border-white/15 mb-3 shadow-inner">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] md:max-w-[75%] p-4 rounded-2xl shadow-md ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-none'
                  : 'bg-slate-900 border border-white/20 text-white/95 rounded-bl-none'
              }`}
            >
              <div className="flex items-center justify-between gap-4 mb-1">
                <span className="text-[11px] font-black text-amber-300">
                  {msg.sender === 'user' ? '나 (투자자)' : `${selectedGuru.nameKo} AI`}
                </span>
                <span className="text-[10px] text-white/50">{msg.time}</span>
              </div>
              <p className="text-[14px] md:text-[15px] leading-relaxed font-medium">
                {msg.text}
              </p>
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-white/60 text-[13px] italic pl-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" />
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce delay-100" />
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce delay-200" />
            <span>{selectedGuru.nameKo} AI가 투자 원칙을 분석 중입니다...</span>
          </div>
        )}
      </div>

      {/* 입력창 */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={`${stockName}에 대해 구루에게 직접 질문하세요...`}
          className="flex-1 py-3.5 px-5 bg-slate-900/90 text-white font-bold text-[15px] rounded-2xl border border-white/20 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 placeholder:text-white/40 shadow-md"
        />
        <button
          onClick={() => handleSend()}
          disabled={!inputText.trim()}
          className="px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 disabled:opacity-50 text-white font-extrabold rounded-2xl flex items-center gap-2 shadow-lg transition-all active:scale-95"
        >
          <span>전송</span>
          <span className="material-symbols-outlined text-[18px]">send</span>
        </button>
      </div>
    </div>
  );
}
