import React, { useState } from 'react'
import { Terminal, Activity, GitCommit } from 'lucide-react'

export default function Step3Telemetry({ incident }: { incident: any }) {
  const [activeTab, setActiveTab] = useState<'logs'|'metrics'|'traces'>('logs')

  return (
    <div className="border border-white/10 rounded-md overflow-hidden bg-[#0A0A0A] flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-white/10 bg-white/5">
        <button 
          onClick={() => setActiveTab('logs')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-medium uppercase tracking-wider transition-colors ${activeTab === 'logs' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-white/5' : 'text-white/50 hover:text-white/80'}`}
        >
          <Terminal className="w-4 h-4" /> Logs
        </button>
        <button 
          onClick={() => setActiveTab('metrics')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-medium uppercase tracking-wider transition-colors ${activeTab === 'metrics' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-white/5' : 'text-white/50 hover:text-white/80'}`}
        >
          <Activity className="w-4 h-4" /> Metrics
        </button>
        <button 
          onClick={() => setActiveTab('traces')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-medium uppercase tracking-wider transition-colors ${activeTab === 'traces' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-white/5' : 'text-white/50 hover:text-white/80'}`}
        >
          <GitCommit className="w-4 h-4" /> Traces
        </button>
      </div>

      {/* Content */}
      <div className="p-4 font-mono text-xs overflow-x-auto">
        {activeTab === 'logs' && (
          <div className="flex flex-col gap-1 text-white/70">
            <div className="flex gap-4 hover:bg-white/5 p-1 rounded"><span className="text-white/30 w-8">1</span><span className="text-white/40">10:41:01</span><span className="text-blue-400 w-12">INFO</span><span>com.bank.{incident?.application || 'payments'}.GatewayFilter - Request received TXN_98765 from 10.12.4.5</span></div>
            <div className="flex gap-4 hover:bg-white/5 p-1 rounded"><span className="text-white/30 w-8">2</span><span className="text-white/40">10:41:03</span><span className="text-red-400 w-12">ERROR</span><span>com.bank.{incident?.application || 'payments'}.{incident?.component || 'TransactionSerializer'} - Anomaly detected in service execution</span></div>
            <div className="flex gap-4 hover:bg-white/5 p-1 rounded"><span className="text-white/30 w-8">3</span><span className="text-white/40">10:41:04</span><span className="text-orange-400 w-12">WARN</span><span>com.bank.{incident?.application || 'payments'}.GatewayFilter - Upstream connection reset after 5000ms timeout</span></div>
            <div className="flex gap-4 hover:bg-white/5 p-1 rounded bg-red-500/10"><span className="text-white/30 w-8">4</span><span className="text-white/40">10:41:05</span><span className="text-red-400 font-bold w-12">ERROR</span><span className="text-white/90">com.bank.{incident?.application || 'payments'}.{incident?.component || 'PaymentServlet'} - HTTP 504 Gateway Timeout returned to client TXN_98765</span></div>
            <div className="flex gap-4 hover:bg-white/5 p-1 rounded"><span className="text-white/30 w-8">5</span><span className="text-white/40">10:42:00</span><span className="text-purple-400 w-12">FATAL</span><span>com.bank.{incident?.application || 'payments'}.HealthCheck - 3 consecutive 504 responses - marking service DEGRADED</span></div>
          </div>
        )}
        {activeTab === 'metrics' && (
          <div className="grid grid-cols-4 gap-4">
             <div className="bg-white/5 border border-white/10 rounded p-3">
               <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Error Rate</div>
               <div className="text-xl text-red-400 font-bold">14.2%</div>
               <div className="text-xs text-red-400/50">↑ 14.1% vs baseline</div>
             </div>
             <div className="bg-white/5 border border-white/10 rounded p-3">
               <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">P99 Latency</div>
               <div className="text-xl text-orange-400 font-bold">5,420 ms</div>
               <div className="text-xs text-orange-400/50">↑ 5000ms vs baseline</div>
             </div>
             <div className="bg-white/5 border border-white/10 rounded p-3">
               <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Throughput</div>
               <div className="text-xl text-white/90 font-bold">1,240 req/s</div>
               <div className="text-xs text-white/40">Live traffic load</div>
             </div>
             <div className="bg-white/5 border border-white/10 rounded p-3">
               <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">CPU Usage</div>
               <div className="text-xl text-white/90 font-bold">68%</div>
               <div className="text-xs text-white/40">Healthy utilization</div>
             </div>
          </div>
        )}
        {activeTab === 'traces' && (
          <div className="flex items-center justify-center h-32 text-white/40">
            Distributed tracing spans loading...
          </div>
        )}
      </div>
    </div>
  )
}
