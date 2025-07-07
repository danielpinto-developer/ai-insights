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
