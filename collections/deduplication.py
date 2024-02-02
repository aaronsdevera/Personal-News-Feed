import os
import json
import requests
import pandas as pd

DOOMPILE_API_URL = os.environ.get("DOOMPILE_API_URL")
DOOMPILE_API_ID = os.environ.get("DOOMPILE_API_ID")
DOOMPILE_API_KEY = os.environ.get("DOOMPILE_API_KEY")

def run_sql(query: str):
    HEADERS = {
        'CF-Access-Client-Id': f'{DOOMPILE_API_ID}',
        'CF-Access-Client-Secret': f'{DOOMPILE_API_KEY}'
    }
    BODY = {
        'query': f'{query}'
    }
    r = requests.post(f'{DOOMPILE_API_URL}/sql',
        headers=HEADERS,
        json=BODY
    )
    return r

def run_search(query: str):
    HEADERS = {
        'CF-Access-Client-Id': f'{DOOMPILE_API_ID}',
        'CF-Access-Client-Secret': f'{DOOMPILE_API_KEY}'
    }
    BODY = {
        'query': {
            'query_string': {
                'query': f'{query}'
            }
        }
    }
    r = requests.post(f'{DOOMPILE_API_URL}/search/newsfeed-headlines',
        headers=HEADERS,
        json=BODY
    )
    return r

def get_records_by_url_sha256(url_sha256: str):
    #results = run_sql(f'select * from "newsfeed-headlines" where url_sha256 = \'{url_sha256}\'').json()
    try:
        results = run_search(f'url_sha256:"{url_sha256}"').json()
    except Exception as e:
        print(f'[!] Error: {e}')
        return None
    if 'hits' in list(results.keys()):
        if 'hits' in list(results['hits'].keys()):
            return pd.json_normalize(results['hits']['hits']).to_dict('records')
        else:
            print(f'[!] No hits found: {results}')
    else:
        print(f'[!] No hits found: {results}')
    return None

def delete_record_by_id(id: str):
    HEADERS = {
        'CF-Access-Client-Id': f'{DOOMPILE_API_ID}',
        'CF-Access-Client-Secret': f'{DOOMPILE_API_KEY}'
    }

    r = requests.get(f'{DOOMPILE_API_URL}/delete/newsfeed-headlines/{id}',
        headers=HEADERS
    )
    return r

def get_duplicates():
    results = run_sql('select url_sha256, count(*) as volume from "newsfeed-headlines" group by url_sha256 having count(*) > 1').json()
    return pd.DataFrame(results['rows'], columns=[x['name'] for x in results['columns']]).to_dict('records')

for duplicate_hash in get_duplicates():
    records = get_records_by_url_sha256(duplicate_hash['url_sha256'])
    if records:
        for record in records[:-1]:
            print(f'[!] Deleting record {record["_id"]}')
            r = delete_record_by_id(record['_id'])
            print(f'[+] Status code: {r.status_code}')

print(get_duplicates())