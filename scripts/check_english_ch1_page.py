import urllib.request
import re

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

url = 'https://ncert24.com/ncert-books/ncert-books-class-10-english-first-flight-chapter-1'
try:
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=10) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        print(f"Page length: {len(html)}")
        iframe = re.search(r'<iframe[^>]+src=["\']([^"\']+)["\']', html)
        if iframe:
            print("Found iframe:", iframe.group(1))
        pdfs = re.findall(r'href=["\']([^"\']+\.pdf)["\']', html)
        print("PDF links:", pdfs)
except Exception as e:
    print("Error:", e)
