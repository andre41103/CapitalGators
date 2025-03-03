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

// this is our PUT requests
/*func update(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var updatedUser Creds
	err := json.NewDecoder(r.Body).Decode(&updatedUser)
	if err != nil {
		http.Error(w, "Error decoding request body", http.StatusBadRequest)
		return
	}

	// Find user in slice
	for index, user := range userData {
		if user.Username == updatedUser.Username {
			// Update user
			userData[index] = updatedUser

			// Send response
			w.WriteHeader(http.StatusOK)
			_ = json.NewEncoder(w).Encode(updatedUser)
			return
		}
	}

	// User not found
	http.Error(w, "User not found", http.StatusNotFound)
}

// This is our DELETE function
func delete(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")
	name := mux.Vars(r)["username"]
	count := 0

	for index, str := range userData {
		if str.Username == name {
			count = index
		}
	}

	userData = append(userData[:count], userData[count+1:]...)
}

*/

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


func RunServer() http.Handler {

	//new rouuter
	router := mux.NewRouter()

	router.HandleFunc("/login", login).Methods("POST")
	router.HandleFunc("/create_account", post).Methods("POST")
	//router.HandleFunc("/login", read).Methods("GET")
	//router.HandleFunc("/login", update).Methods("PUT")
	//router.HandleFunc("/login", delete).Methods("DELETE")

	corsHandler := handlers.CORS(
		handlers.AllowedOrigins([]string{"*"}),
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE"}),
		handlers.AllowedHeaders([]string{"Content-Type", "Authorization"}),
	)

	return corsHandler(router)
}
