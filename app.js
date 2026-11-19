/**
 * Kiddo English P.1 - Main Application Logic
 * Audio Synthesis, Speech Engine, Gamification, and Interactive Mini-Games
 */

// Global State
const state = {
  activeTab: 'alphabet', // 'alphabet' | 'vocab' | 'games' | 'stickers'
  selectedVocabCategory: 'family',
  letterFilter: 'all', // 'all' | 'vowels' | 'consonants'
  stars: 0,
  unlockedStickers: [],
  slowSpeech: false,
  soundMuted: false,
  selectedLetter: null,
  
  // Game 1: Listen & Pick
  listenGame: {
    score: 0,
    round: 1,
    maxRounds: 5,
    targetWord: null,
    options: [],
    answered: false
  },

  // Game 2: Memory Match
  memoryGame: {
    cards: [],
    flipped: [],
    matchedPairs: 0,
    totalPairs: 6,
    moves: 0,
    isLocked: false
  },

  // Game 3: Spelling Puzzle
  spellingGame: {
    currentIndex: 0,
    currentWordObj: null,
    scrambledLetters: [],
    userSlots: [],
    score: 0,
    isComplete: false
  }
};

/* ==========================================================================
   1. SOUND FX ENGINE (Web Audio API - No external mp3 files needed!)
   ========================================================================== */
class SoundEngine {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // เสียงเมื่อตอบถูก / รับรางวัล (Happy major chord arpeggio)
  playSuccess() {
    if (state.soundMuted) return;
    this.init();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.3, this.ctx.currentTime + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.08 + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + idx * 0.08);
      osc.stop(this.ctx.currentTime + idx * 0.08 + 0.4);
    });
  }

  // เสียงเมื่อตอบผิด (Soft gentle bonk)
  playWrong() {
    if (state.soundMuted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(140, this.ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.26);
  }

  // เสียงคลิกปุ่ม / การ์ด (Pop sound)
  playPop() {
    if (state.soundMuted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.06);

    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.07);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  // เสียงดาว / เหรียญ (Ding!)
  playStar() {
    if (state.soundMuted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, this.ctx.currentTime); // B5
    osc.frequency.setValueAtTime(1318.51, this.ctx.currentTime + 0.08); // E6

    gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.3, this.ctx.currentTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.42);
  }

  // เสียงเฉลิมฉลอง (Fanfare)
  playFanfare() {
    if (state.soundMuted) return;
    this.init();
    if (!this.ctx) return;

    const notes = [
      { f: 523.25, t: 0, d: 0.15 },
      { f: 523.25, t: 0.16, d: 0.15 },
      { f: 523.25, t: 0.32, d: 0.15 },
      { f: 659.25, t: 0.48, d: 0.4 },
      { f: 783.99, t: 0.9, d: 0.6 }
    ];

    notes.forEach(n => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, this.ctx.currentTime + n.t);

      gain.gain.setValueAtTime(0.01, this.ctx.currentTime + n.t);
      gain.gain.exponentialRampToValueAtTime(0.3, this.ctx.currentTime + n.t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + n.t + n.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + n.t);
      osc.stop(this.ctx.currentTime + n.t + n.d);
    });
  }
}

const sounds = new SoundEngine();

/* ==========================================================================
   2. SPEECH SYNTHESIS ENGINE (Web Speech API)
   ========================================================================== */
class SpeechEngine {
  constructor() {
    this.synth = window.speechSynthesis;
    this.voice = null;
    this.initVoice();
    if (this.synth && this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = () => this.initVoice();
    }
  }

  initVoice() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    // ค้นหาเสียงภาษาอังกฤษคุณภาพสูง (เช่น US / UK / Female / Natural)
    const enVoices = voices.filter(v => v.lang.startsWith('en'));
    const preferred = enVoices.find(v => 
      v.name.includes('Natural') || 
      v.name.includes('Google') || 
      v.name.includes('Samantha') || 
      v.name.includes('Victoria') ||
      v.name.includes('Jenny')
    ) || enVoices[0];
    this.voice = preferred || voices[0];
  }

  speak(text, onEndCallback = null) {
    if (!this.synth) {
      console.warn('Speech synthesis not supported in this browser.');
      if (onEndCallback) onEndCallback();
      return;
    }

    // Cancel current speaking
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    if (this.voice) {
      utterance.voice = this.voice;
    }
    utterance.lang = 'en-US';
    // ปรับความเร็วเสียงให้อ่านชัดเจนสำหรับเด็ก ป.1 (ปกติ 0.85, ช้าพิเศษ 0.60)
    utterance.rate = state.slowSpeech ? 0.60 : 0.85;
    utterance.pitch = 1.1; // เสียงใสขึ้นเล็กน้อยเหมาะกับเด็ก

    if (onEndCallback) {
      utterance.onend = onEndCallback;
      utterance.onerror = onEndCallback;
    }

    this.synth.speak(utterance);
  }

  // ฟังก์ชันอ่านโฟนิกส์และคำศัพท์แบบเต็ม: "A says /æ/ ... Apple"
  speakPhonics(letter, word) {
    const text = `${letter}. ${word}.`;
    this.speak(text);
  }
}

