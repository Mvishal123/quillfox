import MaxWidthContainer from "@/components/MaxWidthContainer";
import React from "react";
import { PLANS } from "@/config/stripe";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Check, HelpCircle } from "lucide-react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import PlanUpgradeButton from "@/components/PlanUpgradeButton";

const pricingItems = [
  {
    plan: "Free",
    tagline: "For small side projects.",
    quota: 10,
    features: [
      {
        text: "5 pages per PDF",
        footnote: "The maximum amount of pages per PDF-file.",
      },
      {
        text: "4MB file size limit",
        footnote: "The maximum file size of a single PDF file.",
      },
      {
        text: "Mobile-friendly interface",
      },
      {
        text: "Higher-quality responses",
        footnote: "Better algorithmic responses for enhanced content quality",
        negative: true,
      },
      {
        text: "Priority support",
        negative: true,
      },
    ],
  },
  {
    plan: "Pro",
    tagline: "For larger projects with higher needs.",
    quota: PLANS.find((p) => p.slug === "pro")!.quota,
    features: [
      {
        text: "25 pages per PDF",
        footnote: "The maximum amount of pages per PDF-file.",
      },
      {
        text: "16MB file size limit",
        footnote: "The maximum file size of a single PDF file.",
      },
      {
        text: "Mobile-friendly interface",
      },
      {
        text: "Higher-quality responses",
        footnote: "Better algorithmic responses for enhanced content quality",
      },
      {
        text: "Priority support",
      },
    ],
  },
];

const PricingPage = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <MaxWidthContainer className="max-w-5xl text-center mt-24 mb-12">
      <div className="space-y-2">
        <h1 className="font-bold text-3xl">Pricing</h1>
        <h3 className="text-slate-500 text-md lg:text-lg">
          Whether you&apos;re just trying out our service or need more,
          we&apos;ve got you covered
        </h3>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
        {PLANS.map(({ name, slug, quota, pagesPerPdf, price }) => {
          const planCost = price.amount;
          const isPro = name.toLocaleLowerCase() === "pro";
          const features = pricingItems.find(
            (p) => p.plan.toLowerCase() === name.toLowerCase()
          )?.features!;

          return (
            <div
              key={name}
              className={cn(
                "relative border border-slate-200 shadow-lg bg-slate-50 rounded-md pb-6 pt-2",
                {
                  "border-2 border-primary shadow-red-200": isPro,
                }
              )}
            >
              <div>
                <div
                  className={cn(
                    "absolute left-0 right-0 -top-3 font-bold text-center mx-auto w-32 py-2 rounded-xl text-xs",
                    {
                      "bg-gradient-to-r from-primary to-red-900 text-white":
                        isPro,
                      "bg-slate-300": !isPro,
                    }
                  )}
                >
                  {isPro ? "Upgrade now" : "Get started"}
                </div>
                <div className="mt-6">
                  <h3 className=" text-xl font-bold">{name}</h3>
                  <p className="text-sm text-slate-400">
                    {isPro
                      ? "For larger projects with higher needs"
                      : "For small side projects"}
                  </p>
                </div>
                <div className="text-5xl mt-8 font-bold">
                  ${price.amount}
                  <p className="text-lg font-light text-slate-400 my-2">
                    per month
                  </p>
                </div>
              </div>
              <div className="w-full bg-slate-100 py-2 border-y">
                <p className="flex justify-center items-center gap-2">
                  {isPro ? "50 PDFs/month included" : "12 PDFs/month included"}
                  <TooltipProvider>
                    <Tooltip delayDuration={300}>
                      <TooltipContent className="text-xs">
                        {isPro
                          ? "Upload upto 50 PDFs a month"
                          : "Upload upto 12 PDFs a month for free"}
                      </TooltipContent>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-slate-500 cursor-default" />
                      </TooltipTrigger>
                    </Tooltip>
                  </TooltipProvider>
                </p>
              </div>
              <ul className="flex flex-col gap-3  justify-center px-12 pt-8">
                {features.map(({ text, footnote, negative }, i) => {
                  return (
                    <li className="flex gap-2 flex-shrink-0" key={i}>
                      <Check
                        className={cn("h-4 w-4", {
                          "text-slate-300": negative,
                          "text-primary shadow-sm rounded-full shadow-primary":
                            !negative,
                        })}
                      />
                      {text}
                      <span>
                        {!negative && footnote && (
                          <TooltipProvider>
                            <Tooltip delayDuration={300}>
                              <TooltipContent className="text-xs">
                                {footnote}
                              </TooltipContent>
                              <TooltipTrigger>
                                <HelpCircle className="h-4 w-4 text-slate-500 cursor-default" />
                              </TooltipTrigger>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <div className="px-2 mt-12">
                {name.toLowerCase() === "free" ? (
                  <Link
                    href={user ? "/dashboard" : "/sign-in"}
                    className={buttonVariants({
                      variant: "secondary",
                      className: "w-full",
                    })}
                  >
                    {user ? "continue" : "sign in"}
                  </Link>
                ) : user ? (
                  <PlanUpgradeButton user={user} />
                ) : (
                  <PlanUpgradeButton user={user} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </MaxWidthContainer>
  );
};

export default PricingPage;
