// Pegasus Focus Companion — Behavior Analysis Engine
// Identifies browsing patterns and computes the 6 Pegasus Companion states.
// IMPORTANT: Strictly non-clinical, non-pathologizing language.

const PEGASUS_STATES = {
  NORMAL: "normal",
  FREQUENT_TAB_SWITCHING: "frequent_tab_switching",
  PROLONGED_ACTIVITY: "prolonged_activity",
  POSSIBLE_DISTRACTION: "possible_distraction",
  REPEATED_INTERRUPTIONS: "repeated_interruptions",
  FOCUSED_STUDY: "focused_study"
};

const STATE_METADATA = {
  [PEGASUS_STATES.NORMAL]: {
    label: "On Track",
    badgeClass: "badge-normal",
    ringColor: "#c87046", // Warm copper
    pulse: false,
    message: "You're doing fine. Keep going!",
    subMessage: "Pegasus is observing quietly in the background.",
    actions: [
      { id: "keep_going", label: "Keep going", primary: true },
      { id: "open_thaw", label: "Open Focus Chamber", primary: false }
    ]
  },
  [PEGASUS_STATES.FREQUENT_TAB_SWITCHING]: {
    label: "Rapid Tab Switching",
    badgeClass: "badge-switching",
    ringColor: "#d97706", // Amber
    pulse: true,
    message: "Hey! You've been switching between tabs quite frequently. Everything okay?",
    subMessage: "Rapid tab switching detected in the last 60 seconds.",
    actions: [
      { id: "organize_tasks", label: "Organise my tasks", primary: true },
      { id: "help_focus", label: "Help me focus", primary: false }
    ]
  },
  [PEGASUS_STATES.PROLONGED_ACTIVITY]: {
    label: "Prolonged Activity",
    badgeClass: "badge-prolonged",
    ringColor: "#e09f3e", // Soft ochre
    pulse: true,
    message: "You've been on this website for quite a while. Would you like to take a short break?",
    subMessage: "Extended continuous engagement on a single platform.",
    actions: [
      { id: "take_break", label: "Take a 3-minute breather", primary: true },
      { id: "back_to_study", label: "Return to study material", primary: false }
    ]
  },
  [PEGASUS_STATES.POSSIBLE_DISTRACTION]: {
    label: "Possible Distraction",
    badgeClass: "badge-distraction",
    ringColor: "#d64045", // Terracotta / muted crimson
    pulse: true,
    message: "You've been away from your study material for a while. Ready to refocus?",
    subMessage: "Prolonged entertainment activity detected while studying.",
    actions: [
      { id: "back_to_study", label: "Return to study material", primary: true },
      { id: "summarize_material", label: "Summarise my study doc", primary: false }
    ]
  },
  [PEGASUS_STATES.REPEATED_INTERRUPTIONS]: {
    label: "Fragmented Focus",
    badgeClass: "badge-interruptions",
    ringColor: "#9b5de5", // Muted violet
    pulse: true,
    message: "I noticed you've been switching between different activities. Would you like me to help organise your study session?",
    subMessage: "Alternating between study and recreational tabs.",
    actions: [
      { id: "organize_tasks", label: "Help organise session", primary: true },
      { id: "set_micro_goal", label: "Set a 5-min micro-goal", primary: false }
    ]
  },
  [PEGASUS_STATES.FOCUSED_STUDY]: {
    label: "Focused Study Flow",
    badgeClass: "badge-focused",
    ringColor: "#4e825a", // Sage emerald
    pulse: false,
    message: "Great work! You're maintaining a focused study session.",
    subMessage: "Consistent engagement with educational material.",
    actions: [
      { id: "keep_going", label: "Maintain momentum", primary: true },
      { id: "summarize_material", label: "Summarise key ideas", primary: false }
    ]
  }
};

