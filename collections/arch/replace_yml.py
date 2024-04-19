import os
import sys

FIND = sys.argv[1]
REPLACE = sys.argv[2]

workflows = os.listdir('../.github/workflows')

for workflow in workflows:
    if workflow.startswith('run-'):
        if workflow.endswith('.yml'):
            print(f'Processing {workflow}')
            template = open(f'../.github/workflows/{workflow}').read()
            template = template.replace(FIND,REPLACE)
            open(f'../.github/workflows/{workflow}','w+').write(template)
