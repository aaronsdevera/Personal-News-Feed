function return_html_index(headlines_ul: string): string {
    return `<html>
<head>
    <title>Newsfeed | aaronsdevera.com</title>
    <meta name="description" content="Personal news feed curated from several sources." />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" href="/favicon.ico" />

    <style>
        :root {
        --max-width: 1100px;
        --border-radius: 12px;
        --font-mono: ui-monospace, Menlo, Monaco, 'Cascadia Mono', 'Segoe UI Mono',
          'Roboto Mono', 'Oxygen Mono', 'Ubuntu Monospace', 'Source Code Pro',
          'Fira Mono', 'Droid Sans Mono', 'Courier New', monospace;
        --font-family: 'Arial', 'Helvetica', 'sans-serif';
        --foreground-rgb: 0, 0, 0;
        --background-rgb: 255, 255, 255;
        --foreground-rgb-dark: 255, 255, 255;
        --background-rgb-dark: 0, 0, 0;
      }
      
      @media (prefers-color-scheme: dark) {
        :root {
          --foreground-rgb: 0, 0, 0;
          --background-rgb: 255, 255, 255;
        }
      }
      
      * {
        box-sizing: border-box;
        padding: 0;
        margin: 0;
      }
      
      html,
      body {
        max-width: 100vw;
        overflow-x: hidden;
        font-family: var(--font-family);
      }
      
      body {
        background: rgb(var(--background-rgb));
        color: rgb(var(--foreground-rgb));
      }
      
      a {
        color: rgb(var(--foreground-rgb));
        text-decoration: none;
      }
      
      @media (prefers-color-scheme: dark) {
        html {
          color-scheme: dark;
        }
      }
      
      
      a:hover {
        background-color: #000000;
        color:#ffffff;
      }
      
      
      .header {
        padding: 0px;
        text-align: left;
        margin-top:0px;
        margin-bottom: 50px;
      }
      
      .headerItem {
        display: inline-block;
        padding: 0px 2.5px 15px 2.5px;
      }
      
      .site-title {
        background: #0000ff;
        color:#ffffff;
        padding:5px;
      }
      
      .site-title:hover{
        background: #0000aa;
      }
      
      .site-time {
        background: #ff0000;
        color:#ffffff;
        padding:5px;
      }
      
      .site-mode {
        background: rgb(var(--background-rgb-dark));
        color:#ffffff;
        padding:5px;
      }
      
      .site-tag {
        padding:5px;
      }
      
      .site-tag input {
        border:none;
        width:160px;
        font-weight: bold;
      }
      
      .site-tag input::placeholder {
        color: #afafaf;
      }
      
      .site-tag input:focus{
        outline: none;
      }
      
      .tag-highlight {
        background: #0000ff;
        color:#ffffff;
      }
      
      #highlight-results{
        padding:0px 4px 0px 4px;
      }
      
      .feed ul {
        list-style: none;
        padding:0px;
      }
      
      .feed-item  {
        padding-top: 3px;
        padding-bottom: 3px;
      }
      
      
      /*
      .feed-tag  {
        font-size:8px;
        background: #cccccc;
        margin-left:4px;
      }
      */
      
      .feed-tag  {
        margin: 3px;
        padding: 2px;
        margin-top: 3px;
      }
      
      .tag-highlight {
        background: #0000ff;
        color:#ffffff;
      }
      
      .feed-item-sourcename {
        font-size:8px;
        background: #0000ff;
        color:#ffffff;
      }
      
      .feed-item-sourcetype {
        font-size:8px;
        background: #0000ff;
        color:#ffffff;
      }
      
      .feed-item-createdat {
        font-size:8px;
        background: #cccccc;
      }
      
      
      .tag-highlight {
        background: #ff0000;
        color:#ffffff;
      }
      
      #highlight-results{
        background:#000000;
        color:#aaaaaa;
        padding:0px 4px 0px 4px;
      }
      
      footer {
        margin-top: 0px;
        margin-bottom:50px;
        padding: 10px;
        text-align: center;
        font-size: 12px;
        color: #aaaaaa;
      }
      
      .light-mode-text {
        color: rgb(var(--foreground-rgb));
      }
      
      .dark-mode-text {
        color: rgb(var(--foreground-rgb-dark));
      }
      
      .light-mode-background {
        background: rgb(var(--background-rgb));
      }
      
      .dark-mode-background {
        background: rgb(var(--background-rgb-dark));
      }

      .main {
        top:0px;
        margin-top: 0px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        padding: 6rem;
        min-height: 100vh;
      }
      
      .description {
        display: inherit;
        justify-content: inherit;
        align-items: inherit;
        font-size: 0.85rem;
        max-width: var(--max-width);
        width: 100%;
        z-index: 2;
        font-family: var(--font-mono);
      }
      
      .description a {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
      }
      
      .description p {
        position: relative;
        margin: 0;
        padding: 1rem;
        background-color: rgba(var(--callout-rgb), 0.5);
        border: 1px solid rgba(var(--callout-border-rgb), 0.3);
        border-radius: var(--border-radius);
      }
      
      .code {
        font-weight: 700;
        font-family: var(--font-mono);
      }
      
      .grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(25%, auto));
        width: var(--max-width);
        max-width: 100%;
      }
      
      .card {
        padding: 1rem 1.2rem;
        border-radius: var(--border-radius);
        background: rgba(var(--card-rgb), 0);
        border: 1px solid rgba(var(--card-border-rgb), 0);
        transition: background 200ms, border 200ms;
      }
      
      .card span {
        display: inline-block;
        transition: transform 200ms;
      }
      
      .card h2 {
        font-weight: 600;
        margin-bottom: 0.7rem;
      }
      
      .card p {
        margin: 0;
        opacity: 0.6;
        font-size: 0.9rem;
        line-height: 1.5;
        max-width: 30ch;
      }
      
      .center {
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        padding: 4rem 0;
      }
      
      .center::before {
        background: var(--secondary-glow);
        border-radius: 50%;
        width: 480px;
        height: 360px;
        margin-left: -400px;
      }
      
      .center::after {
        background: var(--primary-glow);
        width: 240px;
        height: 180px;
        z-index: -1;
      }
      
      .center::before,
      .center::after {
        content: '';
        left: 50%;
        position: absolute;
        filter: blur(45px);
        transform: translateZ(0);
      }
      
      .logo,
      .thirteen {
        position: relative;
      }
      
      
      /* Enable hover only on non-touch devices */
      @media (hover: hover) and (pointer: fine) {
        .card:hover {
          background: rgba(var(--card-rgb), 0.1);
          border: 1px solid rgba(var(--card-border-rgb), 0.15);
        }
      
        .card:hover span {
          transform: translateX(4px);
        }
      }
      
      @media (prefers-reduced-motion) {
        .thirteen::before {
          animation: none;
        }
      
        .card:hover span {
          transform: none;
        }
      }
      
      /* Mobile */
      @media (max-width: 700px) {
        .content {
          padding: 4rem;
        }
      
        .grid {
          grid-template-columns: 1fr;
          margin-bottom: 120px;
          max-width: 320px;
          text-align: center;
        }
      
        .card {
          padding: 1rem 2.5rem;
        }
      
        .card h2 {
          margin-bottom: 0.5rem;
        }
      
        .center {
          padding: 8rem 0 6rem;
        }
      
        .center::before {
          transform: none;
          height: 300px;
        }
      
        .description {
          font-size: 0.8rem;
        }
      
        .description a {
          padding: 1rem;
        }
      
        .description p,
        .description div {
          display: flex;
          justify-content: center;
          position: fixed;
          width: 100%;
        }
      
        .description p {
          align-items: center;
          inset: 0 0 auto;
          padding: 2rem 1rem 1.4rem;
          border-radius: 0;
          border: none;
          border-bottom: 1px solid rgba(var(--callout-border-rgb), 0.25);
          background: linear-gradient(
            to bottom,
            rgba(var(--background-start-rgb), 1),
            rgba(var(--callout-rgb), 0.5)
          );
          background-clip: padding-box;
          backdrop-filter: blur(24px);
        }
      
        .description div {
          align-items: flex-end;
          pointer-events: none;
          inset: auto 0 0;
          padding: 2rem;
          height: 200px;
          background: linear-gradient(
            to bottom,
            transparent 0%,
            rgb(var(--background-end-rgb)) 40%
          );
          z-index: 1;
        }
      }
      
      /* Tablet and Smaller Desktop */
      @media (min-width: 701px) and (max-width: 1120px) {
        .grid {
          grid-template-columns: repeat(2, 50%);
        }
      }
      
      @media (prefers-color-scheme: dark) {
        .vercelLogo {
          filter: invert(1);
        }
      
        .logo,
        .thirteen img {
          filter: invert(1) drop-shadow(0 0 0.3rem #ffffff70);
        }
      }
      
      @keyframes rotate {
        from {
          transform: rotate(360deg);
        }
        to {
          transform: rotate(0deg);
        }
      }
      
      </style>
</head>
<body>
    <div id="main" class="main">
        <div class="header">
          <div class="headerItem">
            <a href="https://github.com/aaronsdevera/Personal-News-Feed"><h3><span class="site-title">NewsFeed</span></h3></a>
          </div>
          <div class="headerItem">
            <h3><span id="insert-time" class="site-time"></span></h3>
          </div>
          <div class="headerItem">
            <h3><span id="insert-mode" class="site-mode">toggle dark</span></h3>
          </div>
          <div class="headerItem">
            <h3><span id="insert-tag" class="site-tag dark-mode-text dark-mode-background"><input id="site-tag-input" class="dark-mode-background" placeholder="insert a term to highlight"></input><span id="highlight-results" class="light-mode-text dark-mode-background"></span></span></h3>
          </div>
        </div>

        <div class="feed">
            <ul id="feed-ul"></ul>
        </div>
      </div>
    <script>const headlines=${headlines_ul}</script>
    <script>
    headlines.map((entry) => (
        document.getElementById('feed-ul').innerHTML += '<li class=feed-item key=' + entry.id + '><a class="feed-item-headline" href="' + entry.url + '">' + entry.headline + '</a><span class="feed-tag feed-item-sourcename">' + entry.source_name + '</span><span class="feed-tag feed-item-sourcetype">' + entry.source_type + '</span><span class="feed-tag feed-item-createdat light-mode-text">' + entry.created_at + '</span></li>'
    ));
    let MODE=0;document.getElementById("insert-time").innerHTML = new Date().toISOString();
    
document.getElementById('site-tag-input').addEventListener('keyup', (event) => {
    var count = 0;
    const highlighted = document.querySelectorAll('.tag-highlight');
    highlighted.forEach((list_item) => {
        list_item.classList.remove('tag-highlight');
    })
  
    const currentValue = document.getElementById('site-tag-input').value;
    const elements = document.querySelectorAll('.feed li a')
    elements.forEach((list_item) => {
        if (String(list_item.innerHTML).toLowerCase().includes(currentValue.toLowerCase())) {
            list_item.classList.add('tag-highlight')
            count += 1
            document.getElementById('highlight-results').innerHTML = (count.toString() + ' results')
        }
    })
    if (document.getElementById('site-tag-input').value === ''){
        const highlighted = document.querySelectorAll('.tag-highlight');
        highlighted.forEach((list_item) => {
            list_item.classList.remove('tag-highlight');
        })
        document.getElementById('highlight-results').innerHTML = '';
    }
});const switchMode = function(mode) {
  if(!mode) {
    document.getElementById('insert-mode').classList.remove("dark-mode-text");
    document.getElementById('insert-mode').classList.remove("dark-mode-background");
    document.body.classList.remove("light-mode-text");
    document.body.classList.remove("light-mode-background");
    document.getElementById('insert-tag').classList.remove("dark-mode-background");
    document.getElementById('site-tag-input').classList.remove("dark-mode-background");
    document.getElementById('highlight-results').classList.remove("dark-mode-text");
    document.getElementById('highlight-results').classList.remove("dark-mode-background");

    var headlineItems = document.getElementsByClassName('feed-item-headline');
    for (let i = 0; i < headlineItems.length; i++) {
      headlineItems[i].classList.remove("light-mode-text");
    }

    document.getElementById('insert-mode').classList.add("light-mode-text");
    document.getElementById('insert-mode').classList.add("light-mode-background");
    document.body.classList.add("dark-mode-text");
    document.body.classList.add("dark-mode-background");
    document.getElementById('insert-tag').classList.add("light-mode-background");
    document.getElementById('highlight-results').classList.add("light-mode-text");
    document.getElementById('highlight-results').classList.add("light-mode-background");
    document.getElementById('site-tag-input').classList.add("light-mode-text");
    document.getElementById('site-tag-input').classList.add("light-mode-background");

    document.getElementById('insert-tag').classList.add("light-mode-background");
    for (let i = 0; i < headlineItems.length; i++) {
      headlineItems[i].classList.add("dark-mode-text");
    }

    mode = 1;
  }
  else if (mode) {
    document.getElementById('insert-mode').classList.remove("light-mode-text");
    document.getElementById('insert-mode').classList.remove("light-mode-background");
    document.body.classList.remove("dark-mode-text");
    document.body.classList.remove("dark-mode-background");
    document.getElementById('insert-tag').classList.remove("light-mode-background");
    document.getElementById('highlight-results').classList.remove("light-mode-text");
    document.getElementById('highlight-results').classList.remove("light-mode-background");
    document.getElementById('site-tag-input').classList.remove("light-mode-text");
    document.getElementById('site-tag-input').classList.remove("light-mode-background");

    document.getElementById('insert-tag').classList.add("light-mode-background");
    
    var headlineItems = document.getElementsByClassName('feed-item-headline');
    for (let i = 0; i < headlineItems.length; i++) {
      headlineItems[i].classList.remove("dark-mode-text");
    }


    document.getElementById('insert-mode').classList.add("dark-mode-text");
    document.getElementById('insert-mode').classList.add("dark-mode-background");
    document.body.classList.add("light-mode-text");
    document.body.classList.add("light-mode-background");
    document.getElementById('insert-tag').classList.add("dark-mode-background");
    document.getElementById('site-tag-input').classList.add("dark-mode-background");
    document.getElementById('highlight-results').classList.add("dark-mode-text");
    document.getElementById('highlight-results').classList.add("dark-mode-background");

    var headlineItems = document.getElementsByClassName('feed-item-headline');
    for (let i = 0; i < headlineItems.length; i++) {
      headlineItems[i].classList.add("light-mode-text");
    }

    mode = 0;
  }
  return mode
};
document.getElementById('insert-mode').addEventListener('click', (event) => {MODE = switchMode(MODE);});
</script>
<noscript><img src="https://s.onsitejs.org/hdrVxDZ/image.gif" style="display:none;"/></noscript><script src="https://s.onsitejs.org/hdrVxDZ/script.js"></script>
<footer><center><a href="https://web.archive.org/web/20230313014147/https://github.com/aaronsdevera/Personal-News-Feed">(haphazardly) designed by Aaron DeVera. GNU-AGPLv3</a></center></footer>
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

async function search(env: Env, auth_headers: Object, query: string = '*', size: number = 250): Promise<any> {
    const url = `${env.DATA_SINK_URL}/search/newsfeed-headlines`;
    const resp = await fetch(url, {
        method: 'POST',
        headers: auth_headers,
        body: JSON.stringify({
            sort: [
                { "created_at" : {"order" : "desc", "format": "date"}}
            ],
            query: {
                query_string: {
                    query: query
                }
            },
            size: size
        })
    });
    const json = await resp.json();
    return json;
}

async function get_headlines(env: Env, auth_headers: Object, source_name: string = '', source_type: string = '', size: number = 250): Promise<Array> {
    let resp: Promise<any>;
    if (source_name !== '' && source_type === '') {
        resp = await search(env, auth_headers, `source_name:"${source_name}"`, 100);
    }
    else if (source_name === '' && source_type !== '') {
        resp = await search(env, auth_headers, `source_type:"${source_type}"`, 200);
    }
    else {
        resp = await search(env, auth_headers, '*', size);
    }
    const hits = resp.hits.hits;
    const headlines = [];
    for (const hit of hits) {
        headlines.push(hit._source);
    }
    return headlines;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        const url = new URL(request.url);
        const path = url.pathname;

        let auth_headers = {};
        auth_headers[env.AUTH_HEADER_ONE_KEY] = env.AUTH_HEADER_ONE_VALUE;
        auth_headers[env.AUTH_HEADER_TWO_KEY] = env.AUTH_HEADER_TWO_VALUE;


        if (path === '/') {
            const headlines = await get_headlines(env, auth_headers);
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