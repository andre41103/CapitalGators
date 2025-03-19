package WebScrape

import (
	"encoding/json"
	"fmt"

	colly "github.com/gocolly/colly/v2"
)

func RequestPage() {

	fmt.Println("this is the start")

	coll := colly.NewCollector()

	//func to get the Data in the HTML and convert to json
	coll.OnHTML("script#__NEXT_DATA__", func(e *colly.HTMLElement) {

		rawData := e.Text
		fmt.Printf("This is the datatype of rawData %T ", rawData)
		//fmt.Println("This is the rawData: ", rawData)

		//convert to Json
		var JsonData map[string]interface{}

		err := json.Unmarshal([]byte(rawData), &JsonData)

		if err != nil {

			fmt.Println("Error has occcured in parsing")

		} else {

			for key, value := range JsonData {

				fmt.Println("%s is %d years old\n", key, value)
			}
		}

		//iterate over jsondata, see what's there
	})

	//visit the credit card page
	err := coll.Visit("https://www.bankrate.com/credit-cards/best-credit-cards/")

	if err != nil {
		fmt.Println("Could not visit page")
	}
}
