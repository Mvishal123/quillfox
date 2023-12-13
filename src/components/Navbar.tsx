import Link from "next/link";
import MaxWidthContainer from "./MaxWidthContainer";
import { buttonVariants } from "./ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-30 inset-x-0 w-full bg-white/75 h-14 border-b border-b-slate-200 backdrop-blur-lg transition-all">
      <MaxWidthContainer>
        <div className="h-14 flex justify-between items-center border-b">
          <Link className="flex z-40 font-semibold text-2xl" href="/">
            Quill<span className="text-primary">Fox</span>.
          </Link>

          <div className="flex gap-4">
            <Link
              href="/pricing"
              className={buttonVariants({
                variant: "ghost",
                size: "sm",
              })}
            >
              Pricing
            </Link>
            <Link
              href="/signin"
              className={buttonVariants({
                variant: "ghost",
                size: "sm",
              })}
            >
              Signin
            </Link>
            <Link
              href="/dashboard"
              className={buttonVariants({
                size: "sm",
                className:
                  "bg-slate-900 group hover:bg-slate-800 transition-all",
              })}
            >
              Get started
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-[2px] transition-all" />
            </Link>
          </div>
        </div>
      </MaxWidthContainer>
    </nav>
  );
};

export default Navbar;
