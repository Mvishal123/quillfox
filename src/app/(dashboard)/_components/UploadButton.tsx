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
const UploadButton = () => {
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Upload File</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]"></DialogContent>
      </Dialog>
    </div>
  );
};

export default UploadButton;
