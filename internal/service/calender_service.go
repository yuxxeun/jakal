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

func (s *JavaneseCalendarService) ConvertToJavaneseDate(date time.Time) *model.JavaneseDate {

	dayIndex := int(date.Weekday())
	dayName := s.dayNames[dayIndex]

	epoch := time.Date(1970, 1, 1, 0, 0, 0, 0, time.UTC)
	daysSinceEpoch := int(date.Sub(epoch).Hours() / 24)

	pasaranIndex := (daysSinceEpoch + 3) % 5
	if pasaranIndex < 0 {
		pasaranIndex += 5
	}
	pasaranName := s.pasaranNames[pasaranIndex]

	weton := dayName + " " + pasaranName

	javaneseYear := date.Year() - 1632

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

func (s *JavaneseCalendarService) GetDateRange(start, end time.Time) []*model.JavaneseDate {
	var dates []*model.JavaneseDate

	for d := start; !d.After(end); d = d.AddDate(0, 0, 1) {
		javaneseDate := s.ConvertToJavaneseDate(d)
		dates = append(dates, javaneseDate)
	}

	return dates
}

func (s *JavaneseCalendarService) GetYearData(year int) *model.YearData {
	start := time.Date(year, 1, 1, 0, 0, 0, 0, time.UTC)
	end := time.Date(year, 12, 31, 0, 0, 0, 0, time.UTC)

	dates := s.GetDateRange(start, end)

	stats := s.calculateYearStats(dates)

	return &model.YearData{
		Year:       year,
		TotalDays:  len(dates),
		Dates:      dates,
		Statistics: stats,
	}
}

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

func (s *JavaneseCalendarService) GetWetonByDate(date time.Time) string {
	javaneseDate := s.ConvertToJavaneseDate(date)
	return javaneseDate.Weton
}

func (s *JavaneseCalendarService) GetNeptuByDate(date time.Time) int {
	javaneseDate := s.ConvertToJavaneseDate(date)
	return javaneseDate.Neptu
}

func (s *JavaneseCalendarService) CalculateWetonCompatibility(weton1, weton2 string) string {

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

func (s *JavaneseCalendarService) GetGoodDays(birthDate time.Time, targetYear int) []time.Time {
	var goodDays []time.Time
	birthWeton := s.ConvertToJavaneseDate(birthDate)

	start := time.Date(targetYear, 1, 1, 0, 0, 0, 0, time.UTC)
	end := time.Date(targetYear, 12, 31, 0, 0, 0, 0, time.UTC)

	for d := start; !d.After(end); d = d.AddDate(0, 0, 1) {
		currentWeton := s.ConvertToJavaneseDate(d)

		if currentWeton.Neptu == birthWeton.Neptu ||
			(currentWeton.Neptu+birthWeton.Neptu)%5 == 0 {
			goodDays = append(goodDays, d)
		}
	}

	return goodDays
}

func (s *JavaneseCalendarService) GetDayNeptu(day string) int {
	return s.dayNeptu[day]
}

func (s *JavaneseCalendarService) GetPasaranNeptu(pasaran string) int {
	return s.pasaranNeptu[pasaran]
}
