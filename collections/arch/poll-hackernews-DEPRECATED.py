import os
import feedparser
import requests
import hashlib
import dateutil
import datetime

DATA_SINK_URL = os.environ.get('DATA_SINK_URL')
DATA_SINK_API_KEY = os.environ.get('DATA_SINK_API_KEY')

source_name = 'Hacker News'
source_type = 'tech'
base_url = 'https://hacker-news.firebaseio.com/v0'
feed_url= f'{base_url}/topstories.json'

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
    # headline_sha256 = sha256_hash(headline)
    # original
    #r = requests.get(f'{DATA_SINK_URL}?url_sha256=eq.{url_sha256}&headline_sha256=eq.{headline_sha256}&select=*',
    #
    r = requests.get(f'{DATA_SINK_URL}?url_sha256=eq.{url_sha256}&select=*',
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
    items = requests.get(feed_url).json()
    for item in items:
        item_url = f'{base_url}/item/{item}.json'
        item_data = requests.get(item_url).json()
        created_at = None
        try:
            created_at = datetime.datetime.fromtimestamp(item_data['time']).isoformat() #dateutil.parser.parse(item_data['time'])
        except:
            pass
        try:
            url = item_data['url']
        except:
            url = f'https://news.ycombinator.com/item?id={item}'

        headline = item_data['title']
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
        
poll_feed(source_name, source_type, feed_url)