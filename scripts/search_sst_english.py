import urllib.request
import re

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

def check(url):
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as resp:
            content_type = resp.headers.get('Content-Type')
            data = resp.read(500)
            print(f"URL: {url} -> {resp.status}, {content_type}, is_pdf: {data.startswith(b'%PDF')}")
            return True
    except Exception as e:
        # print(f"Error {url}: {e}")
        return False

# Test potential patterns for SST and English PDFs in assets/ots/pdf
patterns = [
    "https://ncert24.com/assets/ots/pdf/cbse-class-10-social-science-notes-chapter-1.pdf",
    "https://ncert24.com/assets/ots/pdf/cbse-class-10-sst-notes-chapter-1.pdf",
    "https://ncert24.com/assets/ots/pdf/cbse-class-10-history-notes-chapter-1.pdf",
    "https://ncert24.com/assets/ots/pdf/cbse-class-10-english-notes-chapter-1.pdf",
    "https://ncert24.com/assets/ots/pdf/cbse-class-10-english-first-flight-chapter-1.pdf",
    "https://ncert24.com/assets/ots/pdf/class-10-social-science-chapter-1.pdf",
    "https://ncert24.com/assets/ots/pdf/class-10-english-chapter-1.pdf",
]
for p in patterns:
    check(p)

# Also check ncert-books pages for sst and english to see their iframe pdfs
for page in [
    'https://ncert24.com/ncert-books/class-10-social-science-ncert-book-pdf',
    'https://ncert24.com/ncert-books/class-10-english-first-flight-pdf',
    'https://ncert24.com/ncert-solutions/ncert-solutions-for-class-10-english',
    'https://ncert24.com/ncert-solutions/ncert-solutions-for-class-10-social-science'
]:
    try:
        req = urllib.request.Request(page, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            print(f"Page {page} fetched: {len(html)} bytes")
            iframes = re.findall(r'<iframe[^>]+src=["\']([^"\']+\.pdf)["\']', html)
            print(f"  iframes in {page}: {iframes}")
            pdfs = re.findall(r'href=["\']([^"\']+\.pdf)["\']', html)
            print(f"  pdfs in {page}: {pdfs[:5]}")
    except Exception as e:
        print(f"Page {page} error: {e}")
