import DropZone from "react-dropzone";
const DropZoneArea = () => {
  //   const onDropHandler = (file: any) => {
  //     console.log(file);
  //   };
  return (
    <DropZone multiple={false} onDrop={(file) => console.log(file)}>
      {({ getRootProps, getInputProps, acceptedFiles }) => (
        <div
          {...getRootProps()}
          className="w-full h-64 border-2 border-dashed border-slate-300 rounded-md"
        >
          <label htmlFor="dropzone-file">
            <div className="flex justify-center items-center w-full h-full bg-slate-50 hover:bg-slate-100">
              Drop here
            </div>
          </label>
        </div>
      )}
    </DropZone>
  );
};

export default DropZoneArea;
