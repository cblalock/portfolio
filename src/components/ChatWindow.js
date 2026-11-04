import { useEffect, useRef, useState } from 'react';

function Message({ msg }) {
  if (msg.kind === 'sys') return <div className="msg sys">{msg.text}</div>;
  if (msg.kind === 'you') return <div className="msg you"><b>you:</b> {msg.text}</div>;
  // Bot replies are pre-written in agent/content.js and never contain visitor input.
  return <div className="msg bot"><b>cb0t:</b> <span dangerouslySetInnerHTML={{ __html: msg.html }} /></div>;
}

export default function ChatWindow({ chat }) {
  const { open, messages, chips, typing, mode, unread, nudge, show, minimize, send } = chat;
  const [draft, setDraft] = useState('');
  const log = useRef(null);
  const input = useRef(null);
  const tab = useRef(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    log.current.scrollTop = log.current.scrollHeight;
  }, [messages, open]);

  // Move focus into the window when it opens, and back to the tab when it minimizes.
  useEffect(() => {
    if (open && window.matchMedia('(pointer: fine)').matches) input.current.focus();
    if (!open && wasOpen.current) tab.current.focus();
    wasOpen.current = open;
  }, [open]);

  function submit(e) {
    e.preventDefault();
    send(draft);
    setDraft('');
  }

  return (
    <>
      <section className="im" hidden={!open} aria-label="Chat with cb0t">
        <div className="im-title">
          <span className="im-name"><span className="online-dot" />cb0t · Instant Message</span>
          <span><button type="button" className="win-btn" id="imMin" aria-label="Minimize chat" onClick={minimize}>_</button></span>
        </div>
        <div className="im-toolbar"><span className="im-mode">mode: {mode}</span></div>
        <div className="im-log" ref={log} aria-live="polite">
          {messages.map((m) => <Message key={m.id} msg={m} />)}
        </div>
        <div className="im-typing" aria-hidden="true">{typing ? 'cb0t is typing...' : ' '}</div>
        <div className="im-chips">
          {chips.map((c) => <button type="button" className="chip" key={c} onClick={() => send(c)}>{c}</button>)}
        </div>
        <form className="im-input" onSubmit={submit}>
          <label className="sr-only" htmlFor="imInput">Message</label>
          <input id="imInput" ref={input} type="text" autoComplete="off" placeholder="type a message..." maxLength={300}
            value={draft} onChange={(e) => setDraft(e.target.value)} />
          <button type="submit">Send</button>
        </form>
      </section>

      {/* Keyed on the nudge count so each new unread message replays the bounce. */}
      <button key={nudge} type="button" className={`im-tab${nudge ? ' nudge' : ''}`} ref={tab} hidden={open} onClick={() => show()}>
        <span className="online-dot" />cb0t {unread > 0 && <span className="badge">{unread}</span>}
      </button>
    </>
  );
}
