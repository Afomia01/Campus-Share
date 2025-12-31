package main

import (
	"bufio"
	"fmt"
	"os/exec"
	"strings"
	"sync"
	"time"
)

// Configuration
const (
	Height = 20 // Number of lines per column
	Width  = 40 // Width of each column
)

// ANSI Codes
const (
	ClearScreen = "\033[2J"
	MoveTop     = "\033[H"
	ColorReset  = "\033[0m"
	ColorCyan   = "\033[36m"
	ColorGreen  = "\033[32m"
	ColorYellow = "\033[33m"
	ColorRed    = "\033[31m"
	ColorBlue   = "\033[34m"
	ColorWhite  = "\033[37m"
)

// Service Logs
var (
	logs = map[string][]string{
		"APP":          make([]string, 0),
		"NOTIFICATION": make([]string, 0),
		"ANALYTICS":    make([]string, 0),
		"AI":           make([]string, 0),
	}
	mutex = &sync.Mutex{}
)

func main() {
	// Start docker logs command (tail 0 to show only new logs)
	cmd := exec.Command("docker-compose", "logs", "-f", "--tail", "0")
	stdout, err := cmd.StdoutPipe()
	if err != nil {
		panic(err)
	}
	if err := cmd.Start(); err != nil {
		panic(err)
	}

	// Clear screen initially
	fmt.Print(ClearScreen)

	// Goroutine to read logs
	go func() {
		scanner := bufio.NewScanner(stdout)
		for scanner.Scan() {
			line := scanner.Text()
			processLogLine(line)
			render()
		}
	}()

	// Keep main thread alive and refresh occasionally
	for {
		time.Sleep(100 * time.Millisecond)
	}
}

// Add a new global variable
var unifiedLogs []string

func cleanLog(line, prefix string) string {
	// Remove the docker prefix "service-name | "
	parts := strings.SplitN(line, "|", 2)
	if len(parts) > 1 {
		return strings.TrimSpace(parts[1])
	}
	return line
}

func render() {
	mutex.Lock()
	defer mutex.Unlock()

	// Move cursor to top left
	fmt.Print(MoveTop)

	// Print Header
	fmt.Println(ColorBlue + "╔══════════════════════════════════════════════════════════════════════════════╗" + ColorReset)
	fmt.Println(ColorBlue + "║           🌐 Distributed Campus-Share System Live Event Stream               ║" + ColorReset)
	fmt.Println(ColorBlue + "╚══════════════════════════════════════════════════════════════════════════════╝" + ColorReset)
	fmt.Println()

	// Print the last N logs in a single unified stream
	for _, logLine := range unifiedLogs {
		fmt.Println(logLine)
	}
}

func processLogLine(line string) {
	mutex.Lock()
	defer mutex.Unlock()

	// Filter out noise (empty lines, build logs, etc)
	if strings.TrimSpace(line) == "" || strings.Contains(line, "Attaching to") {
		return
	}

	var formattedBlock string

	// 1. CORE API (Resource Upload)
	if strings.Contains(line, "app-1") && strings.Contains(line, "POST") && strings.Contains(line, "resources") && strings.Contains(line, "201") {
		formattedBlock = fmt.Sprintf(
			"%s╔══════════════════════════════════════════════════════════════════════════════╗%s\n"+
				"%s║ 1️⃣  CORE API SERVICE                                                        ║%s\n"+
				"%s╠══════════════════════════════════════════════════════════════════════════════╣%s\n"+
				"%s║ 📤 Action: Resource Uploaded Successfully                                    ║%s\n"+
				"%s║ 📡 Event:  Publishing 'resource.created' to REDIS Pub/Sub...                 ║%s\n"+
				"%s╚══════════════════════════════════════════════════════════════════════════════╝%s",
			ColorBlue, ColorReset,
			ColorBlue, ColorReset,
			ColorBlue, ColorReset,
			ColorBlue, ColorReset,
			ColorBlue, ColorReset,
			ColorBlue, ColorReset,
		)
		unifiedLogs = append(unifiedLogs, formattedBlock)
	} else if strings.Contains(line, "notification-service") && strings.Contains(line, "Sending email") {
		// 2. NOTIFICATION SERVICE
		formattedBlock = fmt.Sprintf(
			"%s╔══════════════════════════════════════════════════════════════════════════════╗%s\n"+
				"%s║ 2️⃣  NOTIFICATION SERVICE                                                    ║%s\n"+
				"%s╠══════════════════════════════════════════════════════════════════════════════╣%s\n"+
				"%s║ 📨 Source: Received Event from REDIS                                         ║%s\n"+
				"%s║ 🔔 Action: Sending Real-time Email Alerts to Followers                       ║%s\n"+
				"%s╚══════════════════════════════════════════════════════════════════════════════╝%s",
			ColorYellow, ColorReset,
			ColorYellow, ColorReset,
			ColorYellow, ColorReset,
			ColorYellow, ColorReset,
			ColorYellow, ColorReset,
			ColorYellow, ColorReset,
		)
		unifiedLogs = append(unifiedLogs, formattedBlock)
	} else if strings.Contains(line, "analytics-service") && strings.Contains(line, "Event received") {
		// 3. ANALYTICS SERVICE
		formattedBlock = fmt.Sprintf(
			"%s╔══════════════════════════════════════════════════════════════════════════════╗%s\n"+
				"%s║ 3️⃣  ANALYTICS SERVICE                                                       ║%s\n"+
				"%s╠══════════════════════════════════════════════════════════════════════════════╣%s\n"+
				"%s║ 📊 Source: Received Event from REDIS                                         ║%s\n"+
				"%s║ 📈 Action: Updating Dashboard Stats & User Metrics                           ║%s\n"+
				"%s╚══════════════════════════════════════════════════════════════════════════════╝%s",
			ColorGreen, ColorReset,
			ColorGreen, ColorReset,
			ColorGreen, ColorReset,
			ColorGreen, ColorReset,
			ColorGreen, ColorReset,
			ColorGreen, ColorReset,
		)
		unifiedLogs = append(unifiedLogs, formattedBlock)
	} else if strings.Contains(line, "ai-service") {
		// 4. AI SERVICE (Pass through the rich formatting we already built)
		// We strip the docker prefix to keep it clean
		content := cleanLog(line, "ai-service-1")
		// Only print if it's a meaningful line (not the startup log)
		if strings.Contains(content, "Received") || strings.Contains(content, "Analysis") || strings.Contains(content, "╔") || strings.Contains(content, "║") || strings.Contains(content, "╚") {
			unifiedLogs = append(unifiedLogs, content)
		}
	}

	// Keep last 30 lines (increased buffer for larger blocks)
	if len(unifiedLogs) > 30 {
		unifiedLogs = unifiedLogs[len(unifiedLogs)-30:]
	}
}
