import React, { useEffect, useState } from 'react';
import './Hero.css';

function Hero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="hero">
      <div className="hero-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>
      
      <div className="hero-content" style={{ transform: `translateY(${scrollY * 0.5}px)` }}>
        <div className="hero-label">💭📦</div>
        
        <h1 className="hero-title">
          <span className="line">Robin</span>
          <span className="line accent">Connor</span>
          <span className="line">Blalock</span>
        </h1>
        
        <p className="hero-subtitle">
          Building digital experiences that blend
          <br />
          <span className="rotating-text">
            <span className="text-rotate">creativity</span>
            <span className="text-rotate">innovation</span>
            <span className="text-rotate">precision</span>
          </span>
          {" "}with purpose
        </p>
        
        <div className="hero-cta">
          <a href="#projects" className="btn btn-primary">View Work</a>
          <a href="#contact" className="btn btn-secondary">Get in Touch</a>
        </div>
        
        <div className="scroll-indicator">
          <div className="mouse">
            <div className="wheel"></div>
          </div>
          <p>Scroll to explore</p>
        </div>
      </div>
    </section>
  );
}

export default Hero;