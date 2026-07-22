import React from 'react'
import { Incident } from '@/lib/store'
import { Mail, ShieldAlert, Activity, Tag, Server } from 'lucide-react'

export default function Step1Intake({ incident }: { incident: Incident }) {
  return (
    <div className="flex flex-col gap-4">
      {/* Raw Email / Alert Mock */}
      <div className="border border-white/10 rounded-md overflow-hidden bg-[#0A0A0A]">
        <div className="bg-white/5 px-4 py-2 border-b border-white/10 flex items-center gap-2 text-xs text-white/50 font-mono uppercase tracking-wider">
          <Mail className="w-3 h-3" /> Source Email / Alert
        </div>
        <div className="p-4 text-sm font-mono text-white/70 whitespace-pre-wrap leading-relaxed">
          <span className="text-white/40">From:</span> monitoring-alerts@bank.internal<br/>
          <span className="text-white/40">To:</span> sre-team@bank.internal; payments-l2-ops<br/>
          <span className="text-white/40">Subject:</span> <span className="text-white font-semibold">[CRITICAL] {incident.id} — {incident.title}</span><br/><br/>
          
          <span className="text-red-400 bg-red-500/10 px-1 rounded">CRITICAL</span> A production incident has been raised in <span className="text-indigo-400">{incident.application}</span>.<br/><br/>
          
          Error details detected in {incident.component}:<br/>
          <span className="text-white/50">{incident.description}</span><br/><br/>
          
          Trans ID: TXN_98765<br/>
          Impact: Critical — SLA Breach risk<br/>
          <br/>
          <span className="text-emerald-400">Sentinel AI is beginning autonomous investigation. Reference: {incident.id}</span>
        </div>
      </div>

      {/* Parsed Fields */}
      <div className="border border-white/10 rounded-md overflow-hidden bg-[#0A0A0A]">
        <div className="bg-white/5 px-4 py-2 border-b border-white/10 flex items-center gap-2 text-xs text-white/50 font-mono uppercase tracking-wider">
          <Activity className="w-3 h-3" /> Parsed Incident Fields
        </div>
        <div className="p-4 grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span className="text-white/40 text-xs font-mono uppercase">INC Number</span>
            <span className="text-indigo-400 font-mono font-medium">{incident.id}</span>
          </div>
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span className="text-white/40 text-xs font-mono uppercase">Severity</span>
            <span className="text-red-400 font-medium px-2 py-0.5 bg-red-500/10 rounded text-xs">{incident.severity}</span>
          </div>
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span className="text-white/40 text-xs font-mono uppercase">Service</span>
            <span className="text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded text-xs">{incident.application}</span>
          </div>
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span className="text-white/40 text-xs font-mono uppercase">Alert Type</span>
            <span className="text-white/80">{incident.title.split(' ')[0] || 'System Failure'}</span>
          </div>
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span className="text-white/40 text-xs font-mono uppercase">Trans ID</span>
            <span className="text-white/80 font-mono">TXN_98765</span>
          </div>
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span className="text-white/40 text-xs font-mono uppercase">Reporter</span>
            <span className="text-white/60 text-xs">ServiceNow Bot</span>
          </div>
        </div>
      </div>
    </div>
  )
}
