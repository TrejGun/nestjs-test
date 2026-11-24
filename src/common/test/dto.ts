import { randomUUID } from "crypto";

import { IUserCreateDto } from "../../user/interfaces";

export const generateUserCreateDto = (data: Partial<IUserCreateDto> = {}): IUserCreateDto => {
  return Object.assign(
    {
      password: "My5up3r5tr0ngP@55w0rd",
      confirm: "My5up3r5tr0ngP@55w0rd",
      captcha: "DoesNotMatter",
      firstName: "Trej",
      lastName: "Gun",
      email: `trejgun+${randomUUID()}@gmail.com`,
    },
    data,
  );
};
