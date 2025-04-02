package db

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

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
	Username     string        `json:"username" bson:"username"`
	Password     string        `json:"password" bson:"password"`
	Email        string        `json:"email" bson:"email"`
	Monthincome  int           `json:"monthlyIncome" bson:"monthlyIncome"`
	Spendinggoal int           `json:"spendingGoal" bson:"spendingGoal"`
	Categories   []string      `json:"selectedCategories" bson:"selectedCategories"`
	Newstopics   []string      `json:"selectedTopics" bson:"selectedTopics"`
	UserReceipt  []ReceiptData `json:"userReceipt,omitempty" bson:"userReceipt,omitempty"` //this can be omitted when user originally created account
}

// nested Receipt for user
type ReceiptData struct {
	MerchantName string  `json:"merchant_name" bson:"merchant_name"`
	ReceiptType  string  `json:"receipt_type" bson:"receipt_type"`
	Total        float64 `json:"total" bson:"total"`
	Date         string  `json:"date" bson:"date"`
	Notes        string  `json:"notes,omitempty" bson:"notes,omitempty"`
	Recurring    bool    `json:"recurring" bson:"recurring"`
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
		fmt.Println("Could not find the document title")
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

// post info in DB
func InsertUser(user User) (*User, error) {

	coll := mongoClient.Database(db).Collection(collName)
	inserted, err := coll.InsertOne(context.TODO(), user)

	if err != nil {
		panic("err")
	}

	fmt.Println("Inserted with id: ", inserted.InsertedID)
	return &user, nil
}

func InsertReceipt(email string, receipt ReceiptData) error {

	coll := mongoClient.Database(db).Collection(collName)
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	identifier := bson.M{"email": email}

	update := bson.M{
		"$push": bson.M{"userReceipt": receipt},
	}

	result, err := coll.UpdateOne(ctx, identifier, update)

	if err != nil {
		return fmt.Errorf("error updating receipt data for user %v", err)
	}

	if result.MatchedCount == 0 {
		return fmt.Errorf("no user to update (invalid email) %v", err)
	}

	return nil
}

// update user profile
func UpdateProfile(email string, updateUser User) error {

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	//get the collection -> makeCents
	coll := getCollection()

	//an identifier
	identifier := bson.M{"email": email}

	update := bson.M{
		"$set": bson.M{
			"username":           updateUser.Username,
			"monthlyIncome":      updateUser.Monthincome,
			"spendingGoal":       updateUser.Spendinggoal,
			"selectedCategories": updateUser.Categories,
			"selectedTopics":     updateUser.Newstopics,
		},
	}

	result, err := coll.UpdateOne(ctx, identifier, update)

	if err != nil {
		return fmt.Errorf("error updating user %v", err)
	}

	//There is no user in DB to update
	if result.MatchedCount == 0 {
		return fmt.Errorf("no user to update (invalid email) %v", err)
	}

	return nil
}
