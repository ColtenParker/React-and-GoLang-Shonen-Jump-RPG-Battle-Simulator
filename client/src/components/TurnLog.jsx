import React, { useMemo, useState } from 'react';

const elColors = {
  Blaze:   '#e67e22',
  Nature:  '#27ae60',
  Aqua:    '#2980b9',
  Spirit:  '#8e44ad',
  Shadow:  '#2c3e50',
};

function TinyHp({ current, max }) {
  const pct = Math.max(0, Math.min(100, Math.round((current / max) * 100)));
  return (
    <div style={{ width: 120 }}>
      <div style={{ height: 6, background: '#ddd', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{
          width: `${pct}%`,
          height: '100%',
          background: pct > 50 ? '#2ecc71' : pct > 25 ? '#f1c40f' : '#e74c3c',
          transition: 'width 200ms linear'
        }}/>
      </div>
      <div style={{ fontSize: 10, opacity: 0.7, marginTop: 2 }}>
        {current} / {max}
      </div>
    </div>
  );
}

function Badge({ children, bg = '#eee', fg = '#333' }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: 999,
      background: bg,
      color: fg,
      fontSize: 12,
      fontWeight: 700,
      marginRight: 6,
    }}>
      {children}
    </span>
  );
}

export default function TurnLog({ turns, currentIndex, charsById }) {
  const [showAll, setShowAll] = useState(false);
    const visibleTurns = useMemo(() => {
    const src = showAll ? turns : turns.slice(Math.max(0, currentIndex - 4), currentIndex + 1);
    return [...src].reverse(); // newest first
    }, [turns, currentIndex, showAll]);


  return (
    <div style={{
      marginTop: '1rem',
      border: '1px solid #eee',
      borderRadius: 12,
      padding: '0.75rem',
      background: '#fff'
    }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <h3 style={{ margin: 0 }}>Turn Log</h3>
        <button
          onClick={() => setShowAll(s => !s)}
          style={{ fontSize: 12, padding: '4px 8px', borderRadius: 8, border: '1px solid #ddd', background:'#fafafa', cursor:'pointer' }}
        >
          {showAll ? 'Show Recent' : 'Show All'}
        </button>
      </div>

      <ul style={{ listStyle: 'none', padding: 0, margin: '0.5rem 0 0' }}>
        {visibleTurns.map((t, i) => {
            // because we reversed, compute the original index for highlighting
            const originalIndex = turns.findIndex(x =>
            x.turnNumber === t.turnNumber &&
            x.attackerId === t.attackerId &&
            x.defenderId === t.defenderId &&
            x.finalDamage === t.finalDamage
            );
            const isActive = originalIndex === currentIndex;

            const attacker = charsById[t.attackerId];
            const defender = charsById[t.defenderId];
            const elemColor = attacker ? (elColors[attacker.element] || '#999') : '#999';

            return (
            <li key={`${t.turnNumber}-${t.attackerId}-${i}`} style={{
                padding: '8px 10px',
                marginBottom: 6,
                borderRadius: 10,
                border: isActive ? '2px solid #3498db' : '1px solid #eee',
                background: isActive ? 'rgba(52,152,219,0.06)' : '#fff',
            }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
                <Badge bg="#ecf0f1" fg="#2c3e50">Turn {t.turnNumber}</Badge>
                <Badge bg={elemColor} fg="#fff">{attacker?.element || '—'}</Badge>
                {t.critical && <Badge bg="#f1c40f" fg="#000">CRIT</Badge>}
                {t.elementMultiplier && t.elementMultiplier !== 1 && (
                    <Badge bg="#95a5a6" fg="#fff">x{t.elementMultiplier.toFixed(2)}</Badge>
                )}
                <div style={{ fontWeight: 800 }}>
                    {attacker?.name || t.attackerId} → {defender?.name || t.defenderId}
                </div>
                <div style={{ marginLeft: 'auto', fontWeight: 900 }}>
                    Dmg: {t.finalDamage}
                </div>
                </div>
                <div style={{ display:'flex', gap:12, marginTop:6, alignItems:'center', flexWrap:'wrap' }}>
                <span style={{ fontSize: 12, opacity: 0.7 }}>Defender HP</span>
                {defender ? (
                    <TinyHp current={t.defenderHPAfter} max={defender.hp} />
                ) : (
                    <span style={{ fontSize:12, opacity:0.7 }}>{t.defenderHPAfter}</span>
                )}
                <span style={{ fontSize: 12, opacity: 0.6 }}>
                    (Raw {t.rawDamage} vs DEF {t.defenderDefense})
                </span>
                </div>
            </li>
            );
        })}
        </ul>
    </div>
  );
}
