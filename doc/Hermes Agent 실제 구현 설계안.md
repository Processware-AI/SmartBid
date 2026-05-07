# Hermes Agent 실제 구현 설계안

## 1. 목표 구조

이 플랫폼에서 Hermes Agent는 단순 챗봇이 아니라 **입찰 실행 업무를 자동 수행하는 백오피스 AI 실무자**입니다.

```text
Web Application
        ↓
Agent Orchestrator
        ↓
Hermes Agent Profiles
        ↓
Tools / APIs / DB / Messenger
        ↓
관리자 · 공급사 · 입찰참여업체
```

---

# 2. Hermes Agent 구성

## Agent 1. Collector Agent

### 역할

나라장터 물품공고를 주기적으로 수집하고 신규/변경 공고를 구분합니다.

### 주요 작업

```text
- 나라장터 API 호출
- 신규 공고 저장
- 변경 공고 감지
- 첨부파일 URL 수집
- 분석 대기 상태로 전환
```

### Output

```json
{
  "bid_notice_id": "BN-2026-0001",
  "status": "NEW",
  "next_action": "RISK_ANALYSIS_REQUIRED"
}
```

---

## Agent 2. Risk Analysis Agent

### 역할

공고문, 규격서, 첨부파일을 분석해서 참여 리스크를 판단합니다.

### 분석 기준

```text
- 납기
- 규격 명확성
- 특정 브랜드 제한
- 인증 요구
- 납품 장소
- 검수 조건
- 계약이행보증
- 하자보증
- 지체상금
- 예산 적정성
```

### Prompt 초안

```text
너는 공공 물품입찰 리스크 분석 전문가다.

입력된 공고 정보와 첨부 문서를 분석하여 다음 항목을 판단하라.

1. 공고 요약
2. 주요 납품 품목
3. 공급 가능성
4. 납기 리스크
5. 규격 리스크
6. 인증/시험성적서 요구
7. 계약/검수 리스크
8. 참여 권고 여부
9. 공급사에게 확인해야 할 질문
10. 입찰참여업체에게 전달할 요약

출력은 반드시 JSON 형식으로 작성하라.
```

### Output

```json
{
  "risk_level": "MEDIUM",
  "summary": "노트북 120대 납품 공고이며 납기와 인증서 확인이 필요함",
  "risks": [
    {
      "type": "DELIVERY",
      "level": "HIGH",
      "description": "계약 후 20일 이내 납품 요구"
    }
  ],
  "supplier_questions": [
    "해당 규격 노트북 120대 공급 가능 여부",
    "계약 후 20일 이내 납품 가능 여부",
    "KC 인증서 제출 가능 여부"
  ],
  "recommendation": "SUPPLIER_CHECK_REQUIRED"
}
```

---

## Agent 3. Supplier Matching Agent

### 역할

공고에 적합한 공급사를 찾고, 메신저로 공급 가능 여부를 확인합니다.

### 매칭 기준

```text
- 품목 카테고리
- 브랜드/모델
- 공급 가능 지역
- 납기 대응력
- 인증 보유 여부
- 과거 응답률
- 과거 납품 성공률
```

### Prompt 초안

```text
너는 물품입찰 공급사 매칭 담당자다.

입찰공고 분석 결과와 공급사 DB를 비교하여 공급 가능성이 높은 공급사를 추천하라.

다음 기준으로 점수를 계산하라.
- 품목 적합성 30점
- 납기 대응력 20점
- 인증 대응력 15점
- 가격 경쟁력 15점
- 과거 신뢰도 20점

상위 공급사와 문의 메시지를 생성하라.
```

### Output

```json
{
  "recommended_suppliers": [
    {
      "supplier_id": "SUP-001",
      "score": 91,
      "reason": "노트북 공급 이력 보유, 수도권 납품 가능, 응답률 높음"
    }
  ],
  "message": "신규 공고 공급 가능 여부를 확인해주세요..."
}
```

---

## Agent 4. Bidder Matching Agent

### 역할

공급사가 확보된 공고를 입찰참여업체와 매칭합니다.

### 매칭 기준

```text
- 나라장터 입찰 참여 가능 여부
- 업종/품목 적합성
- 지역 제한
- 신용/계약 가능성
- 과거 투찰 이력
- 관리자 신뢰도
```

### Prompt 초안

```text
너는 공공 물품입찰 참여업체 매칭 담당자다.

공급사가 확보된 공고에 대해 입찰참여업체 후보를 선별하라.

다음 항목을 판단하라.
1. 참여 자격 충족 여부
2. 입찰 참여 적합성
3. 계약 수행 리스크
4. 추천 순위
5. 입찰참여업체에게 보낼 메시지
```

---

## Agent 5. Pricing Agent

### 역할

투찰 가능 가격, 최소 마진, 추천 투찰가를 계산합니다.

### 입력값

