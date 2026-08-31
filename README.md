# Chakravyuh Insights

Build a premium, production-quality cybersecurity web application frontend called **CHAKRAVYUH**.

## PRODUCT

Chakravyuh is an automated deception-based cybersecurity incident detection and reporting platform designed for MSMEs.

Its core flow is:

Synthetic Decoy Assets → Interaction Events → Attack Sequence Correlation → Verified Evidence → Attack Chain → Incident → CERT-In-Ready Report → Human Approval

The frontend should currently use MOCK/SYNTHETIC DATA only. Do NOT implement real cybersecurity functionality, real credential collection, packet capture, malware detection, attacker attribution, or real network monitoring.

The frontend must be structured so that a FastAPI backend can be connected later through REST APIs and WebSockets.

## DESIGN DIRECTION

Create a sophisticated dark cybersecurity/SOC interface.

Design characteristics:

* Premium

* Modern

* Minimal

* Professional

* High-tech but not cliché

* Dark charcoal/near-black background

* Subtle glassmorphism

* Thin borders

* Excellent spacing

* Strong typography

* Subtle animations

* Clean data visualization

* Avoid excessive neon, hacker-terminal aesthetics, Matrix effects, skulls, circuit-board clichés, and excessive glowing elements.

Use a restrained professional color system:

* Neutral dark background

* White/light-gray typography

* Red for active/high-risk incidents

* Amber for warnings

* Green for verified/safe states

* Blue/purple only as subtle accent colors

Use Lucide icons.

## TECH STACK

Use:

* React

* Vite

* Tailwind CSS

* TypeScript if supported

* Lucide React

* Recharts where appropriate

* Component-based architecture

* Responsive design

Create reusable components instead of duplicating UI.

## APPLICATION STRUCTURE

Create the following pages:

1. Overview Dashboard

2. Incidents

3. Incident Details

4. Attack Sessions

5. Decoy Assets

6. Evidence

7. Reports

8. Attack Replay

9. Settings

Use a persistent left sidebar navigation.

Sidebar:

CHAKRAVYUH

Deception Intelligence

Overview

Incidents

Attack Sessions

Decoy Assets

Evidence

Reports

Attack Replay

Settings

At the bottom show:

● SYSTEM LIVE

## OVERVIEW DASHBOARD

Create a professional SOC-style overview.

Header:

CHAKRAVYUH

Deception & Incident Intelligence

Top-right:

● SYSTEM LIVE

KPI cards:

* Active Incidents

* High Risk Incidents

* Events Captured

* Reports Generated

Main section:

ACTIVE INCIDENT

Example mock incident:

Incident ID: INC-1042

Session: S-1042

Risk: HIGH

Display a vertical attack chain:

Initial Access

↓

Admin Discovery

↓

Credential Access

↓

Database Enumeration

↓

Sensitive File Access

Each step should have an icon, timestamp, status, and event count.

Create a prominent button:

"WHY WAS THIS DETECTED?"

When clicked, open a detailed evidence explanation panel showing:

E1042 — Login attempt

E1043 — Admin endpoint discovered

E1047 — credentials.txt accessed

E1051 — Database queried

E1054 — payroll_2026.xlsx opened

Make it visually clear that the detection is based on a sequence of verified events.

Also show:

* Live event stream

* Recent incidents

* Event activity chart

* Reporting deadline countdown

## INCIDENTS PAGE

Create a searchable/filterable incident table.

Columns:

Incident ID

Session

Detected

Severity

Attack Stage

Status

Report Status

Actions

Use statuses:

ACTIVE

INVESTIGATING

REPORT READY

APPROVED

CLOSED

Clicking an incident opens Incident Details.

## INCIDENT DETAILS

Create a detailed incident investigation page.

Header:

INCIDENT INC-1042

HIGH RISK

ACTIVE

Show:

Detection timestamp

Session ID

Severity

Reporting deadline

Create a large six-hour reporting countdown.

Attack Chain section:

Initial Access

Admin Discovery

Credential Access

Database Enumeration

Sensitive File Access

Evidence section:

List event IDs and timestamps.

MITRE ATT&CK section:

Show mock mappings such as:

T1078 — Valid Accounts

T1552.001 — Credentials In Files

Create buttons:

"VIEW EVIDENCE"

"GENERATE REPORT"

## EVIDENCE PAGE

Create a forensic-style event log.

Columns:

Event ID

Timestamp

Session

Asset

Action

Details

Example events:

E1042 | 20:27:12 | S-1042 | Fake Login | Login Attempt

E1043 | 20:27:48 | S-1042 | Admin Panel | Endpoint Discovery

E1047 | 20:28:21 | S-1042 | File Share | File Access

E1051 | 20:29:03 | S-1042 | Database | Query

E1054 | 20:30:11 | S-1042 | File Share | File Open

Clicking an event should open a detail drawer/modal.

## DECOY ASSETS

Create cards for:

* Fake Login

* Fake Admin Panel

* Fake Database

* Fake File Share

* Fake Customer API

Each card should show:

Asset status

Interactions

Last interaction

Associated sessions

Use synthetic values.

## REPORTS PAGE

Create a report management interface.

Show report:

INC-1042

Status:

Evidence Verified

Attack Chain Reconstructed

MITRE Mapping Complete

AI Draft Generated

Human Approval Required

Create a realistic report preview with sections:

Incident Information

Executive Summary

Detection Timeline

Attack Chain

Evidence

MITRE ATT&CK Mapping

Impact Assessment

Recommended Actions

Every factual statement displayed in the report should visually show evidence references such as:

[E1042]

[E1047]

[E1054]

Add:

EDIT REPORT

APPROVE REPORT

EXPORT PDF

Clearly label it:

"CERT-In-READY INCIDENT REPORT"

Do NOT call it CERT-In compliant or certified.

## ATTACK REPLAY

Create an interactive attack replay.

Session:

S-1042

Display a horizontal timeline from initial login to sensitive file access.

Events should appear sequentially when the user presses:

▶ PLAY REPLAY

Controls:

Play

Pause

Restart

Speed: 1x / 2x

Show the corresponding event details as the replay progresses.

## MOCK DATA

Create realistic but completely synthetic mock data for:

* incidents

* sessions

* events

* decoy assets

* reports

* MITRE mappings

Use company examples such as:

Sharma Logistics

Apex Retail

Nova Finance

Do not use real personal information.

## INTERACTIONS

The frontend should feel like a real application.

Implement:

* Sidebar navigation

* Search

* Filtering

* Sorting

* Modal/drawer details

* Incident selection

* Countdown timer

* Attack chain interaction

* Report preview

* Report approval state

* Replay animation

* Toast notifications

* Loading states

* Empty states

* Responsive layout

## IMPORTANT ARCHITECTURE REQUIREMENT

Keep API/data access isolated in a service layer.

Create a structure such as:

src/

components/

pages/

services/

hooks/

types/

mock/

Create an API service abstraction so the mock data can later be replaced with:

FastAPI REST APIs

WebSocket live event stream

Do not hard-code data directly inside visual components.

## FINAL EXPERIENCE

The application should feel like a real commercial cybersecurity product rather than a student dashboard.

The most visually important story should be:

ATTACK DETECTED

↓

ATTACK CHAIN RECONSTRUCTED

↓

EVIDENCE VERIFIED

↓

6-HOUR REPORTING CLOCK

↓

REPORT GENERATED

↓

HUMAN APPROVAL

Make this story immediately understandable within 10 seconds of opening the dashboard.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://decoy-guard-insight.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d36e9f9b-ac35-49d8-8f21-b3fc35b6631f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
