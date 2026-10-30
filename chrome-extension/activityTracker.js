// Pegasus Focus Companion — Activity Tracker
// Monitors active tabs, duration, switching velocity, and away-from-study time.

const ActivityTracker = {
  state: {
    sessionStart: Date.now(),
    activeTab: null,
    lastStudyTab: null,
    distractionDuration: 0,
    tabSwitchHistory: [], // [{ timestamp, domain, category, title }]
    domainTotals: {},     // domain -> seconds
    categoryTotals: {
      educational: 0,
      distracting: 0,
      neutral: 0
    },
    totalTabSwitches: 0,
    isWindowFocused: true,
    isUserIdle: false
  },

  async init() {
    const data = await storageGet([
      "pegasus_session",
      "pegasus_lastStudyTab",
      "pegasus_categoryTotals",
      "pegasus_domainTotals",
      "pegasus_totalSwitches"
    ]);

    if (data.pegasus_lastStudyTab) {
      this.state.lastStudyTab = data.pegasus_lastStudyTab;
    }
    if (data.pegasus_categoryTotals) {
      this.state.categoryTotals = data.pegasus_categoryTotals;
    }
    if (data.pegasus_domainTotals) {
      this.state.domainTotals = data.pegasus_domainTotals;
    }
    if (typeof data.pegasus_totalSwitches === "number") {
      this.state.totalTabSwitches = data.pegasus_totalSwitches;
    }

    // Identify the initial active tab
    try {
      const [current] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (current) {
        this.handleTabActivated(current);
      }
    } catch (e) {
      console.warn("[Pegasus Tracker] Failed to query current tab at init:", e);
    }
  },

  handleTabActivated(tab) {
    if (!tab || !tab.url || tab.url.startsWith("chrome://")) return;

    const now = Date.now();
    const domain = extractDomain(tab.url);
    const classification = classifyWebsite(tab.url, tab.title || "");

    // Accumulate time on prior active tab if present
    if (this.state.activeTab && this.state.isWindowFocused && !this.state.isUserIdle) {
      const elapsedSec = Math.floor((now - this.state.activeTab.startTime) / 1000);
      if (elapsedSec > 0 && elapsedSec < 7200) {
        this.addSiteTime(this.state.activeTab.domain, this.state.activeTab.category, elapsedSec);
      }
    }

    // If current tab is educational, remember it as the anchor study tab
    if (classification.category === "educational") {
      this.state.lastStudyTab = {
        tabId: tab.id,
        url: tab.url,
        title: tab.title || domain,
        domain: domain,
        specificType: classification.specificType,
        timestamp: now
      };
      this.state.distractionDuration = 0;
      storageSet({ pegasus_lastStudyTab: this.state.lastStudyTab });
    }

    // Record tab switch history
    this.state.tabSwitchHistory.push({
      timestamp: now,
      domain: domain,
      category: classification.category,
      title: tab.title || ""
    });

    // Keep history bounded to last 40 events
    if (this.state.tabSwitchHistory.length > 40) {
      this.state.tabSwitchHistory.shift();
    }

    this.state.totalTabSwitches++;

    // Set new active tab
    this.state.activeTab = {
      tabId: tab.id,
      url: tab.url,
      title: tab.title || domain,
      domain: domain,
      category: classification.category,
      specificType: classification.specificType,
      startTime: now
    };

    this.persist();
  },

  handleTabUpdated(tabId, changeInfo, tab) {
    if (this.state.activeTab && this.state.activeTab.tabId === tabId && changeInfo.url) {
      this.handleTabActivated(tab);
    }
  },

  handleWindowFocus(isFocused) {
    this.state.isWindowFocused = isFocused;
    if (!isFocused && this.state.activeTab) {
      const now = Date.now();
      const elapsedSec = Math.floor((now - this.state.activeTab.startTime) / 1000);
      if (elapsedSec > 0) {
        this.addSiteTime(this.state.activeTab.domain, this.state.activeTab.category, elapsedSec);
        this.state.activeTab.startTime = now;
      }
    }
  },

  handleIdleState(idleState) {
    this.state.isUserIdle = idleState !== "active";
  },

  tick(deltaSec) {
    if (!this.state.isWindowFocused || this.state.isUserIdle || !this.state.activeTab) {
      return;
    }

    const { domain, category } = this.state.activeTab;
    this.addSiteTime(domain, category, deltaSec);

    if (category === "distracting") {
      this.state.distractionDuration += deltaSec;
    } else if (category === "educational") {
      this.state.distractionDuration = 0;
    }

    this.persist();
  },

  addSiteTime(domain, category, seconds) {
    if (!domain || seconds <= 0) return;
    this.state.domainTotals[domain] = (this.state.domainTotals[domain] || 0) + seconds;
    if (this.state.categoryTotals[category] !== undefined) {
      this.state.categoryTotals[category] += seconds;
    }
  },

  persist() {
    storageSet({
      pegasus_categoryTotals: this.state.categoryTotals,
      pegasus_domainTotals: this.state.domainTotals,
      pegasus_totalSwitches: this.state.totalTabSwitches,
      pegasus_distractionDuration: this.state.distractionDuration,
      pegasus_activeTab: this.state.activeTab
    });
  },

  resetSession() {
    this.state.categoryTotals = { educational: 0, distracting: 0, neutral: 0 };
    this.state.domainTotals = {};
    this.state.totalTabSwitches = 0;
    this.state.distractionDuration = 0;
    this.state.sessionStart = Date.now();
    this.state.tabSwitchHistory = [];
    this.persist();
  },

  getMetrics() {
    const now = Date.now();
    const recentWindowMs = 60 * 1000; // last 60 seconds
    const switchesLastMinute = this.state.tabSwitchHistory.filter(
      (ev) => now - ev.timestamp <= recentWindowMs
    ).length;

    const totalTrackedSec =
      this.state.categoryTotals.educational +
      this.state.categoryTotals.distracting +
      this.state.categoryTotals.neutral;

    const focusEfficiency =
      totalTrackedSec > 0
        ? Math.round((this.state.categoryTotals.educational / totalTrackedSec) * 100)
        : 100;

    return {
      sessionDuration: Math.floor((now - this.state.sessionStart) / 1000),
      activeTab: this.state.activeTab,
      lastStudyTab: this.state.lastStudyTab,
      categoryTotals: { ...this.state.categoryTotals },
      domainTotals: { ...this.state.domainTotals },
      totalSwitches: this.state.totalTabSwitches,
      switchesLastMinute: switchesLastMinute,
      distractionDuration: this.state.distractionDuration,
      focusEfficiency: focusEfficiency,
      tabSwitchHistory: [...this.state.tabSwitchHistory]
    };
  }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { ActivityTracker };
}

