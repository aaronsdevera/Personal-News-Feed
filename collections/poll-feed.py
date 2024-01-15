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
        data=json.dumps(data),
        headers={
            AUTH_HEADER_ONE_KEY: AUTH_HEADER_ONE_VALUE,
            AUTH_HEADER_TWO_KEY: AUTH_HEADER_TWO_VALUE,
            'Content-Type': 'application/json'
        }
    )
    return r

def check_url(url_sha256: str, headline_sha256: str):
    
    query_string = f'url_sha256:"{url_sha256}" OR headline_sha256:"{headline_sha256}"'
    
    body = {
        'query': {
            'query_string': {
                'query': query_string
            }
        }
    }

    headers = {
        AUTH_HEADER_ONE_KEY: AUTH_HEADER_ONE_VALUE,
        AUTH_HEADER_TWO_KEY: AUTH_HEADER_TWO_VALUE
    }
    
    target_url = f'{DATA_SINK_URL}/search/newsfeed-headlines'
    
    try:
        r = requests.post(target_url,
            headers=headers,
            json=body
        )
        
        try:
            data = r.json()
            try:
                if data['hits']['total']['value'] > 0:
                    return True
                else:
                    return False
            except Exception as e:
                print(f'[!] bad response from search: {r.text}')
                pass
        except Exception as e:
            print(f'[!] error checking url: {e}')
            pass
    
    except Exception as e:
        print(f'[!] error making request to data sink url: {e}')
        pass
    
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
            'created_at': created_at,
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
                    print(json.dumps(record))
                    r = sink_data(
                        record
                    )
                else:
                    print('[!] record already exists')