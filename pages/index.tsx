import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Head>
        <title>Kreative ID</title>
        <meta
          name="description"
          content="First-class authentication for Kreative."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="pt-16">
        <h1 className="pt-12 pb-3 text-center text-2xl">
          Welcome to Kreative ID, friend.
        </h1>
        <div className="text-center">
          <Link href="/admin" className="text-md text-center text-indigo-500">
            Go to dashboard
          </Link>
        </div>
      </main>
    </>
  );
}
