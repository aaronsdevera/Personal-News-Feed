import Head from 'next/head'
import Script from 'next/script'
import styles from '@/styles/Home.module.css'
import { AppProps } from 'next/app'
import { supabase } from './supabaseClient'

type HeadlineEntry = {
  id: string,
  created_at: string,
  headline: string,
  url: string,
  source_name: string,
  source_type: string,
  source_name_sha256: string,
  source_type_sha256: string,
  headline_sha256: string,
  url_sha256: string
}

export async function getServerSideProps() {
  let headlines_array: HeadlineEntry[] = [];
  let { data } = await supabase.from('headlines').select('*').order('created_at', { ascending: false }).limit(250);

  data?.forEach((entry: HeadlineEntry) => {
    headlines_array.push(entry);
  });
  return {
    props: {
     "headlines_array": headlines_array
    },
  }
}

export default function Home( { "headlines_array": headlines_array } ) {
  return (
    <>
      <Head>
        <title>Newsfeed | aaronsdevera.com</title>
        <meta name="description" content="Personal news feed curated from several sources." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      
      <main className={styles.main}>


        <div className="header">
          <div className="headerItem">
            <a href="https://github.com/aaronsdevera/Personal-News-Feed"><h3><span className="site-title">NewsFeed</span></h3></a>
          </div>
          <div className="headerItem">
            <h3><span id="insert-time" className="site-time"></span></h3>
          </div>
          <div className="headerItem">
            <h3><span id="insert-tag" className="site-tag"><input id="site-tag-input" placeholder="insert a term to highlight"></input><span id="highlight-results"></span></span></h3>
          </div>
        </div>

        <div className="feed">
            <ul>
            {headlines_array.map((entry: HeadlineEntry) => (
                <li className="feed-item" key={entry.id}>
                  <a className="feed-item-headline" href={entry.url}>{entry.headline}</a>
                  <span className="feed-tag feed-item-sourcename">{entry.source_name}</span>
                  <span className="feed-tag feed-item-sourcetype">{entry.source_type}</span>
                  <span className="feed-tag feed-item-createdat">{entry.created_at}</span>
                </li>
            ))}
          </ul>
        </div>
      </main>
      <Script id="app_script">
        {`document.getElementById("insert-time").innerHTML = new Date().toISOString();
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
          });`}
      </Script>
    </>
  )
}
