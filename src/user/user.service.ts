import { ConfigService } from "@nestjs/config";
import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { createHash } from "crypto";
import { DeleteResult, FindOptionsWhere, Not, Repository } from "typeorm";

import { UserEntity } from "./user.entity";
import { IUserCreateDto, IUserUpdateDto, UserRole, UserStatus } from "./interfaces";
import { IPasswordDto } from "../auth/interfaces";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userEntityRepository: Repository<UserEntity>,
    private readonly configService: ConfigService,
  ) {}

  public findOne(where: FindOptionsWhere<UserEntity>): Promise<UserEntity | null> {
    return this.userEntityRepository.findOne({ where });
  }

  public findAndCount(): Promise<[Array<UserEntity>, number]> {
    return this.userEntityRepository.findAndCount();
  }

  public async getByCredentials(email: string, password: string): Promise<UserEntity | null> {
    return this.userEntityRepository.findOne({
      where: {
        email,
        password: this.createPasswordHash(password),
      },
    });
  }

  public async create(dto: IUserCreateDto): Promise<UserEntity> {
    const { email, password, ...rest } = dto;

    await this.checkEmail(email, 0);

    return this.userEntityRepository
      .create({
        ...rest,
        email,
        password: this.createPasswordHash(password),
        status: UserStatus.PENDING,
        roles: [UserRole.USER],
      })
      .save();
  }

  public createPasswordHash(password: string): string {
    const passwordSecret = this.configService.get<string>("PASSWORD_SECRET", "keyboard_cat");
    return createHash("sha256").update(password).update(passwordSecret).digest("hex");
  }

  public updatePassword(userEntity: UserEntity, dto: IPasswordDto): Promise<UserEntity> {
    userEntity.password = this.createPasswordHash(dto.password);
    return userEntity.save();
  }

  public activate(userEntity: UserEntity): Promise<UserEntity> {
    userEntity.status = UserStatus.ACTIVE;
    return userEntity.save();
  }

  public async update(where: FindOptionsWhere<UserEntity>, dto: Partial<IUserUpdateDto>): Promise<UserEntity> {
    const { email, ...rest } = dto;

    const userEntity = await this.userEntityRepository.findOne({ where });

    if (!userEntity) {
      throw new NotFoundException("userNotFound");
    }

    if (email && email !== userEntity.email) {
      await this.checkEmail(email, userEntity.id);
      userEntity.status = UserStatus.PENDING;
      userEntity.email = email;
    }

    Object.assign(userEntity, rest);
    return userEntity.save();
  }

  public async checkEmail(email: string, id: number): Promise<void> {
    const userEntity = await this.findOne({
      email,
      id: Not(id),
    });

    if (userEntity) {
      throw new ConflictException("duplicateEmail");
    }
  }

  public delete(where: FindOptionsWhere<UserEntity>): Promise<DeleteResult> {
    return this.userEntityRepository.delete(where);
  }
}
