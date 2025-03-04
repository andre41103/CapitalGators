package db

import (
	"context"
	"encoding/json"
	"fmt"

	"go.mongodb.org/mongo-driver/bson"
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
	Username     string   `json:"username"`
	Password     string   `json:"password"`
	Email        string   `json:"email"`
	Monthincome  int      `json:"monthlyIncome"`
	Spendinggoal int      `json:"spendingGoal"`
	Categories   []string `json:"selectedCategories"`
	Newstopics   []string `json:"selectedTopics"`
}

func getCollection() *mongo.Collection {

	client := GetClient()
	return client.Database(db).Collection(collName)
}

// Gets infor of One user: accepts a string, outputs a string (field info) and error (if there is one present)
func GetOneUser(email string) (*User, error) {

	//lets get the collection Users
	coll := getCollection()

	var user User

	err := coll.FindOne(context.TODO(), bson.D{{Key: "email", Value: email}}).Decode(&user)

	if err == mongo.ErrNoDocuments {
		fmt.Println("Could not find the document titled \" santiagobarrios \"")
		return nil, err
	}

	//client disconnects
	if err != nil {

		fmt.Println("The error is here")
		panic(err)
	}

	jsonData, err := json.MarshalIndent(user, "", "  ")

	if err != nil {
		panic(err)
	}

	fmt.Printf("%s\n", jsonData)

	return &user, nil
}

func InsertUser(user User) (*User, error) {

	coll := mongoClient.Database(db).Collection(collName)
	inserted, err := coll.InsertOne(context.TODO(), user)

	if err != nil {
		panic("err")
	}

	fmt.Println("Inserted with id: ", inserted.InsertedID)
	return &user, nil
}
