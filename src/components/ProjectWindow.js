import { useEffect, useRef } from 'react';

const LinkOut = ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>;

export default function ProjectWindow({ project, onClose }) {
  const closeBtn = useRef(null);
  const lastFocus = useRef(null);
  const isOpen = Boolean(project);

  useEffect(() => {
    if (!isOpen) return undefined;
    lastFocus.current = document.activeElement;
    closeBtn.current.focus();
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      lastFocus.current?.focus?.();
    };
  }, [isOpen, onClose]);

  if (!project) return null;
  const p = project;
  return (
    <div className="win-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="win" role="dialog" aria-modal="true" aria-labelledby="pwTitle">
        <div className="win-title">
          <span className="win-name">{p.file}</span>
          <button type="button" className="win-btn" ref={closeBtn} aria-label="Close" onClick={onClose}>✕</button>
        </div>
        <div className="win-body">
          <div className="pw-img" role="img" aria-label={`${p.title} screenshot`} style={{ '--img': `url("${p.img}")` }} />
          <div className="pw-text">
            <p className="pw-cat">{p.cat}</p>
            <h2 id="pwTitle">{p.title}</h2>
            <p>{p.desc}</p>
            <div className="tags">{p.tech.map((t) => <span className="tag" key={t}>{t}</span>)}</div>
            <div className="pw-links">
              {p.live && <LinkOut href={p.live}>▶ Live</LinkOut>}
              {p.github && <LinkOut href={p.github}>⌥ Code</LinkOut>}
              {p.trailer && <LinkOut href={p.trailer}>▶ Trailer</LinkOut>}
              {p.note && <span className="draft">{p.note}</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
