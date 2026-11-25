import urllib.request
import re

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

url = 'https://ncert24.com/ncert-books/class-10-english-first-flight-pdf'
try:
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=10) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        print(f"Page length: {len(html)}")
        links = re.findall(r'<a\s+[^>]*href=["\']([^"\']+)["\'][^>]*>(.*?)</a>', html, re.DOTALL)
        for link, text in links:
            clean = re.sub(r'<[^>]+>', '', text).strip()
            if any(k in clean.lower() or k in link.lower() for k in ['letter', 'chapter', 'flight', '.pdf', 'drive', 'download']):
                print(f"  [{clean}] -> {link}")
except Exception as e:
    print("Error:", e)
