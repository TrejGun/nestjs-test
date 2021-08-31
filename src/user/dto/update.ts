import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsString, MinLength } from "class-validator";

import { IUserUpdateDto, UserRole, UserStatus } from "../interfaces";

export class UserUpdateDto implements IUserUpdateDto {
  @ApiPropertyOptional()
  @IsString()
  public firstName: string;

  @ApiPropertyOptional()
  @IsString()
  public lastName: string;

  @ApiPropertyOptional()
  @IsEmail()
  public email: string;

  @ApiPropertyOptional()
  @IsString()
  @MinLength(6)
  public password: string;

  @ApiProperty({
    enum: UserStatus,
  })
  @IsEnum(UserStatus)
  public userStatus: UserStatus;

  @ApiPropertyOptional({
    enum: UserRole,
    isArray: true,
  })
  @IsEnum(UserRole, { each: true })
  public userRoles: Array<UserRole>;
}
