"use client";

import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
import { User, Coins, Puzzle, Trophy, Swords, Shield, Zap } from "lucide-react";

export default function ProfilePage() {
	const { data: player, isLoading } = useQuery(trpc.player.me.queryOptions());

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary" />
			</div>
		);
	}

	if (!player) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<p className="text-muted-foreground">Player profile not found</p>
			</div>
		);
	}

	const equippedItems = player.equipment?.filter((e: any) => e.isEquipped) || [];
	
	// Calculate total stats from equipped items
	const totalStats = equippedItems.reduce((acc: Record<string, number>, item: any) => {
		const stats = item.equipment.stats as Record<string, number> || {};
		for (const [stat, value] of Object.entries(stats)) {
			acc[stat] = (acc[stat] || 0) + value;
		}
		return acc;
	}, {});

	return (
		<div className="min-h-screen p-8 relative overflow-hidden">
			{/* Background */}
			<div className="fixed inset-0 bg-gradient-to-br from-background via-primary/5 to-accent/5 pointer-events-none" />
			
			<div className="relative z-10 container mx-auto max-w-6xl space-y-8">
				{/* Header */}
				<div className="text-center space-y-4">
					<div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary via-accent to-secondary p-1">
						<div className="w-full h-full rounded-full bg-background flex items-center justify-center">
							<User className="w-12 h-12 text-primary" />
						</div>
					</div>
					<h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
						Your Profile
					</h1>
					<p className="text-lg text-muted-foreground">
						{player.guild?.name || "No Guild"}
					</p>
				</div>

				{/* Stats Grid */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					<StatCard icon={<Trophy />} label="Level" value={player.level} gradient="from-primary to-primary/50" />
					<StatCard icon={<Zap />} label="Experience" value={player.experience} gradient="from-accent to-accent/50" />
					<StatCard icon={<Coins />} label="Coins" value={player.coins} gradient="from-secondary to-secondary/50" />
					<StatCard icon={<Puzzle />} label="Parts" value={player.parts} gradient="from-chart-2 to-chart-2/50" />
				</div>

				{/* Total Combat Stats */}
				{Object.keys(totalStats).length > 0 && (
					<div className="p-6 rounded-2xl bg-gradient-to-br from-card via-card to-accent/5 border-2 border-accent/30 shadow-2xl">
						<h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
							<Zap className="w-6 h-6 text-accent" />
							Total Combat Stats
						</h2>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							{Object.entries(totalStats).map(([stat, value]) => (
								<div key={stat} className="p-4 rounded-lg bg-background/50 border border-border text-center">
									<div className="text-xs text-muted-foreground uppercase tracking-wide mb-1 capitalize">
										{stat}
									</div>
									<div className="text-2xl font-bold text-accent">
										+{value}
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Current Class */}
				<div className="p-8 rounded-2xl bg-gradient-to-br from-card via-card to-primary/5 border-2 border-primary/30 shadow-2xl">
					<h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
						<Swords className="w-6 h-6 text-primary" />
						Current Class
					</h2>
					<div className="text-center py-8">
						{player.currentClass ? (
							<div className="space-y-4">
								<div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
									<Shield className="w-10 h-10 text-white" />
								</div>
								<div className="text-3xl font-bold text-primary">{player.currentClass}</div>
								<p className="text-muted-foreground">Your chosen path</p>
							</div>
						) : (
							<div className="space-y-4">
								<Shield className="w-16 h-16 mx-auto text-muted-foreground/30" />
								<p className="text-muted-foreground">No class selected</p>
								<p className="text-sm text-muted-foreground/70">Equip items to define your class</p>
							</div>
						)}
					</div>
				</div>

				{/* Equipped Items */}
				<div>
					<h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
						<Shield className="w-6 h-6 text-accent" />
						Equipped Items
					</h2>
					{equippedItems.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{equippedItems.map((item: any) => (
								<EquipmentCard key={item.id} item={item.equipment} />
							))}
						</div>
					) : (
						<div className="p-12 rounded-xl bg-card border-2 border-dashed border-border text-center">
							<Swords className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
							<p className="text-muted-foreground">No equipment equipped</p>
							<p className="text-sm text-muted-foreground/70 mt-2">Start your journey by equipping items from the shop</p>
						</div>
					)}
				</div>

				{/* Progress Bar */}
				<div className="p-6 rounded-xl bg-card border border-border">
					<div className="flex items-center justify-between mb-2">
						<span className="text-sm font-medium">Progress to Next Level</span>
						<span className="text-sm text-muted-foreground">{player.experience} / {(player.level + 1) * 100} XP</span>
					</div>
					<div className="h-3 bg-muted rounded-full overflow-hidden">
						<div
							className="h-full bg-gradient-to-r from-primary via-accent to-secondary transition-all duration-500"
							style={{ width: `${(player.experience / ((player.level + 1) * 100)) * 100}%` }}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

function StatCard({ icon, label, value, gradient }: { icon: React.ReactNode; label: string; value: number; gradient: string }) {
	return (
		<div className="relative p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all hover:scale-105 group">
			<div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity`} />
			<div className="relative z-10 text-center space-y-2">
				<div className="w-10 h-10 mx-auto text-primary">{icon}</div>
				<div className="text-3xl font-bold">{value}</div>
				<div className="text-sm text-muted-foreground">{label}</div>
			</div>
		</div>
	);
}

function EquipmentCard({ item }: { item: any }) {
	const typeColor = item.type === "weapon" ? "from-destructive to-destructive/50" : item.type === "armor" ? "from-primary to-primary/50" : "from-accent to-accent/50";
	
	return (
		<div className="p-4 rounded-xl bg-card border border-border hover:border-accent/50 transition-all">
			<div className="flex items-start gap-3">
				<div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${typeColor} flex items-center justify-center flex-shrink-0`}>
					<Swords className="w-6 h-6 text-white" />
				</div>
				<div className="flex-1 min-w-0">
					<h3 className="font-semibold truncate">{item.name}</h3>
					<p className="text-sm text-muted-foreground capitalize">{item.type}</p>
					{item.classType && (
						<p className="text-xs text-accent font-medium mt-1">{item.classType}</p>
					)}
				</div>
			</div>
		</div>
	);
}
