from google import genai
import json
from app.core.config import settings

client = genai.Client(api_key=settings.GEMINI_API_KEY)

def generate_rca(incident_context: dict, logs_summary: str, historical_matches: list) -> dict:
    prompt = f"""
    You are an expert SRE and Principal Software Architect.
    Generate a Root Cause Analysis (RCA) based on the following incident description and historical matches.
    Return JSON with:
    - root_cause: A detailed technical explanation of the failure.
    - suggested_resolution: Actionable steps to fix the issue.
    - confidence: A float between 0.0 and 1.0 representing how confident you are in this RCA.
    - impacted_services: A JSON array of strings containing ONLY the names of the services impacted by this issue. 
      You MUST choose from this exact list of standard services: ["API Gateway", "Authentication", "Payments", "RabbitMQ (MQ)", "Settlement", "Certificate Manager", "Core Banking"].
    - jira_ticket_content: A string containing a detailed Jira ticket description (use markdown) for the engineering team to resolve the issue. Include steps to reproduce and acceptance criteria.
    - slack_message_content: A string containing a concise Slack broadcast message (use Slack markdown with emojis) to notify the #incident-response channel.
    - email_notification_content: A string containing a formal executive summary email (use markdown) for stakeholders explaining the impact and resolution plan.
    
    Incident Context: {json.dumps(incident_context, indent=2)}
    Logs Summary: {logs_summary}
    Historical Matches: {json.dumps(historical_matches, indent=2)}
    """
    
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt,
        config={
            "response_mime_type": "application/json"
        }
    )
    data = json.loads(response.text)
    return data
