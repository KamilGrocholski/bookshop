import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html>
            <Head>
                <meta property="og:site_name" content="Bookshop" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}
