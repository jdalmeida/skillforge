"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, HelpCircle, ArrowRight } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { trpcClient } from "@/utils/trpc";
import { toast } from "sonner";

interface Question {
	id: string;
	question: string;
	options: string[];
}

interface QuizInterfaceProps {
	missionId: string;
	content: {
		questions: Question[];
	};
	onComplete: (score: number) => void;
}

export default function QuizInterface({ missionId, content, onComplete }: QuizInterfaceProps) {
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [answers, setAnswers] = useState<Record<string, string>>({});
	const [selectedOption, setSelectedOption] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const completeMutation = useMutation({
		mutationFn: async (variables: { missionId: string; answers: Record<string, string> }) => {
			return await trpcClient.mission.complete.mutate(variables);
		},
		onSuccess: (data) => {
			setIsSubmitting(false);
			if (data.success) {
				if (typeof data.score === "number" && data.score < 100) {
					toast.error((data as any).message || "Mission failed. Try again!");
					// Reset quiz to try again
					setCurrentQuestionIndex(0);
					setAnswers({});
					setSelectedOption(null);
				} else {
					toast.success("Mission Completed! Rewards earned.");
					onComplete(data.score || 100);
				}
			}
		},
		onError: (error) => {
			setIsSubmitting(false);
			toast.error(error.message);
		},
	});

	const currentQuestion = content.questions[currentQuestionIndex];
	const isLastQuestion = currentQuestionIndex === content.questions.length - 1;

	const handleNext = () => {
		if (!selectedOption) return;

		const newAnswers = { ...answers, [currentQuestion.id]: selectedOption };
		setAnswers(newAnswers);
		setSelectedOption(null);

		if (isLastQuestion) {
			setIsSubmitting(true);
			completeMutation.mutate({ missionId, answers: newAnswers });
		} else {
			setCurrentQuestionIndex((prev) => prev + 1);
		}
	};

	return (
		<div className="w-full max-w-2xl mx-auto p-6">
			{/* Progress Bar */}
			<div className="mb-8">
				<div className="flex justify-between text-sm text-muted-foreground mb-2">
					<span>Question {currentQuestionIndex + 1} of {content.questions.length}</span>
					<span>{Math.round(((currentQuestionIndex) / content.questions.length) * 100)}% Completed</span>
				</div>
				<div className="h-2 bg-secondary/20 rounded-full overflow-hidden">
					<div 
						className="h-full bg-primary transition-all duration-500 ease-out"
						style={{ width: `${((currentQuestionIndex) / content.questions.length) * 100}%` }}
					/>
				</div>
			</div>

			<AnimatePresence mode="wait">
				<motion.div
					key={currentQuestion.id}
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					exit={{ opacity: 0, x: -20 }}
					className="space-y-6"
				>
					<h3 className="text-2xl font-bold leading-tight">{currentQuestion.question}</h3>

					<div className="grid gap-3">
						{currentQuestion.options.map((option, index) => (
							<button
								key={index}
								onClick={() => setSelectedOption(option)}
								className={`p-4 rounded-xl text-left transition-all duration-200 border-2 ${
									selectedOption === option
										? "border-primary bg-primary/10 shadow-md"
										: "border-border hover:border-primary/50 hover:bg-card/50"
								}`}
							>
								<div className="flex items-center gap-3">
									<div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
										selectedOption === option ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground text-muted-foreground"
									}`}>
										{String.fromCharCode(65 + index)}
									</div>
									<span className={selectedOption === option ? "font-medium" : ""}>{option}</span>
								</div>
							</button>
						))}
					</div>
				</motion.div>
			</AnimatePresence>

			<div className="mt-8 flex justify-end">
				<Button
					onClick={handleNext}
					disabled={!selectedOption || isSubmitting}
					size="lg"
					className="min-w-[140px]"
				>
					{isSubmitting ? (
						"Submitting..."
					) : isLastQuestion ? (
						"Finish Quiz"
					) : (
						<>
							Next Question
							<ArrowRight className="ml-2 w-4 h-4" />
						</>
					)}
				</Button>
			</div>
		</div>
	);
}
