import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Direction, DirectionDocument } from './entities/direction.entity';

@Injectable()
export class DirectionsService {
  constructor(
    @InjectModel(Direction.name)
    private directionModel: Model<DirectionDocument>,
  ) {}

  async findOne(id: string): Promise<Direction> {
    const direction = await this.directionModel.findById(id).exec();
    if (!direction) {
      throw new NotFoundException(direction);
    }
    return direction;
  }

  async findOneBy(filter: Partial<Direction>): Promise<Direction> {
    console.log(filter);
    const direction = await this.directionModel.findOne(filter).exec();
    if (!direction) {
      throw new NotFoundException(direction);
    }
    return direction;
  }
}
