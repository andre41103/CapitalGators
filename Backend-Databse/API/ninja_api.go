package api

import (
	"fmt"
	"io"
	"math/rand"
	"net/http"
	"time"
)

// Gets five random stock prices from a fortune 50 company from that day
func get_StockPrice(symbol string) string {

	api_key := "X3/9bQCfoeiu5Z5uZ6GGMw==w2uDgfJZF0mRL48d"
	apiURL := fmt.Sprintf("https://api.api-ninjas.com/v1/stockprice?ticker=%s", symbol)

	req, err := http.NewRequest("GET", apiURL, nil)

	if err != nil {

		fmt.Println("There was error with the request")
		return ""
	}

	req.Header.Set("X-Api-Key", api_key)

	//create a client and send request
	client := &http.Client{}

	response, err := client.Do(req)

	if err != nil {
		fmt.Println("there is an error with the client Do method")
		return ""
	}

	defer response.Body.Close() // Ensure response body is closed

	// Read response body
	body, err := io.ReadAll(response.Body)
	if err != nil {
		fmt.Println("Error reading response:", err)
		return ""
	}

	fmt.Println("This is the datatype of body")

	// Print response based on status code
	if response.StatusCode != http.StatusOK {
		fmt.Println(string(body))
	}

	return string(body)
}

// there will need to be a function to randomly pick 5 companies
// that will then be sent to the front end
func rotateTickers() []string {

	tickers := []string{
		"AAPL", "MSFT", "AMZN", "GOOGL", "GOOG", "BRK.B", "TSLA", "META", "NVDA", "V",
		"JNJ", "WMT", "JPM", "PG", "UNH", "HD", "MA", "XOM", "BAC", "PFE",
		"KO", "DIS", "PEP", "CSCO", "NFLX", "MRK", "ABT", "VZ", "INTC", "CVX",
		"ADBE", "T", "NKE", "MCD", "IBM", "PYPL", "CRM", "ORCL", "CMCSA", "COST",
		"MDT", "TXN", "ACN", "LLY", "DHR", "HON", "UPS", "LIN", "BMY", "SBUX",
	}

	rand.New(rand.NewSource(time.Now().Unix()))

	rand.Shuffle(len(tickers), func(i, j int) {
		tickers[i], tickers[j] = tickers[j], tickers[i]
	})

	selectedTickers := tickers[:5]

	return selectedTickers
}

// display the five Tickers for display on main page:
func DisplayTickers() []string {

	tickers := rotateTickers()

	var display []string

	for _, v := range tickers {

		tempticker := get_StockPrice(v)
		display = append(display, tempticker)
	}

	return display
}
