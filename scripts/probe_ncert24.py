import urllib.request
import re
import os
import time

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

def fetch_html(url):
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=12) as resp:
            return resp.read().decode('utf-8', errors='ignore')
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None

def download_file(url, out_path):
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = resp.read()
            if data.startswith(b'%PDF'):
                with open(out_path, 'wb') as f:
                    f.write(data)
                size_mb = len(data) / (1024 * 1024)
                print(f"SUCCESS: Downloaded {len(data)} bytes ({size_mb:.2f} MB) -> {out_path}")
                return len(data)
            else:
                print(f"FAILED: Content is not PDF for {url}")
                return None
    except Exception as e:
        print(f"Error downloading {url}: {e}")
        return None

# Let's check Science chapters 1 to 13 on NCERT24
print("--- Checking Science Chapters on NCERT24 ---")
science_pdf_map = {}
for ch in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]:
    page_url = f"https://ncert24.com/revision-notes/cbse-class-10-science-notes-chapter-{ch}"
    html = fetch_html(page_url)
    if html:
        iframe = re.search(r'<iframe[^>]+src=["\']([^"\']+\.pdf)["\']', html)
        if iframe:
            pdf_url = iframe.group(1)
            print(f"Science Ch {ch} PDF URL: {pdf_url}")
            science_pdf_map[ch] = pdf_url
        else:
            # Look for any pdf link in html
            pdfs = re.findall(r'href=["\']([^"\']+\.pdf)["\']', html)
            print(f"Science Ch {ch} found pdfs: {pdfs}")
    time.sleep(0.5)

# Let's check Maths chapters 1 to 14 on NCERT24
print("\n--- Checking Maths Chapters on NCERT24 ---")
maths_pdf_map = {}
for ch in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]:
    page_url = f"https://ncert24.com/revision-notes/cbse-class-10-maths-notes-chapter-{ch}"
    html = fetch_html(page_url)
    if html:
        iframe = re.search(r'<iframe[^>]+src=["\']([^"\']+\.pdf)["\']', html)
        if iframe:
            pdf_url = iframe.group(1)
            print(f"Maths Ch {ch} PDF URL: {pdf_url}")
            maths_pdf_map[ch] = pdf_url
        else:
            # Look for any pdf link
            pdfs = re.findall(r'href=["\']([^"\']+\.pdf)["\']', html)
            print(f"Maths Ch {ch} found pdfs: {pdfs}")
    time.sleep(0.5)

# Check Social Science & English on NCERT24
print("\n--- Checking Social Science & English on NCERT24 ---")
for slug in [
    'cbse-class-10-social-science-notes',
    'cbse-class-10-history-notes',
    'cbse-class-10-geography-notes',
    'cbse-class-10-english-notes'
]:
    page_url = f"https://ncert24.com/revision-notes/{slug}"
    html = fetch_html(page_url)
    if html:
        print(f"Found page for {slug} ({len(html)} bytes)")
