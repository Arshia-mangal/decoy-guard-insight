import {
  liveStreamSeed,
  mockAssets,
  mockEvents,
  mockIncidents,
  mockKpis,
  mockReports,
  mockSessions,
} from "@/mock/data";
import type {
  AttackSession,
  DecoyAsset,
  DecoyEvent,
  Incident,
  IncidentReport,
  KpiSnapshot,
} from "@/types";
import { delay, httpGet, httpPost, isMock } from "./config";

/** Mutable in-memory store so approvals/edits persist for the session. */
const store = {
  incidents: [...mockIncidents],
  reports: [...mockReports],
};

export const api = {
  async getKpis(): Promise<KpiSnapshot> {
    if (!isMock()) return httpGet<KpiSnapshot>("/kpis");
    return delay(mockKpis);
  },

  async getIncidents(): Promise<Incident[]> {
    if (!isMock()) return httpGet<Incident[]>("/incidents");
    return delay(store.incidents);
  },

  async getIncident(id: string): Promise<Incident | null> {
    if (!isMock()) return httpGet<Incident>(`/incidents/${id}`);
    return delay(store.incidents.find((i) => i.id === id) ?? null);
  },

  async getSessions(): Promise<AttackSession[]> {
    if (!isMock()) return httpGet<AttackSession[]>("/sessions");
    return delay(mockSessions);
  },

  async getEvents(params?: { sessionId?: string }): Promise<DecoyEvent[]> {
    if (!isMock()) return httpGet<DecoyEvent[]>(`/events${params?.sessionId ? `?session=${params.sessionId}` : ""}`);
    const rows = params?.sessionId
      ? mockEvents.filter((e) => e.sessionId === params.sessionId)
      : mockEvents;
    return delay(rows);
  },

  async getAssets(): Promise<DecoyAsset[]> {
    if (!isMock()) return httpGet<DecoyAsset[]>("/decoy-assets");
    return delay(mockAssets);
  },

  async getReports(): Promise<IncidentReport[]> {
    if (!isMock()) return httpGet<IncidentReport[]>("/reports");
    return delay(store.reports);
  },

  async approveReport(reportId: string): Promise<IncidentReport> {
    if (!isMock()) return httpPost<IncidentReport>(`/reports/${reportId}/approve`, {});
    store.reports = store.reports.map((r) =>
      r.id === reportId
        ? {
            ...r,
            status: "APPROVED",
            approvedBy: "A. Mehra — Security Lead",
            checklist: r.checklist.map((c) => ({ ...c, done: true })),
          }
        : r,
    );
    const updated = store.reports.find((r) => r.id === reportId)!;
    store.incidents = store.incidents.map((i) =>
      i.id === updated.incidentId ? { ...i, status: "APPROVED", reportStatus: "APPROVED" } : i,
    );
    return delay(updated, 600);
  },

  async generateReport(incidentId: string): Promise<IncidentReport> {
    if (!isMock()) return httpPost<IncidentReport>(`/incidents/${incidentId}/report`, {});
    const existing = store.reports.find((r) => r.incidentId === incidentId);
    if (existing) return delay(existing, 800);
    const incident = store.incidents.find((i) => i.id === incidentId)!;
    const created: IncidentReport = {
      id: `RPT-${incidentId.split("-")[1]}`,
      incidentId,
      org: incident.org,
      generatedAt: new Date().toISOString(),
      status: "AWAITING APPROVAL",
      checklist: [
        { label: "Evidence Verified", done: true },
        { label: "Attack Chain Reconstructed", done: true },
        { label: "MITRE Mapping Complete", done: true },
        { label: "AI Draft Generated", done: true },
        { label: "Human Approval Required", done: false },
      ],
      sections: [
        {
          title: "Incident Information",
          body: `Incident ${incident.id} was raised for ${incident.org} and correlated to deception session ${incident.sessionId}. Severity ${incident.severity}.`,
          evidenceRefs: incident.evidenceIds.slice(0, 2),
        },
        { title: "Executive Summary", body: incident.summary, evidenceRefs: incident.evidenceIds },
      ],
    };
    store.reports = [created, ...store.reports];
    return delay(created, 900);
  },
};

/**
 * Live event stream abstraction. Swap the mock interval for a WebSocket
 * connection to `apiConfig.wsUrl` when the backend is available.
 */
export function subscribeToEvents(onEvent: (event: DecoyEvent) => void): () => void {
  let index = 0;
  const timer = setInterval(() => {
    const seed = liveStreamSeed[index % liveStreamSeed.length]!;
    onEvent({ ...seed, id: `${seed.id}-${Date.now().toString().slice(-4)}` });
    index += 1;
  }, 4000);
  return () => clearInterval(timer);
}
