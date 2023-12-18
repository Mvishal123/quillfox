import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp } from "lucide-react";
import React from "react";

interface FeatureProps {
  pageNums: number | undefined;
  pageNumber: number;
  setPageNumber: React.Dispatch<React.SetStateAction<number>>;
  onPageNext: () => void;
  onPagePrev: () => void;
}

const PdfFeatures = ({ pageData }: { pageData: FeatureProps }) => {
  return (
    <div className="h-10 md:h-14 bg-white rounded-md shadow-md w-full px-2 flex justify-between items-center">
      <div className="flex gap-1">
        <Button variant={"ghost"} size={"sm"} onClick={pageData.onPageNext}>
          <ChevronUp />
        </Button>
        <div className="flex justify-center items-center gap-2">
          <Input
            className="w-10 focus-visible:ring-none mx-auto"
            value={pageData.pageNumber}
          />
          <span>
            <p>/ {pageData.pageNums ?? "x"}</p>
          </span>
        </div>
        <Button variant={"ghost"} size={"sm"} onClick={pageData.onPagePrev}>
          <ChevronDown />
        </Button>
      </div>
    </div>
  );
};

export default PdfFeatures;
