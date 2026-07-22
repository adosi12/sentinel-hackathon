import React from 'react'
import { ShieldCheck, Activity } from 'lucide-react'

export default function Step5RCA({ incidentDetails }: { incidentDetails: any }) {
  if (!incidentDetails) return null
  
  const score = incidentDetails.confidence_score || 0.94

  const parseResolutionSteps = (res: string | undefined): string[] => {
      if (!res) return [
          "Bump jackson-databind to v2.15.2 in Prod pom.xml",
          "Run hotfix deploy pipeline deploy-payment-service-prod",
          "Clear RabbitMQ dead-letter queue after service recovery"
      ];
      try {
          if (res.startsWith('{') && res.endsWith('}')) {
              // It's a Postgres array string like {"step 1", "step 2"}
              const matches = res.match(/"([^"]*)"/g);
              if (matches && matches.length > 0) {
                  return matches.map(m => m.slice(1, -1));
              }
              return res.slice(1, -1).split(',').map(s => s.trim());
          }
          if (res.startsWith('[') && res.endsWith(']')) {
             const parsed = JSON.parse(res);
             if (Array.isArray(parsed)) return parsed.map(String);
          }
      } catch (e) {}
      
      if (res.includes('\n')) {
          return res.split('\n').map(s => s.replace(/^[-*0-9.]+\s*/, '').trim()).filter(Boolean);
      }
      return [res];
  }

  const steps = parseResolutionSteps(incidentDetails.suggested_resolution);

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
      <div className="border border-white/10 bg-[#0A0A0A] rounded-md p-4 text-sm text-white/80 leading-relaxed font-mono whitespace-pre-wrap">
        {incidentDetails.description || "Environment drift detected. Jackson-databind version mismatch between UAT (v2.15.2) and Production (v2.10.5)."}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-white/10 bg-[#0A0A0A] rounded-md p-4 flex flex-col gap-2">
          <span className="text-[10px] text-white/40 uppercase tracking-wider flex items-center gap-1"><Activity className="w-3 h-3"/> Impacted Services</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {incidentDetails.impacted_services && incidentDetails.impacted_services.length > 0 ? (
                incidentDetails.impacted_services.map((svc: string, i: number) => (
                   <span key={i} className="text-xs text-red-400 font-mono bg-red-500/10 px-2 py-1 rounded block border border-red-500/20">
                     {svc}
                   </span>
                ))
            ) : (
                <span className="text-xs text-white/50 bg-white/5 px-2 py-1 rounded">No services mapped</span>
            )}
          </div>
        </div>
        <div className="border border-white/10 bg-[#0A0A0A] rounded-md p-4 flex flex-col gap-2">
           <span className="text-[10px] text-emerald-400 uppercase tracking-wider flex items-center gap-1"><ShieldCheck className="w-3 h-3"/> Recommended Actions</span>
           <div className="flex flex-col gap-3 mt-1 text-xs text-white/70 overflow-y-auto max-h-[200px] custom-scrollbar pr-2">
              {steps.map((step, i) => (
                  <label key={i} className="flex items-start gap-3 cursor-pointer group">
                     <input type="checkbox" className="mt-0.5 rounded bg-white/10 border-white/20 text-emerald-500 focus:ring-emerald-500" defaultChecked={i === 0}/>
                     <span className="group-hover:text-white transition-colors leading-relaxed">{step}</span>
                  </label>
              ))}
           </div>
        </div>
      </div>
    </div>
  )
}
