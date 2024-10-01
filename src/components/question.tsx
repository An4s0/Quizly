interface Answer {
    answer: string;
    isCorrect: boolean;
}

interface QuestionProps {
    number: number;
    total: number;
    question: string;
    answers: Answer[];
    selectedOption: number | null;
    handleOptionClick: (index: number) => void;
    handlePrev: () => void;
    handleNext: () => void;
}

const Question: React.FC<QuestionProps> = ({
    number,
    total,
    question,
    answers,
    selectedOption,
    handleOptionClick,
    handlePrev,
    handleNext,
}) => {
    return (
        <div className="absolute justify-center mt-[100px] md">
            <h4 className="flex justify-center text-zinc-300 font-bold">
                Question {number} / {total}
            </h4>
            <h3 className="text-2xl font-bold mt-8">{question}</h3>
            <div className="mt-8">
                {answers.map((answer, idx) => (
                    <div
                        key={idx}
                        className={`w-full border cursor-pointer hover:bg-zinc-800 border-zinc-400 rounded-md flex items-center p-4 mb-4 ${selectedOption === idx ? 'bg-zinc-800' : ''
                            }`}
                        onClick={() => handleOptionClick(idx)}
                    >
                        <label htmlFor={`option-${idx}`} className="cursor-pointer">
                            {answer.answer}
                        </label>
                    </div>
                ))}
            </div>
            <div className="navigation-buttons flex justify-between mt-4">
                <button
                    onClick={handlePrev}
                    disabled={number === 1}
                    className={`bg-zinc-800 rounded-md pt-3 pb-3 pl-6 pr-6 ${number === 1 ? 'cursor-not-allowed' : 'hover:bg-zinc-700'}`}
                >
                    Previous
                </button>
                <button
                    onClick={handleNext}
                    className="bg-zinc-800 rounded-md pt-3 pb-3 pl-6 pr-6 hover:bg-zinc-700"
                >
                    {number === total ? 'Finish' : 'Next'}
                </button>
            </div>
        </div>
    );
};

export default Question;