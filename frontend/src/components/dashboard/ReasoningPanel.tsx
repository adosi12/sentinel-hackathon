"use client"
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useSentinelStore, Incident } from '@/lib/store'
import { Brain, Cpu, Wand2, ShieldCheck, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

interface IncidentDetails extends Incident {
  suggested_resolution?: string
  confidence_score?: number
  est_customers_impacted?: number
  est_financial_exposure?: number
  mttr_saved?: number
}

const fetchIncidentDetails = async (id: string): Promise<IncidentDetails> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api/v1'
  const response = await axios.get(`${apiUrl}/incidents/${id}`)
  return response.data
}

export default function ReasoningPanel() {
  const { selectedIncidentId } = useSentinelStore()

  const { data: incident, isLoading } = useQuery({
    queryKey: ['incident', selectedIncidentId],
    queryFn: () => fetchIncidentDetails(selectedIncidentId!),
    enabled: !!selectedIncidentId,
  })

  if (!selectedIncidentId) {
    return (
      <Card className="flex flex-col h-full bg-black/40 border-white/10 opacity-50">
        <CardContent className="flex-1 flex flex-col items-center justify-center text-white/40">
          <Brain className="w-12 h-12 mb-4 opacity-50" />
          <p>Select an incident from the feed to view AI Reasoning.</p>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className="flex flex-col h-full bg-black/40 border-white/10">
        <CardContent className="flex-1 flex items-center justify-center text-white/50">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Analyzing Incident...
        </CardContent>
      </Card>
    )
  }

  if (!incident) return null

  return (
    <Card className="flex flex-col h-full bg-black/40 border-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.05)] relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <Brain className="w-32 h-32 text-indigo-400" />
      </div>

      <CardHeader className="pb-4 relative z-10">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-300">
            <Wand2 className="w-5 h-5" /> Sentinel AI Reasoning
          </div>
          {incident.confidence_score && (
            <div className="text-xs font-mono bg-indigo-500/10 text-indigo-300 px-3 py-1 rounded-full border border-indigo-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> {(incident.confidence_score * 100).toFixed(0)}% Confidence
            </div>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto relative z-10 flex flex-col gap-6">
        <div>
          <h4 className="text-xs uppercase tracking-wider text-white/40 mb-2 font-semibold">Incident Context</h4>
          <p className="text-sm text-white/80 leading-relaxed bg-white/5 p-3 rounded-md border border-white/10">
            {incident.description}
          </p>
        </div>

        {incident.suggested_resolution && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h4 className="text-xs uppercase tracking-wider text-emerald-400/70 mb-2 font-semibold">Automated Root Cause & Resolution</h4>
            <div className="text-sm text-white/90 leading-relaxed bg-emerald-500/10 p-4 rounded-md border border-emerald-500/20 shadow-inner prose prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: incident.suggested_resolution.replace(/\n/g, '<br/>') }} />
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-2 gap-4 mt-auto pt-4 border-t border-white/10">
          <div>
            <h4 className="text-xs text-white/40 mb-1">Est. Financial Exposure</h4>
            <div className="text-lg font-mono text-red-400">
              ${(incident.est_financial_exposure || 0).toLocaleString()}
            </div>
          </div>
          <div>
            <h4 className="text-xs text-white/40 mb-1">MTTR Saved</h4>
            <div className="text-lg font-mono text-emerald-400">
              {incident.mttr_saved || 0} mins
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white">Execute Runbook</Button>
          <Button variant="outline" className="flex-1">Create Jira Ticket</Button>
        </div>
      </CardContent>
    </Card>
  )
}
