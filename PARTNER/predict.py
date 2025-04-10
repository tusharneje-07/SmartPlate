import google.generativeai as genai
from dotenv import load_dotenv
import os
import json
import re
from collections import defaultdict, Counter
from datetime import datetime

# Load API Key
load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")

# Ensure API key is loaded correctly
if not api_key:
    raise ValueError("API Key is missing! Please check your .env file.")

# Configure Gemini
genai.configure(api_key=api_key)
model = genai.GenerativeModel("gemini-2.0-flash")

# Function to generate chatbot response
def get_chatbot_response(input_data):
    try:
        prompt = f"""
You are an expert in data analysis. Your task is:
1. Predict total number of customers and plates for each day of the next week.
2. Predict total number of customers and plates for each day of the next week. (First check the plate frequency per order then calculate, do not make any assumptions) 
3. List the 3 most likely popular dishes for the next week
4. Give 2–3 short actionable suggestions to improve customer engagement or optimize menu/pricing.

Output must be in this JSON format only:
{{
  "predicted_customers_next_week": [int, int, ..., int], 
  "predicted_plates_next_week": [int, int, ..., int],
  "popular_dishes": ["", "", ""],
  "suggestions": "short sentence 1. short sentence 2. short sentence 3"
}}

Here is the data:
{json.dumps(input_data, indent=4)}
"""

        response = model.generate_content(prompt)

        if not response or not response.candidates:
            return {"error": "Gemini returned an empty response. Check API limits or input format."}

        response_text = response.candidates[0].content.parts[0].text

        # Try extracting JSON block from within triple backticks
        json_match = re.search(r'```json\n(.*?)\n```', response_text, re.DOTALL)
        if json_match:
            json_str = json_match.group(1)
        else:
            # If not inside ```json, try extracting the entire text (if it's already JSON)
            json_str = response_text.strip()

        return json.loads(json_str)

    except Exception as e:
        return {"error": str(e)}

# Function to aggregate mess orders
def aggregate_orders(order_data):
    aggregated = defaultdict(lambda: {
        "date": "",
        "day": "",
        "total_customers": 0,
        "total_plates": 0,
        "top_plates": []
    })

    for order in order_data:
        date_str = order["date"]
        plate_name = order["order_details"]
        count = order.get("count", 1)

        # Format date
        date_obj = datetime.strptime(date_str, "%Y-%m-%d")
        display_date = date_obj.strftime("%d/%m")
        day = date_obj.strftime("%A")

        entry = aggregated[display_date]
        entry["date"] = display_date
        entry["day"] = day
        entry["total_customers"] += 1
        entry["total_plates"] += count
        entry.setdefault("plate_counter", Counter())[plate_name] += count

    result = []
    for data in aggregated.values():
        top_plates = data["plate_counter"].most_common(3)
        data["top_plates"] = [{"name": name, "count": cnt} for name, cnt in top_plates]
        del data["plate_counter"]
        result.append(data)

    return result

# # Load mess order data from JSON file
# with open("demodata.json", "r") as f:
#     raw_data = json.load(f)

# # Convert raw orders into structured format
# aggregated_data = aggregate_orders(raw_data)
# print(aggregated_data)
# Get Gemini-generated analysis
# response = get_chatbot_response(aggregated_data)

# # Display final result
# print(json.dumps(response, indent=4))
