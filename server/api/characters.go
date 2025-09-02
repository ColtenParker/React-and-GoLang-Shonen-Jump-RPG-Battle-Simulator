// Handles /api/characters GET

package api

import (
	"React-and-shonen-rpg-battle-simulator/server/data"
	"net/http"
	// "github.com/gorilla/mux"
	// "fmt"
	"encoding/json"
)

func GetCharactersHandler(w http.ResponseWriter, r *http.Request) {
	// Your code to handle the request
	characters, err := data.LoadCharacters("data/Characters.json")
	if err != nil {
		http.Error(w, "Failed to load characters", http.StatusInternalServerError)
		return
	}
	// Respond with the loaded characters
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(characters)
}
