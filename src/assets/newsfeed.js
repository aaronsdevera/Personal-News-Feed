var today = new Date();
var time = today.toISOString();
document.getElementById('insert-time').innerHTML = time;

const HN_BASE_URL = 'https://hacker-news.firebaseio.com/v0'
const HN_ENDPOINT_TOPSTORIES = '/topstories.json'
const HN_ENDPOINT_ITEM = `/item/` // must append id.json e.g. 12345.json

function makeURL(endpoint){
    if (endpoint === 'topstories'){
        return `${HN_BASE_URL}${HN_ENDPOINT_TOPSTORIES}`
    }
    if (typeof(endpoint) === 'number'){
        return `${HN_BASE_URL}${HN_ENDPOINT_ITEM}${endpoint}.json`
    }
}

var itemElement_HN = document.getElementById("feed-hn");

fetch(makeURL('topstories'), {
    method: 'get',
    headers: {
        'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4695.0 Safari/537.36'
    },
}).then(response => response.json()).then(ids => {
    ids.slice(0, 40).forEach(element => {
    fetch(makeURL(element))
        .then(result => result.json())
        .then(item => {
            var item_url = ''
            var hostname = ''
            try{
                item_url = new URL(item.url)
            } catch {}
            try {
                hostname = item_url.hostname.replace('www.','')
            } catch {}
            
            itemElement_HN.innerHTML += `<li class="feed-hn-item"><a class="feed-hn-item-url" href="${item.url}">${item.title}</a><span class="feed-tag feed-hn-item-hostname">${hostname}</span></li>`
        })
    })
});

const BBG_URL = 'https://cors-proxy.aaronsdevera.workers.dev/?https://nitter.net/business/rss';
let bbg_parser = new RSSParser({
    headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4695.0 Safari/537.36'},
  });
var itemElement_BBG = document.getElementById("feed-bbg");
(async () => {
  let bbg_feed = await bbg_parser.parseURL(BBG_URL);
  bbg_feed.items.forEach(item => {
    const title = `${item.title}`
    const text = title.split('https://trib.al')[0]
    const link_uri = title.split('https://trib.al')[1].split(' ')[0]
    const text_link = `https://trib.al`+link_uri
    itemElement_BBG.innerHTML += `<li class="feed-bbg-item"><a class="feed-bbg-item-url" href="${text_link}">${text}</a><span class="feed-tag feed-bbg-item-pubdate">${item.pubDate}</span></li>`
  });
})();

const AT_URL = 'https://cors-proxy.aaronsdevera.workers.dev/?https://feeds.feedburner.com/arstechnica/index';
let at_parser = new RSSParser();
var itemElement_AT = document.getElementById("feed-at");
(async () => {
  let at_feed = await at_parser.parseURL(AT_URL);
  at_feed.items.forEach(item => {
    itemElement_AT.innerHTML += `<li class="feed-at-item"><a class="feed-at-item-url" href="${item.link}">${item.title}</a><span class="feed-tag feed-at-item-pubdate">${item.pubDate}</span></li>`
  });
})();



const VERGE_URL = "https://cors-proxy.aaronsdevera.workers.dev/?https://www.theverge.com/rss/index.xml"
let verge_parser = new RSSParser();
var itemElement_VERGE = document.getElementById("feed-verge");
(async () => {
  let verge_feed = await verge_parser.parseURL(VERGE_URL);
  verge_feed.items.forEach(item => {
    itemElement_VERGE.innerHTML += `<li class="feed-verge-item"><a class="feed-verge-item-url" href="${item.link}">${item.title}</a><span class="feed-tag feed-verge-item-pubdate">${item.pubDate}</span></li>`
  });
})();

const NYT_URL = "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml"
let nyt_parser = new RSSParser();
var itemElement_NYT = document.getElementById("feed-nyt");
(async () => {

    let nyt_feed = await nyt_parser.parseURL(NYT_URL);
  
    nyt_feed.items.forEach(item => {
        itemElement_NYT.innerHTML += `<li class="feed-nyt-item"><a class="feed-nyt-item-url" href="${item.link}">${item.title}</a><span class="feed-tag feed-nyt-item-pubdate">${item.pubDate}</span></li>`
    });
  })();



const WSJ_URL = "https://cors-proxy.aaronsdevera.workers.dev/?https://feeds.a.dj.com/rss/RSSMarketsMain.xml"
let wsj_parser = new RSSParser();
var itemElement_WSJ = document.getElementById("feed-wsj");
(async () => {

    let wsj_feed = await wsj_parser.parseURL(WSJ_URL);
  
    wsj_feed.items.forEach(item => {
        itemElement_WSJ.innerHTML += `<li class="feed-wsj-item"><a class="feed-wsj-item-url" href="${item.link}">${item.title}</a><span class="feed-tag feed-wsj-item-pubdate">${item.pubDate}</span></li>`
    });
  })();



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
            document.getElementById('highlight-results').innerHTML = `${count} results`
        }
    })
    if (document.getElementById('site-tag-input').value === ''){
        const highlighted = document.querySelectorAll('.tag-highlight');
        highlighted.forEach((list_item) => {
            list_item.classList.remove('tag-highlight');
        })
        document.getElementById('highlight-results').innerHTML = '';
    }
});