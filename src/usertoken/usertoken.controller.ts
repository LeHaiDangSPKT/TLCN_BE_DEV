import { Controller } from '@nestjs/common';
import { UsertokenService } from './usertoken.service';

@Controller('usertoken')
export class UsertokenController {
  constructor(private readonly usertokenService: UsertokenService) {}
}
