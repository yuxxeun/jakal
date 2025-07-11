package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/yuxxeun/jakal/internal/routes"
)

func main() {
	// Create router
	router := mux.NewRouter()

	// Setup routes
	routes.SetupJavaneseCalendarRoutes(router)

	// Add middleware
	router.Use(loggingMiddleware)
	router.Use(corsMiddleware)

	// Health check endpoint
	router.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status": "ok", "service": "Javanese Calendar API"}`))
	}).Methods("GET")

	// API documentation endpoint
	router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{
			"service": "Javanese Calendar API",
			"version": "1.0.0",
			"description": "API untuk konversi tanggal Jawa dengan perhitungan weton dan neptu yang akurat",
			"endpoints": {
				"basic": {
					"GET /api/javanese/today": "Tanggal Jawa hari ini",
					"GET /api/javanese/date/{date}": "Konversi tanggal tertentu (format: YYYY-MM-DD)",
					"GET /api/javanese/range/{start}/{end}": "Range tanggal (maksimal 1 tahun)",
					"GET /api/javanese/year/{year}": "Data lengkap untuk tahun tertentu",
					"GET /api/javanese/month/{year}/{month}": "Data lengkap untuk bulan tertentu"
				},
				"weton": {
					"GET /api/javanese/weton/{date}": "Weton untuk tanggal tertentu",
					"GET /api/javanese/neptu/{date}": "Neptu untuk tanggal tertentu",
					"GET /api/javanese/compatibility/{date1}/{date2}": "Kecocokan weton dua tanggal",
					"GET /api/javanese/good-days/{birth_date}/{target_year}": "Hari baik berdasarkan weton lahir"
				},
				"utility": {
					"GET /health": "Status kesehatan API",
					"GET /": "Dokumentasi API"
				}
			},
			"examples": {
				"today": "/api/javanese/today",
				"specific_date": "/api/javanese/date/2025-07-11",
				"weton": "/api/javanese/weton/1990-05-15",
				"neptu": "/api/javanese/neptu/1990-05-15",
				"compatibility": "/api/javanese/compatibility/1990-05-15/1992-08-20",
				"good_days": "/api/javanese/good-days/1990-05-15/2025"
			}
		}`))
	}).Methods("GET")

	// Get port from environment or use default
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("🚀 Javanese Calendar API Server starting on port %s", port)
	log.Printf("📖 API Documentation: http://localhost:%s/", port)
	log.Printf("💚 Health Check: http://localhost:%s/health", port)
	log.Printf("📅 Example: http://localhost:%s/api/javanese/today", port)

	// Start server
	log.Fatal(http.ListenAndServe(":"+port, router))
}

// Middleware untuk logging
func loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Printf("%s %s %s", r.Method, r.RequestURI, r.RemoteAddr)
		next.ServeHTTP(w, r)
	})
}

// Middleware untuk CORS
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}
