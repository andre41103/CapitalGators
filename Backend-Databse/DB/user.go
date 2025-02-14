package db

import "go.mongodb.org/mongo-driver/bson/primitive"

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

/*func insertUser(user User) error {
	coll
	return nil
}
*/
