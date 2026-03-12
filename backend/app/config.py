import os
import urllib.parse
from dotenv import load_dotenv

load_dotenv()

raw_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
if "@" in raw_url and "://" in raw_url:
    try:
        prefix = raw_url.split("://")[0] + "://"
        rest = raw_url.split("://")[1]
        
        # Last @ separates user/pass from host
        last_at_idx = rest.rfind("@")
        if last_at_idx != -1:
            credentials = rest[:last_at_idx]
            host_info = rest[last_at_idx+1:]
            
            # First : separates user from pass
            first_colon_idx = credentials.find(":")
            if first_colon_idx != -1:
                username = credentials[:first_colon_idx]
                password = credentials[first_colon_idx+1:]
                
                # URL encode the special characters
                safe_username = urllib.parse.quote_plus(username)
                safe_password = urllib.parse.quote_plus(password)
                
                MONGODB_URL = f"{prefix}{safe_username}:{safe_password}@{host_info}"
            else:
                MONGODB_URL = raw_url
        else:
            MONGODB_URL = raw_url
    except Exception:
        MONGODB_URL = raw_url
else:
    MONGODB_URL = raw_url

MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "bench_wise")
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8000"))
