import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import CharacterList from './pages/CharacterList';
import TeamBuilder from './pages/TeamBuilder';
import BattleScreen from './pages/BattleScreen';

export default function App() {
  return (
    <>
      <NavBar />
      <div style={{padding:'1rem'}}>
        <Routes>
          <Route path="/" element={<Navigate to="/characters" replace />} />
          <Route path="/characters" element={<CharacterList />} />
          <Route path="/teams" element={<TeamBuilder />} />
          <Route path="/battle" element={<BattleScreen />} />
        </Routes>
      </div>
    </>
  );
}
