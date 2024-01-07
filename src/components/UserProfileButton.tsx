"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Button, buttonVariants } from "./ui/button";
import Image from "next/image";
import { Gem, User } from "lucide-react";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import Link from "next/link";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

interface UserProfileButtonProps {
  name: string;
  email: string;
  imageUrl: string;
  isSubscribed: boolean;
}

const UserProfileButton = ({
  name,
  email,
  imageUrl,
  isSubscribed,
}: UserProfileButtonProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="h-8 w-8 aspect-square bg-slate-200 rounded-full"
          variant={"ghost"}
        >
          <Avatar className="relative h-8 w-8 aspect-square">
            {imageUrl ? (
              <div className="relative w-full h-full aspect-square">
                <Image fill src={imageUrl} alt="profile-picture" />
              </div>
            ) : (
              <AvatarFallback className="w-full h-full flex justify-center items-center">
                <User className="w-4 h-4 " />
              </AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white border rounded-md">
        <div className="flex flex-col justify-center items-start gap-2 p-2">
          <div className="flex flex-col items-start">
            <p className="text-sm font-semibold">{name}</p>
            <p className="text-xs text-slate-500">{email}</p>
          </div>

          <DropdownMenuSeparator />

          <Link
            className={buttonVariants({
              variant: "ghost",
              size: "sm",
              className: "w-full",
            })}
            href={"/dashboard"}
          >
            Dashboard
          </Link>

          {isSubscribed ? (
            <Link
              className={buttonVariants({
                variant: "secondary",
                size: "sm",
                className: "w-full",
              })}
              href={"/dashboard/billing"}
            >
              Manage subscription
            </Link>
          ) : (
            <Link
              className={buttonVariants({
                variant: "secondary",
                size: "sm",
                className: "w-full",
              })}
              href={"/pricing"}
            >
              Upgrade
              <Gem className="h-4 w-4 ml-1.5 text-primary" strokeWidth={2} />
            </Link>
          )}
          <DropdownMenuSeparator />

          <Button asChild className="w-full" variant="ghost">
            <LogoutLink>Logout</LogoutLink>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileButton;
