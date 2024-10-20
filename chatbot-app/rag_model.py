import logging
from sentence_transformers import SentenceTransformer
from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig, pipeline
from langchain_community.llms import HuggingFacePipeline
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader
import torch
import os
from pathlib import Path

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

class RAGModel:
    def __init__(self):
        try:
            logger.info("Initializing RAGModel...")
            self.sentence_transformer = SentenceTransformer('all-MiniLM-L6-v2')
            logger.info("Sentence transformer loaded successfully")

            logger.info("Loading language model...")
            model_name = "facebook/opt-350m"
            
            self.tokenizer = AutoTokenizer.from_pretrained(model_name)
            logger.info("Tokenizer loaded successfully")

            try:
                # Try loading with quantization
                bnb_config = BitsAndBytesConfig(
                    load_in_4bit=True,
                    bnb_4bit_quant_type="nf4",
                    bnb_4bit_compute_dtype=torch.float16,
                    bnb_4bit_use_double_quant=False,
                )
                self.model = AutoModelForCausalLM.from_pretrained(model_name, quantization_config=bnb_config)
                logger.info("Model loaded successfully with quantization")
            except Exception as quant_error:
                logger.warning(f"Quantization failed, falling back to non-quantized model: {str(quant_error)}")
                self.model = AutoModelForCausalLM.from_pretrained(model_name)
                logger.info("Model loaded successfully without quantization")

            # Create a text-generation pipeline
            text_generation = pipeline(
                "text-generation",
                model=self.model,
                tokenizer=self.tokenizer,
                max_length=512,
                temperature=0.7,
                top_p=0.95,
                repetition_penalty=1.15
            )

            # Wrap the pipeline in HuggingFacePipeline
            self.llm = HuggingFacePipeline(pipeline=text_generation)
            logger.info("HuggingFacePipeline created successfully")

            self.load_and_process_documents()
            logger.info("RAGModel initialization complete")
        except Exception as e:
            logger.error(f"Error initializing RAGModel: {str(e)}", exc_info=True)
            raise

    def load_and_process_documents(self):
        try:
            pdf_dir = Path('data')
            if not pdf_dir.exists() or not pdf_dir.is_dir():
                raise FileNotFoundError(f"Data directory not found: {pdf_dir}")

            documents = []
            pdf_files = list(pdf_dir.glob('*.pdf'))
            if not pdf_files:
                raise FileNotFoundError(f"No PDF files found in {pdf_dir}")

            for pdf_file in pdf_files:
                logger.info(f"Loading PDF: {pdf_file}")
                loader = PyPDFLoader(str(pdf_file))
                documents.extend(loader.load())

            logger.info(f"Loaded {len(documents)} documents")

            text_splitter = RecursiveCharacterTextSplitter(chunk_size=512, chunk_overlap=30)
            texts = text_splitter.split_documents(documents)
            logger.info(f"Split into {len(texts)} text chunks")

            embeddings = HuggingFaceEmbeddings()
            self.vectorstore = FAISS.from_documents(texts, embeddings)
            logger.info("Vector store created successfully")

            self.qa_chain = RetrievalQA.from_chain_type(
                llm=self.llm, 
                chain_type="stuff", 
                retriever=self.vectorstore.as_retriever()
            )
            logger.info("QA chain created successfully")
        except Exception as e:
            logger.error(f"Error in load_and_process_documents: {str(e)}", exc_info=True)
            raise

    async def query(self, query_text):
        try:
            result = self.qa_chain({"query": query_text})
            return result['result']
        except Exception as e:
            logger.error(f"Error during query: {str(e)}", exc_info=True)
            return f"An error occurred: {str(e)}"

    def add_documents(self, new_documents):
        if self.index is None:
            self.index = FAISS.from_documents(new_documents, HuggingFaceEmbeddings(model_name="BAAI/bge-base-en-v1.5"))
        else:
            self.index.add_documents(new_documents)
        
        self.retriever = self.index.as_retriever(search_type="similarity", search_kwargs={"k": 4})
        self.qa_chain = RetrievalQA.from_chain_type(
            llm=self.llm,
            chain_type="stuff",
            retriever=self.retriever,
            return_source_documents=True
        )
        logging.debug(f"Documents added. Total documents: {self.index.index.ntotal}")

    def cleanup(self):
            """Clean up resources used by the model."""
            if hasattr(self, 'index'):
                del self.index
            if hasattr(self, 'llm'):
                del self.llm
            torch.cuda.empty_cache()  # Clear CUDA cache if using GPU
            # Reset attributes
            self.index = None
            self.retriever = None
            self.qa_chain = None
            self.llm = None

    def __del__(self):
        """Destructor to ensure cleanup is called."""
        self.cleanup()