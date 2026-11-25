import urllib.request
import re

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

url = 'https://ncert24.com/important-question-for-cbse-board/important-questions-for-class-10-social-science'
try:
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=12) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        print(f"Page fetched: {len(html)} bytes")
        links = re.findall(r'<a\s+[^>]*href=["\']([^"\']+)["\'][^>]*>(.*?)</a>', html, re.DOTALL)
        for link, text in links:
            clean = re.sub(r'<[^>]+>', '', text).strip()
            if any(k in link.lower() or k in clean.lower() for k in ['chapter', 'history', 'geography', 'nationalism', 'resource', '.pdf']):
                print(f"  [{clean}] -> {link}")
        iframes = re.findall(r'<iframe[^>]+src=["\']([^"\']+)["\']', html)
        print("Iframes:", iframes)
except Exception as e:
    print(f"Error {url}: {e}")
