/* Isla Talks — speech play for children with apraxia (ages 3–5).
   All state is in memory only. */
(() => {
'use strict';

// ---------- Data ----------
const LEVELS = [
  { id: 1, name: 'Fun Sounds', words: [
    ['ahh','😮','ahhh'],['ooh','✨','ooooh'],['eee','🐭','eeee'],['uh-oh','🙈','uh oh'],['whee','🎢','wheee'],
    ['wow','🤩'],['mmm','🍦','mmmm'],['shhh','🤫','shhhh'],['boo','👻'],['ow','🤕','owww']]},
  { id: 2, name: 'Animal & Car Sounds', words: [
    ['moo','🐮','moooo'],['baa','🐑','baaa'],['woof','🐶','woof woof'],['meow','🐱'],['oink','🐷','oink oink'],
    ['quack','🦆','quack quack'],['hoo-hoo','🦉','hoo hoo'],['beep-beep','🚗','beep beep'],['choo-choo','🚂','choo choo'],
    ['vroom','🏎️','vroooom'],['pop','🎈']]},
  { id: 3, name: 'Double Sounds', words: [
    ['mama','👩'],['dada','👨'],['papa','👴'],['nana','👵'],['baba','🍼'],['bye-bye','👋','bye bye'],
    ['night-night','🌙','night night'],['boo-boo','🩹','boo boo'],['num-num','🍪','num num'],['yum-yum','😋','yum yum']]},
  { id: 4, name: 'Power Words', words: [
    ['more','🙌'],['up','⬆️'],['go','🟢'],['no','🙅'],['hi','🙂'],['bye','👋'],['me','🙋'],['my','🧸'],
    ['eat','🍎'],['out','🚪'],['on','💡'],['off','🌑'],['two','✌️'],['do','🖐️'],['bee','🐝'],['pie','🥧'],['bow','🎀']]},
  { id: 5, name: 'First Words', words: [
    ['ball','⚽'],['baby','👶'],['bubble','🫧'],['bath','🛁'],['puppy','🐶'],['mommy','👩'],['daddy','👨'],
    ['done','✅'],['down','⬇️'],['nose','👃'],['hat','🎩'],['hot','🔥'],['hug','🤗'],['wet','💧'],['water','🚰'],['walk','🚶']]},
];
const ALL_WORDS = LEVELS.flatMap(l => l.words.map(([w,e,say]) => ({ w, e, say: say || w, level: l.id })));
const findWord = w => ALL_WORDS.find(x => x.w === w);
const BEATS = { 'uh-oh':2,'hoo-hoo':2,'beep-beep':2,'choo-choo':2,'mama':2,'dada':2,'papa':2,'nana':2,'baba':2,'bye-bye':2,
  'night-night':2,'boo-boo':2,'num-num':2,'yum-yum':2,'baby':2,'bubble':2,'puppy':2,'mommy':2,'daddy':2,'water':2 };

const ANIMALS = [
  ['cow','🐮','moo'],['sheep','🐑','baa'],['dog','🐶','woof woof'],['cat','🐱','meow'],['pig','🐷','oink oink'],
  ['duck','🦆','quack quack'],['owl','🦉','hoo hoo'],['bee','🐝','buzz'],['snake','🐍','sss'],['horse','🐴','neigh'],
  ['lion','🦁','roar'],['monkey','🐵','ooh ooh ah ah'],['chick','🐥','peep peep'],['frog','🐸','ribbit']];

const FRIENDS = [['puppy','🐶'],['kitty','🐱'],['bunny','🐰'],['bear','🐻'],['baby','👶'],['Grandpa','👴'],['Grandma','👵'],['monkey','🐵'],['froggy','🐸']];

const VEHICLES = [
  { e:'🚗', end:'beep beep', flip:true },
  { e:'🚂', end:'choo choo', flip:true },
  { e:'🚒', end:'woo woo', flip:true },
  { e:'🚌', end:'beep beep', flip:true },
  { e:'🚀', end:'whee', flip:false },
];

const SONGS = [
  { t:'Old MacDonald', e:'🐮', lines:[
    ['Old MacDonald had a farm. And on that farm he had a cow. And the cow says','moo','🐮'],
    ['And on that farm he had a pig. And the pig says','oink oink','🐷'],
    ['With a moo moo here, and a moo moo','there','🐮']]},
  { t:'Twinkle, Twinkle', e:'⭐', lines:[
    ['Twinkle, twinkle, little','star','⭐'],
    ['How I wonder what you','are','✨'],
    ['Up above the world so','high','☁️']]},
  { t:'Row Your Boat', e:'🚣', lines:[
    ['Row, row, row your','boat','🚣'],
    ['Gently down the','stream','🌊'],
    ['Merrily, merrily, merrily, merrily. Life is but a','dream','🌙']]},
  { t:'Wheels on the Bus', e:'🚌', lines:[
    ['The wheels on the bus go round and','round','🚌'],
    ['The horn on the bus goes beep beep','beep','📯'],
    ['The baby on the bus goes wah wah','wah','👶']]},
  { t:'Ring Around the Rosie', e:'🌸', lines:[
    ['Ring around the rosie, a pocket full of posies. Ashes, ashes, we all fall','down','🌸']]},
  { t:'Peekaboo', e:'🙈', lines:[
    ['Peekaboo, I see','you','🙈'],
    ['Where is the baby? Peeka','boo','👶']]},
];

const SHAPES = [
  { k:'ahh', say:'ahhh', rx:30, ry:36, lips:false },
  { k:'ooh', say:'ooooh', rx:14, ry:17, lips:true },
  { k:'eee', say:'eeee', rx:44, ry:9, lips:false },
  { k:'mmm', say:'mmmm', rx:34, ry:2, lips:true },
  { k:'pop', say:'pop', rx:0, ry:0, pop:true },
  { k:'mwah', say:'mwah', rx:9, ry:9, lips:true },
  { k:'baa', say:'baa', rx:26, ry:28, lips:false, close:true },
  { k:'la la', say:'la la', rx:28, ry:30, tongue:true },
];

const PRAISE = ['Yay!','Good trying!','Nice talking!','You did it!','Great job!','Wow!','Hooray!','Yay, Isla!','Good job, Isla!'];
const STICKERS = ['🦄','🐳','🦖','🌈','🚀','🐞','🍓','🦋','🐙','🌻','🦒','🍩'];
const CONFETTI_COLORS = ['#FF7A59','#4FB3E8','#FFC24A','#5DBB7E','#9A7BE0','#F27BAA'];

// ---------- State (in memory) ----------
const state = {
  stars: 0,
  tries: {},
  rate: 0.75,
  wait: 5,
  voice: null,
  voiceName: null,
  natural: true,
  focus: new Set(['more','up','go','no','hi','bye','mama','moo','whee','uh-oh']),
  current: null,       // current target word for "Say it again" / "She tried"
  replay: null,        // function to replay the model
  cleanup: [],         // timers / handlers to clear on leaving a game
};

// ---------- Helpers ----------
const $ = (s, r = document) => r.querySelector(s);
const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; };
const sleep = ms => new Promise(r => { const t = setTimeout(r, ms); state.cleanup.push(() => clearTimeout(t)); });
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
// ---------- Saved progress (this device only) ----------
const STORE_KEY = 'islaTalks.v1';
let store = null;
try { store = window.localStorage; store.setItem('__t', '1'); store.removeItem('__t'); } catch (e) { store = null; }
function save() {
  if (!store) return;
  try {
    store.setItem(STORE_KEY, JSON.stringify({
      stars: state.stars, tries: state.tries, rate: state.rate, wait: state.wait,
      natural: state.natural, voiceName: state.voice ? state.voice.name : state.voiceName,
      focus: [...state.focus],
    }));
  } catch (e) {}
}
(function load() {
  if (!store) return;
  try {
    const d = JSON.parse(store.getItem(STORE_KEY) || 'null');
    if (!d) return;
    state.stars = d.stars || 0; state.tries = d.tries || {};
    if (d.rate) state.rate = d.rate; if (d.wait) state.wait = d.wait;
    if (typeof d.natural === 'boolean') state.natural = d.natural;
    state.voiceName = d.voiceName || null;
    if (Array.isArray(d.focus)) state.focus = new Set(d.focus);
  } catch (e) {}
})();

let runId = 0; // bumps whenever a game is left, cancelling async sequences
const alive = id => id === runId;

// ---------- Speech ----------
// Natural recorded voice clips (audio/clips.js) with the device voice as a fallback.
const CLIPS = window.ISLA_CLIPS || {};
const clipKey = t => {
  let k = t.toLowerCase().replace(/[’']/g, '').replace(/[^a-z?! ]/g, ' ');
  const end = /[?!]\s*$/.test(k) ? k.trim().slice(-1) : '';
  return k.replace(/[?!]/g, ' ').replace(/\s+/g, ' ').trim() + end;
};
const player = new Audio();
player.preload = 'auto';
player.preservesPitch = true; player.webkitPreservesPitch = true; player.mozPreservesPitch = true;
let playerDone = null;

const synth = 'speechSynthesis' in window ? window.speechSynthesis : null;
const PREFERRED = ['Samantha','Ava','Allison','Google US English','Microsoft Aria','Microsoft Jenny','Karen','Moira','Tessa','Victoria'];
let deviceVoices = [];
function loadVoices() {
  const sel = $('#voice');
  deviceVoices = synth ? synth.getVoices().filter(v => /^en/i.test(v.lang)) : [];
  if (!state.voice && deviceVoices.length) {
    state.voice = (state.voiceName && deviceVoices.find(v => v.name === state.voiceName))
      || PREFERRED.map(n => deviceVoices.find(v => v.name.includes(n))).find(Boolean)
      || deviceVoices.find(v => v.lang === 'en-US') || deviceVoices[0];
  }
  sel.innerHTML = '';
  const nat = el('option'); nat.value = 'natural'; nat.textContent = 'Natural voice (recommended)';
  sel.appendChild(nat);
  deviceVoices.forEach((v, i) => {
    const o = el('option'); o.value = i; o.textContent = `Device: ${v.name}`;
    sel.appendChild(o);
  });
  if (!state.natural && state.voice) {
    const i = deviceVoices.findIndex(v => v.name === state.voice.name);
    if (i >= 0) sel.value = String(i);
  } else sel.value = 'natural';
  sel.onchange = () => {
    if (sel.value === 'natural') { state.natural = true; }
    else { state.natural = false; state.voice = deviceVoices[+sel.value]; state.voiceName = state.voice.name; }
    save(); hush(); speak('Hi! Let’s play.');
  };
}
if (synth) { synth.onvoiceschanged = loadVoices; }

// Talking-speed slider (0.5–1) maps to clip playback 0.75x–1.05x
const clipRate = () => Math.max(0.7, Math.min(1.1, 0.6 * state.rate + 0.45));

function playClip(file) {
  return new Promise(resolve => {
    let done = false;
    const fin = ok => { if (!done) { done = true; clearTimeout(t); playerDone = null; resolve(ok); } };
    playerDone = fin;
    player.onended = () => fin(true);
    player.onerror = () => fin(false);
    player.src = 'audio/' + file;
    player.playbackRate = clipRate();
    player.defaultPlaybackRate = clipRate();
    const t = setTimeout(() => fin(true), 15000);
    const p = player.play();
    if (p && p.catch) p.catch(() => fin(false));
  });
}

function speakDevice(text, opts = {}) {
  return new Promise(resolve => {
    if (!synth) { setTimeout(resolve, 500 + text.length * 60); return; }
    // Isla is said with a long I ("EYE-la"); spell it phonetically for the voice only
    const u = new SpeechSynthesisUtterance(text.replace(/\bIsla\b/g, 'Eye-la'));
    u.rate = opts.rate ?? state.rate;
    u.pitch = opts.pitch ?? 1.1;
    u.lang = 'en-US';
    if (state.voice) u.voice = state.voice;
    let done = false;
    const fin = () => { if (!done) { done = true; resolve(); } };
    u.onend = fin; u.onerror = fin;
    setTimeout(fin, 900 + (text.length * 130) / u.rate); // iOS sometimes skips onend
    synth.speak(u);
  });
}

async function speak(text, opts = {}) {
  const file = state.natural ? CLIPS[clipKey(text)] : null;
  if (file) {
    const ok = await playClip(file);
    if (ok) return;
  }
  return speakDevice(text, opts);
}
function hush() {
  if (synth) synth.cancel();
  try { player.pause(); } catch (e) {}
  if (playerDone) playerDone(true);
}

// ---------- Isla buddy ----------
const POSES = { wave:'isla/wave.webp', cheer:'isla/cheer.webp', listen:'isla/listen.webp', peek:'isla/peek.webp' };
Object.values(POSES).forEach(src => { const i = new Image(); i.src = src; });
let buddyTimer = null;
function showBuddy(pose, say, ms) {
  const b = $('#buddy');
  clearTimeout(buddyTimer);
  $('#buddyImg').src = POSES[pose];
  $('#buddySay').textContent = say;
  b.classList.toggle('cheer', pose === 'cheer');
  b.classList.add('show');
  if (ms) buddyTimer = setTimeout(hideBuddy, ms);
}
function hideBuddy() { clearTimeout(buddyTimer); $('#buddy').classList.remove('show','cheer'); }

// ---------- Her-turn wait indicator ----------
let turnTimer = null;
function herTurn(seconds = state.wait) {
  return new Promise(resolve => {
    const box = $('#turn'), dots = $('#turnDots');
    clearInterval(turnTimer);
    dots.innerHTML = '';
    for (let i = 0; i < seconds; i++) dots.appendChild(el('i'));
    box.hidden = false;
    $('#triedBtn').classList.add('glow');
    showBuddy('listen', 'Your turn!');
    let n = 0;
    const id = runId;
    turnTimer = setInterval(() => {
      if (!alive(id)) { clearInterval(turnTimer); resolve(false); return; }
      dots.children[n] && dots.children[n].classList.add('on');
      n++;
      if (n > seconds) { clearInterval(turnTimer); endTurn(); resolve(true); }
    }, 1000);
    state._turnResolve = resolve;
  });
}
function endTurn(val = true) {
  clearInterval(turnTimer);
  $('#turn').hidden = true;
  $('#triedBtn').classList.remove('glow');
  if (!$('#buddy').classList.contains('cheer')) hideBuddy();
  if (state._turnResolve) { const r = state._turnResolve; state._turnResolve = null; r(val); }
}

// ---------- Rewards ----------
function updateStars() {
  document.querySelectorAll('.star-count').forEach(n => n.textContent = state.stars);
  document.querySelectorAll('.stars').forEach(n => { n.classList.remove('bump'); void n.offsetWidth; n.classList.add('bump'); });
}
function confetti(n = 36) {
  const box = $('#confetti');
  for (let i = 0; i < n; i++) {
    const c = el('div', 'cf' + (i % 6 === 0 ? ' s' : ''));
    if (i % 6 === 0) c.textContent = '⭐';
    c.style.left = Math.random() * 100 + 'vw';
    c.style.background = pick(CONFETTI_COLORS);
    c.style.animationDuration = 1.6 + Math.random() * 1.6 + 's';
    c.style.animationDelay = Math.random() * 0.3 + 's';
    box.appendChild(c);
    setTimeout(() => c.remove(), 3800);
  }
}
function tried() {
  const word = state.current || 'play';
  state.stars++;
  state.tries[word] = (state.tries[word] || 0) + 1;
  save();
  updateStars();
  confetti();
  const praise = pick(PRAISE);
  showBuddy('cheer', praise, 2000);
  endTurn();
  hush();
  setTimeout(() => speak(praise, { rate: Math.min(1, state.rate + 0.15), pitch: 1.25 }), 60);
  if (state.stars % 5 === 0) {
    setTimeout(() => {
      $('#stickerEmoji').textContent = pick(STICKERS);
      $('#sticker').hidden = false;
      confetti(60);
      setTimeout(() => { $('#sticker').hidden = true; }, 2200);
    }, 700);
  }
}
$('#sticker').addEventListener('click', () => { $('#sticker').hidden = true; });

function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.hidden = false;
  clearTimeout(toast._t); toast._t = setTimeout(() => t.hidden = true, 2200);
}

// ---------- Navigation ----------
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.toggle('active', s.id === id));
}
function leaveGame() {
  runId++;
  hush();
  endTurn();
  state.cleanup.forEach(f => { try { f(); } catch (e) {} });
  state.cleanup = [];
  state.current = null; state.replay = null;
  hideBuddy();
  $('#gameBody').innerHTML = '';
}
const GAMES = { cards: gameCards, bubbles: gameBubbles, race: gameRace, animals: gameAnimals, peek: gamePeek, songs: gameSongs, mouth: gameMouth, blocks: gameBlocks };
const TITLES = { cards:'Word Cards', bubbles:'Bubble Pop', race:'Ready, Set, Go', animals:'Animal Bag', peek:'Peekaboo', songs:'Sing Along', mouth:'Silly Mouths', blocks:'Up and Down' };
function openGame(key) {
  leaveGame();
  $('#gameTitle').textContent = TITLES[key];
  showScreen('game');
  GAMES[key]($('#gameBody'));
}

