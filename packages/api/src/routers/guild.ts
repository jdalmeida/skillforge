import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../index";
import { schema } from "@skillforge/db";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const guildRouter = router({
	create: protectedProcedure
		.input(
			z.object({
				name: z.string().min(3).max(50),
				description: z.string().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const userId = ctx.session.user.id;

			// Check if user is already in a guild
			const player = await ctx.db.query.player.findFirst({
				where: eq(schema.player.userId, userId),
			});

			if (player?.guildId) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "You are already in a guild",
				});
			}

			// Create guild
			const guildId = crypto.randomUUID();
			await ctx.db.insert(schema.guild).values({
				id: guildId,
				name: input.name,
				description: input.description,
			});

			// Create or update player and assign to guild
			if (!player) {
				await ctx.db.insert(schema.player).values({
					userId,
					guildId,
				});
			} else {
				await ctx.db
					.update(schema.player)
					.set({ guildId })
					.where(eq(schema.player.userId, userId));
			}

			return { guildId };
		}),

	join: protectedProcedure
		.input(z.object({ guildId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const userId = ctx.session.user.id;

			const player = await ctx.db.query.player.findFirst({
				where: eq(schema.player.userId, userId),
			});

			if (player?.guildId) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "You are already in a guild",
				});
			}

			const guild = await ctx.db.query.guild.findFirst({
				where: eq(schema.guild.id, input.guildId),
			});

			if (!guild) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Guild not found",
				});
			}

			if (!player) {
				await ctx.db.insert(schema.player).values({
					userId,
					guildId: input.guildId,
				});
			} else {
				await ctx.db
					.update(schema.player)
					.set({ guildId: input.guildId })
					.where(eq(schema.player.userId, userId));
			}

			return { success: true };
		}),

	get: publicProcedure
		.input(z.object({ guildId: z.string() }))
		.query(async ({ ctx, input }) => {
			const guild = await ctx.db.query.guild.findFirst({
				where: eq(schema.guild.id, input.guildId),
				with: {
					members: {
						with: {
							user: true,
						},
					},
				},
			});

			if (!guild) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Guild not found",
				});
			}

			return guild;
		}),

	myGuild: protectedProcedure.query(async ({ ctx }) => {
		const userId = ctx.session.user.id;

		const player = await ctx.db.query.player.findFirst({
			where: eq(schema.player.userId, userId),
			with: {
				guild: {
					with: {
						members: {
							with: {
								user: true,
							},
						},
					},
				},
			},
		});

		return player?.guild || null;
	}),
	
	list: publicProcedure.query(async ({ ctx }) => {
		return ctx.db.query.guild.findMany({
			limit: 50,
			orderBy: (guild, { desc }) => [desc(guild.level)],
		});
	}),
});
