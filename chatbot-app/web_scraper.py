# web_scraper.py
import requests
from bs4 import BeautifulSoup

def scrape_website(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Extract text from paragraphs
    paragraphs = soup.find_all('p')
    text = ' '.join([p.get_text() for p in paragraphs])
    
    # You might want to add more sophisticated scraping logic here
    return text

def scrape_multiple_sites(urls):
    documents = []
    for url in urls:
        try:
            text = scrape_website(url)
            documents.append(text)
        except Exception as e:
            print(f"Error scraping {url}: {e}")
    return documents