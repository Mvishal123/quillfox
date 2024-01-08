"use client";

import { ArrowRight, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const MobileNavbar = ({ isAuthorized }: { isAuthorized: boolean }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  const closeOnCurrentPage = (href: string) => {
    if (href === pathname) {
      toggleOpen();
    }
  };

  const pathname = usePathname();
  useEffect(() => {
    if (isOpen) {
      toggleOpen();
    }
  }, [pathname]);
  return (
    <div className="md:hidden">
      <Menu onClick={() => toggleOpen()} className="relative h-5 w-5 z-50" />
      {isOpen ? (
        <div className="fixed animate-in slide-in-from-top-5 z-0 w-full inset-0 fade-in-20">
          <ul className="absolute bg-white border-b border-slate-300 shadow-xl w-full grid mt-[3.5rem] px-12">
            {!isAuthorized ? (
              <>
                <li className="border-b px-4 pt-3 pb-2 w-full flex gap-2 justify-center items-center">
                  <Link
                    href={"/dashboard"}
                    className="flex font-bold"
                    onClick={() => closeOnCurrentPage(pathname)}
                  >
                    Get started
                  </Link>
                  <ArrowRight size="16px" />
                </li>
                <li className="bg-slate-300 shadow-sm" />
                <li className="border-b px-4 pt-3 pb-2 w-full flex gap-2 justify-center items-center">
                  <Link href={"/sign-in"} className="flex font-bold">
                    Sign in
                  </Link>
                </li>
                <li className="bg-slate-300 shadow-sm" />
                <li className="border-b px-4 pt-3 pb-2 w-full flex gap-2 justify-center items-center">
                  <Link href={"/pricing"} className="flex font-bold">
                    Pricing
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="bg-slate-300 shadow-sm" />
                <li className="border-b px-4 pt-3 pb-2 w-full flex gap-2 justify-center items-center">
                  <Link href={"/dashboard"} className="flex font-bold">
                    Dashboard
                  </Link>
                </li>
                <li className="bg-slate-300 shadow-sm" />
                <li className="border-b px-4 pt-3 pb-2 w-full flex gap-2 justify-center items-center">
                  <Link href="sign-out" className="flex font-bold">
                    Signout
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
};

export default MobileNavbar;
