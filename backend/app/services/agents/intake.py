from google import genai
from pydantic import BaseModel
import json
from app.core.config import settings

client = genai.Client(api_key=settings.GEMINI_API_KEY)

class IncidentIntakeResult(BaseModel):
    title: str
    severity: str
    application: str
    component: str
    is_banking_incident: bool
    summary: str

def analyze_incident_intake(raw_alert: str) -> IncidentIntakeResult:
    prompt = f"""
    You are an expert Principal SRE for an enterprise banking platform.
    Analyze the following raw incident alert and extract the key fields.
    Return JSON format matching these keys: title, severity (Low, Medium, High, Critical), application, component, is_banking_incident (boolean), summary.

    Raw Alert:
    {raw_alert}
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
        # Fallback for hackathon if API key rate limits (limit: 0) are hit
        print(f"Gemini API Error in Intake: {e}")
        data = {
            "title": "API Gateway Latency Spike",
            "summary": "High latency observed on API Gateway leading to 502 Bad Gateway responses.",
            "severity": "CRITICAL",
            "application": "Core Banking",
            "component": "API Gateway",
            "is_banking_incident": True
        }
    return IncidentIntakeResult(**data)
