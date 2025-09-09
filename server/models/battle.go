// BattleRequest, BattleResult, maybe enums like Element, Role
package models

type BattleRequest struct {
	Player1ID string `json:"player1Id"`
	Player2ID string `json:"player2Id"`
}

type BattleUnit struct {
	ID         string `json:"id"`
	Name       string `json:"name"`
	Element    string `json:"element"`
	Role       string `json:"role"`
	HP         int    `json:"hp"`
	Attack     int    `json:"attack"`
	Defense    int    `json:"defense"`
	Speed      int    `json:"speed"`
	CritRate   int    `json:"critRate"`
	CritDamage int    `json:"critDamage"`
}

type Turn struct {
	TurnNumber        int     `json:"turnNumber"`
	AttackerID        string  `json:"attackerId"`
	DefenderID        string  `json:"defenderId"`
	IsCrit            bool    `json:"critical"`
	ElementMultiplier float64 `json:"elementMultiplier"`
	RawDamage         int     `json:"rawDamage"`
	DefenderDefense   int     `json:"defenderDefense"`
	FinalDamage       int     `json:"finalDamage"`
	DefenderHPAfter   int     `json:"defenderHPAfter"`
}
type BattleResult struct {
	WinnerID    string     `json:"winnerId"`
	LoserID     string     `json:"loserId"`
	Turns       []Turn     `json:"turns"`
	Player1Unit BattleUnit `json:"player1Unit"`
	Player2Unit BattleUnit `json:"player2Unit"`
}
