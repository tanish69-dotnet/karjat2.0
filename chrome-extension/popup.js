// Pegasus Focus Companion — Popup Controller

let currentCompanionState = "normal";
let currentMeta = null;
let lastStudyData = null;

document.addEventListener("DOMContentLoaded", () => {
  initUI();
  fetchStatus();
  setInterval(fetchStatus, 1000);
});

function initUI() {
  const circleBtn = document.getElementById("pegasusCircleBtn");
  const checkinCard = document.getElementById("checkinCard");
  const btnReturnStudy = document.getElementById("btnReturnStudy");
  const btnOpenTimer = document.getElementById("btnOpenTimer");
  const btnOpenSequencer = document.getElementById("btnOpenSequencer");
  const btnAssistSummary = document.getElementById("btnAssistSummary");
  const btnResetSession = document.getElementById("btnResetSession");
  const btnCheckinPrimary = document.getElementById("btnCheckinPrimary");
  const btnCheckinSecondary = document.getElementById("btnCheckinSecondary");

  // Circle toggle
  circleBtn.addEventListener("click", () => {
    checkinCard.style.display = checkinCard.style.display === "none" ? "flex" : "none";
  });

  // Return to study button
  btnReturnStudy.addEventListener("click", () => {
    chrome.runtime.sendMessage({ type: "RESTORE_STUDY_TAB" });
  });

  // Open Thaw modules
  btnOpenTimer.addEventListener("click", () => {
    chrome.tabs.create({ url: "http://localhost:3000/timer" });
  });

  btnOpenSequencer.addEventListener("click", () => {
    chrome.tabs.create({ url: "http://localhost:3000/sequencer" });
  });

  // Reset Session
  btnResetSession.addEventListener("click", () => {
    if (confirm("Reset current session statistics?")) {
      chrome.runtime.sendMessage({ type: "RESET_SESSION" }, () => {
        fetchStatus();
      });
    }
  });

  // Check-in action buttons
  btnCheckinPrimary.addEventListener("click", () => {
    handleAction(btnCheckinPrimary.dataset.actionId);
  });

  btnCheckinSecondary.addEventListener("click", () => {
    checkinCard.style.display = "none";
  });

  // AI Context Summarize / Assist
  btnAssistSummary.addEventListener("click", async () => {
    const box = document.getElementById("aiResponseBox");
    const text = document.getElementById("aiResponseText");
    box.style.display = "block";
    text.textContent = "Synthesizing study context via Pegasus RAG...";

    try {
      const resp = await fetch("http://localhost:3000/api/pegasus/assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activeTab: window.__pegasusActiveTab,
          lastStudyTab: lastStudyData,
          query: "Summarize this study topic and provide a gentle 2-minute entry step."
        })
      });

      if (!resp.ok) {
        throw new Error(`Server returned status ${resp.status}`);
      }

      const resData = await resp.json();
      if (resData && resData.guidance) {
        text.innerHTML = `<strong>${resData.summaryTitle || "Key Insight"}:</strong> ${resData.guidance}`;
      } else {
        text.textContent = "Focus on one paragraph or section. Write down a single concept before continuing.";
      }
    } catch (e) {
      // Deterministic client fallback if server offline
      text.textContent = "Tip: When returning to study material, start by reading the first sentence and writing down 1 keyword to warm up your focus.";
    }
  });
}

function handleAction(actionId) {
  const checkinCard = document.getElementById("checkinCard");
  if (actionId === "back_to_study") {
    chrome.runtime.sendMessage({ type: "RESTORE_STUDY_TAB" });
    checkinCard.style.display = "none";
  } else if (actionId === "organize_tasks") {
    chrome.tabs.create({ url: "http://localhost:3000/sequencer" });
  } else if (actionId === "open_thaw") {
    chrome.tabs.create({ url: "http://localhost:3000/timer" });
  } else if (actionId === "take_break") {
    chrome.tabs.create({ url: "http://localhost:3000/rest" });
    checkinCard.style.display = "none";
  } else {
    checkinCard.style.display = "none";
  }
}

function fetchStatus() {
  chrome.runtime.sendMessage({ type: "GET_STATUS" }, (response) => {
    if (chrome.runtime.lastError || !response) return;

    const { metrics, analysis, state, meta } = response;
    currentCompanionState = state;
    currentMeta = meta;
    lastStudyData = metrics.lastStudyTab;
    window.__pegasusActiveTab = metrics.activeTab;

    renderCompanion(state, meta);
    renderMetrics(metrics);
    renderActiveTab(metrics.activeTab, metrics.lastStudyTab);
  });
}

