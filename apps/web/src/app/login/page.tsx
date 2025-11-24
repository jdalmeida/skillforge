"use client";

import SignInForm from "@/components/sign-in-form";
import SignUpForm from "@/components/sign-up-form";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
import { useRouter } from "nextjs/navigation"
import { useState } from "react";

export default function LoginPage() {
	const [showSignIn, setShowSignIn] = useState(false);
	const router = useRouter();
	const { data: player, isLoading } = useQuery(trpc.player.me.queryOptions());

	if (player) {
		router.redirect("/dashboard");
	}

	return showSignIn ? (
		<SignInForm onSwitchToSignUp={() => setShowSignIn(false)} />
	) : (
		<SignUpForm onSwitchToSignIn={() => setShowSignIn(true)} />
	);
}
