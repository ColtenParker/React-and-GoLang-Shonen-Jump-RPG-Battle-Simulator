package main

import (
	"React-and-shonen-rpg-battle-simulator/server/api"
	"React-and-shonen-rpg-battle-simulator/server/router"

	// "React-and-shonen-rpg-battle-simulator/server/data"
	// "fmt"
	"context"
	"math/rand"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
)

var rng = rand.New(rand.NewSource(time.Now().UnixNano()))

func main() {
	rng.Seed(time.Now().UnixNano())
	// Set up Server
	mux := http.NewServeMux()
	mux.HandleFunc("/api/characters", api.GetCharactersHandler)
	mux.HandleFunc("/api/battle", api.BattleHandler)
	mux.HandleFunc("/healthz", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("ok"))
	})
	// Apply CORS middleware
	handler := router.CORSMiddleware(mux)
	server := &http.Server{
		Addr:    ":8080",
		Handler: handler,
	}
	println("Server Running...")
	go server.ListenAndServe()

	// Graceful shutdown
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM)
	<-stop

	// Create a context with a timeout
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Shutdown the server
	server.Shutdown(ctx)
	println("Server Stopped.")
}
