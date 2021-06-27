import type { DocumentContext, DocumentInitialProps } from 'next/document';
import Document, { Head, Html, Main, NextScript } from 'next/document';
class MyDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx);
    return initialProps;
  }
  render(): JSX.Element {
    return (
      <Html lang="ja">
        <Head>
          <meta
            name="google-site-verification"
            content="vvCJ4rz9xa35J4qeFbrTbagOQxcUdKxqNhKI_PMeogE"
          />
        </Head>
        <body className="duration-200 text-gray-800 dark:bg-blue-900 bg-blue-400">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
