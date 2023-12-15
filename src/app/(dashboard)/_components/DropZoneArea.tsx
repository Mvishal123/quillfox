"use client";

import { Cloud, File } from "lucide-react";
import DropZone from "react-dropzone";

const DropZoneArea = () => {
  return (
    <DropZone multiple={false} onDrop={(file) => console.log(file)}>
      {({ getRootProps, getInputProps, acceptedFiles }) => (
        <div
          {...getRootProps()}
          className="w-full h-64 border-2 border-dashed border-slate-300 rounded-md"
        >
          <label htmlFor="dropzone-file">
            <div className="flex justify-center items-center w-full h-full bg-slate-50 hover:bg-slate-100 cursor-pointer">
              <div>
                <div className="flex flex-col items-center mb-6">
                  <Cloud className="text-slate-400" />
                  <h1 className="text-slate-400 mb-2">
                    <span className="text-primary/50 font-semibold">
                      Click to upload{" "}
                    </span>
                    or drog and drop
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    PDF (upto 4MB)
                  </p>
                </div>
                {!acceptedFiles && !acceptedFiles[0] ? (
                  <div>
                    <div className="flex max-w-[8rem] mx-auto justify-between border divide-x px-3 py-2 rounded-md">
                      <div className="flex-[0.2]">
                        <File
                          className="w-[15px] h-[15px] text-primary mr-2"
                          strokeWidth={1}
                        />
                      </div>
                      <div className="flex-1 text-xs pl-2">file.pdf</div>
                    </div>
                  </div>
                ) : null}
                {}
              </div>
            </div>
          </label>
        </div>
      )}
    </DropZone>
  );
};

export default DropZoneArea;
