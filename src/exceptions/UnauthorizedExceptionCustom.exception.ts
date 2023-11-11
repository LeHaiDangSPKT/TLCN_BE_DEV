import { HttpException, HttpStatus } from "@nestjs/common";

export class UnauthorizedExceptionCustom extends HttpException {
    constructor() {
      super("Người dùng chưa được xác thực!", HttpStatus.UNAUTHORIZED);
    }
  }
