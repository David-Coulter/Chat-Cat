import json
import os
from flask import Flask, jsonify, render_template

app = Flask(__name__)

def load_json(filename):
    # Adjust this path according to where your knowledge_base folder is located
    path = os.path.join('knowledge_base', filename)
    with open(path) as f:
        return json.load(f)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/knowledge_base/faq')
def get_faq():
    try:
        return jsonify(load_json('faq.json'))
    except Exception as e:
        print(f"Error loading FAQ data: {e}")
        return jsonify({'error': 'Failed to load FAQ data'}), 500

@app.route('/knowledge_base/course_catalog')
def get_course_catalog():
    try:
        return jsonify(load_json('course_catalog.json'))
    except Exception as e:
        print(f"Error loading Course Catalog data: {e}")
        return jsonify({'error': 'Failed to load course catalog'}), 500

@app.route('/knowledge_base/program_info')
def get_program_info():
    try:
        return jsonify(load_json('program_info.json'))
    except Exception as e:
        print(f"Error loading Program Info data: {e}")
        return jsonify({'error': 'Failed to load program info'}), 500

if __name__ == '__main__':
    app.run(debug=True)
