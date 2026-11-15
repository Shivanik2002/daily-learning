import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useSearchParams } from 'react-router-dom';
import api from './services/api';
import BookForm from './components/BookForm';
import Login from './components/Login';
import Register from './components/Register';
import Protected from './components/Protected';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { CartProvider } from './context/CartContext';
import { useCart } from './hooks/useCart';

function Navbar() {
  const { user, logout } = useAuth();
  const { count, total } = useCart();

  return (
    <nav className="navbar">
      <Link to="/" style={{ textDecoration: 'none' }}><h2>BookStore</h2></Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
        <Link to="/books" style={{ textDecoration: 'none', color: '#334155', fontWeight: 600 }}>Books</Link>
        <span style={{ fontWeight: 600, color: '#059669' }}>
          Cart: {count} (${total.toFixed(2)})
        </span>

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.9rem' }}>
              {user.email} <strong>({user.role})</strong>
            </span>
            <button onClick={logout} className="btn-fav remove" style={{ width: 'auto' }}>
              Logout
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/login" className="btn-fav add" style={{ textDecoration: 'none', width: 'auto' }}>Login</Link>
            <Link to="/register" className="btn-submit" style={{ textDecoration: 'none', margin: 0, padding: '8px 14px' }}>Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
}

function Home() {
  return (
    <div style={{ textAlign: 'center', padding: '50px 20px' }}>
      <h1>Welcome to the Full-Stack BookStore</h1>
      <p style={{ color: '#64748b', marginBottom: '20px' }}>
        Protected with React Context API, JWT Auto-Refresh Interceptors, and Role-Based Routing.
      </p>
      <Link to="/books" className="btn-submit" style={{ textDecoration: 'none', padding: '12px 24px' }}>
        Browse Books
      </Link>
    </div>
  );
}

function BookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  const { user } = useAuth();
  const { addToCart } = useCart();

  const search = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page'), 10) || 1;
  const [inputSearch, setInputSearch] = useState(search);

  useEffect(() => {
    setLoading(true);
    api.get(`/books/?search=${search}&page=${page}`)
      .then((res) => {
        setBooks(res.data.results || res.data);
        setError('');
      })
      .catch(() => setError('Failed to load books from backend.'))
      .finally(() => setLoading(false));
  }, [search, page]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setInputSearch(val);
    setSearchParams({ search: val, page: 1 });
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this book?')) return;
    api.delete(`/books/${id}/`)
      .then(() => setBooks((prev) => prev.filter((b) => b.id !== id)))
      .catch(() => alert('Only the book owner can delete this entry.'));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3>Catalog</h3>
        {user?.role === 'seller' && (
          <Link to="/books/new" className="btn-submit" style={{ textDecoration: 'none', margin: 0, padding: '10px 16px' }}>
            + Add Book
          </Link>
        )}
      </div>

      <div className="controls-row">
        <input
          type="text"
          className="search-input"
          placeholder="Search books..."
          value={inputSearch}
          onChange={handleSearchChange}
        />
      </div>

      {loading ? (
        <p>Loading books...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : books.length === 0 ? (
        <p>No books found.</p>
      ) : (
        <div className="books-grid">
          {books.map((book) => (
            <div key={book.id} className="book-card">
              <h4>{book.title}</h4>
              <div className="book-meta">
                <span className="book-price">${parseFloat(book.price).toFixed(2)}</span>
                <span className="book-stock">Stock: {book.stock}</span>
              </div>
              <button onClick={() => addToCart(book)} className="btn-fav add" style={{ marginBottom: '8px' }}>
                Add to Cart
              </button>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Link to={`/books/${book.id}`} style={{ flex: 1, textAlign: 'center', padding: '6px', background: '#f1f5f9', borderRadius: '6px', textDecoration: 'none', color: '#1e293b', fontSize: '0.85rem' }}>
                  Details
                </Link>
                {user?.role === 'seller' && (
                  <>
                    <Link to={`/books/${book.id}/edit`} style={{ padding: '6px 10px', background: '#e0e7ff', borderRadius: '6px', textDecoration: 'none', color: '#4f46e5', fontSize: '0.85rem' }}>
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(book.id)} style={{ padding: '6px 10px', background: '#fee2e2', border: 'none', borderRadius: '6px', color: '#ef4444', cursor: 'pointer', fontSize: '0.85rem' }}>
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '30px' }}>
        <button disabled={page <= 1} onClick={() => setSearchParams({ search, page: page - 1 })}>
          Previous
        </button>
        <span>Page {page}</span>
        <button disabled={books.length < 10} onClick={() => setSearchParams({ search, page: page + 1 })}>
          Next
        </button>
      </div>
    </div>
  );
}

function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    api.get(`/books/${id}/`).then((res) => setBook(res.data));
  }, [id]);

  if (!book) return <p>Loading details...</p>;

  return (
    <div className="form-card" style={{ maxWidth: '500px', margin: '30px auto' }}>
      <h3>{book.title}</h3>
      <p><strong>Price:</strong> ${parseFloat(book.price).toFixed(2)}</p>
      <p><strong>Stock:</strong> {book.stock}</p>
      <Link to="/books">← Back to Books</Link>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Navbar />
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/books" element={<BookList />} />
              <Route path="/books/:id" element={<BookDetail />} />
              <Route
                path="/books/new"
                element={
                  <Protected role="seller">
                    <BookForm />
                  </Protected>
                }
              />
              <Route
                path="/books/:id/edit"
                element={
                  <Protected role="seller">
                    <BookForm />
                  </Protected>
                }
              />
              <Route path="*" element={<h2>404 - Page Not Found</h2>} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
