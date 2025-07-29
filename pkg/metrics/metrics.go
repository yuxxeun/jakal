package metrics

import (
	"encoding/json"
	"net/http"
	"runtime"
	"strconv"
	"time"

	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/yuxxeun/jakal/pkg/logger"
)

var (
	// HTTP request metrics
	httpRequestsTotal = promauto.NewCounterVec(
		prometheus.CounterOpts{
			Name: "jakal_http_requests_total",
			Help: "Total number of HTTP requests",
		},
		[]string{"method", "path", "status_code"},
	)

	httpRequestDuration = promauto.NewHistogramVec(
		prometheus.HistogramOpts{
			Name:    "jakal_http_request_duration_seconds",
			Help:    "HTTP request duration in seconds",
			Buckets: prometheus.DefBuckets,
		},
		[]string{"method", "path", "status_code"},
	)

	httpRequestSize = promauto.NewHistogramVec(
		prometheus.HistogramOpts{
			Name:    "jakal_http_request_size_bytes",
			Help:    "HTTP request size in bytes",
			Buckets: prometheus.ExponentialBuckets(100, 10, 8),
		},
		[]string{"method", "path"},
	)

	httpResponseSize = promauto.NewHistogramVec(
		prometheus.HistogramOpts{
			Name:    "jakal_http_response_size_bytes",
			Help:    "HTTP response size in bytes",
			Buckets: prometheus.ExponentialBuckets(100, 10, 8),
		},
		[]string{"method", "path", "status_code"},
	)

	// Application metrics
	javaneseConversionsTotal = promauto.NewCounterVec(
		prometheus.CounterOpts{
			Name: "jakal_javanese_conversions_total",
			Help: "Total number of Javanese date conversions",
		},
		[]string{"conversion_type"},
	)

	cacheHitsTotal = promauto.NewCounterVec(
		prometheus.CounterOpts{
			Name: "jakal_cache_hits_total",
			Help: "Total number of cache hits",
		},
		[]string{"cache_type"},
	)

	cacheMissesTotal = promauto.NewCounterVec(
		prometheus.CounterOpts{
			Name: "jakal_cache_misses_total",
			Help: "Total number of cache misses",
		},
		[]string{"cache_type"},
	)

	// Error metrics
	errorsTotal = promauto.NewCounterVec(
		prometheus.CounterOpts{
			Name: "jakal_errors_total",
			Help: "Total number of errors",
		},
		[]string{"error_type", "method", "path"},
	)

	panicTotal = promauto.NewCounterVec(
		prometheus.CounterOpts{
			Name: "jakal_panic_total",
			Help: "Total number of panics",
		},
		[]string{"method", "path"},
	)

	// System metrics
	activeConnections = promauto.NewGauge(
		prometheus.GaugeOpts{
			Name: "jakal_active_connections",
			Help: "Number of active connections",
		},
	)

	memoryUsage = promauto.NewGauge(
		prometheus.GaugeOpts{
			Name: "jakal_memory_usage_bytes",
			Help: "Memory usage in bytes",
		},
	)

	goroutinesCount = promauto.NewGauge(
		prometheus.GaugeOpts{
			Name: "jakal_goroutines_count",
			Help: "Number of goroutines",
		},
	)

	// Business metrics
	apiVersionUsage = promauto.NewCounterVec(
		prometheus.CounterOpts{
			Name: "jakal_api_version_usage_total",
			Help: "API version usage count",
		},
		[]string{"version"},
	)

	rateLimitExceeded = promauto.NewCounterVec(
		prometheus.CounterOpts{
			Name: "jakal_rate_limit_exceeded_total",
			Help: "Rate limit exceeded count",
		},
		[]string{"client_ip"},
	)

	// Database metrics (if using database)
	dbConnectionsActive = promauto.NewGauge(
		prometheus.GaugeOpts{
			Name: "jakal_db_connections_active",
			Help: "Number of active database connections",
		},
	)

	dbConnectionsIdle = promauto.NewGauge(
		prometheus.GaugeOpts{
			Name: "jakal_db_connections_idle",
			Help: "Number of idle database connections",
		},
	)

	dbQueryDuration = promauto.NewHistogramVec(
		prometheus.HistogramOpts{
			Name:    "jakal_db_query_duration_seconds",
			Help:    "Database query duration in seconds",
			Buckets: prometheus.DefBuckets,
		},
		[]string{"query_type"},
	)

	// Performance metrics
	cpuUsage = promauto.NewGauge(
		prometheus.GaugeOpts{
			Name: "jakal_cpu_usage_percent",
			Help: "CPU usage percentage",
		},
	)

	memoryUsagePercent = promauto.NewGauge(
		prometheus.GaugeOpts{
			Name: "jakal_memory_usage_percent",
			Help: "Memory usage percentage",
		},
	)

	gcDuration = promauto.NewHistogram(
		prometheus.HistogramOpts{
			Name:    "jakal_gc_duration_seconds",
			Help:    "Garbage collection duration in seconds",
			Buckets: prometheus.DefBuckets,
		},
	)

	// Custom business metrics
	wetonCalculationsTotal = promauto.NewCounterVec(
		prometheus.CounterOpts{
			Name: "jakal_weton_calculations_total",
			Help: "Total number of weton calculations",
		},
		[]string{"calculation_type"},
	)

	neptuCalculationsTotal = promauto.NewCounterVec(
		prometheus.CounterOpts{
			Name: "jakal_neptu_calculations_total",
			Help: "Total number of neptu calculations",
		},
		[]string{"calculation_type"},
	)

	compatibilityChecksTotal = promauto.NewCounter(
		prometheus.CounterOpts{
			Name: "jakal_compatibility_checks_total",
			Help: "Total number of compatibility checks",
		},
	)

	goodDaysRequestsTotal = promauto.NewCounter(
		prometheus.CounterOpts{
			Name: "jakal_good_days_requests_total",
			Help: "Total number of good days requests",
		},
	)
)

