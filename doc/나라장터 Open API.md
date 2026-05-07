네, 있습니다. **나라장터(조달청 G2B)** 입찰공고 정보를 접근할 수 있는 공식 Open API는 생각보다 잘 갖춰져 있습니다. 특히 최근 **차세대 나라장터 개편**으로 기존 API 일부가 폐기되고 신규 대체 API로 재편되었습니다. ([데이터.go.kr](https://www.data.go.kr/bbs/ntc/selectNotice.do?atchFileId=&nttApiYn=Y&originId=NOTICE_0000000003985&pageIndex=1&searchCondition2=2&searchKeyword1=&utm_source=chatgpt.com "[조달청] 입찰공고정보 외 16종 OPEN API 중단 및 대체 ..."))

## 1. 핵심 공식 Open API (추천 우선순위)

### (A) 조달청 나라장터 입찰공고정보서비스 ⭐ 핵심

- 데이터셋명: **조달청_나라장터 입찰공고정보서비스** ([데이터.go.kr](https://www.data.go.kr/data/15129394/openapi.do?utm_source=chatgpt.com "조달청_나라장터 입찰공고정보서비스"))
    
- 제공기관: 조달청
    
- API 유형: REST
    
- 응답: JSON / XML
    
- 개발계정 호출량:
    
    - 1,000건/일 (기본)
        
    - 운영계정 승격 가능
        

### 제공 데이터

다음 조회 가능:

#### 입찰공고 목록

- 물품 입찰공고
    
- 용역 입찰공고
    
- 공사 입찰공고
    
- 외자 입찰공고
    

#### 입찰공고 상세

- 공고명
    
- 공고번호
    
- 발주기관
    
- 수요기관
    
- 계약방식
    
- 입찰방식
    
- 개찰일시
    
- 참가자격
    
- 업종 제한
    
- 지역 제한
    
- 공동수급 여부
    

#### 부가정보

- 기초금액
    
- 추정가격
    
- 면허 제한 정보
    
- 공고 변경 이력
    
- 참가 가능 지역
    

---

## 2. 공공데이터 개방표준 서비스 (분석용 추천)

### 조달청_나라장터 공공데이터개방표준서비스

([데이터.go.kr](https://www.data.go.kr/data/15058815/openapi.do?utm_source=chatgpt.com "조달청_나라장터 공공데이터개방표준서비스"))

이건 “입찰 공고 조회용” 보다는 **데이터 분석용 DW 성격**이 강합니다.

제공:

- 입찰정보
    
- 낙찰정보
    
- 계약정보
    
- 발주 통계
    
- 개찰 결과
    
- 계약 체결 이력
    

### 활용 용도

특히 이런 서비스 만들 때 좋음:

- 경쟁사 낙찰 패턴 분석
    
- 유망 입찰 추천 엔진
    
- 업종별 조달시장 분석
    
- AI 기반 입찰 탐색 Agent
    

---

# 3. 신청 방법

## 공공데이터포털

(공공데이터포털)

절차:

1. 회원가입
    
2. API 활용 신청
    
3. 인증키(Service Key) 발급
    
4. 개발계정 사용
    
5. 운영계정 전환
    

보통 자동승인. ([데이터.go.kr](https://www.data.go.kr/data/15129394/openapi.do?utm_source=chatgpt.com "조달청_나라장터 입찰공고정보서비스"))

---

# 4. 호출 예시

## REST 예시

```http
GET /getBidPblancListInfoServcPPSSrch
?serviceKey=인증키
&pageNo=1
&numOfRows=100
&inqryDiv=1
&bidNtceNm=소프트웨어
```

### Python 예시

```python
import requests

url = "API_ENDPOINT"
params = {
    "serviceKey":"YOUR_KEY",
    "pageNo":1,
    "numOfRows":100,
    "bidNtceNm":"정보보호"
}

r = requests.get(url, params=params)
print(r.json())
```

---

# 5. 검색 조건(중요)

필터링 가능:

- 키워드
    
- 업종코드
    
- 공고일
    
- 개찰일
    
- 발주기관
    
- 지역제한
    
- 금액범위
    
- 업무구분(공사/물품/용역)
    

이거 조합하면 **맞춤형 입찰 모니터링 시스템** 가능.

---

# 6. 만들 수 있는 서비스 아이디어 (사용자님 관점에서 특히 유망)

## (1) AI 입찰 추천 Agent

- 나라장터 API 수집
    
- 적합 공고 자동 추천
    
- 제안 성공률 스코어링
    
- 알림/대시보드
    

→ "조달형 AI Agent"

---

## (2) RFP 분석 + 제안서 초안 생성

입찰공고문 가져와서

- 요구사항 분석
    
- 수행계획 초안
    
- 공수 견적
    
- 제안서 골격 자동 생성
    

(사용자님 AI PMO 구상과 잘 맞음)

---

## (3) 조달 시장 인텔리전스 플랫폼

- 경쟁사 낙찰 추적
    
- 발주기관 수요 예측
    
- 입찰 트렌드 분석
    
- 신사업 기회 탐지
    

---

# 7. 기술 아키텍처 추천

아주 실무적으로 하면:

```text
나라장터 Open API
  ↓
수집 모듈 (Python/FastAPI)
  ↓
DB(PostgreSQL)
  ↓
Vector DB(RAG)
  ↓
LLM Agent
  ↓
입찰 추천/분석 서비스
```

n8n + Hermes Agent 구조에도 붙일 수 있습니다.

---

# 8. 주의할 점 (중요)

## 기존 API 폐기

기존 17종 Open API 일부 폐기  
→ 신규 대체 API 사용 필요 (2025 이후) ([데이터.go.kr](https://www.data.go.kr/bbs/ntc/selectNotice.do?atchFileId=&nttApiYn=Y&originId=NOTICE_0000000003985&pageIndex=1&searchCondition2=2&searchKeyword1=&utm_source=chatgpt.com "[조달청] 입찰공고정보 외 16종 OPEN API 중단 및 대체 ..."))

이건 꼭 신규 서비스 기준으로 설계해야 함.

---

# 9. 추가로 보면 좋은 비공식/민간 데이터 소스

- 나라장터 직접 검색
    
- 지투비플러스 (민간 입찰 분석) ([G2B Plus](https://www.g2bplus.kr/?utm_source=chatgpt.com "지투비플러스-나라장터 입찰정보 검색서비스"))
    
- 조달청 RSS/공고 알림 연계
    

공식 API + 민간 분석 데이터 조합하면 더 강력.

---

## 제 의견

사용자님이 구상하시는  
**“AI 기반 공공조달 제안/입찰 Agent 플랫폼”** 으로 확장 가능성이 꽤 큽니다.

- 나라장터 API 수집
    
- RFP 분석
    
- 제안서 생성
    
- 입찰 기회 추천
    
- 낙찰 가능성 분석
    

이건 거의 하나의 vertical SaaS 주제가 됩니다.

원하시면 다음 단계로  
**나라장터 Open API 기반 “입찰 분석 AI Agent” 아키텍처**도 설계해드릴 수 있습니다.