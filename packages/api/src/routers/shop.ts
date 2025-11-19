import { z } from "zod";
import { protectedProcedure, router } from "../index";
import { schema } from "@skillforge/db";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const shopRouter = router({
	listItems: protectedProcedure.query(async ({ ctx }) => {
		return ctx.db.query.equipment.findMany();
	}),

	purchase: protectedProcedure
		.input(z.object({ equipmentId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const userId = ctx.session.user.id;

			// Fetch equipment details
			const equipment = await ctx.db.query.equipment.findFirst({
				where: eq(schema.equipment.id, input.equipmentId),
			});

			if (!equipment) {
				throw new TRPCError({ code: "NOT_FOUND", message: "Equipment not found" });
			}

			// Fetch player
			const player = await ctx.db.query.player.findFirst({
				where: eq(schema.player.userId, userId),
			});

			if (!player) {
				throw new TRPCError({ code: "NOT_FOUND", message: "Player not found" });
			}

			// Calculate cost (placeholder: 100 coins per item)
			const cost = 100;

			if (player.coins < cost) {
				throw new TRPCError({ code: "BAD_REQUEST", message: "Insufficient coins" });
			}

			// Deduct coins
			await ctx.db
				.update(schema.player)
				.set({ coins: player.coins - cost })
				.where(eq(schema.player.userId, userId));

			// Add equipment to user's inventory
			await ctx.db.insert(schema.userEquipment).values({
				id: `${userId}-${equipment.id}-${Date.now()}`,
				userId,
				equipmentId: equipment.id,
				isEquipped: false,
			});

			return { success: true };
		}),
});
