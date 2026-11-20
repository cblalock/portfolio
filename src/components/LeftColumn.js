import { useEffect, useRef, useState } from 'react';
import { asset, LINKS } from '../data/site';

// Porter Robinson's official upload, which allows embedding (checked 2026-11-20).
const SONG_ID = 'kss2zXoUM3Q';
const SONG_URL = `https://www.youtube.com/embed/${SONG_ID}?enablejsapi=1&playsinline=1&rel=0&origin=${encodeURIComponent(window.location.origin)}`;

const START_VOLUME = 45;
let widgetApi = null;

const External = ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>;

const INTERESTS = [
  ['General', 'taking things apart to see how they work, agents that run on their own, markets, games'],
  ['Languages', 'Python, JavaScript, Java, C, C++, SQL, HTML/CSS'],
  ['Building With', 'React, Node.js, Express, FastAPI, OpenCV, Unreal Engine 5'],
  ['Data', 'Pandas, NumPy, SQLite, PostgreSQL, Supabase, Tableau, Jupyter'],
  ['AI', 'Claude API, Ollama, local LLMs, agents with tool use'],
  ['Infra', 'Docker, Ansible, Railway, Linux, Git, networking'],
];

const DETAILS = [
  ['Status', 'Open to opportunities'],
  ['Here for', 'Jobs, Networking, Building'],
  ['Education', 'BA, Computer Science\nMinor in Psychology\nUniversity of Alabama at Birmingham'],
  ['Currently', 'Technician, Yard Robotics'],
  ['Background', 'U.S. Army: comms systems, networking, COMSEC, VSAT. Hardware, optimization, manufacturing.'],
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

function loadWidgetApi() {
  if (!widgetApi) {
    widgetApi = new Promise((resolve, reject) => {
      if (window.YT?.Player) { resolve(window.YT); return; }
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => { prev?.(); resolve(window.YT); };
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
  return widgetApi;
}

function MusicPlayer() {
  const frame = useRef(null);
  const widget = useRef(null);
  const volume = useRef(START_VOLUME);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadWidgetApi().then((YT) => {
      if (cancelled) return;
      // Attach to the iframe already on the page (it has enablejsapi=1).
      const p = new YT.Player(frame.current, {
        events: {
          onReady: () => {
            if (cancelled) return;
            widget.current = p;
            p.setVolume(volume.current);
            setReady(true);
          },
          // Keep the volume matching the slider when playback starts.
          onStateChange: (e) => { if (!cancelled && e.data === YT.PlayerState.PLAYING) p.setVolume(volume.current); },
        },
      });
    }).catch(() => {}); // the player's own controls still work without the slider
    return () => { cancelled = true; };
  }, []);

  function changeVolume(e) {
    volume.current = Number(e.target.value);
    widget.current?.setVolume(volume.current);
  }

  return (
    <section className="card player" aria-label="Music player">
      <h2 className="bar">Connor's Song</h2>
      <iframe
        ref={frame}
        className="song-embed"
        src={SONG_URL}
        title="Connor's Song: Is There Really No Happiness? (Frost Children Remix) by Porter Robinson"
        allow="autoplay; encrypted-media; picture-in-picture"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
      {ready && (
        <label className="vol">vol{' '}
          <input type="range" min="0" max="100" defaultValue={START_VOLUME} onChange={changeVolume} />
        </label>
      )}
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
