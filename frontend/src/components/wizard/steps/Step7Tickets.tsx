import React, { useState } from 'react'
import { Kanban, MessageSquare, Mail, X } from 'lucide-react'
import { Incident } from '@/lib/store'

export default function Step7Tickets({ incident }: { incident?: Incident }) {
  const [activeModal, setActiveModal] = useState<'jira' | 'slack' | 'email' | null>(null)

  const renderModalContent = () => {
     if (!activeModal) return null
     
     let title = ''
     let content = ''
     let icon = null
     let color = ''

     if (activeModal === 'jira') {
        title = 'Jira Ticket Details'
        content = incident?.jira_content || 'No Jira content generated yet.'
        icon = <Kanban className="w-6 h-6 text-blue-400" />
        color = 'text-blue-400'
     } else if (activeModal === 'slack') {
        title = 'MS Teams Broadcast'
        content = incident?.slack_content || 'No MS Teams content generated yet.'
        icon = <MessageSquare className="w-6 h-6 text-purple-400" />
        color = 'text-purple-400'
     } else if (activeModal === 'email') {
        title = 'Executive Email Summary'
        content = incident?.email_content || 'No Email content generated yet.'
        icon = <Mail className="w-6 h-6 text-white/70" />
        color = 'text-white/90'
     }

     return (
       <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-8">
         <div className="bg-[#0A0A0A] border border-white/10 rounded-xl w-full max-w-3xl flex flex-col max-h-[85vh] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
           <div className="flex justify-between items-center p-6 border-b border-white/5 bg-[#050505]">
              <div className="flex items-center gap-3">
                 {icon}
                 <h2 className={`text-xl font-bold ${color}`}>{title}</h2>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-md text-white/50 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
           </div>
           
           <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-[#0A0A0A]">
              <div className="font-mono text-sm text-white/80 leading-relaxed whitespace-pre-wrap">
                 {content}
              </div>
           </div>
         </div>
       </div>
     )
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Jira */}
      <button onClick={() => setActiveModal('jira')} className="w-full text-left group border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 transition-colors rounded-md p-4 flex items-center justify-between cursor-pointer">
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center text-blue-400">
               <Kanban className="w-4 h-4" />
            </div>
            <div>
               <div className="text-sm font-medium text-white/90 group-hover:text-blue-300 transition-colors">Jira Software</div>
               <div className="text-xs text-white/50">Ticket created and assigned to Payments-L2-Ops. Click to view.</div>
            </div>
         </div>
         <span className="text-xs bg-blue-500/20 text-blue-400 px-3 py-1.5 rounded font-medium border border-blue-500/30">View Ticket</span>
      </button>

      {/* MS Teams */}
      <button onClick={() => setActiveModal('slack')} className="w-full text-left group border border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10 transition-colors rounded-md p-4 flex items-center justify-between cursor-pointer">
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-purple-500/10 flex items-center justify-center text-purple-400">
               <MessageSquare className="w-4 h-4" />
            </div>
            <div>
               <div className="text-sm font-medium text-white/90 group-hover:text-purple-300 transition-colors">MS Teams — #incident-response</div>
               <div className="text-xs text-white/50">Broadcasted AI findings to team channel. Click to view.</div>
            </div>
         </div>
         <span className="text-xs bg-purple-500/20 text-purple-400 px-3 py-1.5 rounded font-medium border border-purple-500/30">View Message</span>
      </button>

      {/* Email */}
      <button onClick={() => setActiveModal('email')} className="w-full text-left group border border-white/10 bg-white/5 hover:bg-white/10 transition-colors rounded-md p-4 flex items-center justify-between cursor-pointer">
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-white/70">
               <Mail className="w-4 h-4" />
            </div>
            <div>
               <div className="text-sm font-medium text-white/90 group-hover:text-white transition-colors">Email — Stakeholders</div>
               <div className="text-xs text-white/50">Prepared executive RCA summary report. Click to view.</div>
            </div>
         </div>
         <span className="text-xs bg-white/10 text-white/70 px-3 py-1.5 rounded font-medium border border-white/20">View Email</span>
      </button>

      {renderModalContent()}
    </div>
  )
}
