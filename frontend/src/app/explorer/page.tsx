"use client"
import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import Header from '@/components/layout/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Search, Loader2, Filter } from 'lucide-react'
import { Incident } from '@/lib/store'
import { formatDistanceToNow, format } from 'date-fns'

const fetchIncidents = async (): Promise<Incident[]> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api/v1'
  const response = await axios.get(`${apiUrl}/incidents`)
  return response.data
}

export default function HistoricalExplorer() {
  const { data: incidents, isLoading } = useQuery({
    queryKey: ['incidents'],
    queryFn: fetchIncidents,
  })

  const [searchTerm, setSearchTerm] = useState('')

  const filteredIncidents = React.useMemo(() => {
    if (!incidents) return []
    if (!searchTerm) return incidents
    const lower = searchTerm.toLowerCase()
    return incidents.filter(i => 
      i.title.toLowerCase().includes(lower) || 
      i.application.toLowerCase().includes(lower) ||
      i.component.toLowerCase().includes(lower) ||
      i.id.toLowerCase().includes(lower)
    )
  }, [incidents, searchTerm])

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-background">
      <Header />

      <main className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 relative">
        <div className="flex justify-between items-end mb-2">
          <div>
            <h2 className="text-2xl font-bold text-white">Historical Incident Explorer</h2>
            <p className="text-white/50 text-sm mt-1">Search, filter, and analyze past incidents mitigated by Sentinel.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input 
                type="text" 
                placeholder="Search by ID, App, or Component..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-md pl-9 pr-4 py-2 text-sm w-80 focus:outline-none focus:border-indigo-500/50 transition-all text-white placeholder:text-white/30"
              />
            </div>
            <button className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-md text-sm text-white/70 hover:bg-white/10 hover:text-white transition-all">
              <Filter className="w-4 h-4" /> Filters
            </button>
          </div>
        </div>

        <Card className="flex-1 flex flex-col bg-black/40 border-white/10">
          <CardContent className="flex-1 p-0 overflow-auto">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-64 text-white/50">
                <Loader2 className="w-8 h-8 animate-spin mb-4 text-indigo-500" />
                Loading historical archive...
              </div>
            ) : (
              <table className="w-full text-left text-sm text-white/70">
                <thead className="bg-white/5 text-white/50 uppercase text-xs sticky top-0 z-10 backdrop-blur-md">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Incident ID</th>
                    <th className="px-6 py-4 font-semibold">Application</th>
                    <th className="px-6 py-4 font-semibold">Title</th>
                    <th className="px-6 py-4 font-semibold">Severity</th>
                    <th className="px-6 py-4 font-semibold">Date</th>
                    <th className="px-6 py-4 font-semibold">AI Confidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredIncidents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-white/40">
                        No incidents found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredIncidents.map((incident) => (
                      <tr key={incident.id} className="hover:bg-white/[0.02] transition-colors cursor-pointer group">
                        <td className="px-6 py-4 font-mono text-indigo-400 group-hover:text-indigo-300">{incident.id}</td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-white/90">{incident.application}</div>
                          <div className="text-xs text-white/40">{incident.component}</div>
                        </td>
                        <td className="px-6 py-4 max-w-md truncate text-white/80">{incident.title}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                            incident.severity === 'CRITICAL' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                            incident.severity === 'HIGH' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                            'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                          }`}>
                            {incident.severity}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-white/80">{format(new Date(incident.created_at), 'MMM dd, yyyy')}</div>
                          <div className="text-xs text-white/40">{formatDistanceToNow(new Date(incident.created_at), { addSuffix: true })}</div>
                        </td>
                        <td className="px-6 py-4">
                          {incident.confidence_score ? (
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-indigo-500" 
                                  style={{ width: `${incident.confidence_score * 100}%` }}
                                />
                              </div>
                              <span className="text-xs font-mono">{(incident.confidence_score * 100).toFixed(0)}%</span>
                            </div>
                          ) : (
                            <span className="text-white/30 text-xs">N/A</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
