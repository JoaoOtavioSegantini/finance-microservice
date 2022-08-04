package main

import (
	"fmt"
	"github/joaotavioos/reports-microservice/infra/kafka"
	"github/joaotavioos/reports-microservice/infra/repository"
	"github/joaotavioos/reports-microservice/usecase"
	"log"

	ckafka "github.com/confluentinc/confluent-kafka-go/kafka"

	"github.com/elastic/go-elasticsearch/v8"
	"github.com/joho/godotenv"
)

func init() {
	err := godotenv.Load()

	if err != nil {
		log.Fatal("error loading .env file")
	}
}
func main() {

	client, err := elasticsearch.NewClient(elasticsearch.Config{
		Addresses: []string{
			"http://host.docker.internal:9200",
		},
	})

	if err != nil {
		log.Fatal("error connecting to elasticsearch")
	}

	repo := repository.TransactionElasticRepository{
		Client: *client,
	}

	msgChan := make(chan *ckafka.Message)
	consumer := kafka.NewKafkaConsumer(msgChan)
	go consumer.Consume()

	for msg := range msgChan {
		err := usecase.GenerateReports(msg.Value, repo)

		if err != nil {
			fmt.Println(err)
		}
	}

}
