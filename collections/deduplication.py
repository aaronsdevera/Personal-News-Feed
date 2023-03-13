import os
import json
import requests
import pandas as pd

NEWSFEED_URL = os.environ.get("NEWSFEED_URL")
NEWSFEED_KEY = os.environ.get("NEWSFEED_KEY")

def get_records_by_url_sha256(url_sha256: str):
    HEADERS = {
        'apikey': NEWSFEED_KEY,
        'Authorization': f'Bearer {NEWSFEED_KEY}',
        'Content-Type': 'application/json'
    }
    r = requests.get(f'{NEWSFEED_URL}/rest/v1/headlines?url_sha256=eq.{url_sha256}&select=*&',
        headers=HEADERS
    )
    return r.json()

def delete_record_by_id(id: str):
    HEADERS = {
        'apikey': NEWSFEED_KEY,
        'Authorization': f'Bearer {NEWSFEED_KEY}',
        'Content-Type': 'application/json'
    }
    r = requests.delete(f'{NEWSFEED_URL}/rest/v1/headlines?id=eq.{id}',
        headers=HEADERS
    )
    return r

df = pd.read_csv('hashes.csv')

hashes = df.loc[df['volume'] > 1]

hashes = hashes.to_dict(orient='records')

for each in hashes:
    hash = each['url_sha256']
    records = get_records_by_url_sha256(hash)
    record_ids = [record['id'] for record in records]
    # KEEP THE EARLIEST RECORD AND MARK THE OTHERS FOR DELETION
    record_ids_to_delete = record_ids[1:]
    for record_id in record_ids_to_delete:
        d = delete_record_by_id(record_id)
        print(f'[!] Deletion of record {record_id}: status {d.status_code}')
