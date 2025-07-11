package response

import (
	"encoding/json"
	"net/http"
	"time"
)

type APIResponse struct {
	Status    string      `json:"status"`
	Message   string      `json:"message"`
	Data      interface{} `json:"data,omitempty"`
	Error     interface{} `json:"error,omitempty"`
	Timestamp string      `json:"timestamp"`
	RequestID string      `json:"request_id,omitempty"`
}

type PaginatedResponse struct {
	Status     string      `json:"status"`
	Message    string      `json:"message"`
	Data       interface{} `json:"data"`
	Pagination Pagination  `json:"pagination"`
	Timestamp  string      `json:"timestamp"`
}

type Pagination struct {
	Page       int  `json:"page"`
	Limit      int  `json:"limit"`
	Total      int  `json:"total"`
	TotalPages int  `json:"total_pages"`
	HasNext    bool `json:"has_next"`
	HasPrev    bool `json:"has_prev"`
}

type ErrorDetail struct {
	Code    string `json:"code"`
	Field   string `json:"field,omitempty"`
	Message string `json:"message"`
}

type ValidationError struct {
	Status  string        `json:"status"`
	Message string        `json:"message"`
	Errors  []ErrorDetail `json:"errors"`
}

func JSON(w http.ResponseWriter, statusCode int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	if err := json.NewEncoder(w).Encode(data); err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	}
}

func Success(w http.ResponseWriter, message string, data interface{}) {
	response := APIResponse{
		Status:    "success",
		Message:   message,
		Data:      data,
		Timestamp: time.Now().Format(time.RFC3339),
	}
	JSON(w, http.StatusOK, response)
}

func Created(w http.ResponseWriter, message string, data interface{}) {
	response := APIResponse{
		Status:    "success",
		Message:   message,
		Data:      data,
		Timestamp: time.Now().Format(time.RFC3339),
	}
	JSON(w, http.StatusCreated, response)
}

func Error(w http.ResponseWriter, statusCode int, message string, err interface{}) {
	response := APIResponse{
		Status:    "error",
		Message:   message,
		Error:     err,
		Timestamp: time.Now().Format(time.RFC3339),
	}
	JSON(w, statusCode, response)
}

func BadRequest(w http.ResponseWriter, message string, err interface{}) {
	Error(w, http.StatusBadRequest, message, err)
}

func NotFound(w http.ResponseWriter, message string) {
	Error(w, http.StatusNotFound, message, nil)
}

func InternalError(w http.ResponseWriter, message string, err interface{}) {
	Error(w, http.StatusInternalServerError, message, err)
}

func Unauthorized(w http.ResponseWriter, message string) {
	Error(w, http.StatusUnauthorized, message, nil)
}

func Forbidden(w http.ResponseWriter, message string) {
	Error(w, http.StatusForbidden, message, nil)
}

func ValidationErrors(w http.ResponseWriter, errors []ErrorDetail) {
	response := ValidationError{
		Status:  "validation_error",
		Message: "Input validation failed",
		Errors:  errors,
	}
	JSON(w, http.StatusBadRequest, response)
}

func Paginated(w http.ResponseWriter, message string, data interface{}, pagination Pagination) {
	response := PaginatedResponse{
		Status:     "success",
		Message:    message,
		Data:       data,
		Pagination: pagination,
		Timestamp:  time.Now().Format(time.RFC3339),
	}
	JSON(w, http.StatusOK, response)
}
