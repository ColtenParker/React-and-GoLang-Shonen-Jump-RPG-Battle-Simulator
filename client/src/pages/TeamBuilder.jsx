import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CharacterCard from '../components/CharacterCard';

export default function TeamBuilder() {
  const [chars, setChars] = useState([]);
  const [selected, setSelected] = useState([]); // array of ids
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8080/api/characters')
      .then(r => { if (!r.ok) throw new Error('Failed to load characters'); return r.json(); })
      .then(setChars)
      .catch(e => setError(e.message));
  }, []);

  const toggle = (id) => {
    setSelected(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 2) return prev; // cap at 2 for MVP
      return [...prev, id];
    });
  };

  const startBattle = () => {
    if (selected.length === 2) {
      const [p1, p2] = selected;
      navigate(`/battle?p1=${encodeURIComponent(p1)}&p2=${encodeURIComponent(p2)}`);
    }
  };

  return (
    <div>
      <h2>Team Builder (Pick 2)</h2>
      {error && <div style={{color:'red'}}>{error}</div>}

      {/* Selected summary */}
      <div style={{display:'flex', gap:'1rem', marginBottom:'1rem', flexWrap:'wrap'}}>
        {selected.map(id => {
          const c = chars.find(x => x.id === id);
          if (!c) return null;
          return (
            <div key={id} style={{border:'2px solid #27ae60', borderRadius:12, padding:8}}>
              <strong>{c.name}</strong> <span style={{opacity:0.7}}>({c.element})</span>
            </div>
          );
        })}
        <button
          disabled={selected.length !== 2}
          onClick={startBattle}
          style={{padding:'0.5rem 1rem'}}
        >
          {selected.length === 2 ? 'Battle!' : 'Pick 2 fighters'}
        </button>
      </div>

      {/* Character grid with selectable cards */}
        <div className="grid-cards">
            {chars.map(c => {
                const isSel = selected.includes(c.id);
                return (
                <div key={c.id} className="card-wrap">
                    <div
                    className={`card-selectable ${isSel ? 'selected' : ''}`}
                    onClick={() => toggle(c.id)}
                    style={{ cursor: 'pointer' }}
                    >
                    <CharacterCard character={c} />
                    </div>
                    <div style={{textAlign:'center', marginTop:6, fontSize:12, opacity:0.8}}>
                    {isSel ? 'Selected' : 'Click to select'}
                    </div>
                </div>
                );
            })}
        </div>
    </div>
  );
}
