import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { notFound, redirect } from "next/navigation";
import PdfRenderer from "../../_components/PdfRenderer";
import ChatContainer from "../../_components/ChatContainer";

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

  if (!file) {
    notFound();
  }

  return (
    <div className="h-[calc(100vh-3.5rem)] mx-auto">
      <div className="flex flex-col lg:flex-row h-full divide-y md:divide-x">
        {/* make it resizable divs -drag and resize */}
        <div className="flex-1 px-6">
          <PdfRenderer />
        </div>
        <div className="flex flex-[0.75]">
          <ChatContainer />
        </div>
      </div>
    </div>
  );
};

export default page;
