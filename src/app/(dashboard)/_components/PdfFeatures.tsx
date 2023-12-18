import React from "react";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
interface FeatureProps {
  pageNums: number;
  pageNumber: number;
  setPageNumber: React.Dispatch<React.SetStateAction<number>>;
  onPageNext: () => void;
  onPagePrev: () => void;
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
    </div>
  );
};

export default PdfFeatures;
