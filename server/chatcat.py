import json

# Load the knowledge base from JSON files
with open('../knowledge_base/faq.json') as faq_file:
    faq_data = json.load(faq_file)

def process_query(query):
    # Basic string matching for FAQ responses
    for item in faq_data:
        if query.lower() in item['question'].lower():
            return item['answer']
    return "Sorry, I don't have an answer for that right now."
