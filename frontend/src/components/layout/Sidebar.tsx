"use client"
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, History, PieChart, Settings, Shield, Activity } from 'lucide-react'

export default function Sidebar() {
  const pathname = usePathname()
  
  const navItems = [
    { name: 'Live Ops', href: '/', icon: LayoutDashboard },
    { name: 'Alert Simulator', href: '/simulator', icon: Activity },
    { name: 'Historical Explorer', href: '/explorer', icon: History },
    { name: 'Executive Dashboard', href: '/executive', icon: PieChart },
  ]

  return (
    <aside className="w-64 glass border-r border-white/5 flex flex-col h-screen shrink-0 relative z-20">
      <div className="h-16 flex items-center px-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 tracking-tight">Sentinel</h1>
        </div>
      </div>
      
      <nav className="flex-1 px-4 py-6 flex flex-col gap-2">
        <div className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-2 px-2">Navigation</div>
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.name} href={item.href}>
              <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${isActive ? 'bg-indigo-500/15 text-indigo-300' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>
                <item.icon className="w-5 h-5" />
                <span className="font-medium text-sm">{item.name}</span>
              </div>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/60 hover:bg-white/5 hover:text-white cursor-pointer transition-all">
          <Settings className="w-5 h-5" />
          <span className="font-medium text-sm">Settings</span>
        </div>
      </div>
    </aside>
  )
}
