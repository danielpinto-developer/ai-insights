from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from summarizer import summarize_column
import io

app = FastAPI()

# CORS (enable frontend connection)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/generate-insights/")
async def generate_insights(file: UploadFile = File(...)):
    contents = await file.read()
    df = pd.read_csv(io.BytesIO(contents))

    insights = []

    # 1. Numeric column summaries
    numeric_cols = df.select_dtypes(include='number')
    if not numeric_cols.empty:
        for col in numeric_cols.columns:
            stats = {
                "mean": numeric_cols[col].mean(),
                "min": numeric_cols[col].min(),
                "max": numeric_cols[col].max()
            }
            summary = summarize_column(col, stats)
            insights.append({"metric": col, "summary": summary})

    # 2. Gender-based averages
    if "gender" in df.columns and "math score" in df.columns:
        gender_groups = df.groupby("gender")[["math score", "reading score", "writing score"]].mean().round(1)
        for gender, row in gender_groups.iterrows():
            summary = (
                f"Average scores for {gender.capitalize()} students - "
                f"Math: {row['math score']}, Reading: {row['reading score']}, Writing: {row['writing score']}."
            )
            insights.append({"metric": f"{gender.capitalize()} Students", "summary": summary})

    # 3. Test preparation impact
    if "test preparation course" in df.columns and "math score" in df.columns:
        prep_groups = df.groupby("test preparation course")[["math score", "reading score", "writing score"]].mean().round(1)
        for prep, row in prep_groups.iterrows():
            summary = (
                f"Students who '{prep}' had average scores - "
                f"Math: {row['math score']}, Reading: {row['reading score']}, Writing: {row['writing score']}."
            )
            insights.append({"metric": f"Test Prep: {prep}", "summary": summary})

    return {"insights": insights}



from transformers import pipeline

# Load summarizer once
summarizer = pipeline("summarization", model="t5-small")

def summarize_column(name, stats):
    raw_text = (
        f"The column {name} has an average of {stats['mean']:.1f}, "
        f"ranging from {stats['min']:.1f} to {stats['max']:.1f}."
    )
    
    # Hugging Face summarization
    summary = summarizer(raw_text, max_length=30, min_length=10, do_sample=False)[0]["summary_text"]
    return summary


