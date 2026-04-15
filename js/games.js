/* ============================================
   VIBESYNC — Mini-Games Engine
   ============================================ */

const Games = {
  currentGame: null,
  timer: null,
  timerValue: 60,
  score: 0,
  questionIndex: 0,
  questions: [],
  isActive: false,

  // ===== LAUNCH GAME =====
  launch(type) {
    this.isActive = true;
    this.score = 0;
    this.questionIndex = 0;

    const gameConfigs = {
      lightning: {
        emoji: '⚡',
        title: 'Lightning Round',
        subtitle: '60 seconds. Rapid fire. First to answer wins!',
        time: 60,
      },
      thisOrThat: {
        emoji: '🗳️',
        title: 'This or That War',
        subtitle: 'Pick a side. The minority gets roasted.',
        time: 45,
      },
      hotSeat: {
        emoji: '🎯',
        title: 'Hot Seat Roulette',
        subtitle: 'One person. Three rapid questions. No mercy.',
        time: 30,
      },
      plotTwist: {
        emoji: '🎭',
        title: 'Plot Twist',
        subtitle: 'Continue the story in one sentence. Most creative wins!',
        time: 90,
      },
      whoSaidIt: {
        emoji: '🔍',
        title: 'Who Said It?',
        subtitle: 'Guess who sent this old message!',
        time: 30,
      },
      liarThrone: {
        emoji: '🤥',
        title: "Liar's Throne",
        subtitle: 'One person lies. Group asks 3 questions. Vote truth or lie!',
        time: 60,
      },
      emojiCourt: {
        emoji: '😀',
        title: 'Emoji Court',
        subtitle: 'State your opinion using ONLY emojis. Group interprets!',
        time: 45,
      },
      speedRoast: {
        emoji: '🔥',
        title: 'Speed Roast',
        subtitle: '30 seconds to roast the person to your left. ROBO judges!',
        time: 30,
      },
    };

    const config = gameConfigs[type] || gameConfigs.lightning;
    this.currentGame = type;
    this.timerValue = config.time;

    // Update UI
    document.getElementById('game-emoji').textContent = config.emoji;
    document.getElementById('game-title').textContent = config.title;
    document.getElementById('game-subtitle').textContent = config.subtitle;
    document.getElementById('game-timer-value').textContent = config.time;

    // Setup game content
    this.setupGameContent(type);

    // Show overlay
    document.getElementById('game-overlay').classList.add('active');

    // Start timer
    this.startTimer();

    // Update scores display
    this.updateScores();

    Session.addSystemMessage(`🎮 ${config.title} has been launched!`);
  },

  // ===== GAME CONTENT SETUP =====
  setupGameContent(type) {
    const questionEl = document.getElementById('game-question');
    const optionsEl = document.getElementById('game-options');

    switch (type) {
      case 'lightning':
        this.questions = Utils.shuffle(GAME_QUESTIONS.lightning);
        this.showLightningQuestion();
        break;

      case 'thisOrThat':
        this.questions = Utils.shuffle(GAME_QUESTIONS.thisOrThat);
        this.showThisOrThat();
        break;

      case 'hotSeat':
        const target = Utils.randItem(Session.members.filter(m => !m.isUser));
        const targetName = target?.name || 'Mystery Person';
        questionEl.innerHTML = `🎯 <strong>${targetName}</strong> is in the HOT SEAT!`;
        this.questions = Utils.shuffle(GAME_QUESTIONS.hotSeat);
        this.showHotSeatQuestion();
        break;

      case 'plotTwist':
        const story = Utils.randItem(GAME_QUESTIONS.plotTwist);
        questionEl.innerHTML = `📖 Continue this story:<br><br><em>"${story}"</em>`;
        optionsEl.innerHTML = `
          <div style="grid-column: 1/-1;">
            <input type="text" class="input-field" id="game-story-input" 
              placeholder="Type your continuation..." 
              style="width: 100%; margin-bottom: 12px;"
              onkeydown="if(event.key==='Enter')Games.submitStory()">
            <button class="btn btn-primary" style="width: 100%;" onclick="Games.submitStory()">
              Submit My Twist! 🎭
            </button>
          </div>
        `;
        break;

      case 'liarThrone':
        questionEl.innerHTML = `👑 <strong>${Utils.randItem(Session.members.filter(m => !m.isUser))?.name || 'Someone'}</strong> is on the Liar's Throne!<br><br>They just made a claim. Is it truth or lie?`;
        const claims = [
          "I once met a celebrity in an elevator",
          "I can solve a Rubik's cube in under 2 minutes",
          "I've been to more than 10 countries",
          "I once ate a whole pizza by myself in one sitting",
          "I've stayed awake for 48 hours straight",
        ];
        questionEl.innerHTML += `<br><br><em>"${Utils.randItem(claims)}"</em>`;
        optionsEl.innerHTML = `
          <div class="game-option" onclick="Games.voteLiar(true, this)">
            ✅ TRUTH<br><span style="font-size: var(--text-xs); color: var(--text-muted);">They're telling the truth</span>
          </div>
          <div class="game-option" onclick="Games.voteLiar(false, this)">
            🤥 LIE<br><span style="font-size: var(--text-xs); color: var(--text-muted);">They're definitely lying</span>
          </div>
        `;
        break;

      case 'emojiCourt':
        const topics = [
          "Your opinion on Mondays",
          "How you feel about morning people",
          "Your relationship with your phone",
          "Describe your cooking skills",
          "Your reaction to alarm clocks",
        ];
        questionEl.innerHTML = `😀 Express your opinion on:<br><br><strong>"${Utils.randItem(topics)}"</strong><br><br>Using ONLY emojis!`;
        optionsEl.innerHTML = `
          <div style="grid-column: 1/-1;">
            <input type="text" class="input-field" id="game-emoji-input" 
              placeholder="Type emojis only... 😂🔥💀"
              style="width: 100%; font-size: 24px; text-align: center; margin-bottom: 12px;">
            <button class="btn btn-primary" style="width: 100%;" onclick="Games.submitEmoji()">
              Submit to Emoji Court! 😀
            </button>
          </div>
        `;
        break;

      case 'speedRoast':
        const roastTarget = Utils.randItem(Session.members.filter(m => !m.isUser));
        questionEl.innerHTML = `🔥 SPEED ROAST TARGET:<br><br><div style="font-size: 48px; margin: 16px 0;">${roastTarget?.avatar || '😎'}</div><strong>${roastTarget?.name || 'Mystery Person'}</strong><br><br>30 seconds. Make it count. (Keep it loving!)`;
        optionsEl.innerHTML = `
          <div style="grid-column: 1/-1;">
            <input type="text" class="input-field" id="game-roast-input"
              placeholder="Your best roast..." style="width: 100%; margin-bottom: 12px;"
              onkeydown="if(event.key==='Enter')Games.submitRoast()">
            <button class="btn btn-primary" style="width: 100%;" onclick="Games.submitRoast()">
              🔥 Drop the Roast!
            </button>
          </div>
        `;
        break;

      default:
        this.questions = Utils.shuffle(GAME_QUESTIONS.lightning);
        this.showLightningQuestion();
    }
  },

  // ===== LIGHTNING ROUND =====
  showLightningQuestion() {
    if (this.questionIndex >= this.questions.length) {
      this.questionIndex = 0;
      this.questions = Utils.shuffle(this.questions);
    }

    const q = this.questions[this.questionIndex];
    const questionEl = document.getElementById('game-question');
    const optionsEl = document.getElementById('game-options');

    questionEl.textContent = q.q;
    optionsEl.innerHTML = q.options.map((opt, i) => `
      <div class="game-option" onclick="Games.answerLightning(${i}, ${q.correct}, this)">
        ${opt}
      </div>
    `).join('');
  },

  answerLightning(selected, correct, el) {
    const options = document.querySelectorAll('.game-option');
    options.forEach((opt, i) => {
      opt.style.pointerEvents = 'none';
      if (i === correct) opt.classList.add('correct');
      if (i === selected && i !== correct) opt.classList.add('wrong');
    });

    if (selected === correct) {
      this.score += 100;
      Utils.toast('Correct! 🎉', '+100 points!', 'success');
    } else {
      Utils.toast('Wrong! 💀', `The answer was: ${this.questions[this.questionIndex].options[correct]}`, 'error');
    }

    this.questionIndex++;
    this.updateScores();

    // Next question after delay
    setTimeout(() => {
      if (this.isActive && this.timerValue > 0) {
        this.showLightningQuestion();
      }
    }, 1500);
  },

  // ===== THIS OR THAT =====
  showThisOrThat() {
    if (this.questionIndex >= this.questions.length) {
      this.questionIndex = 0;
      this.questions = Utils.shuffle(this.questions);
    }

    const q = this.questions[this.questionIndex];
    const questionEl = document.getElementById('game-question');
    const optionsEl = document.getElementById('game-options');

    questionEl.textContent = 'Which would you choose?';
    optionsEl.innerHTML = `
      <div class="game-option" onclick="Games.chooseThisOrThat('a', this)" style="min-height: 80px; display: flex; align-items: center; justify-content: center;">
        ${q.a}
      </div>
      <div class="game-option" onclick="Games.chooseThisOrThat('b', this)" style="min-height: 80px; display: flex; align-items: center; justify-content: center;">
        ${q.b}
      </div>
    `;
  },

  chooseThisOrThat(choice, el) {
    const options = document.querySelectorAll('.game-option');
    options.forEach(opt => opt.classList.remove('selected'));
    el.classList.add('selected');

    // Simulate group votes
    const votesA = Utils.randInt(1, Session.members.length);
    const votesB = Session.members.length - votesA;
    const userSide = choice === 'a' ? votesA : votesB;
    const otherSide = choice === 'a' ? votesB : votesA;

    setTimeout(() => {
      const questionEl = document.getElementById('game-question');
      questionEl.innerHTML = `Results: <strong>${votesA}</strong> vs <strong>${votesB}</strong><br>
        <span style="font-size: var(--text-sm); color: var(--text-secondary);">
          ${userSide > otherSide ? 'You\'re in the majority! Safe! ✅' : 'You\'re in the MINORITY! Time to defend your choice! 🔥'}
        </span>`;

      this.score += (userSide > otherSide ? 50 : 25);
      this.questionIndex++;
      this.updateScores();

      setTimeout(() => {
        if (this.isActive && this.timerValue > 0 && this.questionIndex < this.questions.length) {
          this.showThisOrThat();
        }
      }, 2500);
    }, 1500);
  },

  // ===== HOT SEAT =====
  showHotSeatQuestion() {
    if (this.questionIndex >= this.questions.length) {
      this.endGame();
      return;
    }

    const q = this.questions[this.questionIndex];
    const optionsEl = document.getElementById('game-options');
    const questionEl = document.getElementById('game-question');

    questionEl.innerHTML += `<br><br><strong>Q${this.questionIndex + 1}:</strong> ${q}`;
    optionsEl.innerHTML = `
      <div style="grid-column: 1/-1;">
        <input type="text" class="input-field" id="game-hotseat-input"
          placeholder="Type your answer..." style="width: 100%; margin-bottom: 12px;"
          onkeydown="if(event.key==='Enter')Games.answerHotSeat()">
        <button class="btn btn-primary" style="width: 100%;" onclick="Games.answerHotSeat()">
          Answer! 🎯
        </button>
      </div>
    `;
  },

  answerHotSeat() {
    const input = document.getElementById('game-hotseat-input');
    if (!input || !input.value.trim()) return;

    const answer = input.value.trim();
    Session.addMemberMessage(
      Utils.randItem(Session.members.filter(m => !m.isUser)),
      `Hot Seat answer: "${answer}" — ${Utils.randItem(['LOL', 'EXPOSED', 'wait really?', 'I KNEW IT', '💀💀💀', 'no way hahaha'])} 😂`
    );

    this.score += 50;
    this.questionIndex++;
    this.updateScores();
    input.value = '';

    if (this.questionIndex < 3) {
      setTimeout(() => this.showHotSeatQuestion(), 1000);
    } else {
      setTimeout(() => this.endGame(), 1500);
    }
  },

  // ===== SUBMIT HANDLERS =====
  submitStory() {
    const input = document.getElementById('game-story-input');
    if (!input || !input.value.trim()) return;
    const text = input.value.trim();

    Session.addUserMessage(`📖 My twist: "${text}"`);
    this.score += 75;
    this.updateScores();

    // Simulate others
    setTimeout(() => {
      Session.addMemberMessage(
        Utils.randItem(Session.members.filter(m => !m.isUser)),
        `📖 "...and then the penguin exploded, but not in a bad way." 😂`
      );
    }, 2000);

    Utils.toast('Story Submitted!', 'ROBO is judging creativity...', 'info');
    setTimeout(() => this.endGame(), 3000);
  },

  submitEmoji() {
    const input = document.getElementById('game-emoji-input');
    if (!input || !input.value.trim()) return;
    Session.addUserMessage(`Emoji Court: ${input.value}`);
    this.score += 50;
    this.updateScores();
    Utils.toast('Submitted!', 'The court is deliberating...', 'info');
    setTimeout(() => this.endGame(), 2000);
  },

  submitRoast() {
    const input = document.getElementById('game-roast-input');
    if (!input || !input.value.trim()) return;
    Session.addUserMessage(`🔥 ${input.value}`);
    this.score += 100;
    this.updateScores();
    Utils.toast('Roast Dropped! 🔥', 'ROBO is scoring the damage...', 'success');
    setTimeout(() => this.endGame(), 2000);
  },

  voteLiar(isTruth, el) {
    const options = document.querySelectorAll('.game-option');
    options.forEach(opt => opt.style.pointerEvents = 'none');
    el.classList.add('selected');

    const wasLie = Math.random() > 0.5;
    const userCorrect = (isTruth && !wasLie) || (!isTruth && wasLie);

    setTimeout(() => {
      const questionEl = document.getElementById('game-question');
      questionEl.innerHTML += `<br><br><strong>${wasLie ? '🤥 IT WAS A LIE!' : '✅ IT WAS TRUE!'}</strong><br>
        <span style="color: ${userCorrect ? 'var(--green)' : 'var(--red)'}">
          ${userCorrect ? 'You got it RIGHT! +100 points! 🎉' : 'You were WRONG! Better luck next time 💀'}
        </span>`;

      if (userCorrect) this.score += 100;
      this.updateScores();
      setTimeout(() => this.endGame(), 2500);
    }, 2000);
  },

  // ===== TIMER =====
  startTimer() {
    this.timer = setInterval(() => {
      this.timerValue--;
      const timerEl = document.getElementById('game-timer-value');
      const timerContainer = document.getElementById('game-timer');
      if (timerEl) timerEl.textContent = this.timerValue;

      if (this.timerValue <= 10 && timerContainer) {
        timerContainer.classList.add('warning');
      }

      if (this.timerValue <= 0) {
        this.endGame();
      }
    }, 1000);
  },

  // ===== SCORES =====
  updateScores() {
    const scoresEl = document.getElementById('game-scores');
    if (!scoresEl) return;

    // Generate opponent scores
    const opponents = Session.members.filter(m => !m.isUser).slice(0, 3);
    scoresEl.innerHTML = `
      <div class="game-score">
        <div class="avatar avatar-sm" style="background: var(--gradient-purple)">${App.currentUser?.avatar || '😎'}</div>
        <span style="font-weight: 700;">${this.score}</span>
      </div>
      ${opponents.map(m => `
        <div class="game-score">
          <div class="avatar avatar-sm" style="background: var(--gradient-cyan)">${m.avatar}</div>
          <span>${Utils.randInt(0, this.score + 50)}</span>
        </div>
      `).join('')}
    `;
  },

  // ===== END GAME =====
  endGame() {
    this.isActive = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }

    const timerContainer = document.getElementById('game-timer');
    if (timerContainer) timerContainer.classList.remove('warning');

    // Show results
    const questionEl = document.getElementById('game-question');
    if (questionEl) {
      questionEl.innerHTML = `
        <div style="font-size: 48px; margin-bottom: 16px;">🏆</div>
        <strong>GAME OVER!</strong><br>
        <span style="font-size: var(--text-2xl); font-weight: 700;" class="gradient-text">Your Score: ${this.score}</span><br>
        <span style="color: var(--text-secondary); font-size: var(--text-sm);">
          ${this.score > 200 ? 'LEGENDARY performance! 🔥' : this.score > 100 ? 'Nice work! Solid showing! 💪' : 'Not bad for a warmup! 😄'}
        </span>
      `;
    }

    const optionsEl = document.getElementById('game-options');
    if (optionsEl) {
      optionsEl.innerHTML = `
        <div class="game-option" onclick="Games.closeGame()" style="grid-column: 1/-1; background: var(--gradient-purple); color: white; border-color: transparent;">
          Exit Game 🎉
        </div>
      `;
    }

    Session.addRoboMessage(`🏆 GAME COMPLETE! Final score: ${this.score} points! ${this.score > 200 ? 'ABSOLUTELY LEGENDARY!' : 'Well played!'}`);
    Session.updateVibeScore(10);
    Utils.confetti();
  },

  closeGame() {
    this.isActive = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }

    document.getElementById('game-overlay').classList.remove('active');

    // Reset timer display
    const timerContainer = document.getElementById('game-timer');
    if (timerContainer) timerContainer.classList.remove('warning');
    document.getElementById('game-timer-value').textContent = '60';
  },
};
