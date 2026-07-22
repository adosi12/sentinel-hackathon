import React from 'react'
import { Brain, Search } from 'lucide-react'

export default function Step2Historical() {
  return (
    <div className="flex flex-col gap-3">
      {/* Search Header */}
      <div className="flex items-center gap-2 text-xs text-white/50 bg-white/5 border border-white/10 rounded-md p-2">
        <Search className="w-3 h-3" /> Searching Vector Database (ChromaDB) for semantic similarity...
      </div>

      {/* Match 1 */}
      <div className="border border-emerald-500/20 bg-emerald-500/5 rounded-md p-4 flex items-start gap-4">
        <div className="flex flex-col items-center">
          <div className="text-emerald-400 text-xl font-bold font-mono">92%</div>
          <div className="text-[10px] text-emerald-400/50 uppercase tracking-wider">Match</div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-white/80 font-medium font-mono text-sm">INC-2026-0391</span>
            <span className="text-white/60 text-sm">— Connection pool exhaustion post-deploy</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-white/40 mb-2">
            <span className="bg-white/10 px-2 py-0.5 rounded-full text-[10px]">Resolved 14 days ago</span>
            <span>Root Cause: Bumped pool limit in config from 200 to 500</span>
          </div>
        </div>
        <div className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
          <Brain className="w-3 h-3" /> RAG
        </div>
      </div>

      {/* Match 2 */}
      <div className="border border-white/10 bg-white/[0.02] rounded-md p-4 flex items-start gap-4">
        <div className="flex flex-col items-center">
          <div className="text-white/60 text-xl font-bold font-mono">61%</div>
          <div className="text-[10px] text-white/40 uppercase tracking-wider">Match</div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-white/80 font-medium font-mono text-sm">INC-2025-1832</span>
            <span className="text-white/60 text-sm">— similar service degradation event</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-white/40">
            <span className="bg-white/10 px-2 py-0.5 rounded-full text-[10px]">Resolved 3 months ago</span>
            <span>Root Cause: Rolled back deployment v2.3.1</span>
          </div>
        </div>
        <div className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
          <Brain className="w-3 h-3" /> RAG
        </div>
      </div>
    </div>
  )
}
