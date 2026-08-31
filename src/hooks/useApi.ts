import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";

export const useKpis = () => useQuery({ queryKey: ["kpis"], queryFn: api.getKpis });

export const useIncidents = () => useQuery({ queryKey: ["incidents"], queryFn: api.getIncidents });

export const useIncident = (id: string) =>
  useQuery({ queryKey: ["incident", id], queryFn: () => api.getIncident(id) });

export const useSessions = () => useQuery({ queryKey: ["sessions"], queryFn: api.getSessions });

export const useEvents = (sessionId?: string) =>
  useQuery({ queryKey: ["events", sessionId ?? "all"], queryFn: () => api.getEvents({ sessionId }) });

export const useAssets = () => useQuery({ queryKey: ["assets"], queryFn: api.getAssets });

export const useReports = () => useQuery({ queryKey: ["reports"], queryFn: api.getReports });

export function useApproveReport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (reportId: string) => api.approveReport(reportId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reports"] });
      qc.invalidateQueries({ queryKey: ["incidents"] });
    },
  });
}

export function useGenerateReport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (incidentId: string) => api.generateReport(incidentId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reports"] }),
  });
}
