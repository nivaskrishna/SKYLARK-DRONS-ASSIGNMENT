import re
from datetime import datetime
from typing import Dict, Any, List, Tuple

def parse_float(val: Any) -> float:
    if val is None:
        return 0.0
    if isinstance(val, (int, float)):
        return float(val)
    s = str(val).strip().replace(',', '').replace('$', '').replace('₹', '')
    match = re.search(r'[-+]?\d*\.\d+|\d+', s)
    if match:
        try:
            return float(match.group(0))
        except ValueError:
            return 0.0
    return 0.0

def parse_date(val: Any) -> Tuple[str, bool]:
    """Parses date into ISO format YYYY-MM-DD. Returns (iso_str, is_valid)."""
    if not val or str(val).strip() == '':
        return ("", False)

    s = str(val).strip()
    formats = [
        "%Y-%m-%d", "%d/%m/%Y", "%m/%d/%Y", "%d-%m-%Y",
        "%Y/%m/%d", "%d %b %Y", "%d %B %Y", "%b %d, %Y"
    ]
    for fmt in formats:
        try:
            dt = datetime.strptime(s, fmt)
            return (dt.strftime("%Y-%m-%d"), True)
        except ValueError:
            pass

    if 'T' in s:
        try:
            dt = datetime.fromisoformat(s.replace('Z', '+00:00'))
            return (dt.strftime("%Y-%m-%d"), True)
        except Exception:
            pass

    return (s, False)

def normalize_text(val: Any) -> str:
    if val is None:
        return ""
    return str(val).strip()

def normalize_company(val: str) -> str:
    s = normalize_text(val).upper()
    if not s or s in ['NONE', 'N/A', 'NULL', '0', 'UNKNOWN']:
        return "UNKNOWN_CLIENT"
    return s

def normalize_owner(val: str) -> str:
    s = normalize_text(val).upper()
    if not s or s in ['NONE', 'N/A', 'NULL', '0', 'UNASSIGNED']:
        return "UNASSIGNED"
    return s

def normalize_sector(val: str) -> str:
    s = normalize_text(val).title()
    if not s or s.lower() in ['none', 'n/a', 'null', '0', 'unspecified']:
        return "Unspecified Sector"
    return s

