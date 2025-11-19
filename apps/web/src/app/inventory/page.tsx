"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { trpc, trpcClient } from "@/utils/trpc";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Package, Sparkles, Check } from "lucide-react";
import Image from "next/image";

export default function InventoryPage() {
	const queryClient = useQueryClient();
	const { data: player, isLoading } = useQuery(trpc.player.me.queryOptions());

	const equipMutation = useMutation({
		mutationFn: async (userEquipmentId: string) => {
			return await trpcClient.player.equipItem.mutate({ userEquipmentId });
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: trpc.player.me.queryKey() });
			toast.success("Equipment equipped!");
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const unequipMutation = useMutation({
		mutationFn: async (userEquipmentId: string) => {
			return await trpcClient.player.unequipItem.mutate({ userEquipmentId });
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: trpc.player.me.queryKey() });
			toast.success("Equipment unequipped!");
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

	const equipment = player?.equipment || [];

	return (
		<div className="min-h-screen p-8 relative overflow-hidden">
			{/* Background */}
			<div className="fixed inset-0 bg-gradient-to-br from-background via-secondary/5 to-background pointer-events-none" />
			
			<div className="relative z-10 container mx-auto max-w-7xl space-y-8">
				{/* Header */}
				<div className="text-center space-y-4">
					<div className="flex items-center justify-center gap-3">
						<Package className="w-12 h-12 text-secondary" />
						<h1 className="text-5xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
							Your Inventory
						</h1>
					</div>
					<p className="text-lg text-muted-foreground">
						Manage and equip your gear
					</p>
				</div>

				{/* Equipment Grid */}
				{equipment.length === 0 ? (
					<div className="text-center py-20">
						<Package className="w-20 h-20 mx-auto text-muted-foreground mb-4" />
						<h2 className="text-2xl font-bold mb-2">No Equipment Yet</h2>
						<p className="text-muted-foreground mb-6">Visit the shop to purchase your first gear!</p>
						<Button asChild>
							<a href="/shop">Go to Shop</a>
						</Button>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{equipment.map((userEquip: any) => {
							const item = userEquip.equipment;
							const isEquipping = equipMutation.isPending || unequipMutation.isPending;
							
							return (
								<div
									key={userEquip.id}
									className={`relative group p-6 rounded-2xl bg-card border-2 transition-all hover:scale-105 hover:shadow-2xl space-y-4 ${
										userEquip.isEquipped
											? "border-primary shadow-lg shadow-primary/20"
											: "border-border hover:border-secondary/50"
									}`}
								>
									{/* Equipped Badge */}
									{userEquip.isEquipped && (
										<div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1">
											<Check className="w-3 h-3" />
											EQUIPPED
										</div>
									)}

									{/* Image */}
									<div className="relative w-full aspect-square bg-gradient-to-br from-secondary/5 to-primary/5 rounded-xl flex items-center justify-center overflow-hidden">
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

									{/* Equip/Unequip Button */}
									{userEquip.isEquipped ? (
										<Button
											variant="outline"
											className="w-full"
											disabled={isEquipping}
											onClick={() => unequipMutation.mutate(userEquip.id)}
										>
											{isEquipping ? "Processing..." : "Unequip"}
										</Button>
									) : (
										<Button
											className="w-full"
											disabled={isEquipping}
											onClick={() => equipMutation.mutate(userEquip.id)}
										>
											{isEquipping ? "Equipping..." : "Equip"}
										</Button>
									)}
								</div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}
