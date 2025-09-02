import { Routes, Route, Navigate } from 'react-router-dom'
import CharacterList from './pages/CharacterList'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/characters" replace />} />
      <Route path="/characters" element={<CharacterList />} />
      {/* future:
          <Route path="/battle" element={<BattleScreen />} />
          <Route path="/teams" element={<TeamBuilder />} />
      */}
    </Routes>
  )
}
export default App
