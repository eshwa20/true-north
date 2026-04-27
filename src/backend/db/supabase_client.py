from supabase import create_client, Client
from config import Config

_client: Client | None = None

def get_supabase() -> Client:
    global _client

    if _client is None:
        if not Config.SUPABASE_URL or not Config.SUPABASE_KEY:
            raise RuntimeError("Supabase credentials missing")

        _client = create_client(
            Config.SUPABASE_URL,
            Config.SUPABASE_KEY  # should be SERVICE ROLE KEY
        )

    return _client