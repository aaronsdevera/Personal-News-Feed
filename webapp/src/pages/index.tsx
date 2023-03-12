import Head from 'next/head'
import Image from 'next/image'
import Script from 'next/script'
import styles from '@/styles/Home.module.css'
//import Feed from './feed'
import { AppProps } from 'next/app'

import { createClient } from "@supabase/supabase-js";

let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!; 
let supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function getServerSideProps() {
  let { data } = await supabase.from('headlines').select('*').order('created_at', { ascending: false }).limit(250);
  return {
    props: {
     headlines: data
    },
  }
}

export default function Home( headlines: any ) {
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
            {headlines.map((entry: any) => (
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
