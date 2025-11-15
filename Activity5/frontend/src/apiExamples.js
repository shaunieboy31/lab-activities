const token = localStorage.getItem('token');
await api.delete(`http://localhost:3000/posts/${postId}`, { headers: { Authorization: `Bearer ${token}` } });