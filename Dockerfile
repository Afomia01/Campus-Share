# Build Stage
FROM golang:1.23-alpine AS builder
WORKDIR /app

# Install dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build all binaries
RUN CGO_ENABLED=0 GOOS=linux go build -o main ./cmd/server
RUN CGO_ENABLED=0 GOOS=linux go build -o notification-service ./cmd/notification-service
RUN CGO_ENABLED=0 GOOS=linux go build -o analytics-service ./cmd/analytics-service
RUN CGO_ENABLED=0 GOOS=linux go build -o ai-service ./cmd/ai-service

# --- Target: App (Main API) ---
FROM alpine:latest AS app
WORKDIR /app
RUN apk --no-cache add ca-certificates
COPY --from=builder /app/main .
COPY start.sh .
RUN chmod +x start.sh
EXPOSE 8080
CMD ["./start.sh"]

# --- Target: Notification Service ---
FROM alpine:latest AS notification-service
WORKDIR /app
COPY --from=builder /app/notification-service .
CMD ["./notification-service"]

# --- Target: Analytics Service ---
FROM alpine:latest AS analytics-service
WORKDIR /app
COPY --from=builder /app/analytics-service .
CMD ["./analytics-service"]

# --- Target: AI Service ---
FROM alpine:latest AS ai-service
WORKDIR /app
RUN apk --no-cache add ca-certificates
COPY --from=builder /app/ai-service .
CMD ["./ai-service"]
