package cache

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/go-redis/redis/v8"
	"github.com/patrickmn/go-cache"
	"github.com/yuxxeun/jakal/pkg/logger"
	"golang.org/x/net/context"
)

// CacheInterface defines the caching interface
type CacheInterface interface {
	Set(key string, value interface{}, expiration time.Duration) error
	Get(key string, dest interface{}) error
	Delete(key string) error
	Clear() error
	Exists(key string) bool
}

// MemoryCache implements in-memory caching
type MemoryCache struct {
	cache *cache.Cache
}

// RedisCache implements Redis caching
type RedisCache struct {
	client *redis.Client
	ctx    context.Context
}

// NewMemoryCache creates a new in-memory cache
func NewMemoryCache(defaultExpiration, cleanupInterval time.Duration) *MemoryCache {
	return &MemoryCache{
		cache: cache.New(defaultExpiration, cleanupInterval),
	}
}

// NewRedisCache creates a new Redis cache
func NewRedisCache(addr, password string, db int) *RedisCache {
	rdb := redis.NewClient(&redis.Options{
		Addr:     addr,
		Password: password,
		DB:       db,
	})

	return &RedisCache{
		client: rdb,
		ctx:    context.Background(),
	}
}

// Memory Cache Implementation
func (m *MemoryCache) Set(key string, value interface{}, expiration time.Duration) error {
	data, err := json.Marshal(value)
	if err != nil {
		logger.WithError(err).Errorf("Failed to marshal cache value for key: %s", key)
		return err
	}

	m.cache.Set(key, data, expiration)
	logger.Debugf("Set cache key: %s, expiration: %v", key, expiration)
	return nil
}

func (m *MemoryCache) Get(key string, dest interface{}) error {
	data, found := m.cache.Get(key)
	if !found {
		return fmt.Errorf("key not found: %s", key)
	}

	if err := json.Unmarshal(data.([]byte), dest); err != nil {
		logger.WithError(err).Errorf("Failed to unmarshal cache value for key: %s", key)
		return err
	}

	logger.Debugf("Get cache key: %s", key)
	return nil
}

func (m *MemoryCache) Delete(key string) error {
	m.cache.Delete(key)
	logger.Debugf("Delete cache key: %s", key)
	return nil
}

func (m *MemoryCache) Clear() error {
	m.cache.Flush()
	logger.Debug("Clear all cache")
	return nil
}

func (m *MemoryCache) Exists(key string) bool {
	_, found := m.cache.Get(key)
	return found
}

// Redis Cache Implementation
func (r *RedisCache) Set(key string, value interface{}, expiration time.Duration) error {
	data, err := json.Marshal(value)
	if err != nil {
		logger.WithError(err).Errorf("Failed to marshal cache value for key: %s", key)
		return err
	}

	err = r.client.Set(r.ctx, key, data, expiration).Err()
	if err != nil {
		logger.WithError(err).Errorf("Failed to set Redis cache for key: %s", key)
		return err
	}

	logger.Debugf("Set Redis cache key: %s, expiration: %v", key, expiration)
	return nil
}

func (r *RedisCache) Get(key string, dest interface{}) error {
	data, err := r.client.Get(r.ctx, key).Result()
	if err != nil {
		if err == redis.Nil {
			return fmt.Errorf("key not found: %s", key)
		}
		logger.WithError(err).Errorf("Failed to get Redis cache for key: %s", key)
		return err
	}

	if err := json.Unmarshal([]byte(data), dest); err != nil {
		logger.WithError(err).Errorf("Failed to unmarshal cache value for key: %s", key)
		return err
	}

	logger.Debugf("Get Redis cache key: %s", key)
	return nil
}

func (r *RedisCache) Delete(key string) error {
	err := r.client.Del(r.ctx, key).Err()
	if err != nil {
		logger.WithError(err).Errorf("Failed to delete Redis cache for key: %s", key)
		return err
	}

	logger.Debugf("Delete Redis cache key: %s", key)
	return nil
}

