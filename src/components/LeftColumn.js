import { useState, useSyncExternalStore } from 'react';
import { asset, LINKS } from '../data/site';
import { music } from '../audio';

const External = ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>;

const INTERESTS = [
  ['General', 'taking things apart to see how they work, agents that run on their own, markets, games'],
  ['Languages', 'Python, JavaScript, Java, C, C++, SQL, HTML/CSS'],
  ['Building With', 'React, Node.js, Express, FastAPI, Playwright, OpenCV, Unreal Engine 5'],
  ['Data', 'Pandas, NumPy, SQLite, PostgreSQL, Supabase, Tableau, Jupyter'],
  ['AI', 'Claude API, Ollama, local LLMs, agents with tool use'],
  ['Infra', 'Docker, Ansible, Railway, Linux, Git, networking'],
];

const DETAILS = [
  ['Status', 'Open to opportunities'],
  ['Here for', 'Jobs, Networking, Building'],
  ['Education', 'Bachelor\'s, Computer Science, UAB'],
  ['Currently', 'Technician, Yard Robotics'],
  ['Background', 'U.S. Army: comms systems, networking, COMSEC, VSAT. Robotics, manufacturing, optimization.'],
];

const InfoTable = ({ rows }) => (
  <table className="itable">
    <tbody>
      {rows.map(([label, value]) => <tr key={label}><th>{label}</th><td>{value}</td></tr>)}
    </tbody>
  </table>
);

function ProfileCard() {
  const lastLogin = new Date().toLocaleDateString(undefined, { month: 'numeric', day: 'numeric', year: 'numeric' });
  return (
    <section className="card profile-card">
      <h1 className="profile-name">Connor</h1>
      <div className="profile-top">
        <div className="avatar">
          <img src={asset('images/avatar.jpg')} alt="Connor Blalock" width="260" height="300" />
        </div>
        <div className="profile-meta">
          <p className="quote">"i like building and automating things"</p>
          <p>Huntsville / Nashville<br />Open to opportunities</p>
          <p className="online"><span className="online-dot" />Online Now!</p>
          <p className="lastlogin">Last Login: {lastLogin}</p>
        </div>
      </div>
      <p className="mood">Mood: <b>#noticing</b> <span className="gear" aria-hidden="true">⚙</span></p>
      <p className="viewmy">View My:{' '}
        <External href={LINKS.github}>Code</External> |{' '}
        <External href={LINKS.resume}>Resume</External> |{' '}
        <External href={LINKS.linkedin}>LinkedIn</External>
      </p>
    </section>
  );
}

function ContactCard({ onOpenChat }) {
  const [copyLabel, setCopyLabel] = useState(null);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(LINKS.site);
      setCopyLabel(['✓', 'Link copied!']);
    } catch {
      setCopyLabel(['✗', LINKS.site]);
    }
    setTimeout(() => setCopyLabel(null), 2200);
  }

  const [copyIcon, copyText] = copyLabel || ['↗', 'Forward to Friend'];
  return (
    <section className="card contact-card" id="contact">
      <h2 className="bar">Contacting Connor</h2>
      <div className="contact-grid">
        <a href={`mailto:${LINKS.email}`}><span aria-hidden="true">✉</span> Send Message</a>
        <External href={LINKS.linkedin}><span aria-hidden="true">＋</span> Add to Network</External>
        <button type="button" onClick={onOpenChat}><span aria-hidden="true">💬</span> Instant Message</button>
        <External href={LINKS.github}><span aria-hidden="true">⌥</span> View Code</External>
        <External href={LINKS.resume}><span aria-hidden="true">▤</span> Get Resume</External>
        <button type="button" onClick={copyLink}><span aria-hidden="true">{copyIcon}</span> {copyText}</button>
      </div>
    </section>
  );
}

function MusicPlayer() {
  const playing = useSyncExternalStore(music.subscribe, music.isPlaying);
  return (
    <section className={`card player${playing ? ' playing' : ''}`} aria-label="Music player">
      <h2 className="bar">Connor's Song</h2>
      <div className="player-row">
        <button type="button" className="play-btn" aria-pressed={playing} aria-label={playing ? 'Pause music' : 'Play music'} onClick={music.toggle}>
          {playing ? '❚❚' : '▶'}
        </button>
        <div className="player-info">
          <div className="track">construct_loop.mid</div>
          <div className="artist">connor · 96 bpm · synthesized live</div>
        </div>
        <div className="eq" aria-hidden="true"><i /><i /><i /><i /><i /></div>
      </div>
      <label className="vol">vol{' '}
        <input type="range" min="0" max="100" defaultValue="45" onChange={(e) => music.setVolume(e.target.value / 100)} />
      </label>
    </section>
  );
}

export default function LeftColumn({ onOpenChat }) {
  return (
    <aside className="col-left">
      <ProfileCard />
      <ContactCard onOpenChat={onOpenChat} />
      <section className="card url-card">
        <b>Connor's URL:</b><br />
        <span className="url">{LINKS.site}</span>
      </section>
      <MusicPlayer />
      <section className="card" id="interests">
        <h2 className="bar">Connor's Interests</h2>
        <InfoTable rows={INTERESTS} />
      </section>
      <section className="card">
        <h2 className="bar">Connor's Details</h2>
        <InfoTable rows={DETAILS} />
      </section>
    </aside>
  );
}
