// Pegasus Focus Companion — Utils & Classification Engine

const EDUCATIONAL_DOMAINS = [
  "arxiv.org",
  "scholar.google",
  "sciencedirect.com",
  "jstor.org",
  "researchgate.net",
  "ncbi.nlm.nih.gov",
  "coursera.org",
  "edx.org",
  "khanacademy.org",
  "udemy.com",
  "mit.edu",
  "stanford.edu",
  "harvard.edu",
  "berkeley.edu",
  "overleaf.com",
  "wikipedia.org",
  "canvas.",
  "blackboard.",
  "moodle.",
  "developer.mozilla.org",
  "docs.python.org",
  "react.dev",
  "nextjs.org",
  "nodejs.org",
  "typescriptlang.org",
  "github.com",
  "stackoverflow.com",
  "w3schools.com",
  "geeksforgeeks.org",
  "leetcode.com",
  "hackerrank.com",
  "docs.google.com/document",
  "docs.google.com/presentation"
];

const DISTRACTING_DOMAINS = [
  "instagram.com",
  "tiktok.com",
  "snapchat.com",
  "reddit.com",
  "twitter.com",
  "x.com",
  "facebook.com",
  "netflix.com",
  "twitch.tv",
  "hulu.com",
  "disneyplus.com",
  "primevideo.com",
  "crunchyroll.com",
  "9gag.com",
  "buzzfeed.com",
  "roblox.com",
  "store.steampowered.com",
  "ign.com"
];

const EDUCATIONAL_KEYWORDS = [
  "tutorial", "lecture", "course", "seminar", "explanation", "documentary",
  "study with me", "math", "physics", "chemistry", "biology", "computer science",
  "history", "coding", "lesson", "crash course", "mit opencourseware", "cs50",
  "calculus", "linear algebra", "algorithm", "data structure", "academic",
  "paper", "thesis", "dissertation", "syllabus", "textbook"
];

/**
 * Classifies a website based on URL, title, and path context.
 * IMPORTANT: YouTube is not categorically marked distracting; Shorts are isolated from lectures.
 */
function classifyWebsite(url = "", title = "") {
  if (!url) {
    return { category: "neutral", reason: "blank_url", specificType: "none" };
  }

  const urlLower = url.toLowerCase();
  const titleLower = title.toLowerCase();

  // 1. PDF Documents (local or web)
  if (
    urlLower.endsWith(".pdf") ||
    urlLower.includes("/pdf/") ||
    urlLower.includes(".pdf?") ||
    (urlLower.startsWith("file://") && urlLower.endsWith(".pdf"))
  ) {
    return {
      category: "educational",
      reason: "pdf_study_document",
      specificType: "pdf"
    };
  }

  // 2. YouTube Specific Discrimination: Shorts vs Educational Lectures
  if (urlLower.includes("youtube.com") || urlLower.includes("youtu.be")) {
    if (urlLower.includes("/shorts/")) {
      return {
        category: "distracting",
        reason: "short_form_video",
        specificType: "youtube_shorts"
      };
    }

    // Inspect title and URL parameters for lecture/educational markers
    const isEducationalVideo = EDUCATIONAL_KEYWORDS.some(
      (kw) => titleLower.includes(kw) || urlLower.includes(kw)
    );

    if (isEducationalVideo) {
      return {
        category: "educational",
        reason: "educational_video_lecture",
        specificType: "youtube_lecture"
      };
    }

    // Otherwise neutral/standard video viewing
    return {
      category: "neutral",
      reason: "standard_video_viewing",
      specificType: "youtube_general"
    };
  }

  // 3. Known Distracting Platforms (Shorts, reels, social feeds)
  for (const domain of DISTRACTING_DOMAINS) {
    if (urlLower.includes(domain)) {
      return {
        category: "distracting",
        reason: "entertainment_social_media",
        specificType: domain.replace(".com", "").replace(".tv", "")
      };
    }
  }

  // 4. Known Educational Platforms & Research Libraries
  for (const domain of EDUCATIONAL_DOMAINS) {
    if (urlLower.includes(domain)) {
      return {
        category: "educational",
        reason: "study_platform_or_documentation",
        specificType: domain.replace(".org", "").replace(".edu", "").replace(".com", "")
      };
    }
  }

  // 5. Search & Productive Tools (Neutral)
  if (
    urlLower.includes("google.com/search") ||
    urlLower.includes("bing.com/search") ||
    urlLower.includes("duckduckgo.com") ||
    urlLower.includes("mail.google.com") ||
    urlLower.includes("outlook.com") ||
    urlLower.includes("localhost:3000") // Thaw/Pegasus Dashboard
  ) {
    return {
      category: "neutral",
      reason: "search_or_productive_utility",
      specificType: "utility"
    };
  }

  // 6. Title keyword check on arbitrary websites
  const hasEducationalTitle = EDUCATIONAL_KEYWORDS.some((kw) => titleLower.includes(kw));
  if (hasEducationalTitle) {
    return {
      category: "educational",
      reason: "educational_title_keywords",
      specificType: "general_educational"
    };
  }

  // 7. Default to Neutral for unclassified general browsing
  return {
    category: "neutral",
    reason: "general_browsing",
    specificType: "general"
  };
}

function extractDomain(url) {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, "");
  } catch (e) {
    return url || "unknown";
  }
}

function formatSeconds(seconds) {
  const s = Math.max(0, Math.floor(seconds || 0));
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;

  if (hrs > 0) {
    return `${hrs}h ${mins}m`;
  }
  if (mins > 0) {
    return `${mins}m ${String(secs).padStart(2, "0")}s`;
  }
  return `${secs}s`;
}

function storageGet(keys) {
  return new Promise((resolve) => {
    chrome.storage.local.get(keys, (res) => resolve(res || {}));
  });
}

function storageSet(items) {
  return new Promise((resolve) => {
    chrome.storage.local.set(items, () => resolve());
  });
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    classifyWebsite,
    extractDomain,
    formatSeconds,
    storageGet,
    storageSet,
    EDUCATIONAL_DOMAINS,
    DISTRACTING_DOMAINS,
  };
}
