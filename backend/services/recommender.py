import json
from typing import Dict, Any, List
from .ai_engine import _model

def generate_actions(snapshot: Dict[str, Any], risks: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    prompt = (
        "Given the business snapshot and identified risks, generate a list of 3 to 7 high-impact, low-regret actions "
        "suitable for a small to medium-sized business (SMB). For each action, provide a clear title, a concise "
        "description, its impact on a scale of 1 to 5, the effort required on a scale of 1 to 5, and the number of "
        "days until it's due. Balance quick wins with more structural improvements.\n\n"
        f"Business Snapshot:\n{json.dumps(snapshot, indent=2)}\n\n"
        f"Identified Risks:\n{json.dumps(risks, indent=2)}\n\n"
        "Please format the output as a JSON object with a single key 'actions', which is a list of action objects."
    )
    
    response = _model.generate_content(prompt)
    
    try:
        # Clean the response text to extract only the JSON part
        cleaned_response_text = response.text.strip().replace('`', '').replace('json', '', 1).strip()
        
        # Find the start and end of the JSON object
        json_start = cleaned_response_text.find('{')
        json_end = cleaned_response_text.rfind('}') + 1
        
        if json_start != -1 and json_end != -1:
            json_str = cleaned_response_text[json_start:json_end]
            parsed_json = json.loads(json_str)
            return parsed_json.get("actions", [])
        else:
            print(f"Warning: Could not find a valid JSON object in the response: {cleaned_response_text}")
            return []
            
    except (json.JSONDecodeError, AttributeError) as e:
        print(f"Error processing response from AI model: {e}")
        print(f"Raw response text: {response.text}")
        return []