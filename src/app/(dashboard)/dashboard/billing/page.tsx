import BillingForm from "@/components/BillingForm";
import MaxWidthContainer from "@/components/MaxWidthContainer";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import React from "react";

const BillingPage = async () => {
  const isUserSubscribed = await getUserSubscriptionPlan();
  return (
    <MaxWidthContainer>
      <div className="mt-12">
        <BillingForm isUserSubscribed={isUserSubscribed} />
      </div>
    </MaxWidthContainer>
  );
};

export default BillingPage;
