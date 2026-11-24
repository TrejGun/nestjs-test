import { BadRequestException, Injectable, ValidationError, ValidationPipe } from "@nestjs/common";

@Injectable()
export class CustomValidationPipe extends ValidationPipe {
  constructor() {
    super({
      exceptionFactory: (errors: ValidationError[]): BadRequestException => new BadRequestException(errors),
      transform: true,
      forbidUnknownValues: true,
    });
  }
}
