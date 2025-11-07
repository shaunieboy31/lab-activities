import React, { useState } from "react";

export default function CommentBox({ postId, onAddComment }) {
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    const res = await fetch(`http://localhost:3001/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    const data = await res.json();
    onAddComment(data);
    setContent("");
  };

  return (
    <form className="comment-box" onSubmit={handleSubmit}>
      <textarea
        placeholder="Write a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button type="submit">Comment</button>
    </form>
  );
}
