/**
 * Kiddo English P.1 - Family Web App (family.js)
 * Interactive Family Tree, Finger Family Song with Web Audio Melody, Games, and Family Album Creator
 */

// State for Family App
const famState = {
  activeTab: 'tree', // 'tree' | 'song' | 'dialogue' | 'games' | 'album'
  slowSpeech: false,
  soundMuted: false,
  stars: 0,
  selectedMember: null,

  // Finger Family Song State
  song: {
    isPlaying: false,
    currentFinger: 0,
    stopRequested: false
  },

  // Game 1: Who is this?
  quiz: {
    round: 1,
    maxRounds: 5,
    score: 0,
    currentTarget: null,
    options: [],
    answered: false
  },

  // Game 2: Family Memory Match
  memory: {
    cards: [],
    flipped: [],
    matchedPairs: 0,
    totalPairs: 4,
    moves: 0,
    isLocked: false
  },

  // Family Album Builder
  album: {
    studentName: 'น้องคนเก่ง',
    selectedMembers: ['father', 'mother', 'me']
  }
};

/* ==========================================================================
   1. SOUND & MELODY ENGINE (Web Audio API)
   ========================================================================== */
class FamilySoundEngine {
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

  playPop() {
    if (famState.soundMuted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(480, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.07);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.09);
  }

  playSuccess() {
    if (famState.soundMuted) return;
    this.init();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.3, this.ctx.currentTime + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.08 + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + idx * 0.08);
      osc.stop(this.ctx.currentTime + idx * 0.08 + 0.35);
    });
  }

  playWrong() {
    if (famState.soundMuted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(240, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.26);
  }

  playStar() {
    if (famState.soundMuted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1046.50, this.ctx.currentTime);
    osc.frequency.setValueAtTime(1318.51, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.3, this.ctx.currentTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.36);
  }

  // เล่นทำนองท่อนเพลง Finger Family Song น่ารักๆ (G4-G4-E4-C4...)
  playFingerMelody() {
    if (famState.soundMuted) return;
    this.init();
    if (!this.ctx) return;

    // "Daddy finger, Daddy finger, where are you?"
    const notes = [
      { f: 392.00, t: 0, d: 0.2 },      // G4 Dad-
      { f: 392.00, t: 0.22, d: 0.2 },   // G4 dy
      { f: 329.63, t: 0.44, d: 0.25 },  // E4 fin-
      { f: 261.63, t: 0.72, d: 0.35 },  // C4 ger
      { f: 392.00, t: 1.15, d: 0.2 },   // G4 Dad-
      { f: 392.00, t: 1.37, d: 0.2 },   // G4 dy
      { f: 329.63, t: 1.59, d: 0.25 },  // E4 fin-
      { f: 261.63, t: 1.87, d: 0.35 },  // C4 ger
      { f: 293.66, t: 2.30, d: 0.25 },  // D4 where
      { f: 329.63, t: 2.58, d: 0.25 },  // E4 are
      { f: 261.63, t: 2.86, d: 0.45 }   // C4 you?
    ];

    notes.forEach(n => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, this.ctx.currentTime + n.t);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime + n.t);
      gain.gain.exponentialRampToValueAtTime(0.25, this.ctx.currentTime + n.t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + n.t + n.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + n.t);
      osc.stop(this.ctx.currentTime + n.t + n.d + 0.05);
    });
  }
}

const famSounds = new FamilySoundEngine();

/* ==========================================================================
   2. SPEECH ENGINE (Web Speech API)
   ========================================================================== */
class FamilySpeechEngine {
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
    const enVoices = voices.filter(v => v.lang.startsWith('en'));
    const preferred = enVoices.find(v => 
      v.name.includes('Natural') || 
      v.name.includes('Google') || 
      v.name.includes('Samantha') || 
      v.name.includes('Victoria')
    ) || enVoices[0];
    this.voice = preferred || voices[0];
  }

  speak(text, onEndCallback = null) {
    if (!this.synth) {
      if (onEndCallback) onEndCallback();
      return;
    }

    this.synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    if (this.voice) utterance.voice = this.voice;
    utterance.lang = 'en-US';
    utterance.rate = famState.slowSpeech ? 0.65 : 0.85;
    utterance.pitch = 1.15;

    if (onEndCallback) {
      utterance.onend = onEndCallback;
      utterance.onerror = onEndCallback;
    }

    this.synth.speak(utterance);
  }
}

const famSpeech = new FamilySpeechEngine();

/* ==========================================================================
   3. STARS & CONFETTI
   ========================================================================== */
