import React from 'react'
import { Incident } from '@/lib/store'
import { ShieldCheck, CheckSquare, SearchX } from 'lucide-react'

export default function Step5RCA({ incidentDetails }: { incidentDetails: any }) {
  if (!incidentDetails) return null
  
  const score = incidentDetails.confidence_score || 0.94

  return (
    <div className="flex flex-col gap-4">
      {/* Confidence Score Bar */}
      <div className="border border-white/10 bg-[#0A0A0A] rounded-md p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-white/50 uppercase tracking-wider font-semibold">AI Confidence Score</span>
          <span className="text-xl font-bold font-mono text-emerald-400">{(score * 100).toFixed(0)}%</span>
        </div>
        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500" style={{ width: `${score * 100}%` }} />
        </div>
      </div>

      {/* AI Summary */}
      <div className="border border-white/10 bg-[#0A0A0A] rounded-md p-4 text-sm text-white/80 leading-relaxed">
        {incidentDetails.suggested_resolution ? (
           <div dangerouslySetInnerHTML={{ __html: incidentDetails.suggested_resolution.replace(/\n/g, '<br/>') }} />
        ) : (
          "Environment drift detected. Jackson-databind version mismatch between UAT (v2.15.2) and Production (v2.10.5). Production service failed deserializing transactionMetadata field, causing cascading 504 gateway timeouts."
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="border border-white/10 bg-[#0A0A0A] rounded-md p-4 flex flex-col gap-2">
          <span className="text-[10px] text-white/40 uppercase tracking-wider flex items-center gap-1"><SearchX className="w-3 h-3"/> Error Signature</span>
          <code className="text-xs text-red-400 font-mono bg-red-500/10 p-2 rounded block break-words">
            java.lang.NoSuchMethodError: com.fasterxml.jackson.databind.ObjectMapper.readTree(java/lang/String;)
          </code>
        </div>
        <div className="border border-white/10 bg-[#0A0A0A] rounded-md p-4 flex flex-col gap-2">
           <span className="text-[10px] text-white/40 uppercase tracking-wider flex items-center gap-1"><ShieldCheck className="w-3 h-3"/> Recommended Actions</span>
           <div className="flex flex-col gap-2 text-xs text-white/70">
              <label className="flex items-start gap-2 cursor-pointer group">
                 <input type="checkbox" className="mt-0.5 rounded bg-white/10 border-white/20 text-emerald-500 focus:ring-emerald-500" defaultChecked/>
                 <span className="group-hover:text-white transition-colors">Bump jackson-databind to v2.15.2 in Prod pom.xml</span>
              </label>
              <label className="flex items-start gap-2 cursor-pointer group">
                 <input type="checkbox" className="mt-0.5 rounded bg-white/10 border-white/20 text-emerald-500 focus:ring-emerald-500" defaultChecked/>
                 <span className="group-hover:text-white transition-colors">Run hotfix deploy pipeline <code className="bg-white/10 px-1 rounded text-white/50">deploy-payment-service-prod</code></span>
              </label>
              <label className="flex items-start gap-2 cursor-pointer group">
                 <input type="checkbox" className="mt-0.5 rounded bg-white/10 border-white/20 text-emerald-500 focus:ring-emerald-500" />
                 <span className="group-hover:text-white transition-colors">Clear RabbitMQ dead-letter queue after service recovery</span>
              </label>
           </div>
        </div>
      </div>
    </div>
  )
}
