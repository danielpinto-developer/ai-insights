import { useState } from "react";
import axios from "axios";
import Sidebar from "./components/Sidebar";
import Upload from "./components/Upload";
import Tables from "./components/Tables";
import SmartSummaries from "./components/SmartSummaries";
import Chat from "./components/Chat";

function App() {
  const [file, setFile] = useState(null);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activePage, setActivePage] = useState("Upload");

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await axios.post(
        "http://127.0.0.1:8000/generate-insights/",
        formData
      );
      setInsights(res.data.insights);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderPage = () => {
    switch (activePage) {
      case "Upload":
        return (
          <Upload
            file={file}
            setFile={setFile}
            handleUpload={handleUpload}
            loading={loading}
          />
        );
      case "Tables":
        return <Tables file={file} />;
      case "Smart Summaries":
        return <SmartSummaries file={file} insights={insights} />;
      case "Chat":
        return <Chat file={file} insights={insights} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar setActivePage={setActivePage} />
      <div className="flex-1 p-6 overflow-auto">{renderPage()}</div>
    </div>
  );
}

export default App;
