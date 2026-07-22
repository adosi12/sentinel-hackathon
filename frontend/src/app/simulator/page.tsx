"use client"
import React from 'react'
import Header from '@/components/layout/Header'
import AlertSimulator from '@/components/dashboard/AlertSimulator'
import InvestigationWizard from '@/components/dashboard/InvestigationWizard'
import { useSentinelStore } from '@/lib/store'

export default function SimulatorPage() {
  const [simulatedIncidentId, setSimulatedIncidentId] = React.useState<string | null>(null)

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-background">
      <Header />

      <main className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 relative">
         <div className="text-xs font-semibold uppercase tracking-wider text-white/30 px-2 flex justify-between">
           <span>Real-Time Alert Simulation Sandbox</span>
           <span className="text-indigo-400">AI Agents Ready</span>
         </div>

         <div className="flex-1 flex gap-6 min-h-0">
            {/* Left Column: Simulator */}
            <div className="w-[450px] shrink-0 flex flex-col min-h-0">
               <AlertSimulator onIncidentCreated={setSimulatedIncidentId} />
            </div>

            {/* Right Column: Animated Wizard */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-black/20 rounded-lg border border-white/10 p-4 gap-4">
               {simulatedIncidentId ? (
                  <InvestigationWizard disableAnimation={false} incidentId={simulatedIncidentId} />
               ) : (
                  <div className="flex-1 flex items-center justify-center text-white/40 bg-white/[0.02] rounded-lg border border-white/5 p-8 text-center flex-col gap-4">
                     <div className="text-4xl">🧪</div>
                     <div>
                        <h3 className="text-white/80 font-medium mb-1">Sandbox Ready</h3>
                        <p className="text-sm">Select an alert template on the left and click "Inject Alert" to trigger the live Multi-Agent AI investigation.</p>
                     </div>
                  </div>
               )}
            </div>
         </div>
      </main>
    </div>
  )
}
