'use client';
import UploadFile from "@/components/UploadFile";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export default function Home() {

  return (
    <>
      <UploadFile />
    </>
  )
}
