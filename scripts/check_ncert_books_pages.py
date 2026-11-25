import urllib.request
import re

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

for url in [
    'https://ncert24.com/ncert-books/class-10-social-science-ncert-book-pdf',
    'https://ncert24.com/ncert-books/class-10-english-first-flight-pdf',
]:
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=15) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            print(f"URL: {url} -> {len(html)} bytes")
            # find all pdf links
            pdfs = re.findall(r'href=["\']([^"\']+\.pdf)["\']', html)
            print("  PDFs found:", set(pdfs))
            # find iframe src
            iframes = re.findall(r'<iframe[^>]+src=["\']([^"\']+)["\']', html)
            print("  iframes found:", iframes)
    except Exception as e:
        print(f"Error {url}: {e}")
