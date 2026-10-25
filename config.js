// Site settings: edit these any time. Leave a value as "" to hide that button.
window.SITE_CONFIG = {
  signupUrl: "https://ccv.church/serve",
  signupLabel: "Sign up to serve",
  contactName: "Tyler Garben",             // TODO
  contactRole: "East Mesa Production Manager",   // shown under "Ready to jump in?"; leave "" to hide
  contactSubject: "Interested in serving on Production",   // pre-filled email subject
  contactEmail: "tylergarben@ccv.church",      // TODO
  contactPhone: "",                     // optional, e.g. "555-555-5555"

  // Venues shown as filter buttons. A position's `venues:` line must use these exact names.
  venues: ["Junior High", "High School", "Adults"],

  // "Find your fit" quiz. Each answer adds tags. A position scores a point for every tag it
  // shares with the answers (set in the position's `fit:` line). The top matches are shown.
  // Tags in use: technical, visual, audio, hands-on, solo, team, leader, beginner,
  // experienced, calm, fast, physical. You can invent new ones; just use them in both places.
  quiz: [
    {
      question: "What sounds most like you?",
      options: [
        { label: "I love gear and gadgets", tags: ["technical"] },
        { label: "I have an eye for visuals", tags: ["visual"] },
        { label: "I have a good ear for music", tags: ["audio"] },
        { label: "I like being hands-on and helping wherever needed", tags: ["hands-on"] }
      ]
    },
    {
      question: "How do you like to work?",
      options: [
        { label: "On my own, focused on one job", tags: ["solo"] },
        { label: "As part of a team, talking things through", tags: ["team"] },
        { label: "Guiding others and making calls", tags: ["leader"] }
      ]
    },
    {
      question: "How much experience do you have?",
      options: [
        { label: "None yet. I'm ready to learn", tags: ["beginner"] },
        { label: "I've done some of this before", tags: ["experienced"] }
      ]
    },
    {
      question: "What pace feels right?",
      options: [
        { label: "Calm and steady", tags: ["calm"] },
        { label: "Fast and live. I thrive under pressure", tags: ["fast"] },
        { label: "Physical. I like to move around", tags: ["physical"] }
      ]
    }
  ],

  // Tap-to-explain words. Any of these terms found in a position's description get underlined
  // (first mention only), and they're also listed in the Glossary at the bottom of the page.
  glossary: {
    "FOH": "Front of House. The main mixing position out in the room, where the sound you hear is controlled.",
    "ProPresenter": "The software that puts song lyrics, slides and videos on the screens.",
    "in-ear monitors": "Small earpieces musicians wear so they can hear their own custom mix on stage.",
    "sound check": "The pre-service rehearsal where the band and team test levels and make sure everything works.",
    "call time": "The time you're expected to arrive and be ready to start.",
    "cue": "A signal for something to happen at a specific moment, like a light change or the next slide."
  }
};
