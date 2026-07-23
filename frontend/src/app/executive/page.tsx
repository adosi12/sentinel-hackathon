"use client"
import React, { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import Header from '@/components/layout/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { DollarSign, Clock, ShieldCheck, Activity } from 'lucide-react'
import { motion } from 'framer-motion'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area
} from 'recharts'
import { Incident } from '@/lib/store'

const fetchIncidents = async (): Promise<Incident[]> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api/v1'
  const response = await axios.get(`${apiUrl}/incidents`)
  return response.data
}

export default function ExecutiveDashboard() {
  const { data: incidents, isLoading } = useQuery({
    queryKey: ['incidents'],
    queryFn: fetchIncidents,
  })

  const stats = useMemo(() => {
    if (!incidents) return null

    const totalExposure = incidents.reduce((sum, inc) => sum + (inc.est_financial_exposure || 0), 0)
    const mttrSaved = incidents.reduce((sum, inc) => sum + (inc.mttr_saved || 0), 0)
    const avgConfidence = incidents.reduce((sum, inc) => sum + (inc.confidence_score || 0), 0) / incidents.length

    // Group by application for chart
    const appStats = incidents.reduce((acc: any, inc) => {
      if (!acc[inc.application]) {
        acc[inc.application] = { name: inc.application, incidents: 0, exposure: 0 }
      }
      acc[inc.application].incidents += 1
      acc[inc.application].exposure += (inc.est_financial_exposure || 0)
      return acc
    }, {})

    return {
      totalExposure,
      mttrSaved,
      avgConfidence,
      totalIncidents: incidents.length,
      appStats: Object.values(appStats).sort((a: any, b: any) => b.exposure - a.exposure).slice(0, 5)
    }
  }, [incidents])

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-background">
      <Header />

      <main className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 relative">
        <div className="mb-2">
          <h2 className="text-2xl font-bold text-white">Business Impact Dashboard</h2>
          <p className="text-white/50 text-sm mt-1">High-level overview of AI-mitigated incidents and financial metrics.</p>
        </div>

        {isLoading || !stats ? (
          <div className="flex items-center justify-center h-64 text-white/50">Loading metrics...</div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className="bg-gradient-to-br from-indigo-500/10 to-transparent border-indigo-500/20">
                  <CardHeader className="pb-2 border-none">
                    <CardTitle className="text-sm font-medium text-indigo-400 flex items-center gap-2">
                      <DollarSign className="w-4 h-4" /> Financial Exposure Mitigated
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white">${(stats.totalExposure / 1000000).toFixed(2)}M</div>
                    <p className="text-xs text-indigo-400/80 mt-1">Extrapolated from {stats.totalIncidents} simulated incidents</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card className="bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-500/20">
                  <CardHeader className="pb-2 border-none">
                    <CardTitle className="text-sm font-medium text-emerald-400 flex items-center gap-2">
                      <Clock className="w-4 h-4" /> Total MTTR Saved
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white">{stats.mttrSaved.toFixed(1)} hrs</div>
                    <p className="text-xs text-emerald-400/80 mt-1">Across all {stats.totalIncidents} test incidents</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
                  <CardHeader className="pb-2 border-none">
                    <CardTitle className="text-sm font-medium text-purple-400 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" /> Avg AI Confidence
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white">{(stats.avgConfidence * 100).toFixed(1)}%</div>
                    <p className="text-xs text-purple-400/80 mt-1">Accuracy in resolution suggestions</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
                  <CardHeader className="pb-2 border-none">
                    <CardTitle className="text-sm font-medium text-blue-400 flex items-center gap-2">
                      <Activity className="w-4 h-4" /> Total AI Resolutions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white">{stats.totalIncidents}</div>
                    <p className="text-xs text-blue-400/80 mt-1">Simulated incidents processed</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2 flex-1 min-h-[400px]">
              <Card className="flex flex-col bg-black/40 border-white/10">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-white/80">Financial Exposure by Application</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.appStats} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                      <XAxis type="number" stroke="#ffffff50" tickFormatter={(val) => `$${val/1000}k`} />
                      <YAxis dataKey="name" type="category" stroke="#ffffff50" width={100} tick={{fill: '#ffffff90', fontSize: 12}} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e1e2d', border: '1px solid #ffffff1a', borderRadius: '8px' }}
                        formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Exposure']}
                      />
                      <Bar dataKey="exposure" fill="#6366f1" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="flex flex-col bg-black/40 border-white/10">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-white/80">Incident Volume by Application</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.appStats} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                      <XAxis type="number" stroke="#ffffff50" />
                      <YAxis dataKey="name" type="category" stroke="#ffffff50" width={100} tick={{fill: '#ffffff90', fontSize: 12}} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e1e2d', border: '1px solid #ffffff20', borderRadius: '8px' }}
                        formatter={(val: any) => [val, 'Incidents']}
                      />
                      <Bar dataKey="incidents" fill="#10b981" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
