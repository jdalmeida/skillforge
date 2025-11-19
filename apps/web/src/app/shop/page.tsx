"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { trpc, trpcClient } from "@/utils/trpc";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Coins, ShoppingBag, Sparkles } from "lucide-react";
import Image from "next/image";

export default function ShopPage() {
	const queryClient = useQueryClient();
	const { data: items, isLoading } = useQuery(trpc.shop.listItems.queryOptions());
	const { data: player } = useQuery(trpc.player.me.queryOptions());

	const purchaseMutation = useMutation({
		mutationFn: async (equipmentId: string) => {
			return await trpcClient.shop.purchase.mutate({ equipmentId });
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: trpc.player.me.queryKey() });
			queryClient.invalidateQueries({ queryKey: trpc.shop.listItems.queryKey() });
			toast.success("Purchase successful!");
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

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
			
			<div className="relative z-10 container mx-auto max-w-7xl space-y-8">
				{/* Header */}
				<div className="text-center space-y-4">
					<div className="flex items-center justify-center gap-3">
						<ShoppingBag className="w-12 h-12 text-primary" />
						<h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
							Equipment Shop
						</h1>
					</div>
					<p className="text-lg text-muted-foreground">
						Equip yourself for battle with powerful gear
					</p>
					{player && (
						<div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 border border-primary/30">
							<Coins className="w-5 h-5 text-yellow-500" />
							<span className="font-bold text-xl">{player.coins}</span>
							<span className="text-muted-foreground">Coins</span>
						</div>
					)}
				</div>

				{/* Items Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{items?.map((item) => (
						<div
							key={item.id}
							className="group p-6 rounded-2xl bg-card border-2 border-border hover:border-primary/50 transition-all hover:scale-105 hover:shadow-2xl space-y-4"
						>
							{/* Image */}
							<div className="relative w-full aspect-square bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl flex items-center justify-center overflow-hidden">
								{item.imagePath ? (
									<Image
										src={item.imagePath}
										alt={item.name}
										width={200}
										height={200}
										className="object-contain p-4"
									/>
								) : (
									<Sparkles className="w-20 h-20 text-muted-foreground" />
								)}
							</div>

							{/* Info */}
							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<span className="px-2 py-1 rounded-full bg-accent/20 text-accent text-xs font-bold uppercase">
										{item.classType}
									</span>
									<span className="px-2 py-1 rounded-full bg-muted text-muted-foreground text-xs font-bold uppercase">
										{item.type}
									</span>
								</div>
								<h3 className="text-xl font-bold">{item.name}</h3>
								
								{/* Stats */}
								<div className="flex flex-wrap gap-2 text-sm">
									{Object.entries((item.stats as Record<string, number>) || {}).map(([stat, value]) => (
										<div key={stat} className="px-2 py-1 rounded-md bg-background/50 border border-border">
											<span className="text-muted-foreground capitalize">{stat}:</span>{" "}
											<span className="font-bold text-primary">+{value}</span>
										</div>
									))}
								</div>
							</div>

							{/* Purchase */}
							<Button
								onClick={() => purchaseMutation.mutate(item.id)}
								disabled={purchaseMutation.isPending || (player?.coins ?? 0) < 100}
								className="w-full"
							>
								<Coins className="w-4 h-4 mr-2" />
								Buy for 100 Coins
							</Button>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
