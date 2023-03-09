import os
import sys
import json
import feedparser
import requests
import hashlib
import dateutil
import pandas as pd

DATA_SINK_URL = os.environ.get('DATA_SINK_URL')
DATA_SINK_API_KEY = os.environ.get('DATA_SINK_API_KEY')

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

    r = requests.post(
        DATA_SINK_URL,
        json=payload,
        headers={
            'apikey': DATA_SINK_API_KEY,
            'authorization': f'Bearer {DATA_SINK_API_KEY}'
        }
    )
    return r

def check_url(url: str, headline: str):
    url_sha256 = sha256_hash(url)
    headline_sha256 = sha256_hash(headline)
    r = requests.get(f'{DATA_SINK_URL}?url_sha256=eq.{url_sha256}&headline_sha256=eq.{headline_sha256}&select=*',
        headers={
            'apikey': DATA_SINK_API_KEY,
            'authorization': f'Bearer {DATA_SINK_API_KEY}'
        }
    )
    data = r.json()
    if len(data) > 0:
        return True
    else:
        return False

def poll_feed(source_name: str, source_type: str, feed_url: str):
    feed = feedparser.parse(feed_url)
    for entry in feed.entries:
        headline = entry.title
        url = entry.link
        created_at = None
        try:
            created_at = entry.published
            created_at = dateutil.parser.parse(created_at).isoformat()
        except:
            pass
        if not check_url(url,headline):
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
        source_name = source['source_name']
        source_type = source['source_type']
        feed_url = source['feed_url']
        poll_feed(source_name, source_type, feed_url)