$('#startBtn').addEventListener('click', () => {
  // Unlock speech on iOS with a user gesture
  loadVoices();
  speak('Hi Isla! Let’s play!', { rate: 0.9 });
  showScreen('home');
});
document.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => openGame(b.dataset.go)));
$('#backBtn').addEventListener('click', () => { leaveGame(); showScreen('home'); });
$('#againBtn').addEventListener('click', () => { endTurn(false); hush(); if (state.replay) state.replay(); });
$('#triedBtn').addEventListener('click', tried);

// Grown-ups: press and hold
(() => {
  const b = $('#grownBtn'); let t = null;
  const start = e => { e.preventDefault(); b.classList.add('holding'); t = setTimeout(() => { b.classList.remove('holding'); openGrown(); }, 1400); };
  const stop = () => { if (t) { clearTimeout(t); t = null; if (b.classList.contains('holding')) toast('Press and hold to open'); } b.classList.remove('holding'); };
  b.addEventListener('pointerdown', start);
  ['pointerup','pointerleave','pointercancel'].forEach(ev => b.addEventListener(ev, stop));
  b.addEventListener('contextmenu', e => e.preventDefault());
})();
$('#grownBack').addEventListener('click', () => showScreen('home'));

// ---------- Game: Word Cards ----------
function gameCards(root) {
  const tabs = el('div', 'tabs');
  const grid = el('div', 'card-grid');
  root.append(tabs, grid);
  const groups = [{ id: 'today', name: '⭐ Today' }, ...LEVELS.map(l => ({ id: l.id, name: `${l.id}. ${l.name}` }))];
  let active = 'today';
  function renderTabs() {
    tabs.innerHTML = '';
    groups.forEach(g => {
      const t = el('button', 'tab' + (g.id === active ? ' on' : ''), g.name);
      t.onclick = () => { active = g.id; renderTabs(); renderGrid(); };
      tabs.appendChild(t);
    });
  }
  function renderGrid() {
    grid.innerHTML = '';
    const list = active === 'today' ? ALL_WORDS.filter(w => state.focus.has(w.w)) : ALL_WORDS.filter(w => w.level === active);
    if (!list.length) { grid.appendChild(el('div', 'empty', 'No words picked for today yet. A grown-up can choose them in the Grown-ups Corner.')); return; }
    list.forEach(w => {
      const c = el('button', 'wcard', `<span class="e">${w.e}</span><span class="w">${w.w}</span><span class="n">${state.tries[w.w] ? '⭐'.repeat(Math.min(5, state.tries[w.w])) : ''}</span>`);
      c.onclick = () => openCard(w);
      grid.appendChild(c);
    });
  }
  state.current = null;
  state.replay = () => speak('Pick a picture.');
  function openCard(w) {
    const f = el('div', 'focus');
    const beats = BEATS[w.w] || 1;
    f.innerHTML = `<button class="close" aria-label="Close">✕</button>
      <div class="big-e">${w.e}</div>
      <div class="big-w">${w.w}</div>
      <div class="beats">${'<i></i>'.repeat(beats)}</div>
      <p class="tip">Say it together, slowly. Then wait for her turn.</p>`;
    root.appendChild(f);
    const close = () => { runId++; hush(); endTurn(); f.remove(); renderGrid(); state.current = null; state.replay = () => speak('Pick a picture.'); };
    f.querySelector('.close').onclick = close;
    f.querySelector('.big-e').onclick = () => model();
    state.current = w.w;
    const model = async () => {
      const id = ++runId;
      endTurn();
      const e = f.querySelector('.big-e'), dots = [...f.querySelectorAll('.beats i')];
      for (let rep = 0; rep < 2; rep++) {
        if (!alive(id)) return;
        e.classList.remove('talk'); void e.offsetWidth; e.classList.add('talk');
        dots.forEach((d, i) => setTimeout(() => { d.classList.add('hit'); setTimeout(() => d.classList.remove('hit'), 280); }, i * 380));
        await speak(w.say);
        await sleep(650);
      }
      if (alive(id)) herTurn();
    };
    state.replay = model;
    setTimeout(model, 350);
  }
  renderTabs(); renderGrid();
}

