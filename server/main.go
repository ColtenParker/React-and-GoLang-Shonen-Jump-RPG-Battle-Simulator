package main

import (
	"React-and-shonen-rpg-battle-simulator/server/api"
	// "React-and-shonen-rpg-battle-simulator/server/data"
	// "fmt"
	"context"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
)

func main() {
	// Set up Server
	mux := http.NewServeMux()
	mux.HandleFunc("/api/characters", api.GetCharactersHandler)
	server := &http.Server{
		Addr:    ":8080",
		Handler: mux,
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
