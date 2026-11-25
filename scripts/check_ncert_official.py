import urllib.request
import ssl

ctx = ssl._create_unverified_context()
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

ncert_urls = [
    ('sst-ch1', 'https://ncert.nic.in/textbook/pdf/jess301.pdf'),
    ('sst-ch2', 'https://ncert.nic.in/textbook/pdf/jess302.pdf'),
    ('sst-ch3', 'https://ncert.nic.in/textbook/pdf/jess101.pdf'),
    ('english-ch1', 'https://ncert.nic.in/textbook/pdf/jeff101.pdf'),
]

for label, url in ncert_urls:
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
            data = resp.read(200)
            print(f"{label}: {resp.status}, is_pdf: {data.startswith(b'%PDF')}")
    except Exception as e:
        print(f"{label} error: {e}")
