package main

//has to syntactically appease go.mod
import (
	//api "github.com/CapitalGators/API"
	db "github.com/CapitalGators/DB"
)

func main() {

	//api.RunServer()
	db.Setup()
}
