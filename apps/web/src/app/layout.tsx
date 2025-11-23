import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../index.css";
import Providers from "@/components/providers";
import GameHUD from "@/components/game-hud";
import MainLayout from "@/components/main-layout";

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
		<html lang="pt-BR" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground overflow-hidden`}
			>
				<Providers>
					<div className="relative w-full h-screen overflow-hidden flex flex-col">
						<GameHUD />
						<MainLayout>
							{children}
						</MainLayout>
					</div>
				</Providers>
			</body>
		</html>
	);
}
