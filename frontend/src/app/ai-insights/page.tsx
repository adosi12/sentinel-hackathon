"use client"
import React, { useState } from 'react'
import { 
  Sparkles, 
  Database, 
  Brain, 
  GitBranch, 
  CheckCircle2, 
  Zap, 
  ShieldAlert, 
  Layers, 
  Cpu, 
  Terminal, 
  ArrowRight,
  Code2,
  FileJson,
  Search,
  Activity,
  Bot
} from 'lucide-react'

export default function AIInsightsPage() {
  const [activeStage, setActiveStage] = useState<number>(0)

  const pipelineStages = [
    {
      id: 0,
      title: "1. Telemetry Ingestion",
      short: "Ingestion & Normalization",
      icon: Terminal,
      color: "from-blue-500 to-cyan-500",
      badge: "Real-time API",
      summary: "Ingests raw system alerts, logs, and stack traces from payment gateways, MQ brokers, and banking microservices.",
      techStack: ["FastAPI", "Pydantic Schema Validation", "Redis Stream Queue"],
      details: {
        inputs: ["Webhook alert payload", "Raw stack trace strings", "System Metadata (Host, Environment)"],
        processing: "Standardizes noisy alert schemas into unified Incident Data contracts. Sanitizes credentials and validates data types (financial exposure, estimated customer impact).",
        outputs: ["Normalized Incident Object", "Error Signature Hash", "Telemetry Vector Candidate"]
      },
      codeSnippet: `class IncidentPayload(BaseModel):
    service_name: str
    error_signature: str
    stack_trace: Optional[str]
    environment: str = "production"`
    },
    {
      id: 1,
      title: "2. Vector RAG Matching",
      short: "ChromaDB RAG Engine",
      icon: Database,
      color: "from-purple-500 to-indigo-500",
      badge: "384-dim Embeddings",
      summary: "Performs dense vector retrieval against historical banking incidents to discover past resolution patterns.",
      techStack: ["ChromaDB Vector Store", "sentence-transformers / all-MiniLM-L6-v2", "Cosine Similarity Search"],
      details: {
        inputs: ["Error signature text", "Historical incident database", "Similarity Threshold (≥ 0.75)"],
        processing: "Converts incident symptoms into high-dimensional vector embeddings. Executes k-NN similarity lookup in ChromaDB to retrieve top matching past postmortems.",
        outputs: ["Top K Historical Matches", "Similarity Confidence Scores", "Historical Resolution Playbooks"]
      },
      codeSnippet: `matches = chroma_collection.query(
    query_texts=[f"{alert.service_name} {alert.error_signature}"],
    n_results=3
)
# Returns cosine distance + past resolution steps`
    },
    {
      id: 2,
      title: "3. Dependency Blast Radius",
      short: "Graph Context Engine",
      icon: GitBranch,
      color: "from-amber-500 to-orange-500",
      badge: "PostgreSQL & Redis",
      summary: "Traverses inter-service dependencies to identify upstream root causes and downstream cascading impacts.",
      techStack: ["PostgreSQL Recursive CTEs", "Redis Cache", "System Dependency Graph"],
      details: {
        inputs: ["Affected Service ID", "Live Microservice Graph", "MQ / Payment Gateway Maps"],
        processing: "Evaluates cascading failure risk across payment APIs, message queues, and cert authority services. Maps downstream customer impact.",
        outputs: ["Blast Radius Tree", "Upstream Suspect Nodes", "Affected Customer Exposure Estimate"]
      },
      codeSnippet: `WITH RECURSIVE service_tree AS (
    SELECT parent_id, child_id FROM dependencies WHERE parent_id = :service_id
    UNION SELECT d.parent_id, d.child_id FROM dependencies d
    JOIN service_tree st ON d.parent_id = st.child_id
) SELECT * FROM service_tree;`
    },
    {
      id: 3,
      title: "4. Gemini 3.1 Pro Multi-Agent Reasoning",
      short: "Multi-Agent Swarm",
      icon: Brain,
      color: "from-emerald-500 to-teal-500",
      badge: "Google Gemini 3.1 Pro",
      summary: "Orchestrates specialized AI agents to synthesize root causes, verify code diffs, and generate remediation steps.",
      techStack: ["Google Gemini 3.1 Pro", "Structured Chain-of-Thought", "Multi-Agent Coordinator"],
      details: {
        inputs: ["Telemetry Data", "RAG Historical Matches", "Dependency Graph Context"],
        processing: "Multi-Agent Swarm execution: Triage Agent analyzes errors, Impact Agent calculates financial risk, Remediation Agent drafts patch & Jira ticket.",
        outputs: ["Root Cause Analysis", "Confidence Score (0-100%)", "Draft Jira Ticket & Patch Proposal"]
      },
      codeSnippet: `prompt = f"""
You are Sentinel AI Senior Triage Engineer.
Alert: {alert}
RAG Matches: {rag_context}
Graph Context: {graph_context}
Provide: 1. Root Cause 2. Confidence 3. MTTR Saved
"""`
    },
    {
      id: 4,
      title: "5. Autonomous Triage & Action",
      short: "Automated Ticket & Notify",
      icon: Zap,
      color: "from-pink-500 to-rose-500",
      badge: "Jira & Slack Ops",
      summary: "Automatically dispatches Jira tickets, notifies on-call teams, and tracks financial MTTR savings.",
      techStack: ["Jira REST API Client", "Slack Webhook Dispatcher", "PostgreSQL Metrics Engine"],
      details: {
        inputs: ["Synthesized Incident Plan", "On-Call Routing Rules", "Jira Project Key"],
        processing: "Creates rich Jira ticket with evidence links, alerts primary engineer via Slack, logs financial exposure & MTTR metrics to PostgreSQL.",
        outputs: ["Jira Ticket ID", "Slack Notification Sent", "Dashboard Live Update"]
      },
      codeSnippet: `jira_ticket = jira_client.create_issue({
    "project": "SENT",
    "summary": f"[Sentinel AI] {analysis.summary}",
    "description": analysis.formatted_report
})`
    }
  ]

  const currentStage = pipelineStages[activeStage]

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 min-h-screen text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
                AI Architecture & Intelligence Flow
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                  Gemini 3.1 Pro + RAG
                </span>
              </h1>
              <p className="text-sm text-white/60 mt-1">
                Technical breakdown of Sentinel&apos;s multi-agent reasoning, vector search, and dependency context pipeline.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Tech Metrics */}
        <div className="flex items-center gap-4 font-mono text-xs">
          <div className="bg-[#0A0A0A] border border-white/10 px-4 py-2 rounded-lg">
            <span className="text-white/40 block text-[10px] uppercase">Vector Model</span>
            <span className="text-indigo-400 font-semibold">all-MiniLM-L6-v2</span>
          </div>
          <div className="bg-[#0A0A0A] border border-white/10 px-4 py-2 rounded-lg">
            <span className="text-white/40 block text-[10px] uppercase">LLM Engine</span>
            <span className="text-emerald-400 font-semibold">Gemini 3.1 Pro</span>
          </div>
          <div className="bg-[#0A0A0A] border border-white/10 px-4 py-2 rounded-lg">
            <span className="text-white/40 block text-[10px] uppercase">Vector DB</span>
            <span className="text-purple-400 font-semibold">ChromaDB</span>
          </div>
        </div>
      </div>

      {/* Interactive AI Pipeline Diagram */}
      <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-semibold text-white/80 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            End-to-End AI Pipeline Flow
          </h2>
          <span className="text-xs text-white/40">Click any stage to inspect technical specs</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative z-10">
          {pipelineStages.map((stage, idx) => {
            const Icon = stage.icon
            const isActive = activeStage === idx
            return (
              <button
                key={stage.id}
                onClick={() => setActiveStage(idx)}
                className={`text-left p-4 rounded-xl border transition-all duration-200 relative group ${
                  isActive 
                    ? 'bg-white/10 border-indigo-500/50 shadow-lg shadow-indigo-500/10 scale-[1.02]' 
                    : 'bg-[#050505] border-white/5 hover:border-white/20 hover:bg-white/[0.03]'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${stage.color} text-white shadow-md`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    isActive 
                      ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' 
                      : 'bg-white/5 text-white/40 border-white/10'
                  }`}>
                    Stage {idx + 1}
                  </span>
                </div>

                <div className="font-semibold text-sm text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                  {stage.short}
                </div>
                <div className="text-xs text-white/40 mt-1 line-clamp-2">
                  {stage.summary}
                </div>

                {idx < pipelineStages.length - 1 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 pointer-events-none text-white/20">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Selected Stage Technical Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Deep Spec details */}
        <div className="lg:col-span-2 bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${currentStage.color} text-white shadow-lg`}>
                <currentStage.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{currentStage.title}</h3>
                <span className="text-xs font-mono text-indigo-400">{currentStage.badge}</span>
              </div>
            </div>
            <div className="flex gap-2">
              {currentStage.techStack.map((tech, i) => (
                <span key={i} className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-white/70">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <p className="text-sm text-white/80 leading-relaxed">
            {currentStage.summary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-3 rounded-xl bg-[#050505] border border-white/5 space-y-2">
              <span className="text-white/40 text-[10px] uppercase font-sans font-medium flex items-center gap-1.5">
                <FileJson className="w-3.5 h-3.5 text-blue-400" /> Stage Inputs
              </span>
              <ul className="space-y-1 text-white/70">
                {currentStage.details.inputs.map((inp, idx) => (
                  <li key={idx} className="truncate">• {inp}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-[#050505] border border-white/5 space-y-2">
              <span className="text-white/40 text-[10px] uppercase font-sans font-medium flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-purple-400" /> AI Execution
              </span>
              <p className="text-white/70 text-[11px] leading-normal font-sans">
                {currentStage.details.processing}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#050505] border border-white/5 space-y-2">
              <span className="text-white/40 text-[10px] uppercase font-sans font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Stage Outputs
              </span>
              <ul className="space-y-1 text-white/70">
                {currentStage.details.outputs.map((out, idx) => (
                  <li key={idx} className="truncate">• {out}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Code Implementation Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-white/50 font-mono">
              <span className="flex items-center gap-1.5"><Code2 className="w-4 h-4 text-indigo-400" /> Python / Backend Implementation</span>
              <span>sentinel-backend / core</span>
            </div>
            <div className="bg-[#050505] border border-white/10 rounded-xl p-4 font-mono text-xs text-indigo-200/90 overflow-x-auto">
              <pre>{currentStage.codeSnippet}</pre>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Key Capabilities Summary for Panelists */}
        <div className="space-y-6">
          <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <Bot className="w-4 h-4 text-emerald-400" />
              AI Stack Architecture
            </h3>
            
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#050505] border border-white/5 flex items-start gap-3">
                <Search className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">Dense Semantic Search (RAG)</div>
                  <div className="text-white/50 text-[11px] mt-0.5">
                    Embeds incidents into 384-dimensional space to find historical solutions even when wording differs.
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#050505] border border-white/5 flex items-start gap-3">
                <Brain className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">Google Gemini 3.1 Pro LLM</div>
                  <div className="text-white/50 text-[11px] mt-0.5">
                    Utilizes deep reasoning to synthesize root cause analysis without hallucinating outside telemetry context.
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#050505] border border-white/5 flex items-start gap-3">
                <GitBranch className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">Dependency Graph Correlation</div>
                  <div className="text-white/50 text-[11px] mt-0.5">
                    Analyzes inter-service links to differentiate root causes from secondary cascading outages.
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#050505] border border-white/5 flex items-start gap-3">
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">Financial Exposure Estimation</div>
                  <div className="text-white/50 text-[11px] mt-0.5">
                    Dynamically computes dollars saved by reducing MTTR from 45 mins to under 2 seconds.
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
