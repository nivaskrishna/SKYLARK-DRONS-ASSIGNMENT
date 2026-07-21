import pytest
import asyncio
from backend.monday_client import MondayClient
from backend.data_cleaner import clean_and_normalize_data
from backend.analytics import compute_bi_analytics
from backend.llm_agent import BIAgent, classify_intent, check_clarification_needed

@pytest.mark.asyncio
async def test_monday_client_fetch():
    client = MondayClient()
    res = await client.fetch_boards_data(force_refresh=True)
    assert res["success"] is True
    assert res["deals_board"] is not None
    assert res["work_orders_board"] is not None

@pytest.mark.asyncio
async def test_data_cleaning_and_analytics():
    client = MondayClient()
    raw_data = await client.fetch_boards_data(force_refresh=False)
    cleaned = clean_and_normalize_data(raw_data)
    
    assert len(cleaned["deals"]) > 0
    assert len(cleaned["work_orders"]) > 0
    assert "data_quality_report" in cleaned

    analytics = compute_bi_analytics(cleaned)
    assert "pipeline_metrics" in analytics
    assert "financial_metrics" in analytics
    assert "sector_analysis" in analytics
    assert "owner_summary" in analytics
    assert analytics["pipeline_metrics"]["total_pipeline_value"] > 0

@pytest.mark.asyncio
async def test_intent_classification():
    assert classify_intent("How is our pipeline?") == "Pipeline"
    assert classify_intent("How much expected revenue do we have?") == "Revenue"
    assert classify_intent("Which sector is performing best?") == "Sector Analysis"
    assert classify_intent("Which projects are delayed?") == "Work Orders"
    assert classify_intent("Prepare a leadership update") == "Leadership Summary"

@pytest.mark.asyncio
async def test_clarification():
    res = check_clarification_needed("How is our business?")
    assert res is not None
    assert res["needs_clarification"] is True

@pytest.mark.asyncio
async def test_llm_agent_response():
    client = MondayClient()
    raw_data = await client.fetch_boards_data(force_refresh=False)
    cleaned = clean_and_normalize_data(raw_data)
    analytics = compute_bi_analytics(cleaned)

    agent = BIAgent()
    ans = await agent.analyze_query("How is our pipeline?", analytics)
    assert "executive_summary" in ans
    assert "business_metrics" in ans
    assert "insights" in ans
    assert "recommendations" in ans
    assert "confidence_score" in ans
