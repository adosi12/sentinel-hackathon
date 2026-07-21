"use client"
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useSentinelStore, Incident } from '@/lib/store'
import { formatDistanceToNow } from 'date-fns'
import { Loader2 } from 'lucide-react'

const fetchIncidents = async (): Promise<Incident[]> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api/v1'
  const response = await axios.get(`${apiUrl}/incidents`)
  return response.data
}

export default function IncidentFeed() {
  const { selectedIncidentId, setSelectedIncident } = useSentinelStore()
  const { data: incidents, isLoading, error } = useQuery({
    queryKey: ['incidents'],
    queryFn: fetchIncidents,
  })

  return (
    <Card className="flex flex-col h-full bg-black/40 border-white/10">
      <CardHeader>
        <CardTitle className="text-lg">Live Incident Feed</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-y-auto">
        <div className="p-4 flex flex-col gap-4">
          {isLoading && (
            <div className="flex items-center justify-center p-8 text-white/50">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading incidents...
            </div>
          )}
          
          {error && (
            <div className="text-red-400 text-sm p-4 bg-red-500/10 rounded-md">
              Failed to load incidents. Is the backend running?
            </div>
          )}

          {incidents?.length === 0 && (
            <div className="text-white/40 text-sm text-center p-8">
              No incidents reported. All systems operational.
            </div>
          )}

          {incidents?.map(incident => (
            <div 
              key={incident.id} 
              onClick={() => setSelectedIncident(incident.id)}
              className={`p-4 rounded-lg border flex flex-col gap-2 cursor-pointer transition-all ${
                selectedIncidentId === incident.id 
                  ? 'bg-indigo-500/10 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.15)]' 
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className={`text-xs font-semibold px-2 py-1 rounded ${
                  incident.severity === 'CRITICAL' ? 'bg-red-500/10 text-red-400' :
                  incident.severity === 'HIGH' ? 'bg-orange-500/10 text-orange-400' :
                  'bg-yellow-500/10 text-yellow-400'
                }`}>
                  {incident.severity}
                </span>
                <span className="text-white/40 text-xs">
                  {formatDistanceToNow(new Date(incident.created_at), { addSuffix: true })}
                </span>
              </div>
              <h4 className="text-sm text-white/90 font-medium">{incident.title}</h4>
              <p className="text-xs text-white/50">{incident.component} &middot; {incident.application}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
