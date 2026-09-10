import os
import sys

# Add backend directory to python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

from app.main import app

# Export ASGI app for Vercel serverless function
app = app
