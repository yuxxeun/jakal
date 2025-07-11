package service

import (
	"time"

	"github.com/yuxxeun/jakal/internal/model"
)

type JavaneseCalendarService struct {
	dayNames     []string
	pasaranNames []string
	dayNeptu     map[string]int
	pasaranNeptu map[string]int
}

func NewJavaneseCalendarService() *JavaneseCalendarService {
	return &JavaneseCalendarService{
		dayNames:     []string{"Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"},
		pasaranNames: []string{"Legi", "Pahing", "Pon", "Wage", "Kliwon"},
		dayNeptu: map[string]int{
			"Minggu": 5,
			"Senin":  4,
			"Selasa": 3,
			"Rabu":   7,
			"Kamis":  8,
			"Jumat":  6,
			"Sabtu":  9,
		},
		pasaranNeptu: map[string]int{
			"Legi":   5,
			"Pahing": 9,
			"Pon":    7,
			"Wage":   4,
			"Kliwon": 8,
		},
	}
}

// ConvertToJavaneseDate mengkonversi tanggal Masehi ke tanggal Jawa
func (s *JavaneseCalendarService) ConvertToJavaneseDate(date time.Time) *model.JavaneseDate {
	// Hitung hari dalam seminggu
	dayIndex := int(date.Weekday())
	dayName := s.dayNames[dayIndex]

	// Hitung pasaran (siklus 5 hari)
	// Referensi: 1 Januari 1970 adalah Kamis Wage
	// Berdasarkan referensi kalenderjawa.id dan ki-demang.com
	epoch := time.Date(1970, 1, 1, 0, 0, 0, 0, time.UTC)
	daysSinceEpoch := int(date.Sub(epoch).Hours() / 24)

	// 1 Januari 1970 adalah Kamis Wage
	// Kamis = index 4, Wage = index 3 (dalam array pasaranNames)
	// Sehingga untuk menghitung pasaran: (daysSinceEpoch + 3) % 5
	pasaranIndex := (daysSinceEpoch + 3) % 5
	if pasaranIndex < 0 {
		pasaranIndex += 5
	}
	pasaranName := s.pasaranNames[pasaranIndex]

	// Hitung weton (kombinasi hari dan pasaran)
	weton := dayName + " " + pasaranName

	// Hitung tahun Jawa (sistem tahun Jawa dimulai dari 1633 Masehi = 1 Jawa)
	javaneseYear := date.Year() - 1632

	// Hitung neptu (nilai weton)
	neptu := s.dayNeptu[dayName] + s.pasaranNeptu[pasaranName]

	return &model.JavaneseDate{
		GregorianDate: date.Format("2006-01-02"),
		Day:           dayName,
		Pasaran:       pasaranName,
		Weton:         weton,
		JavaneseYear:  javaneseYear,
		DayOfWeek:     dayIndex + 1,
		PasaranIndex:  pasaranIndex + 1,
		Neptu:         neptu,
	}
}

// GetDateRange mengembalikan range tanggal Jawa
func (s *JavaneseCalendarService) GetDateRange(start, end time.Time) []*model.JavaneseDate {
	var dates []*model.JavaneseDate

	for d := start; !d.After(end); d = d.AddDate(0, 0, 1) {
		javaneseDate := s.ConvertToJavaneseDate(d)
		dates = append(dates, javaneseDate)
	}

	return dates
}

// GetYearData mengembalikan data tahun lengkap
func (s *JavaneseCalendarService) GetYearData(year int) *model.YearData {
	start := time.Date(year, 1, 1, 0, 0, 0, 0, time.UTC)
	end := time.Date(year, 12, 31, 0, 0, 0, 0, time.UTC)

	dates := s.GetDateRange(start, end)

	// Hitung statistik
	stats := s.calculateYearStats(dates)

	return &model.YearData{
		Year:       year,
		TotalDays:  len(dates),
		Dates:      dates,
		Statistics: stats,
	}
}

// GetMonthData mengembalikan data bulan lengkap
func (s *JavaneseCalendarService) GetMonthData(year, month int) *model.MonthData {
	start := time.Date(year, time.Month(month), 1, 0, 0, 0, 0, time.UTC)
	end := start.AddDate(0, 1, -1)

	dates := s.GetDateRange(start, end)

	return &model.MonthData{
		Year:      year,
		Month:     month,
		TotalDays: len(dates),
		Dates:     dates,
	}
}

// GetWetonByDate mengembalikan weton untuk tanggal tertentu
func (s *JavaneseCalendarService) GetWetonByDate(date time.Time) string {
	javaneseDate := s.ConvertToJavaneseDate(date)
	return javaneseDate.Weton
}

// GetNeptuByDate mengembalikan neptu untuk tanggal tertentu
func (s *JavaneseCalendarService) GetNeptuByDate(date time.Time) int {
	javaneseDate := s.ConvertToJavaneseDate(date)
	return javaneseDate.Neptu
}

// CalculateWetonCompatibility menghitung kecocokan weton berdasarkan primbon Jawa
func (s *JavaneseCalendarService) CalculateWetonCompatibility(weton1, weton2 string) string {
	// Implementasi sederhana kecocokan weton
	// Bisa diperluas dengan logika primbon yang lebih kompleks
	return "Implementasi kecocokan weton belum lengkap"
}

func (s *JavaneseCalendarService) calculateYearStats(dates []*model.JavaneseDate) *model.YearStatistics {
	dayCount := make(map[string]int)
	pasaranCount := make(map[string]int)
	wetonCount := make(map[string]int)

	for _, date := range dates {
		dayCount[date.Day]++
		pasaranCount[date.Pasaran]++
		wetonCount[date.Weton]++
	}

	return &model.YearStatistics{
		DayCount:     dayCount,
		PasaranCount: pasaranCount,
		WetonCount:   wetonCount,
	}
}

// GetGoodDays mengembalikan hari baik berdasarkan weton
func (s *JavaneseCalendarService) GetGoodDays(birthDate time.Time, targetYear int) []time.Time {
	var goodDays []time.Time
	birthWeton := s.ConvertToJavaneseDate(birthDate)

	// Implementasi sederhana untuk mencari hari baik
	// Berdasarkan siklus 35 hari (7 hari x 5 pasaran)
	start := time.Date(targetYear, 1, 1, 0, 0, 0, 0, time.UTC)
	end := time.Date(targetYear, 12, 31, 0, 0, 0, 0, time.UTC)

	for d := start; !d.After(end); d = d.AddDate(0, 0, 1) {
		currentWeton := s.ConvertToJavaneseDate(d)

		// Contoh: hari baik jika neptu sama atau kelipatan tertentu
		if currentWeton.Neptu == birthWeton.Neptu ||
			(currentWeton.Neptu+birthWeton.Neptu)%5 == 0 {
			goodDays = append(goodDays, d)
		}
	}

	return goodDays
}

// GetDayNeptu mengembalikan nilai neptu untuk hari tertentu
func (s *JavaneseCalendarService) GetDayNeptu(day string) int {
	return s.dayNeptu[day]
}

// GetPasaranNeptu mengembalikan nilai neptu untuk pasaran tertentu
func (s *JavaneseCalendarService) GetPasaranNeptu(pasaran string) int {
	return s.pasaranNeptu[pasaran]
}
