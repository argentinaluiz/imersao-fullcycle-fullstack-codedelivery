import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Expose } from 'class-transformer';
import { Document } from 'mongoose';

export type DirectionDocument = Direction & Document;

@Exclude({})
@Schema()
export class Direction {
  constructor(partial: Partial<Direction> = {}) {
    Object.assign(this, partial);
  }

  @Expose()
  get id() {
    return String(this['_id']);
  }

  @Expose()
  @Prop()
  routeId: string;

  @Expose()
  @Prop({ type: [[Number]] })
  positions: [number, number][];
}

export const DirectionSchema = SchemaFactory.createForClass(Direction);
