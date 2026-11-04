import { asset } from './site';

const IMG = asset('images/');

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

// Top 8 order = rank
export const PROJECTS = [
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

export const byId = Object.fromEntries(PROJECTS.map((p) => [p.id, p]));
