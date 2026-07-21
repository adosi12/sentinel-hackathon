"use client"
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Bell, Search, Activity, ShieldAlert, Cpu, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'
import SystemMap from '@/components/dashboard/SystemMap'
import AlertSimulator from '@/components/dashboard/AlertSimulator'
import IncidentFeed from '@/components/dashboard/IncidentFeed'
import ReasoningPanel from '@/components/dashboard/ReasoningPanel'
import Header from '@/components/layout/Header'

export default function Home() {
  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-background">
      <Header />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 relative">
        {/* Hero Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="bg-gradient-to-br from-red-500/10 to-transparent border-red-500/20">
              <CardHeader className="pb-2 border-none">
                <CardTitle className="text-sm font-medium text-red-400 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" /> Open Incidents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">4</div>
                <p className="text-xs text-white/50 mt-1">+2 from last hour</p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-500/20">
              <CardHeader className="pb-2 border-none">
                <CardTitle className="text-sm font-medium text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Resolved Today
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">12</div>
                <p className="text-xs text-white/50 mt-1">98% within SLA</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="bg-gradient-to-br from-indigo-500/10 to-transparent border-indigo-500/20">
              <CardHeader className="pb-2 border-none">
                <CardTitle className="text-sm font-medium text-indigo-400 flex items-center gap-2">
                  <Activity className="w-4 h-4" /> Average MTTR
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">14m</div>
                <p className="text-xs text-indigo-400/80 mt-1">-32% vs last week (AI assisted)</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
              <CardHeader className="pb-2 border-none">
                <CardTitle className="text-sm font-medium text-purple-400 flex items-center gap-2">
                  <Cpu className="w-4 h-4" /> AI Confidence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">94%</div>
                <p className="text-xs text-white/50 mt-1">across active resolutions</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[500px]">
          <Card className="lg:col-span-2 flex flex-col">
            <CardHeader>
              <CardTitle>Live System Map</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 border-t border-white/5 bg-white/[0.02] p-0 relative">
              <SystemMap />
            </CardContent>
          </Card>
          
          <IncidentFeed />
        </div>

        {/* Second row for Logs and other components */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px]">
          <ReasoningPanel />
          <AlertSimulator />
        </div>
      </main>
    </div>
  )
}
