/* ============================================
   VIBESYNC — ROBO Mascot AI Engine
   ============================================ */

const Robo = {
  mood: 'hype', // sleepy, hype, detective, chaos, trophy
  interactionCount: 0,
  lastInteraction: 0,

  moods: {
    sleepy: { emoji: '😴', phrases: [
      "Zzz... oh! You woke me up! Nobody's been around... 😴",
      "*yawns* Is... is anyone there? ROBO is lonely... 🥺",
      "I've been counting pixels to stay awake. I'm at 4,392,841.",
    ]},
    hype: { emoji: '🎉', phrases: [
      "LET'S GOOOOO! The squad is HERE! 🔥🔥🔥",
      "The energy in here is UNREAL right now! Keep it up! ⚡",
      "I'm literally vibrating with excitement! What are we doing first?!",
      "This group's vibe is off the charts! My circuits are TINGLING! 🤖⚡",
    ]},
    detective: { emoji: '🕵️', phrases: [
      "Hmm... I've noticed some suspicious silence in here... 🔍",
      "My sensors detect low energy. ROBO is investigating... 🕵️",
      "Someone's been awfully quiet. My Ghost Crown radar is pinging...",
      "The vibe-o-meter is dropping. ROBO is on the case. 🔍",
    ]},
    chaos: { emoji: '🔥', phrases: [
      "CHAOS CARD ACTIVATED! EVERYTHING IS *fine* 🔥🔥🔥",
      "I'M ON FIRE! Literally! Someone played a Chaos Card! AHHH! 🔥",
      "Rules? We don't need rules! PURE CHAOS MODE ENGAGED! 🎲",
    ]},
    trophy: { emoji: '🏆', phrases: [
      "AND THE WINNER IS... *drumroll* 🥁🏆",
      "VICTORY! Let me do my celebration dance! 💃🕺🤖",
      "What a performance! ROBO is impressed! Standing ovation! 👏",
    ]},
  },

  // Interactive responses when user clicks ROBO
  interactions: [
    { text: "You clicked me! Here's a random dare: {dare}. Go! 🎯", type: 'dare' },
    { text: "ROBO FACT: Did you know your group has sent {count} messages today? {reaction}", type: 'fact' },
    { text: "Want me to start a game? I've got a FIRE one ready... 🎮", type: 'game' },
    { text: "I was just thinking about that time {memory}. Good times! 😄", type: 'memory' },
    { text: "Plot twist: I'm actually 3 robots in a trenchcoat. Don't tell anyone. 🤫", type: 'joke' },
    { text: "Your vibe personality says you're a {vibe}. Accurate? 🤔", type: 'vibe' },
    { text: "Quick challenge: First person to type 'VIBESYNC' wins bragging rights! ⚡", type: 'challenge' },
    { text: "I predict... {prophecy}. Screenshot this. We'll check later. 🔮", type: 'prophecy' },
    { text: "ROBO's mood right now: {mood}. Click again to change my mood! 🤖", type: 'mood' },
    { text: "Hey, you're awesome. Just wanted to say that. Now go be chaotic! 💜", type: 'compliment' },
  ],

  interact() {
    this.interactionCount++;
    const interaction = Utils.randItem(this.interactions);
    let text = interaction.text;

    // Fill placeholders
    text = text.replace('{dare}', Utils.randItem(AI_DARES));
    text = text.replace('{count}', Utils.randInt(42, 247));
    text = text.replace('{reaction}', Utils.randItem(['Impressive!', 'That\'s a lot!', 'Keep going!', 'New record? 👀']));
    text = text.replace('{memory}', Utils.randItem(MEMORY_ENTRIES).desc.substring(0, 60) + '...');
    text = text.replace('{vibe}', App.currentUser?.vibe || 'mystery vibe');
    text = text.replace('{prophecy}', Utils.randItem(PROPHECIES).text.replace('@USER', App.currentUser?.name || 'someone'));
    text = text.replace('{mood}', `${this.moods[this.mood].emoji} ${this.mood.toUpperCase()}`);

    // Update ROBO bubble on dashboard
    const bubble = document.getElementById('robo-message');
    if (bubble) {
      Utils.typewriter(bubble, text, 20);
    }

    // Show as toast if interaction type is special
    if (interaction.type === 'game') {
      Utils.toast('ROBO Suggests', 'How about a Lightning Round? 🎮', 'info');
    }

    // Cycle mood
    const moodKeys = Object.keys(this.moods);
    const currentIndex = moodKeys.indexOf(this.mood);
    this.mood = moodKeys[(currentIndex + 1) % moodKeys.length];

    this.lastInteraction = Date.now();
  },

  // Get a mood-appropriate message
  getMoodMessage() {
    const phrases = this.moods[this.mood]?.phrases || this.moods.hype.phrases;
    return Utils.randItem(phrases);
  },

  // Generate a welcome message for session
  getSessionWelcome(userName) {
    const welcomes = [
      `OHH ${userName.toUpperCase()} IS BACK! 🎉 Last time you survived the hot seat... ready for more?`,
      `${userName}! My favorite human! (Don't tell the others I said that) 🤖❤️`,
      `Welcome, ${userName}! My prediction engine says tonight is going to be LEGENDARY. 🔮`,
      `${userName} has entered the chat! Everyone act natural! ...too late. 😂`,
      `The vibe just went UP because ${userName} is here! Let's GOOOO! ⚡`,
      `${userName}! I've been saving a special dare just for you... 😈`,
    ];
    return Utils.randItem(welcomes);
  },

  // Generate a Ghost Crown announcement
  announceGhostCrown(targetName) {
    const titles = Utils.randItem(GHOST_TITLES);
    return {
      title: titles,
      announcement: `⚠️ GHOST ALERT: @${targetName} has been silent too long!\nThey've been crowned: ${titles}\n\nDARE OPTIONS ready! Choose their fate! 👻`,
    };
  },

  // Generate an AI Judge verdict
  generateVerdict(dareDesc, votes) {
    const verdicts = [
      `The crowd has spoken... and it's a MIXED bag. ${votes.hilarious > votes.mid ? 'But the laughs outweigh the cringe. INNOCENT of boringness!' : 'GUILTY of mediocrity. -50 points.'}`,
      `After careful analysis of ${votes.total} votes and group sentiment... ${votes.hilarious > votes.fail ? 'NOT BAD! The effort was there. +100 points for courage!' : 'Tragic. Absolutely tragic. Wall of Shame entry earned. 💀'}`,
      `JUDGE ROBO has deliberated. The ${dareDesc ? 'dare' : 'performance'} was... *dramatic pause* ... ${votes.hilarious >= 3 ? 'LEGENDARY! This one goes in the Memory Palace! 🏛️' : 'mid at best. But hey, at least you tried. 🤷'}`,
      `Reviewing the evidence... ${votes.fail > votes.hilarious ? 'The lion roar for Iron Man was a war crime. GUILTY of mediocrity. -50 points.' : 'The crowd loved it! INNOCENT! Here\'s a victory dance! 💃'}`,
    ];
    return Utils.randItem(verdicts);
  },

  // Boredom detection commentary
  boredomCommentary() {
    const comments = [
      "Is... is anyone alive in here? *taps mic* 🎤",
      "BOREDOM LEVEL: APPROACHING CRITICAL! I'm about to intervene! 🚨",
      "My sensors detect dangerous levels of silence. Deploying emergency protocol...",
      "I've seen more excitement at a spreadsheet convention. LET'S FIX THIS! 📊",
      "The vibes have flatlined. ROBO is performing CPR on this chat! 💓",
      "*walks into chat wearing a doctor's coat* The diagnosis: severe boredom. Prescription: GAMES! 🏥",
    ];
    return Utils.randItem(comments);
  },

  // Session narration (sports commentator style)
  narrate(event) {
    const narrations = {
      sessionStart: [
        "GOOD EVENING LADIES AND GENTLEMEN! Welcome to TONIGHT'S session! 🎙️",
        "AND WE ARE LIVE! The players are in. The vibes are set. LET'S GO! 🏟️",
        "The arena is booked! The crowd is electric! This session is going to be EPIC! ⚡",
      ],
      dareComplete: [
        "AND THE DARE IS COMPLETE! What a performance! The crowd goes WILD! 🎉",
        "INCREDIBLE! They actually did it! ROBO is SHOOK! 😱",
        "Ladies and gentlemen, we just witnessed HISTORY! 🏆",
      ],
      gameStart: [
        "GAME TIME! Buckle up! This is NOT a drill! 🎮",
        "EMERGENCY FUN PROTOCOL ACTIVATED! All players report to the arena! 🚨",
        "The game engine is REVVING UP! Who's going to WIN?! 🏎️",
      ],
      chaosCard: [
        "OH NO... OH NO NO NO... A CHAOS CARD HAS BEEN PLAYED! 🎲",
        "CHAOS! PURE CHAOS! The format is FLIPPING! Hold on tight! 🌪️",
        "Someone chose violence today and I LOVE IT! CHAOS MODE! 🔥",
      ],
      memberJoin: [
        "We have a NEW ARRIVAL! The energy shifts! ⚡",
        "ANOTHER player enters the arena! The odds just changed! 🎯",
      ],
    };

    return Utils.randItem(narrations[event] || narrations.sessionStart);
  },
};
