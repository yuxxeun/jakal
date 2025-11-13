package handler

import (
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/yuxxeun/jakal/internal/routes"
)

func main() {
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
		w.Write([]byte(`{"status": "ok", "service": "Jakal — Javanese Calendar API build with gorilla/mux 🦍"}`))
	}).Methods("GET")

	// API documentation endpoint
	router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{
			"service": "Jakal — Javanese Calendar API build with gorilla/mux 🦍",
			"version": "1.0.0",
			"description": "API untuk konversi tanggal Jawa dengan perhitungan weton dan neptu yang akurat",
			"endpoints": {
				"basic": {
					"GET /api/v1/today": "Tanggal Jawa hari ini",
					"GET /api/v1/date/{date}": "Konversi tanggal tertentu (format: YYYY-MM-DD)",
					"GET /api/v1/range/{start}/{end}": "Range tanggal (maksimal 1 tahun)",
					"GET /api/v1/year/{year}": "Data lengkap untuk tahun tertentu",
					"GET /api/v1/month/{year}/{month}": "Data lengkap untuk bulan tertentu"
				},
				"weton": {
					"GET /api/v1/weton/{date}": "Weton untuk tanggal tertentu",
					"GET /api/v1/neptu/{date}": "Neptu untuk tanggal tertentu",
					"GET /api/v1/compatibility/{date1}/{date2}": "Kecocokan weton dua tanggal",
					"GET /api/v1/good-days/{birth_date}/{target_year}": "Hari baik berdasarkan weton lahir",
					"GET /api/v1/wetons": "Daftar semua kemungkinan weton (35 kombinasi)"
				},
				"filter": {
					"GET /api/v1/weton/{weton}/{year}": "Filter weton dalam tahun (support strip: selasa-legi)",
					"GET /api/v1/weton/{weton}/{year}/{month}": "Filter weton dalam bulan tertentu"
				},
				"statistics": {
					"GET /api/v1/statistics/{start}/{end}": "Statistik weton dalam periode tertentu"
				},
				"utility": {
					"GET /health": "Status kesehatan API",
					"GET /": "Dokumentasi API"
				}
			},
			"examples": {
				"today": "/api/v1/today",
				"specific_date": "/api/v1/date/2025-07-29",
				"weton": "/api/v1/weton/1990-05-15",
				"neptu": "/api/v1/neptu/1990-05-15",
				"compatibility": "/api/v1/compatibility/1990-05-15/1992-08-20",
				"good_days": "/api/v1/good-days/1990-05-15/2025",
				"all_wetons": "/api/v1/wetons",
				"filter_weton_year": "/api/v1/weton/selasa-legi/2025",
				"filter_weton_month": "/api/v1/weton/jumat-kliwon/2025/7",
				"statistics": "/api/v1/statistics/2025-01-01/2025-12-31"
			},
			"notes": {
				"weton_format": "Sekarang mendukung strip (-) sebagai pengganti spasi. Contoh: 'selasa-legi' atau 'Selasa%20Legi'",
				"case_insensitive": "Format weton tidak case sensitive: 'selasa-legi' = 'Selasa-Legi' = 'SELASA-LEGI'"
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
	log.Printf("📅 Example: http://localhost:%s/api/v1/today", port)
	log.Printf("🔍 Filter Weton: http://localhost:%s/api/v1/weton/selasa-legi/2025", port)

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
