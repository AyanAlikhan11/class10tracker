import urllib.request
import os

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

out_dir = os.path.join(os.path.dirname(__file__), '..', 'public', 'chapter-notes')
os.makedirs(out_dir, exist_ok=True)

downloads = [
    ("https://ncert24.com/assets/ots/pdf/important-questions-for-class-10-history-chapter-1.pdf", "sst-ch1-nationalism-in-europe-notes.pdf"),
    ("https://ncert24.com/assets/ots/pdf/important-questions-for-class-10-history-chapter-2.pdf", "sst-ch2-nationalism-in-india-notes.pdf"),
    ("https://ncert24.com/assets/ots/pdf/important-questions-for-class-10-geography-chapter-1.pdf", "sst-ch3-resources-and-development-notes.pdf"),
    ("https://ncert24.com/assets/ots/pdf/ncert-books-class-10-english-first-flight-chapter-1.pdf", "english-ch1-a-letter-to-god-notes.pdf"),
]

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
                print(f"  [OK] Saved {filename} ({len(data)} bytes, {size_str})")
            else:
                print(f"  [ERROR] {filename} is not PDF! Got {data[:50]}")
    except Exception as e:
        print(f"  [FAILED] {filename}: {e}")

print("\nVerifying all 13 chapter notes files in public/chapter-notes/:")
for fname in sorted(os.listdir(out_dir)):
    if fname.endswith('.pdf'):
        fpath = os.path.join(out_dir, fname)
        size_bytes = os.path.getsize(fpath)
        size_kb = size_bytes / 1024
        size_mb = size_kb / 1024
        size_str = f"{size_mb:.1f} MB" if size_mb >= 1.0 else f"{int(size_kb)} KB"
        print(f"  {fname}: {size_str} ({size_bytes} bytes)")
