import { protectedProcedure, publicProcedure, router } from "../index";

import { guildRouter } from "./guild";
import { mapRouter } from "./map";
import { missionRouter } from "./mission";
import { playerRouter } from "./player";
import { shopRouter } from "./shop";
import { leaderboardRouter } from "./leaderboard";

export const appRouter = router({
	healthCheck: publicProcedure.query(() => {
		return "OK";
	}),
	guild: guildRouter,
	map: mapRouter,
	mission: missionRouter,
	player: playerRouter,
	shop: shopRouter,
	leaderboard: leaderboardRouter,
});
export type AppRouter = typeof appRouter;
