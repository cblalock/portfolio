'use strict';
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const IMG = '../public/images/';
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(pointer: fine)').matches;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const LINKS = {
    email: 'connor.blalock77@gmail.com',
    linkedin: 'https://linkedin.com/in/robin-blalock',
    github: 'https://github.com/cblalock',
    site: 'https://cblalock.github.io/portfolio',
    resume: '../public/rcb_resume.pdf',
  };

  // Generated tile art for The Hunter (no screenshot yet).
  const hunterArt = 'data:image/svg+xml,' + encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'>" +
    "<rect width='400' height='400' fill='#020a05'/>" +
    "<g stroke='#00ff88' stroke-width='3' fill='none' opacity='.85'>" +
    "<circle cx='200' cy='165' r='95'/><circle cx='200' cy='165' r='42'/>" +
    "<path d='M200 50v70M200 210v70M85 165h70M245 165h70'/></g>" +
    "<circle cx='200' cy='165' r='5' fill='#00ff88'/>" +
    "<text x='200' y='330' fill='#00ff88' font-family='monospace' font-size='38' text-anchor='middle'>THE_HUNTER</text>" +
    "<text x='200' y='368' fill='#00cc6f' font-family='monospace' font-size='18' text-anchor='middle' opacity='.75'>&gt; ranking jobs...</text></svg>"
  );

  // ---------- projects (Top 8 order = rank) ----------
  const PROJECTS = [
    {
      id: 'trading-agent', name: 'Trading Agent', file: 'trading_agent.exe',
      title: 'Trading Agent Performance Analytics', cat: 'personal · paper trading · concluded', img: IMG + 'agent_dashboardpic.png',
      desc: 'A Claude-driven options-trading agent that ran from 2026-06-30 to 2026-08-26 on a paper account with $5,000 in simulated capital. It read Setup Scanner’s live signals through its API, placed its own trades via Alpaca, and journaled all 192 closed trades with its reasoning. SQL, Pandas and two dashboards (Tableau and a hand-coded web version) drove a dated changelog of changes to the system. One review found that a minimum-strength setting was silently keeping 13 of the scanner’s 15 enabled indicators from ever firing. Lowering it let them fire, but after a −$750.50 Friday it went back up, with the weaker signals kept as confirmation checks. It ended with an experiment: every guardrail removed to test the agent’s judgment. Average loss per trade went from $8.62 to $24.37, which showed the guardrails had been limiting losses, not hiding an edge. Final result: down $1,550 across all 192 trades, published in full with a retrospective.',
      tech: ['Python', 'Claude API', 'Alpaca Markets', 'SQLite', 'Pandas', 'Tableau', 'JS'],
      github: 'https://github.com/cblalock/trading-agent-dashboard', live: 'https://cblalock.github.io/trading-agent-dashboard',
      skills: ['python', 'sql', 'data', 'ai', 'javascript'],
      aliases: ['trading agent', 'trading', 'trader', 'options', 'agent dashboard', 'trading dashboard', 'performance analytics', 'tableau'],
      comment: '192 paper trades, every one journaled with my reasoning. then every guardrail got pulled to test my judgment. average loss per trade nearly tripled. lesson logged.',
    },
    {
      id: 'setup-scanner', name: 'Setup Scanner', file: 'setup_scanner.exe',
      title: 'Setup Scanner', cat: 'personal · live SaaS', img: IMG + 'setupscanner.png',
      desc: 'A paid subscription product with live, paying users. It scans NYSE and NASDAQ stocks with 15 technical indicators across 5 timeframes (5m to daily). Each setup gets a calculated entry, stop loss, two take-profit targets and a risk/reward ratio, and Pro users get continuous auto-scanning during market hours. Billing runs on Stripe, with JWT auth. Its live signals also fed the Trading Agent.',
      tech: ['Python / FastAPI', 'Supabase (PostgreSQL)', 'Stripe', 'JWT auth', 'HTML/JS', 'Alpaca Markets', 'Railway'],
      live: 'https://www.setupscan.app',
      skills: ['python', 'sql', 'fullstack', 'javascript', 'devops'],
      aliases: ['setup scanner', 'setupscan', 'scanner', 'stock scanner', 'saas', 'stocks', 'stock'],
      comment: 'turns out a min-strength setting was silently keeping 13 of my 15 indicators from ever firing. lowering it woke them up, then a −$750.50 friday sent it back up, with the weaker signals kept as confirmation checks.',
    },
    {
      id: 'private-ai', name: 'Private AI', file: 'private_ai.yml',
      title: 'Private AI Assistant', cat: 'personal', img: IMG + 'localLLM.png',
      desc: 'An Ansible playbook that provisions a fully working private AI assistant from scratch with a single command. Built around a real scenario: a business that needs an internal AI tool but can’t send sensitive client data to third-party servers.',
      tech: ['Ansible', 'Ollama', 'Docker', 'OpenWebUI', 'llama3.2:3b', 'Ubuntu / systemd'],
      github: 'https://github.com/cblalock/private-ai-assistant',
      skills: ['ai', 'devops'],
      aliases: ['private ai', 'private assistant', 'ai assistant', 'ansible', 'ollama', 'local llm', 'openwebui', 'playbook'],
      comment: 'one command and an organization has its own internal LLM, without routing sensitive data through third-party servers.',
    },
    {
      id: 'the-hunter', name: 'The Hunter', file: 'the_hunter.exe',
      title: 'The Hunter', cat: 'personal · new', img: hunterArt,
      desc: 'Browser automation plus an LLM pipeline for job search. It searches job boards with Playwright, filters out bad fits, and ranks every posting with an explainable score (posting age, applicant count, remote vs. local, required years). Screening questions are answered from a saved profile first; anything new goes to Claude for structured output. Every answer is logged for review, and corrections are reused next time.',
      tech: ['Python', 'FastAPI', 'SQLAlchemy / SQLite', 'Playwright', 'Claude API', 'HTML/CSS/JS'],
      note: 'repo coming soon (publishing a cleaned copy)',
      skills: ['python', 'sql', 'ai', 'fullstack', 'automation'],
      aliases: ['the hunter', 'hunter', 'job search', 'job hunt', 'browser automation', 'playwright', 'easy apply'],
      comment: 'every job posting gets a score that shows its work. new screening questions get logged for review, and corrections get reused next time.',
    },
    {
      id: 'gearshift', name: 'Gearshift', file: 'gearshift.uproject',
      title: 'Gearshift', cat: 'school · game', img: IMG + 'gearshiftpic.png',
      desc: 'A first-person puzzle game inspired by Portal 2. Escape the factory by solving each level.',
      tech: ['Unreal Engine 5', 'GitLab'],
      github: 'https://github.com/cblalock/Gearshift', trailer: 'https://www.youtube.com/watch?v=kRr7yWkFJJY',
      skills: ['games'],
      aliases: ['gearshift', 'gear shift', 'unreal', 'ue5', 'portal', 'puzzle game', 'trailer'],
      comment: 'first-person puzzle game in Unreal Engine 5. the trailer’s up. still can’t escape the factory.',
    },
    {
      id: 'drone', name: 'Security Drone', file: 'drone.jar',
      title: 'Autonomous Security Drone', cat: 'school', img: IMG + 'tellodrone.png',
      desc: 'A drone that simulates real security and check-in scenarios: real-time video feed, facial recognition, identity verification and interrupt-driven behavior.',
      tech: ['Java', 'OpenCV', 'Tello SDK'],
      github: 'https://github.com/cblalock/DroneProject',
      skills: ['java', 'cv'],
      aliases: ['security drone', 'drone', 'tello', 'facial recognition', 'face recognition', 'opencv'],
      comment: 'java, opencv and a tello: live video, facial recognition and identity checks, with interrupt-driven behavior.',
    },
    {
      id: 'game-launcher', name: 'Game Launcher', file: 'game_launcher.js',
      title: 'UAB Game Launcher', cat: 'school · 1st place capstone', img: IMG + 'uabgames.png',
      desc: 'A senior capstone built for UAB’s Biology Department, a real external stakeholder, that won 1st place among capstone teams. It’s a full-stack single-page app that launches educational games from a library, with a REST API and SQLite for user accounts, leaderboards and high scores.',
      tech: ['React', 'Node.js', 'Express', 'SQLite', 'JS'],
      github: 'https://github.com/cblalock/CS499GameLauncher',
      skills: ['react', 'javascript', 'sql', 'fullstack'],
      aliases: ['game launcher', 'launcher', 'uab game', 'leaderboard', 'high score'],
      comment: 'capstone for UAB’s biology department. a real stakeholder, and 1st place among the capstone teams.',
    },
    {
      id: 'game-sales', name: 'Game Sales', file: 'game_sales.ipynb',
      title: 'Video Game Sales Analysis', cat: 'personal', img: IMG + 'gamesales.png',
      desc: 'Analyzed 16,000+ video game sales records from 1980 to 2020 to find industry trends with Python data science libraries.',
      tech: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Jupyter'],
      github: 'https://github.com/cblalock/Video-Games-Sales-Analysis',
      skills: ['python', 'data'],
      aliases: ['video game sales', 'game sales', 'sales analysis', 'sales', 'jupyter', 'matplotlib'],
    },
  ];
  const byId = Object.fromEntries(PROJECTS.map((p) => [p.id, p]));

  // ---------- top 8 ----------
  const grid = $('#top8grid');
  PROJECTS.forEach((p, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 't8';
    b.dataset.id = p.id;
    b.style.setProperty('--img', `url("${p.img}")`);
    b.innerHTML = `<span class="t8-name">${esc(p.name)}</span>
      <span class="t8-thumb" role="img" aria-label="${esc(p.title)}"></span>
      <span class="t8-rank">#${i + 1}</span>`;
    b.addEventListener('click', () => openProject(p.id));
    grid.append(b);
  });
  $$('[data-project]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); openProject(a.dataset.project); }));

  // ---------- project window ----------
  const backdrop = $('#projBackdrop');
  let lastFocus = null;
  function openProject(id) {
    const p = byId[id];
    if (!p) return;
    lastFocus = document.activeElement;
    $('#pwFile').textContent = p.file;
    $('#pwImg').style.setProperty('--img', `url("${p.img}")`);
    $('#pwImg').setAttribute('aria-label', p.title + ' screenshot');
    $('#pwCat').textContent = p.cat;
    $('#pwTitle').textContent = p.title;
    $('#pwDesc').textContent = p.desc;
    $('#pwTech').innerHTML = p.tech.map((t) => `<span class="tag">${esc(t)}</span>`).join('');
    const links = [];
    if (p.live) links.push(`<a href="${p.live}" target="_blank" rel="noopener">▶ Live</a>`);
    if (p.github) links.push(`<a href="${p.github}" target="_blank" rel="noopener">⌥ Code</a>`);
    if (p.trailer) links.push(`<a href="${p.trailer}" target="_blank" rel="noopener">▶ Trailer</a>`);
    if (p.note) links.push(`<span class="draft">${esc(p.note)}</span>`);
    $('#pwLinks').innerHTML = links.join('');
    backdrop.hidden = false;
    $('#pwClose').focus();
  }
  function closeProject() {
    if (backdrop.hidden) return;
    backdrop.hidden = true;
    if (lastFocus) lastFocus.focus();
  }
  $('#pwClose').addEventListener('click', closeProject);
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) closeProject(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeProject(); });

  // ---------- small page bits ----------
  $('#lastLogin').textContent = new Date().toLocaleDateString(undefined, { month: 'numeric', day: 'numeric', year: 'numeric' });
  $('#copyLink').addEventListener('click', async (e) => {
    const btn = e.currentTarget;
    const old = btn.innerHTML;
    try { await navigator.clipboard.writeText(LINKS.site); btn.innerHTML = '<span>✓</span> Link copied!'; }
    catch { btn.innerHTML = '<span>✗</span> ' + LINKS.site; }
    setTimeout(() => { btn.innerHTML = old; }, 2200);
  });
  function flash(el) {
    if (!el) return;
    el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash');
  }
  function highlight(ids) {
    const top8 = $('#top8');
    top8.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    $$('.t8').forEach((t) => {
      t.classList.remove('hl', 'dim'); void t.offsetWidth;
      t.classList.add(ids.includes(t.dataset.id) ? 'hl' : 'dim');
    });
    clearTimeout(highlight.t);
    highlight.t = setTimeout(() => $$('.t8').forEach((t) => t.classList.remove('hl', 'dim')), 4500);
  }

  // ---------- comments ----------
  const comments = PROJECTS.filter((p) => p.comment).map((p) => ({ who: p.id.replace(/-/g, '_'), project: p.id, img: p.img, text: p.comment }));
  function renderComments() {
    $('#commentList').innerHTML = comments.map((c) => `
      <div class="comment">
        <div class="comment-who">
          ${c.project ? `<button type="button" data-cp="${c.project}">${esc(c.who)}</button>` : `<b>${esc(c.who)}</b>`}
          <span class="comment-av" style="--img:url(&quot;${c.img}&quot;)"></span>
        </div>
        <div class="comment-body"><div class="comment-time">${esc(c.time || 'build note')}</div>${esc(c.text)}</div>
      </div>`).join('');
    $('#commentCount').textContent = $('#commentTotal').textContent = comments.length;
    $$('[data-cp]').forEach((b) => b.addEventListener('click', () => openProject(b.dataset.cp)));
  }
  renderComments();

  // ---------- audio: shared context ----------
  let actx = null;
  const audio = () => {
    if (!actx) { const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null; actx = new AC(); }
    if (actx.state === 'suspended') actx.resume();
    return actx;
  };
  let userGestured = false;
  ['pointerdown', 'keydown'].forEach((ev) => addEventListener(ev, () => { userGestured = true; }, { once: true, capture: true }));

  // creaky "door open" (and a shorter close), synthesized
  function doorSound(open) {
    const ctx = audio(); if (!ctx) return;
    const t = ctx.currentTime;
    const out = ctx.createGain(); out.gain.value = 0.18; out.connect(ctx.destination);
    const osc = ctx.createOscillator(); osc.type = 'sawtooth';
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 6;
    const g = ctx.createGain();
    const dur = open ? 0.55 : 0.3;
    const [f0, f1] = open ? [95, 180] : [170, 90];
    osc.frequency.setValueAtTime(f0, t);
    for (let i = 1; i <= 10; i++) osc.frequency.setValueAtTime(f0 + (f1 - f0) * (i / 10) + (i % 2 ? 25 : -15), t + dur * (i / 10));
    bp.frequency.setValueAtTime(900, t); bp.frequency.linearRampToValueAtTime(1600, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(1, t + 0.04); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(bp).connect(g).connect(out); osc.start(t); osc.stop(t + dur + 0.05);
    if (open) { // little "knock" at the end
      const k = ctx.createOscillator(); const kg = ctx.createGain();
      k.type = 'sine'; k.frequency.setValueAtTime(140, t + dur); k.frequency.exponentialRampToValueAtTime(60, t + dur + 0.12);
      kg.gain.setValueAtTime(0.0001, t + dur); kg.gain.exponentialRampToValueAtTime(0.9, t + dur + 0.01); kg.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.15);
      k.connect(kg).connect(out); k.start(t + dur); k.stop(t + dur + 0.2);
    }
  }
  function imBlip() {
    const ctx = audio(); if (!ctx) return;
    const t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'triangle'; o.frequency.setValueAtTime(880, t); o.frequency.setValueAtTime(1320, t + 0.06);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.06, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
    o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + 0.2);
  }

  // ---------- music player (click to play, never autoplays) ----------
  const Music = (() => {
    let master = null, timer = null, step = 0, next = 0, playing = false;
    const BPM = 96, STEP = 60 / BPM / 2; // eighth notes
    const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
    // Am - F - C - G, one bar each, 8 steps per bar
    const CHORDS = [[45, [0, 3, 7, 12]], [41, [0, 4, 7, 12]], [48, [0, 4, 7, 12]], [43, [0, 4, 7, 12]]];
    const ARP = [0, 1, 2, 3, 2, 1, 2, 3];
    function voice(ctx, freq, t, dur, type, vol, cutoff) {
      const o = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter();
      o.type = type; o.frequency.value = freq; f.type = 'lowpass'; f.frequency.value = cutoff;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(f).connect(g).connect(master); o.start(t); o.stop(t + dur + 0.02);
    }
    function hat(ctx, t) {
      const len = Math.floor(ctx.sampleRate * 0.04), buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
      const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
      s.buffer = buf; f.type = 'highpass'; f.frequency.value = 7000; g.gain.value = 0.12;
      s.connect(f).connect(g).connect(master); s.start(t);
    }
    function schedule() {
      const ctx = actx;
      while (next < ctx.currentTime + 0.12) {
        const bar = Math.floor(step / 8) % 4, s = step % 8, [root, iv] = CHORDS[bar];
        voice(ctx, mtof(root + 24 + iv[ARP[s]]), next, STEP * 0.9, 'square', 0.09, 1900);
        if (s === 0 || s === 3 || s === 6) voice(ctx, mtof(root), next, STEP * 2.2, 'triangle', 0.35, 600);
        if (s % 2 === 1) hat(ctx, next);
        next += STEP; step++;
      }
    }
    return {
      get playing() { return playing; },
      setVol(v) { if (master) master.gain.value = v * 0.5; },
      start() {
        const ctx = audio(); if (!ctx || playing) return;
        if (!master) { master = ctx.createGain(); master.connect(ctx.destination); }
        this.setVol($('#vol').value / 100);
        playing = true; step = 0; next = ctx.currentTime + 0.05;
        schedule(); timer = setInterval(schedule, 25);
        syncPlayer();
      },
      stop() { playing = false; clearInterval(timer); syncPlayer(); },
      toggle() { playing ? this.stop() : this.start(); },
    };
  })();
  function syncPlayer() {
    const b = $('#playBtn');
    b.textContent = Music.playing ? '❚❚' : '▶';
    b.setAttribute('aria-pressed', String(Music.playing));
    b.setAttribute('aria-label', Music.playing ? 'Pause music' : 'Play music');
    $('.player').classList.toggle('playing', Music.playing);
  }
  $('#playBtn').addEventListener('click', () => Music.toggle());
  $('#vol').addEventListener('input', (e) => Music.setVol(e.target.value / 100));

  // ---------- the agent ("fake-smart": intent matching, never makes things up) ----------
  // Two layers. Keyword rules answer instantly. Anything they can't place confidently goes to a ~23MB
  // embedding model running in a Web Worker, which picks the closest answer Connor wrote, or admits it can't.
  const SKILLS = {
    python: { label: 'Python', re: /\b(python|py)\b/ },
    javascript: { label: 'JavaScript', re: /\b(javascript|js|node|nodejs|express)\b/ },
    react: { label: 'React', re: /\breact\b/ },
    sql: { label: 'SQL / databases', re: /\b(sql|sqlite|postgres|postgresql|databases?|db|supabase)\b/ },
    data: { label: 'data analysis', re: /\b(data|pandas|numpy|analytics|analysis|analyst|visuali[sz]ation|dashboards?)\b/ },
    ai: { label: 'AI / LLMs', re: /\b(ai|llms?|claude|machine learning|ml|agents|agentic|gpt|models?|anthropic)\b/ },
    java: { label: 'Java', re: /\bjava\b/ },
    cv: { label: 'computer vision', re: /\b(computer vision|vision)\b/ },
    devops: { label: 'DevOps / infrastructure', re: /\b(devops|docker|infra|infrastructure|deploy(ment)?|linux|cloud|sysadmin)\b/ },
    games: { label: 'game dev', re: /\b(game ?dev|games?|gaming|unreal)\b/ },
    fullstack: { label: 'full-stack web', re: /\b(full ?stack|web|apis?|rest|fastapi|backend|front ?end|websites?)\b/ },
    automation: { label: 'automation', re: /\b(automation|automate|scraping|scraper|bots?)\b/ },
    cpp: { label: 'C / C++', re: /(^|\s)(c|c\+\+|cpp)(\s|$)/ },
  };

  const REPLIES = {
    resume: `here’s <a href="${LINKS.resume}" target="_blank" rel="noopener">his resume (PDF)</a>. <a href="${LINKS.linkedin}" target="_blank" rel="noopener">LinkedIn</a> has the history too.`,
  };

  const INTENTS = [
    { id: 'greet', p: ['hi', 'hello', 'hey', 'yo', 'sup', 'whats up', 'howdy', 'good morning', 'good afternoon'],
      r: 'hey! ask me about a project, a skill, or how to reach connor.' },
    { id: 'bot', p: ['cb0t', 'real ai', 'real llm', 'who are you', 'what are you', 'are you ai', 'are you an ai', 'are you real', 'are you a bot', 'how do you work', 'are you chatgpt', 'are you claude', 'what model', 'llm', 'how were you made'],
      r: 'i’m a small bot that runs entirely in your browser: no chat model, no server, no API key. a tiny embedding model works out which of connor’s pre-written answers fits your question, so i can’t make things up, and i can drive the page.' },
    { id: 'who', p: ['who is connor', 'who is he', 'about connor', 'about him', 'tell me about connor', 'tell me about him', 'who made this', 'whose site', 'what does he do', 'what does connor do', 'summary', 'tldr', 'elevator pitch'],
      r: 'connor builds things: AI agents, data pipelines, a live SaaS, a game, and a drone that recognizes faces. ex-Army comms, CS degree from UAB, technician at Yard Robotics, based in Huntsville / Nashville. the proof is in his top 8.', a: () => flash($('.profile-card')) },
    { id: 'best', p: ['best at', 'best project', 'strongest', 'favorite project', 'most proud', 'proudest', 'most impressive', 'impressive', 'standout', 'highlight', 'where do i start', 'what should i look at', 'top project'],
      r: 'if you only look at three: the <b>Trading Agent</b> (Claude-driven, 192 paper trades, and a public retrospective on what went wrong), <b>Setup Scanner</b> (a paid product with live users), and <b>The Hunter</b> (browser automation plus an LLM pipeline). lighting them up now.',
      a: () => highlight(['trading-agent', 'setup-scanner', 'the-hunter']) },
    { id: 'projects', p: ['projects', 'what has he built', 'what did he build', 'what has he made', 'show me everything', 'portfolio', 'his work', 'show me his work', 'all projects', 'top 8'],
      r: 'here’s everything: 8 builds. click any tile, or ask me about one by name.', a: () => highlight(PROJECTS.map((p) => p.id)) },
    { id: 'hire', p: ['hiring', 'hire', 'open to work', 'available', 'looking for work', 'looking for a job', 'job', 'opportunities', 'remote', 'relocate', 'full time', 'internship', 'is he looking', 'salary'],
      r: 'yes, he’s open to opportunities and based in Huntsville / Nashville. for specifics (pay, remote, relocation, timing), it’s best to ask him directly. i lit up his contact box.', a: () => flash($('#contact')) },
    { id: 'contact', p: ['contact', 'email', 'reach', 'reach him', 'get in touch', 'message him', 'linkedin', 'talk to him', 'phone', 'call him'],
      r: `fastest is email: <a href="mailto:${LINKS.email}">${LINKS.email}</a>. he’s also on <a href="${LINKS.linkedin}" target="_blank" rel="noopener">LinkedIn</a>. i lit up the contact box for you.`, a: () => flash($('#contact')) },
    { id: 'resume', p: ['resume', 'cv', 'pdf', 'work history'], r: REPLIES.resume },
    { id: 'github', p: ['github', 'source code', 'repo', 'repos', 'code', 'see his code'],
      r: `his code lives at <a href="${LINKS.github}" target="_blank" rel="noopener">github.com/cblalock</a>. most of the top 8 link straight to their repo.` },
    { id: 'edu', p: ['school', 'degree', 'college', 'university', 'education', 'uab', 'study', 'studied', 'graduate'],
      r: 'a Bachelor’s in Computer Science from UAB (University of Alabama at Birmingham). three of the top 8 came out of school: Gearshift, the Security Drone and the Game Launcher.', a: () => highlight(['gearshift', 'drone', 'game-launcher']) },
    { id: 'army', p: ['army', 'military', 'veteran', 'background', 'experience', 'before cs', 'served', 'comsec', 'vsat'],
      r: 'before CS he served in the U.S. Army working on communication systems and networking (COMSEC, VSAT terminals), 2014 to 2018. that’s where the infrastructure side comes from.' },
    { id: 'where', p: ['where', 'location', 'located', 'based', 'live', 'city'], r: 'Huntsville / Nashville.' },
    { id: 'music_stop', p: ['stop', 'stop music', 'pause', 'turn it off', 'quiet', 'mute'], r: 'stopped. ❚❚', a: () => Music.stop() },
    { id: 'music', p: ['music', 'song', 'play music', 'play a song', 'play something', 'tunes'],
      r: '▶ now playing <b>construct_loop.mid</b>. say "stop" to stop.', a: () => Music.start() },
    { id: 'thanks', p: ['thanks', 'thank you', 'thx', 'ty', 'cool', 'nice', 'awesome', 'neat', 'sick', 'dope'], r: 'anytime. ✌' },
    { id: 'matrix', p: ['matrix', 'red pill', 'blue pill', 'neo', 'morpheus', 'spoon', 'white rabbit'],
      r: 'there is no spoon. there is, however, a git log.' },
    { id: 'bye', p: ['bye', 'goodbye', 'later', 'see ya', 'cya'], r: 'later! i’ll be down here if you need me.' },
    { id: 'site', p: ['this site', 'this website', 'how was this made', 'how is this built', 'built this site'],
      r: 'this page is hand-built: a 2008 profile layout, matrix rain on a canvas, and me, a client-side agent. the music is synthesized live with Web Audio, no files.' },
    { id: 'languages', p: ['what languages', 'programming languages', 'tech stack', 'his stack'],
      r: 'Python is the big one (4 of the top 8). he also lists JavaScript, Java, C, C++, SQL and HTML/CSS. the full list is in his interests box.', a: () => flash($('#interests')) },
    { id: 'live', p: ['live demo', 'try it', 'demo'],
      r: 'two you can open right now: <b>Setup Scanner</b> is a live product and the <b>Trading Agent</b> has a public dashboard with every trade. Gearshift has a trailer too. lighting them up.', a: () => highlight(['setup-scanner', 'trading-agent', 'gearshift']) },
    { id: 'recent', p: ['newest project', 'latest project', 'most recent', 'working on now'],
      r: 'the newest addition is <b>The Hunter</b>: browser automation plus an LLM pipeline for job search.', a: () => highlight(['the-hunter']) },
    { id: 'privacy', p: ['my data', 'my messages', 'is this private', 'tracking me'],
      r: 'what you type stays in your browser. there’s no server behind me. the only things i download are the small model and the code that runs it, and neither ever sees your messages.' },
    { id: 'personal', p: ['is he married', 'how old', 'his age', 'girlfriend', 'wife', 'kids', 'religion', 'politics', 'favorite color', 'favorite food'],
      r: 'i stick to his work, so personal stuff is a question for connor himself. i can tell you what he’s built, though.' },
    { id: 'clearance', p: ['clearance', 'security clearance', 'secret clearance', 'top secret', 'ts sci', 'classified work', 'cleared', 'is he cleared'],
      r: `that’s one to ask connor about directly: <a href="mailto:${LINKS.email}">${LINKS.email}</a>.` },
    { id: 'job', p: ['current job', 'day job', 'where does he work', 'where he works', 'yard robotics', 'robotics', 'currently working', 'current employer', 'current role'],
      r: 'he’s a technician at Yard Robotics: diagnosing robot hardware and connectivity issues, and driving robots through unmapped areas to generate path-planning data for autonomous navigation.' },
    { id: 'system', p: ['three part system', 'how do they connect', 'how does it fit together', 'how are they connected', 'trading system', 'work together'],
      r: 'three parts, one system. <b>Setup Scanner</b> finds setups and is sold as a live product. the <b>Trading Agent</b> read those signals through the scanner’s API and traded a paper account on its own. the dashboards analyzed the agent’s decisions, and that analysis drove changes to the system.', a: () => highlight(['setup-scanner', 'trading-agent']) },
    { id: 'bug', p: ['hardest bug', 'toughest bug', 'biggest challenge', 'hardest problem', 'hardest part', 'interesting bug', 'what went wrong', 'biggest mistake'],
      r: 'best story: a minimum-strength setting in his scanner was silently keeping 13 of the 15 enabled indicators from ever firing. he lowered it and signals jumped from 12-26 per scan to 50-60. then a −$750.50 friday led him to raise it again and keep the weaker signals as confirmation checks only. a real diagnose, change, monitor, revert loop, not a clean win.', a: () => highlight(['trading-agent', 'setup-scanner']) },
    { id: 'award', p: ['awards', 'award', 'won anything', 'first place', '1st place', 'competition', 'capstone'],
      r: 'his senior capstone, the <b>UAB Game Launcher</b>, was built for UAB’s Biology Department and won 1st place among capstone teams.', a: () => highlight(['game-launcher']) },
    { id: 'results', p: ['make money', 'made money', 'profitable', 'profit', 'how did it do', 'how did it perform', 'win rate', 'real money', 'paper trading', 'how many trades'],
      r: 'it lost money, on paper: all 192 trades netted −$1,550.22 at a 39.1% win rate, on $5,000 of simulated capital. no real money was involved. connor published all of it, including why he stopped: <a href="https://cblalock.github.io/trading-agent-dashboard" target="_blank" rel="noopener">see the dashboard</a>.', a: () => highlight(['trading-agent']) },
    { id: 'help', p: ['what can you do', 'help me', 'what can i ask'],
      r: 'i can open any project, show which ones use a skill, point you to his contact info, or play his song. try one of these:', chips: true },
  ];

  // Extra phrasings for the embedding model only. They describe what a visitor means; the answers stay the ones above.
  const PARAPHRASES = {
    greet: ['hi there, how is it going'],
    bot: ['what kind of program am i talking to', 'are you a real language model', 'is this chatbot powered by a large language model', 'am i talking to a human or a computer'],
    who: ['give me a quick overview of this person', 'what is this guy all about', 'whose portfolio is this'],
    best: ['which of his projects should i check out first', 'what is the most notable thing he has made', 'i only have a minute, what should i see'],
    projects: ['what kind of stuff has he made', 'show me what he has shipped', 'can i see the things he has worked on'],
    hire: ['how much money does he expect to make', 'is he currently searching for a new role', 'would he consider joining our team', 'can we bring him on as an engineer', 'does he want a new position'],
    contact: ['how can i get a hold of him', 'what is the best way to send him a message', 'i would like to talk with him about something'],
    resume: ['can i get a copy of his resume', 'where can i download his curriculum vitae', 'what is his employment history'],
    github: ['where can i read the code he wrote', 'does he publish his code publicly'],
    edu: ['where did he go to school', 'did he get a computer science degree', 'what did he major in'],
    army: ['did he serve in the armed forces', 'what did he do before software', 'has he been in the service'],
    where: ['what part of the country is he in', 'which city does he live in'],
    music_stop: ['make the music stop', 'turn that song off'],
    music: ['put on a song', 'what does his profile song sound like'],
    thanks: ['thanks for your help', 'that was really helpful'],
    matrix: ['take the red pill', 'what is the matrix'],
    bye: ['ok i am heading out now', 'talk to you later'],
    site: ['how did he build this website', 'what is this page made with', 'why does this site look like an old social network'],
    languages: ['what programming languages does he write', 'what coding languages is he comfortable in', 'what technologies does he work with'],
    live: ['is there anything i can actually try out', 'do any of these have a working demo', 'which projects are deployed and running'],
    recent: ['what has he been building lately', 'what is the latest thing he made'],
    privacy: ['do you store what i type', 'are my messages being sent to a server', 'is this conversation being recorded'],
    personal: ['does he have a family', 'what is he like as a person', 'what are his personal beliefs', 'how old is this guy', 'what is his favorite thing to eat', 'is he in a relationship'],
    clearance: ['does he hold a government security clearance', 'is he eligible to work on classified programs', 'does he have an active clearance'],
    job: ['does he have robotics experience', 'has he worked with robots', 'what does he do for work right now', 'where is he employed at the moment', 'who does he work for today'],
    system: ['how do the scanner and the trading agent relate', 'is the trading bot connected to setup scanner', 'how do his trading projects fit together'],
    bug: ['tell me about a difficult problem he solved', 'what is the toughest thing he had to debug', 'give me an example of him tracking down a failure'],
    award: ['has he won any awards', 'has his work been recognized', 'tell me about his senior project'],
    results: ['did the trading agent make any money', 'was the trading bot successful', 'how many trades did the agent make', 'did it trade with real money'],
    help: ['what kinds of questions can you answer', 'how do i use this chat'],
  };
  const PROJECT_PARAPHRASES = {
    'trading-agent': ['the bot that trades options using claude', 'an AI that buys and sells on its own', 'his autonomous investing project'],
    'setup-scanner': ['the product that finds trade setups in the market', 'his paid web app with a subscription', 'the tool that screens stocks for entries and stop losses'],
    'private-ai': ['running your own chatbot without sending data to the cloud', 'a self-hosted AI for a business with sensitive client data', 'one command that installs a private assistant'],
    'the-hunter': ['the tool that helps him find jobs', 'software that ranks job postings and answers screening questions'],
    gearshift: ['the video game he made', 'his first-person puzzle game about escaping a factory', 'has he shipped a game'],
    drone: ['the flying robot that identifies people', 'the project with a quadcopter and a video feed', 'face identification on a drone'],
    'game-launcher': ['the web app that launches browser games', 'the arcade site with user accounts and scores'],
    'game-sales': ['his data science project about the gaming industry', 'the analysis of game industry trends over forty years'],
  };
  const SKILL_PARAPHRASES = {
    python: ['does he write python code'],
    javascript: ['has he done javascript programming'],
    react: ['has he built react front ends'],
    sql: ['can he design and query relational databases', 'does he work with data stores'],
    data: ['can he analyze data and make charts', 'does he do data science work', 'can he work as a business intelligence analyst'],
    ai: ['does he build with artificial intelligence', 'does he have experience with large language models', 'has he made autonomous agents that use tools', 'can he build generative AI applications'],
    java: ['has he programmed in java'],
    cv: ['can he make software that understands images and video'],
    devops: ['can he set up servers and deploy software', 'does he know containers and infrastructure as code', 'can he do site reliability or systems work'],
    games: ['has he done video game development', 'does he make games'],
    fullstack: ['can he build a web app front to back', 'does he write server side code and APIs', 'is he a software engineer who can build websites'],
    automation: ['has he automated repetitive tasks with code', 'can he control a browser with a script'],
    cpp: ['has he programmed in low level languages like c and c plus plus'],
  };

  const norm = (s) => ' ' + s.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9+#\s]/g, ' ').replace(/\s+/g, ' ').trim() + ' ';
  const stem = (w) => (w.length > 3 && /[^s]s$/.test(w) ? w.slice(0, -1) : w);
  const toks = (s) => new Set(norm(s).trim().split(' ').map(stem));
  const prepped = INTENTS.map((it) => ({ ...it, pt: it.p.map((ph) => [...toks(ph)]) }));

  function matchProject(n) {
    let best = null, bestLen = 0;
    for (const p of PROJECTS) for (const a of p.aliases) {
      if (n.includes(' ' + a + ' ') || n.includes(' ' + a + 's ')) { if (a.length > bestLen) { best = p; bestLen = a.length; } }
    }
    return best ? { p: best, len: bestLen } : null;
  }
  function matchIntent(t) {
    let best = null, score = 0;
    for (const it of prepped) for (const ph of it.pt) {
      if (ph.every((w) => t.has(w)) && ph.length > score) { best = it; score = ph.length; }
    }
    return best ? { it: best, score } : null;
  }
  function matchSkills(n) { return Object.entries(SKILLS).filter(([, s]) => s.re.test(n)).map(([k]) => k); }

  // Common tech that appears nowhere on the page: say so plainly rather than let the model pick a near neighbor.
  const NOT_LISTED = [['Rust', 'rust'], ['Go', 'golang'], ['Kotlin', 'kotlin'], ['Swift', 'swift'], ['Ruby', 'ruby|rails'], ['PHP', 'php'], ['C#', 'c#|csharp|dotnet|net core'],
    ['Scala', 'scala'], ['Perl', 'perl'], ['TypeScript', 'typescript'], ['Vue', 'vue|vuejs'], ['Angular', 'angular'], ['Svelte', 'svelte'], ['Django', 'django'], ['Flask', 'flask'], ['Spring', 'spring boot'],
    ['AWS', 'aws'], ['Azure', 'azure'], ['GCP', 'gcp|google cloud'], ['Kubernetes', 'kubernetes|k8s'], ['Terraform', 'terraform'], ['MongoDB', 'mongo|mongodb'], ['Redis', 'redis'], ['Kafka', 'kafka'], ['Spark', 'pyspark'],
    ['PyTorch', 'pytorch'], ['TensorFlow', 'tensorflow'], ['Excel', 'excel'], ['Power BI', 'power bi|powerbi']]
    .map(([label, w]) => ({ label, re: new RegExp(`\\s(${w})\\s`) }));

  const projectReply = (p) => ({ text: `opening <b>${esc(p.title)}</b>. ${esc(p.desc.split('. ')[0].replace(/\.$/, ''))}.`, act: () => openProject(p.id) });
  function skillReply(k) {
    const label = SKILLS[k].label;
    const hits = PROJECTS.filter((p) => p.skills.includes(k));
    if (!hits.length) return { text: `he lists <b>${esc(label)}</b> in his interests, but none of the top 8 lean on it. try asking about Python, AI or data instead.`, act: () => flash($('#interests')) };
    const names = hits.map((p) => `<b>${esc(p.name)}</b>`);
    const list = names.length > 1 ? names.slice(0, -1).join(', ') + ' and ' + names.at(-1) : names[0];
    return { text: `${esc(label)} shows up in ${list}. lighting ${hits.length > 1 ? 'them' : 'it'} up.`, act: () => highlight(hits.map((p) => p.id)) };
  }
  const intentReply = (it) => ({ text: it.r, act: it.a, chips: it.chips });
  const MISS = 'hmm, i didn’t catch that. i only know about connor and his builds (on purpose, so i never make stuff up). try one of these:';

  // Keyword layer. `weak` / `miss` mean the embedding model is allowed to do better.
  function respond(raw) {
    const n = norm(raw), t = toks(raw);
    if (/^ (write|generate|draft|translate|summarize|solve|debug)\b/.test(n)) return { text: 'i can’t write or generate anything: every answer i give is one connor wrote ahead of time. ask me about his builds instead.', chips: true };
    if (/\s(clearance|clearances|cleared|ts sci|top secret|classified)\s/.test(n)) return intentReply(INTENTS.find((it) => it.id === 'clearance'));
    if (/\bscanner\b/.test(n) && /\b(agent|trader|trading bot)\b/.test(n)) return intentReply(INTENTS.find((it) => it.id === 'system'));
    if (/\s(profit|profitable|make money|made money|lose money|lost money|real money|win rate|paper trad\w*|paper account|how many trades)\s/.test(n)) return intentReply(INTENTS.find((it) => it.id === 'results'));
    const proj = matchProject(n), intent = matchIntent(t), skills = matchSkills(n);
    const listy = /\b(which|projects|what|show|all|used|use|uses|know|knows|experience|good at|skills?|with)\b/.test(n);

    // 1. a specific project by name ("tell me about the drone")
    if (proj && !(intent && intent.score >= 2 && proj.len < 6)) {
      return projectReply(proj.p);
    }
    // 2. a strong multi-word intent ("what's he best at", "who is connor")
    if (intent && intent.score >= 2 && !(skills.length && listy && intent.it.id === 'projects')) return intentReply(intent.it);
    // 3. a skill / tech ("python projects", "does he know react")
    if (skills.length) return { ...skillReply(skills[0]), weak: true, skill: true };
    // 4. tech he doesn't list
    const absent = NOT_LISTED.find((x) => x.re.test(n));
    if (absent) return { text: `i don’t see <b>${esc(absent.label)}</b> in his top 8 or his interests, and i won’t guess. <a href="mailto:${LINKS.email}">ask him directly</a> if it matters for your role.` };
    // 5. a weak single-word intent
    if (intent) return { ...intentReply(intent.it), weak: true };
    // 6. nothing: the model may still place it, otherwise say so, never guess
    return { text: MISS, chips: true, miss: true };
  }

  // ---------- embedding brain (Transformers.js in a Web Worker) ----------
  const TARGETS = [
    ...INTENTS.map((it) => {
      const q = PARAPHRASES[it.id] || [];
      return { key: 'intent:' + it.id, ask: q[0] || it.p[0], anchors: [...q, ...it.p.filter((x) => x.split(' ').length >= (it.id === 'job' ? 3 : 2))], reply: () => intentReply(it) };
    }),
    ...PROJECTS.map((p) => ({
      key: 'project:' + p.id, ask: `show me ${p.title}`,
      anchors: [`tell me about ${p.title}`, p.desc.split('. ')[0], ...(PROJECT_PARAPHRASES[p.id] || [])],
      reply: () => projectReply(p),
    })),
    ...Object.keys(SKILLS).map((k) => ({
      key: 'skill:' + k, ask: `${SKILLS[k].label} projects`,
      anchors: [`what has he built with ${SKILLS[k].label}`, ...(SKILL_PARAPHRASES[k] || [])],
      reply: () => skillReply(k),
    })),
  ];

  const Brain = (() => {
    const CDN = 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.3.1/+esm';
    const MODEL = 'Xenova/all-MiniLM-L6-v2';
    const WORKER = `
      let embed, vecs = [], owners = [];
      const dot = (a, b) => { let s = 0; for (let i = 0; i < a.length; i++) s += a[i] * b[i]; return s; };
      self.onmessage = async ({ data: d }) => {
        try {
          if (d.type === 'init') {
            const t0 = performance.now();
            const { pipeline, env } = await import('${CDN}');
            env.allowLocalModels = false;
            const ex = await pipeline('feature-extraction', '${MODEL}', { dtype: 'q8', device: 'wasm',
              progress_callback: (p) => { if (p.status === 'progress' && /onnx$/.test(p.file || '')) postMessage({ type: 'progress', pct: p.progress }); } });
            embed = async (texts) => (await ex(texts, { pooling: 'mean', normalize: true })).tolist();
            const items = d.targets.flatMap((t) => t.anchors.map((a) => [t.key, a]));
            for (let i = 0; i < items.length; i += 16) {
              const batch = items.slice(i, i + 16);
              vecs.push(...await embed(batch.map((x) => x[1])));
              owners.push(...batch.map((x) => x[0]));
              postMessage({ type: 'indexing', pct: 100 * (i + batch.length) / items.length });
            }
            postMessage({ type: 'ready', ms: Math.round(performance.now() - t0), anchors: items.length });
          } else {
            const [v] = await embed([d.text]);
            const best = {};
            vecs.forEach((u, i) => { const s = dot(u, v); if (!(best[owners[i]] >= s)) best[owners[i]] = s; });
            postMessage({ type: 'result', id: d.id, hits: Object.entries(best).sort((a, b) => b[1] - a[1]).slice(0, 3) });
          }
        } catch (e) { postMessage({ type: 'error', id: d.id, message: String(e) }); }
      };`;
    let worker = null, state = 'idle', seq = 0;
    const pending = new Map();
    let onReady = [];
    const mode = (txt) => { $('#imMode').textContent = 'mode: ' + txt; };
    const fail = (why) => {
      state = 'off'; console.warn('brain unavailable, staying on keywords:', why);
      mode('keyword brain');
      pending.forEach((r) => r(null)); pending.clear();
      onReady.forEach((r) => r()); onReady = [];
    };
    function wake() {
      if (state !== 'idle') return;
      if (navigator.connection && navigator.connection.saveData) { state = 'off'; return; } // respect data saver
      state = 'loading'; mode('loading brain...');
      try {
        worker = new Worker(URL.createObjectURL(new Blob([WORKER], { type: 'text/javascript' })));
      } catch (e) { fail(e); return; }
      worker.onerror = (e) => fail(e.message);
      worker.onmessage = ({ data: d }) => {
        if (d.type === 'progress') mode(`loading brain ${Math.floor(d.pct)}%`);
        else if (d.type === 'indexing') mode(`indexing answers ${Math.floor(d.pct)}%`);
        else if (d.type === 'ready') {
          state = 'ready'; mode('semantic brain');
          Brain.stats = { ms: d.ms, anchors: d.anchors };
          onReady.forEach((r) => r()); onReady = [];
        } else if (d.type === 'result') { pending.get(d.id)?.(d.hits); pending.delete(d.id); }
        else if (d.type === 'error') {
          if (d.id != null) { pending.get(d.id)?.(null); pending.delete(d.id); }
          else fail(d.message);
        }
      };
      worker.postMessage({ type: 'init', targets: TARGETS.map(({ key, anchors }) => ({ key, anchors })) });
    }
    // Resolves to [[key, score], ...], or null if the brain can't answer within waitMs.
    async function search(text, waitMs = 0) {
      wake();
      if (state === 'loading' && waitMs > 0) {
        await Promise.race([new Promise((r) => onReady.push(r)), new Promise((r) => setTimeout(r, waitMs))]);
      }
      if (state !== 'ready') return null;
      return new Promise((resolve) => { const id = ++seq; pending.set(id, resolve); worker.postMessage({ type: 'query', id, text }); });
    }
    return { wake, search, get state() { return state; }, stats: null };
  })();

  const SURE = 0.62, MAYBE = 0.48, GAP = 0.03; // cosine thresholds, calibrated against test questions
  const targetBy = Object.fromEntries(TARGETS.map((t) => [t.key, t]));
  async function answer(raw) {
    const r = respond(raw);
    if (!r.weak && !r.miss) return r;
    const hits = await Brain.search(norm(raw).trim(), r.miss ? 8000 : 0);
    if (!hits || !hits.length) return r;
    const [[key, score], second] = hits;
    if (score >= SURE && (!second || score - second[1] >= GAP) && !(r.skill && key.startsWith('skill:'))) return targetBy[key].reply();
    if (r.weak) return r;
    if (score >= MAYBE) {
      const asks = hits.filter(([, s]) => s >= MAYBE).slice(0, 3).map(([k]) => targetBy[k].ask);
      return { text: 'not totally sure what you mean. did you mean one of these?', chips: asks };
    }
    return r;
  }

  // ---------- IM window ----------
  const im = $('#im'), tab = $('#imTab'), log = $('#imLog'), input = $('#imInput');
  let unread = 0, greeted = false;
  const CHIPS = ['what’s he best at?', 'show me the trading agent', 'python projects', 'how do i contact him?', 'are you an AI?'];

  function addMsg(cls, who, html) {
    const d = document.createElement('div');
    d.className = 'msg ' + cls;
    d.innerHTML = (who ? `<b>${who}:</b> ` : '') + html;
    log.append(d);
    log.scrollTop = log.scrollHeight;
    if (cls === 'bot' && im.hidden) { unread++; $('#imBadge').textContent = unread; $('#imBadge').hidden = false; tab.classList.remove('nudge'); void tab.offsetWidth; tab.classList.add('nudge'); }
    return d;
  }
  function renderChips(list = CHIPS) {
    $('#imChips').innerHTML = '';
    list.forEach((c) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'chip'; b.textContent = c;
      b.addEventListener('click', () => send(c));
      $('#imChips').append(b);
    });
  }
  // Replies run one at a time so a quick second message can't swallow the first answer.
  let chatQ = Promise.resolve();
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  async function say(html, act, chips) {
    $('#imTyping').textContent = 'cb0t is typing...';
    await wait(350 + Math.min(html.length * 4, 900));
    $('#imTyping').innerHTML = '&nbsp;';
    addMsg('bot', 'cb0t', html);
    if (!im.hidden || userGestured) imBlip();
    if (chips) renderChips(Array.isArray(chips) ? chips : CHIPS);
    if (act) act();
  }
  function botSay(html, act, chips) { chatQ = chatQ.then(() => say(html, act, chips)); }
  function send(text) {
    text = text.trim();
    if (!text) return;
    imOpen(false);
    addMsg('you', 'you', esc(text));
    chatQ = chatQ.then(async () => {
      $('#imTyping').textContent = 'cb0t is typing...';
      const r = await answer(text);
      await say(r.text, r.act, r.chips);
    });
  }
  function greet() {
    if (greeted) return; greeted = true;
    addMsg('sys', '', `cb0t signed on at ${new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}.`);
    botSay('hey! i’m connor’s agent. i can open his projects, tell you what he’s built with what, or point you to his contact info. what are you looking for?', null, true);
  }
  function imOpen(sound = true) {
    if (!im.hidden) return;
    im.hidden = false; tab.hidden = true;
    unread = 0; $('#imBadge').hidden = true;
    if (sound && userGestured) doorSound(true);
    greet();
    Brain.wake();
    if (finePointer) input.focus();
  }
  function imMin() {
    im.hidden = true; tab.hidden = false;
    if (userGestured) doorSound(false);
    tab.focus();
  }
  tab.addEventListener('click', () => imOpen());
  $('#imMin').addEventListener('click', imMin);
  $$('[data-open-im]').forEach((b) => b.addEventListener('click', () => imOpen()));
  $('#imForm').addEventListener('submit', (e) => { e.preventDefault(); send(input.value); input.value = ''; });
  $('#topSearch').addEventListener('submit', (e) => {
    e.preventDefault();
    const q = $('#topSearchInput').value;
    $('#topSearchInput').value = '';
    imOpen();
    if (!greeted) greet();
    send(q);
  });

  // Wide screens (room beside the 960px page): the buddy pops in on its own (silently; no sound before a click).
  // Anything narrower: it only nudges the tab with an unread badge, so it never covers the Top 8 uninvited.
  setTimeout(() => {
    if (!im.hidden) return;
    if (innerWidth >= 1680) imOpen(false);
    else greet();
  }, 2500);

  // ---------- matrix rain ----------
  (function rain() {
    const c = $('#rain'), x = c.getContext('2d');
    const CH = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロ0123456789{}<>/=;+*';
    const FS = 16;
    let w, h, drops;
    function resize() {
      w = c.width = innerWidth; h = c.height = innerHeight;
      drops = Array.from({ length: Math.ceil(w / FS) }, () => Math.random() * -h / FS);
      x.fillStyle = '#020603'; x.fillRect(0, 0, w, h);
    }
    function frame() {
      x.fillStyle = 'rgba(2, 6, 3, 0.09)'; x.fillRect(0, 0, w, h);
      x.font = FS + 'px monospace';
      for (let i = 0; i < drops.length; i++) {
        const y = drops[i] * FS;
        if (y > 0) {
          x.fillStyle = Math.random() < 0.06 ? '#d8ffe9' : '#00ff88';
          x.fillText(CH[(Math.random() * CH.length) | 0], i * FS, y);
        }
        if (y > h && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 1;
      }
    }
    resize();
    addEventListener('resize', resize);
    if (reduceMotion) { for (let i = 0; i < 60; i++) frame(); return; }
    let last = 0;
    (function loop(ts) {
      if (!document.hidden && ts - last > 50) { frame(); last = ts; }
      requestAnimationFrame(loop);
    })(0);
  })();

  // ---------- cursor glow (same look as the live site, eased) ----------
  if (finePointer) {
    const g = $('#glow');
    let tx = innerWidth / 2, ty = innerHeight / 2, cx = tx, cy = ty, moving = false;
    addEventListener('pointermove', (e) => { tx = e.clientX; ty = e.clientY; g.style.opacity = 1; if (!moving) { moving = true; requestAnimationFrame(tick); } });
    document.documentElement.addEventListener('pointerleave', () => { g.style.opacity = 0; });
    function tick() {
      cx += (tx - cx) * (reduceMotion ? 1 : 0.22);
      cy += (ty - cy) * (reduceMotion ? 1 : 0.22);
      g.style.transform = `translate3d(${cx - 150}px, ${cy - 150}px, 0)`;
      if (Math.abs(tx - cx) > 0.3 || Math.abs(ty - cy) > 0.3) requestAnimationFrame(tick); else moving = false;
    }
  }

  // expose for quick console testing
  window.__mock = { respond, answer, Brain, TARGETS, openProject, highlight, Music };
})();
