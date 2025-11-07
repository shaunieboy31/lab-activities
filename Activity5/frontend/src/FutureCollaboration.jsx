import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaEye,
  FaCloud,
  FaRobot,
  FaArrowLeft,
  FaUsersCog,
  FaLightbulb,
} from "react-icons/fa";
import "./Feed.css";

export default function FutureCollaboration() {
  const navigate = useNavigate();

  return (
    <div className="innovation-page">
      {/* Hero Section */}
      <section className="hero dark-hero">
        <div className="hero-text">
          <h1>The Future of IT Collaboration</h1>
          <p className="subtext">
            Explore emerging trends, technologies, and innovations shaping how
            teams will collaborate in the digital age.
          </p>
        </div>
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
          alt="future technology teamwork"
          className="hero-img"
        />
      </section>

      {/* Main Content */}
      <section className="content">
        {/* 1. Intro */}
        <div className="section-block">
          <h2><FaEye className="icon" /> A New Era of Collaboration</h2>
          <p>
            As technology continues to evolve, so does the way we work together.
            The next decade of IT collaboration will be defined by intelligent
            tools, connected environments, and human-AI synergy.
          </p>
          <p>
            Teams are moving beyond traditional communication channels to adopt
            platforms that enable real-time creation, instant problem-solving,
            and seamless global cooperation.
          </p>
        </div>

        {/* 2. Technologies Shaping the Future */}
        <div className="section-block">
          <h2><FaRobot className="icon" /> Technologies Driving Change</h2>
          <ul className="benefits-list">
            <li>
              <strong>Artificial Intelligence:</strong> Smart assistants and
              predictive analytics enhance collaboration and automate workflows.
            </li>
            <li>
              <strong>Cloud Computing:</strong> Teams can build, share, and
              deploy software from anywhere in the world.
            </li>
            <li>
              <strong>AR & VR Collaboration:</strong> Virtual spaces create
              immersive environments for global teamwork.
            </li>
            <li>
              <strong>Blockchain:</strong> Secure, transparent project tracking
              builds trust and accountability.
            </li>
            <li>
              <strong>Edge Computing:</strong> Real-time collaboration at scale,
              even with complex data systems.
            </li>
          </ul>
        </div>

        {/* 3. The Human Side */}
        <div className="section-block">
          <h2><FaUsersCog className="icon" /> The Human Connection</h2>
          <p>
            Technology alone doesn’t build innovation — people do. As digital
            tools become more advanced, empathy, communication, and teamwork
            remain the foundation of success. The most effective future teams
            will be those that balance technological efficiency with human
            creativity and emotional intelligence.
          </p>
        </div>

        {/* 4. ConVINCE’s Vision */}
        <div className="section-block">
          <h2><FaLightbulb className="icon" /> The ConVINCE Vision for the Future</h2>
          <p>
            <strong>ConVINCE</strong> envisions a world where IT collaboration
            transcends boundaries. By empowering innovators through digital
            ecosystems, mentorship, and AI-driven cooperation tools, we’re
            shaping the future of how technology and humanity progress — side by side.
          </p>
          <p>
            Together, we are redefining collaboration: smart, seamless, and
            deeply human.
          </p>
        </div>

        {/* 5. Quote */}
        <div className="section-block quote">
          <h3>
            “The future of IT isn’t about machines replacing humans — it’s about
            humans and machines creating together.”
          </h3>
        </div>

        {/* 6. Call to Action */}
        <div className="section-block cta">
          <h2>Be Part of the Future</h2>
          <p>
            Join <strong>ConVINCE</strong> and help shape the evolution of IT
            collaboration. Together, we can build a smarter, more connected
            digital world.
          </p>
        </div>

        {/* Back Button */}
        <button className="btn back-btn" onClick={() => navigate("/")}>
          <FaArrowLeft /> Back to Home
        </button>
      </section>
    </div>
  );
}
