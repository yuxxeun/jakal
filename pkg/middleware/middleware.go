package middleware

import (
	"context"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"github.com/sirupsen/logrus"
	"github.com/yuxxeun/jakal/pkg/logger"
	"github.com/yuxxeun/jakal/pkg/metrics"
)

// Context keys
type contextKey string

const (
	RequestIDKey contextKey = "request_id"
	StartTimeKey contextKey = "start_time"
)

// ResponseWriter wrapper to capture status code and response size
type responseWriter struct {
	http.ResponseWriter
	statusCode int
	size       int
}

func (rw *responseWriter) WriteHeader(code int) {
	rw.statusCode = code
	rw.ResponseWriter.WriteHeader(code)
}

func (rw *responseWriter) Write(b []byte) (int, error) {
	size, err := rw.ResponseWriter.Write(b)
	rw.size += size
	return size, err
}

// Enhanced Logging Middleware
func LoggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		startTime := time.Now()
		requestID := uuid.New().String()

		// Add request ID to context
		ctx := context.WithValue(r.Context(), RequestIDKey, requestID)
		ctx = context.WithValue(ctx, StartTimeKey, startTime)
		r = r.WithContext(ctx)

		// Wrap response writer
		rw := &responseWriter{
			ResponseWriter: w,
			statusCode:     200,
		}

		// Add request ID to response header
		rw.Header().Set("X-Request-ID", requestID)

		// Log request
		logger.WithFields(logrus.Fields{
			"request_id":     requestID,
			"method":         r.Method,
			"path":           r.URL.Path,
			"query_params":   r.URL.RawQuery,
			"remote_addr":    r.RemoteAddr,
			"user_agent":     r.Header.Get("User-Agent"),
			"content_type":   r.Header.Get("Content-Type"),
			"content_length": r.Header.Get("Content-Length"),
		}).Info("Request started")

		// Process request
		next.ServeHTTP(rw, r)

		// Calculate duration
		duration := time.Since(startTime)

		// Log response
		logger.WithFields(logrus.Fields{
			"request_id":    requestID,
			"method":        r.Method,
			"path":          r.URL.Path,
			"status_code":   rw.statusCode,
			"response_size": rw.size,
			"duration_ms":   duration.Milliseconds(),
			"duration_ns":   duration.Nanoseconds(),
		}).Info("Request completed")

		// Record metrics
		metrics.RecordHTTPRequest(r.Method, r.URL.Path, rw.statusCode, duration)
	})
}

// CORS Middleware with better security
func CORSMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")

		// Set CORS headers
		w.Header().Set("Access-Control-Allow-Origin", "*") // In production, use specific domains
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
		w.Header().Set("Access-Control-Expose-Headers", "X-Request-ID")
		w.Header().Set("Access-Control-Max-Age", "86400") // 24 hours

		// Handle preflight requests
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		// Log CORS request
		if origin != "" {
			logger.WithFields(logrus.Fields{
				"origin": origin,
				"method": r.Method,
				"path":   r.URL.Path,
			}).Debug("CORS request")
		}

		next.ServeHTTP(w, r)
	})
}

// Security Headers Middleware
func SecurityHeadersMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// XSS Protection
		w.Header().Set("X-XSS-Protection", "1; mode=block")
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("X-Frame-Options", "DENY")
		w.Header().Set("Referrer-Policy", "strict-origin-when-cross-origin")

		// Content Security Policy
		w.Header().Set("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'")

		// HSTS (only in production with HTTPS)
		if r.TLS != nil {
			w.Header().Set("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
		}

		next.ServeHTTP(w, r)
	})
}

// Rate Limiting Middleware
func RateLimitMiddleware(requestsPerMinute int) func(http.Handler) http.Handler {
	// This is a simple in-memory rate limiter
	// In production, use Redis or other distributed cache
	clients := make(map[string]*client)

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ip := r.RemoteAddr

			// Simple rate limiting logic
			if c, exists := clients[ip]; exists {
				if time.Since(c.lastRequest) < time.Minute {
					c.requests++
					if c.requests > requestsPerMinute {
						logger.WithFields(logrus.Fields{
							"ip":       ip,
							"requests": c.requests,
							"limit":    requestsPerMinute,
						}).Warn("Rate limit exceeded")

						http.Error(w, "Rate limit exceeded", http.StatusTooManyRequests)
						return
					}
				} else {
					c.requests = 1
					c.lastRequest = time.Now()
				}
			} else {
				clients[ip] = &client{
					requests:    1,
					lastRequest: time.Now(),
				}
			}

			next.ServeHTTP(w, r)
		})
	}
}

type client struct {
	requests    int
	lastRequest time.Time
}

// Recovery Middleware
func RecoveryMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if err := recover(); err != nil {
				requestID := r.Context().Value(RequestIDKey)

				logger.WithFields(logrus.Fields{
					"request_id": requestID,
					"method":     r.Method,
					"path":       r.URL.Path,
					"panic":      err,
				}).Error("Panic recovered")

				// Record panic metric
				metrics.RecordPanic(r.Method, r.URL.Path)

				http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			}
		}()

		next.ServeHTTP(w, r)
	})
}

// Timeout Middleware
func TimeoutMiddleware(timeout time.Duration) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ctx, cancel := context.WithTimeout(r.Context(), timeout)
			defer cancel()

			r = r.WithContext(ctx)
			next.ServeHTTP(w, r)
		})
	}
}

// API Version Middleware
func APIVersionMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Get version from URL path
		vars := mux.Vars(r)
		version := vars["version"]

		if version == "" {
			version = "v1" // default version
		}

		// Add version to context
		ctx := context.WithValue(r.Context(), "api_version", version)
		r = r.WithContext(ctx)

		// Add version to response header
		w.Header().Set("API-Version", version)

		// Log API version usage
		logger.WithFields(logrus.Fields{
			"api_version": version,
			"path":        r.URL.Path,
			"method":      r.Method,
		}).Debug("API version used")

		next.ServeHTTP(w, r)
	})
}

// Content Type Validation Middleware
func ContentTypeMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == "POST" || r.Method == "PUT" || r.Method == "PATCH" {
			contentType := r.Header.Get("Content-Type")
			if contentType != "" && contentType != "application/json" {
				logger.WithFields(logrus.Fields{
					"content_type": contentType,
					"method":       r.Method,
					"path":         r.URL.Path,
				}).Warn("Invalid content type")

				http.Error(w, "Content-Type must be application/json", http.StatusUnsupportedMediaType)
				return
			}
		}

		next.ServeHTTP(w, r)
	})
}

// Helper function to get request ID from context
func GetRequestID(ctx context.Context) string {
	if requestID, ok := ctx.Value(RequestIDKey).(string); ok {
		return requestID
	}
	return ""
}

// Helper function to get start time from context
func GetStartTime(ctx context.Context) time.Time {
	if startTime, ok := ctx.Value(StartTimeKey).(time.Time); ok {
		return startTime
	}
	return time.Now()
}
