"use client"
import React, { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Play, Loader2, ServerCrash } from 'lucide-react'
import { useSentinelStore } from '@/lib/store'

const triggerAlert = async (rawAlert: string) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api/v1'
  const response = await axios.post(`${apiUrl}/incidents/alert`, { raw_alert: rawAlert })
  return response.data
}

export default function AlertSimulator({ onIncidentCreated }: { onIncidentCreated?: (id: string) => void }) {
  const [alertText, setAlertText] = useState('')
  const queryClient = useQueryClient()
  const { setSelectedIncident } = useSentinelStore()

  const mutation = useMutation({
    mutationFn: triggerAlert,
    onSuccess: (data) => {
      // Invalidate incidents feed so it refetches
      queryClient.invalidateQueries({ queryKey: ['incidents'] })
      // Auto-select the newly created incident
      if (data && data.id) {
        setSelectedIncident(data.id)
        if (onIncidentCreated) {
           onIncidentCreated(data.id)
        }
      }
      setAlertText('')
    }
  })

  return (
    <Card className="flex flex-col bg-black/40 border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.05)]">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2 text-indigo-400">
          <ServerCrash className="w-4 h-4" /> Inject Investigations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-white/50 mb-3">
          Paste an unstructured PagerDuty log or alert here. Sentinel's orchestrator will parse it using Gemini 2.5 Pro, search ChromaDB for historical RAG context, and generate an RCA.
        </p>
        <textarea
          className="w-full h-32 bg-white/5 border border-white/10 rounded-md p-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500/50 resize-none mb-3"
          placeholder="Describe what you are seeing in production in plain English. &#10;&#10;For example: 'Users are reporting that they can't checkout on the mobile app. It just hangs and then gives a 504 Gateway Timeout.' Sentinel will automatically analyze this, search historical context, map the impacted microservices, and provide an RCA."
          value={alertText}
          onChange={(e) => setAlertText(e.target.value)}
        />
        <Button 
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" 
          onClick={() => mutation.mutate(alertText)}
          disabled={!alertText.trim() || mutation.isPending}
        >
          {mutation.isPending ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Orchestrator Processing...</>
          ) : (
            <><Play className="w-4 h-4 mr-2 fill-current" /> Inject Alert</>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
