"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useResizeDetector } from "react-resize-detector";

import { Document, Page, pdfjs } from "react-pdf";
import PdfFeatures from "./PdfFeatures";
import SimpleBar from "simplebar-react";
import "react-pdf/dist/Page/AnnotationLayer.css";
// worker for pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface PageProps {
  pdfURL: string;
}

const PdfRenderer = ({ pdfURL }: PageProps) => {
  const [pageNums, setPageNums] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pdfScale, setPdfScale] = useState<number>(1);
  const [rotateDeg, setRotateDeg] = useState<number>(0);
  const [isFullScreen, setIsFullScreen] = useState<Boolean>(false);

  const router = useRouter();
  const { ref, width } = useResizeDetector();

  const { toast } = useToast();

  const onDocumentLoadSuccess = (pageNos: number) => {
    // console.log("PAGE NUMBER: ", pageNos);

    setPageNums(pageNos);
  };

  const onPageNext = () => {
    setPageNumber((prev) => (prev < pageNums ? prev + 1 : prev));
  };
  const onPagePrev = () => {
    setPageNumber((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const onRotate = () => {
    setRotateDeg((prev) => {
      return prev <= 360 ? prev + 90 : 0;
    });
  };

  const FeaturesData = {
    pageNums,
    pageNumber,
    setPageNumber,
    onPageNext,
    onPagePrev,
    pdfScale,
    setPdfScale,
    onRotate,
    pdfURL,
  };

  return (
    <div>
      <div className="pt-4">
        <PdfFeatures pageData={FeaturesData} />
      </div>
      <SimpleBar className="max-h-[calc(100vh-45vh)] lg:max-h-[calc(100vh-8rem)] mt-1" autoHide={false}>
        <div className="flex-1 mt-2 w-full">
          <div ref={ref} className="max-h-[calc(100vh-45vh)] lg:max-h-[calc(100vh-8rem)]">
            <Document
              loading={
                <div className="mt-32 lg:mt-60 flex justify-center items-center">
                  <Loader2 className="animate-spin h-6 w-6 text-center" />
                </div>
              }
              file={pdfURL}
              onLoadError={(err) => {
                toast({
                  title: `${err}`,
                  description: "try again later",
                  variant: "destructive",
                });
                router.push("/dashboard");
              }}
              onLoadSuccess={({ numPages }) => onDocumentLoadSuccess(numPages)}
              className="max-h-full"
            >
              <Page
                pageNumber={pageNumber}
                width={width ? width : 1}
                scale={pdfScale}
                rotate={rotateDeg}
              />
            </Document>
          </div>
        </div>
      </SimpleBar>
    </div>
  );
};

export default PdfRenderer;
