import UploadButton from "./UploadButton";

const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto p-12">
      <div>
        <div className="flex justify-between items-center border-b mb-12 pb-4">
          <h1 className="text-3xl font-semibold">My Files</h1>
          <UploadButton />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
