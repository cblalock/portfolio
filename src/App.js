import React, { useState, useEffect } from 'react';
import './App.css';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';

function App() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className={`app ${isLoaded ? 'loaded' : ''}`}>
      {/* Custom cursor follower */}
      <div 
        className="cursor-glow" 
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
        }}
      />
      
      <Hero />
      <About />
      <Projects />
      <Contact />
      
      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>2026 Robin Connor Blalock. Crafted with curiosity & code.</p>
          <div className="footer-links">
            <a href="https://github.com/cblalock" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://linkedin.com/in/robin-blalock" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
