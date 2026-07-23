import React from 'react'
import { FileCode2, Check } from 'lucide-react'

export default function Step6Code({ incident }: { incident?: any }) {
  const appName = incident?.application || 'payment-gateway'
  
  return (
    <div className="border border-white/10 rounded-md overflow-hidden bg-[#0A0A0A] flex flex-col text-sm">
      <div className="bg-white/5 border-b border-white/10 px-4 py-2 flex items-center justify-between text-xs text-white/50 uppercase tracking-wider">
        <div className="flex items-center gap-2">
           <FileCode2 className="w-4 h-4 text-emerald-400" /> pom.xml — bank/{appName}-service
        </div>
        <div className="flex items-center gap-2 font-mono">
           <span className="text-emerald-400">+2</span> <span className="text-red-400">-2</span>
        </div>
      </div>
      <div className="p-4 font-mono text-xs overflow-x-auto bg-[#050505]">
        <div className="flex text-white/30 hover:bg-white/5"><span className="w-8 text-right pr-3 select-none">42</span><span>{'    <properties>'}</span></div>
        <div className="flex text-white/30 hover:bg-white/5"><span className="w-8 text-right pr-3 select-none">43</span><span>{'      <java.version>17</java.version>'}</span></div>
        <div className="flex text-red-400 bg-red-500/10 hover:bg-red-500/20"><span className="w-8 text-right pr-3 text-red-400/50 select-none">44</span><span>-     {'<jackson.version>2.10.5</jackson.version>'}</span></div>
        <div className="flex text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20"><span className="w-8 text-right pr-3 text-emerald-400/50 select-none">45</span><span>+     {'<jackson.version>2.15.2</jackson.version>'}</span></div>
        <div className="flex text-white/30 hover:bg-white/5"><span className="w-8 text-right pr-3 select-none">46</span><span>{'    </properties>'}</span></div>
      </div>
      <div className="p-3 bg-white/5 border-t border-white/10 flex justify-end gap-3">
         <button className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded transition-colors">Review in Repo</button>
         <button className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded transition-colors flex items-center gap-1"><Check className="w-3 h-3"/> Apply Patch</button>
      </div>
    </div>
  )
}
