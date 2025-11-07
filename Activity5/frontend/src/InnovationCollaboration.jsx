import React from "react";
import { FaUsers, FaLightbulb, FaArrowLeft, FaHandshake, FaRocket, FaGlobe } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Feed.css";

export default function InnovationCollaboration() {
  const navigate = useNavigate();

  return (
    <div className="innovation-page">
      {/* Hero Section */}
      <section className="hero dark-hero">
        <div className="hero-text">
          <h1>Innovation Through Collaboration</h1>
          <p className="subtext">
            Discover how collaboration drives groundbreaking innovation and
            transformative solutions in IT — where teamwork turns bold ideas into real-world impact.
          </p>
        </div>
        <img
          src="https://images.unsplash.com/photo-1551434678-e076c223a692"
          alt="team collaborating"
          className="hero-img"
        />
      </section>

      {/* Main Content */}
      <section className="content">
        {/* 1. Overview */}
        <div className="section-block">
          <h2><FaLightbulb className="icon" /> The Power of Collaboration</h2>
          <p>
            In today’s fast-paced digital world, innovation thrives on connection. 
            No single individual possesses every skill or perspective necessary 
            to solve complex IT challenges. True breakthroughs happen when diverse minds, 
            disciplines, and technologies come together in a shared mission.
          </p>
          <p>
            At <strong>ConVINCE</strong>, we believe that every great idea is a seed 
            — and collaboration is the environment that helps it grow. Through teamwork, 
            transparency, and creativity, innovation becomes both achievable and sustainable.
          </p>
        </div>

        {/* 2. Benefits */}
        <div className="section-block">
          <h2><FaHandshake className="icon" /> Why Collaboration Matters in IT</h2>
          <ul className="benefits-list">
            <li><strong>Shared Expertise:</strong> Different backgrounds bring new ways of solving problems.</li>
            <li><strong>Faster Development:</strong> Teams working together can iterate and deploy solutions more quickly.</li>
            <li><strong>Stronger Innovation:</strong> Brainstorming as a group sparks creativity and fresh thinking.</li>
            <li><strong>Better Outcomes:</strong> Collaboration ensures projects reflect multiple perspectives and meet user needs.</li>
            <li><strong>Empowered Teams:</strong> Mutual respect and open communication foster long-term success.</li>
          </ul>
        </div>

        {/* 3. Real-World Examples */}
        <div className="section-block">
          <h2><FaGlobe className="icon" /> Real-World Impact</h2>
          <p>
            Around the world, collaboration is driving some of the most exciting advancements in IT:
          </p>
          <ul className="examples-list">
            <li><strong>Open-Source Communities:</strong> Platforms like GitHub allow developers worldwide to co-create powerful tools.</li>
            <li><strong>Tech Partnerships:</strong> Cross-company collaborations help tackle challenges like cybersecurity and sustainability.</li>
            <li><strong>Startup Ecosystems:</strong> Entrepreneurs partner with innovators to turn prototypes into global products.</li>
          </ul>
        </div>

        {/* 4. ConVINCE in Action */}
        <div className="section-block">
          <h2><FaRocket className="icon" /> How ConVINCE Makes It Happen</h2>
          <p>
            The <strong>ConVINCE</strong> community empowers innovators through hackathons, mentorship programs, 
            and collaborative research projects. Whether you’re a developer, designer, or strategist, 
            ConVINCE connects you with peers who share your drive to create change.
          </p>
          <p>
            Together, we turn ambitious concepts into working technologies — from AI-driven solutions 
            to smart infrastructure that redefines the way we live and work.
          </p>
        </div>

        {/* 5. Quote */}
        <div className="section-block quote">
          <h3>
            “Innovation is not a solo act — it’s the outcome of collective brilliance.”
          </h3>
        </div>

        {/* 6. CTA */}
        <div className="section-block cta">
          <h2>Ready to Collaborate?</h2>
          <p>
            Join our growing network of innovators, creators, and change-makers. 
            Be part of a community that transforms ideas into action.
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
