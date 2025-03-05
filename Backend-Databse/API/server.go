package api

import (
	"encoding/json"
	"log"
	"net/http"

	db "github.com/CapitalGators/DB"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
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

	if user.Password != credentials.Password {
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

	user, err := db.InsertUser(newUser)
	if err != nil {
		http.Error(w, `{"error": "User not found"}`, http.StatusUnauthorized)
		return
	}

	if newUser.Email == user.Email {
		http.Error(w, `{"error": "Email is already in system. Use another email"}`, http.StatusUnauthorized)
		return
	}

	json.NewEncoder(w).Encode(user)
}

// still in progress -> need to test
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

func RunServer() http.Handler {

	//new rouuter
	router := mux.NewRouter()

	router.HandleFunc("/login", login).Methods("POST")
	router.HandleFunc("/create_account", createAccount).Methods("POST")
	router.HandleFunc("/profile/{email}", read).Methods("GET")
	router.HandleFunc("/profile/{email}", updateProfile).Methods("PUT")
	//router.HandleFunc("/login", delete).Methods("DELETE")

	corsHandler := handlers.CORS(
		handlers.AllowedOrigins([]string{"*"}),
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE"}),
		handlers.AllowedHeaders([]string{"Content-Type", "Authorization"}),
	)

	return corsHandler(router)
}
