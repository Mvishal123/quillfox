import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

interface PageProps {
  params: {
    fileId: string;
  };
}
const page = async ({ params }: PageProps) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const { fileId } = params;

  if (!user || !user.id) {
    redirect(`/auth-checker?origin=dashboard/${fileId}`);
  }

  const file = await db.file.findUnique({
    where: {
      id: fileId,
    },
  });

  return <div>{JSON.stringify(file)}</div>;
};

export default page;
