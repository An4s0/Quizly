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
        const apiKey = formData.get('apiKey');
        if (!apiKey) {
            return NextResponse.json({ error: "API key is missing" }, { status: 401 });
        }
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const textContent = await readFileContent(file);

        if (!textContent) {
            return NextResponse.json({ error: "File is empty or unreadable" }, { status: 400 });
        }

        const genAI = new GoogleGenerativeAI(formData.get('apiKey') as string);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });


        const result = await model.generateContent([
            textContent + '\n\nPlease generate many questions. Each question should be in the following structure: {question: "", options: ["a", "b", "c", "d"], correctAnswer: 2 //c }.',
        ]);

        const generatedText = await result.response.text();
        const toJson = generatedText.split("```")[1].split("json").pop()

        if (!toJson) {
            return NextResponse.json({ error: "Error processing file" }, { status: 500 });
        }

        return NextResponse.json({
            status: "success", questions: JSON.parse(generatedText)
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error processing file" }, { status: 500 });
    }
}
