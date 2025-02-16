package db

import (
	"context"
	"encoding/json"
	"fmt"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

/*

{
  "_id": "60d5f5b9f6e2b12d3c4e20b1",
  "username": "santiagobarrios",
  "password": "hashedpassword123",
  "email": "santiago@example.com",
  "monthly_income": 5000,
  "spending_goal": 2000,
  "categories": ["food", "entertainment"],
  "news": ["technology", "finance"]
}

*/

//These functions should either return a user struct object or should return the specific item in question for the user.

// This file will define/contain the main actions that can be done with the User schema
type User struct {
	ID           primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"` //BSON is for mongoDB, "_" is for serialization
	Username     string             `json:"username"`
	Password     string             `json:"password"`
	Email        string             `json:"email"`
	Monthincome  int                `json:"monthly_income"`
	Spendinggoal int                `json:"spending_goal"`
	Categories   []string           `json:"categories"`
	Newstopics   []string           `json:"news"`
}

func GetOneUser(user User) (string, error) {
	//lets get the collection Users
	coll := mongoClient.Database(db).Collection(collName)
	var result bson.M

	err := coll.FindOne(context.TODO(), bson.D{{"username", user.Username}}).Decode(&result)

	if err == mongo.ErrNoDocuments {
		fmt.Println("Could not find the document titled \" santiagobarrios \"")
		return "An error occurred", err
	}

	if err != nil {
		panic(err)
	}

	jsonData, err := json.MarshalIndent(result, "", "  ")

	if err != nil {
		panic(err)
	}

	fmt.Printf("%s\n", jsonData)

	return "hello", nil
}

func InsertUser(user User) (string, error) {

	coll := mongoClient.Database(db).Collection(collName)
	inserted, err := coll.InsertOne(context.TODO(), user)

	if err != nil {
		panic("err")
	}

	fmt.Println("Inserted with id: ", inserted.InsertedID)
	return "insert", nil
}
