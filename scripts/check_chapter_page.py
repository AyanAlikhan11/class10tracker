import urllib.request
import re

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

req = urllib.request.Request('https://ncert24.com/revision-notes/cbse-class-10-science-notes-chapter-1', headers=headers)
html = urllib.request.urlopen(req, timeout=10).read().decode('utf-8', errors='ignore')

# find where "Chemical Reactions and Equations" starts
pos = html.find('Chemical Reactions and Equations')
if pos != -1:
    print("Content snippet from post:")
    print(html[pos:pos+4000])

# check for any buttons, forms, download links
downloads = re.findall(r'<a[^>]+(?:download|href)[^>]+>.*?</a>', html[pos:pos+10000], re.IGNORECASE)
for d in downloads[:10]:
    print("Download element:", d)
