"use client"
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, History, PieChart, Settings, Shield, Activity, Sparkles, LogOut } from 'lucide-react'
import { useSentinelStore } from '@/lib/store'

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useSentinelStore()
  
  const navItems = [
    { name: 'Active Investigations', href: '/', icon: LayoutDashboard },
    { name: 'Inject Investigations', href: '/simulator', icon: Activity },
    { name: 'Historical Explorer', href: '/explorer', icon: History },
    { name: 'AI Insights', href: '/ai-insights', icon: Sparkles },
    { name: 'Executive Dashboard', href: '/executive', icon: PieChart },
    { name: 'Integrations', href: '/integrations', icon: Settings },
  ]

  return (
    <aside className="w-64 glass border-r border-white/5 flex flex-col h-screen shrink-0 relative z-20">
      <div className="h-16 flex items-center px-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative flex items-center justify-center rounded-lg shadow-[0_0_15px_rgba(99,102,241,0.5)]">
              <Image 
                src="/logo.jpg" 
                alt="Mind Matrix Logo" 
                width={36} 
                height={36} 
                className="rounded-lg object-cover" 
              />
            </div>
          </div>
          <h1 className="text-2xl font-black tracking-tighter">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/70">Sentinel</span>
            <span className="ml-1.5 text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 to-purple-500">AI</span>
          </h1>
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
        <div className="flex flex-col gap-2 p-3 rounded-lg bg-black/20 border border-white/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center text-sm font-medium text-indigo-300 uppercase">
              {user ? user.email.substring(0, 2) : '??'}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium text-white truncate">{user ? user.email : 'Loading...'}</span>
              <span className="text-xs text-white/40 capitalize">{user ? user.role : ''}</span>
            </div>
          </div>
          <button 
            onClick={() => {
              logout()
              router.push('/login')
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  )
}
