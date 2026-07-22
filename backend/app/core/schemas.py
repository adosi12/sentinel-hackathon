from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class IncidentBase(BaseModel):
    title: str
    description: str
    severity: str
    application: str
    component: str
    impacted_services: Optional[List[str]] = []

class AlertRequest(BaseModel):
    raw_alert: str

class IncidentCreate(IncidentBase):
    id: str

class IncidentResponse(IncidentBase):
    id: str
    status: str
    created_at: datetime
    resolved_at: Optional[datetime] = None
    confidence_score: Optional[float] = None
    suggested_resolution: Optional[str] = None
    est_customers_impacted: int
    est_financial_exposure: float
    mttr_saved: float
    
    jira_content: Optional[str] = None
    slack_content: Optional[str] = None
    email_content: Optional[str] = None
    
    class Config:
        orm_mode = True
        from_attributes = True

class LogBase(BaseModel):
    service_name: str
    log_level: str
    message: str
    raw_data: Optional[Dict[str, Any]] = None

class LogResponse(LogBase):
    id: int
    incident_id: str
    timestamp: datetime
    
    class Config:
        orm_mode = True
        from_attributes = True

class HistoricalIncidentResponse(BaseModel):
    id: str
    title: str
    description: str
    root_cause: str
    resolution: str
    resolved_by: str
    resolution_time_hours: float
    created_at: datetime
    
    class Config:
        orm_mode = True
        from_attributes = True

class Node(BaseModel):
    id: str
    type: str
    name: str
    properties: Optional[Dict[str, Any]] = None

class Edge(BaseModel):
    id: int
    source_id: str
    target_id: str
    relation: str

class KnowledgeGraphResponse(BaseModel):
    nodes: List[Node]
    edges: List[Edge]
