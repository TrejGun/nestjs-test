import { v4 } from "uuid";

import { IUserCreateDto } from "../../user/interfaces";

export const generateUserCreateDto = (data: Partial<IUserCreateDto> = {}): IUserCreateDto => {
  return Object.assign(
    {
      password: "My5up3r5tr0ngP@55w0rd",
      confirm: "My5up3r5tr0ngP@55w0rd",
      captcha: "DoesNotMatter",
      firstName: "Trej",
      lastName: "Gun",
      email: `trejgun+${v4()}@gmail.com`,
    },
    data,
  );
};