// ---------- Game: Bubble Pop ----------
function gameBubbles(root) {
  const field = el('div', 'bubble-field');
  root.appendChild(field);
  let left = 0;
  state.current = 'pop';
  state.replay = () => speak('pop!', { rate: 0.85 });
  function blow(n = 9) {
    const id = runId;
    field.querySelector('.center-prompt')?.remove();
    left = n;
    for (let i = 0; i < n; i++) {
      const t = setTimeout(() => {
        if (!alive(id)) return;
        const size = 90 + Math.random() * 80;
        const b = el('button', 'bubble');
        b.setAttribute('aria-label', 'bubble');
        b.style.width = b.style.height = size + 'px';
        b.style.left = (5 + Math.random() * 78) + '%';
        b.style.animationDuration = (7 + Math.random() * 4) + 's';
        b.addEventListener('pointerdown', ev => {
          if (b.classList.contains('popped')) return;
          b.classList.add('popped');
          const r = field.getBoundingClientRect(), br = b.getBoundingClientRect();
          const w = el('div', 'pop-word', 'pop!');
          w.style.left = (br.left - r.left + br.width / 2) + 'px';
          w.style.top = (br.top - r.top + br.height / 2) + 'px';
          field.appendChild(w); setTimeout(() => w.remove(), 900);
          hush(); speak('pop!', { rate: 0.9, pitch: 1.3 });
          setTimeout(() => { b.remove(); gone(); }, 250);
        });
        b.addEventListener('animationend', e => { if (e.animationName === 'rise') { b.remove(); gone(); } });
        field.appendChild(b);
      }, i * 650);
      state.cleanup.push(() => clearTimeout(t));
    }
  }
  function gone() { left--; if (left <= 0) askMore(); }
  async function askMore() {
    const id = runId;
    state.current = 'more';
    const p = el('div', 'center-prompt', `<div class="prompt-text">More bubbles?</div><button class="big-btn b-sky pulse">more</button>`);
    field.appendChild(p);
    p.querySelector('button').onclick = () => { endTurn(); hush(); speak('more!', { rate: 0.85 }); state.current = 'pop'; state.replay = () => speak('pop!', { rate: 0.85 }); blow(); };
    state.replay = async () => { await speak('more?'); if (alive(id)) herTurn(); };
    await sleep(300);
    if (!alive(id)) return;
    await speak('Uh oh. All gone. More?');
    if (alive(id)) herTurn();
  }
  (async () => { const id = runId; await speak('Pop the bubbles!', { rate: 0.85 }); if (alive(id)) blow(); })();
}

