"use client";

import { useState } from "react";

import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
// worker for pdf
pdfjs.GlobalWorkerOptions.workerSrc =
  `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface PageProps {
  pdfURL: string;
}

const PdfRenderer = ({ pdfURL }: PageProps) => {
  const [pageNums, setPageNums] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const onDocumentLoadSuccess = ({ pageNos }: { pageNos: number }) => {
    setPageNums(pageNos);
    return;
  };

  return (
    <div className="h-full">
      <div className="pt-4">
        <div className="h-10 md:h-14 bg-white rounded-md shadow-md w-full px-2 flex justify-between items-center">
          Features
        </div>
      </div>
      <div className="w-full max-h-screen">
        <Document
          file={pdfURL}
          onLoadError={(error: any) => alert(error)}
          onLoadSuccess={() => onDocumentLoadSuccess}
        >
          <Page pageNumber={pageNumber} />
        </Document>
      </div>
    </div>
  );
};

export default PdfRenderer;
