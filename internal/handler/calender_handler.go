package handler

import (
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/mux"
	"github.com/yuxxeun/jakal/internal/model"
	"github.com/yuxxeun/jakal/internal/service"
)

type JavaneseCalendarHandler struct {
	service *service.JavaneseCalendarService
}

func NewJavaneseCalendarHandler(service *service.JavaneseCalendarService) *JavaneseCalendarHandler {
	return &JavaneseCalendarHandler{service: service}
}

// GetToday mengembalikan tanggal Jawa hari ini
func (h *JavaneseCalendarHandler) GetToday(w http.ResponseWriter, r *http.Request) {
	today := time.Now()
	javaneseDate := h.service.ConvertToJavaneseDate(today)

	response := model.APIResponse{
		Status:  "success",
		Message: "Tanggal Jawa hari ini",
		Data:    javaneseDate,
	}

	h.sendJSONResponse(w, http.StatusOK, response)
}

// GetByDate mengembalikan tanggal Jawa berdasarkan tanggal tertentu
func (h *JavaneseCalendarHandler) GetByDate(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	dateStr := vars["date"]

	date, err := time.Parse("2006-01-02", dateStr)
	if err != nil {
		h.sendErrorResponse(w, http.StatusBadRequest, "Format tanggal tidak valid. Gunakan YYYY-MM-DD")
		return
	}

	javaneseDate := h.service.ConvertToJavaneseDate(date)

	response := model.APIResponse{
		Status:  "success",
		Message: "Tanggal Jawa untuk " + dateStr,
		Data:    javaneseDate,
	}

	h.sendJSONResponse(w, http.StatusOK, response)
}

// GetDateRange mengembalikan range tanggal Jawa
func (h *JavaneseCalendarHandler) GetDateRange(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	startStr := vars["start"]
	endStr := vars["end"]

	start, err := time.Parse("2006-01-02", startStr)
	if err != nil {
		h.sendErrorResponse(w, http.StatusBadRequest, "Format tanggal start tidak valid")
		return
	}

	end, err := time.Parse("2006-01-02", endStr)
	if err != nil {
		h.sendErrorResponse(w, http.StatusBadRequest, "Format tanggal end tidak valid")
		return
	}

	if start.After(end) {
		h.sendErrorResponse(w, http.StatusBadRequest, "Tanggal start tidak boleh lebih besar dari end")
		return
	}

	// Batasi range maksimal 1 tahun untuk performa
	maxDays := 365
	if int(end.Sub(start).Hours()/24) > maxDays {
		h.sendErrorResponse(w, http.StatusBadRequest, "Range tanggal maksimal 1 tahun")
		return
	}

	dateRange := h.service.GetDateRange(start, end)

	response := model.APIResponse{
		Status:  "success",
		Message: "Range tanggal Jawa dari " + startStr + " hingga " + endStr,
		Data:    dateRange,
	}

	h.sendJSONResponse(w, http.StatusOK, response)
}

// GetByYear mengembalikan semua tanggal Jawa dalam tahun tertentu
func (h *JavaneseCalendarHandler) GetByYear(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	yearStr := vars["year"]

	year, err := strconv.Atoi(yearStr)
	if err != nil {
		h.sendErrorResponse(w, http.StatusBadRequest, "Format tahun tidak valid")
		return
	}

	// Batasi tahun untuk performa
	currentYear := time.Now().Year()
	if year < 1900 || year > currentYear+50 {
		h.sendErrorResponse(w, http.StatusBadRequest, "Tahun harus antara 1900 - "+strconv.Itoa(currentYear+50))
		return
	}

	yearData := h.service.GetYearData(year)

	response := model.APIResponse{
		Status:  "success",
		Message: "Data tanggal Jawa untuk tahun " + yearStr,
		Data:    yearData,
	}

	h.sendJSONResponse(w, http.StatusOK, response)
}

// GetByMonth mengembalikan semua tanggal Jawa dalam bulan tertentu
func (h *JavaneseCalendarHandler) GetByMonth(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	yearStr := vars["year"]
	monthStr := vars["month"]

	year, err := strconv.Atoi(yearStr)
	if err != nil {
		h.sendErrorResponse(w, http.StatusBadRequest, "Format tahun tidak valid")
		return
	}

	month, err := strconv.Atoi(monthStr)
	if err != nil || month < 1 || month > 12 {
		h.sendErrorResponse(w, http.StatusBadRequest, "Format bulan tidak valid (1-12)")
		return
	}

	monthData := h.service.GetMonthData(year, month)

	response := model.APIResponse{
		Status:  "success",
		Message: "Data tanggal Jawa untuk bulan " + monthStr + " tahun " + yearStr,
		Data:    monthData,
	}

	h.sendJSONResponse(w, http.StatusOK, response)
}

