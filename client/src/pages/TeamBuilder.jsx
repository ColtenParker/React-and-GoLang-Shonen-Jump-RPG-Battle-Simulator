import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CharacterCard from '../components/CharacterCard';

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

  const handleStart = () => {
    if (!p1) return;
    navigate(`/battle?p1=${p1}`);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Select Your Fighter</h2>

      {/* Character Grid (using global grid-cards class) */}
      <div className="grid-cards">
        {chars.map(c => (
          <div
            key={c.id}
            onClick={() => setP1(c.id)}
            style={{
              cursor: 'pointer',
              border: p1 === c.id ? '3px solid #27ae60' : '2px solid #eee',
              borderRadius: 12,
              padding: '0.5rem',
              background: '#fff',
              transition: 'transform 150ms ease',
              transform: p1 === c.id ? 'scale(1.05)' : 'scale(1)',
            }}
          >
            <CharacterCard character={c} />
          </div>
        ))}
      </div>

      {/* Confirm Button */}
      <button
        onClick={handleStart}
        disabled={!p1}
        style={{
          marginTop: '1.5rem',
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          fontWeight: 600,
          background: p1 ? '#27ae60' : '#ccc',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          cursor: p1 ? 'pointer' : 'not-allowed',
        }}
      >
        Start Battle
      </button>
    </div>
  );
}
