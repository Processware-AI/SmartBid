/* eslint-disable */
// ============= Smart Bid — Screens (part 3) =============
// Matching board, Pricing analyzer, Kanban projects, Notifications

const { useState: useState3, useEffect: useEffect3, useMemo: useMemo3, useRef: useRef3 } = React;

// =================== MATCHING ===================
function Matching({ bidId, go, toast }) {
  const bid = window.MOCK_BIDS.find(b => b.id === bidId) || window.MOCK_BIDS[0];
  const [supplierPick, setSupplierPick] = useState3("S-001");
  const [bidderPick, setBidderPick] = useState3("BD-001");
  const [confirmed, setConfirmed] = useState3(false);
  const [confirming, setConfirming] = useState3(false);

  const supplier = window.MOCK_SUPPLIERS.find(s => s.id === supplierPick);
  const bidder = window.MOCK_BIDDERS.find(b => b.id === bidderPick);

  const supplierResponses = [
    { id: "S-001", price: 1420000, days: 21, score: 94 },
    { id: "S-002", price: 1395000, days: 28, score: 86 },
    { id: "S-005", price: 1465000, days: 18, score: 91 },
    { id: "S-004", price: 1442000, days: 24, score: 88 },
  ];

  const confirm = () => {
    setConfirming(true);
    setTimeout(() => { setConfirming(false); setConfirmed(true); toast("매칭 승인 — P-2026-040 프로젝트 생성됨"); }, 1400);
  };

  return (
    <>
      <div className="page-header">
        <div>
          <div className="row" style={{ fontSize: "var(--fs-xs)", color: "var(--fg-3)", marginBottom: 6 }}>
            <button className="btn ghost sm" onClick={() => go("bid-detail", bid.id)} style={{ marginLeft: -8 }}>← {bid.id}</button>
          </div>
          <h1 className="page-title">매칭 보드</h1>
          <div className="page-subtitle">{bid.title}</div>
        </div>
        <div className="page-header-actions">
          {!confirmed ? (
            <button className="btn primary" onClick={confirm} disabled={confirming || !supplier || !bidder}>
              {confirming ? <><span className="live-dot" style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "#fff" }}/>승인 중...</> : <><Icon name="check"/>매칭 승인 → 프로젝트 생성</>}
            </button>
          ) : (
            <button className="btn primary" onClick={() => go("projects")}><Icon name="kanban"/>프로젝트 보기</button>
          )}
        </div>
      </div>

      <div className="page-body">
        {/* 3-col matching layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 60px 1fr", gap: 12, alignItems: "stretch" }}>
          {/* SUPPLIERS */}
          <div className="card">
            <div className="card-header">
              <div className="dot-tag info" style={{ fontWeight: 600 }}>공급사 응답</div>
              <span className="badge">{supplierResponses.length}</span>
              <span className="spacer"/>
              <span className="muted" style={{ fontSize: "var(--fs-xs)" }}>가장 좋은 조건 자동 추천</span>
            </div>
            <div style={{ padding: 8, display: "flex", flexDirection: "column", gap: 6 }}>
              {supplierResponses.map(r => {
                const s = window.MOCK_SUPPLIERS.find(x => x.id === r.id);
                const isPicked = supplierPick === r.id;
                const isBest = r.id === "S-002";
                return (
                  <div key={r.id} onClick={() => setSupplierPick(r.id)}
                    style={{
                      padding: 12, borderRadius: 10, cursor: "pointer",
                      background: isPicked ? "var(--accent-soft)" : "var(--bg-2)",
                      border: `1px solid ${isPicked ? "var(--accent-line)" : "var(--line-1)"}`,
                      display: "flex", flexDirection: "column", gap: 8,
                    }}>
                    <div className="row">
                      <div className="avatar" style={{ background: "var(--bg-3)", color: "var(--fg-1)" }}>{s.avatar}</div>
                      <div className="col" style={{ gap: 0, flex: 1 }}>
                        <div className="row" style={{ gap: 6 }}>
                          <span style={{ fontWeight: 500 }}>{s.name}</span>
                          {isBest && <span className="badge accent">최저가</span>}
                          {isPicked && <span className="badge ok">선택됨</span>}
                        </div>
                        <span className="muted" style={{ fontSize: "var(--fs-xs)" }}>{s.region} · 평점 {s.rating} · 응답률 {s.responseRate}</span>
                      </div>
                      <input type="radio" checked={isPicked} readOnly/>
                    </div>
                    <div className="row" style={{ gap: 12, paddingLeft: 32 }}>
                      <div className="col" style={{ gap: 0 }}>
                        <span className="muted" style={{ fontSize: 10 }}>단가</span>
                        <span className="tnum" style={{ fontWeight: 600 }}>{fmt.wonExact(r.price)}</span>
                      </div>
                      <div className="col" style={{ gap: 0 }}>
                        <span className="muted" style={{ fontSize: 10 }}>납기</span>
                        <span className="tnum" style={{ fontWeight: 600 }}>{r.days}일</span>
                      </div>
                      <div className="col" style={{ gap: 0, marginLeft: "auto" }}>
                        <span className="muted" style={{ fontSize: 10 }}>매칭점수</span>
                        <span className="tnum" style={{ fontWeight: 600 }}>{r.score}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CENTER ARROW */}
          <div className="col" style={{ alignItems: "center", justifyContent: "center", gap: 12 }}>
            <div style={{ width: 1, flex: 1, background: "linear-gradient(var(--line-1), transparent)" }}/>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: confirmed ? "var(--ok-soft)" : "var(--accent-soft)", display: "grid", placeItems: "center", border: `1px solid ${confirmed ? "var(--ok)" : "var(--accent-line)"}` }}>
              {confirmed ? <Icon name="check" style={{ color: "var(--ok)" }}/> : <Icon name="match" style={{ color: "var(--accent)" }}/>}
            </div>
            <div className="muted" style={{ fontSize: 10, textAlign: "center", lineHeight: 1.3, padding: "0 4px" }}>
              {confirmed ? "프로젝트 생성됨" : (supplier && bidder ? "승인 대기" : "선택 필요")}
            </div>
            <div style={{ width: 1, flex: 1, background: "linear-gradient(transparent, var(--line-1))" }}/>
          </div>

          {/* BIDDERS */}
          <div className="card">
            <div className="card-header">
              <div className="dot-tag accent" style={{ fontWeight: 600 }}>입찰사 후보</div>
              <span className="badge">{window.MOCK_BIDDERS.length}</span>
              <span className="spacer"/>
              <span className="muted" style={{ fontSize: "var(--fs-xs)" }}>자격·실적 자동 검증</span>
            </div>
            <div style={{ padding: 8, display: "flex", flexDirection: "column", gap: 6 }}>
              {window.MOCK_BIDDERS.map(b => {
                const isPicked = bidderPick === b.id;
                return (
                  <div key={b.id} onClick={() => setBidderPick(b.id)}
                    style={{
                      padding: 12, borderRadius: 10, cursor: "pointer",
                      background: isPicked ? "var(--accent-soft)" : "var(--bg-2)",
                      border: `1px solid ${isPicked ? "var(--accent-line)" : "var(--line-1)"}`,
                      display: "flex", flexDirection: "column", gap: 8,
                    }}>
                    <div className="row">
                      <div className="avatar" style={{ background: "linear-gradient(135deg, #5a8fd8, #4a73b8)", color: "#fff" }}>
                        {b.name.slice(0, 2)}
                      </div>
                      <div className="col" style={{ gap: 0, flex: 1 }}>
                        <div className="row" style={{ gap: 6 }}>
                          <span style={{ fontWeight: 500 }}>{b.name}</span>
                          {isPicked && <span className="badge ok">선택됨</span>}
                        </div>
                        <span className="muted" style={{ fontSize: "var(--fs-xs)" }}>{b.license} · {b.region}</span>
                      </div>
                      <input type="radio" checked={isPicked} readOnly/>
                    </div>
                    <div className="row" style={{ gap: 12, paddingLeft: 32 }}>
                      <div className="col" style={{ gap: 0 }}>
                        <span className="muted" style={{ fontSize: 10 }}>실적</span>
                        <span className="tnum" style={{ fontWeight: 600 }}>{b.performance}</span>
                      </div>
                      <div className="col" style={{ gap: 0 }}>
                        <span className="muted" style={{ fontSize: 10 }}>여유 한도</span>
                        <span className="tnum" style={{ fontWeight: 600 }}>{b.capacity}</span>
                      </div>
                      <div className="col" style={{ gap: 0, marginLeft: "auto", width: 80 }}>
                        <span className="muted" style={{ fontSize: 10 }}>가용률 {Math.round((1 - b.capacityUsed) * 100)}%</span>
                        <div className="risk-gauge" style={{ height: 4, marginTop: 2 }}>
                          <div className="fill" style={{ width: ((1 - b.capacityUsed) * 100) + "%", background: "var(--ok)" }}/>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom: matching summary */}
        {supplier && bidder && (
          <div className="card card-pad" style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16, alignItems: "center" }}>
            <div className="col" style={{ gap: 4 }}>
              <span className="muted" style={{ fontSize: "var(--fs-xs)" }}>매칭 결과</span>
              <span style={{ fontWeight: 500 }}>{supplier.name} <span className="muted">×</span> {bidder.name}</span>
            </div>
            <div className="col" style={{ gap: 0 }}>
              <span className="muted" style={{ fontSize: "var(--fs-xs)" }}>예상 단가</span>
              <span className="tnum" style={{ fontSize: 16, fontWeight: 600 }}>{fmt.wonExact(supplierResponses.find(r => r.id === supplierPick)?.price)}</span>
            </div>
            <div className="col" style={{ gap: 0 }}>
              <span className="muted" style={{ fontSize: "var(--fs-xs)" }}>예상 마진</span>
              <span className="tnum" style={{ fontSize: 16, fontWeight: 600, color: "var(--ok)" }}>+12.4%</span>
            </div>
            <div className="col" style={{ gap: 0 }}>
              <span className="muted" style={{ fontSize: "var(--fs-xs)" }}>낙찰 확률</span>
              <span className="tnum" style={{ fontSize: 16, fontWeight: 600 }}>73%</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// =================== PRICING ANALYZER ===================
function Pricing({ bidId, go }) {
  const bid = window.MOCK_BIDS.find(b => b.id === bidId) || window.MOCK_BIDS[0];
  const [pct, setPct] = useState3(96.6);   // bid as % of budget
  const [cost, setCost] = useState3(312400000); // our cost
  const [competitors, setCompetitors] = useState3(4);

  const ourBid = Math.round(bid.budget * pct / 100);
  const margin = ourBid - cost;
  const marginPct = (margin / ourBid) * 100;

  // synthetic win curve: lower bid → higher win prob, but with floor risk
  const winProb = useMemo3(() => {
    // 100% → 5%, 95% → 65%, 90% → 88%, with competitor penalty
    const base = Math.max(0, Math.min(99, (101 - pct) * 14));
    const compPenalty = (competitors - 1) * 4;
    return Math.max(2, Math.min(96, base - compPenalty + 8));
  }, [pct, competitors]);

  const expectedValue = (winProb / 100) * margin;

  // historical scatter
  const history = useMemo3(() => {
    const arr = [];
    for (let i = 0; i < 22; i++) {
      const p = 88 + Math.random() * 12;
      const won = Math.random() < (Math.max(0, (101 - p)) * 0.13);
      arr.push({ p, won });
    }
    return arr;
  }, [bid.id]);

  return (
    <>
      <div className="page-header">
        <div>
          <div className="row" style={{ fontSize: "var(--fs-xs)", color: "var(--fg-3)", marginBottom: 6 }}>
            <button className="btn ghost sm" onClick={() => go("bid-detail", bid.id)} style={{ marginLeft: -8 }}>← {bid.id}</button>
          </div>
          <h1 className="page-title">투찰가 시뮬레이터</h1>
          <div className="page-subtitle">{bid.title}</div>
        </div>
        <div className="page-header-actions">
          <button className="btn"><Icon name="external"/>비교 시나리오</button>
          <button className="btn primary"><Icon name="check"/>이 가격으로 확정</button>
        </div>
      </div>

      <div className="page-body" style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 16 }}>
        {/* Controls */}
        <div className="card card-pad col" style={{ gap: 18 }}>
          <div className="col" style={{ gap: 8 }}>
            <div className="row"><span className="muted" style={{ fontSize: "var(--fs-sm)" }}>예가 대비 투찰률</span><span className="spacer"/><span className="tnum" style={{ fontWeight: 600, fontSize: 18 }}>{pct.toFixed(1)}%</span></div>
            <input type="range" min="80" max="100" step="0.1" value={pct} onChange={e => setPct(+e.target.value)} style={{ width: "100%", accentColor: "var(--accent)" }}/>
            <div className="row" style={{ justifyContent: "space-between", color: "var(--fg-3)", fontSize: 10 }}>
              <span>80%</span><span>90%</span><span>예가 100%</span>
            </div>
          </div>
          <div className="hr" style={{ margin: 0 }}/>
          <div className="col" style={{ gap: 8 }}>
            <div className="row"><span className="muted" style={{ fontSize: "var(--fs-sm)" }}>원가 (공급사 견적 합)</span><span className="spacer"/><span className="tnum" style={{ fontWeight: 600 }}>{fmt.wonExact(cost)}</span></div>
            <input type="range" min={Math.round(bid.budget * 0.5)} max={Math.round(bid.budget * 0.9)} step="100000" value={cost} onChange={e => setCost(+e.target.value)} style={{ width: "100%", accentColor: "var(--accent)" }}/>
          </div>
          <div className="hr" style={{ margin: 0 }}/>
          <div className="col" style={{ gap: 8 }}>
            <div className="row"><span className="muted" style={{ fontSize: "var(--fs-sm)" }}>예상 경쟁사 수</span><span className="spacer"/><span className="tnum" style={{ fontWeight: 600 }}>{competitors}곳</span></div>
            <input type="range" min="1" max="12" step="1" value={competitors} onChange={e => setCompetitors(+e.target.value)} style={{ width: "100%", accentColor: "var(--accent)" }}/>
          </div>
          <div className="hr" style={{ margin: 0 }}/>
          <div className="col" style={{ gap: 4 }}>
            <span className="muted" style={{ fontSize: "var(--fs-xs)" }}>AI 권장</span>
            <button className="btn" onClick={() => { setPct(96.6); setCompetitors(4); }}>
              <Icon name="spark" size={12}/>균형 (₩{(bid.budget * 0.966 / 1e8).toFixed(2)}억, 73% 확률)
            </button>
            <button className="btn ghost sm" onClick={() => { setPct(93.5); setCompetitors(4); }}>
              <Icon name="chart" size={12}/>공격적 (높은 확률, 낮은 마진)
            </button>
            <button className="btn ghost sm" onClick={() => { setPct(98.4); setCompetitors(4); }}>
              <Icon name="shield" size={12}/>방어적 (높은 마진, 낮은 확률)
            </button>
          </div>
        </div>

        {/* Outputs */}
        <div className="col" style={{ gap: 12 }}>
          {/* big numbers */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {[
              { label: "투찰가", v: fmt.wonExact(ourBid), sub: `${pct.toFixed(1)}% 예가 대비` },
              { label: "예상 마진", v: fmt.wonExact(margin), sub: `${marginPct.toFixed(1)}%`, tone: marginPct < 5 ? "crit" : marginPct < 12 ? "warn" : "ok" },
              { label: "낙찰 확률", v: winProb.toFixed(0) + "%", sub: `경쟁 ${competitors}곳 가정`, tone: winProb >= 60 ? "ok" : winProb >= 30 ? "warn" : "crit" },
              { label: "기대값", v: fmt.wonExact(Math.round(expectedValue)), sub: "확률 × 마진" },
            ].map((s, i) => (
              <div key={i} className="card card-pad col" style={{ gap: 4 }}>
                <span className="muted" style={{ fontSize: "var(--fs-xs)" }}>{s.label}</span>
                <span className="tnum" style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em",
                  color: s.tone === "crit" ? "var(--crit)" : s.tone === "warn" ? "var(--warn)" : s.tone === "ok" ? "var(--ok)" : "var(--fg-0)" }}>{s.v}</span>
                <span className="muted" style={{ fontSize: "var(--fs-xs)" }}>{s.sub}</span>
              </div>
            ))}
          </div>

          {/* probability curve */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">낙찰 확률 곡선</span>
              <span className="spacer"/>
              <span className="muted" style={{ fontSize: "var(--fs-xs)" }}>최근 12개월 동일 카테고리 14건</span>
            </div>
            <div className="card-pad" style={{ position: "relative", height: 220 }}>
              <svg viewBox="0 0 800 200" width="100%" height="100%" preserveAspectRatio="none" style={{ overflow: "visible" }}>
                {/* gridlines */}
                {[0, 25, 50, 75, 100].map(y => (
                  <line key={y} x1="0" x2="800" y1={200 - y * 1.8} y2={200 - y * 1.8} stroke="var(--line-1)" strokeWidth="1"/>
                ))}
                {/* curve */}
                <path
                  d={(() => {
                    const pts = [];
                    for (let p = 80; p <= 100; p += 0.5) {
                      const x = ((p - 80) / 20) * 800;
                      const baseProb = Math.max(0, Math.min(99, (101 - p) * 14));
                      const adj = Math.max(2, Math.min(96, baseProb - (competitors - 1) * 4 + 8));
                      const y = 200 - adj * 1.8;
                      pts.push(`${pts.length === 0 ? "M" : "L"}${x},${y}`);
                    }
                    return pts.join(" ");
                  })()}
                  stroke="var(--accent)" strokeWidth="2.5" fill="none" strokeLinecap="round"
                />
                {/* fill under curve */}
                <path
                  d={(() => {
                    const pts = ["M0,200"];
                    for (let p = 80; p <= 100; p += 0.5) {
                      const x = ((p - 80) / 20) * 800;
                      const baseProb = Math.max(0, Math.min(99, (101 - p) * 14));
                      const adj = Math.max(2, Math.min(96, baseProb - (competitors - 1) * 4 + 8));
                      const y = 200 - adj * 1.8;
                      pts.push(`L${x},${y}`);
                    }
                    pts.push("L800,200 Z");
                    return pts.join(" ");
                  })()}
                  fill="var(--accent-soft)"
                />
                {/* current marker */}
                <line x1={((pct - 80) / 20) * 800} x2={((pct - 80) / 20) * 800} y1="0" y2="200" stroke="var(--fg-2)" strokeDasharray="4 4" strokeWidth="1"/>
                <circle cx={((pct - 80) / 20) * 800} cy={200 - winProb * 1.8} r="6" fill="var(--accent)" stroke="var(--bg-1)" strokeWidth="2"/>
                {/* historical */}
                {history.map((h, i) => (
                  <circle key={i} cx={((h.p - 80) / 20) * 800} cy={h.won ? 60 : 160} r="3" fill={h.won ? "var(--ok)" : "var(--fg-3)"} opacity="0.7"/>
                ))}
              </svg>
              <div className="row" style={{ justifyContent: "space-between", color: "var(--fg-3)", fontSize: 10, marginTop: 4 }}>
                <span>80%</span><span>85%</span><span>90%</span><span>95%</span><span>100%</span>
              </div>
              <div className="row" style={{ position: "absolute", top: 14, right: 14, gap: 10, fontSize: 10 }}>
                <span className="dot-tag ok">낙찰 사례</span>
                <span className="dot-tag" style={{ color: "var(--fg-3)" }}>유찰</span>
              </div>
            </div>
          </div>

          {/* breakdown */}
          <div className="card">
            <div className="card-header"><span className="card-title">단가 구성</span></div>
            <div className="card-pad">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr) 1fr", gap: 0, height: 28, borderRadius: 6, overflow: "hidden", border: "1px solid var(--line-2)" }}>
                <div style={{ background: "var(--info-soft)", display: "grid", placeItems: "center", color: "var(--info)", fontSize: 11, fontWeight: 500 }}>제품원가 71%</div>
                <div style={{ background: "var(--ok-soft)", display: "grid", placeItems: "center", color: "var(--ok)", fontSize: 11, fontWeight: 500 }}>물류 8%</div>
                <div style={{ background: "var(--warn-soft)", display: "grid", placeItems: "center", color: "var(--warn)", fontSize: 11, fontWeight: 500 }}>운영 6%</div>
                <div style={{ background: "var(--crit-soft)", display: "grid", placeItems: "center", color: "var(--crit)", fontSize: 11, fontWeight: 500 }}>리스크 2%</div>
                <div style={{ background: "var(--accent-soft)", display: "grid", placeItems: "center", color: "var(--accent-fg)", fontSize: 11, fontWeight: 500 }}>마진 {marginPct.toFixed(1)}%</div>
              </div>
              <div className="row" style={{ marginTop: 12, gap: 16, fontSize: "var(--fs-sm)" }} className="muted">
                <span>합계 <b className="tnum" style={{ color: "var(--fg-0)" }}>{fmt.wonExact(ourBid)}</b></span>
                <span className="spacer"/>
                <span>예가 <b className="tnum" style={{ color: "var(--fg-0)" }}>{fmt.wonExact(bid.budget)}</b></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// =================== KANBAN PROJECTS ===================
function Projects({ go }) {
  const stages = ["공고 등록", "공급사 확정", "투찰 완료", "계약/납품", "정산 완료"];

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">프로젝트</h1>
          <div className="page-subtitle">실행 단계별 칸반 · 활성 프로젝트 10건 · ₩2,453M</div>
        </div>
        <div className="page-header-actions">
          <button className="btn ghost"><Icon name="filter"/>담당자</button>
          <button className="btn"><Icon name="calendar"/>이번 분기</button>
          <button className="btn primary"><Icon name="plus"/>프로젝트</button>
        </div>
      </div>
      <div className="page-body" style={{ minHeight: 0, flex: 1, display: "flex", flexDirection: "column" }}>
        <div className="kanban">
          {stages.map((stage, i) => {
            const items = window.MOCK_PROJECTS[stage] || [];
            const total = items.reduce((s, p) => s + p.value, 0);
            return (
              <div key={stage} className="kanban-col">
                <div className="kanban-col-header">
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background:
                    i === 0 ? "var(--info)" : i === 1 ? "var(--accent)" : i === 2 ? "var(--warn)" : i === 3 ? "var(--ok)" : "var(--fg-3)"
                  }}/>
                  <span>{stage}</span>
                  <span className="muted tnum" style={{ fontSize: "var(--fs-xs)" }}>{items.length}</span>
                  <span className="spacer"/>
                  <span className="muted tnum" style={{ fontSize: "var(--fs-xs)" }}>₩{total}M</span>
                  <Icon name="dots" size={12} style={{ color: "var(--fg-3)" }}/>
                </div>
                <div className="kanban-col-body">
                  {items.map(p => (
                    <div key={p.id} className="kanban-card">
                      <div className="row" style={{ fontSize: "var(--fs-xs)", color: "var(--fg-3)" }}>
                        <span className="mono">{p.id}</span>
                        <span className="spacer"/>
                        {p.days > 0 && <span className={`badge ${p.days <= 7 ? "crit" : p.days <= 14 ? "warn" : ""}`}>D-{p.days}</span>}
                      </div>
                      <span className="title">{p.title}</span>
                      <div className="meta">
                        <span>{p.agency}</span>
                        <span className="spacer"/>
                        <span className="tnum">₩{p.value}M</span>
                      </div>
                      <div className="row" style={{ paddingTop: 4, borderTop: "1px solid var(--line-1)", marginTop: 2, gap: 6 }}>
                        <div className="avatar" style={{ width: 18, height: 18, fontSize: 9 }}>{p.owner.charAt(0)}</div>
                        <span className="muted" style={{ fontSize: "var(--fs-xs)" }}>{p.owner}</span>
                        <span className="spacer"/>
                        {i === 3 && <span className="dot-tag warn" style={{ fontSize: 10 }}>납품 진행</span>}
                        {i === 4 && <span className="dot-tag ok" style={{ fontSize: 10 }}>완료</span>}
                      </div>
                    </div>
                  ))}
                  {i === 0 && (
                    <button className="btn ghost sm" style={{ alignSelf: "stretch", justifyContent: "center", borderStyle: "dashed", borderColor: "var(--line-2)", border: "1px dashed var(--line-2)", background: "transparent" }}>
                      <Icon name="plus" size={11}/>공고에서 가져오기
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

// =================== NOTIFICATIONS ===================
function Notifications({ go }) {
  const [filter, setFilter] = useState3("all");
  const list = window.MOCK_NOTIFS.filter(n => filter === "all" || (filter === "unread" ? n.unread : n.type === filter));

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">알림 센터</h1>
          <div className="page-subtitle">3건 안 읽음 · Telegram + Email + 인앱</div>
        </div>
        <div className="page-header-actions">
          <button className="btn ghost">모두 읽음 처리</button>
          <button className="btn"><Icon name="settings"/>채널 설정</button>
        </div>
      </div>
      <div style={{ padding: "10px 24px", borderBottom: "1px solid var(--line-1)", display: "flex", gap: 6 }}>
        {[["all","전체"],["unread","안 읽음"],["supplier","공급사"],["match","매칭"],["risk","위험"],["project","프로젝트"],["system","시스템"]].map(([k, l]) =>
          <button key={k} className={`chip ${filter===k?"active":""}`} onClick={() => setFilter(k)}>{l}</button>
        )}
      </div>
      <div className="page-body" style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16, alignItems: "flex-start" }}>
        <div className="card" style={{ overflow: "hidden" }}>
          {list.map(n => (
            <div key={n.id} className={`notif-row ${n.unread ? "unread" : ""}`}>
              <div className="notif-icon" style={{
                background: n.type === "supplier" ? "var(--info-soft)" :
                            n.type === "match" ? "var(--ok-soft)" :
                            n.type === "risk" ? "var(--crit-soft)" :
                            n.type === "project" ? "var(--accent-soft)" : "var(--bg-3)",
                color: n.type === "supplier" ? "var(--info)" :
                       n.type === "match" ? "var(--ok)" :
                       n.type === "risk" ? "var(--crit)" :
                       n.type === "project" ? "var(--accent-fg)" : "var(--fg-2)",
              }}>
                <Icon name={n.type === "supplier" ? "telegram" : n.type === "match" ? "match" : n.type === "risk" ? "warn" : n.type === "project" ? "kanban" : "info"} size={14}/>
              </div>
              <div className="col" style={{ gap: 2 }}>
                <span style={{ fontWeight: 500 }}>{n.title}</span>
                <span className="muted" style={{ fontSize: "var(--fs-sm)" }}>{n.desc}</span>
              </div>
              <div className="col" style={{ alignItems: "flex-end", gap: 4 }}>
                <span className="faint" style={{ fontSize: "var(--fs-xs)" }}>{n.time}</span>
                {n.unread && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)" }}/>}
              </div>
            </div>
          ))}
        </div>
        <div className="col" style={{ gap: 12 }}>
          <div className="card card-pad col" style={{ gap: 12 }}>
            <span className="card-title">채널 상태</span>
            {[
              { label: "Telegram Bot", v: "@SmartBidBot", state: "online" },
              { label: "Email (SMTP)", v: "smtp.smartbid.kr", state: "online" },
              { label: "KakaoTalk Biz", v: "준비중", state: "off" },
            ].map((c, i) => (
              <div key={i} className="row">
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: c.state === "online" ? "var(--ok)" : "var(--fg-4)" }}/>
                <div className="col" style={{ gap: 0, flex: 1 }}>
                  <span style={{ fontSize: "var(--fs-sm)" }}>{c.label}</span>
                  <span className="muted mono" style={{ fontSize: "var(--fs-xs)" }}>{c.v}</span>
                </div>
                <span className={`badge ${c.state === "online" ? "ok" : ""}`}>{c.state}</span>
              </div>
            ))}
          </div>
          <div className="card card-pad col" style={{ gap: 8 }}>
            <span className="card-title">오늘 발송</span>
            <div className="row" style={{ justifyContent: "space-between" }}>
              <span className="muted" style={{ fontSize: "var(--fs-sm)" }}>Telegram</span>
              <span className="tnum">42건</span>
            </div>
            <div className="row" style={{ justifyContent: "space-between" }}>
              <span className="muted" style={{ fontSize: "var(--fs-sm)" }}>Email</span>
              <span className="tnum">18건</span>
            </div>
            <div className="row" style={{ justifyContent: "space-between" }}>
              <span className="muted" style={{ fontSize: "var(--fs-sm)" }}>인앱</span>
              <span className="tnum">94건</span>
            </div>
            <div className="hr"/>
            <div className="row" style={{ justifyContent: "space-between" }}>
              <span style={{ fontWeight: 500 }}>합계</span>
              <span className="tnum weight-600">154건</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

Object.assign(window, { Matching, Pricing, Projects, Notifications });
