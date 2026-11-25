import urllib.request
import ssl
import re

ctx = ssl._create_unverified_context()
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

print("=== 1. Checking ncert24.com PYQ page ===")
try:
    req = urllib.request.Request('https://ncert24.com/previous-year-question-papers/previous-year-question-papers-class-10', headers=headers)
    with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        print(f"NCERT24 PYQ page length: {len(html)}")
        links = re.findall(r'<a\s+[^>]*href=["\']([^"\']+)["\'][^>]*>(.*?)</a>', html, re.DOTALL)
        for link, text in links:
            clean = re.sub(r'<[^>]+>', '', text).strip()
            if any(k in link.lower() or k in clean.lower() for k in ['2024', '2025', '2026', 'previous-year', 'question-paper', '.pdf']):
                print(f"  [{clean}] -> {link}")
except Exception as e:
    print("NCERT24 error:", e)

print("\n=== 2. Checking cbseacademic.nic.in 2024-25 and 2025-26 ===")
cbse_candidates = [
    ("2024-25 Maths Std SQP", "https://cbseacademic.nic.in/web_material/SQP/ClassX_2024_25/MathsStandard-SQP.pdf"),
    ("2024-25 Maths Std MS", "https://cbseacademic.nic.in/web_material/SQP/ClassX_2024_25/MathsStandard-MS.pdf"),
    ("2024-25 Maths Basic SQP", "https://cbseacademic.nic.in/web_material/SQP/ClassX_2024_25/MathsBasic-SQP.pdf"),
    ("2024-25 Maths Basic MS", "https://cbseacademic.nic.in/web_material/SQP/ClassX_2024_25/MathsBasic-MS.pdf"),
    ("2024-25 Science SQP", "https://cbseacademic.nic.in/web_material/SQP/ClassX_2024_25/Science-SQP.pdf"),
    ("2024-25 Science MS", "https://cbseacademic.nic.in/web_material/SQP/ClassX_2024_25/Science-MS.pdf"),
    ("2024-25 SST SQP", "https://cbseacademic.nic.in/web_material/SQP/ClassX_2024_25/SocialScience-SQP.pdf"),
    ("2024-25 SST MS", "https://cbseacademic.nic.in/web_material/SQP/ClassX_2024_25/SocialScience-MS.pdf"),
    ("2024-25 English SQP", "https://cbseacademic.nic.in/web_material/SQP/ClassX_2024_25/EnglishL-SQP.pdf"),
    ("2025-26 Maths Std SQP", "https://cbseacademic.nic.in/web_material/SQP/ClassX_2025_26/MathsStandard-SQP.pdf"),
    ("2025-26 Maths Std MS", "https://cbseacademic.nic.in/web_material/SQP/ClassX_2025_26/MathsStandard-MS.pdf"),
    ("2025-26 Science SQP", "https://cbseacademic.nic.in/web_material/SQP/ClassX_2025_26/Science-SQP.pdf"),
    ("2025-26 Science MS", "https://cbseacademic.nic.in/web_material/SQP/ClassX_2025_26/Science-MS.pdf"),
    ("2025-26 SST SQP", "https://cbseacademic.nic.in/web_material/SQP/ClassX_2025_26/SocialScience-SQP.pdf"),
    ("2025-26 SST MS", "https://cbseacademic.nic.in/web_material/SQP/ClassX_2025_26/SocialScience-MS.pdf"),
    ("2025-26 English SQP", "https://cbseacademic.nic.in/web_material/SQP/ClassX_2025_26/EnglishL-SQP.pdf"),
]

for label, url in cbse_candidates:
    try:
        req = urllib.request.Request(url, headers=headers, method='HEAD')
        with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
            print(f"FOUND: {label} -> {resp.status}, length={resp.headers.get('Content-Length')}")
    except Exception as e:
        print(f"MISS: {label} -> {e}")
