import json
import pandas as pd
import datetime
import uuid
import sys

# function to generate uuid
def generate_uuid():
    return str(uuid.uuid4())

if __name__ == '__main__':
    
    INFILE  = sys.argv[1] if len(sys.argv) > 1 else 'sources.json'

    sources = json.load(open(INFILE))

    df = pd.json_normalize(sources)

    new_source = {
        'active': True,
        'created_at': datetime.datetime.now().isoformat(),
        'id': generate_uuid(),
        'rank': sources[-1]['rank'] + 1
    }

    source_name = input('Enter source name: ')
    source_type = input('Enter source type (e.g.: news,business,tech,politics,research,blog): ')
    url = input('Enter feed url: ')

    new_source.update({
        'source_name': source_name,
        'source_type': source_type,
        'url': url
    })

    print(new_source)
    commit = input('Do you want to add this source? (y/n)')

    if commit.lower() == 'y':
        sources.append(new_source)
        open(INFILE,'w+').write(json.dumps(sources, indent=4))
        print('Source added successfully')
    