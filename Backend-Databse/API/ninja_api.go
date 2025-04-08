package api

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
)

// stock struct to be displayed
type Stock struct {
	Ticker   string  `json:"ticker"`
	Name     string  `json:"name"`
	Price    float64 `json:"price"`
	Exchange string  `json:"exchange"`
	Updated  string  `json:"-"`
	Currency string  `json:"-"`
}

// Gets stock price
func get_StockPrice(symbol string) Stock {

	var stock Stock

	api_key := "X3/9bQCfoeiu5Z5uZ6GGMw==w2uDgfJZF0mRL48d"
	apiURL := fmt.Sprintf("https://api.api-ninjas.com/v1/stockprice?ticker=%s", symbol)

	req, err := http.NewRequest("GET", apiURL, nil)

	if err != nil {
		log.Fatalln("There was error with the request")
	}

	req.Header.Set("X-Api-Key", api_key)

	//create a client and send request
	client := &http.Client{}

	response, err := client.Do(req)

	if err != nil {
		log.Fatalln("there is an error with the client Do method")
	}

	defer response.Body.Close() // Ensure response body is closed

	// Read response body
	body, err := io.ReadAll(response.Body)
	if err != nil {
		log.Fatalln("Error reading response:", err)
	}

	// Print response based on status code
	if response.StatusCode != http.StatusOK {
		fmt.Println(string(body))
	}

	json.Unmarshal(body, &stock)

	return stock
}

// that will then be sent to the front end
func allTickers() []string {

	return []string{
		"AAPL", "MSFT", "AMZN", "GOOGL", "GOOG", "BRK.B", "TSLA", "META", "NVDA", "V",
		"JNJ", "WMT", "JPM", "PG", "UNH", "HD", "MA", "XOM", "BAC", "PFE",
		"KO", "DIS", "PEP", "CSCO", "NFLX", "MRK", "ABT", "VZ", "INTC", "CVX",
		"ADBE", "T", "NKE", "MCD", "IBM", "PYPL", "CRM", "ORCL", "CMCSA", "COST",
		"MDT", "TXN", "ACN", "LLY", "DHR", "HON", "UPS", "LIN", "BMY", "SBUX",
	}
}

func DisplayTickers() []Stock {

	tickers := allTickers()

	var display []Stock

	for i := 0; i < 15; i++ {
		stock := get_StockPrice(tickers[i])

		// Only add valid stocks
		if stock.Price > 0 {
			display = append(display, stock)
		} else {
			log.Printf("Skipping %s due to invalid price.", tickers[i])
		}
	}

	return display
}
