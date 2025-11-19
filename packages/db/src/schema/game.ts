import { pgTable, text, integer, timestamp, jsonb, boolean, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./auth";

// --- Guilds ---
export const guild = pgTable("guild", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	description: text("description"),
	level: integer("level").default(1).notNull(),
	parts: integer("parts").default(0).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const guildRelations = relations(guild, ({ many }) => ({
	members: many(player),
	sessions: many(guildSession),
}));

// --- Players ---
export const player = pgTable("player", {
	userId: text("user_id")
		.primaryKey()
		.references(() => user.id, { onDelete: "cascade" }),
	guildId: text("guild_id").references(() => guild.id, { onDelete: "set null" }),
	coins: integer("coins").default(0).notNull(),
	parts: integer("parts").default(0).notNull(),
	currentClass: text("current_class"), // Derived from equipment
	level: integer("level").default(1).notNull(),
	experience: integer("experience").default(0).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const playerRelations = relations(player, ({ one, many }) => ({
	user: one(user, {
		fields: [player.userId],
		references: [user.id],
	}),
	guild: one(guild, {
		fields: [player.guildId],
		references: [guild.id],
	}),
	equipment: many(userEquipment),
	missions: many(userMission),
}));

// --- Map & Regions ---
export const region = pgTable("region", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	description: text("description"),
	difficulty: integer("difficulty").default(1).notNull(),
	coordinates: jsonb("coordinates"), // { x, y } or polygon
	unlockRequirements: jsonb("unlock_requirements"),
});

export const regionRelations = relations(region, ({ many }) => ({
	sessions: many(gameSession),
}));

// --- Game Sessions ---
export const gameSession = pgTable("game_session", {
	id: text("id").primaryKey(),
	regionId: text("region_id")
		.notNull()
		.references(() => region.id, { onDelete: "cascade" }),
	status: text("status").default("active").notNull(), // active, completed
	startTime: timestamp("start_time").defaultNow().notNull(),
	endTime: timestamp("end_time"),
});

export const gameSessionRelations = relations(gameSession, ({ one, many }) => ({
	region: one(region, {
		fields: [gameSession.regionId],
		references: [region.id],
	}),
	guilds: many(guildSession),
}));

// Many-to-Many Guild <-> Session
export const guildSession = pgTable("guild_session", {
	guildId: text("guild_id")
		.notNull()
		.references(() => guild.id, { onDelete: "cascade" }),
	sessionId: text("session_id")
		.notNull()
		.references(() => gameSession.id, { onDelete: "cascade" }),
	score: integer("score").default(0).notNull(),
	territoryControl: integer("territory_control").default(0).notNull(), // Percentage 0-100
}, (t) => ({
	pk: primaryKey({ columns: [t.guildId, t.sessionId] }),
}));

export const guildSessionRelations = relations(guildSession, ({ one }) => ({
	guild: one(guild, {
		fields: [guildSession.guildId],
		references: [guild.id],
	}),
	session: one(gameSession, {
		fields: [guildSession.sessionId],
		references: [gameSession.id],
	}),
}));

// --- Missions ---
export const mission = pgTable("mission", {
	id: text("id").primaryKey(),
	title: text("title").notNull(),
	description: text("description").notNull(),
	type: text("type").notNull(), // quiz, research, puzzle
	difficulty: integer("difficulty").default(1).notNull(),
	rewards: jsonb("rewards").notNull(), // { coins: 10, parts: 5, xp: 100 }
	content: jsonb("content"), // { questions: [{ question: "...", options: ["..."], answer: "..." }] }
	regionId: text("region_id").references(() => region.id),
});

export const userMission = pgTable("user_mission", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => player.userId, { onDelete: "cascade" }),
	missionId: text("mission_id")
		.notNull()
		.references(() => mission.id, { onDelete: "cascade" }),
	status: text("status").default("pending").notNull(), // pending, completed, failed
	score: integer("score"),
	completedAt: timestamp("completed_at"),
});

export const userMissionRelations = relations(userMission, ({ one }) => ({
	player: one(player, {
		fields: [userMission.userId],
		references: [player.userId],
	}),
	mission: one(mission, {
		fields: [userMission.missionId],
		references: [mission.id],
	}),
}));

// --- Equipment ---
export const equipment = pgTable("equipment", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	type: text("type").notNull(), // weapon, tool, armor
	classType: text("class_type"), // Warrior, Mage, Engineer, etc.
	stats: jsonb("stats"),
	imagePath: text("image_path"),
});

export const userEquipment = pgTable("user_equipment", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => player.userId, { onDelete: "cascade" }),
	equipmentId: text("equipment_id")
		.notNull()
		.references(() => equipment.id, { onDelete: "cascade" }),
	isEquipped: boolean("is_equipped").default(false).notNull(),
});

export const userEquipmentRelations = relations(userEquipment, ({ one }) => ({
	player: one(player, {
		fields: [userEquipment.userId],
		references: [player.userId],
	}),
	equipment: one(equipment, {
		fields: [userEquipment.equipmentId],
		references: [equipment.id],
	}),
}));
