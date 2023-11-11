import { HttpException, HttpStatus } from "@nestjs/common";

export class ForbiddenExceptionCustom extends HttpException {
    constructor() {
      super("Truy cập thất bại!", HttpStatus.FORBIDDEN);
    }
  }
