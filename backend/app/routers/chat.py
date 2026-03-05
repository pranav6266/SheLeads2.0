from fastapi import APIRouter, Depends
from app.auth.clerk import get_current_user
from app.models.schemas import UserInput, ChatResponse, ExtractedInfo, SchemeResult
from app.services.ollama_service import extract_user_info, chat_with_context
from app.services.vector_service import search_schemes
import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")

# Initialize MongoDB Atlas Client Globally
mongo_client = MongoClient(MONGO_URI)
mongo_db = mongo_client["nariconnect"]
schemes_collection = mongo_db["detailed_schemes"]

router = APIRouter()


def parse_rich_text(nodes):
    """Recursively extracts plain text from Slate.js rich text node arrays."""
    if not nodes: return "N/A"
    if isinstance(nodes, str): return nodes
    
    text_content = []
    if isinstance(nodes, list):
        for node in nodes:
            if isinstance(node, dict):
                if "text" in node:
                    text_content.append(node["text"])
                if "children" in node:
                    text_content.append(parse_rich_text(node["children"]))
    
    return "".join(text_content)


@router.post("/chat", response_model=ChatResponse)
async def chat(
    data: UserInput,
    user_id: str = Depends(get_current_user),
):
    user_profile = extract_user_info(data.message)

    # Use the profile from request if available and not empty, otherwise use extracted
    final_user_profile = data.user_profile if data.user_profile and any(data.user_profile.values()) else user_profile

    search_query = f"""
    Age: {final_user_profile.get("age")}
    Gender: {final_user_profile.get("gender")}
    Occupation: {final_user_profile.get("occupation")}
    State: {final_user_profile.get("state")}
    Income: {final_user_profile.get("income")}
    Query: {data.message}
    """

    # 1. Fast Vector Search (Top 3) using Qdrant
    brief_results = search_schemes(search_query, n_results=3)

    # 2. Hydrate from MongoDB Atlas
    rich_context = ""
    detailed_schemes_list = []
    
    for brief_scheme in brief_results:
        slug = brief_scheme.get("id")
        
        # Fetch the massive document from Mongo Atlas
        detailed_doc = schemes_collection.find_one({"slug": slug})
        
        if detailed_doc:
            # Safely extract nested data
            basic = detailed_doc.get("basicDetails", {})
            content = detailed_doc.get("schemeContent", {})
            eligibility = detailed_doc.get("eligibilityCriteria", {})
            app_process = detailed_doc.get("applicationProcess", [])
            
            # Parse Slate.js nodes into plain text for the LLM
            parsed_eligibility = parse_rich_text(eligibility.get("eligibilityDescription", []))
            
            # Extract application steps safely
            parsed_steps = ""
            if app_process:
                for process_obj in app_process:
                    parsed_steps += f"Mode: {process_obj.get('mode', 'N/A')}\n"
                    parsed_steps += parse_rich_text(process_obj.get("process", [])) + "\n"
            
            rich_context += f"""
--- SCHEME: {basic.get('schemeName', 'Unknown')} ---
Description: {content.get('briefDescription', 'N/A')}
Eligibility Criteria: {parsed_eligibility}
Application Process: {parsed_steps}
"""
            # Add detailed scheme to the list for frontend response
            # We map detailed doc back to SchemeResult format as best as possible
            # Or we can just use the brief_scheme but with enriched data?
            # The frontend expects SchemeResult which comes from brief_results.
            # Let's keep using brief_scheme for the frontend list, or update it if needed.
            # But brief_results has metadata which is enough for the cards.
            # However, if we want to show MORE info on frontend, we might need to update SchemeResult.
            # For now, I'll stick to brief_results for the frontend "schemes" list, 
            # but maybe update the text/description if needed?
            # Actually, the user didn't ask to update the frontend model, so I'll use brief_results for the response list.
            detailed_schemes_list.append(brief_scheme)
        else:
            # Fallback if not found in Mongo (should not happen if synced)
            detailed_schemes_list.append(brief_scheme)
            rich_context += f"\n{brief_scheme['text']}\n"

    # 3. Send detailed context + conversational memory to Ollama
    response_text, should_show_schemes = chat_with_context(
        prompt=data.message,
        context=rich_context,
        user_profile=final_user_profile,
        chat_history=data.chat_history
    )

    return ChatResponse(
        status="success",
        user_profile=ExtractedInfo(**final_user_profile),
        schemes=[SchemeResult(**s) for s in detailed_schemes_list] if should_show_schemes else [],
        response=response_text,
    )
