import { clsx, type ClassValue } from "clsx";
import { Metadata } from "next";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const absoluteUrl = (path: string) => {
  if (typeof window !== "undefined") return path;
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}${path}`;
  }
  return `http://localhost:${process.env.PORT ?? 3000}${path}`;
};

export const generateMetaData = ({
  title = "quillfox",
  description = "quillfox is an open source application that makes chatting with PDFs easy",
  image = "/logo.png",
  icons = "/favicon.ico",
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
} = {}): Metadata => {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@Mvishalx",
    },
    icons: icons ?? "/favicon.ico",
    metadataBase: new URL("https://quillfox.vercel.app"),
    ...(noIndex && {
      index: false,
      follow: false,
    }),
  };
};
