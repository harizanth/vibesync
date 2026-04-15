/* ============================================
   VIBESYNC — Session Room Engine
   ============================================ */

const Session = {
  name: '',
  members: [],
  messages: [],
  vibeScore: 82,
  isActive: false,
  messageCount: 0,
  ghostCrownActive: false,
  chaosCardUsed: false,
  boredomLevel: 0,
  timers: [],

  // Member activity tracking
  memberActivity: {},
  lastMessageTime: Date.now(),

  init(name, memberCount) {
    this.name = name;
    this.isActive = true;
    this.messages = [];
    this.messageCount = 0;
    this.ghostCrownActive = false;
    this.chaosCardUsed = false;
    this.boredomLevel = 0;
    this.vibeScore = Utils.randInt(70, 95);
    this.lastMessageTime = Date.now();

    // Set up members
    this.members = DEMO_USERS.slice(0, Math.max(memberCount, 3)).map(u => ({
      ...u,
      online: true,
      lastActive: Date.now(),
      silentMinutes: 0,
      hasGhostCrown: false,
    }));

    // Add current user
    if (App.currentUser) {
      this.members.unshift({
        name: App.currentUser.name,
        avatar: App.currentUser.avatar,
        vibe: App.currentUser.vibe || 'hype',
        online: true,
        lastActive: Date.now(),
        silentMinutes: 0,
        hasGhostCrown: false,
        isUser: true,
      });
    }

    // Update UI
    this.updateRoomInfo();
    this.populateMembers();
    this.clearChat();

    // Welcome messages
    this.addSystemMessage('Session started — ROBO is warming up! 🤖');
    setTimeout(() => {
      this.addRoboMessage(Robo.narrate('sessionStart'));
    }, 800);
    setTimeout(() => {
      this.addRoboMessage(Robo.getSessionWelcome(App.currentUser?.name || 'friend'));
    }, 2500);

    // Show prophecy after a bit
    setTimeout(() => {
      App.showProphecy();
    }, 4000);

    // Start simulation engine
    this.startSimulation();
  },

  cleanup() {
    this.isActive = false;
    this.timers.forEach(t => clearTimeout(t));
    this.timers.forEach(t => clearInterval(t));
    this.timers = [];
  },

  updateRoomInfo() {
    const nameEl = document.getElementById('session-room-name');
    const membersEl = document.getElementById('session-room-members');
    if (nameEl) nameEl.textContent = this.name;
    if (membersEl) membersEl.textContent = `${this.members.length} members • Session active`;
  },

  populateMembers() {
    const list = document.getElementById('members-list');
    if (!list) return;

    list.innerHTML = this.members.map(m => `
      <div class="member-item" data-name="${m.name}">
        <div class="avatar avatar-sm" style="background: ${m.isUser ? 'var(--gradient-purple)' : 'var(--gradient-cyan)'}">
          ${m.avatar}
          <div class="avatar-status ${m.online ? 'online' : 'offline'}"></div>
        </div>
        <span class="member-name">${m.name} ${m.isUser ? '(You)' : ''}</span>
        ${m.hasGhostCrown ? '<span class="member-crown">👑</span>' : ''}
        ${m.isUser ? '<span class="badge badge-purple" style="font-size: 9px;">You</span>' : ''}
      </div>
    `).join('');
  },

  clearChat() {
    const chat = document.getElementById('chat-messages');
    if (chat) {
      chat.innerHTML = '';
    }
  },

  // ===== MESSAGE HANDLERS =====
  sendMessage() {
    const input = document.getElementById('chat-input');
    if (!input || !input.value.trim()) return;

    const text = input.value.trim();
    input.value = '';

    this.addUserMessage(text);
    this.messageCount++;
    this.lastMessageTime = Date.now();
    this.boredomLevel = Math.max(0, this.boredomLevel - 20);
    this.updateVibeScore(2);

    // Check for keywords and respond
    this.processUserInput(text);

    // Simulate responses from other members
    this.scheduleResponses(text);
  },

  addUserMessage(text) {
    const chat = document.getElementById('chat-messages');
    if (!chat) return;

    const msg = document.createElement('div');
    msg.className = 'chat-message own animate-slide-up';
    msg.innerHTML = `
      <div class="chat-message-content">
        <div class="chat-message-text">${this.escapeHtml(text)}</div>
        <div class="chat-message-time">${Utils.formatTime(Date.now())}</div>
      </div>
      <div class="avatar avatar-sm" style="background: var(--gradient-purple)">${App.currentUser?.avatar || '😎'}</div>
    `;
    chat.appendChild(msg);
    this.scrollToBottom();
  },

  addMemberMessage(member, text) {
    const chat = document.getElementById('chat-messages');
    if (!chat) return;

    const msg = document.createElement('div');
    msg.className = 'chat-message animate-slide-up';
    msg.innerHTML = `
      <div class="avatar avatar-sm" style="background: var(--gradient-cyan)">${member.avatar}</div>
      <div class="chat-message-content">
        <div class="chat-message-author">${member.name}</div>
        <div class="chat-message-text">${text}</div>
        <div class="chat-message-time">${Utils.formatTime(Date.now())}</div>
        <div class="chat-message-reactions">
          <span class="chat-reaction" onclick="this.querySelector('.count').textContent=parseInt(this.querySelector('.count').textContent)+1">😂 <span class="count">0</span></span>
          <span class="chat-reaction" onclick="this.querySelector('.count').textContent=parseInt(this.querySelector('.count').textContent)+1">🔥 <span class="count">0</span></span>
        </div>
      </div>
    `;
    chat.appendChild(msg);
    this.scrollToBottom();
  },

  addRoboMessage(text) {
    const chat = document.getElementById('chat-messages');
    if (!chat) return;

    const msg = document.createElement('div');
    msg.className = 'chat-message robo animate-slide-up';
    msg.innerHTML = `
      <div class="avatar avatar-sm" style="background: linear-gradient(135deg, var(--purple), var(--cyan))">🤖</div>
      <div class="chat-message-content">
        <div class="chat-message-author">ROBO 🤖</div>
        <div class="chat-message-text">${text}</div>
        <div class="chat-message-time">${Utils.formatTime(Date.now())}</div>
      </div>
    `;
    chat.appendChild(msg);
    this.scrollToBottom();
  },

  addSystemMessage(text) {
    const chat = document.getElementById('chat-messages');
    if (!chat) return;

    const msg = document.createElement('div');
    msg.className = 'chat-system-message';
    msg.textContent = text;
    chat.appendChild(msg);
    this.scrollToBottom();
  },

  scrollToBottom() {
    const chat = document.getElementById('chat-messages');
    if (chat) {
      setTimeout(() => chat.scrollTop = chat.scrollHeight, 50);
    }
  },

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  // ===== QUICK REACTIONS =====
  quickReact(emoji) {
    const chat = document.getElementById('chat-messages');
    if (!chat) return;

    // Show floating reaction
    const reaction = document.createElement('div');
    reaction.style.cssText = `
      position: fixed;
      bottom: 100px;
      left: 50%;
      font-size: 48px;
      z-index: 100;
      pointer-events: none;
      animation: confetti 1s ease-out forwards;
    `;
    reaction.textContent = emoji;
    document.body.appendChild(reaction);
    setTimeout(() => reaction.remove(), 1000);

    // Add as a message
    this.addUserMessage(emoji);
    this.updateVibeScore(1);
  },

  // ===== AI RESPONSE ENGINE =====
  processUserInput(text) {
    const lower = text.toLowerCase();

    // ROBO responds to mentions
    if (lower.includes('robo') || lower.includes('bot')) {
      setTimeout(() => {
        const responses = [
          "You rang? 🤖 ROBO is always listening! What can I do for you?",
          "Someone called? I was just calculating the optimal chaos ratio...",
          "ROBO HERE! At your service! Want a dare? A game? A fun fact? 🎯",
          "Did someone say my name? My ears are literally antennas! 📡",
        ];
        this.addRoboMessage(Utils.randItem(responses));
      }, Utils.randInt(800, 1500));
    }

    // Respond to boredom keywords
    if (lower.includes('bored') || lower.includes('boring') || lower.includes('dead chat')) {
      setTimeout(() => {
        this.addRoboMessage(Robo.boredomCommentary());
        setTimeout(() => this.triggerBoredomAlert(), 2000);
      }, 1000);
    }

    // Respond to game requests
    if (lower.includes('game') || lower.includes('play') || lower.includes('let\'s go')) {
      setTimeout(() => {
        this.addRoboMessage("GAME TIME! I'll fire one up right now! 🎮");
        setTimeout(() => this.launchEmergencyGame(), 2000);
      }, 1000);
    }
  },

  scheduleResponses(userText) {
    // Random member responds
    const respondingMembers = this.members.filter(m => !m.isUser);
    const responder = Utils.randItem(respondingMembers);

    if (responder && Math.random() > 0.3) {
      const delay = Utils.randInt(2000, 5000);
      const timer = setTimeout(() => {
        if (!this.isActive) return;
        const responses = [
          "lol 😂", "no way 💀", "facts!", "wait WHAT", "okay but hear me out...",
          "hahaha that's so true", "ROBO do something!", "let's goooo 🔥",
          "I can't with this group 😭", "say less", "that's crazy",
          "someone clip that", "W take", "nah you're bugging", "real ones know 🤝",
          `${App.currentUser?.name || 'yo'} spitting facts rn`, "honestly same",
          "this conversation is elite", "we need more of this energy",
        ];
        this.addMemberMessage(responder, Utils.randItem(responses));
        this.messageCount++;
      }, delay);
      this.timers.push(timer);
    }

    // Sometimes another member also responds
    if (Math.random() > 0.6) {
      const other = Utils.randItem(respondingMembers.filter(m => m !== responder));
      if (other) {
        const delay = Utils.randInt(4000, 8000);
        const timer = setTimeout(() => {
          if (!this.isActive) return;
          const reactions = [
            "😂😂😂", "oh here we go", "this group is unhinged and I love it",
            "wait can we go back to what ${0} said?".replace('${0}', responder?.name || 'they'),
            "somebody screenshot this", "LMAOOO", "not this again 💀",
            "okay but seriously though", "y'all are too much 😭",
          ];
          this.addMemberMessage(other, Utils.randItem(reactions));
        }, delay);
        this.timers.push(timer);
      }
    }
  },

  // ===== SIMULATION ENGINE =====
  startSimulation() {
    // Periodic ROBO commentary
    const roboTimer = setInterval(() => {
      if (!this.isActive) return;
      if (Math.random() > 0.5) {
        const comments = [
          "The vibe is IMMACULATE right now! Keep it going! ⚡",
          "I'm seeing great energy from everyone! This is what VIBESYNC is about! 🔥",
          `${Utils.randItem(this.members.filter(m => !m.isUser))?.name || 'Someone'} has been carrying this conversation! Respect! 💪`,
          "Fun fact: we've been vibing for " + Utils.randInt(5, 30) + " minutes straight with no drop-off! 📈",
          "ROBO's prediction: someone's going to say something controversial in the next 2 minutes... 🔮",
        ];
        this.addRoboMessage(Utils.randItem(comments));
      }
    }, 30000);
    this.timers.push(roboTimer);

    // Simulated member activity
    const activityTimer = setInterval(() => {
      if (!this.isActive) return;

      // Random member sends a message
      if (Math.random() > 0.4) {
        const member = Utils.randItem(this.members.filter(m => !m.isUser));
        if (member) {
          const msgs = [
            "anyone up for a game?", "this chat is literally the best part of my day",
            "wait what did I miss", "okay I have tea to spill ☕",
            "ROBO give me a dare!", "who's still up lol",
            "I have the most chaotic story from today", "unpopular opinion incoming...",
            "can we talk about how good that last session was",
            "someone play a chaos card I'm getting bored",
            `${App.currentUser?.name || 'yo'} where'd you go?`, "let's settle this once and for all",
            "hypothetically speaking... 🤔", "okay but WHY is that so accurate",
          ];
          this.addMemberMessage(member, Utils.randItem(msgs));
          this.messageCount++;
          member.lastActive = Date.now();
        }
      }
    }, 15000);
    this.timers.push(activityTimer);

    // Boredom detection
    const boredomTimer = setInterval(() => {
      if (!this.isActive) return;

      const timeSinceLastMessage = Date.now() - this.lastMessageTime;
      if (timeSinceLastMessage > 20000) { // 20 seconds for demo (normally 5 min)
        this.boredomLevel = Math.min(100, this.boredomLevel + 15);
        this.updateVibeScore(-3);
      }

      // Update vibe display
      this.updateVibeDisplay();

      // Check if boredom is critical
      if (this.boredomLevel >= 80 && !this.ghostCrownActive) {
        this.triggerBoredomAlert();
        this.boredomLevel = 40; // Reset partially
      }
    }, 10000);
    this.timers.push(boredomTimer);

    // Ghost Crown check
    const ghostTimer = setInterval(() => {
      if (!this.isActive || this.ghostCrownActive) return;

      // Random chance to trigger ghost crown on a member
      if (Math.random() > 0.7) {
        const quietMember = Utils.randItem(this.members.filter(m => !m.isUser && !m.hasGhostCrown));
        if (quietMember) {
          this.triggerGhostCrown(quietMember);
        }
      }
    }, 25000);
    this.timers.push(ghostTimer);

    // Auto vibe fluctuation
    const vibeTimer = setInterval(() => {
      if (!this.isActive) return;
      const delta = Utils.randInt(-3, 5);
      this.updateVibeScore(delta);
    }, 8000);
    this.timers.push(vibeTimer);
  },

  // ===== VIBE SYSTEM =====
  updateVibeScore(delta) {
    this.vibeScore = Math.max(10, Math.min(100, this.vibeScore + delta));
    this.updateVibeDisplay();
  },

  updateVibeDisplay() {
    const scoreEl = document.getElementById('vibe-score');
    if (scoreEl) scoreEl.textContent = `${this.vibeScore}%`;

    // Update dot indicators
    const dots = document.querySelectorAll('.vibe-meter-dot');
    dots.forEach((dot, i) => {
      dot.classList.remove('active', 'warning', 'danger');
      const threshold = (i + 1) * 20;
      if (this.vibeScore >= threshold) {
        if (this.vibeScore > 60) dot.classList.add('active');
        else if (this.vibeScore > 30) dot.classList.add('warning');
        else dot.classList.add('danger');
      }
    });

    // Update energy bar
    const energyBar = document.getElementById('energy-bar');
    if (energyBar) energyBar.style.width = `${this.vibeScore}%`;

    const energyLabel = document.getElementById('energy-level');
    if (energyLabel) {
      if (this.vibeScore > 70) energyLabel.textContent = 'High ⚡';
      else if (this.vibeScore > 40) energyLabel.textContent = 'Medium 🔄';
      else energyLabel.textContent = 'Low 😴';
    }
  },

  // ===== GHOST CROWN =====
  triggerGhostCrown(target) {
    this.ghostCrownActive = true;
    target.hasGhostCrown = true;
    this.populateMembers();

    const { title, announcement } = Robo.announceGhostCrown(target.name);

    // ROBO announcement
    this.addRoboMessage(announcement);

    // Show ghost crown alert
    const alert = document.getElementById('ghost-crown-alert');
    const targetText = document.getElementById('ghost-crown-target');
    if (alert && targetText) {
      targetText.textContent = `@${target.name} has been crowned: ${title}`;
      alert.style.display = 'block';
      Utils.animateOnce(alert, 'animate-bounce-in');
    }

    Utils.toast('👻 Ghost Crown!', `${target.name} has been crowned!`, 'warning');
  },

  handleDare(type) {
    // Hide alert
    const alert = document.getElementById('ghost-crown-alert');
    if (alert) alert.style.display = 'none';

    const target = this.members.find(m => m.hasGhostCrown);
    const targetName = target?.name || 'Someone';

    if (type === 'ai') {
      const dare = Utils.randItem(AI_DARES);
      this.addRoboMessage(`🤖 AI DARE for ${targetName}: "${dare}" — You have 60 seconds! ⏱️`);
      this.addSystemMessage(`${targetName} received an AI dare!`);

      // Simulate dare completion
      const timer = setTimeout(() => {
        if (!this.isActive) return;
        if (Math.random() > 0.3) {
          this.addRoboMessage(`${targetName} COMPLETED the dare! 🎉 Ghost Crown removed! Crown = GONE!`);
          this.addSystemMessage(`${targetName} redeemed themselves!`);
          if (target) {
            target.hasGhostCrown = false;
            this.populateMembers();
          }
          this.ghostCrownActive = false;
          Utils.confetti();

          // Trigger AI Judge
          setTimeout(() => {
            AIJudge.show(dare, targetName);
          }, 2000);
        } else {
          this.addRoboMessage(`${targetName} FAILED the dare! 💀 The Crown grows BIGGER! 👻👑`);
          this.ghostCrownActive = false;
        }
      }, 5000);
      this.timers.push(timer);
    } else if (type === 'manual') {
      this.addSystemMessage(`Group is writing a dare for ${targetName}...`);
      this.addRoboMessage(`📝 The group has 30 seconds to type a dare for ${targetName}! GO!`);

      setTimeout(() => {
        if (!this.isActive) return;
        const manualDare = Utils.randItem([
          "Do 10 push-ups and prove it",
          "Sing the chorus of your last played song",
          "Text your crush 'hey' right now",
          "Change your profile pic to something embarrassing for 24 hours",
        ]);
        this.addMemberMessage(Utils.randItem(this.members.filter(m => !m.isUser)), `Dare for ${targetName}: ${manualDare}! 😈`);
        if (target) {
          target.hasGhostCrown = false;
          this.populateMembers();
        }
        this.ghostCrownActive = false;
      }, 3000);
    } else if (type === 'wildcard') {
      // Show spin wheel
      this.addRoboMessage(`🎲 ${targetName} chose the WHEEL OF CHAOS! Spinning... 🎡`);
      document.getElementById('spin-overlay').classList.add('active');
    }
  },

  spinWheel() {
    const wheel = document.getElementById('spin-wheel');
    const btn = document.getElementById('spin-btn');
    btn.disabled = true;
    btn.textContent = 'Spinning...';

    const rotation = Utils.randInt(1080, 2160);
    wheel.style.transform = `rotate(${rotation}deg)`;

    setTimeout(() => {
      const result = Utils.randItem([
        '🤖 Double AI Dare!',
        '🎉 Crown Removed — You\'re Free!',
        '🔥 Dare + Hot Seat Combo!',
        '💀 Crown Stays + New Title!',
        '🎮 Beat ROBO in a Mini-Game!',
        '❤️ Everyone says something nice about you!',
      ]);

      document.getElementById('spin-overlay').classList.remove('active');
      wheel.style.transform = 'rotate(0deg)';
      btn.disabled = false;
      btn.textContent = 'SPIN! 🎡';

      this.addRoboMessage(`🎲 THE WHEEL HAS SPOKEN: ${result}`);
      Utils.toast('Wheel Result!', result, 'info');

      const target = this.members.find(m => m.hasGhostCrown);
      if (target) {
        target.hasGhostCrown = false;
        this.populateMembers();
      }
      this.ghostCrownActive = false;
    }, 3500);
  },

  // ===== BOREDOM ENGINE =====
  triggerBoredomAlert() {
    this.addRoboMessage(Robo.boredomCommentary());

    const alert = document.getElementById('boredom-alert');
    if (alert) {
      alert.style.display = 'block';
      Utils.animateOnce(alert, 'animate-shake');
    }

    Robo.mood = 'detective';
  },

  launchEmergencyGame() {
    const alert = document.getElementById('boredom-alert');
    if (alert) alert.style.display = 'none';

    this.addRoboMessage(Robo.narrate('gameStart'));
    this.boredomLevel = 0;
    this.updateVibeScore(15);

    setTimeout(() => {
      const gameType = Utils.randItem(['lightning', 'thisOrThat', 'hotSeat', 'plotTwist']);
      Games.launch(gameType);
    }, 1000);
  },

  // ===== CHAOS CARDS =====
  playChaosCard() {
    if (this.chaosCardUsed) {
      Utils.toast('Already Used', 'You already played your Chaos Card this session!', 'warning');
      return;
    }

    this.chaosCardUsed = true;
    Robo.mood = 'chaos';

    const card = Utils.randItem(CHAOS_CARDS);
    this.addRoboMessage(Robo.narrate('chaosCard'));
    this.addSystemMessage(`${App.currentUser?.name || 'Someone'} played a CHAOS CARD! 🎲`);

    // Show chaos overlay
    document.getElementById('chaos-card-emoji').textContent = card.emoji;
    document.getElementById('chaos-card-title').textContent = card.title;
    document.getElementById('chaos-card-detail').textContent = card.detail;
    document.getElementById('chaos-overlay').classList.add('active');

    this.updateVibeScore(10);
    Utils.confetti();
  },

  acceptChaos() {
    document.getElementById('chaos-overlay').classList.remove('active');
    const cardTitle = document.getElementById('chaos-card-title')?.textContent || 'CHAOS';
    this.addRoboMessage(`CHAOS MODE: ${cardTitle} is NOW ACTIVE! Let the madness begin! 🔥`);

    // Simulate members reacting to chaos
    setTimeout(() => {
      this.addMemberMessage(Utils.randItem(this.members.filter(m => !m.isUser)), "oh no OH NO 😂😂😂");
    }, 1500);
    setTimeout(() => {
      this.addMemberMessage(Utils.randItem(this.members.filter(m => !m.isUser)), "this is going to be LEGENDARY");
    }, 3000);

    // Update chaos card button
    const btn = document.querySelector('.chaos-card-btn .sub');
    if (btn) btn.textContent = '0 remaining this session';
  },

  // ===== EMOJI & ATTACH (placeholder) =====
  toggleEmoji() {
    Utils.toast('Coming Soon', 'Emoji picker is on its way! 🎨', 'info');
  },

  attachFile() {
    Utils.toast('Coming Soon', 'File sharing is coming soon! 📎', 'info');
  },
};

