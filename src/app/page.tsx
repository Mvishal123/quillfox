import MaxWidthContainer from "./components/MaxWidthContainer";

const page = () => {
  return (
    <MaxWidthContainer className="mt-28 sm:mt-40 w-full flex justify-center item-center">
      <div className="mx-auto max-w-fit px-2 md:px-4 py-1 rounded-full border shadow-md text-sm hover:bg-slate-200/25 hover:shadow-lg cursor-pointer">
        <p className="font-semibold text-slate-600">Quillfox is now public</p>
      </div>
    </MaxWidthContainer>
  );
};

export default page;
