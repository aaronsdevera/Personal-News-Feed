# Personal-News-Feed
Personal news feed aggregator:

**[newsfeed.aaronsdevera.com](https://newsfeed.aaronsdevera.com)**

![Screenshot of my personal news feed website](https://newsfeed.aaronsdevera.com/assets/newsfeed-screenshot.png)

**Some of my favorite sources**
- [Bloomberg](https://bloomberg.com)
- [HackerNews](https://news.ycombinator.com)
- [ArsTechnica](https://arstechnica.com)
- [The Verge](https://theverge.com)
- [New York Times](https://nytimes.com)
- [Wall Street Journal](https://wsj.com)

**Built with**
- [Eleventy](https://www.11ty.dev/)
- [Cloudflare Pages](https://pages.cloudflare.com/)
- [Cloudflare Worker CORS proxy](https://developers.cloudflare.com/workers/examples/cors-header-proxy)
- [Nitter](https://nitter.net/)

**Running site in dev mode**
```
eleventy --input=src/ --serve
```

**Deployment**
Automatically build and deployed with new `git push` events to `main` branch; see Cloudflare Pages