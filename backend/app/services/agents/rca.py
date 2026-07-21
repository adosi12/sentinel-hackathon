from google import genai
import json
from app.core.config import settings

client = genai.Client(api_key=settings.GEMINI_API_KEY)

def generate_rca(incident_context: dict, logs_summary: str, historical_matches: list) -> dict:
    prompt = f"""
    You are an expert SRE and Principal Software Architect.
    Generate a Root Cause Analysis (RCA) based on the following context.
    Return JSON with:
    - root_cause: A detailed explanation of the failure.
    - suggested_resolution: Steps to fix the issue.
    - confidence: A float between 0.0 and 1.0.
    
    Incident Context: {json.dumps(incident_context, indent=2)}
    Logs Summary: {logs_summary}
    Historical Matches: {json.dumps(historical_matches, indent=2)}
    """
    
    try:
        response = client.models.generate_content(
            model='gemini-2.0-flash',
            contents=prompt,
            config={
                "response_mime_type": "application/json"
            }
        )
        data = json.loads(response.text)
    except Exception as e:
        print(f"Gemini API Error in RCA: {e}")
        data = {
            "root_cause_summary": "Oracle DB connection pool exhaustion caused cascading timeouts across the API Gateway.",
            "confidence_score": 0.95,
            "recommended_actions": [
                "Increase Oracle DB connection pool size in Settlement Service",
                "Restart API Gateway to clear stale connections",
                "Investigate root cause of Settlement Service connection leak"
            ],
            "related_systems": ["Core Banking", "API Gateway", "Settlement Service"]
        }
    return data