// ---------- Game: Ready, Set, Go ----------
function gameRace(root) {
  root.innerHTML = `<div class="race">
      <div class="race-words"><span class="rw" data-w="ready">Ready…</span><span class="rw" data-w="set">set…</span><span class="rw" data-w="go">GO!</span></div>
      <div class="road"><span class="flag">🏁</span><span class="vehicle" id="veh">🚗</span></div>
      <div class="race-controls" id="rc"></div>
    </div>`;
  const veh = $('#veh', root), rc = $('#rc', root);
  let vi = 0, launched = false;
  const words = w => root.querySelectorAll('.rw').forEach(n => n.classList.toggle('on', n.dataset.w === w));
  state.current = 'go';
  function setVehicle() {
    const v = VEHICLES[vi % VEHICLES.length];
    veh.textContent = v.e;
    veh.classList.toggle('flip-no', !v.flip);
    veh.classList.remove('zoom'); veh.style.left = '12px';
    return v;
  }
  function startBtn() {
    rc.innerHTML = '';
    const b = el('button', 'big-btn b-coral', 'Start');
    b.onclick = round; rc.appendChild(b);
  }
  async function round() {
    const id = runId; launched = false;
    const v = setVehicle();
    rc.innerHTML = '';
    words('ready'); await speak('Ready…', { rate: state.rate * 0.9 }); if (!alive(id)) return;
    await sleep(500);
    words('set'); await speak('set…', { rate: state.rate * 0.9 }); if (!alive(id)) return;
    veh.classList.add('wiggle');
    const go = el('button', 'big-btn b-leaf pulse', 'GO!');
    go.onclick = () => launch(v, true);
    rc.appendChild(go);
    state.replay = async () => { await speak('Ready… set…'); if (alive(id) && !launched) { const w = await herTurn(); if (w && alive(id) && !launched) launch(v, false); } };
    const waited = await herTurn();
    if (alive(id) && !launched && waited) launch(v, false);
  }
  async function launch(v, byHer) {
    if (launched) return; launched = true;
    const id = runId;
    endTurn(); hush();
    words('go'); rc.innerHTML = '';
    veh.classList.remove('wiggle');
    speak('Go!', { rate: 0.95, pitch: 1.3 });
    const road = veh.parentElement;
    veh.classList.add('zoom');
    requestAnimationFrame(() => { veh.style.left = (road.clientWidth - veh.clientWidth - 20) + 'px'; });
    await sleep(1900); if (!alive(id)) return;
    await speak(v.end, { rate: 0.85 });
    words(''); vi++;
    state.replay = () => speak('go!');
    rc.innerHTML = '';
    const again = el('button', 'big-btn b-coral', 'Again!');
    again.onclick = round; rc.appendChild(again);
  }
  state.replay = () => speak('Ready, set, go!');
  setVehicle(); startBtn();
}

