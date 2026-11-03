// src/App.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate, useSearchParams } from 'react-router-dom';
import api from './services/api';
import BookForm from './components/BookForm';

// Home Layout Component
function Home() {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>🚀 Welcome to the Full-Stack Book System</h1>
      <p style={{ color: '#64748b' }}>Connected live to your Django REST Framework Backend database.</p>
      <Link to="/books" style={{ display: 'inline-block', marginTop: '20px', padding: '10px 20px', background: '#4f46e5', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>View Books Catalog</Link>
    </div>
  );
}

// Book List View (Handles Continuous Typing Search & Pagination)
function BookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const queryParam = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page')) || 1;

  // 🫵 FIX: Keep a local input state value so typing stays fluid and continuous
  const [localSearch, setLocalSearch] = useState(queryParam);

  // Sync url param back to local state if changed externally
  useEffect(() => {
    setLocalSearch(queryParam);
  }, [queryParam]);

  // Fetch from backend whenever query or page shifts
  useEffect(() => {
    setLoading(true);
    api.get(`/books/?search=${queryParam}&page=${page}`)
      .then(res => {
        setBooks(res.data.results || res.data);
        setError(null);
      })
      .catch(err => setError("Could not load assets. Ensure your backend server status is active."))
      .finally(() => setLoading(false));
  }, [queryParam, page]);

  // Handle Search Submission on typing
  const handleInputChange = (e) => {
    const val = e.target.value;
    setLocalSearch(val);
    setSearchParams({ search: val, page: 1 }); // Sync parameters seamlessly
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to permanently delete this book entry?")) {
      api.delete(`/books/${id}/`)
        .then(() => {
          setBooks(books.filter(b => b.id !== id));
          alert("Book entry purged successfully.");
        })
        .catch(() => alert("Operation failed. Ensure you are the authorized asset owner."));
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3>📚 Book Catalog Inventory</h3>
        <Link to="/books/new" style={{ padding: '8px 16px', background: '#10b981', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>+ Add New Book</Link>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="🔎 Type to search books instantly..." 
          value={localSearch}
          onChange={handleInputChange}
          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem' }}
        />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}><h3>⏳ Loading catalog assets...</h3></div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'red' }}><h3>❌ {error}</h3></div>
      ) : books.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}><h4>📭 No books matched your search criteria.</h4></div>
      ) : (
        <div className="books-grid">
          {books.map(book => (
            <div key={book.id} className="book-card">
              <h4>{book.title}</h4>
              <p className="book-price" style={{ margin: '10px 0' }}>${parseFloat(book.price).toFixed(2)}</p>
              <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                <Link to={`/books/${book.id}`} style={{ flex: 1, textAlign: 'center', padding: '6px', background: '#f1f5f9', borderRadius: '6px', textDecoration: 'none', color: '#1e293b', fontSize: '0.85rem', fontWeight: '600' }}>View Details</Link>
                <Link to={`/books/${book.id}/edit`} style={{ padding: '6px 12px', background: '#eff6ff', borderRadius: '6px', textDecoration: 'none', color: '#2563eb', fontSize: '0.85rem' }}>Edit</Link>
                <button onClick={() => handleDelete(book.id)} style={{ padding: '6px 12px', background: '#fef2f2', borderRadius: '6px', border: 'none', color: '#dc3545', cursor: 'pointer' }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px' }}>
        <button disabled={page <= 1} onClick={() => setSearchParams({ search: queryParam, page: page - 1 })} style={{ padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>Previous</button>
        <span style={{ alignSelf: 'center' }}><strong>Page {page}</strong></span>
        <button disabled={books.length < 10} onClick={() => setSearchParams({ search: queryParam, page: page + 1 })} style={{ padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>Next</button>
      </div>
    </div>
  );
}

// Book Detail View Component
function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);

  useEffect(() => {
    api.get(`/books/${id}/`)
      .then(res => setBook(res.data))
      .catch(() => {
        alert("Book record not found.");
        navigate('/books');
      });
  }, [id, navigate]);

  if (!book) return <div style={{ textAlign: 'center', padding: '40px' }}><h3>Loading record parameters...</h3></div>;

  return (
    <div className="form-card" style={{ maxWidth: '600px', margin: '40px auto' }}>
      <h2>📖 {book.title}</h2>
      <hr style={{ borderColor: '#e2e8f0', margin: '20px 0' }} />
      <p><strong>Database ID:</strong> {book.id}</p>
      <p><strong>Assigned Owner:</strong> {book.owner || 'Anonymous'}</p>
      <p><strong>Market Price Value:</strong> ${parseFloat(book.price).toFixed(2)}</p>
      <p><strong>Available Inventory Stock:</strong> {book.stock} units</p>
      <Link to="/books" style={{ display: 'inline-block', marginTop: '20px', color: '#4f46e5', fontWeight: 'bold' }}>← Back to Catalog</Link>
    </div>
  );
}

// Fallback 404 Component
function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '40px', marginTop: '60px' }}>
      <h1 style={{ fontSize: '4rem', color: '#ef4444', margin: '0' }}>404</h1>
      <h2>Oops! Page Not Found</h2>
      <p>The requested path route configuration does not exist.</p>
      <Link to="/" style={{ color: '#4f46e5', fontWeight: 'bold' }}>Return to Safety Home</Link>
    </div>
  );
}

function Footer() {
  return (
    <footer>
      <p>© 2026 Daily Learning Dashboard. Connected to Full-Stack API Engine.</p>
    </footer>
  );
}

// Main Configuration Root Orchestrator
export default function App() {
  return (
    <Router>
      <nav className="navbar">
        <Link to="/" style={{ textDecoration: 'none' }}><h2>📚 FullStackManager</h2></Link>
        <div style={{ display: 'flex', gap: '20px' }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#475569', fontWeight: '600' }}>Home</Link>
          <Link to="/books" style={{ textDecoration: 'none', color: '#475569', fontWeight: '600' }}>Books Catalog</Link>
        </div>
      </nav>

      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<BookList />} />
          <Route path="/books/new" element={<BookForm />} />
          <Route path="/books/:id" element={<BookDetail />} />
          <Route path="/books/:id/edit" element={<BookForm />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      <Footer />
    </Router>
  );
}

