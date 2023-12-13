import Link from "next/link";
import MaxWidthContainer from "./MaxWidthContainer";
import { Button, buttonVariants } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/server";

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

            <LoginLink
              className={buttonVariants({
                variant: "ghost",
                size: "sm",
              })}
            >
              Signin
            </LoginLink>

            <RegisterLink
              className={buttonVariants({
                variant: "dark",
                size: "sm",
                className: "group"
              })}
            >
              Get started
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-[2px] transition-all" />
            </RegisterLink>
          </div>
        </div>
      </MaxWidthContainer>
    </nav>
  );
};

export default Navbar;
