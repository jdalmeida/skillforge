import type { NextRequest } from "next/server";
import { auth } from "@skillforge/auth";

import { db } from "@skillforge/db";

export async function createContext(req: NextRequest) {
	const session = await auth.api.getSession({
		headers: req.headers,
	});
	return {
		session,
		db,
	};
}

export type Context = Awaited<ReturnType<typeof createContext>>;
