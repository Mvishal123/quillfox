"use client";

import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/dist/types";
import React from "react";
import { Button, buttonVariants } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { trpc } from "@/app/_trpc/trpc-client";

const PlanUpgradeButton = ({ user }: { user: KindeUser | null }) => {
  const { mutate: createStripeSession } = trpc.createStripeSession.useMutation({
    onSuccess: ({ url }) => {
      window.location.href = url ?? "/dashboard/billing";
    },

    onError: (error) => {
      console.log("ERROR:", error);
    },
  });
  return (
    <Button className="w-full" onClick={() => createStripeSession()}>
      {user ? (
        <span className="flex items-center gap-2 group">
          Upgrade now{" "}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-all" />
        </span>
      ) : (
        "Upgrade now"
      )}
    </Button>
  );
};

export default PlanUpgradeButton;