const speech = new SpeechEngine();

/* ==========================================================================
   3. STORAGE & GAMIFICATION (Stars, Badges, Confetti)
   ========================================================================== */
function loadSavedProgress() {
  try {
    const savedStars = localStorage.getItem('kiddo_eng_stars');
    if (savedStars !== null) {
      state.stars = parseInt(savedStars, 10) || 0;
    }
    const savedStickers = localStorage.getItem('kiddo_eng_stickers');
    if (savedStickers) {
      state.unlockedStickers = JSON.parse(savedStickers) || [];
    }
  } catch (e) {
    console.warn('Could not load localStorage progress', e);
  }
  updateStarDisplay();
  checkStickerRewards(false);
}

function saveProgress() {
  try {
    localStorage.setItem('kiddo_eng_stars', state.stars);
    localStorage.setItem('kiddo_eng_stickers', JSON.stringify(state.unlockedStickers));
  } catch (e) {
    console.warn('Could not save to localStorage', e);
  }
}

function addStars(amount = 1) {
  state.stars += amount;
  sounds.playStar();
  saveProgress();
  updateStarDisplay();
  checkStickerRewards(true);

  // เอฟเฟกต์เด้งที่ตัวนับดาว
  const starCounter = document.getElementById('star-counter-box');
  if (starCounter) {
    starCounter.classList.add('star-bounce');
    setTimeout(() => starCounter.classList.remove('star-bounce'), 600);
  }
}

function updateStarDisplay() {
  const el = document.getElementById('star-count');
  if (el) el.textContent = state.stars;
}

function checkStickerRewards(showNotification = true) {
  STICKER_REWARDS.forEach(reward => {
    if (state.stars >= reward.starsNeeded && !state.unlockedStickers.includes(reward.id)) {
      state.unlockedStickers.push(reward.id);
      saveProgress();
      if (showNotification) {
        showStickerUnlockedModal(reward);
      }
    }
  });
}

function showStickerUnlockedModal(reward) {
  sounds.playFanfare();
  triggerConfetti();

  const modal = document.getElementById('reward-modal');
  const icon = document.getElementById('reward-modal-icon');
  const title = document.getElementById('reward-modal-title');
  const desc = document.getElementById('reward-modal-desc');

  if (modal && icon && title && desc) {
    icon.textContent = reward.icon;
    title.textContent = `ยินดีด้วย! ปลดล็อก ${reward.name}`;
    desc.textContent = reward.desc;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function closeRewardModal() {
  const modal = document.getElementById('reward-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

// Simple lightweight Canvas Confetti
function triggerConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = [];
  const colors = ['#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0', '#118AB2', '#8338EC', '#FF9F1C'];

  for (let i = 0; i < 90; i++) {
    pieces.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 14,
      vy: (Math.random() - 0.7) * 14,
      size: Math.random() * 9 + 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 10,
      life: 1
    });
  }

  let animationFrame;
  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = 0;

    pieces.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35; // gravity
      p.rotation += p.vRot;
      p.life -= 0.012;

      if (p.life > 0) {
        alive++;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
        ctx.restore();
      }
    });

    if (alive > 0) {
      animationFrame = requestAnimationFrame(render);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(animationFrame);
    }
  }

  render();
}

/* ==========================================================================
   4. NAVIGATION & TAB SWITCHING
   ========================================================================== */
function switchTab(tabName) {
  state.activeTab = tabName;
  sounds.playPop();

  // Update nav buttons
  document.querySelectorAll('.nav-btn').forEach(btn => {
    if (btn.dataset.tab === tabName) {
      btn.classList.add('nav-active');
    } else {
      btn.classList.remove('nav-active');
    }
  });

  // Hide all sections
  document.querySelectorAll('.tab-content').forEach(section => {
    section.classList.add('hidden');
  });

  // Show active section
  const activeSection = document.getElementById(`tab-${tabName}`);
  if (activeSection) {
    activeSection.classList.remove('hidden');
  }

  // Trigger sub-renderers
  if (tabName === 'alphabet') {
    renderAlphabet();
  } else if (tabName === 'vocab') {
    renderVocabCategories();
    renderVocabCards();
  } else if (tabName === 'games') {
    initGamesHub();
  } else if (tabName === 'stickers') {
    renderStickers();
  }
}

/* ==========================================================================
   5. ALPHABET & PHONICS (A - Z)
   ========================================================================== */
