package api

/*
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

func TestDelete(t *testing.T) {

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
		t.Errorf("GET handler returned wrong status: got %v want %v", status, http.StatusOK)
	}

	var response Creds
	err = json.NewDecoder(responseRec.Body).Decode(&response)

	if err != nil {
		t.Errorf("Error decoding response: %v", err)
	}

	fmt.Println("Everything Passed: ", response.Username, " ", response.Password)

	//setVariables manually to delete
	req = mux.SetURLVars(req, map[string]string{"username": "Santiago"})

	responseRec = httptest.NewRecorder()

	//call delete function
	delete(responseRec, req)

	fmt.Println("This is the status code: ", responseRec.Code)

	//It works!
	if status := responseRec.Code; status == http.StatusOK {
		fmt.Println("The output is as expected and the item has been deleted!")
	}

}

func TestUpdate(t *testing.T) {

	//append payload
	userData = append(userData, Creds{Username: "Santiago", Password: "Password123"})

	// Updated credentials
	updatedCreds := Creds{Username: "Santiago", Password: "newpass"}
	jsonData, _ := json.Marshal(updatedCreds)

	// Create HTTP PUT request
	req, err := http.NewRequest("PUT", "/update", bytes.NewBuffer(jsonData))
	if err != nil {
		t.Fatal(err)
	}
	req.Header.Set("Content-Type", "application/json")

	// Create Response Recorder
	responseRec := httptest.NewRecorder()

	// Call the original update function
	update(responseRec, req)

	// Check if status code is 200 (but function might not always behave correctly)
	if status := responseRec.Code; status != http.StatusOK {
		t.Errorf("Expected status 200, got %d", responseRec.Code)
	}

	// Check if the user was updated (this might fail due to function logic)
	found := false
	for _, u := range userData {
		if u.Username == "Santiago" {
			found = true
			if u.Password != "newpass" {
				t.Errorf("Expected password 'newpass', got '%s'", u.Password)
			}
		}
	}

	// Ensure user still exists in the slice
	if !found {
		t.Errorf("User was removed from userData unexpectedly")
	}
} */
