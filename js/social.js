/* ============================================
   VIBESYNC — Social Features
   (Leaderboard, Memory Palace, Director, Confessional — 
    Additional behaviors beyond static rendering)
   ============================================ */

// This file handles dynamic social features interactions
// that go beyond the static rendering done in app.js

const Social = {
  // ===== ACCENT / CHARACTER MODE =====
  accentModeActive: false,
  currentAccent: null,

  startAccentMode() {
    const accents = [
      { name: 'Medieval Knight', example: 'Hark! Thy words ring true, noble friend!' },
      { name: 'Bollywood Villain', example: 'Tumhara koi nahi bacha sakta! Muahaha!' },
      { name: 'News Anchor', example: 'Breaking news: This chat just got interesting.' },
      { name: 'Pirate', example: 'Arr matey, that be a fine tale ye spin!' },
      { name: 'Shakespeare', example: 'What light through yonder chat window breaks?' },
      { name: 'Robot', example: 'PROCESSING... YOUR.INPUT.IS.HUMOROUS.HA.HA.' },
    ];

    this.currentAccent = Utils.randItem(accents);
    this.accentModeActive = true;

    Session.addRoboMessage(
      `🎭 ACCENT MODE ACTIVATED!\n\nFor the next 10 minutes, everyone must talk like a **${this.currentAccent.name}**!\n\nExample: "${this.currentAccent.example}"\n\nAnyone who breaks character loses 50 points! 😤`
    );

    Utils.toast('Accent Mode! 🎭', `Talk like a ${this.currentAccent.name}!`, 'info');

    // Auto-deactivate after a while
    setTimeout(() => {
      if (this.accentModeActive) {
        this.accentModeActive = false;
        Session.addRoboMessage('🎭 Accent Mode is OVER! You can talk normally again... or can you? 😏');
      }
    }, 120000); // 2 minutes in demo
  },

  // ===== RABBIT HOLE GAME =====
  startRabbitHole() {
    const topics = [
      "Why do we park in driveways and drive on parkways?",
      "If a tomato is a fruit, is ketchup a smoothie?",
      "What if our entire universe is just an atom in a much larger universe?",
      "If you drop soap on the floor, is the floor clean or is the soap dirty?",
      "Why is it called a building if it's already built?",
      "If you enjoy wasting time, is that time really wasted?",
    ];

    const topic = Utils.randItem(topics);
    Session.addRoboMessage(
      `🕳️ RABBIT HOLE TIME!\n\nTopic: "${topic}"\n\nYou have 5 minutes to go as deep and chaotic as possible. Most creative connection to a completely unrelated topic wins! 🏆`
    );

    Utils.toast('Rabbit Hole! 🕳️', 'Go deep! Get weird!', 'info');
  },

  // ===== MEMORY DUEL =====
  startMemoryDuel() {
    const challenger = Utils.randItem(Session.members.filter(m => !m.isUser));
    const defender = Utils.randItem(Session.members.filter(m => !m.isUser && m !== challenger));

    if (!challenger || !defender) return;

    Session.addRoboMessage(
      `🧠 MEMORY DUEL!\n\n${challenger.avatar} ${challenger.name} VS ${defender.avatar} ${defender.name}\n\nYou'll be quizzed on group history from the Memory Palace!\nFirst to 3 correct answers wins bragging rights! 🏆`
    );

    // Simulate duel questions
    const questions = [
      { q: "What was the first Ghost Crown title given in this group?", a: GHOST_TITLES[0] },
      { q: "Who played the first Chaos Card this season?", a: `${Utils.randItem(DEMO_USERS).name}` },
      { q: "What was ROBO's first prediction that came true?", a: "Someone would start a food argument" },
    ];

    let round = 0;
    const duelRound = () => {
      if (round >= questions.length) {
        Session.addRoboMessage(`🧠 MEMORY DUEL COMPLETE!\n${challenger.name} wins with superior group knowledge! 🏆`);
        return;
      }

      Session.addRoboMessage(`❓ Round ${round + 1}: ${questions[round].q}`);
      round++;

      if (round < questions.length) {
        setTimeout(duelRound, 8000);
      } else {
        setTimeout(() => {
          Session.addRoboMessage(`🧠 MEMORY DUEL COMPLETE!\n${challenger.name} wins with superior group knowledge! 🏆`);
        }, 5000);
      }
    };

    setTimeout(duelRound, 2000);
  },

  // ===== TWO AIs ONE HUMAN =====
  startTwoAIsOneHuman() {
    Session.addRoboMessage(
      `🤖 TWO AIs ONE HUMAN!\n\nOne person acts like a robot. Everyone else guesses who the "human" is.\nBut plot twist: ROBO is one of the AIs! Can you spot the real human?\n\nStarting in 10 seconds... 🎭`
    );

    setTimeout(() => {
      Session.addRoboMessage("ROUND START! Everyone, respond to this:\n\n\"What's your favorite thing about weekends?\"\n\n🤖 Remember: one of these responses is from a real human!");

      setTimeout(() => {
        Session.addMemberMessage(DEMO_USERS[0], "WEEKENDS.ARE.OPTIMAL.FOR.HUMAN.RECHARGING.CYCLES. I ENJOY THEM APPROXIMATELY 87.3%.");
        setTimeout(() => {
          Session.addMemberMessage(DEMO_USERS[1], "honestly just sleeping in and not having to set an alarm, that's literally it 😴");
          setTimeout(() => {
            Session.addMemberMessage(DEMO_USERS[2], "MY.ANALYSIS.INDICATES.WEEKENDS.PROVIDE.INCREASED.DOPAMINE.PRODUCTION.FASCINATING.");
          }, 2000);
        }, 2000);
      }, 2000);
    }, 3000);
  },

  // ===== UNPOPULAR OPINION ARENA =====
  startUnpopularOpinion() {
    const opinions = [
      "Breakfast food is overrated",
      "Monday is actually the best day of the week",
      "Dogs are overrated as pets",
      "Coffee tastes terrible",
      "Summer is the worst season",
      "Homework is actually useful",
      "Social media makes people happier",
    ];

    Session.addRoboMessage(
      `🏟️ UNPOPULAR OPINION ARENA!\n\nEveryone submit one hot take. The group votes on the most controversial one. That person must defend their position for 2 minutes!\n\nROBO's starter: "${Utils.randItem(opinions)}"\n\nYour turn — drop your take! 🔥`
    );
  },

  // ===== REDIRECT GAME =====
  startRedirectGame() {
    const starters = [
      "So I was walking to the store yesterday when I noticed",
      "The other day my friend told me this wild story about",
      "I've been thinking a lot about why people always",
      "Last week something happened that completely changed my perspective on",
    ];

    Session.addRoboMessage(
      `🔄 THE REDIRECT GAME!\n\nSomeone starts telling a story. When ROBO yells "PLOT TWIST!" — they must completely change direction!\n\n${Utils.randItem(Session.members.filter(m => !m.isUser))?.name || 'Someone'}, you start with:\n\n"${Utils.randItem(starters)}..."`
    );

    // Schedule plot twists
    setTimeout(() => {
      Session.addRoboMessage("🔄 PLOT TWIST! Change direction NOW!");
    }, 10000);

    setTimeout(() => {
      Session.addRoboMessage("🔄 PLOT TWIST AGAIN! Go somewhere COMPLETELY different!");
    }, 20000);
  },

  // ===== GAME RECOMMENDATIONS =====
  getRecommendation() {
    const tierS = [
      { name: "Liar's Throne", desc: "One person lies, group asks 3 questions, vote truth/lie", icon: '🤥' },
      { name: "Unpopular Opinion Arena", desc: "Submit hot takes, most controversial defends for 2 min", icon: '🏟️' },
      { name: "Speed Roast", desc: "30 seconds to roast the person to your left", icon: '🔥' },
      { name: "The Redirect Game", desc: "Tell a story, ROBO yells PLOT TWIST, change direction", icon: '🔄' },
    ];

    const tierA = [
      { name: "Two AIs One Human", desc: "One person acts robotic, group finds the human", icon: '🤖' },
      { name: "Memory Duel", desc: "Two members quizzed on group history from Memory Palace", icon: '🧠' },
      { name: "Emoji Court", desc: "State your opinion using ONLY emojis, group interprets", icon: '😀' },
    ];

    const allGames = [...tierS.map(g => ({...g, tier: 'S'})), ...tierA.map(g => ({...g, tier: 'A'}))];
    return allGames;
  },

  suggestGame() {
    const games = this.getRecommendation();
    const suggested = Utils.shuffle(games).slice(0, 3);

    let msg = "🎲 ROBO'S GAME SUGGESTIONS\n\nBased on your group's personality:\n\n";
    suggested.forEach(g => {
      msg += `${g.icon} **${g.name}** (Tier ${g.tier})\n${g.desc}\n\n`;
    });
    msg += "Type the game name or react to pick one! 🎮";

    Session.addRoboMessage(msg);
  },
};


