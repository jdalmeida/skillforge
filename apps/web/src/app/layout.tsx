import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../index.css";
import Providers from "@/components/providers";
import GameHUD from "@/components/game-hud";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Skillforge",
	description: "A Learning RPG",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground overflow-hidden`}
			>
				<Providers>
					<div className="relative w-full h-screen overflow-hidden flex flex-col">
						<GameHUD />
						<main className="flex-1 relative overflow-auto scrollbar-hide">
							{children}
						</main>
					</div>
				</Providers>
			</body>
		</html>
	);
}
