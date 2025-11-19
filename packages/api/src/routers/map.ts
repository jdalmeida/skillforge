import { z } from "zod";
import { publicProcedure, router } from "../index";
import { schema } from "@skillforge/db";
import { eq } from "drizzle-orm";

export const mapRouter = router({
	listRegions: publicProcedure.query(async ({ ctx }) => {
		return ctx.db.query.region.findMany({
			with: {
				sessions: {
					where: eq(schema.gameSession.status, "active"),
					with: {
						guilds: {
							with: {
								guild: true,
							},
							orderBy: (guildSession, { desc }) => [desc(guildSession.score)],
							limit: 1,
						},
					},
				},
			},
		});
	}),

	getRegion: publicProcedure
		.input(z.object({ regionId: z.string() }))
		.query(async ({ ctx, input }) => {
			return ctx.db.query.region.findFirst({
				where: eq(schema.region.id, input.regionId),
				with: {
					sessions: {
						where: eq(schema.gameSession.status, "active"),
						with: {
							guilds: {
								with: {
									guild: true,
								},
							},
						},
					},
				},
			});
		}),

	getSession: publicProcedure
		.input(z.object({ sessionId: z.string() }))
		.query(async ({ ctx, input }) => {
			return ctx.db.query.gameSession.findFirst({
				where: eq(schema.gameSession.id, input.sessionId),
				with: {
					region: true,
					guilds: {
						with: {
							guild: true,
						},
						orderBy: (guildSession, { desc }) => [desc(guildSession.score)],
					},
				},
			});
		}),
});
