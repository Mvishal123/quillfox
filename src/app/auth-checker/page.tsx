"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { trpc } from "../_trpc/trpc-client";
import { Loader2 } from "lucide-react";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");

  trpc.authChecker.useQuery(undefined, {
    onSuccess: (data) => {
      const { success } = data;
      if (success) {
        const dest = origin ? `/${origin}` : "/dashboard";
        router.push(dest);
      }
    },
    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        router.push("/");
      }
    },
  });

  return (
    <div className="flex flex-col gap-6 w-full items-center mt-24">
      <Loader2 className="h-12 w-12 text-slate-900 animate-spin" />
      <div className="flex flex-col gap-2 text-center">
        <h1 className="font-semibold text-xl">Checking authentication...</h1>
        <p>You will be redirected automatically in a moment</p>
      </div>
    </div>
  );
};

export default Page;