function renderAlphabet() {
  const container = document.getElementById('alphabet-grid');
  if (!container) return;

  const vowels = ['A', 'E', 'I', 'O', 'U'];
  let list = ALPHABET_DATA;

  if (state.letterFilter === 'vowels') {
    list = ALPHABET_DATA.filter(item => vowels.includes(item.letter));
  } else if (state.letterFilter === 'consonants') {
    list = ALPHABET_DATA.filter(item => !vowels.includes(item.letter));
  }

  container.innerHTML = list.map(item => {
    const isVowel = vowels.includes(item.letter);
    const badgeClass = isVowel ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-blue-50 text-blue-700 border-blue-200';
    return `
      <div class="letter-card group relative bg-white rounded-3xl p-4 shadow-md hover:shadow-xl border-4 border-b-8 border-slate-100 hover:border-sky-300 transition-all duration-200 cursor-pointer flex flex-col items-center justify-between"
           onclick="handleLetterCardClick('${item.letter}')">
        
        <!-- Top row: Vowel tag + Sound Icon -->
        <div class="w-full flex justify-between items-center mb-1">
          <span class="text-xs font-bold px-2 py-0.5 rounded-full border ${badgeClass}">
            ${isVowel ? 'สระ' : 'พยัญชนะ'}
          </span>
          <button class="w-8 h-8 rounded-full bg-sky-50 text-sky-500 hover:bg-sky-500 hover:text-white transition flex items-center justify-center text-sm shadow-sm"
                  onclick="event.stopPropagation(); playLetterAudio('${item.letter}', '${item.word}')"
                  title="ฟังเสียงอ่าน">
            🔊
          </button>
        </div>

        <!-- Big Letter Display -->
        <div class="my-1 text-center">
          <span class="text-5xl font-black text-sky-600 tracking-tight font-display group-hover:scale-110 transform transition inline-block">
            ${item.letter}<span class="text-4xl text-amber-500 font-bold ml-1">${item.lower}</span>
          </span>
        </div>

        <!-- Phonics Pronunciation -->
        <div class="bg-amber-50 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-xl mb-2 border border-amber-200">
          ${item.phonics}
        </div>

        <!-- Word Icon & Vocabulary -->
        <div class="w-full bg-slate-50 rounded-2xl p-2.5 text-center flex flex-col items-center">
          <span class="text-3xl mb-1 transform group-hover:bounce">${item.icon}</span>
          <div class="font-extrabold text-slate-800 text-base leading-tight">${item.word}</div>
          <div class="text-slate-500 text-xs">${item.thai}</div>
        </div>

      </div>
    `;
  }).join('');
}

function handleLetterCardClick(letterChar) {
  sounds.playPop();
  const item = ALPHABET_DATA.find(x => x.letter === letterChar);
  if (!item) return;

  state.selectedLetter = item;
  playLetterAudio(item.letter, item.word);
  showLetterModal(item);
  addStars(1);
}

function playLetterAudio(letter, word) {
  speech.speak(`${letter}. ${word}.`);
}

