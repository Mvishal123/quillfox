import { trpc } from "@/app/_trpc/trpc-client";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { useUploadThing } from "@/lib/uploadthing";
import { Cloud, File } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DropZone from "react-dropzone";

const DropZoneArea = ({ isSubscribed }: { isSubscribed: boolean }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<Boolean>(true);
  const [loaderStatus, setLoaderStatus] = useState<number>(0);
  const { toast } = useToast();

  const { mutate: getFilePolling } = trpc.getFile.useMutation({
    onSuccess: ({ file }) => router.push(`/dashboard/${file.id}`),
    retry: 10,
    retryDelay: 500, //this is to retry indefinitely
  });
  const { startUpload } = useUploadThing(
    // isSubscribed ? "proPdfUploader" : "freePdfUploader"
    "proPdfUploader"
  );

  const startProgressBar = () => {
    const interval = setInterval(() => {
      setLoaderStatus((prev) => {
        if (prev > 85) {
          clearInterval(interval);
          return prev;
        }

        return prev + 5;
      });
    }, 500);

    return interval;
  };

  return (
    <DropZone
      multiple={false}
      onDrop={async (file) => {
        setIsLoading(true);

        const startProgress = startProgressBar();

        const uploadRes = await startUpload(file);

        if (!uploadRes) {
          setIsLoading(false);
          return toast({
            title: "Something went wrong",
            description: "Please try again later",
            variant: "destructive",
          });
        }

        const [uploadedFile] = uploadRes;
        const key = uploadedFile.key;
        if (!key) {
          return toast({
            title: "Something went wrong",
            description: "Please try again later",
            variant: "destructive",
          });
        }

        clearInterval(startProgress);
        setLoaderStatus(100);

        getFilePolling({ key });
        setIsLoading(false);
      }}
    >
      {({ getRootProps, getInputProps, acceptedFiles }) => (
        <div
          {...getRootProps()}
          className="w-full h-64 border-2 border-dashed border-slate-300 rounded-md"
        >
          {/* <label htmlFor="dropzone-file"> */}
          <div className="flex justify-center items-center w-full h-full bg-slate-50 hover:bg-slate-100 cursor-pointer">
            <div>
              <div className="flex flex-col items-center mb-6">
                <Cloud className="text-slate-400" />
                <h1 className="text-slate-400 mb-2">
                  <span className="text-primary/50 font-semibold">
                    Click to upload{" "}
                  </span>
                  or drag and drop
                </h1>
                <p className="text-xs text-muted-foreground">
                  PDF (upto {isSubscribed ? "16MB" : "4MB"})
                </p>
              </div>
              {acceptedFiles && acceptedFiles[0] ? (
                <div>
                  <div className="flex max-w-[8rem] mx-auto justify-between border divide-x px-3 py-2 rounded-md">
                    <div className="flex-[0.2]">
                      <File
                        className="w-[15px] h-[15px] text-primary mr-2"
                        strokeWidth={1}
                      />
                    </div>
                    <div className="flex-1 text-xs pl-2 truncate">
                      {acceptedFiles[0].name}
                    </div>
                  </div>
                </div>
              ) : null}
              {isLoading ? (
                <div className="mt-2">
                  <Progress
                    progressColor={loaderStatus === 100 ? "bg-green-500" : ""}
                    value={loaderStatus}
                    className="h-1 transition-all"
                  />
                </div>
              ) : (
                <></>
              )}
              {loaderStatus === 100 && (
                <div className="text-center mt-1">
                  <p className="animate-pulse font-semibold">Loading...</p>
                </div>
              )}
              <input className="hidden" {...getInputProps} />
            </div>
          </div>
          {/* </label> */}
        </div>
      )}
    </DropZone>
  );
};

export default DropZoneArea;
