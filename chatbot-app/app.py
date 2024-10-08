# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from rag_model import RAGModel
from web_scraper import scrape_multiple_sites

app = Flask(__name__)
CORS(app)

rag_model = RAGModel()

@app.route('/scrape', methods=['POST'])
def scrape():
    urls = request.json['urls']
    documents = scrape_multiple_sites(urls)
    rag_model.add_documents(documents)
    return jsonify({"message": "Documents added successfully"})

@app.route('/query', methods=['POST'])
def query():
    user_query = request.json['query']
    response = rag_model.query(user_query)
    return jsonify({"response": response})

if __name__ == '__main__':
    app.run(debug=True)