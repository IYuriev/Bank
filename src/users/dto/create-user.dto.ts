import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { USER_DTO_DOCS } from 'src/constants/docs/users/user.dto';

export class CreateUserDto {
  @ApiProperty(USER_DTO_DOCS.email)
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @ApiProperty(USER_DTO_DOCS.password)
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;
}
