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
    A user or monitoring system has provided the following unstructured description of an issue in production.
    Analyze the description and extract the key fields to create an incident ticket.
    Return JSON format matching these exact keys: 
    - title (a short, descriptive title)
    - severity (Low, Medium, High, Critical)
    - application (e.g. Core Banking, Mobile App, Payment Gateway)
    - component (the specific microservice or database likely failing)
    - is_banking_incident (boolean)
    - summary (a professional technical summary of the issue).

    User/System Issue Description:
    {raw_alert}
    """
    
    response = client.models.generate_content(
        model='gemini-1.5-flash',
        contents=prompt,
        config={
            "response_mime_type": "application/json"
        }
    )
    data = json.loads(response.text)
    return IncidentIntakeResult(**data)
