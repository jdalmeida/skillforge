"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, Users, Scroll, User, Settings, LogOut, ShoppingBag, Package, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

export default function GameHUD() {
	const pathname = usePathname();
	
	// Don't show HUD on login/landing if not appropriate, but for now let's assume
	// we want it everywhere except maybe the very root if it's a landing page.
	// Actually, if we are making it "game-like", the HUD *is* the nav.
	
	const navItems = [
		{ href: "/map", icon: Map, label: "Map" },
		{ href: "/missions", icon: Scroll, label: "Quests" },
		{ href: "/shop", icon: ShoppingBag, label: "Shop" },
		{ href: "/inventory", icon: Package, label: "Inventory" },
		{ href: "/guild", icon: Users, label: "Guild" },
		{ href: "/leaderboard", icon: Trophy, label: "Ranks" },
		{ href: "/profile", icon: User, label: "Hero" },
	];

	// Hide HUD on public pages
	if (pathname === "/" || pathname === "/login") {
		return null;
	}

	return (
		<>
			{/* Top Bar - Resource / Status Display */}
			<div className="fixed top-0 left-0 right-0 z-50 p-4 pointer-events-none">
				<div className="flex justify-between items-start">
					{/* Player Status (Mock) */}
					<div className="bg-background/90 backdrop-blur-md border-2 border-primary/50 p-2 rounded-lg shadow-lg pointer-events-auto flex items-center gap-3">
						<div className="w-10 h-10 rounded-full bg-primary border-2 border-secondary flex items-center justify-center">
							<User className="text-primary-foreground w-6 h-6" />
						</div>
						<div>
							<div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Level 5</div>
							<div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
								<div className="h-full bg-accent w-[60%]" />
							</div>
						</div>
					</div>

					{/* System Menu */}
					<div className="pointer-events-auto flex gap-2">
						<button className="p-2 bg-background/90 backdrop-blur-md border-2 border-primary/50 rounded-lg hover:bg-primary/20 transition-colors">
							<Settings className="w-6 h-6 text-primary" />
						</button>
					</div>
				</div>
			</div>

			{/* Bottom Bar - Main Navigation */}
			<div className="fixed bottom-0 left-0 right-0 z-50 p-2 md:p-4 pointer-events-none flex justify-center">
				<nav className="bg-background/95 backdrop-blur-xl border-2 border-primary/50 rounded-2xl shadow-2xl p-1 md:p-2 pointer-events-auto flex gap-1 md:gap-4 items-center overflow-x-auto max-w-full">
					{navItems.map((item) => {
						const isActive = pathname === item.href;
						return (
							<Link
								key={item.href}
								href={item.href as any}
								className={cn(
									"flex flex-col items-center gap-1 p-2 md:p-3 rounded-xl transition-all duration-300 min-w-[3.5rem] md:min-w-[4.5rem]",
									isActive 
										? "bg-primary text-primary-foreground -translate-y-2 md:-translate-y-4 shadow-lg scale-105 md:scale-110 border-2 border-secondary" 
										: "hover:bg-primary/10 text-muted-foreground hover:text-primary"
								)}
							>
								<item.icon className={cn("w-5 h-5 md:w-6 md:h-6", isActive && "w-6 h-6 md:w-7 md:h-7")} />
								<span className={cn("text-[8px] md:text-[10px] font-bold uppercase tracking-wider", !isActive && "hidden md:block")}>{item.label}</span>
							</Link>
						);
					})}
				</nav>
			</div>
		</>
	);
}