```text
- 기초금액
- 추정가격
- 공급단가
- 물류비
- 인증/서류 비용
- 플랫폼 수수료
- 입찰참여업체 마진
- 예상 낙찰률
```

### 계산식

```text
총원가 = 공급단가 + 물류비 + 제비용 + 플랫폼 수수료
최소투찰가 = 총원가 / (1 - 최소마진율)
권장투찰가 = 예상 낙찰률 기반 가격
예상수익 = 권장투찰가 - 총원가
```

### Output

```json
{
  "cost_total": 132000000,
  "minimum_bid_price": 145000000,
  "recommended_bid_price": 151000000,
  "expected_margin": 19000000,
  "margin_rate": 12.6,
  "pricing_decision": "BID_POSSIBLE"
}
```

---

## Agent 6. Execution Manager Agent

### 역할

입찰 이후 계약, 납품, 검수, 정산까지 상태를 추적합니다.

### 상태 전이

```text
NEW
→ ANALYZING
→ SUPPLIER_CHECKING
→ SUPPLIER_CONFIRMED
→ BIDDER_MATCHING
→ PARTICIPATION_CONFIRMED
→ DOCUMENT_PREPARING
→ BID_SUBMITTED
→ AWARDED
→ CONTRACTED
→ DELIVERING
→ INSPECTION
→ SETTLEMENT
→ COMPLETED
```

### 주요 알림

```text
- 입찰 마감 D-3
- 서류 미제출
- 계약 체결 필요
- 납품 예정 D-5
- 검수 지연
- 정산 예정
```

---

## Agent 7. Messenger Agent

### 역할

Telegram, KakaoTalk, Email을 통해 알림을 보내고 응답을 수집합니다.

### 메시지 유형

```text
- 공급 가능 여부 확인
- 단가/납기 입력 요청
- 입찰 참여 의사 확인
- 관리자 승인 요청
- 마감 알림
- 납품/정산 알림
```

### Telegram 메시지 예시

```text
[공급 가능 여부 확인]

공고명: ○○기관 업무용 노트북 구매
수량: 120대
예산: 1.8억
납기: 계약 후 20일

확인 요청:
1. 공급 가능 여부
2. 공급 단가
3. 납기
4. 인증서 제출 가능 여부

버튼:
[공급 가능] [조건부 가능] [공급 불가]
```

---

# 3. Tool 정의

Hermes Agent가 사용할 Tool은 다음과 같이 나눕니다.

## 3.1 나라장터 API Tool

```json
{
  "name": "g2b_search_bid_notices",
  "description": "나라장터 물품입찰 공고를 검색한다.",
  "input_schema": {
    "keyword": "string",
    "from_date": "string",
    "to_date": "string",
    "page": "number"
  }
}
```

---

## 3.2 DB Tool

```json
{
  "name": "save_bid_notice",
  "description": "수집한 입찰공고를 DB에 저장한다."
}
```

```json
{
  "name": "get_supplier_candidates",
  "description": "공고 조건에 맞는 공급사 후보를 조회한다."
}
```

```json
{
  "name": "save_supplier_response",
  "description": "공급사 응답을 저장한다."
}
```

---

## 3.3 Messenger Tool

```json
{
  "name": "send_telegram_message",
  "description": "Telegram으로 메시지를 전송한다.",
  "input_schema": {
    "chat_id": "string",
    "message": "string",
    "buttons": "array"
  }
}
```

```json
{
  "name": "send_kakao_alert",
  "description": "카카오 알림톡을 전송한다.",
  "input_schema": {
    "phone": "string",
    "template_id": "string",
    "variables": "object"
  }
}
```

---

## 3.4 Pricing Tool

```json
{
  "name": "calculate_bid_price",
  "description": "공급가, 비용, 마진율을 기반으로 투찰가를 계산한다.",
  "input_schema": {
    "supply_price": "number",
    "logistics_cost": "number",
    "extra_cost": "number",
    "platform_fee_rate": "number",
    "target_margin_rate": "number"
  }
}
```

---

# 4. Agent Workflow

## Workflow 1. 신규 공고 처리

```text
1. Collector Agent가 신규 공고 수집
2. DB에 저장
3. Risk Analysis Agent 실행
4. 리스크 분석 결과 저장
5. Supplier Matching Agent 실행
6. 공급사 후보 도출
7. Messenger Agent가 공급 요청 발송
8. 공급사 응답 대기
```

---

## Workflow 2. 공급사 응답 처리

```text
1. 공급사가 Telegram/KakaoTalk으로 응답
2. Messenger Agent가 응답 파싱
3. supplier_responses 저장
4. Pricing Agent 실행
5. 관리자에게 참여 가능성 리포트 발송
```

---

## Workflow 3. 입찰참여업체 매칭

```text
1. 공급사 확정
2. Bidder Matching Agent 실행
3. 입찰참여업체 후보 추천
4. 메신저로 참여 의사 확인
5. 응답 저장
6. 관리자 승인
7. 참여가능건 생성
```

