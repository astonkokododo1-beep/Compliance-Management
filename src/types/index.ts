import { User, Policy, Declaration, Investigation, Alert } from '@prisma/client'

export type { User, Policy, Declaration, Investigation, Alert }

export type UserRole = 'ADMIN' | 'COMPLIANCE_OFFICER' | 'MANAGER' | 'EMPLOYEE' | 'AUDITOR' | 'INVESTIGATOR'

export interface SessionUser {
  id: string
  email: string
  name: string | null
  role: UserRole
}

export interface AIPolicyContext {
  type: string
  industry: string
  companyType: string
  jurisdictions: string[]
  riskLevel: string
  regulations?: string[]
}

export interface GiftAssessment {
  value: number
  source: string
  recipientRole: string
  timing: string
  frequency: number
  jurisdiction: string
}

export interface RiskResult {
  riskScore: number
  riskLevel: string
  redFlags: string[]
  recommendation: string
  requiredApprovers: string[]
}

export interface DashboardStats {
  totalCases: number
  pendingApprovals: number
  highRiskItems: number
  completionRate: number
}

export interface FileUpload {
  name: string
  type: string
  size: number
  data: string
}
