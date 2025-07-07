import { useState } from "react";
import axios from "axios";

export default function Chat({ insights }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = "https://openrouter.ai/api/v1/chat/completions";
  const API_KEY =
    "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";

  const sendMessage = async (customInput) => {
    const prompt = customInput || input;
    if (!prompt.trim()) return;

    const userMessage = { role: "user", content: prompt };
    const context =
      insights?.length > 0
        ? insights.map((i) => `${i.metric}: ${i.summary}`).join("\n")
        : "No CSV insights available.";

    const systemMessage = {
      role: "system",
      content: `You are an AI that only answers based on the uploaded data below. You must not invent facts beyond this context.

DATA:
${context}`,
    };

    const messagesToSend = [systemMessage, ...messages, userMessage];
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(
        API_URL,
        {
          model: "deepseek/deepseek-chat",
          messages: messagesToSend,
        },
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const reply = res.data.choices[0]?.message;
      const cleanContent =
        reply?.content.replace(/\*/g, "") || "⚠️ No response";
      setMessages((prev) => [...prev, { ...reply, content: cleanContent }]);
    } catch (err) {
      console.error("Chat error:", err.response?.data || err.message);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ API error, try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!insights || insights.length === 0) {
    return (
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">💬 Chat with AI (Data-Smart)</h2>
        <div className="text-gray-600 bg-gray-50 p-4 rounded border border-dashed border-gray-300">
          📄 Upload the{" "}
          <a
            href="https://www.kaggle.com/datasets/spscientist/students-performance-in-exams/data"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Kaggle StudentsPerformance.csv
          </a>{" "}
          to unlock interactive Q&A.
        </div>
      </div>
    );
  }

  const samplePrompts = [
    "What factors influence writing scores?",
    "How does test prep affect student performance?",
    "What are the average scores by gender?",
  ];

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white rounded shadow h-full flex flex-col">
      <h2 className="text-xl font-bold mb-4">💬 Chat with AI (Data-Smart)</h2>

      <div className="flex flex-wrap gap-2 mb-4">
        {samplePrompts.map((prompt, i) => (
          <button
            key={i}
            className="bg-gray-200 hover:bg-gray-300 text-sm px-3 py-1 rounded"
            onClick={() => sendMessage(prompt)}
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded ${
              msg.role === "user"
                ? "bg-blue-100 text-right"
                : "bg-gray-100 text-left"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 border rounded px-4 py-2"
          placeholder="Ask something based on the uploaded data..."
        />
        <button
          onClick={() => sendMessage()}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Sending…" : "Send"}
        </button>
      </div>
    </div>
  );
}
