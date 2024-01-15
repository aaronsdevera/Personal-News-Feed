# Personal-News-Feed
Personal news feed aggregator.

**[newsfeed.aaronsdevera.com](https://newsfeed.aaronsdevera.com)**

Inspired by [hackurls](https://hackurls.com/).

![Screenshot of my personal news feed website](https://newsfeed.aaronsdevera.com/newsfeed-screenshot.png)

**Some of my favorite sources**
- [Bloomberg](https://bloomberg.com)
- [HackerNews](https://news.ycombinator.com)
- [ArsTechnica](https://arstechnica.com)
- [The Verge](https://theverge.com)
- [New York Times](https://nytimes.com)
- [Wall Street Journal](https://wsj.com)

You can view a full list of sources [here in the repo](./collections/sources.json).
**Features**
- No dang ads, cookie modals, etc etc
- Clear highlighting of articles with input keyword
- Dumb easy to update

**Built with**
- [Cloudflare Workers](https://workers.cloudflare.com/)
- [GitHub Actions](https://github.com/features/actions)

**Running site in dev mode**
while in the [`site`](site) directory, and assuming you have a `.dev.vars` file with the correct values:
```
wrangler dev --live-reload
```

**Deployment**
To deploy the site, while in the [`site`](site) directory:
```
wrangler deploy
```

**Adding new sources**
The manual way of doing this is to edit [`collections/sources.json`](./collections/sources.json) and add an entry with the `source_name`, `source_type`, and `url` to the RSS feed.