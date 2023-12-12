import MaxWidthContainer from "@/components/MaxWidthContainer";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const page = () => {
  return (
    <MaxWidthContainer className="mt-28 sm:mt-40 w-full flex flex-col justify-center items-center">
      <div className="mx-auto max-w-fit px-2 md:px-4 py-1 mb-4 rounded-full border shadow-md text-sm hover:bg-slate-200/25 hover:shadow-lg cursor-pointer">
        <p className="font-semibold text-slate-600">Quillfox is now public</p>
      </div>
      <h1 className="max-w-4xl text-center text-5xl md:text-6xl lg:text-7xl font-bold">
        Chat with your <span className="text-primary">documents </span>in
        seconds
      </h1>
      <p className="mt-6 text-md md:text-lg text-center max-w-prose">
        Quillfox allows you to have conversations with any PDF's. Simply upload
        and start. She is brilliant and cunningly intelligent as a{" "}
        <span className="underline font-semibold">fox</span>
      </p>
      <Link href={"/dashboard"} target="_blank">
        <Button variant="dark" size="lg" className="flex gap-2 item-center group mt-12">
          Get Started
          <span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-[2px] transition-all" />
          </span>
        </Button>
      </Link>
    </MaxWidthContainer>
  );
};

export default page;
