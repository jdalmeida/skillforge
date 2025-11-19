import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../index";
import { schema } from "@skillforge/db";
import { eq } from "drizzle-orm";

export const playerRouter = router({
	me: protectedProcedure.query(async ({ ctx }) => {
		const userId = ctx.session.user.id;
		const player = await ctx.db.query.player.findFirst({
			where: eq(schema.player.userId, userId),
			with: {
				guild: true,
				equipment: {
					with: {
						equipment: true,
					},
				},
			},
		});

		if (!player) {
			// Auto-create player profile if it doesn't exist (onboarding)
			await ctx.db.insert(schema.player).values({
				userId,
			});
			return ctx.db.query.player.findFirst({
				where: eq(schema.player.userId, userId),
				with: {
					guild: true,
				},
			});
		}

		return player;
	}),

	equipItem: protectedProcedure
		.input(z.object({ userEquipmentId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const userId = ctx.session.user.id;

			// Unequip all items of the same type first (one weapon, one armor, one tool)
			const targetEquip = await ctx.db.query.userEquipment.findFirst({
				where: eq(schema.userEquipment.id, input.userEquipmentId),
				with: { equipment: true },
			});

			if (!targetEquip || targetEquip.userId !== userId) {
				throw new Error("Equipment not found or not owned");
			}

			// Unequip all items of the same type
			const allUserEquip = await ctx.db.query.userEquipment.findMany({
				where: eq(schema.userEquipment.userId, userId),
				with: { equipment: true },
			});

			for (const ue of allUserEquip) {
				if (ue.equipment.type === targetEquip.equipment.type && ue.isEquipped) {
					await ctx.db
						.update(schema.userEquipment)
						.set({ isEquipped: false })
						.where(eq(schema.userEquipment.id, ue.id));
				}
			}

			// Equip the target item
			await ctx.db
				.update(schema.userEquipment)
				.set({ isEquipped: true })
				.where(eq(schema.userEquipment.id, input.userEquipmentId));

			return { success: true };
		}),

	unequipItem: protectedProcedure
		.input(z.object({ userEquipmentId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const userId = ctx.session.user.id;

			const targetEquip = await ctx.db.query.userEquipment.findFirst({
				where: eq(schema.userEquipment.id, input.userEquipmentId),
			});

			if (!targetEquip || targetEquip.userId !== userId) {
				throw new Error("Equipment not found or not owned");
			}

			await ctx.db
				.update(schema.userEquipment)
				.set({ isEquipped: false })
				.where(eq(schema.userEquipment.id, input.userEquipmentId));

			return { success: true };
		}),

	updateClass: protectedProcedure
		.input(z.object({ equipmentIds: z.array(z.string()) }))
		.mutation(async ({ ctx, input }) => {
			const userId = ctx.session.user.id;

			// Unequip all
			await ctx.db
				.update(schema.userEquipment)
				.set({ isEquipped: false })
				.where(eq(schema.userEquipment.userId, userId));

			// Equip new
			for (const id of input.equipmentIds) {
				await ctx.db
					.update(schema.userEquipment)
					.set({ isEquipped: true })
					.where(eq(schema.userEquipment.id, id));
			}

			return { success: true };
		}),
});
