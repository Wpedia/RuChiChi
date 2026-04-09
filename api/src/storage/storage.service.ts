import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import * as sharp from 'sharp';

export interface UploadResult {
  fileKey: string;
  url: string;
  thumbnailUrl?: string;
  size: number;
  mimeType: string;
}

export interface PresignedUrlResult {
  url: string;
  expiresAt: Date;
}

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger(StorageService.name);
  private s3Client: S3Client;
  private readonly bucketName: string;
  private readonly presignExpiration = 3600; // 1 час в секундах

  constructor(private configService: ConfigService) {
    this.bucketName = this.configService.get('S3_BUCKET_NAME', 'chat-files');
  }

  onModuleInit() {
    const endpoint = this.configService.get(
      'S3_ENDPOINT',
      'http://localhost:9000',
    );
    const region = this.configService.get('S3_REGION', 'us-east-1');
    const accessKeyId = this.configService.get('S3_ACCESS_KEY', 'minioadmin');
    const secretAccessKey = this.configService.get(
      'S3_SECRET_KEY',
      'minioadmin123',
    );

    this.s3Client = new S3Client({
      region,
      endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      forcePathStyle: true, // Нужно для MinIO
    });

    this.logger.log(`StorageService initialized with endpoint: ${endpoint}`);
  }

  /**
   * Генерирует ключ файла на основе типа и даты
   */
  private generateFileKey(
    type: 'images' | 'voice' | 'videos' | 'files',
    extension: string,
  ): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const uuid = uuidv4();
    return `${type}/${year}/${month}/${day}/${uuid}.${extension}`;
  }

  /**
   * Загружает файл в хранилище
   */
  async uploadFile(
    buffer: Buffer,
    originalName: string,
    mimeType: string,
    type: 'images' | 'voice' | 'videos' | 'files',
    generateThumbnail = false,
  ): Promise<UploadResult> {
    const extension = originalName.split('.').pop() || 'bin';
    const fileKey = this.generateFileKey(type, extension);

    try {
      // Загружаем основной файл
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: fileKey,
          Body: buffer,
          ContentType: mimeType,
          Metadata: {
            originalName,
            uploadedAt: new Date().toISOString(),
          },
        }),
      );

      this.logger.log(`File uploaded: ${fileKey}`);

      // Генерируем thumbnail для изображений
      let thumbnailUrl: string | undefined;
      if (generateThumbnail && type === 'images') {
        const thumbnailKey = await this.generateThumbnail(fileKey, buffer);
        thumbnailUrl = await this.getPresignedUrl(thumbnailKey).then(
          (r) => r.url,
        );
      }

      const url = await this.getPresignedUrl(fileKey).then((r) => r.url);

      return {
        fileKey,
        url,
        thumbnailUrl,
        size: buffer.length,
        mimeType,
      };
    } catch (error) {
      this.logger.error(`Failed to upload file: ${error.message}`);
      throw error;
    }
  }

  /**
   * Генерирует thumbnail для изображения
   */
  private async generateThumbnail(
    originalKey: string,
    buffer: Buffer,
  ): Promise<string> {
    const thumbnailBuffer = await sharp(buffer)
      .resize(300, 300, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer();

    const thumbnailKey = originalKey.replace(/\.[^/.]+$/, '_thumb.jpg');

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: thumbnailKey,
        Body: thumbnailBuffer,
        ContentType: 'image/jpeg',
      }),
    );

    return thumbnailKey;
  }

  /**
   * Генерирует presigned URL для временного доступа к файлу
   */
  async getPresignedUrl(
    fileKey: string,
    expiresIn = this.presignExpiration,
  ): Promise<PresignedUrlResult> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
    });

    const url = await getSignedUrl(this.s3Client, command, { expiresIn });
    const expiresAt = new Date(Date.now() + expiresIn * 1000);

    return { url, expiresAt };
  }

  /**
   * Проверяет существование файла
   */
  async fileExists(fileKey: string): Promise<boolean> {
    try {
      await this.s3Client.send(
        new HeadObjectCommand({
          Bucket: this.bucketName,
          Key: fileKey,
        }),
      );
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Удаляет файл
   */
  async deleteFile(fileKey: string): Promise<void> {
    try {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: fileKey,
        }),
      );

      // Удаляем thumbnail если есть
      const thumbnailKey = fileKey.replace(/\.[^/.]+$/, '_thumb.jpg');
      if (thumbnailKey !== fileKey) {
        await this.s3Client.send(
          new DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: thumbnailKey,
          }),
        );
      }

      this.logger.log(`File deleted: ${fileKey}`);
    } catch (error) {
      this.logger.error(`Failed to delete file: ${error.message}`);
      throw error;
    }
  }

  /**
   * Обновляет presigned URLs для массива файлов
   * (вызывать когда URLs истекают)
   */
  async refreshUrls(
    files: { fileKey: string; thumbnailKey?: string }[],
  ): Promise<Map<string, string>> {
    const urlMap = new Map<string, string>();

    for (const file of files) {
      const mainUrl = await this.getPresignedUrl(file.fileKey);
      urlMap.set(file.fileKey, mainUrl.url);

      if (file.thumbnailKey) {
        const thumbUrl = await this.getPresignedUrl(file.thumbnailKey);
        urlMap.set(file.thumbnailKey, thumbUrl.url);
      }
    }

    return urlMap;
  }
}
