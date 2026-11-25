import urllib.request
import re

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

for url in [
    'https://boardstudy.in/class-10-history-chapter-1-notes-pdf/',
    'https://boardstudy.in/class-10-history-chapter-2-notes-pdf/',
    'https://boardstudy.in/class-10-geography-chapter-1-notes-pdf/',
    'https://boardstudy.in/a-letter-to-god-class-10-notes-pdf/',
]:
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            print(f"URL: {url} -> {len(html)} bytes")
            pdfs = re.findall(r'href=["\']([^"\']*(?:\.pdf|drive\.google)[^"\']*)["\']', html)
            print("  PDFs / Drive links:", pdfs[:5])
    except Exception as e:
        print(f"Error {url}: {e}")
