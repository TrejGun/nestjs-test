import { v4 } from "uuid";

import { IUser, UserRole, UserStatus } from "../../user/interfaces";

export const generateTestUser = (data: Partial<IUser> = {}): Partial<IUser> => {
  return Object.assign(
    {
      roles: [UserRole.USER],
      status: UserStatus.ACTIVE,
      email: `trejgun+${v4()}@gmail.com`,
      firstName: "Trej",
      lastName: "Gun",
      password: "92f357f4a898825de204b25fffec4a0a1ca486ad1e25643502e33b5ebeefc3ff", // My5up3r5tr0ngP@55w0rd
    },
    data,
  );
};
