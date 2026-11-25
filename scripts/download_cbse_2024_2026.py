import urllib.request
import ssl
import os

ctx = ssl._create_unverified_context()
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

out_dir = os.path.join(os.path.dirname(__file__), '..', 'public', 'pyq-pdfs')
os.makedirs(out_dir, exist_ok=True)

papers = [
    # 2024-2025
    ("https://cbseacademic.nic.in/web_material/SQP/ClassX_2024_25/MathsStandard-SQP.pdf", "CBSE-Class10-MathsStandard-2025-SQP.pdf"),
    ("https://cbseacademic.nic.in/web_material/SQP/ClassX_2024_25/MathsStandard-MS.pdf", "CBSE-Class10-MathsStandard-2025-MS.pdf"),
    ("https://cbseacademic.nic.in/web_material/SQP/ClassX_2024_25/MathsBasic-SQP.pdf", "CBSE-Class10-MathsBasic-2025-SQP.pdf"),
    ("https://cbseacademic.nic.in/web_material/SQP/ClassX_2024_25/MathsBasic-MS.pdf", "CBSE-Class10-MathsBasic-2025-MS.pdf"),
    ("https://cbseacademic.nic.in/web_material/SQP/ClassX_2024_25/Science-SQP.pdf", "CBSE-Class10-Science-2025-SQP.pdf"),
    ("https://cbseacademic.nic.in/web_material/SQP/ClassX_2024_25/Science-MS.pdf", "CBSE-Class10-Science-2025-MS.pdf"),
    ("https://cbseacademic.nic.in/web_material/SQP/ClassX_2024_25/SocialScience-SQP.pdf", "CBSE-Class10-SocialScience-2025-SQP.pdf"),
    ("https://cbseacademic.nic.in/web_material/SQP/ClassX_2024_25/SocialScience-MS.pdf", "CBSE-Class10-SocialScience-2025-MS.pdf"),
    ("https://cbseacademic.nic.in/web_material/SQP/ClassX_2024_25/EnglishL-SQP.pdf", "CBSE-Class10-English-2025-SQP.pdf"),
    ("https://cbseacademic.nic.in/web_material/SQP/ClassX_2024_25/EnglishL-MS.pdf", "CBSE-Class10-English-2025-MS.pdf"),

    # 2025-2026
    ("https://cbseacademic.nic.in/web_material/SQP/ClassX_2025_26/MathsStandard-SQP.pdf", "CBSE-Class10-MathsStandard-2026-SQP.pdf"),
    ("https://cbseacademic.nic.in/web_material/SQP/ClassX_2025_26/MathsStandard-MS.pdf", "CBSE-Class10-MathsStandard-2026-MS.pdf"),
    ("https://cbseacademic.nic.in/web_material/SQP/ClassX_2025_26/MathsBasic-SQP.pdf", "CBSE-Class10-MathsBasic-2026-SQP.pdf"),
    ("https://cbseacademic.nic.in/web_material/SQP/ClassX_2025_26/MathsBasic-MS.pdf", "CBSE-Class10-MathsBasic-2026-MS.pdf"),
    ("https://cbseacademic.nic.in/web_material/SQP/ClassX_2025_26/Science-SQP.pdf", "CBSE-Class10-Science-2026-SQP.pdf"),
    ("https://cbseacademic.nic.in/web_material/SQP/ClassX_2025_26/Science-MS.pdf", "CBSE-Class10-Science-2026-MS.pdf"),
    ("https://cbseacademic.nic.in/web_material/SQP/ClassX_2025_26/SocialScience-SQP.pdf", "CBSE-Class10-SocialScience-2026-SQP.pdf"),
    ("https://cbseacademic.nic.in/web_material/SQP/ClassX_2025_26/SocialScience-MS.pdf", "CBSE-Class10-SocialScience-2026-MS.pdf"),
    ("https://cbseacademic.nic.in/web_material/SQP/ClassX_2025_26/EnglishL-SQP.pdf", "CBSE-Class10-English-2026-SQP.pdf"),
    ("https://cbseacademic.nic.in/web_material/SQP/ClassX_2025_26/EnglishL-MS.pdf", "CBSE-Class10-English-2026-MS.pdf"),
]

for url, filename in papers:
    dest = os.path.join(out_dir, filename)
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, context=ctx, timeout=30) as resp:
            data = resp.read()
            if data.startswith(b'%PDF'):
                with open(dest, 'wb') as f:
                    f.write(data)
                kb = len(data) / 1024
                mb = kb / 1024
                s = f"{mb:.1f} MB" if mb >= 1.0 else f"{int(kb)} KB"
                print(f"[OK] {filename}: {s} ({len(data)} bytes)")
            else:
                print(f"[NON-PDF] {filename}: {data[:40]}")
    except Exception as e:
        print(f"[FAIL] {filename}: {e}")
