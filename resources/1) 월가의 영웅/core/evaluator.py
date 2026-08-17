import json
import os
from typing import Dict, Any, Optional
from .models import EvaluationRequest, EvaluationResponse, VerdictInfo, EvaluationDetail

class GuruEvaluator:
    def __init__(self, rules_dir: Optional[str] = None):
        if rules_dir is None:
            self.rules_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "rules")
        else:
            self.rules_dir = rules_dir
            
    def load_rules(self, guru_id: str) -> Dict[str, Any]:
        rule_path = os.path.join(self.rules_dir, f"{guru_id}.json")
        if not os.path.exists(rule_path):
            raise FileNotFoundError(f"Rules for guru '{guru_id}' not found at {rule_path}")
        with open(rule_path, "r", encoding="utf-8") as f:
            return json.load(f)

    def evaluate(self, request: EvaluationRequest) -> EvaluationResponse:
        rules = self.load_rules(request.guru_id)
        
        total_score = 0
        details = []
        fin_dict = request.financial_data.model_dump() if request.financial_data else {}
        answers = request.qualitative_answers or {}
        
        for q in rules.get("hearing_questions", []):
            qid = q["id"]
            weight = q.get("weight", 10)
            
            # 정량 지표 평가
            if q.get("type") == "quantitative" and q.get("metric") in fin_dict and fin_dict[q["metric"]] is not None:
                val = fin_dict[q["metric"]]
                metric = q["metric"]
                if metric == "peg_ratio":
                    score = weight if val <= 1.0 else (weight // 2 if val <= 1.5 else 0)
                elif metric == "institutional_ownership":
                    score = weight if val <= 30.0 else (weight // 2 if val <= 60.0 else 0)
                elif metric == "debt_to_equity":
                    score = weight if val <= 50.0 else 0
                else:
                    score = weight if answers.get(qid, True) else 0
            # 정성 지표 평가
            else:
                is_pass = answers.get(qid, True)
                score = weight if is_pass else 0
                
            total_score += score
            details.append(EvaluationDetail(
                id=qid,
                title=q["title"],
                score=score,
                max_score=weight,
                quote=q["quote"]
            ))
            
        # 판결 매트릭스 도출
        final_verdict = None
        for v in rules.get("verdict_matrix", []):
            if v["min_score"] <= total_score <= v["max_score"]:
                final_verdict = VerdictInfo(
                    tier=v["tier"],
                    badge=v["badge"],
                    action=v["action"],
                    verdict_text=v["verdict_text"]
                )
                break
                
        if not final_verdict:
            final_verdict = VerdictInfo(
                tier="미분류",
                badge="❓",
                action="데이터 재확인 필요",
                verdict_text="점수 산출 범위를 벗어났습니다."
            )
            
        return EvaluationResponse(
            guru_name=rules.get("guru_name_ko", request.guru_id),
            stock_name=request.stock_name,
            category=request.category_id or "일반",
            total_score=total_score,
            max_score=100,
            verdict=final_verdict,
            details=details
        )