/* ============================================
   Additional Initialization & Event Listeners
   ============================================ */

// Auto-initialize ROBO's dashboard message cycling
setInterval(() => {
  if (App.currentPage === 'dashboard-page' && App.currentUser) {
    const bubble = document.getElementById('robo-message');
    if (bubble && !document.hidden) {
      const msg = Utils.randItem(ROBO_GREETINGS).replace('@USER', App.currentUser.name);
      // Only auto-update if user hasn't recently interacted
      if (Date.now() - Robo.lastInteraction > 15000) {
        Utils.typewriter(bubble, msg, 25);
      }
    }
  }
}, 20000);

// Keyboard shortcut for chat
document.addEventListener('keydown', (e) => {
  // Focus chat input when pressing / in session
  if (e.key === '/' && App.currentPage === 'session-page') {
    const input = document.getElementById('chat-input');
    if (input && document.activeElement !== input) {
      e.preventDefault();
      input.focus();
    }
  }

  // Escape to close modals
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
    document.querySelectorAll('.game-overlay.active').forEach(g => {
      Games.closeGame();
    });
    const judgeOverlay = document.getElementById('judge-overlay');
    if (judgeOverlay?.classList.contains('active')) {
      AIJudge.close();
    }
  }
});

// Prevent accidental page leave during session
window.addEventListener('beforeunload', (e) => {
  if (Session.isActive) {
    e.preventDefault();
    e.returnValue = 'You have an active session. Are you sure you want to leave?';
  }
});

// Console Easter Egg
console.log(`
  ⚡ VIBESYNC — Where Groups Come Alive ⚡
  ========================================
  
  🤖 ROBO says: "Welcome, developer! 
     Try typing 'Robo.interact()' for a surprise!"
  
  Available commands:
  - Robo.interact()     — Talk to ROBO
  - Social.suggestGame() — Get game suggestions  
  - Utils.confetti()    — Confetti party!
  - Session.triggerGhostCrown(Session.members[1]) — Force Ghost Crown
  
  Built with ❤️ and chaos by VIBESYNC team
`);
