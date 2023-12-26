function return_html_index(headlines_ul): string {
    return `<html>
<head>
    <title>Newsfeed</title>
</head>
<body>
    <h1>Newsfeed</h1>

    <div>
        ${headlines_ul}
    </div>
</body>
</html>`
}

async function do_md5(s: string): Promise<string> {
    const msgUint8 = new TextEncoder().encode(s) // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest('MD5', msgUint8) // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer)) // convert buffer to byte array
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('') // convert bytes to hex string
    return hashHex;
}

async function do_sha256(s :string): Promise<string> {
    const msgUint8 = new TextEncoder().encode(s);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const digest = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return digest;
}

async function gen_uid(): Promise<string> {
    const uuid = crypto.randomUUID();
    return await do_md5(uuid);
}

async function gen_session(): Promise<string> {
    const uuid1 = await gen_uid();
    const uuid2 = await gen_uid();
    return `${uuid1}${uuid2}`;
}

function gen_ts(): Number {
    //return Math.trunc((Date.now())/1000);
    return Date.now()/1000;
}

function gen_dt_from_ts(ts: any): Date {
    return new Date(ts*1000);
}

async function search(auth_headers: Object, query: string = '*'): Promise<any> {
    const url = `https://api.doompile.org/search/newsfeed-headlines`;
    const resp = await fetch(url, {
        method: 'POST',
        headers: auth_headers,
        body: JSON.stringify({
            query: query,
        })
    });
    const json = await resp.text();
    return json;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        const url = new URL(request.url);
        const path = url.pathname;

        let auth_headers = {
            `${env.AUTH_HEADER_ONE_KEY}` :env.AUTH_HEADER_ONE_VALUE,
            `${env.AUTH_HEADER_TWO_KEY}` : env.AUTH_HEADER_TWO_VALUE

        };

        console.log(auth_headers)

        if (path === '/') {

            const headlines = await search(auth_headers, '*');

            return new Response(
                return_html_index(JSON.stringify(headlines)),
                {
                    status: 200,
                    headers: {
                        'content-type': 'text/html',
                    }
                }
            );
        }

        return new Response(return_html_index(''),{status: 200});
	},
};