import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Panel } from "@/components/kit/Panel";
import { PageHeader } from "@/components/kit/States";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { API_CONFIG } from "@/services/config";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — CHAKRAVYUH" },
      {
        name: "description",
        content: "Configure organisation profile, reporting window, alert channels and the data source used by the console.",
      },
      { property: "og:title", content: "Settings — CHAKRAVYUH" },
      { property: "og:description", content: "Organisation, reporting and data source configuration." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [org, setOrg] = useState("Sharma Logistics Pvt Ltd");
  const [contact, setContact] = useState("soc@sharmalogistics.in");
  const [windowHours, setWindowHours] = useState("6");
  const [toggles, setToggles] = useState({
    email: true,
    sms: false,
    autoDraft: true,
    autoSubmit: false,
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" subtitle="Console configuration. All values are local to this synthetic environment." />

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Organisation">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="org">Organisation name</Label>
              <Input id="org" value={org} onChange={(e) => setOrg(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact">Security contact</Label>
              <Input id="contact" value={contact} onChange={(e) => setContact(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="win">Reporting window (hours)</Label>
              <Input id="win" value={windowHours} onChange={(e) => setWindowHours(e.target.value)} inputMode="numeric" />
              <p className="text-xs text-muted-foreground">
                Countdown clocks across the console derive from this window.
              </p>
            </div>
            <Button onClick={() => toast.success("Organisation settings saved")}>SAVE CHANGES</Button>
          </div>
        </Panel>

        <div className="space-y-6">
          <Panel title="Notifications & automation">
            <div className="divide-y divide-border">
              {([
                ["email", "Email alerts", "Send an alert when a new incident is confirmed."],
                ["sms", "SMS escalation", "Escalate CRITICAL incidents by SMS to the security contact."],
                ["autoDraft", "Auto-draft reports", "Generate a report draft as soon as an incident is confirmed."],
                ["autoSubmit", "Auto-submit reports", "Disabled by design — human approval is always required."],
              ] as const).map(([key, title, desc]) => (
                <div key={key} className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-sm">{title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
                  </div>
                  <Switch
                    checked={toggles[key]}
                    disabled={key === "autoSubmit"}
                    onCheckedChange={(v) => setToggles((t) => ({ ...t, [key]: v }))}
                  />
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Data source" subtitle="Swap to a live backend without touching UI code.">
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Mode</dt>
                <dd className="font-mono text-primary">{API_CONFIG.useMock ? "MOCK" : "LIVE"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">REST base URL</dt>
                <dd className="font-mono text-xs">{API_CONFIG.baseUrl}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">WebSocket</dt>
                <dd className="font-mono text-xs">{API_CONFIG.wsUrl}</dd>
              </div>
            </dl>
            <p className="mt-4 text-xs text-muted-foreground">
              Set VITE_USE_MOCK=false and point VITE_API_BASE_URL at the FastAPI service to go live.
            </p>
          </Panel>
        </div>
      </div>
    </div>
  );
}
