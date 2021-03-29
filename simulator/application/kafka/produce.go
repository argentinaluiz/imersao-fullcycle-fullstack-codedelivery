package kafka

import (
	"encoding/json"
	"github.com/codeedu/imersaofsfc2-simulator/domain"
	"github.com/codeedu/imersaofsfc2-simulator/infra/kafka"
	ckafka "github.com/confluentinc/confluent-kafka-go/kafka"
	"log"
	"os"
	"time"
)

func Produce(msg *ckafka.Message, event chan ckafka.Event) {
	producer := kafka.NewKafkaProducer()
	route := domain.NewRoute()
	json.Unmarshal(msg.Value, &route)
	route.LoadPositions()
	positions, err := route.ExportJsonPositions()
	if err != nil {
		log.Fatalf(err.Error())
	}
	for _, p := range positions {
		kafka.Publish(p, os.Getenv("KafkaProduceTopic"), producer, event)
		time.Sleep(time.Millisecond * 500)
	}
}