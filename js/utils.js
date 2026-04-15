/* ============================================
   VIBESYNC — Utility Functions
   ============================================ */

const Utils = {
  // Generate a random ID
  id: () => Math.random().toString(36).substr(2, 9),

  // Random integer between min and max (inclusive)
  randInt: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,

  // Random item from array
  randItem: (arr) => arr[Math.floor(Math.random() * arr.length)],

  // Shuffle array
  shuffle: (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },

  // Format time elapsed
  timeAgo: (date) => {
    const seconds = Math.floor((Date.now() - date) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  },

  // Format time as HH:MM
  formatTime: (date) => {
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  },

  // Delay helper
  delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

  // Animate element with a class then remove
  animateOnce: (el, className, duration = 500) => {
    el.classList.add(className);
    setTimeout(() => el.classList.remove(className), duration);
  },

  // Store/retrieve from localStorage
  store: {
    get: (key, fallback = null) => {
      try {
        const val = localStorage.getItem(`vibesync_${key}`);
        return val ? JSON.parse(val) : fallback;
      } catch { return fallback; }
    },
    set: (key, value) => {
      try {
        localStorage.setItem(`vibesync_${key}`, JSON.stringify(value));
      } catch (e) { console.warn('Storage full:', e); }
    },
    remove: (key) => localStorage.removeItem(`vibesync_${key}`),
  },

  // Create particles
  createParticles: () => {
    const container = document.getElementById('particles');
    if (!container) return;
    const colors = ['#a855f7', '#06b6d4', '#ec4899', '#f59e0b'];
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = `${Math.random() * 100}%`;
      p.style.background = Utils.randItem(colors);
      p.style.animationDuration = `${Utils.randInt(8, 20)}s`;
      p.style.animationDelay = `${Math.random() * 10}s`;
      p.style.width = `${Utils.randInt(2, 5)}px`;
      p.style.height = p.style.width;
      container.appendChild(p);
    }
  },

  // Show toast notification
  toast: (title, message, type = 'info') => {
    const container = document.getElementById('toast-container');
    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${icons[type]}</span>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
    `;
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  },

  // Typewriter effect
  typewriter: async (element, text, speed = 30) => {
    element.textContent = '';
    for (let i = 0; i < text.length; i++) {
      element.textContent += text[i];
      await Utils.delay(speed);
    }
  },

  // Get greeting based on time of day
  getGreeting: (name) => {
    const hour = new Date().getHours();
    if (hour < 12) return `Good morning, ${name}! ☀️`;
    if (hour < 17) return `Good afternoon, ${name}! 🌤️`;
    if (hour < 21) return `Good evening, ${name}! 🌅`;
    return `Night owl mode, ${name}! 🌙`;
  },

  // Confetti burst effect
  confetti: (container) => {
    const colors = ['#a855f7', '#06b6d4', '#ec4899', '#f59e0b', '#10b981'];
    for (let i = 0; i < 30; i++) {
      const piece = document.createElement('div');
      piece.style.cssText = `
        position: fixed;
        width: 8px;
        height: 8px;
        background: ${Utils.randItem(colors)};
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        left: ${50 + (Math.random() - 0.5) * 40}%;
        top: 50%;
        z-index: 9999;
        pointer-events: none;
        animation: confetti ${Utils.randInt(8, 15) / 10}s ease-out forwards;
        transform: rotate(${Math.random() * 360}deg);
      `;
      document.body.appendChild(piece);
      setTimeout(() => piece.remove(), 2000);
    }
  },
};

// Simulated user names for the demo
const DEMO_USERS = [
  { name: 'Hari', avatar: '😎', vibe: 'hype' },
  { name: 'Priya', avatar: '🦋', vibe: 'chill' },
  { name: 'Alex', avatar: '🔥', vibe: 'chaos' },
  { name: 'Maya', avatar: '✨', vibe: 'brain' },
  { name: 'Dev', avatar: '🎮', vibe: 'hype' },
];

const GHOST_TITLES = [
  '🫥 The Invisible Ninja',
  '💤 Lord of the AFK Realm',
  '👻 The Silent Cryptid',
  '🧊 The Frozen One',
  '🕳️ The Void Walker',
  '🌫️ The Fog Entity',
  '🦇 The Shadow Lurker',
  '🎭 The Phantom Presence',
];

const AI_DARES = [
  'Send a voice note doing a movie villain laugh',
  'Type your last message but in medieval English',
  'Describe your day using only emojis — at least 10',
  'Roast the person above you in the chat (lovingly)',
  'Narrate what you\'re doing right now like a nature documentary',
  'Send a dramatic monologue about pizza in 30 seconds',
  'Type a haiku about someone in the group',
  'Act like a customer service bot for the next 3 messages',
  'Explain a movie plot using only food metaphors',
  'Send the most random Wikipedia fact you can find in 20 seconds',
];

const CHAOS_CARDS = [
  { emoji: '🎭', title: 'ACCENT MODE', detail: 'Everyone must type in a pirate accent for 5 minutes' },
  { emoji: '🔄', title: 'REVERSE CHAT', detail: 'Type all your messages backwards for 3 minutes' },
  { emoji: '📸', title: 'SCREENSHOT ROULETTE', detail: 'Everyone shares their current screen — no prep time' },
  { emoji: '🎤', title: 'RAP BATTLE', detail: 'Next two messages from everyone must rhyme' },
  { emoji: '🤫', title: 'WHISPER MODE', detail: 'Everyone types in (all lowercase whisper) for 5 minutes' },
  { emoji: '💣', title: 'HOT TAKE BOMB', detail: 'Everyone shares their most controversial food opinion NOW' },
  { emoji: '🎬', title: 'MOVIE SCENE', detail: 'Group must reenact a random movie scene in chat' },
  { emoji: '🃏', title: 'IDENTITY SWAP', detail: 'Everyone pretends to be the person to their right in the list' },
];

const ROBO_GREETINGS = [
  "Hey there! Ready for some fun today? Click me for a surprise! 🎉",
  "The vibes are immaculate right now. Let's keep it going! ⚡",
  "I've been analyzing your group energy... it's looking POWERFUL today! 🔥",
  "Fun fact: your group has been 23% more chaotic this week. I love it! 🎲",
  "Someone's been quiet lately... should I activate Ghost Crown? 👻",
  "I've prepared 3 new games for tonight. You're going to love 'em! 🎮",
  "Your crew's vibe score is climbing! Keep this energy! 📈",
  "Quick dare: say something nice about the last person who messaged! ❤️",
];

const PROPHECIES = [
  { icon: '🔮', text: '@USER will go quiet after 20 minutes' },
  { icon: '⚡', text: 'Someone will start an argument about food' },
  { icon: '🎯', text: '"okay but hear me out" will be said at least 4 times' },
  { icon: '💀', text: 'The group will collectively roast one person' },
  { icon: '🎲', text: 'A chaos card will be played in the first 15 minutes' },
  { icon: '😴', text: 'At least 2 people will go AFK at the same time' },
  { icon: '🔥', text: 'Someone will send a message longer than 3 paragraphs' },
  { icon: '🤣', text: 'ROBO will be called annoying at least once' },
  { icon: '👑', text: 'The Ghost Crown will land on the same person twice' },
  { icon: '🎮', text: 'The emergency game will be triggered before 30 minutes' },
];

const CONFESSIONS = [
  "Someone in this group thinks pineapple belongs on pizza 🍕",
  "Someone here secretly googled 'how to be funny in group chats' 😬",
  "One person has a screenshot of an embarrassing message from this group 📸",
  "Someone here practices their comebacks in the mirror 🪞",
  "One of you has pretended to be busy to avoid joining a session 💀",
  "Someone thinks ROBO is actually funnier than the rest of the group 🤖",
  "One person has retyped a message 5+ times before sending it ✍️",
  "Someone here has a secret talent they've never shared with the group 🎭",
];

const GAME_QUESTIONS = {
  lightning: [
    { q: 'What is the capital of Australia?', options: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'], correct: 2 },
    { q: 'Who painted the Mona Lisa?', options: ['Picasso', 'Da Vinci', 'Van Gogh', 'Monet'], correct: 1 },
    { q: 'How many hearts does an octopus have?', options: ['1', '2', '3', '4'], correct: 2 },
    { q: 'What year was the first iPhone released?', options: ['2005', '2006', '2007', '2008'], correct: 2 },
    { q: 'Which planet has the most moons?', options: ['Jupiter', 'Saturn', 'Uranus', 'Neptune'], correct: 1 },
    { q: 'What is the hardest natural substance?', options: ['Gold', 'Iron', 'Diamond', 'Titanium'], correct: 2 },
  ],
  thisOrThat: [
    { a: 'Time travel to the past', b: 'Time travel to the future' },
    { a: 'Always be 10 min late', b: 'Always be 20 min early' },
    { a: 'No internet for a week', b: 'No phone for a week' },
    { a: 'Unlimited money', b: 'Unlimited knowledge' },
    { a: 'Live in space', b: 'Live underwater' },
    { a: 'Be invisible', b: 'Be able to fly' },
  ],
  plotTwist: [
    'A penguin walks into a coffee shop and orders...',
    'The last person on Earth receives a text message that says...',
    'You wake up and realize everyone speaks in reverse, so you...',
    'A pigeon delivers a letter to you from the year 3025 saying...',
    'Your refrigerator starts talking and its first words are...',
  ],
  hotSeat: [
    "What's the most embarrassing song on your playlist?",
    "What's a lie you've told that you've never come clean about?",
    "If you had to delete one app from your phone forever, which?",
    "What's the weirdest thing you've ever googled?",
    "What movie do you secretly love that you'd never admit?",
    "What's the longest you've gone without showering?",
    "If you could swap lives with someone in this group, who?",
  ],
};

const MEMORY_ENTRIES = [
  { date: 'Today, 2:30 PM', emoji: '👻', title: 'Ghost Crown Moment', desc: 'Hari was crowned "The Invisible Ninja" and had to do a villain laugh. The group lost it.' },
  { date: 'Today, 1:15 PM', emoji: '🎲', title: 'Chaos Card Played', desc: 'Alex played ACCENT MODE — everyone spoke like pirates for 5 minutes. Total chaos.' },
  { date: 'Yesterday', emoji: '⚖️', title: 'Judge ROBO Verdict', desc: '"GUILTY of mediocrity" — ROBO\'s verdict on Dev\'s attempt to explain Avengers in animal sounds.' },
  { date: '2 days ago', emoji: '🚨', title: 'Emergency Game Protocol', desc: 'Lightning Round triggered after 7 min of dead chat. Priya won with 5 correct answers.' },
  { date: '3 days ago', emoji: '🔮', title: 'Prophecy Came True', desc: 'ROBO predicted Maya would start a food argument. She did. About cucumbers.' },
  { date: 'Last week', emoji: '🏆', title: 'Season 2 Champions', desc: 'THE CHAOTIC SCHOLARS won with 12,400 points. Legendary season.' },
];
