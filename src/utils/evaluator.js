// Guru Evaluator Engine (100% Client-Side Pure Calculation Engine)

export function evaluateStock({
  ruleData,
  stockName,
  category,
  financialData = {},
  qualitativeAnswers = {}
}) {
  if (!ruleData) {
    throw new Error('Rule data is required for evaluation');
  }

  let totalScore = 0;
  let maxScore = 0;
  const details = [];

  const questions = ruleData.hearing_questions || [];

  for (const q of questions) {
    const qid = q.id;
    const weight = q.weight || 10;
    maxScore += weight;

    let score = 0;
    let isPass = false;
    let actualValue = null;

    // 정량 지표 채점
    if (q.type === 'quantitative' && q.metric && financialData[q.metric] !== undefined && financialData[q.metric] !== null) {
      const val = parseFloat(financialData[q.metric]);
      actualValue = val;
      const metric = q.metric;

      if (metric === 'peg_ratio') {
        if (val <= 1.0) score = weight;
        else if (val <= 1.5) score = Math.floor(weight / 2);
        else score = 0;
      } else if (metric === 'institutional_ownership') {
        if (val <= 30.0) score = weight;
        else if (val <= 60.0) score = Math.floor(weight / 2);
        else score = 0;
      } else if (metric === 'debt_to_equity') {
        if (val <= 50.0) score = weight;
        else if (val <= 100.0) score = Math.floor(weight / 2);
        else score = 0;
      } else if (metric === 'roe') {
        if (val >= 15.0) score = weight;
        else if (val >= 10.0) score = Math.floor(weight / 2);
        else score = 0;
      } else if (metric === 'pbr') {
        if (val <= 0.8) score = weight;
        else if (val <= 1.2) score = Math.floor(weight / 2);
        else score = 0;
      } else if (metric === 'per') {
        if (val <= 10.0) score = weight;
        else if (val <= 20.0) score = Math.floor(weight / 2);
        else score = 0;
      } else {
        score = qualitativeAnswers[qid] ? weight : 0;
      }
      isPass = score > 0;
    } else {
      // 정성 지표 채점 (사용자 응답 True/False)
      isPass = qualitativeAnswers[qid] !== undefined ? !!qualitativeAnswers[qid] : true;
      score = isPass ? weight : 0;
    }

    totalScore += score;

    details.push({
      id: qid,
      phase: q.phase,
      title: q.title,
      type: q.type,
      metric: q.metric,
      benchmark: q.benchmark,
      actualValue: actualValue,
      score: score,
      maxScore: weight,
      isPass: isPass,
      question: q.question,
      quote: q.quote
    });
  }

  // 100점 만점 기준 정규화
  const normalizedTotalScore = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

  // 최종 판결 매트릭스 도출
  let finalVerdict = null;
  const verdictMatrix = ruleData.verdict_matrix || [];

  for (const v of verdictMatrix) {
    if (normalizedTotalScore >= v.min_score && normalizedTotalScore <= v.max_score) {
      finalVerdict = {
        tier: v.tier,
        badge: v.badge,
        action: v.action,
        verdict_text: v.verdict_text
      };
      break;
    }
  }

  if (!finalVerdict) {
    finalVerdict = {
      tier: '판결 보류 (데이터 재확인)',
      badge: '⚖️',
      action: '재무 및 정성 답변 재입력',
      verdict_text: '입력된 지표 점수가 판결 기준 매트릭스를 벗어났습니다.'
    };
  }

  return {
    status: 'success',
    timestamp: new Date().toISOString(),
    guru_id: ruleData.guru_id,
    guru_name: ruleData.guru_name_ko || '투자 구루',
    stock_name: stockName || '진단 대상 종목',
    category: category || '대형우량주',
    total_score: normalizedTotalScore,
    raw_score: totalScore,
    max_score: 100,
    verdict: finalVerdict,
    details: details,
    financial_data: financialData
  };
}
