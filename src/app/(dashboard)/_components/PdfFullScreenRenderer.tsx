"use client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Maximize } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

import { Document, Page } from "react-pdf";
import { useResizeDetector } from "react-resize-detector";
import SimpleBar from "simplebar-react";

interface FeatureProps {
  pageNums: number;
  pageNumber: number;
  setPageNumber: React.Dispatch<React.SetStateAction<number>>;
  onPageNext: () => void;
  onPagePrev: () => void;
  pdfScale: number;
  setPdfScale: React.Dispatch<React.SetStateAction<number>>;
  onRotate: () => void;
  pdfURL: string;
}

const PdfFullScreenRenderer = ({
  url,
  data,
}: {
  url: string;
  data: FeatureProps;
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const { ref, width } = useResizeDetector();

  return (
    <div className="w-full">
      <SimpleBar autoHide={false} className="">
        <div ref={ref} className="max-h-screen">
          <Document
            loading={
              <div className="mt-32 lg:mt-60 flex justify-center items-center">
                <Loader2 className="animate-spin h-6 w-6 text-center" />
              </div>
            }
            file={url}
            onLoadError={() => {
              toast({
                title: "Error loading PDF",
                description: "try again later",
                variant: "destructive",
              });
              router.push("/dashboard");
            }}
            //   onLoadSuccess={({ numPages }) => onDocumentLoadSuccess(numPages)}
            className="max-h-full"
          >
            {new Array(data.pageNums).fill(0).map((_, i) => {
              return (
                <Page
                  width={width ? width : 1}
                  pageNumber={i + 1}
                  key={i}
                  className="py-4"
                />
              );
            })}
          </Document>
        </div>
      </SimpleBar>
    </div>
  );
};

export default PdfFullScreenRenderer;
