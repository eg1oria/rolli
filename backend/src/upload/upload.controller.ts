import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/auth.guard';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

function generateFilename(originalname: string): string {
  const ext = extname(originalname);
  const id =
    Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
  return `${id}${ext}`;
}

@ApiTags('Upload')
@Controller()
export class UploadController {
  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Загрузить изображение' })
  @ApiQuery({ name: 'type', enum: ['products', 'promotions'], required: false })
  @ApiResponse({ status: 201, description: 'URL загруженного файла' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          const type =
            (_req.query as Record<string, string>).type === 'promotions'
              ? 'promotions'
              : 'products';
          const uploadPath = join(process.cwd(), 'uploads', type);
          cb(null, uploadPath);
        },
        filename: (_req, file, cb) => {
          cb(null, generateFilename(file.originalname));
        },
      }),
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.match(/^image\/(jpeg|png|gif|webp|svg\+xml)$/)) {
          cb(
            new BadRequestException(
              'Допустимы только изображения (jpeg, png, gif, webp, svg)',
            ),
            false,
          );
          return;
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('type') type?: string,
  ) {
    if (!file) {
      throw new BadRequestException('Файл не загружен');
    }
    const folder = type === 'promotions' ? 'promotions' : 'products';
    return {
      url: `/uploads/${folder}/${file.filename}`,
    };
  }
}
