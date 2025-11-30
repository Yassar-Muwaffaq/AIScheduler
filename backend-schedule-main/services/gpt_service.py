# backend/services/gpt_service.py
import google.generativeai as genai
import os
import json

genai.configure(api_key="AIzaSyCCq2Pk91G11iw-bGHVwjDJ3Y6QWOCMAAQ")

def ask_gpt(user_message):
    model = genai.GenerativeModel(
        "gemini-2.5-flash", generation_config={"response_mime_type": "application/json"}
    )
    response = model.generate_content(user_message)
    print(response)
    # Ensure output is JSON valid
    try:
        parsed = json.loads(response.text)
        return parsed
    except:
        # Fallback: wrap raw text so backend tidak error
        return {"error": "Invalid JSON", "raw_output": response.text}
