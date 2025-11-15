import React, { useEffect, useState } from "react";

export default function AuthorsCat() {
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/authors").then(res => res.json()).then(setAuthors);
  }, []);

  return (
    <div className="container">
      <h1>Authors</h1>
      <ul>
        {authors.map((a) => (
          <li key={a.id}>{a.name}</li>
        ))}
      </ul>
    </div>
  );
}
