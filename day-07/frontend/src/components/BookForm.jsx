// src/components/BookForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

export default function BookForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [publishedOn, setPublishedOn] = useState('2026-11-03');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditMode) {
      api.get(`/books/${id}/`)
        .then(res => {
          setTitle(res.data.title);
          setPrice(res.data.price);
          setStock(res.data.stock);
          setPublishedOn(res.data.published_on || '2026-11-03');
        })
        .catch(() => alert("Error fetching book details for editing."));
    }
  }, [id, isEditMode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required.";
    if (!price || parseFloat(price) <= 0) newErrors.price = "Price must be greater than 0.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload = { 
      title, 
      price: parseFloat(price), 
      stock: parseInt(stock) || 0,
      published_on: publishedOn
    };

    const request = isEditMode ? api.patch(`/books/${id}/`, payload) : api.post('/books/', payload);

    request
      .then(() => navigate('/books'))
      .catch(err => alert("Operation failed. Ensure your backend server is authenticated or running."));
  };

  return (
    <div className="form-card" style={{ maxWidth: '500px', margin: '30px auto' }}>
      <h3>{isEditMode ? '📝 Edit Book' : '✨ Add New Book'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group" style={{ marginBottom: '15px' }}>
          <label>Title *</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
          {errors.title && <p className="error-text">{errors.title}</p>}
        </div>
        <div className="form-group" style={{ marginBottom: '15px' }}>
          <label>Price ($) *</label>
          <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} />
          {errors.price && <p className="error-text">{errors.price}</p>}
        </div>
        <div className="form-group" style={{ marginBottom: '15px' }}>
          <label>Stock</label>
          <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} />
        </div>
        <button type="submit" className="btn-submit" style={{ width: '100%' }}>
          {isEditMode ? 'Save Changes' : 'Create Book'}
        </button>
      </form>
    </div>
  );
}
