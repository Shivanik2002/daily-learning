import React, { useState } from 'react';
import './App.css';

// Component Requirement 1: Header component accepting a title prop
function Header({ title }) {
  return (
    <header className="app-header">
      <h1>{title}</h1>
    </header>
  );
}

// Component Requirement 2: Counter component using useState hook
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="card counter-box">
      <h2>Counter Component</h2>
      <div className="count-display">{count}</div>
      <div className="btn-group">
        <button className="btn inc" onClick={() => setCount(count + 1)}>Increment</button>
        <button className="btn dec" onClick={() => setCount(count - 1)}>Decrement</button>
        <button className="btn rst" onClick={() => setCount(0)}>Reset</button>
      </div>
    </div>
  );
}

// Component Requirement 3: Greeting input component rendering a real-time greeting string
function GreetingInput() {
  const [name, setName] = useState('');

  return (
    <div className="card greeting-box">
      <h2>Real-time Greeting</h2>
      <input
        type="text"
        placeholder="Type your name here..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="text-input"
      />
      {name && <h3 className="greeting-text">Hello {name}!</h3>}
    </div>
  );
}

// Main Layout Assembly Dashboard
function App() {
  return (
    <div className="app-container">
      {/* Passing the mandatory title prop here */}
      <Header title="Shivani's Daily Learning Dashboard" />
      
      <main className="app-content">
        <Counter />
        <GreetingInput />
      </main>
    </div>
  );
}

export default App;
