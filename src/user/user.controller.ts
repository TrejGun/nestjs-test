import { Body, Controller, Delete, Get, HttpCode, Param, Put } from "@nestjs/common";

import { Roles, User } from "../common/decorators";
import { UserEntity } from "./user.entity";
import { UserRole } from "./interfaces";
import { UserService } from "./user.service";
import { UserUpdateDto } from "./dto";

@Controller("/users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("/profile")
  public profile(@User() user: UserEntity): UserEntity {
    return user;
  }

  @Get("/")
  @Roles(UserRole.ADMIN)
  public findAll(): Promise<{ rows: Array<UserEntity>; count: number }> {
    return this.userService.findAndCount().then(([rows, count]) => ({ rows, count }));
  }

  @Get("/:id")
  @Roles(UserRole.ADMIN)
  public findOne(@Param("id") id: number): Promise<UserEntity | null> {
    return this.userService.findOne({ id });
  }

  @Put("/:id")
  @Roles(UserRole.ADMIN)
  public update(@Param("id") id: number, @Body() dto: UserUpdateDto): Promise<UserEntity> {
    return this.userService.update({ id }, dto);
  }

  @Delete("/:id")
  @HttpCode(204)
  public async delete(@Param("id") id: number): Promise<void> {
    await this.userService.delete({ id });
  }
}
