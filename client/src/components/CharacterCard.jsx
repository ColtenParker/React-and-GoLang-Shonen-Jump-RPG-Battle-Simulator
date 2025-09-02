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
        <div className="character-card">
            {/*Sprite*/}
            <img src={spriteSheet} alt={`${name} sprite`} />
            
            {/*Basic Info*/}
            <h2>{name}</h2>
            <p>Element: {element}</p>
            <p>Role: {role}</p>

            {/*Stats*/}
            <h3>Stats:</h3>
            <ul>
                <li>HP: {hp}</li>
                <li>Attack: {attack}</li>
                <li>Defense: {defense}</li>
                <li>Speed: {speed}</li>
                <li>Critical Rate: {critRate}</li>
                <li>Critical Damage: {critDamage}</li>
            </ul>
        </div>
    );
}
export default CharacterCard;