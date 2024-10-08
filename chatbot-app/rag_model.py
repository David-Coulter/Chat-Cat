# rag_model.py
from transformers import AutoTokenizer, AutoModel
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

class RAGModel:
    def __init__(self):
        self.tokenizer = AutoTokenizer.from_pretrained("distilbert-base-uncased")
        self.model = AutoModel.from_pretrained("distilbert-base-uncased")
        self.sentence_transformer = SentenceTransformer('all-MiniLM-L6-v2')
        self.index = None
        self.documents = []

    def add_documents(self, new_documents):
        self.documents.extend(new_documents)
        embeddings = self.sentence_transformer.encode(new_documents)
        if self.index is None:
            self.index = faiss.IndexFlatL2(embeddings.shape[1])
        self.index.add(embeddings)

    def retrieve(self, query, k=5):
        query_embedding = self.sentence_transformer.encode([query])
        _, I = self.index.search(query_embedding, k)
        return [self.documents[i] for i in I[0]]

    def generate(self, query, retrieved_docs):
        context = " ".join(retrieved_docs)
        inputs = self.tokenizer(f"Context: {context}\nQuery: {query}", return_tensors="pt")
        outputs = self.model(**inputs)
        # This is a simplified generation step. In a real scenario, you'd use a language model here.
        return f"Generated response based on the query: {query} and retrieved documents."

    def query(self, query):
        retrieved_docs = self.retrieve(query)
        return self.generate(query, retrieved_docs)