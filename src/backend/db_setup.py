import os
import sys
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv("supabase_conn.env")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    sys.exit("ERROR: SUPABASE_URL and SUPABASE_KEY must be set in supabase_conn.env")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)