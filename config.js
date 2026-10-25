// Site settings: edit these any time. Leave a value as "" to hide that button.
window.SITE_CONFIG = {
  signupUrl: "https://ccv.church/serve",
  signupLabel: "Sign up to serve",
  // Email subject for the "Email ..." buttons. The venue name is added to the end.
  contactSubject: "Interested in serving on Production",

  // Serving venues. They show as filter buttons, and each one has its own lead.
  //   room:     where the venue meets (also used to label equipment on a position)
  //   minAge:   shown when someone picks that venue
  //   lead*:    the contact used for that venue (leadRole is optional)
  //   schedule: a typical weekend, shown on each position in that venue
  // A position's `venues:` line must use these exact names.
  venues: [
    {
      name: "Junior High",
      room: "Students Venue",
      minAge: "Junior High age or older",
      leadName: "Ayden Solis",
      leadRole: "East Area Team Member",
      leadEmail: "aydensolis@ccv.church",
      schedule: [
        "2:30 PM: Call time",
        "5:30 PM: Service"
      ]
    },
    {
      name: "High School",
      room: "Auditorium",
      minAge: "High School age or older",
      leadName: "Ayden Solis",
      leadRole: "East Area Team Member",
      leadEmail: "aydensolis@ccv.church",
      schedule: [
        "2:30 PM: Call time",
        "3:45 PM: Full technical run-through",
        "5:00 PM: Service"
      ]
    },
    {
      name: "Adults",
      room: "Auditorium",
      minAge: "High School age or older",
      leadName: "Tyler Garben",
      leadRole: "East Mesa Production Manager",
      leadEmail: "tylergarben@ccv.church",
      schedule: [
        "1:00 PM: Call time and rehearsal",
        "2:45 PM: Full technical run-through",
        "4:00 PM and 5:30 PM: Services"
      ]
    }
  ],

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
    "ProPresenter": "The software that puts song lyrics and slides on the screens.",
    "grandMA2": "The lighting control system used in the Auditorium.",
    "dot2": "The lighting control interface used in the Students Venue.",
    "X32": "The digital audio mixing console used in the Students Venue.",
    "video switcher": "Equipment that chooses what video goes to the projectors and the live stream.",
    "technical run-through": "A full practice of the service with sound, lights, video and slides before the service starts.",
    "call time": "The time you're expected to arrive and be ready to start.",
    "stand by": "A heads-up that something is about to happen, so you're ready."
  }
};
