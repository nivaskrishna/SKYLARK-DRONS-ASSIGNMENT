import os
from dotenv import load_dotenv

load_dotenv()

MONDAY_API_URL = "https://api.monday.com/v2"
MONDAY_API_TOKEN = os.getenv(
    "MONDAY_API_TOKEN",
    "eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjY4NDg3MTkwMiwiYWFpIjoxMSwidWlkIjoxMTA0NzExMjQsImlhZCI6IjIwMjYtMDctMjFUMDk6MTg6MjguNzgxWiIsInBlciI6Im1lOndyaXRlIiwiYWN0aWQiOjM2MTMxMzEwLCJyZ24iOiJhcHNlMiJ9.EJW5FMloO6qRg-GUq1Iy3krfgNpCdN-_pUeDZJvcLvg"
)

DEALS_BOARD_ID = int(os.getenv("DEALS_BOARD_ID", "5030092794"))
WORK_ORDERS_BOARD_ID = int(os.getenv("WORK_ORDERS_BOARD_ID", "5030093536"))

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", os.getenv("GOOGLE_API_KEY", ""))
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")

CACHE_TTL_SECONDS = 60
