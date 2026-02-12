import React from 'react';
import './About.css';

function About() {

  return (
    <section id="about" className="about">
      <div className="container">
        <div className="about-content">
          <div className="about-text">
            <h2 className="section-title">About Me</h2>
            <div className="about-paragraphs">
              <p>
                I believe code is a creative medium. Every project 
                is an opportunity to create something meaningful, artistic, and functional.
              </p>
              <p>
                My journey into tech started as a kid, I've always enjoyed learning how things work and
                taking stuff apart. I was fascinated by the internet and how it opened up a new world.
                My first experience with code was editing HTML/CSS (iirc) on Myspace back in the day.
              </p>
              <p>
                I joined the Army in my 20s and learned different communication systems and networking
                fundamentals, that experience taught me a lot! After I got out, I decided to pursue a 
                degree in Computer Science. I feel like I have a wide range of technical skills from
                all my previous experiences, I'm ready to hone in and perfect certain skillsets that a 
                job requires.
              </p>
            </div>
            
            <div className="quick-facts">
              <div className="fact">
                <div className="fact-icon">📍</div>
                <div>
                  <div className="fact-label">Location</div>
                  <div className="fact-value">Hunstville/Nashville</div>
                </div>
              </div>
              <div className="fact">
                <div className="fact-icon">💼</div>
                <div>
                  <div className="fact-label">Status</div>
                  <div className="fact-value">Looking for work</div>
                </div>
              </div>
              <div className="fact">
                <div className="fact-icon">🎓</div>
                <div>
                  <div className="fact-label">Education</div>
                  <div className="fact-value">University of Alabama at Birmingham</div>
                  <div className="fact-value">Bachelor's | Computer Science</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="about-skills">
            <div className="tools-section">
            <h3>Skills & Technologies</h3>
            <div className="tools-tags">
              <span className="tool-tag">C</span>
              <span className="tool-tag">C++</span>
              <span className="tool-tag">Python</span>
              <span className="tool-tag">Java</span>
              <span className="tool-tag">JavaScript</span>
              <span className="tool-tag">SQL</span>
  
              {/* Frameworks */}
              <span className="tool-tag">React</span>
              <span className="tool-tag">Node.js</span>
              <span className="tool-tag">Express</span>
              <span className="tool-tag">OpenCV</span>
  
              {/* Core Concepts */}
              <span className="tool-tag">Data Structures</span>
              <span className="tool-tag">Algorithms</span>
              <span className="tool-tag">REST APIs</span>
              <span className="tool-tag">Real-Time Systems</span>
              <span className="tool-tag">Client-Server Architecture</span>
            </div>
          </div>
            
            <div className="tools-section">
              <h4>Tools & Platforms</h4>
              <div className="tools-tags">
                {/* Development Tools */}
                <span className="tool-tag">Git</span>
                <span className="tool-tag">VS Code</span>
                
                {/* Systems & Networking */}
                <span className="tool-tag">Linux</span>
                <span className="tool-tag">Windows</span>
                <span className="tool-tag">Unreal Engine 5</span>
                <span className="tool-tag">Networking Fundamentals</span>
                <span className="tool-tag">COMSEC</span>
                <span className="tool-tag">VSAT Terminal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
