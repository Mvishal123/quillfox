import { getUserSubscriptionPlan } from "@/lib/stripe";
import {
  getKindeServerSession
} from "@kinde-oss/kinde-auth-nextjs/server";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import MaxWidthContainer from "./MaxWidthContainer";
import MobileNavbar from "./MobileNavbar";
import UserProfileButton from "./UserProfileButton";
import { buttonVariants } from "./ui/button";

const Navbar = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const isSubscribed = await getUserSubscriptionPlan();

  console.log({user});
  

  return (
    <nav className="sticky top-0 z-30 inset-x-0 w-full bg-white/75 h-14 border-b border-b-slate-200 backdrop-blur-lg transition-all">
      <MaxWidthContainer>
        <div className="h-14 flex justify-between items-center border-b">
          <Link className="flex z-40 font-semibold text-2xl" href="/">
            Quill<span className="text-primary">Fox</span>.
          </Link>

          <MobileNavbar isAuthorized={!!user} />

          <div className="hidden md:inline-block">
            {!user ? (
              // user not signed in
              <div className="hidden sm:flex gap-4 ">
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
                  href="sign-in"
                  className={buttonVariants({
                    variant: "ghost",
                    size: "sm",
                  })}
                >
                  Signin
                </Link>

                <Link
                  href="sign-up"
                  className={buttonVariants({
                    variant: "dark",
                    size: "sm",
                    className: "group",
                  })}
                >
                  Get started
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-[2px] transition-all" />
                </Link>
              </div>
            ) : (
              // user signed in
              <div className="flex justify-between items-center gap-4">
                <Link
                  className={buttonVariants({
                    variant: "ghost",
                  })}
                  href={"/dashboard"}
                >
                  Dashboard
                </Link>
                <UserProfileButton
                  name={
                    !user.given_name || !user.family_name
                      ? "Your Account"
                      : `${user.given_name} ${user.family_name}`
                  }
                  email={user.email ?? ""}
                  imageUrl={user.picture ?? ""}
                  isSubscribed={isSubscribed.isSubscribed}
                />
              </div>
            )}
          </div>
        </div>
      </MaxWidthContainer>
    </nav>
  );
};

export default Navbar;
