import { create } from 'zustand'

export interface Incident {
  id: string
  status: string
  created_at: string
  severity: string
  title: string
  component: string
  application: string
  est_customers_impacted?: number
  est_financial_exposure?: number
  mttr_saved?: number
  raw_payload?: string
  ai_analysis_summary?: string
  ai_root_cause?: string
  ai_recommended_actions?: string[]
  confidence_score?: number
  description?: string
  needs_human_input?: boolean
  human_prompt?: string
  jira_content?: string
  slack_content?: string
  email_content?: string
  resolved_at?: string
}

interface SentinelStore {
  selectedIncidentId: string | null
  setSelectedIncident: (id: string | null) => void
  activeTab: string
  setActiveTab: (tab: string) => void
  user: any
  token: string | null
  login: (token: string, user: any) => void
  logout: () => void
}

export const useSentinelStore = create<SentinelStore>((set) => ({
  selectedIncidentId: null,
  setSelectedIncident: (id) => set({ selectedIncidentId: id }),
  activeTab: 'unresolved',
  setActiveTab: (tab) => set({ activeTab: tab }),
  user: null,
  token: null,
  login: (token, user) => set({ token, user }),
  logout: () => set({ token: null, user: null })
}))
