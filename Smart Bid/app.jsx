/* eslint-disable */
// ============= Smart Bid — App Shell =============

const { useState: useS, useEffect: useE, useRef: useR } = React;

const NAV_BY_ROLE = {
  admin: [
    { section: "Workspace" },
    { id: "dashboard", label: "대시보드", icon: "dashboard" },
    { id: "bids", label: "공고", icon: "list", count: 8 },
    { id: "matching", label: "매칭", icon: "match", count: 3 },
    { id: "projects", label: "프로젝트", icon: "kanban", count: 10 },
    { section: "관리" },
    { id: "suppliers", label: "공급사", icon: "users" },
    { id: "bidders", label: "입찰사", icon: "shield" },
    { id: "pricing", label: "투찰 분석", icon: "chart" },
    { id: "notifications", label: "알림", icon: "bell", count: 3 },
  ],
  supplier: [
    { section: "Workspace" },
    { id: "dashboard", label: "대시보드", icon: "dashboard" },
    { id: "bids", label: "요청 공고", icon: "list", count: 3 },
    { id: "projects", label: "내 거래", icon: "kanban" },
    { section: "관리" },
    { id: "suppliers", label: "프로필", icon: "users" },
    { id: "notifications", label: "알림", icon: "bell", count: 2 },
  ],
  bidder: [
    { section: "Workspace" },
    { id: "dashboard", label: "대시보드", icon: "dashboard" },
    { id: "bids", label: "추천 공고", icon: "list", count: 8 },
    { id: "pricing", label: "투찰 분석", icon: "chart" },
    { id: "projects", label: "참여 진행", icon: "kanban" },
    { section: "관리" },
    { id: "bidders", label: "자격/실적", icon: "shield" },
    { id: "notifications", label: "알림", icon: "bell", count: 3 },
  ],
};

const ROLE_LABEL = { admin: "관리자", supplier: "공급사", bidder: "입찰사" };
const USER_BY_ROLE = {
  admin:    { name: "김민지", initials: "KM", title: "운영 매니저" },
  supplier: { name: "테크원 솔루션", initials: "TS", title: "공급사 계정" },
  bidder:   { name: "대신정보통신", initials: "DC", title: "입찰사 계정" },
};

