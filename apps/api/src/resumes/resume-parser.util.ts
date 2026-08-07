import { PDFParse } from 'pdf-parse';
import * as mammoth from 'mammoth';
import { BadRequestException } from '@nestjs/common';

/**
 * Takes an uploaded file (PDF or DOCX) and returns its plain text content.
 * Throws a BadRequestException for unsupported file types.
 */
export async function extractTextFromFile(file: Express.Multer.File): Promise<string> {
    if (file.mimetype === 'application/pdf') {
        const parser = new PDFParse({ data: file.buffer });
        const data = await parser.getText();
        return data.text;
    }

    if (
        file.mimetype ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
        const result = await mammoth.extractRawText({ buffer: file.buffer });
        return result.value;
    }

    throw new BadRequestException(
        'Unsupported file type. Please upload a PDF or a .docx Word document.',
    );
}