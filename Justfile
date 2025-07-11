# justfile untuk project Go (Jakal) dengan struktur modular dan Air

# ====================
# Development
# ====================
dev:
    @echo "Menjalankan server dengan Air (hot reload)..."
    air

# ====================
# Build & Test
# ====================
build:
    @echo "Build aplikasi..."
    go build -o bin/jakal ./cmd/server

test:
    @echo "Menjalankan test..."
    go test ./...

test-coverage:
    @echo "Menjalankan test dengan coverage..."
    go test -cover ./...

# ====================
# Code Quality
# ====================
fmt:
    @echo "Format kode..."
    go fmt ./...

lint:
    @echo "Linting kode..."
    golangci-lint run

security:
    @echo "Security scan..."
    gosec ./...

# ====================
# Docker
# ====================
docker-build:
    docker build -t jakal:latest .

docker-run:
    docker run -p 8080:8080 jakal:latest

docker-up:
    docker-compose up --build

# ====================
# Utilities
# ====================
clean:
    @echo "Membersihkan file build..."
    rm -rf bin/ jakal

tidy:
    @echo "Menata ulang dependencies..."
    go mod tidy

setup:
    @echo "Menyiapkan environment development..."
    go mod download
