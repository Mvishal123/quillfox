"use client";

import { getUserSubscriptionPlan } from "@/lib/stripe";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { trpc } from "@/app/_trpc/trpc-client";
import { useToast } from "./ui/use-toast";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { format } from "date-fns";

interface BillingFormProps {
  isUserSubscribed: Awaited<ReturnType<typeof getUserSubscriptionPlan>>;
}
const BillingForm = ({ isUserSubscribed }: BillingFormProps) => {
  const { toast } = useToast();
  const { mutate: createStripeSession, isLoading } =
    trpc.createStripeSession.useMutation({
      onSuccess: ({ url }) => {
        if (url) window.location.href = url;
        if (!url) {
          toast({
            variant: "destructive",
            description: "Don't worry. Try again later",
            title: "Payment error",
          });
        }
      },
    });
  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createStripeSession();
        }}
      >
        <Card className="px-4">
          <CardHeader>
            <CardTitle>Subscription Plan</CardTitle>
            <CardDescription>
              You are currently on{" "}
              <strong
                className={cn({
                  "bg-gradient-to-tr from-red-500 to-primary bg-clip-text text-transparent":
                    isUserSubscribed.name === "Pro",
                })}
              >
                {isUserSubscribed.name}
              </strong>{" "}
              plan
            </CardDescription>
            <CardFooter className={"flex flex-col items-start pl-0 pt-4"}>
              <Button
                type="submit"
                variant={"secondary"}
                className={cn({
                  "bg-primary text-white hover:bg-primary/75 hover:text-white":
                    !isUserSubscribed.isSubscribed,
                })}
              >
                {isUserSubscribed.isSubscribed
                  ? "Manage subscription"
                  : "Upgrade to pro"}
              </Button>

              {isUserSubscribed.isSubscribed ? (
                <p className="text-sm mt-2 text-slate-500">
                  {isUserSubscribed.isCanceled
                    ? "you subscription will be cancelled on"
                    : "your subscription will be renewed on"}{" "}
                  <strong>
                    {format(
                      isUserSubscribed.stripeCurrentPeriodEnd!,
                      "dd.MM.yyyy"
                    )}
                  </strong>
                </p>
              ) : null}
            </CardFooter>
          </CardHeader>
        </Card>
      </form>
    </div>
  );
};

export default BillingForm;