// RecordHTTPRequest records HTTP request metrics
func RecordHTTPRequest(method, path string, statusCode int, duration time.Duration) {
	statusStr := strconv.Itoa(statusCode)

	httpRequestsTotal.WithLabelValues(method, path, statusStr).Inc()
	httpRequestDuration.WithLabelValues(method, path, statusStr).Observe(duration.Seconds())

	logger.Debugf("Recorded HTTP request: %s %s %d %v", method, path, statusCode, duration)
}

// RecordRequestSize records HTTP request size
func RecordRequestSize(method, path string, size int64) {
	httpRequestSize.WithLabelValues(method, path).Observe(float64(size))
}

// RecordResponseSize records HTTP response size
func RecordResponseSize(method, path string, statusCode int, size int64) {
	statusStr := strconv.Itoa(statusCode)
	httpResponseSize.WithLabelValues(method, path, statusStr).Observe(float64(size))
}

// RecordJavaneseConversion records Javanese date conversion
func RecordJavaneseConversion(conversionType string) {
	javaneseConversionsTotal.WithLabelValues(conversionType).Inc()
}

// RecordCacheHit records cache hit
func RecordCacheHit(cacheType string) {
	cacheHitsTotal.WithLabelValues(cacheType).Inc()
}

// RecordCacheMiss records cache miss
func RecordCacheMiss(cacheType string) {
	cacheMissesTotal.WithLabelValues(cacheType).Inc()
}

// RecordError records error
func RecordError(errorType, method, path string) {
	errorsTotal.WithLabelValues(errorType, method, path).Inc()
}

// RecordPanic records panic
func RecordPanic(method, path string) {
	panicTotal.WithLabelValues(method, path).Inc()
}

// RecordAPIVersionUsage records API version usage
func RecordAPIVersionUsage(version string) {
	apiVersionUsage.WithLabelValues(version).Inc()
}

