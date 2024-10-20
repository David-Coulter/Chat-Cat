from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import logging
import traceback

# Import your RAGModel class
from rag_model import RAGModel

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Query(BaseModel):
    query_text: str

# Global variable for RAGModel instance
rag_model = None

@app.on_event("startup")
async def startup_event():
    global rag_model
    try:
        logger.info("Initializing RAGModel...")
        rag_model = RAGModel()
        logger.info("RAGModel initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize RAGModel: {str(e)}")
        logger.error(traceback.format_exc())

@app.on_event("shutdown")
async def shutdown_event():
    global rag_model
    if rag_model:
        rag_model.cleanup()
        logger.info("RAGModel cleaned up")

@app.get("/")
def read_root():
    return {"message": "Welcome to the RAG API"}

@app.post("/query")
async def query(query: Query):
    global rag_model
    if not rag_model:
        logger.error("RAGModel not initialized")
        raise HTTPException(status_code=503, detail="Model not initialized. Check server logs for details.")
    try:
        logger.info(f"Processing query: {query.query_text}")
        response = await rag_model.query(query.query_text)
        logger.info("Query processed successfully")
        return {"answer": response}
    except Exception as e:
        logger.error(f"Error processing query: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=5000, log_level="debug")