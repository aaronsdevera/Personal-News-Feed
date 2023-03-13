import os
import sys
import json
import requests

NEWSFEED_URL = os.environ.get("NEWSFEED_URL")
NEWSFEED_KEY = os.environ.get("NEWSFEED_KEY")

SOURCE_NAME = sys.argv[1]
SOURCE_TYPE = sys.argv[2]
SOURCE_URL = sys.argv[3]

HEADERS = {
    "Content-Type": "application/json",
    "apikey" : NEWSFEED_KEY,
    "Authorization": f"Bearer {NEWSFEED_KEY}"
}

PAYLOAD = {
    "source_name": SOURCE_NAME,
    "source_type": SOURCE_TYPE,
    "url": SOURCE_URL
}

r = requests.post(
    f"{NEWSFEED_URL}/rest/v1/sources",
    headers=HEADERS,
    json=PAYLOAD
)

if r.status_code == 201:
    print("Source added successfully")

    r = requests.get(
        f"{NEWSFEED_URL}/rest/v1/sources",
        headers=HEADERS
    )

    if r.status_code == 200:
        print("Retrieved live list of sources")
        sources = r.json()
        print("Writing updated list of sources")
        open('sources.json','w+').write(json.dumps(sources, indent=4))

        print("Updating rss collector github actions")
        for source in sources:
            source_name = source['source_name']
            source_type = source['source_type']
            feed_url = source['url']
            source_name_lower = source_name.lower()
            source_name_lower_oneword = source_name.lower().replace(' ','_')

            template = open('../.github/workflows/run-tmp.yml.disabled').read()

            template = template.replace('<REPLACE_SOURCE_NAME_TITLE>',source_name_lower)
            template = template.replace('<REPLACE_SOURCE_NAME>',source_name)
            template = template.replace('<REPLACE_SOURCE_TYPE>',source_type)
            template = template.replace('<REPLACE_FEED_URL>',feed_url)
            open(f'../.github/workflows/run-{source_name_lower_oneword}.yml','w+').write(template)
        
        print("Operations complete.")