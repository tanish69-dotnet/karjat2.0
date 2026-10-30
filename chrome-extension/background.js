// Pegasus Focus Companion — Background Service Worker (Manifest V3)
importScripts("utils.js", "activityTracker.js", "behaviorAnalyzer.js", "notifications.js");

const SYNC_INTERVAL_MS = 25000;
let lastSyncTime = 0;

// Setup alarms & listeners on installation
chrome.runtime.onInstalled.addListener(() => {
  console.log("[Pegasus] Service Worker Installed.");
  chrome.alarms.create("pegasus_periodic_tick", { periodInMinutes: 0.1 }); // ~6-10s
});

// Initialize Tracker
ActivityTracker.init();
NotificationsManager.setupListeners();

// 1. Tab Activation Listener
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    ActivityTracker.handleTabActivated(tab);
    evaluateAndNotify();
  } catch (err) {
    console.debug("[Pegasus] Tab activation query error:", err);
  }
});

// 2. Tab URL / Title Update Listener
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" || changeInfo.url) {
    ActivityTracker.handleTabUpdated(tabId, changeInfo, tab);
    evaluateAndNotify();
  }
});

// 3. Window Focus Changed Listener
chrome.windows.onFocusChanged.addListener((windowId) => {
  const isFocused = windowId !== chrome.windows.WINDOW_ID_NONE;
  ActivityTracker.handleWindowFocus(isFocused);
});

// 4. Idle Detection
chrome.idle.onStateChanged.addListener((newState) => {
  ActivityTracker.handleIdleState(newState);
});

// 5. Periodic Tick Alarm
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "pegasus_periodic_tick") {
    onTick(6);
  }
});

// In-worker interval for responsive 5-second tracking when active
setInterval(() => {
  onTick(5);
}, 5000);

function onTick(deltaSec) {
  ActivityTracker.tick(deltaSec);
  evaluateAndNotify();
  checkPeriodicSync();
}

function evaluateAndNotify() {
  const metrics = ActivityTracker.getMetrics();
  const analysis = BehaviorAnalyzer.analyze(metrics);

  // Persist the latest analysis so popup and content scripts have instant access
  storageSet({
    pegasus_latestAnalysis: analysis,
    pegasus_companionState: analysis.state,
    pegasus_metrics: metrics
  });

  // Evaluate distraction notifications
  if (analysis.state === PEGASUS_STATES.POSSIBLE_DISTRACTION) {
    NotificationsManager.notifyDistraction(metrics.distractionDuration, metrics.lastStudyTab);
  } else if (analysis.state === PEGASUS_STATES.FREQUENT_TAB_SWITCHING) {
    NotificationsManager.notifyTabSwitching(metrics.switchesLastMinute);
  }
}

async function checkPeriodicSync() {
  const now = Date.now();
  if (now - lastSyncTime < SYNC_INTERVAL_MS) return;
  lastSyncTime = now;

  const metrics = ActivityTracker.getMetrics();
  const analysis = BehaviorAnalyzer.analyze(metrics);

  // Sync to Next.js Pegasus API endpoint
  try {
    await fetch("http://localhost:3000/api/pegasus/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionDuration: metrics.sessionDuration,
        categoryTotals: metrics.categoryTotals,
        domainTotals: metrics.domainTotals,
        totalSwitches: metrics.totalSwitches,
        switchesLastMinute: metrics.switchesLastMinute,
        distractionDuration: metrics.distractionDuration,
        focusEfficiency: metrics.focusEfficiency,
        activeTab: metrics.activeTab,
        lastStudyTab: metrics.lastStudyTab,
        state: analysis.state,
        detectedPatterns: analysis.detectedPatterns
      })
    });
  } catch (e) {
    // Graceful offline fallback: Next.js dev server may be sleeping or restarting
    // Pegasus runs deterministically client-side without crashing
  }
}

// 6. Runtime Message Listener for Popup and Content Scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "GET_STATUS") {
    const metrics = ActivityTracker.getMetrics();
    const analysis = BehaviorAnalyzer.analyze(metrics);
    sendResponse({
      metrics,
      analysis,
      state: analysis.state,
      meta: analysis.meta
    });
    return true;
  }

  if (request.type === "RESTORE_STUDY_TAB") {
    restoreStudyTab().then((success) => sendResponse({ success }));
    return true;
  }

  if (request.type === "RESET_SESSION") {
    ActivityTracker.resetSession();
    const metrics = ActivityTracker.getMetrics();
    const analysis = BehaviorAnalyzer.analyze(metrics);
    sendResponse({ success: true, metrics, analysis });
    return true;
  }

  if (request.type === "PAGE_CONTEXT_UPDATE") {
    // Received context from content script (e.g. PDF detected, headings)
    if (request.isPdf && ActivityTracker.state.activeTab) {
      ActivityTracker.state.activeTab.category = "educational";
      ActivityTracker.state.activeTab.specificType = "pdf";
      ActivityTracker.state.lastStudyTab = {
        tabId: sender.tab?.id || ActivityTracker.state.activeTab.tabId,
        url: request.url,
        title: request.title || "Study Document (PDF)",
        domain: extractDomain(request.url),
        specificType: "pdf",
        timestamp: Date.now()
      };
      ActivityTracker.persist();
    }
    sendResponse({ received: true });
    return true;
  }
});

async function restoreStudyTab() {
  const data = await storageGet(["pegasus_lastStudyTab"]);
  const target = data.pegasus_lastStudyTab;
  if (!target) return false;

  try {
    if (target.tabId) {
      await chrome.tabs.update(target.tabId, { active: true });
      const tab = await chrome.tabs.get(target.tabId);
      if (tab.windowId) {
        await chrome.windows.update(tab.windowId, { focused: true });
      }
      return true;
    }
  } catch (e) {
    // Tab was closed, open fresh tab with target URL
    if (target.url) {
      await chrome.tabs.create({ url: target.url });
      return true;
    }
  }
  return false;
}

