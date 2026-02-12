import React, { useState } from 'react';
import './Projects.css';

function Projects() {
  const [activeFilter, setActiveFilter] = useState('all');

  const projects = [
    {
      id: 1,
      title: 'UAB Game Launcher',
      category: 'school',
      description: 'A full-stack web SPA that launches games from a library. REST API and SQLite to manage user data, leaderboards, high scores.',
      tech: ['React', 'Node.js', 'SQLite', 'Express', 'JS'],
      image: '${process.env.PUBLIC_URL}/images/uabgames.png',
      github: 'https://github.com/cblalock/CS499GameLauncher',
    },
    {
      id: 2,
      title: 'Gearshift',
      category: 'school',
      description: 'Inspired by Portal 2, a fun and challenging first person puzzle game where you try to escape the factory by completing levels.',
      tech: ['Unreal Engine 5', 'Gitlab'],
      image: '${process.env.PUBLIC_URL}/images/gearshiftpic.png',
      github: 'https://github.com/cblalock/Gearshift',
    },
    {
      id: 3,
      title: 'Autonomous Security Drone',
      category: 'school',
      description: 'A drone project to simulate real events where a drone or camera can be used for security/check in purposes. Real time video feed, facial recognition, identity verification, interrupt driven behavior.',
      tech: ['Java', 'OpenCV', 'TelloSDK'],
      image: '${process.env.PUBLIC_URL}/images/tellodrone.png',
      github: 'https://github.com/cblalock/DroneProject',
    },
    /*{
      id: 4,
      title: 'Project Delta',
      category: 'web',
      description: 'Real-time collaboration tool with WebSocket integration and responsive design.',
      tech: ['Vue.js', 'Socket.io', 'Node.js', 'PostgreSQL'],
      image: 'https://via.placeholder.com/600x400/ff6b35/ffffff?text=Project+Delta',
      github: 'https://github.com/yourusername/project-delta',
      live: 'https://project-delta.com',
      featured: false,
    },*/
  ];

  const filters = ['all'];

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(p => p.category === activeFilter);

  return (
    <section id="projects" className="projects">
      <div className="container">
        <h2 className="section-title">Featured Work</h2>
        
        <div className="project-filters">
          {filters.map(filter => (
            <button
              key={filter}
              className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        <div className="projects-grid">
          {filteredProjects.map((project, index) => (
            <div 
              key={project.id} 
              className={`project-card ${project.featured ? 'featured' : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {project.featured && <div className="featured-badge">Featured</div>}
              
              <div className="project-image">
                <img src={project.image} alt={project.title} />
                <div className="project-overlay">
                  <div className="project-links">
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noopener noreferrer" className="project-link">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        Code
                      </a>
                    )}
                    {project.live && (
                      <a href={project.live} target="_blank" rel="noopener noreferrer" className="project-link">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                          <polyline points="15 3 21 3 21 9"></polyline>
                          <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="project-content">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>
                
                <div className="project-tech">
                  {project.tech.map(tech => (
                    <span key={tech} className="tech-tag">{tech}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Projects;
