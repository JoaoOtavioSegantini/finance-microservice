package domain

import "github/joaotavioos/reports-microservice/dto"

type TransactionRepository interface {
	Search(reportID string, accountID string, initDate string, endDate string) (dto.SearchResult, error)
}

type Transaction struct {
	ID          string  `json:"id"`
	AccountID   string  `json:"account_id"`
	Category    string  `json:"category"`
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Type        string  `json:"type"`
	Amount      float64 `json:"amount"`
	PaymentDate int64   `json:"payment_date"`
}
