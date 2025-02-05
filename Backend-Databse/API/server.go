package api

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

type Creds struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

// temp slice to test HTTP REQUESTS
var userData = make([]Creds, 0)

// this is our POST
func post(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK) //200 OK
	var user Creds

	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		log.Fatal("An error ocurred in post function when decoding request body")
	}

	userData = append(userData, user)

	err = json.NewEncoder(w).Encode(&user)
	if err != nil {
		log.Fatal("An error occurred in post function when encoding the struct")
	}
}

// this is our GET
func read(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")
	name := mux.Vars(r)["username"]

	for _, structs := range userData {
		if structs.Username == name {
			err := json.NewEncoder(w).Encode(&structs)
			if err != nil {
				log.Fatal("There was an error in read function")
			}
		}
	}

}
func RunServer() {

	//new rouuter
	router := mux.NewRouter()

	router.HandleFunc("/login", read).Methods("GET")
	router.HandleFunc("/login", post).Methods("POST")

	err := http.ListenAndServe(":3000", router)
	if err != nil {
		log.Fatal("error occurred when starting the server :(, ", err)
	}

}
