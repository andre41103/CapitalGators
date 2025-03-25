package api

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"

	db "github.com/CapitalGators/DB"
	pass "github.com/CapitalGators/Hash"
	scrape "github.com/CapitalGators/WebScrape"
)

// this is our POST
func post(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK) //200 OK

	var user db.User
	_ = json.NewDecoder(r.Body).Decode(&user)

	newUser, err := db.InsertUser(user)

	if err != nil {
		log.Fatal("An error ocurred in post function when decoding request body")
	}

	err = json.NewEncoder(w).Encode(newUser)
	if err != nil {
		log.Fatal("An error occurred in post function when encoding the struct")
	}
}

// this is our GET
func read(w http.ResponseWriter, r *http.Request) {

	//set header type
	w.Header().Set("Content-Type", "application/json")

	//get params from mux route handling
	params := mux.Vars(r)

	user, err := db.GetOneUser(params["email"])

	if err != nil {
		log.Fatal("An error occurred in READ function, can not get user")
		return
	}

	json.NewEncoder(w).Encode(user)

}

// for login route
func login(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var credentials db.User
	err := json.NewDecoder(r.Body).Decode(&credentials)
	if err != nil {
		http.Error(w, `{"error": "Invalid request payload"}`, http.StatusBadRequest)
		return
	}

	user, err := db.GetOneUser(credentials.Email)
	if err != nil {
		http.Error(w, `{"error": "User not found"}`, http.StatusUnauthorized)
		return
	}

	//compares hashes
	if !pass.CheckPassword(user.Password, credentials.Password) {
		http.Error(w, `{"error": "Invalid email or password"}`, http.StatusUnauthorized)
		return
	}

	json.NewEncoder(w).Encode(user)
}

// for create_account route
func createAccount(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var newUser db.User
	err := json.NewDecoder(r.Body).Decode(&newUser)
	if err != nil {
		http.Error(w, `{"error": "Invalid request payload"}`, http.StatusBadRequest)
		return
	}

	//hash password
	hashPass, err := pass.HashPassword(newUser.Password)

	if err != nil {
		fmt.Println("Could not hash user password. ", err)
		return
	}

	newUser.Password = hashPass //set to new hash

	user, err := db.InsertUser(newUser)
	if err != nil {
		http.Error(w, `{"error": "User not found"}`, http.StatusUnauthorized)
		return
	}

	// if newUser.Email == user.Email {
	// 	http.Error(w, `{"error": "Email is already in system. Use another email"}`, http.StatusUnauthorized)
	// 	return
	// }

	json.NewEncoder(w).Encode(user)
}

// update Profile
func updateProfile(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")

	var user db.User

	err := json.NewDecoder(r.Body).Decode(&user)

	if err != nil {
		http.Error(w, `{"error": "Invalid request payload"}`, http.StatusBadRequest)
		return
	}

	//let's check this
	params := mux.Vars(r)
	userEmail := params["email"]
	err = db.UpdateProfile(userEmail, user)

	//rewrite error if statement
	if err != nil {
		http.Error(w, `{"error": "error updating user"}`, http.StatusUnauthorized)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"message": "User successfully updated"})
}

// upload receipt worked
func uploadReceiptManual(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")

	var receipt db.ReceiptData

	err := json.NewDecoder(r.Body).Decode(&receipt)

	if err != nil {
		http.Error(w, `{"error": "Invalid request payload"}`, http.StatusBadRequest)
		return
	}

	//get the email from user
	params := mux.Vars(r)
	userEmail := params["email"]
	err = db.InsertReceipt(userEmail, receipt)

	//rewrite error if statement
	if err != nil {
		http.Error(w, `{"error": "error uploading receipt"}`, http.StatusUnauthorized)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"message": "User receipt successfully uploaded"})
}

// get the information from the webscrape -> Credit Cards
func retrieveCreditCards(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json ")
	card := scrape.RequestPage()

	err := json.NewEncoder(w).Encode(card)

	//content could not be displayed
	if err != nil {
		http.Error(w, `{"error": "error retreiving credit cards"}`, http.StatusNoContent)
	}

}

func RunServer() http.Handler {

	//new rouuter
	router := mux.NewRouter()

	router.HandleFunc("/login", login).Methods("POST")
	router.HandleFunc("/create_account", createAccount).Methods("POST")
	router.HandleFunc("/profile/{email}", read).Methods("GET")
	router.HandleFunc("/profile/{email}", updateProfile).Methods("PUT")
	router.HandleFunc("/resources", retrieveCreditCards).Methods("GET")
	router.HandleFunc("/receipts", uploadReceiptManual).Methods("POST")

	corsHandler := handlers.CORS(
		handlers.AllowedOrigins([]string{"*"}),
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE"}),
		handlers.AllowedHeaders([]string{"Content-Type", "Authorization"}),
	)

	return corsHandler(router)
}
