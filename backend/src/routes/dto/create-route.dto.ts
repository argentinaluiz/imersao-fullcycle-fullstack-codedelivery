import {
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class PositionDto {
  @IsNumber()
  @IsNotEmpty()
  lat: number;

  @IsNumber()
  @IsNotEmpty()
  lng: number;
}

export class CreateRouteDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @ValidateNested()
  startPosition: PositionDto;

  @ValidateNested()
  endPosition: PositionDto;
}
