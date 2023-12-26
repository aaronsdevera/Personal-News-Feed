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

def sink_data(data: dict):
    print('[+] <method called> line 32: sink_data')
    r = requests.post(
        f'{DATA_SINK_URL}/index/newsfeed-headlines',
        json=data,
        headers={
            AUTH_HEADER_ONE_KEY: AUTH_HEADER_ONE_VALUE,
            AUTH_HEADER_TWO_KEY: AUTH_HEADER_TWO_VALUE
        }
    )
    return r

def check_url(url: str, headline: str):
    print('[+] <method called> line 50: check_url')
    url_sha256 = sha256_hash(url)
    headline_sha256 = sha256_hash(headline)
    
    print('[+] <searching elastic> line 54: request.post')
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
    print('[+] <method called> line 71: poll_feed')
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
            print('[+] <logic continues> line 71: check_url')
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

def produce_feed(source_name: str, source_type: str, feed_url: str):
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
        yield {
            'source_name': source_name,
            'source_name_sha256': sha256_hash(source_name),
            'source_type': source_type,
            'source_type_sha256': sha256_hash(source_type),
            'headline': headline,
            'headline_sha256': sha256_hash(headline),
            'url': url,
            'url_sha256': sha256_hash(url)
        }
            
INFILE  = sys.argv[1]
            
if __name__ == '__main__':
    sources = json.load(open(INFILE))
    for source in sources:
        if source['active'] == True:
            source_name = source['source_name']
            source_type = source['source_type']
            feed_url = source['url']

            for record in produce_feed(source_name, source_type, feed_url):
                if check_url(record['url'], record['headline']):
                    sink_data(
                        record
                    )