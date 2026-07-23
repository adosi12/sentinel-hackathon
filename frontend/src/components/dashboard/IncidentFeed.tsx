"use client"
import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useSentinelStore, Incident } from '@/lib/store'
import { formatDistanceToNow } from 'date-fns'
import { Loader2, Search, Filter } from 'lucide-react'

const fetchIncidents = async (): Promise<Incident[]> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api/v1'
  const response = await axios.get(`${apiUrl}/incidents`)
  return response.data
}

export default function IncidentFeed() {
  const { selectedIncidentId, setSelectedIncident, setActiveTab } = useSentinelStore()
  const [feedTab, setFeedTab] = useState<'unresolved' | 'resolved'>('unresolved')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<'all' | 'top5critical'>('all')
  
  const { data: incidents, isLoading, error } = useQuery({
    queryKey: ['incidents'],
    queryFn: fetchIncidents,
  })

  // Filter and sort newest first
  const sortedIncidents = React.useMemo(() => {
    if (!incidents) return []
    let filtered = incidents.filter(i => {
      if (i.status === 'simulated') return false; // Hide simulated alerts from both lists
      return feedTab === 'unresolved' ? i.status !== 'resolved' : i.status === 'resolved'
    })

    if (searchQuery) {
        const lowerQ = searchQuery.toLowerCase();
        filtered = filtered.filter(i => 
            i.title.toLowerCase().includes(lowerQ) ||
            i.component.toLowerCase().includes(lowerQ) ||
            i.application.toLowerCase().includes(lowerQ) ||
            i.id.toLowerCase().includes(lowerQ)
        );
    }

    if (activeFilter === 'top5critical') {
        filtered = filtered.filter(i => (i.severity || '').toUpperCase() === 'CRITICAL');
    }

    let sorted = filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    
    if (activeFilter === 'top5critical') {
        sorted = sorted.slice(0, 5);
    }

    return sorted
  }, [incidents, feedTab, searchQuery, activeFilter])

  // Auto-select latest incident on load or tab switch if none selected in this tab
  React.useEffect(() => {
    if (sortedIncidents.length > 0) {
      const isSelectedInCurrentTab = sortedIncidents.some(i => i.id === selectedIncidentId)
      if (!isSelectedInCurrentTab) {
        setSelectedIncident(sortedIncidents[0].id)
      }
    } else {
        setSelectedIncident(null)
    }
  }, [sortedIncidents, feedTab, setSelectedIncident, selectedIncidentId])

  return (
    <Card className="flex flex-col h-full bg-black/40 border-white/10">
      <CardHeader className="pb-3 border-b border-white/10">
        <div className="flex justify-between items-center mb-2">
           <CardTitle className="text-lg">Live Incident Feed</CardTitle>
        </div>
        <div className="flex gap-2 p-1 bg-white/5 rounded-md">
           <button 
             onClick={() => setFeedTab('unresolved')}
             className={`flex-1 text-xs font-medium py-1.5 rounded transition-colors ${feedTab === 'unresolved' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/20' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
           >
             Unresolved
           </button>
           <button 
             onClick={() => setFeedTab('resolved')}
             className={`flex-1 text-xs font-medium py-1.5 rounded transition-colors ${feedTab === 'resolved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
           >
             Resolved
           </button>
        </div>
        <div className="flex flex-col gap-2 mt-3">
            <div className="relative group">
                <Search className="absolute left-2.5 top-2 h-4 w-4 text-white/40 group-focus-within:text-indigo-400 transition-colors" />
                <input 
                    type="text" 
                    placeholder="Search incidents..." 
                    className="w-full bg-[#050505] border border-white/10 rounded-md py-1.5 pl-9 pr-3 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-colors placeholder:text-white/30"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <div className="flex gap-2">
                <button 
                    onClick={() => setActiveFilter('all')}
                    className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-1.5 rounded transition-colors border ${activeFilter === 'all' ? 'bg-white/10 text-white border-white/20' : 'text-white/50 hover:bg-white/5 border-transparent'}`}
                >
                    <Filter className="w-3 h-3" /> All
                </button>
                <button 
                    onClick={() => setActiveFilter('top5critical')}
                    className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-1.5 rounded transition-colors border ${activeFilter === 'top5critical' ? 'bg-red-500/20 text-red-400 border-red-500/20' : 'text-white/50 hover:bg-white/5 border-transparent'}`}
                >
                    Top 5 Critical
                </button>
            </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-y-auto custom-scrollbar">
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

          {sortedIncidents.length === 0 && !isLoading && (
            <div className="text-white/40 text-sm text-center p-8 border border-dashed border-white/10 rounded-lg bg-white/5">
              No {feedTab} incidents found.
            </div>
          )}

          {sortedIncidents.map(incident => (
            <div 
              key={incident.id} 
              onClick={() => setSelectedIncident(incident.id)}
              className={`p-4 rounded-lg border flex flex-col gap-2 cursor-pointer transition-all ${
                selectedIncidentId === incident.id 
                  ? feedTab === 'resolved' 
                    ? 'bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                    : 'bg-indigo-500/10 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.15)]' 
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className={`text-xs font-semibold px-2 py-1 rounded ${
                  (incident.severity || '').toUpperCase() === 'CRITICAL' ? 'bg-red-500/10 text-red-400' :
                  (incident.severity || '').toUpperCase() === 'HIGH' ? 'bg-orange-500/10 text-orange-400' :
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
