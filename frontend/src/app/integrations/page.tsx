"use client"
import React from 'react'
import Header from '@/components/layout/Header'
import { Settings, Sparkles, Plus, ArrowUpRight } from 'lucide-react'

export default function IntegrationsPage() {
  const integrations = [
    {
      id: 'servicenow',
      icon: '📋',
      name: 'ServiceNow',
      description: 'Sync client-raised ITSM tickets directly from ServiceNow portal REST API.',
      connected: true,
      buttonText: 'Ingest Ticket',
      buttonPrimary: true,
      accent: 'from-blue-500 to-cyan-400'
    },
    {
      id: 'jira',
      icon: '🔵',
      name: 'Atlassian Jira',
      description: 'Auto-create engineering tickets with RCA diagnostics and stack traces.',
      connected: true,
      buttonText: 'Create TPAI-492',
      buttonPrimary: true,
      accent: 'from-blue-600 to-indigo-500'
    },
    {
      id: 'ms-teams',
      icon: '💬',
      name: 'MS Teams',
      description: 'Broadcast critical alerts and AI root-cause summaries to incident channels.',
      connected: true,
      buttonText: 'Send Alert',
      buttonPrimary: true,
      accent: 'from-pink-500 to-rose-400'
    },
    {
      id: 'newrelic',
      icon: '📊',
      name: 'New Relic',
      description: 'Stream APM metrics, distributed traces, and alert notifications.',
      connected: true,
      buttonText: 'View Dashboard',
      buttonPrimary: true,
      accent: 'from-emerald-500 to-teal-400'
    },
    {
      id: 'outlook',
      icon: '📧',
      name: 'Microsoft Outlook',
      description: 'Ingest alert emails and auto-reply with AI-driven summaries.',
      connected: true,
      buttonText: 'View Settings',
      buttonPrimary: true,
      accent: 'from-blue-400 to-blue-600'
    },
    {
      id: 'prometheus',
      icon: '📡',
      name: 'Prometheus',
      description: 'Ingest Prometheus metrics and Alertmanager webhook notifications.',
      connected: false,
      buttonText: 'Configure',
      buttonPrimary: false,
      accent: 'from-orange-400 to-yellow-500'
    }
  ]

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#050505] relative">
      <Header />

      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

      <main className="flex-1 overflow-y-auto p-8 flex flex-col gap-10 relative z-10">
        
        <div className="flex flex-col gap-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 w-max mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-xs font-medium text-white/70">Enterprise Ready</span>
          </div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/60 tracking-tight flex items-center gap-3">
             <Settings className="w-7 h-7 text-white/80" />
             ITSM & Integrations
          </h1>
          <p className="text-base text-white/50 leading-relaxed">
             Connect your favorite tools to unlock full autonomous investigation capabilities. Sentinel syncs seamlessly with your existing incident response pipeline.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {integrations.map((integration) => (
              <div 
                key={integration.id} 
                className="group relative bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 flex flex-col gap-5 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:border-white/15 overflow-hidden"
              >
                 {/* Card Hover Glow */}
                 <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${integration.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                 
                 <div className="flex justify-between items-start">
                   <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform duration-300">
                     {integration.icon}
                   </div>
                   
                   <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full border border-white/5">
                     <div className={`w-2 h-2 rounded-full ${integration.connected ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-white/20'}`} />
                     <span className={`text-[11px] font-semibold tracking-wide uppercase ${integration.connected ? 'text-emerald-400' : 'text-white/40'}`}>
                        {integration.connected ? 'Connected' : 'Offline'}
                     </span>
                   </div>
                 </div>

                 <div className="flex flex-col gap-2">
                   <h2 className="text-lg font-bold text-white/90 group-hover:text-white transition-colors">{integration.name}</h2>
                   <p className="text-sm text-white/50 leading-relaxed min-h-[60px]">
                      {integration.description}
                   </p>
                 </div>
                 
                 <div className="mt-auto pt-4 border-t border-white/5">
                    <button 
                       className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                          integration.buttonPrimary 
                          ? 'bg-white text-black hover:bg-gray-200 shadow-[0_0_15px_rgba(255,255,255,0.1)]' 
                          : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white'
                       }`}
                    >
                       {integration.buttonText}
                       {integration.buttonPrimary ? <ArrowUpRight className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </button>
                 </div>
              </div>
           ))}
        </div>
      </main>
    </div>
  )
}
