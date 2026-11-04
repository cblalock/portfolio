import { useState } from 'react';
import { LINKS } from '../data/site';

export function TopBar({ onOpenChat, onSearch }) {
  const [query, setQuery] = useState('');

  function submit(e) {
    e.preventDefault();
    onSearch(query);
    setQuery('');
  }

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <a className="logo" href="#top">cblalock<span className="blink">_</span></a>
        <span className="tagline">a place for builds</span>
        <form className="search" role="search" onSubmit={submit}>
          <label className="sr-only" htmlFor="topSearchInput">Ask the agent</label>
          <input id="topSearchInput" type="text" placeholder="ask the agent anything..." autoComplete="off"
            value={query} onChange={(e) => setQuery(e.target.value)} />
          <button type="submit">Search</button>
        </form>
      </div>
      <nav className="navbar" aria-label="Sections">
        <a href="#top">Home</a><span>|</span>
        <a href="#top8">Top 8</a><span>|</span>
        <a href="#interests">Interests</a><span>|</span>
        <a href="#comments">Comments</a><span>|</span>
        <a href="#contact">Contact</a><span>|</span>
        <button type="button" className="linklike" onClick={onOpenChat}>IM the agent</button>
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <a href="#top">Home</a> | <a href="#top8">Top 8</a> | <a href={LINKS.github} target="_blank" rel="noopener noreferrer">GitHub</a> |{' '}
      <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a> | <a href={`mailto:${LINKS.email}`}>Email</a>
      <p>© 2026 Robin Connor Blalock · hand-built, no templates</p>
    </footer>
  );
}
