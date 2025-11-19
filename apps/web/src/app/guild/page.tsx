"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { trpc, trpcClient } from "@/utils/trpc";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Shield, Users, Trophy, Coins, Puzzle } from "lucide-react";
import { useState } from "react";

export default function GuildPage() {
	const queryClient = useQueryClient();
	const { data: myGuild, isLoading } = useQuery(trpc.guild.myGuild.queryOptions());
	const { data: allGuilds } = useQuery(trpc.guild.list.queryOptions());
	const [showCreateForm, setShowCreateForm] = useState(false);

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
			<div className="fixed inset-0 bg-gradient-to-br from-background via-primary/5 to-background pointer-events-none" />
			
			<div className="relative z-10 container mx-auto max-w-7xl space-y-8">
				<div className="text-center space-y-4">
					<h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
						Guild Headquarters
					</h1>
					<p className="text-lg text-muted-foreground">
						{myGuild ? "Manage your guild" : "Join or create a guild to begin your journey"}
					</p>
				</div>

				{myGuild ? (
					<MyGuildView guild={myGuild} />
				) : (
					<div className="space-y-8">
						<div className="flex justify-center">
							<Button
								onClick={() => setShowCreateForm(!showCreateForm)}
								size="lg"
								className="px-8 py-6 text-lg rounded-xl shadow-lg shadow-primary/50"
							>
								{showCreateForm ? "Cancel" : "Create New Guild"}
							</Button>
						</div>

						{showCreateForm && <CreateGuildForm onSuccess={() => setShowCreateForm(false)} />}

						<div>
							<h2 className="text-3xl font-bold mb-6">Available Guilds</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{allGuilds?.map((guild) => (
									<GuildCard key={guild.id} guild={guild} />
								))}
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

function MyGuildView({ guild }: { guild: any }) {
	return (
		<div className="space-y-8">
			<div className="p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 border-2 border-primary/30 shadow-2xl">
				<div className="flex items-start justify-between mb-6">
					<div className="flex items-center gap-4">
						<div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
							<Shield className="w-8 h-8 text-white" />
						</div>
						<div>
							<h2 className="text-3xl font-bold">{guild.name}</h2>
							<p className="text-muted-foreground">{guild.description || "No description"}</p>
						</div>
					</div>
					<div className="text-right">
						<div className="text-3xl font-bold text-primary">Lvl {guild.level}</div>
						<div className="text-sm text-muted-foreground">Guild Level</div>
					</div>
				</div>

				<div className="grid grid-cols-3 gap-4">
					<StatCard icon={<Users />} label="Members" value={guild.members?.length || 0} />
					<StatCard icon={<Puzzle />} label="Parts" value={guild.parts} color="text-accent" />
					<StatCard icon={<Trophy />} label="Territories" value="0" color="text-secondary" />
				</div>
			</div>

			<div>
				<h3 className="text-2xl font-bold mb-4">Guild Members</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{guild.members?.map((member: any) => (
						<div key={member.userId} className="p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
									<Users className="w-5 h-5" />
								</div>
								<div>
									<div className="font-medium">{member.user.name}</div>
									<div className="text-sm text-muted-foreground">Level {member.level}</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

function CreateGuildForm({ onSuccess }: { onSuccess: () => void }) {
	const queryClient = useQueryClient();
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");

	const createMutation = useMutation({
		mutationFn: async () => {
			return await trpcClient.guild.create.mutate({ name, description });
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: trpc.guild.myGuild.queryKey() });
			toast.success("Guild created successfully!");
			onSuccess();
		},
		onError: (error) => {
			toast.error(error.message);
		}
	});

	return (
		<div className="max-w-2xl mx-auto p-8 rounded-2xl bg-card border-2 border-primary/30 shadow-xl">
			<h3 className="text-2xl font-bold mb-6">Create Your Guild</h3>
			<form onSubmit={(e) => { e.preventDefault(); createMutation.mutate(); }} className="space-y-4">
				<div>
					<label className="block text-sm font-medium mb-2">Guild Name</label>
					<Input
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="Enter guild name"
						className="text-lg"
						required
					/>
				</div>
				<div>
					<label className="block text-sm font-medium mb-2">Description (Optional)</label>
					<Textarea
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						placeholder="Describe your guild's purpose..."
						rows={3}
					/>
				</div>
				<Button type="submit" disabled={createMutation.isPending} className="w-full text-lg py-6">
					{createMutation.isPending ? "Creating..." : "Create Guild"}
				</Button>
			</form>
		</div>
	);
}

function GuildCard({ guild }: { guild: any }) {
	const queryClient = useQueryClient();
	const joinMutation = useMutation({
		mutationFn: async () => {
			return await trpcClient.guild.join.mutate({ guildId: guild.id });
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: trpc.guild.myGuild.queryKey() });
			toast.success("Joined guild successfully!");
		},
		onError: (error) => {
			toast.error(error.message);
		}
	});

	return (
		<div className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all hover:scale-105 hover:shadow-xl">
			<div className="flex items-center gap-3 mb-4">
				<div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
					<Shield className="w-6 h-6 text-primary" />
				</div>
				<div className="flex-1">
					<h3 className="text-xl font-bold">{guild.name}</h3>
					<div className="text-sm text-muted-foreground">Level {guild.level}</div>
				</div>
			</div>
			<p className="text-sm text-muted-foreground mb-4 line-clamp-2">
				{guild.description || "No description provided"}
			</p>
			<Button
				onClick={() => joinMutation.mutate()}
				disabled={joinMutation.isPending}
				className="w-full"
			>
				{joinMutation.isPending ? "Joining..." : "Join Guild"}
			</Button>
		</div>
	);
}

function StatCard({ icon, label, value, color = "text-primary" }: { icon: React.ReactNode; label: string; value: number | string; color?: string }) {
	return (
		<div className="p-4 rounded-xl bg-card/50 border border-border text-center">
			<div className={`w-8 h-8 mx-auto mb-2 ${color}`}>{icon}</div>
			<div className={`text-2xl font-bold ${color}`}>{value}</div>
			<div className="text-sm text-muted-foreground">{label}</div>
		</div>
	);
}
