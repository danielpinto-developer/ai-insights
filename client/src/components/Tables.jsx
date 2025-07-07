import Papa from "papaparse";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useEffect, useState } from "react";

const COLORS = ["#8884d8", "#82ca9d"];

export default function Tables({ file }) {
  const [genderScores, setGenderScores] = useState([]);
  const [testPrepScores, setTestPrepScores] = useState([]);
  const [genderPie, setGenderPie] = useState([]);
  const [fileReady, setFileReady] = useState(false);

  useEffect(() => {
    console.log("📥 File passed to Tables:", file?.name);

    if (!file || file.name.toLowerCase() !== "studentsperformance.csv") {
      console.warn("⚠️ Incorrect or missing file.");
      setFileReady(false);
      return;
    }

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        console.log("✅ PapaParse complete:", results);

        const data = results.data;

        const cleanedData = data.filter(
          (row) =>
            row["gender"] &&
            row["test preparation course"] &&
            !isNaN(+row["math score"]) &&
            !isNaN(+row["reading score"]) &&
            !isNaN(+row["writing score"])
        );

        console.log("🧹 Cleaned data length:", cleanedData.length);

        if (cleanedData.length === 0) {
          console.error("❌ No valid rows found in CSV.");
          setFileReady(false);
          return;
        }

        const genders = ["female", "male"];
        const genderStats = genders.map((gender) => {
          const group = cleanedData.filter(
            (row) => row.gender.toLowerCase() === gender
          );
          console.log(`👫 Gender group "${gender}":`, group.length);

          const avg = (key) =>
            group.reduce((sum, row) => sum + Number(row[key]), 0) /
            group.length;

          return {
            gender: gender[0].toUpperCase() + gender.slice(1),
            Math: avg("math score").toFixed(1),
            Reading: avg("reading score").toFixed(1),
            Writing: avg("writing score").toFixed(1),
          };
        });

        setGenderScores(genderStats);

        const pie = genders.map((gender) => ({
          name: gender[0].toUpperCase() + gender.slice(1),
          value: cleanedData.filter(
            (row) => row.gender.toLowerCase() === gender
          ).length,
        }));
        setGenderPie(pie);

        const prepTypes = ["completed", "none"];
        const prepStats = prepTypes.map((type) => {
          const group = cleanedData.filter(
            (row) => row["test preparation course"]?.toLowerCase() === type
          );
          console.log(`📚 Test prep group "${type}":`, group.length);

          const avg = (key) =>
            group.reduce((sum, row) => sum + Number(row[key]), 0) /
            group.length;

          return {
            prep: type[0].toUpperCase() + type.slice(1),
            Math: avg("math score").toFixed(1),
            Reading: avg("reading score").toFixed(1),
            Writing: avg("writing score").toFixed(1),
          };
        });

        setTestPrepScores(prepStats);
        setFileReady(true); // ✅ UNLOCKS TABLES
      },
      error: (err) => {
        console.error("🚨 PapaParse error:", err);
        setFileReady(false);
      },
    });
  }, [file]);

  if (!fileReady) {
    return (
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">📋 Tables</h2>
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
          to view charts and data tables.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Score Table */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">
          📋 Table: Avg Scores by Gender
        </h2>
        <table className="min-w-full bg-white border border-gray-200 text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Gender</th>
              <th className="px-4 py-2 border">Math</th>
              <th className="px-4 py-2 border">Reading</th>
              <th className="px-4 py-2 border">Writing</th>
            </tr>
          </thead>
          <tbody>
            {genderScores.map((row, idx) => (
              <tr key={idx} className="border-t">
                <td className="px-4 py-2 border">{row.gender}</td>
                <td className="px-4 py-2 border">{row.Math}</td>
                <td className="px-4 py-2 border">{row.Reading}</td>
                <td className="px-4 py-2 border">{row.Writing}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Gender Pie */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">🥧 Gender Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={genderPie}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {genderPie.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Test Prep Bars */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">📈 Avg Scores by Test Prep</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={testPrepScores}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="prep" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Math" fill="#8884d8" />
            <Bar dataKey="Reading" fill="#82ca9d" />
            <Bar dataKey="Writing" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
