import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

const page = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    redirect("/auth-checker?origin=dashboard");
  }
  return <div>page</div>;
};

export default page;
