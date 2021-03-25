import { Inject } from "@nestjs/common";
import { ClientKafka, MessagePattern, Payload } from "@nestjs/microservices";
import { Producer } from "@nestjs/microservices/external/kafka.interface";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway()
export class RouteGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private kafkaProducer: Producer;

  @WebSocketServer()
  server: Server;

  constructor(
    @Inject("KAFKA_SERVICE")
    private kafkaClient: ClientKafka
  ) {}

  private users = {};

  async onModuleInit() {
    this.kafkaProducer = await this.kafkaClient.connect();
  }

  async handleConnection(client: Socket, ...args: any[]): Promise<void> {
    this.users[client.id] = [];
    console.log(this.users);
  }

  async handleDisconnect(client: Socket): Promise<void> {
    delete this.users[client.id];
  }

  @SubscribeMessage("new-direction")
  handleNewDirectionsMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { routeId: string }
  ) {
    console.log(data);
    this.kafkaProducer.send({
      topic: "route.new-direction",
      messages: [
        {
          key: "route.new-direction",
          value: JSON.stringify({ routeId: data.routeId, clientId: client.id }),
        },
      ],
    });
  }

  sendPosition(data: {
    clientId: string;
    routeId: string;
    position: [number, number];
    finished: boolean;
  }) {
    const {clientId, ...rest} = data;
    const clients = this.server.sockets.connected;
    if (!(data.clientId in clients)) {
      console.error(
        "Client not exist, refresh React Application and send new direction"
      );
      return;
    }
    clients[data.clientId].emit("new-position", rest);
    //this.server.emit
  }
}
