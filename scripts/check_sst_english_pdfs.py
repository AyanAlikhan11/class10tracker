import urllib.request
import re

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

test_urls = [
    "https://ncert24.com/assets/ots/pdf/important-questions-for-class-10-history-chapter-1.pdf",
    "https://ncert24.com/assets/ots/pdf/important-questions-for-class-10-history-chapter-2.pdf",
    "https://ncert24.com/assets/ots/pdf/important-questions-for-class-10-geography-chapter-1.pdf",
    "https://ncert24.com/assets/ots/pdf/important-questions-for-class-10-english-chapter-1.pdf",
    "https://ncert24.com/assets/ots/pdf/important-questions-for-class-10-english-first-flight-chapter-1.pdf",
    "https://ncert24.com/assets/ots/pdf/cbse-class-10-english-first-flight-chapter-1.pdf",
    "https://ncert24.com/assets/ots/pdf/class-10-english-chapter-1.pdf",
]

for url in test_urls:
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=8) as resp:
            data = resp.read(200)
            if data.startswith(b'%PDF'):
                print(f"FOUND PDF: {url}")
            else:
                print(f"Non-PDF: {url}")
    except Exception as e:
        print(f"Not found: {url} ({e})")
