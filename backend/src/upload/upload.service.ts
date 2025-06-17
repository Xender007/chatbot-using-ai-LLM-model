import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { extractText } from 'src/utils/extractor/extractor';

@Injectable()
export class UploadService {
  async processFile(file: Express.Multer.File) {
    if (!file) {
      throw new Error('No file uploaded');
    }

    // Ensure the "documents" directory exists
    const documentsDir = path.join(__dirname, '..', '..', 'documents');
    if (!fs.existsSync(documentsDir)) {
      fs.mkdirSync(documentsDir, { recursive: true });
    }

    // Save file to disk
    const filePath = path.join(documentsDir, file.originalname);
    fs.writeFileSync(filePath, file.buffer);
    console.log(`File saved to ${filePath}`);

    // Extract text
    const rawText = await extractText(filePath);
    if (!rawText || rawText.trim().length === 0) {
      throw new Error('Text extraction failed or file is empty');
    }

    // Chunk and send to embedding API
    const chunks = this.chunkText(rawText, 250);
    await axios.post('http://localhost:8000/embed-batch', { chunks });

    return { message: 'File processed and embedded.' };
  }

  private chunkText(text: string, maxWords = 250): string[] {
    const sentences = text.split(/(?<=[.?!])\s+/);
    const chunks: string[] = [];
    let current: string[] = [];

    for (const sentence of sentences) {
      current.push(sentence);
      const currentLength = current.join(' ').split(' ').length;
      if (currentLength >= maxWords) {
        chunks.push(current.join(' '));
        current = [];
      }
    }

    if (current.length > 0) {
      chunks.push(current.join(' '));
    }

    return chunks;
  }
}
