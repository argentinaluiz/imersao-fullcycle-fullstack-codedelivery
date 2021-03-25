import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ClassSerializerInterceptor,
  UseInterceptors,
  ValidationPipe,
  HttpCode,
  Inject,
  OnModuleInit,
} from '@nestjs/common';
import { RoutesService } from './routes.service';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { Route } from './entities/route.entity';
import {
  ClientKafka,
  Ctx,
  KafkaContext,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import { Message } from 'kafkajs';
import { Producer } from '@nestjs/microservices/external/kafka.interface';
import { DirectionsService } from './direction.service';
import { RouteGateway } from './route.gateway';
@UseInterceptors(ClassSerializerInterceptor)
@Controller('routes')
export class RoutesController implements OnModuleInit {
  private kafkaProducer: Producer;
  constructor(
    private readonly routesService: RoutesService,
    private readonly directionsService: DirectionsService,
    private readonly routeGateway: RouteGateway,
    @Inject('KAFKA_SERVICE')
    private kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this.kafkaProducer = await this.kafkaClient.connect();
  }

  // @Post()
  // async create(
  //   @Body(new ValidationPipe({ errorHttpStatusCode: 422 }))
  //   createRouteDto: CreateRouteDto,
  // ) {
  //   const route = await this.routesService.create(createRouteDto);
  //   return new Route(route.toJSON());
  // }

  @Get()
  async findAll() {
    const routes = await this.routesService.findAll();
    return routes.map((route) => {
      console.log(route);
      return new Route(route.toJSON());
    });
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.routesService.findOne(id);
  // }

  // @Patch(':id')
  // async update(
  //   @Param('id') id: string,
  //   @Body(new ValidationPipe({ errorHttpStatusCode: 422 }))
  //   updateRouteDto: UpdateRouteDto,
  // ) {
  //   const route = await this.routesService.update(id, updateRouteDto);
  //   return new Route(route.toJSON());
  // }

  // @HttpCode(204)
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.routesService.remove(id);
  // }

  // @MessagePattern('route.new-direction')
  // async consumeNewRoutes(
  //   @Payload() message: { value: { routeId: string; clientId: string } },
  // ) {
  //   console.log(message);
  //   const direction = await this.directionsService.findOneBy({
  //     routeId: message.value.routeId,
  //   });
  //   for (const position of direction.positions) {
  //     console.log(position);
  //     this.kafkaProducer.send({
  //       topic: 'route.new-position',
  //       messages: [
  //         {
  //           key: 'route.new-position',
  //           value: JSON.stringify({ ...message.value, position }),
  //         },
  //       ],
  //     });
  //     await new Promise((resolve) => setTimeout(resolve, 500));
  //   }
  // }

  @MessagePattern('route.new-position')
  async consumeNewPosition(
    @Payload()
    message: {
      value: {
        routeId: string;
        clientId: string;
        position: [number, number];
        finished: boolean
      };
    },
  ) {
    this.routeGateway.sendPosition(message.value);
  }
}
