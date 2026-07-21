"use client"
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Search, Filter, Terminal, Cpu } from 'lucide-react'
import { motion } from 'framer-motion'

export default function LogExplorer() {
  const [query, setQuery] = useState('')
  
  const mockLogs = [
    { id: 1, time: '10:42:01.243', level: 'ERROR', service: 'Authentication', msg: 'Connection timeout to database' },
    { id: 2, time: '10:42:01.300', level: 'WARN', service: 'API Gateway', msg: 'Upstream connection error 502' },
    { id: 3, time: '10:42:02.105', level: 'INFO', service: 'Settlement', msg: 'Retrying connection to MQ broker...' },
    { id: 4, time: '10:42:05.000', level: 'ERROR', service: 'MQ', msg: 'TLS handshake failed. Certificate expired.' },
  ]

  return (
    <Card className="flex flex-col h-full bg-black/40 border-white/10">
      <CardHeader className="flex flex-row justify-between items-center pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Terminal className="w-5 h-5 text-indigo-400" /> Log Explorer
        </CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-8 text-xs border-white/10">
            <Filter className="w-3 h-3 mr-1" /> Filters
          </Button>
          <Button variant="glass" size="sm" className="h-8 text-xs bg-indigo-500/20 text-indigo-300">
            <Cpu className="w-3 h-3 mr-1" /> AI Summary
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col gap-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input 
            type="text" 
            placeholder="Search logs via semantic search or regex..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-md pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500/50 text-white placeholder:text-white/30 font-mono"
          />
        </div>
        
        <div className="flex-1 bg-[#0d0d12] rounded-md border border-white/5 overflow-hidden font-mono text-xs">
          <div className="flex bg-white/5 p-2 text-white/50 uppercase tracking-wider border-b border-white/5">
            <div className="w-24">Timestamp</div>
            <div className="w-16">Level</div>
            <div className="w-32">Service</div>
            <div className="flex-1">Message</div>
          </div>
          <div className="p-2 flex flex-col gap-1 overflow-y-auto max-h-[300px]">
            {mockLogs.map(log => (
              <motion.div 
                key={log.id} 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex py-1 hover:bg-white/5 rounded px-1 transition-colors cursor-pointer"
              >
                <div className="w-24 text-white/40">{log.time}</div>
                <div className={`w-16 ${log.level === 'ERROR' ? 'text-red-400' : log.level === 'WARN' ? 'text-yellow-400' : 'text-emerald-400'}`}>
                  {log.level}
                </div>
                <div className="w-32 text-indigo-300/80 truncate pr-2">{log.service}</div>
                <div className="flex-1 text-white/80 truncate">{log.msg}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
