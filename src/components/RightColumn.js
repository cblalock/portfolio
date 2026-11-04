import { useEffect, useRef } from 'react';
import { LINKS } from '../data/site';
import { PROJECTS } from '../data/projects';

const imgVar = (img) => ({ '--img': `url("${img}")` });
const NOTES = PROJECTS.filter((p) => p.comment);

// cb0t's wall avatar: a small green robot face.
const CB0T_AVATAR = 'data:image/svg+xml,' + encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 60'>" +
  "<rect width='60' height='60' fill='#020a05'/>" +
  "<g stroke='#00ff88' stroke-width='2.5' fill='none'>" +
  "<rect x='12' y='18' width='36' height='30' rx='3'/><path d='M30 18V9M6 29v9M54 29v9M22 40h16'/></g>" +
  "<circle cx='30' cy='8' r='3' fill='#00ff88'/>" +
  "<circle cx='23' cy='30' r='3.5' fill='#00ff88'/><circle cx='37' cy='30' r='3.5' fill='#00ff88'/></svg>"
);

function ProjectLink({ id, onOpen, children }) {
  return <button type="button" className="linklike" onClick={() => onOpen(id)}>{children}</button>;
}

function Top8({ highlight, onOpen }) {
  const tileClass = (id) => {
    if (!highlight) return 't8';
    return highlight.ids.includes(id) ? 't8 hl' : 't8 dim';
  };
  return (
    <section className="card" id="top8">
      <h2 className="bar">Connor's Top 8 <small>Connor has {PROJECTS.length} builds</small></h2>
      <div className="top8">
        {PROJECTS.map((p, i) => (
          // The highlight nonce remounts tiles so a repeat highlight replays its animation.
          <button key={`${p.id}-${highlight?.nonce ?? 0}`} type="button" className={tileClass(p.id)} data-id={p.id} style={imgVar(p.img)} onClick={() => onOpen(p.id)}>
            <span className="t8-name">{p.name}</span>
            <span className="t8-thumb" role="img" aria-label={p.title} />
            <span className="t8-rank">#{i + 1}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

// Real comments live in this repo's GitHub Discussions, through giscus.
function Guestbook() {
  const host = useRef(null);

  useEffect(() => {
    const el = host.current;
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    Object.entries({
      repo: 'cblalock/portfolio',
      repoId: 'R_kgDORO8MOA',
      category: 'Announcements',
      categoryId: 'DIC_kwDORO8MOM4DKVLd',
      mapping: 'specific',
      term: 'guestbook',
      strict: '1',
      reactionsEnabled: '0',
      emitMetadata: '0',
      inputPosition: 'top',
      theme: 'transparent_dark',
      lang: 'en',
      loading: 'lazy',
    }).forEach(([key, value]) => { script.dataset[key] = value; });
    el.appendChild(script);
    return () => { el.replaceChildren(); };
  }, []);

  return (
    <div id="guestbook" className="guestbook">
      <b>Add Comment</b> <small>sign in with GitHub to leave a real one</small>
      <div ref={host} />
    </div>
  );
}

function Comments({ onOpen, onOpenChat }) {
  return (
    <section className="card" id="comments">
      <h2 className="bar">Connor's Friends Comments</h2>
      <p className="comments-head">Displaying {NOTES.length} of {NOTES.length} comments ( <a href="#guestbook">Add Comment</a> )</p>
      <div className="comment-list">
        {NOTES.map((p) => (
          <div className="comment" key={p.id}>
            <div className="comment-who">
              <button type="button" onClick={onOpenChat}>cb0t</button>
              <span className="comment-av" style={imgVar(CB0T_AVATAR)} />
            </div>
            <div className="comment-body"><div className="comment-time">favorite thing about <ProjectLink id={p.id} onOpen={onOpen}>{p.name}</ProjectLink></div>{p.comment}</div>
          </div>
        ))}
      </div>
      <Guestbook />
    </section>
  );
}

export default function RightColumn({ highlight, onOpen, onOpenChat }) {
  return (
    <div className="col-right">
      <section className="card network">
        <p><b>Connor is in your extended network.</b></p>
      </section>

      <section className="card">
        <h2 className="bar">Connor's Latest Activity</h2>
        <ul className="activity">
          <li><span className="when">new</span> added <ProjectLink id="the-hunter" onOpen={onOpen}>The Hunter</ProjectLink> to Top 8</li>
          <li><span className="when">recent</span> uploaded a trailer for <ProjectLink id="gearshift" onOpen={onOpen}>Gearshift</ProjectLink></li>
          <li><span className="when">recent</span> shipped the <ProjectLink id="trading-agent" onOpen={onOpen}>Trading Agent</ProjectLink> performance dashboard</li>
        </ul>
      </section>

      <section className="card">
        <h2 className="bar">Connor's Blurbs</h2>
        <div className="blurbs">
          <h3>About me:</h3>
          <p>i just like building stuff. mostly agents, data pipelines, and things that run on their own while i sleep. the builds below say it better than i could.</p>
          <h3>Who I'd like to meet:</h3>
          <p>teams building with AI agents, data, or infrastructure. if you're hiring, <button type="button" className="linklike" onClick={onOpenChat}>IM my agent</button> or just <a href={`mailto:${LINKS.email}`}>email me</a>.</p>
        </div>
      </section>

      <Top8 highlight={highlight} onOpen={onOpen} />
      <Comments onOpen={onOpen} onOpenChat={onOpenChat} />
    </div>
  );
}
