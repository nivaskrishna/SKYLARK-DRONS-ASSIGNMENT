# Executive Decision Log: Monday.com Business Intelligence Agent

**Company**: Skylark Drones  
**Author**: Senior AI Solutions Architect & Full Stack Engineer  
**Date**: July 21, 2026  
**Document Limit**: Max 2 Pages  

---

## 1. Key Assumptions Made

1. **Read-Only API Access & Security**:
   - Assumed read-only operations for board security. The agent queries Monday.com API v2 solely using `query` operations without altering raw board items or mutating records directly.

2. **Dynamic Board Discovery**:
   - Assumed that Monday.com accounts may have differing generated board IDs across environments or user accounts. Rather than hardcoding static board IDs, the application dynamically queries `{ boards { id name columns ... } }` on startup to automatically discover Deals (`Deal funnel Data`) and Work Orders (`Work_Order_Tracker Data`) boards.

3. **Column Schema Flexibility**:
   - Column IDs (e.g. `dropdown_mm5frtj1` vs `text_mm5fap5q`) change when CSVs are imported into Monday.com. To guarantee 100% resilience, column values are mapped dynamically using normalized column titles (e.g., matching keywords like `"client code"`, `"deal value"`, `"delivery date"`, `"sector"`, `"owner"`).

4. **Real-World Messy Data**:
   - Assumed real-world business data contains unassigned owners (`UNASSIGNED`), missing completion dates, currency strings with commas/symbols, and unlinked serial numbers. The system gracefully handles missing values and produces an explicit **Data Quality Audit Report** with confidence scores.

---

## 2. Technical Architecture & Trade-Offs Chosen

### Trade-Off 1: Dynamic GraphQL Fetching with TTL Cache vs Database Replication
- **Choice**: Implemented direct Monday API v2 fetching with a 60-second in-memory TTL cache and fallback stale-data serving.
- **Rationale**: Keeps data live and directly connected to Monday.com without requiring external database sync infrastructure or ETL pipelines. A 60-second TTL prevents API rate limits while ensuring executives always view up-to-date board states.

### Trade-Off 2: Dual LLM Analyst + Rule-Based Executive Engine
- **Choice**: Built a hybrid AI engine: Google Gemini 1.5 API for deep natural language executive reasoning, coupled with a deterministic Rule-Based Business Analyst Engine.
- **Rationale**: Ensures zero downtime and strict non-hallucination. If the LLM rate-limits or fails, the rule-based engine generates formatted executive briefs, KPIs, trends, risks, and recommendations backed directly by calculated metrics.

### Trade-Off 3: Title-Based Column Mapping vs Hardcoded Field Maps
- **Choice**: Dynamic keyword-based column resolution.
- **Rationale**: Eliminates fragile dependencies on Monday.com column ID strings, allowing board schemas to evolve without breaking the agent.

---

## 3. Interpretation of "Leadership Updates"

The optional requirement **"The agent should help prepare data for leadership updates"** was interpreted as an **Executive Brief Generator**:
- **Target Audience**: Founders, C-Suite Executives, and Board Members during weekly/quarterly syncs.
- **Key Sections**:
  1. *Executive Summary*: High-level performance synthesis.
  2. *Financial & Revenue Metrics*: Total Billed, Cash Collected, Receivables, Unbilled Work Orders.
  3. *Pipeline Funnel*: Total Value, Expected Probability-Adjusted Value, Sector breakdowns.
  4. *Operational Health*: Active vs Delayed Work Orders count.
  5. *Risks & Bottlenecks*: Specific delivery delays and collection bottlenecks.
  6. *Strategic Recommendations & Next Actions*: Clear, actionable steps for leadership.
- **UX Features**: One-click "Copy Markdown Brief" and "Regenerate" actions for instant integration into Slack, email, or slide decks.

---

## 4. What We Would Do Differently With More Time

1. **Predictive Revenue & Delivery Forecasting**:
   - Integrate time-series ML models (e.g., ARIMA or Prophet) to forecast quarterly revenue based on historical deal stage conversion velocities and work order delivery rates.

2. **Automated Monday.com Webhooks & Slack Alerts**:
   - Configure real-time Monday.com webhooks to trigger instant Slack notifications whenever a high-value deal enters final negotiation or a work order breaches its delivery deadline.

3. **Role-Based Access Control (RBAC)**:
   - Implement OAuth2 authentication restricting sensitive monetary figures (e.g., unmasked revenue, receivables) based on executive clearance levels.

4. **Multi-Board Aggregation (3+ Boards)**:
   - Expand cross-board join algorithms to incorporate additional operational boards such as Procurement, HR/Capacity Planning, and Customer Support Tickets.
