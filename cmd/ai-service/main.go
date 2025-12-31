package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"syscall"

	"github.com/redis/go-redis/v9"
)

const (
	ColorReset  = "\033[0m"
	ColorGreen  = "\033[32m"
	ColorCyan   = "\033[36m"
	ColorYellow = "\033[33m"
	ColorBold   = "\033[1m"
	ColorRed    = "\033[31m"
)

// Event matches the structure sent by the Main App
type Event struct {
	ResourceID string `json:"resource_id"`
	Title      string `json:"title"`
	UserID     string `json:"user_id"`
}

// Gemini Request/Response Structs
type GeminiRequest struct {
	Contents []Content `json:"contents"`
}
type Content struct {
	Parts []Part `json:"parts"`
}
type Part struct {
	Text string `json:"text"`
}
type GeminiResponse struct {
	Candidates []struct {
		Content struct {
			Parts []struct {
				Text string `json:"text"`
			} `json:"parts"`
		} `json:"content"`
	} `json:"candidates"`
}

func main() {
	// 1. Setup Configuration
	redisURL := os.Getenv("REDIS_URL")
	apiKey := os.Getenv("GEMINI_API_KEY")

	if redisURL == "" {
		redisURL = "redis://localhost:6379"
	}
	if apiKey == "" {
		log.Fatal("❌ GEMINI_API_KEY is missing! Please set it in docker-compose.yml")
	}

	// 2. Connect to Redis
	opt, err := redis.ParseURL(redisURL)
	if err != nil {
		log.Fatalf("Invalid Redis URL: %v", err)
	}
	client := redis.NewClient(opt)
	defer client.Close()

	ctx := context.Background()
	log.Println("🤖 AI Service started. Connected to Google Gemini.")

	// 3. Subscribe to Redis
	pubsub := client.Subscribe(ctx, "resource.created")
	defer pubsub.Close()
	ch := pubsub.Channel()

	// 4. Handle Shutdown
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)
	go func() {
		<-sigChan
		os.Exit(0)
	}()

	// 5. Process Events
	for msg := range ch {
		var event Event
		if err := json.Unmarshal([]byte(msg.Payload), &event); err != nil {
			continue
		}

		log.Printf("[AI] 🧠 Received: '%s'. Asking Gemini for a study outline...", event.Title)

		// Call Real AI
		summary, err := generateStudyGuide(apiKey, event.Title)
		if err != nil {
			log.Printf("[AI] ⚠️ Real AI failed: %v. Switching to Fallback Mode (Mock).", err)
			summary = generateMockSummary(event.Title)
		}

		log.Printf("%s[AI] ✅ Analysis Complete for '%s'%s", ColorGreen, event.Title, ColorReset)

		// Format the summary (Markdown -> ANSI)
		formattedSummary := formatMarkdown(summary)

		// Print a fancy box for the output
		fmt.Println()
		fmt.Println(ColorCyan + "╔══════════════════════════════════════════════════════════════════════════════╗" + ColorReset)
		fmt.Printf("%s║                      🎓 AI STUDY GUIDE GENERATED                             ║%s\n", ColorCyan, ColorReset)
		fmt.Println(ColorCyan + "╠══════════════════════════════════════════════════════════════════════════════╣" + ColorReset)
		fmt.Println(formattedSummary)
		fmt.Println(ColorCyan + "╚══════════════════════════════════════════════════════════════════════════════╝" + ColorReset)
		fmt.Println()
	}
}

func generateStudyGuide(apiKey, title string) (string, error) {
	// Use gemini-2.5-flash which is the latest stable model available to your key
	url := "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey

	prompt := fmt.Sprintf("Generate a short, 3-bullet point study guide outline for a university resource titled: '%s'. Keep it academic and concise.", title)

	reqBody := GeminiRequest{
		Contents: []Content{{Parts: []Part{{Text: prompt}}}},
	}
	jsonData, _ := json.Marshal(reqBody)

	resp, err := http.Post(url, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)

	// Debug: Print raw response if status is not 200
	if resp.StatusCode != 200 {
		log.Printf("[AI] 🔴 API Error (Status %d): %s", resp.StatusCode, string(body))
		return "", fmt.Errorf("API returned status %d", resp.StatusCode)
	}

	var geminiResp GeminiResponse
	if err := json.Unmarshal(body, &geminiResp); err != nil {
		return "", err
	}

	if len(geminiResp.Candidates) > 0 && len(geminiResp.Candidates[0].Content.Parts) > 0 {
		return geminiResp.Candidates[0].Content.Parts[0].Text, nil
	}

	return "", fmt.Errorf("no response from AI")
}

func generateMockSummary(title string) string {
	return fmt.Sprintf("Fallback Summary for '%s':\n1. Introduction to %s\n2. Key Concepts and Definitions\n3. Advanced Topics and Case Studies", title, title)
}

func formatMarkdown(text string) string {
	// Replace bold markers **text** with ANSI Bold
	// Note: This is a simple replacement and assumes balanced markers
	parts := strings.Split(text, "**")
	var result strings.Builder

	for i, part := range parts {
		if i%2 == 0 {
			// Normal text
			result.WriteString(ColorYellow + part + ColorReset)
		} else {
			// Bold text
			result.WriteString(ColorBold + ColorGreen + part + ColorReset)
		}
	}

	text = result.String()

	// Replace bullet points
	text = strings.ReplaceAll(text, "* ", "  • ")

	// Add padding to each line for the box
	lines := strings.Split(text, "\n")
	var paddedLines []string
	for _, line := range lines {
		if strings.TrimSpace(line) == "" {
			continue
		}
		// Wrap long lines if needed (simple truncation for now to fit box)
		if len(line) > 74 {
			line = line[:71] + "..."
		}
		// Pad with spaces to align with box border (approximate)
		paddedLines = append(paddedLines, fmt.Sprintf("%s║ %-74s ║%s", ColorCyan, line, ColorReset))
	}

	return strings.Join(paddedLines, "\n")
}
