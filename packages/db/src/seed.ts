import * as dotenv from "dotenv";
import { eq } from "drizzle-orm";

dotenv.config({ path: "../../apps/web/.env" });

async function main() {
	const { db, schema } = await import("./index");
	console.log("🌱 Seeding database...");

	// --- Regions ---
	const regions = [
		{
			id: "region-1",
			name: "The Beginning Fields",
			description: "A peaceful area for new adventurers to learn the basics.",
			difficulty: 1,
			coordinates: { x: 0, y: 0 },
			unlockRequirements: {},
		},
		{
			id: "region-2",
			name: "Forest of Logic",
			description: "A dense forest where puzzles and logic challenges await.",
			difficulty: 2,
			coordinates: { x: 10, y: 5 },
			unlockRequirements: { level: 5 },
		},
		{
			id: "region-3",
			name: "Mountain of Code",
			description: "High-altitude challenges for experienced developers.",
			difficulty: 3,
			coordinates: { x: 5, y: 15 },
			unlockRequirements: { level: 10 },
		},
	];

	for (const region of regions) {
		await db
			.insert(schema.region)
			.values(region)
			.onConflictDoUpdate({
				target: schema.region.id,
				set: region,
			});
	}
	console.log("✅ Regions seeded");

	// --- Equipment (Classes) ---
	const equipmentList = [
		{
			id: "sword-1",
			name: "Syntax Sword",
			type: "weapon",
			classType: "Warrior",
			stats: { strength: 5, speed: 2 },
			imagePath: "/items/sword-1.png",
		},
		{
			id: "staff-1",
			name: "Compiler Staff",
			type: "weapon",
			classType: "Mage",
			stats: { intelligence: 5, mana: 10 },
			imagePath: "/items/staff-1.png",
		},
		{
			id: "shield-1",
			name: "Firewall Shield",
			type: "armor",
			classType: "Guardian",
			stats: { defense: 8 },
			imagePath: "/items/shield-1.png",
		},
		{
			id: "laptop-1",
			name: "Quantum Laptop",
			type: "tool",
			classType: "Hacker",
			stats: { hacking: 5, speed: 5 },
			imagePath: "/items/laptop-1.png",
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
		{
			id: "mission-1",
			title: "Hello World",
			description: "Write your first line of code.",
			type: "quiz",
			difficulty: 1,
			rewards: { coins: 10, parts: 5, xp: 50 },
			content: {
				questions: [
					{
						id: "q1",
						question: "Which function is used to print text to the console in JavaScript?",
						options: ["print()", "log.console()", "console.log()", "write()"],
						answer: "console.log()",
					},
				],
			},
			regionId: "region-1",
		},
		{
			id: "mission-2",
			title: "Variable Valley",
			description: "Understand how to store data in variables.",
			type: "quiz",
			difficulty: 1,
			rewards: { coins: 15, parts: 5, xp: 60 },
			content: {
				questions: [
					{
						id: "q1",
						question: "Which keyword is NOT used to declare a variable in JavaScript?",
						options: ["var", "let", "const", "int"],
						answer: "int",
					},
				],
			},
			regionId: "region-1",
		},
		{
			id: "mission-3",
			title: "Loop Loop",
			description: "Master the art of repetition.",
			type: "puzzle",
			difficulty: 2,
			rewards: { coins: 25, parts: 10, xp: 100 },
			content: {
				questions: [
					{
						id: "q1",
						question: "What will this loop print? for(let i=0; i<3; i++) console.log(i)",
						options: ["1 2 3", "0 1 2", "0 1 2 3", "1 2"],
						answer: "0 1 2",
					},
				],
			},
			regionId: "region-1",
		},
		{
			id: "mission-4",
			title: "Function Junction",
			description: "Create reusable blocks of code.",
			type: "research",
			difficulty: 2,
			rewards: { coins: 30, parts: 15, xp: 120 },
			content: {
				questions: [
					{
						id: "q1",
						question: "What is the correct syntax to define a function?",
						options: ["func myFunc() {}", "function myFunc() {}", "def myFunc() {}", "void myFunc() {}"],
						answer: "function myFunc() {}",
					},
				],
			},
			regionId: "region-1",
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
	// Create an active session for the first region if none exists
	const activeSession = await db.query.gameSession.findFirst({
		where: eq(schema.gameSession.status, "active"),
	});

	if (!activeSession) {
		await db.insert(schema.gameSession).values({
			id: "session-1",
			regionId: "region-1",
			status: "active",
			startTime: new Date(),
		});
		console.log("✅ Initial Game Session created");
	}

	const allMissions = await db.query.mission.findMany();
	console.log("DEBUG: Missions in DB:", JSON.stringify(allMissions, null, 2));

	console.log("🌱 Seeding completed!");
	process.exit(0);
}

main().catch((err) => {
	console.error("❌ Seeding failed:", err);
	process.exit(1);
});
