import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

const MaxWidthContainer = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <div
      className={cn("mx-auto px-6 md:px-20 w-full max-w-screen-xl", className)}
    >
      {children}
    </div>
  );
};

export default MaxWidthContainer;
