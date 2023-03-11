import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'
import ClientScript from './script.tsx'
export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
        <ClientScript />
      </body>
    </Html>
  )
}
