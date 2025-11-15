import React, { useState } from "react";
import "./Books.css";

const Books = () => {
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [customBooks, setCustomBooks] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    category: "",
    file: null,
  });
const predefinedBooks = [
  // --- Computer Science & Programming ---
  { title: "The C Programming Language", author: "Brian Kernighan & Dennis Ritchie", category: "Programming", link: "https://archive.org/details/TheCProgrammingLanguageFirstEdition" },
  { title: "Structure and Interpretation of Computer Programs", author: "Harold Abelson & Gerald Jay Sussman", category: "Computer Science", link: "https://mitpress.mit.edu/sites/default/files/sicp/full-text/book/book.html" },
  { title: "Introduction to Algorithms", author: "Thomas H. Cormen", category: "Algorithms", link: "https://archive.org/details/IntroductionToAlgorithms3rdEdition_201803" },
  { title: "Artificial Intelligence: Foundations of Computational Agents", author: "David Poole & Alan Mackworth", category: "Artificial Intelligence", link: "https://artint.info/" },
  { title: "How to Design Programs", author: "Matthias Felleisen et al.", category: "Programming", link: "https://htdp.org/" },
  { title: "Operating Systems: Three Easy Pieces", author: "Remzi & Andrea Arpaci-Dusseau", category: "Operating Systems", link: "https://pages.cs.wisc.edu/~remzi/OSTEP/" },
  { title: "Computer Networking: Principles, Protocols and Practice", author: "Olivier Bonaventure", category: "Networking", link: "https://openlibrary.telcom-lille.fr/cnpp/" },
  { title: "Foundations of Data Science", author: "Avrim Blum et al.", category: "Data Science", link: "https://www.cs.cornell.edu/jeh/book.pdf" },
  { title: "Think Python", author: "Allen B. Downey", category: "Programming", link: "https://greenteapress.com/wp/think-python-2e/" },
  { title: "Think Stats", author: "Allen B. Downey", category: "Data Science", link: "https://greenteapress.com/wp/think-stats-2e/" },
  { title: "Think Bayes", author: "Allen B. Downey", category: "Data Science", link: "https://greenteapress.com/wp/think-bayes-2e/" },
  { title: "Deep Learning", author: "Ian Goodfellow, Yoshua Bengio & Aaron Courville", category: "Artificial Intelligence", link: "https://www.deeplearningbook.org/" },
  { title: "Pro Git", author: "Scott Chacon & Ben Straub", category: "Software Engineering", link: "https://git-scm.com/book/en/v2" },
  { title: "Eloquent JavaScript", author: "Marijn Haverbeke", category: "Web Development", link: "https://eloquentjavascript.net/" },
  { title: "You Don’t Know JS Yet", author: "Kyle Simpson", category: "Web Development", link: "https://github.com/getify/You-Dont-Know-JS" },
  { title: "Learning Web Design", author: "Jennifer Niederst Robbins", category: "Web Development", link: "https://archive.org/details/learningwebdesign" },
  { title: "CS50x Lecture Notes", author: "Harvard University", category: "Computer Science", link: "https://cs50.harvard.edu/x/" },

  // --- Cybersecurity & Networks ---
  { title: "The Web Application Hacker's Handbook", author: "Dafydd Stuttard", category: "Cybersecurity", link: "https://archive.org/details/TheWebApplicationHackersHandbook2ndEdition" },
  { title: "Security Engineering", author: "Ross Anderson", category: "Cybersecurity", link: "https://www.cl.cam.ac.uk/~rja14/book.html" },
  { title: "Crypto 101", author: "Laurens Van Houtven", category: "Cryptography", link: "https://crypto101.io/" },
  { title: "The Art of Unix Programming", author: "Eric S. Raymond", category: "Operating Systems", link: "http://catb.org/~esr/writings/taoup/html/" },
  { title: "The Linux Command Line", author: "William E. Shotts Jr.", category: "Operating Systems", link: "https://linuxcommand.org/tlcl.php" },
  { title: "The Cathedral and the Bazaar", author: "Eric S. Raymond", category: "Software Engineering", link: "http://www.catb.org/~esr/writings/cathedral-bazaar/" },

  // --- Engineering & Math ---
  { title: "Calculus Made Easy", author: "Silvanus P. Thompson", category: "Mathematics", link: "https://www.gutenberg.org/ebooks/33283" },
  { title: "A Brief Introduction to Machine Learning for Engineers", author: "Osvaldo Simeone", category: "Artificial Intelligence", link: "https://arxiv.org/abs/1709.02840" },
  { title: "Linear Algebra Done Right (Lecture Notes)", author: "Sheldon Axler", category: "Mathematics", link: "https://linear.axler.net/" },
  { title: "Digital Design and Computer Architecture", author: "David Harris & Sarah Harris", category: "Computer Architecture", link: "https://archive.org/details/DigitalDesignAndComputerArchitectureSecondEdition" },

  // --- Philosophy & Mind ---
  { title: "Meditations", author: "Marcus Aurelius", category: "Philosophy", link: "https://www.gutenberg.org/ebooks/2680" },
  { title: "The Republic", author: "Plato", category: "Philosophy", link: "https://www.gutenberg.org/ebooks/1497" },
  { title: "The Art of War", author: "Sun Tzu", category: "Strategy", link: "https://www.gutenberg.org/ebooks/132" },
  { title: "Thus Spoke Zarathustra", author: "Friedrich Nietzsche", category: "Philosophy", link: "https://www.gutenberg.org/ebooks/1998" },

  // --- Tech-Related Literature & Science ---
  { title: "Relativity: The Special and General Theory", author: "Albert Einstein", category: "Science", link: "https://www.gutenberg.org/ebooks/30155" },
  { title: "Flatland: A Romance of Many Dimensions", author: "Edwin Abbott Abbott", category: "Mathematics", link: "https://www.gutenberg.org/ebooks/97" },
  { title: "The Time Machine", author: "H.G. Wells", category: "Science Fiction", link: "https://www.gutenberg.org/ebooks/35" },
  { title: "The War of the Worlds", author: "H.G. Wells", category: "Science Fiction", link: "https://www.gutenberg.org/ebooks/36" },
  { title: "Twenty Thousand Leagues under the Seas", author: "Jules Verne", category: "Science Fiction", link: "https://www.gutenberg.org/ebooks/164" },
  { title: "Around the World in Eighty Days", author: "Jules Verne", category: "Adventure", link: "https://www.gutenberg.org/ebooks/103" },
  { title: "The Invisible Man", author: "H.G. Wells", category: "Science Fiction", link: "https://www.gutenberg.org/ebooks/5230" },
  { title: "Frankenstein", author: "Mary Shelley", category: "Gothic Fiction", link: "https://www.gutenberg.org/ebooks/84" },
  { title: "Pride and Prejudice", author: "Jane Austen", category: "Literature", link: "https://www.gutenberg.org/ebooks/1342" },
  { title: "Moby-Dick", author: "Herman Melville", category: "Classic Literature", link: "https://www.gutenberg.org/ebooks/2701" },
  { title: "The Strange Case of Dr. Jekyll and Mr. Hyde", author: "Robert Louis Stevenson", category: "Psychology", link: "https://www.gutenberg.org/ebooks/43" },
  { title: "The Metamorphosis", author: "Franz Kafka", category: "Literature", link: "https://www.gutenberg.org/ebooks/5200" },
  { title: "Crime and Punishment", author: "Fyodor Dostoevsky", category: "Classic Literature", link: "https://www.gutenberg.org/ebooks/2554" },
  { title: "A Tale of Two Cities", author: "Charles Dickens", category: "Classic Literature", link: "https://www.gutenberg.org/ebooks/98" },
];


  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setNewBook({ ...newBook, file });
  };

  const handleAddBook = (e) => {
    e.preventDefault();
    if (!newBook.title || !newBook.author || !newBook.category || !newBook.file) {
      alert("Please fill in all fields and select a PDF file.");
      return;
    }

    const fileURL = URL.createObjectURL(newBook.file);
    const addedBook = {
      title: newBook.title,
      author: newBook.author,
      category: newBook.category,
      link: fileURL,
    };

    setCustomBooks([...customBooks, addedBook]);
    setNewBook({ title: "", author: "", category: "", file: null });
    setShowModal(false);
  };

  const allBooks = [...predefinedBooks, ...customBooks];

  const filteredAndSortedBooks = [...allBooks]
    .filter(
      (book) =>
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase()) ||
        book.category.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const comparison = a.title.localeCompare(b.title);
      return sortOrder === "asc" ? comparison : -comparison;
    });

  return (
    <div className="library-container">
      <h1 className="library-header">Library Books</h1>

      {/* Search and Sort Controls */}
      <div className="library-controls">
        <input
          type="text"
          placeholder="Search by title, author, or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
          Sort ({sortOrder === "asc" ? "A → Z" : "Z → A"})
        </button>
        <button className="add-book-btn" onClick={() => setShowModal(true)}>
          + Add New Book
        </button>
      </div>

      {/* Books Table */}
      <table className="library-table">
        <thead>
          <tr>
            <th>Book Title</th>
            <th>Author</th>
            <th>Category</th>
            <th>Read</th>
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedBooks.map((book, index) => (
            <tr key={index}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.category}</td>
              <td>
                {book.link ? (
                  <a
                    href={book.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="read-button"
                  >
                    Read
                  </a>
                ) : (
                  <span className="no-link">Not Available</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Popup */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add a New Book</h2>
            <form onSubmit={handleAddBook}>
              <input
                type="text"
                placeholder="Book Title"
                value={newBook.title}
                onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
              />
              <input
                type="text"
                placeholder="Author"
                value={newBook.author}
                onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
              />
              <input
                type="text"
                placeholder="Category"
                value={newBook.category}
                onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
              />
              <input type="file" accept="application/pdf" onChange={handleFileUpload} />
              <div className="modal-buttons">
                <button type="submit">Add Book</button>
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Books;
