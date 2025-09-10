import React, { useEffect, useState } from 'react';
import CharacterCard from '../components/CharacterCard';

export default function BattleScreen() {
  const [chars, setChars] = useState([]);
  const [p1, setP1] = useState('');
  const [p2, setP2] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // playback state
  const [hp1, setHp1] = useState(null);
  const [hp2, setHp2] = useState(null);
  const [turnIndex, setTurnIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [attackingId, setAttackingId] = useState(null);
  const [damageFx, setDamageFx] = useState(null); // { targetId, value, crit }

  useEffect(() => {
    fetch('http://localhost:8080/api/characters')
      .then(r => { if (!r.ok) throw new Error('Failed to load characters'); return r.json(); })
      .then(setChars)
      .catch(e => setError(e.message));
  }, []);

  const fighter1 = chars.find(c => c.id === p1);
  const fighter2 = chars.find(c => c.id === p2);

  const submit = (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setResult(null);
    setTurnIndex(0);
    setPlaying(false);
    setAttackingId(null);
    setDamageFx(null);

    fetch('http://localhost:8080/api/battle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ player1Id: p1, player2Id: p2 })
    })
      .then(r => { if (!r.ok) throw new Error('Battle failed'); return r.json(); })
      .then((res) => {
        setResult(res);
        // Start HP bars at full client-side for animation
        if (fighter1) setHp1(fighter1.hp);
        if (fighter2) setHp2(fighter2.hp);
        setTurnIndex(0);
        setPlaying(true);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  // Playback: lunge → apply damage (with overlay) → advance. Only show the current turn text.
  useEffect(() => {
    if (!result || !playing || !fighter1 || !fighter2) return;
    if (turnIndex >= result.turns.length) {
      setPlaying(false);
      setAttackingId(null);
      setDamageFx(null);
      return;
    }

    const current = result.turns[turnIndex];
    setAttackingId(current.attackerId);

    // show damage bubble at application time
    const applyTimer = setTimeout(() => {
      // set HP after damage
      if (current.defenderId === fighter1.id) {
        setHp1(current.defenderHPAfter);
      } else if (current.defenderId === fighter2.id) {
        setHp2(current.defenderHPAfter);
      }
      // show damage overlay centered on defender
      setDamageFx({ targetId: current.defenderId, value: current.finalDamage, crit: current.critical });

      // hide damage overlay after a short time
      setTimeout(() => setDamageFx(null), 420);
      setAttackingId(null);
    }, 250);

    const advanceTimer = setTimeout(() => {
      setTurnIndex(t => t + 1);
    }, 600);

    return () => {
      clearTimeout(applyTimer);
      clearTimeout(advanceTimer);
    };
  }, [result, playing, turnIndex, fighter1, fighter2]);

  // Reset battle state when either selection changes
useEffect(() => {
  // stop any ongoing playback / animations
  setPlaying(false);
  setAttackingId(null);
  setDamageFx(null);
  setTurnIndex(0);

  // clear result -> removes green winner border
  setResult(null);

  // reset HP bars to the newly selected fighters (or clear if none)
  setHp1(fighter1 ? fighter1.hp : null);
  setHp2(fighter2 ? fighter2.hp : null);
}, [p1, p2, fighter1, fighter2]);


  const winnerId = result?.winnerId;
  const isWinner1 = winnerId && fighter1 && winnerId === fighter1.id;
  const isWinner2 = winnerId && fighter2 && winnerId === fighter2.id;

  const currentTurn = result && turnIndex < result.turns.length
    ? result.turns[turnIndex]
    : null;

  return (
    <div>
      <h2>Battle Simulator</h2>

      <form onSubmit={submit} style={{display:'grid',gap:'0.5rem',maxWidth:420}}>
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

      {/* Fighters with HP bars, lunge, and damage overlays */}
      <div style={{
        display:'flex',
        gap:'1rem',
        marginTop:'1rem',
        flexWrap:'wrap',
        alignItems:'flex-start',
        justifyContent:'space-between'
        }}>
        {fighter1 && (
            <div style={{ flex: '0 1 320px' }}>
            <CharacterCard
                character={fighter1}
                showHpBar
                currentHp={hp1 ?? fighter1.hp}
                isWinner={Boolean(isWinner1)}
                isAttacking={attackingId === fighter1.id}
                side="left"
                damageOverlay={
                damageFx && damageFx.targetId === fighter1.id
                    ? { value: damageFx.value, crit: damageFx.crit }
                    : null
                }
            />
            </div>
        )}
        {fighter2 && (
            <div style={{ flex: '0 1 320px' }}>
            <CharacterCard
                character={fighter2}
                showHpBar
                currentHp={hp2 ?? fighter2.hp}
                isWinner={Boolean(isWinner2)}
                isAttacking={attackingId === fighter2.id}
                side="right"
                damageOverlay={
                damageFx && damageFx.targetId === fighter2.id
                    ? { value: damageFx.value, crit: damageFx.crit }
                    : null
                }
            />
            </div>
        )}
        </div>
      

      {/* Only current-turn text (temporary; can remove later) */}
      {currentTurn && (
        <div style={{marginTop:'1rem'}}>
          <strong>Turn {currentTurn.turnNumber}</strong>: {currentTurn.attackerId} → {currentTurn.defenderId}
          {currentTurn.critical ? ' (CRIT)' : ''} • dmg {currentTurn.finalDamage}
        </div>
      )}

      {/* Final winner */}
      {!playing && result && (
        <h3 style={{marginTop:'1rem'}}>Winner: {result.winnerId}</h3>
      )}
    </div>
  );
}
