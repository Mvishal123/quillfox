"use client";

import { trpc } from "@/app/_trpc/trpc-client";
import UploadButton from "./UploadButton";
import { Ghost, Loader2 } from "lucide-react";

const Dashboard = () => {
  const { data: files, isLoading } = trpc.getUserFiles.useQuery();

  return (
    <div className="max-w-7xl mx-auto p-12">
      <div>
        <div className="flex justify-between items-center border-b mb-12 pb-4">
          <h1 className="text-3xl font-semibold">My Files</h1>
          <UploadButton />
        </div>
      </div>
      <div className="w-full">
        {files && files.length !== 0 ? (
          <div></div>
        ) : isLoading ? (
          <div className="flex w-full justify-center">
            <Loader2 className="h-12 w-12 animate-spin" />
          </div>
        ) : (
          <div className="flex w-full justify-center flex-col items-center mt-32">
            <Ghost className="h-20 w-20" strokeWidth={1} />
            <div className="flex flex-col text-center gap-2 mt-4">
              <h1 className="font-semibold">Pretty empty around here</h1>
              <p className="text-center">
                Excited to see what you&apos;ll upload. Let&apos;s get that
                first PDF in!
              </p>{" "}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
