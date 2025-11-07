import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaCogs,
  FaComments,
  FaArrowLeft,
  FaLightbulb,
  FaChartLine,
} from "react-icons/fa";
import "./Feed.css";

export default function BuildingTeamwork() {
  const navigate = useNavigate();

  return (
    <div className="innovation-page">
      {/* Hero Section */}
      <section className="hero dark-hero">
        <div className="hero-text">
          <h1>Building Innovation Through Teamwork</h1>
          <p className="subtext">
            Learn how effective teamwork is essential for fostering innovation in IT — 
            where collaboration transforms ideas into impact.
          </p>
        </div>
        <img
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
          alt="team working together"
          className="hero-img"
        />
      </section>

      {/* Main Content */}
      <section className="content">
        {/* 1. Intro */}
        <div className="section-block">
          <h2><FaUsers className="icon" /> The Foundation of Innovation</h2>
          <p>
            Every groundbreaking innovation begins with a strong team. 
            Teamwork allows diverse individuals to share knowledge, challenge assumptions, 
            and build creative solutions that would be impossible to achieve alone.
          </p>
          <p>
            In IT, effective teamwork means more than just dividing tasks — 
            it’s about integrating diverse perspectives, skills, and experiences to 
            push boundaries and deliver excellence.
          </p>
        </div>

        {/* 2. Key Pillars */}
        <div className="section-block">
          <h2><FaCogs className="icon" /> The Pillars of Team-Based Innovation</h2>
          <ul className="benefits-list">
            <li><strong>Communication:</strong> Open dialogue ensures alignment, clarity, and creativity.</li>
            <li><strong>Trust:</strong> Teams thrive when every member feels valued and supported.</li>
            <li><strong>Diversity:</strong> Varied perspectives spark original ideas and drive problem-solving.</li>
            <li><strong>Adaptability:</strong> The best teams evolve quickly in response to change.</li>
            <li><strong>Shared Vision:</strong> Innovation happens when everyone works toward a common goal.</li>
          </ul>
        </div>

        {/* 3. Collaboration in Action */}
        <div className="section-block">
          <h2><FaComments className="icon" /> Collaboration in the Workplace</h2>
          <p>
            Leading IT organizations know that teamwork is not a soft skill — 
            it’s a core strategy. From agile development to cloud integration, 
            collaboration accelerates innovation cycles and minimizes risk.
          </p>
          <p>
            Companies like Google, Microsoft, and IBM have built their success on 
            fostering collaborative ecosystems where developers, designers, and 
            analysts work side by side to build the future of technology.
          </p>
        </div>

        {/* 4. The ConVINCE Approach */}
        <div className="section-block">
          <h2><FaChartLine className="icon" /> The ConVINCE Approach</h2>
          <p>
            <strong>ConVINCE</strong> promotes teamwork as the heart of progress. 
            Through mentorship, community events, and shared projects, 
            we connect individuals who are passionate about building technology together.
          </p>
          <p>
            Our platform encourages members to exchange skills, collaborate on 
            real-world IT challenges, and transform ideas into deployable solutions 
            through open communication and team synergy.
          </p>
        </div>

        {/* 5. Quote */}
        <div className="section-block quote">
          <h3>
            “Great teams don’t just build products — they build possibilities.”
          </h3>
        </div>

        {/* 6. Call to Action */}
        <div className="section-block cta">
          <h2>Join a Team That Innovates Together</h2>
          <p>
            Become part of ConVINCE and experience the power of teamwork in innovation.
            Collaborate, create, and shape the future of IT with others who share your passion.
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
