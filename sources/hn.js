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

var itemElement = document.getElementById("feed-hn");

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
            itemElement.innerHTML += `<li class="feed-hn-item"><a class="feed-hn-item-url" href="${item.url}">${item.title}</a><span class="feed-hn-item-hostname">${hostname}</span></li>`
        })
    })
});