function loadStars() {
  try {
    const saved = localStorage.getItem('kiddo_eng_stars');
    if (saved !== null) {
      famState.stars = parseInt(saved, 10) || 0;
    }
  } catch (e) {}
  updateStarUI();
}

function addStars(count = 1) {
  famState.stars += count;
  famSounds.playStar();
  try {
    localStorage.setItem('kiddo_eng_stars', famState.stars);
  } catch (e) {}
  updateStarUI();

  const box = document.getElementById('fam-star-counter');
  if (box) {
    box.classList.add('star-bounce');
    setTimeout(() => box.classList.remove('star-bounce'), 600);
  }
}

function updateStarUI() {
  const el = document.getElementById('fam-star-count');
  if (el) el.textContent = famState.stars;
}

function triggerConfetti() {
  const canvas = document.getElementById('fam-confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = [];
  const colors = ['#EC4899', '#F43F5E', '#F59E0B', '#10B981', '#0EA5E9', '#8B5CF6'];

  for (let i = 0; i < 80; i++) {
    pieces.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 14,
      vy: (Math.random() - 0.7) * 14,
      size: Math.random() * 8 + 5,
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
      p.vy += 0.35;
      p.rotation += p.vRot;
      p.life -= 0.015;

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
   4. NAVIGATION
   ========================================================================== */
function switchFamTab(tabName) {
  famState.activeTab = tabName;
  famSounds.playPop();

  document.querySelectorAll('.fam-nav-btn').forEach(btn => {
    if (btn.dataset.tab === tabName) {
      btn.classList.add('fam-nav-active');
    } else {
      btn.classList.remove('fam-nav-active');
    }
  });

  document.querySelectorAll('.fam-tab-section').forEach(sec => {
    sec.classList.add('hidden');
  });

  const activeSec = document.getElementById(`fam-tab-${tabName}`);
  if (activeSec) activeSec.classList.remove('hidden');

  if (tabName === 'tree') {
    renderFamilyTree();
  } else if (tabName === 'song') {
    renderFingerFamily();
  } else if (tabName === 'dialogue') {
    renderFamilyDialogue();
  } else if (tabName === 'games') {
    startFamilyQuiz();
  } else if (tabName === 'album') {
    renderFamilyAlbum();
  }
}

/* ==========================================================================
   5. TAB 1: INTERACTIVE FAMILY TREE (ผังครอบครัวมีชีวิต)
   ========================================================================== */
function renderFamilyTree() {
  const container = document.getElementById('family-tree-container');
  if (!container) return;

  container.innerHTML = FAMILY_MEMBERS_TREE.map(group => `
    <div class="mb-8 last:mb-0">
      
      <!-- Generation Header Badge -->
      <div class="flex items-center gap-2 mb-4">
        <span class="w-3 h-3 rounded-full bg-rose-500 inline-block animate-ping"></span>
        <h3 class="text-base sm:text-lg font-black text-slate-800 font-display">
          ${group.title}
        </h3>
      </div>

      <!-- Member Cards Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        ${group.members.map(member => `
          <div class="fam-member-card bg-white rounded-3xl p-5 border-4 border-b-8 border-slate-100 hover:border-rose-300 shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col items-center justify-between text-center group"
               onclick="handleMemberCardClick('${member.id}')">
            
            <!-- Character Avatar -->
            <div class="w-20 h-20 rounded-2xl bg-rose-50 group-hover:bg-rose-100 flex items-center justify-center text-5xl mb-2 shadow-inner transform group-hover:scale-110 group-hover:rotate-6 transition">
              ${member.icon}
            </div>

            <!-- English Word & Thai -->
            <div class="my-1">
              <div class="font-black text-slate-800 text-lg group-hover:text-rose-600 transition font-display">
                ${member.word}
              </div>
              <div class="text-rose-600 font-bold text-xs">
                [${member.phonetic}]
              </div>
              <div class="text-slate-500 font-medium text-xs mt-0.5">
                ${member.thai}
              </div>
            </div>

            <!-- Quick Play Audio Button -->
            <div class="mt-2 w-full pt-2 border-t border-slate-100 flex justify-center">
              <button class="w-8 h-8 rounded-full bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition flex items-center justify-center text-xs shadow-sm"
                      onclick="event.stopPropagation(); playMemberSpeech('${member.id}')"
                      title="กดฟังเสียง">
                🔊
              </button>
            </div>

          </div>
        `).join('')}
      </div>

    </div>
  `).join('');
}

function handleMemberCardClick(memberId) {
  famSounds.playPop();
  let found = null;
  FAMILY_MEMBERS_TREE.forEach(group => {
    const m = group.members.find(x => x.id === memberId);
    if (m) found = m;
  });

  if (!found) return;
  famState.selectedMember = found;
  addStars(1);
  showMemberModal(found);
  playMemberSpeech(memberId);
}

function playMemberSpeech(memberId) {
  let found = null;
  FAMILY_MEMBERS_TREE.forEach(group => {
    const m = group.members.find(x => x.id === memberId);
    if (m) found = m;
  });

  if (found) {
    famSpeech.speak(`${found.word}. ${found.sentence}`);
  }
}

function showMemberModal(member) {
  const modal = document.getElementById('fam-member-modal');
  if (!modal) return;

  document.getElementById('modal-fam-icon').textContent = member.icon;
  document.getElementById('modal-fam-word').textContent = member.word;
  document.getElementById('modal-fam-short').textContent = `ชื่อเรียก: ${member.shortName}`;
  document.getElementById('modal-fam-phonetic').textContent = `คำอ่าน: [${member.phonetic}]`;
  document.getElementById('modal-fam-thai').textContent = member.thai;
  document.getElementById('modal-fam-sentence').textContent = `"${member.sentence}"`;
  document.getElementById('modal-fam-greeting').textContent = `💬 "${member.soundGreeting}"`;

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeMemberModal() {
  const modal = document.getElementById('fam-member-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

/* ==========================================================================
   6. TAB 2: FINGER FAMILY SONG PUPPET SHOW (เพลงนิ้วมือครอบครัว)
   ========================================================================== */
function renderFingerFamily() {
  const container = document.getElementById('finger-puppets-container');
  if (!container) return;

  container.innerHTML = FINGER_FAMILY_SONG.map((item, index) => `
    <div id="puppet-${index}" class="puppet-card bg-white rounded-3xl p-5 border-4 border-b-8 border-slate-100 hover:border-amber-300 shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col items-center justify-between text-center group"
         onclick="playFingerVerse(${index})">
      
      <!-- Finger badge -->
      <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 mb-2">
        ${item.finger}
      </span>

      <!-- Puppet Avatar -->
      <div class="puppet-avatar w-20 h-20 rounded-full bg-amber-50 group-hover:bg-amber-100 flex items-center justify-center text-5xl mb-2 shadow-inner transform group-hover:scale-125 transition duration-300">
        ${item.icon}
      </div>

      <!-- Puppet Name -->
      <div class="font-black text-slate-800 text-base font-display group-hover:text-amber-600 transition">
        ${item.name}
      </div>

      <!-- Play button -->
      <button class="mt-3 px-3 py-1.5 rounded-xl bg-amber-400 text-slate-900 font-extrabold text-xs shadow hover:bg-amber-300 transition flex items-center gap-1"
              onclick="event.stopPropagation(); playFingerVerse(${index})">
        🎵 ร้องท่อนนี้
      </button>

    </div>
  `).join('');
}

function playFingerVerse(index) {
  famSounds.playPop();
  const item = FINGER_FAMILY_SONG[index];
  if (!item) return;

  // ไฮไลต์ puppet การ์ด
  highlightPuppet(index);

  // อัปเดตเนื้อเพลงบนจอ
  const lyricEl = document.getElementById('finger-song-lyrics');
  if (lyricEl) {
    lyricEl.innerHTML = `
      <div class="animate-bounce text-3xl mb-1">${item.icon}</div>
      <div class="text-xl font-black text-amber-600 font-display">${item.name}</div>
      <div class="text-base font-bold text-slate-700 mt-2">"${item.lyric}"</div>
    `;
  }

  // เล่นทำนองดนตรี Web Audio และพูดเนื้อเพลง
  famSounds.playFingerMelody();
  setTimeout(() => {
    famSpeech.speak(item.lyric, () => {
      clearPuppetHighlight(index);
    });
  }, 100);

  addStars(1);
}

function highlightPuppet(index) {
  document.querySelectorAll('.puppet-card').forEach((card, i) => {
    if (i === index) {
      card.classList.add('border-amber-400', 'bg-amber-50', 'scale-105');
      card.querySelector('.puppet-avatar').classList.add('animate-bounce');
    } else {
      card.classList.remove('border-amber-400', 'bg-amber-50', 'scale-105');
      card.querySelector('.puppet-avatar').classList.remove('animate-bounce');
    }
  });
}

function clearPuppetHighlight(index) {
  const card = document.getElementById(`puppet-${index}`);
  if (card) {
    card.classList.remove('border-amber-400', 'bg-amber-50', 'scale-105');
    const avatar = card.querySelector('.puppet-avatar');
    if (avatar) avatar.classList.remove('animate-bounce');
  }
}

// เล่นเพลงตั้งแต่ต้นจนจบ (Full Song)
async function playFullSong() {
  if (famState.song.isPlaying) return;
  famState.song.isPlaying = true;
  famState.song.stopRequested = false;

  const btn = document.getElementById('btn-play-full-song');
  if (btn) btn.innerHTML = '⏸️ กำลังร้องเพลง...';

  triggerConfetti();

  for (let i = 0; i < FINGER_FAMILY_SONG.length; i++) {
    if (famState.song.stopRequested) break;
    highlightPuppet(i);
    const item = FINGER_FAMILY_SONG[i];

    const lyricEl = document.getElementById('finger-song-lyrics');
    if (lyricEl) {
      lyricEl.innerHTML = `
        <div class="animate-bounce text-3xl mb-1">${item.icon}</div>
        <div class="text-xl font-black text-amber-600 font-display">${item.name}</div>
        <div class="text-base font-bold text-slate-700 mt-2">"${item.lyric}"</div>
      `;
    }

    famSounds.playFingerMelody();

    await new Promise(resolve => {
      famSpeech.speak(item.lyric, resolve);
      // fallback timeout
      setTimeout(resolve, 3800);
    });

    clearPuppetHighlight(i);
    await new Promise(r => setTimeout(r, 400));
  }

  famState.song.isPlaying = false;
  if (btn) btn.innerHTML = '▶️ ร้องเพลงทั้งหมด (Full Song)';
  famSounds.playSuccess();
  triggerConfetti();
  addStars(5);
}

/* ==========================================================================
   7. TAB 3: SENTENCES & DIALOGUE (ประโยคสนทนา ป.1 เรื่องครอบครัว)
   ========================================================================== */
function renderFamilyDialogue() {
  const container = document.getElementById('family-dialogue-container');
  if (!container) return;

  container.innerHTML = FAMILY_CONVERSATIONS.map((item, idx) => `
    <div class="bg-white rounded-3xl p-6 border-4 border-b-8 border-slate-100 hover:border-sky-300 shadow-md transition-all flex flex-col md:flex-row items-center justify-between gap-6">
      
      <!-- Icon & Number -->
      <div class="flex items-center gap-3">
        <div class="w-16 h-16 rounded-2xl bg-sky-50 flex items-center justify-center text-4xl shadow-inner border border-sky-100">
          ${item.icon}
        </div>
        <div>
          <span class="text-xs font-bold text-sky-600 bg-sky-100 px-2.5 py-0.5 rounded-full">บทสนทนาที่ ${idx + 1}</span>
          <div class="text-xs text-slate-400 font-bold mt-1">ถาม - ตอบ</div>
        </div>
      </div>

      <!-- Question & Answer Bubbles -->
      <div class="flex-1 w-full space-y-3">
        
        <!-- Question -->
        <div class="flex items-start gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200 cursor-pointer hover:bg-sky-50 transition"
             onclick="famSpeech.speak('${item.q}')">
          <span class="text-lg">❓</span>
          <div>
            <div class="text-base font-black text-slate-800 font-display">${item.q}</div>
            <div class="text-xs text-slate-500 font-medium">${item.qThai}</div>
          </div>
          <button class="ml-auto text-sky-500 hover:text-sky-700 text-sm font-bold">🔊 ฟังถาม</button>
        </div>

        <!-- Answer -->
        <div class="flex items-start gap-2 bg-emerald-50 p-3 rounded-2xl border border-emerald-200 cursor-pointer hover:bg-emerald-100 transition"
             onclick="famSpeech.speak('${item.a}')">
          <span class="text-lg">💬</span>
          <div>
            <div class="text-base font-black text-emerald-800 font-display">${item.a}</div>
            <div class="text-xs text-emerald-600 font-medium">${item.aThai}</div>
          </div>
          <button class="ml-auto text-emerald-600 hover:text-emerald-800 text-sm font-bold">🔊 ฟังตอบ</button>
        </div>

      </div>

      <!-- Action Button -->
      <button class="w-full md:w-auto px-5 py-3 rounded-2xl bg-sky-500 text-white font-extrabold text-sm shadow hover:bg-sky-400 border-b-4 border-sky-700 transition cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap"
              onclick="playDialoguePair('${item.q}', '${item.a}')">
        <span>🗣️ ฟังทั้งบทสนทนา</span>
      </button>

    </div>
  `).join('');
}

function playDialoguePair(q, a) {
  famSounds.playPop();
  famSpeech.speak(q, () => {
    setTimeout(() => {
      famSpeech.speak(a);
    }, 400);
  });
  addStars(1);
}

/* ==========================================================================
   8. TAB 4: FAMILY GAMES HUB
   ========================================================================== */
function switchFamGame(gameKey) {
  famSounds.playPop();

  document.querySelectorAll('.fam-game-nav-btn').forEach(btn => {
    if (btn.dataset.fgame === gameKey) {
      btn.classList.add('bg-rose-500', 'text-white', 'shadow-md');
      btn.classList.remove('bg-white', 'text-slate-700');
    } else {
      btn.classList.remove('bg-rose-500', 'text-white', 'shadow-md');
      btn.classList.add('bg-white', 'text-slate-700');
    }
  });

  document.querySelectorAll('.fam-game-view').forEach(view => {
    view.classList.add('hidden');
  });

  const activeView = document.getElementById(`fam-gview-${gameKey}`);
  if (activeView) activeView.classList.remove('hidden');

  if (gameKey === 'quiz') {
    startFamilyQuiz();
  } else if (gameKey === 'memory') {
    startFamilyMemory();
  }
}

// --------------------------------------------------------------------------
// GAME 1: ทายซิ...ใครเอ่ย? (Who is this?)
// --------------------------------------------------------------------------
function startFamilyQuiz() {
  famState.quiz.round = 1;
  famState.quiz.score = 0;
  famState.quiz.maxRounds = 5;
  nextFamilyQuizQuestion();
}

function nextFamilyQuizQuestion() {
  famState.quiz.answered = false;

  // ดึงสมาชิกทั้งหมด
  const allMembers = [];
  FAMILY_MEMBERS_TREE.forEach(g => allMembers.push(...g.members));

  // สุ่ม 1 คนเป็นเป้าหมาย และอีก 3 คนเป็นตัวเลือกหลอก
  const shuffled = [...allMembers].sort(() => 0.5 - Math.random());
  const target = shuffled[0];
  const options = shuffled.slice(0, 4).sort(() => 0.5 - Math.random());

  famState.quiz.currentTarget = target;
  famState.quiz.options = options;

  renderFamilyQuizUI();
  setTimeout(() => {
    playQuizPromptAudio();
  }, 400);
}

function playQuizPromptAudio() {
  if (famState.quiz.currentTarget) {
    famSpeech.speak(famState.quiz.currentTarget.sentence);
  }
}

function renderFamilyQuizUI() {
  const roundEl = document.getElementById('fam-quiz-round');
  const scoreEl = document.getElementById('fam-quiz-score');
  const feedbackEl = document.getElementById('fam-quiz-feedback');
  const optionsGrid = document.getElementById('fam-quiz-options');

  if (roundEl) roundEl.textContent = `${famState.quiz.round} / ${famState.quiz.maxRounds}`;
  if (scoreEl) scoreEl.textContent = famState.quiz.score;
  if (feedbackEl) feedbackEl.innerHTML = 'กดฟังเสียงประโยค แล้วทายว่าพูดถึงใครนะจ๊ะ 👂✨';

  if (!optionsGrid) return;
  optionsGrid.innerHTML = famState.quiz.options.map(opt => `
    <button class="bg-white rounded-3xl p-5 border-4 border-b-8 border-slate-100 hover:border-rose-300 shadow-md hover:shadow-xl transition-all flex flex-col items-center justify-center cursor-pointer group"
            onclick="checkFamilyQuizAnswer('${opt.id}', this)">
      <span class="text-6xl mb-2 transform group-hover:scale-125 transition duration-200">${opt.icon}</span>
      <span class="text-lg font-black text-slate-800 font-display">${opt.word}</span>
      <span class="text-xs text-slate-500 font-bold">${opt.thai}</span>
    </button>
  `).join('');
}

function checkFamilyQuizAnswer(selectedId, btnEl) {
  if (famState.quiz.answered) return;
  famState.quiz.answered = true;

  const target = famState.quiz.currentTarget;
  const feedbackEl = document.getElementById('fam-quiz-feedback');

  if (selectedId === target.id) {
    famSounds.playSuccess();
    triggerConfetti();
    addStars(2);
    famState.quiz.score += 10;
    document.getElementById('fam-quiz-score').textContent = famState.quiz.score;

    btnEl.classList.remove('border-slate-100');
    btnEl.classList.add('border-emerald-500', 'bg-emerald-50');

    if (feedbackEl) {
      feedbackEl.innerHTML = `<span class="text-emerald-600 font-extrabold text-lg">🎉 ถูกต้องแล้วจ้า! คำตอบคือ "${target.word}" (${target.thai})</span>`;
    }

    setTimeout(() => {
      if (famState.quiz.round < famState.quiz.maxRounds) {
        famState.quiz.round++;
        nextFamilyQuizQuestion();
      } else {
        finishFamilyQuiz();
      }
    }, 1800);
  } else {
    famSounds.playWrong();
    btnEl.classList.remove('border-slate-100');
    btnEl.classList.add('border-rose-400', 'bg-rose-50');

    if (feedbackEl) {
      feedbackEl.innerHTML = `<span class="text-rose-600 font-bold">😊 ยังไม่ใช่น้า คำตอบคือ "${target.word}" (${target.thai})</span>`;
    }

    setTimeout(() => {
      if (famState.quiz.round < famState.quiz.maxRounds) {
        famState.quiz.round++;
        nextFamilyQuizQuestion();
      } else {
        finishFamilyQuiz();
      }
    }, 2200);
  }
}

function finishFamilyQuiz() {
  famSounds.playSuccess();
  triggerConfetti();
  addStars(5);

  const container = document.getElementById('fam-quiz-options');
  const feedbackEl = document.getElementById('fam-quiz-feedback');
  if (feedbackEl) feedbackEl.innerHTML = '';

  if (container) {
    container.innerHTML = `
      <div class="col-span-2 sm:col-span-4 bg-white rounded-3xl p-8 text-center border-4 border-amber-300 shadow-xl">
        <div class="text-7xl mb-3 animate-bounce">🏆</div>
        <h3 class="text-2xl font-black text-slate-800 font-display">สุดยอดเลยคนเก่ง!</h3>
        <p class="text-slate-600 my-2">คะแนนรวมความรู้เรื่องครอบครัว: <span class="font-extrabold text-rose-500 text-xl">${famState.quiz.score}</span> คะแนน</p>
        <p class="text-emerald-600 font-bold mb-6">+5 ดาวพิเศษเป็นรางวัล! ⭐</p>
        <button class="px-6 py-3 bg-rose-500 text-white font-extrabold rounded-2xl shadow-lg border-b-4 border-rose-700 hover:bg-rose-400 transition cursor-pointer"
                onclick="startFamilyQuiz()">
          🔄 เล่นใหม่อีกรอบ
        </button>
      </div>
    `;
  }
}

// --------------------------------------------------------------------------
// GAME 2: จับคู่ความจำการ์ดครอบครัว (Family Memory Match)
// --------------------------------------------------------------------------
function startFamilyMemory() {
  famState.memory.flipped = [];
  famState.memory.matchedPairs = 0;
  famState.memory.moves = 0;
  famState.memory.isLocked = false;

  const sampleMembers = [
    { word: 'Father', icon: '👨', thai: 'คุณพ่อ' },
    { word: 'Mother', icon: '👩', thai: 'คุณแม่' },
    { word: 'Brother', icon: '👦', thai: 'พี่ชาย/น้องชาย' },
    { word: 'Sister', icon: '👧', thai: 'พี่สาว/น้องสาว' }
  ];

  let cards = [];
  sampleMembers.forEach((item, index) => {
    cards.push({ id: `${index}-img`, pairId: index, type: 'img', content: item.icon, word: item.word, thai: item.thai });
    cards.push({ id: `${index}-word`, pairId: index, type: 'word', content: item.word, word: item.word, thai: item.thai });
  });

  cards.sort(() => 0.5 - Math.random());
  famState.memory.cards = cards;
  famState.memory.totalPairs = sampleMembers.length;

  renderFamilyMemoryGrid();
}

function renderFamilyMemoryGrid() {
  const grid = document.getElementById('fam-memory-grid');
  const movesEl = document.getElementById('fam-memory-moves');
  const pairsEl = document.getElementById('fam-memory-pairs');

  if (movesEl) movesEl.textContent = famState.memory.moves;
  if (pairsEl) pairsEl.textContent = `${famState.memory.matchedPairs} / ${famState.memory.totalPairs}`;

  if (!grid) return;
  grid.innerHTML = famState.memory.cards.map((card, idx) => `
    <div class="h-28 sm:h-32 perspective-1000 cursor-pointer"
         onclick="handleFamMemoryClick(${idx})">
      <div id="fam-mem-card-${idx}" class="w-full h-full rounded-2xl relative transition-transform duration-500 transform-style-3d border-4 border-b-6 border-slate-200 shadow-sm hover:border-rose-300">
        
        <!-- หลังการ์ด -->
        <div class="card-face card-back absolute inset-0 bg-gradient-to-br from-rose-400 to-pink-500 rounded-xl flex items-center justify-center text-white text-3xl font-bold backface-hidden shadow-inner">
          🏡
        </div>

        <!-- หน้าการ์ด -->
        <div class="card-face card-front absolute inset-0 bg-white rounded-xl flex flex-col items-center justify-center p-2 backface-hidden rotate-y-180 border-2 border-rose-200">
          <span class="${card.type === 'img' ? 'text-4xl' : 'text-xl font-black text-rose-600 font-display'} mb-1">${card.content}</span>
          <span class="text-xs text-slate-500 font-bold">${card.thai}</span>
        </div>

      </div>
    </div>
  `).join('');
}

function handleFamMemoryClick(index) {
  if (famState.memory.isLocked) return;
  const card = famState.memory.cards[index];
  const cardEl = document.getElementById(`fam-mem-card-${index}`);

  if (cardEl.classList.contains('flipped') || cardEl.classList.contains('matched')) return;

  famSounds.playPop();
  cardEl.classList.add('flipped', 'rotate-y-180');
  famSpeech.speak(card.word);

  famState.memory.flipped.push({ index, card, el: cardEl });

  if (famState.memory.flipped.length === 2) {
    famState.memory.moves++;
    document.getElementById('fam-memory-moves').textContent = famState.memory.moves;
    famState.memory.isLocked = true;

    const [first, second] = famState.memory.flipped;
    if (first.card.pairId === second.card.pairId) {
      setTimeout(() => {
        famSounds.playSuccess();
        first.el.classList.add('matched', 'border-emerald-500', 'bg-emerald-50');
        second.el.classList.add('matched', 'border-emerald-500', 'bg-emerald-50');
        famState.memory.matchedPairs++;
        document.getElementById('fam-memory-pairs').textContent = `${famState.memory.matchedPairs} / ${famState.memory.totalPairs}`;
        famState.memory.flipped = [];
        famState.memory.isLocked = false;
        addStars(2);

        if (famState.memory.matchedPairs === famState.memory.totalPairs) {
          finishFamilyMemory();
        }
      }, 500);
    } else {
      setTimeout(() => {
        famSounds.playWrong();
        first.el.classList.remove('flipped', 'rotate-y-180');
        second.el.classList.remove('flipped', 'rotate-y-180');
        famState.memory.flipped = [];
        famState.memory.isLocked = false;
      }, 1000);
    }
  }
}

function finishFamilyMemory() {
  famSounds.playSuccess();
  triggerConfetti();
  addStars(6);

  const grid = document.getElementById('fam-memory-grid');
  if (grid) {
    grid.innerHTML = `
      <div class="col-span-2 sm:col-span-4 bg-white rounded-3xl p-8 text-center border-4 border-rose-300 shadow-xl my-4">
        <div class="text-7xl mb-3 animate-bounce">💖</div>
        <h3 class="text-2xl font-black text-slate-800 font-display">เก่งมาก! จับคู่ครบทุกคู่แล้ว</h3>
        <p class="text-slate-600 my-2">จำนวนครั้งที่เปิด: <span class="font-extrabold text-rose-500 text-xl">${famState.memory.moves}</span> ครั้ง</p>
        <p class="text-emerald-600 font-bold mb-6">+6 ดาวรางวัลพิเศษ! ⭐⭐⭐</p>
        <button class="px-6 py-3 bg-rose-500 text-white font-extrabold rounded-2xl shadow-lg border-b-4 border-rose-700 hover:bg-rose-400 transition cursor-pointer"
                onclick="startFamilyMemory()">
          🔄 เล่นใหม่อีกรอบ
        </button>
      </div>
    `;
  }
}

/* ==========================================================================
   9. TAB 5: MY FAMILY ALBUM CREATOR (สร้างการ์ดครอบครัวของฉัน)
   ========================================================================== */
function renderFamilyAlbum() {
  const optionsContainer = document.getElementById('album-member-toggles');
  if (!optionsContainer) return;

  const selectableList = [
    { id: 'father', word: 'Father (คุณพ่อ)', icon: '👨' },
    { id: 'mother', word: 'Mother (คุณแม่)', icon: '👩' },
    { id: 'me', word: 'Me (ตัวฉัน)', icon: '🧒' },
    { id: 'brother', word: 'Brother (พี่/น้องชาย)', icon: '👦' },
    { id: 'sister', word: 'Sister (พี่/น้องสาว)', icon: '👧' },
    { id: 'baby', word: 'Baby (น้องเล็ก)', icon: '👶' },
    { id: 'grandpa', word: 'Grandpa (คุณปู่/คุณตา)', icon: '👴' },
    { id: 'grandma', word: 'Grandma (คุณย่า/คุณยาย)', icon: '👵' },
    { id: 'dog', word: 'Pet Dog (สุนัข)', icon: '🐶' }
  ];

  optionsContainer.innerHTML = selectableList.map(item => {
    const isSelected = famState.album.selectedMembers.includes(item.id);
    return `
      <button class="px-3.5 py-2 rounded-2xl font-bold text-xs sm:text-sm border-2 transition-all flex items-center gap-1.5 cursor-pointer ${isSelected ? 'bg-rose-500 text-white border-rose-600 shadow-md scale-105' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}"
              onclick="toggleAlbumMember('${item.id}')">
        <span>${item.icon}</span>
        <span>${item.word}</span>
        <span class="text-xs ml-1">${isSelected ? '✓' : '+'}</span>
      </button>
    `;
  }).join('');

  updateAlbumCardPreview();
}

function toggleAlbumMember(id) {
  famSounds.playPop();
  const idx = famState.album.selectedMembers.indexOf(id);
  if (idx > -1) {
    if (famState.album.selectedMembers.length <= 1) {
      alert('ต้องมีสมาชิกครอบครัวอย่างน้อย 1 คนนะจ๊ะ');
      return;
    }
    famState.album.selectedMembers.splice(idx, 1);
  } else {
    famState.album.selectedMembers.push(id);
  }
  renderFamilyAlbum();
}

function updateStudentName(name) {
  famState.album.studentName = name || 'น้องคนเก่ง';
  updateAlbumCardPreview();
}

function updateAlbumCardPreview() {
  const previewContainer = document.getElementById('album-portrait-members');
  const titleEl = document.getElementById('album-portrait-title');
  if (titleEl) {
    titleEl.textContent = `My Happy Family by ${famState.album.studentName}`;
  }

  if (!previewContainer) return;

  const iconMap = {
    father: { icon: '👨', word: 'Father' },
    mother: { icon: '👩', word: 'Mother' },
    me: { icon: '🧒', word: 'Me' },
    brother: { icon: '👦', word: 'Brother' },
    sister: { icon: '👧', word: 'Sister' },
    baby: { icon: '👶', word: 'Baby' },
    grandpa: { icon: '👴', word: 'Grandpa' },
    grandma: { icon: '👵', word: 'Grandma' },
    dog: { icon: '🐶', word: 'Puppy' }
  };

  previewContainer.innerHTML = famState.album.selectedMembers.map(id => {
    const item = iconMap[id] || { icon: '👤', word: 'Family' };
    return `
      <div class="flex flex-col items-center bg-white/80 p-3 rounded-2xl shadow-sm border border-rose-100 transform hover:scale-110 transition">
        <span class="text-5xl mb-1">${item.icon}</span>
        <span class="text-xs font-black text-slate-800 font-display">${item.word}</span>
      </div>
    `;
  }).join('');
}

function printAlbumPortrait() {
  famSounds.playSuccess();
  triggerConfetti();
  addStars(3);
  window.print();
}

/* ==========================================================================
   10. CONTROLS & INIT
   ========================================================================== */
function toggleFamSlow() {
  famState.slowSpeech = !famState.slowSpeech;
  famSounds.playPop();
  const btn = document.getElementById('btn-fam-slow');
  if (btn) {
    if (famState.slowSpeech) {
      btn.classList.add('bg-rose-500', 'text-white');
      btn.classList.remove('bg-white', 'text-slate-700');
      btn.innerHTML = '🐢 เสียงช้า (เปิดอยู่)';
    } else {
      btn.classList.remove('bg-rose-500', 'text-white');
      btn.classList.add('bg-white', 'text-slate-700');
      btn.innerHTML = '🐢 เสียงช้า';
    }
  }
}

function toggleFamSound() {
  famState.soundMuted = !famState.soundMuted;
  const btn = document.getElementById('btn-fam-sound');
  if (btn) {
    btn.textContent = famState.soundMuted ? '🔇 ปิดเสียง FX' : '🔊 เปิดเสียง FX';
  }
}

window.addEventListener('DOMContentLoaded', () => {
  loadStars();
  switchFamTab('tree');
});
