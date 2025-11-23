import * as dotenv from "dotenv";
import { eq } from "drizzle-orm";

dotenv.config({ path: "../../apps/web/.env" });

async function main() {
	const { db, schema } = await import("./index");
	console.log("🌱 Seeding database with Towers of Knowledge...");

	// --- Towers (Regions) ---
	const towers = [
		{
			id: "tower-logic",
			name: "Torre da Lógica",
			description: "Um labirinto de engrenagens flutuantes movidas por pensamentos coerentes. Testa raciocínio e estratégia.",
			difficulty: 1,
			coordinates: { x: 50, y: 50 }, // Central
			unlockRequirements: {},
		},
		{
			id: "tower-language",
			name: "Torre da Linguagem",
			description: "Uma biblioteca viva onde as palavras mudam de forma. Testa comunicação e interpretação.",
			difficulty: 2,
			coordinates: { x: 20, y: 30 },
			unlockRequirements: { level: 3 },
		},
		{
			id: "tower-creation",
			name: "Torre da Criação",
			description: "Uma oficina etérea onde ideias se materializam como luz. Testa inovação e pensamento livre.",
			difficulty: 3,
			coordinates: { x: 80, y: 30 },
			unlockRequirements: { level: 5 },
		},
		{
			id: "tower-memory",
			name: "Torre da Memória",
			description: "Um campo de ecos onde o passado se repete. Testa retenção e reconhecimento de padrões.",
			difficulty: 4,
			coordinates: { x: 20, y: 70 },
			unlockRequirements: { level: 7 },
		},
		{
			id: "tower-empathy",
			name: "Torre da Empatia",
			description: "Uma cidade suspensa onde emoções mudam o clima. Testa colaboração e moral.",
			difficulty: 5,
			coordinates: { x: 80, y: 70 },
			unlockRequirements: { level: 10 },
		},
		{
			id: "tower-discipline",
			name: "Torre da Disciplina",
			description: "Um deserto com portais que abrem apenas com ritmo. Testa foco e constância.",
			difficulty: 6,
			coordinates: { x: 50, y: 10 },
			unlockRequirements: { level: 12 },
		},
		{
			id: "tower-imagination",
			name: "Torre da Imaginação",
			description: "O céu noturno onde constelações são ideias. Testa síntese e abstração.",
			difficulty: 7,
			coordinates: { x: 50, y: 90 },
			unlockRequirements: { level: 15 },
		},
	];

	for (const tower of towers) {
		await db
			.insert(schema.region)
			.values(tower)
			.onConflictDoUpdate({
				target: schema.region.id,
				set: tower,
			});
	}
	console.log("✅ Towers seeded");

	// --- Equipment (Archetypes) ---
	const equipmentList = [
		{
			id: "focus-lens",
			name: "Lente da Clareza",
			type: "tool",
			classType: "Analítico",
			stats: { logic: 5, perception: 3 },
			imagePath: "/items/lens.png",
		},
		{
			id: "quill-flow",
			name: "Pena do Fluxo",
			type: "weapon", // Metaphorical weapon
			classType: "Criativo",
			stats: { imagination: 5, speed: 2 },
			imagePath: "/items/quill.png",
		},
		{
			id: "shield-empathy",
			name: "Escudo da Ressonância",
			type: "armor",
			classType: "Colaborativo",
			stats: { empathy: 5, defense: 5 },
			imagePath: "/items/shield.png",
		},
		{
			id: "boots-pathfinder",
			name: "Botas do Vazio",
			type: "tool",
			classType: "Explorador",
			stats: { speed: 5, curiosity: 5 },
			imagePath: "/items/boots.png",
		},
	];

	for (const item of equipmentList) {
		await db
			.insert(schema.equipment)
			.values(item)
			.onConflictDoUpdate({
				target: schema.equipment.id,
				set: item,
			});
	}
	console.log("✅ Equipment seeded");

	// --- Missions ---
	const missions = [
		// Tower of Logic
		{
			id: "logic-1",
			title: "O Primeiro Axioma",
			description: "Identifique a verdade fundamental para energizar o portão.",
			type: "puzzle",
			difficulty: 1,
			rewards: { coins: 10, parts: 5, xp: 50 },
			content: {
				questions: [
					{
						id: "q1",
						question: "Se A implica B, e A é verdadeiro, o que deve ser verdadeiro?",
						options: ["A é falso", "B é verdadeiro", "B é falso", "Nada"],
						answer: "B é verdadeiro",
					},
				],
			},
			regionId: "tower-logic",
		},
		// Tower of Language
		{
			id: "lang-1",
			title: "A Runa Silenciosa",
			description: "Traduza a inscrição antiga.",
			type: "quiz",
			difficulty: 2,
			rewards: { coins: 15, parts: 10, xp: 75 },
			content: {
				questions: [
					{
						id: "q1",
						question: "Qual palavra melhor completa a metáfora: 'O conhecimento é um(a) ____ que deve ser cuidado(a).'",
						options: ["Arma", "Jardim", "Pedra", "Tempestade"],
						answer: "Jardim",
					},
				],
			},
			regionId: "tower-language",
		},
		// Tower of Creation
		{
			id: "create-1",
			title: "Centelha de Luz",
			description: "Combine dois conceitos para criar um novo.",
			type: "research",
			difficulty: 3,
			rewards: { coins: 25, parts: 15, xp: 100 },
			content: {
				questions: [
					{
						id: "q1",
						question: "Qual é o resultado de misturar 'Ordem' e 'Caos' na proporção correta?",
						options: ["Entropia", "Equilíbrio", "Nada", "Destruição"],
						answer: "Equilíbrio",
					},
				],
			},
			regionId: "tower-creation",
		},
		// Tower of Memory
		{
			id: "memory-1",
			title: "O Eco do Passado",
			description: "Recupere um fragmento de memória perdido nos corredores do tempo.",
			type: "puzzle",
			difficulty: 4,
			rewards: { coins: 30, parts: 20, xp: 125 },
			content: {
				questions: [
					{
						id: "q1",
						question: "Qual é o próximo número na sequência: 1, 1, 2, 3, 5, 8...?",
						options: ["10", "11", "13", "15"],
						answer: "13",
					},
				],
			},
			regionId: "tower-memory",
		},
		// Tower of Empathy
		{
			id: "empathy-1",
			title: "A Ponte Emocional",
			description: "Conecte-se com os sentimentos de um estranho para atravessar o abismo.",
			type: "quiz",
			difficulty: 5,
			rewards: { coins: 35, parts: 25, xp: 150 },
			content: {
				questions: [
					{
						id: "q1",
						question: "Seu aliado falhou em uma tarefa crítica e está desolado. Qual a melhor reação?",
						options: ["Criticar o erro", "Ignorar e seguir", "Oferecer apoio e analisar juntos", "Fazer sozinho na próxima"],
						answer: "Oferecer apoio e analisar juntos",
					},
				],
			},
			regionId: "tower-empathy",
		},
		// Tower of Discipline
		{
			id: "discipline-1",
			title: "O Ritmo Constante",
			description: "Mantenha o foco inabalável diante das distrações do deserto.",
			type: "challenge",
			difficulty: 6,
			rewards: { coins: 40, parts: 30, xp: 175 },
			content: {
				questions: [
					{
						id: "q1",
						question: "O que vence a rocha: a força do martelo ou a persistência da água?",
						options: ["A força do martelo", "A persistência da água", "Nenhum", "Ambos"],
						answer: "A persistência da água",
					},
				],
			},
			regionId: "tower-discipline",
		},
		// Tower of Imagination
		{
			id: "imagination-1",
			title: "Além do Horizonte",
			description: "Visualize uma solução que não existe na realidade física.",
			type: "research",
			difficulty: 7,
			rewards: { coins: 50, parts: 40, xp: 200 },
			content: {
				questions: [
					{
						id: "q1",
						question: "Um homem empurra seu carro até um hotel e grita: 'Estou falido!'. O que está acontecendo?",
						options: ["O carro quebrou", "Ele foi roubado", "Ele está jogando Banco Imobiliário", "Ele perdeu a carteira"],
						answer: "Ele está jogando Banco Imobiliário",
					},
				],
			},
			regionId: "tower-imagination",
		},
	];

	for (const mission of missions) {
		await db
			.insert(schema.mission)
			.values(mission)
			.onConflictDoUpdate({
				target: schema.mission.id,
				set: mission,
			});
	}
	console.log("✅ Missions seeded");

	// --- Game Sessions (Initial) ---
	// Create an active session for the Tower of Logic
	const activeSession = await db.query.gameSession.findFirst({
		where: eq(schema.gameSession.status, "active"),
	});

	if (!activeSession) {
		await db.insert(schema.gameSession).values({
			id: "session-logic-1",
			regionId: "tower-logic",
			status: "active",
			startTime: new Date(),
		});
		console.log("✅ Initial Game Session created for Tower of Logic");
	}

	console.log("🌱 Seeding completed! The Towers await.");
	process.exit(0);
}

main().catch((err) => {
	console.error("❌ Seeding failed:", err);
	process.exit(1);
});
