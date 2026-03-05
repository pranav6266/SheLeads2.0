import os
import json
import sys
from dotenv import load_dotenv
from pymongo import MongoClient

# Add the parent directory to sys.path so we can import app
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.dirname(SCRIPT_DIR))

from app.models.scheme_models import Scheme

# Load environment variables
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    print("Warning: MONGO_URI is missing from your .env file! Using localhost for now.")
    MONGO_URI = "mongodb://localhost:27017"

# Connect to MongoDB Atlas
print("Connecting to MongoDB Atlas...")
try:
    client = MongoClient(MONGO_URI)
    # Ping to check connection
    client.admin.command('ping')
    print("Connected successfully!")
except Exception as e:
    print(f"Connection failed: {e}")
    sys.exit(1)

db = client["nariconnect"]
collection = db["detailed_schemes"]

def seed_database(json_filepath: str):
    if not os.path.exists(json_filepath):
        print(f"Error: File not found at {json_filepath}")
        return

    print(f"Loading {json_filepath} into MongoDB Atlas...")
    with open(json_filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    valid_schemes = []
    for i, item in enumerate(data):
        try:
            # Validate against our Pydantic schema
            scheme = Scheme(**item)
            # Convert back to dict for MongoDB insertion
            valid_schemes.append(scheme.dict(exclude_none=True))
        except Exception as e:
            # Only print first few errors to avoid spamming the console
            if i < 5:
                print(f"Skipping invalid scheme ({item.get('slug', 'unknown')}): {e}")

    if valid_schemes:
        print("Clearing old records...")
        collection.delete_many({})
        
        print(f"Inserting {len(valid_schemes)} new records (this may take a minute)...")
        # Insert in batches to avoid document size limits or timeouts
        batch_size = 1000
        for i in range(0, len(valid_schemes), batch_size):
            batch = valid_schemes[i:i + batch_size]
            collection.insert_many(batch)
            print(f"Inserted {min(i + batch_size, len(valid_schemes))}/{len(valid_schemes)}")
        
        # Create an index on the slug for O(1) lightning-fast lookups
        collection.create_index("slug", unique=True)
        print(f"✅ Successfully inserted {len(valid_schemes)} schemes into MongoDB Atlas!")
    else:
        print("No valid schemes found to insert.")

if __name__ == "__main__":
    # Dynamically get the path to this script's folder, 
    # and look for 'rag_dataset.json' in the exact same directory.
    json_path = os.path.join(SCRIPT_DIR, "rag_dataset.json")
    
    print(f"Looking for dataset at: {json_path}")
    seed_database(json_path)