import { useState } from "react";

export default function Upload({ file, setFile, handleUpload, loading }) {
  const [uploaded, setUploaded] = useState(false);

  const onUploadClick = async () => {
    if (!file) {
      alert("Please select a CSV file before uploading.");
      return;
    }

    setUploaded(false);
    await handleUpload(); // This sends file to FastAPI backend
    setUploaded(true);
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        📁 Upload CSV File
      </h2>

      <input
        type="file"
        accept=".csv"
        onChange={(e) => {
          const selected = e.target.files[0];
          if (
            selected &&
            selected.name.toLowerCase().includes("studentsperformance")
          ) {
            setFile(selected);
          } else {
            alert(
              "⚠️ Please upload the official StudentsPerformance.csv file from Kaggle."
            );
            setFile(null);
          }
        }}
        className="mb-4"
      />

      <button
        onClick={onUploadClick}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Upload
      </button>

      {loading && (
        <p className="mt-4 text-gray-600 animate-pulse">
          ⏳ Processing file...
        </p>
      )}

      {!loading && uploaded && (
        <p className="mt-4 text-green-600 font-medium">
          ✅ File uploaded! You can now explore <strong>Tables</strong>,{" "}
          <strong>Smart Summaries</strong>, or <strong>Chat</strong> using the
          sidebar.
        </p>
      )}
    </div>
  );
}
