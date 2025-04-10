package main

//has to syntactically appease go.mod
import (
	//api "github.com/CapitalGators/API"

	"log"
	"net/http"

	handle "github.com/CapitalGators/API"
	db "github.com/CapitalGators/DB"
	scrape "github.com/CapitalGators/WebScrape"
)

func main() {

	//print the output.txt
	scrape.RequestPage()
	//run database and server
	db.Setup()
	defer db.Disconnect()

	router := handle.RunServer()
	err := http.ListenAndServe(":8080", router)
	if err != nil {
		log.Fatal("error occurred when starting the server :(, ", err)
	}
}
