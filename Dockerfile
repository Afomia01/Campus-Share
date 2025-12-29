# Build stage
FROM golang:1.23-alpine AS builder

WORKDIR /app

# Install dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -o main ./cmd/server
RUN CGO_ENABLED=0 GOOS=linux go build -o notification-service ./cmd/notification-service
RUN CGO_ENABLED=0 GOOS=linux go build -o analytics-service ./cmd/analytics-service

# Final stage
FROM alpine:latest

WORKDIR /app

# Install ca-certificates for HTTPS calls
RUN apk --no-cache add ca-certificates

# Copy binary from builder
COPY --from=builder /app/main .
COPY --from=builder /app/notification-service .
COPY --from=builder /app/analytics-service .
COPY start.sh .
RUN chmod +x start.sh

# Expose port
EXPOSE 8080

# Run the application
CMD ["./start.sh"]
