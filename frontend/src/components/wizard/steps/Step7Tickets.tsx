import React from 'react'
import { Kanban, MessageSquare, Mail } from 'lucide-react'

export default function Step7Tickets() {
  return (
    <div className="flex flex-col gap-3">
      {/* Jira */}
      <div className="border border-blue-500/20 bg-blue-500/5 rounded-md p-4 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center text-blue-400">
               <Kanban className="w-4 h-4" />
            </div>
            <div>
               <div className="text-sm font-medium text-white/90">Jira Software</div>
               <div className="text-xs text-white/50">Ticket <span className="text-blue-400 font-mono">TPAI-492</span> created and assigned to Payments-L2-Ops.</div>
            </div>
         </div>
         <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded border border-blue-500/30">Created</span>
      </div>

      {/* Slack */}
      <div className="border border-purple-500/20 bg-purple-500/5 rounded-md p-4 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-purple-500/10 flex items-center justify-center text-purple-400">
               <MessageSquare className="w-4 h-4" />
            </div>
            <div>
               <div className="text-sm font-medium text-white/90">Slack — #incident-response</div>
               <div className="text-xs text-white/50">Broadcasted AI findings to team channel.</div>
            </div>
         </div>
         <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded border border-purple-500/30">Sent</span>
      </div>

      {/* Email */}
      <div className="border border-white/10 bg-white/5 rounded-md p-4 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-white/70">
               <Mail className="w-4 h-4" />
            </div>
            <div>
               <div className="text-sm font-medium text-white/90">Email — PAYMENTS-L2-OPS</div>
               <div className="text-xs text-white/50">Sent executive RCA summary report.</div>
            </div>
         </div>
         <span className="text-xs bg-white/10 text-white/70 px-2 py-1 rounded border border-white/20">Sent</span>
      </div>
    </div>
  )
}
