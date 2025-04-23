package main

//has to syntactically appease go.mod
import (
	//api "github.com/CapitalGators/API"

	"fmt"
	"log"
	"net/http"
	"os"

	handle "github.com/CapitalGators/Backend-Databse/API"
	db "github.com/CapitalGators/Backend-Databse/DB"
	scrape "github.com/CapitalGators/Backend-Databse/WebScrape"
)

func main() {

	//print the output.txt
	scrape.RequestPage()
	//run database and server
	db.Setup()
	defer db.Disconnect()

	router := handle.RunServer()

	// Get port from environment variable (Render provides this)
	port := os.Getenv("PORT")
	if port == "" {
		port = "10000" // fallback for local development
	}

	err := http.ListenAndServe(fmt.Sprintf(":%s", port), router)
	if err != nil {
		log.Fatal("error occurred when starting the server :(, ", err)
	}
}