/* ============================================
   AI Judge System
   ============================================ */
const AIJudge = {
  show(dareDesc, targetName) {
    const overlay = document.getElementById('judge-overlay');
    const dareDescEl = document.getElementById('judge-dare-desc');
    const votesEl = document.getElementById('judge-votes');
    const verdictText = document.getElementById('judge-verdict-text');

    // Set dare description
    if (dareDescEl) dareDescEl.textContent = `"${targetName} must: ${dareDesc}"`;

    // Generate votes
    const hilarious = Utils.randInt(3, 7);
    const mid = Utils.randInt(1, 3);
    const fail = Utils.randInt(0, 2);
    const total = hilarious + mid + fail;

    const votes = { hilarious, mid, fail, total };

    if (votesEl) {
      votesEl.innerHTML = `
        <div class="judge-vote">
          <span class="judge-vote-emoji">😂</span>
          <span class="judge-vote-label">Hilarious</span>
          <div class="judge-vote-bar">
            <div class="judge-vote-fill" style="width: ${(hilarious/total)*100}%; background: var(--green);"></div>
          </div>
          <span class="judge-vote-count">${hilarious}</span>
        </div>
        <div class="judge-vote">
          <span class="judge-vote-emoji">😐</span>
          <span class="judge-vote-label">Mid attempt</span>
          <div class="judge-vote-bar">
            <div class="judge-vote-fill" style="width: ${(mid/total)*100}%; background: var(--amber);"></div>
          </div>
          <span class="judge-vote-count">${mid}</span>
        </div>
        <div class="judge-vote">
          <span class="judge-vote-emoji">💀</span>
          <span class="judge-vote-label">Total failure</span>
          <div class="judge-vote-bar">
            <div class="judge-vote-fill" style="width: ${(fail/total)*100}%; background: var(--red);"></div>
          </div>
          <span class="judge-vote-count">${fail}</span>
        </div>
      `;
    }

    // Generate verdict
    const verdict = Robo.generateVerdict(dareDesc, votes);
    if (verdictText) verdictText.textContent = `⚖️ JUDGE ROBO SAYS: "${verdict}"`;

    // Show overlay
    if (overlay) overlay.classList.add('active');
    Robo.mood = 'trophy';
  },

  close() {
    const overlay = document.getElementById('judge-overlay');
    if (overlay) overlay.classList.remove('active');

    Session.addRoboMessage("The court has adjourned! Back to vibing! ⚖️➡️🎉");
    Session.updateVibeScore(5);
  },
};
