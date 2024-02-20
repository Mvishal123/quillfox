import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import Dashboard from "../_components/Dashboard";
import { getUserSubscriptionPlan } from "@/lib/stripe";

const page = async () => {
  // const { getUser } = getKindeServerSession();
  // const user = await getUser();

  // const { isSubscribed } = await getUserSubscriptionPlan();

  // if (!user || !user.id) {
  //   redirect("/auth-checker?origin=dashboard");
  // }

  // const isUser = await db.user.findUnique({
  //   where: {
  //     id: user.id,
  //   },
  // });

  // if (!isUser) {
  //   redirect("/auth-checker?origin=dashboard");
  // }
  return (
    <div>
      <Dashboard isSubscribed={false}/>
    </div>
  );
};

export default page;
