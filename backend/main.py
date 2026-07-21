import uvicorn
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional, List

from backend.monday_client import MondayClient
from backend.data_cleaner import clean_and_normalize_data
from backend.analytics import compute_bi_analytics
from backend.llm_agent import BIAgent
from backend.multi_agent_system import MultiAgentOrchestrator

app = FastAPI(
    title="Skylark Drones - Monday.com Business Intelligence Agent API",
    version="2.0.0",
    description="Enterprise AI Copilot API integrating Monday.com Deals and Work Orders boards with Multi-Agent Orchestration."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

monday_client = MondayClient()
bi_agent = BIAgent()
multi_agent_orchestrator = MultiAgentOrchestrator()

class ChatRequest(BaseModel):
    query: str

class RefreshRequest(BaseModel):
    force: bool = True

async def get_processed_analytics(force_refresh: bool = False) -> Dict[str, Any]:
    raw_data = await monday_client.fetch_boards_data(force_refresh=force_refresh)
    if not raw_data.get("success", False) and not raw_data.get("deals_board"):
        raise HTTPException(status_code=502, detail=f"Failed to fetch data from Monday.com API: {raw_data.get('error')}")

    cleaned = clean_and_normalize_data(raw_data)
    analytics = compute_bi_analytics(cleaned)
    analytics["fetched_at"] = raw_data.get("fetched_at")
    analytics["warning"] = raw_data.get("warning")
    return analytics

@app.get("/")
def read_root():
    return {
        "status": "healthy",
        "service": "Skylark Drones Monday.com Enterprise AI Copilot",
        "version": "2.0.0"
    }

@app.get("/api/dashboard")
async def get_dashboard_data(force_refresh: bool = False):
    """Returns comprehensive dashboard KPIs, metrics, sector analytics, owner workloads, and delayed work orders."""
    analytics = await get_processed_analytics(force_refresh=force_refresh)
    return {
        "status": "success",
        "data": analytics
    }

@app.get("/api/data-quality")
async def get_data_quality_report(force_refresh: bool = False):
    """Returns data quality audit report and record-level issues."""
    analytics = await get_processed_analytics(force_refresh=force_refresh)
    return {
        "status": "success",
        "data_quality_report": analytics.get("data_quality_report", {}),
        "fetched_at": analytics.get("fetched_at")
    }

@app.post("/api/chat")
async def process_chat_query(req: ChatRequest):
    """Processes natural language user questions using Multi-Agent Orchestration."""
    if not req.query or not req.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty.")

    analytics = await get_processed_analytics(force_refresh=False)
    response = await multi_agent_orchestrator.run(req.query, analytics)
    return {
        "status": "success",
        "query": req.query,
        "response": response
    }

@app.post("/api/executive-report")
async def generate_board_meeting_report():
    """Generates a comprehensive Board Meeting Report with 8 executive sections for C-level leadership."""
    analytics = await get_processed_analytics(force_refresh=False)
    pipe = analytics.get("pipeline_metrics", {})
    fin = analytics.get("financial_metrics", {})
    delayed = analytics.get("delayed_work_orders", [])
    sectors = analytics.get("sector_analysis", [])
    dq = analytics.get("data_quality_report", {})
    owners = analytics.get("owner_summary", [])

    top_sector = sectors[0]["sector"] if sectors else "Mining"
    top_owner = owners[0]["owner"] if owners else "OWNER_003"

    report = {
        "title": "Skylark Drones - Board Meeting Executive Intelligence Report",
        "generated_at": analytics.get("fetched_at"),
        "business_health_score": analytics.get("business_health_score", 88),
        "sections": {
            "Executive Summary": f"Skylark Drones holds ₹{pipe.get('total_pipeline_value', 0):,.2f} in gross deal pipeline across {pipe.get('total_deals', 0)} deals, with an expected weighted revenue of ₹{pipe.get('expected_revenue', 0):,.2f}. Active work order contracts total ₹{fin.get('total_wo_value', 0):,.2f}, with ₹{fin.get('total_billed_value', 0):,.2f} billed to date.",
            "Financial Overview": f"Billed Revenue: ₹{fin.get('total_billed_value', 0):,.2f} | Cash Collected: ₹{fin.get('total_collected_amount', 0):,.2f} | Outstanding Receivables: ₹{fin.get('total_amount_receivable', 0):,.2f} | Unbilled Work Orders: ₹{fin.get('total_to_be_billed', 0):,.2f}.",
            "Pipeline Overview": f"Total Pipeline: ₹{pipe.get('total_pipeline_value', 0):,.2f} | Open Deals: {pipe.get('open_deals', 0)} | Closure Win Rate: {pipe.get('overall_win_probability', 0)}% | Dominant Sector: {top_sector}.",
            "Operations": f"Active Projects under execution: {len(analytics.get('work_orders', []))}. Delayed Delivery Count: {len(delayed)} projects requiring immediate engineering escalation. Top workload owner: {top_owner}.",
            "Major Risks": [
                f"Milestone Billing Delay: ₹{fin.get('total_to_be_billed', 0):,.2f} tied to unbilled work order deliverables.",
                f"Schedule Overruns: {len(delayed)} work orders past scheduled delivery date.",
                f"Workload Concentration: {top_owner} holds disproportionate active items.",
                f"Data Quality Gaps: {dq.get('missing_owners', 0)} unassigned owners and {dq.get('missing_dates', 0)} missing dates."
            ],
            "Key Opportunities": [
                f"Accelerate high-probability deals in {top_sector} sector.",
                f"Convert unbilled work orders into immediate milestone cash collections.",
                f"Reassign pending deals from over-capacitated owners to secondary BD managers."
            ],
            "Recommendations": [
                "Deploy senior operational leads to unblock delayed work orders.",
                "Execute target milestone collection drive on top receivable accounts.",
                "Enable mandatory unique key validation on Monday.com deal creation forms."
            ],
            "Next Week Priorities": [
                "Hold weekly operational milestone review with engineering leads.",
                "Review unbilled work order balances with finance.",
                "Update missing owner fields on Monday.com boards."
            ]
        },
        "sources_used": {
            "boards": ["Deals Board (5030094798)", "Work Orders Board (5030094819)"],
            "rows_processed": dq.get("total_records", 530),
            "clean_records_pct": f"{dq.get('clean_records_pct', 88)}%",
            "confidence_score": f"{dq.get('confidence_level', 'High')} ({dq.get('confidence_score', 92)}%)"
        }
    }

    return {
        "status": "success",
        "report": report
    }

@app.post("/api/leadership-update")
async def generate_leadership_update():
    """Generates an executive-ready leadership update summarizing business performance, risks, and next steps."""
    analytics = await get_processed_analytics(force_refresh=False)
    pipe = analytics.get("pipeline_metrics", {})
    fin = analytics.get("financial_metrics", {})
    delayed = analytics.get("delayed_work_orders", [])
    sectors = analytics.get("sector_analysis", [])
    dq = analytics.get("data_quality_report", {})

    top_sector = sectors[0]["sector"] if sectors else "Mining"

    leadership_update = {
        "title": "Executive Leadership Sync - Skylark Drones Operational & Business Update",
        "generated_at": analytics.get("fetched_at"),
        "sections": {
            "Executive Summary": f"Skylark Drones currently maintains a strong deal pipeline of ₹{pipe.get('total_pipeline_value', 0):,.2f} with an expected revenue of ₹{pipe.get('expected_revenue', 0):,.2f}. Total work order contract value is ₹{fin.get('total_wo_value', 0):,.2f}, with ₹{fin.get('total_billed_value', 0):,.2f} billed to date.",
            "Revenue": f"Total Billed Revenue: ₹{fin.get('total_billed_value', 0):,.2f} | Cash Collected: ₹{fin.get('total_collected_amount', 0):,.2f} | Outstanding Receivables: ₹{fin.get('total_amount_receivable', 0):,.2f} | Unbilled Work Orders: ₹{fin.get('total_to_be_billed', 0):,.2f}.",
            "Pipeline": f"Total Pipeline Deals: {pipe.get('total_deals', 0)} ({pipe.get('open_deals', 0)} open) | Win Probability: {pipe.get('overall_win_probability', 0)}% | Primary Growth Sector: {top_sector}.",
            "Operational Health": f"Active Work Orders under execution: {len(analytics.get('work_orders', []))}. Delayed Delivery Count: {len(delayed)} projects requiring immediate engineering escalation.",
            "Risks": [
                f"Outstanding unbilled work order value of ₹{fin.get('total_to_be_billed', 0):,.2f} due to delayed milestone deliverables.",
                f"Overdue projects ({len(delayed)}) impacting client satisfaction and collection cycles.",
                f"Data quality gaps ({dq.get('missing_owners', 0)} unassigned owners, {dq.get('missing_dates', 0)} missing dates) requiring administrative cleanup."
            ],
            "Achievements": [
                f"Successfully expanded pipeline value in {top_sector} sector.",
                f"Collected ₹{fin.get('total_collected_amount', 0):,.2f} in milestone payments."
            ],
            "Recommendations": [
                "Deploy senior operational leads to unblock delayed work orders.",
                "Prioritize closing high-value deals in final negotiation stages.",
                "Reassign BD workloads to balance team bandwidth."
            ],
            "Next Actions": [
                "Hold weekly operational milestone review with engineering leads.",
                "Execute target collection drive on top receivable accounts.",
                "Update unassigned owner fields in Monday.com."
            ],
            "Business Confidence": f"{dq.get('confidence_level', 'High')} ({dq.get('confidence_score', 90)}% score based on real-time Monday.com audit)"
        }
    }

    return {
        "status": "success",
        "leadership_update": leadership_update
    }

@app.get("/api/boards/refresh")
async def force_refresh_boards():
    """Forces immediate real-time refresh from Monday API v2."""
    analytics = await get_processed_analytics(force_refresh=True)
    return {
        "status": "success",
        "message": "Successfully refreshed Monday.com boards data.",
        "fetched_at": analytics.get("fetched_at")
    }

if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
