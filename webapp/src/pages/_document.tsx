import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'
import { OsJs, OsJsPx } from '../components/onsitejs'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
        <OsJsPx />
        <OsJs />
      </body>
      <footer>
          <center>
            <a href="https://github.com/aaronsdevera/Personal-News-Feed">(haphazardly) designed by Aaron DeVera. GNU-AGPLv3</a>
          </center>
      </footer>
    </Html>
  )
}
