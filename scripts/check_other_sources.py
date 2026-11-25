import urllib.request
import ssl

ctx = ssl._create_unverified_context()
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

test_urls = [
    # Edudel Delhi Class 10 Support Material
    "http://www.edudel.nic.in/welcome_folder/support_material_2023_24/10_social_science_em.pdf",
    "http://www.edudel.nic.in/welcome_folder/support_material_2023_24/10_english.pdf",
    # CBSE Academic
    "https://cbseacademic.nic.in/web_material/CurriculumMain25/Secondary/SocialScience_Sec_2024-25.pdf",
]

for url in test_urls:
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, context=ctx, timeout=8) as resp:
            data = resp.read(200)
            print(f"URL: {url} -> {resp.status}, is_pdf: {data.startswith(b'%PDF')}, len: {len(data)}")
    except Exception as e:
        print(f"Error {url}: {e}")
