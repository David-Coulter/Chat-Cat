import json
import os
import spacy
from spacy.training import Example
from spacy.util import minibatch
import logging
from flask import Flask, jsonify, render_template, request, session
import random  # Import random for shuffling

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Needed for session management

# Set up logging
logging.basicConfig(level=logging.INFO)

# Load a blank spaCy model
nlp = spacy.blank("en")

# Add text classification to the pipeline without configuration
text_cat = nlp.add_pipe("textcat", last=True)

# Add labels to the text classifier
text_cat.add_label("course_catalog")
text_cat.add_label("faq")
text_cat.add_label("program_info")

# Configure the text classifier after adding the labels
text_cat.cfg["exclusive_classes"] = True

def load_training_data(filename):
    with open(filename) as f:
        data = json.load(f)
    return data['train']

# Train the model
def train_model(nlp, train_data):
    # Prepare training examples
    examples = []
    for item in train_data:
        # Collect relevant text from various fields
        texts = []
        for key in ['code', 'title', 'description', 'grading_basis', 'career', 'enrollment_requirement']:
            if key in item:
                texts.append(item[key])

        # Join all the collected texts into one string
        full_text = " ".join(texts)
        
        # Log the full text for debugging
        logging.info(f"Training with text: {full_text}")  # Debugging statement

        # Create a document with the combined text
        doc = nlp.make_doc(full_text)

        # Create examples
        example = Example.from_dict(doc, {"cats": {item.get('intent', 'default_intent'): 1}})
        examples.append(example)

    # Training loop
    for i in range(10):  # Number of iterations
        losses = {}
        random.shuffle(examples)  # Shuffle the training data
        for batch in minibatch(examples, size=8):
            nlp.update(batch, drop=0.5, losses=losses)
        logging.info(f"Iteration {i}, Losses: {losses}")  # Log losses


    # Save the model
    nlp.to_disk("intent_classifier")

def load_json(filename):
    path = os.path.join('knowledge_base', filename)  # Remove the '..' part
    try:
        with open(path) as f:
            return json.load(f)
    except Exception as e:
        logging.error(f"Error loading {filename}: {e}")
        raise e

def classify_intent(user_query):
    # Load the trained model for classification
    nlp_model = spacy.load("intent_classifier")
    doc = nlp_model(user_query)
    scores = doc.cats  # Get classification scores

    # Log classification scores for debugging
    logging.info(f"Classification scores: {scores}")  # Debugging statement

    # Return the intent with the highest score
    intent = max(scores, key=scores.get)
    return intent
    


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/knowledge_base/faq')
def get_faq():
    return get_knowledge_base('faq.json')

@app.route('/knowledge_base/course_catalog')
def get_course_catalog():
    try:
        data = load_json('course_catalog.json')  # Ensure this loads the file correctly
        return jsonify(data['train'])  # Return the list of courses directly
    except Exception as e:
        logging.error(f"Error fetching course catalog: {e}")
        return jsonify({'error': 'Failed to load course catalog'}), 500


@app.route('/knowledge_base/program_info')
def get_program_info():
    return get_knowledge_base('program_info.json')

def get_knowledge_base(filename):
    try:
        return jsonify(load_json(filename))
    except Exception:
        return jsonify({'error': f'Failed to load {filename}'}), 500

@app.route('/query', methods=['POST'])
def handle_query():
    user_query = request.json.get('query')

    # Log user query
    logging.info(f"User query received: {user_query}")  # Debugging statement

    # Initialize context if not present
    if 'context' not in session:
        session['context'] = {}

    # Classify intent
    intent = classify_intent(user_query)

    # Log classified intent
    logging.info(f"Classified intent: {intent}")  # Debugging statement

    # Store the last intent in session context
    session['context']['last_intent'] = intent
    session.modified = True  # Mark the session as modified

    # Respond based on the classified intent
    if intent in ["course_catalog", "faq", "program_info"]:
        return jsonify(load_json(f'{intent}.json'))
    else:
        return jsonify({"message": "I didn't understand that, but I'm learning!"}), 200


if __name__ == "__main__":
    # Load or create your spaCy model
    nlp = spacy.blank("en")  # or spacy.load("your_model_name") if you have a pretrained model

    # Load training data
    train_data = load_training_data("knowledge_base/course_catalog.json")

    # Call train_model with the required arguments
    train_model(nlp, train_data)

    app.run(debug=True)
