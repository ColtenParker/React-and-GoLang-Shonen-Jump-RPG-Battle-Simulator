// Loads JSON data from files

package data

import (
	"encoding/json"
	"fmt"
	"os"

	"React-and-shonen-rpg-battle-simulator/server/models"
)

func LoadCharacters(filePath string) ([]models.Character, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return nil, fmt.Errorf("failed to open file: %w", err)
	}
	defer file.Close()

	var characters []models.Character
	decoder := json.NewDecoder(file)
	if err := decoder.Decode(&characters); err != nil {
		return nil, fmt.Errorf("failed to decode JSON: %w", err)
	}
	return characters, nil
}
