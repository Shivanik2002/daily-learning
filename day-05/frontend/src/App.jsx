// src/App.jsx
import React, { useState, useEffect } from 'react';
import { initialBooks } from './data/books';
import AddBookForm from './components/AddBookForm';

// Task 1 Presentation Structural Components
function Navbar({ favoriteCount }) {
  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 30px', background: '#333', color: '#fff', alignItems: 'center' }}>
      <h2>📚 BookManager</h2>
      <div><strong>⭐ Favorites: {favoriteCount}</strong></div>
    </nav>
  );
}

function BookCard({ book, onToggleFavorite, isFavorite }) {
  return (
    <div style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '6px', background: book.stock === 0 ? '#f9f9f9' : '#fff' }}>
      <h4>{book.title}</h4>
      <p>By: {book.author}</p>
      <p>Price: ${book.price.toFixed(2)}</p>
      <p>Stock: {book.stock}</p>
      
      {/* Task 1 Conditional Rendering */}
      {book.stock === 0 ? (
        <p style={{ color: 'red', fontWeight: 'bold' }}>Out of stock</p>
      ) : (
        <button 
          onClick={() => onToggleFavorite(book.id)} 
          style={{ padding: '5px 10px', background: isFavorite ? '#dc3545' : '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          {isFavorite ? 'Remove Favorite' : 'Add to Favorites'}
        </button>
      )}
    </div>
  );
}

function Footer() {
  return (
    <footer style={{ textAlign: 'center', padding: '20px', marginTop: '30px', borderTop: '1px solid #eee', color: '#666' }}>
      <p>© 2026 Daily Learning Dashboard. All Rights Reserved.</p>
    </footer>
  );
}

export default function App() {
  const [books, setBooks] = useState(initialBooks);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('none');
  
  // Task 4: Initialize Favorites from localStorage cleanly
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('book_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // Task 4 Effects Sync
  useEffect(() => {
    localStorage.setItem('book_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    document.title = `Books (${books.length})`;
  }, [books]);

  const handleAddBook = (newBook) => {
    setBooks([...books, newBook]);
  };

  const handleToggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(favId => favId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  // Task 2: Live search filtering and sorting selection calculation rules
  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (sortBy === 'low-high') return a.price - b.price;
    if (sortBy === 'high-low') return b.price - a.price;
    return 0;
  });

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '900px', margin: '0 auto', paddingBottom: '4px' }}>
      <Navbar favoriteCount={favorites.length} />
      
      <main style={{ padding: '20px' }}>
        <AddBookForm onAddBook={handleAddBook} />
        
        {/* Task 2 Inputs Interface Grid Controls */}
        <div style={{ display: 'flex', gap: '15px', margin: '20px 0' }}>
          <input 
            type="text" 
            placeholder="Search books by title..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: '8px', flex: 1, borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)} 
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="none">Sort By</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
          </select>
        </div>

        {/* Task 1 Dynamic Rendering Mapping */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {sortedBooks.map(book => (
            <BookCard 
              key={book.id} 
              book={book} 
              onToggleFavorite={handleToggleFavorite}
              isFavorite={favorites.includes(book.id)}
            />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

