import React from 'react';

export default function CharacterCard({
  character,
  currentHp,
  isWinner = false,
  isAttacking = false,
  side = 'left',
  damageOverlay = null, // { value:number, crit:boolean } | null
}) {
  const {
    name,
    spriteSheet,
    element,
    role,
    hp,
    attack,
    defense,
    speed,
    critRate,
    critDamage,
  } = character;

  const maxHp = hp;
  const hpNow = typeof currentHp === 'number' ? currentHp : maxHp;
  const pct = Math.max(0, Math.min(100, Math.round((hpNow / maxHp) * 100)));
  const lungeOffset = side === 'left' ? 28 : -28;

  return (
    <div
      className="character-card"
      style={{
        border: `2px solid ${isWinner ? '#27ae60' : '#eee'}`,
        borderRadius: 12,
        padding: '1rem',
        width: 300,
        position: 'relative',
      }}
    >
      {/* Health bar */}
      <div style={{ marginBottom: 8 }}>
        <div
          style={{
            height: 12,
            background: '#ddd',
            borderRadius: 6,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${pct}%`,
              height: '100%',
              transition: 'width 300ms linear',
              background: pct > 50 ? '#2ecc71' : pct > 25 ? '#f1c40f' : '#e74c3c',
            }}
          />
        </div>
        <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>
          HP: {hpNow} / {maxHp} ({pct}%)
        </div>
      </div>

      {/* Sprite area (no clipping) */}
      <div
        style={{
          width: '100%',
          height: 200,            // more room so PNGs aren’t cut off
          display: 'grid',
          placeItems: 'center',
          overflow: 'visible',    // allow lunge to extend out
          position: 'relative',
        }}
      >
        <img
          src={spriteSheet}
          alt={`${name} sprite`}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            width: 'auto',
            height: 'auto',
            objectFit: 'contain',
            transform: isAttacking ? `translateX(${lungeOffset}px) scale(1.03)` : 'translateX(0) scale(1)',
            transition: 'transform 220ms ease',
            imageRendering: 'auto',
          }}
        />

        {/* Damage overlay (centered) */}
        {damageOverlay && (
  <div
    style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none',
      animation: 'damagePop 420ms ease-out',
      zIndex: 2,
    }}
  >
    {damageOverlay.crit ? (
      // STARBURST for CRIT
      <svg
        width="170"
        height="120"
        viewBox="-60 -45 120 90"
        style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.35))' }}
      >
        <polygon
          points="
            0,-40 10,-15 35,-28 22,-8 50,0 22,8
            35,28 10,15 0,40 -10,15 -35,28 -22,8
            -50,0 -22,-8 -35,-28 -10,-15
          "
          fill="#ffeb3b"
          stroke="#000"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <text
          x="0"
          y="6"
          textAnchor="middle"
          fontWeight="900"
          fontSize="22"
          fill="#000"
          style={{ fontFamily: 'Impact, Haettenschweiler, Arial Black, sans-serif' }}
        >
          {`${damageOverlay.value}`}
        </text>
      </svg>
    ) : (
      // Normal non-crit pill
      <div
        style={{
          padding: '6px 10px',
          borderRadius: 8,
          background: 'rgba(0,0,0,0.75)',
          color: '#fff',
          fontWeight: 800,
          fontSize: 18,
          boxShadow: '0 3px 10px rgba(0,0,0,0.35)',
        }}
      >
        {`-${damageOverlay.value}`}
      </div>
    )}
  </div>
)}
      </div>

      {/* Basic Info */}
      <h2 style={{ margin: '0.5rem 0' }}>{name}</h2>
      <p style={{ margin: 0, opacity: 0.8 }}>
        {element} • {role}
      </p>

      {/* Stats */}
      <ul style={{ paddingLeft: '1.2rem', marginTop: '0.5rem' }}>
        <li>Attack: {attack}</li>
        <li>Defense: {defense}</li>
        <li>Speed: {speed}</li>
        <li>Crit Rate: {critRate}%</li>
        <li>Crit Damage: {critDamage}%</li>
      </ul>

      {/* Overlay animation keyframes */}
      <style>{`
        @keyframes damagePop {
          0%   { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
          30%  { transform: translate(-50%, -50%) scale(1.15); opacity: 1; }
          100% { transform: translate(-50%, -65%) scale(1.0); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
