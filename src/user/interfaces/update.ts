import { IUserCreateDto } from "./create";
import { UserRole, UserStatus } from "./user";

export interface IUserUpdateDto extends IUserCreateDto {
  userStatus: UserStatus;
  userRoles: Array<UserRole>;
}