const BehaviorAnalyzer = {
  analyze(metrics) {
    const {
      activeTab,
      lastStudyTab,
      distractionDuration,
      switchesLastMinute,
      tabSwitchHistory,
      categoryTotals
    } = metrics;

    const patterns = [];
    const now = Date.now();

    // 1. Pattern A: Excessive Tab Switching (e.g. 7+ switches in the last minute)
    if (switchesLastMinute >= 7) {
      patterns.push({
        id: "excessive_tab_switching",
        label: "Frequent Tab Switching",
        severity: "medium",
        confidence: 0.88,
        description: `${switchesLastMinute} tab switches detected in the last minute.`
      });
    }

    // 2. Pattern B: Excessive Site Switching (Fragmented browsing across distinct domains)
    if (tabSwitchHistory && tabSwitchHistory.length >= 8) {
      const recent8 = tabSwitchHistory.slice(-8);
      const uniqueDomains = new Set(recent8.map((item) => item.domain));
      if (uniqueDomains.size >= 5) {
        patterns.push({
          id: "excessive_site_switching",
          label: "Fragmented Navigation",
          severity: "medium",
          confidence: 0.82,
          description: `Navigating across ${uniqueDomains.size} distinct domains in a short window.`
        });
      }
    }

    // 3. Pattern C: Prolonged Single Website Activity (on entertainment / distracting)
    if (activeTab && activeTab.category === "distracting") {
      const activeSec = Math.floor((now - activeTab.startTime) / 1000);
      if (activeSec >= 180) { // 3+ minutes continuously
        patterns.push({
          id: "prolonged_single_site",
          label: "Prolonged Single Site Activity",
          severity: activeSec >= 300 ? "high" : "medium",
          confidence: 0.92,
          description: `Spent over ${formatSeconds(activeSec)} continuously on ${activeTab.domain}.`
        });
      }
    }

    // 4. Pattern D: Repeated Interruptions (oscillating study -> distracting -> study -> distracting)
    if (tabSwitchHistory && tabSwitchHistory.length >= 6) {
      const recent6 = tabSwitchHistory.slice(-6);
      let alternatingChanges = 0;
      for (let i = 1; i < recent6.length; i++) {
        const prev = recent6[i - 1].category;
        const curr = recent6[i].category;
        if (
          (prev === "educational" && curr === "distracting") ||
          (prev === "distracting" && curr === "educational")
        ) {
          alternatingChanges++;
        }
      }
      if (alternatingChanges >= 3) {
        patterns.push({
          id: "repeated_interruptions",
          label: "Alternating Interruptions",
          severity: "high",
          confidence: 0.85,
          description: "Rapidly alternating between study material and recreational content."
        });
      }
    }

    // 5. Pattern E: Frequent Navigation Without Clear Progression (rapid neutral/unrelated jumps)
    if (tabSwitchHistory && tabSwitchHistory.length >= 6) {
      const recent = tabSwitchHistory.slice(-6);
      const allBrief = recent.every((r, idx) => {
        if (idx === 0) return true;
        const gap = (r.timestamp - recent[idx - 1].timestamp) / 1000;
        return gap < 12; // less than 12s on each
      });
      const noEducational = recent.every((r) => r.category !== "educational");
      if (allBrief && noEducational) {
        patterns.push({
          id: "unstable_navigation",
          label: "Browsing Instability",
          severity: "low",
          confidence: 0.75,
          description: "Rapid navigation between sites without prolonged engagement."
        });
      }
    }

    // Determine the Primary Pegasus Companion State
    let currentState = PEGASUS_STATES.NORMAL;

    // Distraction has highest priority if user is actively on distracting content with prior study context
    if (activeTab && activeTab.category === "distracting") {
      if (distractionDuration >= 120) {
        currentState = PEGASUS_STATES.POSSIBLE_DISTRACTION;
      } else if (distractionDuration >= 45) {
        currentState = PEGASUS_STATES.PROLONGED_ACTIVITY;
      } else {
        currentState = PEGASUS_STATES.NORMAL;
      }
    } else if (patterns.some((p) => p.id === "repeated_interruptions")) {
      currentState = PEGASUS_STATES.REPEATED_INTERRUPTIONS;
    } else if (patterns.some((p) => p.id === "excessive_tab_switching")) {
      currentState = PEGASUS_STATES.FREQUENT_TAB_SWITCHING;
    } else if (
      activeTab &&
      activeTab.category === "educational" &&
      categoryTotals.educational >= 120
    ) {
      currentState = PEGASUS_STATES.FOCUSED_STUDY;
    } else if (patterns.some((p) => p.id === "excessive_site_switching")) {
      currentState = PEGASUS_STATES.FREQUENT_TAB_SWITCHING;
    }

    const stateMeta = STATE_METADATA[currentState] || STATE_METADATA[PEGASUS_STATES.NORMAL];

    return {
      state: currentState,
      meta: stateMeta,
      detectedPatterns: patterns,
      distractionAwayDuration: distractionDuration,
      lastStudyTab: lastStudyTab,
      timestamp: now
    };
  }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    PEGASUS_STATES,
    STATE_METADATA,
    BehaviorAnalyzer
  };
}
