import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Search, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface ManualInvestigationModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (query: string) => void
}

export default function ManualInvestigationModal({ isOpen, onClose, onSubmit }: ManualInvestigationModalProps) {
  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  if (!isOpen) return null

  const handleStart = async () => {
    if (!query.trim()) return
    setIsSearching(true)
    
    try {
      // Allow for async onSubmit (e.g. API call) or normal
      await onSubmit(query)
    } finally {
      setIsSearching(false)
      setQuery('')
      onClose()
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
        >
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              Proactive Manual Investigation
            </h2>
            <button onClick={onClose} disabled={isSearching} className="text-white/50 hover:text-white transition-colors disabled:opacity-50">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6 space-y-4">
            <p className="text-sm text-white/60">
              Paste stack traces, log snippets, or describe an anomaly below. Sentinel will cross-reference this against historical incidents, code repositories, and known dependencies to identify potential root causes.
            </p>
            
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white/40 uppercase tracking-wider">Investigation Query</label>
              <textarea 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Connection refused to 10.4.5.12 on port 5432 after recent deployment..."
                disabled={isSearching}
                className="w-full h-32 bg-[#050505] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500/50 resize-none font-mono disabled:opacity-50"
              />
            </div>
          </div>
          
          <div className="p-4 border-t border-white/10 bg-white/[0.02] flex justify-end gap-3">
            <Button variant="ghost" onClick={onClose} disabled={isSearching} className="text-white/70 hover:text-white">
              Cancel
            </Button>
            <Button 
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 flex items-center gap-2"
              onClick={handleStart}
              disabled={!query.trim() || isSearching}
            >
              {isSearching ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing Vector DB...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" /> Start Investigation
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
