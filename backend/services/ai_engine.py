import os
from typing import Dict, Any, List
import json
import google.generativeai as genai

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY is required")

genai.configure(api_key=GEMINI_API_KEY)
_model = genai.GenerativeModel('gemini-1.5-flash')

def analyze_risks(snapshot_dict: Dict[str, Any]) -> List[Dict[str, Any]]:
    schema = {
        "type": "object",
        "properties": {
            "risks": {
                "type": "array",
                "minItems": 1,
                "items": {
                    "type": "object",
                    "properties": {
                        "title": {"type": "string"},
                        "severity": {"type": "integer", "minimum": 1, "maximum": 5},
                        "priority": {"type": "integer", "minimum": 1, "maximum": 5},
                        "detail": {"type": "string"},
                        "suggestion": {"type": "string"}
                    },
                    "required": ["title", "severity", "priority", "detail", "suggestion"],
                    "additionalProperties": False
                }
            }
        },
        "required": ["risks"],
        "additionalProperties": False
    }
    prompt = (
        "Identify concrete business risks from this snapshot with severity and priority 1-5 and actionable suggestions.\n"
        f"Snapshot: {snapshot_dict}\n"
        "Focus on cash runway, revenue concentration, late payments, supplier concentration, compliance, and ops.\n"
        f"Generate a JSON object strictly matching this JSON schema: {json.dumps(schema)}"
    )

    generation_config = genai.types.GenerationConfig(
        response_mime_type="application/json"
    )

    resp = _model.generate_content(
        prompt,
        generation_config=generation_config,
    )

    try:
        parsed_json = json.loads(resp.text)
        return parsed_json.get("risks", [])
    except (json.JSONDecodeError, AttributeError) as e:
        print(f"Error processing response from AI model: {e}")
        print(f"Raw response text: {resp.text}")
        return []

def copilot_plan(context: Dict[str, Any], question: str) -> str:
    system = (
        "You are a pragmatic small-business resilience advisor. "
        "Return concise, step-by-step actions with numbers, targets, and sequencing."
    )
    user = f"Context: {context}\nQuestion: {question}"
    prompt = f"{system}\n\n{user}"
    resp = _model.generate_content(prompt)
    return resp.text
