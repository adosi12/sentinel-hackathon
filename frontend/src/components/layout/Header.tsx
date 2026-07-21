import React from 'react'
import { Search, Bell } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function Header() {
  return (
    <header className="h-16 glass border-b border-white/5 flex items-center justify-between px-6 z-10 shrink-0 sticky top-0">
      <div className="flex items-center gap-4 text-sm font-medium text-white/50">
        <span>Global Operations Center</span>
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
        <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center text-sm font-medium text-indigo-300">
          JD
        </div>
      </div>
    </header>
  )
}
