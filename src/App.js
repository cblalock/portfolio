import { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import { byId } from './data/projects';
import { useChat } from './hooks/useChat';
import { CursorGlow, MatrixRain } from './components/Background';
import { Footer, TopBar } from './components/Layout';
import LeftColumn from './components/LeftColumn';
import RightColumn from './components/RightColumn';
import ProjectWindow from './components/ProjectWindow';
import ChatWindow from './components/ChatWindow';

const scrollOptions = () => ({
  behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
  block: 'center',
});

function flash(selector) {
  const el = document.querySelector(selector);
  if (!el) return;
  el.scrollIntoView(scrollOptions());
  el.classList.remove('flash');
  void el.offsetWidth; // restart the animation
  el.classList.add('flash');
}

export default function App() {
  const [projectId, setProjectId] = useState(null);
  const [highlight, setHighlight] = useState(null);
  const highlightTimer = useRef(null);
  const highlightNonce = useRef(0);

  useEffect(() => () => clearTimeout(highlightTimer.current), []);

  const closeProject = useCallback(() => setProjectId(null), []);

  // Replies from the agent can drive the page through these actions.
  const runAction = useCallback((action) => {
    switch (action.type) {
      case 'project':
        setProjectId(action.id);
        break;
      case 'flash':
        flash(action.target);
        break;
      case 'highlight':
        document.querySelector('#top8')?.scrollIntoView(scrollOptions());
        setHighlight({ ids: action.ids, nonce: ++highlightNonce.current });
        clearTimeout(highlightTimer.current);
        highlightTimer.current = setTimeout(() => setHighlight(null), 4500);
        break;
      default:
    }
  }, []);

  const chat = useChat(runAction);
  const openChat = () => chat.show();
  const search = (query) => {
    chat.show();
    chat.send(query);
  };

  return (
    <>
      <MatrixRain />
      <CursorGlow />
      <TopBar onOpenChat={openChat} onSearch={search} />
      <main className="profile" id="top">
        <LeftColumn onOpenChat={openChat} />
        <RightColumn highlight={highlight} onOpen={setProjectId} onOpenChat={openChat} />
      </main>
      <Footer />
      <ProjectWindow project={projectId ? byId[projectId] : null} onClose={closeProject} />
      <ChatWindow chat={chat} />
    </>
  );
}
