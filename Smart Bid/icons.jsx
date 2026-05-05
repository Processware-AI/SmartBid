/* eslint-disable */
// Inline SVG icon set — 16px stroked
const Icon = ({ name, size = 16, className = "", style = {} }) => {
  const s = { width: size, height: size, ...style };
  const common = { width: size, height: size, viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round", className, style };
  switch (name) {
    case "search":   return <svg {...common}><circle cx="7" cy="7" r="4.5"/><path d="m13.5 13.5-3-3"/></svg>;
    case "bell":     return <svg {...common}><path d="M3.5 11.5h9l-1.2-1.5V7.2c0-2-1.5-3.7-3.3-3.7S4.7 5.2 4.7 7.2V10z"/><path d="M6.5 13.5a1.5 1.5 0 0 0 3 0"/></svg>;
    case "settings": return <svg {...common}><circle cx="8" cy="8" r="2"/><path d="M8 1.5v2M8 12.5v2M14.5 8h-2M3.5 8h-2M12.6 3.4l-1.4 1.4M4.8 11.2l-1.4 1.4M12.6 12.6l-1.4-1.4M4.8 4.8 3.4 3.4"/></svg>;
    case "dashboard":return <svg {...common}><rect x="2" y="2" width="5" height="6" rx="1"/><rect x="9" y="2" width="5" height="3" rx="1"/><rect x="9" y="7" width="5" height="7" rx="1"/><rect x="2" y="10" width="5" height="4" rx="1"/></svg>;
    case "list":     return <svg {...common}><path d="M5 4h9M5 8h9M5 12h9"/><circle cx="2.5" cy="4" r="0.6" fill="currentColor"/><circle cx="2.5" cy="8" r="0.6" fill="currentColor"/><circle cx="2.5" cy="12" r="0.6" fill="currentColor"/></svg>;
    case "users":    return <svg {...common}><circle cx="6" cy="6" r="2.5"/><path d="M2 13c0-2.2 1.8-4 4-4s4 1.8 4 4"/><circle cx="11.5" cy="5.5" r="2"/><path d="M10 9c2 0 3.5 1.5 3.5 3.5"/></svg>;
    case "match":    return <svg {...common}><path d="M3 5h6m0 0L7 3m2 2L7 7"/><path d="M13 11H7m0 0 2-2m-2 2 2 2"/></svg>;
    case "chart":    return <svg {...common}><path d="M2 13h12"/><path d="M4 11V8M7 11V5M10 11V7M13 11V3"/></svg>;
    case "kanban":   return <svg {...common}><rect x="2" y="3" width="3.5" height="10" rx="0.5"/><rect x="6.25" y="3" width="3.5" height="6" rx="0.5"/><rect x="10.5" y="3" width="3.5" height="8" rx="0.5"/></svg>;
    case "send":     return <svg {...common}><path d="m14 2-7 12-2-5-5-2z"/></svg>;
    case "send-fill":return <svg {...common} fill="currentColor" stroke="none"><path d="M14.5 1.5 1.7 6.4c-.5.2-.5.9 0 1l4.6 1.7L8 13.6c.2.5.9.5 1.1 0L14.5 1.5z"/></svg>;
    case "check":    return <svg {...common}><path d="m3 8 3 3 7-7"/></svg>;
    case "x":        return <svg {...common}><path d="m4 4 8 8M12 4l-8 8"/></svg>;
    case "plus":     return <svg {...common}><path d="M8 3v10M3 8h10"/></svg>;
    case "filter":   return <svg {...common}><path d="M2 3h12l-4.5 6v5l-3-1.5V9z"/></svg>;
    case "sort":     return <svg {...common}><path d="M5 3v10m-2-2 2 2 2-2M11 13V3m-2 2 2-2 2 2"/></svg>;
    case "info":     return <svg {...common}><circle cx="8" cy="8" r="6"/><path d="M8 7v4M8 5v.01"/></svg>;
    case "warn":     return <svg {...common}><path d="M8 2 1.5 13h13z"/><path d="M8 7v3M8 12v.01"/></svg>;
    case "shield":   return <svg {...common}><path d="M8 2 2.5 4v4c0 3 2.3 5.5 5.5 6 3.2-.5 5.5-3 5.5-6V4z"/></svg>;
    case "spark":    return <svg {...common}><path d="m8 2 1.5 4 4 1-3 3 1 4-3.5-2.2L4.5 14l1-4-3-3 4-1z"/></svg>;
    case "arrow-r":  return <svg {...common}><path d="M3 8h10m0 0-3-3m3 3-3 3"/></svg>;
    case "external": return <svg {...common}><path d="M9 3h4v4M13 3 7 9M11 9v4H3V5h4"/></svg>;
    case "dots":     return <svg {...common}><circle cx="3.5" cy="8" r="0.8" fill="currentColor"/><circle cx="8" cy="8" r="0.8" fill="currentColor"/><circle cx="12.5" cy="8" r="0.8" fill="currentColor"/></svg>;
    case "bookmark": return <svg {...common}><path d="M4 2h8v12l-4-3-4 3z"/></svg>;
    case "calendar": return <svg {...common}><rect x="2" y="3" width="12" height="11" rx="1"/><path d="M5 1.5v3M11 1.5v3M2 6.5h12"/></svg>;
    case "clock":    return <svg {...common}><circle cx="8" cy="8" r="6"/><path d="M8 5v3l2 1.5"/></svg>;
    case "money":    return <svg {...common}><rect x="2" y="4" width="12" height="8" rx="1"/><circle cx="8" cy="8" r="2"/><path d="M4.5 8h.01M11.5 8h.01"/></svg>;
    case "building": return <svg {...common}><rect x="3" y="2" width="10" height="12" rx="0.5"/><path d="M5.5 5.5h1M5.5 8h1M5.5 10.5h1M9.5 5.5h1M9.5 8h1M9.5 10.5h1"/></svg>;
    case "package":  return <svg {...common}><path d="M2 5 8 2l6 3v6L8 14 2 11z"/><path d="M2 5l6 3 6-3M8 8v6"/></svg>;
    case "telegram": return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M9.5 14.6 9.4 18c.3 0 .5-.2.7-.4l1.7-1.6 3.5 2.6c.6.4 1.1.2 1.3-.6l2.4-11.3c.2-1-.4-1.4-1-1.2L3.7 10.7c-1 .4-1 1-.2 1.2l3.6 1.1L15.6 8c.4-.3.8-.1.5.2"/></svg>;
    case "globe":    return <svg {...common}><circle cx="8" cy="8" r="6"/><path d="M2 8h12M8 2c2 2 2 10 0 12M8 2c-2 2-2 10 0 12"/></svg>;
    case "moon":     return <svg {...common}><path d="M13 9.5A5.5 5.5 0 0 1 6.5 3 5.5 5.5 0 1 0 13 9.5z"/></svg>;
    case "sun":      return <svg {...common}><circle cx="8" cy="8" r="3"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.5 1.5M11.5 11.5 13 13M3 13l1.5-1.5M11.5 4.5 13 3"/></svg>;
    default:         return null;
  }
};

window.Icon = Icon;
