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
			name: "Tower of Logic",
			description: "A labyrinth of floating gears powered by coherent thoughts. Tests reasoning and strategy.",
			difficulty: 1,
			coordinates: { x: 50, y: 50 }, // Central
			unlockRequirements: {},
		},
		{
			id: "tower-language",
			name: "Tower of Language",
			description: "A living library where words shift form. Tests communication and interpretation.",
			difficulty: 2,
			coordinates: { x: 20, y: 30 },
			unlockRequirements: { level: 3 },
		},
		{
			id: "tower-creation",
			name: "Tower of Creation",
			description: "An ethereal workshop where ideas materialize as light. Tests innovation and free thought.",
			difficulty: 3,
			coordinates: { x: 80, y: 30 },
			unlockRequirements: { level: 5 },
		},
		{
			id: "tower-memory",
			name: "Tower of Memory",
			description: "A field of echoes where the past repeats. Tests retention and pattern recognition.",
			difficulty: 4,
			coordinates: { x: 20, y: 70 },
			unlockRequirements: { level: 7 },
		},
		{
			id: "tower-empathy",
			name: "Tower of Empathy",
			description: "A suspended city where emotions change the weather. Tests collaboration and morals.",
			difficulty: 5,
			coordinates: { x: 80, y: 70 },
			unlockRequirements: { level: 10 },
		},
		{
			id: "tower-discipline",
			name: "Tower of Discipline",
			description: "A desert with portals that open only to rhythm. Tests focus and constancy.",
			difficulty: 6,
			coordinates: { x: 50, y: 10 },
			unlockRequirements: { level: 12 },
		},
		{
			id: "tower-imagination",
			name: "Tower of Imagination",
			description: "The night sky where constellations are ideas. Tests synthesis and abstraction.",
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
			name: "Lens of Clarity",
			type: "tool",
			classType: "Analytic",
			stats: { logic: 5, perception: 3 },
			imagePath: "/items/lens.png",
		},
		{
			id: "quill-flow",
			name: "Quill of Flow",
			type: "weapon", // Metaphorical weapon
			classType: "Creative",
			stats: { imagination: 5, speed: 2 },
			imagePath: "/items/quill.png",
		},
		{
			id: "shield-empathy",
			name: "Resonance Shield",
			type: "armor",
			classType: "Collaborative",
			stats: { empathy: 5, defense: 5 },
			imagePath: "/items/shield.png",
		},
		{
			id: "boots-pathfinder",
			name: "Boots of the Void",
			type: "tool",
			classType: "Explorer",
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
			title: "The First Axiom",
			description: "Identify the fundamental truth to power the gate.",
			type: "puzzle",
			difficulty: 1,
			rewards: { coins: 10, parts: 5, xp: 50 },
			content: {
				questions: [
					{
						id: "q1",
						question: "If A implies B, and A is true, what must be true?",
						options: ["A is false", "B is true", "B is false", "Nothing"],
						answer: "B is true",
					},
				],
			},
			regionId: "tower-logic",
		},
		// Tower of Language
		{
			id: "lang-1",
			title: "The Silent Rune",
			description: "Translate the ancient inscription.",
			type: "quiz",
			difficulty: 2,
			rewards: { coins: 15, parts: 10, xp: 75 },
			content: {
				questions: [
					{
						id: "q1",
						question: "Which word best completes the metaphor: 'Knowledge is a ____ that must be tended.'",
						options: ["Weapon", "Garden", "Stone", "Storm"],
						answer: "Garden",
					},
				],
			},
			regionId: "tower-language",
		},
		// Tower of Creation
		{
			id: "create-1",
			title: "Spark of Light",
			description: "Combine two concepts to create a new one.",
			type: "research",
			difficulty: 3,
			rewards: { coins: 25, parts: 15, xp: 100 },
			content: {
				questions: [
					{
						id: "q1",
						question: "What is the result of mixing 'Order' and 'Chaos' in the correct proportion?",
						options: ["Entropy", "Balance", "Nothing", "Destruction"],
						answer: "Balance",
					},
				],
			},
			regionId: "tower-creation",
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
