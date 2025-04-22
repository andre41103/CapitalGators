package main

//has to syntactically appease go.mod
import (
	//api "github.com/CapitalGators/API"

	"log"
	"net/http"

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
	err := http.ListenAndServe(":10000", router)
	if err != nil {
		log.Fatal("error occurred when starting the server :(, ", err)
	}
}
