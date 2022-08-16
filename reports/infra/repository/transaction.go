package repository

import (
	"encoding/json"
	"github/joaotavioos/reports-microservice/dto"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/elastic/go-elasticsearch/v8"
)

type TransactionElasticRepository struct {
	Client elasticsearch.Client
}

func (t TransactionElasticRepository) Search(reportID string, accountID string, initDate string, endDate string) (dto.SearchResult, error) {
	//	layout := "2006-01-02"

	initDateTimeStamp, err := time.Parse(time.RFC3339, initDate)

	if err != nil {
		return dto.SearchResult{}, err
	}

	endDateTimeStamp, err := time.Parse(time.RFC3339, endDate)

	if err != nil {
		return dto.SearchResult{}, err
	}

	data := `
	{"query": {
		"bool": {
			"must": [
				{
               "match": {
				"account_id": "` + accountID + `"
			   }
			}
			],
			"filter": [
				{
					"range": {
						"payment_date": {
							"gte": ` + strconv.FormatInt(initDateTimeStamp.Unix()*1000, 10) + `,
							"lte": ` + strconv.FormatInt(endDateTimeStamp.Unix()*1000, 10) + `
						}
					}
				}
			]
		}
	}
}
	`

	response, err := t.Client.Search(
		t.Client.Search.WithIndex(os.Getenv("ElasticIndex")),
		t.Client.Search.WithBody(strings.NewReader(data)),
		t.Client.Search.WithTrackTotalHits(true),
	)

	if err != nil {
		return dto.SearchResult{}, err
	}

	defer response.Body.Close()

	searchResponse := dto.SearchResult{}
	err = json.NewDecoder(response.Body).Decode(&searchResponse)

	if err != nil {
		return dto.SearchResult{}, err
	}

	searchResponse.ReportID = reportID
	searchResponse.AccountID = accountID
	searchResponse.InitDate = initDate
	searchResponse.EndDate = endDate

	return searchResponse, nil

}
