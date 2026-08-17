// ========================================================
// 🧠 GURU EVALUATOR (JavaScript / TypeScript for Web & Mobile Apps)
// ========================================================

/**
 * @param {Object} rules - Loaded JSON rules (e.g. require('./rules/peter_lynch.json'))
 * @param {string} stockName - e.g. "삼성전자"
 * @param {string} categoryId - e.g. "대형우량주"
 * @param {Object} answers - e.g. { Q01: true, Q02: true, Q03: false ... }
 * @param {Object} financialData - e.g. { peg_ratio: 0.86, institutional_ownership: 54.0, debt_to_equity: 25.0 }
 */
export function evaluateStock(rules, stockName, categoryId, answers = {}, financialData = {}) {
  let totalScore = 0;
  const details = [];

  for (const q of rules.hearing_questions || []) {
    const qid = q.id;
    const weight = q.weight || 10;
    let score = 0;

    if (q.type === 'quantitative' && financialData[q.metric] !== undefined && financialData[q.metric] !== null) {
      const val = financialData[q.metric];
      if (q.metric === 'peg_ratio') {
        score = val <= 1.0 ? weight : (val <= 1.5 ? Math.floor(weight / 2) : 0);
      } else if (q.metric === 'institutional_ownership') {
        score = val <= 30.0 ? weight : (val <= 60.0 ? Math.floor(weight / 2) : 0);
      } else if (q.metric === 'debt_to_equity') {
        score = val <= 50.0 ? weight : 0;
      } else {
        score = answers[qid] ? weight : 0;
      }
    } else {
      score = answers[qid] ? weight : 0;
    }

    totalScore += score;
    details.push({
      id: qid,
      title: q.title,
      score: score,
      maxScore: weight,
      quote: q.quote
    });
  }

  // Determine Final Verdict
  let finalVerdict = null;
  for (const v of rules.verdict_matrix || []) {
    if (totalScore >= v.min_score && totalScore <= v.max_score) {
      finalVerdict = {
        tier: v.tier,
        badge: v.badge,
        action: v.action,
        verdictText: v.verdict_text
      };
      break;
    }
  }

  return {
    status: 'success',
    guruName: rules.guru_name_ko || '피터 린치',
    stockName: stockName,
    category: categoryId,
    totalScore: totalScore,
    maxScore: 100,
    verdict: finalVerdict,
    details: details
  };
}