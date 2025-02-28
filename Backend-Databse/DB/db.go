package db

import (
	"context"
	"fmt"
	"log"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const db = "MakeCents"
const collName = "Users"

var mongoClient *mongo.Client

func Setup() {
	// Use the SetServerAPIOptions() method to set the version of the Stable API on the client
	serverAPI := options.ServerAPI(options.ServerAPIVersion1)
	opts := options.Client().ApplyURI("mongodb+srv://Santiago:Password123@makecents.pvd4n.mongodb.net/?retryWrites=true&w=majority&appName=makeCents").SetServerAPIOptions(serverAPI)

	// Create a new client and connect to the server
	client, err := mongo.Connect(context.TODO(), opts)
	if err != nil {
		panic(err)
	}

	mongoClient = client

	// Send a ping to confirm a successful connection
	if err := client.Database("admin").RunCommand(context.TODO(), bson.D{{Key: "ping", Value: 1}}).Err(); err != nil {
		panic(err)
	}
	fmt.Println("Pinged your deployment. You successfully connected to MongoDB!")

}

func Disconnect() {
	if err := mongoClient.Disconnect(context.TODO()); err != nil {
		panic(err)
	}

	fmt.Println("Connection had been closed")
}

func GetClient() *mongo.Client {

	if mongoClient == nil {
		log.Fatalln("Failure in Setup, cannot get new client")
	}
	return mongoClient
}
