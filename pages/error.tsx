import Head from "next/head";
import Link from "next/link";

export default function AdminPage() {
  return (
    <>
      <Head>
        <title>Error | Kreative ID</title>
        <meta
          name="description"
          content="First-class authentication for Kreative."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className="pt-12 pb-3 text-center text-2xl">
          There has been an error while trying to authenticate you...
        </h1>
        <p className="text-lg text-gray-400 text-center pb-6">Check the URL parameters for error type</p>
        <div className="text-center pb-3">
          <Link href="/admin" className="text-lg text-center text-indigo-500">
            Try signing in again
          </Link>
        </div>
        <div className="text-center">
          <Link href="https://support.kreativeusa.com/id" className="text-md text-center text-indigo-400">
            Contact Kreative Support
          </Link>
        </div>
      </main>
    </>
  );
}
