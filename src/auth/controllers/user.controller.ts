import {
  Controller,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Get,
  Res,
  Param,
  Put,
  Body,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { Observable, from, of, switchMap } from 'rxjs';
import { JwtGuard } from '../guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  isFileExtensionSafe,
  removeFile,
  saveImageToStorage,
} from '../helpers/image.storage';
import { join } from 'path';
import { UpdateResult } from 'typeorm';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', saveImageToStorage))
  uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ): Observable<UpdateResult | { error: string }> {
    const fileName = file?.filename;

    if (!fileName)
      return of({ error: 'File must be of type: png, jpg or jpeg' });

    const imageFolderPath = join(process.cwd(), 'images');
    const fullImagePath = join(imageFolderPath + '/' + file.filename);

    return from(isFileExtensionSafe(fullImagePath)).pipe(
      switchMap((isFileLegit: boolean) => {
        if (isFileLegit) {
          const userId = req.user.id;
          return this.userService.updateUserImageById(userId, fileName);
        }

        removeFile(fullImagePath);
        return of({ error: 'File content does not match extension' });
      }),
    );
  }

  @UseGuards(JwtGuard)
  @Get('image')
  findImage(@Request() req, @Res() res): Observable<any> {
    // used any observable instead of object observable
    const userId = req.user.id;
    return this.userService.findImageNameByUserId(userId).pipe(
      switchMap((imageName: string) => {
        return of(res.sendFile(imageName, { root: '/images' }));
      }),
    );
  }
}
