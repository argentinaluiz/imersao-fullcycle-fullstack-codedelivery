package main

import (
	appkafka "github.com/codeedu/imersaofsfc2-simulator/application/kafka"
	"github.com/codeedu/imersaofsfc2-simulator/infra/kafka"
	ckafka "github.com/confluentinc/confluent-kafka-go/kafka"
	"github.com/joho/godotenv"
	"log"
)

func init() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env files")
	}
}

func main() {
	msgChan := make(chan *ckafka.Message)
	eventChan := make(chan ckafka.Event)
	consumer := kafka.NewKafkaConsumer(msgChan)
	go consumer.Consume()
	go kafka.DeliveryReport(eventChan)
	for msg := range msgChan {
		go appkafka.Produce(msg, eventChan)
	}
}
