package handler

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
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

func (h *JavaneseCalendarHandler) FilterByWeton(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	weton := vars["weton"]
	yearStr := vars["year"]
	monthStr := vars["month"]

	// Support strip dan %20 - normalize weton
	weton = strings.ReplaceAll(weton, "-", " ")   // Convert strip to space
	weton = strings.ReplaceAll(weton, "%20", " ") // Support legacy URL encoding

	// Normalize case - capitalize each word
	parts := strings.Fields(weton)
	for i, part := range parts {
		parts[i] = strings.Title(strings.ToLower(part))
	}
	weton = strings.Join(parts, " ")

	year, err := strconv.Atoi(yearStr)
	if err != nil {
		h.sendErrorResponse(w, http.StatusBadRequest, "Format tahun tidak valid")
		return
	}

	// Validasi tahun
	currentYear := time.Now().Year()
	if year < 1900 || year > currentYear+50 {
		h.sendErrorResponse(w, http.StatusBadRequest, "Tahun harus antara 1900 - "+strconv.Itoa(currentYear+50))
		return
	}

	month := 0
	if monthStr != "" {
		month, err = strconv.Atoi(monthStr)
		if err != nil || month < 1 || month > 12 {
			h.sendErrorResponse(w, http.StatusBadRequest, "Format bulan tidak valid (1-12)")
			return
		}
	}

	dates := h.service.FilterByWeton(year, month, weton)

	var message string
	if month == 0 {
		message = "Daftar tanggal untuk weton " + weton + " di tahun " + yearStr
	} else {
		monthNames := []string{"", "Januari", "Februari", "Maret", "April", "Mei", "Juni",
			"Juli", "Agustus", "September", "Oktober", "November", "Desember"}
		message = "Daftar tanggal untuk weton " + weton + " di bulan " + monthNames[month] + " " + yearStr
	}

	response := model.APIResponse{
		Status:  "success",
		Message: message,
		Data: map[string]interface{}{
			"weton":       weton,
			"year":        year,
			"month":       month,
			"total_dates": len(dates),
			"dates":       dates,
		},
	}

	h.sendJSONResponse(w, http.StatusOK, response)
}

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

func (h *JavaneseCalendarHandler) GetByYear(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	yearStr := vars["year"]

	year, err := strconv.Atoi(yearStr)
	if err != nil {
		h.sendErrorResponse(w, http.StatusBadRequest, "Format tahun tidak valid")
		return
	}

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

// GetAllWeton - menampilkan semua kemungkinan weton
func (h *JavaneseCalendarHandler) GetAllWeton(w http.ResponseWriter, r *http.Request) {
	wetons := h.service.GetAllPossibleWeton()

	response := model.APIResponse{
		Status:  "success",
		Message: "Daftar semua kemungkinan weton dalam kalender Jawa",
		Data: map[string]interface{}{
			"total_weton": len(wetons),
			"wetons":      wetons,
		},
	}

	h.sendJSONResponse(w, http.StatusOK, response)
}

// GetWetonStatistics - statistik weton dalam periode tertentu
func (h *JavaneseCalendarHandler) GetWetonStatistics(w http.ResponseWriter, r *http.Request) {
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

	// Maksimal 2 tahun untuk menghindari overload
	maxDays := 730
	if int(end.Sub(start).Hours()/24) > maxDays {
		h.sendErrorResponse(w, http.StatusBadRequest, "Range tanggal maksimal 2 tahun")
		return
	}

	dateRange := h.service.GetDateRange(start, end)

	// Hitung statistik
	wetonCount := make(map[string]int)
	dayCount := make(map[string]int)
	pasaranCount := make(map[string]int)

	for _, date := range dateRange {
		wetonCount[date.Weton]++
		dayCount[date.Day]++
		pasaranCount[date.Pasaran]++
	}

	response := model.APIResponse{
		Status:  "success",
		Message: "Statistik weton dari " + startStr + " hingga " + endStr,
		Data: map[string]interface{}{
			"period": map[string]string{
				"start": startStr,
				"end":   endStr,
			},
			"total_days":    len(dateRange),
			"weton_count":   wetonCount,
			"day_count":     dayCount,
			"pasaran_count": pasaranCount,
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
