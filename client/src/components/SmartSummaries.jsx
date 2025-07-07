export default function SmartSummaries({ insights }) {
  return (
    <div className="bg-white p-6 rounded shadow space-y-4">
      <h2 className="text-xl font-bold mb-4">💡 Smart Summaries</h2>

      {insights?.length > 0 ? (
        insights.map((item, idx) => (
          <div key={idx} className="p-3 border-b border-gray-200">
            <strong>{item.metric}</strong>: {item.summary}
          </div>
        ))
      ) : (
        <div className="text-gray-600 bg-gray-50 p-4 rounded border border-dashed border-gray-300">
          📄 Upload the official{" "}
          <a
            href="https://www.kaggle.com/datasets/spscientist/students-performance-in-exams/data"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Kaggle StudentsPerformance.csv
          </a>{" "}
          to generate smart summaries.
        </div>
      )}
    </div>
  );
}
