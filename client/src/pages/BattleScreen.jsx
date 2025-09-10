import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import CharacterCard from '../components/CharacterCard';
import TurnLog from '../components/TurnLog';

export default function BattleScreen() {
  const location = useLocation();

  const [chars, setChars] = useState([]);
  const [p1, setP1] = useState('');
  const [p2, setP2] = useState('');

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [hp1, setHp1] = useState(null);
  const [hp2, setHp2] = useState(null);
  const [turnIndex, setTurnIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [attackingId, setAttackingId] = useState(null);
  const [damageFx, setDamageFx] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/api/characters')
      .then(r => {
        if (!r.ok) throw new Error('Failed to load characters');
        return r.json();
      })
      .then(setChars)
      .catch(e => setError(e.message));
  }, []);

  useEffect(() => {
    const sp = new URLSearchParams(location.search);
    const qp1 = sp.get('p1');
    if (qp1) setP1(qp1);
  }, [location.search]);

  // initial opponent
  useEffect(() => {
    if (chars.length > 0 && p1) {
      const candidates = chars.filter(c => c.id !== p1);
      if (candidates.length > 0) {
        const randomOpponent = candidates[Math.floor(Math.random() * candidates.length)];
        setP2(randomOpponent.id);
      }
    }
  }, [chars, p1]);

  const fighter1 = chars.find(c => c.id === p1);
  const fighter2 = chars.find(c => c.id === p2);

  useEffect(() => {
    setPlaying(false);
    setAttackingId(null);
    setDamageFx(null);
    setTurnIndex(0);
    setResult(null);
    setHp1(fighter1 ? fighter1.hp : null);
    setHp2(fighter2 ? fighter2.hp : null);
  }, [p1, p2, fighter1, fighter2]);

  // helper: pick a new opponent id different from current p2
  const pickRandomOpponentId = () => {
    const pool = chars.filter(c => c.id !== p1 && c.id !== p2);
    if (pool.length === 0) {
      // fallback if only one candidate exists
      const fallback = chars.filter(c => c.id !== p1);
      if (fallback.length === 0) return null;
      return fallback[Math.floor(Math.random() * fallback.length)].id;
    }
    return pool[Math.floor(Math.random() * pool.length)].id;
  };

  // start battle, allow optional override for opponent id + fighter
  const startBattle = async () => {
    if (!fighter1 || !fighter2 || loading) return; // guard double clicks

    try {
      setError(null);
      setLoading(true);
      setResult(null);
      setTurnIndex(0);
      setPlaying(false);
      setAttackingId(null);
      setDamageFx(null);

      // ensure the "Battling..." render happens
      await new Promise(r => setTimeout(r, 50));

      const res = await fetch('http://localhost:8080/api/battle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ player1Id: fighter1.id, player2Id: fighter2.id }),
      });
      if (!res.ok) throw new Error('Battle failed');

      const data = await res.json();
      setResult(data);
      setHp1(fighter1.hp);
      setHp2(fighter2.hp);
      setTurnIndex(0);
      setPlaying(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // next opponent -> pick new id, set, then immediately start
  const nextOpponent = () => {
    const newId = pickRandomOpponentId();
    if (!newId) return;
    const newF2 = chars.find(c => c.id === newId);
    setP2(newId);
    // kick off battle against the new opponent immediately
    startBattle(newId, newF2);
  };

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

    const applyTimer = setTimeout(() => {
      if (current.defenderId === fighter1.id) setHp1(current.defenderHPAfter);
      else if (current.defenderId === fighter2.id) setHp2(current.defenderHPAfter);

      setDamageFx({ targetId: current.defenderId, value: current.finalDamage, crit: current.critical });
      setTimeout(() => setDamageFx(null), 420);
      setAttackingId(null);
    }, 250);

    const advanceTimer = setTimeout(() => setTurnIndex(t => t + 1), 600);

    return () => { clearTimeout(applyTimer); clearTimeout(advanceTimer); };
  }, [result, playing, turnIndex, fighter1, fighter2]);

  const winnerId = result?.winnerId;
  const isWinner1 = winnerId && fighter1 && winnerId === fighter1.id;
  const isWinner2 = winnerId && fighter2 && winnerId === fighter2.id;

  const charsById = React.useMemo(() => {
    const m = {};
    chars.forEach(c => { m[c.id] = c; });
    return m;
  }, [chars]);

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Battle Simulator</h2>

      {error && <div style={{ color: 'red' }}>{error}</div>}

      {/* Controls */}
      <div style={{ display: 'grid', gap: 8, justifyItems: 'center', marginBottom: 12 }}>
        <button
          onClick={() => startBattle()}
          disabled={loading || playing || !fighter1 || !fighter2}
          style={{
            justifySelf: 'center',
            padding: '0.75rem 2rem',
            fontSize: '1.25rem',
            fontWeight: '900',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            borderRadius: '12px',
            border: '3px solid #000',
            color: '#fff',
            background: loading
              ? 'linear-gradient(145deg, #7f8c8d, #95a5a6)'
              : 'linear-gradient(145deg, #e74c3c, #c0392b)',
            cursor: loading || playing || !fighter1 || !fighter2 ? 'not-allowed' : 'pointer',
            boxShadow: loading ? 'none' : '0 6px #000, 0 0 10px rgba(231,76,60,0.75)',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          }}
          onMouseDown={e => {
            if (loading || !fighter1 || !fighter2) return;
            e.currentTarget.style.transform = 'scale(0.95)';
            e.currentTarget.style.boxShadow = '0 3px #000';
          }}
          onMouseUp={e => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow =
              '0 6px #000, 0 0 10px rgba(231,76,60,0.75)';
          }}
        >
          {loading || playing ? 'Battling...' : 'FIGHT!!!'}
        </button>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => startBattle()}
            disabled={loading || playing || !fighter1 || !fighter2}
            style={{ padding: '0.5rem 1rem', borderRadius: 8 }}
          >
            Rematch
          </button>
          <button
            onClick={nextOpponent}
            disabled={loading || playing || !fighter1 || chars.length < 2}
            style={{ padding: '0.5rem 1rem', borderRadius: 8 }}
          >
            Next Opponent
          </button>
        </div>

        <div style={{ fontSize: 14, opacity: 0.8 }}>
          {fighter2 ? <>Opponent: <b>{fighter2.name}</b></> : 'Picking a random opponent…'}
        </div>
      </div>

      {/* Fighters */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          justifyItems: 'center',
          gap: '0.75rem',
          marginTop: '1rem',
        }}
      >
        <div style={{ width: 420, maxWidth: '100%' }}>
          {fighter1 && (
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
          )}
        </div>

        <div style={{ fontSize: '2rem', fontWeight: 800, opacity: 0.8 }}>VS</div>

        <div style={{ width: 420, maxWidth: '100%' }}>
          {fighter2 && (
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
          )}
        </div>
      </div>

      {!playing && result && (
        <h3 style={{ marginTop: '1rem' }}>
          Winner: {chars.find(c => c.id === result.winnerId)?.name || result.winnerId}
        </h3>
      )}
      
      {result && (
        <TurnLog
          turns={result.turns}
          currentIndex={Math.min(turnIndex, (result.turns?.length || 1) - 1)}
          charsById={charsById}
        />
      )}
    </div>
  );
}
