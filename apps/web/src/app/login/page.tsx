"use client";

import SignInForm from "@/components/sign-in-form";
import SignUpForm from "@/components/sign-up-form";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function LoginPage() {
  const [showSignIn, setShowSignIn] = useState(false);
  const router = useRouter();
  
  const { data: player, isLoading } = useQuery(trpc.player.me.queryOptions());

  // 2. & 3. UseEffect para controlar o redirecionamento
  useEffect(() => {
    if (player) {
      router.replace("/dashboard");
    }
  }, [player, router]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>; 
  }

  if (player) return null;

  return showSignIn ? (
    <SignInForm onSwitchToSignUp={() => setShowSignIn(false)} />
  ) : (
    <SignUpForm onSwitchToSignIn={() => setShowSignIn(true)} />
  );
}
