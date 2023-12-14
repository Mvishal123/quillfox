"use client";

import { trpc } from "@/app/_trpc/trpc-client";
import UploadButton from "./UploadButton";
import {
  Ghost,
  Loader2,
  MessageSquare,
  MessagesSquareIcon,
  Trash,
} from "lucide-react";
import Skeleton from "react-loading-skeleton";
import { Button } from "@/components/ui/button";

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
          <div>
            {files.map((file, i) => {
              return (
                <div key={i}>
                  <ul className="grid md:grid-cols-2 lg:grid-cols-3">
                    <li className="bg-white rounded-md divide-y divide-slate-200">
                      <div className="flex gap-4 items-center px-8 py-4">
                        <div className="bg-gradient-to-r from-rose-400 to-red-500 h-12 w-12 rounded-full" />
                        <h1 className="text-xl font-semibold">{file.name}</h1>
                      </div>
                      <div className="flex justify-between px-6 py-2 items-center">
                        <div className="text-sm">{file.createdAt}</div>
                        <div>
                          <MessageSquare strokeWidth={1} className="h-5 w-5" />
                        </div>
                        <div>
                          <Button className="bg-red-600/10 hover:bg-red-600/10 hover:ring-1 hover:ring-red-300">
                            <Trash
                              className="h-5 w-5 text-red-600"
                              strokeWidth={1}
                            />
                          </Button>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              );
            })}
          </div>
        ) : isLoading ? (
          <div className="flex w-full justify-center mt-36">
            <Loader2 className="h-12 w-12 animate-spin" strokeWidth={1} />
          </div>
        ) : (
          <div className="flex w-full justify-center flex-col items-center mt-32">
            <Ghost className="h-20 w-20" strokeWidth={1} />
            <div className="flex flex-col text-center gap-2 mt-4">
              <h1 className="font-semibold">Pretty empty around here</h1>
              <p className="text-center">
                Excited to see what you&apos;ll upload. Let&apos;s get that
                first PDF in!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
