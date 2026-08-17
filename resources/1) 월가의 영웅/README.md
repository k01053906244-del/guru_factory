# 🚀 GURU APP INTEGRATION PACKAGE (투자구루 앱 탑재 패키지)

이 패키지는 **Flutter, React, React Native, Next.js, Node.js, Python(FastAPI)** 등 어떤 웹/모바일 앱에도 그대로 복사해서 즉시 사용할 수 있도록 구성된 **완전 독립형 구루 진단 번들**입니다.

---

## 📁 폴더 구성 및 사용법

```
GURU_APP_PACKAGE/
├── 📁 rules/
│   └── peter_lynch.json       # 구루별 10대 심문 규칙, 가중치, 인용구, 선고 매트릭스
├── 📁 core/
│   ├── evaluator.py          # Python 백엔드용 자동 채점 엔진
│   ├── models.py             # Pydantic 데이터 모델
│   └── evaluator.js          # JavaScript / TypeScript / React / Node.js용 채점 엔진
├── 📁 templates_pptx/
│   ├── 1_피터린치_핵심요약편.pptx  # 무료 유저 배포용 교재
│   ├── 2_삼성전자_청문회_완료본.pptx # 유료 프리미엄 진단 보고서 샘플
│   └── 3_종목청문회_빈양식_워크북.pptx # 유저 출력/타이핑용 워크북
├── 📁 assets_svg/            # 앱 화면에 웹뷰/SVG로 고화질 직접 띄울 수 있는 슬라이드 벡터 파일
│   ├── summary/              # 요약편 1~8페이지 SVG
│   ├── hearing/              # 청문회 워크북 1~8페이지 SVG
│   └── samsung_audit/        # 삼성전자 완료 보고서 1~8페이지 SVG
└── 📁 sample_data/
    └── samsung_audit_result.json # 토스/증권사 연동 후 프론트엔드로 내려줄 표준 JSON 응답 규격
```

---

## 💻 앱 프론트엔드 연동 초간단 예제 (JavaScript / React / Flutter)

```javascript
import { evaluateStock } from './core/evaluator.js';
import rules from './rules/peter_lynch.json';

// 유저가 삼성전자 선택 & 토스 API에서 수치를 받아왔을 때
const result = evaluateStock(
  rules,
  '삼성전자',
  '대형우량주',
  { Q01: true, Q02: true, Q03: false, Q04: true, Q07: true, Q09: true, Q10: true },
  { peg_ratio: 0.86, institutional_ownership: 54.0, debt_to_equity: 25.0 }
);

console.log(result.totalScore); // 85점
console.log(result.verdict.tier); // "든든한 우량 방어주"
console.log(result.verdict.action); // "보유 & 적정가 도달 시 교체 매매"
```