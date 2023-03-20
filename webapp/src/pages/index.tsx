import Head from 'next/head'
import Script from 'next/script'
import styles from '@/styles/Home.module.css'
import { AppProps } from 'next/app'

import { createClient } from "@supabase/supabase-js";

let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!; 
let supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

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
  let headlines_array: Object[] = []; //HeadlineEntry[] = [];
  let { data } = await supabase.from('headlines').select('*').order('created_at', { ascending: false }).limit(250);

  data?.forEach((entry: Object) => {
    headlines_array.push(entry);
  });

  return {
    props: {
      headlines_array
    },
  }
}

// export default function Home( { headlines_array }: { headlines_array: Object[]}) {
export default function Home( { headlines_array } ) {
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
            <h3><span id="insert-mode" className="site-mode">🌒</span></h3>
          </div>
          <div className="headerItem">
            <h3><span id="insert-tag" className="site-tag dark-mode-text dark-mode-background"><input id="site-tag-input" className="dark-mode-background" placeholder="insert a term to highlight"></input><span id="highlight-results" className="light-mode-text dark-mode-background"></span></span></h3>
          </div>
        </div>

        <div className="feed">
            <ul>
            {headlines_array.map((entry: HeadlineEntry) => (
                <li className="feed-item" key={entry.id}>
                  <a className="feed-item-headline light-mode-text" href={entry.url}>{entry.headline}</a>
                  <span className="feed-tag feed-item-sourcename">{entry.source_name}</span>
                  <span className="feed-tag feed-item-sourcetype">{entry.source_type}</span>
                  <span className="feed-tag feed-item-createdat light-mode-text">{entry.created_at}</span>
                </li>
            ))}
          </ul>
        </div>
      </main>
      <Script id="app_script">
        {`let MODE=0;document.getElementById("insert-time").innerHTML = new Date().toISOString();
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
          document.getElementById('insert-mode').addEventListener('click', (event) => {MODE = switchMode(MODE);});`}
      </Script>
    </>
  )
}
