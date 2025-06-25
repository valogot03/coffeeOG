import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="th">
      <Head>
        {/* Google Fonts: Prompt, Kanit */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Prompt:wght@400;700&family=Kanit:wght@400;700&display=swap"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
} 