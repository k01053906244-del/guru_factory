// 구루별 실시간 선별 종목 스크리너 서비스 (무료 1위 공개 + VIP 유료 2~5위 잠금)
import { TossStockApi } from './tossStockApi';
import { evaluateStock } from '../utils/evaluator';

export const GuruScreenerService = {
  // 특정 구루의 기준을 100% 통과한 추천 종목 리스트 실시간 스캔
  getCuratedStocksByGuru: async (guruData, isVipUser = false) => {
    if (!guruData || !guruData.ruleData) return [];

    const popularStocks = TossStockApi.getPopularStocks();
    const evaluatedList = [];

    for (const stockName of popularStocks) {
      try {
        const finRes = await TossStockApi.getStockFinancials(stockName);
        if (finRes && finRes.data) {
          const evalRes = evaluateStock({
            ruleData: guruData.ruleData,
            stockName: stockName,
            category: guruData.ruleData.categories?.[0]?.name || '대형우량주',
            financialData: finRes.data,
            qualitativeAnswers: {
              Q01: true, Q02: true, Q03: true, Q04: true, Q07: true, Q09: true, Q10: true,
              WB01: true, WB02: true, WB04: true, WB05: true,
              BG01: true, BG02: true, BG03: true
            }
          });

          evaluatedList.push({
            stockName,
            financials: finRes.data,
            score: evalRes.total_score,
            verdict: evalRes.verdict,
            passedRatio: `${evalRes.details.filter(d => d.isPass).length}/${evalRes.details.length}`
          });
        }
      } catch (e) {
        console.error('Screener error for:', stockName, e);
      }
    }

    // 점수 높은 순으로 내림차순 정렬
    evaluatedList.sort((a, b) => b.score - a.score);

    // 1위는 무료 공개, 2위 이하는 VIP 결제 상태에 따라 블러/잠금 처리
    return evaluatedList.map((item, index) => {
      const isTopOne = index === 0;
      const isUnlocked = isTopOne || isVipUser;

      return {
        rank: index + 1,
        isUnlocked,
        isTopOne,
        stockName: isUnlocked ? item.stockName : '🔒 VIP 전용 비공개 종목',
        score: item.score,
        tier: item.verdict.tier,
        badge: item.verdict.badge,
        action: item.verdict.action,
        price: isUnlocked ? item.financials.price : '***,***',
        changeRate: isUnlocked ? item.financials.changeRate : 0,
        peg_ratio: isUnlocked ? item.financials.peg_ratio : '**',
        debt_to_equity: isUnlocked ? item.financials.debt_to_equity : '**',
        roe: isUnlocked ? item.financials.roe : '**',
        marketCap: isUnlocked ? item.financials.marketCap : '***조 원',
        sector: isUnlocked ? item.financials.sector : 'VIP 히든 섹터',
        reason: isUnlocked
          ? `${guruData.nameKo}의 잣대로 채점한 결과 ${item.score}점으로 [${item.verdict.tier}] 판결을 받았습니다.`
          : 'VIP 회원만 열람 가능한 실시간 10루타 급등 후보 종목입니다.'
      };
    });
  }
};
