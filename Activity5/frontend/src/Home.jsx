import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api/api"; // adjust path if your api client is elsewhere
import { useAuth } from "./authContext"; // make sure authContext exists and App is wrapped with AuthProvider
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
  const { currentUser } = useAuth();
  // fallback to localStorage in case authContext isn't restored yet
  const localStoredUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("currentUser") || "null");
    } catch {
      return null;
    }
  })();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", text: "", image: "" });
  const [showPopup, setShowPopup] = useState(false);
  const [commentsInput, setCommentsInput] = useState({}); // keyed by postId

  // fetch posts (and their comments) from backend on mount
  useEffect(() => {
    let mounted = true;
    api
      .get("/posts")
      .then((res) => {
        if (!mounted) return;
        const payload = Array.isArray(res.data) ? res.data : [];
        // normalize each post so UI always reads title, text, image, comments, user
        const normalized = payload.map((p) => ({
          id: p.id,
          icon: <FaLightbulb />,
          title: p.title ?? p.name ?? "",
          // backend may return 'content' or 'text' — prefer content then text
          text: p.content ?? p.text ?? "",
          link: p.link ?? "",
          image: p.image ?? p.img ?? "",
          comments: p.comments ?? [],
          // support both shapes: p.user object or p.userId / p.username fields
          user:
            p.user ??
            (p.userId
              ? { id: p.userId, displayName: p.displayName ?? p.username ?? null, username: p.username ?? null }
              : null),
        }));
        setPosts(normalized);
      })
      .catch(() => {
        setPosts([]);
      });
    return () => (mounted = false);
  }, []);

  // Add new post (backend)
  const handleAddPost = async () => {
    if (newPost.title.trim() === "" || newPost.text.trim() === "") return;

    // prefer authContext currentUser; fallback to token only if needed
    const token = localStorage.getItem("token");
    if (!token && !currentUser) {
      // don't auto-redirect; inform user
      alert('Please sign in to add a post.');
      return;
    }

    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
      const res = await api.post("/posts", { title: newPost.title, content: newPost.text, image: newPost.image }, { headers });
      const p = res.data;

      const createdUser = p.user ?? (currentUser ? { id: currentUser.id, displayName: currentUser.displayName ?? currentUser.username } : null);

      setPosts((prev) => [
        {
          id: p.id,
          icon: <FaLightbulb />,
          title: p.title,
          text: p.content,
          link: "",
          image: p.image,
          comments: p.comments || [],
          user: createdUser,
        },
        ...prev,
      ]);
      setNewPost({ title: "", text: "", image: "" });
      setShowPopup(false);
    } catch (err) {
      console.error("create post failed", err, err?.response?.data);
      // don't add a client-only post when the server failed.
      alert(err?.response?.data?.message || "Failed to create post. Check backend logs.");
      // keep form open so user can retry
    }
  };

  // Add comment (backend)
  async function handleAddComment(postId, content) {
    if (!content?.trim()) return;
    if (!postId) {
      alert('Missing post id — cannot create comment');
      console.error('handleAddComment called with null postId', { postId, content });
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }

    try {
      console.debug('Posting comment', { postId, content });
      const res = await api.post(`/posts/${postId}/comments`, { content }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const saved = res.data;
      // ensure saved has user (fallback)
      const userFallback = currentUser ?? JSON.parse(localStorage.getItem('currentUser') || 'null');
      const commentWithUser = saved.user ? saved : { ...saved, user: userFallback ?? { id: null, username: 'You' } };

      setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: [...(p.comments || []), commentWithUser] } : p));
    } catch (err) {
      console.error('comment save failed', err, err?.response?.data);
      alert(err?.response?.data?.message || err?.response?.data || 'Failed to save comment');
    }
  };

  // Delete post (backend, only owner allowed server-side)
  const handleDeletePost = async (postId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      // not logged in
      navigate("/login");
      return;
    }

    // confirm destructive action
    if (!window.confirm("Delete this post permanently? This will remove its comments as well.")) return;

    try {
      const headers = { Authorization: `Bearer ${token}` };
      await api.delete(`/posts/${postId}`, { headers });
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch (err) {
      if (err.response?.status === 403) {
        alert("You can only delete your own post");
      } else if (err.response?.status === 401) {
        navigate("/login");
      } else {
        console.error("delete post failed", err);
        alert("Failed to delete post. See console for details.");
      }
    }
  };

  // Delete comment (backend, only owner allowed server-side)
  const handleDeleteComment = async (postId, commentId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await api.delete(`/posts/${postId}/comments/${commentId}`, { headers });
      setPosts((prev) =>
        prev.map((p) => (p.id !== postId ? p : { ...p, comments: p.comments.filter((c) => c.id !== commentId) }))
      );
    } catch (err) {
      if (err.response?.status === 403) alert("You can only delete your own comment");
      else console.error("delete comment failed", err);
    }
  };

  // Create post (alternative implementation)
  async function handleCreatePost(postPayload) {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }

    try {
      const res = await api.post('/posts', postPayload, { headers: { Authorization: `Bearer ${token}` } });
      const savedPost = res.data;
      if (!savedPost?.id) {
        console.warn('Server did not return saved post id', savedPost);
        alert('Post created client-side but server did not return id. Check backend.');
      }
      // insert server-saved post into UI (use savedPost when available)
      setPosts(prev => [ savedPost, ...prev ]);
    } catch (err) {
      console.error('create post failed', err, err?.response?.data);
      alert(err?.response?.data?.message || 'Failed to create post');
    }
  };

  function ensureArray(val) {
    if (!val) return [];
    return Array.isArray(val) ? val : [val];
  }

  // when updating posts from server:
  // setPosts(prev => prev.map(p => p.id === saved.id ? { ...p, comments: ensureArray(saved.comments) } : p));

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
        <img src="convince-logo.png" alt="ConVINCE Logo" className="hero-img" />
      </section>

      {/* About Section */}
      <section className="about">
        <h2>About ConVINCE</h2>
        <div className="about-content">
          <img src="https://images.unsplash.com/photo-1551434678-e076c223a692" alt="team discussion" className="about-img" />
          <p>
            <strong>ConVINCE</strong> (Collaboration of New Visionaries Innovating New Concepts and Excellence) is a movement that fosters
            creativity, teamwork, and excellence in the field of technology.
            <br />
            <br />
            We believe that great innovations are born when diverse minds come together.
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
          {posts.map((post, index) => (
            <div key={post.id ?? index} className="blog-card">
              <div className="blog-icon">{post.icon}</div>
              <h3>{post.title}</h3>
              <p>{post.text}</p>
              {post.image && <img src={post.image} alt={post.title} className="blog-image" />}

              <div className="card-actions">
                <button className="read-more" onClick={() => post.link && navigate(post.link)}>
                  Read More <FaArrowRight className="arrow" />
                </button>

                {/* Delete button: visible only to the owner (UI). Backend still enforces ownership. */}
                {(() => {
                  const viewerId = (currentUser && currentUser.id) || (localStoredUser && localStoredUser.id) || null;
                  const postOwnerId = post.user?.id ?? post.userId ?? null; // support either shape
                  const isOwner = viewerId && postOwnerId && viewerId === postOwnerId;
                  return isOwner ? (
                    <button
                      className="delete-btn"
                      onClick={() => handleDeletePost(post.id)}
                      title="Delete this post"
                      style={{ marginLeft: 12 }}
                    >
                      <FaTrash /> Delete Post
                    </button>
                  ) : null;
                })()}
              </div>

              {/* Comments Section */}
              <div className="comments-section">
                <h4>
                  <FaCommentDots /> Comments
                </h4>
                {/* Comments list */}
                <div className="comments">
                  {(post.comments || []).map(c => (
                    <div key={c.id} className="comment">
                      <strong className="comment-user">{c.user?.username ?? 'Anon'}</strong>
                      <div className="comment-text">{c.text}</div>
                    </div>
                  ))}
                </div>

                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={commentsInput[post.id ?? index] ?? ""}
                  onChange={(e) => setCommentsInput((s) => ({ ...s, [post.id ?? index]: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const text = commentsInput[post.id ?? index] ?? "";
                      handleAddComment(post.id, text);
                    }
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Add New Post Popup (unchanged UI, calls handleAddPost) */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Add a New Post</h3>
            <input type="text" placeholder="Post Title" value={newPost.title} onChange={(e) => setNewPost({ ...newPost, title: e.target.value })} />
            <textarea placeholder="Write your post..." value={newPost.text} onChange={(e) => setNewPost({ ...newPost, text: e.target.value })} />
            <input type="text" placeholder="Image URL (optional)" value={newPost.image} onChange={(e) => setNewPost({ ...newPost, image: e.target.value })} />
            <div className="popup-actions">
              <button className="btn primary" onClick={handleAddPost}>
                Add Post
              </button>
              <button className="btn secondary" onClick={() => setShowPopup(false)}>
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
          <p>To inspire the next generation of IT innovators through collaboration and creativity.</p>
        </div>

        <div className="mission-item">
          <div className="mission-header">
            <FaEye className="icon" />
            <h3>Join the Movement</h3>
          </div>
          <p>Become part of our movement to drive innovation and excellence in IT.</p>
        </div>
      </section>
    </div>
  );
}