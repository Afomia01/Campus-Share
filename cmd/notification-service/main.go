package main

import (
	"context"
	"encoding/json"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/redis/go-redis/v9"
)

func main() {
	redisURL := os.Getenv("REDIS_URL")
	if redisURL == "" {
		redisURL = "redis://localhost:6379/0"
	}

	opt, err := redis.ParseURL(redisURL)
	if err != nil {
		log.Fatalf("Failed to parse redis url: %v", err)
	}

	client := redis.NewClient(opt)
	defer client.Close()

	ctx := context.Background()
	if err := client.Ping(ctx).Err(); err != nil {
		log.Fatalf("Failed to connect to redis: %v", err)
	}

	log.Println("Notification Service started. Listening for events...")

	// Subscribe to "resource.created"
	pubsub := client.Subscribe(ctx, "resource.created")
	defer pubsub.Close()

	ch := pubsub.Channel()

	// Handle graceful shutdown
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)

	go func() {
		for msg := range ch {
			var event map[string]interface{}
			if err := json.Unmarshal([]byte(msg.Payload), &event); err != nil {
				log.Printf("Failed to unmarshal event: %v", err)
				continue
			}
			log.Printf("[NOTIFICATION] New Resource Created! Sending email to followers of user %v about '%v'", event["user_id"], event["title"])
		}
	}()

	<-sigChan
	log.Println("Shutting down Notification Service...")
}
