import json

sources = json.load(open('rss_sources.json'))

for source in sources:
    source_name = source['source_name']
    source_type = source['source_type']
    feed_url = source['url']
    source_name_lower = source_name.lower()
    source_name_lower_oneword = source_name.lower().replace(' ','_')

    template = open('../.github/workflows/run-tmp.yml').read()

    template = template.replace('<REPLACE_SOURCE_NAME_TITLE>',source_name_lower)
    template = template.replace('<REPLACE_SOURCE_NAME>',source_name)
    template = template.replace('<REPLACE_SOURCE_TYPE>',source_type)
    template = template.replace('<REPLACE_FEED_URL>',feed_url)
    open(f'../.github/workflows/run-{source_name_lower_oneword}.yml','w+').write(template)