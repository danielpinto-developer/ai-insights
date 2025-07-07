import { FaUpload, FaTable, FaLightbulb, FaComments } from "react-icons/fa";

export default function Sidebar({ setActivePage }) {
  const menu = [
    { icon: <FaUpload />, label: "Upload" },
    { icon: <FaTable />, label: "Tables" },
    { icon: <FaLightbulb />, label: "Smart Summaries" },
    { icon: <FaComments />, label: "Chat" },
  ];

  return (
    <div className="w-64 bg-gray-800 text-white h-screen flex flex-col justify-between">
      <div>
        <div className="text-2xl font-bold px-6 py-4 border-b border-gray-700">
          AI Insights
        </div>
        <nav className="mt-4 flex flex-col gap-2 px-4">
          {menu.map((item) => (
            <div
              key={item.label}
              onClick={() => setActivePage(item.label)}
              className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-700 cursor-pointer transition"
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
      </div>
      <div className="px-6 py-4 text-sm text-gray-400 border-t border-gray-700">
        © 2025 Innovare Demo
      </div>
    </div>
  );
}
