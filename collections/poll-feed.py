import os
import sys
import json
import feedparser
import requests
import hashlib
import dateutil
import pandas as pd
import datetime

DATA_SINK_URL = os.environ.get('DATA_SINK_URL')
AUTH_HEADER_ONE_KEY = os.environ.get('AUTH_HEADER_ONE_KEY')
AUTH_HEADER_ONE_VALUE = os.environ.get('AUTH_HEADER_ONE_VALUE')
AUTH_HEADER_TWO_KEY = os.environ.get('AUTH_HEADER_TWO_KEY')
AUTH_HEADER_TWO_VALUE = os.environ.get('AUTH_HEADER_TWO_VALUE')

# function to take sha256 hash of a string
def sha256_hash(string: str):
    return hashlib.sha256(string.encode()).hexdigest()

def sink_data(source_name: str, source_type: str, headline: str, url: str, created_at: str = None):
    payload = {
        'source_name': source_name,
        'source_name_sha256': sha256_hash(source_name),
        'source_type': source_type,
        'source_type_sha256': sha256_hash(source_type),
        'headline': headline,
        'headline_sha256': sha256_hash(headline),
        'url': url,
        'url_sha256': sha256_hash(url)
    }
    if created_at:
        payload.update({'created_at': created_at})
    else:
        payload.update({'created_at': datetime.datetime.utcnow().isoformat()})
    
    r = requests.post(
        f'{DATA_SINK_URL}/index/newsfeed-headlines',
        json=payload,
        headers={
            AUTH_HEADER_ONE_KEY: AUTH_HEADER_ONE_VALUE,
            AUTH_HEADER_TWO_KEY: AUTH_HEADER_TWO_VALUE
        }
    )
    return r

def check_url(url: str, headline: str):
    
    url_sha256 = sha256_hash(url)
    headline_sha256 = sha256_hash(headline)
    
    r = requests.post(f'{DATA_SINK_URL}/search/newsfeed-headlines',
        headers={
            AUTH_HEADER_ONE_KEY: AUTH_HEADER_ONE_VALUE,
            AUTH_HEADER_TWO_KEY: AUTH_HEADER_TWO_VALUE
        },
        json={
            'query':f'NOT url_sha256:"{url_sha256}" AND NOT headline_sha256:"{headline_sha256}"'
        }
    )
    data = r.json()
    if len(data['hits']['hits']) > 0:
        return True
    else:
        return False

def poll_feed(source_name: str, source_type: str, feed_url: str):
    feed = feedparser.parse(feed_url)
    for entry in feed.entries:
        headline = None
        try:
            headline = entry.title
        except:
            pass
        url = None
        try:
            url = entry.link
        except:
            pass
        created_at = None
        try:
            created_at = entry.published
            created_at = dateutil.parser.parse(created_at).isoformat()
        except:
            pass
        if not check_url(url,headline):
            if source_name and source_type and headline and url:
                r = sink_data(
                    source_name=source_name,
                    source_type=source_type,
                    headline=headline,
                    url=url,
                    created_at=created_at
                )
                if r.status_code not in (201,200):
                    print(f'Error: {r.status_code} {r.text}')

def run():
    sources = json.load(open('rss_sources.json'))
    for source in sources:
        if source['active'] == True:
            source_name = source['source_name']
            source_type = source['source_type']
            feed_url = source['url']
            print(f'Polling {source_name} ({source_type})')
            poll_feed(source_name, source_type, feed_url)

SOURCE_NAME = sys.argv[1]
SOURCE_TYPE = sys.argv[2]
FEED_URL = sys.argv[3]

print(f'Polling {SOURCE_NAME} ({SOURCE_TYPE})')
poll_feed(SOURCE_NAME, SOURCE_TYPE, FEED_URL)

