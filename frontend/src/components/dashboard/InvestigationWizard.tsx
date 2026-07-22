"use client"
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Loader2, Play } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useSentinelStore, Incident } from '@/lib/store'

import Step1Intake from '../wizard/steps/Step1Intake'
import Step2Historical from '../wizard/steps/Step2Historical'
import Step3Telemetry from '../wizard/steps/Step3Telemetry'
import Step4Dependency from '../wizard/steps/Step4Dependency'
import Step5RCA from '../wizard/steps/Step5RCA'
import Step6Code from '../wizard/steps/Step6Code'
import Step7Tickets from '../wizard/steps/Step7Tickets'
import Step8Completion from '../wizard/steps/Step8Completion'

const fetchIncidentDetails = async (id: string) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api/v1'
  const response = await axios.get(`${apiUrl}/incidents/${id}`)
  return response.data
}

interface StepNodeProps {
  stepNumber: number
  title: string
  isActive: boolean
  isCompleted: boolean
  isLast?: boolean
  disableAnimation?: boolean
  children: React.ReactNode
}

function StepNode({ stepNumber, title, isActive, isCompleted, isLast, disableAnimation, children }: StepNodeProps) {
  return (
    <div className="flex gap-4 relative">
      {/* Spine Line */}
      {!isLast && (
        <div className={`absolute left-[15px] top-8 bottom-[-16px] w-[2px] ${disableAnimation ? '' : 'transition-colors duration-1000'} ${isCompleted ? 'bg-emerald-500/50' : 'bg-white/10'}`} />
      )}
      
      {/* Node Icon */}
      <div className="relative z-10 shrink-0 mt-1">
        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center bg-[#050505] ${disableAnimation ? '' : 'transition-all duration-500'}
          ${isCompleted ? 'border-emerald-500 text-emerald-400' : 
            isActive ? 'border-indigo-500 text-indigo-400' : 'border-white/20 text-white/30'}`}
        >
          {isCompleted ? <Check className="w-4 h-4" /> : 
           isActive ? <Loader2 className="w-4 h-4 animate-spin" /> : 
           <span className="text-xs font-mono">{stepNumber}</span>}
        </div>
      </div>

      {/* Content */}
      <div className={`flex-1 pb-8 ${disableAnimation ? '' : 'transition-all duration-700'} ${isActive || isCompleted ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
        <div className="flex items-center justify-between mb-4">
           <h3 className={`text-sm font-semibold tracking-wide uppercase flex items-center gap-2
              ${isCompleted ? 'text-emerald-400' : isActive ? 'text-indigo-400' : 'text-white/50'}
           `}>
             <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-white/60 font-mono">STEP {stepNumber}</span> {title}
           </h3>
           {isCompleted && <span className="text-[10px] text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1 font-mono uppercase tracking-widest"><Check className="w-3 h-3"/> Done</span>}
        </div>
        
        <AnimatePresence>
          {(isActive || isCompleted) && (
            disableAnimation ? (
               <div className="overflow-hidden h-auto opacity-100">
                  {children}
               </div>
            ) : (
               <motion.div
                 initial={{ height: 0, opacity: 0 }}
                 animate={{ height: 'auto', opacity: 1 }}
                 transition={{ duration: 0.5, ease: 'easeOut' }}
                 className="overflow-hidden"
               >
                 {children}
               </motion.div>
            )
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default function InvestigationWizard({ disableAnimation = false, incidentId }: { disableAnimation?: boolean, incidentId?: string }) {
  const { selectedIncidentId } = useSentinelStore()
  const activeId = incidentId || selectedIncidentId
  const [activeStep, setActiveStep] = useState(disableAnimation ? 9 : 1)

  const { data: incident, isLoading } = useQuery({
    queryKey: ['incident', activeId],
    queryFn: () => fetchIncidentDetails(activeId!),
    enabled: !!activeId,
  })

  // Simulated AI investigation timeline sequence
  useEffect(() => {
    if (!incident) return
    if (disableAnimation) {
       setActiveStep(9)
       return
    }
    
    setActiveStep(1)
    
    // Auto-advance through the steps
    const timers = [
      setTimeout(() => setActiveStep(2), 1500),
      setTimeout(() => setActiveStep(3), 3500),
      setTimeout(() => setActiveStep(4), 5000),
      setTimeout(() => setActiveStep(5), 7000),
      setTimeout(() => setActiveStep(6), 9500),
      setTimeout(() => setActiveStep(7), 11500),
      setTimeout(() => setActiveStep(8), 13000),
      setTimeout(() => setActiveStep(9), 15000) // 9 means all completed
    ]
    
    return () => timers.forEach(clearTimeout)
  }, [incident?.id, disableAnimation]) // Re-run when incident changes

  if (!incident) return null

  return (
    <div className="flex flex-col h-full bg-[#050505] border border-white/10 rounded-lg overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="bg-[#0A0A0A] border-b border-white/10 p-4 shrink-0 flex justify-between items-center z-20 shadow-md">
        <div>
          <div className="text-xs text-white/50 uppercase tracking-widest mb-1 font-mono flex items-center gap-2">
            Investigation <span>—</span> {incident.id}
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            {incident.id} — {incident.title}
          </h2>
        </div>
        <div className="flex items-center gap-4">
           {activeStep < 9 ? (
             <div className="flex items-center gap-2 text-indigo-400 bg-indigo-500/10 px-4 py-2 rounded-full border border-indigo-500/20 text-sm font-medium">
               <Loader2 className="w-4 h-4 animate-spin" /> Running AI Pipeline — Step {activeStep}/8
             </div>
           ) : (
             <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20 text-sm font-medium">
               <Check className="w-4 h-4" /> Investigation Complete
             </div>
           )}
           <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20 flex items-center gap-2">
             <Play className="w-4 h-4" /> Run AI Pipeline
           </button>
        </div>
      </div>

      {/* Timeline Scroll Area */}
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
         <div className="max-w-4xl mx-auto">
            <StepNode stepNumber={1} title="Incident Intake" isActive={activeStep === 1} isCompleted={activeStep > 1} disableAnimation={disableAnimation}>
               <Step1Intake incident={incident} />
            </StepNode>
            <StepNode stepNumber={2} title="Historical Memory Search" isActive={activeStep === 2} isCompleted={activeStep > 2} disableAnimation={disableAnimation}>
               <Step2Historical />
            </StepNode>
            <StepNode stepNumber={3} title="Telemetry Correlation" isActive={activeStep === 3} isCompleted={activeStep > 3} disableAnimation={disableAnimation}>
               <Step3Telemetry incident={incident} />
            </StepNode>
            <StepNode stepNumber={4} title="Live Dependency Map" isActive={activeStep === 4} isCompleted={activeStep > 4} disableAnimation={disableAnimation}>
               <Step4Dependency />
            </StepNode>
            <StepNode stepNumber={5} title="Root Cause Analysis" isActive={activeStep === 5} isCompleted={activeStep > 5} disableAnimation={disableAnimation}>
               <Step5RCA incidentDetails={incident} />
            </StepNode>
            <StepNode stepNumber={6} title="Code Investigation" isActive={activeStep === 6} isCompleted={activeStep > 6} disableAnimation={disableAnimation}>
               <Step6Code />
            </StepNode>
            <StepNode stepNumber={7} title="Ticket & Notifications" isActive={activeStep === 7} isCompleted={activeStep > 7} disableAnimation={disableAnimation}>
               <Step7Tickets incident={incident} />
            </StepNode>
            <StepNode stepNumber={8} title="Incident Memory Update" isActive={activeStep === 8} isCompleted={activeStep > 8} isLast disableAnimation={disableAnimation}>
               <Step8Completion />
            </StepNode>
         </div>
      </div>
    </div>
  )
}
