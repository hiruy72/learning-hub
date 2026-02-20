"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { submitExamAttempt } from "@/actions/exam";
import { Timer, CheckCircle2, AlertCircle } from "lucide-react";

export default function ExamTakePage({ params }: { params: { id: string } }) {
    const [exam, setExam] = useState<any>(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<number[]>([]);
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [isFinished, setIsFinished] = useState(false);
    const [score, setScore] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Mock fetching for now, in real it would be a server action
    useEffect(() => {
        // In production, this would be an async call to getExamById
        const mockExam = {
            id: params.id,
            title: "Introduction to Computer Systems",
            timeLimit: 15,
            questions: [
                { text: "What is the main function of the CPU?", options: ["Storage", "Processing", "Networking", "Input"], answer: 1 },
                { text: "Which language is used for web styling?", options: ["Python", "HTML", "CSS", "SQL"], answer: 2 },
                { text: "What does RAM stand for?", options: ["Read Access Memory", "Random Access Memory", "Run Active Module", "Rapid Access Mainframe"], answer: 1 },
            ]
        };
        setExam(mockExam);
        setAnswers(new Array(mockExam.questions.length).fill(-1));
        setTimeLeft(mockExam.timeLimit * 60);
    }, [params.id]);

    useEffect(() => {
        if (timeLeft > 0 && !isFinished) {
            const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0 && !isFinished && exam) {
            handleFinish();
        }
    }, [timeLeft, isFinished, exam]);

    const handleAnswer = (optionIndex: number) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = optionIndex;
        setAnswers(newAnswers);
    };

    const handleFinish = async () => {
        setLoading(true);
        try {
            const result = await submitExamAttempt({
                examId: params.id,
                answers
            });
            setScore(result.score);
            setIsFinished(true);
        } catch (error) {
            console.error(error);
            // Fallback for demo if DB fails
            const mockScore = Math.round((answers.filter((a, i) => a === exam.questions[i].answer).length / exam.questions.length) * 100);
            setScore(mockScore);
            setIsFinished(true);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    if (!exam) return <div className="p-24 text-center">Loading exam...</div>;

    if (isFinished) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-zinc-950 border border-white/10 rounded-3xl p-12 text-center max-w-md w-full"
                >
                    <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8">
                        <CheckCircle2 className="h-12 w-12 text-black" />
                    </div>
                    <h1 className="text-3xl font-bold uppercase mb-2">Exam Completed</h1>
                    <p className="text-gray-500 uppercase text-xs tracking-widest mb-8">Your results have been recorded</p>

                    <div className="text-6xl font-black mb-8">
                        {score}%
                    </div>

                    <div className="space-y-4">
                        <p className="text-sm text-gray-400 uppercase tracking-widest">
                            You scored {score === 100 ? "perfectly!" : "well done!"}
                        </p>
                        <Button onClick={() => router.push("/dashboard/exams")} className="w-full bg-white text-black hover:bg-gray-200 uppercase font-bold tracking-widest h-12">
                            Back to Dashboard
                        </Button>
                    </div>
                </motion.div>
            </div>
        );
    }

    const progress = ((currentQuestion + 1) / exam.questions.length) * 100;

    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl">
            <div className="flex items-center justify-between mb-12">
                <div>
                    <h1 className="text-2xl font-bold uppercase tracking-tight">{exam.title}</h1>
                    <p className="text-gray-500 uppercase text-[10px] font-bold tracking-[0.2em] mt-1">
                        Question {currentQuestion + 1} of {exam.questions.length}
                    </p>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${timeLeft < 60 ? 'border-red-500 text-red-500 bg-red-500/10' : 'border-white/10 text-white bg-white/5'}`}>
                    <Timer className="h-4 w-4" />
                    <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
                </div>
            </div>

            <div className="w-full h-1 bg-zinc-900 rounded-full mb-12 overflow-hidden">
                <motion.div
                    className="h-full bg-white"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                />
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-zinc-950 border border-white/10 rounded-2xl p-8 sm:p-12"
                >
                    <h2 className="text-2xl font-bold mb-8 leading-tight">
                        {exam.questions[currentQuestion].text}
                    </h2>

                    <div className="space-y-4">
                        {exam.questions[currentQuestion].options.map((option: string, index: number) => (
                            <button
                                key={index}
                                onClick={() => handleAnswer(index)}
                                className={`w-full p-6 text-left rounded-xl border transition-all duration-200 uppercase text-xs tracking-widest font-bold ${answers[currentQuestion] === index
                                        ? 'bg-white text-black border-white'
                                        : 'bg-transparent text-gray-400 border-white/10 hover:border-white/30 hover:text-white'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <span className={`h-6 w-6 rounded-full border flex items-center justify-center text-[10px] ${answers[currentQuestion] === index ? 'border-black' : 'border-white/20'
                                        }`}>
                                        {String.fromCharCode(65 + index)}
                                    </span>
                                    {option}
                                </div>
                            </button>
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>

            <div className="flex justify-between items-center mt-12">
                <Button
                    variant="ghost"
                    disabled={currentQuestion === 0}
                    onClick={() => setCurrentQuestion(prev => prev - 1)}
                    className="uppercase text-xs font-bold tracking-widest text-gray-500 hover:text-white"
                >
                    Previous
                </Button>

                {currentQuestion === exam.questions.length - 1 ? (
                    <Button
                        onClick={handleFinish}
                        disabled={loading || answers.some(a => a === -1)}
                        className="bg-white text-black hover:bg-gray-200 h-12 px-8 uppercase font-bold tracking-widest"
                    >
                        {loading ? "Submitting..." : "Finish Exam"}
                    </Button>
                ) : (
                    <Button
                        onClick={() => setCurrentQuestion(prev => prev + 1)}
                        disabled={answers[currentQuestion] === -1}
                        className="bg-white text-black hover:bg-gray-200 h-12 px-8 uppercase font-bold tracking-widest"
                    >
                        Next Question
                    </Button>
                )}
            </div>
        </div>
    );
}
