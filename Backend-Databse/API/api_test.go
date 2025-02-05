package api

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gorilla/mux"
)

func TestPost(t *testing.T) {

	//create payload
	payload := Creds{
		Username: "santiago",
		Password: "Password123",
	}

	//convert to jsonData
	jsonData, err := json.Marshal(payload)

	if err != nil {
		log.Fatal("Could not encode the data properly")
	}

	req, err := http.NewRequest("POST", "/login", bytes.NewBuffer(jsonData))

	if err != nil {
		log.Fatal("An error occurred when creating a POST request")
	}

	req.Header.Set("Content-Type", "application/json")

	responseRec := httptest.NewRecorder()

	//Call Post function
	post(responseRec, req)

	// Check HTTP Status Code
	if status := responseRec.Code; status != http.StatusOK {
		t.Errorf("POST handler returned wrong status: got %v want %v", status, http.StatusOK)
	}

	// Check if response body matches the input
	var response Creds
	err = json.NewDecoder(responseRec.Body).Decode(&response)
	if err != nil {
		t.Errorf("Error decoding response: %v", err)
	}

	if response.Username != payload.Username || response.Password != payload.Password {
		t.Errorf("POST handler returned unexpected body: got %+v, want %+v", response, payload)
	}

	fmt.Println("Everything passed: ", response.Username, " ", response.Password)
}
func TestGet(t *testing.T) {

	userData = append(userData, Creds{Username: "Santiago", Password: "Password123"})

	req, err := http.NewRequest("GET", "/login", nil)

	if err != nil {
		log.Fatal("An error occurred the requesting the GET Method")
	}

	req = mux.SetURLVars(req, map[string]string{"username": "Santiago"})

	responseRec := httptest.NewRecorder()

	//call Handler
	read(responseRec, req)

	// Check HTTP Status Code
	if status := responseRec.Code; status != http.StatusOK {
		t.Errorf("GET handler returned wrong status: got %v want %v", status, http.StatusOK)
	}

	// Check if response body contains the expected user data
	var response Creds
	err = json.NewDecoder(responseRec.Body).Decode(&response)
	if err != nil {
		t.Errorf("Error decoding response: %v", err)
	}

	if response.Username != "Santiago" {
		t.Errorf("GET handler returned wrong username: got %v, want testuser", response.Username)
	}

	fmt.Println("Everything Passed: ", response.Username, " ", response.Password)

}