def map_item_columns_by_title(item: Dict[str, Any], columns: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Maps item column values by lower-case column title for dynamic field resolution."""
    col_title_to_id = {col["title"].lower().strip(): col["id"] for col in columns if col.get("title")}
    cv_id_to_text = {cv["id"]: cv["text"] for cv in item.get("column_values", []) if cv.get("id")}

    mapped = {}
    for title_str, cid in col_title_to_id.items():
        mapped[title_str] = cv_id_to_text.get(cid, "")
    return mapped

def get_by_title_keywords(mapped: Dict[str, Any], keywords: List[str]) -> str:
    for kw in keywords:
        for t_str, val in mapped.items():
            if kw in t_str:
                if val:
                    return str(val)
    return ""

def clean_and_normalize_data(raw_data: Dict[str, Any]) -> Dict[str, Any]:
    deals_raw = raw_data.get("deals_board") or {}
    wo_raw = raw_data.get("work_orders_board") or {}

    deals_cols = deals_raw.get("columns", [])
    deals_items = deals_raw.get("items_page", {}).get("items", [])

    wo_cols = wo_raw.get("columns", [])
    wo_items = wo_raw.get("items_page", {}).get("items", [])

    data_quality_issues = []

    # Detailed Audit Counters
    missing_dates_count = 0
    missing_owners_count = 0
    missing_client_codes_count = 0
    missing_deal_values_count = 0
    missing_revenue_count = 0
    missing_probability_count = 0
    missing_sector_count = 0
    missing_status_count = 0
    missing_wo_status_count = 0
    invalid_dates_count = 0
    duplicate_deals_count = 0
    duplicate_wo_count = 0

    complete_records_count = 0

    # Process Deals Board
    cleaned_deals = []
    seen_deal_serials = set()

    for item in deals_items:
        title_map = map_item_columns_by_title(item, deals_cols)
        name = normalize_text(item.get("name", "Unnamed Deal"))

        raw_client = get_by_title_keywords(title_map, ["client code", "customer"])
        client_code = normalize_company(raw_client)
        serial_no = normalize_text(get_by_title_keywords(title_map, ["serial #", "serial"]))
        deal_stage = normalize_text(get_by_title_keywords(title_map, ["deal stage", "stage"])) or "Prospecting"

        prob_str = get_by_title_keywords(title_map, ["closure probability", "probability"])
        prob_val = parse_float(prob_str)
        if prob_val > 1.0:
            prob_val = prob_val / 100.0
        elif prob_str.lower() == "high":
            prob_val = 0.8
        elif prob_str.lower() == "medium":
            prob_val = 0.5
        elif prob_str.lower() == "low":
            prob_val = 0.2

        deal_val = parse_float(get_by_title_keywords(title_map, ["masked deal value", "deal value", "amount in rupees (excl"]))
        amount_excl = parse_float(get_by_title_keywords(title_map, ["excl of gst"]))
        amount_incl = parse_float(get_by_title_keywords(title_map, ["incl of gst"]))
        billed_val = parse_float(get_by_title_keywords(title_map, ["billed value"]))
        collected_amt = parse_float(get_by_title_keywords(title_map, ["collected amount"]))

        effective_val = deal_val or amount_excl or amount_incl

        raw_close_date = get_by_title_keywords(title_map, ["close date", "tentative close date", "due date"])
        close_date, is_close_date_valid = parse_date(raw_close_date)

        raw_owner = get_by_title_keywords(title_map, ["owner code", "owner", "bd/kam"])
        owner_code = normalize_owner(raw_owner)

        raw_sector = get_by_title_keywords(title_map, ["sector/service", "sector"])
        sector = normalize_sector(raw_sector)

        raw_status = get_by_title_keywords(title_map, ["deal status", "status"])
        status = normalize_text(raw_status) or "Active"
        created_date, is_created_valid = parse_date(get_by_title_keywords(title_map, ["created date"]))

        is_item_complete = True

        if not raw_client or client_code == "UNKNOWN_CLIENT":
            missing_client_codes_count += 1
            is_item_complete = False

        if not raw_owner or owner_code == "UNASSIGNED":
            missing_owners_count += 1
            is_item_complete = False
            data_quality_issues.append({"item_id": item["id"], "board": "Deals", "issue": f"Missing deal owner for '{name}'"})

        if not raw_close_date:
            missing_dates_count += 1
            is_item_complete = False
        elif not is_close_date_valid:
            invalid_dates_count += 1
            is_item_complete = False

        if effective_val == 0.0:
            missing_deal_values_count += 1
            missing_revenue_count += 1
            is_item_complete = False
            data_quality_issues.append({"item_id": item["id"], "board": "Deals", "issue": f"Zero or missing deal value for '{name}'"})

        if not prob_str:
            missing_probability_count += 1

        if not raw_sector or sector == "Unspecified Sector":
            missing_sector_count += 1

        if not raw_status:
            missing_status_count += 1

        if serial_no and serial_no in seen_deal_serials:
            duplicate_deals_count += 1
            is_item_complete = False
        elif serial_no:
            seen_deal_serials.add(serial_no)

        if is_item_complete:
            complete_records_count += 1

        cleaned_deals.append({
            "id": item["id"],
            "name": name,
            "client_code": client_code,
            "serial_no": serial_no,
            "deal_stage": deal_stage,
            "closure_probability": prob_val,
            "deal_value": effective_val,
            "amount_excl_gst": amount_excl,
            "amount_incl_gst": amount_incl,
            "billed_value": billed_val,
            "collected_amount": collected_amt,
            "tentative_close_date": close_date,
            "is_close_date_valid": is_close_date_valid,
            "created_date": created_date,
            "owner_code": owner_code,
            "sector": sector,
            "status": status,
            "is_complete": is_item_complete
        })

    # Process Work Orders Board
    cleaned_wo = []
    seen_wo_serials = set()

    for item in wo_items:
        title_map = map_item_columns_by_title(item, wo_cols)
        name = normalize_text(item.get("name", "Unnamed Work Order"))

        raw_client = get_by_title_keywords(title_map, ["customer name code", "client code"])
        client_code = normalize_company(raw_client)
        serial_no = normalize_text(get_by_title_keywords(title_map, ["serial #", "serial"]))
        nature_of_work = normalize_text(get_by_title_keywords(title_map, ["nature of work"])) or "One time Project"

        raw_execution_status = get_by_title_keywords(title_map, ["execution status"])
        execution_status = normalize_text(raw_execution_status) or "Pending"

        delivery_date, is_deliv_valid = parse_date(get_by_title_keywords(title_map, ["data delivery date"]))
        po_date, is_po_valid = parse_date(get_by_title_keywords(title_map, ["date of po/loi", "po date"]))
        start_date, is_start_valid = parse_date(get_by_title_keywords(title_map, ["probable start date"]))
        end_date, is_end_valid = parse_date(get_by_title_keywords(title_map, ["probable end date"]))

        raw_owner = get_by_title_keywords(title_map, ["bd/kam personnel code", "owner"])
        owner_code = normalize_owner(raw_owner)

        raw_sector = get_by_title_keywords(title_map, ["sector"])
        sector = normalize_sector(raw_sector)
        type_of_work = normalize_text(get_by_title_keywords(title_map, ["type of work"]))

        amount_excl = parse_float(get_by_title_keywords(title_map, ["amount in rupees (excl"]))
        amount_incl = parse_float(get_by_title_keywords(title_map, ["amount in rupees (incl"]))
        billed_val = parse_float(get_by_title_keywords(title_map, ["billed value in rupees (excl"]))
        collected_amt = parse_float(get_by_title_keywords(title_map, ["collected amount in rupees"]))
        amount_to_bill = parse_float(get_by_title_keywords(title_map, ["amount to be billed"]))
        amount_rec = parse_float(get_by_title_keywords(title_map, ["amount receivable"]))

        wo_val = amount_excl if amount_excl > 0 else amount_incl

        invoice_status = normalize_text(get_by_title_keywords(title_map, ["invoice status"]))
        wo_status_billed = normalize_text(get_by_title_keywords(title_map, ["wo status (billed)"]))
        billing_status = normalize_text(get_by_title_keywords(title_map, ["billing status"]))

        is_item_complete = True

        if not raw_client or client_code == "UNKNOWN_CLIENT":
            missing_client_codes_count += 1
            is_item_complete = False

        if not raw_owner or owner_code == "UNASSIGNED":
            missing_owners_count += 1
            is_item_complete = False
            data_quality_issues.append({"item_id": item["id"], "board": "Work Orders", "issue": f"Missing owner for project '{name}'"})

        if not end_date and not delivery_date:
            missing_dates_count += 1
            is_item_complete = False
            data_quality_issues.append({"item_id": item["id"], "board": "Work Orders", "issue": f"Missing delivery date for '{name}'"})
        elif end_date and not is_end_valid:
            invalid_dates_count += 1
            is_item_complete = False

        if wo_val == 0.0:
            missing_revenue_count += 1
            is_item_complete = False

        if not raw_execution_status:
            missing_wo_status_count += 1
            missing_status_count += 1

        if not raw_sector or sector == "Unspecified Sector":
            missing_sector_count += 1

        if serial_no and serial_no in seen_wo_serials:
            duplicate_wo_count += 1
            is_item_complete = False
        elif serial_no:
            seen_wo_serials.add(serial_no)

        if is_item_complete:
            complete_records_count += 1

        cleaned_wo.append({
            "id": item["id"],
            "name": name,
            "client_code": client_code,
            "serial_no": serial_no,
            "nature_of_work": nature_of_work,
            "execution_status": execution_status,
            "data_delivery_date": delivery_date,
            "po_date": po_date,
            "probable_start_date": start_date,
            "probable_end_date": end_date,
            "owner_code": owner_code,
            "sector": sector,
            "type_of_work": type_of_work,
            "wo_value": wo_val,
            "amount_excl_gst": amount_excl,
            "amount_incl_gst": amount_incl,
            "billed_value": billed_val,
            "collected_amount": collected_amt,
            "amount_to_be_billed": amount_to_bill,
            "amount_receivable": amount_rec,
            "invoice_status": invoice_status,
            "wo_status_billed": wo_status_billed,
            "billing_status": billing_status,
            "is_complete": is_item_complete
        })

    total_records = len(cleaned_deals) + len(cleaned_wo)
    incomplete_records = total_records - complete_records_count
    clean_records_pct = round((complete_records_count / max(total_records, 1)) * 100, 1)

    if clean_records_pct >= 85.0:
        confidence_level = "High"
    elif clean_records_pct >= 65.0:
        confidence_level = "Medium"
    else:
        confidence_level = "Low"

    data_quality_report = {
        "total_records": total_records,
        "complete_records": complete_records_count,
        "incomplete_records": incomplete_records,
        "total_deals_processed": len(cleaned_deals),
        "total_work_orders_processed": len(cleaned_wo),
        "missing_dates": missing_dates_count,
        "missing_owners": missing_owners_count,
        "missing_client_codes": missing_client_codes_count,
        "missing_deal_values": missing_deal_values_count,
        "missing_revenue": missing_revenue_count,
        "missing_probability": missing_probability_count,
        "missing_sector": missing_sector_count,
        "missing_status": missing_status_count,
        "missing_work_order_status": missing_wo_status_count,
        "invalid_dates": invalid_dates_count,
        "duplicate_deals": duplicate_deals_count,
        "duplicate_work_orders": duplicate_wo_count,
        "data_quality_issues": data_quality_issues,
        "confidence_level": confidence_level,
        "confidence_score": clean_records_pct,
        "clean_records_pct": clean_records_pct
    }

    return {
        "deals": cleaned_deals,
        "work_orders": cleaned_wo,
        "data_quality_report": data_quality_report
    }
