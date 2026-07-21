import json
import logging
from typing import Dict, Any, List, Optional
import google.generativeai as genai
from backend.config import GEMINI_API_KEY

logger = logging.getLogger("llm_agent")

CATEGORIES = [
    "Revenue", "Pipeline", "Work Orders", "Risk", "Operations",
    "Delivery", "Sector Analysis", "Leadership Summary",
    "Cross Board Analytics", "Forecasting", "Data Quality"
]

def classify_intent(query: str) -> str:
    q = query.lower()
    if "duplicate" in q or "data quality" in q or "clean" in q or "audit" in q or "inconsist" in q or "missing" in q:
        return "Data Quality"
    if "client" in q or "customer" in q or "account" in q:
        if "duplicate" in q or "quality" in q or "clean" in q or "audit" in q or "inconsist" in q or "missing" in q:
            return "Data Quality"
        if "top" in q or "revenue" in q or "biggest" in q or "list" in q:
            return "Cross Board Analytics"
        return "Data Quality"
    if "leadership" in q or "executive summary" in q or "update" in q:
        return "Leadership Summary"
    if "pipeline" in q or "funnel" in q or "deals" in q:
        return "Pipeline"
    if "revenue" in q or "amount" in q or "billing" in q or "collected" in q:
        return "Revenue"
    if "work order" in q or "project" in q or "delivery" in q or "delayed" in q:
        return "Work Orders"
    if "sector" in q or "industry" in q:
        return "Sector Analysis"
    if "owner" in q or "workload" in q or "bd" in q or "kam" in q:
        return "Operations"
    if "risk" in q or "bottleneck" in q or "problem" in q or "losing" in q:
        return "Risk"
    if "compare" in q or "cross" in q or "both" in q:
        return "Cross Board Analytics"
    if "forecast" in q or "quarter" in q or "probable" in q:
        return "Forecasting"
    return "Operations"

def check_clarification_needed(query: str) -> Optional[Dict[str, Any]]:
    q = query.strip().lower()
    broad_queries = ["how is our business?", "how's business?", "how are we doing?", "business status", "how is business"]

    if q in broad_queries or q == "how is our business":
        return {
            "needs_clarification": True,
            "question": "To give you the most accurate executive insight, could you clarify your scope?",
            "options": [
                "Which time period? (e.g. This Quarter, FY25-26, Last Month)",
                "Which sector? (e.g. Mining, Powerline, Energy, Infrastructure)",
                "Which owner / BD manager? (e.g. OWNER_003, OWNER_002)",
                "Which project status? (Open Deals vs Active Work Orders)"
            ]
        }
    return None

