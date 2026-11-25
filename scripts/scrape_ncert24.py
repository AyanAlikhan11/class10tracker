import urllib.request
import re

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

def fetch_url(url):
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as resp:
            return resp.read().decode('utf-8', errors='ignore')
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None

for sub in ['cbse-class-10-science-notes', 'cbse-class-10-maths-notes']:
    url = f'https://ncert24.com/revision-notes/{sub}'
    page = fetch_url(url)
    if page:
        print(f"\n=== {sub} ({len(page)} bytes) ===")
        # Find chapter links or table links
        all_links = re.findall(r'<a\s+[^>]*href=["\']([^"\']+)["\'][^>]*>(.*?)</a>', page, re.DOTALL)
        for link, text in all_links:
            clean_text = re.sub(r'<[^>]+>', '', text).strip()
            if any(k in link.lower() or k in clean_text.lower() for k in ['chapter', 'real-numbers', 'chemical', 'acid', 'life', 'light', 'download', '.pdf']):
                print(f"  [{clean_text}] -> {link}")
