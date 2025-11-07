import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaLightbulb,
  FaEye,
  FaArrowRight,
  FaUsers,
  FaLaptopCode,
  FaCommentDots,
  FaPlusCircle,
  FaTrash,
} from "react-icons/fa";
import "./Feed.css";

export default function Home() {
  const navigate = useNavigate();

  // --- Default blog posts ---
  const [blogPosts, setBlogPosts] = useState([
    {
      icon: <FaUsers />,
      title: "Innovation Through Collaboration",
      text: "Discover how collaboration drives groundbreaking innovation and transformative solutions.",
      link: "/innovation-collaboration",
      comments: [],
    },
    {
      icon: <FaLaptopCode />,
      title: "Building Innovation Through Teamwork",
      text: "Learn how effective teamwork is essential for fostering innovation in IT.",
      link: "/building-teamwork",
      comments: [],
    },
    {
      icon: <FaEye />,
      title: "The Future of IT Collaboration",
      text: "Explore emerging trends and future possibilities in IT collaboration.",
      link: "/future-collaboration",
      comments: [],
    },
  ]);

  const [newPost, setNewPost] = useState({ title: "", text: "", image: "" });
  const [showPopup, setShowPopup] = useState(false);

  // --- Add new post ---
  const handleAddPost = () => {
    if (newPost.title.trim() === "" || newPost.text.trim() === "") return;
    setBlogPosts([
      ...blogPosts,
      {
        icon: <FaLightbulb />,
        title: newPost.title,
        text: newPost.text,
        link: "",
        image: newPost.image,
        comments: [],
      },
    ]);
    setNewPost({ title: "", text: "", image: "" });
    setShowPopup(false);
  };

  // --- Add comment ---
  const handleAddComment = (index, comment) => {
    if (!comment.trim()) return;
    const updated = [...blogPosts];
    updated[index].comments.push(comment);
    setBlogPosts(updated);
  };

  // --- Delete post ---
  const handleDeletePost = (index) => {
    const updated = blogPosts.filter((_, i) => i !== index);
    setBlogPosts(updated);
  };

  // --- Delete comment ---
  const handleDeleteComment = (postIndex, commentIndex) => {
    const updated = [...blogPosts];
    updated[postIndex].comments.splice(commentIndex, 1);
    setBlogPosts(updated);
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-text">
          <h1>Empowering Innovation Through Collaboration</h1>
          <p>
            <span className="highlight">ConVINCE</span> connects visionary{" "}
            <span className="highlight">minds</span> to transform ideas into
            real-world IT solutions.
          </p>
        </div>
        <img
          src="convince-logo.png"
          alt="ConVINCE Logo"
          className="hero-img"
        />
      </section>

      {/* About Section */}
      <section className="about">
        <h2>About ConVINCE</h2>
        <div className="about-content">
          <img
            src="https://images.unsplash.com/photo-1551434678-e076c223a692"
            alt="team discussion"
            className="about-img"
          />
          <p>
            <strong>ConVINCE</strong> (Collaboration of New Visionaries
            Innovating New Concepts and Excellence) is a movement that fosters
            creativity, teamwork, and excellence in the field of technology.
            <br />
            <br />
            We believe that great innovations are born when diverse minds come
            together.
          </p>
        </div>
      </section>

      {/* Blog Section */}
      <section className="blogs">
        <div className="blogs-header">
          <h2>Community Blog Posts</h2>
          <button className="add-post-btn" onClick={() => setShowPopup(true)}>
            <FaPlusCircle /> Add Post
          </button>
        </div>

        <div className="blog-grid">
          {blogPosts.map((post, index) => (
            <div key={index} className="blog-card">
              <div className="blog-icon">{post.icon}</div>
              <h3>{post.title}</h3>
              <p>{post.text}</p>
              {post.image && (
                <img src={post.image} alt={post.title} className="blog-image" />
              )}

              <div className="card-actions">
                <button
                  className="read-more"
                  onClick={() => post.link && navigate(post.link)}
                >
                  Read More <FaArrowRight className="arrow" />
                </button>

                <button
                  className="delete-btn"
                  onClick={() => handleDeletePost(index)}
                >
                  <FaTrash /> Delete Post
                </button>
              </div>

              {/* Comments Section */}
              <div className="comments-section">
                <h4>
                  <FaCommentDots /> Comments
                </h4>
                <ul>
                  {post.comments.map((c, i) => (
                    <li key={i} className="comment-item">
                      <span>{c}</span>
                      <button
                        className="delete-comment-btn"
                        onClick={() => handleDeleteComment(index, i)}
                      >
                        <FaTrash />
                      </button>
                    </li>
                  ))}
                </ul>
                <input
                  type="text"
                  placeholder="Write a comment..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAddComment(index, e.target.value);
                      e.target.value = "";
                    }
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Add New Post Popup */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Add a New Post</h3>
            <input
              type="text"
              placeholder="Post Title"
              value={newPost.title}
              onChange={(e) =>
                setNewPost({ ...newPost, title: e.target.value })
              }
            />
            <textarea
              placeholder="Write your post..."
              value={newPost.text}
              onChange={(e) => setNewPost({ ...newPost, text: e.target.value })}
            />
            <input
              type="text"
              placeholder="Image URL (optional)"
              value={newPost.image}
              onChange={(e) => setNewPost({ ...newPost, image: e.target.value })}
            />
            <div className="popup-actions">
              <button className="btn primary" onClick={handleAddPost}>
                Add Post
              </button>
              <button
                className="btn secondary"
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mission Section */}
      <section className="mission">
        <div className="mission-item">
          <div className="mission-header">
            <FaLightbulb className="icon" />
            <h3>Our Mission</h3>
          </div>
          <p>
            To inspire the next generation of IT innovators through collaboration
            and creativity.
          </p>
        </div>

        <div className="mission-item">
          <div className="mission-header">
            <FaEye className="icon" />
            <h3>Join the Movement</h3>
          </div>
          <p>
            Become part of our movement to drive innovation and excellence in IT.
          </p>
        </div>
      </section>
    </div>
  );
}
