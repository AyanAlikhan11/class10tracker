import urllib.request

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

test_filenames = [
    'cbse-class-10-sst-notes-chapter-1.pdf',
    'cbse-class-10-social-science-notes-chapter-1.pdf',
    'cbse-class-10-history-chapter-1.pdf',
    'class-10-history-chapter-1.pdf',
    'class-10-english-chapter-1.pdf',
    'cbse-class-10-english-chapter-1.pdf',
    'class-10-science-chapter-1.pdf',
    'cbse-class-10-science-notes-chapter-1.pdf',
    'cbse-class-10-maths-notes-chapter-1.pdf',
    'cbse-class-10-maths-notes-chapter-2.pdf',
    'cbse-class-10-maths-notes-chapter-3.pdf',
    'cbse-class-10-maths-notes-chapter-4.pdf',
    'cbse-class-10-maths-notes-chapter-5.pdf',
    'cbse-class-10-science-notes-chapter-2.pdf',
    'cbse-class-10-science-notes-chapter-5.pdf',
    'cbse-class-10-science-notes-chapter-9.pdf',
]

for name in test_filenames:
    url = f"https://ncert24.com/assets/ots/pdf/{name}"
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = resp.read(200)
            print(f"FOUND: {name} (status {resp.status}, is_pdf: {data.startswith(b'%PDF')})")
    except Exception:
        pass