// ---------- Game: Animal Bag ----------
function gameAnimals(root) {
  root.innerHTML = `<div class="animals">
      <div class="bagwrap" id="bagwrap">
      <button class="bag" id="bag" aria-label="Animal bag">
        <svg viewBox="0 0 200 200" aria-hidden="true">
          <path d="M40 70 Q100 40 160 70 L172 170 Q100 196 28 170 Z" fill="#C98B4E"/>
          <path d="M40 70 Q100 40 160 70 Q100 90 40 70Z" fill="#8E5B2C"/>
          <path d="M70 62 Q100 30 130 62" stroke="#8E5B2C" stroke-width="10" fill="none" stroke-linecap="round"/>
          <circle cx="100" cy="128" r="16" fill="#FFC24A"/>
          <text x="100" y="135" text-anchor="middle" font-size="20" font-weight="800" fill="#2E2A3B">?</text>
        </svg>
      </button>
      </div>
      <div class="animal-say" id="asay"></div>
      <div class="mini-row" id="arow"></div>
    </div>`;
  const bag = $('#bag', root), say = $('#asay', root), row = $('#arow', root);
  let current = null, used = [];
  const hint = () => { say.textContent = ''; row.innerHTML = '<p class="muted" style="font-size:20px;font-weight:800">Tap the bag</p>'; };
  hint();
  state.current = null;
  state.replay = () => speak('What’s in the bag?');
  bag.onclick = async () => {
    if (current) return;
    const id = ++runId;
    endTurn();
    bag.classList.remove('shake'); void bag.offsetWidth; bag.classList.add('shake');
    await sleep(500); if (!alive(id)) return;
    if (used.length >= ANIMALS.length) used = [];
    const pool = ANIMALS.filter(a => !used.includes(a[0]));
    const a = pick(pool); used.push(a[0]);
    current = a;
    state.current = a[2];
    const out = el('button', 'out-animal', a[1]);
    out.setAttribute('aria-label', a[0]);
    $('#bagwrap', root).appendChild(out);
    const model = async () => {
      const mid = ++runId; endTurn();
      for (let i = 0; i < 2; i++) {
        if (!alive(mid)) return;
        out.classList.remove('talk'); void out.offsetWidth; out.classList.add('talk');
        say.textContent = a[2];
        await speak(a[2]);
        await sleep(500);
      }
      if (alive(mid)) herTurn();
    };
    out.onclick = model;
    state.replay = model;
    row.innerHTML = '';
    const bye = el('button', 'btn-sm', '👋 Bye-bye');
    bye.onclick = async () => {
      const bid = ++runId; endTurn(); hush();
      state.current = 'bye-bye';
      say.textContent = 'bye-bye!';
      out.classList.add('goback');
      await speak('bye bye ' + a[0]);
      if (!alive(bid)) return;
      out.remove(); current = null; hint();
      state.current = null; state.replay = () => speak('What’s in the bag?');
    };
    row.appendChild(bye);
    await speak((/^[aeiou]/.test(a[0]) ? 'It’s an ' : 'It’s a ') + a[0] + '!', { rate: Math.min(1, state.rate + 0.1) });
    if (alive(id)) model();
  };
}

