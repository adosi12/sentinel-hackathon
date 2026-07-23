"use client"
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Loader2, Play } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
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

  const [isWaitingForHuman, setIsWaitingForHuman] = useState(false)
  const [humanInput, setHumanInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [jiraStatus, setJiraStatus] = useState<'pending' | 'checking' | 'completed'>('pending')
  const queryClient = useQueryClient()
  
  const resolveMutation = useMutation({
    mutationFn: async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api/v1'
      const response = await axios.put(`${apiUrl}/incidents/${incident?.id}/resolve`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] })
      queryClient.invalidateQueries({ queryKey: ['incident', incident?.id] })
    }
  })

  const handleCheckJira = async () => {
    setJiraStatus('checking')
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    setJiraStatus('completed')
  }

  const playedIncidentId = React.useRef<string | null>(null)

  // Simulated AI investigation timeline sequence
  useEffect(() => {
    if (!incident) return
    if (disableAnimation) {
       setActiveStep(incident.status === 'resolved' ? 9 : incident.needs_human_input ? 5 : 9)
       if (incident.needs_human_input && incident.status !== 'resolved') {
         setIsWaitingForHuman(true)
       }
       return
    }
    
    if (incident.status === 'resolved' && playedIncidentId.current === incident.id) {
       setActiveStep(9)
       return
    }

    playedIncidentId.current = incident.id
    setActiveStep(1)
    
    const runSequence = async () => {
      const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
      await wait(1500); setActiveStep(2);
      await wait(2000); setActiveStep(3);
      await wait(1500); setActiveStep(4);
      await wait(2000); setActiveStep(5);
      
      if (incident.needs_human_input) {
         setIsWaitingForHuman(true)
         // Halt pipeline here
         return
      }

      await wait(2500); setActiveStep(6);
      await wait(2000); setActiveStep(7);
      await wait(1500); setActiveStep(8);
      await wait(2000); setActiveStep(9);
    }
    
    runSequence()
  }, [incident?.id, disableAnimation, incident?.status]) // Re-run when incident changes

  const submitHumanInput = async () => {
    if (!humanInput.trim()) return
    setIsSubmitting(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api/v1'
      await axios.post(`${apiUrl}/incidents/${incident?.id}/provide-input`, { input: humanInput })
      
      // Resume pipeline
      setIsWaitingForHuman(false)
      const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
      await wait(1500); setActiveStep(6);
      await wait(2000); setActiveStep(7);
      await wait(1500); setActiveStep(8);
      await wait(2000); setActiveStep(9);
      
      // Update local state to show resolved
      incident!.status = 'resolved'
    } catch (e) {
      console.error(e)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!incident) return null

  return (
    <div className="flex flex-col h-full bg-[#050505] border border-white/10 rounded-lg overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="bg-[#0A0A0A] border-b border-white/10 p-4 shrink-0 flex justify-between items-center z-20 shadow-md">
        <div>
          <div className="text-xs text-white/50 uppercase tracking-widest mb-1 font-mono flex items-center gap-2">
            {incident.id.length > 10 ? 'User Investigation' : `Investigation — ${incident.id}`}
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            {incident.id.length > 10 ? 'Ad-hoc Query' : incident.id} — {incident.title}
          </h2>
        </div>
        <div className="flex items-center gap-4">
           {activeStep < 9 ? (
             isWaitingForHuman ? (
                <div className="flex items-center gap-2 text-amber-400 bg-amber-500/10 px-4 py-2 rounded-full border border-amber-500/20 text-sm font-medium">
                  ⚠️ Waiting for Human Input — Step {activeStep}/8
                </div>
             ) : (
                <div className="flex items-center gap-2 text-indigo-400 bg-indigo-500/10 px-4 py-2 rounded-full border border-indigo-500/20 text-sm font-medium">
                  <Loader2 className="w-4 h-4 animate-spin" /> Running AI Pipeline — Step {activeStep}/8
                </div>
             )
           ) : (
             <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20 text-sm font-medium">
               <Check className="w-4 h-4" /> Investigation Complete
             </div>
           )}
        </div>
      </div>

      {/* Timeline Scroll Area */}
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
         <div className="max-w-4xl mx-auto">
            <StepNode stepNumber={1} title={incident.id.length > 10 ? "User Investigation Statement" : "Incident Intake"} isActive={activeStep === 1} isCompleted={activeStep > 1} disableAnimation={disableAnimation}>
               <Step1Intake incident={incident} />
            </StepNode>
            <StepNode stepNumber={2} title="Historical Memory Search" isActive={activeStep === 2} isCompleted={activeStep > 2} disableAnimation={disableAnimation}>
               <Step2Historical incident={incident} />
            </StepNode>
            <StepNode stepNumber={3} title="Telemetry Correlation" isActive={activeStep === 3} isCompleted={activeStep > 3} disableAnimation={disableAnimation}>
               <Step3Telemetry incident={incident} />
            </StepNode>
            <StepNode stepNumber={4} title="Live Dependency Map" isActive={activeStep === 4} isCompleted={activeStep > 4} disableAnimation={disableAnimation}>
               <Step4Dependency incident={incident} />
            </StepNode>
            <StepNode stepNumber={5} title="Root Cause Analysis" isActive={activeStep === 5} isCompleted={activeStep > 5} disableAnimation={disableAnimation}>
               <Step5RCA incidentDetails={incident} />
               <AnimatePresence>
                 {isWaitingForHuman && activeStep === 5 && (
                   <motion.div 
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, scale: 0.95 }}
                     className="mt-4 border border-amber-500/20 bg-amber-500/10 rounded-md p-4 flex flex-col gap-3"
                   >
                     <div className="flex items-start gap-2">
                       <span className="text-xl">⚠️</span>
                       <div>
                         <h4 className="text-amber-400 font-bold text-sm">Low AI Confidence ({(incident.confidence_score! * 100).toFixed(0)}%)</h4>
                         <p className="text-white/70 text-sm mt-1">{incident.human_prompt || "Sentinel requires human context to proceed. Please provide details."}</p>
                       </div>
                     </div>
                     <textarea 
                       value={humanInput}
                       onChange={(e) => setHumanInput(e.target.value)}
                       placeholder="Enter context here..."
                       disabled={isSubmitting}
                       className="w-full h-20 bg-[#050505] border border-amber-500/20 rounded p-2 text-sm text-white focus:outline-none focus:border-amber-500 resize-none font-mono"
                     />
                     <div className="flex justify-end">
                       <button 
                         onClick={submitHumanInput}
                         disabled={!humanInput.trim() || isSubmitting}
                         className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-1.5 rounded text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                       >
                         {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                         Submit Input & Resume
                       </button>
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>
            </StepNode>
            <StepNode stepNumber={6} title="Code Investigation" isActive={activeStep === 6} isCompleted={activeStep > 6} disableAnimation={disableAnimation}>
               <Step6Code incident={incident} />
            </StepNode>
            <StepNode stepNumber={7} title="Ticket & Notifications" isActive={activeStep === 7} isCompleted={activeStep > 7} disableAnimation={disableAnimation}>
               <Step7Tickets incident={incident} />
            </StepNode>
            <StepNode stepNumber={8} title="Incident Memory Update" isActive={activeStep === 8} isCompleted={activeStep > 8} isLast disableAnimation={disableAnimation}>
               <Step8Completion />
            </StepNode>

            {/* Verification and Closure Panel */}
            <AnimatePresence>
              {activeStep === 9 && incident?.status !== 'resolved' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 border border-white/10 bg-[#0A0A0A] rounded-xl overflow-hidden"
                >
                  <div className="bg-black/40 border-b border-white/10 p-4">
                    <h3 className="text-sm font-semibold tracking-wide uppercase text-white flex items-center gap-2">
                      Verification & Closure
                    </h3>
                  </div>
                  <div className="p-6 flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-white mb-1">Check Development Status</h4>
                        <p className="text-xs text-white/50">Verify if the associated Jira ticket has been completed by the engineering team.</p>
                      </div>
                      <button
                        onClick={handleCheckJira}
                        disabled={jiraStatus === 'checking' || jiraStatus === 'completed'}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        {jiraStatus === 'checking' ? <Loader2 className="w-4 h-4 animate-spin" /> : 
                         jiraStatus === 'completed' ? <Check className="w-4 h-4" /> : null}
                        {jiraStatus === 'pending' ? 'Check Jira Status' : 
                         jiraStatus === 'checking' ? 'Checking...' : 'Jira Completed'}
                      </button>
                    </div>

                    <div className="h-px w-full bg-white/5" />

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-white mb-1">Resolve Incident</h4>
                        <p className="text-xs text-white/50">Mark this incident as completely resolved. Requires Jira completion.</p>
                      </div>
                      <button
                        onClick={() => resolveMutation.mutate()}
                        disabled={jiraStatus !== 'completed' || resolveMutation.isPending}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        {resolveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        Mark as Resolved
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
         </div>
      </div>
    </div>
  )
}
