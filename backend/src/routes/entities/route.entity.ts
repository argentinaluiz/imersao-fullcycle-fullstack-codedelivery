import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { classToPlain, Exclude, Expose, Type } from 'class-transformer';
import { Document } from 'mongoose';

export type RouteDocument = Route & Document;

@Exclude({})
@Schema()
export class Route {
  constructor(partial: Partial<Route> = {}) {
    Object.assign(this, partial);
  }

  @Prop()
  public _id: string;

  // @Expose()
  // @Prop()
  set id(id: string) {
    this._id = id;
  }

  @Expose()
  get id() {
    return String(this['_id']);
  }

  @Expose()
  @Prop()
  title: string;

  @Expose()
  @Prop(
    raw({
      lat: { type: Number },
      lng: { type: Number },
    }),
  )
  startPosition: { lat: number; lng: number };

  @Expose()
  @Prop(
    raw({
      lat: { type: Number },
      lng: { type: Number },
    }),
  )
  endPosition: { lat: number; lng: number };
}

export const RouteSchema = SchemaFactory.createForClass(Route);
