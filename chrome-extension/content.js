// Pegasus Focus Companion — In-Page Content Script
// Inspects page context (PDF detection, headings) and renders an optional unobtrusive companion indicator.

(() => {
  // Avoid re-injecting
  if (window.__PEGASUS_INJECTED__) return;
  window.__PEGASUS_INJECTED__ = true;

  // 1. Detect PDF or Study Context
  const isPdf =
    document.contentType === "application/pdf" ||
    window.location.href.toLowerCase().endsWith(".pdf") ||
    !!document.querySelector('embed[type="application/pdf"]') ||
    !!document.querySelector('iframe[src*=".pdf"]');

  const pageTitle = document.title || "";
  const pageUrl = window.location.href;

  // Inform background worker of page context
  chrome.runtime.sendMessage({
    type: "PAGE_CONTEXT_UPDATE",
    isPdf: isPdf,
    title: pageTitle,
    url: pageUrl
  }).catch(() => {});

  // 2. Unobtrusive Floating Pegasus Circle Indicator (Shadow DOM isolated)
  const host = document.createElement("div");
  host.id = "pegasus-floating-companion-host";
  host.style.position = "fixed";
  host.style.bottom = "20px";
  host.style.right = "20px";
  host.style.zIndex = "2147483645";
  host.style.fontFamily = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  
  const shadow = host.attachShadow({ mode: "closed" });

  const style = document.createElement("style");
  style.textContent = `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    .pegasus-pip {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: #171a24;
      border: 2px solid #c87046;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      position: relative;
    }
    .pegasus-pip:hover {
      transform: scale(1.08);
      box-shadow: 0 6px 20px rgba(200, 112, 70, 0.4);
    }
    .pegasus-pip svg {
      width: 22px;
      height: 22px;
      fill: none;
      stroke: #f4eee6;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .status-ring {
      position: absolute;
      inset: -4px;
      border-radius: 50%;
      border: 2px solid transparent;
      pointer-events: none;
      transition: border-color 0.3s ease;
    }
    .pulse-ring {
      animation: pegasus-pulse 2.2s infinite ease-in-out;
    }
    @keyframes pegasus-pulse {
      0% { transform: scale(1); opacity: 0.9; }
      50% { transform: scale(1.18); opacity: 0.35; }
      100% { transform: scale(1); opacity: 0.9; }
    }
    .pegasus-card {
      position: absolute;
      bottom: 56px;
      right: 0;
      width: 280px;
      background: #171a24;
      border: 1px solid rgba(244, 238, 230, 0.15);
      border-radius: 12px;
      padding: 14px;
      color: #f4eee6;
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5);
      display: none;
      flex-direction: column;
      gap: 10px;
      backdrop-filter: blur(10px);
    }
    .pegasus-card.visible {
      display: flex;
      animation: pegasus-fadein 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes pegasus-fadein {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding-bottom: 8px;
    }
    .card-title {
      font-size: 11px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      font-weight: 700;
      color: #c87046;
    }
    .card-close {
      background: transparent;
      border: none;
      color: #a0998f;
      cursor: pointer;
      font-size: 16px;
      line-height: 1;
    }
    .card-message {
      font-size: 13px;
      line-height: 1.45;
      color: #ece5dc;
    }
    .card-actions {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-top: 4px;
    }
    .card-btn {
      padding: 7px 10px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      border: none;
      text-align: center;
      transition: background 0.15s ease;
    }
    .card-btn-primary {
      background: #c87046;
      color: #0d0f14;
      font-weight: 600;
    }
    .card-btn-primary:hover {
      background: #d88157;
    }
    .card-btn-secondary {
      background: rgba(244, 238, 230, 0.08);
      color: #f4eee6;
    }
    .card-btn-secondary:hover {
      background: rgba(244, 238, 230, 0.14);
    }
  `;

  shadow.appendChild(style);

  // Widget Markup
  const container = document.createElement("div");
  container.innerHTML = `
    <div class="pegasus-card" id="pegasusCard">
      <div class="card-header">
        <span class="card-title" id="cardStateTitle">Pegasus Companion</span>
        <button class="card-close" id="cardCloseBtn">&times;</button>
      </div>
      <p class="card-message" id="cardStateMsg">You're doing fine. Keep going!</p>
      <div class="card-actions" id="cardActions">
        <button class="card-btn card-btn-primary" id="btnAction1">Open Focus Chamber</button>
        <button class="card-btn card-btn-secondary" id="btnAction2">Dismiss</button>
      </div>
    </div>
    <div class="pegasus-pip" id="pegasusPip" title="Pegasus Focus Companion">
      <div class="status-ring" id="statusRing"></div>
      <svg viewBox="0 0 24 24">
        <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z"></path>
      </svg>
    </div>
  `;
  shadow.appendChild(container);

  // Attach to body
  if (document.body) {
    document.body.appendChild(host);
  } else {
    document.addEventListener("DOMContentLoaded", () => {
      document.body.appendChild(host);
    });
  }

  // Interactivity
  const pip = shadow.getElementById("pegasusPip");
  const card = shadow.getElementById("pegasusCard");
  const closeBtn = shadow.getElementById("cardCloseBtn");
  const statusRing = shadow.getElementById("statusRing");
  const cardStateTitle = shadow.getElementById("cardStateTitle");
  const cardStateMsg = shadow.getElementById("cardStateMsg");
  const btnAction1 = shadow.getElementById("btnAction1");
  const btnAction2 = shadow.getElementById("btnAction2");

  pip.addEventListener("click", () => {
    card.classList.toggle("visible");
    refreshStatus();
  });

  closeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    card.classList.remove("visible");
  });

  btnAction1.addEventListener("click", () => {
    chrome.runtime.sendMessage({ type: "RESTORE_STUDY_TAB" }).then((res) => {
      if (!res || !res.success) {
        window.open("http://localhost:3000/timer", "_blank");
      }
    });
    card.classList.remove("visible");
  });

  btnAction2.addEventListener("click", () => {
    card.classList.remove("visible");
  });

  function refreshStatus() {
    chrome.runtime.sendMessage({ type: "GET_STATUS" }, (res) => {
      if (chrome.runtime.lastError || !res) return;
      const { state, meta } = res;
      if (meta) {
        cardStateTitle.textContent = meta.label || "Pegasus Companion";
        cardStateMsg.textContent = meta.message || "You're doing fine. Keep going!";
        statusRing.style.borderColor = meta.ringColor || "#c87046";
        if (meta.pulse) {
          statusRing.classList.add("pulse-ring");
        } else {
          statusRing.classList.remove("pulse-ring");
        }

        if (meta.actions && meta.actions.length > 0) {
          btnAction1.textContent = meta.actions[0].label;
          if (meta.actions.length > 1) {
            btnAction2.textContent = meta.actions[1].label;
            btnAction2.style.display = "block";
          } else {
            btnAction2.style.display = "none";
          }
        }
      }
    });
  }

  // Initial status fetch
  refreshStatus();
})();