// ---------- Game: Peekaboo ----------
function gamePeek(root) {
  root.innerHTML = `<div class="peek">
      <div class="peek-line" id="pline"></div>
      <div class="stage"><div class="friend" id="friend"></div><button class="blanket wiggle" id="blanket" aria-label="Blanket"><span>👀</span></button></div>
      <div class="mini-row" id="prow"></div>
    </div>`;
  const line = $('#pline', root), friend = $('#friend', root), blanket = $('#blanket', root), row = $('#prow', root);
  let f = null, last = null, open = false, round = 0, islaMode = false;
  async function hide() {
    const id = ++runId; endTurn();
    open = false;
    row.innerHTML = '';
    islaMode = round % 2 === 0; round++;
    friend.classList.remove('boo');
    if (islaMode) {
      f = ['Isla'];
      friend.classList.add('isla');
      friend.innerHTML = '<img class="peek-isla" src="isla/peek.webp" alt="Isla hiding her eyes">';
      blanket.classList.remove('wiggle'); blanket.classList.add('down');
      friend.onclick = reveal;
    } else {
      friend.classList.remove('isla'); friend.onclick = null;
      blanket.classList.remove('down'); blanket.classList.add('wiggle');
      await sleep(500); if (!alive(id)) return;
      do { f = pick(FRIENDS); } while (f[0] === last && FRIENDS.length > 1);
      last = f[0];
      friend.textContent = f[1];
    }
    if (!alive(id)) return;
    state.current = 'boo';
    line.textContent = `Where’s ${f[0]}?`;
    const model = async () => { const mid = ++runId; endTurn(); await speak(`Where’s ${f[0]}?`); if (alive(mid) && !open) herTurn(); };
    state.replay = model;
    model();
  }
  async function reveal() {
    if (open) return; open = true;
    const id = ++runId; endTurn(); hush();
    blanket.classList.remove('wiggle'); blanket.classList.add('down');
    if (islaMode) friend.innerHTML = '<img class="peek-isla" src="isla/wave.webp" alt="Isla waving">';
    friend.classList.remove('boo'); void friend.offsetWidth; friend.classList.add('boo');
    line.textContent = 'BOO!';
    await speak('Boo!', { rate: 0.9, pitch: 1.35 });
    if (!alive(id)) return;
    await sleep(250);
    line.textContent = `There’s ${f[0]}!`;
    await speak(`There’s ${f[0]}!`, { rate: Math.min(1, state.rate + 0.1) });
    if (!alive(id)) return;
    state.replay = () => speak('Boo!');
    const again = el('button', 'big-btn b-grape', 'Again!');
    again.onclick = hide;
    row.appendChild(again);
  }
  blanket.onclick = reveal;
  hide();
}

