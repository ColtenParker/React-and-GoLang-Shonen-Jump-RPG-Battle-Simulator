// Character struct, base stats, gear

package models

type Character struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Element     string `json:"element"`
	Role        string `json:"role"`
	HP          int    `json:"hp"`
	Attack      int    `json:"attack"`
	Defense     int    `json:"defense"`
	Speed       int    `json:"speed"`
	CritRate    int    `json:"critRate"`
	CritDamage  int    `json:"critDamage"`
	SpriteSheet string `json:"spriteSheet"`
}
