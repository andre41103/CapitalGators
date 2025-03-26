package chatbot

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
)

type UserInput struct {
	UserInput string `json:"userinput"`
}

type ChatMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type ChatRequest struct {
	Model     string        `json:"model"`
	Messages  []ChatMessage `json:"messages"`
	MaxTokens int           `json:"max_tokens"`
}

type APIResponse struct {
	Choices []struct {
		Message struct {
			Content string `json:"content"`
		} `json:"message"`
	} `json:"choices"`
}

// query the bot
func Query(input string) (string, error) {

	apiKey := "sk-eDmUtG3PoIUDnu5L8ewggA"
	apiURL := "https://api.ai.it.ufl.edu/v1/chat/completions"

	// Create the request payload
	payload := ChatRequest{
		Model: "llama-3.1-70b-instruct",
		Messages: []ChatMessage{
			{Role: "system", Content: "You are a financial assistant."},
			{Role: "user", Content: input},
		},
		MaxTokens: 150,
	}

	payloadBytes, err := json.Marshal(payload)

	if err != nil {
		return "", err
	}

	//create the request
	req, err := http.NewRequest("POST", apiURL, bytes.NewBuffer((payloadBytes)))

	if err != nil {
		return "", err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+apiKey)
	client := &http.Client{}

	resp, err := client.Do(req) //actually sent

	if err != nil {
		return "", err
	}

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("The API could not be downloaded")
	}

	var apiResp APIResponse

	err = json.NewDecoder(resp.Body).Decode(&apiResp)

	if err != nil {
		return "", err
	}

	return apiResp.Choices[0].Message.Content, nil

}
