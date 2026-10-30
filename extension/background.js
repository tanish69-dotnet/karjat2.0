// Thaw Chrome Extension Background Service Worker
// Monitors tab switches, signals distractions, and provides gentle, zero-shame nudges.

const DISTRACTING_DOMAINS = [
  "youtube.com",
  "twitter.com",
  "x.com",
  "instagram.com",
  "reddit.com",
  "tiktok.com",
  "facebook.com",
  "netflix.com"
];

let tabSwitchCount = 0;
let lastSwitchTime = Date.now();
let activeFocusSession = false;

// Listen for tab activation / switching
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const now = Date.now();
  if (now - lastSwitchTime < 8000) {
    tabSwitchCount++;
  } else {
    tabSwitchCount = Math.max(0, tabSwitchCount - 1);
  }
  lastSwitchTime = now;

  // Signal: High rapid tab jumping indicates executive overwhelm or distraction
  if (tabSwitchCount >= 4) {
    tabSwitchCount = 0;
    triggerGentleNudge(
      "Noticing Rapid Tab Switching?",
      "You are shifting between tabs rapidly. Take a slow breath. What is the single 2-minute micro-action you need right now?"
    );
  }

  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    checkTabUrl(tab.url);
  } catch (e) {
    // Tab closed or unavailable
  }
});

// Listen for tab URL updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    checkTabUrl(changeInfo.url);
  }
});

function checkTabUrl(url) {
  if (!url) return;
  const isDistracting = DISTRACTING_DOMAINS.some((domain) => url.includes(domain));
  if (isDistracting) {
    triggerGentleNudge(
      "Gentle Anchor from Thaw",
      "You opened a high-stimulation site. Remember: guilt-free 2-minute micro-steps dissolve friction. Ready to return to your workspace?"
    );
  }
}

function triggerGentleNudge(title, message) {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "icons/icon128.png",
    title: `❄ Thaw · ${title}`,
    message: message,
    priority: 2,
    buttons: [
      { title: "Open Thaw Reading Desk" },
      { title: "Mute for 10 min" }
    ]
  });
}

// Notification button handlers
chrome.notifications.onButtonClicked.addListener((notifId, btnIdx) => {
  if (btnIdx === 0) {
    chrome.tabs.create({ url: "http://localhost:3000/dashboard" });
  }
});

