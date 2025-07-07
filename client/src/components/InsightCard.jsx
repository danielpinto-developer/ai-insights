export default function InsightCard({ metric, summary }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="font-semibold text-lg text-blue-700">{metric}</h2>
      <p className="text-gray-700 mt-1">{summary}</p>
    </div>
  );
}
