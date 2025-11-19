
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { trpc, trpcClient } from "@/utils/trpc";
import { Button } from "@/components/ui/button";
import { Scroll, Brain, Puzzle, Search, Trophy, Coins, Sparkles, X } from "lucide-react";
import { useState } from "react";
import QuizInterface from "@/components/quiz-interface";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function MissionsPage() {
	const { data: missions, isLoading } = useQuery(trpc.mission.list.queryOptions());
	const [activeMission, setActiveMission] = useState<any | null>(null);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary" />
			</div>
		);
	}

	return (
		<div className="min-h-screen p-8 relative overflow-hidden">
			{/* Background */}
			<div className="fixed inset-0 bg-gradient-to-br from-background via-accent/5 to-background pointer-events-none" />
			<div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-secondary/10 via-transparent to-transparent pointer-events-none" />
			
			<div className="relative z-10 container mx-auto max-w-7xl space-y-8">
				<div className="text-center space-y-4">
					<h1 className="text-5xl font-bold bg-gradient-to-r from-accent via-primary to-secondary bg-clip-text text-transparent">
						Mission Board
					</h1>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						Accept quests, complete challenges, and earn rewards to strengthen your guild
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{missions?.map((mission) => (
						<MissionCard 
							key={mission.id} 
							mission={mission} 
							onStart={() => setActiveMission(mission)}
						/>
					))}
				</div>
			</div>

			{/* Mission Modal */}
			<Dialog open={!!activeMission} onOpenChange={(open) => !open && setActiveMission(null)}>
				<DialogContent className="max-w-3xl h-[80vh] flex flex-col p-0 overflow-hidden bg-background/95 backdrop-blur-xl border-primary/20">
					<DialogHeader className="p-6 border-b border-border bg-muted/20">
						<DialogTitle className="text-2xl font-bold flex items-center gap-3">
							{activeMission?.type === "quiz" && <Brain className="w-6 h-6 text-primary" />}
							{activeMission?.title}
						</DialogTitle>
					</DialogHeader>
					
					<div className="flex-1 overflow-y-auto p-6">
						{activeMission && (
							activeMission.content ? (
								<QuizInterface 
									missionId={activeMission.id} 
									content={activeMission.content as any} 
									onComplete={() => setActiveMission(null)} 
								/>
							) : (
								<div className="text-center p-12 text-muted-foreground">
									This mission has no content yet.
								</div>
							)
						)}
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}

interface MissionCardProps {
	mission: {
		id: string;
		title: string;
		description: string;
		type: string;
		difficulty: number;
		rewards: any;
	};
	onStart: () => void;
}

function MissionCard({ mission, onStart }: MissionCardProps) {
	const queryClient = useQueryClient();
	const startMutation = useMutation({
		mutationFn: async () => {
			return await trpcClient.mission.start.mutate({ missionId: mission.id });
		},
		onSuccess: () => {
			onStart();
		}
	});

	const rewards = mission.rewards as { coins?: number; parts?: number; xp?: number };
	const typeIcon = getMissionTypeIcon(mission.type);
	const difficultyStars = "★".repeat(mission.difficulty) + "☆".repeat(Math.max(0, 3 - mission.difficulty));
	const typeColor = getMissionTypeColor(mission.type);

	return (
		<div className="group relative h-full p-6 rounded-2xl bg-card border-2 border-border hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden flex flex-col">
			{/* Glow effect */}
			<div className={`absolute inset-0 bg-gradient-to-br ${typeColor} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity`} />
			
			<div className="relative z-10 space-y-4 h-full flex flex-col">
				{/* Header */}
				<div className="flex items-start justify-between">
					<div className="flex items-center gap-3">
						<div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${typeColor} flex items-center justify-center shadow-lg`}>
							{typeIcon}
						</div>
						<div>
							<div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
								{mission.type}
							</div>
							<div className="text-yellow-500 text-sm">{difficultyStars}</div>
						</div>
					</div>
				</div>

				{/* Content */}
				<div className="flex-1 space-y-2">
					<h3 className="text-2xl font-bold">{mission.title}</h3>
					<p className="text-sm text-muted-foreground leading-relaxed">
						{mission.description}
					</p>
				</div>

				{/* Rewards */}
				<div className="pt-4 border-t border-border space-y-3">
					<div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Rewards</div>
					<div className="flex items-center gap-4 flex-wrap">
						{rewards.coins && (
							<div className="flex items-center gap-1.5">
								<Coins className="w-4 h-4 text-secondary" />
								<span className="text-sm font-medium">{rewards.coins}</span>
							</div>
						)}
						{rewards.parts && (
							<div className="flex items-center gap-1.5">
								<Puzzle className="w-4 h-4 text-accent" />
								<span className="text-sm font-medium">{rewards.parts}</span>
							</div>
						)}
						{rewards.xp && (
							<div className="flex items-center gap-1.5">
								<Sparkles className="w-4 h-4 text-primary" />
								<span className="text-sm font-medium">{rewards.xp} XP</span>
							</div>
						)}
					</div>
				</div>

				{/* Actions */}
				<Button
					onClick={() => startMutation.mutate()}
					disabled={startMutation.isPending}
					className="w-full"
				>
					{startMutation.isPending ? "Starting..." : "Start Mission"}
				</Button>
			</div>
		</div>
	);
}

function getMissionTypeIcon(type: string) {
	switch (type) {
		case "quiz":
			return <Brain className="w-6 h-6 text-white" />;
		case "puzzle":
			return <Puzzle className="w-6 h-6 text-white" />;
		case "research":
			return <Search className="w-6 h-6 text-white" />;
		default:
			return <Scroll className="w-6 h-6 text-white" />;
	}
}

function getMissionTypeColor(type: string) {
	switch (type) {
		case "quiz":
			return "from-primary to-primary/50";
		case "puzzle":
			return "from-accent to-accent/50";
		case "research":
			return "from-secondary to-secondary/50";
		default:
			return "from-chart-1 to-chart-1/50";
	}
}
