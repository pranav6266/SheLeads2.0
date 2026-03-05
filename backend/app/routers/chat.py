from fastapi import APIRouter, Depends
from app.auth.clerk import get_current_user
from app.models.schemas import UserInput, ChatResponse, ExtractedInfo, SchemeResult
from app.services.ollama_service import extract_user_info, chat_with_context
from app.services.vector_service import search_schemes

router = APIRouter()


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

    schemes = search_schemes(search_query, n_results=5)

    context = "\n\n".join([s["text"] for s in schemes])

    response_text, should_show_schemes = chat_with_context(
        prompt=data.message,
        context=context,
        user_profile=final_user_profile,
        chat_history=data.chat_history
    )

    return ChatResponse(
        status="success",
        user_profile=ExtractedInfo(**final_user_profile),
        schemes=[SchemeResult(**s) for s in schemes] if should_show_schemes else [],
        response=response_text,
    )
