import React, { useState, useEffect } from 'react';
import CharacterCard from '../components/CharacterCard';


function CharacterList() {
  // state: characters [], loading true, error null
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
        fetch("http://localhost:8080/api/characters")
            .then((response) => {
            if (!response.ok) throw new Error("Failed to fetch characters");
            return response.json();
            })
            .then((json) => {
            setCharacters(json);
            setLoading(false);
            })
            .catch((err) => {
            setError(err.message);
            setLoading(false);
            });
}, []);

  // if loading -> return loading UI
  if (loading) {
      return <div>Loading...</div>;
  }

  // if error -> return error UI
  if (error) {
      return <div>Error: {error}</div>;
  }

  // return a container that maps characters -> <CharacterCard character={c} />
  return (
      <div>
          {characters.map(c => (
              <CharacterCard key={c.id} character={c} />
          ))}
      </div>
  );
}

export default CharacterList
