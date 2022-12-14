package usecase

import (
	"encoding/json"
	"github/joaotavioos/reports-microservice/dto"
	"github/joaotavioos/reports-microservice/infra/kafka"
	"github/joaotavioos/reports-microservice/infra/repository"
	"html/template"
	"os"
	"strconv"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
)

func GenerateReports(requestJson []byte, repository repository.TransactionElasticRepository) error {
	var requestReport dto.RequestReport
	err := json.Unmarshal(requestJson, &requestReport)

	if err != nil {
		return err
	}

	data, err := repository.Search(requestReport.ReportID, requestReport.AccountID, requestReport.InitDate, requestReport.EndDate)

	if err != nil {
		return err
	}

	result, err := generateReportFile(data)

	if err != nil {
		return err
	}

	err = publishMessages(data.ReportID, string(result), "complete")

	if err != nil {
		return err
	}

	err = os.Remove("data/" + data.ReportID + ".html")

	if err != nil {
		return err
	}
	return nil

}

func generateReportFile(data dto.SearchResult) ([]byte, error) {
	f, err := os.Create("data/" + data.ReportID + ".html")

	if err != nil {
		return nil, err
	}

	g, err := time.Parse(time.RFC3339, data.InitDate)
	data.InitDate = g.Format("02/01/2006")

	if err != nil {
		return nil, err
	}

	g, err = time.Parse(time.RFC3339, data.EndDate)
	data.EndDate = g.Format("02/01/2006")

	if err != nil {
		return nil, err
	}

	for _, v := range data.Hits.Hits {
		v.Source.Payment = time.UnixMilli(v.Source.PaymentDate).UTC().Format("January 2, 2006")
	}

	t := template.Must(template.New("report.html").ParseFiles("template/report.html"))
	err = t.Execute(f, data)

	if err != nil {
		return nil, err
	}

	result, err := uploadReport(data)

	if err != nil {
		return nil, err
	}

	return []byte(result), nil

}

func uploadReport(data dto.SearchResult) (string, error) {
	sess := session.Must(session.NewSession())
	svc := s3.New(sess)
	uploader := s3manager.NewUploader(sess)
	fo, err := os.Open("data/" + data.ReportID + ".html")

	if err != nil {
		return "", err
	}
	_, err = uploader.Upload(&s3manager.UploadInput{
		Bucket: aws.String(os.Getenv("S3Bucket")),
		Key:    aws.String(data.ReportID + ".html"),
		Body:   fo,
	})

	req, _ := svc.GetObjectRequest(&s3.GetObjectInput{
		Bucket: aws.String(os.Getenv("S3Bucket")),
		Key:    aws.String(data.ReportID + ".html"),
	})

	if err != nil {
		return "", err
	}
	reportTTL, err := strconv.ParseInt(os.Getenv("ReportTTL"), 10, 64)

	if err != nil {
		return "", err
	}

	urlString, err := req.Presign(time.Duration(reportTTL) * time.Hour)

	if err != nil {
		return "", err
	}

	return urlString, nil
}

func publishMessages(reportID string, fileURL string, status string) error {
	responseReport := dto.ResponseReport{
		ID:      reportID,
		FileURL: fileURL,
		Status:  status,
	}

	responseJson, err := json.Marshal(responseReport)
	if err != nil {
		return err
	}

	producer := kafka.NewKafkaProducer()
	producer.SetupProducer(os.Getenv("KafkaBoostrapedServers"))
	err = producer.Publish(string(responseJson), os.Getenv("KafkaProducerTopic"))

	if err != nil {
		return err
	}

	return nil
}
