"use client"
import React from 'react'
import { Search, Bell } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useSentinelStore } from '@/lib/store'
import axios from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2, Plus } from 'lucide-react'

const triggerAlert = async (rawAlert: string) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api/v1'
  const response = await axios.post(`${apiUrl}/incidents/alert`, { raw_alert: rawAlert })
  return response.data
}

export default function Header() {
  const { user, setSelectedIncident } = useSentinelStore()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: triggerAlert,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] })
      if (data && data.id) {
        setSelectedIncident(data.id)
      }
    }
  })

  return (
    <header className="h-16 glass border-b border-white/5 flex items-center justify-between px-6 z-10 shrink-0 sticky top-0">
      <div className="flex items-center gap-4 text-sm font-medium text-white/50">
        <span>Global Operations Center</span>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 hover:text-indigo-200"
          onClick={() => mutation.mutate("Ad-hoc alert triggered from Global Operations Center")}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
          ) : (
            <Plus className="w-3.5 h-3.5 mr-2" />
          )}
          New Alert
        </Button>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input 
            type="text" 
            placeholder="Search resources, logs, and incidents..." 
            className="bg-white/5 border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white placeholder:text-white/30"
          />
        </div>
        <Button variant="ghost" size="icon" className="relative text-white/70 hover:text-white hover:bg-white/10">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
        </Button>
        <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center text-sm font-medium text-indigo-300 uppercase">
          {user ? user.email.substring(0, 2) : '??'}
        </div>
      </div>
    </header>
  )
}
