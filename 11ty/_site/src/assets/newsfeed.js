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
            const item_url = new URL(item.url)
            const hostname = item_url.hostname.replace('www.','')
            itemElement_HN.innerHTML += `<li class="feed-hn-item"><a class="feed-hn-item-url" href="${item.url}">${item.title}</a><span class="feed-tag feed-hn-item-hostname">${hostname}</span></li>`
        })
    })
});

const NYT_URL = "https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Frss.nytimes.com%2Fservices%2Fxml%2Frss%2Fnyt%2FHomePage.xml"

var itemElement_NYT = document.getElementById("feed-nyt");

fetch(NYT_URL, {
    method: 'get',
    headers: {
        'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4695.0 Safari/537.36'
    },
}).then(response => response.json())
.then(data => data.items)
.then(items => {
    items.slice(0, 40).forEach(item => {
        itemElement_NYT.innerHTML += `<li class="feed-nyt-item"><a class="feed-nyt-item-url" href="${item.link}">${item.title}</a><span class="feed-tag feed-nyt-item-pubdate">${item.pubDate}</span></li>`
    })
});



const NYT_URL_2 = "https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Frss.nytimes.com%2Fservices%2Fxml%2Frss%2Fnyt%2FTechnology.xml"

fetch(NYT_URL_2, {
    method: 'get',
    headers: {
        'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4695.0 Safari/537.36'
    },
}).then(response => response.json())
.then(data => data.items)
.then(items => {
    items.slice(0, 40).forEach(item => {
        itemElement_NYT.innerHTML += `<li class="feed-nyt-item"><a class="feed-nyt-item-url" href="${item.link}">${item.title}</a><span class="feed-tag feed-nyt-item-pubdate">${item.pubDate}</span></li>`
    })
});

const WSJ_URL = "https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Ffeeds.a.dj.com%2Frss%2FRSSMarketsMain.xml"

var itemElement_WSJ = document.getElementById("feed-wsj");

fetch(WSJ_URL, {
    method: 'get',
    headers: {
        'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4695.0 Safari/537.36'
    },
}).then(response => response.json())
.then(data => data.items)
.then(items => {
    items.slice(0, 40).forEach(item => {
        itemElement_WSJ.innerHTML += `<li class="feed-wsj-item"><a class="feed-wsj-item-url" href="${item.link}">${item.title}</a><span class="feed-tag feed-wsj-item-pubdate">${item.pubDate}</span></li>`
    })
});

const WSJ_URL_2 = " https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Ffeeds.a.dj.com%2Frss%2FWSJcomUSBusiness.xml"
fetch(WSJ_URL_2, {
    method: 'get',
    headers: {
        'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4695.0 Safari/537.36'
    },
}).then(response => response.json())
.then(data => data.items)
.then(items => {
    items.slice(0, 40).forEach(item => {
        itemElement_WSJ.innerHTML += `<li class="feed-wsj-item"><a class="feed-wsj-item-url" href="${item.link}">${item.title}</a><span class="feed-tag feed-wsj-item-pubdate">${item.pubDate}</span></li>`
    })
});