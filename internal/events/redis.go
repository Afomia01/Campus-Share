package events

import (
	"context"
	"fmt"
	"log"

	"github.com/campus-share/backend/internal/config"
	"github.com/redis/go-redis/v9"
)

var Client *redis.Client

// InitRedis initializes the Redis client
func InitRedis(cfg *config.Config) error {
	opt, err := redis.ParseURL(cfg.Redis.URL)
	if err != nil {
		return fmt.Errorf("failed to parse redis url: %w", err)
	}

	Client = redis.NewClient(opt)

	if err := Client.Ping(context.Background()).Err(); err != nil {
		return fmt.Errorf("failed to connect to redis: %w", err)
	}

	log.Println("Redis connection established successfully")
	return nil
}

// PublishEvent publishes an event to a topic
func PublishEvent(ctx context.Context, topic string, message interface{}) error {
	if Client == nil {
		return fmt.Errorf("redis client not initialized")
	}
	return Client.Publish(ctx, topic, message).Err()
}