---

## Workflow 4. 낙찰 후 실행관리

```text
1. 낙찰 상태 입력
2. 프로젝트 자동 생성
3. 계약 일정 등록
4. 납품 일정 등록
5. 검수 체크
6. 정산 관리
7. 완료 처리
```

---

# 5. Hermes Profile 파일 예시

## risk_agent.md

```markdown
# Role
당신은 공공 물품입찰 리스크 분석 전문가입니다.

# Objective
입찰공고와 첨부문서를 분석하여 공급 가능성, 참여 가능성, 계약 리스크를 판단합니다.

# Input
- 공고 기본정보
- 공고문 텍스트
- 규격서 텍스트
- 첨부파일 텍스트

# Analysis Criteria
1. 납기 리스크
2. 규격 리스크
3. 인증 리스크
4. 특정 모델 제한
5. 검수 조건
6. 계약 조건
7. 수익성 리스크

# Output Format
JSON only.

{
  "summary": "",
  "risk_level": "LOW|MEDIUM|HIGH|CRITICAL",
  "risks": [],
  "supplier_questions": [],
  "bidder_notice": "",
  "recommendation": ""
}
```

---

## supplier_matching_agent.md

```markdown
# Role
당신은 물품입찰 공급사 매칭 담당자입니다.

# Objective
공고 조건에 맞는 공급사 후보를 선별하고 공급 가능 여부 확인 메시지를 작성합니다.

# Scoring
- 품목 적합성: 30
- 납기 대응력: 20
- 인증 대응력: 15
- 가격 경쟁력: 15
- 신뢰도: 20

# Output Format
JSON only.
```

---

## pricing_agent.md

```markdown
# Role
당신은 물품입찰 투찰 가격 검토 전문가입니다.

# Objective
공급가와 비용 구조를 기반으로 최소투찰가, 권장투찰가, 예상수익을 계산합니다.

# Rules
- 손실 가능성이 있으면 BID_NOT_RECOMMENDED
- 마진율이 최소 기준보다 낮으면 WARNING
- 납기 리스크가 높으면 risk_adjustment_cost를 반영

# Output Format
JSON only.
```

---

# 6. Web Application과 Agent 연동 방식

## 방식 A. Web App이 Agent를 호출

```text
관리자 버튼 클릭
→ Backend API 호출
→ Agent Task 생성
→ Hermes Agent 실행
→ 결과 DB 저장
→ Web UI에 표시
```

예:

```http
POST /api/agent-tasks
```

```json
{
  "agent_type": "RISK_ANALYSIS",
  "target_type": "BID_NOTICE",
  "target_id": "BN-2026-0001"
}
```

---

## 방식 B. Agent가 스케줄 기반 실행

```text
Cron/Scheduler
→ Collector Agent 실행
→ 신규 공고 발견
→ 후속 Agent 자동 실행
```

---

## 방식 C. Messenger 응답 기반 실행

```text
Telegram 응답 수신
→ Webhook
→ Backend 저장
→ Pricing Agent 자동 실행
→ 관리자에게 결과 알림
```

---

# 7. 실제 운영 시 권장 구조

초기에는 완전 자동화보다 **Human-in-the-loop** 구조가 안전합니다.

```text
AI 분석
→ 관리자 검토
→ 공급사 발송 승인
→ 공급사 응답
→ AI 가격 분석
→ 관리자 승인
→ 입찰사 매칭
```

즉, Hermes Agent는 “자동 결정자”가 아니라 처음에는 **AI 실무 보조자**로 시작하는 것이 좋습니다.

---

# 8. MVP에서 반드시 구현할 Agent

초기 1차 MVP에는 아래 4개만 구현하면 됩니다.

```text
1. Collector Agent
2. Risk Analysis Agent
3. Supplier Matching Agent
4. Messenger Agent
```

Pricing Agent와 Bidder Matching Agent는 2차 MVP로 넘겨도 됩니다.

---

# 9. MVP 개발 우선순위

## 1순위

```text
나라장터 공고 수집
공고 리스트
공고 상세
공급사 DB
Telegram 발송
공급사 응답 저장
```

## 2순위

```text
AI 리스크 분석
공급사 추천
관리자 승인 플로우
```

## 3순위

```text
입찰사 매칭
투찰가 계산
프로젝트 실행관리
```

---

# 10. 최종 구현 개념

이 시스템은 다음 3개가 결합된 구조입니다.

```text
1. Web Application
사람이 보는 운영 시스템

2. Hermes Agent
입찰 분석과 실행을 보조하는 AI 실무자

3. Messenger
공급사·입찰사와 빠르게 연결되는 실행 채널
```

한 줄로 정리하면:

> **“Web App은 관제센터, Hermes Agent는 실무자, Messenger는 현장 커뮤니케이션 채널”** 입니다.