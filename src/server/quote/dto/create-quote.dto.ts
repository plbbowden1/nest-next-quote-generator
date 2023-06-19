import { IsNotEmpty, IsString } from 'class-validator';

export class CreateQuoteDto {
  @IsString()
  @IsNotEmpty()
  quote?: string;

  @IsString()
  @IsNotEmpty()
  character?: string;
}
