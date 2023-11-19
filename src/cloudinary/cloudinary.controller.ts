import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiConsumes, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { SuccessResponse } from 'src/core/success.response';
import { Public } from 'src/auth/decorators/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Controller('upload')
@ApiTags('Upload')
export class CloudinaryController {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
  ) { }

  @Public()
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({
    description: 'The file has been uploaded successfully to cloudinary'
  })
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(
    @UploadedFile() file: Express.Multer.File
  ) {
    const resUpload = this.cloudinaryService.uploadFile(file)
    var fileInfo = null
    resUpload.then((res) => {fileInfo = res})
    return new SuccessResponse({
      message: "Upload file thành công!",
      metadata: { data: fileInfo },
    })
  }

}



