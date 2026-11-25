import urllib.request
import re

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

for path in [
    'https://ncert24.com/important-question-for-cbse-board/important-questions-for-class-10-english',
    'https://ncert24.com/important-question-for-cbse-board/important-questions-for-class-10-english-first-flight',
    'https://ncert24.com/ncert-solutions/ncert-solutions-for-class-10-english-first-flight-chapter-1',
    'https://ncert24.com/ncert-books/class-10-english-first-flight-chapter-1',
]:
    try:
        req = urllib.request.Request(path, headers=headers)
        with urllib.request.urlopen(req, timeout=8) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            print(f"URL: {path} -> {len(html)} bytes")
            iframes = re.findall(r'<iframe[^>]+src=["\']([^"\']+\.pdf)["\']', html)
            print("  Iframes:", iframes)
    except Exception as e:
        print(f"Error {path}: {e}")
