import { HttpException, HttpStatus } from "@nestjs/common";
import { Translate } from "./Translate";

export class NotFoundExceptionCustom extends HttpException {
  constructor(name: string) {
    super(`Không tìm thấy ${Translate[name]}`, HttpStatus.NOT_FOUND);
  }
}
