"use client"
import React, { useState } from 'react'
import { 
  Sparkles, Database, Brain, GitBranch, CheckCircle2, Zap, 
  ShieldAlert, Layers, Cpu, Terminal, ArrowRight, Code2, 
  FileJson, Search, Bot, Server, Rocket, GitPullRequest
} from 'lucide-react'

export default function AIInsightsPage() {
  const [activeStage, setActiveStage] = useState<number>(0)

  const pipelineStages = [
    {
      id: 0,
      title: "1. Data Collection",
      short: "Listen & Collect",
      icon: Terminal,
      color: "from-blue-500 to-cyan-500",
      badge: "Real-time Monitoring",
      summary: "Sentinel listens to your live applications. When something breaks (like a payment failure), it instantly grabs the error details, logs, and system information.",
      techStack: ["FastAPI", "Real Microservices", "Webhooks"],
      details: {
        inputs: ["Live Error Alerts", "App Stack Traces", "Server Info"],
        processing: "Cleans up the messy error data, removes sensitive passwords, and organizes it into a clear, standard format for the AI to understand.",
        outputs: ["Clean Incident Data", "Unique Error ID"]
      },
      codeSnippet: `// We instantly catch the error when a real service fails
class IncidentPayload(BaseModel):
    service_name: str
    error_signature: str
    stack_trace: Optional[str]`
    },
    {
      id: 1,
      title: "2. Finding Past Fixes",
      short: "Search Memory",
      icon: Database,
      color: "from-purple-500 to-indigo-500",
      badge: "AI Memory (RAG)",
      summary: "Sentinel checks its 'memory' to see if a similar issue has happened before. It reads past incident reports to find how it was fixed last time.",
      techStack: ["ChromaDB Vector Store", "Similarity Search"],
      details: {
        inputs: ["Current Error Text", "Database of Past Outages"],
        processing: "Uses AI to understand the *meaning* of the error, rather than just keyword matching, to find the most relevant past solutions.",
        outputs: ["Top Similar Past Incidents", "Historical Fix Instructions"]
      },
      codeSnippet: `# Searching our AI memory for similar past issues
matches = chroma_collection.query(
    query_texts=[alert_description],
    n_results=3
)`
    },
    {
      id: 2,
      title: "3. Multi-Agent Analysis",
      short: "AI Swarm Analysis",
      icon: Brain,
      color: "from-emerald-500 to-teal-500",
      badge: "Google Gemini 3.1 Pro",
      summary: "A team of specialized AI Agents work together to analyze the error, determine how much money it's costing, and write the code to fix it.",
      techStack: ["Google Gemini 3.1 Pro", "Multi-Agent Swarm"],
      details: {
        inputs: ["Cleaned Error Data", "Past Fixes", "App Code"],
        processing: "The Orchestrator assigns tasks: Triage Agent finds the root cause, Impact Agent calculates financial loss, and Remediation Agent writes the code patch.",
        outputs: ["Root Cause Explanation", "Financial Loss Estimate", "Code Fix"]
      },
      codeSnippet: `prompt = """
You are the Sentinel Triage Agent.
Based on this error and past memory, 
explain EXACTLY why the service crashed.
"""`
    },
    {
      id: 3,
      title: "4. Auto-Fix & Deploy",
      short: "Fix & Raise PR",
      icon: Zap,
      color: "from-pink-500 to-rose-500",
      badge: "Live Git Ops",
      summary: "The AI automatically applies the fix to the real source code, creates a Pull Request (PR) on GitHub, and alerts the engineering team on Slack/Jira.",
      techStack: ["Git Operations", "Jira API", "Slack Webhooks"],
      details: {
        inputs: ["AI Code Patch", "GitHub Repository"],
        processing: "Directly edits the buggy file in the real microservice, commits the change to your feature branch, and pushes it to GitHub for immediate review.",
        outputs: ["GitHub Pull Request URL", "Slack Alert", "Jira Ticket"]
      },
      codeSnippet: `# Automatically fixing the real microservice code
subprocess.run(["git", "commit", "-m", "AI Patch"])
subprocess.run(["git", "push", "origin", "feature/ai-insights"])
return {"pr_url": pr_url}`
    }
  ]

  const currentStage = pipelineStages[activeStage]

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12 min-h-screen text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
                How Sentinel AI Works
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                  Simplified View
                </span>
              </h1>
              <p className="text-sm text-white/60 mt-1">
                A step-by-step guide to how Sentinel detects, analyzes, and automatically fixes your live applications.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive AI Pipeline Diagram */}
      <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-semibold text-white/80 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            Step-by-Step AI Process
          </h2>
          <span className="text-xs text-white/40">Click any step to see details</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative z-10">
          {pipelineStages.map((stage, idx) => {
            const Icon = stage.icon
            const isActive = activeStage === idx
            return (
              <button
                key={stage.id}
                onClick={() => setActiveStage(idx)}
                className={\`text-left p-4 rounded-xl border transition-all duration-200 relative group \${
                  isActive 
                    ? 'bg-white/10 border-indigo-500/50 shadow-lg shadow-indigo-500/10 scale-[1.02]' 
                    : 'bg-[#050505] border-white/5 hover:border-white/20 hover:bg-white/[0.03]'
                }\`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={\`p-2 rounded-lg bg-gradient-to-br \${stage.color} text-white shadow-md\`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={\`text-[10px] font-mono px-2 py-0.5 rounded border \${
                    isActive 
                      ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' 
                      : 'bg-white/5 text-white/40 border-white/10'
                  }\`}>
                    Step {idx + 1}
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
        <div className="lg:col-span-2 bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className={\`p-3 rounded-xl bg-gradient-to-br \${currentStage.color} text-white shadow-lg\`}>
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
                <FileJson className="w-3.5 h-3.5 text-blue-400" /> Inputs
              </span>
              <ul className="space-y-1 text-white/70">
                {currentStage.details.inputs.map((inp, idx) => (
                  <li key={idx} className="truncate">• {inp}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-[#050505] border border-white/5 space-y-2">
              <span className="text-white/40 text-[10px] uppercase font-sans font-medium flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-purple-400" /> What happens?
              </span>
              <p className="text-white/70 text-[11px] leading-normal font-sans">
                {currentStage.details.processing}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#050505] border border-white/5 space-y-2">
              <span className="text-white/40 text-[10px] uppercase font-sans font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Outputs
              </span>
              <ul className="space-y-1 text-white/70">
                {currentStage.details.outputs.map((out, idx) => (
                  <li key={idx} className="truncate">• {out}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-white/50 font-mono">
              <span className="flex items-center gap-1.5"><Code2 className="w-4 h-4 text-indigo-400" /> Under the Hood Example</span>
            </div>
            <div className="bg-[#050505] border border-white/10 rounded-xl p-4 font-mono text-xs text-indigo-200/90 overflow-x-auto">
              <pre>{currentStage.codeSnippet}</pre>
            </div>
          </div>
        </div>

        {/* Meet the AI Agents Panel */}
        <div className="space-y-6">
          <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <Bot className="w-4 h-4 text-emerald-400" />
              Meet The Sentinel Agents
            </h3>
            
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#050505] border border-white/5 flex items-start gap-3">
                <Brain className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">The Orchestrator Agent</div>
                  <div className="text-white/50 text-[11px] mt-0.5">
                    The manager. It receives the error, talks to the Vector Database to find past memories, and delegates tasks to the other agents.
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#050505] border border-white/5 flex items-start gap-3">
                <Search className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">The Triage Agent</div>
                  <div className="text-white/50 text-[11px] mt-0.5">
                    The detective. It reads the logs and stack traces to figure out exactly why the code crashed (the root cause).
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#050505] border border-white/5 flex items-start gap-3">
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">The Impact Agent</div>
                  <div className="text-white/50 text-[11px] mt-0.5">
                    The analyst. It calculates how many customers are affected and estimates the financial money lost per minute.
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#050505] border border-white/5 flex items-start gap-3">
                <Code2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">The Remediation Agent</div>
                  <div className="text-white/50 text-[11px] mt-0.5">
                    The developer. It actually writes the code to fix the bug in the real microservice.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NEW SECTION: What We Built / Integrated Flow */}
      <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Rocket className="w-5 h-5 text-rose-400" />
            Hackathon Feature: Real Services & Auto-Deployment
          </h2>
        </div>
        
        <p className="text-sm text-white/70 mb-8 max-w-3xl">
          We didn&apos;t just build a dashboard. We integrated Sentinel with <strong>real backend microservices</strong> (like Java and Python APIs). When Sentinel detects a bug, it actually edits the live codebase and pushes a GitHub Pull Request!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          <div className="p-5 rounded-xl bg-[#050505] border border-white/10 hover:border-white/30 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400">
                <Server className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-white">Real Microservices</h3>
            </div>
            <p className="text-xs text-white/60 leading-relaxed">
              We generated real working Java and Python microservices (e.g., Order Payment Service, Core Banking Gateway). These services have intentional bugs for Sentinel to catch.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#050505] border border-white/10 hover:border-white/30 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-white">Live Code Patching</h3>
            </div>
            <p className="text-xs text-white/60 leading-relaxed">
              Instead of just suggesting a fix in text, Sentinel&apos;s Python backend physically locates the buggy file on the server and applies the code patch directly to the file system.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#050505] border border-white/10 hover:border-white/30 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400">
                <GitPullRequest className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-white">Direct GitHub PRs</h3>
            </div>
            <p className="text-xs text-white/60 leading-relaxed">
              Sentinel automatically commits the fixed file to the active <code>feature/ai-insights</code> branch and instantly pushes it to GitHub, ready for human review with a single click.
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}
