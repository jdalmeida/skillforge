import { publicProcedure, router } from "../index";
import { schema } from "@skillforge/db";
import { desc, sql } from "drizzle-orm";

export const leaderboardRouter = router({
	topPlayers: publicProcedure.query(async ({ ctx }) => {
		return ctx.db.query.player.findMany({
			with: {
				user: true,
				guild: true,
			},
			orderBy: [desc(schema.player.experience), desc(schema.player.level)],
			limit: 100,
		});
	}),

	topGuilds: publicProcedure.query(async ({ ctx }) => {
		// Aggregate guild scores across all active sessions
		const guilds = await ctx.db.query.guild.findMany({
			with: {
				sessions: {
					columns: {
						score: true,
						territoryControl: true,
					},
				},
				members: true,
			},
		});

		// Calculate total score for each guild
		const guildsWithScores = guilds.map((guild) => {
			const totalScore = guild.sessions.reduce((sum, session) => sum + session.score, 0);
			const totalTerritory = guild.sessions.reduce((sum, session) => sum + session.territoryControl, 0);
			
			return {
				...guild,
				totalScore,
				totalTerritory,
				memberCount: guild.members.length,
			};
		});

		// Sort by total score
		return guildsWithScores.sort((a, b) => b.totalScore - a.totalScore).slice(0, 100);
	}),
});
