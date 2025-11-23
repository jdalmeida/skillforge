import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../index";
import { schema } from "@skillforge/db";
import { eq, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const missionRouter = router({
	list: publicProcedure.query(async ({ ctx }) => {
		return ctx.db.query.mission.findMany();
	}),

	get: publicProcedure
		.input(z.object({ missionId: z.string() }))
		.query(async ({ ctx, input }) => {
			return ctx.db.query.mission.findFirst({
				where: eq(schema.mission.id, input.missionId),
			});
		}),

	start: protectedProcedure
		.input(z.object({ missionId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const userId = ctx.session.user.id;

			// Ensure player exists
			const player = await ctx.db.query.player.findFirst({
				where: eq(schema.player.userId, userId),
			});

			if (!player) {
				await ctx.db.insert(schema.player).values({
					userId,
				});
			}

			// Check if already started
			const existing = await ctx.db.query.userMission.findFirst({
				where: and(
					eq(schema.userMission.userId, userId),
					eq(schema.userMission.missionId, input.missionId),
				),
			});

			if (existing) {
				return existing;
			}

			const id = crypto.randomUUID();
			await ctx.db.insert(schema.userMission).values({
				id,
				userId,
				missionId: input.missionId,
				status: "pending",
			});

			return { id, status: "pending" };
		}),

	complete: protectedProcedure
		.input(z.object({ missionId: z.string(), answers: z.record(z.string()) }))
		.mutation(async ({ ctx, input }) => {
			const userId = ctx.session.user.id;

			const userMission = await ctx.db.query.userMission.findFirst({
				where: and(
					eq(schema.userMission.userId, userId),
					eq(schema.userMission.missionId, input.missionId),
				),
			});

			if (!userMission) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Mission not started",
				});
			}

			if (userMission.status === "completed") {
				return { success: true, alreadyCompleted: true, score: userMission.score };
			}

			// Fetch mission content for validation
			const mission = await ctx.db.query.mission.findFirst({
				where: eq(schema.mission.id, input.missionId),
			});

			if (!mission || !mission.content) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Mission content not found",
				});
			}

			const content = mission.content as { questions: { id: string; answer: string }[] };
			let correctCount = 0;
			const totalQuestions = content.questions.length;

			for (const question of content.questions) {
				if (input.answers[question.id] === question.answer) {
					correctCount++;
				}
			}

			const score = Math.round((correctCount / totalQuestions) * 100);
			const passed = score === 100; // Strict 100% for now, or maybe > 70%? Let's do 100% for code accuracy.

			if (!passed) {
				return { success: false, score, message: `You got ${correctCount}/${totalQuestions} correct. Try again!` };
			}

			// Update user mission
			await ctx.db
				.update(schema.userMission)
				.set({
					status: "completed",
					score: score,
					completedAt: new Date(),
				})
				.where(eq(schema.userMission.id, userMission.id));

			// Reward player
			const rewards = mission.rewards as { coins: number; parts: number; xp: number };
			const player = await ctx.db.query.player.findFirst({
				where: eq(schema.player.userId, userId),
			});

			if (player) {
				await ctx.db
					.update(schema.player)
					.set({
						coins: player.coins + (rewards.coins || 0),
						parts: player.parts + (rewards.parts || 0),
						experience: player.experience + (rewards.xp || 0),
					})
					.where(eq(schema.player.userId, userId));

				// Update Guild Session Score (Territory Control)
				if (player.guildId && mission.regionId) {
					// Find active session for this region
					const activeSession = await ctx.db.query.gameSession.findFirst({
						where: and(
							eq(schema.gameSession.regionId, mission.regionId),
							eq(schema.gameSession.status, "active")
						),
					});

					if (activeSession) {
						// Update or insert guild session score
						const guildSession = await ctx.db.query.guildSession.findFirst({
							where: and(
								eq(schema.guildSession.guildId, player.guildId),
								eq(schema.guildSession.sessionId, activeSession.id)
							),
						});

						if (guildSession) {
							await ctx.db
								.update(schema.guildSession)
								.set({
									score: guildSession.score + (rewards.xp || 0),
								})
								.where(
									and(
										eq(schema.guildSession.guildId, player.guildId),
										eq(schema.guildSession.sessionId, activeSession.id)
									)
								);
						} else {
							await ctx.db.insert(schema.guildSession).values({
								guildId: player.guildId,
								sessionId: activeSession.id,
								score: rewards.xp || 0,
								territoryControl: 0,
							});
						}
					}
				}
			}

			return { success: true, score };
		}),
});
