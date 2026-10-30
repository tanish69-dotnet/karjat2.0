export interface PageContent {
  chapterNumber: string;
  chapterTitle: string;
  subtitle?: string;
  bodyParagraphs: string[];
  callout?: {
    label: string;
    text: string;
  };
  keyTakeaway?: string;
}

export interface BookEditorialContent {
  id: string;
  volumeRoman: string;
  volumeTitle: string;
  discipline: string;
  coverColor: string;
  foilColor: string;
  spreads: [
    {
      left: PageContent;
      right: PageContent;
    },
    {
      left: PageContent;
      right: PageContent;
    },
    {
      left: PageContent;
      right: PageContent;
    },
    {
      left: PageContent;
      right: PageContent;
    },
    {
      left: PageContent;
      right: {
        isInteractiveLiveFeature: true;
        featureTitle: string;
        featureSubtitle: string;
      };
    }
  ];
}

export const BOOK_EDITORIALS: Record<string, BookEditorialContent> = {
  "thaw-sequencer": {
    id: "thaw-sequencer",
    volumeRoman: "II",
    volumeTitle: "AI Sequencer",
    discipline: "Intelligent Micro-steps",
    coverColor: "#281b18",
    foilColor: "#c87046",
    spreads: [
      // SPREAD 1: Introduction
      {
        left: {
          chapterNumber: "01",
          chapterTitle: "The Anatomy of Task Paralysis",
          subtitle: "Why Starting Feels Physically Impossible",
          bodyParagraphs: [
            "Task paralysis is rarely an issue of discipline or work ethic. For neurodivergent minds and overloaded students, ambiguous objectives register in the nervous system as acute threat signals.",
            "When a syllabus says 'Write 10-page research synthesis', your executive working memory attempts to compute all 150 prerequisite sub-actions simultaneously: citations, structure, prose, tone, and conclusions.",
            "The result is cognitive freeze: staring at a glowing cursor while energy drains in silent panic.",
          ],
          callout: {
            label: "COGNITIVE PRINCIPLE",
            text: "Activation energy decreases exponentially when the initial action requires zero qualitative judgment.",
          },
        },
        right: {
          chapterNumber: "01 / FIELD NOTE",
          chapterTitle: "The Two-Minute Threshold",
          subtitle: "Dissolving the Activation Barrier",
          bodyParagraphs: [
            "The secret to melting inertia is not finding motivation; it is designing an action so absurdly small that resistance cannot form.",
            "Opening a document and writing just one incomplete sentence requires negligible cognitive bandwidth. Once the hands are moving, the limbic freeze breaks, allowing momentum to take over organically.",
            "Thaw approaches task generation with gentle non-clinical rigor: your energy level dictates the grain size of each step.",
          ],
          keyTakeaway: "Rule: If a starting step feels intimidating, it is still too large. Cut it in half.",
        },
      },
      // SPREAD 2: Principles
      {
        left: {
          chapterNumber: "02",
          chapterTitle: "Cognitive RAG Architecture",
          subtitle: "Grounding AI in Executive Strategy",
          bodyParagraphs: [
            "Most generic AI assistants provide cheerful advice like 'Make a schedule' or 'Stay focused', which inadvertently exacerbates overwhelm by demanding executive capacity you currently lack.",
            "Thaw couples modern language models with a curated library of non-clinical behavioral strategies: body doubling, 2-minute initiations, low-stimulation draft sandboxes, and capacity throttling.",
            "Before generating a single step, our retrieval engine queries proven strategies specifically indexed by emotional state and current spoon level.",
          ],
          callout: {
            label: "LOCAL RETRIEVAL",
            text: "Deterministic grounding guarantees grounded, predictable pacing even when offline.",
          },
        },
        right: {
          chapterNumber: "02 / SPECIFICATION",
          chapterTitle: "Spoon-Calibrated Granularity",
          subtitle: "Matching Demands to Actual Capacity",
          bodyParagraphs: [
            "At 1 Spoon (Preservation): Steps are purely environmental. Clear your drinking glass, adjust ambient lighting, find the reference link.",
            "At 3 Spoons (Steady): Concrete drafting intervals with explicit permission to stop at pre-set checkpoints without guilt.",
            "At 5 Spoons (Deep Synthesis): Multi-phase architectural breakdown spanning literature indexing, argument scaffolding, and timed focus sprints.",
          ],
          keyTakeaway: "Your plan adapts to who you are today, not an idealized version of who you wish you were.",
        },
      },
      // SPREAD 3: Practical Method
      {
        left: {
          chapterNumber: "03",
          chapterTitle: "A Worked Decomposition",
          subtitle: "Deconstructing an Overwhelming Prompt",
          bodyParagraphs: [
            "Consider an intimidating assignment: 'Submit complete draft of Psychology Literature Review by Friday'.",
            "An unassisted mind sees a cliff. Thaw's sequencer translates this prompt through the lens of spoon preservation into a chain of micro-initiations:",
            "Step 1: Open course syllabus and copy the rubric criteria into an empty text file (3 minutes).",
            "Step 2: Read only the abstract of three pre-selected papers; highlight zero sentences (8 minutes).",
          ],
          callout: {
            label: "FRICTION REMOVAL",
            text: "Never combine reading with writing. Separate gathering from synthesizing.",
          },
        },
        right: {
          chapterNumber: "03 / OBSERVATION",
          chapterTitle: "The Low-Friction Sandbox",
          subtitle: "Removing the Fear of Bad Writing",
          bodyParagraphs: [
            "Perfectionism is paralysis disguised as high standards. When generating steps, Thaw explicitly permits 'ugly zero-drafts'.",
            "By designating your opening step as an exploratory scratchpad, the psychological burden of evaluation is postponed until inertia is already broken.",
            "Observe the difference between 'Outline chapter three' and 'Jot down 3 bullet points you would explain to a friend over coffee'.",
          ],
          keyTakeaway: "A poor beginning that exists on paper is infinitely superior to a perfect beginning trapped in thought.",
        },
      },
      // SPREAD 4: Interactive Preparation
      {
        left: {
          chapterNumber: "04",
          chapterTitle: "Calibrating Your Task",
          subtitle: "Parameters for the Sequencing Engine",
          bodyParagraphs: [
            "Before launching the live sequencer on the facing page, take a moment to calibrate your current state.",
            "Be honest about your spoons: choosing a lower energy level produces gentler, more forgiving micro-steps that are far more likely to get you unstuck.",
            "State your assignment in raw, unfiltered terms. You do not need to format it professionally; Thaw's RAG pipeline parses messy natural descriptions.",
          ],
          callout: {
            label: "CHECKLIST",
            text: "1. Raw task description • 2. Honest spoon evaluation • 3. Optional time ceiling",
          },
        },
        right: {
          chapterNumber: "04 / GUIDELINES",
          chapterTitle: "What to Expect",
          subtitle: "From Ingestion to Actionable Plan",
          bodyParagraphs: [
            "When you submit your task on Page 05, the sequencer queries the local strategy database, combines it with the LLM or rule fallback, and synthesizes 3–6 physical verbs.",
            "Every step will feature an estimated duration. You may edit, remove, or reorder any step right on the paper.",
            "Once satisfied, a single click transfers the first step into your active focus chamber or task ledger.",
          ],
          keyTakeaway: "Turn to Page 05 to initiate your live AI Sequence.",
        },
      },
      // SPREAD 5: Live Feature
      {
        left: {
          chapterNumber: "05",
          chapterTitle: "Live Cognitive Sequencer",
          subtitle: "Submit Assignment for Micro-step Synthesis",
          bodyParagraphs: [
            "Enter your assignment or overwhelming objective in the field below.",
            "Calibrate your current spoon capacity and optional time window. When ready, invoke the engine to receive tailored micro-steps.",
          ],
        },
        right: {
          isInteractiveLiveFeature: true,
          featureTitle: "Synthesized Action Plan",
          featureSubtitle: "Editable steps grounded in cognitive strategy",
        },
      },
    ],
  },

  "thaw-energy": {
    id: "thaw-energy",
    volumeRoman: "I",
    volumeTitle: "Energy & Capacity",
    discipline: "Adaptive Spoon Calibration",
    coverColor: "#182a43",
    foilColor: "#c87046",
    spreads: [
      {
        left: {
          chapterNumber: "01",
          chapterTitle: "The Spoon Theory of Productivity",
          subtitle: "Redefining Capacity as a Finite Currency",
          bodyParagraphs: [
            "Christine Miserandino's Spoon Theory offers a revolutionary premise: neurodivergent, chronically exhausted, or overwhelmed individuals do not possess unlimited daily stamina.",
            "Every micro-decision—from making breakfast to answering an email—costs an irreplaceable spoon of energy.",
            "When traditional task systems treat every morning as an infinite well, running out of spoons feels like personal failure rather than biological reality.",
          ],
          callout: {
            label: "CORE AXIOM",
            text: "Productivity is not moral virtue. Capacity fluctuates with sleep, sensory load, and stress.",
          },
        },
        right: {
          chapterNumber: "01 / COMPASSION",
          chapterTitle: "The Guilt of Fluctuating Stamina",
          subtitle: "Uncoupling Worth from Daily Output",
          bodyParagraphs: [
            "On Tuesday you might write 2,000 words effortlessly; on Wednesday simply opening your textbook causes visceral resistance.",
            "Traditional productivity tools brand Wednesday as an 'unproductive lapse'. Thaw treats it as a legitimate downshift signal.",
            "By acknowledging low capacity early in the morning, you prevent the secondary trauma of missed deadlines and broken streaks.",
          ],
          keyTakeaway: "A 1-spoon day executed with grace preserves stamina for tomorrow.",
        },
      },
      {
        left: {
          chapterNumber: "02",
          chapterTitle: "The Five Energy Tiers",
          subtitle: "Calibrating Your True Internal Reservoir",
          bodyParagraphs: [
            "Level 1 (Preservation): Severe exhaustion or sensory shutdown. Absolute essentials only; rest is non-negotiable.",
            "Level 2 (Maintenance): Fragile baseline. Low-stakes administrative tasks, short readings, passive review.",
            "Level 3 (Steady Balance): Predictable focus. Standard coursework, routine problem sets, steady reading pace.",
          ],
          callout: {
            label: "TIER SPECTRUM",
            text: "1: Preservation • 2: Maintenance • 3: Steady • 4: High Creative • 5: Flow Sprint",
          },
        },
        right: {
          chapterNumber: "02 / ELEVATION",
          chapterTitle: "High-Capacity Horizons",
          subtitle: "Harnessing 4 and 5 Spoon Windows",
          bodyParagraphs: [
            "Level 4 (Creative Depth): High cognitive bandwidth. Architecture design, argument synthesis, and intensive essay drafts.",
            "Level 5 (Hyper-Capacity): Rare peak stamina. Complex problem solving, ambitious research dives, and long focus blocks.",
            "Crucially, high days must never be followed by self-inflicted burnout. Pace yourself even during inspiration.",
          ],
          keyTakeaway: "Never borrow spoons from tomorrow to finish today's optional wishlist.",
        },
      },
      {
        left: {
          chapterNumber: "03",
          chapterTitle: "The Feedback Loop",
          subtitle: "How Check-Ins Steer the Entire Application",
          bodyParagraphs: [
            "Your energy check-in is not a passive mood diary. It acts as the master throttle for every system in Thaw.",
            "When set to Level 1 or 2, the AI Sequencer restricts steps to 2–5 minutes and highlights the Rest Sanctuary.",
            "The Weekly Atlas recalculates workload balances, warning you if scheduled commitments exceed your estimated weekly reserves.",
          ],
          callout: {
            label: "SYSTEM INTEGRATION",
            text: "Check-in state updates localStorage and propagates across all 7 library volumes instantly.",
          },
        },
        right: {
          chapterNumber: "03 / PROTOCOL",
          chapterTitle: "Gentle Morning Calibration",
          subtitle: "A 30-Second Honest Assessment",
          bodyParagraphs: [
            "Upon waking, ask three grounded questions: How does my body feel right now? What is my cognitive clarity? What sensory demands face me today?",
            "Do not answer with what you need to be. Answer with what is true.",
            "You can recalibrate at any hour of the day. A 4-spoon morning can gracefully become a 2-spoon afternoon.",
          ],
          keyTakeaway: "Honesty with yourself is the highest form of executive effectiveness.",
        },
      },
      {
        left: {
          chapterNumber: "04",
          chapterTitle: "Preparing Your Calibration",
          subtitle: "Setting Today's Operating Baseline",
          bodyParagraphs: [
            "On Page 05, you will interact with the tactile spoon scale.",
            "Selecting a level updates your live application context. It reshuffles recommended priority tasks on your Reading Desk.",
            "Take a deep breath, release tension in your shoulders, and choose the tier that matches your present reality.",
          ],
          callout: {
            label: "SAFE HARBOR",
            text: "There are no penalties, red alerts, or broken badges for selecting Level 1.",
          },
        },
        right: {
          chapterNumber: "04 / GUIDELINES",
          chapterTitle: "Adaptive Recommendations",
          subtitle: "What Each Spoon Tier Unlocks",
          bodyParagraphs: [
            "Level 1: Recommended: Rest Sanctuary breathing, sensory pause, 1 micro-task.",
            "Level 2–3: Recommended: 15-minute body doubling intervals with gentle breaks.",
            "Level 4–5: Recommended: Deep 25-minute Pomodoro sessions and structural planning.",
          ],
          keyTakeaway: "Turn to Page 05 to set your active capacity tier.",
        },
      },
      {
        left: {
          chapterNumber: "05",
          chapterTitle: "Live Energy Check-in",
          subtitle: "Calibrate Spoons and Receive Guidance",
          bodyParagraphs: [
            "Select your current capacity below. This updates your global Thaw session and guides recommendations across all volumes.",
          ],
        },
        right: {
          isInteractiveLiveFeature: true,
          featureTitle: "Live Capacity Selector",
          featureSubtitle: "Connected to shared application state",
        },
      },
    ],
  },

  "thaw-timer": {
    id: "thaw-timer",
    volumeRoman: "III",
    volumeTitle: "Focus & Presence",
    discipline: "Gentle Body Doubling",
    coverColor: "#15202e",
    foilColor: "#c87046",
    spreads: [
      {
        left: {
          chapterNumber: "01",
          chapterTitle: "The Anxiety of the Clock",
          subtitle: "Why Traditional Alarms Trigger Adrenaline",
          bodyParagraphs: [
            "Traditional countdown timers are built on urgent panic: ticking clocks, blinking numbers, and shrill alarms that shock an already sensitized nervous system.",
            "For neurodivergent thinkers, time pressure rarely fosters focus. It triggers hyper-vigilance, making it difficult to sink into thoughtful synthesis.",
            "Thaw reimagines the timer as a calm, unhurried focus chamber designed to ground your attention rather than count down your failure.",
          ],
          callout: {
            label: "CHAMBER AXIOM",
            text: "Focus is not forced willpower; it is an environment stripped of predatory urgency.",
          },
        },
        right: {
          chapterNumber: "01 / PRESENCE",
          chapterTitle: "Virtual Body Doubling",
          subtitle: "The Science of Shared Space",
          bodyParagraphs: [
            "Body doubling is a recognized non-clinical strategy where another quiet presence in the room anchors executive function.",
            "Knowing that a gentle, non-judgmental system is tracking your interval alongside you reduces the loneliness of academic isolation.",
            "You do not need to finish everything during this interval. You only need to remain companionably present with your work.",
          ],
          keyTakeaway: "Success is showing up to the page, not sprinting to the finish line.",
        },
      },
      {
        left: {
          chapterNumber: "02",
          chapterTitle: "Interval Architecture",
          subtitle: "Designing Manageable Horizons",
          bodyParagraphs: [
            "We offer three calibrated focus horizons:",
            "10-Minute Initiation: Ideal for task initiation when resistance is peak. Anyone can endure 10 minutes of low-stakes contact.",
            "25-Minute Classic: The traditional Pomodoro interval, balanced for sustained reading or paper drafting.",
            "50-Minute Deep Flow: For high-spoon creative states where complex problem solving requires uninterrupted immersion.",
          ],
          callout: {
            label: "FLEXIBLE INTERVALS",
            text: "You may pause or terminate an interval at any second with zero penalty.",
          },
        },
        right: {
          chapterNumber: "02 / RHYTHM",
          chapterTitle: "Soft Transitions",
          subtitle: "Ending Without Shock",
          bodyParagraphs: [
            "When an interval concludes, Thaw does not blast a buzzer.",
            "The ambient visual indicators settle into warm resting tones, accompanied by an explicit prompt to stretch, hydrate, or rest.",
            "Stopping gracefully is just as critical as starting gracefully: it trains your mind to trust that focus will not trap it in exhaustion.",
          ],
          keyTakeaway: "Honoring break times is what makes future focus sessions sustainable.",
        },
      },
      {
        left: {
          chapterNumber: "03",
          chapterTitle: "Anchoring Your Session",
          subtitle: "Choosing a Single Focal Intent",
          bodyParagraphs: [
            "A focus chamber is only as effective as the clarity of its intention.",
            "Before pressing start, designate exactly one single action for the timer duration: 'Read 3 pages of Chapter 4' rather than 'Study Biology'.",
            "If stray thoughts arise, note them on a physical slip of paper beside your keyboard and gently return to your designated anchor.",
          ],
          callout: {
            label: "ANCHOR PROTOCOL",
            text: "One task • Zero browser tabs unrelated to that task • A full glass of water",
          },
        },
        right: {
          chapterNumber: "03 / RESCUE",
          chapterTitle: "When Mind Wanders",
          subtitle: "Self-Compassion in the Middle of Focus",
          bodyParagraphs: [
            "Distraction is not a moral failure; it is your brain seeking dopamine or protection from ambiguity.",
            "When you notice you have been daydreaming for five minutes, do not scold yourself. Simply notice: 'I wandered. I am back now.'",
            "Each gentle return to the page strengthens neural executive pathways far more than angry self-admonition ever could.",
          ],
          keyTakeaway: "The work is not about unbroken focus; it is about the gentle return.",
        },
      },
      {
        left: {
          chapterNumber: "04",
          chapterTitle: "Preparing Your Chamber",
          subtitle: "Setting Duration and Focal Object",
          bodyParagraphs: [
            "On Page 05, you will find the working focus dial.",
            "Select your interval duration, pick an optional task from your ledger, and initiate the countdown.",
            "The dial maintains millisecond precision based on real wall-clock time, ensuring accuracy even if you switch browser tabs.",
          ],
          callout: {
            label: "INTERFACE NOTE",
            text: "Pause, resume, and reset controls are rendered directly onto the paper spread.",
          },
        },
        right: {
          chapterNumber: "04 / GUIDELINES",
          chapterTitle: "Chamber Protocols",
          subtitle: "Quick Reference for Clean Focus",
          bodyParagraphs: [
            "• Step 1: Place phone face down outside your direct line of sight.",
            "• Step 2: Select 10m if tired, 25m if steady, 50m if inspired.",
            "• Step 3: Hit Start and allow the circular dial to accompany your work.",
          ],
          keyTakeaway: "Turn to Page 05 to enter the live Focus Chamber.",
        },
      },
      {
        left: {
          chapterNumber: "05",
          chapterTitle: "Focus Chamber",
          subtitle: "Gentle Wall-Clock Interval Timer",
          bodyParagraphs: [
            "Choose your interval and begin. Focus gently, knowing you can pause whenever you need.",
          ],
        },
        right: {
          isInteractiveLiveFeature: true,
          featureTitle: "Live Focus Timer",
          featureSubtitle: "SVG circular dial with session logging",
        },
      },
    ],
  },

  "thaw-rest": {
    id: "thaw-rest",
    volumeRoman: "IV",
    volumeTitle: "Rest Sanctuary",
    discipline: "Guilt-Free Recovery",
    coverColor: "#182622",
    foilColor: "#c87046",
    spreads: [
      {
        left: {
          chapterNumber: "01",
          chapterTitle: "Rest as an Equal Action",
          subtitle: "Unlearning the Productivity Guilt Trap",
          bodyParagraphs: [
            "In modern academia, rest is almost universally treated as a reward that must be earned through exhaustion, or worse, as a stolen transgression.",
            "This produces 'revenge rest': doom-scrolling on social media while your nervous system remains bathed in stress hormones and guilt.",
            "Thaw treats rest not as the absence of work, but as an active, vital physiological process without which neuroplastic learning is impossible.",
          ],
          callout: {
            label: "SANCTUARY PRINCIPLE",
            text: "Rest is not earned by suffering. It is a biological requirement for cognitive synthesis.",
          },
        },
        right: {
          chapterNumber: "01 / PHYSIOLOGY",
          chapterTitle: "The Default Mode Network",
          subtitle: "How Memory Consolidates in Silence",
          bodyParagraphs: [
            "Cognitive science shows that when you step away from active problem solving, the brain's Default Mode Network (DMN) activates.",
            "It is during these quiet pauses that disparate concepts connect, creative breakthroughs formulate, and short-term working memory is written into long-term architecture.",
            "True rest is when your brain actually finishes the essay you were struggling to write.",
          ],
          keyTakeaway: "Taking a 10-minute pause often accomplishes what two hours of forced typing could not.",
        },
      },
      {
        left: {
          chapterNumber: "02",
          chapterTitle: "The Box Breathing Rhythm",
          subtitle: "Regulating the Parasympathetic System",
          bodyParagraphs: [
            "When task panic sets in, the sympathetic nervous system triggers shallow breathing, elevating cortisol and locking out executive faculties.",
            "Box breathing (4 seconds inhale, 4 seconds hold, 4 seconds exhale, 4 seconds hold) resets vagal nerve tone.",
            "Within 90 seconds, cardiac rhythm stabilizes and cognitive flexibility is physically restored.",
          ],
          callout: {
            label: "BREATH TEMPO",
            text: "4s Inhale • 4s Retain • 4s Exhale • 4s Stillness",
          },
        },
        right: {
          chapterNumber: "02 / MODES",
          chapterTitle: "Three Rest Archetypes",
          subtitle: "Matching Recovery to Fatigue Type",
          bodyParagraphs: [
            "Sensory Reset: Dim lights, close eyes, remove headphones, allow auditory overload to dissipate.",
            "Physical Decompression: Lie flat on the floor, unclench your jaw, drop your shoulders away from your ears.",
            "Mind Wandering: Stare out a window with no phone or media. Let thoughts drift without cataloging them.",
          ],
          keyTakeaway: "Scrolling on your phone is sensory stimulation, not neural rest.",
        },
      },
      {
        left: {
          chapterNumber: "03",
          chapterTitle: "Permission Without Checklists",
          subtitle: "A Space Free of Achievement Metrics",
          bodyParagraphs: [
            "You cannot fail this sanctuary. There are no medals, no streaks to lose, and no timers forcing you to return to work before you are ready.",
            "If you sit here for 2 minutes and feel refreshed, you may leave. If you need 30 minutes of silence, the sanctuary remains open.",
            "Your worth remains completely intact while you do absolutely nothing.",
          ],
          callout: {
            label: "NO STREAKS",
            text: "Streaks weaponize guilt. Thaw never penalizes an afternoon of recovery.",
          },
        },
        right: {
          chapterNumber: "03 / RE-ENTRY",
          chapterTitle: "Gentle Re-entry",
          subtitle: "Returning Without Shock",
          bodyParagraphs: [
            "When you decide to leave the sanctuary, do not immediately rush back into frantic multitasking.",
            "Drink a glass of cool water. Check your spoon level. Choose the smallest possible step from your ledger.",
            "Carry the calm of the sanctuary with you back to the desk.",
          ],
          keyTakeaway: "The transition out of rest is as important as the transition into it.",
        },
      },
      {
        left: {
          chapterNumber: "04",
          chapterTitle: "Preparing Your Recovery",
          subtitle: "Sanctuary Controls and Visual Guide",
          bodyParagraphs: [
            "Page 05 embeds the live Breathing Guide sphere.",
            "Follow the rhythmic expansion and contraction of the sage circle. Let your breath synchronize naturally with its expansion.",
            "You can log this recovery session to your Reading Journal with a single click when finished.",
          ],
          callout: {
            label: "AUDIO/VISUAL",
            text: "Soft organic pacing designed to calm sensory receptors.",
          },
        },
        right: {
          chapterNumber: "04 / COMMITMENT",
          chapterTitle: "The Sanctuary Vow",
          subtitle: "Affirmations for the Weary Mind",
          bodyParagraphs: [
            "• I am allowed to stop before I break.",
            "• My deadlines do not define my humanity.",
            "• Rest is productive.",
            "• I will be kind to myself today.",
          ],
          keyTakeaway: "Turn to Page 05 to enter the live Rest Sanctuary.",
        },
      },
      {
        left: {
          chapterNumber: "05",
          chapterTitle: "Live Sanctuary",
          subtitle: "Guided 4-4-4-4 Breathing Sphere",
          bodyParagraphs: [
            "Follow the breathing guide below. Breathe in as it expands, hold gently at the apex, exhale as it contracts.",
          ],
        },
        right: {
          isInteractiveLiveFeature: true,
          featureTitle: "Guided Breathing Sphere",
          featureSubtitle: "Restorative neural recovery with zero pressure",
        },
      },
    ],
  },

  "thaw-tasks": {
    id: "thaw-tasks",
    volumeRoman: "V",
    volumeTitle: "Flexible Tasks",
    discipline: "Low-Pressure Registry",
    coverColor: "#1c1e24",
    foilColor: "#c87046",
    spreads: [
      {
        left: {
          chapterNumber: "01",
          chapterTitle: "Making Invisible Work Visible",
          subtitle: "Why Brains Are Terrible Storage Devices",
          bodyParagraphs: [
            "Attempting to remember five homework deadlines, three reading assignments, and grocery needs in your active working memory consumes cognitive energy that should be applied to actual synthesis.",
            "When tasks remain unwritten, they loom larger and more terrifying than they truly are in objective reality.",
            "A task registry exists to hold reality so your mind can rest.",
          ],
          callout: {
            label: "LEDGER AXIOM",
            text: "Your brain is for having ideas, not for holding overdue alarms.",
          },
        },
        right: {
          chapterNumber: "01 / DIGNITY",
          chapterTitle: "No Overdue Flags",
          subtitle: "A Zero-Shame Architecture",
          bodyParagraphs: [
            "Notice what happens in standard task apps when you miss a deadline: red exclamation marks, badges of failure, and guilt-inducing pop-ups.",
            "Thaw does not have overdue flags. If a task was scheduled for yesterday, it simply remains on your ledger, awaiting your next burst of capacity.",
            "You can reschedule, reprioritize, or delete tasks at any moment without penalty.",
          ],
          keyTakeaway: "Shame has never cured executive dysfunction. Clarity does.",
        },
      },
      {
        left: {
          chapterNumber: "02",
          chapterTitle: "Anatomy of an Actionable Task",
          subtitle: "Transforming Vague Obligations",
          bodyParagraphs: [
            "Bad task: 'Finish History Thesis'. (Too vague, triggers immediate freeze).",
            "Good task: 'Download 2 primary sources on Ottoman trade from JSTOR'. (Specific, concrete, physical verb).",
            "Every item entered in Thaw should specify a tangible action and an estimated spoon cost.",
          ],
          callout: {
            label: "TASK ANATOMY",
            text: "Action Verb + Concrete Object + Spoon Tag + Realistic Duration",
          },
        },
        right: {
          chapterNumber: "02 / CHUNKING",
          chapterTitle: "Subtask Decomposition",
          subtitle: "Nesting Smaller Steps",
          bodyParagraphs: [
            "When an assignment contains multiple phases, attach 2–4 nested subtasks.",
            "Checking off an individual subtask releases dopamine, breaking the paralysis cycle and building momentum toward completion.",
            "You can promote any subtask into an independent top-level ledger item whenever needed.",
          ],
          keyTakeaway: "Break the mountain into pebbles until walking is effortless.",
        },
      },
      {
        left: {
          chapterNumber: "03",
          chapterTitle: "Filtering by Current Spoons",
          subtitle: "Dynamic Capacity Querying",
          bodyParagraphs: [
            "The magic of Thaw's Task Ledger is dynamic capacity filtering.",
            "When you are at 2 spoons, filter your ledger to show only 1 and 2-spoon tasks. The 5-spoon term paper disappears from view so it cannot intimidate you.",
            "You accomplish gentle maintenance work and end the day with checked boxes instead of paralysis.",
          ],
          callout: {
            label: "FILTER ENGINE",
            text: "Hide high-spoon demands during low-capacity days to protect your mental energy.",
          },
        },
        right: {
          chapterNumber: "03 / CAPTURE",
          chapterTitle: "The Instant Capture Habit",
          subtitle: "Emptying the Working Inbox",
          bodyParagraphs: [
            "Whenever a professor mentions an upcoming due date, capture it into the inbox immediately.",
            "Do not worry about perfect tags or descriptions initially; get the thought out of your head onto paper.",
            "Once safe in the ledger, you can sequence it with AI or assign it to a specific day during your weekly planning hour.",
          ],
          keyTakeaway: "Offload the thought instantly so your working memory stays clear.",
        },
      },
      {
        left: {
          chapterNumber: "04",
          chapterTitle: "Preparing Your Ledger",
          subtitle: "Ledger Organization Overview",
          bodyParagraphs: [
            "Page 05 renders the full interactive Task Ledger.",
            "Features include quick task creation, search filtering, spoon requirement tagging, subtask expansion, and one-click completion.",
            "All changes synchronize to your browser's persistent localStorage database.",
          ],
          callout: {
            label: "CRUD SUPPORT",
            text: "Create, edit, toggle subtasks, filter by capacity, and delete with undo.",
          },
        },
        right: {
          chapterNumber: "04 / GUIDELINES",
          chapterTitle: "Ledger Protocol",
          subtitle: "Quick Reference for Daily Tasking",
          bodyParagraphs: [
            "• Step 1: Filter by your current spoon level.",
            "• Step 2: Pick the easiest task to build momentum.",
            "• Step 3: Check it off and celebrate the micro-victory.",
          ],
          keyTakeaway: "Turn to Page 05 to access your live Task Ledger.",
        },
      },
      {
        left: {
          chapterNumber: "05",
          chapterTitle: "Task Ledger",
          subtitle: "Non-Judgmental Task Registry",
          bodyParagraphs: [
            "Manage your assignments and daily actions below. Add items, check off progress, or filter by your current spoon capacity.",
          ],
        },
        right: {
          isInteractiveLiveFeature: true,
          featureTitle: "Live Task Registry",
          featureSubtitle: "Complete CRUD with spoon filtering and persistence",
        },
      },
    ],
  },

  "thaw-planner": {
    id: "thaw-planner",
    volumeRoman: "VI",
    volumeTitle: "Adaptive Planner",
    discipline: "Weekly Workload Balancing",
    coverColor: "#241822",
    foilColor: "#c87046",
    spreads: [
      {
        left: {
          chapterNumber: "01",
          chapterTitle: "Why Rigid Calendars Fail",
          subtitle: "The Fallacy of the Ideal Week",
          bodyParagraphs: [
            "Standard time-blocking planners assume that Monday through Friday will unfold with machine-like predictability.",
            "A single bad night of sleep or sudden deadline alteration derails the entire weekly layout, causing planning fatigue and abandoned tools.",
            "Thaw's Adaptive Planner balances workload across an energy envelope rather than rigid hourly blocks.",
          ],
          callout: {
            label: "PLANNING AXIOM",
            text: "Plans should bend like willow branches, not shatter like glass when reality shifts.",
          },
        },
        right: {
          chapterNumber: "01 / EQUILIBRIUM",
          chapterTitle: "Weekly Capacity Envelopes",
          subtitle: "Matching Total Spoons to Weekly Budget",
          bodyParagraphs: [
            "If your estimated weekly capacity is 18 spoons, scheduling 28 spoons of intensive work guarantees mid-week collapse.",
            "Our weekly atlas calculates cumulative demand day-by-day, displaying visual indicators before burnout occurs rather than after.",
            "You can visually drag or rebalance commitments across lighter days with a single click.",
          ],
          keyTakeaway: "Prevent burnout proactively by respecting your weekly envelope.",
        },
      },
      {
        left: {
          chapterNumber: "02",
          chapterTitle: "The Rebalance Engine",
          subtitle: "Algorithmic Workload Redistribution",
          bodyParagraphs: [
            "When Wednesday becomes overloaded due to emergency deadlines, Thaw's `rebalanceWeek` algorithm redistributes non-critical items across Thursday, Friday, and the weekend.",
            "The algorithm respects your spoons, priority tags, and existing task clusters, ensuring you never wake up to an impossible schedule.",
          ],
          callout: {
            label: "AUTOMATION",
            text: "One-click Rebalance button recalculates days based on capacity budgets.",
          },
        },
        right: {
          chapterNumber: "02 / BUFFER",
          chapterTitle: "The Power of Buffer Blocks",
          subtitle: "Scheduling the Inevitable Chaos",
          bodyParagraphs: [
            "Never schedule 100% of a day. Reserve at least 30% of your daily envelope as an unallocated buffer block.",
            "Buffer blocks absorb late emails, sudden revisions, and physical fatigue without disturbing your core priorities.",
            "If nothing goes wrong, your buffer becomes unpressured free time.",
          ],
          keyTakeaway: "A realistic planner plans for the unexpected.",
        },
      },
      {
        left: {
          chapterNumber: "03",
          chapterTitle: "Designing Your Seven Days",
          subtitle: "The Weekly Rhythm Walkthrough",
          bodyParagraphs: [
            "Every Sunday or Monday morning, conduct a 10-minute Atlas review:",
            "1. Review upcoming assignment deadlines.",
            "2. Note days with high external friction (long lectures, shifts, labs).",
            "3. Assign lighter spoon commitments to high-friction days.",
          ],
          callout: {
            label: "REVIEW PROTOCOL",
            text: "10 minutes once per week saves hours of mid-week paralysis.",
          },
        },
        right: {
          chapterNumber: "03 / PERSPECTIVE",
          chapterTitle: "Pacing Over Perfection",
          subtitle: "The Long-Game of Academic Survival",
          bodyParagraphs: [
            "University is an endurance marathon, not a series of desperate all-nighters.",
            "Consistent 3-spoon output maintained over eight weeks produces superior results compared to manic 5-spoon bursts followed by weeks of depressive shutdown.",
            "Trust the pacing. The work will get done.",
          ],
          keyTakeaway: "Consistency emerges from kindness, not cruelty.",
        },
      },
      {
        left: {
          chapterNumber: "04",
          chapterTitle: "Preparing Your Atlas",
          subtitle: "Overview of the Live Atlas",
          bodyParagraphs: [
            "Page 05 renders the 7-day Weekly Atlas.",
            "View daily spoon totals, inspect scheduled tasks, shift deadlines, and trigger algorithmic rebalancing whenever your week gets chaotic.",
          ],
          callout: {
            label: "LIVE DATA",
            text: "Synchronized with your active Task Ledger and Energy Check-ins.",
          },
        },
        right: {
          chapterNumber: "04 / GUIDELINES",
          chapterTitle: "Atlas Controls",
          subtitle: "How to Interact with Your Week",
          bodyParagraphs: [
            "• Inspect each column for daily spoon loads.",
            "• Use the Rebalance button if any single day turns orange.",
            "• Drag or click tasks to reschedule them across the week.",
          ],
          keyTakeaway: "Turn to Page 05 to open your live Weekly Atlas.",
        },
      },
      {
        left: {
          chapterNumber: "05",
          chapterTitle: "Weekly Atlas",
          subtitle: "Adaptive Workload Distribution",
          bodyParagraphs: [
            "View and balance your 7-day schedule below. Ensure daily demands match your spoon capacity.",
          ],
        },
        right: {
          isInteractiveLiveFeature: true,
          featureTitle: "Live 7-Day Atlas",
          featureSubtitle: "Visual workload balancing with one-click rebalance",
        },
      },
    ],
  },

  "thaw-insights": {
    id: "thaw-insights",
    volumeRoman: "VII",
    volumeTitle: "Gentle Insights",
    discipline: "Reflective Self-Knowledge",
    coverColor: "#282016",
    foilColor: "#c87046",
    spreads: [
      {
        left: {
          chapterNumber: "01",
          chapterTitle: "Observe Without Judgment",
          subtitle: "Replacing Self-Criticism with Curiosity",
          bodyParagraphs: [
            "Most analytics dashboards in modern software are designed to induce guilt: 'You worked 14% less this week', 'Streak broken', 'Below average'.",
            "These metrics do not consider whether you were battling a migraine, mourning a loss, or studying for midterms.",
            "Thaw's Reflection Archive presents data as a neutral mirror: not to grade your performance, but to illuminate your natural working rhythms.",
          ],
          callout: {
            label: "INSIGHT AXIOM",
            text: "Data is for self-understanding, never for self-punishment.",
          },
        },
        right: {
          chapterNumber: "01 / PATTERNS",
          chapterTitle: "What Activity Can and Cannot Tell You",
          subtitle: "The Limits of Quantitative Metrics",
          bodyParagraphs: [
            "A log showing 0 completed tasks on Thursday does not mean Thursday was wasted. It may mean Thursday was an essential rest day that allowed Friday's deep breakthrough.",
            "Recorded focus sessions and check-ins help identify patterns: Do you focus better at 10 AM or 4 PM? Does 25 minutes work better than 50?",
            "Use this information to design your days around reality rather than fantasy.",
          ],
          keyTakeaway: "You are the scientist of your own mind; the app is merely your notebook.",
        },
      },
      {
        left: {
          chapterNumber: "02",
          chapterTitle: "Correlating Energy & Output",
          subtitle: "Discovering Your True Productive Windows",
          bodyParagraphs: [
            "By cross-referencing your morning spoon check-ins with completed focus blocks, the insights engine reveals your personal sweet spots.",
            "Many students discover that 3-spoon days actually generate more consistent, high-quality work than frantic 5-spoon marathons.",
            "Recognizing this prevents the toxic cycle of waiting for 'perfect inspiration' before starting.",
          ],
          callout: {
            label: "CORRELATION",
            text: "Steady consistency outpaces sporadic manic sprints over any 12-week semester.",
          },
        },
        right: {
          chapterNumber: "02 / RHYTHMS",
          chapterTitle: "Circadian Respect",
          subtitle: "Honoring Your Natural Chronotype",
          bodyParagraphs: [
            "If your brain consistently refuses complex synthesis before 11:00 AM, fighting it with three cups of espresso simply generates anxiety.",
            "Assign low-friction reading and administrative maintenance to your slow hours; reserve your peak windows for primary research and essay synthesis.",
            "Work with your biology rather than treating it as an adversary.",
          ],
          keyTakeaway: "Stop scheduling deep focus during your natural slump hours.",
        },
      },
      {
        left: {
          chapterNumber: "03",
          chapterTitle: "Weekly Reflection Prompts",
          subtitle: "Qualitative Inquiry Alongside Numbers",
          bodyParagraphs: [
            "Quantitative charts only tell half the story. At the end of each week, consider three gentle questions:",
            "1. What task felt surprisingly effortless once I started?",
            "2. Where did I push through fatigue when I should have rested?",
            "3. What is one small kindness I can grant myself next week?",
          ],
          callout: {
            label: "REFLECTION INQUIRY",
            text: "Notice friction without shame • Celebrate microscopic victories • Adjust the plan",
          },
        },
        right: {
          chapterNumber: "03 / ARCHIVE",
          chapterTitle: "Your Private Progress Ledger",
          subtitle: "Preserved Exclusively on Your Device",
          bodyParagraphs: [
            "Everything recorded in Thaw stays in your browser's private storage. No data is harvested, analyzed by third parties, or monetized.",
            "Your struggles, your low-spoon days, and your breakthroughs belong entirely to you.",
            "Over months, this archive becomes a testament to your quiet resilience.",
          ],
          keyTakeaway: "A private journal of sustainable growth and self-compassion.",
        },
      },
      {
        left: {
          chapterNumber: "04",
          chapterTitle: "Preparing Your Archive",
          subtitle: "Understanding Your Analytics",
          bodyParagraphs: [
            "Page 05 presents your real recorded history.",
            "View total focus minutes, completed micro-actions, rest sessions logged, and spoon distribution histograms.",
          ],
          callout: {
            label: "ANALYTICS SUMMARY",
            text: "Real localStorage metrics • Zero vanity algorithms • Pure local privacy",
          },
        },
        right: {
          chapterNumber: "04 / GUIDELINES",
          chapterTitle: "Archive Navigation",
          subtitle: "How to Read the Facing Spread",
          bodyParagraphs: [
            "• Review weekly activity histograms.",
            "• Inspect focus session duration totals.",
            "• Observe average weekly spoon calibration.",
          ],
          keyTakeaway: "Turn to Page 05 to view your live Reflection Archive.",
        },
      },
      {
        left: {
          chapterNumber: "05",
          chapterTitle: "Reflection Archive",
          subtitle: "Curiosity-Driven Activity Patterns",
          bodyParagraphs: [
            "Review your real activity, focus time, and spoon distribution below.",
          ],
        },
        right: {
          isInteractiveLiveFeature: true,
          featureTitle: "Live Activity Insights",
          featureSubtitle: "Historical charts and session summaries from stored data",
        },
      },
    ],
  },
};

export function getBookEditorial(bookId: string): BookEditorialContent {
  return (
    BOOK_EDITORIALS[bookId] || {
      ...BOOK_EDITORIALS["thaw-sequencer"],
      id: bookId,
      volumeTitle: "Thaw Volume",
    }
  );
}

