"use client";

import { trpc } from "@/utils/trpc";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Shield, Map as MapIcon, Scroll, Brain, Zap, BookOpen } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function LandingPage() {
	const { data: health } = useQuery(trpc.healthCheck.queryOptions());
	
	return (
		<div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
			{/* Background Video/Image Placeholder */}
			<div className="absolute inset-0 bg-[url('/world-map.jpg')] bg-cover bg-center opacity-20 pointer-events-none" />
			<div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none" />

			<div className="relative z-10 text-center space-y-8 max-w-4xl px-4">
				{/* Hero Title */}
				<div className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
					<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-4">
						<Sparkles className="w-4 h-4" />
						<span className="text-sm font-medium uppercase tracking-wider">A Era do Silêncio Termina</span>
					</div>
					
					<h1 className="text-6xl md:text-8xl font-bold tracking-tighter bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent drop-shadow-sm">
						SKILLFORGE
					</h1>
					
					<p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
						As Torres do Conhecimento despertaram. <br/>
						Junte-se a A.L.I.A., restaure a sabedoria perdida e lute contra a Entropia.
					</p>
				</div>

				{/* CTA Buttons */}
				<div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-8 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
					<Link href="/map">
						<Button size="lg" className="h-16 px-8 text-xl rounded-xl bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 border-2 border-primary/50 transition-all hover:scale-105">
							Entrar na Simulação
							<ArrowRight className="ml-2 w-6 h-6" />
						</Button>
					</Link>
					<Link href="/guild">
						<Button size="lg" variant="outline" className="h-16 px-8 text-xl rounded-xl border-2 hover:bg-accent/10 transition-all hover:scale-105">
							Juntar-se a uma Guilda
						</Button>
					</Link>
				</div>

				{/* Feature Grid */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 text-left animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
					<FeatureCard 
						icon={<Brain className="w-8 h-8 text-accent" />}
						title="Restaure a Sabedoria"
						description="Reative as 7 Torres do Conhecimento resolvendo desafios cognitivos."
					/>
					<FeatureCard 
						icon={<Zap className="w-8 h-8 text-primary" />}
						title="Derrote a Entropia"
						description="Batalhe contra o caos que corrompe ideias e transforma sabedoria em ruído."
					/>
					<FeatureCard 
						icon={<BookOpen className="w-8 h-8 text-secondary" />}
						title="Evolua"
						description="Cresça de um Aprendiz para um Arquiteto da Mente."
					/>
				</div>
			</div>
			
			{/* API Status Footer */}
			<div className="absolute bottom-4 right-4 text-xs text-muted-foreground/50">
				Status do Sistema: {health ? "Online" : "Conectando..."}
			</div>
		</div>
	);
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
	return (
		<div className="p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border hover:border-primary/50 transition-colors group">
			<div className="mb-4 p-3 rounded-xl bg-background/50 w-fit group-hover:scale-110 transition-transform duration-300 border border-border/50">
				{icon}
			</div>
			<h3 className="text-xl font-bold mb-2">{title}</h3>
			<p className="text-muted-foreground leading-relaxed">
				{description}
			</p>
		</div>
	);
}
