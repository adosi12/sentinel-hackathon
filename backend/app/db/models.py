from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean, JSON, Text
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    role = Column(String, default="user")

class Incident(Base):
    __tablename__ = 'incidents'
    id = Column(String, primary_key=True, index=True) # e.g. INC-1001
    title = Column(String, index=True)
    description = Column(Text)
    status = Column(String, default="open") # open, investigating, resolved
    severity = Column(String)
    application = Column(String)
    component = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)
    impacted_services = Column(JSON, default=[])
    
    # Analysis results
    confidence_score = Column(Float, nullable=True)
    suggested_resolution = Column(Text, nullable=True)
    needs_human_input = Column(Boolean, default=False)
    human_prompt = Column(String, nullable=True)
    
    # Business impact
    est_customers_impacted = Column(Integer, default=0)
    est_financial_exposure = Column(Float, default=0.0)
    mttr_saved = Column(Float, default=0.0) # hours
    
    # Generated Notifications/Tickets
    jira_content = Column(Text, nullable=True)
    slack_content = Column(Text, nullable=True)
    email_content = Column(Text, nullable=True)
    
    logs = relationship("Log", back_populates="incident")
    tickets = relationship("Ticket", back_populates="incident")
    notifications = relationship("Notification", back_populates="incident")

class Log(Base):
    __tablename__ = 'logs'
    id = Column(Integer, primary_key=True, index=True)
    incident_id = Column(String, ForeignKey('incidents.id'))
    timestamp = Column(DateTime, default=datetime.utcnow)
    service_name = Column(String)
    log_level = Column(String)
    message = Column(Text)
    raw_data = Column(JSON)
    
    incident = relationship("Incident", back_populates="logs")

class HistoricalIncident(Base):
    __tablename__ = 'historical_incidents'
    id = Column(String, primary_key=True, index=True)
    title = Column(String)
    description = Column(Text)
    root_cause = Column(Text)
    resolution = Column(Text)
    resolved_by = Column(String)
    resolution_time_hours = Column(Float)
    created_at = Column(DateTime)
    
class Repository(Base):
    __tablename__ = 'repositories'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    url = Column(String)
    branch = Column(String, default="main")

class RepositoryScan(Base):
    __tablename__ = 'repository_scans'
    id = Column(Integer, primary_key=True, index=True)
    repository_id = Column(Integer, ForeignKey('repositories.id'))
    incident_id = Column(String, ForeignKey('incidents.id'), nullable=True)
    commit_hash = Column(String)
    findings = Column(JSON) # e.g. [{"type": "config_drift", "file": "..."}]
    scanned_at = Column(DateTime, default=datetime.utcnow)
    
class Ticket(Base):
    __tablename__ = 'tickets'
    id = Column(String, primary_key=True, index=True) # e.g. JIRA-123
    incident_id = Column(String, ForeignKey('incidents.id'))
    platform = Column(String) # Jira, ServiceNow
    status = Column(String)
    url = Column(String)
    
    incident = relationship("Incident", back_populates="tickets")

class Notification(Base):
    __tablename__ = 'notifications'
    id = Column(Integer, primary_key=True, index=True)
    incident_id = Column(String, ForeignKey('incidents.id'))
    channel = Column(String) # Slack, Email
    message = Column(Text)
    sent_at = Column(DateTime, default=datetime.utcnow)
    
    incident = relationship("Incident", back_populates="notifications")

class KnowledgeGraphNode(Base):
    __tablename__ = 'kg_nodes'
    id = Column(String, primary_key=True, index=True)
    type = Column(String) # Service, Database, API, etc.
    name = Column(String)
    properties = Column(JSON)

class KnowledgeGraphEdge(Base):
    __tablename__ = 'kg_edges'
    id = Column(Integer, primary_key=True, index=True)
    source_id = Column(String, ForeignKey('kg_nodes.id'))
    target_id = Column(String, ForeignKey('kg_nodes.id'))
    relation = Column(String) # depends_on, connects_to
    
class AuditLog(Base):
    __tablename__ = 'audit_logs'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    action = Column(String)
    details = Column(JSON)
    timestamp = Column(DateTime, default=datetime.utcnow)
