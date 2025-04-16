package WebScrape

import (
	"encoding/json"
	"fmt"
	"os"

	colly "github.com/gocolly/colly/v2"
)

type CreditCard struct {
	AssetPrefix           string `json:"assetPrefix"`
	BuildID               string `json:"buildId"`
	Gssp                  bool   `json:"gssp"`
	IsExperimentalCompile bool   `json:"isExperimentalCompile"`
	IsFallback            bool   `json:"isFallback"`
	Page                  string `json:"page"`
	Props                 struct {
		NSSP      bool `json:"__N_SSP"`
		PageProps struct {
			FeatureFlags []struct {
				Key   string `json:"key"`
				Value bool   `json:"value"`
			} `json:"featureFlags"`
			PageData struct {
				CategoryPage struct {
					Collection struct {
						Cards []struct {
							Name string `json:"name"`

							Relationships struct {
								Issuer struct {
									Name string `json:"name"`
								} `json:"issuer"`
							} `json:"relationships"`

							Attributes struct {
								IntroBonuses []struct {
									Description string `json:"description"`
								} `json:"introBonuses"`

								RewardRates []struct {
									Explanation string `json:"explanation"`
								} `json:"rewardRates"`
							} `json:"attributes"`

							Variations []struct {
								WhyLikeThis string `json:"whyLikeThis"`
							} `json:"variations"`
						} `json:"cards"`
					} `json:"collection"`
				} `json:"category-page"`
			} `json:"pageData"`
		} `json:"pageProps"`
	} `json:"props"`
}

func RequestPage() CreditCard {

	var card CreditCard

	//get Working directory:
	dir, err := os.Getwd()

	if err != nil {
		fmt.Errorf("There is an err in getting the directory, ", err)
	}

	filePath := dir + "/output.txt"

	fmt.Println(filePath)

	coll := colly.NewCollector()

	//func to get the Data in the HTML and convert to json
	coll.OnHTML("script#__NEXT_DATA__", func(e *colly.HTMLElement) {

		rawData := e.Text
		fmt.Printf("This is the datatype of rawData %T ", rawData)
		//fmt.Println("This is the rawData: ", rawData)

		//convert to Json
		//var JsonData map[string]interface{}

		err := json.Unmarshal([]byte(rawData), &card)

		if err != nil {

			fmt.Println("Error has occcured in parsing")

		}

		//output gives slice of bytes
		formattedJson, _ := json.MarshalIndent(card, "", " ")

		//create a write to file
		err = os.WriteFile(filePath, formattedJson, 0644)

		if err != nil {
			fmt.Errorf("There is an error in writing, ", err)
		}

		fmt.Println("File is written")

		//iterate over jsondata, see what's there
	})

	//visit the credit card page
	err = coll.Visit("https://www.bankrate.com/credit-cards/best-credit-cards/")

	if err != nil {
		fmt.Println("Could not visit")
	}

	return card
}
