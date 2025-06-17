import * as fs from 'fs';
import * as pdf from 'pdf-parse';
import * as mammoth from 'mammoth';

export async function extractText(filePath: string): Promise<string> {
  const ext = filePath.split('.').pop()?.toLowerCase();

  if (ext === 'pdf') {
    const data = fs.readFileSync(filePath);
    const content = await pdf(data);
    return content.text;
  }

  if (ext === 'docx') {
    const buffer = fs.readFileSync(filePath);
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  if (ext === 'txt') {
    return fs.readFileSync(filePath, 'utf8');
  }

  throw new Error('Unsupported file type.');
}