function showLetterModal(item) {
  const modal = document.getElementById('letter-modal');
  if (!modal) return;

  document.getElementById('modal-letter-pair').innerHTML = `${item.letter} <span class="text-amber-500">${item.lower}</span>`;
  document.getElementById('modal-letter-phonics').textContent = `เสียงโฟนิกส์: ${item.phonics}`;
  document.getElementById('modal-word-icon').textContent = item.icon;
  document.getElementById('modal-word-eng').textContent = item.word;
  document.getElementById('modal-word-thai').textContent = item.thai;
  document.getElementById('modal-example').textContent = `"${item.example}"`;

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeLetterModal() {
  const modal = document.getElementById('letter-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function setLetterFilter(filter) {
  state.letterFilter = filter;
  sounds.playPop();
  document.querySelectorAll('.filter-btn').forEach(btn => {
    if (btn.dataset.filter === filter) {
      btn.classList.add('bg-sky-500', 'text-white');
      btn.classList.remove('bg-white', 'text-slate-700');
    } else {
      btn.classList.remove('bg-sky-500', 'text-white');
      btn.classList.add('bg-white', 'text-slate-700');
    }
  });
  renderAlphabet();
}

/* ==========================================================================
   6. VOCABULARY CATEGORIES (หมวดหมู่คำศัพท์)
   ========================================================================== */
function renderVocabCategories() {
  const container = document.getElementById('vocab-category-selector');
  if (!container) return;

  container.innerHTML = VOCAB_CATEGORIES.map(cat => {
    const isActive = cat.id === state.selectedVocabCategory;
    const activeClasses = isActive
      ? 'bg-amber-400 text-slate-900 border-b-4 border-amber-600 scale-105 shadow-md'
      : 'bg-white text-slate-700 border-b-4 border-slate-200 hover:bg-slate-50';

    return `
      <button class="px-4 py-2.5 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${activeClasses}"
              onclick="selectVocabCategory('${cat.id}')">
        <span class="text-xl">${cat.icon}</span>
        <span>${cat.title}</span>
      </button>
    `;
  }).join('');
}

function selectVocabCategory(categoryId) {
  sounds.playPop();
  state.selectedVocabCategory = categoryId;
  renderVocabCategories();
  renderVocabCards();
}

function renderVocabCards() {
  const container = document.getElementById('vocab-grid');
  if (!container) return;

  const currentCat = VOCAB_CATEGORIES.find(c => c.id === state.selectedVocabCategory) || VOCAB_CATEGORIES[0];
  const list = currentCat.words;

  container.innerHTML = list.map(item => {
    const colorSwatch = item.hex ? `<div class="w-8 h-8 rounded-full shadow-inner border-2 border-white mb-2" style="background-color: ${item.hex};"></div>` : '';
    const numberDots = item.count ? `
      <div class="flex gap-1 justify-center my-1 flex-wrap">
        ${Array.from({ length: item.count }).map(() => '<span class="inline-block w-2.5 h-2.5 rounded-full bg-red-400"></span>').join('')}
      </div>
    ` : '';

    return `
      <div class="vocab-card bg-white rounded-3xl p-5 shadow-sm hover:shadow-xl border-4 border-b-8 border-slate-100 hover:border-amber-300 transition-all duration-200 flex flex-col items-center justify-between cursor-pointer group"
           onclick="handleVocabCardClick('${item.word}')">
        
        <!-- Big Graphic / Icon -->
        <div class="w-20 h-20 rounded-2xl bg-amber-50 group-hover:bg-amber-100 flex items-center justify-center text-5xl mb-3 shadow-inner transform group-hover:scale-110 transition">
          ${item.icon}
        </div>

        ${colorSwatch}
        ${numberDots}

        <!-- Word & Thai -->
        <div class="text-center w-full">
          <div class="text-xl font-black text-slate-800 tracking-wide font-display group-hover:text-amber-600 transition">
            ${item.word}
          </div>
          <div class="text-amber-600 font-bold text-xs mt-0.5">
            [${item.phonetic}]
          </div>
          <div class="text-slate-500 font-medium text-sm mt-1">
            ${item.thai}
          </div>
        </div>

        <!-- Speaker button -->
        <div class="mt-3 w-full pt-3 border-t border-slate-100 flex justify-center">
          <button class="w-10 h-10 rounded-xl bg-amber-400 text-slate-900 font-bold flex items-center justify-center gap-1 text-sm shadow hover:bg-amber-300 transition"
                  onclick="event.stopPropagation(); handleVocabCardClick('${item.word}')">
            🔊 ฟังเสียง
          </button>
        </div>

      </div>
    `;
  }).join('');
}

function handleVocabCardClick(word) {
  sounds.playPop();
  speech.speak(word);
  addStars(1);
}

/* ==========================================================================
   7. INTERACTIVE GAMES HUB (มินิเกมฝึกทักษะ)
   ========================================================================== */
function initGamesHub() {
  // เริ่มต้นเกมแรก: Listen & Pick
  startListenGame();
}

function switchGameTab(gameKey) {
  sounds.playPop();
  document.querySelectorAll('.game-nav-btn').forEach(btn => {
    if (btn.dataset.game === gameKey) {
      btn.classList.add('bg-purple-600', 'text-white', 'shadow-md');
      btn.classList.remove('bg-white', 'text-slate-700');
    } else {
      btn.classList.remove('bg-purple-600', 'text-white', 'shadow-md');
      btn.classList.add('bg-white', 'text-slate-700');
    }
  });

  document.querySelectorAll('.game-view').forEach(view => {
    view.classList.add('hidden');
  });

  const activeView = document.getElementById(`game-view-${gameKey}`);
  if (activeView) activeView.classList.remove('hidden');

  if (gameKey === 'listen') {
    startListenGame();
  } else if (gameKey === 'memory') {
    startMemoryGame();
  } else if (gameKey === 'spelling') {
    startSpellingGame();
  }
}

// -------------------------------------------------------------
// GAME 1: ฟังเสียงแล้วเลือกคำศัพท์ (Listen & Pick)
// -------------------------------------------------------------
function startListenGame() {
  state.listenGame.round = 1;
  state.listenGame.score = 0;
  state.listenGame.maxRounds = 5;
  nextListenQuestion();
}

function nextListenQuestion() {
  state.listenGame.answered = false;

  // รวบรวมคำศัพท์จากทุกหมวด
  const pool = [];
  VOCAB_CATEGORIES.forEach(c => pool.push(...c.words));

  // สุ่ม 1 คำศัพท์หลัก
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  const target = shuffled[0];
  const options = shuffled.slice(0, 4).sort(() => 0.5 - Math.random());

  state.listenGame.targetWord = target;
  state.listenGame.options = options;

  renderListenGame();
  // อ่านเสียงอัตโนมัติให้ฟัง
  setTimeout(() => {
    playTargetAudio();
  }, 400);
}

function playTargetAudio() {
  if (state.listenGame.targetWord) {
    speech.speak(state.listenGame.targetWord.word);
  }
}

function renderListenGame() {
  const roundEl = document.getElementById('listen-round');
  const scoreEl = document.getElementById('listen-score');
  const optionsGrid = document.getElementById('listen-options-grid');
  const feedbackEl = document.getElementById('listen-feedback');

  if (roundEl) roundEl.textContent = `${state.listenGame.round} / ${state.listenGame.maxRounds}`;
  if (scoreEl) scoreEl.textContent = state.listenGame.score;
  if (feedbackEl) feedbackEl.innerHTML = `กดที่ปุ่มลำโพงเพื่อฟัง แล้วเลือกรูปภาพที่ถูกต้องนะจ๊ะ 👂✨`;

  if (!optionsGrid) return;
  optionsGrid.innerHTML = state.listenGame.options.map(opt => `
    <button class="listen-opt-btn bg-white rounded-3xl p-5 border-4 border-b-8 border-slate-100 hover:border-purple-300 shadow-md hover:shadow-xl transition-all flex flex-col items-center justify-center cursor-pointer group"
            onclick="checkListenAnswer('${opt.word}', this)">
      <span class="text-6xl mb-2 transform group-hover:scale-125 transition duration-200">${opt.icon}</span>
      <span class="text-lg font-bold text-slate-700">${opt.thai}</span>
    </button>
  `).join('');
}

function checkListenAnswer(selectedWord, btnEl) {
  if (state.listenGame.answered) return;
  state.listenGame.answered = true;

  const target = state.listenGame.targetWord;
  const feedbackEl = document.getElementById('listen-feedback');

  if (selectedWord === target.word) {
    // ถูกต้อง!
    sounds.playSuccess();
    triggerConfetti();
    addStars(2);
    state.listenGame.score += 10;
    document.getElementById('listen-score').textContent = state.listenGame.score;

    btnEl.classList.remove('border-slate-100');
    btnEl.classList.add('border-emerald-500', 'bg-emerald-50');

    if (feedbackEl) {
      feedbackEl.innerHTML = `<span class="text-emerald-600 font-extrabold text-lg">🎉 เก่งมากจ้า! ถูกต้องแล้ว! คำนี้คือ "${target.word}" (${target.thai})</span>`;
    }

    setTimeout(() => {
      if (state.listenGame.round < state.listenGame.maxRounds) {
        state.listenGame.round++;
        nextListenQuestion();
      } else {
        finishListenGame();
      }
    }, 1800);
  } else {
    // ตอบผิด
    sounds.playWrong();
    btnEl.classList.remove('border-slate-100');
    btnEl.classList.add('border-rose-400', 'bg-rose-50');

    if (feedbackEl) {
      feedbackEl.innerHTML = `<span class="text-rose-600 font-bold">😊 ยังไม่ใช่น้า ลองกดฟังลำโพงอีกครั้ง คำตอบคือ "${target.word}" (${target.thai})</span>`;
    }

    setTimeout(() => {
      if (state.listenGame.round < state.listenGame.maxRounds) {
        state.listenGame.round++;
        nextListenQuestion();
      } else {
        finishListenGame();
      }
    }, 2200);
  }
}

function finishListenGame() {
  sounds.playFanfare();
  triggerConfetti();
  addStars(5);

  const container = document.getElementById('listen-options-grid');
  const feedbackEl = document.getElementById('listen-feedback');
  if (feedbackEl) feedbackEl.innerHTML = '';

  if (container) {
    container.innerHTML = `
      <div class="col-span-2 sm:col-span-4 bg-white rounded-3xl p-8 text-center border-4 border-amber-300 shadow-xl">
        <div class="text-7xl mb-3 animate-bounce">🏆</div>
        <h3 class="text-2xl font-black text-slate-800 font-display">สุดยอดเลยคนเก่ง! เล่นครบแล้ว</h3>
        <p class="text-slate-600 my-2">คะแนนรวมของคุณหนู: <span class="font-extrabold text-amber-500 text-xl">${state.listenGame.score}</span> คะแนน</p>
        <p class="text-emerald-600 font-bold mb-6">+5 ดาวพิเศษเป็นรางวัล! ⭐</p>
        <button class="px-6 py-3 bg-amber-400 text-slate-900 font-extrabold rounded-2xl shadow-lg border-b-4 border-amber-600 hover:bg-amber-300 transition cursor-pointer"
                onclick="startListenGame()">
          🔄 เล่นใหม่อีกรอบ
        </button>
      </div>
    `;
  }
}

// -------------------------------------------------------------
// GAME 2: จับคู่การ์ดความจำ (Memory Match)
// -------------------------------------------------------------
function startMemoryGame() {
  state.memoryGame.flipped = [];
  state.memoryGame.matchedPairs = 0;
  state.memoryGame.moves = 0;
  state.memoryGame.isLocked = false;

  // คัดเลือก 6 คำศัพท์
  const sampleItems = [
    { word: 'Cat', icon: '🐱', thai: 'แมว' },
    { word: 'Dog', icon: '🐶', thai: 'สุนัข' },
    { word: 'Apple', icon: '🍎', thai: 'แอปเปิ้ล' },
    { word: 'Sun', icon: '☀️', thai: 'พระอาทิตย์' },
    { word: 'Book', icon: '📖', thai: 'หนังสือ' },
    { word: 'Car', icon: '🚗', thai: 'รถยนต์' }
  ];

  // สร้างคู่การ์ด 12 ใบ: ใบหนึ่งเป็นภาพ อีกใบเป็นคำศัพท์
  let cards = [];
  sampleItems.forEach((item, index) => {
    // การ์ดรูปภาพ
    cards.push({ id: `${index}-img`, pairId: index, type: 'img', content: item.icon, label: item.thai, word: item.word });
    // การ์ดคำศัพท์
    cards.push({ id: `${index}-word`, pairId: index, type: 'word', content: item.word, label: item.thai, word: item.word });
  });

  // สลับการ์ด
  cards.sort(() => 0.5 - Math.random());
  state.memoryGame.cards = cards;
  state.memoryGame.totalPairs = sampleItems.length;

  renderMemoryGrid();
}

function renderMemoryGrid() {
  const grid = document.getElementById('memory-grid');
  const movesEl = document.getElementById('memory-moves');
  const pairsEl = document.getElementById('memory-pairs');

  if (movesEl) movesEl.textContent = state.memoryGame.moves;
  if (pairsEl) pairsEl.textContent = `${state.memoryGame.matchedPairs} / ${state.memoryGame.totalPairs}`;

  if (!grid) return;
  grid.innerHTML = state.memoryGame.cards.map((card, idx) => `
    <div class="memory-card-wrap h-28 sm:h-32 perspective-1000 cursor-pointer"
         onclick="handleMemoryCardClick(${idx})">
      <div id="mem-card-${idx}" class="w-full h-full rounded-2xl relative transition-transform duration-500 transform-style-3d border-4 border-b-6 border-slate-200 shadow-sm hover:border-purple-300">
        
        <!-- ด้านหลัง (ซ่อนอยู่) -->
        <div class="card-face card-back absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-3xl font-bold backface-hidden shadow-inner">
          ❓
        </div>

        <!-- ด้านหน้า (เปิดแล้ว) -->
        <div class="card-face card-front absolute inset-0 bg-white rounded-xl flex flex-col items-center justify-center p-2 backface-hidden rotate-y-180 border-2 border-purple-200">
          <span class="${card.type === 'img' ? 'text-4xl' : 'text-xl font-black text-purple-700 font-display'} mb-1">${card.content}</span>
          <span class="text-xs text-slate-500 font-bold">${card.label}</span>
        </div>

      </div>
    </div>
  `).join('');
}

function handleMemoryCardClick(index) {
  if (state.memoryGame.isLocked) return;
  const card = state.memoryGame.cards[index];
  const cardEl = document.getElementById(`mem-card-${index}`);

  // การ์ดที่เปิดอยู่แล้วหรือจับคู่แล้ว
  if (cardEl.classList.contains('flipped') || cardEl.classList.contains('matched')) return;

  // เปิดการ์ด
  sounds.playPop();
  cardEl.classList.add('flipped', 'rotate-y-180');
  speech.speak(card.word);

  state.memoryGame.flipped.push({ index, card, el: cardEl });

  if (state.memoryGame.flipped.length === 2) {
    state.memoryGame.moves++;
    document.getElementById('memory-moves').textContent = state.memoryGame.moves;
    state.memoryGame.isLocked = true;

    const [first, second] = state.memoryGame.flipped;
    if (first.card.pairId === second.card.pairId) {
      // จับคู่สำเร็จ!
      setTimeout(() => {
        sounds.playSuccess();
        first.el.classList.add('matched', 'border-emerald-500', 'bg-emerald-50');
        second.el.classList.add('matched', 'border-emerald-500', 'bg-emerald-50');
        state.memoryGame.matchedPairs++;
        document.getElementById('memory-pairs').textContent = `${state.memoryGame.matchedPairs} / ${state.memoryGame.totalPairs}`;
        state.memoryGame.flipped = [];
        state.memoryGame.isLocked = false;
        addStars(2);

        if (state.memoryGame.matchedPairs === state.memoryGame.totalPairs) {
          finishMemoryGame();
        }
      }, 600);
    } else {
      // ไม่ตรงกัน -> ปิดการ์ด
      setTimeout(() => {
        sounds.playWrong();
        first.el.classList.remove('flipped', 'rotate-y-180');
        second.el.classList.remove('flipped', 'rotate-y-180');
        state.memoryGame.flipped = [];
        state.memoryGame.isLocked = false;
      }, 1000);
    }
  }
}

function finishMemoryGame() {
  sounds.playFanfare();
  triggerConfetti();
  addStars(8);

  const grid = document.getElementById('memory-grid');
  if (grid) {
    grid.innerHTML = `
      <div class="col-span-3 sm:col-span-4 bg-white rounded-3xl p-8 text-center border-4 border-purple-400 shadow-xl my-4">
        <div class="text-7xl mb-3 animate-bounce">🎉</div>
        <h3 class="text-2xl font-black text-slate-800 font-display">สุดยอดจอมพลังความจำ!</h3>
        <p class="text-slate-600 my-2">จับคู่ครบทั้ง 6 คู่ โดยใช้จำนวนครั้ง: <span class="font-extrabold text-purple-600 text-xl">${state.memoryGame.moves}</span> ครั้ง</p>
        <p class="text-emerald-600 font-bold mb-6">+8 ดาวรางวัลพิเศษ! ⭐⭐⭐</p>
        <button class="px-6 py-3 bg-purple-600 text-white font-extrabold rounded-2xl shadow-lg border-b-4 border-purple-800 hover:bg-purple-500 transition cursor-pointer"
                onclick="startMemoryGame()">
          🔄 เล่นใหม่อีกรอบ
        </button>
      </div>
    `;
  }
}

// -------------------------------------------------------------
// GAME 3: ผึ้งน้อยสะกดคำ (Spelling Puzzle)
// -------------------------------------------------------------
function startSpellingGame() {
  state.spellingGame.currentIndex = 0;
  state.spellingGame.score = 0;
  loadSpellingWord();
}

function loadSpellingWord() {
  const current = SPELLING_WORDS[state.spellingGame.currentIndex % SPELLING_WORDS.length];
  state.spellingGame.currentWordObj = current;
  state.spellingGame.isComplete = false;

  const letters = current.word.split('');
  // สร้างช่องคำตอบว่าง
  state.spellingGame.userSlots = new Array(letters.length).fill(null);

  // สลับตัวอักษรให้เด็กกด
  state.spellingGame.scrambledLetters = letters.map((char, id) => ({
    id: `letter-${id}-${char}`,
    char: char,
    used: false
  })).sort(() => 0.5 - Math.random());

  renderSpellingUI();
  speech.speak(current.word);
}

function renderSpellingUI() {
  const iconEl = document.getElementById('spelling-icon');
  const hintEl = document.getElementById('spelling-hint');
  const slotsContainer = document.getElementById('spelling-slots');
  const poolContainer = document.getElementById('spelling-letters-pool');
  const scoreEl = document.getElementById('spelling-score');

  const obj = state.spellingGame.currentWordObj;
  if (iconEl) iconEl.textContent = obj.icon;
  if (hintEl) hintEl.textContent = `คำใบ้: ${obj.hint}`;
  if (scoreEl) scoreEl.textContent = state.spellingGame.score;

  // Render Slots
  if (slotsContainer) {
    slotsContainer.innerHTML = state.spellingGame.userSlots.map((char, index) => {
      const isFilled = char !== null;
      return `
        <div class="w-14 h-16 sm:w-16 sm:h-20 rounded-2xl border-4 ${isFilled ? 'border-amber-400 bg-amber-50 text-slate-800 shadow-md' : 'border-dashed border-slate-300 bg-white text-slate-400'} flex items-center justify-center text-3xl sm:text-4xl font-black font-display cursor-pointer transition transform hover:scale-105"
             onclick="handleRemoveSlotLetter(${index})">
          ${char ? char : '_'}
        </div>
      `;
    }).join('');
  }

  // Render Letter Bubbles
  if (poolContainer) {
    poolContainer.innerHTML = state.spellingGame.scrambledLetters.map(item => `
      <button class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl font-black text-2xl sm:text-3xl font-display shadow-md transition-all ${item.used ? 'opacity-20 cursor-not-allowed bg-slate-200' : 'bg-white border-4 border-b-6 border-sky-200 hover:border-sky-400 text-sky-600 hover:scale-110 cursor-pointer active:scale-95'}"
              ${item.used ? 'disabled' : ''}
              onclick="handleSelectSpellingLetter('${item.id}')">
        ${item.char}
      </button>
    `).join('');
  }
}

function handleSelectSpellingLetter(letterId) {
  if (state.spellingGame.isComplete) return;

  const item = state.spellingGame.scrambledLetters.find(l => l.id === letterId);
  if (!item || item.used) return;

  // หาช่องว่างแรก
  const emptyIndex = state.spellingGame.userSlots.findIndex(slot => slot === null);
  if (emptyIndex === -1) return;

  sounds.playPop();
  speech.speak(item.char);

  item.used = true;
  state.spellingGame.userSlots[emptyIndex] = item.char;
  renderSpellingUI();

  // ตรวจสอบว่าเต็มทุกช่องหรือยัง
  if (!state.spellingGame.userSlots.includes(null)) {
    checkSpellingResult();
  }
}

function handleRemoveSlotLetter(slotIndex) {
  if (state.spellingGame.isComplete) return;
  const char = state.spellingGame.userSlots[slotIndex];
  if (!char) return;

  sounds.playPop();
  state.spellingGame.userSlots[slotIndex] = null;

  // ปลดล็อกตัวอักษรใน pool
  const found = state.spellingGame.scrambledLetters.find(l => l.char === char && l.used === true);
  if (found) {
    found.used = false;
  }

  renderSpellingUI();
}

function checkSpellingResult() {
  const currentWord = state.spellingGame.currentWordObj.word;
  const userWord = state.spellingGame.userSlots.join('');

  if (userWord === currentWord) {
    // ถูกต้อง!
    state.spellingGame.isComplete = true;
    sounds.playSuccess();
    triggerConfetti();
    addStars(3);
    state.spellingGame.score += 15;

    const slotsContainer = document.getElementById('spelling-slots');
    if (slotsContainer) {
      slotsContainer.querySelectorAll('div').forEach(d => {
        d.classList.add('bg-emerald-100', 'border-emerald-500', 'text-emerald-800');
      });
    }

    speech.speak(`Awesome! ${currentWord}.`);

    setTimeout(() => {
      state.spellingGame.currentIndex++;
      loadSpellingWord();
    }, 1800);
  } else {
    // ผิด -> รีเซ็ตช่อง
    sounds.playWrong();
    setTimeout(() => {
      state.spellingGame.userSlots = new Array(currentWord.length).fill(null);
      state.spellingGame.scrambledLetters.forEach(l => l.used = false);
      renderSpellingUI();
    }, 800);
  }
}

/* ==========================================================================
   8. STICKER BOOK (สมุดสะสมสติกเกอร์รางวัล)
   ========================================================================== */
function renderStickers() {
  const container = document.getElementById('stickers-grid');
  if (!container) return;

  container.innerHTML = STICKER_REWARDS.map(reward => {
    const isUnlocked = state.unlockedStickers.includes(reward.id);

    return `
      <div class="sticker-card bg-white rounded-3xl p-6 border-4 ${isUnlocked ? 'border-amber-300 shadow-lg' : 'border-slate-100 opacity-60'} flex flex-col items-center text-center relative overflow-hidden">
        
        ${isUnlocked ? `
          <div class="absolute top-2 right-2 bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full font-bold shadow">
            ปลดล็อกแล้ว ✅
          </div>
        ` : `
          <div class="absolute top-2 right-2 bg-slate-300 text-slate-700 text-xs px-2 py-0.5 rounded-full font-bold">
            🔒 สะสมครบ ${reward.starsNeeded} ⭐
          </div>
        `}

        <div class="w-24 h-24 rounded-full ${isUnlocked ? 'bg-amber-100 animate-pulse' : 'bg-slate-100 filter grayscale'} flex items-center justify-center text-5xl mb-3 shadow-inner">
          ${reward.icon}
        </div>

        <h4 class="font-black text-slate-800 text-lg mb-1">${reward.name}</h4>
        <p class="text-slate-500 text-sm">${reward.desc}</p>

        <!-- Progress bar if locked -->
        ${!isUnlocked ? `
          <div class="w-full bg-slate-200 h-2.5 rounded-full mt-4 overflow-hidden">
            <div class="bg-amber-400 h-full rounded-full" style="width: ${Math.min(100, (state.stars / reward.starsNeeded) * 100)}%;"></div>
          </div>
          <span class="text-xs text-slate-400 font-bold mt-1">${state.stars} / ${reward.starsNeeded} ดาว</span>
        ` : ''}

      </div>
    `;
  }).join('');
}

function resetProgress() {
  if (confirm('ต้องการเริ่มสะสมดาวและเหรียญรางวัลใหม่ทั้งหมดใช่หรือไม่?')) {
    state.stars = 0;
    state.unlockedStickers = [];
    saveProgress();
    updateStarDisplay();
    renderStickers();
    sounds.playPop();
    alert('รีเซ็ตข้อมูลความก้าวหน้าเรียบร้อยแล้ว');
  }
}

/* ==========================================================================
   9. GLOBAL CONTROLS & INITIALIZATION
   ========================================================================== */
function toggleSlowSpeech() {
  state.slowSpeech = !state.slowSpeech;
  sounds.playPop();
  const btn = document.getElementById('btn-slow-speech');
  if (btn) {
    if (state.slowSpeech) {
      btn.classList.add('bg-amber-500', 'text-white');
      btn.classList.remove('bg-white', 'text-slate-700');
      btn.innerHTML = '🐢 เสียงช้า (เปิดอยู่)';
    } else {
      btn.classList.remove('bg-amber-500', 'text-white');
      btn.classList.add('bg-white', 'text-slate-700');
      btn.innerHTML = '🐢 เสียงช้า';
    }
  }
  speech.speak(state.slowSpeech ? 'Slow speed on' : 'Normal speed');
}

function toggleSoundMute() {
  state.soundMuted = !state.soundMuted;
  const btn = document.getElementById('btn-sound-mute');
  if (btn) {
    btn.textContent = state.soundMuted ? '🔇 ปิดเสียง FX' : '🔊 เปิดเสียง FX';
  }
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => {
      console.warn('Fullscreen request failed:', err);
    });
  } else {
    document.exitFullscreen();
  }
}

// Window Onload Initialization
window.addEventListener('DOMContentLoaded', () => {
  loadSavedProgress();
  switchTab('alphabet');
});
