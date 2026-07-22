import React from 'react'
import { Database, CheckCircle2 } from 'lucide-react'

export default function Step8Completion() {
  return (
    <div className="border border-emerald-500/20 bg-emerald-500/5 rounded-md p-6 flex items-center justify-between">
      <div>
         <h3 className="text-lg font-medium text-emerald-400 flex items-center gap-2 mb-1">
            <CheckCircle2 className="w-5 h-5" /> Investigation Complete & Memory Saved
         </h3>
         <p className="text-sm text-white/60">
            The incident details, RCA, and mitigation steps have been embedded and saved to the organizational knowledge graph. Sentinel will recall this automatically if a similar event occurs.
         </p>
      </div>
      <div className="bg-emerald-500/10 w-12 h-12 rounded-full flex items-center justify-center shrink-0 border border-emerald-500/20">
         <Database className="w-5 h-5 text-emerald-400" />
      </div>
    </div>
  )
}
