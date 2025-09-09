// Handles /api/battle (POST)

package api

import (
	"encoding/json"
	"math/rand"
	"net/http"

	"React-and-shonen-rpg-battle-simulator/server/data"
	"React-and-shonen-rpg-battle-simulator/server/models"
)

func getElementMultiplier(attackerElem, defenderElem string) float64 {
	switch attackerElem {
	case "Blaze":
		switch defenderElem {
		case "Nature":
			return 1.5
		case "Aqua":
			return 0.5
		}
	case "Nature":
		switch defenderElem {
		case "Aqua":
			return 1.5
		case "Blaze":
			return 0.5
		}
	case "Aqua":
		switch defenderElem {
		case "Blaze":
			return 1.5
		case "Nature":
			return 0.5
		}
	case "Spirit":
		if defenderElem == "Shadow" {
			return 1.33
		}
	case "Shadow":
		if defenderElem == "Spirit" {
			return 1.33
		}
	}
	return 1.0
}

func findCharactersByID(characters []models.Character, id1, id2 string) (*models.Character, *models.Character) {
	var char1, char2 *models.Character
	for i := range characters {
		switch characters[i].ID {
		case id1:
			char1 = &characters[i]
		case id2:
			char2 = &characters[i]
		}
	}
	return char1, char2
}

func computeDamage(attacker, defender *models.BattleUnit) (final int, isCrit bool, mult float64, raw int) {
	raw = attacker.Attack
	afterDef := raw - defender.Defense/2
	if afterDef < 1 {
		afterDef = 1
	}

	isCrit = rand.Intn(100) < attacker.CritRate
	if isCrit {
		afterDef = int(float64(afterDef) * (float64(attacker.CritDamage) / 100.0))
	}

	mult = getElementMultiplier(attacker.Element, defender.Element)
	final = int(float64(afterDef) * mult)
	if final < 1 {
		final = 1
	}
	return final, isCrit, mult, raw
}

func BattleHandler(w http.ResponseWriter, r *http.Request) {
	// Method guard
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Parse body
	var req models.BattleRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}

	// Load characters
	characters, err := data.LoadCharacters("data/characters.json")
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	// Resolve IDs
	p1, p2 := findCharactersByID(characters, req.Player1ID, req.Player2ID)
	if p1 == nil || p2 == nil {
		http.Error(w, "Character not found", http.StatusNotFound)
		return
	}

	// Snapshot units
	u1 := models.BattleUnit{
		ID:         p1.ID,
		Name:       p1.Name,
		Element:    p1.Element,
		Role:       p1.Role,
		HP:         p1.HP,
		Attack:     p1.Attack,
		Defense:    p1.Defense,
		Speed:      p1.Speed,
		CritRate:   p1.CritRate,
		CritDamage: p1.CritDamage,
	}
	u2 := models.BattleUnit{
		ID:         p2.ID,
		Name:       p2.Name,
		Element:    p2.Element,
		Role:       p2.Role,
		HP:         p2.HP,
		Attack:     p2.Attack,
		Defense:    p2.Defense,
		Speed:      p2.Speed,
		CritRate:   p2.CritRate,
		CritDamage: p2.CritDamage,
	}

	// Determine order for the round (first/second)
	var first, second *models.BattleUnit
	if u1.Speed > u2.Speed || (u1.Speed == u2.Speed && rand.Intn(2) == 0) {
		first, second = &u1, &u2
	} else {
		first, second = &u2, &u1
	}

	turnLog := []models.Turn{}
	turn := 1

	// Round-based loop: first hits, then second hits (if alive)
	for u1.HP > 0 && u2.HP > 0 {
		// First attacks second
		fd1, crit1, mult1, raw1 := computeDamage(first, second)
		second.HP -= fd1
		if second.HP < 0 {
			second.HP = 0
		}
		turnLog = append(turnLog, models.Turn{
			TurnNumber:        turn,
			AttackerID:        first.ID,
			DefenderID:        second.ID,
			IsCrit:            crit1,
			ElementMultiplier: mult1,
			RawDamage:         raw1,
			DefenderDefense:   second.Defense,
			FinalDamage:       fd1,
			DefenderHPAfter:   second.HP,
		})
		if second.HP <= 0 {
			break
		}

		// Second attacks first
		fd2, crit2, mult2, raw2 := computeDamage(second, first)
		first.HP -= fd2
		if first.HP < 0 {
			first.HP = 0
		}
		turnLog = append(turnLog, models.Turn{
			TurnNumber:        turn,
			AttackerID:        second.ID,
			DefenderID:        first.ID,
			IsCrit:            crit2,
			ElementMultiplier: mult2,
			RawDamage:         raw2,
			DefenderDefense:   first.Defense,
			FinalDamage:       fd2,
			DefenderHPAfter:   first.HP,
		})
		if first.HP <= 0 {
			break
		}

		turn++
	}

	// Determine winner/loser by remaining HP
	winnerID := u1.ID
	loserID := u2.ID
	if u2.HP > 0 && u1.HP <= 0 {
		winnerID, loserID = u2.ID, u1.ID
	}
	// If u1 started as "first" or "second" doesn't matter; IDs come from snapshots.

	result := models.BattleResult{
		WinnerID:    winnerID,
		LoserID:     loserID,
		Player1Unit: u1,
		Player2Unit: u2,
		Turns:       turnLog,
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(result)
}
