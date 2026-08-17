from typing import Dict, Any, Optional, List
from pydantic import BaseModel, Field

class FinancialData(BaseModel):
    peg_ratio: Optional[float] = Field(None, description="PEG 비율 (PER / 성장률)")
    institutional_ownership: Optional[float] = Field(None, description="기관 지분율 (%)")
    debt_to_equity: Optional[float] = Field(None, description="부채비율 (%)")
    roe: Optional[float] = Field(None, description="자기자본이익률 ROE (%)")
    per: Optional[float] = Field(None, description="주가수익비율 PER")
    pbr: Optional[float] = Field(None, description="주가순자산비율 PBR")

class EvaluationRequest(BaseModel):
    guru_id: str = Field("peter_lynch", description="진단할 구루 ID (예: peter_lynch)")
    stock_name: str = Field(..., description="진단 대상 종목명 (예: 삼성전자, 테슬라)")
    category_id: Optional[str] = Field("대형우량주", description="1심 기업 유형")
    financial_data: Optional[FinancialData] = None
    qualitative_answers: Optional[Dict[str, bool]] = Field(default_factory=dict, description="정성 심문 질문별 응답 (Q01: true 등)")

class VerdictInfo(BaseModel):
    tier: str
    badge: str
    action: str
    verdict_text: str

class EvaluationDetail(BaseModel):
    id: str
    title: str
    score: int
    max_score: int
    quote: str

class EvaluationResponse(BaseModel):
    status: str = "success"
    guru_name: str
    stock_name: str
    category: str
    total_score: int
    max_score: int = 100
    verdict: VerdictInfo
    details: List[EvaluationDetail]