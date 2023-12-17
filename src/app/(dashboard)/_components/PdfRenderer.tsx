"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useResizeDetector } from "react-resize-detector";

import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
// worker for pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface PageProps {
  pdfURL: string;
}

const PdfRenderer = ({ pdfURL }: PageProps) => {
  const [pageNums, setPageNums] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);

  const router = useRouter();

  const { toast } = useToast();
  const onDocumentLoadSuccess = ({ pageNos }: { pageNos: number }) => {
    setPageNums(pageNos);
  };

  const { ref, width} = useResizeDetector();

  return (
    <div>
      <div className="pt-4">
        <div className="h-10 md:h-14 bg-white rounded-md shadow-md w-full px-2 flex justify-between items-center">
          Features
        </div>
      </div>
      <div className="flex-1 mt-1 w-full max-h-screen">
        <div ref={ref}>
          <Document
            loading={
              <div className="mt-32 lg:mt-60 flex justify-center items-center">
                <Loader2 className="animate-spin h-6 w-6 text-center" />
              </div>
            }
            file={pdfURL}
            onLoadError={() => {
              toast({
                title: "Error loading PDF",
                description: "try again later",
                variant: "destructive",
              });
              router.push("/dashboard");
            }}
            onLoadSuccess={() => onDocumentLoadSuccess}
            className="max-h-full"
          >
            <Page pageNumber={1} width={width ? width : 1}/>
          </Document>
        </div>
      </div>
    </div>
  );
};

export default PdfRenderer;
