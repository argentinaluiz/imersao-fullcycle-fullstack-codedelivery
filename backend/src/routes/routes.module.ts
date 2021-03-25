import { Module } from "@nestjs/common";
import { RoutesService } from "./routes.service";
import { RoutesController } from "./routes.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Route, RouteSchema } from "./entities/route.entity";
import { RouteGateway } from "./route.gateway";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { DirectionsService } from "./direction.service";
import { Direction, DirectionSchema } from "./entities/direction.entity";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Route.name, schema: RouteSchema },
      { name: Direction.name, schema: DirectionSchema },
    ]),
    ClientsModule.registerAsync([
      {
        name: "KAFKA_SERVICE",
        useFactory: () => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: process.env.KAFKA_CLIENT_ID,
              brokers: [process.env.KAFKA_BROKER],
            },
            consumer: {
              groupId:
                !process.env.KAFKA_CONSUMER_GROUP_ID ||
                process.env.KAFKA_CONSUMER_GROUP_ID === ""
                  ? "my-consumer-" + Math.random()
                  : process.env.KAFKA_CONSUMER_GROUP_ID,
            },
          },
        }),
      },
    ]),
    // ClientsModule.register([
    //   {
    //     name: 'KAFKA_SERVICE',
    //     transport: Transport.KAFKA,
    //     options: {
    //       client: {
    //         clientId: process.env.KAFKA_CLIENT_ID,
    //         brokers: [process.env.KAFKA_BROKER]
    //       },
    //       consumer: {
    //         groupId: !process.env.KAFKA_CONSUMER_GROUP_ID ||
    //           process.env.KAFKA_CONSUMER_GROUP_ID === ''
    //             ? 'my-consumer-' + Math.random()
    //             : process.env.KAFKA_CONSUMER_GROUP_ID,
    //       }
    //     }
    //   },
    // ]),
  ],
  controllers: [RoutesController],
  providers: [RoutesService, DirectionsService, RouteGateway],
})
export class RoutesModule {}
