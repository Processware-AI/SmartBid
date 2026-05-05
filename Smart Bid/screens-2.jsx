/* eslint-disable */
// ============= Smart Bid — Screens (part 2) =============
// Bid Detail (with 3 AI treatments), Supplier Flow

const { useState: useState2, useEffect: useEffect2, useRef: useRef2 } = React;

// ===== AI variation 1: Risk badge + bullets =====
function AIVariantBullets({ bid }) {
  return (
    <div className="card-pad col" style={{ gap: 14 }}>
      <div className="row">
        <RiskBadge level={bid.risk}/>
        <span style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em" }} className="tnum">{bid.riskScore}<span className="muted" style={{ fontSize: "var(--fs-md)", fontWeight: 400 }}> /100</span></span>
        <span className="spacer"/>
        <span className="muted" style={{ fontSize: "var(--fs-xs)" }}>Risk Agent · 12초 전</span>
      </div>
      <div style={{ color: "var(--fg-1)", fontSize: "var(--fs-md)", lineHeight: 1.6 }}>{bid.summary}</div>
      <div className="hr"/>
      <div className="col" style={{ gap: 8 }}>
        {bid.risks.map((r, i) => (
          <div key={i} className="row" style={{ alignItems: "flex-start", gap: 10, padding: "6px 0" }}>
            <Icon name={r.level === "crit" ? "warn" : r.level === "warn" ? "warn" : r.level === "ok" ? "check" : "info"}
                  size={14} style={{ marginTop: 3, color: `var(--${r.level === "ok" ? "ok" : r.level === "warn" ? "warn" : r.level === "crit" ? "crit" : "info"})` }}/>
            <div className="col" style={{ gap: 2 }}>
              <span style={{ fontWeight: 500 }}>{r.title}</span>
              <span className="muted" style={{ fontSize: "var(--fs-sm)" }}>{r.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== AI variation 2: Score gauge + reasoning =====
function AIVariantGauge({ bid }) {
  const dims = [
    { label: "납기 적정성", v: 62 },
    { label: "사양 표준성", v: 78 },
    { label: "공급사 가용성", v: 84 },
    { label: "입찰사 자격 매칭", v: 71 },
    { label: "예산 적정선", v: 88 },
    { label: "보안/인증 부담", v: 38 },
  ];
  return (
    <div className="card-pad col" style={{ gap: 18 }}>
      <div className="row" style={{ alignItems: "flex-end", gap: 16 }}>
        <div style={{ position: "relative", width: 120, height: 120, flexShrink: 0 }}>
          <svg viewBox="0 0 120 120" width="120" height="120">
            <circle cx="60" cy="60" r="50" fill="none" stroke="var(--bg-3)" strokeWidth="12"/>
            <circle cx="60" cy="60" r="50" fill="none"
              stroke={bid.risk === "high" ? "var(--crit)" : bid.risk === "medium" ? "var(--warn)" : "var(--ok)"}
              strokeWidth="12" strokeLinecap="round"
              strokeDasharray={`${(bid.fitScore/100)*314} 314`} transform="rotate(-90 60 60)"/>
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
            <div className="col" style={{ gap: 0, alignItems: "center" }}>
              <span className="tnum" style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em" }}>{bid.fitScore}</span>
              <span className="muted" style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 0.08 }}>적합도</span>
            </div>
          </div>
        </div>
        <div className="col" style={{ flex: 1, gap: 8 }}>
          <div className="row" style={{ gap: 8 }}>
            <RiskBadge level={bid.risk}/>
            <span className="badge accent">참여 권장</span>
          </div>
          <div style={{ fontSize: "var(--fs-md)", lineHeight: 1.55 }}>{bid.summary}</div>
        </div>
      </div>
      <div className="hr"/>
      <div className="col" style={{ gap: 10 }}>
        <div className="row"><span className="card-title">분석 차원</span><span className="spacer"/><span className="muted" style={{ fontSize: "var(--fs-xs)" }}>가중평균 {bid.fitScore}</span></div>
        {dims.map((d, i) => (
          <div key={i} className="row" style={{ gap: 12 }}>
            <span style={{ width: 130, fontSize: "var(--fs-sm)" }} className="muted">{d.label}</span>
            <div style={{ flex: 1 }}><div className="risk-gauge" style={{ height: 6 }}><div className="fill" style={{ width: d.v + "%", background: d.v >= 70 ? "var(--ok)" : d.v >= 50 ? "var(--warn)" : "var(--crit)" }}/></div></div>
            <span className="tnum" style={{ width: 32, textAlign: "right", fontSize: "var(--fs-sm)" }}>{d.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== AI variation 3: Streaming agent log =====
function AIVariantStream({ bid }) {
  const [shown, setShown] = useState2(0);
  const [done, setDone] = useState2(false);
  const log = window.MOCK_AGENT_LOG;
  const ref = useRef2();

  useEffect2(() => {
    setShown(0); setDone(false);
    let cancel = false;
    log.forEach((line, i) => {
      setTimeout(() => {
        if (cancel) return;
        setShown(i + 1);
        if (i === log.length - 1) setDone(true);
        if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
      }, line.t * 0.35); // sped up
    });
    return () => { cancel = true; };
  }, [bid.id]);

  return (
    <div className="card-pad col" style={{ gap: 12 }}>
      <div className="row">
        <span className={`badge ${done ? "ok" : "info"}`}>
          <span className={done ? "" : "live-dot"} style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: done ? "var(--ok)" : "var(--info)" }}/>
          <span style={{ marginLeft: 4 }}>{done ? "분석 완료" : "분석 중..."}</span>
        </span>
        <span className="muted mono" style={{ fontSize: "var(--fs-xs)" }}>hermes/risk-agent · v2.4.1</span>
        <span className="spacer"/>
        <button className="btn ghost sm"><Icon name="external" size={12}/>전체 로그</button>
      </div>
      <div className="agent-log" ref={ref}>
        {log.slice(0, shown).map((l, i) => {
          const cls = l.type === "info" ? "info" : l.type === "ok" ? "ok" : l.type === "warn" ? "warn" : "dim";
          const last = i === shown - 1 && !done;
          return (
            <div key={i} className={cls + (last ? " cursor-blink" : "")}>{l.text}</div>
          );
        })}
        {!shown && <div className="dim">{"> 에이전트 호출 중..."}</div>}
      </div>
      {done && (
        <div className="row" style={{ gap: 8, padding: "6px 4px" }}>
          <Icon name="check" size={14} style={{ color: "var(--ok)" }}/>
          <span className="muted" style={{ fontSize: "var(--fs-sm)" }}>3개 에이전트 협업 · 14단계 · 1.4초 소요</span>
          <span className="spacer"/>
          <span className="badge accent">권장 투찰 ₩398.4M (98.6%)</span>
        </div>
      )}
    </div>
  );
}

// =================== BID DETAIL ===================
function BidDetail({ bidId, go, onRequestSupplier }) {
  const bid = window.MOCK_BIDS.find(b => b.id === bidId) || window.MOCK_BIDS[0];
  const [aiVariant, setAiVariant] = useState2("bullets");
  const [tab, setTab] = useState2("overview");

  return (
    <>
      <div className="page-header" style={{ flexDirection: "column", alignItems: "stretch", gap: 8 }}>
        <div className="row" style={{ fontSize: "var(--fs-xs)", color: "var(--fg-3)" }}>
          <button className="btn ghost sm" onClick={() => go("bids")} style={{ marginLeft: -8 }}>← 공고 목록</button>
          <span>·</span>
          <span className="mono">{bid.id}</span>
          <span>·</span>
          <span>나라장터 공고번호 {bid.bidNo}</span>
          <span className="spacer"/>
          <button className="icon-btn"><Icon name="bookmark" size={14}/></button>
          <button className="icon-btn"><Icon name="external" size={14}/></button>
        </div>
        <div className="row" style={{ alignItems: "flex-start", gap: 16 }}>
          <div className="col" style={{ gap: 6, flex: 1 }}>
            <h1 className="page-title" style={{ fontSize: 22 }}>{bid.title}</h1>
            <div className="row" style={{ gap: 10, color: "var(--fg-2)", fontSize: "var(--fs-sm)", flexWrap: "wrap" }}>
              <span className="row" style={{ gap: 4 }}><Icon name="building" size={12}/>{bid.agency}</span>
              <span>·</span>
              <span>{bid.contractType}</span>
              <span>·</span>
              <span className="row" style={{ gap: 4 }}><Icon name="calendar" size={12}/>마감 {fmt.date(bid.deadline)}</span>
              <span className={`badge ${bid.daysLeft <= 7 ? "crit" : bid.daysLeft <= 14 ? "warn" : ""}`}>D-{bid.daysLeft}</span>
            </div>
          </div>
          <div className="page-header-actions">
            <button className="btn"><Icon name="match"/>매칭으로 이동</button>
            <button className="btn primary" onClick={onRequestSupplier}><Icon name="send"/>공급사 견적 요청</button>
          </div>
        </div>
        <div className="tabs" style={{ marginTop: 4 }}>
          {[["overview","개요"],["ai","AI 분석"],["items","품목"],["history","이력"]].map(([k, l]) =>
            <button key={k} className={tab===k?"active":""} onClick={() => setTab(k)}>{l}</button>
          )}
        </div>
      </div>

      <div className="page-body" style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16, alignItems: "flex-start" }}>
        <div className="col" style={{ gap: 12 }}>
          {tab === "overview" && (
            <>
              <div className="card">
                <div className="card-header">
                  <span className="card-title">AI 분석</span>
                  <span className="spacer"/>
                  <div className="segmented">
                    <button className={aiVariant === "bullets" ? "active" : ""} onClick={() => setAiVariant("bullets")}>요약 + 항목</button>
                    <button className={aiVariant === "gauge" ? "active" : ""} onClick={() => setAiVariant("gauge")}>점수 게이지</button>
                    <button className={aiVariant === "stream" ? "active" : ""} onClick={() => setAiVariant("stream")}>에이전트 로그</button>
                  </div>
                </div>
                {aiVariant === "bullets" && <AIVariantBullets bid={bid}/>}
                {aiVariant === "gauge" && <AIVariantGauge bid={bid}/>}
                {aiVariant === "stream" && <AIVariantStream bid={bid}/>}
              </div>
              <div className="card">
                <div className="card-header"><span className="card-title">요청 품목</span><span className="card-subtle">{bid.items.length}종</span><span className="spacer"/><button className="btn ghost sm"><Icon name="external" size={12}/>스펙 다운로드</button></div>
                <table className="tbl">
                  <thead><tr><th>품목</th><th style={{ width: 100 }} className="num">수량</th><th style={{ width: 80 }}>단위</th><th style={{ width: 130 }}>예상 단가</th></tr></thead>
                  <tbody>
                    {bid.items.map((it, i) => (
                      <tr key={i} style={{ cursor: "default" }}>
                        <td>{it.name}</td>
                        <td className="num">{it.qty.toLocaleString()}</td>
                        <td className="muted">{it.unit}</td>
                        <td className="num muted">— 견적 대기 —</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
          {tab === "ai" && <div className="card"><AIVariantStream bid={bid}/></div>}
          {tab === "items" && (
            <div className="card">
              <table className="tbl">
                <thead><tr><th>품목</th><th className="num">수량</th><th>단위</th></tr></thead>
                <tbody>{bid.items.map((it, i) => <tr key={i} style={{ cursor: "default" }}><td>{it.name}</td><td className="num">{it.qty}</td><td>{it.unit}</td></tr>)}</tbody>
              </table>
            </div>
          )}
          {tab === "history" && (
            <div className="card card-pad">
              <div className="timeline">
                {[
                  { dot: "active", title: "AI 분석 완료", desc: `risk=${bid.risk}, score=${bid.riskScore}`, time: "12초 전" },
                  { dot: "done", title: "공고 수집됨", desc: "나라장터 → BEP 자동 동기화", time: "8분 전" },
                  { dot: "done", title: "공고 게시", desc: bid.agency, time: "오늘 09:42" },
                ].map((e, i) => (
                  <div key={i} className="timeline-item">
                    <div className={`timeline-dot ${e.dot}`}/>
                    <div className="col" style={{ paddingBottom: 14, gap: 2 }}>
                      <span style={{ fontWeight: 500 }}>{e.title}</span>
                      <span className="muted" style={{ fontSize: "var(--fs-sm)" }}>{e.desc}</span>
                      <span className="faint" style={{ fontSize: "var(--fs-xs)" }}>{e.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right rail */}
        <div className="col" style={{ gap: 12, position: "sticky", top: 0 }}>
          <div className="card card-pad col" style={{ gap: 14 }}>
            <div className="col" style={{ gap: 4 }}>
              <span className="muted" style={{ fontSize: "var(--fs-xs)" }}>예산</span>
              <span className="tnum" style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em" }}>{fmt.wonExact(bid.budget)}</span>
            </div>
            <div className="hr" style={{ margin: 0 }}/>
            <div className="col" style={{ gap: 8 }}>
              {[
                ["카테고리", bid.category],
                ["지역", bid.region],
                ["계약방식", bid.contractType],
                ["나라장터 공고", bid.bidNo, true],
              ].map(([l, v, mono], i) => (
                <div key={i} className="row" style={{ justifyContent: "space-between" }}>
                  <span className="muted" style={{ fontSize: "var(--fs-sm)" }}>{l}</span>
                  <span className={mono ? "mono" : ""} style={{ fontSize: "var(--fs-sm)" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="card-header"><span className="card-title">매칭 후보</span></div>
            <div className="card-pad col" style={{ gap: 12 }}>
              <div className="row" style={{ justifyContent: "space-between" }}>
                <div className="col" style={{ gap: 0 }}>
                  <span className="muted" style={{ fontSize: "var(--fs-xs)" }}>공급사</span>
                  <span className="tnum" style={{ fontSize: 20, fontWeight: 600 }}>{bid.suppliersAvailable}</span>
                </div>
                <Icon name="match" style={{ color: "var(--fg-3)" }}/>
                <div className="col" style={{ gap: 0 }}>
                  <span className="muted" style={{ fontSize: "var(--fs-xs)" }}>입찰사</span>
                  <span className="tnum" style={{ fontSize: 20, fontWeight: 600 }}>{bid.biddersAvailable}</span>
                </div>
              </div>
              <button className="btn" onClick={() => go("matching", bid.id)}>매칭 보드 열기 <Icon name="arrow-r" size={12}/></button>
            </div>
          </div>
          <div className="card">
            <div className="card-header"><span className="card-title">권장 투찰가</span><span className="spacer"/><span className="badge ok">73% 확률</span></div>
            <div className="card-pad col" style={{ gap: 8 }}>
              <span className="tnum" style={{ fontSize: 22, fontWeight: 600 }}>{fmt.wonExact(Math.round(bid.budget * 0.966))}</span>
              <span className="muted" style={{ fontSize: "var(--fs-sm)" }}>예가 대비 96.6% — 최근 동일 사양 14건 분석 기반</span>
              <button className="btn ghost sm" style={{ alignSelf: "flex-start" }} onClick={() => go("pricing", bid.id)}>투찰가 시뮬레이터 → </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// =================== SUPPLIER FLOW (split: telegram + web preview) ===================
function SupplierFlow({ bidId, go }) {
  const bid = window.MOCK_BIDS.find(b => b.id === bidId) || window.MOCK_BIDS[0];
  const [step, setStep] = useState2(0); // 0: 요청전, 1: 발송됨, 2: 응답중, 3: 완료
  const [responses, setResponses] = useState2([]);
  const [selected, setSelected] = useState2(window.MOCK_SUPPLIERS.slice(0, 4).map(s => s.id));
  const [price, setPrice] = useState2("");
  const [days, setDays] = useState2("");

  const send = () => {
    setStep(1);
    setTimeout(() => setStep(2), 1200);
    setTimeout(() => {
      setResponses([
        { id: "S-001", name: "테크원 솔루션", price: 1420000, days: 21, t: "2분 전", state: "available" },
        { id: "S-002", name: "한솔디지털", price: 1395000, days: 28, t: "8분 전", state: "available" },
      ]);
    }, 2400);
    setTimeout(() => {
      setResponses(prev => [...prev,
        { id: "S-005", name: "보안텍", price: 1465000, days: 18, t: "방금", state: "available" },
        { id: "S-003", name: "메가IT", state: "declined", t: "12분 전" },
      ]);
      setStep(3);
    }, 4500);
  };

  return (
    <>
      <div className="page-header">
        <div>
          <div className="row" style={{ fontSize: "var(--fs-xs)", color: "var(--fg-3)", marginBottom: 6 }}>
            <button className="btn ghost sm" onClick={() => go("bid-detail", bid.id)} style={{ marginLeft: -8 }}>← {bid.id}</button>
          </div>
          <h1 className="page-title">공급사 견적 요청</h1>
          <div className="page-subtitle">{bid.title}</div>
        </div>
        <div className="page-header-actions">
          <span className="badge"><Icon name="telegram" size={11}/><span style={{ marginLeft: 3 }}>Telegram</span></span>
          <span className="badge"><Icon name="bell" size={11}/><span style={{ marginLeft: 3 }}>Email</span></span>
        </div>
      </div>

      <div className="page-body" style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 16, alignItems: "stretch", minHeight: 0 }}>
        {/* LEFT: Web admin view */}
        <div className="col" style={{ gap: 12 }}>
          <div className="card">
            <div className="card-header">
              <span className="card-title">대상 공급사</span>
              <span className="badge">{selected.length}곳 선택됨</span>
              <span className="spacer"/>
              <button className="btn ghost sm" onClick={() => setSelected(window.MOCK_SUPPLIERS.map(s => s.id))}>전체 선택</button>
            </div>
            <div style={{ padding: 8 }}>
              {window.MOCK_SUPPLIERS.map(s => {
                const isSel = selected.includes(s.id);
                const r = responses.find(r => r.id === s.id);
                return (
                  <div key={s.id} className="row" style={{ padding: "10px 12px", borderRadius: 8, gap: 12 }}>
                    <input type="checkbox" checked={isSel} disabled={step > 0} onChange={e => {
                      setSelected(prev => e.target.checked ? [...prev, s.id] : prev.filter(x => x !== s.id));
                    }}/>
                    <div className="avatar" style={{ background: "var(--bg-3)", color: "var(--fg-1)", position: "relative" }}>
                      {s.avatar}
                      <span style={{ position: "absolute", bottom: -1, right: -1, width: 8, height: 8, borderRadius: "50%",
                        background: s.status === "online" ? "var(--ok)" : s.status === "idle" ? "var(--warn)" : "var(--fg-4)",
                        border: "2px solid var(--bg-1)" }}/>
                    </div>
                    <div className="col" style={{ gap: 1, flex: 1 }}>
                      <span style={{ fontWeight: 500 }}>{s.name}</span>
                      <span className="muted" style={{ fontSize: "var(--fs-xs)" }}>{s.category} · {s.region} · 응답률 {s.responseRate}</span>
                    </div>
                    {step > 0 && isSel && (
                      <div className="row" style={{ gap: 8 }}>
                        {!r && <span className="badge info"><span className="live-dot" style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "var(--info)" }}/><span style={{ marginLeft: 4 }}>응답 대기</span></span>}
                        {r?.state === "available" && (
                          <>
                            <span className="tnum" style={{ fontSize: "var(--fs-sm)" }}>{fmt.wonExact(r.price)}</span>
                            <span className="muted" style={{ fontSize: "var(--fs-xs)" }}>· {r.days}일</span>
                            <span className="badge ok">공급 가능</span>
                          </>
                        )}
                        {r?.state === "declined" && <span className="badge crit">불가</span>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {step === 0 && (
            <div className="card card-pad col" style={{ gap: 12 }}>
              <span className="card-title">메시지 미리보기</span>
              <div style={{ background: "var(--bg-2)", padding: 14, borderRadius: 8, border: "1px solid var(--line-1)", fontSize: "var(--fs-sm)", lineHeight: 1.6 }}>
                <div className="muted" style={{ fontSize: "var(--fs-xs)", marginBottom: 6 }}>{"제목"}</div>
                <div style={{ fontWeight: 500, marginBottom: 12 }}>[공급요청] {bid.title}</div>
                <div className="muted" style={{ fontSize: "var(--fs-xs)", marginBottom: 6 }}>{"본문"}</div>
                <div style={{ whiteSpace: "pre-line" }}>{`안녕하세요. Smart Bid입니다.

${bid.agency}에서 공고된 ${bid.id} 건 공급 가능 여부를 확인 부탁드립니다.

· 품목: ${bid.items[0].name}
· 수량: ${bid.items[0].qty}${bid.items[0].unit}
· 납기: ${fmt.date(bid.deadline)} (D-${bid.daysLeft})

단가/납기 회신 부탁드립니다.`}</div>
              </div>
              <div className="row">
                <span className="kbd-hint"><kbd>⌘</kbd><kbd>Enter</kbd> 즉시 발송</span>
                <span className="spacer"/>
                <button className="btn ghost">템플릿 변경</button>
                <button className="btn primary" onClick={send}><Icon name="send-fill"/>{selected.length}곳에 발송</button>
              </div>
            </div>
          )}

          {step >= 1 && (
            <div className="card card-pad col" style={{ gap: 10 }}>
              <div className="row">
                <span className="card-title">발송 현황</span>
                <span className="spacer"/>
                <span className="muted mono" style={{ fontSize: "var(--fs-xs)" }}>{step === 1 ? "발송 중..." : step === 2 ? `응답 ${responses.length}/${selected.length}` : `완료 ${responses.length}/${selected.length}`}</span>
              </div>
              <div className="risk-gauge" style={{ height: 6 }}>
                <div className="fill" style={{ width: ((responses.length / selected.length) * 100) + "%", background: "var(--accent)", transition: "width 0.6s ease" }}/>
              </div>
              {step >= 2 && (
                <div className="row" style={{ marginTop: 6, fontSize: "var(--fs-sm)" }}>
                  <Icon name="info" size={13} style={{ color: "var(--info)" }}/>
                  <span className="muted">평균 응답 시간 8분 · {responses.filter(r => r.state === "available").length}곳 공급 가능 응답 도착</span>
                  {step === 3 && <button className="btn primary sm" style={{ marginLeft: "auto" }} onClick={() => go("matching", bid.id)}>매칭으로 진행 →</button>}
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT: Telegram phone preview */}
        <div className="col" style={{ gap: 8, alignItems: "center" }}>
          <span className="muted" style={{ fontSize: "var(--fs-xs)" }}>
            <Icon name="telegram" size={12} style={{ marginRight: 4, verticalAlign: "middle", color: "var(--info)" }}/>
            공급사가 보는 화면 · @TechOne_BidBot
          </span>
          <div style={{
            width: 300, height: 600,
            background: "#000",
            borderRadius: 36,
            padding: 10,
            boxShadow: "0 20px 60px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.06)",
            position: "relative",
          }}>
            <div style={{ width: "100%", height: "100%", borderRadius: 28, overflow: "hidden", display: "flex", flexDirection: "column" }} className="tg-chat">
              <div style={{ height: 18, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 22px", color: "#fff", fontSize: 11, fontWeight: 600 }}>
                <span>9:42</span>
                <span style={{ display: "flex", gap: 4, alignItems: "center" }}>
                  <span style={{ display: "inline-block", width: 14, height: 8, border: "1px solid #fff", borderRadius: 2, position: "relative" }}>
                    <span style={{ position: "absolute", inset: 1, background: "#fff", width: 8 }}/>
                  </span>
                </span>
              </div>
              <div className="tg-header">
                <div className="tg-avatar">SB</div>
                <div className="col" style={{ gap: 0 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>Smart Bid</span>
                  <span style={{ fontSize: 10, opacity: 0.6 }}>bot · 공식</span>
                </div>
                <span className="spacer"/>
                <Icon name="dots" size={16}/>
              </div>
              <div className="tg-messages">
                <div className="tg-bubble system">— 오늘 —</div>
                {step === 0 && (
                  <div className="tg-bubble in" style={{ opacity: 0.5 }}>
                    아직 메시지가 없습니다.
                  </div>
                )}
                {step >= 1 && (
                  <div className="tg-bubble in">
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>📋 공급 요청</div>
                    <div style={{ fontSize: 12, lineHeight: 1.45 }}>
                      <b>{bid.title}</b><br/>
                      · 기관: {bid.agency}<br/>
                      · 품목: {bid.items[0].name}<br/>
                      · 수량: <b>{bid.items[0].qty}{bid.items[0].unit}</b><br/>
                      · 납기: {fmt.date(bid.deadline)} (D-{bid.daysLeft})
                    </div>
                    <div className="tg-actions">
                      <button className="tg-action-btn primary">✓ 공급 가능</button>
                      <button className="tg-action-btn">✕ 불가</button>
                    </div>
                    <div className="ts">9:42</div>
                  </div>
                )}
                {step >= 2 && (
                  <>
                    <div className="tg-bubble out">
                      ✓ 공급 가능
                      <div className="ts">9:44</div>
                    </div>
                    <div className="tg-bubble in">
                      <div style={{ fontSize: 12, lineHeight: 1.45 }}>단가와 납기일을 입력해 주세요.</div>
                      <div className="ts">9:44</div>
                    </div>
                    <div className="tg-bubble out">
                      <div style={{ fontSize: 12 }}>단가: <b>₩1,420,000</b><br/>납기: <b>21일</b></div>
                      <div className="ts">9:46</div>
                    </div>
                  </>
                )}
                {step >= 3 && (
                  <div className="tg-bubble in">
                    <div style={{ fontWeight: 600, fontSize: 12 }}>✓ 접수 완료</div>
                    <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>관리자 검토 후 매칭 결과를 알려드립니다.</div>
                    <div className="ts">9:46</div>
                  </div>
                )}
              </div>
              <div className="tg-input">
                <input placeholder="메시지" disabled/>
                <Icon name="send-fill" size={18} style={{ color: "#6caefb" }}/>
              </div>
            </div>
          </div>
          {step === 3 && (
            <div className="badge ok" style={{ marginTop: 4 }}>
              <Icon name="check" size={11}/><span style={{ marginLeft: 4 }}>응답 자동 수집 완료</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

Object.assign(window, { BidDetail, SupplierFlow });
