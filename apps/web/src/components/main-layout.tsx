"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function MainLayout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const isMap = pathname === "/map";
	const isPublic = pathname === "/" || pathname === "/login";
	
	// Public pages handle their own layout/centering.
	// Map handles its own layout (full screen).
	// Other pages need padding to avoid HUD overlap.
	// We add generous padding to ensure content clears the fixed HUDs.
	const shouldAddPadding = !isMap && !isPublic;

	return (
		<main className={cn(
			"flex-1 relative overflow-auto scrollbar-hide",
			shouldAddPadding && "pb-32 pt-24 px-4 md:px-0"
		)}>
			{children}
		</main>
	);
}
