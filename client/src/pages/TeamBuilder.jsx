import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TeamBuilder() {
  const [chars, setChars] = useState([]);
  const [p1, setP1] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8080/api/characters')
      .then(r => {
        if (!r.ok) throw new Error('Failed to load characters');
        return r.json();
      })
      .then(setChars)
      .catch(err => console.error(err));
  }, []);

  const handleStart = (e) => {
    e.preventDefault();
    if (!p1) return;
    navigate(`/battle?p1=${p1}`);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Select Your Fighter</h2>
      <form onSubmit={handleStart} style={{ display: 'grid', gap: '0.5rem', maxWidth: 400, margin: 'auto' }}>
        <label>
          Fighter
          <select value={p1} onChange={(e) => setP1(e.target.value)} required>
            <option value="">Select...</option>
            {chars.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.element})
              </option>
            ))}
          </select>
        </label>
        <button type="submit" disabled={!p1}>
          Start Battle
        </button>
      </form>
    </div>
  );
}