class BIAgent:
    def __init__(self, api_key: str = GEMINI_API_KEY):
        self.api_key = api_key
        if self.api_key:
            try:
                genai.configure(api_key=self.api_key)
                self.model = genai.GenerativeModel('gemini-1.5-flash')
            except Exception as e:
                logger.warning(f"Failed to initialize Gemini model: {e}")
                self.model = None
        else:
            self.model = None

    async def analyze_query(self, query: str, analytics: Dict[str, Any]) -> Dict[str, Any]:
        # Step 1: Check for clarification requirement
        clarification = check_clarification_needed(query)
        if clarification:
            return {
                "intent": "Clarification Required",
                "needs_clarification": True,
                "clarification": clarification,
                "executive_summary": "Your query is broad. Please select a specific filter parameter below to narrow down the business analysis.",
                "business_metrics": {},
                "insights": [],
                "risks": [],
                "recommendations": [],
                "data_quality_notes": analytics.get("data_quality_report", {}),
                "confidence_score": "N/A"
            }

        intent = classify_intent(query)
        dq_report = analytics.get("data_quality_report", {})

        # Build prompt context
        context_str = json.dumps(analytics, indent=2)

        sys_prompt = f"""
You are a Senior AI Business Analyst for Skylark Drones, advising founders and C-level executives.
You are given VERIFIED, DETERMINISTIC business analytics calculated in code from Monday.com API.

USER QUESTION: "{query}"
CLASSIFIED INTENT: {intent}

VERIFIED BACKEND METRICS CONTEXT:
{context_str}

DATA QUALITY REPORT SUMMARY:
- Confidence Score: {dq_report.get('confidence_score')}% ({dq_report.get('confidence_level')})
- Clean Record Percentage: {dq_report.get('clean_records_pct')}%
- Total Records: {dq_report.get('total_records')} (Complete: {dq_report.get('complete_records')}, Incomplete: {dq_report.get('incomplete_records')})
- Duplicates: {dq_report.get('duplicate_deals')} deals, {dq_report.get('duplicate_work_orders')} work orders
- Missing Owners: {dq_report.get('missing_owners')}
- Missing Client Codes: {dq_report.get('missing_client_codes')}
- Missing Revenue: {dq_report.get('missing_revenue')}
- Invalid Dates: {dq_report.get('invalid_dates')}

STRICT ZERO-CALCULATION RULES:
1. NEVER calculate or estimate numbers. You must ONLY state and explain the verified numbers provided in the context above.
2. If a field or metric is missing in context, state "Data unavailable".
3. If CLASSIFIED INTENT is "Data Quality" (e.g. duplicate clients, missing owners, audit), focus on Data Quality & Duplicate Audit metrics.
4. Return your response in STRICT JSON format matching this schema:
{{
  "executive_summary": "Concise 2-3 sentence founder summary answering the question.",
  "intent": "{intent}",
  "business_metrics": {{
     "primary_kpi_name": "value",
     "secondary_kpi_name": "value"
  }},
  "insights": [
    "Insight statement highlighting trends or operational patterns."
  ],
  "risks": [
    "Identified risk factor or bottleneck."
  ],
  "recommendations": [
    "Specific leadership action item."
  ],
  "data_quality_notes": "Summary of data caveats, missing fields, or quality notes affecting this answer.",
  "confidence_score": "High / Medium / Low (with concise rationale)"
}}
"""

        if self.model:
            try:
                response = self.model.generate_content(
                    sys_prompt,
                    generation_config={"response_mime_type": "application/json"}
                )
                res_json = json.loads(response.text)
                res_json["needs_clarification"] = False
                res_json["intent"] = intent
                return res_json
            except Exception as e:
                logger.error(f"LLM generation failed: {e}. Falling back to Rule-Based Analyst Engine.")

        # Structured Rule-Based Executive Fallback Engine
        return self._generate_structured_fallback(query, intent, analytics)

    def _generate_structured_fallback(self, query: str, intent: str, analytics: Dict[str, Any]) -> Dict[str, Any]:
        pipe = analytics.get("pipeline_metrics", {})
        fin = analytics.get("financial_metrics", {})
        sectors = analytics.get("sector_analysis", [])
        owners = analytics.get("owner_summary", [])
        delayed = analytics.get("delayed_work_orders", [])
        dq = analytics.get("data_quality_report", {})

        top_sector = sectors[0] if sectors else {"sector": "N/A", "pipeline_value": 0}
        top_owner = owners[0] if owners else {"owner": "N/A", "total_active_workload": 0}

        exec_summary = ""
        metrics = {}
        insights = list(analytics.get("auto_insights", []))
        risks = list(analytics.get("auto_risks", []))
        recs = list(analytics.get("auto_recommendations", []))

        if intent == "Data Quality" or "duplicate" in query.lower() or "client" in query.lower():
            dup_deals = dq.get("duplicate_deals", 0)
            dup_wo = dq.get("duplicate_work_orders", 0)
            clean_pct = dq.get("clean_records_pct", 100)
            exec_summary = f"Data Quality Audit indicates {clean_pct}% clean records across Monday.com boards. Found {dup_deals} duplicate deal entries and {dup_wo} duplicate work order records."
            metrics = {
              "Duplicate Deals": str(dup_deals),
              "Duplicate Work Orders": str(dup_wo),
              "Clean Records Ratio": f"{clean_pct}%",
              "Missing Owners": str(dq.get("missing_owners", 0)),
              "Audit Confidence": f"{dq.get('confidence_score', 90)}%"
            }
            insights = [
              f"Identified {dup_deals} duplicate deal rows that were automatically deduplicated during pipeline aggregation.",
              f"{dq.get('missing_revenue', 0)} items contained unvalued or empty contract fields.",
              f"Client codes are normalized using strict regex patterns across both Deals and Work Orders boards."
            ]
            risks = [
              "Duplicate entries on Monday.com boards can artificially inflate gross pipeline calculations if not deduplicated.",
              "Unassigned client codes weaken cross-board deal attribution."
            ]
            recs = [
              "Enable unique key validation rules on Monday.com Deal and Work Order creation forms.",
              "Run periodic data cleaning routines to merge duplicate client entity names."
            ]

        elif intent == "Pipeline":
            exec_summary = f"Total deal pipeline stands at ₹{pipe.get('total_pipeline_value', 0):,.2f} across {pipe.get('total_deals', 0)} deals, with an expected revenue of ₹{pipe.get('expected_revenue', 0):,.2f} (weighted win probability of {pipe.get('overall_win_probability', 0)}%)."
            metrics = {
                "Total Pipeline Value": f"₹{pipe.get('total_pipeline_value', 0):,.2f}",
                "Weighted Expected Revenue": f"₹{pipe.get('expected_revenue', 0):,.2f}",
                "Open Deals": str(pipe.get("open_deals", 0)),
                "Win Probability": f"{pipe.get('overall_win_probability', 0)}%"
            }
            insights.append(f"Top performing sector in pipeline is {top_sector['sector']} representing ₹{top_sector['pipeline_value']:,.2f} in value.")
            recs.append("Focus sales effort on high probability deals in final stage to accelerate Q3 cash collection.")

        elif intent == "Revenue":
            exec_summary = f"Work order book total value is ₹{fin.get('total_wo_value', 0):,.2f}, with ₹{fin.get('total_billed_value', 0):,.2f} billed and ₹{fin.get('total_collected_amount', 0):,.2f} collected to date. Unbilled amount stands at ₹{fin.get('total_to_be_billed', 0):,.2f}."
            metrics = {
                "Total Work Order Value": f"₹{fin.get('total_wo_value', 0):,.2f}",
                "Billed Value": f"₹{fin.get('total_billed_value', 0):,.2f}",
                "Collected Amount": f"₹{fin.get('total_collected_amount', 0):,.2f}",
                "Amount Receivable": f"₹{fin.get('total_amount_receivable', 0):,.2f}"
            }
            insights.append(f"Receivables account for ₹{fin.get('total_amount_receivable', 0):,.2f} which requires immediate milestone follow-ups.")
            recs.append("Initiate collection drives for priority accounts with outstanding unbilled balances.")

        elif intent == "Work Orders" or intent == "Delivery":
            exec_summary = f"There are {len(delayed)} delayed work orders out of total active projects. Total unbilled work orders stand at ₹{fin.get('total_to_be_billed', 0):,.2f}."
            metrics = {
                "Delayed Projects": str(len(delayed)),
                "Total Active Work Orders": str(len(analytics.get("work_orders", []))),
                "Unbilled Work Order Value": f"₹{fin.get('total_to_be_billed', 0):,.2f}"
            }
            if delayed:
                insights.append(f"Work order '{delayed[0]['name']}' ({delayed[0]['client_code']}) is overdue with status '{delayed[0]['execution_status']}'.")
            recs.append("Conduct an immediate operational review on delayed projects to release billed milestones.")

        elif intent == "Sector Analysis":
            exec_summary = f"Sector performance is led by {top_sector['sector']} with ₹{top_sector['pipeline_value']:,.2f} in pipeline and a deal win rate of {top_sector['deal_win_rate']}%."
            metrics = {
                "Top Sector": top_sector['sector'],
                "Top Sector Pipeline": f"₹{top_sector['pipeline_value']:,.2f}",
                "Sector Win Rate": f"{top_sector['deal_win_rate']}%",
                "WO Completion Rate": f"{top_sector['wo_completion_rate']}%"
            }
            insights.append(f"Sectors with lower completion rates require technical platform scaling.")
            recs.append("Reallocate engineering resources toward high-growth sectors.")

        elif intent == "Operations":
            exec_summary = f"Operations workload distribution shows {top_owner['owner']} managing the highest active workload ({top_owner['total_active_workload']} combined items)."
            metrics = {
                "Top Owner Workload": f"{top_owner['owner']} ({top_owner['total_active_workload']} items)",
                "Pipeline Managed": f"₹{top_owner['pipeline_managed']:,.2f}",
                "Delayed Projects": str(top_owner['delayed_work_orders'])
            }
            insights.append(f"{top_owner['owner']} has {top_owner['delayed_work_orders']} delayed work orders under management.")
            recs.append(f"Re-distribute project portfolio across secondary BD/KAM personnel.")

        else: # Leadership Summary / Default
            exec_summary = f"Skylark Drones holds ₹{pipe.get('total_pipeline_value', 0):,.2f} in total pipeline value and ₹{fin.get('total_wo_value', 0):,.2f} in total work order contract value. {len(delayed)} projects are currently past delivery schedule."
            metrics = {
                "Total Pipeline Value": f"₹{pipe.get('total_pipeline_value', 0):,.2f}",
                "Expected Revenue": f"₹{pipe.get('expected_revenue', 0):,.2f}",
                "Total Work Order Value": f"₹{fin.get('total_wo_value', 0):,.2f}",
                "Delayed Work Orders": str(len(delayed))
            }
            if not insights:
                insights.append(f"Revenue is concentrated across top sector {top_sector['sector']}.")
            if not recs:
                recs.append("Unblock operational delivery bottlenecks on overdue projects to realize cashflow.")

        dq_note = f"Data Quality Audit: {dq.get('clean_records_pct', 100)}% clean record ratio. Found {dq.get('missing_dates', 0)} missing dates, {dq.get('missing_owners', 0)} unassigned owners, and {dq.get('missing_revenue', 0)} unvalued entries."

        return {
            "intent": intent,
            "needs_clarification": False,
            "executive_summary": exec_summary,
            "business_metrics": metrics,
            "insights": insights or ["Pipeline shows steady growth across key sector verticals."],
            "risks": risks or ["Delivery delays pose cash collection risks on active milestones."],
            "recommendations": recs or ["Focus team execution on closing top quarter deals."],
            "data_quality_notes": dq_note,
            "confidence_score": f"{dq.get('confidence_level', 'High')} ({dq.get('confidence_score', 90)}%)"
        }
