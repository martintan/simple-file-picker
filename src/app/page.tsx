"use client";
import JSZip from "jszip";
import { useCallback, useRef, useState } from "react";

/** Represents a file within a ZIP archive. */
type ZipFileItem = {
  /** The original name of the file as it appears in the ZIP archive. */
  name: string;
  /** The JSZip object representing the file's content and metadata. */
  file: JSZip.JSZipObject;
  /** An optional new name for the file. */
  newName?: string;
};

// Utility function to extract message from an unknown error
const getErrorMessage = (err: unknown) =>
  err instanceof Error ? err.message : JSON.stringify(err);

export default function Home() {
  const [fileList, setFileList] = useState<ZipFileItem[]>([]);
  const [started, setStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const currentFileIndexRef = useRef(0);

  const processFiles = useCallback(
    async (files: ZipFileItem[]) => {
      try {
        for (let i = currentFileIndexRef.current; i < files.length; i++) {
          if (isPaused) {
            console.log(`Process paused at file index: ${i}`);
            return;
          }

          const file = files[i];
          const name = file.newName || file.name;
          currentFileIndexRef.current = i;
          console.log(`Processing file: ${name}`);

          // Set up the file for downloading
          const content = await files[i].file.async("blob");
          const fileBlob = new Blob([content], {
            type: "application/octet-stream",
          });
          // Programmatically start the download
          const fileUrl = URL.createObjectURL(fileBlob);
          setDownloadUrl(fileUrl);
          document.getElementById(`download-link-${i}`)?.click();
          URL.revokeObjectURL(fileUrl);

          // Simulate delay for demo'ing
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      } catch (err) {
        const errorMessage = getErrorMessage(err);
        console.error(errorMessage);
        alert(`Failed to process some files: ${errorMessage}`);
      }
      alert("All files processed");
    },
    [isPaused]
  );

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      const zip = new JSZip();
      const contents = await zip.loadAsync(file);
      const files: ZipFileItem[] = [];

      contents.forEach((path, file) => {
        if (!file.dir) {
          files.push({ name: path, newName: path, file });
        }
      });

      setFileList(files);
      currentFileIndexRef.current = 0;
    } catch (err) {
      alert(`Error processing zip: ${getErrorMessage(err)}`);
    }
  };

  const duplicateFile = (index: number) => {
    const file = fileList[index];
    const newFile = {
      ...file,
      name: `${file.name} (copy)`,
      newName: `${file.name} (copy)`,
    };
    setFileList([...fileList, newFile]);
  };

  const updateFileName = (index: number, newName: string) => {
    const updatedFiles = fileList.map((file, i) => {
      if (i === index) {
        return { ...file, newName: newName };
      }
      return file;
    });
    setFileList(updatedFiles);
  };

  const pauseProcess = () => setIsPaused(true);

  const continueProcess = () => {
    setIsPaused(false);
    setStarted(true);
    const filesToContinue = fileList.slice(currentFileIndexRef.current);
    processFiles(filesToContinue);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 space-y-4">
      <input
        type="file"
        onChange={handleFileChange}
        className="file:mr-4 file:py-2 file:px-4
                   file:rounded-full file:border-0
                   file:text-sm file:font-semibold
                   file:bg-violet-50 file:text-violet-700
                   hover:file:bg-violet-100"
      />
      <div className="flex-col space-y-2">
        {fileList.map((file, i) => (
          <div key={i} className="flex items-center space-x-2">
            <input
              type="text"
              value={file.newName || file.name}
              onChange={(e) => updateFileName(i, e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-black min-w-80"
            />
            <button
              onClick={() => duplicateFile(i)}
              className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              Duplicate
            </button>
            <a
              key={i}
              href={downloadUrl ?? "#"}
              download={file.newName || file.name}
              id={`download-link-${i}`}
              style={{ display: "none" }}
            >
              Download
            </a>
          </div>
        ))}
      </div>
      {fileList.length > 0 ? (
        <div className="flex space-x-2">
          {!started ? (
            <button
              onClick={continueProcess}
              className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 disabled:bg-green-300"
            >
              Start
            </button>
          ) : isPaused ? (
            <button
              onClick={continueProcess}
              disabled={!isPaused}
              className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 disabled:bg-green-300"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={pauseProcess}
              disabled={isPaused}
              className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-blue-300"
            >
              Pause
            </button>
          )}
        </div>
      ) : null}
    </main>
  );
}
