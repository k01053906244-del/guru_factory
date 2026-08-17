import React from 'react';
import { motion } from 'framer-motion';

export default function BookSummaryView({ bookData, onNavigate }) {
  if (!bookData) return null;

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header Info */}
      <div className="bg-gradient-to-br from-primary/10 via-surface-container to-secondary/10 p-6 md:p-8 rounded-[2.5rem] border border-primary/20 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
          <img
            src={bookData.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuDYpEdl9w7mMgImKMZxPDVPZbP6aJ3tb_M6iDOawhMALJnbfh9G8oZko2fG_yEgnGpno8YP2upgUOrSCv8wXEgL-uUs4-NUDKQ03yoxzxpDZBk-42W1_U8cqEDYhP8LCTt_eATpaYQV0DMzhNMZ7Ab3rRX4ratPoCqGAwctU57vCI6PpuSkoT0Ph3HdL9zrCaDvXJubp1hgM0GRG7Jz0c5G5TOOFC8hzMzWv94R6xCnrUDHukGaRa303A"}
            alt={bookData.masterName}
            className="w-16 h-16 rounded-full border-2 border-primary object-cover shadow-lg"
          />
          <div>
            <span className="text-[11px] font-extrabold text-secondary tracking-wider uppercase">
              {bookData.masterTitle}
            </span>
            <h2 className="text-[26px] md:text-[32px] font-extrabold text-on-background leading-tight">
              《{bookData.title}》
            </h2>
            <p className="text-label-md text-on-surface-variant">
              저자: {bookData.author} · {bookData.era}
            </p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-outline-variant/30">
          <p className="text-body-md font-bold text-primary italic">
            "{bookData.overview.keyQuote}"
          </p>
        </div>
      </div>

      {/* Core Philosophy Section */}
      <section className="bg-white p-6 md:p-8 rounded-[2rem] border border-outline-variant/30 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-primary font-extrabold text-headline-md">
          <span className="material-symbols-outlined text-[28px]">psychology</span>
          <h3>거장의 핵심 관점 (Core Philosophy)</h3>
        </div>
        <p className="text-body-md text-on-surface leading-relaxed">
          {bookData.overview.corePhilosophy}
        </p>
        <p className="text-label-md text-on-surface-variant bg-surface-container-low p-3.5 rounded-xl">
          💡 <strong>시대적 맥락:</strong> {bookData.overview.historicalContext}
        </p>
      </section>

      {/* Key Principles List */}
      <section className="space-y-4">
        <h3 className="text-[22px] font-extrabold text-on-background px-1 flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary text-[26px]">star</span>
          피터 린치의 4대 핵심 원칙
        </h3>

        <div className="grid gap-4">
          {bookData.keyPrinciples.map((principle) => (
            <motion.div
              key={principle.id}
              whileHover={{ y: -2 }}
              className="bg-white p-6 rounded-2xl border border-outline-variant/40 shadow-sm space-y-2"
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-primary-fixed text-on-primary-fixed font-extrabold flex items-center justify-center text-label-md flex-shrink-0">
                  {principle.id}
                </span>
                <h4 className="font-extrabold text-on-background text-body-lg">
                  {principle.title}
                </h4>
              </div>
              <p className="text-body-md text-on-surface-variant pl-11">
                {principle.description}
              </p>
              <div className="ml-11 mt-2 p-3 bg-tertiary-fixed-dim/20 rounded-xl text-on-tertiary-fixed-variant text-label-md flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span><strong>실전 적용:</strong> {principle.actionTip}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Buy / Sell Rules */}
      <section className="grid md:grid-cols-2 gap-4">
        {/* Buy Conditions */}
        <div className="bg-tertiary-container/5 p-6 rounded-[2rem] border border-tertiary-container/20 space-y-3">
          <div className="flex items-center gap-2 text-tertiary font-extrabold text-body-lg">
            <span className="material-symbols-outlined text-[24px]">add_circle</span>
            <h4>매수 검토 조건 (Buy Signals)</h4>
          </div>
          <ul className="space-y-2 text-body-md text-on-surface">
            {bookData.buySellRules.buyConditions.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-tertiary font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Sell Conditions */}
        <div className="bg-error-container/20 p-6 rounded-[2rem] border border-error/20 space-y-3">
          <div className="flex items-center gap-2 text-error font-extrabold text-body-lg">
            <span className="material-symbols-outlined text-[24px]">do_not_disturb_on</span>
            <h4>매도 검토 조건 (Sell Signals)</h4>
          </div>
          <ul className="space-y-2 text-body-md text-on-surface">
            {bookData.buySellRules.sellConditions.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-error font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <button
          onClick={() => onNavigate('chat')}
          className="py-4 px-4 bg-primary text-white font-extrabold rounded-2xl flex items-center justify-center gap-2 shadow-md hover:bg-primary-container transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">forum</span>
          <span>거장 AI 대화</span>
        </button>
        <button
          onClick={() => onNavigate('world')}
          className="py-4 px-4 bg-gradient-to-r from-secondary-container to-secondary text-white font-extrabold rounded-2xl flex items-center justify-center gap-2 shadow-md hover:opacity-90 transition-opacity"
        >
          <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
          <span>뷰빈과 함께 거장 만나러 가기</span>
        </button>
      </div>
    </div>
  );
}
