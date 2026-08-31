export type Severity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type IncidentStatus =
  | "ACTIVE"
  | "INVESTIGATING"
  | "REPORT READY"
  | "APPROVED"
  | "CLOSED";

export type ReportStatus = "NOT STARTED" | "DRAFTING" | "AI DRAFT" | "AWAITING APPROVAL" | "APPROVED";

export type AttackStageName =
  | "Initial Access"
  | "Admin Discovery"
  | "Credential Access"
  | "Database Enumeration"
  | "Sensitive File Access";

export interface AttackStage {
  id: string;
  name: AttackStageName;
  timestamp: string;
  status: "VERIFIED" | "IN PROGRESS" | "PENDING";
  eventCount: number;
  eventIds: string[];
  description: string;
}

export interface DecoyEvent {
  id: string;
  timestamp: string;
  sessionId: string;
  assetId: string;
  assetName: string;
  action: string;
  details: string;
  severity: Severity;
  stage: AttackStageName;
  metadata: Record<string, string>;
}

export interface AttackSession {
  id: string;
  startedAt: string;
  lastSeenAt: string;
  org: string;
  sourceRegion: string;
  eventCount: number;
  assetsTouched: number;
  risk: Severity;
  status: "LIVE" | "CLOSED";
  incidentId?: string;
}

export interface MitreMapping {
  techniqueId: string;
  name: string;
  tactic: string;
  evidenceIds: string[];
}

export interface Incident {
  id: string;
  sessionId: string;
  org: string;
  detectedAt: string;
  deadlineAt: string;
  severity: Severity;
  status: IncidentStatus;
  reportStatus: ReportStatus;
  stage: AttackStageName;
  summary: string;
  chain: AttackStage[];
  evidenceIds: string[];
  mitre: MitreMapping[];
  impact: string[];
  recommendations: string[];
}

export interface DecoyAsset {
  id: string;
  name: string;
  kind: string;
  status: "ONLINE" | "DEGRADED" | "OFFLINE";
  interactions: number;
  lastInteraction: string;
  sessions: string[];
  deployedIn: string;
}

export interface ReportSection {
  title: string;
  body: string;
  evidenceRefs: string[];
}

export interface IncidentReport {
  id: string;
  incidentId: string;
  org: string;
  generatedAt: string;
  status: ReportStatus;
  approvedBy?: string;
  checklist: { label: string; done: boolean }[];
  sections: ReportSection[];
}

export interface KpiSnapshot {
  activeIncidents: number;
  highRiskIncidents: number;
  eventsCaptured: number;
  reportsGenerated: number;
  activityTrend: { time: string; events: number; verified: number }[];
}
