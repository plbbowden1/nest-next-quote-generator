import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  @IsEmail() // these validators check input when storing values in an AuthDto object
  @IsNotEmpty() // validators only work with app.useGlobalPipes in main.ts
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}
