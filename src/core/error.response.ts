import { HttpException, HttpStatus } from '@nestjs/common';

export class BadRequestException extends HttpException {
  constructor(message: string, rootError?: Error) {
    super({ message, rootError }, HttpStatus.BAD_REQUEST);
    this.name = 'BadRequestException';
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message: string, rootError?: Error) {
    super({ message, rootError }, HttpStatus.UNAUTHORIZED);
    this.name = 'UnauthorizedException';
  }
}

export class ForbiddenException extends HttpException {
  constructor(message: string, rootError?: Error) {
    super({ message, rootError }, HttpStatus.FORBIDDEN);
    this.name = 'ForbiddenException';
  }
}

export class NotFoundException extends HttpException {
  constructor(message: string, rootError?: Error) {
    super({ message, rootError }, HttpStatus.NOT_FOUND);
    this.name = 'NotFoundException';
  }
}

export class ConflicException extends HttpException {
  constructor(message: string, rootError?: Error) {
    super({ message, rootError }, HttpStatus.CONFLICT);
    this.name = 'ConflicException';
  }
}

export class InternalServerErrorException extends HttpException {
  constructor(message: string, rootError?: Error) {
    if (rootError && rootError instanceof HttpException) {
      super(rootError.getResponse(), rootError.getStatus());
      this.name = rootError.name;
    } else {
      super({ message, rootError }, HttpStatus.INTERNAL_SERVER_ERROR);
      this.name = 'InternalServerErrorException';
    }
  }
}
