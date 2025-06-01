import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
    render() {
        return (
            <Html lang="en">
                <Head>
                    <script
                        id="Cookiebot"
                        src="https://consent.cookiebot.com/uc.js"
                        data-cbid="cf921f71-d746-43c9-ad04-186c862d05ab"
                        type="text/javascript"
                        async
                    ></script>
                    <link rel="icon" href="/main-logo.svg" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
