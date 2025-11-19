"use client";

import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
import { Trophy, Users, Crown, Target, Shield } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function LeaderboardPage() {
	const [activeTab, setActiveTab] = useState<"players" | "guilds">("players");
	const { data: topPlayers, isLoading: loadingPlayers } = useQuery(trpc.leaderboard.topPlayers.queryOptions());
	const { data: topGuilds, isLoading: loadingGuilds } = useQuery(trpc.leaderboard.topGuilds.queryOptions());

	const isLoading = activeTab === "players" ? loadingPlayers : loadingGuilds;

	return (
		<div className="min-h-screen p-8 relative overflow-hidden">
			{/* Background */}
			<div className="fixed inset-0 bg-gradient-to-br from-background via-yellow-500/5 to-background pointer-events-none" />
			
			<div className="relative z-10 container mx-auto max-w-7xl space-y-8">
				{/* Header */}
				<div className="text-center space-y-4">
					<div className="flex items-center justify-center gap-3">
						<Trophy className="w-12 h-12 text-yellow-500" />
						<h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
							Leaderboard
						</h1>
					</div>
					<p className="text-lg text-muted-foreground">
						Top players and guilds competing for glory
					</p>
				</div>

				{/* Tabs */}
				<div className="flex justify-center gap-4">
					<button
						onClick={() => setActiveTab("players")}
						className={cn(
							"px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2",
							activeTab === "players"
								? "bg-primary text-primary-foreground shadow-lg shadow-primary/50"
								: "bg-card border border-border hover:border-primary/50"
						)}
					>
						<Users className="w-5 h-5" />
						Top Players
					</button>
					<button
						onClick={() => setActiveTab("guilds")}
						className={cn(
							"px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2",
							activeTab === "guilds"
								? "bg-primary text-primary-foreground shadow-lg shadow-primary/50"
								: "bg-card border border-border hover:border-primary/50"
						)}
					>
						<Shield className="w-5 h-5" />
						Top Guilds
					</button>
				</div>

				{/* Content */}
				{isLoading ? (
					<div className="flex items-center justify-center py-20">
						<div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary" />
					</div>
				) : (
					<div className="space-y-4">
						{activeTab === "players" ? (
							<>
								{topPlayers?.length === 0 ? (
									<div className="text-center py-20 text-muted-foreground">
										No players yet. Be the first to climb the ranks!
									</div>
								) : (
									topPlayers?.map((player, index) => (
										<div
											key={player.userId}
											className={cn(
												"p-4 rounded-xl bg-card border-2 transition-all hover:scale-[1.02] flex items-center gap-4",
												index === 0 && "border-yellow-500 shadow-lg shadow-yellow-500/20",
												index === 1 && "border-gray-400 shadow-lg shadow-gray-400/20",
												index === 2 && "border-orange-700 shadow-lg shadow-orange-700/20",
												index > 2 && "border-border hover:border-primary/50"
											)}
										>
											{/* Rank */}
											<div className={cn(
												"w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl",
												index === 0 && "bg-yellow-500/20 text-yellow-500",
												index === 1 && "bg-gray-400/20 text-gray-400",
												index === 2 && "bg-orange-700/20 text-orange-700",
												index > 2 && "bg-muted text-muted-foreground"
											)}>
												{index === 0 ? <Crown className="w-6 h-6" /> : index + 1}
											</div>

											{/* Player Info */}
											<div className="flex-1">
												<div className="font-bold text-lg">{player.user.name}</div>
												<div className="text-sm text-muted-foreground">
													{player.guild ? `${player.guild.name}` : "No Guild"}
												</div>
											</div>

											{/* Stats */}
											<div className="flex gap-6 text-center">
												<div>
													<div className="text-xs text-muted-foreground uppercase">Level</div>
													<div className="text-lg font-bold text-primary">{player.level}</div>
												</div>
												<div>
													<div className="text-xs text-muted-foreground uppercase">XP</div>
													<div className="text-lg font-bold text-accent">{player.experience}</div>
												</div>
											</div>
										</div>
									))
								)}
							</>
						) : (
							<>
								{topGuilds?.length === 0 ? (
									<div className="text-center py-20 text-muted-foreground">
										No guilds yet. Create one and start conquering!
									</div>
								) : (
									topGuilds?.map((guild, index) => (
										<div
											key={guild.id}
											className={cn(
												"p-4 rounded-xl bg-card border-2 transition-all hover:scale-[1.02] flex items-center gap-4",
												index === 0 && "border-yellow-500 shadow-lg shadow-yellow-500/20",
												index === 1 && "border-gray-400 shadow-lg shadow-gray-400/20",
												index === 2 && "border-orange-700 shadow-lg shadow-orange-700/20",
												index > 2 && "border-border hover:border-primary/50"
											)}
										>
											{/* Rank */}
											<div className={cn(
												"w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl",
												index === 0 && "bg-yellow-500/20 text-yellow-500",
												index === 1 && "bg-gray-400/20 text-gray-400",
												index === 2 && "bg-orange-700/20 text-orange-700",
												index > 2 && "bg-muted text-muted-foreground"
											)}>
												{index === 0 ? <Crown className="w-6 h-6" /> : index + 1}
											</div>

											{/* Guild Info */}
											<div className="flex-1">
												<div className="font-bold text-lg flex items-center gap-2">
													<Shield className="w-5 h-5 text-primary" />
													{guild.name}
												</div>
												<div className="text-sm text-muted-foreground">
													{guild.description || "No description"}
												</div>
											</div>

											{/* Stats */}
											<div className="flex gap-6 text-center">
												<div>
													<div className="text-xs text-muted-foreground uppercase">Members</div>
													<div className="text-lg font-bold text-primary">{guild.memberCount}</div>
												</div>
												<div>
													<div className="text-xs text-muted-foreground uppercase">Score</div>
													<div className="text-lg font-bold text-accent">{guild.totalScore}</div>
												</div>
												<div>
													<div className="text-xs text-muted-foreground uppercase">Territory</div>
													<div className="text-lg font-bold text-secondary">{guild.totalTerritory}%</div>
												</div>
											</div>
										</div>
									))
								)}
							</>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
