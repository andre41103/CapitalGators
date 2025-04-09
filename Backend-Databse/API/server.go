package api

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"

	chat "github.com/CapitalGators/Chatbot"
	db "github.com/CapitalGators/DB"
	pass "github.com/CapitalGators/Hash"
	scrape "github.com/CapitalGators/WebScrape"
)

func changeDirectory(parent, child string) string {
	//change the file path to inside the ML Scripts folder.
	newPath := filepath.Join(parent, child)

	err := os.Chdir(newPath)

	if err != nil {
		fmt.Println("Error changing directory: ", err)
		return ""
	}

	dir, _ := os.Getwd()

	return dir
}

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
func readEmail(w http.ResponseWriter, r *http.Request) {

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

// gets the receipts
func getReceipts(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")

	params := mux.Vars(r)
	email := params["email"]

	user, err := db.GetOneUser(email)

	if err != nil {
		http.Error(w, `{"error":"User not found"}`, http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(user.UserReceipt)
}

// get the ticker display
func getTickers(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "applicatio/json")

	stock := DisplayTickers()

	json.NewEncoder(w).Encode(stock)
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

	json.NewEncoder(w).Encode(user)
}

// update Profile
func updateProfile(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")

	var user db.User

	err := json.NewDecoder(r.Body).Decode(&user)

	if err != nil {
		http.Error(w, `{"error": "Invalid request payload"}`, http.StatusBadRequest)
		fmt.Println("Error inn backend: ", err)
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

// utilize chatbot functionality
func chatBot(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")

	var userinput chat.UserInput

	err := json.NewDecoder(r.Body).Decode(&userinput)

	if err != nil {
		http.Error(w, `{"error": "Invalid request payload"}`, http.StatusBadRequest)
		return
	}

	resp, err := chat.Query(userinput.UserInput)

	if err != nil {
		fmt.Println(err)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"response": resp})
}

// upload receipt worked
func uploadReceipt(w http.ResponseWriter, r *http.Request) {

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

// The function will get a receipt image and convert to json obj -> This needs to be tested
func convertReceipt(w http.ResponseWriter, r *http.Request) {

	dir := changeDirectory("..", "ML Scripts")
	fmt.Println(dir)
	w.Header().Set("Content-Type", "application/json")

	//get the file from http Request
	file, _, err := r.FormFile("image")

	if err != nil {
		http.Error(w, "Failed to read image", http.StatusBadRequest)
		//fmt.Println(header.Filename)
		return
	}

	defer file.Close()

	//Save the image
	imagePath := "uploaded_receipt.jpg"

	output, err := os.Create(imagePath)
	if err != nil {
		http.Error(w, "Failed to save the image", http.StatusBadRequest)
		return
	}
	defer output.Close()
	io.Copy(output, file)

	//execute script
	scriptPath := dir + "/receipt_converter.py"
	cmd := exec.Command("python3", scriptPath, imagePath)
	fmt.Println(scriptPath)
	out, err := cmd.CombinedOutput()

	if err != nil {
		http.Error(w, "Cannot run analysis", http.StatusBadRequest)
		fmt.Println(string(out))
		return
	}

	//store the json obj
	var receipt db.ReceiptData

	err = json.Unmarshal(out, &receipt)

	if err != nil {
		http.Error(w, "cannot unmarshall the image file", http.StatusBadRequest)
		return
	}

	dir = changeDirectory("..", "Backend-Databse")
	fmt.Println(dir)

	json.NewEncoder(w).Encode(receipt)

}

func getBudgetInfo(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	params := mux.Vars(r)
	email := params["email"]

	user, err := db.GetOneUser(email)
	if err != nil {
		http.Error(w, `{"error":"User not found"}`, http.StatusNotFound)
		return
	}

	// Selectively send only budget info and receipts
	response := map[string]interface{}{
		"monthlyIncome": user.Monthincome,
		"spendingGoal":  user.Spendinggoal,
		"userReceipt":   user.UserReceipt,
	}

	json.NewEncoder(w).Encode(response)
}

func RunServer() http.Handler {

	//new rouuter
	router := mux.NewRouter()

	router.HandleFunc("/login", login).Methods("POST")
	router.HandleFunc("/create_account", createAccount).Methods("POST")
	router.HandleFunc("/profile/{email}", readEmail).Methods("GET")
	router.HandleFunc("/profile/{email}", updateProfile).Methods("PUT")
	router.HandleFunc("/resources", retrieveCreditCards).Methods("GET")
	router.HandleFunc("/receipts/{email}", uploadReceipt).Methods("POST")
	router.HandleFunc("/reports/{email}", getReceipts).Methods("GET")
	router.HandleFunc("/receipts/{email}", convertReceipt).Methods("PUT")
	router.HandleFunc("/chatbot", chatBot).Methods("POST")
	router.HandleFunc("/dashboard", getTickers).Methods("GET")
	router.HandleFunc("/budget/{email}", getBudgetInfo).Methods("GET")

	corsHandler := handlers.CORS(
		handlers.AllowedOrigins([]string{"*"}),
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE"}),
		handlers.AllowedHeaders([]string{"Content-Type", "Authorization"}),
	)

	return corsHandler(router)
}