function renderCompanion(state, meta) {
  const circleRing = document.getElementById("circleRing");
  const stateBadge = document.getElementById("stateBadge");
  const checkinMsg = document.getElementById("checkinMsg");
  const checkinSub = document.getElementById("checkinSub");
  const checkinLabel = document.getElementById("checkinLabel");
  const btnPrimary = document.getElementById("btnCheckinPrimary");
  const btnSecondary = document.getElementById("btnCheckinSecondary");

  if (!meta) return;

  // Ring appearance
  circleRing.style.borderColor = meta.ringColor || "#c87046";
  if (meta.pulse) {
    circleRing.classList.add("pulse-anim");
  } else {
    circleRing.classList.remove("pulse-anim");
  }

  // Header Badge
  stateBadge.textContent = meta.label || "On Track";
  stateBadge.style.borderColor = meta.ringColor || "#c87046";

  // Check-In Card
  checkinLabel.textContent = meta.label;
  checkinLabel.style.color = meta.ringColor;
  checkinMsg.textContent = meta.message;
  checkinSub.textContent = meta.subMessage;

  if (meta.actions && meta.actions.length > 0) {
    btnPrimary.textContent = meta.actions[0].label;
    btnPrimary.dataset.actionId = meta.actions[0].id;
    if (meta.actions.length > 1) {
      btnSecondary.textContent = meta.actions[1].label;
      btnSecondary.dataset.actionId = meta.actions[1].id;
      btnSecondary.style.display = "inline-flex";
    } else {
      btnSecondary.style.display = "none";
    }
  }
}

function renderMetrics(metrics) {
  const metricEfficiency = document.getElementById("metricEfficiency");
  const efficiencyBar = document.getElementById("efficiencyBar");
  const metricStudy = document.getElementById("metricStudy");
  const metricDistraction = document.getElementById("metricDistraction");
  const metricSwitches = document.getElementById("metricSwitches");
  const metricVelocity = document.getElementById("metricVelocity");

  const eff = metrics.focusEfficiency || 0;
  metricEfficiency.textContent = `${eff}%`;
  efficiencyBar.style.width = `${eff}%`;

  if (eff >= 75) {
    efficiencyBar.style.background = "#4e825a"; // emerald
  } else if (eff >= 45) {
    efficiencyBar.style.background = "#d97706"; // amber
  } else {
    efficiencyBar.style.background = "#d64045"; // terracotta
  }

  metricStudy.textContent = formatSeconds(metrics.categoryTotals?.educational || 0);
  metricDistraction.textContent = `${formatSeconds(metrics.categoryTotals?.distracting || 0)} distraction`;

  metricSwitches.textContent = metrics.totalSwitches || 0;
  metricVelocity.textContent = `${metrics.switchesLastMinute || 0} / min velocity`;
}

function renderActiveTab(activeTab, lastStudyTab) {
  const currentTabTitle = document.getElementById("currentTabTitle");
  const currentTabDomain = document.getElementById("currentTabDomain");
  const currentCategoryPill = document.getElementById("currentCategoryPill");
  const anchorCard = document.getElementById("anchorStudyCard");
  const anchorTitle = document.getElementById("anchorTitle");

  if (activeTab) {
    currentTabTitle.textContent = activeTab.title || activeTab.url;
    currentTabDomain.textContent = activeTab.domain;

    currentCategoryPill.className = "category-pill";
    if (activeTab.category === "educational") {
      currentCategoryPill.classList.add("pill-educational");
      currentCategoryPill.textContent = "Educational";
    } else if (activeTab.category === "distracting") {
      currentCategoryPill.classList.add("pill-distracting");
      currentCategoryPill.textContent = "Distracting";
    } else {
      currentCategoryPill.classList.add("pill-neutral");
      currentCategoryPill.textContent = "Neutral";
    }
  }

  // Anchor Study Tab Card
  if (
    lastStudyTab &&
    activeTab &&
    activeTab.tabId !== lastStudyTab.tabId &&
    activeTab.category !== "educational"
  ) {
    anchorCard.style.display = "flex";
    anchorTitle.textContent = lastStudyTab.title || lastStudyTab.domain;
  } else {
    anchorCard.style.display = "none";
  }
}

