'use client';
import React, { useState, useCallback } from 'react';
import { Upload, FileUp, AlertCircle, Zap, ArrowRight, RefreshCw, House, Key, Loader2, XCircle } from 'lucide-react';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export default function Home() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [showApiInput, setShowApiInput] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  }, []);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      setSelectedAnswer(null);
    } else {
      setShowScore(true);
    }
  };

  const resetQuiz = () => {
    setShowQuiz(false);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowScore(false);
    setFile(null);
    setIsLoading(false);
    setLoadingProgress(0);
  };

  const handleGenerateQuiz = () => {
    const storedApiKey = localStorage.getItem("apiKey");

    if (storedApiKey) {
      setApiKey(storedApiKey);
      handleStartQuiz();
    } else {
      setShowApiInput(true);
    }
  };

  const handleStartQuiz = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    setIsLoading(true);
    setLoadingProgress(0);
    setError(null);

    const simulateProgress = async () => {
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        setLoadingProgress(i);
      }
    };

    try {


      if (!file) {
        setError("Please select a file first.");
        return;
      }

      const apiKeyStored = localStorage.getItem("apiKey");
      if (!apiKeyStored) {
        localStorage.setItem("apiKey", apiKey);
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('apiKey', apiKeyStored || apiKey);

      const response = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error uploading file");
      }

      const data = await response.json();
      await simulateProgress();
      if (data.error) {
        throw new Error(data.error);
      } else {
        setQuestions(data.questions);
        setShowQuiz(true);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setError(error instanceof Error ? error.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
      setLoadingProgress(0);
    }
  };

  const ErrorDisplay = ({ message }: { message: string }) => (
    <div className="animate-in slide-in-from-top-4 fade-in duration-300 w-full bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3 mb-6">
      <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
      <div>
        <h3 className="font-medium text-red-500 mb-1">Error</h3>
        <p className="text-red-200/80 text-sm">{message}</p>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen w-screen bg-[#0A0A0F] text-white flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,_#5865F2_0%,_transparent_50%)] opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,_#7289DA_0%,_transparent_50%)] opacity-20" />

        <div className="w-full max-w-md relative">
          <div className="text-center">
            <div className="relative mb-8">
              <div className="w-20 h-20 mx-auto relative">
                <Loader2 className="w-20 h-20 text-[#5865F2] animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-semibold">{loadingProgress}%</span>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-4">Generating Your Quiz</h2>
            <p className="text-gray-400 mb-8">Please wait while we process your content...</p>

            <div className="w-full bg-[#ffffff]/[0.05] rounded-full h-2 mb-6">
              <div
                className="bg-[#5865F2] h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showQuiz) {
    return (
      <div className="min-h-screen w-screen bg-[#0A0A0F] text-white flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,_#5865F2_0%,_transparent_50%)] opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,_#7289DA_0%,_transparent_50%)] opacity-20" />

        <div className="w-full max-w-3xl relative">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={resetQuiz}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <House className="w-5 h-5" />
              Back to Home
            </button>
            <div className="text-gray-400">
              Question {currentQuestion + 1} of {questions.length}
            </div>
          </div>

          {showScore ? (
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-6">Quiz Complete!</h2>
              <p className="text-2xl mb-8">
                Your score: <span className="text-[#5865F2]">{score}</span> out of {questions.length}
              </p>
              <button
                onClick={resetQuiz}
                className="inline-flex items-center gap-2 bg-[#5865F2] hover:bg-[#4752c4] px-6 py-3 rounded-xl transition-all duration-300"
              >
                <RefreshCw className="w-5 h-5" />
                Try Again
              </button>
            </div>
          ) : (
            <>
              <div className="bg-[#ffffff]/[0.02] backdrop-blur-sm rounded-2xl p-8 mb-6">
                <h2 className="text-2xl font-medium mb-8">
                  {questions[currentQuestion].question}
                </h2>
                <div className="grid gap-4">
                  {questions[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      className={`p-4 rounded-xl text-left transition-all duration-300 ${selectedAnswer === index
                        ? 'bg-[#5865F2] text-white'
                        : 'bg-[#ffffff]/[0.05] hover:bg-[#ffffff]/[0.1]'
                        }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleNextQuestion}
                disabled={selectedAnswer === null}
                className={`w-full py-4 px-6 rounded-xl font-medium text-lg flex items-center justify-center gap-2 transition-all duration-300 ${selectedAnswer === null
                  ? 'bg-gray-700 cursor-not-allowed'
                  : 'bg-[#5865F2] hover:bg-[#4752c4]'
                  }`}
              >
                {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  if (showApiInput) {
    return (
      <div className="min-h-screen w-screen bg-[#0A0A0F] text-white flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,_#5865F2_0%,_transparent_50%)] opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,_#7289DA_0%,_transparent_50%)] opacity-20" />

        <div className="w-full max-w-md relative">
          <button
            onClick={resetQuiz}
            className="absolute -top-20 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <House className="w-5 h-5" />
            Back to Home
          </button>

          <div className="bg-[#ffffff]/[0.02] backdrop-blur-sm rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-8">
              <Key className="w-8 h-8 text-[#5865F2]" />
              <h2 className="text-2xl font-bold">Enter Open API Key</h2>
            </div>

            <form onSubmit={handleStartQuiz}>
              <div className="mb-6">
                <label htmlFor="apiKey" className="block text-sm font-medium text-gray-400 mb-2">
                  AI API Key
                </label>
                <input
                  type="password"
                  id="apiKey"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full bg-[#ffffff]/[0.05] border border-[#ffffff]/[0.1] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#5865F2] focus:border-transparent transition-all duration-300"
                  placeholder="Enter your API key"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 px-6 bg-[#5865F2] hover:bg-[#4752c4] transition-all duration-300 rounded-xl font-medium text-lg flex items-center justify-center gap-2"
              >
                Start Quiz
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            <div className="mt-6 flex items-start gap-3 text-sm text-gray-500">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <p>
                Your API key is stored locally and will only be used for generating your quizzes.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-[#0A0A0F] text-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,_#5865F2_0%,_transparent_50%)] opacity-20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,_#7289DA_0%,_transparent_50%)] opacity-20" />

      <div className="w-full max-w-2xl relative">
        <div className="flex items-center justify-center gap-3 mb-12">
          <Zap className="w-12 h-12 text-[#5865F2]" />
          <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#5865F2] to-[#7289DA]">
            Quizly
          </h1>
        </div>

        <p className="text-center text-gray-400 text-lg mb-12">
          Transform your content into engaging quizzes in seconds
        </p>

        {error && <ErrorDisplay message={error} />}

        <div
          className={`relative border-2 border-dashed rounded-2xl backdrop-blur-sm p-10 transition-all duration-300 ${isDragging
            ? 'border-[#5865F2] bg-[#5865F2]/10 scale-[1.02] shadow-2xl shadow-[#5865F2]/20'
            : 'border-gray-800 hover:border-[#5865F2]/50 hover:bg-[#ffffff]/[0.02] hover:scale-[1.01]'
            }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileChange}
            accept=",.pdf,.doc,.docx"
          />

          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center cursor-pointer"
          >
            {file ? (
              <>
                <FileUp className="w-20 h-20 mb-6 text-[#5865F2]" />
                <p className="text-xl font-medium mb-3">Selected file: {file.name}</p>
                <p className="text-sm text-gray-500">Click or drag to change file</p>
              </>
            ) : (
              <>
                <Upload className="w-20 h-20 mb-6 text-gray-600 group-hover:text-[#5865F2] transition-colors" />
                <p className="text-xl font-medium mb-3">Drop your file here</p>
                <p className="text-sm text-gray-500">or click to browse</p>
              </>
            )}
          </label>

          <div className="mt-8 flex items-start gap-3 text-sm text-gray-500 bg-[#ffffff]/[0.02] p-4 rounded-xl">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-400 mb-1">Supported formats</p>
              <p>
                Upload your file in .pdf .doc .docx format.
              </p>
            </div>
          </div>
        </div>

        {file && (
          <button
            className="mt-8 w-full py-4 px-6 bg-[#5865F2] hover:bg-[#4752c4] transition-all duration-300 rounded-xl font-medium text-lg flex items-center justify-center gap-2 hover:gap-3 group"
            onClick={handleGenerateQuiz}
          >
            Generate Quiz
            <Zap className="w-5 h-5 transition-all duration-300 group-hover:scale-110" />
          </button>
        )}
      </div>
    </div>
  );
}
