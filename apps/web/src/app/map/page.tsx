"use client";

import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
import { motion } from "framer-motion";
import { Lock, MapPin, Star, Users, Trophy } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Mock coordinates for the map pins (since we don't have a visual editor yet)
// In a real app, these would be stored in the DB, but we need to map them to our specific image
const REGION_COORDS: Record<string, { x: number; y: number }> = {
	"Tower of Logic": { x: 50, y: 55 },       // Center (Clockwork City)
	"Tower of Language": { x: 28, y: 25 },    // North-West (Library)
	"Tower of Creation": { x: 72, y: 25 },    // North-East (Crystal Workshop)
	"Tower of Memory": { x: 28, y: 75 },      // South-West (Ethereal Valley)
	"Tower of Empathy": { x: 72, y: 75 },     // South-East (Floating Islands)
	"Tower of Discipline": { x: 12, y: 50 },  // West (Desert)
	"Tower of Imagination": { x: 88, y: 50 }, // East (Observatory)
};

export default function MapPage() {
	const { data: regions, isLoading } = useQuery(trpc.map.listRegions.queryOptions());
	const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-background text-primary">
				<div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary" />
			</div>
		);
	}

	return (
		<div className="relative w-full h-full min-h-screen bg-[#1a1a1a] overflow-hidden">
			{/* Map Container with Zoom/Pan potential */}
			<div className="absolute inset-0 w-full h-full">
				<Image
					src="/world-map.jpg"
					alt="World Map"
					fill
					className="object-cover object-center opacity-80 hover:opacity-100 transition-opacity duration-1000"
					priority
				/>
				
				{/* Overlay Gradient for atmosphere */}
				<div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/60 pointer-events-none" />
			</div>

			{/* Map Pins */}
			<div className="absolute inset-0 pointer-events-none">
				{regions?.map((region) => {
					const coords = REGION_COORDS[region.name] || { x: 50, y: 50 };
					const isLocked = false; // TODO: Implement lock logic based on player level
					const isSelected = selectedRegion === region.id;

					return (
						<div
							key={region.id}
							className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
							style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
						>
							<motion.div
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.95 }}
								onClick={() => setSelectedRegion(isSelected ? null : region.id)}
								className={cn(
									"relative group cursor-pointer flex flex-col items-center",
									isLocked && "opacity-70 grayscale"
								)}
							>
								{/* Pin Icon */}
								<div className={cn(
									"w-12 h-12 rounded-full border-4 shadow-xl flex items-center justify-center transition-colors duration-300 bg-background",
									isSelected ? "border-accent bg-accent text-accent-foreground" : "border-primary text-primary hover:border-accent hover:text-accent"
								)}>
									{isLocked ? <Lock className="w-6 h-6" /> : <MapPin className="w-6 h-6" />}
								</div>

								{/* Label (Always visible or on hover?) */}
								<div className={cn(
									"mt-2 px-3 py-1 rounded-full bg-background/90 border border-border shadow-lg backdrop-blur-sm transition-all duration-300",
									isSelected ? "scale-110 border-accent text-accent" : "scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100"
								)}>
									<span className="text-sm font-bold whitespace-nowrap">{region.name}</span>
								</div>
							</motion.div>

							{/* Detail Popup (When Selected) */}
							{isSelected && (
								<motion.div
									initial={{ opacity: 0, y: 10, scale: 0.9 }}
									animate={{ opacity: 1, y: 0, scale: 1 }}
									exit={{ opacity: 0, y: 10, scale: 0.9 }}
									className="absolute top-16 left-1/2 -translate-x-1/2 w-72 bg-card/95 backdrop-blur-xl border-2 border-primary/50 rounded-xl p-4 shadow-2xl z-50 text-center"
								>
									<h3 className="text-xl font-bold text-primary mb-2">{region.name}</h3>
									<p className="text-sm text-muted-foreground mb-4">{region.description}</p>
									
									<div className="flex justify-center gap-4 mb-4 text-sm">
										<div className="flex items-center gap-1 text-yellow-500">
											<Star className="w-4 h-4 fill-current" />
											<span>{region.difficulty}/5</span>
										</div>
										<div className="flex items-center gap-1 text-blue-400">
											<Users className="w-4 h-4" />
											<span>{region.sessions.length} Active</span>
										</div>
									</div>

									{/* Controlling Guild */}
									{region.sessions[0]?.guilds[0] && (
										<div className="mb-4 p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center gap-2 text-yellow-500">
											<Trophy className="w-4 h-4" />
											<span className="text-xs font-bold uppercase tracking-wide">
												Controlled by {region.sessions[0].guilds[0].guild.name}
											</span>
										</div>
									)}

									<Link 
										href={`/region/${region.id}` as any}
										className="block w-full py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-bold transition-colors"
									>
										Enter Region
									</Link>
								</motion.div>
							)}
						</div>
					);
				})}
			</div>
			
			{/* Title Overlay */}
			<div className="absolute top-8 left-1/2 -translate-x-1/2 text-center pointer-events-none">
				<h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] tracking-widest uppercase font-serif">
					World Map
				</h1>
				<p className="text-white/80 text-lg mt-2 drop-shadow-md">Select a region to explore</p>
			</div>
		</div>
	);
}
