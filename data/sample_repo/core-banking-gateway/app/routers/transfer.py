import logging
import uuid
import time
from datetime import datetime
from fastapi import APIRouter, HTTPException

router = APIRouter()
logger = logging.getLogger("transfer")

@router.post("/recurring")
def schedule_recurring_transfer(date_str: str):
    trace_id = str(uuid.uuid4())
    timestamp = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    
    # BUG_LOCATION: Off-by-one Leap Year / Timezone Timestamp Parsing Defect
    try:
        # Simulating bad parsing that causes leap year defect (e.g. ValueError: day is out of range for month)
        # Assuming date_str comes in as '2026-02-29' (2026 is not a leap year)
        dt = datetime.strptime(date_str, "%Y-%m-%d")
        
    except ValueError as e:
        # Hardcoding the exact log format requested
        logger.error(f"[{trace_id}] [{timestamp}] [ERROR] ValueError: day is out of range for month at transfer.py:89")
        
        # SUGGESTED_PATCH: Validate leap years and parse with explicit UTC offsets
        # dt = datetime.strptime(date_str, "%Y-%m-%dT%H:%M:%S%z")
        
        raise HTTPException(status_code=400, detail="Invalid date format provided")
    
    return {"status": "scheduled", "date": dt.isoformat()}

@router.post("/kyc-verify")
def verify_kyc(customer_id: str):
    trace_id = str(uuid.uuid4())
    timestamp = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    
    # BUG_LOCATION: Unhandled Third-Party Rate Limit (HTTP 429 Too Many Requests)
    try:
        # Simulating an API call to a third-party KYC provider that returns 429
        raise Exception("429 Client Error: Too Many Requests for url: https://api.kyc-provider.com/v1/verify")
    except Exception as e:
        logger.error(f"[{trace_id}] [{timestamp}] [ERROR] HTTPError: {str(e)}")
        
        # SUGGESTED_PATCH: Implement an exponential backoff / Circuit Breaker around the KYC REST endpoint
        # @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
        # def call_kyc_provider(): ...
        
        raise HTTPException(status_code=429, detail="KYC verification service is rate-limiting us")