func (r *RedisCache) Clear() error {
	err := r.client.FlushDB(r.ctx).Err()
	if err != nil {
		logger.WithError(err).Error("Failed to clear Redis cache")
		return err
	}

	logger.Debug("Clear all Redis cache")
	return nil
}

func (r *RedisCache) Exists(key string) bool {
	result, err := r.client.Exists(r.ctx, key).Result()
	if err != nil {
		logger.WithError(err).Errorf("Failed to check Redis cache existence for key: %s", key)
		return false
	}
	return result > 0
}

// Cache Manager
type CacheManager struct {
	cache CacheInterface
}

func NewCacheManager(cache CacheInterface) *CacheManager {
	return &CacheManager{
		cache: cache,
	}
}

// Helper methods for common cache operations
func (cm *CacheManager) GetOrSet(key string, dest interface{}, expiration time.Duration, fetchFunc func() (interface{}, error)) error {
	// Try to get from cache first
	if err := cm.cache.Get(key, dest); err == nil {
		return nil
	}

	// If not found, fetch from source
	data, err := fetchFunc()
	if err != nil {
		return err
	}

	// Set in cache
	if err := cm.cache.Set(key, data, expiration); err != nil {
		logger.WithError(err).Warnf("Failed to set cache for key: %s", key)
	}

	// Marshal the data to dest
	jsonData, err := json.Marshal(data)
	if err != nil {
		return err
	}

	return json.Unmarshal(jsonData, dest)
}

func (cm *CacheManager) InvalidatePattern(pattern string) error {
	// This is a simplified implementation
	// In production, you might want to use Redis SCAN with pattern matching
	logger.Debugf("Invalidating cache pattern: %s", pattern)
	return nil
}

// Cache key generators
func GenerateDateCacheKey(date string) string {
	return fmt.Sprintf("jakal:date:%s", date)
}

func GenerateWetonCacheKey(date string) string {
	return fmt.Sprintf("jakal:weton:%s", date)
}

func GenerateYearCacheKey(year int) string {
	return fmt.Sprintf("jakal:year:%d", year)
}

func GenerateMonthCacheKey(year, month int) string {
	return fmt.Sprintf("jakal:month:%d:%d", year, month)
}

func GenerateRangeCacheKey(start, end string) string {
	return fmt.Sprintf("jakal:range:%s:%s", start, end)
}

func GenerateGoodDaysCacheKey(birthDate string, year int) string {
	return fmt.Sprintf("jakal:gooddays:%s:%d", birthDate, year)
}

// Cache middleware for HTTP responses
func CacheMiddleware(cacheManager *CacheManager, expiration time.Duration) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Only cache GET requests
			if r.Method != "GET" {
				next.ServeHTTP(w, r)
				return
			}

			// Generate cache key from URL
			cacheKey := fmt.Sprintf("response:%s", r.URL.Path)
			if r.URL.RawQuery != "" {
				cacheKey += "?" + r.URL.RawQuery
			}

			// Try to get from cache
			var cachedResponse []byte
			if err := cacheManager.cache.Get(cacheKey, &cachedResponse); err == nil {
				w.Header().Set("Content-Type", "application/json")
				w.Header().Set("X-Cache", "HIT")
				w.WriteHeader(200)
				w.Write(cachedResponse)
				return
			}

			// If not in cache, capture response
			recorder := &responseRecorder{
				ResponseWriter: w,
				statusCode:     200,
				body:           make([]byte, 0),
			}

			next.ServeHTTP(recorder, r)

			// Cache successful responses
			if recorder.statusCode == 200 && len(recorder.body) > 0 {
				cacheManager.cache.Set(cacheKey, recorder.body, expiration)
			}

			// Add cache miss header
			w.Header().Set("X-Cache", "MISS")
		})
	}
}

type responseRecorder struct {
	http.ResponseWriter
	statusCode int
	body       []byte
}

func (r *responseRecorder) WriteHeader(code int) {
	r.statusCode = code
	r.ResponseWriter.WriteHeader(code)
}

func (r *responseRecorder) Write(b []byte) (int, error) {
	r.body = append(r.body, b...)
	return r.ResponseWriter.Write(b)
}
