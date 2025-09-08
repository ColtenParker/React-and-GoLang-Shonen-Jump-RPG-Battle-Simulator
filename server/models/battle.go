// BattleRequest, BattleResult, maybe enums like Element, Role
package models

type BattleRequest struct {
	Player1ID string `json:"player1_id"`
	Player2ID string `json:"player2_id"`
}

type BattleUnit struct {
	ID      string `json:"id"`
	Name    string `json:"name"`
	Element string `json:"element"`
	Role    string `json:"role"`
	HP      int    `json:"hp"`
	Attack  int    `json:"attack"`
	Defense int    `json:"defense"`
	Speed   int    `json:"speed"`
	CritRate    int    `json:"critRate"`
	CritDamage  int    `json:"critDamage"`
}

type Turn struct {
	AttackerID        string  `json:"attacker_id"`
	DefenderID        string  `json:"defender_id"`
	Damage            int     `json:"damage"`
	IsCrit            bool    `json:"critical"`
	ElementMultiplier float64 `json:"element_multiplier"`
	RawDamage         int     `json:"raw_damage"`
	DefenderDefense   int     `json:"defender_defense"`
	FinalDamage       int     `json:"final_damage"`
	DefenderHPAfter   int     `json:"defender_hp_after"`
}

type BattleResult struct {
	WinnerID   string     `json:"winner_id"`
	LoserID    string     `json:"loser_id"`
	Turns      []Turn     `json:"turns"`
	Player1Unit BattleUnit `json:"player1_unit"`
	Player2Unit BattleUnit `json:"player2_unit"`
}