import Head from 'next/head'
import Link from 'next/link'

export default function LoggedOut() {
  return (
    <>
      <Head>
        <title>Logged out | Kreative ID</title>
        <meta name="description" content="First-class authentication for Kreative." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className="text-center text-2xl pt-12 pb-3">You have been logged out.</h1>
        <div className="text-center">
          <Link href="/admin" className="text-center text-md text-indigo-500">Sign back into the dashboard</Link>
        </div>
      </main>
    </>
  )
}
