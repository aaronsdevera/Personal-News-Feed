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

You can view a full list of sources [here in the repo](./collections/sources.json) or go to the live API endpoint: [https://newsfeed.aaronsdevera.com/api/sources](https://newsfeed.aaronsdevera.com/api/sources).

**Features**
- No dang ads, cookie modals, etc etc
- Clear highlighting of articles with input keyword
- Dumb easy to update

**Built with**
- [NextJS](https://nextjs.org/)
- [Vercel](https://vercel.com)
- [Supabase](https://supabase.com/)

**Running site in dev mode**
while in the `webapp` directory:
```
npm run dev
```

**Deployment**
Automatically build and deployed with new `git push` events to `main` branch; see Vercel

**Adding new sources**
Use the `add_source.py` utility, inputting the position arguments `python3 add_source.py <source_name> <source_type> <rss_feed_url>`. This will not only add to the live Supabase database but also create the GitHub action for scheduled polling.

The manual way of doing this is to edit [`collections/sources.json`](./collections/sources.json) and add an entry with the `source_name`, `source_type`, and `url` to the RSS feed. Then, run `python3 produce_yml.py` in the `collections` directory to create all the GitHub workflows with the scheduled RSS jobs. However this won't update the live Supabase datebase.