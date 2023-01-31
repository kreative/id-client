import Head from "next/head";

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
          You have been logged out.
        </h1>
        <div className="text-center">
          <Link href="/admin" className="text-md text-center text-indigo-500">
            Sign back into the dashboard
          </Link>
        </div>
      </main>
    </>
  );
}
