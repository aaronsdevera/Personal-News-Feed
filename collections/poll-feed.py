import os
import sys
import json
import feedparser
import requests
import hashlib
import dateutil
import pandas as pd
import datetime
import uuid

DATA_SINK_URL = os.environ.get('DATA_SINK_URL')
AUTH_HEADER_ONE_KEY = os.environ.get('AUTH_HEADER_ONE_KEY')
AUTH_HEADER_ONE_VALUE = os.environ.get('AUTH_HEADER_ONE_VALUE')
AUTH_HEADER_TWO_KEY = os.environ.get('AUTH_HEADER_TWO_KEY')
AUTH_HEADER_TWO_VALUE = os.environ.get('AUTH_HEADER_TWO_VALUE')

# function to take sha256 hash of a string
def sha256_hash(string: str):
    return hashlib.sha256(string.encode()).hexdigest()

# function to generate uuid
def generate_uuid():
    return str(uuid.uuid4())

def sink_data(data: dict):
    r = requests.post(
        f'{DATA_SINK_URL}/index/newsfeed-headlines',
        json=data,
        headers={
            AUTH_HEADER_ONE_KEY: AUTH_HEADER_ONE_VALUE,
            AUTH_HEADER_TWO_KEY: AUTH_HEADER_TWO_VALUE
        }
    )
    return r

def check_url(url_sha256: str, headline_sha256: str):
    r = requests.post(f'{DATA_SINK_URL}/search/newsfeed-headlines',
        headers={
            AUTH_HEADER_ONE_KEY: AUTH_HEADER_ONE_VALUE,
            AUTH_HEADER_TWO_KEY: AUTH_HEADER_TWO_VALUE
        },
        json={
            'query': {
                'query_string': {
                    'query': f'url_sha256:"{url_sha256}" OR headline_sha256:"{headline_sha256}"'
                }
            }
        }
    )
    
    try:
        data = r.json()
        try:
            if data['hits']['total']['value'] > 0:
                return True
            else:
                return False
        except:
            print(f'[!] bad response from search: {r.text}')
            return False
    except:
        print('[!] error checking url.')
        return False
    
def produce_feed(source_name: str, source_type: str, feed_url: str):
    poll_id = generate_uuid()
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
            'poll_id': poll_id,
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
            print('Processing source: ' + source['source_name'] + ' [' + source['source_type'] + ']')
            source_name = source['source_name']
            source_type = source['source_type']
            feed_url = source['url']

            for record in produce_feed(source_name, source_type, feed_url):
                print(f'[!] checking record: {record["headline"]}\t{record["url_sha256"]}')
                if not check_url(record['url_sha256'], record['headline_sha256']):
                    
                    r = sink_data(
                        record
                    )
                    print(r.json())
                else:
                    print('[!] record already exists')