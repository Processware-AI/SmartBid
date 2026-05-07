좋습니다. 바로 **개발팀 투입 가능한 수준의 PRD + API + DB + Agent 설계**까지 구체화하겠습니다.  
(실제로 바로 Jira 티켓 쪼개서 개발 시작 가능한 수준으로 작성합니다)

---

# 📘 PRD.md (개발용 상세 명세)

## 1. 제품명

```text
Bid Execution Platform (BEP)
```

---

## 2. 제품 목표

```text
나라장터 물품입찰 공고를 기반으로
“참여 가능한 입찰만 선별 → 공급사 확보 → 입찰사 매칭 → 실행관리”
까지 자동화하는 AI 플랫폼
```

---

## 3. 핵심 사용자 시나리오

### 시나리오 1 (관리자)

```text
1. 로그인
2. 신규 공고 리스트 확인
3. AI 분석 결과 확인
4. 공급사 요청 버튼 클릭
5. 공급사 응답 확인
6. 입찰사 매칭 승인
7. 프로젝트 생성
```

---

### 시나리오 2 (공급사)

```text
1. Telegram 알림 수신
2. 공급 가능 여부 클릭
3. 단가/납기 입력
4. 제출
```

---

### 시나리오 3 (입찰사)

```text
1. 추천 공고 확인
2. 참여 의사 클릭
3. 자격 자동 검증
4. 참여 확정
```

---

# 4. 기능 요구사항 (FR)

## FR-01 공고 수집

```text
- 나라장터 API 연동
- 10분 단위 수집
- 신규/변경 공고 구분
```

---

## FR-02 공고 관리

```text
- 공고 리스트 조회
- 검색/필터
- 상태 관리
```

---

## FR-03 AI 분석

```text
- 공고 리스크 분석
- 요약 생성
- 참여 가능성 판단
```

---

## FR-04 공급사 관리

```text
- 공급사 등록
- 품목 등록
- 인증서 관리
```

---

## FR-05 공급사 응답

```text
- 메신저 알림
- 응답 수집
- 조건 저장
```

---

## FR-06 입찰사 관리

```text
- 입찰사 등록
- 자격정보 관리
- 실적 관리
```

---

## FR-07 매칭 기능

```text
- 공급사-입찰사 매칭
- 참여 가능 공고 생성
```

---

## FR-08 투찰 분석

```text
- 최소 투찰가 계산
- 권장 투찰가 계산
- 낙찰 확률 추정
```

---

## FR-09 프로젝트 관리

```text
- 상태 관리
- 일정 관리
- 계약/납품/정산 관리
```

---

## FR-10 알림 시스템

```text
- Telegram
- KakaoTalk
- Email
```

---

# 5. 비기능 요구사항 (NFR)

```text
- 응답시간: 2초 이하
- 동시 사용자: 1000명
- 장애 대응: 99.9% SLA
- 보안: JWT + RBAC
```

---

# 6. DB 설계

## 1. bid_notices

```sql
id (PK)
bid_no
title
agency
budget
deadline
status
created_at
```

---

## 2. risk_analysis

```sql
id
bid_id
risk_level
summary
details (JSON)
created_at
```

---

## 3. suppliers

```sql
id
name
category
region
rating
```

---

## 4. supplier_responses

```sql
id
bid_id
supplier_id
price
delivery_days
status
created_at
```

---

## 5. bidders

```sql
id
name
license
region
performance_score
```

---

## 6. matches

```sql
id
bid_id
supplier_id
bidder_id
status
```

---

## 7. projects

```sql
id
bid_id
status
contract_amount
start_date
end_date
```

---

## 8. settlements

```sql
id
project_id
amount
status
paid_at
```

---

# 7. API 설계

## 1. 공고 조회

```http
GET /api/bids
```

---

## 2. 공고 상세

```http
GET /api/bids/{id}
```

---

## 3. 공급사 응답

```http
POST /api/supplier/respond
```

---

## 4. 매칭 생성

```http
POST /api/match
```

---

## 5. 프로젝트 생성

```http
POST /api/project
```

---

## 6. 투찰 분석

```http
POST /api/pricing/analyze
```

---

# 8. Hermes Agent 상세 설계

## Agent 구조

```text
agents/
 ├── collector/
 ├── risk/
 ├── supplier/
 ├── bidder/
 ├── pricing/
 ├── execution/
 └── messenger/
```

---

## Agent 예시 (Risk Agent)

### Input

```json
{
  "title": "노트북 구매",
  "spec": "i7, 16GB",
  "delivery": "30일"
}
```

---

### Output

```json
{
  "risk_level": "medium",
  "risks": [
    "납기 짧음",
    "특정 모델 요구 가능성"
  ]
}
```

---

## Messenger Agent

```text
Trigger:
- 공급 요청
- 참여 요청

Action:
- Telegram 메시지 전송
- 응답 수집
- DB 저장
```

---

# 9. 메시지 플로우

```text
관리자 → Agent → Telegram → 공급사
                ← 응답
                → DB 저장
```

---

# 10. 초기 개발 구조

## Backend 구조

```text
src/
 ├── modules/
 │   ├── bids
 │   ├── suppliers
 │   ├── bidders
 │   ├── projects
 │   └── notifications
 ├── agents/
 ├── integrations/
 └── common/
```

---

## Frontend 구조

```text
pages/
 ├── dashboard
 ├── bids
 ├── suppliers
 ├── bidders
 ├── projects
```

---

# 11. DevOps

```text
- Docker
- GitHub Actions
- AWS ECS / EC2
- RDS PostgreSQL
- S3
```

---

# 12. 1차 개발 로드맵 (현실 기준)

## Phase 1 (4주)

```text
- 공고 수집
- 공고 리스트 UI
- Telegram 연동
```

---

## Phase 2 (4주)

```text
- 공급사 응답
- 기본 매칭
```

---

## Phase 3 (4주)

```text
- AI 분석
- 프로젝트 관리
```

---

# 13. 핵심 성공 포인트

```text
1. 공급사 확보 자동화
2. 빠른 의사결정 (메신저)
3. 실행 중심 플랫폼
4. 데이터 축적 → AI 고도화
```

---

# 14. 다음 단계 (추천)

지금 단계에서 가장 중요한 건 이것입니다:

👉 “이걸 실제로 돌릴 수 있는 구조로 만드는 것”

---

## 다음으로 진행 가능

### 1) 👉 Hermes Agent 실제 Prompt 설계

- Agent별 프롬프트
    
- Tool 연결 구조
    

### 2) 👉 실제 DB DDL / ERD

- 테이블 완성 설계
    

### 3) 👉 MVP 코드 구조 (샘플 코드)

---

원하시면 다음 단계로  
👉 **“Hermes Agent 실제 구현 설계 + Prompt + Tool 정의”**까지 이어서 설계해드리겠습니다.