// ---------- Game: Sing Along ----------
function gameSongs(root) {
  function list() {
    runId++; endTurn(); hush();
    state.current = null; state.replay = () => speak('Pick a song.');
    root.innerHTML = '';
    const wrap = el('div', 'songs');
    wrap.appendChild(el('p', 'muted', 'The song stops before the last word. Wait for her to fill it in, then tap the yellow box.'));
    const grid = el('div', 'song-list');
    SONGS.forEach((s, i) => {
      const b = el('button', 'song', `<span class="e">${s.e}</span><span><b>${s.t}</b><small>${s.lines.length} ${s.lines.length > 1 ? 'parts' : 'part'}</small></span>`);
      b.onclick = () => sing(i, 0);
      grid.appendChild(b);
    });
    wrap.appendChild(grid);
    root.appendChild(wrap);
  }
  async function sing(si, li) {
    const id = ++runId; endTurn(); hush();
    const s = SONGS[si], [text, word, emo] = s.lines[li];
    root.innerHTML = `<div class="sing">
        <div class="e">${emo}</div>
        <div class="lyric">${text} <button class="blank" id="blank">&nbsp;?&nbsp;</button></div>
        <div class="mini-row" id="srow"><button class="btn-sm" id="slist">🎵 All songs</button></div>
      </div>`;
    const blank = $('#blank', root), row = $('#srow', root);
    $('#slist', root).onclick = list;
    state.current = word;
    let filled = false;
    const fill = async () => {
      if (filled) return; filled = true;
      const fid = ++runId; endTurn(); hush();
      blank.classList.remove('wait'); blank.classList.add('filled'); blank.textContent = word;
      await speak(word, { rate: 0.8, pitch: 1.2 });
      if (!alive(fid)) return;
      state.replay = async () => { await speak(text); await speak(word); };
      const next = li + 1 < s.lines.length ? [si, li + 1] : [(si + 1) % SONGS.length, 0];
      const nb = el('button', 'big-btn b-coral', li + 1 < s.lines.length ? 'Next' : 'Next song');
      nb.style.fontSize = '32px'; nb.style.padding = '18px 40px';
      nb.onclick = () => sing(...next);
      row.prepend(nb);
    };
    blank.onclick = fill;
    const model = async () => {
      const mid = ++runId; endTurn();
      if (filled) { await speak(text); if (alive(mid)) await speak(word); return; }
      blank.classList.remove('wait');
      await speak(text, { rate: Math.max(0.6, state.rate) });
      if (!alive(mid) || filled) return;
      blank.classList.add('wait');
      const waited = await herTurn(state.wait + 1);
      if (alive(mid) && waited && !filled) fill();
    };
    state.replay = model;
    await sleep(300);
    if (alive(id)) model();
  }
  list();
}

// ---------- Game: Silly Mouths ----------
function gameMouth(root) {
  root.innerHTML = `<div class="mouth">
      <svg class="face" viewBox="0 0 200 200" aria-label="Cartoon face">
        <circle cx="100" cy="100" r="92" fill="#FFD8B5"/>
        <circle cx="48" cy="120" r="14" fill="#F9A8A0" opacity=".6"/>
        <circle cx="152" cy="120" r="14" fill="#F9A8A0" opacity=".6"/>
        <g id="eyes"><ellipse cx="70" cy="80" rx="10" ry="13" fill="#2E2A3B"/><ellipse cx="130" cy="80" rx="10" ry="13" fill="#2E2A3B"/>
          <circle cx="73" cy="76" r="3.5" fill="#fff"/><circle cx="133" cy="76" r="3.5" fill="#fff"/></g>
        <path id="smile" d="M70 132 Q100 156 130 132" stroke="#B5384E" stroke-width="7" fill="none" stroke-linecap="round"/>
        <ellipse id="lipRing" cx="100" cy="138" rx="0" ry="0" fill="#E8607A"/>
        <ellipse id="mouthHole" cx="100" cy="138" rx="0" ry="0" fill="#5A1E2C"/>
        <ellipse id="tongue" cx="100" cy="150" rx="0" ry="0" fill="#F27BAA"/>
        <rect id="teeth" x="80" y="120" width="40" height="0" rx="3" fill="#fff"/>
      </svg>
      <div class="mouth-word" id="mword"></div>
      <div class="shape-row" id="shapes"></div>
      <p class="muted" style="text-align:center;margin:0">Make the faces together. Sit by a mirror so she can see her own mouth too.</p>
    </div>`;
  const hole = $('#mouthHole', root), ring = $('#lipRing', root), smile = $('#smile', root), tongue = $('#tongue', root), teeth = $('#teeth', root), word = $('#mword', root);
  const cur = { rx: 0, ry: 0, lr: 0, ly: 0, t: 0, th: 0, s: 1 };
  let raf = null;
  function tween(to, ms = 260) {
    return new Promise(res => {
      cancelAnimationFrame(raf);
      const from = { ...cur }, t0 = performance.now();
      const step = now => {
        const k = Math.min(1, (now - t0) / ms), e = 1 - Math.pow(1 - k, 3);
        for (const key in to) cur[key] = from[key] + (to[key] - from[key]) * e;
        hole.setAttribute('rx', cur.rx); hole.setAttribute('ry', cur.ry);
        ring.setAttribute('rx', cur.lr); ring.setAttribute('ry', cur.ly);
        tongue.setAttribute('rx', cur.t); tongue.setAttribute('ry', cur.t * 0.6);
        teeth.setAttribute('height', cur.th);
        smile.style.opacity = cur.s;
        if (k < 1) raf = requestAnimationFrame(step); else res();
      };
      raf = requestAnimationFrame(step);
    });
  }
  const rest = () => tween({ rx: 0, ry: 0, lr: 0, ly: 0, t: 0, th: 0, s: 1 });
  const shapeTo = s => {
    const lip = s.lips ? 8 : 4;
    return tween({ rx: s.rx, ry: s.ry, lr: s.rx ? s.rx + lip : (s.lips ? 30 : 0), ly: s.ry + lip, t: s.tongue ? 14 : 0, th: s.k === 'eee' ? 6 : 0, s: 0 });
  };
  async function doShape(s, btn) {
    const id = ++runId; endTurn(); hush();
    root.querySelectorAll('.shape').forEach(b => b.classList.toggle('on', b === btn));
    state.current = s.k;
    word.textContent = s.k;
    if (s.pop) {
      await tween({ rx: 0, ry: 0, lr: 30, ly: 6, s: 0, t: 0, th: 0 }, 220);
      await sleep(350); if (!alive(id)) return;
      tween({ rx: 14, ry: 14, lr: 22, ly: 22 }, 120);
      await speak('pop!', { rate: 0.9 });
    } else if (s.close) {
      await tween({ rx: 0, ry: 0, lr: 30, ly: 6, s: 0 }, 200);
      await sleep(250); if (!alive(id)) return;
      shapeTo(s);
      await speak(s.say);
    } else if (s.tongue) {
      shapeTo(s);
      await speak(s.say);
    } else {
      shapeTo(s);
      await speak(s.say);
    }
    await sleep(500); if (!alive(id)) return;
    await rest();
    if (alive(id)) herTurn();
  }
  const row = $('#shapes', root);
  SHAPES.forEach(s => {
    const b = el('button', 'shape', s.k);
    b.onclick = () => doShape(s, b);
    row.appendChild(b);
  });
  state.current = null;
  state.replay = () => { const on = root.querySelector('.shape.on'); if (on) on.click(); else speak('Pick a silly mouth.'); };
  speak('Let’s make silly mouths!', { rate: Math.min(1, state.rate + 0.1) });
}

