"use client";

import { trpc } from "@/app/_trpc/trpc-client";
import { format } from "date-fns";

import UploadButton from "./UploadButton";
import {
  Ghost,
  Loader2,
  MessageSquare,
  MessagesSquareIcon,
  PlusIcon,
  Trash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";

const Dashboard = ({ isSubscribed }: { isSubscribed: boolean }) => {
  // to show the loader only on the file being deleted
  const [deletingFile, setDeletingFile] = useState<string | null>(null);

  //once the file is deleted the this helps us to call the getUserFiles query again
  const utils = trpc.useUtils();

  const { data: files, isLoading: isFilesLoading } =
    trpc.getUserFiles.useQuery();
  const { mutate: deleteFile } = trpc.deleteFile.useMutation({
    onSuccess: () => utils.getUserFiles.invalidate(), // to refetch the query ( cache )
    onMutate: ({ id }) => setDeletingFile(id),
    onSettled: () => setDeletingFile(null),
  });

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file, i) => {
              return (
                <Link key={i} href={`/dashboard/${file.id}`}>
                  <ul>
                    <li className="bg-white rounded-md divide-y divide-slate-200">
                      <div className="flex gap-4 items-center px-8 py-4 truncate">
                        <div className="bg-gradient-to-r from-rose-400 to-red-500 h-12 w-12  rounded-full" />
                        <h1 className="text-xl font-semibold truncate ml-2">
                          {file.name}
                        </h1>
                      </div>
                      <div className="flex gap-3 px-6 py-2 items-center justify-between text-muted-foreground">
                        <div className="text-xs flex items-center">
                          <PlusIcon className="h-5 w-5" strokeWidth={1} />
                          <span>
                            {format(new Date(file.createdAt), "MMM yyyy")}
                          </span>
                        </div>
                        <div className="truncate flex gap-1 items-center">
                          <MessageSquare strokeWidth={1} className="h-5 w-5" />
                          <p className="text-xs truncate">test</p>
                        </div>
                        <Link href="/dashboard" className="">
                          <Button
                            className="bg-red-600/10 hover:bg-red-600/10 hover:ring-1 hover:ring-red-300 w-full"
                            size={"sm"}
                            onClick={() => deleteFile({ id: file.id })}
                          >
                            {deletingFile !== file.id ? (
                              <Trash
                                className="h-4 w-4 text-red-600"
                                strokeWidth={1}
                              />
                            ) : (
                              <Loader2
                                className="h-5 w-5 text-red-600 animate-spin"
                                strokeWidth={1}
                              />
                            )}
                          </Button>
                        </Link>
                      </div>
                    </li>
                  </ul>
                </Link>
              );
            })}
          </div>
        ) : isFilesLoading ? (
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
