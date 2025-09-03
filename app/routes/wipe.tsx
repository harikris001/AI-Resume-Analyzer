import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

const WipeApp = () => {
  const { auth, isLoading, error, clearError, fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();
  const [files, setFiles] = useState<FSItem[]>([]);

  const loadFiles = async () => {
    const files = (await fs.readDir("./")) as FSItem[];
    setFiles(files);
  };

  useEffect(() => {
    loadFiles();
    console.log("Files loaded:", files.length);
  }, []);

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate("/auth?next=/wipe");
    }
  }, [isLoading]);

  const handleDelete = async () => {
    files.forEach(async (file) => {
      await fs.delete(file.path);
    });
    await kv.flush();
    loadFiles();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error {error}</div>;
  }

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen flex flex-col items-center justify-center">
      <div className="bg-white rounded-2xl shadow-md p-8 max-w-lg w-full flex flex-col items-center gap-6 animate-in fade-in duration-1000">
        <h1 className="text-4xl font-bold text-center text-black">
          Wipe Your Data
        </h1>
        <div className="text-red-600 text-center text-lg font-semibold">
          Warning: This will permanently delete{" "}
          <span className="font-bold">
            all your uploaded resumes, images, and app data
          </span>
          . This action cannot be undone.
        </div>
        <div className="w-full flex flex-col gap-2 items-center">
          <div className="text-gray-700 text-base mb-2">
            Authenticated as:{" "}
            <span className="font-semibold">{auth.user?.username}</span>
          </div>
          <div className="w-full">
            <div className="text-gray-500 text-sm mb-1">Existing files:</div>
            <div className="flex flex-col gap-2 max-h-32 overflow-y-auto">
              {files.length == 0 ? (
                files.map((file) => (
                  <div key={file.id} className="flex flex-row gap-4">
                    <p className="text-gray-800">{file.name}</p>
                  </div>
                ))
              ) : (
                <div className="text-gray-500">No files found.</div>
              )}
            </div>
          </div>
        </div>
        <button
          className="primary-button w-full text-lg font-semibold mt-4"
          onClick={() => handleDelete()}
        >
          Wipe App Data
        </button>
      </div>
    </main>
  );
};

export default WipeApp;
