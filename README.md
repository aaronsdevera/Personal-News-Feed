# Personal-News-Feed
Personal news feed aggregator.

**[newsfeed.aaronsdevera.com](https://newsfeed.aaronsdevera.com)**

Inspired by [hackurls](https://hackurls.com/).

![Screenshot of my personal news feed website](https://newsfeed.aaronsdevera.com/assets/newsfeed-screenshot.png)

**Some of my favorite sources**
- [Bloomberg](https://bloomberg.com)
- [HackerNews](https://news.ycombinator.com)
- [ArsTechnica](https://arstechnica.com)
- [The Verge](https://theverge.com)
- [New York Times](https://nytimes.com)
- [Wall Street Journal](https://wsj.com)

**Features**
- No dang ads, cookie modals, etc etc
- Clear highlighting of articles with input keyword
- Dumb easy to update

**Built with**
- [NextJS](https://nextjs.org/)
- [Vercel](https://vercel.com)
- [Supabase](https://supabase.com/)

**Running site in dev mode**
```
npm run dev
```

**Deployment**
Automatically build and deployed with new `git push` events to `main` branch; see Vercel

**Adding new sources**
Edit [`collections/rss_sources.json`](./collections/rss_sources.json) and add an entry with the `source_name`, `source_type`, and `url` to the RSS feed. Then, run `python3 produce_yml.py` in the `collections` directory to create all the GitHub workflows with the scheduled RSS jobs.