// Pegasus Focus Companion — Notifications System
// Dispatches non-intrusive notifications with cooldowns and actionable buttons.

const NotificationsManager = {
  cooldowns: {
    distraction_2m: 3 * 60 * 1000, // 3 minutes cooldown
    distraction_5m: 5 * 60 * 1000,
    tab_switching: 4 * 60 * 1000,
    repeated_interruptions: 4 * 60 * 1000
  },
  lastNotified: {},

  canNotify(type) {
    const last = this.lastNotified[type] || 0;
    const cooldown = this.cooldowns[type] || 3 * 60 * 1000;
    return Date.now() - last > cooldown;
  },

  recordNotified(type) {
    this.lastNotified[type] = Date.now();
  },

  async notifyDistraction(distractionSec, lastStudyTab) {
    if (distractionSec >= 300) {
      if (!this.canNotify("distraction_5m")) return;
      this.recordNotified("distraction_5m");

      const studyTitle = lastStudyTab ? ` "${lastStudyTab.title.slice(0, 30)}..."` : " your study material";
      chrome.notifications.create("pegasus_distraction_5m", {
        type: "basic",
        iconUrl: "icons/icon128.png",
        title: "Pegasus Focus Companion",
        message: `You've been away from${studyTitle} for over 5 minutes. Ready to regain your momentum?`,
        buttons: [
          { title: "Return to Study Tab" },
          { title: "Take a 5-min Breather" }
        ],
        priority: 1,
        requireInteraction: true
      });
    } else if (distractionSec >= 120) {
      if (!this.canNotify("distraction_2m")) return;
      this.recordNotified("distraction_2m");

      chrome.notifications.create("pegasus_distraction_2m", {
        type: "basic",
        iconUrl: "icons/icon48.png",
        title: "Pegasus Focus Companion",
        message: "Hey! You've been away from your study material for a while. Want to get back on track?",
        buttons: [
          { title: "Back to Study" },
          { title: "Dismiss" }
        ],
        priority: 0
      });
    }
  },

  async notifyTabSwitching(switchesCount) {
    if (!this.canNotify("tab_switching")) return;
    this.recordNotified("tab_switching");

    chrome.notifications.create("pegasus_tab_switching", {
      type: "basic",
      iconUrl: "icons/icon48.png",
      title: "Pegasus Focus Companion",
      message: `You've switched tabs ${switchesCount} times quickly. Everything okay? Want help organizing tasks?`,
      buttons: [
        { title: "Organize Tasks" },
        { title: "I'm OK" }
      ],
      priority: 0
    });
  },

  async notifyPattern(patternId, title, message) {
    if (!this.canNotify(patternId)) return;
    this.recordNotified(patternId);

    chrome.notifications.create(`pegasus_${patternId}`, {
      type: "basic",
      iconUrl: "icons/icon48.png",
      title: title || "Pegasus Focus Companion",
      message: message,
      priority: 0
    });
  },

  setupListeners() {
    chrome.notifications.onButtonClicked.addListener(async (notificationId, buttonIndex) => {
      if (notificationId.startsWith("pegasus_distraction")) {
        if (buttonIndex === 0) {
          // "Return to Study Tab"
          const data = await storageGet(["pegasus_lastStudyTab"]);
          if (data.pegasus_lastStudyTab && data.pegasus_lastStudyTab.tabId) {
            try {
              await chrome.tabs.update(data.pegasus_lastStudyTab.tabId, { active: true });
              const tab = await chrome.tabs.get(data.pegasus_lastStudyTab.tabId);
              if (tab.windowId) {
                await chrome.windows.update(tab.windowId, { focused: true });
              }
            } catch (e) {
              // Tab may have closed, open the URL in new tab
              if (data.pegasus_lastStudyTab.url) {
                chrome.tabs.create({ url: data.pegasus_lastStudyTab.url });
              }
            }
          }
        } else if (buttonIndex === 1) {
          // "Take a 5-min Breather" or Dismiss
          chrome.notifications.clear(notificationId);
          // Set a 5-minute silence
          NotificationsManager.recordNotified("distraction_2m");
          NotificationsManager.recordNotified("distraction_5m");
        }
      } else if (notificationId === "pegasus_tab_switching") {
        if (buttonIndex === 0) {
          // "Organize Tasks" -> Open Thaw Task/Focus Chamber
          chrome.tabs.create({ url: "http://localhost:3000/sequencer" });
        }
      }
      chrome.notifications.clear(notificationId);
    });
  }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { NotificationsManager };
}