// GetWeton mengembalikan weton untuk tanggal tertentu
func (h *JavaneseCalendarHandler) GetWeton(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	dateStr := vars["date"]

	date, err := time.Parse("2006-01-02", dateStr)
	if err != nil {
		h.sendErrorResponse(w, http.StatusBadRequest, "Format tanggal tidak valid. Gunakan YYYY-MM-DD")
		return
	}

	weton := h.service.GetWetonByDate(date)

	response := model.APIResponse{
		Status:  "success",
		Message: "Weton untuk tanggal " + dateStr,
		Data: map[string]interface{}{
			"date":  dateStr,
			"weton": weton,
		},
	}

	h.sendJSONResponse(w, http.StatusOK, response)
}

// GetNeptu mengembalikan neptu untuk tanggal tertentu
func (h *JavaneseCalendarHandler) GetNeptu(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	dateStr := vars["date"]

	date, err := time.Parse("2006-01-02", dateStr)
	if err != nil {
		h.sendErrorResponse(w, http.StatusBadRequest, "Format tanggal tidak valid. Gunakan YYYY-MM-DD")
		return
	}

	neptu := h.service.GetNeptuByDate(date)
	javaneseDate := h.service.ConvertToJavaneseDate(date)

	response := model.APIResponse{
		Status:  "success",
		Message: "Neptu untuk tanggal " + dateStr,
		Data: map[string]interface{}{
			"date":          dateStr,
			"weton":         javaneseDate.Weton,
			"day":           javaneseDate.Day,
			"pasaran":       javaneseDate.Pasaran,
			"neptu":         neptu,
			"day_neptu":     h.service.GetDayNeptu(javaneseDate.Day),
			"pasaran_neptu": h.service.GetPasaranNeptu(javaneseDate.Pasaran),
		},
	}

	h.sendJSONResponse(w, http.StatusOK, response)
}

// GetWetonCompatibility menghitung kecocokan weton
func (h *JavaneseCalendarHandler) GetWetonCompatibility(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	date1Str := vars["date1"]
	date2Str := vars["date2"]

	date1, err := time.Parse("2006-01-02", date1Str)
	if err != nil {
		h.sendErrorResponse(w, http.StatusBadRequest, "Format tanggal pertama tidak valid")
		return
	}

	date2, err := time.Parse("2006-01-02", date2Str)
	if err != nil {
		h.sendErrorResponse(w, http.StatusBadRequest, "Format tanggal kedua tidak valid")
		return
	}

	javaneseDate1 := h.service.ConvertToJavaneseDate(date1)
	javaneseDate2 := h.service.ConvertToJavaneseDate(date2)

	compatibility := h.service.CalculateWetonCompatibility(javaneseDate1.Weton, javaneseDate2.Weton)

	response := model.APIResponse{
		Status:  "success",
		Message: "Kecocokan weton untuk " + date1Str + " dan " + date2Str,
		Data: model.WetonCompatibility{
			Weton1:        javaneseDate1.Weton,
			Weton2:        javaneseDate2.Weton,
			Neptu1:        javaneseDate1.Neptu,
			Neptu2:        javaneseDate2.Neptu,
			TotalNeptu:    javaneseDate1.Neptu + javaneseDate2.Neptu,
			Compatibility: compatibility,
			Description:   "Kecocokan berdasarkan perhitungan weton Jawa",
		},
	}

	h.sendJSONResponse(w, http.StatusOK, response)
}

// GetGoodDays mengembalikan hari baik berdasarkan weton lahir
func (h *JavaneseCalendarHandler) GetGoodDays(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	birthDateStr := vars["birth_date"]
	targetYearStr := vars["target_year"]

	birthDate, err := time.Parse("2006-01-02", birthDateStr)
	if err != nil {
		h.sendErrorResponse(w, http.StatusBadRequest, "Format tanggal lahir tidak valid")
		return
	}

	targetYear, err := strconv.Atoi(targetYearStr)
	if err != nil {
		h.sendErrorResponse(w, http.StatusBadRequest, "Format tahun target tidak valid")
		return
	}

	birthWeton := h.service.GetWetonByDate(birthDate)
	goodDays := h.service.GetGoodDays(birthDate, targetYear)

	response := model.APIResponse{
		Status:  "success",
		Message: "Hari baik untuk weton " + birthWeton + " di tahun " + targetYearStr,
		Data: model.GoodDaysResponse{
			BirthWeton: birthWeton,
			Year:       targetYear,
			GoodDays:   goodDays,
			TotalDays:  len(goodDays),
		},
	}

	h.sendJSONResponse(w, http.StatusOK, response)
}

func (h *JavaneseCalendarHandler) sendJSONResponse(w http.ResponseWriter, statusCode int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(data)
}

func (h *JavaneseCalendarHandler) sendErrorResponse(w http.ResponseWriter, statusCode int, message string) {
	response := model.APIResponse{
		Status:  "error",
		Message: message,
		Data:    nil,
	}
	h.sendJSONResponse(w, statusCode, response)
}
