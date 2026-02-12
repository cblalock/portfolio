//import React, { useState } from 'react';
import './Contact.css';

function Contact() {
  //for for future
  /*const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // For now, just show a success message
    // In production, you'd connect this to a backend or service like Formspree
    setStatus('Thanks for reaching out! I\'ll get back to you soon.');
    
    // Reset form
    setFormData({ name: '', email: '', message: '' });
    
    // Clear status after 5 seconds
    setTimeout(() => setStatus(''), 5000);
  };*/

  return (
    <section id="contact" className="contact">
      <div className="container">
        <div className="contact-content">
          <div className="contact-info">
            <h2 className="section-title">Let's Connect</h2>
            <p className="contact-description"> 
              I'd love to hear from you, feel free to reach out!
            </p>
            
            <div className="contact-methods">
              <div className="contact-method">
                <div className="method-icon">📧</div>
                <div>
                  <div className="method-label">Email</div>
                  <a href="mailto:connor.blalock@yahoo.com" className="method-value">
                    connor.blalock@yahoo.com
                  </a>
                </div>
              </div>
              
              <div className="contact-method">
                <div className="method-icon">💼</div>
                <div>
                  <div className="method-label">LinkedIn</div>
                  <a href="https://linkedin.com/in/robin-blalock" target="_blank" rel="noopener noreferrer" className="method-value">
                    /in/robin-blalock
                  </a>
                </div>
              </div>
              
              <div className="contact-method">
                <div className="method-icon">🐙</div>
                <div>
                  <div className="method-label">GitHub</div>
                  <a href="https://github.com/cblalock" target="_blank" rel="noopener noreferrer" className="method-value">
                    @cblalock
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/*
          <div className="contact-form-wrapper">
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your Name"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  placeholder="Tell me about your project or just say hello..."
                />
              </div>
              
              <button type="submit" className="submit-btn">
                <span>Send Message</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
              
              {status && <div className="form-status">{status}</div>}
            </form>
          </div>*/}
        </div>
      </div>
    </section>
  );
}

export default Contact;