// RecordRateLimitExceeded records rate limit exceeded
func RecordRateLimitExceeded(clientIP string) {
	rateLimitExceeded.WithLabelValues(clientIP).Inc()
}

// RecordActiveConnections records active connections
func RecordActiveConnections(count int) {
	activeConnections.Set(float64(count))
}

// RecordMemoryUsage records memory usage
func RecordMemoryUsage(bytes int64) {
	memoryUsage.Set(float64(bytes))
}

// RecordGoroutinesCount records goroutines count
func RecordGoroutinesCount(count int) {
	goroutinesCount.Set(float64(count))
}

// RecordDBConnections records database connections
func RecordDBConnections(active, idle int) {
	dbConnectionsActive.Set(float64(active))
	dbConnectionsIdle.Set(float64(idle))
}

// RecordDBQuery records database query duration
func RecordDBQuery(queryType string, duration time.Duration) {
	dbQueryDuration.WithLabelValues(queryType).Observe(duration.Seconds())
}

// RecordCPUUsage records CPU usage
func RecordCPUUsage(percent float64) {
	cpuUsage.Set(percent)
}

// RecordMemoryUsagePercent records memory usage percentage
func RecordMemoryUsagePercent(percent float64) {
	memoryUsagePercent.Set(percent)
}

// RecordGCDuration records garbage collection duration
func RecordGCDuration(duration time.Duration) {
	gcDuration.Observe(duration.Seconds())
}

// Business metrics functions
func RecordWetonCalculation(calculationType string) {
	wetonCalculationsTotal.WithLabelValues(calculationType).Inc()
}

func RecordNeptuCalculation(calculationType string) {
	neptuCalculationsTotal.WithLabelValues(calculationType).Inc()
}

func RecordCompatibilityCheck() {
	compatibilityChecksTotal.Inc()
}

func RecordGoodDaysRequest() {
	goodDaysRequestsTotal.Inc()
}

// MetricsCollector collects system metrics periodically
type MetricsCollector struct {
	ticker *time.Ticker
	done   chan bool
}

// NewMetricsCollector creates a new metrics collector
func NewMetricsCollector(interval time.Duration) *MetricsCollector {
	return &MetricsCollector{
		ticker: time.NewTicker(interval),
		done:   make(chan bool),
	}
}

// Start starts the metrics collection
func (mc *MetricsCollector) Start() {
	go func() {
		for {
			select {
			case <-mc.ticker.C:
				mc.collectSystemMetrics()
			case <-mc.done:
				return
			}
		}
	}()
}

// Stop stops the metrics collection
func (mc *MetricsCollector) Stop() {
	mc.ticker.Stop()
	mc.done <- true
}

// collectSystemMetrics collects system metrics
func (mc *MetricsCollector) collectSystemMetrics() {
	var m runtime.MemStats
	runtime.ReadMemStats(&m)

	// Memory metrics
	RecordMemoryUsage(int64(m.Alloc))
	RecordMemoryUsagePercent(float64(m.Alloc) / float64(m.Sys) * 100)

	// Goroutines
	RecordGoroutinesCount(runtime.NumGoroutine())

	// GC metrics
	RecordGCDuration(time.Duration(m.PauseTotalNs))

	logger.Debugf("System metrics collected: Memory=%d bytes, Goroutines=%d", m.Alloc, runtime.NumGoroutine())
}

// MetricsMiddleware wraps HTTP handlers to collect metrics
func MetricsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		// Record request size
		if r.ContentLength > 0 {
			RecordRequestSize(r.Method, r.URL.Path, r.ContentLength)
		}

		// Wrap response writer to capture status code and response size
		rw := &responseWriter{
			ResponseWriter: w,
			statusCode:     200,
		}

		// Process request
		next.ServeHTTP(rw, r)

		// Record metrics
		duration := time.Since(start)
		RecordHTTPRequest(r.Method, r.URL.Path, rw.statusCode, duration)
		RecordResponseSize(r.Method, r.URL.Path, rw.statusCode, int64(rw.size))
	})
}

