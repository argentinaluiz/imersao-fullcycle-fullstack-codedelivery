import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { classToPlain } from 'class-transformer';
import { Model } from 'mongoose';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { Route, RouteDocument } from './entities/route.entity';

@Injectable()
export class RoutesService {
  constructor(
    @InjectModel(Route.name) private routeModel: Model<RouteDocument>,
  ) {}

  create(createRouteDto: CreateRouteDto): Promise<RouteDocument> {
    return this.routeModel.create(createRouteDto);
  }

  findAll(): Promise<RouteDocument[]> {
    return this.routeModel.find().exec();
  }

  async findOne(id: string) {
    const route = await this.routeModel.findById(id).exec();
    if (!route) {
      throw new NotFoundException(route);
    }
    return route;
  }

  async update(id: string, updateRouteDto: UpdateRouteDto) {
    const route = await this.routeModel.findById(id).exec();
    if (!route) {
      throw new NotFoundException(route);
    }
    await this.routeModel.updateOne({ _id: id }, updateRouteDto).exec();
    return await this.routeModel.findById(id).exec();
  }

  async remove(id: string) {
    const route = await this.routeModel.findById(id).exec();
    if (!route) {
      throw new NotFoundException(route);
    }
    this.routeModel.deleteOne({ _id: id });
  }
}
