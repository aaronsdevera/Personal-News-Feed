import Script from 'next/script'

export default function ClientScript() {
  return (
    <>
    <Script>
      {`document.addEventListener('DOMContentLoaded', alert('Hello, world!'))`}
    </Script>
    </>
  )
}
