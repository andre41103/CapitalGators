package hash

import (
	"fmt"

	"golang.org/x/crypto/bcrypt"
)

// function hashes passwords
func HashPassword(pass string) (string, error) {

	hashed, err := bcrypt.GenerateFromPassword([]byte(pass), bcrypt.DefaultCost)

	if err != nil {

		fmt.Println("Error in hashing password.")
		return " ", err
	}

	return string(hashed), nil
}

// checks Password
func CheckPassword(hashedPass, pass string) bool {

	fmt.Println(pass)
	err := bcrypt.CompareHashAndPassword([]byte(hashedPass), []byte(pass))

	return err == nil
}
