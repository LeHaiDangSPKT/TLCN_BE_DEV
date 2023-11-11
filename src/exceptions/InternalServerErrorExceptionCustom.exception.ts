import { HttpException, HttpStatus } from "@nestjs/common";

export class InternalServerErrorExceptionCustom extends HttpException {
  constructor() {
    super("Lỗi hệ thống, vui lòng quay lại sau giây lát...", HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
