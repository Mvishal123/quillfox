import MaxWidthContainer from "@/components/MaxWidthContainer";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const page = () => {
  return (
    <>
      <MaxWidthContainer className="mt-28 sm:mt-40 w-full flex flex-col justify-center items-center -z-10">
        <div className="mx-auto max-w-fit px-2 md:px-4 py-1 mb-4 rounded-full border shadow-md text-sm hover:bg-slate-200/25 hover:shadow-lg cursor-pointer">
          <p className="font-semibold text-slate-600">Quillfox is now public</p>
        </div>
        <h1 className="max-w-4xl text-center text-5xl md:text-6xl lg:text-7xl font-bold">
          Chat with your <br />
          <span className="text-primary">documents </span>in seconds
        </h1>
        <p className="mt-6 text-md md:text-lg text-center max-w-prose">
          Quillfox allows you to have conversations with any PDF&apos;s. Simply
          upload and start. She is brilliant and cunningly intelligent as a{" "}
          <span className="underline font-semibold">fox</span>
        </p>
        <Link href={"/dashboard"} target="_blank">
          <Button
            variant="dark"
            size="lg"
            className="flex gap-2 item-center group mt-12"
          >
            Get Started
            <span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-[2px] transition-all" />
            </span>
          </Button>
        </Link>
      </MaxWidthContainer>

      <div className="relative isolate mb-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>
        <div className="w-full flex justify-center items-center mx-auto mt-12 px-6 md:px-8">
          <div className="ring-slate-400/50 ring-inset p-3 rounded-lg bg-slate-800/10 max-w-4xl">
            <div>
              <Image
                src="/dashboard-preview.jpg"
                height={866}
                width={1364}
                quality={100}
                alt="Dashboard Preview"
                className="rounded-lg shadow-md ring ring-slate-300/25"
              />
            </div>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%-13rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-37rem)] sm:w-[72.1875rem]"
          />
        </div>
      </div>

      {/* Features */}
      <div className="mt-32 px-12">
        <div className=" space-y-2 text-center">
          <h1 className="text-5xl font-bold">Start chating in minutes</h1>
          <p className="text-lg">
            Chatting with PDF has never been easier than with quillfox
          </p>
        </div>

        {/* Steps */}
        <div className="flex justify-center my-12 ">
          <div>
            <ol className="flex flex-col md:flex-row space-x-0 md:space-x-24 space-y-4 md:space-y-0">
              {/* step 1 */}
              <li className="">
                <div className="pl-4 md:pl-0 md:pr-6 py-2  border-l-4 md:border-t-2 md:border-t-slate-500/80 md:border-l-0 max-w-2xl ">
                  <span className="text-md font-semibold text-primary">
                    Step 1
                  </span>
                  <div className="my-3">
                    <h1 className="text-lg font-semibold">
                      Sign up for an account
                    </h1>
                    <p>
                      Start with free plan or upgrade to the{" "}
                      <Link
                        href={"/pricing"}
                        className="text-primary underline underline-offset-1"
                      >
                        pro plan
                      </Link>
                    </p>
                  </div>
                </div>
              </li>
              {/* step 2 */}
              <li>
                <div className="pl-4  md:pl-0 md:pr-6 py-2 border-l-4 md:border-t-2 md:border-t-slate-500/80 md:border-l-0 max-w-2xl ">
                  <span className="text-md font-semibold text-primary">
                    Step 2
                  </span>
                  <div className="my-3">
                    <h1 className="text-lg font-semibold">
                      Upload your PDF file
                    </h1>
                    <p>
                      Foxy will process your file and make it ready for tou to
                      chat with
                    </p>
                  </div>
                </div>
              </li>
              {/* step 3 */}
              <li>
                <div className="pl-4 md:pl-0 md:pr-6 py-2  border-l-4 md:border-t-2 md:border-t-slate-500/80 md:border-l-0 max-w-2xl ">
                  <span className="text-md font-semibold text-primary">
                    Step 3
                  </span>
                  <div className="my-3">
                    <h1 className="text-lg font-semibold">
                      Start asking questions
                    </h1>
                    <p>It&apos; that simple. Try foxing your PDF today</p>
                  </div>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
