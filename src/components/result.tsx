import React from 'react';

interface Answer {
    answer: string;
    isCorrect: boolean;
}

interface Question {
    question: string;
    answers: Answer[];
    explanation: string;
}

interface ResultProps {
    grade: number | null;
    quiz: Question[];
    userAnswers: number[];
    handleRestartQuiz: () => void;
}

const Result: React.FC<ResultProps> = ({ grade, quiz, userAnswers, handleRestartQuiz }) => {
    return (
        <div className="absolute justify-center mt-[50px] pb-[150px] md">
            <h4 className="flex justify-center text-zinc-300 font-bold">Your Score: {grade}/{quiz.length}</h4>
            {quiz.map((question, index) => (
                <div key={index}>
                    <h3 className="text-2xl font-bold mt-8">{question.question}</h3>
                    <div className="mt-4">
                        {question.answers.map((answer, ansIdx) => (
                            <div
                                key={ansIdx}
                                className={`w-full border border-zinc-400 rounded-md flex items-center p-4 mb-4 ${userAnswers[index] === ansIdx ? (question.answers[ansIdx]?.isCorrect ? 'bg-green-900' : 'bg-red-900') : ''
                                    } ${answer.isCorrect ? 'bg-green-900' : ''}`}
                            >
                                <label>{answer.answer}</label>
                            </div>
                        ))}
                    </div>
                    <p className="text-md font-bold flex items-center">
                        <svg
                            width="26"
                            height="26"
                            fill="#6b6b6b"
                            viewBox="0 0 32 32"
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-2"
                        >
                            <path d="M0 16q0 3.264 1.28 6.208t3.392 5.12 5.12 3.424 6.208 1.248 6.208-1.248 5.12-3.424 3.392-5.12 1.28-6.208-1.28-6.208-3.392-5.12-5.088-3.392-6.24-1.28q-3.264 0-6.208 1.28t-5.12 3.392-3.392 5.12-1.28 6.208zM4 16q0-3.264 1.6-6.016t4.384-4.352 6.016-1.632 6.016 1.632 4.384 4.352 1.6 6.016-1.6 6.048-4.384 4.352-6.016 1.6-6.016-1.6-4.384-4.352-1.6-6.048zM12 10.016q0 0.992 0.512 2.976t0.992 3.52l0.512 1.504q0 0.832 0.576 1.408t1.408 0.576 1.408-0.576 0.608-1.408l1.984-8q0-1.664-1.184-2.848t-2.816-1.152-2.816 1.152-1.184 2.848zM14.016 24q0 0.832 0.576 1.44t1.408 0.576 1.408-0.576 0.608-1.44-0.608-1.408-1.408-0.576-1.408 0.576-0.576 1.408z"></path>
                        </svg>
                        {question.explanation}
                    </p>
                </div>
            ))}
            <button onClick={handleRestartQuiz} className="mt-8 ml-[calc(50%-100px)] w-[200px] font-bold bg-zinc-800 rounded-md pt-3 pb-3 pl-6 pr-6 hover:bg-zinc-700">
                Restart Quiz
            </button>
        </div>
    );
};

export default Result;