package model

import "time"

type JavaneseDate struct {
	GregorianDate string `json:"gregorian_date"`
	Day           string `json:"day"`
	Pasaran       string `json:"pasaran"`
	Weton         string `json:"weton"`
	JavaneseYear  int    `json:"javanese_year"`
	DayOfWeek     int    `json:"day_of_week"`
	PasaranIndex  int    `json:"pasaran_index"`
	Neptu         int    `json:"neptu"`
}

type APIResponse struct {
	Status  string      `json:"status"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
}

type YearData struct {
	Year       int             `json:"year"`
	TotalDays  int             `json:"total_days"`
	Dates      []*JavaneseDate `json:"dates"`
	Statistics *YearStatistics `json:"statistics"`
}

type MonthData struct {
	Year      int             `json:"year"`
	Month     int             `json:"month"`
	TotalDays int             `json:"total_days"`
	Dates     []*JavaneseDate `json:"dates"`
}

type YearStatistics struct {
	DayCount     map[string]int `json:"day_count"`
	PasaranCount map[string]int `json:"pasaran_count"`
	WetonCount   map[string]int `json:"weton_count"`
}

// WetonCompatibility untuk menghitung kecocokan weton
type WetonCompatibility struct {
	Weton1        string `json:"weton1"`
	Weton2        string `json:"weton2"`
	Neptu1        int    `json:"neptu1"`
	Neptu2        int    `json:"neptu2"`
	TotalNeptu    int    `json:"total_neptu"`
	Compatibility string `json:"compatibility"`
	Description   string `json:"description"`
}

// GoodDaysRequest untuk request hari baik
type GoodDaysRequest struct {
	BirthDate  time.Time `json:"birth_date"`
	TargetYear int       `json:"target_year"`
}

// GoodDaysResponse untuk response hari baik
type GoodDaysResponse struct {
	BirthWeton string      `json:"birth_weton"`
	Year       int         `json:"year"`
	GoodDays   []time.Time `json:"good_days"`
	TotalDays  int         `json:"total_days"`
}

// Primbon data untuk perhitungan tradisional
type PrimbonData struct {
	Weton       string `json:"weton"`
	Neptu       int    `json:"neptu"`
	Character   string `json:"character"`
	LuckyColor  string `json:"lucky_color"`
	LuckyNumber int    `json:"lucky_number"`
}

// WetonAnalysis untuk analisis weton yang lebih mendalam
type WetonAnalysis struct {
	Weton          string `json:"weton"`
	Day            string `json:"day"`
	Pasaran        string `json:"pasaran"`
	Neptu          int    `json:"neptu"`
	DayNeptu       int    `json:"day_neptu"`
	PasaranNeptu   int    `json:"pasaran_neptu"`
	Character      string `json:"character"`
	Strength       string `json:"strength"`
	Weakness       string `json:"weakness"`
	Recommendation string `json:"recommendation"`
}
