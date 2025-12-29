package storage

import (
	"fmt"
	"io"
	"time"
)

// Storage defines the interface for file storage operations
type Storage interface {
	UploadFile(key string, file io.Reader, contentType string, fileSize int64) error
	UploadFileFromBytes(key string, data []byte, contentType string) error
	GetPresignedURL(key string, expiration time.Duration) (string, error)
	DeleteFile(key string) error
	FileExists(key string) (bool, error)
}

// GenerateKey generates a unique key for a file
func GenerateKey(userID, resourceID, fileName string) string {
	return fmt.Sprintf("resources/%s/%s/%s", userID, resourceID, fileName)
}