// ---------- Game: Up and Down (blocks) ----------
function gameBlocks(root) {
  root.innerHTML = `<div class="blocks">
      <div class="block-word" id="bword"></div>
      <div class="tower" id="tower"></div>
      <div class="floor"></div>
    </div>
    <div class="block-btns" id="bbtns">
      <button class="big-btn b-leaf" id="addB" style="font-size:34px;padding:18px 40px">⬆️ up</button>
      <button class="big-btn b-coral" id="crashB" style="font-size:34px;padding:18px 40px">💥 down</button>
    </div>`;
  const tower = $('#tower', root), word = $('#bword', root);
  const colors = ['#FF7A59','#4FB3E8','#FFC24A','#5DBB7E','#9A7BE0','#F27BAA','#3CC4B4'];
  const max = () => Math.max(4, Math.floor((root.clientHeight - 200) / 70));
  state.current = 'up';
  state.replay = () => speak(state.current === 'down' ? 'down!' : 'up!');
  $('#addB', root).onclick = async () => {
    const id = ++runId; endTurn(); hush();
    if (tower.children.length >= max()) { crash(); return; }
    const b = el('div', 'blk'); b.style.background = colors[tower.children.length % colors.length];
    tower.appendChild(b);
    state.current = 'up';
    word.textContent = 'up!';
    await speak('up!', { rate: 0.85, pitch: 1.1 + tower.children.length * 0.05 });
    if (tower.children.length >= 4) tower.classList.add('wobble');
    if (tower.children.length >= max() && alive(id)) { word.textContent = 'uh-oh…'; await speak('uh oh'); }
  };
  async function crash() {
    if (!tower.children.length) return;
    const id = ++runId; endTurn(); hush();
    state.current = 'down';
    tower.classList.remove('wobble');
    [...tower.children].forEach((b, i) => {
      const dir = i % 2 ? 1 : -1;
      b.classList.add('fall');
      requestAnimationFrame(() => { b.style.transform = `translate(${dir * (80 + Math.random() * 160)}px, ${120 + i * 10}px) rotate(${dir * (40 + Math.random() * 90)}deg)`; });
    });
    word.textContent = 'down!';
    await speak('Uh oh! Down!', { rate: 0.85, pitch: 1.25 });
    await sleep(500);
    tower.innerHTML = '';
    if (alive(id)) { word.textContent = ''; herTurn(); }
  }
  $('#crashB', root).onclick = crash;
  speak('Let’s build it up!', { rate: Math.min(1, state.rate + 0.1) });
}

// ---------- Grown-ups corner ----------
function openGrown() {
  renderTries(); renderFocus();
  showScreen('grown');
}
function renderTries() {
  const ul = $('#triesList'); ul.innerHTML = '';
  const entries = Object.entries(state.tries).sort((a, b) => b[1] - a[1]);
  $('#triesSummary').innerHTML = entries.length
    ? `<b>${state.stars}</b> star${state.stars === 1 ? '' : 's'} so far. Here’s what she tried:`
    : 'No tries yet. Tap ⭐ <b>She tried</b> any time she makes a sound or tries a word. Every attempt counts.';
  entries.forEach(([w, n]) => ul.appendChild(el('li', '', `${w} <b>×${n}</b>`)));
}
function renderFocus() {
  const g = $('#focusGrid'); g.innerHTML = '';
  LEVELS.forEach(l => {
    g.appendChild(el('div', 'chip-group', `${l.id}. ${l.name}`));
    l.words.forEach(([w, e]) => {
      const c = el('button', 'chip' + (state.focus.has(w) ? ' on' : ''), `<span>${e}</span>${w}`);
      c.setAttribute('aria-pressed', state.focus.has(w));
      c.onclick = () => {
        if (state.focus.has(w)) state.focus.delete(w); else state.focus.add(w);
        save();
        c.classList.toggle('on'); c.setAttribute('aria-pressed', state.focus.has(w));
      };
      g.appendChild(c);
    });
  });
}
const rateLabel = r => r <= 0.6 ? 'Extra slow' : r <= 0.8 ? 'Slow' : r <= 0.9 ? 'Gentle' : 'Normal';
$('#rate').addEventListener('input', e => { state.rate = +e.target.value; $('#rateOut').textContent = rateLabel(state.rate); save(); });
$('#wait').addEventListener('change', e => { state.wait = +e.target.value; save(); });
$('#resetBtn').addEventListener('click', () => {
  if (!confirm('Clear all stars and tries on this device?')) return;
  state.stars = 0; state.tries = {}; save(); updateStars(); renderTries(); toast('Progress cleared');
});
$('#testVoice').addEventListener('click', async () => { hush(); for (const w of ['more','up','go','bye bye']) { await speak(w); await new Promise(r => setTimeout(r, 300)); } });
// Reflect saved settings in the controls
$('#rate').value = state.rate; $('#rateOut').textContent = rateLabel(state.rate);
$('#wait').value = String(state.wait);
loadVoices();

updateStars();
})();
