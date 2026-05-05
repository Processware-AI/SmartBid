/* eslint-disable */
// ============= Smart Bid — Screens (part 1) =============
// Dashboard, Bid List, Bid Detail (with 3 AI treatments)

const { useState, useEffect, useMemo, useRef } = React;

const fmt = {
  won: (n) => "₩" + (n / 1e8).toFixed(n >= 1e9 ? 1 : 2) + "억",
  wonExact: (n) => "₩" + n.toLocaleString("ko-KR"),
  date: (s) => s.replace(/-/g, ".").slice(2),
};

const RiskBadge = ({ level }) => {
  const map = { low: ["ok", "낮음"], medium: ["warn", "보통"], high: ["crit", "높음"] };
  const [cls, label] = map[level] || ["info", level];
  return <span className={`badge ${cls}`}>{label}</span>;
};

// =================== DASHBOARD ===================
function Dashboard({ role, go }) {
  const newBids = window.MOCK_BIDS.filter(b => b.status === "신규").length;
  const totalBudget = window.MOCK_BIDS.reduce((s, b) => s + b.budget, 0);
  const highRisk = window.MOCK_BIDS.filter(b => b.risk === "high").length;
  const activeMatches = 12;

  const stats = role === "supplier" ? [
    { label: "응답 대기 요청", value: "3", change: "+1 오늘", icon: "bell" },
    { label: "이번 달 응답률", value: "94%", change: "+2.1%", icon: "check" },
    { label: "이번 달 매칭 성공", value: "7건", change: "+3", icon: "match" },
    { label: "정산 예정", value: "₩42.6M", change: "5건", icon: "money" },
  ] : role === "bidder" ? [
    { label: "추천 공고", value: "8", change: "+3 오늘", icon: "spark" },
    { label: "참여 진행중", value: "5", change: "총 ₩892M", icon: "package" },
    { label: "낙찰 확률 평균", value: "67%", change: "+4%p", icon: "chart" },
    { label: "용량 사용률", value: "42%", change: "여유 ₩483M", icon: "shield" },
  ] : [
    { label: "신규 공고", value: newBids, change: "+18 오늘", icon: "list" },
    { label: "활성 매칭", value: activeMatches, change: "+3 진행중", icon: "match" },
    { label: "고위험 공고", value: highRisk, change: "검토 필요", icon: "warn", warn: true },
    { label: "총 예산 풀", value: fmt.won(totalBudget), change: "8개 공고", icon: "money" },
  ];

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">대시보드</h1>
          <div className="page-subtitle">
            오늘 {new Date().toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "long" })} · 마지막 동기화 2분 전
          </div>
        </div>
        <div className="page-header-actions">
          <button className="btn ghost"><Icon name="calendar"/>이번 주</button>
          <button className="btn primary" onClick={() => go("bids")}><Icon name="plus"/>새 공고 검토</button>
        </div>
      </div>

      <div className="page-body">
        {/* stat row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 16 }}>
          {stats.map((s, i) => (
            <div key={i} className="card card-pad" style={{ display: "flex", flexDirection: "column", gap: 6, position: "relative" }}>
              <div className="row" style={{ color: "var(--fg-2)", fontSize: "var(--fs-sm)" }}>
                <Icon name={s.icon} size={14}/>
                <span>{s.label}</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1.1 }} className="tnum">{s.value}</div>
              <div className={`badge ${s.warn ? "warn" : "info"}`} style={{ alignSelf: "flex-start" }}>{s.change}</div>
            </div>
          ))}
        </div>

        {/* main grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 12 }}>
          {/* left: pipeline */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">파이프라인 흐름</span>
              <span className="card-subtle">최근 30일</span>
              <span className="spacer"/>
              <div className="segmented">
                <button className="active">건수</button>
                <button>금액</button>
              </div>
            </div>
            <div style={{ padding: 18, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
              {[
                { stage: "수집", n: 142, pct: 100 },
                { stage: "AI 분석", n: 98, pct: 69 },
                { stage: "공급사 응답", n: 47, pct: 33 },
                { stage: "매칭/투찰", n: 22, pct: 15 },
                { stage: "낙찰/계약", n: 9, pct: 6 },
              ].map((p, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div className="row" style={{ justifyContent: "space-between" }}>
                    <span className="muted" style={{ fontSize: "var(--fs-sm)" }}>{p.stage}</span>
                    <span className="tnum weight-600">{p.n}</span>
                  </div>
                  <div className="risk-gauge"><div className="fill" style={{ width: p.pct + "%", background: "var(--accent)" }}/></div>
                  <div className="muted" style={{ fontSize: 10 }}>{p.pct}% 전환</div>
                </div>
              ))}
            </div>
            <div className="hr" style={{ margin: 0 }}/>
            <div style={{ padding: 18 }}>
              <div className="row" style={{ marginBottom: 10 }}>
                <span className="card-title">주간 활동</span>
                <span className="spacer"/>
                <span className="muted" style={{ fontSize: "var(--fs-xs)" }}>· 신규공고 · 응답 · 매칭</span>
              </div>
              <div className="bars" style={{ height: 78 }}>
                {[42, 56, 38, 71, 68, 84, 62, 48, 92, 76, 58, 88, 64, 79].map((h, i) => (
                  <div key={i} className={`bar ${i === 8 || i === 11 ? "hi" : ""}`} style={{ height: h + "%" }}/>
                ))}
              </div>
              <div className="row" style={{ marginTop: 8, justifyContent: "space-between", color: "var(--fg-3)", fontSize: 10 }}>
                <span>4/22</span><span>4/29</span><span>5/06</span><span>오늘</span>
              </div>
            </div>
          </div>

          {/* right: hot bids */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">즉시 검토 필요</span>
              <span className="badge accent">{newBids}</span>
              <span className="spacer"/>
              <button className="btn ghost sm" onClick={() => go("bids")}>전체 <Icon name="arrow-r" size={12}/></button>
            </div>
            <div style={{ padding: 8 }}>
              {window.MOCK_BIDS.slice(0, 4).map(b => (
                <div key={b.id} onClick={() => go("bid-detail", b.id)} style={{
                  padding: "10px 12px", borderRadius: 8, cursor: "pointer",
                  display: "flex", flexDirection: "column", gap: 6,
                }} className="hover-row">
                  <div className="row">
                    <RiskBadge level={b.risk}/>
                    <span className="muted mono" style={{ fontSize: 10 }}>{b.id}</span>
                    <span className="spacer"/>
                    <span className={`badge ${b.daysLeft <= 7 ? "crit" : b.daysLeft <= 14 ? "warn" : ""}`}>D-{b.daysLeft}</span>
                  </div>
                  <div style={{ fontSize: "var(--fs-base)", fontWeight: 500, lineHeight: 1.35 }}>{b.title}</div>
                  <div className="row muted" style={{ fontSize: "var(--fs-xs)" }}>
                    <span>{b.agency}</span>
                    <span>·</span>
                    <span className="tnum">{fmt.won(b.budget)}</span>
                    <span className="spacer"/>
                    <span className="row" style={{ gap: 4 }}>
                      <span className="dot-tag accent" style={{ fontSize: "var(--fs-xs)" }}>fit {b.fitScore}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* bottom row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 12 }}>
          <div className="card">
            <div className="card-header"><span className="card-title">공급사 응답률 Top</span><span className="spacer"/><span className="card-subtle">7일</span></div>
            <div style={{ padding: "8px 4px" }}>
              {window.MOCK_SUPPLIERS.slice(0, 5).map((s, i) => (
                <div key={s.id} className="row" style={{ padding: "8px 14px", justifyContent: "space-between" }}>
                  <div className="row">
                    <div className="avatar" style={{ background: i === 0 ? "var(--accent)" : "var(--bg-3)", color: i === 0 ? "#fff" : "var(--fg-1)" }}>{s.avatar}</div>
                    <div className="col" style={{ gap: 0 }}>
                      <span style={{ fontSize: "var(--fs-base)" }}>{s.name}</span>
                      <span className="muted" style={{ fontSize: "var(--fs-xs)" }}>{s.category}</span>
                    </div>
                  </div>
                  <div className="row" style={{ gap: 8 }}>
                    <div style={{ width: 80 }}>
                      <div className="risk-gauge" style={{ height: 4 }}><div className="fill" style={{ width: s.responseRate, background: "var(--accent)" }}/></div>
                    </div>
                    <span className="tnum" style={{ fontSize: "var(--fs-sm)", width: 36, textAlign: "right" }}>{s.responseRate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="card-header"><span className="card-title">위험도 분포</span><span className="spacer"/><span className="card-subtle">활성 공고</span></div>
            <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "낮음 (Low)", c: "ok", n: 3, pct: 38 },
                { label: "보통 (Medium)", c: "warn", n: 3, pct: 38 },
                { label: "높음 (High)", c: "crit", n: 2, pct: 24 },
              ].map((r, i) => (
                <div key={i} className="col" style={{ gap: 6 }}>
                  <div className="row" style={{ justifyContent: "space-between" }}>
                    <span className={`dot-tag ${r.c}`}>{r.label}</span>
                    <span className="tnum"><b>{r.n}</b> <span className="muted">· {r.pct}%</span></span>
                  </div>
                  <div className="risk-gauge"><div className="fill" style={{ width: r.pct + "%", background: `var(--${r.c === "ok" ? "ok" : r.c === "warn" ? "warn" : "crit"})` }}/></div>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="card-header"><span className="card-title">최근 활동</span></div>
            <div style={{ padding: 14 }}>
              <div className="timeline">
                {[
                  { dot: "done", title: "테크원 솔루션 견적 도착", time: "2분 전" },
                  { dot: "active", title: "B-2026-04723 매칭 검토 중", time: "12분 전" },
                  { dot: "done", title: "공고 18건 신규 수집", time: "1시간 전" },
                  { dot: "done", title: "P-2026-031 납품 단계 진입", time: "2시간 전" },
                ].map((e, i) => (
                  <div key={i} className="timeline-item">
                    <div className={`timeline-dot ${e.dot}`}/>
                    <div className="col" style={{ gap: 0, paddingBottom: 10 }}>
                      <span style={{ fontSize: "var(--fs-base)" }}>{e.title}</span>
                      <span className="muted" style={{ fontSize: "var(--fs-xs)" }}>{e.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// =================== BID LIST ===================
function BidList({ go, query, setQuery }) {
  const [risk, setRisk] = useState("all");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("deadline");
  const [view, setView] = useState("table");

  const filtered = useMemo(() => {
    let r = window.MOCK_BIDS;
    if (risk !== "all") r = r.filter(b => b.risk === risk);
    if (status !== "all") r = r.filter(b => b.status === status);
    if (query) r = r.filter(b => (b.title + b.agency + b.id).toLowerCase().includes(query.toLowerCase()));
    if (sort === "deadline") r = [...r].sort((a, b) => a.daysLeft - b.daysLeft);
    if (sort === "fit") r = [...r].sort((a, b) => b.fitScore - a.fitScore);
    if (sort === "budget") r = [...r].sort((a, b) => b.budget - a.budget);
    return r;
  }, [risk, status, sort, query]);

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">공고</h1>
          <div className="page-subtitle"><span className="tnum">{filtered.length}</span>건 · 나라장터 자동수집 · 10분 주기</div>
        </div>
        <div className="page-header-actions">
          <div className="segmented">
            <button className={view === "table" ? "active" : ""} onClick={() => setView("table")}><Icon name="list" size={13}/></button>
            <button className={view === "card" ? "active" : ""} onClick={() => setView("card")}><Icon name="dashboard" size={13}/></button>
          </div>
          <button className="btn"><Icon name="external"/>나라장터 열기</button>
        </div>
      </div>

      <div style={{ padding: "12px 24px", borderBottom: "1px solid var(--line-1)", display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ position: "relative", width: 280 }}>
          <Icon name="search" size={13} style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", color: "var(--fg-3)" }}/>
          <input className="input" style={{ width: "100%", paddingLeft: 28 }} placeholder="공고번호, 제목, 기관" value={query} onChange={e => setQuery(e.target.value)}/>
        </div>
        <div className="row" style={{ gap: 4 }}>
          <span className="muted" style={{ fontSize: "var(--fs-sm)", marginRight: 4 }}>위험도</span>
          {[["all","전체"],["low","낮음"],["medium","보통"],["high","높음"]].map(([k, l]) =>
            <button key={k} className={`chip ${risk===k?"active":""}`} onClick={() => setRisk(k)}>{l}</button>
          )}
        </div>
        <div className="row" style={{ gap: 4 }}>
          <span className="muted" style={{ fontSize: "var(--fs-sm)", marginRight: 4 }}>상태</span>
          {["all","신규","분석완료","공급사 응답중","매칭대기"].map(k =>
            <button key={k} className={`chip ${status===k?"active":""}`} onClick={() => setStatus(k)}>{k === "all" ? "전체" : k}</button>
          )}
        </div>
        <span className="spacer"/>
        <div className="row">
          <Icon name="sort" size={13} style={{ color: "var(--fg-3)" }}/>
          <select className="select" value={sort} onChange={e => setSort(e.target.value)}>
            <option value="deadline">마감 임박순</option>
            <option value="fit">적합도순</option>
            <option value="budget">예산 큰 순</option>
          </select>
        </div>
      </div>

      <div className="page-body" style={{ paddingTop: 12 }}>
        {view === "table" ? (
          <div className="card" style={{ overflow: "hidden" }}>
            <table className="tbl">
              <thead>
                <tr>
                  <th style={{ width: 36 }}><input type="checkbox"/></th>
                  <th style={{ width: 110 }}>공고 ID</th>
                  <th>제목 / 기관</th>
                  <th style={{ width: 110 }}>예산</th>
                  <th style={{ width: 90 }}>마감</th>
                  <th style={{ width: 110 }}>위험도</th>
                  <th style={{ width: 90 }}>적합도</th>
                  <th style={{ width: 130 }}>매칭 가능</th>
                  <th style={{ width: 110 }}>상태</th>
                  <th style={{ width: 36 }}></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(b => (
                  <tr key={b.id} onClick={() => go("bid-detail", b.id)}>
                    <td onClick={e => e.stopPropagation()}><input type="checkbox"/></td>
                    <td className="mono muted" style={{ fontSize: "var(--fs-sm)" }}>{b.id}</td>
                    <td>
                      <div style={{ fontWeight: 500, marginBottom: 2 }}>{b.title}</div>
                      <div className="muted" style={{ fontSize: "var(--fs-xs)" }}>{b.agency} · {b.region} · {b.contractType}</div>
                    </td>
                    <td className="num">{fmt.won(b.budget)}</td>
                    <td>
                      <div className="tnum" style={{ fontSize: "var(--fs-sm)" }}>{fmt.date(b.deadline)}</div>
                      <div className={`badge ${b.daysLeft <= 7 ? "crit" : b.daysLeft <= 14 ? "warn" : ""}`} style={{ marginTop: 2 }}>D-{b.daysLeft}</div>
                    </td>
                    <td>
                      <div className="row" style={{ gap: 6 }}>
                        <RiskBadge level={b.risk}/>
                        <span className="tnum muted" style={{ fontSize: "var(--fs-xs)" }}>{b.riskScore}</span>
                      </div>
                    </td>
                    <td>
                      <div className="row" style={{ gap: 6 }}>
                        <div style={{ width: 50 }}><div className="risk-gauge" style={{ height: 4 }}><div className="fill" style={{ width: b.fitScore + "%", background: "var(--accent)" }}/></div></div>
                        <span className="tnum" style={{ fontSize: "var(--fs-sm)" }}>{b.fitScore}</span>
                      </div>
                    </td>
                    <td>
                      <span className="dot-tag info" style={{ fontSize: "var(--fs-sm)" }}>공급사 {b.suppliersAvailable}</span>
                      <span className="dot-tag accent" style={{ fontSize: "var(--fs-sm)", marginLeft: 8 }}>입찰사 {b.biddersAvailable}</span>
                    </td>
                    <td><span className={`badge ${b.status === "신규" ? "accent" : b.status === "분석완료" ? "info" : b.status === "공급사 응답중" ? "warn" : ""}`}>{b.status}</span></td>
                    <td><Icon name="dots" size={14} style={{ color: "var(--fg-3)" }}/></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 12 }}>
            {filtered.map(b => (
              <div key={b.id} className="card card-pad" style={{ cursor: "pointer", display: "flex", flexDirection: "column", gap: 10 }} onClick={() => go("bid-detail", b.id)}>
                <div className="row">
                  <RiskBadge level={b.risk}/>
                  <span className="badge">{b.category}</span>
                  <span className="spacer"/>
                  <span className={`badge ${b.daysLeft <= 7 ? "crit" : ""}`}>D-{b.daysLeft}</span>
                </div>
                <div style={{ fontSize: "var(--fs-md)", fontWeight: 500, lineHeight: 1.35, minHeight: 38 }}>{b.title}</div>
                <div className="row muted" style={{ fontSize: "var(--fs-xs)" }}><span>{b.agency}</span><span>·</span><span>{b.region}</span></div>
                <div className="hr" style={{ margin: "4px 0" }}/>
                <div className="row" style={{ justifyContent: "space-between" }}>
                  <div className="col" style={{ gap: 0 }}>
                    <span className="muted" style={{ fontSize: 10 }}>예산</span>
                    <span className="tnum weight-600">{fmt.won(b.budget)}</span>
                  </div>
                  <div className="col" style={{ gap: 0 }}>
                    <span className="muted" style={{ fontSize: 10 }}>적합도</span>
                    <span className="tnum weight-600">{b.fitScore}</span>
                  </div>
                  <div className="col" style={{ gap: 0 }}>
                    <span className="muted" style={{ fontSize: 10 }}>매칭</span>
                    <span className="tnum weight-600">{b.suppliersAvailable}×{b.biddersAvailable}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

Object.assign(window, { Dashboard, BidList, RiskBadge, fmt });
