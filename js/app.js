/* ============================================
   VIBESYNC — Main Application Controller
   ============================================ */

const App = {
  currentPage: 'landing-page',
  currentUser: null,
  currentOnboardStep: 1,
  selectedVibe: null,
  avatarIndex: 0,
  avatarOptions: ['😎', '🦋', '🔥', '✨', '🎮', '🎯', '🧠', '🎭', '🦊', '🐺', '🦁', '🐉'],

  // ===== INITIALIZATION =====
  init() {
    Utils.createParticles();
    this.checkExistingUser();
    this.setupScrollHandler();
    this.setupResponsive();

    // Add landing page scroll interactivity
    window.addEventListener('scroll', () => {
      const nav = document.getElementById('landing-nav');
      if (nav) {
        nav.classList.toggle('scrolled', window.scrollY > 50);
      }
    });

    console.log('%c⚡ VIBESYNC loaded', 'color: #a855f7; font-size: 16px; font-weight: bold;');
  },

  checkExistingUser() {
    const user = Utils.store.get('user');
    if (user) {
      this.currentUser = user;
      this.showPage('dashboard-page');
      this.updateDashboard();
    }
  },

  setupScrollHandler() {
    // Intersection observer for animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-slide-up');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.feature-card').forEach(card => observer.observe(card));
  },

  setupResponsive() {
    const checkMobile = () => {
      const isMobile = window.innerWidth <= 1024;
      const menuBtn = document.getElementById('mobile-menu-btn');
      if (menuBtn) menuBtn.style.display = isMobile ? 'flex' : 'none';
    };
    window.addEventListener('resize', checkMobile);
    checkMobile();
  },

  // ===== PAGE NAVIGATION =====
  showPage(pageId, subContext) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

    // Show target page
    const page = document.getElementById(pageId);
    if (page) {
      page.classList.add('active');
      this.currentPage = pageId;
    }

    // Handle sub-context
    if (pageId === 'auth-page' && subContext) {
      this.toggleAuth(subContext);
    }

    if (pageId === 'dashboard-page') {
      this.updateDashboard();
    }

    // Scroll to top
    window.scrollTo(0, 0);
  },

  // ===== AUTH =====
  toggleAuth(mode) {
    const loginForm = document.getElementById('auth-login');
    const signupForm = document.getElementById('auth-signup');
    if (mode === 'login') {
      loginForm.style.display = 'block';
      signupForm.style.display = 'none';
    } else {
      loginForm.style.display = 'none';
      signupForm.style.display = 'block';
    }
  },

  handleLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
      Utils.toast('Missing Fields', 'Please fill in all fields to continue.', 'warning');
      return;
    }

    // Simulate login
    this.currentUser = Utils.store.get('user') || {
      name: email.split('@')[0],
      email: email,
      avatar: '😎',
      vibe: 'hype',
      joinedAt: Date.now(),
    };
    Utils.store.set('user', this.currentUser);
    Utils.toast('Welcome Back!', `Good to see you, ${this.currentUser.name}!`, 'success');
    this.showPage('dashboard-page');
  },

  handleSignup() {
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    if (!name || !email || !password) {
      Utils.toast('Missing Fields', 'Please fill in all fields to create your account.', 'warning');
      return;
    }

    if (password.length < 8) {
      Utils.toast('Weak Password', 'Password must be at least 8 characters long.', 'error');
      return;
    }

    this.currentUser = {
      name: name,
      email: email,
      avatar: '😎',
      vibe: null,
      joinedAt: Date.now(),
    };
    Utils.store.set('user', this.currentUser);
    Utils.toast('Account Created!', 'Welcome to VIBESYNC! Let\'s set up your vibe.', 'success');
    this.showPage('onboarding-page');
  },

  // ===== ONBOARDING =====
  nextOnboardStep(step) {
    // Validate current step
    if (step === 2 && this.currentOnboardStep === 1) {
      const nickname = document.getElementById('onboard-nickname').value;
      if (nickname) {
        this.currentUser.name = nickname;
        Utils.store.set('user', this.currentUser);
      }
    }

    if (step === 3 && !this.selectedVibe) {
      Utils.toast('Choose Your Vibe', 'Pick a vibe personality to continue!', 'warning');
      return;
    }

    this.currentOnboardStep = step;

    // Update indicators
    for (let i = 1; i <= 3; i++) {
      const indicator = document.getElementById(`step-${i}-indicator`);
      indicator.classList.remove('active', 'completed');
      if (i < step) indicator.classList.add('completed');
      if (i === step) indicator.classList.add('active');
    }

    // Show step
    document.querySelectorAll('.onboarding-step').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(`onboard-step-${step}`);
    if (target) target.classList.add('active');
  },

  cycleAvatar() {
    this.avatarIndex = (this.avatarIndex + 1) % this.avatarOptions.length;
    const avatar = this.avatarOptions[this.avatarIndex];
    document.getElementById('onboard-avatar').textContent = avatar;
    if (this.currentUser) {
      this.currentUser.avatar = avatar;
      Utils.store.set('user', this.currentUser);
    }
  },

  selectVibe(el, vibe) {
    document.querySelectorAll('.vibe-personality-option').forEach(o => o.classList.remove('selected'));
    el.classList.add('selected');
    this.selectedVibe = vibe;
    if (this.currentUser) {
      this.currentUser.vibe = vibe;
      Utils.store.set('user', this.currentUser);
    }
  },

  onboardCreateGroup() {
    this.skipOnboarding();
    setTimeout(() => this.openCreateSession(), 500);
  },

  onboardJoinGroup() {
    this.skipOnboarding();
    Utils.toast('Join Group', 'Enter an invite code to join! (Demo mode: auto-joined)', 'info');
  },

  skipOnboarding() {
    if (this.currentUser) {
      Utils.store.set('user', this.currentUser);
    }
    Utils.confetti();
    this.showPage('dashboard-page');
  },

  // ===== DASHBOARD =====
  updateDashboard() {
    if (!this.currentUser) return;

    // Update greeting
    const greetEl = document.getElementById('greeting-text');
    const greetSub = document.getElementById('greeting-sub');
    if (greetEl) greetEl.textContent = Utils.getGreeting(this.currentUser.name);
    if (greetSub) greetSub.textContent = 'Your vibes are looking strong today.';

    // Update sidebar
    const sidebarAvatar = document.getElementById('sidebar-avatar');
    const sidebarName = document.getElementById('sidebar-username');
    if (sidebarAvatar) sidebarAvatar.textContent = this.currentUser.avatar;
    if (sidebarName) sidebarName.textContent = this.currentUser.name;

    // ROBO greeting
    this.updateRoboGreeting();

    // Populate sessions
    this.populateSessions();

    // Populate leaderboard
    this.populateLeaderboard();

    // Populate memory palace
    this.populateMemoryPalace();

    // Populate settings
    this.populateSettings();

    // Populate director & confessional
    this.populateDirector();
    this.populateConfessional();
  },

  updateRoboGreeting() {
    const bubble = document.getElementById('robo-message');
    if (bubble) {
      const msg = Utils.randItem(ROBO_GREETINGS).replace('@USER', this.currentUser?.name || 'friend');
      Utils.typewriter(bubble, msg);
    }
  },

  talkToRobo() {
    Robo.interact();
  },

  populateSessions() {
    const grid = document.getElementById('sessions-grid');
    const allGrid = document.getElementById('all-sessions-grid');
    if (!grid) return;

    const sessions = [
      { emoji: '🔥', name: 'The Chaos Crew', desc: 'Friday night vibes — anything goes', members: 5, vibe: 'High Energy', status: 'live', score: 82 },
      { emoji: '🧠', name: 'Deep Thoughts Club', desc: 'Philosophy and late-night debates', members: 4, vibe: 'Chill', status: 'live', score: 65 },
      { emoji: '🎮', name: 'Game Night Squad', desc: 'Weekly gaming sessions with the boys', members: 6, vibe: 'Competitive', status: 'live', score: 91 },
      { emoji: '🎭', name: 'The Comedy Den', desc: 'Stand-up practice and roast sessions', members: 3, vibe: 'Hilarious', status: 'idle', score: 45 },
      { emoji: '🌙', name: 'Midnight Ranters', desc: '2 AM conversations about everything', members: 7, vibe: 'Chaotic', status: 'idle', score: 73 },
    ];

    const renderSession = (s) => `
      <div class="card session-card" onclick="App.joinSession('${s.name}', ${s.members})">
        <div class="session-card-header">
          <span class="session-card-emoji">${s.emoji}</span>
          <div class="session-card-status">
            ${s.status === 'live' ? '<span class="dot"></span><span style="color: var(--green)">LIVE</span>' : '<span style="color: var(--text-muted)">IDLE</span>'}
          </div>
        </div>
        <div class="session-card-body">
          <div class="session-card-name">${s.name}</div>
          <div class="session-card-desc">${s.desc}</div>
          <div class="session-card-meta">
            <div class="session-card-members">
              ${Array.from({length: Math.min(s.members, 3)}, (_, i) => 
                `<div class="avatar" style="background: ${['var(--gradient-purple)', 'var(--gradient-cyan)', 'linear-gradient(135deg, var(--pink), var(--amber))'][i]}">${DEMO_USERS[i]?.avatar || '👤'}</div>`
              ).join('')}
              ${s.members > 3 ? `<div class="avatar" style="background: var(--bg-surface-hover); font-size: 9px;">+${s.members - 3}</div>` : ''}
            </div>
            <span>👥 ${s.members} members</span>
          </div>
        </div>
        <div class="session-card-footer">
          <div class="vibe-pulse-bar">
            <div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div>
          </div>
          <span class="badge ${s.score > 70 ? 'badge-green' : s.score > 40 ? 'badge-amber' : 'badge-red'}">${s.vibe}</span>
        </div>
      </div>
    `;

    grid.innerHTML = sessions.slice(0, 3).map(renderSession).join('');
    if (allGrid) allGrid.innerHTML = sessions.map(renderSession).join('');
  },

  populateLeaderboard() {
    const container = document.getElementById('leaderboard-content');
    if (!container) return;

    const groups = [
      { rank: 1, name: 'THE CHAOTIC SCHOLARS', score: 9840, status: '🔥 On Fire', pct: 100 },
      { rank: 2, name: 'MIDNIGHT RANTERS', score: 8200, status: '⚡ Rising', pct: 83 },
      { rank: 3, name: 'THE DEBATE LORDS', score: 7100, status: '📈 Climbing', pct: 72 },
      { rank: 4, name: 'GAMING LEGENDS', score: 5900, status: '🎮 Active', pct: 60 },
      { rank: 5, name: 'YOUR GROUP', score: 4300, status: '😴 Needs energy', pct: 44, highlight: true },
      { rank: 6, name: 'CHILL VIBERS', score: 3800, status: '🧊 Steady', pct: 39 },
      { rank: 7, name: 'THE ROAST KINGS', score: 3200, status: '📉 Cooling', pct: 33 },
    ];

    container.innerHTML = `
      <div class="leaderboard-podium">
        <div class="podium-item">
          <div class="rank">🥈</div>
          <div class="name">${groups[1].name}</div>
          <div class="score">${groups[1].score.toLocaleString()} pts</div>
          <div class="podium-bar"></div>
        </div>
        <div class="podium-item">
          <div class="rank">🥇</div>
          <div class="name">${groups[0].name}</div>
          <div class="score">${groups[0].score.toLocaleString()} pts</div>
          <div class="podium-bar"></div>
        </div>
        <div class="podium-item">
          <div class="rank">🥉</div>
          <div class="name">${groups[2].name}</div>
          <div class="score">${groups[2].score.toLocaleString()} pts</div>
          <div class="podium-bar"></div>
        </div>
      </div>
      <div style="margin-bottom: 16px;">
        <h3 style="font-size: var(--text-lg); margin-bottom: 4px;">Season 3 Rankings</h3>
        <p style="font-size: var(--text-sm); color: var(--text-muted);">Resets in 18 days</p>
      </div>
      <div class="leaderboard-list">
        ${groups.map(g => `
          <div class="leaderboard-row ${g.highlight ? 'highlight' : ''}">
            <div class="leaderboard-rank">${g.rank}</div>
            <div class="avatar avatar-sm" style="background: ${['var(--gradient-primary)', 'linear-gradient(135deg, var(--cyan), var(--purple))', 'linear-gradient(135deg, var(--pink), var(--amber))', 'var(--gradient-cyan)', 'var(--gradient-purple)', 'linear-gradient(135deg, var(--cyan-light), var(--green))', 'linear-gradient(135deg, var(--red), var(--amber))'][g.rank-1]}">${['🏆','⚡','🧠','🎮','👤','🧊','👑'][g.rank-1]}</div>
            <div class="leaderboard-group-info">
              <div class="leaderboard-group-name">${g.name}</div>
              <div class="leaderboard-group-status">${g.status}</div>
            </div>
            <div class="leaderboard-score-bar">
              <div class="leaderboard-score-track">
                <div class="leaderboard-score-fill" style="width: ${g.pct}%"></div>
              </div>
              <div class="leaderboard-score-value">${g.score.toLocaleString()} pts</div>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="card" style="margin-top: 24px; padding: 20px; text-align: center;">
        <h3 style="margin-bottom: 8px;">How Points Are Earned</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-top: 16px; text-align: left;">
          <div style="font-size: var(--text-sm);"><span style="color: var(--amber);">🎯 +150</span> Completing dares</div>
          <div style="font-size: var(--text-sm);"><span style="color: var(--green);">⚡ +500</span> Zero drop-offs in session</div>
          <div style="font-size: var(--text-sm);"><span style="color: var(--pink);">🔥 +300</span> High vibe for 30+ min</div>
          <div style="font-size: var(--text-sm);"><span style="color: var(--cyan);">🎲 +100</span> Playing Chaos Cards</div>
          <div style="font-size: var(--text-sm);"><span style="color: var(--purple);">🤝 +200</span> New member stays past session 1</div>
          <div style="font-size: var(--text-sm);"><span style="color: var(--amber);">🎮 +150</span> Winning mini-games</div>
        </div>
      </div>
    `;
  },

  populateMemoryPalace() {
    const container = document.getElementById('memory-timeline');
    if (!container) return;

    container.innerHTML = MEMORY_ENTRIES.map(m => `
      <div class="memory-item">
        <div class="memory-card card">
          <div class="memory-date">${m.date}</div>
          <div class="memory-title">${m.emoji} ${m.title}</div>
          <div class="memory-desc">${m.desc}</div>
        </div>
      </div>
    `).join('');
  },

  populateDirector() {
    const container = document.getElementById('director-content');
    if (!container) return;

    container.innerHTML = `
      <div class="card" style="padding: 32px; text-align: center; margin-bottom: 24px;">
        <div style="font-size: 64px; margin-bottom: 16px;">🎬</div>
        <h2 style="margin-bottom: 8px;">This Week's Director</h2>
        <div class="avatar avatar-xl" style="margin: 16px auto;">${DEMO_USERS[2].avatar}</div>
        <h3 style="margin-bottom: 4px;">${DEMO_USERS[2].name}</h3>
        <span class="badge badge-purple">The Chaos Agent</span>
        <p style="color: var(--text-secondary); margin-top: 16px; font-size: var(--text-sm); max-width: 400px; margin-left: auto; margin-right: auto;">
          As Director, ${DEMO_USERS[2].name} controls the session format, picks who gets dared,
          and sets the vibe. AI assists with suggestions.
        </p>
      </div>
      <h3 style="margin-bottom: 16px;">Director Powers</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
        <div class="card" style="text-align: center; padding: 24px;">
          <div style="font-size: 32px; margin-bottom: 8px;">🎮</div>
          <h4 style="font-size: var(--text-sm);">Choose the Game</h4>
          <p style="font-size: var(--text-xs); color: var(--text-muted);">Pick tonight's mini-game</p>
        </div>
        <div class="card" style="text-align: center; padding: 24px;">
          <div style="font-size: 32px; margin-bottom: 8px;">👻</div>
          <h4 style="font-size: var(--text-sm);">Target the Ghost Crown</h4>
          <p style="font-size: var(--text-xs); color: var(--text-muted);">Pick who gets dared</p>
        </div>
        <div class="card" style="text-align: center; padding: 24px;">
          <div style="font-size: 32px; margin-bottom: 8px;">🎭</div>
          <h4 style="font-size: var(--text-sm);">Set the Vibe</h4>
          <p style="font-size: var(--text-xs); color: var(--text-muted);">Chill / Chaotic / Competitive</p>
        </div>
        <div class="card" style="text-align: center; padding: 24px;">
          <div style="font-size: 32px; margin-bottom: 8px;">🤖</div>
          <h4 style="font-size: var(--text-sm);">AI Assist Mode</h4>
          <p style="font-size: var(--text-xs); color: var(--text-muted);">ROBO suggests ideas</p>
        </div>
      </div>
      <div class="card" style="margin-top: 24px; padding: 20px;">
        <h4 style="margin-bottom: 8px;">⏳ Next Director Rotation</h4>
        <p style="font-size: var(--text-sm); color: var(--text-secondary);">Rotates every session. Next up: <strong>${DEMO_USERS[3].name} ${DEMO_USERS[3].avatar}</strong></p>
        <div class="progress-bar" style="margin-top: 8px;">
          <div class="progress-fill" style="width: 65%;"></div>
        </div>
      </div>
    `;
  },

  populateConfessional() {
    const container = document.getElementById('confessional-content');
    if (!container) return;

    container.innerHTML = `
      <div class="card" style="padding: 24px; margin-bottom: 24px; text-align: center;">
        <div style="font-size: 48px; margin-bottom: 12px;">🤫</div>
        <h3 style="margin-bottom: 8px;">Submit a Confession</h3>
        <p style="font-size: var(--text-sm); color: var(--text-secondary); margin-bottom: 16px;">
          Anonymous confessions drop into the chat. Group reacts without knowing who sent it. ROBO reveals the sender only after everyone reacts.
        </p>
        <div class="input-group" style="margin-bottom: 16px;">
          <textarea class="input-field" placeholder="Type your anonymous confession..." style="min-height: 80px; resize: vertical;" id="confession-input"></textarea>
        </div>
        <button class="btn btn-primary" onclick="App.submitConfession()">🎤 Drop the Confession</button>
      </div>
      <h3 style="margin-bottom: 16px;">Recent Confessions</h3>
      <div style="display: flex; flex-direction: column; gap: 16px;">
        ${CONFESSIONS.slice(0, 4).map((c, i) => `
          <div class="confession-card">
            <div style="font-size: 24px; margin-bottom: 8px;">🤫</div>
            <div class="confession-text">"${c}"</div>
            <div class="confession-reactions">
              <button class="btn btn-secondary" style="font-size: var(--text-sm);" onclick="this.textContent='😂 '+( parseInt(this.textContent.split(' ')[1]||5)+1)">😂 ${Utils.randInt(3, 12)}</button>
              <button class="btn btn-secondary" style="font-size: var(--text-sm);" onclick="this.textContent='💀 '+(parseInt(this.textContent.split(' ')[1]||3)+1)">💀 ${Utils.randInt(1, 8)}</button>
              <button class="btn btn-secondary" style="font-size: var(--text-sm);" onclick="this.textContent='👀 '+(parseInt(this.textContent.split(' ')[1]||2)+1)">👀 ${Utils.randInt(2, 6)}</button>
            </div>
            <button class="btn btn-ghost" style="margin-top: 12px; font-size: var(--text-xs);" onclick="this.textContent='It was ${DEMO_USERS[i % DEMO_USERS.length].name} ${DEMO_USERS[i % DEMO_USERS.length].avatar}! 💀'; this.style.color='var(--pink-light)'">
              🔍 Reveal Sender
            </button>
          </div>
        `).join('')}
      </div>
    `;
  },

  submitConfession() {
    const input = document.getElementById('confession-input');
    if (!input || !input.value.trim()) {
      Utils.toast('Empty Confession', 'Type something to confess!', 'warning');
      return;
    }
    Utils.toast('Confession Dropped! 🤫', 'Your secret is out there. Anonymously.', 'success');
    input.value = '';
  },

  populateSettings() {
    const container = document.getElementById('settings-content');
    if (!container) return;

    container.innerHTML = `
      <div class="settings-sidebar">
        <div class="settings-sidebar-item active">⚙️ General</div>
        <div class="settings-sidebar-item">🔔 Notifications</div>
        <div class="settings-sidebar-item">🎨 Appearance</div>
        <div class="settings-sidebar-item">🔒 Privacy</div>
        <div class="settings-sidebar-item">🤖 ROBO Settings</div>
      </div>
      <div class="settings-main">
        <div class="settings-section">
          <h2 class="settings-section-title">Profile</h2>
          <p class="settings-section-desc">Manage your display information.</p>
          <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 24px;">
            <div class="avatar avatar-xl" style="cursor: pointer;" onclick="App.cycleAvatar(); this.textContent=App.avatarOptions[App.avatarIndex]">${this.currentUser?.avatar || '😎'}</div>
            <div>
              <div class="input-group">
                <label class="input-label">Display Name</label>
                <input type="text" class="input-field" value="${this.currentUser?.name || ''}" style="width: 250px;">
              </div>
            </div>
          </div>
          <div class="input-group" style="margin-bottom: 16px;">
            <label class="input-label">Email</label>
            <input type="email" class="input-field" value="${this.currentUser?.email || ''}" disabled style="opacity: 0.6;">
          </div>
          <div class="input-group" style="margin-bottom: 24px;">
            <label class="input-label">Vibe Personality</label>
            <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 4px;">
              <div class="chip ${this.currentUser?.vibe === 'hype' ? 'selected' : ''}">🔥 Hype Machine</div>
              <div class="chip ${this.currentUser?.vibe === 'chill' ? 'selected' : ''}">🧊 Chill One</div>
              <div class="chip ${this.currentUser?.vibe === 'chaos' ? 'selected' : ''}">🎲 Chaos Agent</div>
              <div class="chip ${this.currentUser?.vibe === 'brain' ? 'selected' : ''}">🧠 Big Brain</div>
            </div>
          </div>
          <button class="btn btn-primary">Save Changes</button>
        </div>
        <div class="divider"></div>
        <div class="settings-section">
          <h2 class="settings-section-title">Preferences</h2>
          <p class="settings-section-desc">Control how VIBESYNC works for you.</p>
          <div class="settings-row">
            <div class="settings-row-info">
              <h4>Ghost Crown Notifications</h4>
              <p>Get notified when you're about to be crowned</p>
            </div>
            <div class="toggle active" onclick="this.classList.toggle('active')"></div>
          </div>
          <div class="settings-row">
            <div class="settings-row-info">
              <h4>ROBO Interactions</h4>
              <p>Allow ROBO to interrupt with dares and games</p>
            </div>
            <div class="toggle active" onclick="this.classList.toggle('active')"></div>
          </div>
          <div class="settings-row">
            <div class="settings-row-info">
              <h4>Sound Effects</h4>
              <p>Play sounds for alerts, games, and ROBO</p>
            </div>
            <div class="toggle" onclick="this.classList.toggle('active')"></div>
          </div>
          <div class="settings-row">
            <div class="settings-row-info">
              <h4>Boredom Engine</h4>
              <p>Enable AI-powered boredom detection</p>
            </div>
            <div class="toggle active" onclick="this.classList.toggle('active')"></div>
          </div>
          <div class="settings-row">
            <div class="settings-row-info">
              <h4>Prophecy System</h4>
              <p>Show ROBO's predictions at session start</p>
            </div>
            <div class="toggle active" onclick="this.classList.toggle('active')"></div>
          </div>
        </div>
        <div class="divider"></div>
        <div class="settings-section">
          <h2 class="settings-section-title" style="color: var(--red-light);">Danger Zone</h2>
          <div class="settings-row">
            <div class="settings-row-info">
              <h4>Log Out</h4>
              <p>Log out of your account on this device</p>
            </div>
            <button class="btn btn-secondary" onclick="App.logout()">Log Out</button>
          </div>
          <div class="settings-row">
            <div class="settings-row-info">
              <h4>Delete Account</h4>
              <p>Permanently delete your account and all data</p>
            </div>
            <button class="btn btn-danger">Delete Account</button>
          </div>
        </div>
      </div>
    `;
  },

  logout() {
    Utils.store.remove('user');
    this.currentUser = null;
    Utils.toast('Logged Out', 'See you next time! 👋', 'info');
    this.showPage('landing-page');
  },

  // ===== DASHBOARD TABS =====
  switchDashboardTab(tab) {
    // Update sidebar
    document.querySelectorAll('.sidebar-item').forEach(item => {
      item.classList.toggle('active', item.dataset.tab === tab);
    });

    // Show/hide tabs
    document.querySelectorAll('.dashboard-tab').forEach(t => t.style.display = 'none');
    const target = document.getElementById(`tab-${tab}`);
    if (target) {
      target.style.display = 'block';
      target.classList.add('active');
    }
  },

  switchLeaderboardPeriod(period) {
    document.querySelectorAll('.tabs .tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    // In a real app, this would fetch different data
    Utils.toast('Period Changed', `Showing ${period} rankings`, 'info');
  },

  // ===== SESSION MANAGEMENT =====
  openCreateSession() {
    document.getElementById('create-session-overlay').classList.add('active');
  },

  closeCreateSession() {
    document.getElementById('create-session-overlay').classList.remove('active');
  },

  selectSessionVibe(el) {
    el.parentElement.querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
  },

  createSession() {
    const name = document.getElementById('session-name-input').value || 'Untitled Session';
    this.closeCreateSession();
    Utils.toast('Session Created! 🚀', `"${name}" is live. Share the link to invite friends!`, 'success');
    Utils.confetti();
    setTimeout(() => this.joinSession(name, 1), 800);
  },

  joinSession(name, members) {
    Session.init(name, members);
    this.showPage('session-page');
  },

  leaveSession() {
    Session.cleanup();
    this.showPage('dashboard-page');
    Utils.toast('Left Session', 'You\'ve left the session. Come back anytime!', 'info');
  },

  // ===== SESSION PANEL =====
  toggleSessionPanel() {
    const panel = document.getElementById('session-panel');
    panel.classList.toggle('open');
  },

  switchPanelTab(tab) {
    const tabEls = document.querySelectorAll('.session-panel .tab');
    tabEls.forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
  },

  // ===== SIDEBAR =====
  toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open');
  },

  // ===== PROPHECY =====
  showProphecy() {
    const list = document.getElementById('prophecy-list');
    const prophecies = Utils.shuffle(PROPHECIES).slice(0, 4);
    list.innerHTML = prophecies.map(p => `
      <div class="prophecy-item">
        <span class="prophecy-icon">${p.icon}</span>
        <span>${p.text.replace('@USER', Utils.randItem(DEMO_USERS).name)}</span>
      </div>
    `).join('');
    document.getElementById('prophecy-overlay').classList.add('active');
  },

  closeProphecy() {
    document.getElementById('prophecy-overlay').classList.remove('active');
  },
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => App.init());
