import { useEffect, useMemo, useRef, useState } from 'react';
import { answer } from '../agent/respond';
import { brain } from '../agent/brain';
import { doorSound, imBlip, userGestured } from '../audio';

const CHIPS = ['what’s he best at?', 'show me the trading agent', 'python projects', 'how do i contact him?', 'are you an AI?'];
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const signedOn = () => new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

// State and behavior for the IM window. `onAction` lets a reply drive the page.
export function useChat(onAction) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [chips, setChips] = useState([]);
  const [typing, setTyping] = useState(false);
  const [mode, setMode] = useState('keyword brain');
  const [unread, setUnread] = useState(0);
  const [nudge, setNudge] = useState(0);

  const openRef = useRef(false);
  const greeted = useRef(false);
  const nextId = useRef(0);
  const queue = useRef(Promise.resolve());
  const actionRef = useRef(onAction);
  useEffect(() => { actionRef.current = onAction; }, [onAction]);
  useEffect(() => { brain.subscribe(setMode); }, []);

  const chat = useMemo(() => {
    const add = (msg) => {
      const entry = { id: ++nextId.current, ...msg };
      setMessages((list) => [...list, entry]);
    };

    async function say(html, action, nextChips) {
      setTyping(true);
      await wait(350 + Math.min(html.length * 4, 900));
      setTyping(false);
      add({ kind: 'bot', html });
      if (!openRef.current) {
        setUnread((n) => n + 1);
        setNudge((n) => n + 1);
      }
      if (openRef.current || userGestured) imBlip();
      if (nextChips) setChips(Array.isArray(nextChips) ? nextChips : CHIPS);
      if (action) actionRef.current(action);
    }

    // Replies run one at a time so a quick second message can't swallow the first answer.
    const enqueue = (task) => { queue.current = queue.current.then(task); };

    function greet() {
      if (greeted.current) return;
      greeted.current = true;
      add({ kind: 'sys', text: `cb0t signed on at ${signedOn()}.` });
      enqueue(() => say('hey! i’m connor’s agent. i can open his projects, tell you what he’s built with what, or point you to his contact info. what are you looking for?', null, true));
    }

    function show(sound = true) {
      if (openRef.current) return;
      openRef.current = true;
      setOpen(true);
      setUnread(0);
      if (sound && userGestured) doorSound(true);
      greet();
      brain.wake();
    }

    function minimize() {
      openRef.current = false;
      setOpen(false);
      if (userGestured) doorSound(false);
    }

    function send(raw) {
      const text = raw.trim();
      if (!text) return;
      show(false);
      add({ kind: 'you', text });
      enqueue(async () => {
        setTyping(true);
        const r = await answer(text, brain.search);
        await say(r.text, r.act, r.chips);
      });
    }

    return { show, minimize, send, greet };
  }, []);

  // Wide screens have room beside the page, so the buddy pops in on its own (silently).
  // Anything narrower only gets a nudge on the tab, so it never covers the Top 8 uninvited.
  useEffect(() => {
    const timer = setTimeout(() => {
      if (openRef.current) return;
      if (window.innerWidth >= 1680) chat.show(false);
      else chat.greet();
    }, 2500);
    return () => clearTimeout(timer);
  }, [chat]);

  return { ...chat, open, messages, chips, typing, mode, unread, nudge };
}
