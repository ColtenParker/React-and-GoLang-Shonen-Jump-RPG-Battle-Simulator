import React from 'react';

const CharacterCard = ({ character }) => {
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

    return (
        <div className="character-card" style={{border:'1px solid #eee',borderRadius:12,padding:'1rem'}}>
            <img src={spriteSheet} alt={`${name} sprite`} style={{width:'100%',height:140,objectFit:'contain'}} />
            <h2 style={{margin:'0.5rem 0'}}>{name}</h2>
            <p style={{margin:0,opacity:0.8}}>{element} • {role}</p>
            <ul style={{paddingLeft:'1.2rem',marginTop:'0.5rem'}}>
                <li>HP: {hp}</li>
                <li>Attack: {attack}</li>
                <li>Defense: {defense}</li>
                <li>Speed: {speed}</li>
                <li>Crit Rate: {critRate}%</li>
                <li>Crit Damage: {critDamage}%</li>
            </ul>
        </div>

    );
}

export default CharacterCard;