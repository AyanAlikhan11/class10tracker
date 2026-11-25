import urllib.request
import os
import sys

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

out_dir = os.path.join(os.path.dirname(__file__), '..', 'public', 'chapter-notes')
os.makedirs(out_dir, exist_ok=True)

downloads = [
    # Maths chapters from NCERT24
    ("https://ncert24.com/assets/ots/pdf/cbse-class-10-maths-notes-chapter-1.pdf", "maths-ch1-real-numbers-notes.pdf"),
    ("https://ncert24.com/assets/ots/pdf/cbse-class-10-maths-notes-chapter-2.pdf", "maths-ch2-polynomials-notes.pdf"),
    ("https://ncert24.com/assets/ots/pdf/cbse-class-10-maths-notes-chapter-3.pdf", "maths-ch3-linear-equations-notes.pdf"),
    ("https://ncert24.com/assets/ots/pdf/cbse-class-10-maths-notes-chapter-4.pdf", "maths-ch4-quadratic-equations-notes.pdf"),
    ("https://ncert24.com/assets/ots/pdf/cbse-class-10-maths-notes-chapter-5.pdf", "maths-ch5-arithmetic-progressions-notes.pdf"),
    # Science chapters from NCERT24
    ("https://ncert24.com/assets/ots/pdf/cbse-class-10-science-notes-chapter-1.pdf", "science-ch1-chemical-reactions-notes.pdf"),
    ("https://ncert24.com/assets/ots/pdf/cbse-class-10-science-notes-chapter-2.pdf", "science-ch2-acids-bases-salts-notes.pdf"),
    ("https://ncert24.com/assets/ots/pdf/cbse-class-10-science-notes-chapter-5.pdf", "science-ch5-life-processes-notes.pdf"),
    ("https://ncert24.com/assets/ots/pdf/cbse-class-10-science-notes-chapter-9.pdf", "science-ch9-light-reflection-refraction-notes.pdf"),
]

print("Starting download of authentic NCERT24 chapter notes...")
results = {}

for url, filename in downloads:
    dest_path = os.path.join(out_dir, filename)
    print(f"Downloading {url} -> {filename} ...")
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = resp.read()
            if data.startswith(b'%PDF'):
                with open(dest_path, 'wb') as f:
                    f.write(data)
                size_kb = len(data) / 1024
                size_mb = size_kb / 1024
                size_str = f"{size_mb:.1f} MB" if size_mb >= 1.0 else f"{int(size_kb)} KB"
                results[filename] = size_str
                print(f"  [OK] Saved {filename} ({len(data)} bytes, {size_str})")
            else:
                print(f"  [ERROR] {filename} response does not start with %PDF! Got: {data[:50]}")
    except Exception as e:
        print(f"  [FAILED] {filename}: {e}")

print("\n--- Summary of Downloaded Files ---")
for k, v in results.items():
    print(f"  {k}: {v}")
