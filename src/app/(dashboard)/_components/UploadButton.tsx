"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import DropZoneArea from "./DropZoneArea";

const UploadButton = () => {
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Upload File</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[460px] pt-10 px-6">
          <DropZoneArea />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UploadButton;
