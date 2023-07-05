"use client";

import { useDropzone } from "react-dropzone";
import { useEffect, useState } from "react";

interface ExtendedFile extends File {
  preview: string;
}

export default function Home() {
  const [files, setFiles] = useState<ExtendedFile[]>([]);
  const [isLoad, setIsLoad] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/pdf": [],
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles: any[]) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, { preview: URL.createObjectURL(file) })
        )
      );
      console.log("File accepted");
    },
  });

  useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  return (
    <div className="flex flex-col items-center justify-center flex-grow p-10">
      <div
        {...getRootProps()}
        className="p-20 border-2 rounded-4 border-black border-dashed outline-none transition border-opacity-24 max-w-xl text-black text-center text-20"
      >
        <input {...getInputProps()} />
        <p>Drag and drop some files here or click to select files</p>
        <em>(Only pdf files will be accepted)</em>
      </div>
      <table className="mt-10 border-collapse">
        <thead>
          <tr>
            <th className="border border-black p-2">File Name</th>
            <th className="border border-black p-2">Size</th>
          </tr>
        </thead>
      </table>
    </div>
  );
}
