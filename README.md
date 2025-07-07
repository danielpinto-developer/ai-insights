# 📊 AI Insights – Education Dashboard Tool

**AI Insights** is a local React + FastAPI app that lets users upload educational CSV datasets and get instant insights, visualizations, and smart summaries — powered by NLP.

---

### 🔍 Features

- ✅ CSV upload & processing
- 📊 Data visualizations (gender, test prep, score averages)
- 🤖 AI-generated summaries (using Hugging Face T5)
- 💬 Chat interface powered by OpenRouter (DeepSeek model)
- 🧠 Built with React, FastAPI, TailwindCSS, Recharts

---

### 🛠️ Tech Stack

| Frontend         | Backend       | AI / NLP                      |
|------------------|---------------|-------------------------------|
| React (Vite)     | FastAPI       | Hugging Face Transformers (T5) |
| TailwindCSS      | Pandas        | OpenRouter (DeepSeek)         |
| Recharts         | CORS Middleware | Summarization pipeline       |

---

### 🚀 Getting Started (Local)

```bash
# 1. Clone the repo
git clone https://github.com/danielpinto-developer/ai-insights.git

# 2. Backend setup
cd ai-insights
pip install -r requirements.txt
uvicorn main:app --reload
# Runs on: http://localhost:8000

# 3. Frontend setup
cd client
npm install
npm run dev
# Runs on: http://localhost:5173
📁 Dataset
This app works best with the official Kaggle dataset:

🔗 Download StudentsPerformance.csv

👤 Author
Built by @danielpinto-developer
🌐 Portfolio: danielpinto-developer.com
