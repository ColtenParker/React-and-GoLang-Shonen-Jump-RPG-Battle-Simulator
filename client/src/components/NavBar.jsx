import React from 'react';
import { Link, NavLink } from 'react-router-dom';

export default function NavBar() {
  return (
    <nav style={{display:'flex',gap:'1rem',padding:'1rem',borderBottom:'1px solid #ddd'}}>
      <Link to="/" style={{fontWeight:700}}>Shonen RPG</Link>
      <NavLink to="/characters">Characters</NavLink>
      <NavLink to="/teams">Teams</NavLink>
      <NavLink to="/battle">Battle</NavLink>
    </nav>
  );
}
