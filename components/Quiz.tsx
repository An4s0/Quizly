import React, { useState, useEffect, useCallback } from 'react'
import { ArrowRight, RefreshCw, House, Loader2 } from 'lucide-react';

interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: number;
}

interface QuizProps {
    setError: (error: string | null) => void;
    file: File | null;
    setShowQuiz: (showQuiz: boolean) => void;
    setFile: (file: File | null) => void;
}

const Quiz: React.FC<QuizProps> = ({ setError, file, setFile, setShowQuiz }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);

    const handleStartQuiz = useCallback(async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        setIsLoading(true);
        setLoadingProgress(0);
        setError(null);

        try {
            if (!file) {
                setError("Please select a file first.");
                return;
            }

            const formData = new FormData();
            formData.append('file', file);

            // Fake loading progress
            for (let i = 0; i <= 100; i++) {
                setTimeout(() => {
                    setLoadingProgress(i);
                }, i * 500);
            }

            const response = await fetch('/api/generate', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "An unexpected error occurred");
            }

            const data = await response.json();

            if (!data.questions) {
                throw new Error("Failed to generate quiz questions");
            }

            setQuestions(data.questions);
            setShowQuiz(true);

        } catch (error) {
            console.error("Error uploading file:", error);
            setError(error instanceof Error ? error.message : "An unexpected error occurred");
        } finally {
            setIsLoading(false);
            setLoadingProgress(0);
        }
    }, [file, setError, setShowQuiz]);

    useEffect(() => {
        handleStartQuiz();
    }, [handleStartQuiz]);

    const resetQuiz = () => {
        setScore(0);
        setCurrentQuestion(0);
        setSelectedAnswer(null);
        setShowScore(false);
    };

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


    if (isLoading) {
        return (
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
        );
    }


    return (
        <div className="w-full max-w-3xl relative">
            <div className="flex items-center justify-between mb-8">
                <button
                    onClick={() => {
                        setShowQuiz(false);
                        setFile(null);
                        setShowQuiz(false);
                        setError(null);
                    }}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                    <House className="w-5 h-5" />
                    Back to Home
                </button>
                {questions.length > 0 && (
                    <div className="text-gray-400">
                        Question {currentQuestion + 1} of {questions.length}
                    </div>
                )}
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
                    {questions.length > 0 ? (
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
                    ) : (
                        <div className="text-center">
                            <h2 className="text-3xl font-bold mb-6">No Questions Found</h2>
                            <p className="text-lg mb-8">
                                Please try again or upload a smallest file.
                            </p>
                            <button
                                onClick={() => {
                                    setShowQuiz(false);
                                    setFile(null);
                                    setShowQuiz(false);
                                    setError(null);
                                }}
                                className="inline-flex items-center gap-2 bg-[#5865F2] hover:bg-[#4752c4] px-6 py-3 rounded-xl transition-all duration-300"
                            >
                                <RefreshCw className="w-5 h-5" />
                                Try Again
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default Quiz