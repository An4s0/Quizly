import { NextResponse } from 'next/server';
import axios from 'axios';
import readFileContent from '@helpers/readFileContent';

interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: number;
}

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file');
        const fileExtension = (file as File).name.split('.').pop()?.toLowerCase();

        if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        if (!(file instanceof File)) return NextResponse.json({ error: "Invalid file uploaded" }, { status: 400 });
        if (!fileExtension) return NextResponse.json({ error: "Invalid file extension" }, { status: 400 });

        const fileBuffer = Buffer.from(await file.arrayBuffer());
        const fileContent = await readFileContent(fileBuffer, fileExtension);


        const response = await axios({
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://api.deepseek.com/chat/completions',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
            },
            data: {
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful assistant that generates quiz questions based on the provided content. Format the response as a JSON array without any additional text or Markdown syntax.',
                    },
                    {
                        role: 'user',
                        content: `Generate too many quiz questions based on the following content:\n\n${fileContent}\n\nFormat the questions as a JSON array like this:\n\n[\n  {\n    "question": "What is the capital of France?",\n    "options": ["a", "b", "c", "d"],\n    "correctAnswer": 2\n  }\n]`,
                    },
                ],
                model: "deepseek-chat",
                response_format: {
                    type: "text",
                },
                temperature: 0.7, 
            },
        });

        if (!response.data?.choices || !response.data.choices.length) {
            console.error('Invalid or empty response from DeepSeek API');
            return NextResponse.json({ error: "Failed to generate quiz questions" }, { status: 500 });
        }

        const aiRes = response.data.choices[0].message.content;

        const jsonRes = aiRes.replace(/```json|```/g, '').trim();

        let quizQuestions: QuizQuestion[] = [];
        try {
            quizQuestions = JSON.parse(jsonRes);
        } catch (error) {
            console.error('Failed to parse quiz questions:', error);
            console.error('Response content:', jsonRes);
            return NextResponse.json({ error: "Failed to generate quiz questions" }, { status: 500 });
        }

        return NextResponse.json({ questions: quizQuestions });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error processing file" }, { status: 500 });
    }
}
