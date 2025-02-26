package main

//has to syntactically appease go.mod
import (
	//api "github.com/CapitalGators/API"
	"fmt"

	db "github.com/CapitalGators/DB"
)

func main() {

	//api.RunServer()
	db.Setup()
	resp, err := db.GetOneUser("santiagobarrios")

	if err != nil {
		panic(err)
	}

	fmt.Println(resp)

	db.Disconnect()
}
