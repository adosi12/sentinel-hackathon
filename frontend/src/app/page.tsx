"use client"
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Bell, Search, Activity, ShieldAlert, Cpu, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'
import SystemMap from '@/components/dashboard/SystemMap'
import AlertSimulator from '@/components/dashboard/AlertSimulator'
import IncidentFeed from '@/components/dashboard/IncidentFeed'
import ReasoningPanel from '@/components/dashboard/ReasoningPanel'
import Header from '@/components/layout/Header'
import InvestigationWizard from '@/components/dashboard/InvestigationWizard'
import EmailPopup from '@/components/dashboard/EmailPopup'
import ManualInvestigationModal from '@/components/dashboard/ManualInvestigationModal'
import { useSentinelStore } from '@/lib/store'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const fetchIncidentDetails = async (id: string) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api/v1'
  const response = await axios.get(`${apiUrl}/incidents/${id}`)
  return response.data
}

export default function Home() {
  const { selectedIncidentId, setSelectedIncident } = useSentinelStore()
  const [investigatingIds, setInvestigatingIds] = useState<Set<string>>(new Set())
  const [isManualModalOpen, setIsManualModalOpen] = useState(false)

  const { data: incident } = useQuery({
    queryKey: ['incident', selectedIncidentId],
    queryFn: () => fetchIncidentDetails(selectedIncidentId!),
    enabled: !!selectedIncidentId,
  })

  const isInvestigating = incident ? investigatingIds.has(incident.id) : false
  const isUnresolved = incident ? (incident.status === 'unresolved' && !isInvestigating) : false

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-background">
      <Header />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 relative">
         <div className="text-xs font-semibold uppercase tracking-wider text-white/30 px-2 flex justify-between items-center">
           <div className="flex items-center gap-4">
             <span>Active Investigations Dashboard</span>
             <Button variant="outline" size="sm" className="h-7 px-3 text-[10px] bg-indigo-500/10 border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20" onClick={() => setIsManualModalOpen(true)}>
               + Add Investigation
             </Button>
           </div>
           <span className="text-emerald-400">System Healthy</span>
         </div>
        {/* Hero Stats - Shrunk */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="bg-gradient-to-br from-red-500/10 to-transparent border-red-500/20 py-2 interactive-hover">
              <CardHeader className="p-3 pb-0 border-none">
                <CardTitle className="text-xs font-medium text-red-400 flex items-center gap-2">
                  <ShieldAlert className="w-3 h-3" /> Open Incidents
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-1">
                <div className="text-3xl font-bold text-white flex items-baseline gap-2">4 <span className="text-[10px] text-white/50 font-normal">+2 from last hour</span></div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-500/20 py-2 interactive-hover">
              <CardHeader className="p-3 pb-0 border-none">
                <CardTitle className="text-xs font-medium text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-3 h-3" /> Resolved Today
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-1">
                <div className="text-3xl font-bold text-white flex items-baseline gap-2">12 <span className="text-[10px] text-white/50 font-normal">98% within SLA</span></div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="bg-gradient-to-br from-indigo-500/10 to-transparent border-indigo-500/20 py-2 interactive-hover">
              <CardHeader className="p-3 pb-0 border-none">
                <CardTitle className="text-xs font-medium text-indigo-400 flex items-center gap-2">
                  <Activity className="w-3 h-3" /> Average MTTR
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-1">
                <div className="text-3xl font-bold text-white flex items-baseline gap-2">14m <span className="text-[10px] text-indigo-400/80 font-normal">-32% vs last week</span></div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20 py-2 interactive-hover">
              <CardHeader className="p-3 pb-0 border-none">
                <CardTitle className="text-xs font-medium text-purple-400 flex items-center gap-2">
                  <Cpu className="w-3 h-3" /> AI Confidence
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-1">
                <div className="text-3xl font-bold text-white flex items-baseline gap-2">94% <span className="text-[10px] text-white/50 font-normal">across resolutions</span></div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="flex-1 flex gap-4 min-h-0">
          {/* Left Column: Feed */}
          <div className="w-[450px] shrink-0 flex flex-col min-h-0">
             <IncidentFeed />
          </div>
          
          {/* Right Column */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden gap-4">
             {selectedIncidentId && incident ? (
                isUnresolved ? (
                   <EmailPopup 
                     incident={incident} 
                     onInvestigate={() => {
                        setInvestigatingIds(prev => new Set(prev).add(incident.id))
                     }} 
                   />
                ) : (
                   <InvestigationWizard disableAnimation={!isInvestigating} />
                )
             ) : (
                <div className="flex-1 grid grid-rows-2 gap-4 min-h-0">
                   <Card className="flex flex-col bg-[#0A0A0A] border-white/10">
                     <CardHeader className="py-3">
                       <CardTitle className="text-sm">Live System Map</CardTitle>
                     </CardHeader>
                     <CardContent className="flex-1 border-t border-white/5 bg-white/[0.02] p-0 relative min-h-0">
                       <SystemMap />
                     </CardContent>
                   </Card>
                   
                   <div className="grid grid-cols-1 gap-4 min-h-0">
                     <div className="overflow-auto min-h-0 rounded-lg">
                       <ReasoningPanel />
                     </div>
                   </div>
                </div>
             )}
          </div>
        </div>
      </main>
      
      <ManualInvestigationModal 
        isOpen={isManualModalOpen} 
        onClose={() => setIsManualModalOpen(false)} 
        onSubmit={async (query) => {
          try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api/v1'
            const response = await axios.post(`${apiUrl}/incidents/alert`, { raw_alert: query })
            const incident = response.data
            setSelectedIncident(incident.id)
            setInvestigatingIds(prev => new Set(prev).add(incident.id))
          } catch (error) {
            console.error("Failed to trigger investigation API", error)
            // Fallback for demo just in case
            const dummyId = "INC-1000"
            setSelectedIncident(dummyId)
            setInvestigatingIds(prev => new Set(prev).add(dummyId))
          }
        }}
      />
    </div>
  )
}
