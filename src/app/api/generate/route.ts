import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PdfReader } from 'pdfreader';
import mammoth from 'mammoth';

async function readPdfContent(buffer: Buffer): Promise<string> {
    try {
        return new Promise((resolve, reject) => {
            let pdfText = '';
            const reader = new PdfReader();

            reader.parseBuffer(buffer, (err: any, item: any) => {
                if (err) {
                    reject(err);
                } else if (!item) {
                    resolve(pdfText);
                } else if (item.text) {
                    pdfText += item.text + ' ';
                }
            });
        });
    } catch (error) {
        throw new Error('Error reading Pdf file: ' + error);
    }
}

async function readWordContent(buffer: Buffer): Promise<string> {
    try {
        const result = await mammoth.extractRawText({ buffer });
        return result.value;
    } catch (error) {
        throw new Error('Error reading Word file: ' + error);
    }
}

async function readFileContent(file: any) {
    if (!file || !(file instanceof Blob)) {
        return NextResponse.json({ error: "No file uploaded or invalid file type" }, { status: 400 });
    }

    const fileName = (file as File).name;
    const fileExtension = fileName.split('.').pop()?.toLowerCase();
    console.log(fileExtension);

    const arrayBuffer = await file.arrayBuffer();
    const dataBuffer = Buffer.from(arrayBuffer);

    switch (fileExtension) {
        case 'txt':
            return dataBuffer.toString();
        case 'pdf':
            return await readPdfContent(dataBuffer);
        case 'docx':
        case 'doc':
            return await readWordContent(dataBuffer);
        default:
            return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }
}

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file');

        const textContent = await readFileContent(file);

        const genAI = new GoogleGenerativeAI("Your API Key");
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const result = await model.generateContent([
            textContent + '\n\n Please generate 3 questions from each paragraph and 4 answers for each question in JSON format. Each question should be in the following structure: {question: String, answers: [{answer: String, isCorrect: Boolean}], explanation: String}.'
        ]);

        const generatedText = await result.response.text();
        const jsonContent = generatedText.split('```json')[1]?.split('```')[0]?.trim();
        if (!jsonContent) return NextResponse.json({ error: "No questions generated" }, { status: 500 });

        let questionsArray;
        try {
            questionsArray = JSON.parse(jsonContent);
        } catch (error) {
            return NextResponse.json({ error: "Error parsing JSON" + error }, { status: 500 });
        }

        return NextResponse.json({ status: "success", questions: questionsArray });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error processing file" }, { status: 500 });
    }
}
