// src/components/AddBookForm.jsx
import React, { useState } from 'react';

export default function AddBookForm({ onAddBook }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Task 3 Enforced Validations
    if (!title.trim()) newErrors.title = "Title is required.";
    if (!price || parseFloat(price) <= 0) newErrors.price = "Price must be greater than 0.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onAddBook({
      id: Date.now(),
      title,
      author: author || "Unknown Author",
      price: parseFloat(price),
      stock: parseInt(stock) || 0
    });

    // Clear state inputs cleanly
    setTitle('');
    setAuthor('');
    setPrice('');
    setStock('');
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} style={{ margin: '20px 0', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h3>Add New Book</h3>
      <div>
        <label>Title *</label><br />
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        {errors.title && <p style={{ color: 'red', margin: '4px 0' }}>{errors.title}</p>}
      </div>
      <div style={{ marginTop: '10px' }}>
        <label>Author</label><br />
        <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} />
      </div>
      <div style={{ marginTop: '10px' }}>
        <label>Price ($) *</label><br />
        <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} />
        {errors.price && <p style={{ color: 'red', margin: '4px 0' }}>{errors.price}</p>}
      </div>
      <div style={{ marginTop: '10px' }}>
        <label>Stock</label><br />
        <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} />
      </div>
      <button type="submit" style={{ marginTop: '15px', padding: '8px 12px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Add Book</button>
    </form>
  );
}
