export type BookConfig = {
  id: string;
  title: string;
  roman: string;
  discipline: string;
  deck: string;
  route: string;
  color: string;
  foil: string;
};

export const BOOK_CONFIGS: BookConfig[] = [
  {
    id: "thaw-energy",
    title: "Energy & Capacity",
    roman: "I",
    discipline: "Adaptive Energy Check-in",
    deck: "The cornerstone of Thaw: check your current spoon level (1–5) and let your day adapt.",
    route: "/dashboard",
    color: "#182a43",
    foil: "#c87046",
  },
  {
    id: "thaw-sequencer",
    title: "AI Sequencer",
    roman: "II",
    discipline: "Intelligent Micro-steps",
    deck: "Thaw's RAG engine matches your assignment with executive function strategies, dissolving overwhelm.",
    route: "/sequencer",
    color: "#281b18",
    foil: "#c87046",
  },
  {
    id: "thaw-timer",
    title: "Focus & Presence",
    roman: "III",
    discipline: "Virtual Body Doubling",
    deck: "Calm, unpressured intervals paired with subtle ambient doubling to keep you anchored without anxiety.",
    route: "/timer",
    color: "#15202e",
    foil: "#c87046",
  },
  {
    id: "thaw-rest",
    title: "Rest Sanctuary",
    roman: "IV",
    discipline: "Guilt-Free Recovery",
    deck: "A dedicated sanctuary with guided breathing and restorative micro-breaks. Zero shame.",
    route: "/rest",
    color: "#182622",
    foil: "#c87046",
  },
  {
    id: "thaw-tasks",
    title: "Flexible Tasks",
    roman: "V",
    discipline: "Low-Pressure Registry",
    deck: "Manage projects and readings with non-judgmental priority tagging and subtask breakdown.",
    route: "/tasks",
    color: "#1c1e24",
    foil: "#c87046",
  },
  {
    id: "thaw-planner",
    title: "Adaptive Planner",
    roman: "VI",
    discipline: "Weekly Workload Balancing",
    deck: "Visual weekly distribution that evaluates spoon demand against your energy before burnout.",
    route: "/planner",
    color: "#241822",
    foil: "#c87046",
  },
  {
    id: "thaw-insights",
    title: "Gentle Insights",
    roman: "VII",
    discipline: "Reflective Self-Knowledge",
    deck: "Real local statistics illustrating which times and spoon levels yield your easiest flow.",
    route: "/insights",
    color: "#282016",
    foil: "#c87046",
  },
];

export function findBook(id: string): BookConfig | undefined {
  return BOOK_CONFIGS.find((b) => b.id === id);
}

export function findBookByRoute(route: string): BookConfig | undefined {
  return BOOK_CONFIGS.find((b) => b.route === route);
}

