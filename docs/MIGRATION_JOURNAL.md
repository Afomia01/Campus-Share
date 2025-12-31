# Project Migration Journal: Monolith to Distributed Microservices

**Project:** Campus-Share Distributed System
**Date:** December 29, 2025
**Team:** [Your Team Name]

---

## 1. Executive Summary
This document details the transformation of "Campus-Share" from a monolithic Go application into a distributed system using Microservices and Pub/Sub architecture. The goal was to meet the requirements of the Distributed Systems course (SWENG5111) by decoupling core features into independent services.

---

## 2. Architecture Evolution

### Phase 1: The Monolith (Legacy State)
*   **Structure:** Single `main.go` entry point.
*   **Communication:** Direct function calls (e.g., `ResourceService` called `NotificationService` directly).
*   **Database:** Single PostgreSQL instance.
*   **Limitations:** Tightly coupled. If the notification logic failed, the upload could fail. Scaling required scaling the entire app.

### Phase 2: The Distributed System (Current State)
*   **Structure:**
    1.  **Core App (Publisher):** Handles HTTP requests and publishes events.
    2.  **Notification Service (Subscriber):** Independent process for sending emails.
    3.  **Analytics Service (Subscriber):** Independent process for tracking stats.
*   **Communication:** Asynchronous Pub/Sub via **Redis**.
*   **Infrastructure:** Docker Compose orchestrating 5 containers (App, Notification, Analytics, Postgres, Redis).

---

## 3. Challenges & Solutions Log

| Challenge ID | Issue Description | Root Cause | Solution Implemented |
| :--- | :--- | :--- | :--- |
| **CH-001** | **Dependency Hell** | `go-redis/v9` failed to install due to network/proxy issues. | Retried `go get` and ensured `go.mod` was tidy. |
| **CH-002** | **Database Migration Failures** | `uniqueIndex` on `student_id` and `google_id` caused failures when multiple users had `NULL` values. | **Schema Change:** Relaxed constraints from `uniqueIndex` to simple `index` for nullable fields. |
| **CH-003** | **File Upload Validation** | The demo script used `.txt` and `.xls` files, which were rejected by the strict whitelist. | **Config Update:** Added `txt` and `xls` to `AllowedFileTypes` in `config.go`. |
| **CH-004** | **Config Propagation** | Changes to `config.go` were not reflecting after `docker-compose restart`. | **Process Fix:** Realized `restart` doesn't rebuild binaries. Used `docker-compose up --build` to recompile. |
| **CH-005** | **Redis Serialization Error** | `redis: can't marshal map[string]interface{}` when publishing events. | **Code Fix:** Added `json.Marshal()` in `resource_handler.go` before sending data to Redis. |

---

## 4. SCM Milestones (Git Tags & Commits)

Use these identifiers to tag your Git history for Software Configuration Management (SCM) tracking.

### **Milestone 1: The Monolith Baseline**
*   **Tag:** `v1.0.0-monolith`
*   **Description:** The original working version of Campus-Share before any distributed logic.
*   **Key Files:** `cmd/server/main.go`, `internal/handlers/resource_handler.go`.

### **Milestone 2: Infrastructure Setup**
*   **Tag:** `v1.1.0-infra`
*   **Description:** Added Redis and Docker Compose configuration.
*   **Changes:**
    *   Added `redis` service to `docker-compose.yml`.
    *   Updated `Dockerfile` to build multiple binaries.
    *   Added `internal/events/redis.go` for connection logic.

### **Milestone 3: The Decoupling (Pub/Sub Implementation)**
*   **Tag:** `v1.2.0-pubsub`
*   **Description:** Core app now publishes events instead of doing everything itself.
*   **Changes:**
    *   Modified `internal/handlers/resource_handler.go` to publish `resource.created`.
    *   Added `json.Marshal` logic for event payload.

### **Milestone 4: Microservices Genesis**
*   **Tag:** `v1.3.0-microservices`
*   **Description:** Creation of the two new independent services.
*   **Changes:**
    *   Created `cmd/notification-service/main.go`.
    *   Created `cmd/analytics-service/main.go`.
    *   Both services subscribe to Redis channel `resource.created`.

### **Milestone 5: Stability & Validation (The MVP)**
*   **Tag:** `v2.0.0-distributed`
*   **Description:** Final stable version with all bugs fixed (Schema, Config, JSON).
*   **Changes:**
    *   Fixed `User` model indexes.
    *   Updated `AllowedFileTypes`.
    *   Added `demo_script.sh` for end-to-end validation.

---

## 5. How to Verify the System (Demo Procedure)

1.  **Start the Stack:**
    ```bash
    docker-compose up --build
    ```
2.  **Run the Trigger Script:**
    ```bash
    ./demo_script.sh
    ```
3.  **Observe Distributed Logs:**
    ```bash
    docker-compose logs notification-service analytics-service
    ```
    *Expected Output:* `[NOTIFICATION] New Resource Created!`

---

## 6. Future Improvements
*   **Message Durability:** Switch from Redis Pub/Sub (Fire & Forget) to Redis Streams or RabbitMQ for guaranteed delivery.
*   **Service Discovery:** Use Consul or Kubernetes for managing service endpoints instead of hardcoded Docker DNS.
*   **Tracing:** Implement OpenTelemetry to trace a request ID across the App -> Redis -> Microservice flow.