// ===== Suppliers screen (lightweight directory) =====
function Suppliers() {
  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">공급사</h1>
          <div className="page-subtitle">등록 6곳 · 활성 5곳 · 평균 응답률 86%</div>
        </div>
        <div className="page-header-actions">
          <button className="btn ghost"><Icon name="filter"/>카테고리</button>
          <button className="btn primary"><Icon name="plus"/>공급사 등록</button>
        </div>
      </div>
      <div className="page-body">
        <div className="card" style={{ overflow: "hidden" }}>
          <table className="tbl">
            <thead><tr><th style={{ width: 240 }}>공급사</th><th>카테고리</th><th>지역</th><th>평점</th><th>응답률</th><th>최근 응답</th><th>상태</th><th></th></tr></thead>
            <tbody>
              {window.MOCK_SUPPLIERS.map(s => (
                <tr key={s.id}>
                  <td>
                    <div className="row">
                      <div className="avatar" style={{ background: "var(--bg-3)", color: "var(--fg-1)" }}>{s.avatar}</div>
                      <div className="col" style={{ gap: 0 }}>
                        <span style={{ fontWeight: 500 }}>{s.name}</span>
                        <span className="muted mono" style={{ fontSize: "var(--fs-xs)" }}>{s.id}</span>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge">{s.category}</span></td>
                  <td className="muted">{s.region}</td>
                  <td className="tnum">★ {s.rating}</td>
                  <td>
                    <div className="row" style={{ gap: 8 }}>
                      <div style={{ width: 60 }}><div className="risk-gauge" style={{ height: 4 }}><div className="fill" style={{ width: s.responseRate, background: "var(--accent)" }}/></div></div>
                      <span className="tnum">{s.responseRate}</span>
                    </div>
                  </td>
                  <td className="muted">{s.lastResponse}</td>
                  <td><span className={`dot-tag ${s.status === "online" ? "ok" : s.status === "idle" ? "warn" : ""}`}>{s.status === "online" ? "온라인" : s.status === "idle" ? "유휴" : "오프라인"}</span></td>
                  <td><Icon name="dots" size={14} style={{ color: "var(--fg-3)" }}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ===== Bidders screen =====
function Bidders() {
  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">입찰사</h1>
          <div className="page-subtitle">등록 4곳 · 평균 실적 85.3 · 총 가용 한도 ₩2,910억</div>
        </div>
        <div className="page-header-actions">
          <button className="btn primary"><Icon name="plus"/>입찰사 등록</button>
        </div>
      </div>
      <div className="page-body">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
          {window.MOCK_BIDDERS.map(b => (
            <div key={b.id} className="card card-pad col" style={{ gap: 14 }}>
              <div className="row">
                <div className="avatar" style={{ width: 36, height: 36, fontSize: 13, background: "linear-gradient(135deg, #5a8fd8, #4a73b8)" }}>{b.name.slice(0, 2)}</div>
                <div className="col" style={{ gap: 1, flex: 1 }}>
                  <span style={{ fontWeight: 600, fontSize: "var(--fs-md)" }}>{b.name}</span>
                  <span className="muted" style={{ fontSize: "var(--fs-xs)" }}>{b.license} · {b.region}</span>
                </div>
                <span className="badge ok">활성</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                {[
                  { label: "실적 점수", v: b.performance },
                  { label: "한도", v: b.capacity },
                  { label: "사용률", v: Math.round(b.capacityUsed * 100) + "%" },
                ].map((s, i) => (
                  <div key={i} className="col" style={{ gap: 0, padding: 8, borderRadius: 6, background: "var(--bg-2)" }}>
                    <span className="muted" style={{ fontSize: 10 }}>{s.label}</span>
                    <span className="tnum weight-600">{s.v}</span>
                  </div>
                ))}
              </div>
              <div className="col" style={{ gap: 4 }}>
                <div className="row" style={{ fontSize: "var(--fs-xs)" }}><span className="muted">한도 사용</span><span className="spacer"/><span className="tnum">{Math.round(b.capacityUsed * 100)}%</span></div>
                <div className="risk-gauge"><div className="fill" style={{ width: (b.capacityUsed * 100) + "%", background: b.capacityUsed > 0.7 ? "var(--warn)" : "var(--ok)" }}/></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ===== Toast =====
function ToastStack({ toasts }) {
  return (
    <div className="toast-stack">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.kind || ""}`}>
          <div className="toast-icon"><Icon name={t.kind === "info" ? "info" : t.kind === "warn" ? "warn" : "check"} size={12}/></div>
          <div className="col" style={{ gap: 1 }}>
            <span style={{ fontSize: "var(--fs-sm)", fontWeight: 500 }}>{t.title}</span>
            {t.desc && <span className="muted" style={{ fontSize: "var(--fs-xs)" }}>{t.desc}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

// ===== Tweaks =====
const DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "dark",
  "density": "balanced"
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = useTweaks(DEFAULTS);
  const [route, setRoute] = useS({ name: "dashboard", arg: null });
  const [role, setRole] = useS("admin");
  const [query, setQuery] = useS("");
  const [toasts, setToasts] = useS([]);

  useE(() => {
    document.documentElement.setAttribute("data-theme", tweaks.theme || "dark");
    document.documentElement.setAttribute("data-density", tweaks.density || "balanced");
  }, [tweaks.theme, tweaks.density]);

  const go = (name, arg = null) => setRoute({ name, arg });

  const toast = (title, desc, kind) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, title, desc, kind }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const onRequestSupplier = () => go("supplier-flow", route.arg || "B-2026-04812");

  const nav = NAV_BY_ROLE[role];
  const user = USER_BY_ROLE[role];

  let active = route.name;
  if (active === "bid-detail" || active === "supplier-flow") active = "bids";
  if (active === "pricing") active = "pricing";

  return (
    <>
      <div className="app">
        <div className="topbar">
          <div className="brand">
            <div className="brand-mark">SB</div>
            <span className="brand-name">Smart Bid</span>
            <span className="brand-tag">v0.4 · BEP</span>
          </div>
          <div className="topbar-search">
            <span className="icon"><Icon name="search" size={13}/></span>
            <input placeholder="공고, 공급사, 프로젝트 검색..." value={query} onChange={e => { setQuery(e.target.value); if (e.target.value && route.name !== "bids") go("bids"); }}/>
            <kbd>⌘K</kbd>
          </div>
          <div className="topbar-actions">
            <div className="role-switcher">
              {["admin", "supplier", "bidder"].map(r => (
                <button key={r} className={role === r ? "active" : ""} onClick={() => setRole(r)} data-screen-label={`role-${r}`}>{ROLE_LABEL[r]}</button>
              ))}
            </div>
            <button className="icon-btn" onClick={() => setTweak("theme", tweaks.theme === "dark" ? "light" : "dark")} title="테마 전환">
              <Icon name={tweaks.theme === "dark" ? "sun" : "moon"} size={14}/>
            </button>
            <button className="icon-btn" onClick={() => go("notifications")}>
              <Icon name="bell" size={14}/>
              <span className="dot"/>
            </button>
            <button className="user-chip">
              <div className="avatar">{user.initials}</div>
              <span>{user.name}</span>
            </button>
          </div>
        </div>

        <div className="sidebar">
          {nav.map((n, i) => n.section ? (
            <div key={i} className="nav-section-label">{n.section}</div>
          ) : (
            <div key={n.id} className={`nav-item ${active === n.id ? "active" : ""}`} onClick={() => go(n.id)}>
              <span className="nav-icon"><Icon name={n.icon} size={14}/></span>
              <span>{n.label}</span>
              {n.count != null && <span className="nav-count">{n.count}</span>}
            </div>
          ))}
          <div className="sidebar-footer">
            <div className="chip-row">
              <span className="live-dot"/>
              <span>나라장터 동기화 정상</span>
              <span style={{ marginLeft: "auto" }} className="mono faint">2분 전</span>
            </div>
            <div style={{ marginTop: 6, fontSize: 10, color: "var(--fg-3)" }}>
              · Hermes Agent v2.4.1<br/>
              · 다음 수집 8분 후
            </div>
          </div>
        </div>

        <div className="main" data-screen-label={route.name}>
          {route.name === "dashboard" && <Dashboard role={role} go={go}/>}
          {route.name === "bids" && <BidList go={go} query={query} setQuery={setQuery}/>}
          {route.name === "bid-detail" && <BidDetail bidId={route.arg} go={go} onRequestSupplier={onRequestSupplier}/>}
          {route.name === "supplier-flow" && <SupplierFlow bidId={route.arg} go={go}/>}
          {route.name === "matching" && <Matching bidId={route.arg || "B-2026-04812"} go={go} toast={toast}/>}
          {route.name === "pricing" && <Pricing bidId={route.arg || "B-2026-04812"} go={go}/>}
          {route.name === "projects" && <Projects go={go}/>}
          {route.name === "notifications" && <Notifications go={go}/>}
          {route.name === "suppliers" && <Suppliers/>}
          {route.name === "bidders" && <Bidders/>}
        </div>
      </div>

      {/* Tweaks panel */}
      <TweaksPanel title="Tweaks">
        <TweakSection title="외관">
          <TweakRadio label="테마" value={tweaks.theme} onChange={v => setTweak("theme", v)}
            options={[{ label: "Dark", value: "dark" }, { label: "Light", value: "light" }]}/>
          <TweakRadio label="밀도" value={tweaks.density} onChange={v => setTweak("density", v)}
            options={[{ label: "쾌적", value: "balanced" }, { label: "조밀", value: "compact" }]}/>
        </TweakSection>
        <TweakSection title="화면 점프">
          <TweakSelect label="페이지" value={route.name} onChange={v => {
            const map = {
              "bid-detail":    ["bid-detail", "B-2026-04812"],
              "supplier-flow": ["supplier-flow", "B-2026-04812"],
              "matching":      ["matching", "B-2026-04812"],
              "pricing":       ["pricing", "B-2026-04812"],
            };
            const [n, a] = map[v] || [v, null];
            go(n, a);
          }}
            options={[
              { label: "대시보드", value: "dashboard" },
              { label: "공고 목록", value: "bids" },
              { label: "공고 상세 (AI 분석)", value: "bid-detail" },
              { label: "공급사 견적 요청 (Telegram)", value: "supplier-flow" },
              { label: "매칭 보드", value: "matching" },
              { label: "투찰가 시뮬레이터", value: "pricing" },
              { label: "프로젝트 칸반", value: "projects" },
              { label: "알림 센터", value: "notifications" },
              { label: "공급사 디렉토리", value: "suppliers" },
              { label: "입찰사 목록", value: "bidders" },
            ]}/>
        </TweakSection>
        <TweakSection title="역할">
          <TweakRadio label="현재 역할" value={role} onChange={setRole}
            options={[{ label: "관리자", value: "admin" }, { label: "공급사", value: "supplier" }, { label: "입찰사", value: "bidder" }]}/>
        </TweakSection>
      </TweaksPanel>

      <ToastStack toasts={toasts}/>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
