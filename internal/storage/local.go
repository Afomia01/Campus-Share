package storage

import (
	"bytes"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"time"

	"github.com/campus-share/backend/internal/config"
)

// LocalStorage implements storage using the local filesystem
type LocalStorage struct {
	uploadDir string
	baseURL   string
}

// NewLocalStorage creates a new local storage instance
func NewLocalStorage(cfg *config.StorageConfig) (*LocalStorage, error) {
	// Ensure upload directory exists
	if err := os.MkdirAll(cfg.UploadDir, 0755); err != nil {
		return nil, fmt.Errorf("failed to create upload directory: %w", err)
	}

	return &LocalStorage{
		uploadDir: cfg.UploadDir,
		baseURL:   cfg.BaseURL,
	}, nil
}

// UploadFile uploads a file to local storage
func (s *LocalStorage) UploadFile(key string, file io.Reader, contentType string, fileSize int64) error {
	fullPath := filepath.Join(s.uploadDir, key)

	// Create subdirectories
	if err := os.MkdirAll(filepath.Dir(fullPath), 0755); err != nil {
		return fmt.Errorf("failed to create directories: %w", err)
	}

	dst, err := os.Create(fullPath)
	if err != nil {
		return fmt.Errorf("failed to create file: %w", err)
	}
	defer dst.Close()

	if _, err := io.Copy(dst, file); err != nil {
		return fmt.Errorf("failed to save file: %w", err)
	}

	return nil
}

// UploadFileFromBytes uploads a file from bytes to local storage
func (s *LocalStorage) UploadFileFromBytes(key string, data []byte, contentType string) error {
	return s.UploadFile(key, bytes.NewReader(data), contentType, int64(len(data)))
}

// GetPresignedURL returns a URL to access the file
func (s *LocalStorage) GetPresignedURL(key string, expiration time.Duration) (string, error) {
	// For local storage, we return a URL that points to the static file handler
	// Note: This does not implement expiration or access control like S3 presigned URLs
	return fmt.Sprintf("%s/uploads/%s", s.baseURL, key), nil
}

// DeleteFile deletes a file from local storage
func (s *LocalStorage) DeleteFile(key string) error {
	fullPath := filepath.Join(s.uploadDir, key)
	if err := os.Remove(fullPath); err != nil {
		if os.IsNotExist(err) {
			return nil
		}
		return fmt.Errorf("failed to delete file: %w", err)
	}
	return nil
}

// FileExists checks if a file exists in local storage
func (s *LocalStorage) FileExists(key string) (bool, error) {
	fullPath := filepath.Join(s.uploadDir, key)
	_, err := os.Stat(fullPath)
	if err == nil {
		return true, nil
	}
	if os.IsNotExist(err) {
		return false, nil
	}
	return false, err
}
