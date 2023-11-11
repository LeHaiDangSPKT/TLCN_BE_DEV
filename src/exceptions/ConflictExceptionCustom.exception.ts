import { HttpException, HttpStatus } from "@nestjs/common";
import { Translate, UpperCaseFirstLetter } from "./Translate";

export class ConflictExceptionCustom extends HttpException {
  constructor(name: string) {
    super(UpperCaseFirstLetter(`${Translate[name]} đã tồn tại`), HttpStatus.CONFLICT);
  }
}
