from typing import Dict, Any, List
from collections import defaultdict
from datetime import datetime

def compute_business_analytics(cleaned_data: Dict[str, Any]) -> Dict[str, Any]:
    deals = cleaned_data.get("deals", [])
    work_orders = cleaned_data.get("work_orders", [])
    dq_report = cleaned_data.get("data_quality_report", {})

    now_str = datetime.now().strftime("%Y-%m-%d")
    current_month_prefix = datetime.now().strftime("%Y-%m")
    current_year = datetime.now().year
    current_quarter = (datetime.now().month - 1) // 3 + 1

    # ----------------------------------------------------
    # 1. DEALS METRICS (DETERMINISTIC)
    # ----------------------------------------------------
    total_deals = len(deals)
    open_deals = [d for d in deals if "won" not in d["deal_stage"].lower() and "lost" not in d["deal_stage"].lower()]
    won_deals = [d for d in deals if "won" in d["deal_stage"].lower()]
    lost_deals = [d for d in deals if "lost" in d["deal_stage"].lower()]
    on_hold_deals = [d for d in deals if "hold" in d["deal_stage"].lower() or "pause" in d["deal_stage"].lower()]

    total_pipeline_value = sum(d["deal_value"] for d in open_deals)
    weighted_expected_revenue = sum(d["deal_value"] * d["closure_probability"] for d in open_deals)
    avg_probability = (sum(d["closure_probability"] for d in open_deals) / max(len(open_deals), 1)) * 100.0 if open_deals else 0.0
    avg_deal_size = total_pipeline_value / max(len(open_deals), 1) if open_deals else 0.0

    # Sector & Owner Revenue Breakdown
    deals_by_sector = defaultdict(lambda: {"pipeline_value": 0.0, "expected_revenue": 0.0, "deal_count": 0, "won_count": 0})
    deals_by_owner = defaultdict(lambda: {"pipeline_value": 0.0, "deal_count": 0, "won_count": 0})
    deals_by_client = defaultdict(lambda: {"pipeline_value": 0.0, "deal_count": 0})
    deals_by_stage = defaultdict(lambda: {"pipeline_value": 0.0, "count": 0})

    deals_closing_this_month = []
    deals_closing_this_quarter = []
    high_risk_deals = []

    for d in deals:
        sec = d["sector"]
        own = d["owner_code"]
        cli = d["client_code"]
        stg = d["deal_stage"]
        val = d["deal_value"]
        prob = d["closure_probability"]
        c_date = d["tentative_close_date"]

        deals_by_stage[stg]["count"] += 1
        deals_by_stage[stg]["pipeline_value"] += val

        deals_by_client[cli]["pipeline_value"] += val
        deals_by_client[cli]["deal_count"] += 1

        if "won" not in stg.lower() and "lost" not in stg.lower():
            deals_by_sector[sec]["pipeline_value"] += val
            deals_by_sector[sec]["expected_revenue"] += val * prob
            deals_by_sector[sec]["deal_count"] += 1

            deals_by_owner[own]["pipeline_value"] += val
            deals_by_owner[own]["deal_count"] += 1

            if prob < 0.3 and val > 1000000:
                high_risk_deals.append(d)

            if c_date:
                if c_date.startswith(current_month_prefix):
                    deals_closing_this_month.append(d)
                try:
                    c_dt = datetime.strptime(c_date, "%Y-%m-%d")
                    c_q = (c_dt.month - 1) // 3 + 1
                    if c_dt.year == current_year and c_q == current_quarter:
                        deals_closing_this_quarter.append(d)
                except ValueError:
                    pass
        elif "won" in stg.lower():
            deals_by_sector[sec]["won_count"] += 1
            deals_by_owner[own]["won_count"] += 1

    stage_list = [{"stage": k, "count": v["count"], "pipeline_value": round(v["pipeline_value"], 2)} for k, v in deals_by_stage.items()]

    # ----------------------------------------------------
    # 2. WORK ORDER METRICS (DETERMINISTIC)
    # ----------------------------------------------------
    total_work_orders = len(work_orders)
    completed_wo = [w for w in work_orders if "complete" in w["execution_status"].lower()]
    pending_wo = [w for w in work_orders if "complete" not in w["execution_status"].lower() and "cancel" not in w["execution_status"].lower()]
    cancelled_wo = [w for w in work_orders if "cancel" in w["execution_status"].lower()]

    delayed_work_orders = []
    completion_times_days = []

    for w in work_orders:
        end_date = w["probable_end_date"]
        deliv_date = w["data_delivery_date"]
        po_date = w["po_date"]
        is_completed = "complete" in w["execution_status"].lower()

        if is_completed and po_date and (deliv_date or end_date):
            finish_dt = deliv_date or end_date
            try:
                d_start = datetime.strptime(po_date, "%Y-%m-%d")
                d_end = datetime.strptime(finish_dt, "%Y-%m-%d")
                diff = (d_end - d_start).days
                if diff > 0:
                    completion_times_days.append(diff)
            except ValueError:
                pass

        if not is_completed and end_date and end_date < now_str:
            delayed_work_orders.append(w)

    avg_completion_time_days = round(sum(completion_times_days) / max(len(completion_times_days), 1), 1) if completion_times_days else "Data unavailable"

    total_wo_value = sum(w["wo_value"] for w in work_orders)
    total_billed_value = sum(w["billed_value"] for w in work_orders)
    total_collected_amount = sum(w["collected_amount"] for w in work_orders)
    total_amount_receivable = sum(w["amount_receivable"] for w in work_orders)
    total_to_be_billed = sum(w["amount_to_be_billed"] for w in work_orders)

    wo_by_sector = defaultdict(lambda: {"total_wo": 0, "completed_wo": 0, "wo_value": 0.0})
    wo_by_owner = defaultdict(lambda: {"total_wo": 0, "delayed_wo": 0, "wo_value": 0.0})
    wo_by_client = defaultdict(lambda: {"total_wo": 0, "completed_wo": 0, "wo_value": 0.0})

    for w in work_orders:
        sec = w["sector"]
        own = w["owner_code"]
        cli = w["client_code"]
        val = w["wo_value"]
        is_comp = "complete" in w["execution_status"].lower()
        is_del = w in delayed_work_orders

        wo_by_sector[sec]["total_wo"] += 1
        wo_by_sector[sec]["wo_value"] += val

        wo_by_owner[own]["total_wo"] += 1
        wo_by_owner[own]["wo_value"] += val
        if is_del:
            wo_by_owner[own]["delayed_wo"] += 1

        wo_by_client[cli]["total_wo"] += 1
        wo_by_client[cli]["wo_value"] += val
        if is_comp:
            wo_by_sector[sec]["completed_wo"] += 1
            wo_by_client[cli]["completed_wo"] += 1

    # Sector Analysis Combined
    all_sectors = set(deals_by_sector.keys()).union(set(wo_by_sector.keys()))
    sector_analysis = []

    for sec in all_sectors:
        d_info = deals_by_sector[sec]
        w_info = wo_by_sector[sec]

        win_rate = (d_info["won_count"] / max(d_info["deal_count"], 1)) * 100.0
        wo_comp_rate = (w_info["completed_wo"] / max(w_info["total_wo"], 1)) * 100.0

        sector_analysis.append({
            "sector": sec,
            "pipeline_value": round(d_info["pipeline_value"], 2),
            "expected_revenue": round(d_info["expected_revenue"], 2),
            "deal_count": d_info["deal_count"],
            "deal_win_rate": round(win_rate, 1),
            "wo_count": w_info["total_wo"],
            "wo_completed": w_info["completed_wo"],
            "wo_completion_rate": round(wo_comp_rate, 1),
            "total_wo_value": round(w_info["wo_value"], 2)
        })

    sector_analysis.sort(key=lambda x: x["pipeline_value"], reverse=True)

    # Owner Summary Combined
    all_owners = set(deals_by_owner.keys()).union(set(wo_by_owner.keys()))
    owner_summary = []

    for own in all_owners:
        d_info = deals_by_owner[own]
        w_info = wo_by_owner[own]

        active_workload = d_info["deal_count"] + w_info["total_wo"]
        owner_summary.append({
            "owner": own,
            "pipeline_managed": round(d_info["pipeline_value"], 2),
            "active_deals": d_info["deal_count"],
            "total_work_orders": w_info["total_wo"],
            "delayed_work_orders": w_info["delayed_wo"],
            "total_active_workload": active_workload,
            "total_wo_value": round(w_info["wo_value"], 2)
        })

    owner_summary.sort(key=lambda x: x["total_active_workload"], reverse=True)

    # ----------------------------------------------------
    # 3. CROSS BOARD ANALYTICS (DETERMINISTIC)
    # ----------------------------------------------------
    deal_clients = set(d["client_code"] for d in open_deals if d["client_code"] != "UNKNOWN_CLIENT")
    wo_clients = set(w["client_code"] for w in work_orders if w["client_code"] != "UNKNOWN_CLIENT")

    clients_present_in_both_boards = list(deal_clients.intersection(wo_clients))
    clients_missing_work_orders = list(deal_clients - wo_clients)
    clients_with_active_deals_no_execution = clients_missing_work_orders

    # Client Revenue & Execution Breakdown
    all_clients = set(deals_by_client.keys()).union(set(wo_by_client.keys()))
    client_summary = []

    for cli in all_clients:
        if cli == "UNKNOWN_CLIENT":
            continue
        d_info = deals_by_client[cli]
        w_info = wo_by_client[cli]
        total_val = d_info["pipeline_value"] + w_info["wo_value"]

        client_summary.append({
            "client": cli,
            "pipeline_value": round(d_info["pipeline_value"], 2),
            "wo_value": round(w_info["wo_value"], 2),
            "total_value": round(total_val, 2),
            "active_deals": d_info["deal_count"],
            "work_orders_count": w_info["total_wo"],
            "has_execution": w_info["total_wo"] > 0
        })

    client_summary.sort(key=lambda x: x["total_value"], reverse=True)
    high_value_clients = [c for c in client_summary if c["total_value"] > 50000000]

    # Revenue Monthly Trend
    monthly_rev = defaultdict(lambda: {"pipeline": 0.0, "collected": 0.0})
    for d in deals:
        dt_str = d["created_date"] or d["tentative_close_date"]
        if dt_str and len(dt_str) >= 7:
            m_key = dt_str[:7]
            monthly_rev[m_key]["pipeline"] += d["deal_value"]
    for w in work_orders:
        dt_str = w["data_delivery_date"] or w["po_date"]
        if dt_str and len(dt_str) >= 7:
            m_key = dt_str[:7]
            monthly_rev[m_key]["collected"] += w["collected_amount"]

    revenue_trend = []
    for m_key in sorted(monthly_rev.keys()):
        if m_key >= "2024-01":
            revenue_trend.append({
                "month": m_key,
                "pipeline": round(monthly_rev[m_key]["pipeline"], 2),
                "collected": round(monthly_rev[m_key]["collected"], 2)
            })

    # ----------------------------------------------------
    # 4. DETERMINISTIC CONFIDENCE SCORE CALCULATION
    # ----------------------------------------------------
    # Formula: Confidence = 100 - Penalties
    missing_vals_penalty = (dq_report.get("missing_owners", 0) * 1.5) + (dq_report.get("missing_client_codes", 0) * 2.0) + (dq_report.get("missing_revenue", 0) * 0.1)
    invalid_dates_penalty = (dq_report.get("invalid_dates", 0) * 2.0) + (dq_report.get("missing_dates", 0) * 0.2)
    duplicates_penalty = (dq_report.get("duplicate_deals", 0) * 3.0) + (dq_report.get("duplicate_work_orders", 0) * 3.0)
    incomplete_penalty = (dq_report.get("incomplete_records", 0) / max(dq_report.get("total_records", 1), 1)) * 40.0

    raw_confidence = 100.0 - (missing_vals_penalty + invalid_dates_penalty + duplicates_penalty + incomplete_penalty)
    confidence_score = round(max(min(raw_confidence, 99.0), 10.0), 1)

    if confidence_score >= 85.0:
        confidence_level = "High"
    elif confidence_score >= 60.0:
        confidence_level = "Medium"
    else:
        confidence_level = "Low"

    confidence_rationale = f"Confidence score ({confidence_score}%) calculated deterministically: 100 base minus penalties for missing owners ({missing_vals_penalty:.1f}pt), invalid dates ({invalid_dates_penalty:.1f}pt), duplicates ({duplicates_penalty:.1f}pt), and incomplete record ratio ({incomplete_penalty:.1f}pt)."

    dq_report["confidence_score"] = confidence_score
    dq_report["confidence_level"] = confidence_level
    dq_report["confidence_rationale"] = confidence_rationale

    # ----------------------------------------------------
    # 5. RULE-BASED INSIGHTS & RISKS (PRE-COMPUTED)
    # ----------------------------------------------------
    auto_insights = []
    auto_recommendations = []
    auto_risks = []

    lagging_execution = [s for s in sector_analysis if s["pipeline_value"] > 200000 and s["wo_completion_rate"] < 60.0]
    if lagging_execution:
        top_lag = lagging_execution[0]
        auto_insights.append(f"The {top_lag['sector']} sector exhibits high pipeline value (₹{top_lag['pipeline_value']:,.0f}) but low operational execution ({top_lag['wo_completion_rate']}% completion rate).")
        auto_recommendations.append(f"Prioritize operational resource allocation to {top_lag['sector']} work orders to accelerate revenue recognition.")

    if len(owner_summary) > 1:
        most_loaded = owner_summary[0]
        least_loaded = owner_summary[-1]
        if most_loaded["total_active_workload"] > least_loaded["total_active_workload"] * 2:
            auto_insights.append(f"{most_loaded['owner']} handles a significantly disproportionate workload ({most_loaded['total_active_workload']} active items vs {least_loaded['total_active_workload']} for {least_loaded['owner']}).")
            auto_recommendations.append(f"Reassign pending deals and work orders from {most_loaded['owner']} to under-utilized BD/KAM personnel like {least_loaded['owner']}.")
            auto_risks.append(f"Delivery bottlenecks and potential delays due to owner over-capacity on {most_loaded['owner']}.")

    if len(delayed_work_orders) > 0:
        delayed_val = sum(w["wo_value"] for w in delayed_work_orders)
        auto_risks.append(f"Currently {len(delayed_work_orders)} work orders are past their scheduled delivery date, holding ₹{delayed_val:,.0f} in potential billing.")
        auto_recommendations.append("Audit all overdue work orders with engineering leads to remove delivery blockers.")

    if client_summary:
        top_1 = client_summary[0]
        total_biz = total_pipeline_value + total_wo_value
        if total_biz > 0 and (top_1["total_value"] / total_biz) > 0.25:
            auto_risks.append(f"High revenue concentration risk: {top_1['client']} accounts for {top_1['total_value'] / total_biz * 100:.1f}% of total deal and work order value.")

    # Business Health Score
    delay_penalty = min(len(delayed_work_orders) * 3, 25)
    win_bonus = min(avg_probability * 0.3, 20)
    business_health_score = max(min(round(confidence_score * 0.5 + win_bonus - delay_penalty + 30, 1), 99.0), 40.0)

    return {
        "pipeline_metrics": {
            "total_pipeline_value": round(total_pipeline_value, 2),
            "expected_revenue": round(weighted_expected_revenue, 2),
            "total_deals": total_deals,
            "open_deals": len(open_deals),
            "won_deals": len(won_deals),
            "lost_deals": len(lost_deals),
            "on_hold_deals": len(on_hold_deals),
            "overall_win_probability": round(avg_probability, 1),
            "avg_deal_size": round(avg_deal_size, 2),
            "deals_closing_this_month": len(deals_closing_this_month),
            "deals_closing_this_quarter": len(deals_closing_this_quarter),
            "high_risk_deals_count": len(high_risk_deals),
            "duplicate_deals": dq_report.get("duplicate_deals", 0)
        },
        "financial_metrics": {
            "total_wo_value": round(total_wo_value, 2),
            "total_billed_value": round(total_billed_value, 2),
            "total_collected_amount": round(total_collected_amount, 2),
            "total_amount_receivable": round(total_amount_receivable, 2),
            "total_to_be_billed": round(total_to_be_billed, 2),
            "avg_completion_time_days": avg_completion_time_days
        },
        "work_order_metrics": {
            "total_work_orders": total_work_orders,
            "completed_wo": len(completed_wo),
            "pending_wo": len(pending_wo),
            "delayed_wo": len(delayed_work_orders),
            "cancelled_wo": len(cancelled_wo),
            "duplicate_work_orders": dq_report.get("duplicate_work_orders", 0)
        },
        "cross_board_analytics": {
            "clients_present_in_both_boards": len(clients_present_in_both_boards),
            "clients_missing_work_orders": len(clients_missing_work_orders),
            "clients_with_active_deals_no_execution": len(clients_with_active_deals_no_execution),
            "high_value_clients_count": len(high_value_clients)
        },
        "sector_analysis": sector_analysis,
        "owner_summary": owner_summary,
        "client_summary": client_summary[:10],
        "deal_stages": stage_list,
        "delayed_work_orders": delayed_work_orders,
        "revenue_trend": revenue_trend,
        "data_quality_report": dq_report,
        "business_health_score": business_health_score,
        "auto_insights": auto_insights,
        "auto_risks": auto_risks,
        "auto_recommendations": auto_recommendations,
        "deals": deals,
        "work_orders": work_orders
    }

compute_bi_analytics = compute_business_analytics

