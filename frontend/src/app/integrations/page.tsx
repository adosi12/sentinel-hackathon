"use client"
import React from 'react'
import Header from '@/components/layout/Header'
import { Settings } from 'lucide-react'

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
    },
    {
      id: 'jira',
      icon: '🔵',
      name: 'Atlassian Jira',
      description: 'Auto-create engineering tickets with RCA diagnostics and stack traces.',
      connected: true,
      buttonText: 'Create TPAI-492',
      buttonPrimary: true,
    },
    {
      id: 'slack',
      icon: '💬',
      name: 'Slack',
      description: 'Broadcast critical alerts and AI root-cause summaries to incident channels.',
      connected: true,
      buttonText: 'Send Alert',
      buttonPrimary: true,
    },
    {
      id: 'newrelic',
      icon: '📊',
      name: 'New Relic',
      description: 'Stream APM metrics, distributed traces, and alert notifications.',
      connected: true,
      buttonText: 'View Dashboard',
      buttonPrimary: true,
    },
    {
      id: 'pagerduty',
      icon: '🔥',
      name: 'PagerDuty',
      description: 'Auto-escalate P1 incidents to on-call engineers with full context.',
      connected: false,
      buttonText: 'Connect',
      buttonPrimary: false,
    },
    {
      id: 'prometheus',
      icon: '📡',
      name: 'Prometheus',
      description: 'Ingest Prometheus metrics and Alertmanager webhook notifications.',
      connected: false,
      buttonText: 'Configure',
      buttonPrimary: false,
    }
  ]

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-background">
      <Header />

      <main className="flex-1 overflow-y-auto p-8 flex flex-col gap-8 relative">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
             <Settings className="w-5 h-5 text-white/70" />
             ITSM & Enterprise Integrations
          </h1>
          <p className="text-sm text-white/40">
             Connect and manage ServiceNow, Jira, Slack, and monitoring systems
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {integrations.map((integration) => (
              <div 
                key={integration.id} 
                className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 flex flex-col gap-4 shadow-lg hover:border-white/10 transition-colors"
              >
                 <div className="text-2xl mb-1">{integration.icon}</div>
                 <h2 className="text-base font-bold text-white/90">{integration.name}</h2>
                 <p className="text-[13px] text-white/40 leading-relaxed flex-1">
                    {integration.description}
                 </p>
                 
                 <div className="flex flex-col gap-4 mt-2">
                    <div className="flex items-center gap-2">
                       <div className={`w-1.5 h-1.5 rounded-full ${integration.connected ? 'bg-emerald-500' : 'bg-white/20'}`} />
                       <span className={`text-xs font-medium ${integration.connected ? 'text-emerald-500' : 'text-white/30'}`}>
                          {integration.connected ? 'Connected' : 'Not configured'}
                       </span>
                    </div>
                    
                    <button 
                       className={`px-4 py-2 rounded-lg text-sm font-medium transition-all w-max ${
                          integration.buttonPrimary 
                          ? 'bg-[#0284c7] text-white hover:bg-[#0369a1]' 
                          : 'bg-transparent text-white/50 border border-white/10 hover:bg-white/5 hover:text-white'
                       }`}
                    >
                       {integration.buttonText}
                    </button>
                 </div>
              </div>
           ))}
        </div>
      </main>
    </div>
  )
}
