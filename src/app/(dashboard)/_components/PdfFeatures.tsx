import React from "react";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@radix-ui/react-dropdown-menu";
import {
  ChevronDown,
  ChevronUp,
  Rotate3D,
  RotateCcw,
  RotateCw,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
interface FeatureProps {
  pageNums: number;
  pageNumber: number;
  setPageNumber: React.Dispatch<React.SetStateAction<number>>;
  onPageNext: () => void;
  onPagePrev: () => void;
  pdfScale: number;
  setPdfScale: React.Dispatch<React.SetStateAction<number>>;
  onRotate: () => void;
}

const PdfFeatures = ({ pageData }: { pageData: FeatureProps }) => {
  const validationSchema = z.object({
    pageNumber: z.string().refine((num) => {
      return Number(num) > 0 && Number(num) <= pageData.pageNumber;
    }),
  });
  type TinputValidation = z.infer<typeof validationSchema>;

  const {
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TinputValidation>({
    defaultValues: {
      pageNumber: "1",
    },
    resolver: zodResolver(validationSchema),
  });

  const onSubmit = ({ pageNumber }: TinputValidation) => {
    console.log(pageNumber);

    pageData.setPageNumber(Number(pageNumber));
    setValue("pageNumber", String(pageData.pageNumber));
  };

  console.log("PAGE NUMBER", pageData.pageNumber);

  return (
    <div className="h-10 md:h-14 bg-white rounded-md shadow-md w-full px-2 flex justify-between items-center">
      <div className="flex gap-1">
        <Button
          variant={"ghost"}
          size={"sm"}
          onClick={pageData.onPagePrev}
          disabled={pageData.pageNumber === 1}
        >
          <ChevronDown />
        </Button>
        <div className="flex justify-center items-center gap-2">
          <Input
            {...register("pageNumber")}
            className={cn(
              "w-10 h-8 focus-visible:ring-none mx-auto",
              errors.pageNumber ? "focus-visible:ring-red-500" : ""
            )}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit(onSubmit)();
              }
            }}
            value={pageData.pageNumber}
          />
          <span>
            <p>/ {pageData.pageNums ?? "x"}</p>
          </span>
        </div>
        <Button
          variant={"ghost"}
          size={"sm"}
          onClick={pageData.onPageNext}
          disabled={pageData.pageNumber === pageData.pageNums}
        >
          <ChevronUp />
        </Button>
      </div>

      {/*  second part*/}
      <div className="flex justify-center items-center z-40">
        <div className="flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"ghost"}>
                <Search className="h-5 w-5" />
                <span className="flex items-center gap-0.5 text-sm ml-2">
                  {pageData.pdfScale * 100}% <ChevronDown className="h-5 w-5" />
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent asChild>
              <div className="flex flex-col gap-1 bg-slate-50 px-2">
                <Button
                  variant={"ghost"}
                  onClick={() => pageData.setPdfScale(1)}
                >
                  100%
                </Button>
                <Button
                  variant={"ghost"}
                  onClick={() => pageData.setPdfScale(1.5)}
                >
                  150%
                </Button>
                <Button
                  variant={"ghost"}
                  onClick={() => pageData.setPdfScale(2)}
                >
                  200%
                </Button>
                <Button
                  variant={"ghost"}
                  onClick={() => pageData.setPdfScale(2.5)}
                >
                  250%
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div>
          <Button variant={"ghost"} onClick={pageData.onRotate}>
            <RotateCw className="h-5 w-5 " />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PdfFeatures;
