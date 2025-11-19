"use client";

import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Swords, Users, Trophy } from "lucide-react";
import Link from "next/link";

export default function RegionPage() {
	const params = useParams();
	const regionId = params.id as string;
	const { data: region, isLoading } = useQuery(trpc.map.getRegion.queryOptions({ regionId }));

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary" />
			</div>
		);
	}

	if (!region) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center space-y-4">
					<h1 className="text-2xl font-bold">Region Not Found</h1>
					<Link href="/map">
						<Button variant="outline">Return to Map</Button>
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen p-8 relative">
			{/* Background */}
			<div className="fixed inset-0 bg-background pointer-events-none" />
			<div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none" />

			<div className="relative z-10 container mx-auto max-w-5xl space-y-8">
				{/* Header */}
				<div className="flex items-center gap-4">
					<Link href="/map">
						<Button variant="ghost" size="icon" className="rounded-full">
							<ArrowLeft className="w-6 h-6" />
						</Button>
					</Link>
					<div>
						<h1 className="text-4xl font-bold text-primary">{region.name}</h1>
						<p className="text-muted-foreground">{region.description}</p>
					</div>
				</div>

				{/* Active Sessions */}
				<div className="space-y-6">
					<h2 className="text-2xl font-bold flex items-center gap-2">
						<Swords className="w-6 h-6 text-destructive" />
						Active Battles
					</h2>

					<div className="grid gap-4">
						{region.sessions.length === 0 ? (
							<div className="p-8 rounded-xl bg-card border border-dashed border-border text-center text-muted-foreground">
								No active battles in this region.
							</div>
						) : (
							region.sessions.map((session) => (
								<div key={session.id} className="p-6 rounded-xl bg-card border border-border space-y-6">
									<div className="flex items-center justify-between">
										<div className="space-y-1">
											<div className="flex items-center gap-2">
												<span className="font-bold text-lg">Battle for Control</span>
												<span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-xs font-bold uppercase">
													{session.status}
												</span>
											</div>
											<div className="flex items-center gap-4 text-sm text-muted-foreground">
												<div className="flex items-center gap-1">
													<Users className="w-4 h-4" />
													<span>{session.guilds.length} Guilds Fighting</span>
												</div>
											</div>
										</div>
									</div>

									{/* Leaderboard */}
									<div className="space-y-3">
										<h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Leaderboard</h3>
										{session.guilds.length === 0 ? (
											<div className="text-sm text-muted-foreground italic">No guilds have joined yet.</div>
										) : (
											<div className="space-y-2">
												{session.guilds
													.sort((a, b) => b.score - a.score)
													.map((gs, index) => (
													<div key={gs.guildId} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border">
														<div className="flex items-center gap-3">
															<div className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
																index === 0 ? "bg-yellow-500/20 text-yellow-500" : 
																index === 1 ? "bg-gray-400/20 text-gray-400" : 
																index === 2 ? "bg-orange-700/20 text-orange-700" : "bg-muted text-muted-foreground"
															}`}>
																{index + 1}
															</div>
															<span className="font-medium">{gs.guild.name}</span>
														</div>
														<div className="flex items-center gap-2">
															<Trophy className="w-4 h-4 text-primary" />
															<span className="font-bold">{gs.score}</span>
														</div>
													</div>
												))}
											</div>
										)}
									</div>
								</div>
							))
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
