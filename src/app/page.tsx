'use client';
import { useState } from "react";
import Question from "@/components/question";
import Result from "@/components/result";

export default function Home() {
  const [quiz, setQuiz] = useState<any[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<number | null>(null);

  const handleFile = async (e: any) => {  
    setQuiz([]);
    setResult(null);
  
    const selectedFile = e.target.files[0];
    const formData = new FormData();
    formData.append('file', selectedFile);
  
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`Error uploading file: ${response.statusText}`);
      }
  
      const data = await response.json();
      if (data.error) {
        alert(data.error);
      } else {
        setQuiz(data.questions);
        setUserAnswers(new Array(data.questions.length).fill(null));
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };
  


  const handleOptionClick = (index: number) => {
    setSelectedOption(index);
    setUserAnswers(prevAnswers => {
      const updatedAnswers = [...prevAnswers];
      updatedAnswers[currentQuestionIndex] = index;
      return updatedAnswers;
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    } else {
      gradeQuiz();
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedOption(null);
    }
  };

  const gradeQuiz = () => {
    const correctAnswers = quiz.reduce((count, question, index) => {
      const userAnswerIndex = userAnswers[index];
      if (userAnswerIndex !== null && question.answers[userAnswerIndex]?.isCorrect) {
        return count + 1;
      }
      return count;
    }, 0);

    setResult(correctAnswers);
  };

  const handleRestartQuiz = () => {
    setResult(null);
    setCurrentQuestionIndex(0);
    setUserAnswers(new Array(quiz.length).fill(null));
  };

  return (
    <>
      {result === null && quiz.length > 0 && (
        <Question
          number={currentQuestionIndex + 1}
          total={quiz.length}
          question={quiz[currentQuestionIndex].question}
          answers={quiz[currentQuestionIndex].answers}
          selectedOption={selectedOption}
          handleOptionClick={handleOptionClick}
          handlePrev={handlePrev}
          handleNext={handleNext}
        />
      )}

      {result !== null && (
        <Result
          grade={result}
          quiz={quiz}
          userAnswers={userAnswers}
          handleRestartQuiz={handleRestartQuiz}
        />
      )}

      <div className="w-[300px] h-[60px] p-[7px] bg-zinc-900 fixed bottom-[25px] left-[calc(50%-150px)] rounded-md">
        <label
          htmlFor="File"
          className="cursor-pointer font-bold bg-zinc-800 text-white px-4 py-2 rounded-md hover:bg-zinc-700 transition flex items-center justify-center w-full h-full"
        >
          Upload File
        </label>
        <input type="file" name="File" id="File" className="hidden" onChange={handleFile} />
      </div>

    </>
  );
}