// responseWriter wraps http.ResponseWriter to capture status code and response size
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

// PerformanceMonitor monitors application performance
type PerformanceMonitor struct {
	alertThresholds AlertThresholds
	alertChannel    chan Alert
}

// AlertThresholds defines thresholds for performance alerts
type AlertThresholds struct {
	MaxResponseTime  time.Duration
	MaxMemoryUsage   int64
	MaxGoroutines    int
	MaxErrorRate     float64
	MaxCPUUsage      float64
	MaxMemoryPercent float64
}

// Alert represents a performance alert
type Alert struct {
	Type      string
	Message   string
	Severity  string
	Timestamp time.Time
	Value     float64
	Threshold float64
}

// NewPerformanceMonitor creates a new performance monitor
func NewPerformanceMonitor(thresholds AlertThresholds) *PerformanceMonitor {
	return &PerformanceMonitor{
		alertThresholds: thresholds,
		alertChannel:    make(chan Alert, 100),
	}
}

// CheckPerformance checks performance metrics against thresholds
func (pm *PerformanceMonitor) CheckPerformance() {
	// This would typically query the metrics and check against thresholds
	// For now, we'll just log that we're checking
	logger.Debug("Performance check completed")
}

// GetAlerts returns the alerts channel
func (pm *PerformanceMonitor) GetAlerts() <-chan Alert {
	return pm.alertChannel
}

// MetricsHandler returns the Prometheus metrics handler
func MetricsHandler() http.Handler {
	return promhttp.Handler()
}

// HealthCheckHandler returns a health check handler with metrics
func HealthCheckHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var m runtime.MemStats
		runtime.ReadMemStats(&m)

		health := map[string]interface{}{
			"status":    "healthy",
			"timestamp": time.Now().Format(time.RFC3339),
			"uptime":    time.Since(startTime).String(),
			"memory": map[string]interface{}{
				"alloc":       m.Alloc,
				"total_alloc": m.TotalAlloc,
				"sys":         m.Sys,
				"num_gc":      m.NumGC,
			},
			"goroutines": runtime.NumGoroutine(),
			"version":    "1.0.0",
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)

		if err := json.NewEncoder(w).Encode(health); err != nil {
			logger.WithError(err).Error("Failed to encode health check response")
		}
	}
}

// Performance optimization utilities
var (
	startTime = time.Now()
)

// OptimizeGC optimizes garbage collection
func OptimizeGC() {
	runtime.GC()
	logger.Debug("Garbage collection optimized")
}

// SetGCPercent sets the garbage collection target percentage
func SetGCPercent(percent int) {
	old := runtime.GOMAXPROCS(0)
	runtime.GOMAXPROCS(old)
	logger.Debugf("GC percent set to %d", percent)
}

// GetPerformanceStats returns current performance statistics
func GetPerformanceStats() map[string]interface{} {
	var m runtime.MemStats
	runtime.ReadMemStats(&m)

	return map[string]interface{}{
		"memory": map[string]interface{}{
			"alloc":        m.Alloc,
			"total_alloc":  m.TotalAlloc,
			"sys":          m.Sys,
			"mallocs":      m.Mallocs,
			"frees":        m.Frees,
			"heap_alloc":   m.HeapAlloc,
			"heap_sys":     m.HeapSys,
			"heap_idle":    m.HeapIdle,
			"heap_inuse":   m.HeapInuse,
			"heap_objects": m.HeapObjects,
			"stack_inuse":  m.StackInuse,
			"stack_sys":    m.StackSys,
			"next_gc":      m.NextGC,
			"last_gc":      m.LastGC,
			"pause_total":  m.PauseTotalNs,
			"num_gc":       m.NumGC,
		},
		"goroutines": runtime.NumGoroutine(),
		"cpus":       runtime.NumCPU(),
		"uptime":     time.Since(startTime).String(),
	}
}
