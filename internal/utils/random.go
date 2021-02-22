package utils

import (
	"crypto/rand"
	"encoding/base64"

	"github.com/apex/log"
)

// RandomToken returns a 16 bytes cryptographically secure random token encoded in URL-safe base64 no padding. Panics if
// it fail to generate the token.
func RandomToken() string {
	token := make([]byte, 16)
	_, err := rand.Read(token)
	if err != nil {
		log.Fatal("failed to generate random token")
	}
	return base64.RawURLEncoding.EncodeToString(token)
}
