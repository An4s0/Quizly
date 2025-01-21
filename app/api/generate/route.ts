import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PdfReader } from 'pdfreader';
import mammoth from 'mammoth';

interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: number;
}

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

// Thie part is not written by me.
function isValidQuizQuestion(question: any): question is QuizQuestion {
    return (
        typeof question === 'object' &&
        typeof question.question === 'string' &&
        Array.isArray(question.options) &&
        question.options.every((opt: any) => typeof opt === 'string') &&
        typeof question.correctAnswer === 'number'
    );
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
        const toJson = generatedText.split("```json")[1]?.split("```")[0];

        if (!toJson) {
            return NextResponse.json({ error: "Error processing file" }, { status: 500 });
        }

        const parsedQuestions = JSON.parse(toJson.trim());

        if (Array.isArray(parsedQuestions) && parsedQuestions.every(isValidQuizQuestion)) {
            return NextResponse.json({ status: "success", questions: parsedQuestions });
        } else {
            throw new Error("Invalid question format");
        }

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error processing file" }, { status: 500 });
    }
}
