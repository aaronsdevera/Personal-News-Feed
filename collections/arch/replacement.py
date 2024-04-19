import os

dirname = './.github/workflows'

for filename in os.listdir(dirname):
    if filename.endswith('.yml') and 'disabled' not in filename and 'tmp' not in filename:
        with open(os.path.join(dirname, filename), 'r') as f:
            content = f.read()
        content = content.replace('  DATA_SINK_API_KEY: ${{ secrets.DATA_SINK_API_KEY }}', '  AUTH_HEADER_ONE_KEY: ${{ secrets.AUTH_HEADER_ONE_KEY }} \n  AUTH_HEADER_ONE_VALUE: ${{ secrets.AUTH_HEADER_ONE_VALUE }} \n  AUTH_HEADER_TWO_VALUE: ${{ secrets.AUTH_HEADER_TWO_VALUE }} \n  AUTH_HEADER_TWO_KEY: ${{ secrets.AUTH_HEADER_TWO_KEY }} ')

        with open(os.path.join(dirname, filename), 'w') as f:
            f.write(content)