import React, { useEffect, useState } from 'react';

export default function BattleScreen() {
  const [chars, setChars] = useState([]);
  const [p1, setP1] = useState('');
  const [p2, setP2] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8080/api/characters')
      .then(r => { if (!r.ok) throw new Error('Failed to load characters'); return r.json(); })
      .then(setChars)
      .catch(e => setError(e.message));
  }, []);

  const submit = (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    fetch('http://localhost:8080/api/battle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ player1Id: p1, player2Id: p2 })
    })
      .then(r => { if (!r.ok) throw new Error('Battle failed'); return r.json(); })
      .then(setResult)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  return (
    <div>
      <h2>Battle Simulator</h2>
      <form onSubmit={submit} style={{display:'grid',gap:'0.5rem',maxWidth:360}}>
        <label>
          Player 1
          <select value={p1} onChange={e=>setP1(e.target.value)} required>
            <option value="">Select...</option>
            {chars.map(c => <option key={c.id} value={c.id}>{c.name} ({c.element})</option>)}
          </select>
        </label>
        <label>
          Player 2
          <select value={p2} onChange={e=>setP2(e.target.value)} required>
            <option value="">Select...</option>
            {chars.map(c => <option key={c.id} value={c.id}>{c.name} ({c.element})</option>)}
          </select>
        </label>
        <button type="submit" disabled={loading || !p1 || !p2 || p1===p2}>
          {loading ? 'Battling...' : 'Start Battle'}
        </button>
        {p1===p2 && <small>Pick two different fighters.</small>}
      </form>

      {error && <div style={{color:'red',marginTop:'1rem'}}>Error: {error}</div>}

      {result && (
        <div style={{marginTop:'1rem'}}>
          <h3>Winner: {result.winnerId}</h3>
          <ol>
            {result.turns.map((t, i) => (
              <li key={i}>
                Turn {t.turnNumber}: {t.attackerId} → {t.defenderId}
                {t.critical ? ' (CRIT)' : ''} dmg {t.finalDamage}, HP of defender → {t.defenderHPAfter}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
