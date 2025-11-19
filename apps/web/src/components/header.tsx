"use client";
import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import UserMenu from "./user-menu";
import { Map, Users, Scroll, User, Sparkles } from "lucide-react";

export default function Header() {
	const links = [
		{ to: "/map", label: "World Map", icon: Map },
		{ to: "/guild", label: "Guild", icon: Users },
		{ to: "/missions", label: "Missions", icon: Scroll },
		{ to: "/profile", label: "Profile", icon: User },
	] as const;

	return (
		<header className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-lg bg-background/80">
			<div className="container mx-auto">
				<div className="flex flex-row items-center justify-between px-4 py-3">
					<Link href="/" className="flex items-center gap-2 group">
						<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center group-hover:scale-110 transition-transform">
							<Sparkles className="w-5 h-5 text-white" />
						</div>
						<span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
							Skillforge
						</span>
					</Link>

					<nav className="hidden md:flex gap-1">
						{links.map(({ to, label, icon: Icon }) => (
							<Link
								key={to}
								href={to}
								className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors font-medium"
							>
								<Icon className="w-4 h-4" />
								{label}
							</Link>
						))}
					</nav>

					<div className="flex items-center gap-2">
						<ModeToggle />
						<UserMenu />
					</div>
				</div>
			</div>
		</header>
	);
}
