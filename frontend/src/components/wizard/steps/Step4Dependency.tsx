import React, { useState } from 'react'
import SystemMap from '../../dashboard/SystemMap'
import { Maximize2, X } from 'lucide-react'

export default function Step4Dependency() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <>
      <div className="border border-white/10 rounded-md overflow-hidden bg-[#0A0A0A] h-[300px] relative group">
        <div className="absolute top-0 left-0 w-full p-2 bg-gradient-to-b from-black/80 to-transparent z-10 text-xs text-white/50 flex justify-between items-start pointer-events-none">
          <span>Animated microservice topology — click nodes for detail</span>
        </div>
        <button 
          onClick={() => setIsExpanded(true)}
          className="absolute top-2 right-2 z-20 p-2 bg-black/50 hover:bg-indigo-500/50 rounded-md text-white/70 hover:text-white transition-all opacity-0 group-hover:opacity-100"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
        <div className="absolute inset-0 scale-75 origin-center pointer-events-auto">
          <SystemMap />
        </div>
      </div>

      {isExpanded && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col backdrop-blur-sm p-8">
           <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                 Live Dependency Map
              </h2>
              <button 
                onClick={() => setIsExpanded(false)}
                className="p-2 bg-white/10 hover:bg-red-500/50 rounded-md text-white/70 hover:text-white transition-all"
              >
                <X className="w-6 h-6" />
              </button>
           </div>
           <div className="flex-1 bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
              <SystemMap />
           </div>
        </div>
      )}
    </>
  )
}
