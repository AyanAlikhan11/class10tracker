import urllib.request

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

test_filenames = [
    # SST variants
    'cbse-class-10-social-science-notes-chapter-1.pdf',
    'cbse-class-10-social-science-chapter-1.pdf',
    'cbse-class-10-history-notes-chapter-1.pdf',
    'cbse-class-10-history-chapter-1.pdf',
    'cbse-class-10-geography-notes-chapter-1.pdf',
    'cbse-class-10-geography-chapter-1.pdf',
    'cbse-class-10-civics-notes-chapter-1.pdf',
    'cbse-class-10-economics-notes-chapter-1.pdf',
    'cbse-class-10-sst-chapter-1.pdf',
    'class-10-sst-notes-chapter-1.pdf',
    'class-10-social-science-notes-chapter-1.pdf',
    'ncert-class-10-history-chapter-1.pdf',
    'ncert-class-10-geography-chapter-1.pdf',
    # English variants
    'cbse-class-10-english-notes-chapter-1.pdf',
    'cbse-class-10-english-first-flight-chapter-1.pdf',
    'cbse-class-10-english-chapter-1.pdf',
    'class-10-english-notes-chapter-1.pdf',
    'class-10-english-first-flight-chapter-1.pdf',
    'ncert-class-10-english-chapter-1.pdf',
    'ncert-class-10-first-flight-chapter-1.pdf',
    'first-flight-chapter-1.pdf',
    'a-letter-to-god.pdf',
]

for name in test_filenames:
    url = f"https://ncert24.com/assets/ots/pdf/{name}"
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=3) as resp:
            data = resp.read(200)
            if data.startswith(b'%PDF'):
                print(f"FOUND: {name} (size: {len(data)})")
    except Exception:
        pass
print("Done probing SST/English.")
