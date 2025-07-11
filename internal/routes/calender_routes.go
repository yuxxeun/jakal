package routes

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/yuxxeun/jakal/internal/handler"
	"github.com/yuxxeun/jakal/internal/service"
)

func SetupJavaneseCalendarRoutes(router *mux.Router) {

	javaneseService := service.NewJavaneseCalendarService()
	javaneseHandler := handler.NewJavaneseCalendarHandler(javaneseService)

	api := router.PathPrefix("/api/javanese").Subrouter()

	api.HandleFunc("/today", javaneseHandler.GetToday).Methods("GET")
	api.HandleFunc("/date/{date}", javaneseHandler.GetByDate).Methods("GET")
	api.HandleFunc("/range/{start}/{end}", javaneseHandler.GetDateRange).Methods("GET")
	api.HandleFunc("/year/{year}", javaneseHandler.GetByYear).Methods("GET")
	api.HandleFunc("/month/{year}/{month}", javaneseHandler.GetByMonth).Methods("GET")

	api.HandleFunc("/weton/{date}", javaneseHandler.GetWeton).Methods("GET")
	api.HandleFunc("/neptu/{date}", javaneseHandler.GetNeptu).Methods("GET")
	api.HandleFunc("/compatibility/{date1}/{date2}", javaneseHandler.GetWetonCompatibility).Methods("GET")
	api.HandleFunc("/good-days/{birth_date}/{target_year}", javaneseHandler.GetGoodDays).Methods("GET")

	api.HandleFunc("/{path:.*}", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.WriteHeader(http.StatusOK)
	}).Methods("OPTIONS")
}
