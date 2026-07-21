import time
import httpx
import logging
from typing import Dict, Any, Optional
from backend.config import MONDAY_API_URL, MONDAY_API_TOKEN, CACHE_TTL_SECONDS

logger = logging.getLogger("monday_client")
logging.basicConfig(level=logging.INFO)

class MondayClient:
    def __init__(self, token: str = MONDAY_API_TOKEN):
        self.token = token
        self.headers = {
            "Authorization": self.token,
            "Content-Type": "application/json",
            "API-Version": "2023-10"
        }
        self._cache: Optional[Dict[str, Any]] = None
        self._cache_timestamp: float = 0.0

    async def fetch_boards_data(self, force_refresh: bool = False) -> Dict[str, Any]:
        """Dynamically fetches all active boards, identifies Deals & Work Orders boards, and returns item data."""
        now = time.time()
        if not force_refresh and self._cache and (now - self._cache_timestamp < CACHE_TTL_SECONDS):
            logger.info("Returning cached Monday.com board data.")
            return self._cache

        logger.info("Fetching fresh boards data dynamically from Monday API...")
        
        query = """
        query GetAllBoards {
          boards {
            id
            name
            columns {
              id
              title
              type
            }
            items_page(limit: 500) {
              cursor
              items {
                id
                name
                updated_at
                column_values {
                  id
                  text
                  value
                }
              }
            }
          }
        }
        """
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    MONDAY_API_URL,
                    json={"query": query},
                    headers=self.headers
                )
                
            if response.status_code != 200:
                raise Exception(f"Monday API returned HTTP {response.status_code}: {response.text}")
                
            data = response.json()
            if "errors" in data and data["errors"]:
                error_msg = data["errors"][0].get("message", str(data["errors"]))
                raise Exception(f"Monday API GraphQL Error: {error_msg}")
                
            boards = data.get("data", {}).get("boards", [])
            if not boards:
                raise Exception("No active boards found in Monday.com account.")

            deals_board = None
            wo_board = None

            # Smart Board Discovery
            for b in boards:
                bname = b.get("name", "").lower()
                if "deal" in bname or "funnel" in bname:
                    deals_board = b
                elif "work_order" in bname or "order" in bname or "tracker" in bname:
                    wo_board = b

            # Fallback if names don't match exact keywords
            if not deals_board and len(boards) > 0:
                deals_board = boards[0]
            if not wo_board and len(boards) > 1:
                wo_board = boards[1]

            result = {
                "deals_board": deals_board,
                "work_orders_board": wo_board,
                "fetched_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime(now)),
                "success": True
            }
            
            self._cache = result
            self._cache_timestamp = now
            return result

        except Exception as e:
            logger.error(f"Error fetching data from Monday API: {e}")
            if self._cache:
                logger.warning("Serving stale cached data due to API error.")
                stale = dict(self._cache)
                stale["warning"] = f"Failed to refresh from Monday API ({str(e)}). Displaying cached data."
                return stale
            return {
                "deals_board": None,
                "work_orders_board": None,
                "fetched_at": None,
                "success": False,
                "error": str(e)
            }
