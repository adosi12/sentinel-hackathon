import React, { useState } from 'react'
import { FileCode2, Check, Loader2 } from 'lucide-react'

export default function Step6Code() {
  const [isPatching, setIsPatching] = useState(false)
  const [patchSuccess, setPatchSuccess] = useState(false)
  const [prUrl, setPrUrl] = useState("")

  const handleApplyPatch = async () => {
    setIsPatching(true)
    try {
      // Point this to your FastAPI backend port (e.g. 8000)
      const res = await fetch('http://localhost:8000/api/repo/apply-patch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: 'ledger_service' })
      })
      
      if (res.ok) {
        const data = await res.json()
        setPatchSuccess(true)
        if (data.pr_url) setPrUrl(data.pr_url)
      } else {
        console.error("Patch failed", await res.text())
      }
    } catch (err) {
      console.error("Error applying patch:", err)
    } finally {
      setIsPatching(false)
    }
  }

  return (
    <div className="border border-white/10 rounded-md overflow-hidden bg-[#0A0A0A] flex flex-col text-sm">
      <div className="bg-white/5 border-b border-white/10 px-4 py-2 flex items-center justify-between text-xs text-white/50 uppercase tracking-wider">
        <div className="flex items-center gap-2">
           <FileCode2 className="w-4 h-4 text-emerald-400" /> ledger.py — core-banking-gateway
        </div>
        <div className="flex items-center gap-2 font-mono">
           <span className="text-emerald-400">+4</span> <span className="text-red-400">-0</span>
        </div>
      </div>
      <div className="p-4 font-mono text-xs overflow-x-auto bg-[#050505]">
        <div className="flex text-white/30 hover:bg-white/5"><span className="w-8 text-right pr-3 select-none">32</span><span>{'    except TimeoutError as e:'}</span></div>
        <div className="flex text-white/30 hover:bg-white/5"><span className="w-8 text-right pr-3 select-none">33</span><span>{'        logger.error(f"[{trace_id}] ...")'}</span></div>
        <div className="flex text-white/30 hover:bg-white/5"><span className="w-8 text-right pr-3 select-none">34</span><span>{'        raise HTTPException(...)'}</span></div>
        <div className="flex text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20"><span className="w-8 text-right pr-3 text-emerald-400/50 select-none">35</span><span>+{'    finally:'}</span></div>
        <div className="flex text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20"><span className="w-8 text-right pr-3 text-emerald-400/50 select-none">36</span><span>+{'        if \'db_cursor\' in locals():'}</span></div>
        <div className="flex text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20"><span className="w-8 text-right pr-3 text-emerald-400/50 select-none">37</span><span>+{'            db_cursor.close()'}</span></div>
        <div className="flex text-white/30 hover:bg-white/5"><span className="w-8 text-right pr-3 select-none">38</span><span>{'    return {"account_id": account_id}'}</span></div>
      </div>
      <div className="p-3 bg-white/5 border-t border-white/10 flex justify-end gap-3 items-center">
         <button className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded transition-colors">Review in Repo</button>
         {prUrl && (
           <a href={prUrl} target="_blank" rel="noreferrer" className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded transition-colors flex items-center h-[28px]">View PR</a>
         )}
         <button 
           onClick={handleApplyPatch}
           disabled={isPatching || patchSuccess}
           className={`text-xs px-3 py-1.5 rounded transition-colors flex items-center gap-1 h-[28px] ${
             patchSuccess 
              ? 'bg-emerald-800 text-emerald-200 cursor-not-allowed' 
              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
           }`}
         >
           {isPatching ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3"/>} 
           {patchSuccess ? 'PR Raised!' : 'Raise PR'}
         </button>
      </div>
    </div>
  )
}
