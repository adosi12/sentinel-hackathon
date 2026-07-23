import React, { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { X, Play, Loader2 } from 'lucide-react'
import { Incident } from '@/lib/store'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

const triggerInvestigation = async (incidentId: string) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api/v1'
  const response = await axios.post(`${apiUrl}/incidents/${incidentId}/investigate`)
  return response.data
}

export default function EmailPopup({ incident, onInvestigate }: { incident: Incident, onInvestigate: () => void }) {
  const queryClient = useQueryClient()
  
  const mutation = useMutation({
    mutationFn: () => triggerInvestigation(incident.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] })
      queryClient.invalidateQueries({ queryKey: ['incident', incident.id] })
    }
  })

  const handleLaunch = () => {
     onInvestigate();
     // Only trigger the backend API if it hasn't been investigated yet
     if (!incident.jira_content) {
        mutation.mutate();
     }
  }

  // Basic parsing of the fake email string
  const lines = (incident.description || '').split('\n')
  const fromLine = lines.find(l => l.startsWith('From:')) || 'From: monitoring-alerts@bank.internal'
  const toLine = lines.find(l => l.startsWith('To:')) || 'To: sre-team@bank.internal, payments-l2-ops@bank.internal'
  const subjectLine = lines.find(l => l.startsWith('Subject:')) || `Subject: [${incident.severity}] ${incident.id} — ${incident.title}`
  
  // Extract body
  let body = incident.description || ''
  const emptyLineIndex = lines.findIndex(l => l.trim() === '')
  if (emptyLineIndex !== -1 && emptyLineIndex < 5) {
      body = lines.slice(emptyLineIndex + 1).join('\n')
  }

  return (
    <div className="flex-1 grid grid-rows-[auto_1fr_auto] h-full overflow-hidden bg-[#0A0A0A] border border-white/10 rounded-lg">
       {/* Header */}
       <div className="bg-black/40 border-b border-white/10 p-6 flex justify-between items-start">
          <div>
             <div className="flex items-center gap-3 mb-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${incident.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : incident.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'}`}>
                  {incident.severity}
                </span>
                <span className="text-xs font-mono text-white/50">{incident.id}</span>
                <span className="text-xs font-mono text-white/30">&middot;</span>
                <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">{incident.application}</span>
             </div>
             <h2 className="text-2xl font-bold text-white tracking-tight">{incident.title}</h2>
          </div>
       </div>
       
       {/* Details Body */}
       <div className="p-8 overflow-y-auto custom-scrollbar flex flex-col">
          <div className="grid grid-cols-[80px_1fr] gap-y-4 text-sm pb-6 border-b border-white/10">
             <div className="text-white/40 font-medium pt-1">Source</div>
             <div className="text-white/90 font-mono text-sm bg-white/5 w-fit px-3 py-1 rounded-md border border-white/5">{fromLine.replace('From:', '').trim()}</div>
             
             <div className="text-white/40 font-medium pt-1">Routing</div>
             <div className="flex flex-wrap gap-2">
                {toLine.replace('To:', '').split(',').map((email, idx) => (
                   <span key={idx} className="bg-white/5 border border-white/5 text-white/80 font-mono text-sm px-3 py-1 rounded-md">{email.trim()}</span>
                ))}
             </div>
             
             <div className="text-white/40 font-medium pt-1">Subject</div>
             <div className="text-white font-semibold text-base pt-1">{subjectLine.replace('Subject:', '').trim()}</div>
          </div>
          
          <div className="pt-6">
             <div className="font-mono text-sm text-white/80 leading-loose">
                {body.split('\n').map((line, i) => {
                   if (!line.trim()) return <br key={i} />;
                   return (
                     <p key={i} className={`min-h-[1.5rem] ${line.includes('Error:') ? 'text-red-400 font-bold bg-red-500/10 inline-block px-2 rounded -ml-2' : ''}`}>
                       {line}
                     </p>
                   )
                })}
             </div>
          </div>
       </div>
       
       {/* Footer Action */}
       <div className="p-6 bg-black/40 border-t border-white/10 flex justify-between items-center">
          <div className="text-xs text-white/40">
             Ready for autonomous investigation via Sentinel AI.
          </div>
          <Button 
            onClick={handleLaunch} 
            disabled={mutation.isPending}
            className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 px-6 py-5 text-sm rounded-lg flex items-center gap-2 font-medium transition-all hover:scale-105 active:scale-95"
          >
             {mutation.isPending ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Initializing AI...</>
             ) : incident.jira_content ? (
                <><Play className="w-5 h-5 fill-current" /> View AI Investigation Results</>
             ) : (
                <><Play className="w-5 h-5 fill-current" /> Launch AI Investigation</>
             )}
          </Button>
       </div>
    </div>
  )
}
