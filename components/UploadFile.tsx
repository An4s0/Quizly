"use client";
import React, { useState, useCallback } from 'react'
import { Upload, FileUp, AlertCircle, Zap, XCircle } from 'lucide-react';
import Quiz from './Quiz';

const UploadFile = () => {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showQuiz, setShowQuiz] = useState<boolean>(false);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setShowQuiz(false);
        }
    }, []);

    return (
        <div className="min-h-screen w-screen flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,_#5865F2_0%,_transparent_50%)] opacity-20" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,_#7289DA_0%,_transparent_50%)] opacity-20" />

            {!showQuiz && (
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

                    {error && (
                        <div className="animate-in slide-in-from-top-4 fade-in duration-300 w-full bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3 mb-6">
                            <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-medium text-red-500 mb-1">Error</h3>
                                <p className="text-red-200/80 text-sm">{error}</p>
                            </div>
                        </div>
                    )}

                    <div
                        className={`relative border-2 border-dashed rounded-2xl backdrop-blur-sm p-10 transition-all duration-300 ${file
                            ? 'border-[#5865F2] bg-[#5865F2]/10 scale-[1.02] shadow-2xl shadow-[#5865F2]/20'
                            : 'border-gray-800 hover:border-[#5865F2]/50 hover:bg-[#ffffff]/[0.02] hover:scale-[1.01]'
                            }`}
                    >
                        <input
                            type="file"
                            id="file-upload"
                            className="hidden"
                            onChange={handleFileChange}
                            accept=",.pdf,.doc,.docx,.ppt,.pptx"
                        />

                        <label
                            htmlFor="file-upload"
                            className="flex flex-col items-center justify-center cursor-pointer"
                        >
                            {file ? (
                                <>
                                    <FileUp className="w-20 h-20 mb-6 text-[#5865F2]" />
                                    <p className="text-xl font-medium mb-3">Selected file: {file.name}</p>
                                    <p className="text-sm text-gray-500">Click to change file</p>
                                </>
                            ) : (
                                <>
                                    <Upload className="w-20 h-20 mb-6 text-gray-600 group-hover:text-[#5865F2] transition-colors" />
                                    <p className="text-xl font-medium mb-3">Click to browse</p>
                                </>
                            )}
                        </label>

                        <div className="mt-8 flex items-start gap-3 text-sm text-gray-500 bg-[#ffffff]/[0.02] p-4 rounded-xl">
                            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-medium text-gray-400 mb-1">Supported formats</p>
                                <p>
                                    Upload your file in .pdf .doc .docx .pptx .ppt format.
                                </p>
                            </div>
                        </div>
                    </div>

                    {file && !showQuiz && (
                        <button
                            className="mt-8 w-full py-4 px-6 bg-[#5865F2] hover:bg-[#4752c4] transition-all duration-300 rounded-xl font-medium text-lg flex items-center justify-center gap-2 hover:gap-3 group"
                            onClick={() => setShowQuiz(true)}
                        >
                            Generate Quiz
                            <Zap className="w-5 h-5 transition-all duration-300 group-hover:scale-110" />
                        </button>
                    )}


                </div>
            )}

            {showQuiz && file && (
                <Quiz setError={setError} setFile={setFile} file={file} setShowQuiz={setShowQuiz} />
            )}
        </div>
    )
}

export default UploadFile